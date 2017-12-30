import StateFactory from './state-factory';
/**
 ** main class of StateMachineExec
 */
export default class StateMachineExec {
    /**
     * @constructor
     */
    constructor() {
        this.detector = new StateFactory();
    }
    /**
     * run commands
     * @return {void}
     */
    run() {
    }
}
