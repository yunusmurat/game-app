import React from 'react';
import { Level, RobotData } from '../game/types';
import Robot from './Robot';
import Exit from './Exit';

interface BoardProps {
  level: Level;
  robots: RobotData[];
  activeRobot: number | null;
  onSelectRobot: (id: number) => void;
}

const Board: React.FC<BoardProps> = ({ level, robots, activeRobot, onSelectRobot }) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: `repeat(${level.rows}, 50px)`,
    gridTemplateColumns: `repeat(${level.cols}, 50px)`,
    gap: '2px',
    backgroundColor: '#444',
    padding: '5px',
    margin: '0 auto',
    width: level.cols * 52,
  };

  const cells = [];
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      cells.push({ row: r, col: c });
    }
  }

  return (
    <div style={gridStyle}>
      {cells.map(cell => {
        const robot = robots.find(r => r.row === cell.row && r.col === cell.col);
        const exit = level.exits.find(e => e.row === cell.row && e.col === cell.col);
        const isWall = level.walls?.some(w => w.row === cell.row && w.col === cell.col);

        const cellStyle: React.CSSProperties = {
          width: 50,
          height: 50,
          backgroundColor: isWall ? '#000' : '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        };

        return (
          <div key={`${cell.row}-${cell.col}`} style={cellStyle}>
            {exit && <Exit color={exit.color} />}
            {robot && (
              <Robot
                data={robot}
                active={activeRobot === robot.id}
                onSelect={() => onSelectRobot(robot.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
