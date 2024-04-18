import Product from "../models/product.js";
import { getImageId } from "../helper/getImageId.js";
import cloudinary from "../helper/cloudinary/cloudinary.js";

export const createProduct = async (req, res) => {
  const { name, price, description, quantity } = req.body;
  try {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "FSC/product",
    });
    const newProduct = new Product({
      name,
      price,
      image: upload.secure_url,
      description,
      quantity,
    });
    const savedProduct = await newProduct.save();
    res.status(200).json({
      message: "Product saved",
      product: savedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id });
    if (product === null) {
      res.status(200).json({ message: "Out of stock", data: product });
    } else {
      res.status(200).json({ data: product });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No product listed yet!", products: [] });
    }

    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price, description, quantity } = req.body;
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    // Update the product details
    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.description = description;
    existingProduct.quantity = quantity;

    // If a new image is provided, upload and update the image URL
    if (req.file) {
      const imageId = getImageId(existingProduct.image);
      await cloudinary.uploader.destroy(`FSC/product/${imageId}`);
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "FSC/product",
      });
      existingProduct.image = upload.secure_url;
    }

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      message: "Product updated",
      product: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    const imageURL = deletedProduct.image;
    const imageId = getImageId(imageURL);
    if (deletedProduct) {
      await cloudinary.uploader.destroy(`FSC/product/${imageId}`);
      res.status(200).json({ message: "Product successfully deleted" });
    } else {
      res
        .status(404)
        .json({ message: "Product not found", data: deletedProduct });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
};
