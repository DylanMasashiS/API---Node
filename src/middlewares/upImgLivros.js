const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/CapaLivros/'); // Verifique se o diretório existe
    },
    filename: function (req, file, cb) {
        // Gerar um nome de arquivo único usando timestamp e valor aleatório
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Extrair a extensão do arquivo
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Permitir apenas jpg, jpeg, png
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false); // Rejeita o arquivo
    }
};

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5MB para o arquivo
    },
    fileFilter: fileFilter
});
