import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Wrapper = styled.div`
  padding: 1rem;
  background: #ffffff;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: #374151;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 8px;

  a {
    text-decoration: none;
    color: #1e40af;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f3f4f6;
      color: #1e3a8a;
    }

    &.active {
      background-color: #1e40af;
      color: white;
    }

    &:after {
      content: "/";
      margin-left: 8px;
      color: #9ca3af;
    }

    &:last-child:after {
      content: "";
    }
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  select {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #1f2937;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: #1e40af;
    }

    @media (max-width: 768px) {
      width: 100%;
      padding: 3px 6px;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const TableContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  table-layout: fixed;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
`;

const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: ${({ width }) => width || "auto"};

  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.7rem;
    width: ${({ mobileWidth }) => mobileWidth || "auto"};
  }
`;

const Tr = styled.tr`
  transition: background 0.2s ease;
  &:nth-child(even) {
    background: #f9fafb;
  }
`;

const Td = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  color: #1f2937;
  vertical-align: middle;
  max-width: 120px;
  min-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding: 0.4rem;
    font-size: 0.7rem;
    max-width: 80px;
    min-width: 60px;
  }

  &:last-child {
    position: sticky;
    right: 0;
    background: white;
    box-shadow: -1px 0 2px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.25rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.25rem 0.2rem;
    }
  }
`;


const ActionButton = styled.button`
  border: none;
  background: #fff;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-right: 0.3rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    margin-right: 0;
    margin-bottom: 0.2rem;
  }

  &:last-child {
    margin-right: 0;
    margin-bottom: 0;
  }
`;

const EditButton = styled(ActionButton)`
  color: #3b82f6;
  &:hover {
    background: #eff6ff;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #ef4444;
  &:hover {
    background: #fee2e2;
  }
`;

const LoadingRow = styled.tr`
  animation: pulse 1.5s infinite ease-in-out;
  @keyframes pulse {
    0% {
      background: #f3f4f6;
    }
    50% {
      background: #e5e7eb;
    }
    100% {
      background: #f3f4f6;
    }
  }
`;

const LoadingTd = styled.td`
  padding: 0.75rem;
  height: 40px;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem;
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 120px; /* table ke hisaab se */
`;

const Image = styled.img`
  width: 50px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
`;


const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    taluka: "",
    priceSort: "",
    type: "",
  });
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        taluka: filters.taluka || undefined,
        sortPrice: filters.priceSort || undefined,
        propertyType: filters.type || undefined,
      };
      const res = await axios.get("http://localhost:5000/api/property", {
        params,
      });
      console.log("Fetched properties:", res.data);
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters.taluka, filters.priceSort, filters.type]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/property/${id}`
        );
        if (response.status === 200) {
          setProperties(properties.filter((prop) => prop.id !== id));
          toast.success("Property deleted successfully");
        }
      } catch (err) {
        console.error("Failed to delete property", err);
        toast.error(
          "Failed to delete property: " +
            (err.response?.data?.error || "Unknown error")
        );
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-property/${id}`);
  };

  // Get unique talukas and types from properties for filter options
  const uniqueTalukas = [
    ...new Set(properties.map((p) => p.taluka).filter(Boolean)),
  ];
  const uniqueTypes = [
    ...new Set(properties.map((p) => p.propertyType).filter(Boolean)),
  ];

  return (
    <Wrapper>
      <Title>Manage Properties</Title>
      <NavBar>
        <NavLinks>
          <a href="#" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </a>
          <a href="#" onClick={() => navigate("/admin/properties")}>
            Manage Property
          </a>
        </NavLinks>
        <Filters>
          <select
            value={filters.taluka}
            onChange={(e) => setFilters({ ...filters, taluka: e.target.value })}
          >
            <option value="">All Talukas</option>
            {uniqueTalukas.map((taluka) => (
              <option key={taluka} value={taluka}>
                {taluka}
              </option>
            ))}
          </select>
          <select
            value={filters.priceSort}
            onChange={(e) =>
              setFilters({ ...filters, priceSort: e.target.value })
            }
          >
            <option value="">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Filters>
      </NavBar>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th width="10%">Title</Th>
              <Th width="10%">Location</Th>
              <Th width="8%">Taluka</Th>
              <Th width="15%">Description</Th>
              <Th width="8%">Price</Th>
              <Th width="8%">Type</Th>
              <Th width="10%">Image</Th>
              <Th width="5%">BHK</Th>
              <Th width="8%">Area (sqft)</Th>
              <Th width="5%">Floor</Th>
              <Th width="13%" mobileWidth="20%">
                Actions
              </Th>
            </Tr>
          </Thead>
          <tbody>
            {loading ? (
              Array(5)
                .fill()
                .map((_, i) => (
                  <LoadingRow key={i}>
                    <LoadingTd colSpan={11}></LoadingTd>
                  </LoadingRow>
                ))
            ) : properties.length === 0 ? (
              <Tr>
                <Td colSpan={11}>
                  <EmptyMessage>No properties found.</EmptyMessage>
                </Td>
              </Tr>
            ) : (
              properties.map((property) => {
                const imageUrl =
                  property.images &&
                  Array.isArray(property.images) &&
                  property.images.length > 0
                    ? `http://localhost:5000${property.images[0].replace(
                        /\/uploads\//i,
                        "/Uploads/"
                      )}`
                    : "https://placehold.co/80x48?text=No+Image";

                console.log(`Property ${property.id} image URL:`, imageUrl);

                return (
                  <Tr key={property.id}>
                    <Td title={property.title}>{property.title}</Td>
                    <Td title={property.location}>{property.location}</Td>
                    <Td title={property.taluka}>{property.taluka || "-"}</Td>
                    <Td title={property.description}>
                      {property.description || "-"}
                    </Td>
                    <Td>
                      ₹
                      {property.totalPrice != null
                        ? property.totalPrice.toLocaleString()
                        : "-"}
                    </Td>
                    <Td>{property.propertyType || "-"}</Td>
                    <Td>
                      {property.images &&
                      Array.isArray(property.images) &&
                      property.images.length > 0 ? (
                        <ImageGrid>
                          {property.images.map((img, idx) => {
                            const imageUrl = `http://localhost:5000${img.replace(
                              /\/uploads\//i,
                              "/Uploads/"
                            )}`;
                            return (
                              <Image
                                key={idx}
                                src={imageUrl}
                                alt={property.title || "Property"}
                                onError={(e) =>
                                  (e.target.src =
                                    "https://placehold.co/80x48?text=No+Image")
                                }
                              />
                            );
                          })}
                        </ImageGrid>
                      ) : (
                        "No Images"
                      )}
                    </Td>

                    <Td>{property.bhk || "-"}</Td>
                    <Td>
                      {property.area != null
                        ? property.area.toLocaleString()
                        : "-"}
                    </Td>
                    <Td>{property.floor || "-"}</Td>
                    <Td>
                      <EditButton
                        onClick={() => handleEdit(property.id)}
                        title="Edit Property"
                      >
                        <FaEdit />
                      </EditButton>
                      <DeleteButton
                        onClick={() => handleDelete(property.id)}
                        title="Delete Property"
                      >
                        <FaTrash />
                      </DeleteButton>
                    </Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableContainer>
    </Wrapper>
  );
};

export default PropertyList;
