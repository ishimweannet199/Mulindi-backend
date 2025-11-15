import atudent from './student.js';

exports.approveDod = async (req, res) => {
  try {
    const { registration_no, lunch_amount, receiver } = req.body;

    const student = await Student.findOne({ registration_no });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const dodStage = student.clearance.find(c => c.stage === 'dod');
    if (!dodStage)
      return res.status(400).json({ message: 'DOD stage not found' });

    const matronStage = student.clearance.find(c => c.stage === 'matron');
    if (!matronStage || matronStage.status !== 'approved')
      return res.status(400).json({ message: 'Matron stage not approved yet' });

    // ========================================
    //  INCLUDE WHERE PARENTS PAY MONEY HERE
    // ========================================
    let lunchStage = student.clearance.find(c => c.stage === 'conference_lunch');

    // If does not exist → create
    if (!lunchStage) {
      lunchStage = {
        stage: 'conference_lunch',
        paid: true,               // mark as paid (simple)
        amount: lunch_amount || 0,
        received_by: receiver || null,
        status: 'approved',
        date: new Date()
      };
      student.clearance.push(lunchStage);
    }
    // ========================================

    // Approve DOD
    dodStage.status = 'approved';
    await student.save();

    // Add Store Keeper stage automatically
    const hasStore = student.clearance.some(c => c.stage === 'store_keeper');
    if (!hasStore) {
      student.clearance.push({ stage: 'store_keeper', paid: false, status: 'pending' });
      await student.save();
    }

    res.status(200).json({
      message: 'DOD approved — money recorded — moved to Store Keeper stage',
      student
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
