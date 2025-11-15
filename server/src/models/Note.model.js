import mongoose from "mongoose";

const notesSchema  = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
        trim:true,

    },
    content:{
        type:String,
        required:true,

        
    },
    tags:{
        type:[String]
    },
    pinned:{
        type:Boolean,
        default:false,
    },
    archived:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})


export const Notes = mongoose.model("Notes", notesSchema)