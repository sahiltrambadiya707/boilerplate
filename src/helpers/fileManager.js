const fileTypesRegex = {
  image: '\\.(png|jpg|jpeg)$',
};

/**
 * @param {*} filetype - filetypes seperated by | for e.g. png|jpg or predefined types
 */
function getFileTypeRegex(filetype) {
  let filetypeRegex = fileTypesRegex[filetype];

  if (!filetypeRegex) {
    filetypeRegex = `\\.(${filetype})$`;
  }

  return filetypeRegex;
}

function getUniqueName() {
  let random_char = (Math.random() + 1).toString(36).charAt(7);
  let unique_name = `${new Date().getTime()}${new Date().getMilliseconds()}${random_char}`;
  return unique_name;
}

/**
 *
 * @param {File} fileToUpload - file to upload
 * @param {String} uploadPath - path to upload file
 * @param {String} fileName - name of the file
 * @param {Number} maxAllowedFileSizeInMB - max allowed file size in mb
 * @param {String} allowedFileType - filetypes seperated by | for e.g. png|jpg or predefined types
 * @returns
 */
async function uploadFileToLocalDisk(
  fileToUpload,
  uploadPath,
  fileName = '',
  maxAllowedFileSizeInMB = 5,
  allowedFileType = 'png|jpeg',
  validationFieldName = 'File'
) {
  if (fileToUpload) {
    const fileSizeLimit = maxAllowedFileSizeInMB * 1000000;

    // creating file name if not specified
    if (!fileName) {
      const path = require('path');
      fileName = `${getUniqueName()}${path.extname(fileToUpload.name)}`;
    }

    fileName = fileName.toLowerCase();

    // validating file type
    const fileTypeRegex = getFileTypeRegex(allowedFileType);

    if (!RegExp(fileTypeRegex).test(fileName)) {
      let regex = String(fileTypeRegex);
      const extensions = regex
        .substring(regex.indexOf('(') + 1, regex.lastIndexOf(')'))
        .split('|')
        .join(', ');

      return {
        status: false,
        type: 'invalid_extension',
        message: `Invalid Extension. Only ${extensions} are allowed`,
      };
    }

    // validating file size
    if (fileToUpload.size > fileSizeLimit) {
      return {
        status: false,
        type: 'size_limit_exceeded',
        message: `${validationFieldName} size must be less than ${maxAllowedFileSizeInMB} MB`,
      };
    }

    return new Promise((resolve) => {
      fileToUpload.mv(`${uploadPath}/${fileName}`, function (err) {
        if (err) {
          resolve({
            status: false,
            type: 'unknown',
            message: 'Something went wrong while uploading file',
          });
          return;
        }

        resolve({
          status: true,
          fileName: fileName,
          message: `${validationFieldName} Uploaded Successfully`,
        });
      });
    });
  } else {
    return {
      status: false,
      type: 'not_found',
      message: `${validationFieldName} is required`,
    };
  }
}

/**
 * @param {String} path - path to the file to remove
 * @returns
 */
function deleteFileFromLocal(path) {
  const fs = require('fs');

  return new Promise((resolve, reject) => {
    try {
      fs.stat(path, function (err) {
        if (err) {
          reject('File not exist');
        }

        fs.unlink(path, (err) => {
          if (err) {
            reject(err.message);
          }

          resolve('File deleted successfully');
        });
      });
    } catch (error) {
      reject('Something went wrong while deleting file');
    }
  });
}

/**
 * @param {String} sourcePath
 * @param {String} destinationPath
 * @returns {Promise}
 */
function copyFileLocally(sourcePath, destinationPath) {
  const fs = require('fs');

  return new Promise((resolve, reject) => {
    try {
      fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
          console.log(err, 'inside');
          reject('Something went wrong while copying file');
        } else {
          resolve('File deleted successfully');
        }
      });
    } catch (error) {
      console.log(error);
      reject('Something went wrong while copying file');
    }
  });
}

function makeFolders(dirPath) {
  const fs = require('fs');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function validateLocalDiskFile(
  fileToBeValidated,
  maxAllowedFileSizeInMB = 5,
  allowedFileType = 'png|jpeg',
  validationFieldName = 'File'
) {
  if (fileToBeValidated) {
    const fileSizeLimit = maxAllowedFileSizeInMB * 1000000;

    // validating file type
    const fileTypeRegex = getFileTypeRegex(allowedFileType);
    const path = require('path');

    let fileExtension = path.extname(fileToBeValidated.name);
    fileExtension = fileExtension ? fileExtension.toLowerCase() : '';

    if (!RegExp(fileTypeRegex).test(fileExtension)) {
      let regex = String(fileTypeRegex);
      const extensions = regex
        .substring(regex.indexOf('(') + 1, regex.lastIndexOf(')'))
        .split('|')
        .join(', ');

      return {
        status: false,
        type: 'invalid_extension',
        message: `Invalid Extension. Only ${extensions} are allowed`,
      };
    }

    // validating file size
    if (fileToBeValidated.size > fileSizeLimit) {
      return {
        status: false,
        type: 'size_limit_exceeded',
        message: `${validationFieldName} size must be less than ${maxAllowedFileSizeInMB} MB`,
      };
    }

    return {
      status: true,
      message: `${validationFieldName} Validated Successfully`,
    };
  } else {
    return {
      status: false,
      type: 'not_found',
      message: `${validationFieldName} is required`,
    };
  }
}

module.exports = {
  uploadFileToLocalDisk,
  deleteFileFromLocal,
  copyFileLocally,
  getUniqueName,
  makeFolders,
  validateLocalDiskFile,
};
