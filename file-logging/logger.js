// require the module
const RNFS = require('react-native-fs');

function getFilePath(filename) {
    return `${RNFS.DocumentDirectoryPath}/${filename}.json`;
}

async function removeAllFiles() {
    const allfiles = await getAllFiles()
    for (const file of allfiles) {
        await removeFile(file.path);
    }
}

async function readFile(path) {
    const values = await RNFS.readFile(path, 'utf8');
    console.log('values: ', values);
    try {
        return JSON.parse(values);
    } catch (error) {
        console.log('readFile: ', error);
        return JSON.parse(JSON.stringify(values));
    }
}

async function getAllFiles() {
    return RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        .then((result) => {
            console.log('GOT RESULT', result);
            return result;
            // stat the first file
            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        /* .then((statResult) => {
            if (statResult[0].isFile()) {
                // if we have a file, read it
                return RNFS.readFile(statResult[1], 'utf8');
            }

            return 'no file';
        })
        .then((contents) => {
            // log the file contents
            console.log(contents);
        }) */
        .catch((err) => {
            console.log(err.message, err.code);
        });
}

async function createFile(filename, val) {
    const path = getFilePath(btoa(filename));
    console.log('createFile: ', path, val);

    return RNFS.writeFile(path, JSON.stringify(val), 'utf8')
        .then((success) => {
            console.log('FILE WRITTEN!');
            // await uploadFile();
            return path;
        })
        .catch((err) => {
            console.log(err.message);
        });
}

async function removeFile(path) {
    return RNFS.unlink(path)
        .then(() => {
            console.log('FILE RMOVED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            console.log(err.message);
        });
}

async function deleteFile(filename) {
    const path = getFilePath(filename);
    return RNFS.unlink(path)
        .then(() => {
            console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            console.log(err.message);
        });
}

async function uploadFile(filename) {
    const uploadUrl = 'http://oc-appsrv01.informatik.uni-augsburg.de:9090/uploads';
    const files = [
        {
            name: filename,
            filename: `${filename}.json`,
            filepath: getFilePath(filename),
        },
    ];

    return RNFS.uploadFiles({
        toUrl: uploadUrl,
        files,
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
    }).promise.then((response) => {
        if (response.statusCode == 200) {
            console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
        } else {
            console.log('SERVER ERROR');
        }
    })
        .catch((err) => {
            if (err.description === 'cancelled') {
                // cancelled by user
            }
            console.log(err);
        });
}

module.exports = {
    removeFile,
    uploadFile,
    deleteFile,
    createFile,
    readFile,
    getAllFiles,
    removeAllFiles,
};
