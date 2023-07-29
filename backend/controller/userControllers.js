import asyncHandler from "express-async-handler";
import gravatar from "gravatar";
import User from "../models/userModel.js";
import generateToken from "../utils/generateTokens.js";

/**
 * Desc : Adding new user
 * Method : POST
 * NOTE:
 */

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(400).json({
        message: "User already exists",
      });
    }

    const avatar = gravatar.url(req.body.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      avatar: avatar,
    });
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

/**
 * Desc : Login user
 * Method : POST
 * NOTE:
 */

export const login = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(404).json({
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

/**
 * Desc : Fetching user details
 * Method : GET
 * NOTE:
 */

export const getUserDetails = asyncHandler(async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        message: "No user with that username",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// /**
//  * Desc : Updating profile details
//  * Method : PUT
//  * NOTE:
//  */

// export const updateProfile = asyncHandler(async (req, res) => {
//   try {
//     const { username, _id } = req.user;
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.status(404).json({
//         message: "No user with that username ",
//       });
//     }
//     const updatedUser = {
//       email: req.body.email,
//       bio: req.body.bio,
//       image: req.body.image,
//     };
//     const response = await User.findByIdAndUpdate(_id, updatedUser, {
//       new: true,
//     });
//     res.status(200).json({
//       message: "Updated Successfully.",
//       data: response,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong",
//     });
//   }
// });
