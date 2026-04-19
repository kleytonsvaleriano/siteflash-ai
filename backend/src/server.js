/**
 * SiteFlash AI - Servidor Principal
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { testConnection } = require('./db/database');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== SEGURANÇA =====
app.use(helmet({
  contentSecurityPolicy: false, // Desativado para permitir preview de HTML gerado
  crossOriginEmbedderPolicy: false,
}));

// ===== CORS =====
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===== RATE LIMITING =====
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  message: { error: 'Muitas requisições. Aguarde alguns minutos.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' }
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
  message: { error: 'Muitas gerações. Aguarde um instante.' }
});

app.use(generalLimiter);

// ===== BODY PARSING =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== ARQUIVOS ESTÁTICOS =====
// Upload de imagens
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Sites publicados
const publishedDir = path.join(__dirname, '../../published');
fs.mkdirSync(publishedDir, { recursive: true });
app.use('/published', express.static(publishedDir));

// ===== ROTAS API =====
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

// Rate limit específico para geração
app.use('/api/projects/:id/generate', generateLimiter);

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SiteFlash AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ===== ROTA RAIZ =====
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SiteFlash AI API',
    version: '1.0.0',
    docs: '/health',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      upload: '/api/upload'
    }
  });
});

// ===== ERRO 404 =====
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// ===== ERRO GLOBAL =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Erro interno do servidor' 
  });
});

// ===== INICIALIZAÇÃO =====
const startServer = async () => {
  console.log('\n🚀 Iniciando SiteFlash AI...\n');
  
  // Testa conexão com banco
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('❌ Falha na conexão com banco de dados. Encerrando...');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n✅ SiteFlash AI rodando em http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer();

module.exports = app;
