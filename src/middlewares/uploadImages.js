const multer = require ('multer');

const storage = multer.diskStorage ({
    destination: function (req, file, cb) {
        cb (null, 'public/uploads/Capa Livros');
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now () + '-' + Math.round (Math.random () * 1E9);

        const ext = file.mimetype === 'image/jpg' ? '.jpg' : file.mimetype.slice 
        (file.mimetype.length - 3); 

        cb (null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg') {

        cb (null, true);
    } else {
        cb (null, false);
    }
}


module.exports = (multer ({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
    
}));