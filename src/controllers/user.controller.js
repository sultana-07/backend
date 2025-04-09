import {asynchandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asynchandler(async (req,res) => {
    // get user details from frontend
    //validation -- not empty
    //check if user already exists : username ,email
    //check for image ,check for avatar
    // upload them to cloudinary ,avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res


    // validation
    const {fullName,email,username,password} = req.body

    if (
        [fullName,email,username,password].some((field) => field ?.trim() === "")
    ) {
        throw new ApiError(400,"all fields are required")
    }


    // checking that user already exist or not
   const existeduser =  User.findOne({
        $or : [{username}, {email}]
    })

    if (existeduser) {
        throw new ApiError(409, "user with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coveriamgeLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required")
    }

    // uploading on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coveriamgeLocalPath);

    if (!avatar) {
        throw new ApiError(400,"avatar file is required")
    }

    // create user object

   const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wronge while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

export {registerUser}