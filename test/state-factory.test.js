/* eslint require-jsdoc: 1 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import uuid from 'uuid';
import chai from 'chai';
chai.should();
import StateFactory from '../src/state-factory';
describe('StateFactory test.', (suite) => {
    let sf = undefined;
    beforeEach(() => {
        sf = new StateFactory('test/semi-automation-test.sm');
    });
    it('should have properties ', () => {
        sf.should.be.a('object');

        sf.should.have.property('stateMachineFile')
            .with.equal('test/semi-automation-test.sm');

        sf.should.have.property('currentStateFile')
            .with.equal(
        `${os.homedir()}${path.sep}.state-machine-exec-current.json`);

        sf.should.have.property('stateObjects')
            .with.deep.equal({});

        sf = new StateFactory('/path/to/file');

        sf.should.have.property('stateMachineFile')
            .with.equal('/path/to/file');
    });
    it('should smToJSON properly', async () => {
        sf.should.have.property('smToJSON')
            .with.be.a('function');

        let expectedObject = JSON.parse(
            fs.readFileSync('test/semi-automation-test.json',
                'utf8'));
        (await sf.smToJSON()).should.be.a('object')
            .with.deep.equal(expectedObject);

        try {
            (await sf.smToJSON());
        } catch (err) {
            err.should.be.a('object');
        }

        sf = new StateFactory('/path/to/file');
        try {
            (await sf.smToJSON());
        } catch (err) {
            err.should.be.a('Error');
        }
    });
    it('should walk properly', async () => {
        sf.should.have.property('walk')
            .with.be.a('function');
        const stateMachineObject = JSON.parse(
            fs.readFileSync('test/semi-automation-test.json',
                'utf8'));
        await sf.walk(stateMachineObject);
        sf.stateObjects.should.have.property('initial')
            .with.have.property('name')
            .with.equal('initial');
        //        console.log(util.inspect(sf.stateObjects,false,null));
    });
    it('should save/load properly', async () => {
        const tmpFile = `${os.tmpdir()}${path.sep}${uuid.v4()}`;
        sf = new StateFactory('test/semi-automation-test.sm', tmpFile);
        sf.should.have.property('save')
            .with.be.a('function');
        const stateMachineObject = JSON.parse(
            fs.readFileSync('test/semi-automation-test.json',
                'utf8'));
        await sf.walk(stateMachineObject);
        let targetObj = sf.load();
        targetObj.should.have.property('name')
        .with.equal('initial');
        sf.save(sf.stateObjects['suite/case/then']);
        sf.stateObjects['suite/case/then'].toString().should.equal(
            fs.readFileSync(tmpFile, 'utf-8')
        );
        targetObj = sf.load();
        targetObj.should.have.property('name')
        .with.equal('suite/case/then');
        fs.unlinkSync(tmpFile);
    });
    it('should run properly', async () => {
        const tmpFile = `${os.tmpdir()}${path.sep}${uuid.v4()}`;
        sf = new StateFactory('test/semi-automation-test.sm', tmpFile);
        sf.should.have.property('run')
            .with.be.a('function');
        await sf.run();
        sf.save(sf.stateObjects['suite/case/then']);
        fs.unlinkSync(tmpFile);
    });
});
