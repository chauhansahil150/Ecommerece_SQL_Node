const multer = require('multer');
const path = require('path');
// const fs = require('fs');

function createMulterMiddleware(fieldNames, maxFiles) {
  console.log(fieldNames);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      
      const destinationFolder = path.join(__dirname, `../public/images/seller/${file.fieldname}`);
        // console.log(file);
        // fs.mkdirSync(destinationFolder, { recursive: true });
        cb(null, destinationFolder);
      
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname;
      cb(null, fileName);
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Implement file type filtering if needed
      // Example: Check file.mimetype or file.originalname
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // Limit file size to 5MB (adjust as needed)
    },
  }).fields(fieldNames); // Use .fields() to accept multiple fields with different names
}

module.exports = createMulterMiddleware;
