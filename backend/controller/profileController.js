import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";

/**
 * Desc : Fetching the logged in profile details
 * Method : GET
 * NOTE:
 */

export const getProfileDetails = asyncHandler(async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.User.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      res.status(404).json({
        message: "No profile for this user",
      });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

/**
 * Desc : Creating and updating the profile details
 * Method : POST
 * NOTE:
 */

export const createProfile = asyncHandler(async (req, res) => {
  // destructure the request
  const {
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    // spread the rest of the fields
    ...rest
  } = req.body;

  // build a profile
  const profileFields = {
    user: req.user.id,
    website:
      website && website !== "" ? normalize(website, { forceHttps: true }) : "",
    skills: Array.isArray(skills)
      ? skills
      : skills.split(",").map((skill) => " " + skill.trim()),
    ...rest,
  };

  // Build socialFields object
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalize(value, { forceHttps: true });
  }
  // add to profileFields
  profileFields.social = socialFields;

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});
