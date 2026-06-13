const multer = require("multer");

// const storage = multer.diskStorage({});

const upload = multer({dest: 'uploads/' });

module.exports = upload;