import Property from "../models/Property.js";
import path from "path";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads"); // Use lowercase 'uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    console.log(`Saving file: ${filename}`);
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 50, 
  },
}).array('images', 10);

export const addProperty = async (req, res) => {
  try {
    const { title, location, totalPrice, width, length, area, bhk, floor, propertyType, taluka, description } = req.body;
    // Validate file types after upload
    const validMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/webm',
    ];
    
    if (req.files) {
      for (const file of req.files) {
        console.log(`Processing file: ${file.originalname}, MIME: ${file.mimetype}, Size: ${file.size} bytes`);
        if (!validMimeTypes.includes(file.mimetype)) {
          return res.status(400).json({ error: 'Invalid file type', details: `File ${file.originalname} has invalid MIME type: ${file.mimetype}` });
        }
      }
    }
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    if (!title || !location || !propertyType) {
      return res.status(400).json({ error: "Title, location, and propertyType are required" });
    }

    const parsedTotalPrice = totalPrice ? parseFloat(totalPrice) : null;
    if (totalPrice && isNaN(parsedTotalPrice)) {
      return res.status(400).json({ error: "Invalid totalPrice value" });
    }

    const newProperty = await Property.create({
      title,
      location,
      totalPrice: parsedTotalPrice,
      width: width ? parseFloat(width) : null,
      length: length ? parseFloat(length) : null,
      area: area ? parseFloat(area) : null,
      bhk,
      floor,
      propertyType: propertyType || 'Flat',
      taluka,
      description,
      images,
      created_at: new Date(),
    });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll();
    const normalizedProperties = properties.map(prop => ({
      ...prop.toJSON(),
      images: Array.isArray(prop.images) ? prop.images.map(img => img.replace(/\/[uU]ploads\//, '/uploads/')) : [],
    }));
    console.log("Fetched properties:", JSON.stringify(normalizedProperties, null, 2));
    res.status(200).json(normalizedProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    const normalizedProperty = {
      ...property.toJSON(),
      images: Array.isArray(property.images) ? property.images.map(img => img.replace(/\/[uU]ploads\//, '/uploads/')) : [],
    };
    console.log("Fetched property by ID:", normalizedProperty);
    res.status(200).json(normalizedProperty);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.images && Array.isArray(property.images)) {
      property.images.forEach((image) => {
        const imagePath = path.join(process.cwd(), image.replace(/\/[uU]ploads\//, '/uploads/'));
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image file: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Error deleting image file ${imagePath}:`, err);
        }
      });
    }

    await property.destroy();
    console.log(`Property deleted: ID ${id}`);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateProperty = async (req, res) => {
  try {
    const hasFiles = req.headers['content-type']?.includes('multipart/form-data');
    if (hasFiles) {
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: 'Image upload failed', details: err.message });
        } else if (err) {
          return res.status(400).json({ error: 'Invalid file or stream error', details: err.message });
        }

        const validMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/mpeg',
          'video/webm',
        ];
        if (req.files) {
          for (const file of req.files) {
            console.log(`Validated file: ${file.originalname}, MIME: ${file.mimetype}, Size: ${file.size} bytes`);
            if (!validMimeTypes.includes(file.mimetype)) {
              return res.status(400).json({ error: 'Invalid file type', details: `File ${file.originalname} has invalid MIME type: ${file.mimetype}` });
            }
          }
        }
        if (!req.body || Object.keys(req.body).length === 0) {
          console.error('No form data received after upload');
          return res.status(400).json({ error: 'No form data received', details: 'Form data is empty or malformed' });
        }
        await processUpdate(req, res);
      });
    } else {
      console.log("Processing as JSON request");
      await processUpdate(req, res);
    }
  } catch (error) {
    console.error('Error in updateProperty:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const processUpdate = async (req, res) => {
  const { id } = req.params;
  let { title, location, totalPrice, width, length, area, bhk, floor, propertyType, taluka, description, existingImages } = req.body;
  const property = await Property.findByPk(id);

  if (!property) {
    console.log("Property not found for ID:", id);
    return res.status(404).json({ error: "Property not found" });
  }

  let keptImages = [];
  if (existingImages) {
    keptImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    if (!Array.isArray(keptImages)) keptImages = [];
  } else {
    keptImages = property.images || [];
  }

  // Delete removed images
  const oldImages = property.images || [];
  const removedImages = oldImages.filter(img => !keptImages.includes(img));
  removedImages.forEach((image) => {
    const imagePath = path.join(process.cwd(), image.replace(/\/[uU]ploads\//, '/uploads/'));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });

  // Add new images
  let newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

  const updatedImages = [...keptImages, ...newImages];

  const parsedTotalPrice = totalPrice ? parseFloat(totalPrice) : property.totalPrice;

  const updatedData = {
    title: title || property.title,
    location: location || property.location,
    totalPrice: parsedTotalPrice,
    width: width ? parseFloat(width) : property.width,
    length: length ? parseFloat(length) : property.length,
    area: area ? parseFloat(area) : property.area,
    bhk: bhk || property.bhk,
    floor: floor || property.floor,
    propertyType: propertyType || property.propertyType,
    taluka: taluka || property.taluka,
    description: description || property.description,
    images: updatedImages,
  };

  console.log('Updating property with data:', updatedData);
  await property.update(updatedData);
  res.status(200).json({ message: 'Property updated successfully', property: { ...property.toJSON(), images: updatedImages } });
};