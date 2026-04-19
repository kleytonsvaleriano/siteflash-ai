/**
 * SiteFlash AI - Rota de Upload de Arquivos
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads', req.user.id);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou SVG'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 10
  }
});

/**
 * POST /api/upload/single
 * Upload de arquivo único (logo)
 */
router.post('/single', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const fileUrl = `/uploads/${req.user.id}/${req.file.filename}`;
  
  res.json({
    message: 'Arquivo enviado com sucesso!',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

/**
 * POST /api/upload/multiple
 * Upload de múltiplos arquivos (fotos do negócio)
 */
router.post('/multiple', authenticate, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const files = req.files.map(f => ({
    url: `/uploads/${req.user.id}/${f.filename}`,
    filename: f.filename,
    size: f.size,
    mimetype: f.mimetype
  }));

  res.json({
    message: `${files.length} arquivo(s) enviado(s) com sucesso!`,
    files
  });
});

// Middleware de tratamento de erro do multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo: 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Máximo de 10 arquivos por upload' });
    }
  }
  if (err.message.includes('não permitido')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
