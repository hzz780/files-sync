#!/usr/bin/env node
/**
 * @file index
 * @author zhangzimeng01、huangzongzhe
 */
let program = require('commander');
let fs = require('fs-extra');
let sync = require('./sync');
program.version('0.0.1')
    .option('-s, --source <string>', 'jssdk source folder,split with ,')
    .option('-p, --project <string>', 'project which use jssdk')
    .option('-f, --file <string>', 'which files in source code should be synced')
    .option('-v, --verb', 'verb log')
    .parse(process.argv);

let folders;
if (program.file) {
    folders = program.file.split(',');
} else {
    folders = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf-8')).folders;
}

let sources = folders.map(folder => program.source + '/' + folder);
console.log('sources, program.project, program.verb: ', sources, program.project, program.verb);

sync(sources, program.project + '/node_modules/aelf-sdk', program.verb);
