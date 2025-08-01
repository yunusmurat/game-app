import React from 'react';
import { RobotData } from '../game/types';

interface RobotProps {
  data: RobotData;
  active: boolean;
  onSelect: () => void;
}

const Robot: React.FC<RobotProps> = ({ data, active, onSelect }) => {
  const style: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: data.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: active ? '0 0 10px 2px gold' : undefined,
    transition: 'box-shadow 0.2s'
  };

  return (
    <div style={style} onClick={onSelect} title={`Robot ${data.id}`}>🤖</div>
  );
};

export default Robot;
