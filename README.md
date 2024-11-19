# Dungeon Explorer

**Dungeon Explorer** is a remake of an old DOS classic built using **Pi.js**, bringing modern simplicity to a nostalgic adventure. This project aims to recreate the original gameplay while introducing new tools, such as a level editor, to empower players and developers alike. Currently, about 50% of the gameplay has been completed.

## Features
- Faithful recreation of the original DOS game mechanics.
- Integrated level editor for creating and customizing your own dungeons.
- Modern design powered by Pi.js for lightweight performance.
- Cross-platform support via modern web browsers.
- Work-in-progress with approximately 50% of the gameplay completed.

## Requirements
- Node.js (v14 or higher)
- NPM (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, etc.) for the front-end experience.

## Installation
1. Clone or download the repository:
   ```bash
   git clone https://github.com/AndyStubbs/dungeon.git
   cd dungeon
   npm install
   ```
2. Start the server
   ```bash
   npm start
   ```
3. Navigate to the localhost port 8080

## How to Play
- Navigate through dungeons, solve puzzles, and defeat enemies (gameplay is partially implemented).
- Currently crashes if trying to exit the first room of the dungeon.
- Use the **Level Editor** to design and save your own dungeon layouts.

### Controls
- **Arrow Keys**: Move the character.
- **Mouse**: Interact with the Level Editor.
- Additional controls will be added as gameplay development progresses.

## More Information
For more details about the game original DOS game and tools, visit the **Explorer Utils** page:  
[https://footballhead.github.io/explorer-utils/](https://footballhead.github.io/explorer-utils/)

## Inspiration
I was inspired to write this game after watching this youtube video: [Dungeon Explorer - ADG Episode 310](https://www.youtube.com/watch?v=XkGfbEb4m28).

## Customization
- Use the Level Editor to create and test your own dungeon levels.
- Modify the source code to experiment with game mechanics or extend features.

## Development Status
- Gameplay: ~50% completed.
- Level Editor: Fully functional.
- It's been awhile since I worked on this last, but from what I can recall I was modifying the
way navigation was handled room-to-room. I added a pathing tool to map rooms. I think I initially
had navigation on a grid, but when playing to original game I noticde the grid navigation didn't work.
So I add a specific pathing system to link rooms. I didn't complete the implementation hince why
you get stuck in the first room.

## Contribution
Contributions are welcome! To contribute:  
1. Fork the repository.  
2. Create a new branch for your changes.  
3. Submit a pull request with details of your update.

