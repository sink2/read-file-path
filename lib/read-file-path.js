'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOpts = {
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
};

var FILETYPE = 'FILE';
var DIRTYPE = 'DIR';

var readFilePathSync = function readFilePathSync(dirPath) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var basePath = _getFilePath(dirPath);
    //TODO: check options
    options = Object.assign(defaultOpts, options);
    // Options
    var includeFileRegexp = options.include.map(function (i) {
        return i;
    }).concat(options.includeFile.map(function (i) {
        return i;
    }));
    var excludeFileRegexp = options.exclude.map(function (i) {
        return i;
    }).concat(options.excludeFile.map(function (i) {
        return i;
    }));
    var includeDirRegexp = options.include.map(function (i) {
        return i;
    }).concat(options.includeDir.map(function (i) {
        return i;
    }));
    var excludeDirRegexp = options.exclude.map(function (i) {
        return i;
    }).concat(options.excludeDir.map(function (i) {
        return i;
    }));
    var fileList = [];
    // Get all children directory and file.
    fileList = _readAllFileSync(basePath);
    // Reduce by file type.
    fileList = _reduceByType(fileList.map(function (i) {
        return i;
    }), options.type.toUpperCase());
    // Reduce by includeFile regexp.
    fileList = _reduceByIncludeFile(fileList.map(function (i) {
        return i;
    }), includeFileRegexp);
    // Reduce by excludeFile regexp.
    fileList = _reduceByExcludeFile(fileList.map(function (i) {
        return i;
    }), excludeFileRegexp);
    // Reduce by includeDir regexp.
    fileList = _reduceByIncludeDir(fileList.map(function (i) {
        return i;
    }), basePath, includeDirRegexp);
    // Reduce by excludeDir regexp.
    fileList = _reduceByExcludeDir(fileList.map(function (i) {
        return i;
    }), basePath, excludeDirRegexp);
    return fileList;
};

module.exports = {
    readFilePathSync: readFilePathSync
    // readFilPath: readFilePath [TDB]Plan to add in v 2.1.0
    // readFilePathPromise: readFilePathPromise [TDB]Plan to add in v 3.1.0


    // Get absolute path
};var _getFilePath = function _getFilePath(dirPath) {
    return _path2.default.normalize(_path2.default.isAbsolute(dirPath) ? dirPath : _path2.default.join(process.cwd(), dirPath));
};

var _readAllFileSync = function _readAllFileSync(dirPath) {
    var fileList = [];
    _fs2.default.readdirSync(dirPath).forEach(function (filePath) {
        if (_isDirectory(_getFullPath(dirPath, filePath))) {
            fileList.push(_getFullPath(dirPath, filePath));
            fileList = fileList.map(function (i) {
                return i;
            }).concat(_readAllFileSync(_getFullPath(dirPath, filePath)));
        } else if (_isFile(_getFullPath(dirPath, filePath))) {
            fileList.push(_getFullPath(dirPath, filePath));
        }
    });
    return fileList;
};

var _getFullPath = function _getFullPath(base, currentPath) {
    return _path2.default.join(base, currentPath);
};

var _isDirectory = function _isDirectory(filePath) {
    return _fs2.default.statSync(filePath).isDirectory();
};

var _isFile = function _isFile(filePath) {
    return _fs2.default.statSync(filePath).isFile();
};

var _reduceByType = function _reduceByType(fileList, type) {
    switch (type.toUpperCase()) {
        case FILETYPE:
            return fileList.reduce(function (list, item) {
                if (_isFile(item)) {
                    list.push(item);
                }
                return list;
            }, []);
        case DIRTYPE:
            return fileList.reduce(function (list, item) {
                if (_isDirectory(item)) {
                    list.push(item);
                }
                return list;
            }, []);
        default:
            return fileList.map(function (i) {
                return i;
            });
    }
};

var _reduceByIncludeFile = function _reduceByIncludeFile(fileList, includeRegexp) {
    return fileList.reduce(function (list, filePath) {
        if (_isFile(filePath) && _isInclude(_path2.default.basename(filePath), includeRegexp)) {
            list.push(filePath);
        } else if (_isDirectory(filePath)) {
            list.push(filePath);
        }
        return list;
    }, []);
};

var _reduceByExcludeFile = function _reduceByExcludeFile(fileList, excludeRegexp) {
    return fileList.reduce(function (list, filePath) {
        if (_isFile(filePath) && !_isExclude(_path2.default.basename(filePath), excludeRegexp)) {
            list.push(filePath);
        } else if (_isDirectory(filePath)) {
            list.push(filePath);
        }
        return list;
    }, []);
};

var _reduceByIncludeDir = function _reduceByIncludeDir(fileList, basePath, includeRegexp) {
    return fileList.reduce(function (list, filePath) {
        var relativePathList = _path2.default.dirname(filePath).split(_path2.default.join(basePath, '/')).length === 1 ? [] : _path2.default.dirname(filePath).split(_path2.default.join(basePath, '/'))[1].split(_path2.default.sep);
        for (var i in relativePathList) {
            if (_isInclude(relativePathList[i], includeRegexp)) {
                list.push(filePath);
                break;
            }
        }
        return list;
    }, []);
};

var _reduceByExcludeDir = function _reduceByExcludeDir(fileList, basePath, excludeRegexp) {
    return fileList.reduce(function (list, filePath) {
        var exclude = false;
        var relativePathList = _path2.default.dirname(filePath).split(_path2.default.join(basePath, '/')).length === 1 ? [] : _path2.default.dirname(filePath).split(_path2.default.join(basePath, '/'))[1].split(_path2.default.sep);
        for (var i in relativePathList) {
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
};

var _isInclude = function _isInclude(name, regexpList) {
    var isInclude = true;
    for (var i in regexpList) {
        if ((0, _minimatch2.default)(name, regexpList[i])) {
            isInclude = true;
            break;
        } else {
            isInclude = false;
        }
    }
    return isInclude;
};

var _isExclude = function _isExclude(name, regexpList) {

    var isExclude = false;
    for (var i in regexpList) {
        if ((0, _minimatch2.default)(name, regexpList[i])) {
            isExclude = true;
            break;
        } else {
            isExclude = false;
        }
    }
    return isExclude;
};