import express from 'express';
import { createBuyer, getAllBuyers } from '../controllers/Buyer.js';
import Buyer from '../models/Buyer.js';

const router = express.Router();

router.post('/', createBuyer);
router.get('/', getAllBuyers);
router.get('/test', (req, res) => {
  res.send('Buyer route working!');
});
router.patch('/:id', async (req, res) => {
  try {
    const { name, phone, propertyType, title, status, remarks,follow_up_date,visit_date } = req.body;
    const buyer = await Buyer.findByPk(req.params.id);
    if (buyer) {
      buyer.name = name;
      buyer.phone = phone;
      buyer.propertyType = propertyType;
      buyer.title = title;
      buyer.status = status;
      buyer.remarks = remarks;
      buyer.follow_up_date = follow_up_date;
      buyer.visit_date = visit_date;
      await buyer.save();
      res.json(buyer);
    } else {
      res.status(404).json({ message: 'Buyer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating buyer status', error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const buyer = await Buyer.findByPk(req.params.id);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    console.log(`Attempting to delete buyer with ID: ${req.params.id}`);
    await buyer.destroy();
    console.log(`Buyer with ID ${req.params.id} deleted successfully`);
    res.json({ message: 'Buyer deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.stack); // Log full stack trace
    res.status(500).json({ message: 'Error deleting buyer', error: err.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await Buyer.count();  // agar sequelize hai
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;