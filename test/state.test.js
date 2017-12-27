/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import State from '../src/state';
describe('State test.', (suite) => {
    it('should have properties ', () => {
        const ghs = new State();
        ghs.should.be.a('object');
    });
});
