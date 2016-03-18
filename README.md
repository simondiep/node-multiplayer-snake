[![](https://simondiep.github.io/img/node-multiplayer-snake.gif)](https://node-multiplayer-snake.herokuapp.com/)
![Alt](https://simondiep.github.io/img/snake.gif)
[![Build Status](https://travis-ci.org/simondiep/node-multiplayer-snake.svg?branch=master)](https://travis-ci.org/simondiep/node-multiplayer-snake)
[![Dependency Status](https://david-dm.org/simondiep/node-multiplayer-snake/status.svg?style=flat)](https://david-dm.org/simondiep/node-multiplayer-snake)  

A multiplayer snake game built on NodeJs, Express, socket.io, JavaScript ES6, and jspm.  No unnecessary libraries.  
Live demo [Here](https://node-multiplayer-snake.herokuapp.com/)

### Getting Started

Install the latest [Node.js](http://nodejs.org) 5.60 Stable

`git clone https://github.com/simondiep/node-multiplayer-snake.git`

`cd node-multiplayer-snake`

`npm install`

`npm run unbundle` This puts you into development mode, where hot deployments are possible.

`npm start`

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
    - Kill announcements
 - Bots
 - Random, safe spawns
 - Spectate
 - Local storage of name and image
 - Add and remove walls by clicking
 - Sound effects

### jspm notes
 - `npm run bundle` will bundle all of the js files together for a production environment
   - This updates `public/js/config.js` with an injected entry to load build.js
     - Don't check in the bundle changes to `public/js/config.js`
   - Any changes to javascript files after this will not be read, unless you bundle again or unbundle
 - Transpiling ES6 to ES5 is done on application load
 
### Contributing

1. Fork the code base
2. Create a new git branch
3. Find or create an issue with a description of what you will be adding
4. Start making changes
5. Run tests `npm test`
6. Rebase your changes
7. Submit a pull request

### Tech Debt
 - Additional Client-side validation to reduce unnecessary emits to server
 - Additional Server-side optimization to reduce unnecessary emits to client
 - Validate sizes of base64 Strings
 - Add a description for what 'Upload Image' does and any restrictions
 - Toggle view of admin options as a menu item
 - Compress uploaded images before sending to server [pngquant](https://pngquant.org/)
 - Add a report bug menu item
 - Remove relaxed eslint checks from .eslintrc.js
 - Refactor into more testable code
 - Higher test coverage
 - Create separate build steps (dev vs prod)
 - Try to lower page load time for jspm (https://github.com/jspm/jspm-cli/issues/872)
 - [uglify and minify](https://www.npmjs.com/package/uglify-js2)
   - Check environment variable and only run postinstall if prod ("postinstall": "jspm install && npm run build",)
 - input type=number to replace buttons
 - animate scrolling 
 - sprite-maker (convert all images into one)
 - high level jsdoc
 - convert innerHtml to templates (handlebars or mustache)
 - e.keyCode and other more reused values should be cached (stored in a local variable) to increase performance
   - such as 'click'
 - DomHelper extract all strings into an Object
 - [Issues](https://github.com/simondiep/node-multiplayer-snake/issues)

### Longer-term Tech Debt
 - Chai does not support --use_strict mode.
    - This means "use strict"; is needed in all node modules, even though it is redundant
 - When supported by browsers, try replacing RequireJS with ES6 import/export
 - Switch to SASS when Windows makes it easier to install [node-gyp dependencies](https://github.com/nodejs/node-gyp/issues/629)

### Technologies to look into
 - webpack vs jspm [Comparison](https://webpack.github.io/docs/comparison.html)
 - Replace console.log with logging framework
    - https://www.loggly.com/ultimate-guide/node-logging-basics/
    - https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/
 - Unit test mocking frameworks for ES6 classes
 - Performance testing tools
 - Lightweight unit testing frameworks, such as [Tape](https://github.com/substack/tape)
 - ES7
 
### Potential Features To Implement
 - Spin buttons for admin controls
 - Multiple rooms
 - Incremental death (head no longer moves, but tail does)
 - Randomize board to contain walls
 - Allow players to skip across the screen if they visit an edge without a wall
 - Increase game speed based on different conditions (faster if 1v1) or random
 - Choose your own color
 - Show a glowing outline when player is growing
 - Text chat
 - Support resolutions lower than 1225x550
 - Smarter bots (prioritize food, don't trap themselves, have a sense for other player movements)
 - Audio
    - Background music
    - Volume control
    - Voice chat
 - Images
    - Store background image on server
    - Food image
    - Support animated gifs (snake and food)
    - Upload head image vs body images (head, body, L-turn, tail)
    - Preset images for use
 - Stats
    - Global high score
    - Custom sort stat board
    - More stats (max length)
 - Power-ups
    - individual speed (2 or more steps for a player)
    - invulnerable
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
    - diagonal movement
