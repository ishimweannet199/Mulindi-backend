import mongoose from "mongoose";

const Clearance_Status = new mongoose.Schema({
    stage : string,
    status : {
        type : String,
        default : 'Pending'
    }
});

const studentSchema = new mongoose.Schema({
    Full_name : {
        type : String,
        required : true
    },
    registration_no :{
        type : String,
        required : true,
        unique : true
    },
    Acdemic_year : {
        type : String,
        required : true
    },
    Clearance : [Clearance_Status]
});


model.exports = mongoose.model('student' , studentSchema);