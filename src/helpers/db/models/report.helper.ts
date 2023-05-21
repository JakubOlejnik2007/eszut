import mongoose from "mongoose";

const Report = mongoose.model('Report', new mongoose.Schema({
    where: {
        type: String,
        required: true
    },
    who: {
        type: String,
        required: true
    },
    what: {
        type: String,
        required: true
    },
    when: {
        type:Number,
        required: true,
        default: Date.now()
    },
    isSolved:{
        type: Boolean,
        required: true,
        default: false
    },
    AdministratorWhoSolvedID: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    dateOfSolved: {
        type: Number,
        required: false,
    },
    CategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}))
export default Report;   