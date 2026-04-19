-- =====================================================
-- SiteFlash AI - Database Schema
-- =====================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free', -- free | pro | agency
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de projetos (sites)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft | published
  
  -- Etapa 1: Nicho e objetivo
  niche VARCHAR(100),
  objective VARCHAR(100), -- leads | institutional | sales
  
  -- Etapa 2: Dados da empresa
  company_name VARCHAR(255),
  city VARCHAR(255),
  maps_link TEXT,
  logo_url TEXT,
  photos JSONB DEFAULT '[]',
  
  -- Etapa 3: Design
  color_palette JSONB DEFAULT '{}',
  style VARCHAR(50), -- modern | elegant | aggressive | minimal
  
  -- Etapa 4: Serviços
  services JSONB DEFAULT '[]',
  
  -- Conteúdo gerado
  generated_content JSONB DEFAULT '{}',
  generated_html TEXT,
  
  -- Publicação
  published_url TEXT,
  custom_domain TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de templates por nicho
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  preview_image TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Dados iniciais de templates
INSERT INTO templates (niche, name, config) VALUES
('restaurant', 'Restaurante Moderno', '{"primaryColor": "#e63946", "style": "modern"}'),
('dentist', 'Clínica Odontológica', '{"primaryColor": "#2a9d8f", "style": "elegant"}'),
('lawyer', 'Escritório Advocacia', '{"primaryColor": "#1d3557", "style": "elegant"}'),
('barbershop', 'Barbearia Masculina', '{"primaryColor": "#333333", "style": "aggressive"}'),
('salon', 'Salão de Beleza', '{"primaryColor": "#f72585", "style": "modern"}'),
('gym', 'Academia / Fitness', '{"primaryColor": "#f77f00", "style": "aggressive"}'),
('clinic', 'Clínica Médica', '{"primaryColor": "#0077b6", "style": "minimal"}'),
('real_estate', 'Imobiliária', '{"primaryColor": "#6a4c93", "style": "elegant"}'),
('tech', 'Empresa de TI', '{"primaryColor": "#4361ee", "style": "modern"}'),
('store', 'Loja / E-commerce', '{"primaryColor": "#7209b7", "style": "modern"}')
ON CONFLICT DO NOTHING;
