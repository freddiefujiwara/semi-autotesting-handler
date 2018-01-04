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
        Object.keys(obj.environments).map((key) => {
            process.env[key] = obj.environments[key];
        });
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
            let target = object.decisionMap[decision];
            target.activity_line = 0;
            return target;
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
                            return value.replace(/；/g, ';');
                        });
                    for (;this.activity_line < activities.length;
                        this.activity_line++) {
                        let command = activities[this.activity_line];
                        command += ` && env | grep SME_`;
                        const stdouts = execSync(command)
                            .toString().split(/\n/);
                        let stdout= '';
                        stdouts.map((keyVal) => {
                            if (keyVal.startsWith('SME_')) {
                                const pair = keyVal.split(/=/);
                                process.env[pair[0]] = pair[1];
                                return;
                            }
                            stdout += keyVal;
                        });
                        console.log('SME> ', stdout);
                    }
                }
                resolve(this);
            }
        ));
    }
}
