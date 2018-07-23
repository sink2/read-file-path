# read-file-path
read-file-path is an utility module that help to get all child file path by given path. 

[![node](https://img.shields.io/badge/node-v9.3.0-blue.svg)](https://nodejs.org/en/)
[![npm](https://img.shields.io/badge/npm-v5.5.1-blue.svg)](https://www.npmjs.com/package/read-file-path)

# Installation
```js
npm install read-file-path
```

# Usage

```js
import readFilepath from 'read-file-path';
readFilepath(path, options)
```
For Example:  

|---src  
|　　|---common  
|　　|---component  
|　　|　　|---componentA.js  
|　　|---theme  
|　　|　　|---themeA.style  
|　　|---main.js  
|---lib  
|　　|---vendor.js  
|---package.json  
  
```js
import readFilepath from 'read-file-path';

let fileList = readFilepath.readFilePathSync('src/')
// ['X/src/component/componentA.js', 'X/src/theme/themeA.style', 'X/src/main.js'] 

let fileList = readFilepath.readFilePathSync('src/', {type: 'All', include: ['component*']})
// ['X/src/component', 'X/src/component/componentA.js'] 

let fileList = readFilepath.readFilePathSync('src/', {type: 'Dir', include: ['component*']})
// ['X/src/component'] 
```
X represent the part of absolute path.The return value of the list is always absolute path.  
It is recommended that the `path` parameter be an absolute path.If the `path` is relative path, `process.cwd()` will be used as base path.

# Function
## readFilePathSync(path, options)
#### path: The search path.  
#### options: 
* type　`Default: 'File'`  
Read file type:  
　'All' : Return directory and file.  
　'File': Retur file only.  
　'Dir' : Return directory only.
 
* include　`Default: []`  
List of match regexp.  
For example, ['\*_test'] will match directory 'read_test' and file 'read_test.js'.
* includeFile　`Default: []`  
List of directory match regexp.  
If 'include' is passed, will first match 'include' regexp and then match the 'includeDir' regexp.
* includeDir　`Default: []`  
List of directory match regexp.  
If 'include' is passed, will first match 'include' regexp and then match the 'includeDir' regexp.
* exclude　`Default: []`  
List of exclude regexp.  
For example, '*_test' or ['*_test'] will ignore directory 'read_test' and file 'read_test.js'.
* excludeFile　`Default: []`  
List of file ignore regexp.  
If 'exclude' is passed, will first ignore 'include' regexp and then ingore the 'excludeFile' regexp.
* excludeDir　`Default: []`  
List of directory ignore regexp.  
If 'exclude' is passed, will first ignore 'exclude' regexp and then ignore the 'excludeDir' regexp.
