/**
 ** main class of State
 */
export default class State {
    /**
     * @constructor
     * @param {Object} valiable
     * @param {string} speak
     * @param {string} action
     * @param {Object} conditions
     */
    constructor({valiable = {},
        speak,
        action,
        conditions = {}}) {
        this.valiable = valiable;
        this.speak = speak;
        this.action = action;
        this.conditions = conditions;
    }
}
