module.exports = {
    "extends": "airbnb",
    "env": {
        "mocha": true
    },
    "globals": { "define": true },
    "rules": {
        // Override any settings from the "parent" configuration
        "guard-for-in" : 1,
        "indent": [2, 4, { "SwitchCase": 1, "VariableDeclarator": 1 }],
        "max-len": [2, 130, 2, {
            "ignoreUrls": true,
            "ignoreComments": false
        }],
        "no-console": 0,
        "no-new": 0,
        "quotes": [2, "double", "avoid-escape"],
        "spaced-comment": [2, "always", { "exceptions": ["*"] }],
        "strict": 0
    }
};