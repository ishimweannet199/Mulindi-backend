import Student from './student.js';

// STORE KEEPER APPROVAL — student must take materials
exports.approveStoreKeeper = async (req, res) => {
  try {
    const { registration_no } = req.body;

    // 1️ Find student
    const student = await Student.findOne({ registration_no });
    if (!student)
      return res.status(404).json({ message: 'Student not found' });

    // 2️ Make sure Matron stage is approved before Store Keeper
    const matronStage = student.clearance.find(c => c.stage === 'matron');
    if (!matronStage || matronStage.status !== 'approved') {
      return res
        .status(400)
        .json({ message: 'Matron stage must be approved before Store Keeper' });
    }

    // 3️ Check mattress payment
    if (!matronStage.mattressPaid) {
      return res.status(400).json({
        message: 'Parent must first pay for mattress before Store Keeper approval'
      });
    }

    // 4️ Find store keeper stage
    const storeStage = student.clearance.find(c => c.stage === 'store_keeper');
    if (!storeStage)
      return res.status(400).json({ message: 'Store Keeper stage not found' });

    // 5️ Approve the stage
    storeStage.status = 'approved';
    storeStage.itemsGiven = true; // Student received items
    await student.save();

    res.status(200).json({
      message: 'Store Keeper: Items given and stage approved',
      student
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};
