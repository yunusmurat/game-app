# Robot Color Jam

This is a simple puzzle game inspired by **Color Block Jam**. Guide each colored robot to the matching charging station located on the edges of the board.

The project uses **React**, **TypeScript**, and **Vite** so it can be easily run on environments like StackBlitz.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build

## Game Description

- Select a robot by clicking on it. The active robot glows.
- Use the directional buttons to slide the robot until it hits an obstacle.
- Robots exiting through their matching station are removed from the board.
- Clear all robots to move to the next level.

Three sample levels are included with increasing difficulty. Feel free to extend `src/game/levels.ts` to add more!
