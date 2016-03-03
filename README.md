![Alt](http://simondiep.github.io/img/snake.gif)
[![Build Status](https://travis-ci.org/simondiep/node-multiplayer-snake.svg?branch=master)](https://travis-ci.org/simondiep/node-multiplayer-snake)
[![Dependency Status](https://david-dm.org/simondiep/node-multiplayer-snake/status.svg?style=flat)](https://david-dm.org/simondiep/node-multiplayer-snake)  

A multiplayer snake game built on NodeJs, Express, socket.io, JavaScript ES6, and RequireJs.  
Live demo [Here](https://node-multiplayer-snake.herokuapp.com/)

### Getting Started

Install the latest [Node.js](http://nodejs.org) 5.60 Stable

`git clone https://github.com/simondiep/node-multiplayer-snake.git`

`cd node-multiplayer-snake`

`npm install`

`node app`

Open your web browser to `localhost:3000`


### Game Features
 - Quick join and play (no sign-ups)
 - Change colors
 - Change names
 - Change game speed
 - Change amount of food
 - Change player starting length
 - Different food types
 - Upload your own snake image and background image
 - Player statistics including kills/deaths/score
 - Steal player scores and length by killing them
 - Game notifications
 - Bots
 - Random, safe spawns
 - Spectate
 - Local storage of name and image

### Contributing

1. Fork the code base
2. Create a new git branch
3. Start making changes
4. Run tests `npm test`
5. Rebase your changes
6. Submit a pull request

### Tech Debt
 - Additional Client-side validation to reduce unnecessary emits to server
 - Additional Server-side optimization to reduce unnecessary emits to client
 - Add a description for what 'Upload Image' does and any restrictions
 - Toggle view of admin options as a menu item
 - Compress uploaded images before sending to server [pngquant](https://pngquant.org/)
 - Add a report bug menu item
 - More consistent names: pick either location or coordinate and stick with it
 - Isolated unit tests, using a mocking framework like Sinon
 - Replace console.log with logging framework
    - https://www.loggly.com/ultimate-guide/node-logging-basics/
    - https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/
 - Remove relaxed eslint checks from .eslintrc.js
 - Refactor into more testable code
 - Higher test coverage
 - Performance tests
 - [Issues](https://github.com/simondiep/node-multiplayer-snake/issues)
 
### Longer-term Tech Debt
 - Chai does not support --use_strict mode.  
    - This means "use strict"; is needed in all node modules, even though it is redundant
 - When supported by browsers, try replacing RequireJS with ES6 import/export
 - Switch to SASS when Windows makes it easier to install [node-gyp dependencies](https://github.com/nodejs/node-gyp/issues/629)

### Potential Features To Implement
 - Spin buttons for admin controls
 - Multiple rooms
 - Incremental death (head no longer moves, but tail does)
 - Randomize board to contain walls
 - Allow players to skip across the screen if they visit an edge without a wall
 - Increase game speed based on different conditions (faster if 1v1) or random
 - Choose your own color
 - Chat
 - Support resolutions lower than 1225x550
 - Smarter bots (prioritize food, don't trap themselves, have a sense for other player movements)
 - Audio
    - Background music
    - Sound effects
    - Volume control
    - Voice chat
 - Images
    - Store background image on server
    - Food image
    - Support animated gifs (snake and food)
    - Upload head image vs body images
    - Preset images for use
 - Stats
    - Global high score
    - Custom sort stat board
    - More stats (max length)
    - Kill / Deaths announcement [ A killed B ] , [ B ran into a wall ], [A and B killed each other]
 - Power-ups
    - individual speed (2 or more steps for a player)
    - invulnerable
    - length increase
    - width increase
    - reverse controls
    - be able to draw on canvas
    - choice of power-up to start with
    - random power up on kill
 - Game Modes
    - head to head with preselected spawn points
    - fog of war
    - random walls
    - elimination
    - maze