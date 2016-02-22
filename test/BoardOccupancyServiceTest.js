var assert = require("chai").assert;

var Coordinate = require("../models/coordinate");
var Player = require("../models/player");
var BoardOccupancyService = require("../services/board-occupancy-service");

describe("BoardOccupancyService", function() {
    "use strict";
  
    it("should detect no kills", function(done) {
        let boardOccupancyService = new BoardOccupancyService();
        
        let player1 = new Player(1);
        player1.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        let player2 = new Player(2);
        player2.segments = [new Coordinate(5,2),new Coordinate(4,2),new Coordinate(3,2),new Coordinate(2,2),new Coordinate(1,2)];
        let player3 = new Player(3);
        player3.segments = [new Coordinate(5,3),new Coordinate(4,3),new Coordinate(3,3),new Coordinate(2,3),new Coordinate(1,3)];
        let player4 = new Player(4);
        player4.segments = [new Coordinate(5,4),new Coordinate(4,4),new Coordinate(3,4),new Coordinate(2,4),new Coordinate(1,4)];
        
        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        boardOccupancyService.addPlayerOccupancy(player2.id, player2.segments);
        boardOccupancyService.addPlayerOccupancy(player3.id, player3.segments);
        boardOccupancyService.addPlayerOccupancy(player4.id, player4.segments);
        
        let killReports = boardOccupancyService.getKillReports();
        
        assert.equal(killReports.length, 0);
        done();
    });
    
    it("should detect a single player kill", function(done) {
        let boardOccupancyService = new BoardOccupancyService();
        
        let player1 = new Player(1);
        player1.segments = [new Coordinate(4,2),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        let player2 = new Player(2);
        player2.segments = [new Coordinate(5,2),new Coordinate(4,2),new Coordinate(3,2),new Coordinate(2,2),new Coordinate(1,2)];
        let player3 = new Player(3);
        player3.segments = [new Coordinate(5,3),new Coordinate(4,3),new Coordinate(3,3),new Coordinate(2,3),new Coordinate(1,3)];
        let player4 = new Player(4);
        player4.segments = [new Coordinate(5,4),new Coordinate(4,4),new Coordinate(3,4),new Coordinate(2,4),new Coordinate(1,4)];
        
        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        boardOccupancyService.addPlayerOccupancy(player2.id, player2.segments);
        boardOccupancyService.addPlayerOccupancy(player3.id, player3.segments);
        boardOccupancyService.addPlayerOccupancy(player4.id, player4.segments);
        
        let killReports = boardOccupancyService.getKillReports();
        
        assert.equal(killReports.length, 1);
        assert.equal(killReports[0].killerId, 2);
        assert.equal(killReports[0].victimId, 1);
        done();
    });
    
    it("should detect multiple kills", function(done) {
        let boardOccupancyService = new BoardOccupancyService();
        
        let player1 = new Player(1);
        player1.segments = [new Coordinate(4,2),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        let player2 = new Player(2);
        player2.segments = [new Coordinate(5,2),new Coordinate(4,2),new Coordinate(3,2),new Coordinate(2,2),new Coordinate(1,2)];
        let player3 = new Player(3);
        player3.segments = [new Coordinate(4,2),new Coordinate(4,3),new Coordinate(3,3),new Coordinate(2,3),new Coordinate(1,3)];
        let player4 = new Player(4);
        player4.segments = [new Coordinate(4,3),new Coordinate(4,4),new Coordinate(3,4),new Coordinate(2,4),new Coordinate(1,4)];
        
        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        boardOccupancyService.addPlayerOccupancy(player2.id, player2.segments);
        boardOccupancyService.addPlayerOccupancy(player3.id, player3.segments);
        boardOccupancyService.addPlayerOccupancy(player4.id, player4.segments);
        
        let killReports = boardOccupancyService.getKillReports();

        assert.equal(killReports.length, 3);
        assert.equal(killReports[0].killerId, 2);
        assert.equal(killReports[0].victimId, 1);
        assert.equal(killReports[1].killerId, 2);
        assert.equal(killReports[1].victimId, 3);
        assert.equal(killReports[2].killerId, 3);
        assert.equal(killReports[2].victimId, 4);
        done();
    });
    
    it("should determine if a player has collided with itself", function(done) {
        let boardOccupancyService = new BoardOccupancyService();
        
        let player1 = new Player(1);
        player1.segments = [new Coordinate(4,2),new Coordinate(4,1),new Coordinate(4,2)];
        
        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        
        let killReports = boardOccupancyService.getKillReports();

        assert.equal(killReports.length, 1);
        assert.equal(killReports[0].killerId, 1);
        assert.equal(killReports[0].victimId, 1);
        done();
    });
    
    it("should detect food consumed by player", function(done) {
        let boardOccupancyService = new BoardOccupancyService();
        let foodId = "food1";
        let foodLocation = new Coordinate(4,2);
        
        boardOccupancyService.addFoodOccupancy(foodId, foodLocation);
        
        let player1 = new Player(1);
        player1.segments = [new Coordinate(4,2),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        
        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        
        let foodsConsumed = boardOccupancyService.getFoodsConsumed();
        
        assert.equal(foodsConsumed.length, 1);
        assert.equal(foodsConsumed[0].foodId, foodId);
        assert.equal(foodsConsumed[0].playerId, player1.id);
        
        boardOccupancyService.removeFoodOccupancy(foodId, foodLocation);
        foodsConsumed = boardOccupancyService.getFoodsConsumed();
        
        assert.equal(foodsConsumed.length, 0);
        done();
    });
});