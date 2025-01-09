import React from 'react';
import { ListItem, ListItemText, Collapse, List } from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useMediaQuery, useTheme } from '@mui/material';

export default function SidebarItem({ item, drawerOpen, isOpen, handleToggle, handleSelectItem }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    if (item.children) {
      handleToggle(item.id);
    } else {
      handleSelectItem();
    }
  };

  return (
    <>
      <ListItem
        button
        onClick={handleClick}
        component={item.path ? Link : 'div'}
        to={item.path || undefined}
        sx={{ justifyContent: 'space-between', padding: '10px 16px' }}
      >
        {item.icon}
        {!isSmallScreen && drawerOpen && <ListItemText primary={item.label} />} {/* Show text only on larger screens */}
        {item.children && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItem>

      {item.children && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((subItem) => (
              <ListItem
                key={subItem.id}
                button
                component={Link}
                to={subItem.path}
                sx={{ pl: 4 }}
                onClick={handleSelectItem} 
              >
                {subItem.icon}
                {!isSmallScreen && drawerOpen && <ListItemText primary={subItem.label} />}
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

