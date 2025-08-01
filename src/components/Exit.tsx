import React from 'react';

interface ExitProps {
  color: string;
}

const Exit: React.FC<ExitProps> = ({ color }) => {
  const style: React.CSSProperties = {
    width: 40,
    height: 40,
    border: `2px dashed ${color}`,
    borderRadius: 4,
    boxSizing: 'border-box'
  };

  return <div style={style}></div>;
};

export default Exit;
