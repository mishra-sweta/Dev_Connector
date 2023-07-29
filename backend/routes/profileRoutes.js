import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProfile,
  getProfileDetails,
} from "../controller/profileController.js";

const Router = express.Router();

Router.route("/me").get(protect, getProfileDetails);
Router.route("/").post(protect, createProfile);

export default Router;
