const assert = require("chai").assert;
const NameService = require("../services/name-service");

describe("NameService", function() {
    "use strict";
  
    const NUMBER_OF_NAMES_TO_TEST = 500;
  
    it("should generate a new unused player name", function(done) {
        const nameService = new NameService();
        const usedNames = new Set();
         for (let i = 0; i < NUMBER_OF_NAMES_TO_TEST; i++) {
            usedNames.add(nameService.getPlayerName());
        }
        assert.equal(usedNames.size, NUMBER_OF_NAMES_TO_TEST);
        
        done();
    });
});