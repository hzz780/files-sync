/**
 * @file sync
 * @author zhangzimeng01
 */
let chokidar = require('chokidar');
let fs = require('fs-extra');
let path = require('path');
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.setLevel('debug');

function watch(source, target, verb = false) {
    let dir = path.dirname(source);
    let root = source.replace(dir, target);
    console.info(root);
    fs.removeSync(root);
    if (verb) {
        logger.debug(`unlink root dir:${root}`);
    }

    chokidar.watch(source).on('all', (event, p) => {
        let dest = p.replace(dir, target);
        switch (event) {
            case 'add':
            case 'change':
                fs.copy(p, dest);
                if (verb) {
                    logger.debug(`${p} is ${event},copy ${p} to ${dest}`);
                }
                break;
            case 'addDir':
                fs.mkdir(dest);
                if (verb) {
                    logger.debug(`${p} is ${event},addDir ${dest}`);
                }
                break;
            case 'unlink':
            case 'unlinkDir':
                fs.remove(dest);
                if (verb) {
                    logger.debug(`${p} is ${event},${event} ${dest}`);
                }
                break;
        }
    });
}

module.exports = function (sources, target, verb = false) {
    if (sources.constructor.name === 'Array') {
        sources.forEach(source => {
            watch(source, target, verb);
        });
    }
};
