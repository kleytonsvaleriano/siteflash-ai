/**
 * Fix: Aceita token via query param para preview em iframe
 * Adiciona ao middleware de auth
 */
const jwt = require('jsonwebtoken');
const { query } = require('../db/database');

const authenticate = async (req, res, next) => {
  try {
    // Tenta pegar token do header Authorization ou query param _t
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query._t) {
      // Query param para iframes (preview)
      token = req.query._t;
    }
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await query(
      'SELECT id, name, email, plan FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Erro de autenticação' });
  }
};

const requirePro = (req, res, next) => {
  if (req.user.plan === 'free') {
    return res.status(403).json({ 
      error: 'Esta funcionalidade requer um plano pago',
      upgrade_required: true
    });
  }
  next();
};

module.exports = { authenticate, requirePro };
