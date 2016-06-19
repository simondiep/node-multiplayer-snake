module.exports = {
    'extends': 'airbnb',
    'env': {
        'mocha': true
    },
    'globals': { 'define': true },
    'rules': {
        // Override any settings from the 'parent' configuration
        'import/no-unresolved': 0,
        'indent': [2, 4, { 'SwitchCase': 1, 'VariableDeclarator': 1 }],
        'max-len': [2, 130, 2, {
            'ignoreUrls': true,
            'ignoreComments': false
        }],
        'no-console': 0,
        'no-restricted-syntax': 1,
        'no-underscore-dangle': 0,
        'spaced-comment': [2, 'always', { 'exceptions': ['*'] }],
        'strict': 0
    }
}