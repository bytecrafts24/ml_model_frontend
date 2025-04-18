import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  Box,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { drawerItems } from './drawerItems';
import SidebarItem from './SidebarItem';
import LoginModal from './loginModal';

const drawerWidth = 240;
const miniDrawerWidth = 70;
const mobileDrawerWidth = 60;

export default function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [modalOpen, setModalOpen] = useState(false); // State for Login Modal
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev); 
  };

  const handleToggle = (id) => {
    setOpenSections((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  const handleSelectItem = () => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleLoginClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.jpeg" 
              alt="Logo" 
              style={{ height: 40, marginRight: '10px' }} 
            />
            <Typography variant="h6" noWrap style={{ color: '#000000' }}>
              Bytecrafts
            </Typography>
            <IconButton
              edge="start"
              color="#000000"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
            <Button 
              color="inherit" 
              startIcon={<AccountCircle />} 
              style={{ color: '#000000' }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal open={modalOpen} handleClose={handleCloseModal} />

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'} 
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerOpen ? (isMobile ? mobileDrawerWidth : drawerWidth) : miniDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? (isMobile ? mobileDrawerWidth : drawerWidth) : miniDrawerWidth,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            overflowY: 'auto', // Enable vertical scrolling
            marginTop: isMobile ? '55px' : '64px',
            height: 'calc(100% - 64px)', // Adjust height to account for AppBar
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
          },
        }}
      >
        <Box sx={{ paddingTop: 2, width: '100%', paddingBottom: 8 }}> {/* Added padding at bottom */}
          <List sx={{ paddingBottom: 4 }}> {/* Add padding to the list for better spacing */}
            {drawerItems.map((item) => (
              <React.Fragment key={item.id}>
                <SidebarItem
                  item={item}
                  drawerOpen={drawerOpen}
                  isOpen={openSections[item.id]}
                  handleToggle={handleToggle}
                  handleSelectItem={handleSelectItem}
                />
                <Divider /> {/* Divider added after each item */}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
