import Product from "../models/product.js";
import Order from "../models/order.js";
import Profile from "../models/profile.js";
import User from "../models/user.js";
import Fsc_center from "../models/fsc_center.js";
export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const fscId = req.fsc._id;
  const { productId, orderType, quantity } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });
    const fsc = await Fsc_center.findOne({ owner: userId });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", data: product });
    }
    const productPrice = product.price; // this represent the current price at the point of buying or selling
    const totalPrice = productPrice * quantity;
    if (orderType === "buy") {
      if (fsc.wallet < totalPrice) {
        return res.status(402).json({ message: "Insufficient balance" });
      }
      fsc.wallet -= totalPrice;
      const newOrder = new Order({
        user: userId,
        product: productId,
        orderType,
        quantity,
        purchasePrice: productPrice,
        totalPrice,
        fsc: fscId,
      });
      const order = await newOrder.save();
      await fsc.save();
      res
        .status(201)
        .json({ message: "Buy Order placed successfully", data: order });
    } else if (orderType === "sell") {
      const userStoredProduct = await Order.findOne({
        user: userId,
        product: productId,
      });
      if (!userStoredProduct || userStoredProduct.quantity < quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient quantity for sell order" });
      }
      const newOrder = new Order({
        user: userId,
        product: productId,
        orderType,
        quantity,
        sellingPrice: productPrice,
        totalPrice,
        fsc: fscId,
      });
      const order = await newOrder.save();
      res
        .status(201)
        .json({ message: "Sell Order placed successfully", data: order });
    } else {
      return res.status(400).json({ message: "Invalid order type" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server error" });
  }
};

export const getUserOrder = async (req, res) => {
  const fscId = req.fsc._id;
  try {
    const orders = await Order.find({ fsc: fscId })
      .sort({ createdAt: -1 })
      .populate("product");
    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: "No Order placed yet", data: orders });
    }
    res.status(200).json({ message: "Your Orders", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", ["first_name", "last_name", "role"])
      .populate("product", "-quantity")
      .populate("fsc");
    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: "No Order placed yet", data: orders });
    }
    res.status(200).json({ message: "Your Orders", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server error" });
  }
};

export const changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found", data: order });
    }

    if (order.status !== "processing") {
      return res
        .status(400)
        .json({ error: true, message: "Order is already completed" });
    }

    const fsc = await Fsc_center.findOne({ manager: req.user.id });

    if (!fsc) {
      return res
        .status(404)
        .json({ message: "Credentials not found", data: fsc });
    }

    if (order.orderType !== "sell") {
      order.status = status;
      await order.save();
    } else {
      fsc.wallet += order.totalPrice;
      order.status = status;
      await Promise.all([fsc.save(), order.save()]);
    }

    res
      .status(200)
      .json({ message: "Order status updated to completed", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server error" });
  }
};
