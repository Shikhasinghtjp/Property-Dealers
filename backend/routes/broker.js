import express from 'express';
import { createBroker, getBrokers, updateBroker, deleteBroker } from '../controllers/Broker.js';
import  Broker  from '../models/Broker.js';

const router = express.Router();

router.post('/', createBroker);
router.get('/', getBrokers);
router.put('/:id', updateBroker); // for updating broker details
router.delete('/:id', deleteBroker); // for deleting a broker
router.get("/count", async (req, res) => {
    try {
      const count = await Broker.count();  // agar sequelize hai
      res.json({ count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
export default router;