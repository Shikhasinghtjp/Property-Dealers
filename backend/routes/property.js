import express from 'express';
import { addProperty, getAllProperties, getPropertyById, deleteProperty, updateProperty, upload } from '../controllers/Property.js';
import multer from 'multer';

const router = express.Router();

router.post('/', upload, addProperty);
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.delete('/:id', deleteProperty);
router.put('/:id', (req, res, next) => {
  console.log('PUT request received');
  console.log('PUT request headers:', req.headers);
  let totalBytes = 0;
  let firstChunk = true;
  req.on('data', chunk => {
    totalBytes += chunk.length;
    if (firstChunk) {
      console.log('First chunk sample:', chunk.toString('utf8').substring(0, 200));
      firstChunk = false;
    }
    console.log(`Received chunk: ${chunk.length} bytes, Total: ${totalBytes} bytes`);
  });
  req.on('end', () => console.log('Request stream ended'));
  req.on('error', (err) => {
    console.error('Request stream error:', err);
    res.status(400).json({ error: 'Request stream error', details: err.message });
  });
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: 'Image upload failed', details: err.message });
      } else if (err) {
        console.error('File validation error:', err);
        return res.status(400).json({ error: 'Invalid file type', details: err.message });
      }
      next();
    });
  } else {
    next();
  }
}, updateProperty);

export default router;