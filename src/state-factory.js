import smcat from 'state-machine-cat';
import fs from 'fs';
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
}
