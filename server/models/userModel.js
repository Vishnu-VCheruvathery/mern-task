import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    Avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
})

export const userModel = mongoose.model("User", userSchema)