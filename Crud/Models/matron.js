import student from './student.js';

//  Approve Matron stage (deposit handling)
exports.approveMatron = async (req, res) => {
  try {
    const { registration_no, paid } = req.body;

    const student = await Student.findOne({ registration_no });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const matronStage = student.clearance.find(c => c.stage === 'matron');
    if (!matronStage)
      return res.status(400).json({ message: 'Matron stage not found' });

    const patronStage = student.clearance.find(c => c.stage === 'patron');
    if (!patronStage || patronStage.status !== 'approved')
      return res.status(400).json({ message: 'Patron stage not yet approved' });

    //  Handle deposit payment or return
    matronStage.paid = paid;
    matronStage.status = paid ? 'approved' : 'pending';

    await student.save();

    //  Automatically add DOD stage if cleared
    if (paid) {
      const hasDOD = student.clearance.some(c => c.stage === 'dod');
      if (!hasDOD) {
        student.clearance.push({
          stage: 'dod',
          paid: false,
          status: 'pending'
        });
        await student.save();
      }
    }

    res.status(200).json({
      message: paid
        ? 'Matron stage approved — moved to DOD stage'
        : 'Deposit payment/return pending',
      student
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
