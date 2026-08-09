const Order = require("../models/Order");
const Product = require("../models/Product");
const { notifyNewOrder } = require("../utils/notifications");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (works for guests and logged-in users)
const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    // Re-fetch products server-side so prices/stock can't be tampered with from the client
    let totalPrice = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;

      // decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      products: orderItems,
      totalPrice,
      shippingAddress,
    });

    // Send the customer invoice + admin email + admin WhatsApp alert.
    // notifyNewOrder() never throws (every channel is independently caught
    // inside it), so a failed email/WhatsApp send can NEVER fail the order
    // itself - the customer's order is already saved in MongoDB at this point.
    // We await it here (rather than firing-and-forgetting) because on
    // serverless platforms like Vercel, background work can be killed the
    // moment the response is sent - awaiting guarantees delivery is attempted.
    await notifyNewOrder(order);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders (admin: all orders, user: own orders)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (req.user.role !== "admin" && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById };
