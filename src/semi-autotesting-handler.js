import StateFactory from './state-factory';
/**
 ** main class of SemiAutotestingHandler
 */
export default class SemiAutotestingHandler {
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
