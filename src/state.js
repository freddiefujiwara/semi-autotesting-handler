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
    toString(){
        return JSON.stringify({
            name:this.name, 
            parent:this.parent, 
            activities:this.activities, 
            decisionMap:this.decisionMap, 
            valiable:this.valiable
        });
    }
    /**
     * next
     * @param {string} decision
     * @return {State}
     */
    next(decision,object = this){
        if(object.decisionMap.hasOwnProperty(decision)){
            return object.decisionMap[decision];
        }
        return this.next(decision,object.parent);
    }
}
