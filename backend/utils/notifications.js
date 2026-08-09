const nodemailer = require("nodemailer");

// ---------- EMAIL SETUP ----------
// Uses Gmail SMTP with an "App Password" (not your normal Gmail password).
// See README for how to generate one. If EMAIL_USER/EMAIL_PASS are not set,
// email sending is silently skipped so it never blocks checkout.
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const currency = (n) => `$${Number(n).toFixed(2)}`;

const buildOrderItemsHtml = (products) =>
  products
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${currency(item.price)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${currency(
          item.price * item.quantity
        )}</td>
      </tr>`
    )
    .join("");

// ---------- Invoice email sent to the CUSTOMER ----------
const sendCustomerInvoiceEmail = async (order) => {
  if (!transporter) {
    console.warn("Email not configured (EMAIL_USER/EMAIL_PASS missing) - skipping customer invoice email.");
    return;
  }
  try {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2b1f24;">
        <h2 style="color:#8b4a5c;">Veloura</h2>
        <p>Hi ${order.shippingAddress.fullName},</p>
        <p>Thank you for your order! Here is your invoice. Payment is <strong>Cash on Delivery</strong>.</p>
        <p style="color:#7a6a6f;font-size:14px;">Order #${order._id}</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="border-bottom:2px solid #8b4a5c;">
              <th style="text-align:left;padding:8px 0;">Product</th>
              <th style="text-align:center;padding:8px 0;">Qty</th>
              <th style="text-align:right;padding:8px 0;">Price</th>
              <th style="text-align:right;padding:8px 0;">Total</th>
            </tr>
          </thead>
          <tbody>${buildOrderItemsHtml(order.products)}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:bold;color:#8b4a5c;">
          Total: ${currency(order.totalPrice)}
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p><strong>Shipping to:</strong><br/>
        ${order.shippingAddress.address}, ${order.shippingAddress.city}<br/>
        Phone: ${order.shippingAddress.phone}</p>
        <p style="color:#7a6a6f;font-size:13px;margin-top:30px;">
          If you have any questions about your order, just reply to this email.
        </p>
      </div>`;

    await transporter.sendMail({
      from: `"Veloura" <${process.env.EMAIL_USER}>`,
      to: order.shippingAddress.email,
      subject: `Your Veloura order confirmation #${order._id}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send customer invoice email:", error.message);
  }
};

// ---------- Order alert email sent to the ADMIN ----------
const sendAdminOrderEmail = async (order) => {
  if (!transporter) {
    console.warn("Email not configured (EMAIL_USER/EMAIL_PASS missing) - skipping admin order email.");
    return;
  }
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_NOTIFICATION_EMAIL not set - skipping admin order email.");
    return;
  }
  try {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2b1f24;">
        <h2 style="color:#8b4a5c;">New order received - Veloura</h2>
        <p><strong>Order #${order._id}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="border-bottom:2px solid #8b4a5c;">
              <th style="text-align:left;padding:8px 0;">Product</th>
              <th style="text-align:center;padding:8px 0;">Qty</th>
              <th style="text-align:right;padding:8px 0;">Price</th>
              <th style="text-align:right;padding:8px 0;">Total</th>
            </tr>
          </thead>
          <tbody>${buildOrderItemsHtml(order.products)}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:bold;color:#8b4a5c;">
          Total: ${currency(order.totalPrice)} (Cash on Delivery)
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p><strong>Customer:</strong> ${order.shippingAddress.fullName}<br/>
        <strong>Email:</strong> ${order.shippingAddress.email}<br/>
        <strong>Phone:</strong> ${order.shippingAddress.phone}<br/>
        <strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
      </div>`;

    await transporter.sendMail({
      from: `"Veloura Orders" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New order #${order._id} - ${currency(order.totalPrice)} (COD)`,
      html,
    });
  } catch (error) {
    console.error("Failed to send admin order email:", error.message);
  }
};

// ---------- WhatsApp alert to the ADMIN, via Meta's official WhatsApp Cloud API ----------
// Unlike CallMeBot/Green API, this talks directly to Meta's servers - it does
// NOT depend on any phone staying logged into a WhatsApp Web-style session,
// so it can never "disconnect" the way session-based integrations can.
// Requires a one-time setup in Meta's dashboard: a WhatsApp Business phone
// number, a permanent access token, and an APPROVED message template (Meta
// requires all business-initiated messages to use a pre-approved template).
// See README section 10.2 for the full setup walkthrough.
//
// The approved template is expected to have this exact body (create it with
// this text, category "Utility", in WhatsApp Manager -> Message Templates):
//
//   New Veloura order!
//
//   Order #{{1}}
//   Items: {{2}}
//   Total: {{3}} (Cash on Delivery)
//
//   Customer: {{4}}
//   Phone: {{5}}
//   Address: {{6}}
//
const buildWhatsAppTemplateParams = (order) => {
  const itemsSummary = order.products.map((item) => `${item.name} x${item.quantity}`).join(", ");

  return [
    { type: "text", text: String(order._id) },
    { type: "text", text: itemsSummary },
    { type: "text", text: currency(order.totalPrice) },
    { type: "text", text: order.shippingAddress.fullName },
    { type: "text", text: order.shippingAddress.phone },
    { type: "text", text: `${order.shippingAddress.address}, ${order.shippingAddress.city}` },
  ];
};

const sendAdminWhatsAppMessage = async (order) => {
  const {
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_ADMIN_PHONE,
    WHATSAPP_TEMPLATE_NAME,
    WHATSAPP_TEMPLATE_LANG,
  } = process.env;

  if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN || !WHATSAPP_ADMIN_PHONE) {
    console.warn(
      "WhatsApp Cloud API not configured (WHATSAPP_PHONE_NUMBER_ID/WHATSAPP_ACCESS_TOKEN/WHATSAPP_ADMIN_PHONE missing) - skipping WhatsApp notification."
    );
    return;
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: WHATSAPP_ADMIN_PHONE, // international format, digits only, no "+"
        type: "template",
        template: {
          name: WHATSAPP_TEMPLATE_NAME || "order_notification",
          language: { code: WHATSAPP_TEMPLATE_LANG || "en_US" },
          components: [{ type: "body", parameters: buildWhatsAppTemplateParams(order) }],
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`WhatsApp Cloud API request failed with status ${response.status}: ${body}`);
    }
  } catch (error) {
    console.error("Failed to send admin WhatsApp message via WhatsApp Cloud API:", error.message);
  }
};

// Fires all notifications for a newly created order. Every notification is
// independently wrapped in try/catch (above), and this function itself never
// throws, so a notification failure can NEVER break the checkout flow.
const notifyNewOrder = async (order) => {
  await Promise.allSettled([
    sendCustomerInvoiceEmail(order),
    sendAdminOrderEmail(order),
    sendAdminWhatsAppMessage(order),
  ]);
};

module.exports = { notifyNewOrder };
