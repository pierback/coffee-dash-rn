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
    // console.log('readFile: ', path, values);

    try {
        return JSON.parse(values);
    } catch (error) {
        console.log('readFile: ', error);
        return JSON.parse(JSON.stringify(values));
    }
}

async function getAllFiles() {
    try {
        return RNFS.readDir(RNFS.DocumentDirectoryPath)
    } catch (err) {
        console.log(err.message, err.code);
    }
}

async function createFile(filename, val) {
    const path = getFilePath(btoa(filename));
    // console.log('createFile: ', path, val);

    try {
        await RNFS.writeFile(path, JSON.stringify(val), 'utf8');
    } catch (err) {
        console.log(err.message);
    }

    return path;
}

async function removeFile(path) {
    return RNFS.unlink(path)
        .then(() => {
            console.log('FILE RMOVED', path);
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
            console.log('FILES UPLOADED!');
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
