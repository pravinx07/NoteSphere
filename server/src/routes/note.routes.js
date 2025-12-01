import express from "express"
import { createNote, getAllNotes } from "../controllers/note.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/create",verifyJWT, createNote)
router.get("/",verifyJWT, getAllNotes)

export default router;