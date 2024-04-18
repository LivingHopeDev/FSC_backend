import Issue from "../models/issue.js";
import cloudinary from "../helper/cloudinary/cloudinary.js";
import { getImageId } from "../helper/getImageId.js";

export const createIssue = async (req, res) => {
  const userId = req.user.id;

  const { issue } = req.body;

  try {
    if (!issue) {
      return res.status(400).json({ message: "Field is empty!" });
    }
    let document = null;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "FSC/issue-evidence",
      });
      document = upload.secure_url;
    }
    const newIssue = new Issue({
      user: userId,
      issue,
      document,
    });

    const savedIssue = await newIssue.save();
    res.status(200).json({
      message: "Issues created successfully",
      data: savedIssue,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getAllIssue = async (req, res) => {
  try {
    const Issues = await Issue.find();

    res.status(200).json({ data: Issues });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const deleteIssue = async (req, res) => {
  const issueId = req.params.id;
  try {
    const issue = await Issue.findByIdAndDelete(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Not found", data: issue });
    }
    if (issue.document) {
      const imageId = getImageId(issue.document);
      await cloudinary.uploader.destroy(`FSC/issue-evidence/${imageId}`);
    }
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
