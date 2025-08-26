import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logobg.png";
import BrokerChargesModal from "./BrokerChargesModal";
import BrokerDetailsModal from "./BrokerDetailsModal";

const NavbarContainer = styled.nav`
  background: ${({ scrolled }) =>
    scrolled
      ? "linear-gradient(90deg, #151c22 0%, #003e73 50%, #005ca8 100%)"
      : "transparent"};
  color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
  padding: 24px 32px;
  width: 100vw;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ scrolled }) =>
    scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"};
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 1024px) {
    padding: 16px 24px;
  }

  @media (max-width: 890px) {
    padding: 12px 20px;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    gap: 1.5rem;
  }

  @media (max-width: 890px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: white;
  font-size: 1.5rem;

  img {
    border: 2px solid #005ca8;
    height: 50px;
    width: auto;
    object-fit: contain;
    border-radius: 50%;
    margin-right: 12px;
  }

  @media (max-width: 1024px) {
    font-size: 1.3rem;
    img {
      height: 45px;
    }
  }

  @media (max-width: 890px) {
    font-size: 1.2rem;
    img {
      height: 40px;
    }
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    img {
      height: 35px;
    }
  }
`;

const TalukaDropdown = styled.div`
  position: relative;
  cursor: pointer;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;

  &:hover > ul {
    display: block;
  }

  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (max-width: 890px) {
    font-size: 1rem;
    color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Hamburger = styled.div`
  display: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
  flex-shrink: 0;

  @media (max-width: 890px) {
    display: block;
    color: ${({ scrolled }) => (scrolled ? "#fff" : "#fff")};
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 2rem;
  color: white;
  font-weight: bold;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 1.2rem;

  @media (max-width: 1024px) {
    gap: 1.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 890px) {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100vw;
    max-width: 100%;
    flex-direction: column;
    padding: 20px 0;
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: ${({ scrolled }) =>
      scrolled
        ? "linear-gradient(90deg, #151c22 0%, #003e73 50%, #005ca8 100%)"
        : "#fff"};
    color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
    overflow-x: hidden;

    li {
      width: 100%;
      text-align: center;
      padding: 10px 0;
      color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};

      &:hover {
        background: ${({ scrolled }) => (scrolled ? "#003e73" : "#f0f0f0")};
        color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
      }

      svg {
        color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
      }
    }
  }

  @media (max-width: 480px) {
    top: 50px;
    padding: 15px 0;
    font-size: 0.9rem;
  }
`;

const NavItem = styled.li`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;

  &:hover > ul {
    display: block;
  }

  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (max-width: 890px) {
    width: 100%;
    justify-content: center;
    color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
    font-size: 1rem;

    a {
      color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const TalukaList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  background: ${({ scrolled }) =>
    scrolled
      ? "linear-gradient(90deg, #151c22 0%, #003e73 50%, #005ca8 100%)"
      : "#fff"};
  color: ${({ scrolled }) => (scrolled ? "#fff" : "#fff")};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  border-radius: 8px;
  display: none;
  min-width: 180px;
  max-width: 90vw;
  z-index: 100;
  box-sizing: border-box;

  li {
    padding: 10px 20px;
    cursor: pointer;
    color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};

    &:hover {
      background: #005ca8;
      color: #fff;
    }
  }

  @media (max-width: 890px) {
    width: 100%;
    max-width: 100%;
    left: 0;
    border-radius: 0;
    padding: 10px 0;

    li {
      padding: 12px 20px;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    min-width: 100%;
    li {
      padding: 10px 12px;
      font-size: 0.9rem;
    }
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  right: ${({ alignRight }) => (alignRight ? "0" : "auto")};
  left: ${({ alignRight }) => (alignRight ? "auto" : "0")};
  background: ${({ scrolled }) =>
    scrolled
      ? "linear-gradient(90deg, #151c22 0%, #003e73 50%, #005ca8 100%)"
      : "#fff"};
  color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 10px 0;
  border-radius: 8px;
  min-width: 160px;
  max-width: 90vw;
  display: ${({ show }) => (show ? "block" : "none")};
  z-index: 100;
  box-sizing: border-box;

  li {
    padding: 10px 20px;
    cursor: pointer;
    color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")};

    &:hover {
      background: #005ca8;
      color: #fff;
    }
  }

  @media (max-width: 890px) {
    width: 100%;
    max-width: 100%;
    left: 0;
    right: 0;
    border-radius: 0;
    padding: 10px 0;

    li {
      padding: 12px 20px;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    min-width: 100%;
    li {
      padding: 10px 12px;
      font-size: 0.9rem;
    }
  }
`;

const StyledLink = styled(Link)`
  color: ${({ scrolled }) => (scrolled ? "#fff" : "#000")} !important;
  text-decoration: none;
  padding: 10px 20px;
  display: block;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    background: #005ca8;
    color: #fff !important;
  }

  @media (max-width: 1024px) {
    padding: 8px 16px;
  }

  @media (max-width: 890px) {
    padding: 12px 20px;
    text-align: center;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const Navbar = ({ setSelectedTaluka, scrollToCardGrid }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [propertyDropdown, setPropertyDropdown] = useState(false);
  const [brokerDropdown, setBrokerDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [talukaOpen, setTalukaOpen] = useState(false);
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [showBrokerDetailsModal, setShowBrokerDetailsModal] = useState(false);

  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setPropertyDropdown(false);
        setBrokerDropdown(false);
        setTalukaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  useEffect(() => {
    setPropertyDropdown(false);
    setBrokerDropdown(false);
    setMenuOpen(false);
    setTalukaOpen(false);
  }, [location]);

  const handleTalukaSelect = (taluka) => {
    setSelectedTaluka(taluka);
    setTalukaOpen(false);
    scrollToCardGrid(); // Scroll to HomeCardGrid
  };

  return (
    <>
      <style>{"body { overflow-x: hidden; margin: 0;}"}</style>
      <NavbarContainer ref={navRef} scrolled={scrolled}>
        <LeftSection>
          <a href="/" style={{ textDecoration: "none" }} onClick={() => setSelectedTaluka(null)}>
            <Logo>
              <img src={logoImg} alt="Logo" />
            </Logo>
          </a>
          <TalukaDropdown
            scrolled={scrolled}
            style={{ color: "white" }}
            onClick={() => setTalukaOpen((prev) => !prev)}
          >
            Select Taluka <FaChevronDown />
            <TalukaList
              scrolled={scrolled}
              style={{ display: talukaOpen ? "block" : "none" }}
            >
              {[ "All",
                "Arni",
                "Umarkhed",
                "Kalamb",
                "Pandharkawada",
                "Ghatanji",
                "Zari-Jamni",
                "Darwha",
                "Digras",
                "Ner",
                "Pusad",
                "Babhulgaon",
                "Mahagaon",
                "Maregaon",
                "Yavatmal",
                "Ralegaon",
                "Wani",
              ].map((taluka) => (
                <li key={taluka} onClick={() =>taluka === "All" ? setSelectedTaluka(null) : handleTalukaSelect(taluka)}>
                  {taluka}
                </li>
              ))}
            </TalukaList>
          </TalukaDropdown>
        </LeftSection>

        <Hamburger
          scrolled={scrolled}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </Hamburger>

        <NavLinks isOpen={menuOpen} scrolled={scrolled}>
          <NavItem scrolled={scrolled}>
            <a href="/" onClick={() => setSelectedTaluka(null)}>Home</a>
          </NavItem>
          <NavItem
            scrolled={scrolled}
            onMouseEnter={() => setPropertyDropdown(true)}
            onMouseLeave={() => setPropertyDropdown(false)}
            onClick={() => setPropertyDropdown((prev) => !prev)}
          >
            Properties <FaChevronDown />
            <DropdownMenu show={propertyDropdown} scrolled={scrolled}>
              <li>
                <StyledLink
                  to="/buy"
                  scrolled={scrolled}
                  onClick={() => setPropertyDropdown(false)}
                >
                  Buy
                </StyledLink>
              </li>
              <li>
                <StyledLink
                  to="/sell"
                  scrolled={scrolled}
                  onClick={() => setPropertyDropdown(false)}
                >
                  Sell
                </StyledLink>
              </li>
            </DropdownMenu>
          </NavItem>
          <NavItem scrolled={scrolled}>
            <a href="/services">Services</a>
          </NavItem>
          <NavItem scrolled={scrolled}>
            <a href="/About">About Us</a>
          </NavItem>
          <NavItem scrolled={scrolled}>
            <a href="/contact">Contact Us</a>
          </NavItem>
          <NavItem
            scrolled={scrolled}
            onMouseEnter={() => setBrokerDropdown(true)}
            onMouseLeave={() => setBrokerDropdown(false)}
            onClick={() => setBrokerDropdown((prev) => !prev)}
          >
            Broker <FaChevronDown />
            <DropdownMenu show={brokerDropdown} scrolled={scrolled} alignRight>
              <li
                onClick={() => {
                  console.log("Broker Charges clicked, showBrokerModal:", true);
                  setShowBrokerModal(true);
                  setBrokerDropdown(false);
                }}
              >
                Charges
              </li>
              <li
                onClick={() => {
                  setShowBrokerDetailsModal(true);
                  setBrokerDropdown(false);
                }}
              >
                Login
              </li>
            </DropdownMenu>
          </NavItem>
          {/* <NavItem scrolled={scrolled}>
            <a href="#">Sold Out</a>
          </NavItem> */}
        </NavLinks>
      </NavbarContainer>

      <BrokerChargesModal
        show={showBrokerModal}
        onClose={() => setShowBrokerModal(false)}
      />
      <BrokerDetailsModal
        show={showBrokerDetailsModal}
        onClose={() => setShowBrokerDetailsModal(false)}
      />
    </>
  );
};

export default Navbar;