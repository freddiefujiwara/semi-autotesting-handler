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
     * @param {Object} valiable
     */
    constructor({name, parent, activities, decisionMap={}, valiable={}}) {
        this.name = name;
        this.parent = parent;
        this.activities = activities;
        this.decisionMap = decisionMap;
        this.valiable = valiable;
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
            valiable: this.valiable,
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
            return object.decisionMap[decision];
        }
        if (object.hasOwnProperty('parent')
            && typeof object.parent === 'object') {
            return this.next(decision, object.parent);
        }
        throw new Error(`${object.name}:${decision} not found`);
    }
}
