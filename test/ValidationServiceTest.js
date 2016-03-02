const assert = require('chai').assert;
const ValidationService = require('../services/validation-service');

describe('ValidationService', () => {
    'use strict';

    it('should allow a valid base64 data uri', done => {
        const base64DataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAA' +
        'gUlEQVQoU62QKxKAMAxENwKJ4UpwISwHwHIhuBIGiQjTkLZJYAZDVWZ3X/MhhMcAE0BJtnWOifEGJS2D1o8A68+SMW' +
        'YpcyFBrC3QN77hdgLDUSZKAMfghFECM5YKK+gB2gHu4ADV8A+gA3yNdB/GLPwA6uJkz1ogB5hwOHXt8itwARFkTQm4' +
        'zzzPAAAAAElFTkSuQmCC';

        const isValid = ValidationService.isValidBase64DataURI(base64DataURI);
        assert.isTrue(isValid);

        done();
    });

    it('should not allow an invalid base64 data uri', done => {
        const base64DataURI = 'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAA' +
        'gUlEQVQoU62QKxKAMAxENwKJ4UpwISwHwHIhuBIGiQjTkLZJYAZDVWZ3X/MhhMcAE0BJtnWOifEGJS2D1o8A68+SMW' +
        'YpcyFBrC3QN77hdgLDUSZKAMfghFECM5YKK+gB2gHu4ADV8A+gA3yNdB/GLPwA6uJkz1ogB5hwOHXt8itwARFkTQm4' +
        'zzzPAAAAAElFTkSuQmCC';

        const isValid = ValidationService.isValidBase64DataURI(base64DataURI);
        assert.isFalse(isValid);

        done();
    });
});
