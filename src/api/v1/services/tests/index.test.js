const { getStudent } = require('@v1/services/index.service');
const sum = (a, b) => (a + b);
describe("Test index.service.js", () => {
    test('Test getStudent()', async () => {
        expect(sum(2, 3)).toBe(5);
    })
})

