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

// ---------- WhatsApp alert to the ADMIN ----------
// Supports two providers - whichever is configured gets used:
//  1) CallMeBot: simplest option, free, no business account needed
//  2) Twilio: more "official" option, needs a Twilio account + sandbox join
const buildWhatsAppMessage = (order) => {
  const itemsText = order.products
    .map((item) => `- ${item.name} x${item.quantity} = ${currency(item.price * item.quantity)}`)
    .join("\n");

  return (
    `New Veloura order!\n\n` +
    `Order #${order._id}\n` +
    `${itemsText}\n\n` +
    `Total: ${currency(order.totalPrice)} (Cash on Delivery)\n\n` +
    `Customer: ${order.shippingAddress.fullName}\n` +
    `Phone: ${order.shippingAddress.phone}\n` +
    `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}`
  );
};

// Option 1: CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/)
// Free, no business account, just a one-time WhatsApp opt-in message to get an API key.
const sendViaCallMeBot = async (order) => {
  const { CALLMEBOT_PHONE, CALLMEBOT_API_KEY } = process.env;
  if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) return false;

  const phone = encodeURIComponent(CALLMEBOT_PHONE); // expects international format, e.g. +201554372442
  const text = encodeURIComponent(buildWhatsAppMessage(order));
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${CALLMEBOT_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CallMeBot request failed with status ${response.status}`);
  }
  return true;
};

// Option 2: Twilio WhatsApp Sandbox/API
const sendViaTwilio = async (order) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, ADMIN_WHATSAPP_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !ADMIN_WHATSAPP_NUMBER) return false;

  const twilio = require("twilio");
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  await client.messages.create({
    from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${ADMIN_WHATSAPP_NUMBER}`,
    body: buildWhatsAppMessage(order),
  });
  return true;
};

const sendAdminWhatsAppMessage = async (order) => {
  try {
    if (await sendViaCallMeBot(order)) return;
  } catch (error) {
    console.error("Failed to send WhatsApp via CallMeBot:", error.message);
  }

  try {
    if (await sendViaTwilio(order)) return;
  } catch (error) {
    console.error("Failed to send WhatsApp via Twilio:", error.message);
  }

  console.warn("No WhatsApp provider configured (CallMeBot or Twilio) - skipping WhatsApp notification.");
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
