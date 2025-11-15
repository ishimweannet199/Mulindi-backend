import student from './student.js';

exports.payfinance = async (req , res)=>{
    try {
        const { registration_no } = req.body;
        const student = await student.findOne({registration_no});   

        const financeStage = student.Clearance.find(stage => stage.stage === 'Finance');
        if(!financeStage)
            return res.status(400).json({msg : "No Finance clearance stage found"});

        financeStage.paid = true;
        financeStage.status = 'paid';
        await student.save();

        res.status(200).json({msg : "Finance Payment Successful", student});
    }catch (error){
        return res.status(500).json({msg : "Server Error" });   
    }
}


exports.approvefinance = async (req , res) =>{
    try {
        const { registration_no } = req.body;
        const student = await student.findOne({registration_no});               
        const financeStage = student.Clearance.find(stage => stage.stage === 'Finance');
        if(!financeStage)
            return res.status(400).json({msg : "No Finance clearance stage found"});
    financeStage.status = 'Approved';
 await student.save();  
 
  const finance= student.Clearance.find(stage => stage.stage ==='Finance');
 if(financeStage.paid){


        student.Clearance.push({stage : 'patron', status : 'Pending'});    

   res.status(200).json({msg : "Finance clearance Approved", student});
     }
    } catch (error){
         return res.status(500).json({msg : "Server Error" });   
     }                   
 }









