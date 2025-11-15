import student from './student.js';

// Approve Patron stage (after shaving fee payment)
exports.approvePatron = async (req, res) => {
  try {
    const { registration_no, paid } = req.body;

    const student = await Student.findOne({ registration_no });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const patronStage = student.clearance.find(c => c.stage === 'patron');
    if (!patronStage)
      return res.status(400).json({ message: 'Patron stage not found' });

    const departmentStage = student.clearance.find(c => c.stage === 'department');
    if (!departmentStage || departmentStage.status !== 'approved')
      return res.status(400).json({ message: 'Department not yet approved' });

    //  Mark payment
    patronStage.paid = paid;
    patronStage.status = paid ? 'approved' : 'pending';

    await student.save();

    //  Automatically add Matron stage if paid
    if (paid) {
      const hasMatron = student.clearance.some(c => c.stage === 'matron');
      if (!hasMatron) {
        student.clearance.push({
          stage: 'matron',
          paid: false,
          status: 'pending'
        });
        await student.save();
      }
    }

    res.status(200).json({
      message: paid
        ? 'Patron stage approved — moved to Matron'
        : 'Payment pending for Patron stage',
      student
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
