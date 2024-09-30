// import React,  { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Box, Button,Typography, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import GoogleLoginButton from './loginComponent';


// const Navbar = () => {
//   const [drawerOpen, setDrawerOpen] = useState(true);
  

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };
//   return (
//     // <AppBar position="fixed" style={{ backgroundColor: '#ffffff', color: '#000000', zIndex: 1201 }}>
//     //   <Toolbar>
        
//     //     <Link to="/" style={{ flexGrow: 1 }}>
//     //       <img 
//     //         src="/images/logo.png" 
//     //         alt="Bytecrafts Logo" 
//     //         style={{ height: '50px' }} 
//     //       />
//     //     </Link>

//     //     <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
//     //       <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
//     //         <Button variant="outlined">LOGIN</Button>
//     //       </Link>
//     //       <GoogleLoginButton />
//     //     </Box>

//     //   </Toolbar>
//     // </AppBar>
//     <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
//     <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="h6" noWrap style={{ color: '#000000' }}>
//           Bytecrafts
//         </Typography>
//         <IconButton
//           edge="start"
//           color="#000000"
//           aria-label="menu"
//           onClick={toggleDrawer}
//           sx={{ ml: 2 }}
//         >
//           <MenuIcon />
//         </IconButton>
//       </Box>

//               <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
//       <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
//       <Button color="inherit" startIcon={<AccountCircle />} style={{ color: '#000000' }}>
//         Login
//       </Button>
//       </Link>
//       <GoogleLoginButton />
//     </Box>
//     </Toolbar>
//   </AppBar>
//   );
// };

// export default Navbar;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Box, Button, Typography, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import GoogleLoginButton from './loginComponent';  // GoogleLoginButton component

// const Navbar = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false); // Initially drawer should be closed
  
//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   return (
//     <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography variant="h6" noWrap style={{ color: '#000000' }}>
//             Bytecrafts
//           </Typography>
//           <IconButton
//             edge="start"
//             color="#000000"
//             aria-label="menu"
//             onClick={toggleDrawer}
//             sx={{ ml: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Box>

//         <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
//           {/* Login button with Google login functionality */}
//           <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
//             <Button color="inherit" startIcon={<AccountCircle />} style={{ color: '#000000' }}>
//               Login
//             </Button>
//           </Link>

//           {/* <GoogleLoginButton />  */}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Box, Button, Typography, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import LoginModal from './loginModal';


// const Navbar = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false); // Initially drawer should be closed
//   const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility
  
//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const handleLoginClick = () => {
//     setModalOpen(true); // Open the modal when Login button is clicked
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false); // Close the modal
//   };

//   return (
//     <>
//       <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#ffffff' }}>
//         <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography variant="h6" noWrap style={{ color: '#000000' }}>
//               Bytecrafts
//             </Typography>
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={toggleDrawer}
//               sx={{ ml: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>

//           <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 0 }}>
//             <Button 
//               color="inherit" 
//               startIcon={<AccountCircle />} 
//               style={{ color: '#000000' }}
//               onClick={handleLoginClick}  // Open modal on click
//             >
//               Login
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <LoginModal open={modalOpen} handleClose={handleCloseModal} />  {/* Render LoginModal */}
//     </>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginModal from './loginModal';

const Navbar = ({ toggleDrawer }) => { // Accept toggleDrawer prop from parent
  const [modalOpen, setModalOpen] = useState(false); // State for controlling modal visibility

  const handleLoginClick = () => {
    setModalOpen(true); // Open the modal when Login button is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
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
              onClick={toggleDrawer} // Call the passed toggleDrawer function
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
              onClick={handleLoginClick}  // Open modal on click
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal open={modalOpen} handleClose={handleCloseModal} />  
    </>
  );
};

export default Navbar;
