import {exec} from 'child_process';
import util from 'util';
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
     * @param {Object} valiables
     */
    constructor({name, parent, activities, decisionMap={}, valiables={}}) {
        this.name = name;
        this.parent = parent;
        this.activities = activities;
        this.decisionMap = decisionMap;
        this.valiables = valiables;
    }
    /**
     * toString
     * return this as a JSON
     * @return {string}
     */
    toString() {
        return JSON.stringify({
            name: this.name,
            activities: this.activities,
            valiables: this.valiables,
        });
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
            Object.assign(
                object.decisionMap[decision].valiables
                , this.valiables);
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
            for ( let command of activities) {
                const {stdout, stderr} = await (new Promise(
                    (resolve, reject) => {
                        exec(command,(err,stdout,stderr) => {
                            if(err) return reject(err);
                            resolve({stdout,stderr});
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
