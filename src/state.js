/**
 ** main class of State
 */
export default class State {
    /**
     * @constructor
     * @param {string} name
     * @param {string} parent
     * @param {string} activities
     * @param {Object} conditions
     */
    constructor({name, parent, activities, decision}) {
        this.name = name;
        this.parent = parent;
        this.activities = activities;
        this.decision = decision;
    }
}
