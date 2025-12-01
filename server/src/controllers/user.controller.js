import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    console.log("accesstoken: ", accessToken);
    console.log("refreshtoken: ", refreshToken);
    
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation Error", error);

    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(400, "something went wrong while creating user ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const {  email, password } = req.body;

  if ( email.trim() === "" || password.trim() === "") {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.findOne({
    $or: [ { email }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(
    user._id
  );
console.log("---------------------",accessToken);

console.log("---------------------",refreshToken);



  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  console.log("Accesss Token", accessToken);
  console.log("refresh Token", refreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async(req,res)=>{
  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"))
})