import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";
import logoImg from '../assets/logobg.png'
import img1 from '../assets/bg1.jpg'
import img2 from '../assets/bg2.jpg'
import img3 from '../assets/bg3.jpeg'
import img4 from '../assets/bg4.jpg'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`

const images = [img1, img2, img3, img4]

const Section = styled.section`
  position: relative;
  width: 100%;
  height: 80vh;
  max-height: 900px;
  background-image: url(${({ bgImage }) => bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transition: background-image 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2rem;
  overflow: hidden;

  @media (max-width: 1024px) {
    height: auto;
    padding: 4rem 0;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    padding-top: 2rem;
  }
`

const DiagonalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background-color: rgba(0, 92, 168, 0.75);
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
  z-index: 1;

  /* Tablet & below → full width overlay */
  @media (max-width: 1024px) {
    width: 100%;
    clip-path: none;
  }
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 2;
  color: white;
  max-width: 580px;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    max-width: 90%;   /* prevent overflow */
    margin: 0 auto;   /* center horizontally */
    text-align: center;
    align-items: center;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;


const LogoCircle = styled.div`
  background: white;
  border-radius: 50%;
  width: clamp(50px, 15vw, 120px);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 1.5rem;
`

const LogoImage = styled.img`
  width: 130%;
  height: auto;
`

const SubHeading = styled(motion.p)`
  font-size: clamp(1.4rem, 2.5vw, 2.5rem);
  font-weight: 300;
  margin: 0;
`

const Heading = styled(motion.h1)`
  font-size: clamp(2rem, 4.5vw, 4rem);
  font-weight: 700;
  margin: 0.5rem 0;
`

const InfoText = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 400;
  margin: 0.2rem 0;
`

const CTAButton = styled(motion.button)`
  background: white;
  color: #151c22;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.1vw, 1.1rem);
  padding: 0.6rem 1.2rem;
  margin-top: 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  max-width: fit-content;

  @media (max-width: 1024px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
  }
`

const Hero = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])
  const navigate = useNavigate();

  return (
    <>
      <GlobalStyle />
      <Section bgImage={images[index]}>
        <DiagonalOverlay />
        <Content
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <LogoCircle>
            <LogoImage src={logoImg} alt="Logo" />
          </LogoCircle>

          <SubHeading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Discover Your Dream
          </SubHeading>

          <Heading
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            AFFORDABLE
          </Heading>

          <InfoText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            1 & 2 BHK HOMES
          </InfoText>

          <CTAButton
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => navigate('/sell')}
          >
            Post property
          </CTAButton>
        </Content>
      </Section>
    </>
  )
}

export default Hero
