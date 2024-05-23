import Product from "../models/product.js";
import Order from "../models/order.js";
import Fsc_center from "../models/fsc_center.js";
import FscStore from "../models/fscStore.js";

export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const fsc = req.fsc;
  const fscId = req.fsc._id;
  const { productId, orderType, quantity } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", data: product });
    }

    const productPrice = product.price;

    let parsedQuantity;
    try {
      parsedQuantity = parseInt(quantity);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid quantity format", error: error.message });
    }

    const totalPrice = productPrice * parsedQuantity;
    if (orderType === "sell") {
      const fscStore = await FscStore.findOne({
        fsc: fscId,
        product: productId,
      });
      if (!fscStore) {
        return res.status(404).json({ message: "Product not in Storage!" });
      }
      if (fscStore.quantity < parsedQuantity) {
        return res.status(400).json({
          message: "Order can't be processed:Insufficient quantity",
        });
      }
    }

    if (orderType === "buy" && fsc.wallet < totalPrice) {
      return res
        .status(400)
        .json({ message: "Insufficient funds in FSC wallet" });
    }

    fsc.wallet -= orderType === "buy" ? parseInt(totalPrice) : 0;
    await fsc.save();
    const newOrder = new Order({
      user: userId,
      fsc: fscId,
      product: productId,
      orderType,
      quantity: parsedQuantity,
      purchasePrice: orderType === "buy" ? productPrice : 0,
      sellingPrice: orderType === "sell" ? productPrice : 0,
      totalPrice,
    });

    const savedOrder = await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", data: savedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server error" });
  }
};
export const cancelOrder = async (req, res) => {
  const fscId = req.fsc._id;
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    if (status !== "cancel") {
      return res.status(200).json({ message: "Parameter not allowed" });
    }
    const order = await Order.findOne({ _id: orderId, fsc: fscId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const productId = order.product;
    const quantity = order.quantity;
    const orderType = order.orderType;

    if (orderType === "buy") {
      const fsc = await Fsc_center.findOne({ _id: fscId });

      fsc.wallet += order.totalPrice;
      order.status = status;
      await Promise.all([order.save(), fsc.save()]);
    } else {
      order.status = status;
      await order.save();
    }

    return res.status(200).json({ message: "Order cancelled successfully" });
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
  const orderId = req.params.id;
  const userId = req.user.id;
  const fsc = req.fsc;
  const fscId = req.fsc._id;
  const { status } = req.body;
  try {
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found", data: order });
    }

    if (order.status !== "processing") {
      return res.status(200).json({ message: "Order is already completed" });
    }
    if (order.status === status) {
      return res
        .status(200)
        .json({ message: "Order is been processed already" });
    }

    const fsc = await Fsc_center.findOne({ manager: req.user.id });

    if (!fsc) {
      return res
        .status(404)
        .json({ message: "Credentials not found", data: fsc });
    }
    const parsedQuantity = parseInt(order.quantity);
    const productId = order.product;

    const fscStore = await FscStore.findOne({
      fsc: fscId,
      product: productId,
    });
    if (!fscStore) {
      const newFscStore = new FscStore({
        fsc: fscId,
        product: productId,
        quantity: order.orderType === "buy" ? parsedQuantity : 0,
      });
      order.status = status;
      await Promise.all([newFscStore.save(), order.save()]);
    } else {
      fscStore.quantity =
        order.orderType === "buy"
          ? parseInt(fscStore.quantity) + parsedQuantity
          : parseInt(fscStore.quantity) - parsedQuantity;
      fsc.wallet += order.orderType === "buy" ? 0 : parseInt(order.totalPrice);
      order.status = status;
      await Promise.all([fsc.save(), await fscStore.save(), order.save()]);
      if (fscStore.quantity === 0) {
        await FscStore.deleteOne({ _id: fscStore._id });
      }
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

export const getFscStoresByFsc = async (req, res) => {
  const fscId = req.fsc._id;

  try {
    const storedPoducts = await FscStore.find({ fsc: fscId })
      .populate("product")
      .populate("fsc")
      .sort({ createdAt: -1 });
    if (storedPoducts.length === 0) {
      return res.status(200).json({
        message: "Not stored product!",
        data: storedPoducts,
      });
    }

    return res.status(200).json({
      message: "storedPoducts retrieved successfully",
      data: storedPoducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internl Server error" });
  }
};
