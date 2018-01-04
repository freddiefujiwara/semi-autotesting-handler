#!/usr/bin/env node

let decisionValue = undefined;
let argsValue = undefined;
if(process.argv.length > 3){
    argsValue = process.argv[3];
}
if(process.argv.length > 2){
    decisionValue = process.argv[2];
}

const StateMachineExec = require('./lib/state-machine-exec');
const sme = new StateMachineExec();
sme.run(decisionValue,argsValue)
    .then(function(){
    })
    .catch(function(err){ console.warn(err)});
