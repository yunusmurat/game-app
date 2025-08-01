export interface Position {
  row: number;
  col: number;
}

export interface RobotData extends Position {
  id: number;
  color: string;
}

export interface ExitData extends Position {
  color: string;
}

export interface Level {
  rows: number;
  cols: number;
  robots: RobotData[];
  exits: ExitData[];
  walls?: Position[];
}
