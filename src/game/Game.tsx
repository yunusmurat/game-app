import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import { levels } from './levels';
import { Level, RobotData, Position } from './types';

// Helper function to check if two positions match
const samePos = (a: Position, b: Position) => a.row === b.row && a.col === b.col;

// Move robot until it hits obstacle or exit
function slideRobot(
  robot: RobotData,
  dir: Position,
  level: Level,
  robots: RobotData[]
): { robot?: RobotData; removed: boolean } {
  let { row, col } = robot;
  const otherRobots = robots.filter(r => r.id !== robot.id);

  while (true) {
    const nextRow = row + dir.row;
    const nextCol = col + dir.col;

    // Check walls
    if (level.walls?.some(w => w.row === nextRow && w.col === nextCol)) break;

    // Check other robots
    if (otherRobots.some(r => r.row === nextRow && r.col === nextCol)) break;

    // Check boundaries
    if (nextRow < 0 || nextRow >= level.rows || nextCol < 0 || nextCol >= level.cols) {
      break;
    }

    row = nextRow;
    col = nextCol;

    // Check exit
    const exit = level.exits.find(e => e.row === row && e.col === col);
    if (exit) {
      if (exit.color === robot.color) {
        return { removed: true };
      } else {
        // wrong color, stop before exit
        row -= dir.row;
        col -= dir.col;
        break;
      }
    }
  }

  return { robot: { ...robot, row, col }, removed: false };
}

const Game: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [robots, setRobots] = useState<RobotData[]>(levels[0].robots);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [activeRobot, setActiveRobot] = useState<number | null>(null);

  const level = levels[levelIndex];

  // Timer
  useEffect(() => {
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [levelIndex]);

  // Reset level
  const reset = () => {
    setRobots(level.robots.map(r => ({ ...r })));
    setMoves(0);
    setTime(0);
    setActiveRobot(null);
  };

  // Next level
  const nextLevel = () => {
    if (levelIndex < levels.length - 1) {
      setLevelIndex(i => i + 1);
    } else {
      setLevelIndex(0);
    }
  };

  // When level changes, reset robots and timer
  useEffect(() => {
    reset();
  }, [levelIndex]);

  // Handle movement for selected robot
  const move = (dir: Position) => {
    if (activeRobot === null) return;
    const robot = robots.find(r => r.id === activeRobot);
    if (!robot) return;

    const result = slideRobot(robot, dir, level, robots);
    setMoves(m => m + 1);

    if (result.removed) {
      setRobots(rs => rs.filter(r => r.id !== robot.id));
    } else if (result.robot) {
      setRobots(rs => rs.map(r => (r.id === robot.id ? result.robot! : r)));
    }
  };

  // Win condition
  const levelComplete = robots.length === 0;

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Level {levelIndex + 1} / {levels.length}</p>
      <p>Time: {time}s Moves: {moves}</p>
      <Board
        level={level}
        robots={robots}
        activeRobot={activeRobot}
        onSelectRobot={setActiveRobot}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => move({ row: -1, col: 0 })}>Up</button>
        <button onClick={() => move({ row: 1, col: 0 })}>Down</button>
        <button onClick={() => move({ row: 0, col: -1 })}>Left</button>
        <button onClick={() => move({ row: 0, col: 1 })}>Right</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={reset}>Restart Level</button>
        {levelComplete && (
          <button onClick={nextLevel} style={{ marginLeft: '10px' }}>
            Next Level
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
