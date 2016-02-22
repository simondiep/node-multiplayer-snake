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


### Game Features
 - Quick join and play (no sign-ups)
 - Change colors
 - Change names
 - Change game speed
 - Change amount of food
 - Change player starting length
 - Upload your own snake image
 - Player statistics
 - Game notifications
 - Bots
 - Random, safe spawns

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
 - Server-side validation of inputs
 - Create a single menu button, Edit Player Profile, that contains all existing buttons as menu items
 - Save all Player Profile settings to Local Storage, and load them on subsequent plays (also high score?)
 - Add a description for what 'Upload Image' does and any restrictions
 - Toggle view of admin options as a menu item
 - Resize uploaded images on client to 12x12
 - Compress uploaded images before sending to server [pngquant](https://pngquant.org/)

### Potential Features To Implement
 - Food image
 - More stats (max length, kills)
 - Kill / Deaths announcement [ A killed B ] , [ B ran into a wall ], [A and B killed each other]
 - Add score for kills
 - Incremental death (head no longer moves, but tail does)
 - Randomize board to contain walls
 - Allow players to skip across the screen if they visit an edge without a wall
 - Increase game speed based on different conditions (faster if 1v1) or random
 - Choose your own color
 - Chat
 - Power-ups or Game Modes
    - speed, invulnerable, length increase, width increase, swap positions, reverse controls,
    - be able to draw on canvas, fog of war, random walls, elimination
 - Choice of power-up to start with