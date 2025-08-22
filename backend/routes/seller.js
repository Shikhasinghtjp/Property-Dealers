import express from "express";
import multer from "multer";
import path from "path";
import { createSellerProperty, getAllSellerProperties, updateSellerProperty, deleteSellerProperty, getAcceptedSellerProperties, getSellerById} from "../controllers/Seller.js";
import Seller from '../models/Seller.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (jpg, jpeg, png, gif) and videos (mp4, mov, avi) are allowed.'), false);
    }
  },
  limits: { files: 10 },
});

// Routes
router.post("/", upload.array("media", 10), createSellerProperty);
router.get("/", getAllSellerProperties);
router.get("/count", async (req, res) => {
  try {
    const count = await Seller.count();  // agar sequelize hai
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id", updateSellerProperty);
router.delete("/:id", deleteSellerProperty);
router.get("/accepted", getAcceptedSellerProperties);
router.get('/:id', getSellerById);


export default router;