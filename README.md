![Alt](http://simondiep.github.io/img/snake.gif)
[![Build Status](https://travis-ci.org/simondiep/node-multiplayer-snake.svg?branch=master)](https://travis-ci.org/simondiep/node-multiplayer-snake)
[![Dependency Status](https://david-dm.org/simondiep/node-multiplayer-snake/status.svg?style=flat)](https://david-dm.org/simondiep/node-multiplayer-snake)  

A multiplayer snake game built on NodeJs, Express, socket.io, JavaScript ES6, and RequireJs.  
Live demo [Here](https://node-multiplayer-snake.herokuapp.com/)

### Getting Started

Install [Node.js](http://nodejs.org)

`git clone https://github.com/simondiep/node-multiplayer-snake.git`

`cd node-multiplayer-snake`

`npm install`

`node app`

Open your web browser to `localhost:3000`

### Contributing

1. Fork the code base
2. Create a new git branch
3. Start making changes
4. Run tests `npm test`
5. Rebase your changes
6. Submit a pull request

### Game Features
 - Quick join and play (no sign-ups)
 - Ability to change colors
 - Ability to change names
 - Ability to change game speed
 - Ability to change amount of food
 - Ability to change player starting length
 - Player statistics
 - Game notifications
 - Bots
 - Random, safe spawns

### Potential Features To Implement
 - Snake and Food images
 - More stats (max length, kills)
 - Save name (if customized) and high score in local storage
 - Kill / Deaths announcement [ A killed B ] , [ B ran into a wall ], [A and B killed each other]
 - Add score for kills
 - Incremental death (head no longer moves, but tail does)
 - Randomize board to contain walls
 - Allow players to skip across the screen if they visit an edge without a wall
 - Increase game speed based on different conditions (faster if 1v1) or random
 - Chat
 - Bots
 - Power-ups or Game Modes
    - speed, invulnerable, length increase, width increase, swap positions, reverse controls,
    - be able to draw on canvas, fog of war, random walls, elimination
 - Choice of power-up to start with