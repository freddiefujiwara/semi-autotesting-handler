/* eslint require-jsdoc: 1 */
import fs from 'fs';
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
    it('should load properly', async () => {
        let sf = new StateFactory('test/semi-autotesting-handler.sm');
        sf.should.have.property('load')
            .with.be.a('function');

        (await sf.load()).should.be.a('object')
            .with.deep.equal(
                JSON.parse(
                    fs.readFileSync('test/semi-autotesting-handler.json',
                        'utf8')));

        sf = new StateFactory('/path/to/file');
        try {
            (await sf.load());
        } catch (err) {
            err.should.be.a('Error');
        }

        sf = new StateFactory('test/semi-autotesting-handler.broken.sm');
        try {
            (await sf.load());
        } catch (err) {
            err.should.be.a('object');
        }
    });
});
