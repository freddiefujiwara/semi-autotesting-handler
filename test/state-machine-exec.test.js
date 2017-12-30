/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import StateMachineExec from '../src/state-machine-exec';
describe('StateMachineExec test.', (suite) => {
    it('should have properties ', () => {
        const ghs = new StateMachineExec();
        ghs.should.be.a('object');
    });
    it('should run properly ', () => {
        const ghs = new StateMachineExec();
        ghs.should.have.property('run').with.be.a('function');
    });
});
