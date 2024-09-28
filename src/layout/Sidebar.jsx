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
import GoogleLoginButton from './loginComponent';

const drawerWidth = 240;
const miniDrawerWidth = 70;
const mobileDrawerWidth = 60;

export default function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
            <Button color="inherit" startIcon={<AccountCircle />} style={{ color: '#000000' }}>
              Login
            </Button>
            <GoogleLoginButton />
          </Box>
        </Toolbar>
      </AppBar>

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
            marginTop: '64px',
            
          },
        }}
      >
        <Box sx={{ paddingTop: 2, width: '100%' }}>
          <List>
            {drawerItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                drawerOpen={drawerOpen}
                isOpen={openSections[item.id]}
                handleToggle={handleToggle}
                handleSelectItem={handleSelectItem}
              />
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}


// import React, { useState } from 'react';
// import {
//   AppBar, Toolbar, IconButton,Typography, Button, Drawer, List, Box, Divider
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import { drawerItems } from './drawerItems'
// import SidebarItem from './SidebarItem'
// import GoogleLoginButton from './loginComponent';

// const drawerWidth = 240;
// const miniDrawerWidth = 70;

// export default function Sidebar() {
//   const [drawerOpen, setDrawerOpen] = useState(true);
//   const [openSections, setOpenSections] = useState({});

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const handleToggle = (id) => {
//     setOpenSections((prevOpen) => ({
//       ...prevOpen,
//       [id]: !prevOpen[id],
//     }));
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
//         <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography variant="h6" noWrap style={{ color: '#000000' }}>
//               Bytecrafts
//             </Typography>
//             <IconButton
//               edge="start"
//               color="#000000"
//               aria-label="menu"
//               onClick={toggleDrawer}
//               sx={{ ml: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>
//           {/* <Button color="inherit" startIcon={<AccountCircle />} style={{ color: '#000000' }}>
//             Login
//           </Button> */}
//           <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
//             <Button color="inherit" startIcon={<AccountCircle />} style={{ color: '#000000' }}>
//               Login
//             </Button>
//             <GoogleLoginButton />
//           </Box>

//         </Toolbar>
//       </AppBar>

//       <Drawer
//         variant="permanent"
//         anchor="left"
//         open={drawerOpen}
//         sx={{
//           width: drawerOpen ? drawerWidth : miniDrawerWidth,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: drawerOpen ? drawerWidth : miniDrawerWidth,
//             transition: 'width 0.3s',
//             overflowX: 'hidden',
//             marginTop: '64px',
//           },
//         }}
//       >
//         <Box sx={{ paddingTop: 2, width: '100%' }}>
//           <List>
//             {drawerItems.map((item) => (
//               <SidebarItem
//                 key={item.id}
//                 item={item}
//                 drawerOpen={drawerOpen}
//                 isOpen={openSections[item.id]}
//                 handleToggle={handleToggle}
//               />
//             ))}
//           </List>
//           <Divider />
//         </Box>
//       </Drawer>
//     </Box>
//   );
// }

