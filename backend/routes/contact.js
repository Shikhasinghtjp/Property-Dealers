import express from 'express';
import { createContact, getContacts, getContactById, updateContact, deleteContact } from '../controllers/Contact.js';
import Contact from "../models/Contact.js";

const router = express.Router();

router.post('/', createContact);
router.get('/', getContacts);
router.get("/count", async (req, res) => {
  try {
  const count = await Contact.count();  // agar sequelize hai
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

  
export default router;