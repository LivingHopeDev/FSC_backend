import Location from "../models/mapped_location.js";
export const createLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res
      .status(201)
      .json({ message: "Location created succesfully", data: newLocation });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getAllLocation = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    if (locations.length === 0) {
      return res
        .status(200)
        .json({ message: "No location listed yet!", data: locations });
    }
    res.status(200).json({ message: "Available locations", data: locations });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Not found!", data: location });
    }
    res.status(200).json({ message: " Location deleted", data: location });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const updateLocation = async (req, res) => {
  const { country, state, address, local_government } = req.body;

  try {
    const data = {
      country,
      state,
      address,
      local_government,
    };
    const location = await Location.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!location) {
      return res.status(404).json({ message: "Not found!", data: location });
    }
    res.status(200).json({ message: " Location updated", data: location });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
