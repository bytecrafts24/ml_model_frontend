import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginModal from './loginModal';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleDrawer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Check if login was successful
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap style={{ color: '#000000' }}>
              Bytecrafts
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
            {isLoggedIn ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  style={{ color: '#000000' }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                color="inherit" 
                startIcon={<AccountCircle />} 
                style={{ color: '#000000' }}
                onClick={handleLoginClick}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal open={modalOpen} handleClose={handleCloseModal} />  
    </>
  );
};

export default Navbar;
