const assert = require("chai").assert;
const Coordinate = require("../models/coordinate");
const Direction = require("../models/direction");
const Player = require("../models/player");
const BoardOccupancyService = require("../services/board-occupancy-service");
const BotDirectionService = require("../services/bot-direction-service");
const CoordinateService = require("../services/coordinate-service");

describe("BotDirectionService", function() {
    "use strict";
    
    let bot,boardOccupancyService,botDirectionService;
    
    beforeEach(function() {
        bot = new Player();
        bot.segments = [new Coordinate(10,10)];
        bot.changeDirection(Direction.RIGHT);
        boardOccupancyService = new BoardOccupancyService();
        botDirectionService = new BotDirectionService(boardOccupancyService);
    });
    
    it("should not change direction if it is safe two spaces ahead", function(done) {
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.RIGHT);
        done();
    });
    
    it("should change direction if it one space ahead is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(11,10)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.isTrue(bot.direction ===Direction.UP || bot.direction ===Direction.DOWN);
        done();
    });
    
    it("should change direction if it two spaces ahead is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(12,10)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.isTrue(bot.direction ===Direction.UP || bot.direction ===Direction.DOWN);
        done();
    });
    
    /**  3
     *
     * 111 2
     *
     */
    it("should change direction if it two spaces ahead is occupied and left two spaces ahead is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(12,10)]);
        boardOccupancyService.addPlayerOccupancy("player3", [new Coordinate(10,8)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.DOWN);
        done();
    });
    
    /**  3
     *
     * 1112
     *
     */
    it("should change direction if space ahead is occupied and left two spaces ahead is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(11,10)]);
        boardOccupancyService.addPlayerOccupancy("player3", [new Coordinate(10,8)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.DOWN);
        done();
    });
    
    /**  3
     * 1112
     *
     */
    it("should change direction if space ahead is occupied and left space is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(11,10)]);
        boardOccupancyService.addPlayerOccupancy("player3", [new Coordinate(10,9)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.DOWN);
        done();
    });
    
    /**
     * 111 2
     *
     *   3
     */
    it("should change direction if it two spaces ahead is occupied and right two spaces ahead is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(12,10)]);
        boardOccupancyService.addPlayerOccupancy("player3", [new Coordinate(10,12)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.UP);
        done();
    });
    
    /**
     * 111 2
     *   3
     */
    it("should change direction if it two spaces ahead is occupied and right space is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(12,10)]);
        boardOccupancyService.addPlayerOccupancy("player3", [new Coordinate(10,11)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.UP);
        done();
    });
    
    /**
     * 1112
     *   3
     */
    it("should change direction if space ahead is occupied and right space is occupied", function(done) {
        boardOccupancyService.addPlayerOccupancy("player2", [new Coordinate(11,10)]);
        boardOccupancyService.addPlayerOccupancy("player3", [new Coordinate(10,11)]);
        botDirectionService.changeDirectionIfInDanger(bot);
        assert.equal(bot.direction, Direction.UP);
        done();
    });
});