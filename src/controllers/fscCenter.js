import FscCenter from "../models/fsc_center.js";
import profile from "../models/profile.js";
import User from "../models/user.js";
export const createFsc = async (req, res) => {
  const { locationId } = req.body;
  const owner_id = req.user.id;
  try {
    const newFSC = new FscCenter({
      owner: owner_id,
      fsc_location: locationId,
    });

    const fsc = await newFSC.save();
    res.status(201).json({ message: "FSC location chosen", data: fsc });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, data: "Internal server error" });
  }
};
export const getFSCByowner = async (req, res) => {
  try {
    const fsc = await FscCenter.find({ owner: req.user.id })
      .populate("owner", ["first_name", "last_name"])
      .populate("fsc_location")
      .populate("manager", ["first_name", "last_name", "role", "email"]);
    const manager = await profile.findOne({ user: fsc[0].manager });
    if (fsc.length === 0) {
      return res.status(200).json({ message: "No FSC center yet!", data: fsc });
    }
    const fscWithManager = fsc.map((item) => {
      const fscManager = item.manager.toObject();
      const mergedManager = { ...fscManager, ...manager.toObject() };
      return { ...item.toObject(), manager: mergedManager };
    });
    res.status(200).json({ data: fscWithManager });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, data: "Internal server error" });
  }
};

export const getAllFSC = async (req, res) => {
  try {
    const fsc = await FscCenter.find()
      .populate("owner", ["first_name", "last_name"])
      .populate("fsc_location")
      .populate("manager", ["first_name", "last_name", "role", "email"]);
    if (fsc.length === 0) {
      return res.status(200).json({ message: "No FSC center yet!", data: fsc });
    }
    res.status(200).json({ data: fsc });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, data: "Internal server error" });
  }
};

export const hireManager = async (req, res) => {
  const owner_id = req.user.id;
  const manager_id = req.params.id;
  try {
    const fsc = await FscCenter.findOne({ owner: owner_id });
    const existinguser = await User.findById(manager_id);
    if (!existinguser.isManager) {
      return res
        .status(200)
        .json({ message: "Selected User is not a Manager!" });
    }
    if (existinguser.status === "hired") {
      return res.status(200).json({ message: "Manger not available" });
    }

    if (fsc === null) {
      return res
        .status(200)
        .json({ message: "You don't have an FSC yet!", data: fsc });
    }
    if (fsc.manager !== undefined) {
      return res.status(200).json({ message: "You already have a Manager!" });
    }
    await FscCenter.updateOne({ owner: owner_id }, { manager: manager_id });
    await User.updateOne({ _id: manager_id }, { status: "hired" });
    res
      .status(200)
      .json({ message: `${existinguser.first_name} hired as a Manager` });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, data: "Internal server error" });
  }
};

export const hireAgent = async (req, res) => {
  const manager_id = req.user.id;
  const agent_id = req.params.id;
  try {
    const fsc = await FscCenter.findOne({ manager: manager_id });
    const existinguser = await User.findById(agent_id);
    if (!existinguser.isAgent) {
      return res
        .status(200)
        .json({ message: "Selected User is not an Agent!" });
    }
    if (existinguser.status === "hired") {
      return res.status(200).json({ message: "Agent not available" });
    }
    if (fsc === null) {
      return res
        .status(200)
        .json({ message: "You are not a hired manager yet!", data: fsc });
    }
    await FscCenter.updateOne(
      { manager: manager_id },
      { $push: { agent: agent_id } }
    );
    await User.updateOne({ _id: agent_id }, { status: "hired" });
    res
      .status(200)
      .json({ message: `${existinguser.first_name} hired as an Agent` });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, data: "Internal server error" });
  }
};
