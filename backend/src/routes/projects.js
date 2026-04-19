/**
 * SiteFlash AI - Rotas de Projetos
 * CRUD completo de projetos + geração de sites
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db/database');
const { authenticate, requirePro } = require('../middleware/auth');
const { generateContent, getAllNiches, getPalette } = require('../ai/contentGenerator');
const { generateHTML } = require('../ai/htmlGenerator');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * GET /api/projects
 * Lista projetos do usuário
 */
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, status, niche, company_name, city, style, 
              created_at, updated_at, published_url
       FROM projects 
       WHERE user_id = $1 
       ORDER BY updated_at DESC`,
      [req.user.id]
    );

    res.json({
      projects: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Erro ao listar projetos' });
  }
});

/**
 * POST /api/projects
 * Cria novo projeto (rascunho)
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Nome do projeto é obrigatório (mín. 2 caracteres)' });
    }

    // Limite de projetos (plano free: max 3)
    if (req.user.plan === 'free') {
      const count = await query(
        'SELECT COUNT(*) FROM projects WHERE user_id = $1',
        [req.user.id]
      );
      if (parseInt(count.rows[0].count) >= 3) {
        return res.status(403).json({
          error: 'Limite de 3 projetos no plano gratuito.',
          upgrade_required: true
        });
      }
    }

    const result = await query(
      `INSERT INTO projects (user_id, name, status) 
       VALUES ($1, $2, 'draft') 
       RETURNING *`,
      [req.user.id, name.trim()]
    );

    res.status(201).json({
      message: 'Projeto criado!',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
});

/**
 * GET /api/projects/:id
 * Retorna um projeto completo
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
});

/**
 * PUT /api/projects/:id
 * Atualiza dados do projeto (etapa a etapa)
 */
router.put('/:id', async (req, res) => {
  try {
    const {
      name, niche, objective,
      company_name, city, maps_link, logo_url, photos,
      color_palette, style,
      services
    } = req.body;

    // Verifica que o projeto pertence ao usuário
    const existing = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const result = await query(
      `UPDATE projects SET
        name = COALESCE($1, name),
        niche = COALESCE($2, niche),
        objective = COALESCE($3, objective),
        company_name = COALESCE($4, company_name),
        city = COALESCE($5, city),
        maps_link = COALESCE($6, maps_link),
        logo_url = COALESCE($7, logo_url),
        photos = COALESCE($8::jsonb, photos),
        color_palette = COALESCE($9::jsonb, color_palette),
        style = COALESCE($10, style),
        services = COALESCE($11::jsonb, services),
        updated_at = NOW()
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [
        name, niche, objective,
        company_name, city, maps_link, logo_url,
        photos ? JSON.stringify(photos) : null,
        color_palette ? JSON.stringify(color_palette) : null,
        style,
        services ? JSON.stringify(services) : null,
        req.params.id, req.user.id
      ]
    );

    res.json({
      message: 'Projeto atualizado!',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});

/**
 * POST /api/projects/:id/generate
 * Gera o site automaticamente a partir dos dados do projeto
 */
router.post('/:id/generate', async (req, res) => {
  try {
    // Busca projeto
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const project = result.rows[0];

    // Valida campos obrigatórios
    if (!project.niche || !project.company_name) {
      return res.status(400).json({
        error: 'Preencha pelo menos o nicho e o nome da empresa antes de gerar o site'
      });
    }

    // Gera conteúdo via IA
    const generatedContent = generateContent({
      niche: project.niche,
      objective: project.objective || 'leads',
      company_name: project.company_name,
      city: project.city,
      maps_link: project.maps_link,
      services: project.services || [],
      style: project.style || 'modern',
      color_palette: project.color_palette,
    });

    // Gera HTML com watermark se plano gratuito
    const withWatermark = req.user.plan === 'free';
    const generatedHtml = generateHTML(generatedContent, project, withWatermark);

    // Salva no banco
    await query(
      `UPDATE projects SET 
        generated_content = $1::jsonb,
        generated_html = $2,
        status = 'draft',
        updated_at = NOW()
       WHERE id = $3`,
      [JSON.stringify(generatedContent), generatedHtml, project.id]
    );

    res.json({
      message: 'Site gerado com sucesso!',
      content: generatedContent,
      has_watermark: withWatermark,
      preview_url: `/api/projects/${project.id}/preview`
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Erro ao gerar site. Tente novamente.' });
  }
});

/**
 * GET /api/projects/:id/preview
 * Retorna o HTML gerado para preview (iframe)
 */
router.get('/:id/preview', async (req, res) => {
  try {
    const result = await query(
      'SELECT generated_html, company_name, user_id FROM projects WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('<h1>Projeto não encontrado</h1>');
    }

    // Verifica pertencimento (permite público se publicado no futuro)
    if (result.rows[0].user_id !== req.user.id) {
      return res.status(403).send('<h1>Acesso negado</h1>');
    }

    if (!result.rows[0].generated_html) {
      return res.status(400).send('<h1>Site ainda não gerado. Clique em "Gerar Site".</h1>');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(result.rows[0].generated_html);
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).send('<h1>Erro ao carregar preview</h1>');
  }
});

/**
 * GET /api/projects/:id/download
 * Download do ZIP com o código do site (requer plano pago)
 */
router.get('/:id/download', requirePro, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const project = result.rows[0];

    if (!project.generated_html) {
      return res.status(400).json({ error: 'Gere o site antes de fazer o download' });
    }

    // Regenera HTML sem watermark para usuarios pagos
    const generatedContent = typeof project.generated_content === 'string'
      ? JSON.parse(project.generated_content)
      : project.generated_content;

    const cleanHtml = generateHTML(generatedContent, project, false);

    // Cria ZIP em memória
    const archive = archiver('zip', { zlib: { level: 9 } });
    const filename = `${(project.name || 'site').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    archive.pipe(res);
    archive.append(cleanHtml, { name: 'index.html' });
    archive.append(`# ${project.company_name || 'Site'}

Site gerado pelo SiteFlash AI.

## Como publicar:

1. Faça upload do arquivo \`index.html\` para qualquer hospedagem
2. Compatível com: Netlify, Vercel, GitHub Pages, hospedagem comum
3. Não requer servidor — é HTML estático!

## Personalização:
- Abra o \`index.html\` em qualquer editor de código
- As variáveis CSS estão no início do arquivo (\`:root\`)
- Altere cores, textos e imagens conforme necessário

---
Gerado em: ${new Date().toLocaleDateString('pt-BR')}
`, { name: 'README.md' });

    await archive.finalize();

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Erro ao gerar download' });
  }
});

/**
 * POST /api/projects/:id/publish
 * Publica o site (requer plano pago)
 */
router.post('/:id/publish', requirePro, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    const project = result.rows[0];

    if (!project.generated_html) {
      return res.status(400).json({ error: 'Gere o site antes de publicar' });
    }

    // Simula URL de publicação (em produção: integrar com Vercel/Netlify API)
    const publishedSlug = `${(project.company_name || 'site').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${uuidv4().substring(0, 6)}`;
    const publishedUrl = `https://sites.siteflash.ai/${publishedSlug}`;

    // Salva pasta de sites publicados (simulação local)
    const publishDir = path.join(__dirname, '../../..', 'published', publishedSlug);
    fs.mkdirSync(publishDir, { recursive: true });
    
    // Salva HTML sem watermark
    const generatedContent = typeof project.generated_content === 'string'
      ? JSON.parse(project.generated_content)
      : project.generated_content;
    const cleanHtml = generateHTML(generatedContent, project, false);
    fs.writeFileSync(path.join(publishDir, 'index.html'), cleanHtml, 'utf-8');

    // Atualiza status no banco
    await query(
      `UPDATE projects SET status = 'published', published_url = $1, updated_at = NOW()
       WHERE id = $2`,
      [publishedUrl, project.id]
    );

    res.json({
      message: 'Site publicado com sucesso!',
      published_url: publishedUrl,
      local_url: `/published/${publishedSlug}/index.html`
    });

  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: 'Erro ao publicar site' });
  }
});

/**
 * DELETE /api/projects/:id
 * Remove projeto
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id, name',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ message: `Projeto "${result.rows[0].name}" removido.` });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Erro ao remover projeto' });
  }
});

/**
 * GET /api/projects/meta/niches
 * Lista nichos disponíveis (público, não requer auth específica)
 */
router.get('/meta/niches', (req, res) => {
  res.json({ niches: getAllNiches() });
});

/**
 * GET /api/projects/meta/palettes
 * Paletas de cores disponíveis
 */
router.get('/meta/palettes', (req, res) => {
  const styles = ['modern', 'elegant', 'aggressive', 'minimal'];
  const palettes = styles.reduce((acc, s) => {
    acc[s] = getPalette(s);
    return acc;
  }, {});
  res.json({ palettes });
});

module.exports = router;
