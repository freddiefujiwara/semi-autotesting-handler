import smcat from 'state-machine-cat';
import fs from 'fs';
import State from './state';
/**
 ** main class of State
 */
export default class StateFactory {
    /**
     * @constructor
     * @param {string} stateMachineFile
     * @param {Object} conditions
     */
    constructor(stateMachineFile = '~/.semi-autotesting-handler.sm') {
        this.stateMachineFile = stateMachineFile;
        this.stateObjects = {};
    }

    /**
     * load function
     * @return {Promise}
     */
    async load() {
        return new Promise((resolve, reject) => {
            let script = undefined;
            try {
                script = fs.readFileSync(this.stateMachineFile, 'utf8');
            } catch (err) {
                return reject(err);
            }
            smcat.render(
                script,
                {
                    outputType: 'json',
                },
                (err, success) => {
                    if (Boolean(err)) {
                        return reject(err);
                    } else {
                        return resolve(success);
                    }
                });
        });
    }
    /**
     * walk
     * @param {object} node
     * @param {string} parent
     */
    async walk(node, parent = undefined) {
        if (node.hasOwnProperty('states')) {
            for (let child of node.states) {
                this.stateObjects[child.name] = new State({name: child.name,
                    parent: parent,
                    activities: child.activities,
                });
                if (child.hasOwnProperty('statemachine') &&
                    child.statemachine.hasOwnProperty('states')
                ) {
                    await this.walk(child.statemachine,
                        this.stateObjects[child.name]);
                }
            }
        }
        if (node.hasOwnProperty('transitions')) {
            for (let child of node.transitions) {
                this.stateObjects[child.from].decisionMap =
                    this.stateObjects[child.from].decisionMap || {};
                this.stateObjects[child.from]
                    .decisionMap[child.label || 'default']
                    = this.stateObjects[child.to];
            }
        }
    }
}
