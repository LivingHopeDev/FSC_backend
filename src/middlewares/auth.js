import jwt from "jsonwebtoken";
import User from "../models/user.js";
import FscCenter from "../models/fsc_center.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ error: true, message: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];
  if (token) {
    // decodedToken will return the user payload in this case userId
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // redirect to the login page
        res.status(403).json({ error: true, message: "Invalid token" });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ error: true, message: "You are not authenticated" });
  }
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    User.findOne({ _id: req.user.id })
      .then((data) => {
        if (data.isAdmin) {
          next();
        } else {
          res
            .status(403)
            .json({ error: true, message: "You are not authorized!" });
        }
      })
      .catch((error) => {
        res
          .status(403)
          .json({ error: true, message: "You are not authorized!" });
      });
  });
};

export const verifyTokenAndManager = (req, res, next) => {
  verifyToken(req, res, () => {
    User.findOne({ _id: req.user.id })
      .then((data) => {
        if (data.isManager) {
          next();
        } else {
          res
            .status(403)
            .json({ error: true, message: "You are not authorized!" });
        }
      })
      .catch((error) => {
        res
          .status(403)
          .json({ error: true, message: "You are not authorized!" });
      });
  });
};

export const verifyTokenAndOwner = (req, res, next) => {
  verifyToken(req, res, () => {
    User.findOne({ _id: req.user.id })
      .then((data) => {
        if (data.isOwner) {
          next();
        } else {
          res.status(403).json({
            error: true,
            message: "You are not authorized! Must be an Owner",
          });
        }
      })
      .catch((error) => {
        res
          .status(403)
          .json({ error: true, message: "You are not authorized!" });
      });
  });
};
export const verifyTokenAndAgent = (req, res, next) => {
  verifyToken(req, res, () => {
    User.findOne({ _id: req.user.id })
      .then((data) => {
        if (data.isAgent) {
          next();
        } else {
          res
            .status(403)
            .json({ error: true, message: "You are not authorized!" });
        }
      })
      .catch((error) => {
        res
          .status(403)
          .json({ error: true, message: "You are not authorized!" });
      });
  });
};
export const verifyManagerAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    User.findOne({ _id: req.user.id })
      .then((data) => {
        if (data.isAdmin) {
          next();
        } else if (data.isManager) {
          next();
        } else {
          res
            .status(403)
            .json({ error: true, message: "You are not authorized!" });
        }
      })
      .catch((error) => {
        res
          .status(403)
          .json({ error: true, message: "You are not authorized!" });
      });
  });
};
export const getUserFSC = (req, res, next) => {
  verifyToken(req, res, async () => {
    const userId = req.user.id;
    const userFsc = await FscCenter.findOne({
      $or: [
        { manager: userId },
        {
          owner: userId,
        },
      ],
    });
    if (!userFsc) {
      return res.status(400).json({ message: "You does not belong to an FSC" });
    }
    req.fsc = userFsc;
    next();
  });
};
