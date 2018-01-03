import {exec} from 'child_process';
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
            if (key.startsWith('SAH_')) {
                environments[key] = process.env[key];
            }
        });
        return JSON.stringify({
            name: this.name,
            activities: this.activities,
            environments: environments,
            activity_line:this.activity_line
        }, undefined, '\t');
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
     */
    async action() {
        if (typeof this.activities === 'string') {
            const activities = this.activities.split('\n')
                .map((value) => {
                    return value.replace('；', ';');
                });
            for (;this.activity_line < activities.length;
                this.activity_line++) {
                const command = activities[this.activity_line];
                const {stdout, stderr} = await (new Promise(
                    (resolve, reject) => {
                        exec(command, (err, stdout, stderr) => {
                            if (err) return reject(err);
                            resolve({stdout, stderr});
                        });
                    }));
                if (stdout.startsWith('SAH_COMMAND=')) {
                    process.env['SAH_COMMAND'] = stdout
                        .replace('SAH_COMMAND=', '')
                        .replace(/\n/, '');
                }
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
            }
        }
    }
}
