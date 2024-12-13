import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import ChangePassword from "./components/ChangePassword";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/Footer";
import NewArrivals from "./components/NewArrivals";
import ProductDetails from "./components/ProductDetails";
import FilterProduct from "./pages/FilterProduct";
import Favorite from "./pages/Favorite";
import Search from "./pages/Search";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const [openAuth, setOpenAuth] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <Navbar setOpenAuth={setOpenAuth} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/change-password/:token" element={<ChangePassword onClose={() => setShowChangePassword(false)} />} />
            <Route path="/New_arrivals" element={<NewArrivals />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/filter-product" element={<FilterProduct />  } />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/search" element={<Search/>} />
          </Routes>
          {openAuth && (
            <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
          )}
          {showChangePassword && (
            <ChangePassword onClose={() => setShowChangePassword(false)} />
          )}
          <Footer />  {/* Footer is placed here to display at the bottom */}
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
