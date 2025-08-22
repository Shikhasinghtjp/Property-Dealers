import express from 'express';
import { addProperty, getAllProperties, getPropertyById, deleteProperty, updateProperty, upload } from '../controllers/Property.js';
import multer from 'multer';
import Property from '../models/Property.js';

const router = express.Router();

router.post('/', upload, addProperty);
router.get('/', getAllProperties);
router.get("/count", async (req, res) => {
  try {
    const count = await Property.count(); 
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:id', getPropertyById);
router.delete('/:id', deleteProperty);
router.put('/:id', updateProperty);


export default router;