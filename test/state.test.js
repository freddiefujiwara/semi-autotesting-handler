/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import State from '../src/state';
describe('State test.', (suite) => {
    it('should have properties ', () => {
        const ghs = new State({
            speak: '',
            action: '',
            conditions: {},
        });
        ghs.should.be.a('object');
        ghs.should.have.property('valiable')
            .with.deep.equal({});
        ghs.should.have.property('speak')
            .with.equal('');
        ghs.should.have.property('action')
            .with.equal('');
        ghs.should.have.property('conditions')
            .with.deep.equal({});
    });
});
