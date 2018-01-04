import {execSync} from 'child_process';
/**
 ** main class of State
 */
export default class State {
    /**
     * @constructor
     * @param {string} name
     * @param {string} parent
     * @param {string} activities
     * @param {Object} dicision
     */
    constructor({name, parent, activities, decisionMap={}}) {
        this.name = name;
        this.parent = parent;
        this.activities = activities;
        this.activity_line = 0;
        this.environments = {};
        this.decisionMap = decisionMap;
    }
    /**
     * toString
     * return this as a JSON
     * @return {string}
     */
    toString() {
        let environments = {};
        Object.keys(process.env).map((key) => {
            if (key.startsWith('SME_')) {
                environments[key] = process.env[key];
            }
        });
        return JSON.stringify({
            name: this.name,
            activities: this.activities,
            environments: environments,
            activity_line: this.activity_line,
        }, undefined, '\t');
    }
    /**
     * fromString
     * @param {string} str JSON expression of State object
     */
    fromString(str) {
        let obj = JSON.parse(str);
        this.name = obj.name;
        this.activities = obj.activities;
        this.environments = obj.environments;
        this.activity_line = obj.activity_line;
    }
    /**
     * next
     * @param {string} decision
     * @param {State} object
     * @return {State}
     */
    next(decision = 'default', object = this) {
        if (object.decisionMap.hasOwnProperty(decision)
            && typeof object.decisionMap[decision] === 'object'
        ) {
            return object.decisionMap[decision];
        }
        if (object.hasOwnProperty('parent')
            && typeof object.parent === 'object') {
            return this.next(decision, object.parent);
        }
        throw new Error(`${object.name}:${decision} not found`);
    }
    /**
     * action
     * @return {Promise}
     */
    async action() {
        return (new Promise(
            async (resolve, reject) => {
                if (typeof this.activities === 'string') {
                    // need to be UTF-8 ";" because of spec of state-machine-cat
                    const activities = this.activities.split('\n')
                        .map((value) => {
                            return value.replace('；', ';');
                        });
                    for (;this.activity_line < activities.length;
                        this.activity_line++) {
                        const command = activities[this.activity_line];
                        // :SME_SUSPEND is magic word to suspend this action
                        if (command === ':SME_SUSPEND') {
                            this.activity_line++;
                            return reject(command);
                        }
                        const stdout = execSync(command)
                            .toString().replace(/\n/, '');
                        // SME_COMMAND env will be inherited from child_process
                        if (stdout.startsWith('SME_COMMAND=')) {
                            process.env['SME_COMMAND'] = stdout
                                .replace('SME_COMMAND=', '');
                        }
                        console.log('SME> ', stdout);
                    }
                }
                resolve(this);
            }
        ));
    }
}
