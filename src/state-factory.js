import smcat from "state-machine-cat";
/**
 ** main class of State
 */
export default class StateFactory {
    /**
     * @constructor
     * @param {string} stateMachineFile
     * @param {Object} conditions
     */
    constructor(stateMachineFile = '~/.semi-autotesting-handler.sm'){
        this.stateMachineFile = stateMachineFile;
    }
}
