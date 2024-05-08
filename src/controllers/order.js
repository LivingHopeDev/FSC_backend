import Product from "../models/product.js";
import Order from "../models/order.js";
import Profile from "../models/profile.js";
export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { productId, orderType, quantity } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });
    const userProfile = await Profile.findOne({ user: userId });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", data: product });
    }
    const productPrice = product.price;
    const totalPrice = productPrice * quantity;

    if (userProfile.wallet < totalPrice) {
      return res.status(402).json({ message: "Insufficient balance" });
    }
    userProfile.wallet -= totalPrice;
    const newOrder = new Order({
      user: userId,
      product: productId,
      orderType,
      quantity,
      totalPrice,
    });
    const order = await newOrder.save();
    await userProfile.save();
    res.status(201).json({ message: "Order placed successfully", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server error" });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
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
