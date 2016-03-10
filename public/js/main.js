import io from 'socket.io-client';
import GameController from 'controller/game-controller';

const gameController = new GameController();
gameController.connect(io);
