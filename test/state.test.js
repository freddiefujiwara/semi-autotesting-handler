/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import State from '../src/state';
describe('State test.', (suite) => {
    it('should have properties ', () => {
        const s = new State({
            name: 'name',
            parent: 'parent',
            activities: 'activities',
            decision: {},
        });
        s.should.be.a('object');
        s.should.have.property('name')
            .with.equal('name');
        s.should.have.property('parent')
            .with.equal('parent');
        s.should.have.property('activities')
            .with.equal('activities');
        s.should.have.property('decision')
            .with.deep.equal({});
    });
});
