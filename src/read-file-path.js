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
    excludeDir: []
}

const FILETYPE = 'FILE';
const DIRTYPE = 'DIR';

let readFilePathSync = function(dirPath, options = {}) {
    let basePath = _getFilePath(dirPath);
    //TODO: check options
    options = Object.assign(defaultOpts, options);
    // Options
    let includeFileRegexp = options.include.map(i=>i).concat(options.includeFile.map(i=>i));
    let excludeFileRegexp = options.exclude.map(i=>i).concat(options.excludeFile.map(i=>i));
    let includeDirRegexp = options.include.map(i=>i).concat(options.includeDir.map(i=>i));
    let excludeDirRegexp = options.exclude.map(i=>i).concat(options.excludeDir.map(i=>i));
    let fileList = [];
    // Get all children directory and file.
    fileList = _readAllFileSync(basePath);
    // Reduce by file type.
    fileList = _reduceByType(fileList.map(i=>i), options.type.toUpperCase());
    // Reduce by includeFile regexp.
    fileList = _reduceByIncludeFile(fileList.map(i=>i), includeFileRegexp);
    // Reduce by excludeFile regexp.
    fileList = _reduceByExcludeFile(fileList.map(i=>i), excludeFileRegexp);
    // Reduce by includeDir regexp.
    fileList = _reduceByIncludeDir(fileList.map(i=>i), basePath, includeDirRegexp);
    // Reduce by excludeDir regexp.
    fileList = _reduceByExcludeDir(fileList.map(i=>i), basePath, excludeDirRegexp);
    return fileList;
}

export default {
    readFilePathSync: readFilePathSync
    // readFilPath: readFilePath [TDB]Plan to add in v 2.1.0
    // readFilePathPromise: readFilePathPromise [TDB]Plan to add in v 3.1.0
}

// Get absolute path
let _getFilePath = function(dirPath) {
    return path.normalize(path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath));
}

let _readAllFileSync = function(dirPath) {
    let fileList = [];
    fs.readdirSync(dirPath).forEach((filePath) => {
        if (_isDirectory(_getFullPath(dirPath, filePath))) {
            fileList.push(_getFullPath(dirPath, filePath));
            fileList = fileList.map(i=>i).concat(_readAllFileSync(_getFullPath(dirPath, filePath)));
        } else if (_isFile(_getFullPath(dirPath, filePath))) {
            fileList.push(_getFullPath(dirPath, filePath));
        }
    });
    return fileList;
}

let _getFullPath = function(base, currentPath) {
    return path.join(base, currentPath);
}

let _isDirectory = function(filePath) {
    return fs.statSync(filePath).isDirectory();
}

let _isFile = function(filePath) {
    return fs.statSync(filePath).isFile()
}

let _reduceByType = function(fileList, type) {
    switch(type.toUpperCase()) {
        case FILETYPE:
            return fileList.reduce((list, item) => {
                if (_isFile(item)) {
                    list.push(item);
                }
                return list;
            }, []);
        case DIRTYPE:
            return fileList.reduce((list, item) => {
                if (_isDirectory(item)) {
                    list.push(item);
                }
                return list;
            }, []);
        default:
            return fileList.map(i=>i);
    }
}

let _reduceByIncludeFile = function(fileList, includeRegexp) {
    return fileList.reduce((list, filePath) => {
        if (_isFile(filePath) && _isInclude(path.basename(filePath), includeRegexp)) {
            list.push(filePath);
        } else if (_isDirectory(filePath)) {
            list.push(filePath);
        }
        return list;
    }, []);
}

let _reduceByExcludeFile = function(fileList, excludeRegexp) {
    return fileList.reduce((list, filePath) => {
        if (_isFile(filePath) && !_isExclude(path.basename(filePath), excludeRegexp)) {
            list.push(filePath);
        } else if (_isDirectory(filePath)) {
            list.push(filePath);
        }
        return list;
    }, []);
}

let _reduceByIncludeDir = function(fileList, basePath, includeRegexp) {
    return fileList.reduce((list, filePath) => {
        let relativePathList = path.dirname(filePath).split(path.join(basePath, '/'))[1].split(path.sep);
        for (let i in relativePathList) {
            if (_isInclude(relativePathList[i], includeRegexp)) {
                list.push(filePath);
                break;
            }
        }
        return list;
    }, []);
}

let _reduceByExcludeDir = function(fileList, basePath, excludeRegexp) {
    return fileList.reduce((list, filePath) => {
        let exclude = false;
        let relativePathList = path.dirname(filePath).split(path.join(basePath, '/'))[1].split(path.sep);
        for (let i in relativePathList) {
            if (_isExclude(relativePathList[i], excludeRegexp)) {
                exclude = true;
                break;
            }
        }
        if (!exclude) {
            list.push(filePath);
        }
        return list;
    }, []);
}

let _isInclude = function(name, regexpList) {
    let isInclude = true;
    for (let i in regexpList) {
        if (minimatch(name, regexpList[i])) {
            isInclude = true;
            break;
        } else {
            isInclude = false;
        }
    }
    return isInclude;
}

let _isExclude = function(name, regexpList) {
    
    let isExclude = false;
    for (let i in regexpList) {
        if (minimatch(name, regexpList[i])) {
            isExclude = true;
            break;
        } else {
            isExclude = false;
        }
    }
    return isExclude;
}