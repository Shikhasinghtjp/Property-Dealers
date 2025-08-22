import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import HomeCard from "./HomeCard";
import BuyerModal from "./BuyerModal";

const Container = styled.div`
  max-width: 900px;
  margin: 120px auto 40px auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  color: #1f2937;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BackButton = styled.button`
  background-color: #005ca8;
  color: white;
  border: none;
  padding: 10px 16px;
  font-weight: bold;
  border-radius: 6px;
  margin-bottom: 20px;
  cursor: pointer;
`;

const MediaWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainMediaContainer = styled.div`
  flex: 3;
  height: 420px;
  overflow: hidden;
  border-radius: 12px;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const MainMedia = styled.div`
  width: 100%;
  height: 100%;
`;

const ThumbnailContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  justify-items: center;
  padding: 10px;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Thumbnail = styled.div`
  width: 120px;
  height: 67.5px; /* 16:9 aspect ratio */
  aspect-ratio: 16 / 9;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 45px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 34px;
  }
`;

const Info = styled.div`
  margin-top: 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Text = styled.p`
  margin: 6px 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Section = styled.div`
  margin-top: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #005ca8;
  color: white;
  border: none;
  padding: 10px 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  cursor: pointer;
`;

const BuyNowButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    background-color: #218838;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        let propertyData = null;
        let source = null;

        // Try fetching from admin properties first
        try {
          console.log(`Fetching admin property with ID: ${id}`);
          const adminResponse = await axios.get(`http://localhost:5000/api/property/${id}`);
          console.log("Admin Property Response:", adminResponse.data);
          propertyData = adminResponse.data;
          source = "admin";
        } catch (adminError) {
          console.log(`Admin property not found for ID ${id}:`, adminError.message);
          // Try seller property
          try {
            console.log(`Fetching seller property with ID: ${id}`);
            const sellerResponse = await axios.get(`http://localhost:5000/api/seller/${id}`);
            console.log("Seller Property Response:", sellerResponse.data);
            propertyData = sellerResponse.data;
            source = "seller";
          } catch (sellerError) {
            console.error(`Seller property not found for ID ${id}:`, sellerError.message);
            throw new Error(`Property not found for ID ${id} in either admin or seller data.`);
          }
        }

        if (!propertyData) {
          throw new Error("Property data is empty.");
        }

        // Normalize property data
        const normalizedProperty = {
          id: propertyData.id,
          images: Array.isArray(propertyData.images) ? propertyData.images : [],
          title: propertyData.title || (source === "seller" ? propertyData.name : "Untitled"),
          location: propertyData.location || "Unknown Location",
          taluka: propertyData.taluka || "N/A",
          bhk: propertyData.bhk || null,
          area: propertyData.area || null,
          floor: propertyData.floor || null,
          totalPrice: propertyData.totalPrice || null,
          propertyType: propertyData.propertyType || "Unknown",
          description: propertyData.description || "N/A",
          source,
        };

        console.log("Normalized Property:", normalizedProperty);
        setProperty(normalizedProperty);

        // Fetch related properties
        const adminPropertiesResponse = await axios.get("http://localhost:5000/api/property");
        const sellerPropertiesResponse = await axios.get("http://localhost:5000/api/seller/accepted");

        const adminProperties = Array.isArray(adminPropertiesResponse.data) ? adminPropertiesResponse.data : [];
        const sellerProperties = Array.isArray(sellerPropertiesResponse.data) ? sellerPropertiesResponse.data : [];

        console.log("Admin Properties:", adminProperties);
        console.log("Seller Properties:", sellerProperties);

        // Normalize admin properties
        const normalizedAdmin = adminProperties.map(prop => ({
          id: prop.id,
          images: Array.isArray(prop.images) ? prop.images : [],
          title: prop.title || "Untitled",
          location: prop.location || "Unknown Location",
          bhk: prop.bhk || null,
          area: prop.area || null,
          floor: prop.floor || null,
          propertyType: prop.propertyType || "Unknown",
          taluka: prop.taluka || "N/A",
          totalPrice: prop.totalPrice || null,
          sellerId: prop.broker_id || null,
          isSeller: false,
        }));

        // Normalize seller properties
        const normalizedSeller = sellerProperties.map(prop => ({
          id: prop.id,
          images: Array.isArray(prop.images) ? prop.images : [],
          title: prop.title || prop.name || "Untitled",
          location: prop.location || "Unknown Location",
          bhk: prop.bhk || null,
          area: prop.area || null,
          floor: prop.floor || null,
          propertyType: prop.propertyType || "Unknown",
          taluka: prop.taluka || "N/A",
          totalPrice: prop.totalPrice || null,
          sellerId: null,
          isSeller: true,
        }));

        // Merge and filter related properties
        const allProperties = [...normalizedAdmin, ...normalizedSeller];
        console.log("All Properties:", allProperties);

        const relatedProperties = allProperties.filter(
          (p) =>
            p.propertyType &&
            normalizedProperty.propertyType &&
            p.propertyType.toLowerCase() === normalizedProperty.propertyType.toLowerCase() &&
            p.id !== parseInt(id)
        );
        console.log("Related Properties:", relatedProperties);

        setRelated(relatedProperties);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(`Failed to load property details for ID ${id}. Please try again later.`);
        toast.error(`Failed to load property details for ID ${id}. Please try again later.`);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Auto change main media every 3s
  useEffect(() => {
    if (property && property.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentMainIndex((prev) => (prev + 1) % property.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [property]);

  const handleThumbnailClick = (index) => {
    setCurrentMainIndex(index);
  };

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!property) return <Container>Property not found.</Container>;

  const allMedia = property.images.filter((media) => !/\.(mp4|mpeg|webm|mov|avi)$/i.test(media));
  const mainMedia = allMedia[currentMainIndex] || "https://placehold.co/360x200?text=No+Image";

  return (
    <Container>
      <PageTitle>Property Details</PageTitle>
      <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
      <MediaWrapper>
        <MainMediaContainer>
          <MainMedia>
            <img
              src={`http://localhost:5000${mainMedia}`}
              alt={property.title || "Property"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                console.error(`Failed to load media: http://localhost:5000${mainMedia}`);
                e.target.src = "https://placehold.co/360x200?text=No+Image";
              }}
            />
          </MainMedia>
        </MainMediaContainer>
        <ThumbnailContainer>
          {allMedia.map((media, index) => (
            <Thumbnail
              key={index}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={`http://localhost:5000${media}`}
                alt="Thumbnail"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  console.error(`Failed to load thumbnail: http://localhost:5000${media}`);
                  e.target.src = "https://placehold.co/120x67.5?text=No+Image";
                }}
              />
            </Thumbnail>
          ))}
        </ThumbnailContainer>
      </MediaWrapper>
      <Info>
        <Title>{property.title}</Title>
        <Text><strong>Location:</strong> {property.location}</Text>
        <Text><strong>Taluka:</strong> {property.taluka}</Text>
        {property.propertyType === "flat" && property.bhk && (
          <Text><strong>Bedrooms:</strong> {property.bhk}</Text>
        )}
        {property.propertyType === "shop" && property.floor && (
          <Text><strong>Floor:</strong> {property.floor}</Text>
        )}
        <Text><strong>Area:</strong> {property.area ? `${property.area} sqft` : "N/A"}</Text>
        <Text><strong>Price:</strong> ₹{property.totalPrice ? property.totalPrice.toLocaleString("en-IN") : "N/A"}</Text>
        <Text><strong>Type:</strong> {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</Text>
        <Text><strong>Description:</strong> {property.description}</Text>
      </Info>

      <Section>
        <BuyNowButton onClick={() => setShowBuyerModal(true)}>
          Enquire Now
        </BuyNowButton>
      </Section>

      {related.length > 0 && (
        <Section>
          <h3>You Might Also Like</h3>
          <CardGrid>
            {related.map((p) => (
              <HomeCard
                key={p.id}
                id={p.id}
                images={p.images}
                title={p.title}
                location={p.location}
                bhk={p.bhk}
                area={p.area}
                floor={p.floor}
                propertyType={p.propertyType}
                taluka={p.taluka}
                price={p.totalPrice}
                sellerId={p.sellerId}
                isSeller={p.isSeller}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {showModal && (
        <ModalOverlay>
          <Modal>
            <CloseBtn onClick={() => setShowModal(false)}>×</CloseBtn>
            <Form onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent to agent!");
              setShowModal(false);
            }}>
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <SubmitButton type="submit">Send Message</SubmitButton>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      <BuyerModal
        isOpen={showBuyerModal}
        onClose={() => setShowBuyerModal(false)}
        property={{
          title: property.title,
          propertyType: property.propertyType,
          location: property.location,
          bhk: property.bhk,
          area: property.area,
          floor: property.floor,
          totalPrice: property.totalPrice,
          description: property.description,
          taluka: property.taluka,
        }}
      />
    </Container>
  );
};

export default PropertyDetails;