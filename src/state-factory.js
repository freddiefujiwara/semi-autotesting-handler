import smcat from 'state-machine-cat';
import fs from 'fs';
import os from 'os';
import path from 'path';
import State from './state';
/**
 ** main class of State
 */
export default class StateFactory {
    /**
     * @constructor
     * @param {string} stateMachineFile
     * @param {string} currentStateFile
     * @param {Object} conditions
     */
    constructor(stateMachineFile
        = `${os.homedir()}${path.sep}.state-machine-exec.sm`,
        currentStateFile
        = `${os.homedir()}${path.sep}.state-machine-exec-current.json`) {
        this.stateMachineFile = stateMachineFile;
        this.currentStateFile = currentStateFile;
        this.stateObjects = {};
    }
    /**
     * save state function
     * @param {State} state
     */
    save(state) {
        fs.writeFileSync(this.currentStateFile,
            state.toString(), {encoding: 'utf-8', mode: 0o644, flag: 'w+'});
    }
    /**
     * load state function
     * @return {State} state
     */
    load() {
        try {
            const strObj = fs.readFileSync(this.currentStateFile, 'utf-8');
            const loadedObj = JSON.parse(strObj);
            if (this.stateObjects.hasOwnProperty(loadedObj.name)) {
                const targetObj = this.stateObjects[loadedObj.name];
                targetObj.fromString(strObj);
                return targetObj;
            }
        } catch (e) {}
        return this.stateObjects.initial;
    }

    /**
     * smToJSON function
     * @return {Promise}
     */
    async smToJSON() {
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
     * @return {Promise}
     */
    async walk(node, parent = undefined) {
        return new Promise(async (resolve, reject) => {
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
            resolve();
        });
    }
}
