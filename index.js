#!/usr/bin/env node

let program = require('commander');
let pkg = require('./package');

let decisionValue = undefined;
let argsValue = undefined;

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('state-machine-exec <decision> <args>')
    .arguments('<decision> <args>')
    .action(function(decision,args){
        decisionValue = decision;
        argsValue = args;
    });
program.parse(process.argv);
if(typeof decisionValue === 'string'){
    process.env['SME_DECISION'] = decisionValue;
}
if(typeof argsValue === 'string'){
    process.env['SME_ARGS'] = argsValue;
}

let StateMachineExec = require('./lib/state-machine-exec');
let sme = new StateMachineExec();
sme.run()
    .then(function(){
    })
    .catch(function(err){ console.warn(err)});
