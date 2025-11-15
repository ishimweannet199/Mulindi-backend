import student from './student.js'

exports.createstudent = async (req , res) =>{
    try {
      
        const[Full_name, registration_no, Acdemic_year] = req.body;

        let student = await student.findOne({registration_no });
        if(student){ 
            return res.status(400).json({msg : "student already exists",student});
        }

    student = new student({
        Full_name,
        registration_no,
        Acdemic_year
    });
    await student.save();
    res.status(200).json({msg : "student Saved successfully", student});
}catch (error){
    return res.status(500).json({msg : "Server Error" });
}

}
exports.Aprovestudent = async (req , res) =>{
    try {
        const { registration_no } = req.body;
        const student = await student.findOne({registration_no});
        if(!student)
            return res.status(400).json({msg : "student does not exists"});
        const Masterstage = student.Clearance.find(stage => stage.stage === 'Master');
        if(!Masterstage)
            return res.status(400).json({msg : "No Master clearance stage found"});
        Masterstage.status = 'Approved';
        await student.save();
    
    const  finance= student.Clearance.find(stage => stage.stage === 'Finance');
    if(finance ){
        student.Clearance.push({stage : 'finance', status : 'Pending'});
        await student.save();
    }
     
    res.status(200).json({msg : "Master clearance Approved", student});
    }
    catch (error){
        return res.status(500).json({msg : "Server Error" });   
    }
}