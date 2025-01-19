const assert = require('assert')
const config = require('../../config/keys')

describe('Test Confige file', () => {
    it('should return the correct value', async () => {
        assert.strictEqual("object", typeof config);
    })
})