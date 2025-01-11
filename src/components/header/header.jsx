import { useState } from 'react';

const Navbar = () => {
  const [activeIcon, setActiveIcon] = useState(null);

  const icons = [
    { 
      name: 'Converter', 
      color: '#4CAF50',
      icon: '⚡'
    },
    { 
      name: 'Merge Files', 
      color: '#2196F3',
      icon: '🔄'
    },
    { 
      name: 'Tools', 
      color: '#9C27B0',
      icon: '🔧'
    },
    { 
      name: 'Contact Us', 
      color: '#FF4081',
      icon: '✉️'
    },
    
  ];

  const handleIconClick = (icon) => {
    setActiveIcon(activeIcon?.name === icon.name ? null : icon);
  };

  const reorderIcons = (icons, activeIcon) => {
    if (!activeIcon) return icons;
    
    const activeIndex = icons.findIndex(icon => icon.name === activeIcon.name);
    const reordered = [...icons];
    const item = reordered.splice(activeIndex, 1)[0];
    reordered.splice(1, 0, item);
    return reordered;
  };

  const orderedIcons = reorderIcons(icons, activeIcon);

  return (
    <div className="min-h-screen">
      <nav className="bg-transparent px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-2xl font-bold z-10">Logo</div>

          {/* Icons Container */}
          <div className="flex items-center justify-center space-x-12 absolute left-1/2 -translate-x-1/2">
            {orderedIcons.map((icon) => (
              <div
                key={icon.name}
                onClick={() => handleIconClick(icon)}
                className={`
                  transition-all duration-500 ease-in-out
                  ${activeIcon?.name === icon.name ? 'scale-110' : 'scale-100'}
                `}
              >
                <div
                  className={`
                    flex items-center cursor-pointer
                    transition-all duration-500 ease-in-out
                    rounded-full px-4 py-2
                    hover:bg-opacity-10
                    whitespace-nowrap
                  `}
                  style={{
                    backgroundColor: activeIcon?.name === icon.name 
                      ? icon.color 
                      : 'transparent',
                    border: `2px solid ${icon.color}`,
                    width: activeIcon?.name === icon.name 
                      ? 'auto'
                      : '50px'
                  }}
                >
                  <span className="text-xl">{icon.icon}</span>
                  <span
                    className={`
                      ml-2 transition-all duration-500 ease-in-out
                      ${activeIcon?.name === icon.name 
                        ? 'opacity-100 inline-block' 
                        : 'opacity-0 w-0 hidden'
                      }
                      ${activeIcon?.name === icon.name ? 'text-white' : `text-[${icon.color}]`}
                    `}
                  >
                    {icon.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <button className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors z-10">
            Login
          </button>
        </div>
      </nav>

      {/* Gradient Background */}
      {activeIcon && (
        <div
          className="fixed inset-0 -z-10 transition-all duration-500"
          style={{
            background: `radial-gradient(
              circle, 
              ${activeIcon.color}10, 
              ${activeIcon.color}80, 
              ${activeIcon.color}10
            )`
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
