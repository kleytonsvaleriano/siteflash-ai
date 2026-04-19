# 🚀 SiteFlash AI — Gerador Inteligente de Sites

> Crie landing pages e sites profissionais automaticamente em segundos com IA

## 📋 Visão Geral

**SiteFlash AI** é um SaaS que gera sites completos a partir de informações simples do usuário (nicho, empresa, serviços). Sem drag-and-drop, sem complexidade — apenas preencha os dados e o site é criado automaticamente.

### ✅ Funcionalidades MVP
- 🔐 Autenticação (registro + login com JWT)
- 📊 Dashboard com listagem de projetos
- 🧙 Wizard guiado (5 etapas)
- 🤖 Geração automática de conteúdo por nicho
- 👁️ Preview completo dentro do app
- 🔒 Watermark no plano gratuito (paywall)
- 📦 Download ZIP do código (plano pago)
- 🌐 Publicação com 1 clique (plano pago)

---

## 🏗️ Estrutura do Projeto

```
pixelize/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── server.js        # Servidor principal
│   │   ├── db/
│   │   │   └── database.js  # Conexão PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js      # /api/auth
│   │   │   ├── projects.js  # /api/projects
│   │   │   └── upload.js    # /api/upload
│   │   └── ai/
│   │       ├── contentGenerator.js  # Motor de IA
│   │       └── htmlGenerator.js     # Gerador HTML
│   ├── db/
│   │   └── init.sql         # Schema PostgreSQL
│   ├── uploads/             # Imagens enviadas pelos usuários
│   ├── .env                 # Variáveis de ambiente
│   └── package.json
│
├── frontend/                # Interface HTML + CSS + JS puro
│   ├── css/
│   │   └── styles.css       # Design system completo
│   ├── js/
│   │   └── api.js           # Cliente da API
│   ├── login.html           # Tela de login
│   ├── register.html        # Tela de cadastro
│   ├── dashboard.html       # Dashboard do usuário
│   ├── wizard.html          # Wizard de criação (5 etapas)
│   ├── nginx.conf           # Config nginx
│   └── Dockerfile
│
├── published/               # Sites publicados (gerados)
├── docker-compose.yml       # Orquestração Docker
└── .gitignore
```

---

## 🚀 Rodar Localmente (Desenvolvimento)

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 14+
- (Opcional) Docker + Docker Compose

---

### Opção A: Sem Docker (desenvolvimento rápido)

#### 1. Configure o banco PostgreSQL

Crie o banco de dados:
```sql
CREATE DATABASE siteflash_db;
CREATE USER siteflash WITH PASSWORD 'siteflash_secret';
GRANT ALL PRIVILEGES ON DATABASE siteflash_db TO siteflash;
```

Execute o schema:
```bash
psql -U siteflash -d siteflash_db -f backend/db/init.sql
```

#### 2. Configure o backend

```bash
cd backend

# Edite o .env com suas configurações:
# DATABASE_URL=postgresql://siteflash:siteflash_secret@localhost:5432/siteflash_db
# JWT_SECRET=sua_chave_secreta_aqui

# Instale dependências (já feito)
npm install

# Rode o servidor
npm run dev
# Server em: http://localhost:3001
```

#### 3. Rode o frontend

Opção simples com Live Server (VSCode) ou qualquer servidor estático:

```bash
# Usando Python (sem instalação extra)
cd frontend
python -m http.server 3000

# Ou instale o live-server globalmente:
npx -y live-server --port=3000 frontend/
```

Acesse: **http://localhost:3000/login.html**

---

### Opção B: Com Docker (produção local)

```bash
# Na raiz do projeto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

Serviços:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

---

## 🌐 Deploy no EasyPanel

### 1. Crie os serviços no EasyPanel:

**Serviço: PostgreSQL**
- Tipo: PostgreSQL
- Database: `siteflash_db`
- User: `siteflash`
- Password: `siteflash_secret`

**Serviço: Backend**
- Tipo: App (Docker)
- Source: Git Repository → `/backend`
- Branch: main
- Dockerfile: `Dockerfile`
- Envs:
  ```
  NODE_ENV=production
  PORT=3001
  DATABASE_URL=postgresql://siteflash:siteflash_secret@<db-service>:5432/siteflash_db
  JWT_SECRET=<gere uma chave forte>
  FRONTEND_URL=https://seu-dominio.com
  ```
- Port: 3001

**Serviço: Frontend**
- Tipo: App (Docker)
- Source: Git Repository → `/frontend`
- Dockerfile: `Dockerfile`
- Port: 80

### 2. Configure DNS
- Frontend → `app.seudominio.com`
- Backend → `api.seudominio.com`

### 3. Atualize o API_BASE no frontend
Em `frontend/js/api.js`, linha 5:
```js
const API_BASE = 'https://api.seudominio.com/api';
```

---

## 🔌 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Dados do usuário |

### Projetos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Listar projetos |
| POST | `/api/projects` | Criar projeto |
| GET | `/api/projects/:id` | Buscar projeto |
| PUT | `/api/projects/:id` | Atualizar projeto |
| DELETE | `/api/projects/:id` | Excluir projeto |
| POST | `/api/projects/:id/generate` | Gerar site |
| GET | `/api/projects/:id/preview` | Preview HTML |
| GET | `/api/projects/:id/download` | Download ZIP (pro) |
| POST | `/api/projects/:id/publish` | Publicar (pro) |
| GET | `/api/projects/meta/niches` | Lista de nichos |
| GET | `/api/projects/meta/palettes` | Paletas de cores |

### Upload
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/upload/single` | Logo (1 arquivo) |
| POST | `/api/upload/multiple` | Fotos (múltiplos) |

---

## 💰 Modelo de Monetização

### Plano Gratuito
- ✅ Até 3 projetos
- ✅ Visualização com marca d'água
- ❌ Download do código
- ❌ Publicação

### Plano Pro — R$ 47/mês
- ✅ Projetos ilimitados
- ✅ Sem marca d'água
- ✅ Download ZIP
- ✅ Publicação com 1 clique
- ✅ Domínio personalizado
- ✅ Suporte prioritário

**Para integrar pagamento:** substitua a função `handleUpgrade()` no dashboard com o checkout do Stripe, Hotmart ou outro gateway.

---

## 🤖 Como a IA Funciona

O sistema usa um motor de geração baseado em templates inteligentes por nicho, **sem dependência de APIs externas**:

1. **Banco de conhecimento por nicho** — Headlines, subheadlines, CTAs, depoimentos e propostas de valor pré-definidos e otimizados para conversão
2. **Geração contextual** — Textos são adaptados com cidade, nome da empresa e objetivo
3. **Paletas automáticas** — 4 estilos visuais (moderno, elegante, agressivo, minimalista) com cores complementares
4. **HTML otimizado** — Código limpo, responsivo, com SEO básico e animações CSS

Nichos suportados:
- 🍽️ Restaurante | 🦷 Dentista | ⚖️ Advogado | ✂️ Barbearia
- 💇 Salão de Beleza | 💪 Academia | 🏥 Clínica | 🏠 Imobiliária
- 💻 TI/Tech | 🛒 Loja/E-commerce

---

## 🔒 Segurança
- Senhas com bcrypt (12 rounds)
- JWT com expiração de 7 dias
- Rate limiting (auth: 20 req/15min, geral: 200 req/15min)
- Helmet.js (headers de segurança)
- Validação de tipos de arquivo no upload
- Queries parametrizadas (sem SQL injection)

---

## 🛣️ Roadmap

### v1.1
- [ ] Integração com Stripe (pagamento real)
- [ ] Modo escuro/claro no wizard
- [ ] Mais nichos (psicólogo, coach, escola)

### v1.2
- [ ] Editor visual básico pós-geração
- [ ] Templates adicionais por nicho
- [ ] Analytics de visualizações

### v2.0
- [ ] Integração com ChatGPT/Claude para textos ainda mais dinâmicos
- [ ] Domínio customizado com Let's Encrypt
- [ ] Modo agência (múltiplos clientes)

---

## 📄 Licença

Projeto proprietário — SiteFlash AI © 2024
