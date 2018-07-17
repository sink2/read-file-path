import fs from 'fs';
import path from 'path';

function _getFilePath(dirPath) {
    return path.isAbsolute(dirPath) ? dirPath : path.join(__dirname, dirPath);
}

export default {
    readFilePathSync: readFilePathSync
    // readFilPath: readFilePath
    // readFilePathPromise: readFilePathPromise
}