var assert = require("chai").assert;
var NameService = require("../services/name-service");

describe("NameService", function() {
    "use strict";
  
    const NUMBER_OF_NAMES_TO_TEST = 500;
  
    it("should generate a new unused player name", function(done) {
        let nameService = new NameService();
        let usedNames = new Set();
         for (let i = 0; i < NUMBER_OF_NAMES_TO_TEST; i++) {
            usedNames.add(nameService.getPlayerName());
        }
        assert.equal(usedNames.size, NUMBER_OF_NAMES_TO_TEST);
        
        done();
    });
});