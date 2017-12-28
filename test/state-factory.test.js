/* eslint require-jsdoc: 1 */
import fs from 'fs';
import chai from 'chai';
chai.should();
import StateFactory from '../src/state-factory';
describe('StateFactory test.', (suite) => {
    let sf = undefined;
    beforeEach(() => {
        sf  = new StateFactory('test/semi-autotesting-handler.sm')
    });
    it('should have properties ', () => {
        sf.should.be.a('object');

        sf.should.have.property('stateMachineFile')
            .with.equal('test/semi-autotesting-handler.sm');

        sf.should.have.property('stateObjects')
            .with.deep.equal({});

        sf = new StateFactory('/path/to/file');

        sf.should.have.property('stateMachineFile')
            .with.equal('/path/to/file');
    });
    it('should load properly', async () => {
        sf.should.have.property('load')
            .with.be.a('function');

        var expectedObject = JSON.parse(
            fs.readFileSync('test/semi-autotesting-handler.json',
                'utf8'));
        (await sf.load()).should.be.a('object')
            .with.deep.equal(expectedObject);

        try {
            (await sf.load());
        } catch (err) {
            err.should.be.a('object');
        }

        sf = new StateFactory('/path/to/file');
        try {
            (await sf.load());
        } catch (err) {
            err.should.be.a('Error');
        }
    });
    it('should load properly', async () => {
        sf.should.have.property('walk')
            .with.be.a('function');
        const stateMachineObject = JSON.parse(
            fs.readFileSync('test/semi-autotesting-handler.json',
                'utf8'));
        await sf.walk(stateMachineObject);
        console.log(sf.stateObjects);
    });
});
