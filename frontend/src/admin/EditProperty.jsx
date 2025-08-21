import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  padding: 0.2rem 2rem;
  background: #f1f5f9;
  min-height: 100vh;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  display: grid;
  gap: 1.2rem;
  max-width: 600px;
  width: 100%;
  margin-top: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #0f172a;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background: #1e293b;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem;
  background: #ef4444;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const VideoPreview = styled.video`
  width: 100px;
  height: 80px;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
`;

const PropertyTypeLabel = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 1rem;
`;

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    location: '',
    totalPrice: '',
    description: '',
    images: [], // New files to add (array of File objects)
    existingImages: [], // Kept existing image paths (array of strings)
    width: '',
    length: '',
    area: '',
    bhk: '',
    floor: '',
    propertyType: 'flat',
    taluka: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/property/${id}`);
        const property = res.data;
        console.log('Fetched property:', property);
        setForm({
          title: property.title || '',
          location: property.location || '',
          totalPrice: property.totalPrice != null ? property.totalPrice.toString() : '',
          description: property.description || '',
          images: [],
          existingImages: property.images && Array.isArray(property.images) ? property.images.map(img => `/uploads/${img.split('/').pop()}`) : [],
          width: property.width != null ? property.width.toString() : '',
          length: property.length != null ? property.length.toString() : '',
          area: property.area != null ? property.area.toString() : '',
          bhk: property.bhk || '',
          floor: property.floor || '',
          propertyType: property.propertyType || 'flat',
          taluka: property.taluka || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property data');
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      const newFiles = Array.from(files).filter(
        (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      setForm({ ...form, images: [...form.images, ...newFiles] }); // Append to existing new images
    } else {
      const updatedForm = { ...form, [name]: value };

      if (name === 'width' || name === 'length') {
        const width = parseFloat(name === 'width' ? value : form.width);
        const length = parseFloat(name === 'length' ? value : form.length);
        if (!isNaN(width) && !isNaN(length)) {
          updatedForm.area = (width * length).toFixed(2);
        } else {
          updatedForm.area = '';
        }
      }

      setForm(updatedForm);
      console.log('Form updated:', updatedForm);
    }
  };

  const removeExistingImage = (index) => {
    const updatedExisting = form.existingImages.filter((_, i) => i !== index);
    setForm({ ...form, existingImages: updatedExisting });
  };

  const removeNewImage = (index) => {
    const updatedNew = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedNew });
  };

  const isVideoFile = (urlOrFile) => {
    if (typeof urlOrFile === 'string') {
      return urlOrFile.endsWith('.mp4') || urlOrFile.endsWith('.webm') || urlOrFile.endsWith('.mpeg');
    } else if (urlOrFile instanceof File) {
      return urlOrFile.type.startsWith('video/');
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.title || !form.location || !form.totalPrice || !form.propertyType) {
      setError('Title, location, total price, and property type are required');
      return;
    }
  
    if (isNaN(parseFloat(form.totalPrice))) {
      setError('Total price must be a valid number');
      return;
    }
  
    const hasNewImages = form.images.length > 0;
  
    if (hasNewImages) {
      const validMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/mpeg',
        'video/webm',
      ];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const validFiles = form.images.filter(file => {
        const isValidType = validMimeTypes.includes(file.type);
        const isValidSize = file.size <= maxFileSize;
        if (!isValidType) setError(`Invalid file type for ${file.name}`);
        if (!isValidSize) setError(`File ${file.name} exceeds 5MB limit.`);
        return isValidType && isValidSize;
      });
  
      if (validFiles.length === 0) {
        setError('No valid image or video files selected');
        return;
      }
  
      const formData = new FormData();
      // Append all fields
      formData.append('title', form.title || '');
      formData.append('location', form.location || '');
      formData.append('totalPrice', form.totalPrice || '');
      formData.append('description', form.description || '');
      formData.append('taluka', form.taluka || '');
      formData.append('width', form.width || '');
      formData.append('length', form.length || '');
      formData.append('area', form.area || '');
      formData.append('propertyType', form.propertyType || '');
      if (form.propertyType === 'flat') formData.append('bhk', form.bhk || '');
      if (form.propertyType === 'shop') formData.append('floor', form.floor || '');
      formData.append('existingImages', JSON.stringify(form.existingImages)); // Send as JSON string
  
      // Append valid files
      validFiles.forEach((file) => {
        console.log(`Appending file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
        formData.append('images', file);
      });
  
      // Log FormData for debugging
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}=${value instanceof File ? `${value.name} (${value.type}, ${value.size} bytes)` : value}`);
      }
  
      try {
        const res = await axios.put(`http://localhost:5000/api/property/${id}`, formData, {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }); // Remove explicit Content-Type to let browser handle boundary
        console.log('Response:', res.data);
        toast.success('Property updated successfully');
        navigate('/admin/properties');
      } catch (err) {
        console.error('Axios error:', err.response ? err.response.data : err.message);
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to update property: ${errorMessage}`);
        toast.error(`Failed to update property: ${errorMessage}`);
      }
    } else {
      const jsonData = {
        title: form.title || '',
        location: form.location || '',
        totalPrice: form.totalPrice || '',
        description: form.description || '',
        width: form.width || '',
        length: form.length || '',
        area: form.area || '',
        propertyType: form.propertyType || '',
        taluka: form.taluka || '',
        bhk: form.propertyType === 'flat' ? form.bhk || '' : '',
        floor: form.propertyType === 'shop' ? form.floor || '' : '',
        existingImages: form.existingImages,
      };
  
      try {
        const res = await axios.put(`http://localhost:5000/api/property/${id}`, jsonData, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response:', res.data);
        toast.success('Property updated successfully');
        navigate('/admin/properties');
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to update property: ${errorMessage}`);
        toast.error(`Failed to update property: ${errorMessage}`);
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/properties');
  };

  if (loading) {
    return <Wrapper>Loading...</Wrapper>;
  }

  if (error) {
    return <Wrapper><ErrorMessage>{error}</ErrorMessage></Wrapper>;
  }

  return (
    <Wrapper>
      <h2>Edit Property</h2>
      <PropertyTypeLabel>{form.propertyType.charAt(0).toUpperCase() + form.propertyType.slice(1)}</PropertyTypeLabel>
      <Form onSubmit={handleSubmit}>
        <Input type="text" name="title" placeholder="Property Title" value={form.title} onChange={handleChange} required />
        <Input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <Input type="number" name="totalPrice" placeholder="Total Price" value={form.totalPrice} onChange={handleChange} required />
        <Input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Input type="text" name="taluka" placeholder="Taluka" value={form.taluka} onChange={handleChange} />
        <Input type="number" name="width" placeholder="Width (ft)" value={form.width} onChange={handleChange} />
        <Input type="number" name="length" placeholder="Length (ft)" value={form.length} onChange={handleChange} />
        <Input type="number" name="area" placeholder="Area (sqft)" value={form.area} readOnly />
        {form.propertyType === 'flat' && (
          <Select name="bhk" value={form.bhk} onChange={handleChange}>
            <option value="">Select BHK</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4+ BHK">4+ BHK</option>
          </Select>
        )}
        {form.propertyType === 'shop' && (
          <Input type="text" name="floor" placeholder="Floor (e.g. Ground, 1st)" value={form.floor} onChange={handleChange} />
        )}
        <Input type="file" name="images" accept="image/*,video/*" multiple onChange={handleChange} />
        <ImagePreviewContainer>
          {form.existingImages.map((url, i) => (
            <PreviewItem key={`existing-${i}`}>
              {isVideoFile(url) ? (
                <VideoPreview src={`http://localhost:5000${url}`} controls />
              ) : (
                <ImagePreview src={`http://localhost:5000${url}`} alt={`existing-${i}`} />
              )}
              <RemoveButton onClick={() => removeExistingImage(i)}>X</RemoveButton>
            </PreviewItem>
          ))}
          {form.images.map((file, i) => (
            <PreviewItem key={`new-${i}`}>
              {isVideoFile(file) ? (
                <VideoPreview src={URL.createObjectURL(file)} controls />
              ) : (
                <ImagePreview src={URL.createObjectURL(file)} alt={`new-${i}`} />
              )}
              <RemoveButton onClick={() => removeNewImage(i)}>X</RemoveButton>
            </PreviewItem>
          ))}
        </ImagePreviewContainer>
        <ButtonContainer>
          <Button type="submit">Update Property</Button>
          <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
        </ButtonContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </Wrapper>
  );
};

export default EditProperty;