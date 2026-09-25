const multer = require('multer');

// multer middlware fir file upload
const upload = multer({
    
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024, // 3 MB
    }
})


module.exports = upload;