import FsCenter from "../models/fsc_center.js";
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
export const makeOrRevokeManagerOrAgent = async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found", data: existingUser });
    }
    await User.updateOne(
      { _id: userId },
      existingUser.role === "agent"
        ? { isAgent: !existingUser.isAgent }
        : existingUser.role === "manager"
        ? { isManager: !existingUser.isManager }
        : { isOwner: !existingUser.isOwner }
    );
    res.status(200).json({ message: "User role confirmed!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
export const getWorkersInaFSC = async (req, res) => {
  const ownerOrManager_id = req.user.id;
  try {
    const fsc = await FsCenter.findOne({
      $or: [{ manager: ownerOrManager_id }, { owner: ownerOrManager_id }],
    })
      .populate("manager", "first_name last_name role email")
      .populate("agent", "first_name last_name role email");
    if (!fsc) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    if (fsc.owner.equals(ownerOrManager_id)) {
      // User is the owner, display manager and agents
      const managerWithAgents = { manager: fsc.manager, agents: fsc.agent };
      return res.status(200).json({
        message: "List of the manager and the agents working for a FSC owner",
        data: managerWithAgents,
      });
    } else if (fsc.manager.equals(ownerOrManager_id)) {
      // User is the manager, display agents only
      return res.status(200).json({
        message: "List of agents working for a FSC manager",
        data: fsc.agent,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};
