import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Professional icons from react-icons
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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

const thStyle = {
  padding: "12px 16px",
  fontSize: "0.95rem",
  fontWeight: "600",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "0.9rem",
  color: "#334155",
};

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  color: ${(props) => (props.color ? props.color : "#2563eb")};
  font-size: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => (props.color ? `${props.color}cc` : "#1d4ed8")};
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px; /* Increased width for better spacing */
  max-height: 80vh;
  overflow-y: auto;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased gap for better spacing */
`;

const LabelValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Increased gap between label and value */
`;

const Label = styled.div`
  font-weight: bold;
  color: #1e293b;
  min-width: 100px; /* Fixed width for labels to prevent compression */
  text-align: right;
`;

const Value = styled.div`
  color: #334155;
  flex: 1;
  padding: 5px 0;
  border-bottom: 1px solid #e2e8f0;
`;

const EditPopup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased gap between fields */
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #d1d5db;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-bottom: 2px solid #005ca8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #d1d5db;
  font-size: 0.9rem;
  outline: none;
  appearance: none;
  background: transparent;

  &:focus {
    border-bottom: 2px solid #005ca8;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #d1d5db;
  font-size: 0.9rem;
  min-height: 60px;
  resize: vertical;
  outline: none;

  &:focus {
    border-bottom: 2px solid #005ca8;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;

  &:hover {
    background: #059669;
  }
`;

const BrokerList = () => {
  const [brokers, setBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [editBroker, setEditBroker] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [followUpRange, setFollowUpRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/broker");
        setBrokers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBrokers();
  }, []);

  useEffect(() => {
    let filtered = brokers;
    if (statusFilter !== "All") {
      filtered = filtered.filter((broker) => broker.leadStatus === statusFilter);
    }
    if (followUpRange[0].startDate && followUpRange[0].endDate) {
      const start = new Date(followUpRange[0].startDate);
      const end = new Date(followUpRange[0].endDate);
      filtered = filtered.filter((broker) => {
        if (!broker.followup) return false;
        const followDate = new Date(broker.followup);
        return followDate >= start && followDate <= end;
      });
    }
    setBrokers([...filtered]); // Update brokers state with filtered results
  }, [statusFilter, followUpRange]);

  const handleUpdateBroker = async (brokerId, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/broker/${brokerId}`, updates);
      setBrokers((prevBrokers) =>
        prevBrokers.map((broker) =>
          broker.id === brokerId ? { ...broker, ...updates } : broker
        )
      );
      setEditBroker(null);
      toast.success("Broker updated successfully!");
    } catch (err) {
      console.error("Error updating broker:", err);
      toast.error("Failed to update broker.");
    }
  };

  const handleDeleteBroker = async (brokerId) => {
    if (window.confirm("Are you sure you want to delete this broker?")) {
      try {
        await axios.delete(`http://localhost:5000/api/broker/${brokerId}`);
        setBrokers((prevBrokers) => prevBrokers.filter((broker) => broker.id !== brokerId));
        toast.success("Broker deleted successfully!");
      } catch (err) {
        console.error("Error deleting broker:", err);
        toast.error("Failed to delete broker.");
      }
    }
  };

  const handleViewBroker = (broker) => {
    setSelectedBroker(broker);
  };

  const handleEditBroker = (broker) => {
    setEditBroker(broker);
  };

  const handleClosePopup = () => {
    setSelectedBroker(null);
    setEditBroker(null);
  };

  const handleSaveEdit = () => {
    if (editBroker) {
      const { id, name, email, phone, address, leadStatus, followup, remarks } = editBroker;
      handleUpdateBroker(id, { name, email, phone, address, leadStatus, followup, remarks });
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", position: "relative" }}>
      <ToastContainer />
      <Title>All Broker Listings</Title>
      <NavBar>
        <NavLinks>
          <a href="#" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </a>
          <a href="#" onClick={() => navigate("/admin/broker")} className="active">
            Broker
          </a>
        </NavLinks>
        <Filters>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Contacted">Contacted</option>
            <option value="NotContacted">Not Contacted</option>
            <option value="Unreachable">Unreachable</option>
          </FilterSelect>
          <DateRangeWrapper>
            <DateRangeButton onClick={() => setShowFollowUpPicker(!showFollowUpPicker)}>
              {followUpRange[0].startDate && followUpRange[0].endDate
                ? `${followUpRange[0].startDate.toLocaleDateString()} - ${followUpRange[0].endDate.toLocaleDateString()}`
                : "Select Follow-up Range"}
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
        </Filters>
      </NavBar>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2563eb", color: "#fff", textAlign: "left" }}>
              <th style={thStyle}>Full Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone No</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Lead Status</th>
              <th style={thStyle}>Followup</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {brokers.map((broker, index) => (
              <tr
                key={broker.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f1f5f9" : "#fff",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#f1f5f9" : "#fff")
                }
              >
                <td style={tdStyle}>{broker.name}</td>
                <td style={tdStyle}>{broker.email}</td>
                <td style={tdStyle}>{broker.phone}</td>
                <td style={tdStyle}>{broker.address}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color:
                        broker.leadStatus === "Contacted"
                          ? "#065f46"
                          : broker.leadStatus === "NotContacted"
                          ? "#92400e"
                          : broker.leadStatus === "Unreachable"
                          ? "#dc2626"
                          : "#404040",
                      backgroundColor:
                        broker.leadStatus === "Contacted"
                          ? "#d1fae5"
                          : broker.leadStatus === "NotContacted"
                          ? "#fef3c7"
                          : broker.leadStatus === "Unreachable"
                          ? "#fee2e2"
                          : "#e5e7eb",
                    }}
                  >
                    {broker.leadStatus}
                  </span>
                </td>
                <td style={tdStyle}>
                  {broker.followup ? new Date(broker.followup).toLocaleDateString() : "No Followup"}
                </td>
                <td style={tdStyle}>
                  <ActionButton color="#2563eb" onClick={() => handleViewBroker(broker)}>
                    <FaEye />
                  </ActionButton>
                  <ActionButton color="#10b981" onClick={() => handleEditBroker(broker)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton color="#ef4444" onClick={() => handleDeleteBroker(broker.id)}>
                    <FaTrash />
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBroker && (
        <>
          <PopupOverlay onClick={handleClosePopup} />
          <Popup>
            <CloseButton onClick={handleClosePopup} />
            <Card>
              <LabelValueContainer>
                <Label>Full Name:</Label>
                <Value>{selectedBroker.name}</Value>
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Email:</Label>
                <Value>{selectedBroker.email}</Value>
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Phone No:</Label>
                <Value>{selectedBroker.phone}</Value>
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Address:</Label>
                <Value>{selectedBroker.address}</Value>
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Lead Status:</Label>
                <Value>{selectedBroker.leadStatus}</Value>
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Followup:</Label>
                <Value>{selectedBroker.followup ? new Date(selectedBroker.followup).toLocaleDateString() : "No Followup"}</Value>
              </LabelValueContainer>
            </Card>
          </Popup>
        </>
      )}

      {editBroker && (
        <>
          <PopupOverlay onClick={handleClosePopup} />
          <Popup>
            <CloseButton onClick={handleClosePopup} />
            <EditPopup>
              <LabelValueContainer>
                <Label>Full Name:</Label>
                <Input
                  value={editBroker.name || ""}
                  onChange={(e) => setEditBroker({ ...editBroker, name: e.target.value })}
                />
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Email:</Label>
                <Input
                  value={editBroker.email || ""}
                  onChange={(e) => setEditBroker({ ...editBroker, email: e.target.value })}
                />
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Phone No:</Label>
                <Input
                  value={editBroker.phone || ""}
                  onChange={(e) => setEditBroker({ ...editBroker, phone: e.target.value })}
                />
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Address:</Label>
                <Input
                  value={editBroker.address || ""}
                  onChange={(e) => setEditBroker({ ...editBroker, address: e.target.value })}
                />
              </LabelValueContainer>
              <LabelValueContainer>
                <Label>Lead Status:</Label>
                <Select
                  value={editBroker.leadStatus || "NotContacted"}
                  onChange={(e) => setEditBroker({ ...editBroker, leadStatus: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Contacted">Contacted</option>
                  <option value="NotContacted">Not Contacted</option>
                  <option value="Unreachable">Unreachable</option>
                </Select>
              </LabelValueContainer>
              {(editBroker.leadStatus === "Active" || editBroker.leadStatus === "Inactive" || editBroker.leadStatus === "Contacted") && (
                <>
                  <LabelValueContainer>
                    <Label>Followup:</Label>
                    <Input
                      type="date"
                      value={editBroker.followup ? new Date(editBroker.followup).toISOString().split("T")[0] : ""}
                      onChange={(e) => setEditBroker({ ...editBroker, followup: e.target.value ? new Date(e.target.value) : null })}
                    />
                  </LabelValueContainer>
                  <LabelValueContainer>
                    <Label>Remarks:</Label>
                    <Textarea
                      value={editBroker.remarks || ""}
                      onChange={(e) => setEditBroker({ ...editBroker, remarks: e.target.value })}
                      placeholder="Add remarks here..."
                    />
                  </LabelValueContainer>
                </>
              )}
              <SaveButton onClick={handleSaveEdit}>Save</SaveButton>
            </EditPopup>
          </Popup>
        </>
      )}
    </div>
  );
};

export default BrokerList;