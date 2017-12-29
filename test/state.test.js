/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import State from '../src/state';
import StateFactory from '../src/state-factory';
describe('State test.', (suite) => {
    let s = undefined;
    beforeEach(() => {
        s = new State({
            name: 'name',
            parent: 'parent',
            activities: 'export SAH_COMMAND=dummy_command;echo SAH_COMMAND=$SAH_COMMAND\necho Hello world\necho $SAH_SUITE_ID；',
            decisionMap: {},
        });
    });
    it('should have properties ', () => {
        s.should.be.a('object');
        s.should.have.property('name')
            .with.equal('name');
        s.should.have.property('parent')
            .with.equal('parent');
        s.should.have.property('activities')
            .with.equal('export SAH_COMMAND=dummy_command;echo SAH_COMMAND=$SAH_COMMAND\necho Hello world\necho $SAH_SUITE_ID；');
        s.should.have.property('decisionMap')
            .with.deep.equal({});
        s.should.have.property('valiables')
            .with.deep.equal({});
    });
    it('should convert to string properly', () => {
        s.should.have.property('toString')
            .with.be.a('function');
        s.toString().should.be.a('string');
    });
    it('should action properly', async () => {
        s.should.have.property('action')
            .with.be.a('function');
        process.env['SAH_SUITE_ID'] = 'dummy_suite_id';
        await s.action();
        process.env['SAH_COMMAND'].should.equal('dummy_command');
    });
    it('should move next properly', async () => {
        s.should.have.property('next')
            .with.be.a('function');
        s.toString().should.be.a('string');
        const sf = new StateFactory('test/semi-autotesting-handler.sm');
        await sf.walk(await sf.load());
        // initial
        sf.stateObjects['initial'].next('test_start')
            .should.have.property('name').with.equal('start');

        // start
        sf.stateObjects['start'].next()
            .should.have.property('name').with.equal('suite/initial');

        // suite/initial
        sf.stateObjects['suite/initial'].next()
            .should.have.property('name').with.equal('suite/case/initial');

        // suite/case/initial
        sf.stateObjects['suite/case/initial'].next()
            .should.have.property('name').with.equal('suite/case/given');

        // suite/case/given
        sf.stateObjects['suite/case/given'].next('test_back')
            .should.have.property('name').with.equal('suite/case/given');
        sf.stateObjects['suite/case/given'].next('test_ok')
            .should.have.property('name').with.equal('suite/case/when');

        // suite/case/when
        sf.stateObjects['suite/case/when'].next('test_back')
            .should.have.property('name').with.equal('suite/case/when');
        sf.stateObjects['suite/case/when'].next('test_ok')
            .should.have.property('name').with.equal('suite/case/then');

        // suite/case/then
        sf.stateObjects['suite/case/then'].next('test_back')
            .should.have.property('name').with.equal('suite/case/then');
        sf.stateObjects['suite/case/then'].next('test_ok')
            .should.have.property('name').with.equal('suite/case/result');
        sf.stateObjects['suite/case/then'].next('test_ng')
            .should.have.property('name').with.equal('suite/case/result');

        // suite/case/result
        sf.stateObjects['suite/case/result'].valiables = {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
        };
        let finish = sf.stateObjects['suite/case/result'].next('test_finish');
        finish.should.have.property('name').with.equal('finish');
        finish.should.have.property('valiables').with.deep.equal({
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
        });
        sf.stateObjects['suite/case/result'].next('has_next')
            .should.have.property('name').with.equal('suite/has_next');
        sf.stateObjects['suite/case/result'].next('does_not_have_next')
            .should.have.property('name').with.equal('suite/no_more_test');

        // suite/no_more_test
        sf.stateObjects['suite/no_more_test'].next()
            .should.have.property('name').with.equal('finish');

        // suite/has_next
        sf.stateObjects['suite/has_next'].next()
            .should.have.property('name').with.equal('suite/case/initial');

        try {
            sf.stateObjects['suite/case/result'].next();
        } catch (e) {
            e.should.be.a('error');
        }
    });
});
