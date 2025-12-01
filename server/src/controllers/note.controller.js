import { Notes } from "../models/Note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (title.trim() === "" || content.trim() === "") {
    throw new ApiError(400, "Title and content is required");
  }

  const note = await Notes.create({
    user: req.user._id,
    title,
    content,
    tags,
  });

  return res.status(201).json(
    new ApiResponse(201, note, "Notes created successfully"),
  );
});


export const getAllNotes = asyncHandler(async(req,res) => {
  const user = req.user
  const notes = await Notes.findById(req.user._id)
  if(!notes){
    throw new ApiError(404, "Notes not found")
  }

  return res.status(200).json(
    new ApiResponse(200, notes,"Notes fetched successfully")
  )

})