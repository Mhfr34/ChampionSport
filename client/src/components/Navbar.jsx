import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/logo.png";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { AiFillFire } from "react-icons/ai";
import Button from "./Button";
import {
  SearchRounded,
  FavoriteBorder,
  MenuRounded,
} from "@mui/icons-material";
import UploadProduct from "./UploadProduct"; // Import UploadProduct component

// Styled components
const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  color: white;
  }
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  @media (max-width: 768px) {
    gap: 260px;
  }
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  color: inherit;
  right: 0;
`;

const Logo = styled.img`
  height: 120px;
  width: 120px;
  margin-right: 30px;
  @media (max-width: 768px) {
    height: 80px;
    width: 80px;
  }
`;

const NavItems = styled.ul`
  display: ${({ isSearchOpen, isMobileOpen }) =>
    isSearchOpen || isMobileOpen ? "none" : "flex"};
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: ${({ isMobileOpen }) => (isMobileOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.bg};
    padding: 20px 0;
    gap: 16px;
  }
`;

const StyledNavLink = styled(RouterNavLink)`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
   display: flex;
   gap: 3px;
  align-items: center;  // Ensures icon and text are aligned
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const SearchBarContainer = styled.div`
  display: ${({ isSearchOpen }) => (isSearchOpen ? "flex" : "none")};
  width: 100%;
  max-width: 500px;
  background-color: #f1f1f1;
  border-radius: 20px;
  padding: 8px 16px;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const SearchIcon = styled(SearchRounded)`
  color: #333;
  font-size: 20px;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  padding: 8px 0;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 140px;
  background-color: ${({ theme }) => theme.bg};
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 200;

  & a {
    color: ${({ theme }) => theme.text_primary};
    text-decoration: none;
    padding: 8px 12px;
    display: block;
    font-weight: 500;
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;
// Modal styling for UploadProduct
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;

const Navbar = ({ openAuth, setOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState(""); // New state for search input
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadProductModalOpen, setIsUploadProductModalOpen] =
    useState(false); // New state for modal
  const navigate = useNavigate();
  const userIconRef = useRef(null);
  const scrollToSection = () => {
    // Scroll to the section with ID 'search-section'
    const section = document.getElementById('search-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    navigate("/"); 
  };
  const scrollToFooter = () => {
    // Scroll to the section with ID 'search-section'
    const section = document.getElementById('footer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    navigate("/"); 
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId"); // Remove userId
    setIsAuthenticated(false);
    setUserRole(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openUploadProductModal = () => {
    setIsDropdownOpen(false);
    setIsUploadProductModalOpen(true); // Open the modal
  };

  const closeUploadProductModal = () => {
    setIsUploadProductModalOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userIconRef.current && !userIconRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Nav>
      <NavbarContainer>
        <MobileIcon
          onClick={() => {
            setIsOpen(!isOpen);
            setIsSearchOpen(false);
          }}
        >
          <MenuRounded
            style={{ color: "inherit", cursor: "pointer", marginLeft: "10px" }}
          />
        </MobileIcon>

        <NavLogo>
          <Logo src={LogoImg} alt="Logo" />
        </NavLogo>

        <NavItems isSearchOpen={isSearchOpen} isMobileOpen={isOpen}>
          {/* Navigation links */}
          <StyledNavLink
            to="/"
            onClick={() => {
              setIsOpen(false);
              setIsSearchOpen(false);
            }}
          >
            Home
          </StyledNavLink>
          <StyledNavLink
          to="#"
          onClick={(e) => {
            e.preventDefault(); // Prevent default behavior for NavLink
            scrollToSection();
          }}
        >
            Shop
          </StyledNavLink>
          <StyledNavLink
            to="/New_arrivals"
            onClick={() => {
              setIsOpen(false);
              setIsSearchOpen(false);
            }}
          >
            New Arrivals{" "}
            <AiFillFire style={{ color: "#FF5733",fontSize:"18px" ,outlineColor:"black"}}  />
          </StyledNavLink>

          <StyledNavLink
            to="#"
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior for NavLink
              scrollToFooter();
            }}
          >
            Contact Us
          </StyledNavLink>
          {isOpen && (
            <StyledNavLink
              to="/favorite"
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(false);
              }}
            >
              Favorite
            </StyledNavLink>
          )}
          {isOpen &&
            (!isAuthenticated ? (
              <StyledNavLink
                to="#"
                onClick={() => {
                  setOpenAuth(true);
                  setIsOpen(false);
                  setIsSearchOpen(false);
                }}
              >
                Sign In
              </StyledNavLink>
            ) : (
              <StyledNavLink
                to="#"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                  setIsSearchOpen(false);
                }}
              >
                Logout
              </StyledNavLink>
            ))}
        </NavItems>

        <SearchBarContainer isSearchOpen={isSearchOpen}>
          <SearchIcon />
          <SearchInput
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search"
          />
          <CancelButton
            onClick={() => {
              setIsSearchOpen(false);
              setSearch("");
              navigate("/");
            }}
          >
            Cancel
          </CancelButton>
        </SearchBarContainer>

        <ButtonContainer>
          <SearchRounded
            style={{ color: "inherit", fontSize: "28px", cursor: "pointer" }}
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsOpen(false);
            }}
          />
          <StyledNavLink to="/favorite">
            <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
          </StyledNavLink>

          {userRole && (
            <div ref={userIconRef} onClick={toggleDropdown}>
              <FaCircleUser
                style={{
                  color: "black",
                  marginLeft: "8px",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
              />
              <DropdownMenu isOpen={isDropdownOpen}>
                {userRole === "ADMIN" && (
                  <button
                    onClick={openUploadProductModal}
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      padding: "8px 12px",
                      display: "block",
                      fontWeight: "500",
                    }}
                  >
                    Upload Product
                  </button>
                )}
              </DropdownMenu>
            </div>
          )}
          {!isAuthenticated ? (
            <Button
              text="Sign In"
              small
              onClick={() => setOpenAuth(!openAuth)}
            />
          ) : (
            <Button text="Logout" small onClick={handleLogout} />
          )}
        </ButtonContainer>
      </NavbarContainer>

      {/* Modal for UploadProduct */}
      {isUploadProductModalOpen && (
        <ModalOverlay onClick={closeUploadProductModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* Prevent modal close on content click */}
            <UploadProduct onClose={closeUploadProductModal} />
            <Button text="Close" small onClick={closeUploadProductModal} />
          </ModalContent>
        </ModalOverlay>
      )}
    </Nav>
  );
};

export default Navbar;
