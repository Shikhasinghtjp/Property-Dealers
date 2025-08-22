import Seller from '../models/Seller.js';

export const createSellerProperty = async (req, res) => {
  try {
       // Validate required fields
    const requiredFields = ['name', 'phone', 'location', 'propertyType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validate phone as integer
    if (req.body.phone && (isNaN(req.body.phone) || parseInt(req.body.phone, 10) < 0)) {
      return res.status(400).json({ message: 'Phone number must be a positive integer' });
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
    if (req.files && req.files.length > 0) {
      const invalidFiles = req.files.filter(file => !validTypes.includes(file.mimetype));
      if (invalidFiles.length > 0) {
        return res.status(400).json({ message: 'Invalid file types. Only images (jpg, jpeg, png, gif) and videos (mp4, mov, avi) are allowed.' });
      }
    }
    
    // Construct property data with explicit type conversion and validation
    const propertyData = {
      name: req.body.name,
      phone: req.body.phone ? parseInt(req.body.phone, 10) : null,
      title: req.body.title || null,
      location: req.body.location,
      taluka: req.body.taluka || null,
      width: req.body.width ? Number.parseFloat(req.body.width) : null,
      length: req.body.length ? Number.parseFloat(req.body.length) : null,
      area: req.body.area ? Number.parseFloat(req.body.area) : (req.body.width && req.body.length ? Number.parseFloat(req.body.width) * Number.parseFloat(req.body.length) : null),
      bhk: req.body.bhk || null,
      floor: req.body.floor || null,
      totalPrice: req.body.totalPrice ? Number.parseFloat(req.body.totalPrice) : null,
      description: req.body.description || null,
      status: req.body.status || 'Not Contacted',
      remarks: req.body.remarks || null,
      follow_up_date: req.body.followUpDate || null,
      visit_date: req.body.visitDate || null,
      propertyType: req.body.propertyType,
      images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [],
    };

    // Validate numeric fields
    const numericFields = ['width', 'length', 'area', 'totalPrice'];
    numericFields.forEach(field => {
      if (propertyData[field] !== null && (isNaN(propertyData[field]) || propertyData[field] <= 0)) {
        return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number` });
      }
    });

    // Log types and values before saving
    console.log("Property data types:", {
      width: typeof propertyData.width,
      length: typeof propertyData.length,
      area: typeof propertyData.area,
      totalPrice: typeof propertyData.totalPrice,
      phone: typeof propertyData.phone
    });
    console.log("Property data values:", {
      width: propertyData.width,
      length: propertyData.length,
      area: propertyData.area,
      totalPrice: propertyData.totalPrice,
      phone: propertyData.phone
    });

    console.log("Property data to save:", propertyData);
    const newProperty = await Seller.create(propertyData);
    console.log("Saved property:", newProperty);
    res.status(201).json({ message: "Property added successfully", property: newProperty });
  } catch (err) {
    console.error("Error in createSellerProperty:", err);
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(error => ({
        field: error.path,
        message: error.message
      }));
      return res.status(400).json({ message: "Validation errors", errors });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllSellerProperties = async (req, res) => {
  try {
    const properties = await Seller.findAll();
    res.json(properties || []); // Always return an array
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.json([]); // Return empty array on error
  }
};


export const updateSellerProperty = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Validate phone as integer
    if (req.body.phone && (isNaN(req.body.phone) || parseInt(req.body.phone, 10) < 0)) {
      return res.status(400).json({ message: 'Phone number must be a positive integer' });
    }

    const updateData = {
      name: req.body.name || seller.name,
      phone: req.body.phone ? parseInt(req.body.phone, 10) : seller.phone,
      title: req.body.title || null,
      location: req.body.location || seller.location,
      taluka: req.body.taluka || null,
      width: req.body.width ? Number.parseFloat(req.body.width) : null,
      length: req.body.length ? Number.parseFloat(req.body.length) : null,
      area: req.body.area ? Number.parseFloat(req.body.area) : (req.body.width && req.body.length ? Number.parseFloat(req.body.width) * Number.parseFloat(req.body.length) : null),
      bhk: req.body.bhk || null,
      floor: req.body.floor || null,
      totalPrice: req.body.totalPrice ? Number.parseFloat(req.body.totalPrice) : null,
      description: req.body.description || null,
      status: req.body.status || seller.status,
      remarks: req.body.remarks || null,
      follow_up_date: req.body.follow_up_date || null,
      visit_date: req.body.visit_date || null,
      propertyType: req.body.propertyType || seller.propertyType,
      images: req.body.images || seller.images,
    };

    await seller.update(updateData);
    res.status(200).json({ message: 'Seller updated successfully', property: seller });
  } catch (error) {
    console.error('Error updating seller:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ message: 'Validation errors', errors });
    }
    res.status(500).json({ message: 'Failed to update seller', error: error.message });
  }
};

export const deleteSellerProperty = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    await seller.destroy();
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Failed to delete seller', error: error.message });
  }
};

// getAcceptedSellerProperties: Only accepted (for user frontend)
export const getAcceptedSellerProperties = async (req, res) => {
  try {
    const properties = await Seller.findAll({ where: { status: 'Accepted' } });
    res.json(properties || []);
  } catch (error) {
    console.error('Error fetching accepted sellers:', error);
    res.json([]);
  }
};

export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};