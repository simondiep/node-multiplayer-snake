![Alt](http://simondiep.github.io/img/snake.gif)
[![Build Status](https://travis-ci.org/simondiep/node-multiplayer-snake.svg?branch=master)](https://travis-ci.org/simondiep/node-multiplayer-snake)
[![Dependency Status](https://david-dm.org/simondiep/node-multiplayer-snake/status.svg?style=flat)](https://david-dm.org/simondiep/node-multiplayer-snake)  

A multiplayer snake game built on NodeJs, Express, socket.io, JavaScript ES6, and RequireJs.  
Live demo [Here](https://node-multiplayer-snake.herokuapp.com/)

### Game Features
 - Quick join and play (no sign-ups)
 - Ability to change colors
 - Ability to change names
 - Ability to change game speed
 - Ability to change amount of food
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