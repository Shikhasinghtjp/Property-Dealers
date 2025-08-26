import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { FaBed, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";
import { MdPhotoCamera, MdStairs } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

// Styled components (unchanged)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 10px 0;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 5px 0;
  }
`;


const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 360px;
  transition: all 0.35s ease;
  margin: 0 auto;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }

  /* Border bottom animation */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #005ca8, #38bdf8);
    transition: width 0.4s ease, left 0.4s ease;
    border-radius: 2px;
  }

  &:hover::after {
    width: 100%;
    left: 0;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
  border-bottom: 1px solid #f1f5f9;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
`;

const Location = styled.div`
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  svg {
    margin-right: 6px;
    color: #005ca8;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  color: #334155;
  margin-bottom: 14px;
  justify-content: ${({ propertyType }) =>
    propertyType === "Flat" || propertyType === "Shop"
      ? "space-between"
      : "flex-start"};

  div {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    padding: 4px 8px;
    border-radius: 8px;
  }

  svg {
    color: #005ca8;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: #005ca8;
  font-weight: 700;
  align-items: center;
  font-size: 16px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;

  ${Card}:hover & {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const Tag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #facc15;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

const ForSaleTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #facc15;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const HomeCard = ({
  id,
  sellerId,
  title,
  location,
  bhk,
  area,
  floor,
  propertyType,
  taluka,
  price,
  images: propImages, // Fallback images from props
  isSeller, // Indicates if this is a Seller record
}) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/property/${id}`);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const setCurrentImageIndex = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images based on whether it's a Seller or Property card
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        let fetchedImages = [];

        if (isSeller) {
          // Fetch Seller data
          const sellerResponse = await fetch(`http://localhost:5000/api/seller/${id}`);
          if (!sellerResponse.ok) {
            console.warn(`Seller API failed: ${sellerResponse.status} ${sellerResponse.statusText}`);
          } else {
            const sellerData = await sellerResponse.json();
            console.log("Seller API response:", sellerData);
            fetchedImages = Array.isArray(sellerData.images)
              ? sellerData.images : [];
          }
        } else {
          // Fetch Property data
          const propertyResponse = await fetch(`http://localhost:5000/api/property/${id}`);
          if (!propertyResponse.ok) {
            console.warn(`Property API failed: ${propertyResponse.status} ${propertyResponse.statusText}`);
          } else {
            const propertyData = await propertyResponse.json();
            console.log("Property API response:", propertyData);
            fetchedImages = Array.isArray(propertyData.images)
              ? propertyData.images  : [];
          }

          // Fetch Seller images if sellerId (broker_id) is provided
          if (sellerId) {
            const sellerResponse = await fetch(`http://localhost:5000/api/seller/${sellerId}`);
            if (!sellerResponse.ok) {
              console.warn(`Seller API failed for sellerId: ${sellerResponse.status} ${sellerResponse.statusText}`);
            } else {
              const sellerData = await sellerResponse.json();
              console.log("Seller API response (for Property):", sellerData);
              const sellerImages = Array.isArray(sellerData.images)
                ? sellerData.images : [];
              fetchedImages = [...new Set([...fetchedImages, ...sellerImages])];
            }
          }
        }

        // Use fetched images or fallback to propImages
        setImages(fetchedImages.length > 0 ? fetchedImages : Array.isArray(propImages) ? propImages : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Failed to fetch images: ${err.message}`);
        setImages(Array.isArray(propImages) ? propImages : []);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImages();
    } else {
      console.error("Missing ID for card");
      setError("Missing ID");
      setImages(Array.isArray(propImages) ? propImages : []);
      setLoading(false);
    }
  }, [id, sellerId, isSeller, propImages]);

  // Auto change image every 3s
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);


  const displayType = propertyType && typeof propertyType === "string" 
    ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) 
    : "Unknown";

  return (
    <Card
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={handleClick}
    >
      <ImageWrapper>
        {loading ? (
          <PropertyImage
            src="https://placehold.co/360x200?text=Loading..."
            alt="Loading"
          />
        ) : error ? (
          <PropertyImage
            src="https://placehold.co/360x200?text=Error+Loading+Images"
            alt="Error"
          />
        ) : images.length > 0 ? (
          images.map((file, idx) => {
            const fileUrl = `http://localhost:5000${file}`;
            const isVideo = /\.(mp4|webm|ogg)$/i.test(file);
        
            return isVideo ? (
              <video
                key={idx}
                src={fileUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                controls
                muted
              />
            ) : (
              <PropertyImage
                key={idx}
                src={fileUrl}
                alt={title || "Property"}
                onError={(e) => {
                  console.error("Image load error:", fileUrl);
                  e.target.src = "https://placehold.co/360x200?text=Image+Not+Found";
                }}
              />
            );
          })
        ) : (
          <PropertyImage
            src="https://placehold.co/360x200?text=No+Media"
            alt="No property"
          />
        )}
        <Overlay />
        <Tag>
          <MdPhotoCamera style={{ marginRight: "4px" }} />
          {loading ? "..." : images.length}
        </Tag>
        <ForSaleTag>{displayType}</ForSaleTag>
      </ImageWrapper>

      <CardContent>
        <Title>{title || "Untitled Property"}</Title>
        <Location>
          <FaMapMarkerAlt /> {location || "Unknown Location"}, {taluka || "Unknown Taluka"}
        </Location>

        <InfoRow propertyType={propertyType}>
          {propertyType === "Flat" && bhk && bhk !== "" && (
            <div>
              <FaBed /> {bhk} 
            </div>
          )}
          {propertyType === "Shop" && floor && floor !== "" && (
            <div>
              <MdStairs /> Floor {floor}
            </div>
          )}
          {(propertyType === "Farm" || propertyType === "Land" || area) && (
            <div>
              <FaRulerCombined /> {area ? `${area} sqft` : "N/A"}
            </div>
          )}
        </InfoRow>

        <PriceRow>
          <span>₹ {price ? price.toLocaleString("en-IN") : "N/A"}</span>
        </PriceRow>
      </CardContent>
    </Card>
  );
};

export const HomeCardGrid = ({ properties,selectedTaluka }) => {
  const filteredProperties = selectedTaluka ? properties.filter((property) => property.taluka === selectedTaluka) : properties;
  return (
    <Container>
      <CardGrid>
        {filteredProperties && filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <HomeCard
              key={property.id}
              id={property.id}
              sellerId={property.sellerId}
              title={property.title}
              location={property.location}
              bhk={property.bhk}
              area={property.area}
              floor={property.floor}
              propertyType={property.propertyType}
              taluka={property.taluka}
              price={property.totalPrice}
              images={property.images}
              isSeller={property.isSeller || false}
            />
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No properties found
          </p>
        )}
      </CardGrid>
    </Container>
  );
};

export default HomeCard;