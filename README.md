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
 - Upload your own snake image and background image
 - Player statistics including kills/deaths/score
 - Steal player scores by killing them
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
 - Server-side validation of inputs
 - Add a description for what 'Upload Image' does and any restrictions
 - Toggle view of admin options as a menu item
 - Compress uploaded images before sending to server [pngquant](https://pngquant.org/)
 - Add a report bug menu item
 - More consistent names: pick either location or coordinate and stick with it
 - [Issues](https://github.com/simondiep/node-multiplayer-snake/issues)

### Potential Features To Implement
 - Multiple rooms
 - Incremental death (head no longer moves, but tail does)
 - Randomize board to contain walls
 - Allow players to skip across the screen if they visit an edge without a wall
 - Increase game speed based on different conditions (faster if 1v1) or random
 - Choose your own color
 - Chat
 - Support resolutions lower than 1225x550
 - Smarter bots (go after food, don't run into themselves)
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
 - Power-ups or Game Modes
    - individual speed (2 or more steps for a player)
    - invulnerable
    - length increase (super food)
    - width increase
    - swap positions
    - reverse controls,
    - be able to draw on canvas
    - fog of war
    - random walls
    - elimination
    - maze
    - Kills steal other player's length
    - Choice of power-up to start with