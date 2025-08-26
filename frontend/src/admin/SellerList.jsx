import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Container = styled.div`
  padding: 20px;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 1rem;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 10px;

  a {
    text-decoration: none;
    color: #005ca8;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f0f0f0;
      color: #003d73;
    }

    &.active {
      background-color: #005ca8;
      color: white;
    }

    &:after {
      content: '/';
      margin-left: 10px;
      color: #666;
    }

    &:last-child:after {
      content: '';
    }
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const DateRangeWrapper = styled.div`
  position: relative;

  .rdrDateRangePickerWrapper {
    position: absolute;
    z-index: 1000;
    top: 100%;
    right: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const DateRangeButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const TableContainer = styled.div`
  background-color: #f1f5f9;
  padding: 10px;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
`;

const TableHeader = styled.th`
  padding: 6px;
  background-color: #005ca8;
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  border-bottom: 1px solid #ddd;

  &:nth-child(1) { min-width: 40px; max-width: 40px; } /* SRNo */
  &:nth-child(2) { min-width: 80px; } /* Name */
  &:nth-child(3) { min-width: 80px; } /* Phone */
  &:nth-child(4) { min-width: 100px; } /* Title */
  &:nth-child(5) { min-width: 100px; } /* Location */
  &:nth-child(6) { min-width: 80px; } /* Taluka */
  &:nth-child(7) { min-width: 80px; } /* Property Type */
  &:nth-child(8) { min-width: 60px; } /* Area */
  &:nth-child(9) { min-width: 80px; } /* Total Price */
  &:nth-child(10) { min-width: 50px; } /* BHK */
  &:nth-child(11) { min-width: 50px; } /* Floor */
  &:nth-child(12) { min-width: 120px; } /* Description */
  &:nth-child(13) { min-width: 80px; } /* Status */
  &:nth-child(14) { min-width: 80px; } /* Follow Up Date */
  &:nth-child(15) { min-width: 80px; } /* Visit Date */
  &:nth-child(16) { min-width: 100px; } /* Images */
  &:nth-child(17) { min-width: 80px; } /* Created At */
  &:nth-child(18) { min-width: 80px; } /* Action */
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 6px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 0.75rem;
  white-space: normal;

  &:nth-child(12) { /* Description */
    overflow-wrap: break-word;
    max-width: 120px;
  }

  @media (max-width: 768px) {
    padding: 4px;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    padding: 3px;
    font-size: 0.65rem;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 3px;
  color: #005ca8;
  font-size: 0.8rem;
  transition: color 0.3s ease;

  &:hover {
    color: #003d73;
  }
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Image = styled.img`
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

const LoadingMessage = styled.p`
  color: #005ca8;
  text-align: center;
  margin: 20px 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h3`
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: #333;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CloseButton = styled(Button)`
  background: #ccc;
  color: #333;
`;

const UpdateButton = styled(Button)`
  background: #005ca8;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 5px;
  background: ${props => (props.readOnly ? '#f0f0f0' : 'white')};
  color: ${props => (props.readOnly ? '#666' : '#333')};

  &:focus {
    outline: none;
    border-color: #005ca8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 5px;

  &:focus {
    outline: none;
    border-color: #005ca8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 5px;
  resize: vertical;
`;

const CardItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardLabel = styled.div`
  font-weight: 600;
  color: #333;
  min-width: 100px;
`;

const CardValue = styled.div`
  flex: 1;
  color: #333;
  white-space: normal;

  &:nth-child(13) { /* Description in View Modal */
    overflow-wrap: break-word;
  }
`;

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedSellerForView, setSelectedSellerForView] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    title: '',
    location: '',
    taluka: '',
    width: '',
    length: '',
    area: '',
    bhk: '',
    floor: '',
    totalPrice: '',
    description: '',
    status: '',
    remarks: '',
    followUpDate: '',
    visitDate: '',
    propertyType: '',
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [followUpRange, setFollowUpRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ]);
  const [visitRange, setVisitRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ]);
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
  const [showVisitPicker, setShowVisitPicker] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      console.log("Fetching sellers from http://localhost:5000/api/seller");
      const res = await axios.get('http://localhost:5000/api/seller');
      console.log("Fetched sellers:", res.data);
      const data = res.data;
      if (Array.isArray(data)) {
        setSellers(data);
        setFilteredSellers(data);
      } else {
        throw new Error('API did not return an array');
      }
    } catch (err) {
      console.error('Failed to fetch sellers:', err.response?.data || err.message);
      setError(`Failed to fetch seller data: ${err.response?.data?.message || err.message}. Check server logs.`);
      toast.error("Failed to fetch sellers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = sellers;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((seller) => seller.status === statusFilter);
    }

    if (followUpRange[0].startDate && followUpRange[0].endDate) {
      const start = new Date(followUpRange[0].startDate);
      const end = new Date(followUpRange[0].endDate);
      filtered = filtered.filter((seller) => {
        if (!seller.follow_up_date) return false;
        const followDate = new Date(seller.follow_up_date);
        return followDate >= start && followDate <= end;
      });
    }

    if (visitRange[0].startDate && visitRange[0].endDate) {
      const start = new Date(visitRange[0].startDate);
      const end = new Date(visitRange[0].endDate);
      filtered = filtered.filter((seller) => {
        if (!seller.visit_date) return false;
        const visitDate = new Date(seller.visit_date);
        return visitDate >= start && visitDate <= end;
      });
    }

    setFilteredSellers(filtered);
  }, [statusFilter, followUpRange, visitRange, sellers]);

  const handleEditClick = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    if (seller) {
      setSelectedSeller(seller);
      setFormData({
        name: seller.name,
        phone: seller.phone.toString(),
        title: seller.title || '',
        location: seller.location,
        taluka: seller.taluka || '',
        width: seller.width || '',
        length: seller.length || '',
        area: seller.area || '',
        bhk: seller.bhk || '',
        floor: seller.floor || '',
        totalPrice: seller.totalPrice || '',
        description: seller.description || '',
        status: seller.status,
        remarks: seller.remarks || '',
        followUpDate: seller.follow_up_date || '',
        visitDate: seller.visit_date || '',
        propertyType: seller.propertyType,
      });
      setShowEditModal(true);
    }
  };

  const handleViewClick = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    if (seller) {
      setSelectedSellerForView(seller);
      setShowViewModal(true);
    }
  };

  const handleDeleteClick = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      try {
        console.log(`Deleting seller with ID: ${sellerId}`);
        const response = await axios.delete(`http://localhost:5000/api/seller/${sellerId}`);
        console.log("Delete response:", response.data);
        setSellers(sellers.filter((s) => s.id !== sellerId));
        setFilteredSellers(filteredSellers.filter((s) => s.id !== sellerId));
        toast.success('Seller deleted successfully!');
      } catch (err) {
        console.error('Failed to delete seller:', err.response?.data || err.message);
        toast.error(`Failed to delete seller: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isNaN(formData.phone) || formData.phone < 0) {
        toast.error("Phone number must be a positive integer");
        return;
      }
      if (formData.totalPrice && (isNaN(formData.totalPrice) || formData.totalPrice < 0)) {
        toast.error("Total price must be a positive number");
        return;
      }
      const updateData = {
        name: formData.name,
        phone: parseInt(formData.phone),
        title: formData.title,
        location: formData.location,
        taluka: formData.taluka,
        width: formData.width ? parseFloat(formData.width) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        bhk: formData.bhk,
        floor: formData.floor,
        totalPrice: formData.totalPrice ? parseFloat(formData.totalPrice) : null,
        description: formData.description,
        status: formData.status,
        remarks: formData.remarks,
        follow_up_date: formData.followUpDate || null,
        visit_date: formData.visitDate || null,
        propertyType: formData.propertyType,
      };
      console.log(`Updating seller with ID: ${selectedSeller.id}`, updateData);
      const response = await axios.patch(`http://localhost:5000/api/seller/${selectedSeller.id}`, updateData);
      console.log("Update response:", response.data);
      setShowEditModal(false);
      await fetchSellers();
      toast.success('Seller updated successfully!');
    } catch (err) {
      console.error('Failed to update seller:', err.response?.data || err.message);
      toast.error(`Failed to update seller: ${err.response?.data?.message || err.message}`);
      setError(`Failed to update seller: ${err.response?.data?.message || err.message}. Check server logs.`);
    }
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setFormData({
      name: '',
      phone: '',
      title: '',
      location: '',
      taluka: '',
      width: '',
      length: '',
      area: '',
      bhk: '',
      floor: '',
      totalPrice: '',
      description: '',
      status: '',
      remarks: '',
      followUpDate: '',
      visitDate: '',
      propertyType: '',
    });
    setSelectedSeller(null);
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setSelectedSellerForView(null);
  };

  if (loading) {
    return <LoadingMessage>Loading seller data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>All Seller Listings</Title>
      <NavBar>
        <NavLinks>
          <a href="#" onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </a>
          <a href="#" onClick={() => navigate('/admin/seller')}>
            Seller
          </a>
        </NavLinks>
        <Filters>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Not Contacted">Not Contacted</option>
            <option value="Unreachable">Unreachable</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Rejected">Rejected</option>
          </FilterSelect>
          <DateRangeWrapper>
            <DateRangeButton onClick={() => setShowFollowUpPicker(!showFollowUpPicker)}>
              {followUpRange[0].startDate && followUpRange[0].endDate
                ? `${followUpRange[0].startDate.toLocaleDateString()} - ${followUpRange[0].endDate.toLocaleDateString()}`
                : 'Select Follow-up Range'}
            </DateRangeButton>
            {showFollowUpPicker && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  setFollowUpRange([item.selection]);
                  setShowFollowUpPicker(false);
                }}
                moveRangeOnFirstSelection={false}
                ranges={followUpRange}
                className="rdrDateRangePickerWrapper"
              />
            )}
          </DateRangeWrapper>
          <DateRangeWrapper>
            <DateRangeButton onClick={() => setShowVisitPicker(!showVisitPicker)}>
              {visitRange[0].startDate && visitRange[0].endDate
                ? `${visitRange[0].startDate.toLocaleDateString()} - ${visitRange[0].endDate.toLocaleDateString()}`
                : 'Select Visit Range'}
            </DateRangeButton>
            {showVisitPicker && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  setVisitRange([item.selection]);
                  setShowVisitPicker(false);
                }}
                moveRangeOnFirstSelection={false}
                ranges={visitRange}
                className="rdrDateRangePickerWrapper"
              />
            )}
          </DateRangeWrapper>
        </Filters>
      </NavBar>
      {filteredSellers.length === 0 ? (
        <p>No seller data available with current filters.</p>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>SRNo</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Taluka</TableHeader>
                <TableHeader>Property Type</TableHeader>
                <TableHeader>Area (sqft)</TableHeader>
                <TableHeader>Total Price</TableHeader>
                <TableHeader>BHK</TableHeader>
                <TableHeader>Floor</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Follow Up Date</TableHeader>
                <TableHeader>Visit Date</TableHeader>
                <TableHeader>Images</TableHeader>
                <TableHeader>Created At</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller, index) => (
                <TableRow key={seller.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.phone}</TableCell>
                  <TableCell>{seller.title || 'N/A'}</TableCell>
                  <TableCell>{seller.location}</TableCell>
                  <TableCell>{seller.taluka || 'N/A'}</TableCell>
                  <TableCell>{seller.propertyType}</TableCell>
                  <TableCell>{seller.area || 'N/A'}</TableCell>
                  <TableCell>{seller.totalPrice ? `₹${seller.totalPrice}` : 'N/A'}</TableCell>
                  <TableCell>{seller.bhk || 'N/A'}</TableCell>
                  <TableCell>{seller.floor || 'N/A'}</TableCell>
                  <TableCell>{seller.description || 'N/A'}</TableCell>
                  <TableCell>{seller.status}</TableCell>
                  <TableCell>
                    {seller.follow_up_date
                      ? new Date(seller.follow_up_date).toLocaleDateString()
                      : (seller.status === 'Unreachable' || seller.status === 'Not Contacted') ? 'No Follow Up' : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {seller.visit_date
                      ? new Date(seller.visit_date).toLocaleDateString()
                      : (seller.status === 'Unreachable' || seller.status === 'Not Contacted') ? 'No Visit' : 'N/A'}
                  </TableCell>
                  <TableCell>
                  {seller.images && seller.images.length > 0 ? (
  <ImageGrid>
    {seller.images.map((file, idx) => {
      const fileUrl = `http://localhost:5000${file}`;
      const isVideo = file.endsWith(".mp4") || file.endsWith(".webm") || file.endsWith(".ogg");

      return isVideo ? (
        <video
          key={idx}
          src={fileUrl}
          width="100"
          height="80"
          style={{ borderRadius: "8px" }}
          controls
        />
      ) : (
        <Image
          key={idx}
          src={fileUrl}
          alt={`Property ${seller.name}`}
        />
      );
    })}
  </ImageGrid>
) : (
  "No images"
)}

                  </TableCell>
                  <TableCell>{new Date(seller.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleViewClick(seller.id)} title="View">
                      <FaEye />
                    </ActionButton>
                    <ActionButton onClick={() => handleEditClick(seller.id)} title="Edit">
                      <FaEdit />
                    </ActionButton>
                    <ActionButton onClick={() => handleDeleteClick(seller.id)} title="Delete">
                      <FaTrash />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {showEditModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>Edit Seller Details</ModalHeader>
            <ModalBody>
              <form onSubmit={handleUpdate}>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Taluka</Label>
                  <Input
                    type="text"
                    value={formData.taluka}
                    onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Property Type</Label>
                  <Input
                    type="text"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Width (ft)</Label>
                  <Input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Length (ft)</Label>
                  <Input
                    type="number"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Area (sqft)</Label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>BHK</Label>
                  <Input
                    type="text"
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Floor</Label>
                  <Input
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Total Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add description..."
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Unreachable">Unreachable</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                </FormGroup>
                {(formData.status === 'Accepted' || formData.status === 'Follow Up') && (
                  <>
                    <FormGroup>
                      <Label>Follow Up Date</Label>
                      <Input
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Visit Date</Label>
                      <Input
                        type="date"
                        value={formData.visitDate}
                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      />
                    </FormGroup>
                  </>
                )}
                <FormGroup>
                  <Label>Remarks</Label>
                  <TextArea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Add remarks..."
                  />
                </FormGroup>
                <ModalFooter>
                  <CloseButton onClick={handleCancel}>Cancel</CloseButton>
                  <UpdateButton type="submit" disabled={!formData.status}>Update</UpdateButton>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {showViewModal && selectedSellerForView && (
        <Modal>
          <ModalContent>
            <ModalHeader>View Seller Details</ModalHeader>
            <ModalBody>
              <CardItem>
                <CardLabel>Name:</CardLabel>
                <CardValue>{selectedSellerForView.name}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Phone:</CardLabel>
                <CardValue>{selectedSellerForView.phone}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Title:</CardLabel>
                <CardValue>{selectedSellerForView.title || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Location:</CardLabel>
                <CardValue>{selectedSellerForView.location}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Taluka:</CardLabel>
                <CardValue>{selectedSellerForView.taluka || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Property Type:</CardLabel>
                <CardValue>{selectedSellerForView.propertyType}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Width (ft):</CardLabel>
                <CardValue>{selectedSellerForView.width || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Length (ft):</CardLabel>
                <CardValue>{selectedSellerForView.length || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Area (sqft):</CardLabel>
                <CardValue>{selectedSellerForView.area || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>BHK:</CardLabel>
                <CardValue>{selectedSellerForView.bhk || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Floor:</CardLabel>
                <CardValue>{selectedSellerForView.floor || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Total Price:</CardLabel>
                <CardValue>{selectedSellerForView.totalPrice ? `₹${selectedSellerForView.totalPrice}` : 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Description:</CardLabel>
                <CardValue>{selectedSellerForView.description || 'N/A'}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Status:</CardLabel>
                <CardValue>{selectedSellerForView.status}</CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Follow Up Date:</CardLabel>
                <CardValue>
                  {selectedSellerForView.follow_up_date
                    ? new Date(selectedSellerForView.follow_up_date).toLocaleDateString()
                    : (selectedSellerForView.status === 'Unreachable' || selectedSellerForView.status === 'Not Contacted') ? 'No Follow Up' : 'N/A'}
                </CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Visit Date:</CardLabel>
                <CardValue>
                  {selectedSellerForView.visit_date
                    ? new Date(selectedSellerForView.visit_date).toLocaleDateString()
                    : (selectedSellerForView.status === 'Unreachable' || selectedSellerForView.status === 'Not Contacted') ? 'No Visit' : 'N/A'}
                </CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Images:</CardLabel>
                <CardValue>
                  {selectedSellerForView.images && selectedSellerForView.images.length > 0 ? (
                    <ImageGrid>
                      {selectedSellerForView.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={`http://localhost:5000${img}`}
                          alt={`Property ${selectedSellerForView.name}`}
                        />
                      ))}
                    </ImageGrid>
                  ) : (
                    'No Images'
                  )}
                </CardValue>
              </CardItem>
              <CardItem>
                <CardLabel>Created At:</CardLabel>
                <CardValue>{new Date(selectedSellerForView.created_at).toLocaleDateString()}</CardValue>
              </CardItem>
            </ModalBody>
            <ModalFooter>
              <CloseButton onClick={handleCloseView}>Close</CloseButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default SellerList;