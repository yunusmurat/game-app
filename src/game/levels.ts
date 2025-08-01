import { Level } from './types';

// Define 3 sample levels with increasing difficulty
export const levels: Level[] = [
  {
    rows: 3,
    cols: 3,
    robots: [
      { id: 1, row: 1, col: 1, color: 'red' },
      { id: 2, row: 1, col: 2, color: 'blue' }
    ],
    exits: [
      { row: 0, col: 1, color: 'red' },
      { row: 2, col: 1, color: 'blue' }
    ]
  },
  {
    rows: 4,
    cols: 4,
    robots: [
      { id: 1, row: 1, col: 1, color: 'red' },
      { id: 2, row: 2, col: 2, color: 'blue' },
      { id: 3, row: 1, col: 2, color: 'green' }
    ],
    exits: [
      { row: 0, col: 3, color: 'red' },
      { row: 3, col: 0, color: 'blue' },
      { row: 3, col: 3, color: 'green' }
    ],
    walls: [
      { row: 2, col: 1 },
      { row: 2, col: 3 }
    ]
  },
  {
    rows: 5,
    cols: 5,
    robots: [
      { id: 1, row: 2, col: 2, color: 'red' },
      { id: 2, row: 1, col: 3, color: 'blue' },
      { id: 3, row: 3, col: 1, color: 'green' },
      { id: 4, row: 3, col: 3, color: 'yellow' }
    ],
    exits: [
      { row: 0, col: 2, color: 'red' },
      { row: 4, col: 4, color: 'blue' },
      { row: 2, col: 0, color: 'green' },
      { row: 4, col: 0, color: 'yellow' }
    ],
    walls: [
      { row: 1, col: 1 },
      { row: 2, col: 3 },
      { row: 3, col: 2 }
    ]
  }
];
