/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import StateFactory from '../src/state-factory';
describe('StateFactory test.', (suite) => {
    it('should have properties ', () => {
        let sf = new StateFactory();
        sf.should.be.a('object');

        sf.should.have.property('stateMachineFile')
            .with.equal('~/.semi-autotesting-handler.sm');

        sf = new StateFactory('/path/to/file');

        sf.should.have.property('stateMachineFile')
            .with.equal('/path/to/file');
    });
});
