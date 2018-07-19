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
    excludeDir: [],
    // Whether find exclude directory or not.
    // true : Will not search the exclude directory.
    // false: Will still search the exclude directory.
    excludeDirChild: false
    // Whether ignore the empty folder or not. [TDB]Plan to add in v 1.0.1
    // ture : Ignore empty folder.
    // false: Does not ignore empty folder.
    // ignoreEmptyFolder: false
};

var ALLTYPE = 'ALL';
var FILETYPE = 'FILE';
var DIRTYPE = 'DIR';

var readFilePathSync = function readFilePathSync(dirPath) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    dirPath = _getFilePath(dirPath);
    //TODO: check options
    options = Object.assign(defaultOpts, options);
    var fileList = [];
    fileList = _readAllFileSync(dirPath, options);
    return fileList;
};

module.exports = {
    readFilePathSync: readFilePathSync
    // readFilPath: readFilePath [TDB]Plan to add in v 1.1.0
    // readFilePathPromise: readFilePathPromise [TDB]Plan to add in v 1.1.0


    // Get path
};var _getFilePath = function _getFilePath(dirPath) {
    return _path2.default.normalize(_path2.default.isAbsolute(dirPath) ? dirPath : _path2.default.join(process.cwd(), dirPath));
};

var _readAllFileSync = function _readAllFileSync(dirPath, options) {
    var fileList = [];
    var type = options.type.toUpperCase();
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
    _fs2.default.readdirSync(dirPath).forEach(function (item) {
        if (_fs2.default.statSync(_getPath(dirPath, item)).isDirectory() && (options.excludeDirChild ? _isInclude(item, includeDirRegexp, excludeDirRegexp) : true)) {
            if (_isInclude(item, includeDirRegexp, excludeDirRegexp)) {
                fileList = fileList.map(function (i) {
                    return i;
                }).concat(type === ALLTYPE || type === DIRTYPE ? [_getPath(dirPath, item)] : []);
            }
            fileList = fileList.map(function (i) {
                return i;
            }).concat(_readAllFileSync(_getPath(dirPath, item), options));
        } else if (_fs2.default.statSync(_getPath(dirPath, item)).isFile() && _isInclude(item, includeFileRegexp, excludeFileRegexp)) {
            fileList = fileList.map(function (i) {
                return i;
            }).concat(type === ALLTYPE || type === FILETYPE ? [_getPath(dirPath, item)] : []);
        }
    });
    return fileList;
};

var _getPath = function _getPath(base, currentPath) {
    return _path2.default.join(base, currentPath);
};

var _isInclude = function _isInclude(file, includeRegexp, excludeRegexp) {
    var isInclude = true;
    var isExclude = false;
    for (var i in includeRegexp) {
        if (!(0, _minimatch2.default)(file, includeRegexp[i])) {
            isInclude = false;
        } else {
            isInclude = true;
            break;
        }
    }
    for (var _i in excludeRegexp) {
        if ((0, _minimatch2.default)(file, excludeRegexp[_i])) {
            isExclude = true;
            break;
        }
    }
    return isInclude && !isExclude;
};