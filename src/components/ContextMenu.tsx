import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

export interface ContextMenuOption {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    // Adjust position if menu would go off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let adjustedX = x;
      let adjustedY = y;

      if (x + rect.width > viewport.width) {
        adjustedX = viewport.width - rect.width - 10;
      }

      if (y + rect.height > viewport.height) {
        adjustedY = viewport.height - rect.height - 10;
      }

      if (adjustedX !== x || adjustedY !== y) {
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        left: x,
        top: y,
      }}
    >
      {options.map((option, index) => (
        <React.Fragment key={index}>
          {option.divider && <div className="context-menu-divider" />}
          <div
            className={`context-menu-item ${option.disabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!option.disabled) {
                option.action();
                onClose();
              }
            }}
          >
            {option.icon && <span className="context-menu-icon">{option.icon}</span>}
            <span className="context-menu-label">{option.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu;