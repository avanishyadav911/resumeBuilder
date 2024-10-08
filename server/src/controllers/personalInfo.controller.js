import { PersonalInfo } from "../models/personalInfo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const postPersonalInfo = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    city,
    province,
    phone,
    email,
    linkedin,
    github,
    codechef,
    codeforces,
    leetcode,
    atcoder,
  } = req.body;

  if (
    [firstname, lastname, city, province, email].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(401, "personal info cannot be empty");
  }
  if (phone && phone.length < 10) {
    throw new ApiError(401, "Phone number cannot be less then 10 digits");
  }

  const linkedinRegex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+$/;
  if (linkedin && !linkedinRegex.test(linkedin)) {
    throw new ApiError(401, "Invalid LinkedIn URL");
  }

  const codechefRegex = /^https:\/\/www\.codechef\.com\/users\/[a-zA-Z0-9_-]+$/;
  if (codechef && !codechefRegex.test(codechef)) {
    throw new ApiError(401, "Invalid Code Chef URL");
  }

  const codeforcesRegex = /^https:\/\/codeforces\.com\/profile\/[a-zA-Z0-9_]+$/;
  if (codeforces && !codeforcesRegex.test(codeforces)) {
    throw new ApiError(401, "Invalid Codeforces URL");
  }

  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/;
  if (github && !githubRegex.test(github)) {
    throw new ApiError(401, "Invalid Github URL");
  }

  const leetcodeRegex = /^https:\/\/leetcode\.com\/[a-zA-Z0-9_-]+$/;
  if (leetcode && !leetcodeRegex.test(leetcode)) {
    throw new ApiError(401, "Invalid Leetcode URL");
  }

  const atcoderRegex = /^https:\/\/atcoder\.jp\/users\/[a-zA-Z0-9_]+$/;
  if (atcoder && !atcoderRegex.test(atcoder)) {
    throw new ApiError(401, "Invalid Leetcode URL");
  }

  let photo = null;
  const photoPath = req.files?.photo?.[0]?.path;

  // Upload photo to Cloudinary if provided
  if (photoPath) {
    photo = await uploadOnCloudinary(photoPath);
  }

  const personalInfo = await PersonalInfo.create({
    firstname,
    lastname,
    city,
    province,
    phone,
    email,
    github: null || github,
    linkedin: null || linkedin,
    codechef: null || codechef,
    codeforces: null || codeforces,
    leetcode: null || leetcode,
    atcoder: null || atcoder,
    photo: photo, // Include photo URL if uploaded
  });

  const info = await PersonalInfo.findById(personalInfo._id);

  if (!info) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user personall information"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponce(200, info, "Personal Information fetched successfully")
    );
});

// Get All Personal Infos
const getPersonalInfos = asyncHandler(async (req, res) => {
  const personalInfos = await PersonalInfo.find().populate("owner");
  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        personalInfos,
        "Personal Information fetched successfully"
      )
    );
});

// Get Personal Info By ID
const getPersonalInfoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const personalInfo = await PersonalInfo.findById(id).populate("owner");

  if (!personalInfo) {
    throw new ApiError(404, "Personal Information not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        personalInfo,
        "Personal Information fetched successfully"
      )
    );
});

// Update Personal Info
const updatePersonalInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    city,
    province,
    phone,
    email,
    linkedin,
    github,
    codechef,
    codeforces,
    leetcode,
    atcoder,
  } = req.body;

  if (
    [firstname, lastname, city, province, email].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(401, "Personal info cannot be empty");
  }
  if (phone && phone.length < 10) {
    throw new ApiError(401, "Phone number cannot be less than 10 digits");
  }

  const linkedinRegex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+$/;
  if (linkedin && !linkedinRegex.test(linkedin)) {
    throw new ApiError(401, "Invalid LinkedIn URL");
  }

  const codechefRegex = /^https:\/\/www\.codechef\.com\/users\/[a-zA-Z0-9_-]+$/;
  if (codechef && !codechefRegex.test(codechef)) {
    throw new ApiError(401, "Invalid CodeChef URL");
  }

  const codeforcesRegex = /^https:\/\/codeforces\.com\/profile\/[a-zA-Z0-9_]+$/;
  if (codeforces && !codeforcesRegex.test(codeforces)) {
    throw new ApiError(401, "Invalid Codeforces URL");
  }

  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/;
  if (github && !githubRegex.test(github)) {
    throw new ApiError(401, "Invalid Github URL");
  }

  const leetcodeRegex = /^https:\/\/leetcode\.com\/[a-zA-Z0-9_-]+$/;
  if (leetcode && !leetcodeRegex.test(leetcode)) {
    throw new ApiError(401, "Invalid Leetcode URL");
  }

  const atcoderRegex = /^https:\/\/atcoder\.jp\/users\/[a-zA-Z0-9_]+$/;
  if (atcoder && !atcoderRegex.test(atcoder)) {
    throw new ApiError(401, "Invalid Atcoder URL");
  }

  let photo = req.body.photo;
  const photoPath = req.files?.photo?.[0]?.path;

  // Upload new photo to Cloudinary if provided
  if (photoPath) {
    photo = await uploadOnCloudinary(photoPath);
  }

  const updatedPersonalInfo = await PersonalInfo.findByIdAndUpdate(
    id,
    {
      firstname,
      lastname,
      city,
      province,
      phone,
      email,
      github: github || null,
      linkedin: linkedin || null,
      codechef: codechef || null,
      codeforces: codeforces || null,
      leetcode: leetcode || null,
      atcoder: atcoder || null,
      photo: photo, // Include photo URL if uploaded
    },
    { new: true }
  );

  if (!updatedPersonalInfo) {
    throw new ApiError(404, "Personal Information not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        updatedPersonalInfo,
        "Personal Information updated successfully"
      )
    );
});

// Delete Personal Info
const deletePersonalInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedPersonalInfo = await PersonalInfo.findByIdAndDelete(id);

  if (!deletedPersonalInfo) {
    throw new ApiError(404, "Personal Information not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        deletedPersonalInfo,
        "Personal Information deleted successfully"
      )
    );
});

export {
  postPersonalInfo,
  getPersonalInfos,
  getPersonalInfoById,
  updatePersonalInfo,
  deletePersonalInfo,
};
