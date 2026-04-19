/**
 * SiteFlash AI - API Client
 * Centraliza todas as chamadas à API backend
 */

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : '/api';

// ===== TOKEN MANAGEMENT =====
const getToken = () => localStorage.getItem('sf_token');
const setToken = (token) => localStorage.setItem('sf_token', token);
const removeToken = () => localStorage.removeItem('sf_token');

const getUser = () => {
  const u = localStorage.getItem('sf_user');
  return u ? JSON.parse(u) : null;
};
const setUser = (user) => localStorage.setItem('sf_user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('sf_user');

// ===== BASE REQUEST =====
const request = async (method, endpoint, body = null, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Authorization': token ? `Bearer ${token}` : '',
    ...options.headers
  };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  // Token expirado -> logout
  if (response.status === 401) {
    removeToken();
    removeUser();
    if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
      window.location.href = '/login.html';
    }
  }

  const data = await response.json().catch(() => ({ error: 'Erro de comunicação com servidor' }));
  
  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
};

// ===== AUTH =====
const Auth = {
  register: (name, email, password) => 
    request('POST', '/auth/register', { name, email, password }),
  
  login: (email, password) => 
    request('POST', '/auth/login', { email, password }),
  
  me: () => request('GET', '/auth/me'),
  
  logout: () => {
    removeToken();
    removeUser();
    window.location.href = '/login.html';
  },

  isLoggedIn: () => !!getToken(),
};

// ===== PROJECTS =====
const Projects = {
  list: () => request('GET', '/projects'),
  
  get: (id) => request('GET', `/projects/${id}`),
  
  create: (name) => request('POST', '/projects', { name }),
  
  update: (id, data) => request('PUT', `/projects/${id}`, data),
  
  generate: (id) => request('POST', `/projects/${id}/generate`),
  
  delete: (id) => request('DELETE', `/projects/${id}`),
  
  downloadUrl: (id) => `${API_BASE}/projects/${id}/download?token=${getToken()}`,
  
  previewUrl: (id) => `${API_BASE}/projects/${id}/preview`,
  
  publish: (id) => request('POST', `/projects/${id}/publish`),
  
  getNiches: () => request('GET', '/projects/meta/niches'),
  
  getPalettes: () => request('GET', '/projects/meta/palettes'),
};

// ===== UPLOAD =====
const Upload = {
  single: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('POST', '/upload/single', formData);
  },
  
  multiple: async (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return request('POST', '/upload/multiple', formData);
  }
};

// ===== HELPERS =====
const showToast = (message, type = 'success') => {
  const existing = document.getElementById('sf-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'sf-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                  type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                  'linear-gradient(135deg, #6366f1, #8b5cf6)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    z-index: 10000;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    transform: translateY(100px);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  `;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span style="font-size:1.2rem">${icon}</span> ${message}`;
  
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
  });
  
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const getNicheLabel = (niche) => {
  const labels = {
    restaurant: '🍽️ Restaurante', dentist: '🦷 Dentista', lawyer: '⚖️ Advogado',
    barbershop: '✂️ Barbearia', salon: '💇 Salão de Beleza', gym: '💪 Academia',
    clinic: '🏥 Clínica', real_estate: '🏠 Imobiliária', tech: '💻 TI/Tech', store: '🛒 Loja'
  };
  return labels[niche] || niche;
};

const getStatusBadge = (status) => {
  if (status === 'published') {
    return '<span class="badge badge-published">● Publicado</span>';
  }
  return '<span class="badge badge-draft">○ Rascunho</span>';
};

// Exporta para uso global
window.API = { Auth, Projects, Upload, getToken, setToken, removeToken, getUser, setUser, removeUser };
window.showToast = showToast;
window.formatDate = formatDate;
window.getNicheLabel = getNicheLabel;
window.getStatusBadge = getStatusBadge;
