import React, { useRef } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import VideoBanner from "../components/VideoBanner";
import { category } from "../utils/data";
import ProductCategoryCard from "../components/ProductCategoryCard";
import BrandsCard from "../components/BrandsCard";
import { motion } from "framer-motion";
import NewArrivalsLimited from "../components/NewArrivalsLimited";
import Branches from "../components/Branches";

// Styled components
const Container = styled.div`
  padding-bottom: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 2px 1px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled(motion.div)`
  // Updated to motion.div
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section1 = styled(motion.div)`
  // Updated to motion.div
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  @media (min-width: 800px) {
    height: 630px;
  }
`;



const Title = styled(motion.div)`
  // Updated to motion.div
  font-size: 28px;
  font-weight: bold;
  color: black;
  font-size: 50px;
  display: flex;
  margin-bottom: 18px;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
  text-align: center;
  @media (max-width: 768px) {
    padding: 0 30px;
    font-size: 40px;
    margin-bottom: 8px;
  }
`;



const CardWrapper = styled(motion.div)`
  // Updated to motion.div
  width: 100%;
  margin-bottom: 30px;
`;

const Title3 = styled(motion.h2)`
  // Updated to motion.h2
  font-size: 35px;
  font-family: sans-serif;
  font-weight: bold;
  color: black;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;
// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

// Component
const Home = () => {
  const searchSectionRef = useRef(null);
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container>
      <Section1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Title>Champions Keep Playing Until They Win.</Title>
        <VideoBanner />
      </Section1>

      <Section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        style={{ alignItems: "center" }}
        id="search-section"
        ref={searchSectionRef}
      >
        <Title>WHAT ARE YOU SEARCHING FOR?</Title>
        <CardWrapper>
          <Slider {...sliderSettings}>
            {category.map((cat) => (
              <ProductCategoryCard key={cat.name} category={cat} />
            ))}
          </Slider>
        </CardWrapper>
      </Section>

     
        <BrandsCard />
      
        <Section
>
  <Title3>New Arrivals - All Categories</Title3>
  <NewArrivalsLimited />
</Section>
      <Section>
        <Title3>Our Branches</Title3>
        <Branches />
      </Section>
    </Container>
  );
};

export default Home;
