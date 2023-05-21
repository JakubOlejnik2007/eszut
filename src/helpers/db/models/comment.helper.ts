import mongoose from "mongoose";

const Comment = mongoose.model('Comment', new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    AdministratorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ProblemID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}))
export default Comment;   
