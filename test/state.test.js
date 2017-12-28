/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import State from '../src/state';
describe('State test.', (suite) => {
    let s = undefined;
    beforeEach(() => {
        s = new State({
            name: 'name',
            parent: 'parent',
            activities: 'activities',
            decisionMap: {}
        });
    });
    it('should have properties ', () => {
        s.should.be.a('object');
        s.should.have.property('name')
            .with.equal('name');
        s.should.have.property('parent')
            .with.equal('parent');
        s.should.have.property('activities')
            .with.equal('activities');
        s.should.have.property('decisionMap')
            .with.deep.equal({});
        s.should.have.property('valiable')
            .with.deep.equal({});
    });
    it('should convert to string properly', () => {
        s.should.have.property('toString')
            .with.be.a('function');
        s.toString().should.be.a('string');
    });
});
