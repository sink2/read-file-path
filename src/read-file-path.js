import fs from 'fs';
import path from 'path';
import minimatch from 'minimatch';

const defaultOpts = {
    // 'All' : Return directory and file.
    // 'File': Retur file only.
    // 'Dir' : Return directory only.
    type: 'File',
    // List of match regexp.
    // For example, '*_test' or ['*_test'] will match directory 'read_test' and file 'read_test.js'.
    // When pass list, it will match all the regexp that define in the list.
    include: [],
    // List of file match regexp.
    // If 'include' is passed, will first match 'include' regexp and then match the 'includeFile' regexp.
    includeFile: [],
    // List of directory match regexp.
    // If 'include' is passed, will first match 'include' regexp and then match the 'includeDir' regexp.
    includeDir: [],
    // List of exclude regexp.
    // For example, '*_test' or ['*_test'] will ignore directory 'read_test' and file 'read_test.js'.
    // When pass list, it will ignore all the regexp that define in the list.
    exclude: [],
    // List of file ignore regexp.
    // If 'exclude' is passed, will first ignore 'include' regexp and then ingore the 'excludeFile' regexp.
    excludeFile: [],
    // List of directory ignore regexp.
    // If 'exclude' is passed, will first ignore 'exclude' regexp and then ignore the 'excludeDir' regexp.
    excludeDir: [],
    // Whether find exclude directory or not.
    // true : Will not search the exclude directory.
    // false: Will still search the exclude directory.
    excludeDirChild: false,
    // Whether ignore the empty folder or not. [TDB]Plan to add in v 1.0.1
    // ture : Ignore empty folder.
    // false: Does not ignore empty folder.
    // ignoreEmptyFolder: false
}

const ALLTYPE = 'ALL';
const FILETYPE = 'FILE';
const DIRTYPE = 'DIR';

let readFilePathSync = function(dirPath, options = {}) {
    dirPath = _getFilePath(dirPath);
    //TODO: check options
    options = Object.assign(defaultOpts, options);
    let fileList = [];
    fileList = _readAllFileSync(dirPath, options);
    return fileList;
}

export default {
    readFilePathSync: readFilePathSync
    // readFilPath: readFilePath [TDB]Plan to add in v 1.1.0
    // readFilePathPromise: readFilePathPromise [TDB]Plan to add in v 1.1.0
}

// Get path
let _getFilePath = function(dirPath) {
    return path.normalize(path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath));
}

let _readAllFileSync = function(dirPath, options) {
    let fileList = [];
    let type = options.type.toUpperCase();
    let includeFileRegexp = options.include.map(i=>i).concat(options.includeFile.map(i=>i));
    let excludeFileRegexp = options.exclude.map(i=>i).concat(options.excludeFile.map(i=>i));
    let includeDirRegexp = options.include.map(i=>i).concat(options.includeDir.map(i=>i));
    let excludeDirRegexp = options.exclude.map(i=>i).concat(options.excludeDir.map(i=>i));
    fs.readdirSync(dirPath).forEach((item) => {
        if (fs.statSync(_getPath(dirPath, item)).isDirectory() && (options.excludeDirChild ? _isInclude(item, includeDirRegexp, excludeDirRegexp) : true)) {
            if (_isInclude(item, includeDirRegexp, excludeDirRegexp)) {
                fileList = fileList.map(i=>i).concat(type === ALLTYPE || type === DIRTYPE ? [_getPath(dirPath, item)] : []);
            }
            fileList = fileList.map(i=>i).concat(_readAllFileSync(_getPath(dirPath, item), options));
        } else if (fs.statSync(_getPath(dirPath, item)).isFile() && _isInclude(item, includeFileRegexp, excludeFileRegexp)) {
            fileList = fileList.map(i=>i).concat(type === ALLTYPE || type === FILETYPE ? [_getPath(dirPath, item)] : []);
        } 
    })
    return fileList;
}

let _getPath = function(base, currentPath) {
    return path.join(base, currentPath);
}

let _isInclude = function(file, includeRegexp, excludeRegexp) {
    let isInclude = true;
    let isExclude = false;
    for (let i in includeRegexp) {
        if (!minimatch(file, includeRegexp[i])) {
            isInclude = false;
        } else {
            isInclude = true;
            break;
        }
    }
    for (let i in excludeRegexp) {
        if (minimatch(file, excludeRegexp[i])) {
            isExclude = true;
            break;
        }
    }
    return isInclude && !isExclude;
}