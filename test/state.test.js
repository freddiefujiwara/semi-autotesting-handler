/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import State from '../src/state';
import StateMachineExec from '../src/state-machine-exec';
describe('State test.', (suite) => {
    let s = undefined;
    beforeEach(() => {
        s = new State({
            name: 'name',
            parent: 'parent',
            activities:
            `export SME_DECISION=dummy_command;echo SME_DECISION=$SME_DECISION
            echo $SME_SUITE_ID；echo $SME_SUITE_ID
            echo Hello world`,
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
            .with.equal(
           `export SME_DECISION=dummy_command;echo SME_DECISION=$SME_DECISION
            echo $SME_SUITE_ID；echo $SME_SUITE_ID
            echo Hello world`);
        s.should.have.property('activity_line')
            .with.deep.equal(0);
        s.should.have.property('decisionMap')
            .with.deep.equal({});
        s.should.have.property('environments')
            .with.deep.equal({});
    });
    it('should convert to string and from string properly', () => {
        s.should.have.property('toString')
            .with.be.a('function');
        const str = s.toString();
        str.should.be.a('string');

        s.should.have.property('fromString')
            .with.be.a('function');
        const obj = new State({name: s.name, parent: s.parent,
            activities: s.activities, decisionMap: s.decisionMap});
        obj.fromString(str);
        obj.should.deep.equal(s);
    });
    it('should action properly', async () => {
        s.should.have.property('action')
            .with.be.a('function');
        process.env['SME_SUITE_ID'] = 'dummy_suite_id';
        if (!process.platform.startsWith('win')) {
            await s.action();
            process.env['SME_DECISION'].should.equal('dummy_command');
            const obj = JSON.parse(s.toString());
            obj.name.should.equal('name');
            obj.activity_line.should.equal(3);
            obj.environments.should.have.property('SME_DECISION')
                .with.equal('dummy_command');
            obj.environments.should.have.property('SME_SUITE_ID')
                .with.equal('dummy_suite_id');
        }
        const obj = new State({name: s.name, parent: s.parent, activities:
            'echo A\n' +
            'echo HAPPY\n' +
            'echo NEW\n' +
            'echo YEAR',
            decisionMap: s.decisionMap});
        obj.activity_line.should.equal(0);
        await obj.action();
        obj.activity_line.should.equal(4);
    });
    it('should move next properly', async () => {
        s.should.have.property('next')
            .with.be.a('function');
        s.toString().should.be.a('string');
        const sf = new StateMachineExec('test/semi-automation-test.sm');
        await sf.walk(await sf.smToJSON());
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
        let finish = sf.stateObjects['suite/case/result'].next('test_finish');
        finish.should.have.property('name').with.equal('finish');
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
