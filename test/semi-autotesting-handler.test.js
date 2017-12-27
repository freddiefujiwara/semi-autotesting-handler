/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import SemiAutotestingHandler from '../src/semi-autotesting-handler';
describe('SemiAutotestingHandler test.', (suite) => {
    it('should have properties ', () => {
        const ghs = new SemiAutotestingHandler();
        ghs.should.be.a('object');
    });
    it('should run properly ', () => {
        const ghs = new SemiAutotestingHandler();
        ghs.should.have.property('run').with.be.a('function');
    });
});
