import User from "../models/user.js";

export const getAllManager = async (req, res) => {
  try {
    const manager = await User.find({ isManager: true }).select(
      "-password -isAdmin -isOwner -isAgent"
    );
    if (manager.length === 0) {
      return res
        .status(200)
        .json({ message: "No verified Managers yet", data: manager });
    }
    res.status(200).json({ data: manager });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

export const getAllAgent = async (req, res) => {
  try {
    const agent = await User.find({ isAgent: true }).select(
      "-password -isAdmin -isOwner -isManager"
    );
    if (agent.length === 0) {
      return res
        .status(200)
        .json({ message: "No verified agents yet", data: agent });
    }
    res.status(200).json({ data: agent });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

// TO MAKE A USER AN AGENT OR MANAGER AFTER THEY ARE VETTED.
