#!/usr/bin/env node

let program = require('commander');
let pkg = require('./package');

let hostValue = undefined;
let textValue = undefined;

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('semi-autotesting-handler <host> <text>')
    .arguments('<host> <text>')
    .action(function(host,text){
        hostValue = host;
        textValue = text;
    });
program.parse(process.argv);
if(typeof hostValue === 'undefined' || typeof textValue === 'undefined'){
    console.error(program.usage());
    process.exit(1);
}

let SemiAutotestingHandler = require('./lib/semi-autotesting-handler');
let ghs = new SemiAutotestingHandler();
ghs.run(hostValue,textValue)
    .then(function(){
    })
    .catch(function(){});
