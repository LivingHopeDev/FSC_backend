import Farmer from "../models/farmer.js";

export const createfarmer = async (req, res) => {
  const managerId = req.user.id;
  const { firstName, lastName, email, phoneNumber, gender, farmLocation } =
    req.body;

  try {
    const newFarmer = new Farmer({
      manager: managerId,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      farmLocation,
    });
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: "Email already exists" });
    }
    await newFarmer.save();
    res
      .status(201)
      .json({ message: "Farmer's details saved", data: newFarmer });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
// THIS CONTROLLER WILL ALLOW THE MANAGER TO SEE ONLY THE FAMERS REGISTERD BY THEM
export const getFarmersByManager = async (req, res) => {
  const managerId = req.user.id;
  try {
    const farmers = await Farmer.find({ manager: managerId }).populate();
    if (farmers.length === 0) {
      return res
        .status(200)
        .json({ message: "No farmer has been added!", data: farmers });
    }
    res.status(200).json({ message: "List of Farmers", data: farmers });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
// THE ADMIN CAN ACCESS ALL THE REGISTERD FARMERS
export const getAllFarmer = async (req, res) => {
  try {
    const farmers = await Farmer.find().populate();
    if (farmers.length === 0) {
      return res
        .status(200)
        .json({ message: "No farmer has been added!", data: farmers });
    }
    res.status(200).json({
      message: "List of Farmers",
      data: farmers,
      count: farmers.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

export const updateFarmer = async (req, res) => {
  const farmerId = req.params.id;
  const { firstName, lastName, email, phoneNumber, gender, farmLocation } =
    req.body;
  try {
    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      farmLocation,
    };
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      { _id: farmerId },
      data,
      { new: true }
    );
    if (updatedFarmer === null) {
      return res
        .status(404)
        .json({ message: "Farmer not found", data: updatedFarmer });
    }
    res
      .status(200)
      .json({ message: "Updated successfully", data: updatedFarmer });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

export const deleteFarmer = async (req, res) => {
  const farmerId = req.params.id;

  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(farmerId);
    if (deletedFarmer === null) {
      return res
        .status(404)
        .json({ message: "Farmer not found", data: deletedFarmer });
    }
    res
      .status(200)
      .json({ message: "Deleted successfully", data: deletedFarmer });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
