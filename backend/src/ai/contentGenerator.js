/**
 * SiteFlash AI - Motor de Geração de Conteúdo
 * 
 * Gera textos otimizados para conversão baseado no nicho,
 * serviços e estilo escolhidos pelo usuário.
 * 
 * Funciona sem API externa - usa templates inteligentes
 * com variações dinâmicas para gerar conteúdo único.
 */

// =====================================================
// BASE DE CONHECIMENTO POR NICHO
// =====================================================

const NICHE_DATA = {
  restaurant: {
    label: 'Restaurante',
    emoji: '🍽️',
    keywords: ['gastronomia', 'sabor', 'culinária', 'chef', 'prato'],
    painPoints: ['fome', 'busca pelo melhor restaurante', 'experiência gastronômica'],
    valueProps: ['sabores únicos', 'ingredientes frescos', 'ambiente aconchegante', 'atendimento especial'],
    services: ['Almoço Executivo', 'Jantar à La Carte', 'Delivery', 'Eventos e Confraternizações', 'Cardápio Especial'],
    headlines: [
      'Uma Experiência Gastronômica Inesquecível',
      'Onde Cada Refeição Conta uma História',
      'O Sabor que Você Estava Procurando',
      'Gastronomia de Alto Nível, Preços Acessíveis',
    ],
    subheadlines: [
      'Ingredientes frescos, receitas exclusivas e um ambiente perfeito para cada momento especial.',
      'Os melhores sabores da cidade, preparados com amor e dedicação todos os dias.',
      'Venha descobrir por que somos o restaurante favorito da cidade.',
    ],
    cta_texts: ['Fazer Reserva', 'Ver Cardápio', 'Pedir Agora'],
    about: 'Nascemos da paixão pela gastronomia e pelo desejo de criar momentos memoráveis. Nossa equipe de chefs trabalha com ingredientes selecionados para oferecer pratos que conquistam o paladar e o coração de cada cliente.',
    testimonials: [
      { name: 'Maria Silva', role: 'Cliente Fiel', text: 'O melhor restaurante que já visitei! A qualidade dos pratos é impressionante e o atendimento é sempre perfeito.', rating: 5 },
      { name: 'João Santos', role: 'Empresário Local', text: 'Realizo todos os meus almoços de negócios aqui. Ambiente profissional e comida de altíssima qualidade.', rating: 5 },
      { name: 'Ana Costa', role: 'Blogueira Gastronômica', text: 'Uma experience gastronômica completa. Do ambiente à sobremesa, tudo impecável!', rating: 5 }
    ]
  },

  dentist: {
    label: 'Dentista',
    emoji: '🦷',
    keywords: ['saúde bucal', 'sorriso', 'tratamento', 'bem-estar', 'confiança'],
    painPoints: ['medo do dentista', 'dor de dente', 'vergonha do sorriso'],
    valueProps: ['tratamento sem dor', 'tecnologia avançada', 'equipe especializada', 'ambiente acolhedor'],
    services: ['Limpeza e Profilaxia', 'Clareamento Dental', 'Ortodontia (Aparelhos)', 'Implantes Dentários', 'Tratamento de Canal', 'Facetas de Porcelana'],
    headlines: [
      'Seu Sorriso Perfeito Começa Aqui',
      'Transforme Seu Sorriso, Transforme Sua Vida',
      'Cuidado Dental que Você Merece',
      'O Sorriso que Você Sempre Sonhou',
    ],
    subheadlines: [
      'Tratamentos modernos, sem dor e com resultados que transformam sua autoestima e qualidade de vida.',
      'Tecnologia de ponta e uma equipe dedicada para cuidar da sua saúde bucal com carinho e precisão.',
      'Mais de X pacientes com sorrisos transformados. Seja o próximo.',
    ],
    cta_texts: ['Agendar Consulta', 'Consulta Gratuita', 'Falar com Especialista'],
    about: 'Nossa clínica combina tecnologia de última geração com um atendimento humanizado. Acreditamos que um sorriso saudável é o primeiro passo para uma vida mais feliz e confiante. Nossa equipe de especialistas está pronta para cuidar de você.',
    testimonials: [
      { name: 'Roberto Lima', role: 'Paciente', text: 'Tinha muito medo de dentista, mas a equipe foi tão atenciosa que fiz o tratamento completo sem trauma nenhum!', rating: 5 },
      { name: 'Carla Mendes', role: 'Professora', text: 'Fiz o clareamento e meu sorriso ficou incrível. Recomendo para todos!', rating: 5 },
      { name: 'Paulo Ferreira', role: 'Engenheiro', text: 'Profissionalismo e atenção ao paciente diferenciados. Vale cada centavo.', rating: 5 }
    ]
  },

  lawyer: {
    label: 'Advogado',
    emoji: '⚖️',
    keywords: ['direito', 'justiça', 'advocacia', 'defesa', 'consultoria jurídica'],
    painPoints: ['problemas legais', 'insegurança jurídica', 'necessidade de defesa'],
    valueProps: ['experiência comprovada', 'atendimento personalizado', 'confidencialidade', 'resultados concretos'],
    services: ['Direito Civil', 'Direito Trabalhista', 'Direito de Família', 'Direito Empresarial', 'Direito Previdenciário', 'Consultoria Jurídica'],
    headlines: [
      'Seu Direito Defendido com Excelência',
      'Advocacia Estratégica para Resultados Reais',
      'Experiência e Comprometimento ao Seu Lado',
      'Soluções Jurídicas que Funcionam',
    ],
    subheadlines: [
      'Atuação estratégica e personalizada para defender seus direitos com eficiência e ética profissional.',
      'Anos de experiência em diversas áreas do direito, sempre com foco no melhor resultado para você.',
      'Do problema à solução: advocacia transparente, ágil e comprometida com seus interesses.',
    ],
    cta_texts: ['Consulta Gratuita', 'Falar com Advogado', 'Avaliar meu Caso'],
    about: 'Fundado sob os princípios de ética, transparência e resultados, nosso escritório atua com dedicação integral a cada caso. Nossa equipe de advogados especializados está preparada para oferecer as melhores estratégias jurídicas para cada situação.',
    testimonials: [
      { name: 'Fernando Alves', role: 'Empresário', text: 'Resolveram meu processo trabalhista de forma rápida e eficiente. Profissionalismo exemplar!', rating: 5 },
      { name: 'Luciana Torres', role: 'Professora', text: 'Me senti completamente segura durante todo o processo de divórcio. Equipe incrível!', rating: 5 },
      { name: 'Marcos Oliveira', role: 'Servidor Público', text: 'Conseguiram minha aposentadoria que estava negada há anos. Altamente recomendados!', rating: 5 }
    ]
  },

  barbershop: {
    label: 'Barbearia',
    emoji: '✂️',
    keywords: ['barbearia', 'corte', 'barba', 'estilo', 'masculino'],
    painPoints: ['visual desatualizado', 'falta de um lugar de confiança', 'serviço de baixa qualidade'],
    valueProps: ['corte perfeito', 'ambiente exclusivo', 'profissionais experientes', 'produtos premium'],
    services: ['Corte Masculino', 'Barba Completa', 'Corte + Barba', 'Sobrancelha', 'Coloração', 'Tratamento Capilar'],
    headlines: [
      'Onde o Estilo Encontra a Tradição',
      'Cortes que Definem Personalidades',
      'Sua Melhor Versão Começa Aqui',
      'Barbearia Premium para Homens Exigentes',
    ],
    subheadlines: [
      'Barbeiros experientes, produtos de primeira linha e um ambiente exclusivo para você se sentir no seu melhor.',
      'Muito além de um corte: uma experiência completa de estilo e cuidado masculino.',
      'Cada detalhe importa. Do primeiro traço ao acabamento perfeito.',
    ],
    cta_texts: ['Agendar Horário', 'Reservar Agora', 'Quero meu Corte'],
    about: 'Nossa barbearia nasceu da tradição e se reinventou com estilo. Combinamos o melhor da barbearia clássica com técnicas modernas para oferecer uma experiência única. Um lugar onde homens vêm se sentir em casa.',
    testimonials: [
      { name: 'Diego Souza', role: 'Cliente VIP', text: 'Melhor barbearia da cidade sem dúvida! Corte impecável e atendimento diferenciado.', rating: 5 },
      { name: 'Rodrigo Nunes', role: 'Designer', text: 'O lugar certo para quem se preocupa com estilo. Barbeiros talentosíssimos!', rating: 5 },
      { name: 'Gabriel Martins', role: 'Advogado', text: 'Venho aqui há 3 anos. Nunca me decepcionaram. Recomendo!', rating: 5 }
    ]
  },

  salon: {
    label: 'Salão de Beleza',
    emoji: '💇',
    keywords: ['beleza', 'cabelo', 'estética', 'transformação', 'feminino'],
    painPoints: ['insatisfação com o cabelo', 'busca por autoestima', 'falta de tempo'],
    valueProps: ['transformação real', 'profissionais qualificados', 'produtos de qualidade', 'ambiente relaxante'],
    services: ['Corte e Escova', 'Coloração', 'Mechas e Luzes', 'Tratamentos Capilares', 'Manicure e Pedicure', 'Sobrancelha e Cílios'],
    headlines: [
      'Sua Transformação Começa Aqui',
      'Beleza que Eleva sua Autoestima',
      'Onde os Sonhos Viram Realidade',
      'O Salão que as Mulheres Amam',
    ],
    subheadlines: [
      'Profissionais apaixonados por beleza prontos para criar o visual perfeito que você sempre desejou.',
      'Da raiz às pontas, da manicure à maquiagem: você merece se sentir incrível todos os dias.',
      'Seu cabelo é nossa obra de arte. Venha se transformar.',
    ],
    cta_texts: ['Agendar Horário', 'Quero me Transformar', 'Reservar Agora'],
    about: 'Somos apaixonados por fazer cada cliente se sentir especial. Nossa equipe de profissionais altamente qualificados usa as melhores técnicas e produtos para garantir resultados que superam suas expectativas.',
    testimonials: [
      { name: 'Juliana Ramos', role: 'Empresária', text: 'Melhor salão! Fiz mechas incríveis e o atendimento foi perfeito do início ao fim.', rating: 5 },
      { name: 'Beatriz Silva', role: 'Médica', text: 'Lugar maravilhoso para uma tarde de autocuidado. Profissionais excelentes!', rating: 5 },
      { name: 'Tatiane Gomes', role: 'Professora', text: 'Meu cabelo nunca ficou tão bonito! Recomendo de olhos fechados.', rating: 5 }
    ]
  },

  gym: {
    label: 'Academia / Fitness',
    emoji: '💪',
    keywords: ['fitness', 'musculação', 'saúde', 'treino', 'resultado'],
    painPoints: ['sedentarismo', 'insatisfação com o corpo', 'falta de motivação'],
    valueProps: ['resultados reais', 'equipamentos modernos', 'instrutores qualificados', 'ambiente motivador'],
    services: ['Musculação', 'Spinning', 'Funcional', 'CrossFit', 'Yoga e Pilates', 'Avaliação Física'],
    headlines: [
      'Transforme seu Corpo, Transforme sua Vida',
      'Resultados Reais para Pessoas Reais',
      'Sua Evolução Começa Aqui',
      'A Academia que Leva Você ao Próximo Nível',
    ],
    subheadlines: [
      'Equipamentos de ponta, instrutores dedicados e um ambiente que vai te dar energia para treinar todo dia.',
      'Já ajudamos centenas de pessoas a atingirem seus objetivos. Você é o próximo.',
      'Não apenas uma academia: uma comunidade comprometida com sua evolução.',
    ],
    cta_texts: ['Aula Experimental', 'Começar Agora', 'Quero Resultados'],
    about: 'Nossa academia foi fundada com uma missão clara: transformar vidas através do movimento. Contamos com instrutores certificados, equipamentos modernos e uma comunidade que vai te motivar a ultrapassar seus limites todos os dias.',
    testimonials: [
      { name: 'Thiago Pereira', role: 'Membro há 2 anos', text: 'Perdi 18kg em 6 meses com o suporte dos instrutores. Lugar incrível!', rating: 5 },
      { name: 'Camila Castro', role: 'Personal Trainer', text: 'Estrutura impecável e equipe técnica excelente. O melhor da cidade!', rating: 5 },
      { name: 'Rafael Lima', role: 'Atleta', text: 'Os equipamentos são top e o ambiente é muito motivador. Melhor investimento que fiz!', rating: 5 }
    ]
  },

  clinic: {
    label: 'Clínica Médica',
    emoji: '🏥',
    keywords: ['saúde', 'medicina', 'consulta', 'tratamento', 'bem-estar'],
    painPoints: ['dificuldade de acesso à saúde', 'longas filas', 'busca por qualidade médica'],
    valueProps: ['médicos especialistas', 'tecnologia diagnóstica', 'atendimento humanizado', 'agendamento rápido'],
    services: ['Clínica Geral', 'Cardiologia', 'Dermatologia', 'Ortopedia', 'Ginecologia', 'Check-up Completo'],
    headlines: [
      'Saúde de Qualidade ao Seu Alcance',
      'Cuidando de Você com Excelência Médica',
      'Sua Saúde é Nossa Prioridade',
      'Medicina Humanizada para Toda a Família',
    ],
    subheadlines: [
      'Equipe médica especializada, tecnologia moderna e um atendimento que respeita e cuida de você como pessoa.',
      'Agendamento rápido, consultas sem espera e diagnósticos precisos para cuidar da sua saúde.',
      'Porque saúde de qualidade não deve ser um privilégio.',
    ],
    cta_texts: ['Agendar Consulta', 'Falar com Secretaria', 'Marcar Horário'],
    about: 'Nossa clínica reúne profissionais com ampla experiência e dedicação genuína ao bem-estar dos pacientes. Investimos continuamente em tecnologia e capacitação para oferecer diagnósticos precisos e tratamentos eficazes.',
    testimonials: [
      { name: 'Sandra Oliveira', role: 'Paciente', text: 'Atendimento excepcional! Os médicos são muito atenciosos e o diagnóstico foi preciso.', rating: 5 },
      { name: 'Carlos Eduardo', role: 'Servidor Público', text: 'Finalmente encontrei uma clínica em que confio. Recomendo para toda a família.', rating: 5 },
      { name: 'Patricia Vieira', role: 'Nutricionista', text: 'Infraestrutura moderna e equipe altamente qualificada. Nota 10!', rating: 5 }
    ]
  },

  real_estate: {
    label: 'Imobiliária',
    emoji: '🏠',
    keywords: ['imóveis', 'casa', 'apartamento', 'compra', 'venda', 'locação'],
    painPoints: ['dificuldade em encontrar o imóvel certo', 'burocracia', 'medo de ser enganado'],
    valueProps: ['portfólio exclusivo', 'corretores experientes', 'processo simplificado', 'transparência'],
    services: ['Compra e Venda', 'Locação Residencial', 'Locação Comercial', 'Avaliação de Imóveis', 'Consultoria Imobiliária', 'Gestão de Imóveis'],
    headlines: [
      'Seu Próximo Lar a Um Clique de Distância',
      'Encontre o Imóvel Perfeito para Você',
      'Realizamos o Sonho da Casa Própria',
      'Imóveis Selecionados, Negócios Seguros',
    ],
    subheadlines: [
      'Corretores especializados prontos para encontrar o imóvel ideal dentro do seu orçamento e necessidades.',
      'Processo transparente, seguro e sem burocracia para você comprar, vender ou alugar com tranquilidade.',
      'Mais de X famílias já realizaram o sonho da casa própria conosco.',
    ],
    cta_texts: ['Ver Imóveis', 'Falar com Corretor', 'Fazer Avaliação'],
    about: 'Somos uma imobiliária comprometida com a realização dos sonhos dos nossos clientes. Nossa equipe de corretores experientes conhece profundamente o mercado local e está pronta para guiar você em cada etapa do processo.',
    testimonials: [
      { name: 'Eduardo Moreira', role: 'Comprador', text: 'Encontraram o apartamento perfeito para nossa família em menos de um mês. Profissionais incríveis!', rating: 5 },
      { name: 'Renata Santos', role: 'Investidora', text: 'Já realizei 3 negócios com eles. Sempre transparentes e eficientes. Minha imobiliária de confiança!', rating: 5 },
      { name: 'Fabio Costa', role: 'Empresário', text: 'Alugaram meu comercial em 2 semanas. Ótimo serviço e excelente gestão.', rating: 5 }
    ]
  },

  tech: {
    label: 'Empresa de TI',
    emoji: '💻',
    keywords: ['tecnologia', 'software', 'sistemas', 'digital', 'inovação'],
    painPoints: ['processos manuais', 'falta de automação', 'ineficiência operacional'],
    valueProps: ['soluções customizadas', 'tecnologia moderna', 'suporte dedicado', 'resultados mensuráveis'],
    services: ['Desenvolvimento de Software', 'Aplicativos Mobile', 'Sites e E-commerce', 'Automação de Processos', 'Consultoria em TI', 'Suporte Técnico'],
    headlines: [
      'Tecnologia que Transforma Negócios',
      'Soluções Digitais que Geram Resultados',
      'Seu Negócio no Próximo Nível Digital',
      'Inovação Tecnológica ao Seu Serviço',
    ],
    subheadlines: [
      'Desenvolvemos soluções tecnológicas personalizadas que automatizam processos e impulsionam o crescimento do seu negócio.',
      'Do conceito ao produto final: software de qualidade entregue no prazo e dentro do orçamento.',
      'Tecnologia sob medida para resolver os desafios únicos do seu negócio.',
    ],
    cta_texts: ['Solicitar Proposta', 'Falar com Especialista', 'Começar Projeto'],
    about: 'Somos uma empresa de tecnologia focada em criar soluções que realmente resolvem problemas de negócio. Nossa equipe combina expertise técnica com visão estratégica para entregar produtos que fazem diferença.',
    testimonials: [
      { name: 'Marcelo Duarte', role: 'CEO de E-commerce', text: 'Desenvolveram nossa plataforma em 3 meses. Aumentamos o faturamento em 40% no primeiro semestre!', rating: 5 },
      { name: 'Adriana Lopes', role: 'Diretora de Operações', text: 'A automação que implementaram economizou 20h de trabalho manual por semana. Valeu cada centavo!', rating: 5 },
      { name: 'Bruno Carvalho', role: 'Empreendedor', text: 'App entregue antes do prazo e funcionando perfeitamente. Equipe excepcional!', rating: 5 }
    ]
  },

  store: {
    label: 'Loja / E-commerce',
    emoji: '🛒',
    keywords: ['loja', 'produtos', 'compras', 'qualidade', 'preço'],
    painPoints: ['dificuldade em encontrar produtos de qualidade', 'preços altos', 'falta de confiança'],
    valueProps: ['produtos selecionados', 'preços competitivos', 'entrega rápida', 'satisfação garantida'],
    services: ['Venda Online', 'Entrega Expressa', 'Troca Garantida', 'Parcelamento', 'Suporte ao Cliente', 'Programa de Fidelidade'],
    headlines: [
      'Os Melhores Produtos com os Melhores Preços',
      'Qualidade que Você Pode Confiar',
      'Sua Loja Favorita, Agora Online',
      'Compre com Segurança e Receba Rápido',
    ],
    subheadlines: [
      'Produtos selecionados com a melhor qualidade e preços que cabem no seu bolso. Entrega rápida e segura.',
      'Temos tudo que você precisa com a garantia de qualidade e o suporte que você merece.',
      'Mais de X clientes satisfeitos. Junte-se a ele.',
    ],
    cta_texts: ['Comprar Agora', 'Ver Produtos', 'Aproveitar Oferta'],
    about: 'Nascemos com a missão de oferecer o melhor custo-benefício do mercado sem abrir mão da qualidade. Selecionamos cada produto com cuidado e trabalhamos para garantir que sua experiência de compra seja sempre excelente.',
    testimonials: [
      { name: 'Fernanda Rocha', role: 'Cliente Recorrente', text: 'Compro aqui há 2 anos. Qualidade sempre excelente e entrega super rápida!', rating: 5 },
      { name: 'Alexandre Pinto', role: 'Revendedor', text: 'Os melhores produtos do mercado com preços que me permitem ter uma boa margem. Parceiro top!', rating: 5 },
      { name: 'Simone Barbosa', role: 'Dona de Casa', text: 'Atendimento atencioso e produto chegou melhor do que esperava. Voltarei sempre!', rating: 5 }
    ]
  }
};

// =====================================================
// PALETAS DE CORES POR ESTILO
// =====================================================

const COLOR_PALETTES = {
  modern: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    bg: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
  },
  elegant: {
    primary: '#1d3557',
    secondary: '#457b9d',
    accent: '#e9c46a',
    bg: '#f8f9fa',
    surface: '#ffffff',
    text: '#212529',
    textMuted: '#6c757d',
  },
  aggressive: {
    primary: '#dc2626',
    secondary: '#991b1b',
    accent: '#fbbf24',
    bg: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textMuted: '#9ca3af',
  },
  minimal: {
    primary: '#000000',
    secondary: '#333333',
    accent: '#0ea5e9',
    bg: '#ffffff',
    surface: '#f5f5f5',
    text: '#111111',
    textMuted: '#666666',
  }
};

// =====================================================
// FUNÇÕES DE GERAÇÃO DE CONTEÚDO
// =====================================================

/**
 * Seleciona item aleatório de array
 */
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Gera conteúdo completo do site baseado nos dados do projeto
 */
const generateContent = (projectData) => {
  const {
    niche,
    objective,
    company_name,
    city,
    services: customServices,
    style = 'modern',
    color_palette
  } = projectData;

  const nicheData = NICHE_DATA[niche] || NICHE_DATA.tech;
  const palette = color_palette?.primary ? color_palette : COLOR_PALETTES[style] || COLOR_PALETTES.modern;

  // Gera serviços (customizados ou sugeridos)
  const finalServices = customServices && customServices.length > 0
    ? customServices
    : nicheData.services.slice(0, 6);

  // Determina CTA baseado no objetivo
  const ctaMap = {
    leads: 'Falar Agora',
    institutional: 'Saiba Mais',
    sales: 'Comprar Agora'
  };
  const primaryCta = ctaMap[objective] || randomPick(nicheData.cta_texts);

  // Headline focada em conversão
  const headline = randomPick(nicheData.headlines);
  const subheadline = randomPick(nicheData.subheadlines);

  // Adapta headline para incluir cidade se disponível
  const localizedHeadline = city 
    ? `${headline} em ${city}`
    : headline;

  return {
    hero: {
      headline: localizedHeadline,
      subheadline,
      cta_primary: primaryCta,
      cta_secondary: 'Saiba Mais',
      badge: `⭐ ${nicheData.label} #1 ${city ? `em ${city}` : ''}`,
    },
    about: {
      title: `Sobre ${company_name || 'Nós'}`,
      content: nicheData.about,
      highlights: [
        { icon: '✓', text: nicheData.valueProps[0] },
        { icon: '✓', text: nicheData.valueProps[1] },
        { icon: '✓', text: nicheData.valueProps[2] },
        { icon: '✓', text: nicheData.valueProps[3] },
      ]
    },
    services: {
      title: 'Nossos Serviços',
      subtitle: `Oferecemos soluções completas em ${nicheData.label.toLowerCase()} para atender todas as suas necessidades.`,
      items: finalServices.map((service, i) => ({
        name: typeof service === 'string' ? service : service.name,
        description: typeof service === 'string' 
          ? `${service} com qualidade e excelência, garantindo os melhores resultados.`
          : service.description,
        icon: getServiceIcon(i, niche)
      }))
    },
    testimonials: {
      title: 'O que Nossos Clientes Dizem',
      subtitle: 'Resultados reais de pessoas reais. Veja o que dizem sobre nosso trabalho.',
      items: nicheData.testimonials
    },
    contact: {
      title: 'Entre em Contato',
      subtitle: `Estamos prontos para atender você ${city ? `em ${city}` : ''}. Fale conosco agora!`,
      cta: primaryCta,
    },
    meta: {
      title: `${company_name || nicheData.label} ${city ? `| ${city}` : ''} - ${headline}`,
      description: subheadline,
      keywords: [...nicheData.keywords, city, company_name, niche].filter(Boolean).join(', '),
    },
    palette,
    niche,
    company_name,
    city,
  };
};

/**
 * Retorna ícone SVG para cada serviço
 */
const getServiceIcon = (index, niche) => {
  const icons = [
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5" /></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`
  ];
  return icons[index % icons.length];
};

/**
 * Retorna dados de nicho específico
 */
const getNicheData = (niche) => NICHE_DATA[niche] || null;

/**
 * Lista todos os nichos disponíveis
 */
const getAllNiches = () => {
  return Object.entries(NICHE_DATA).map(([key, data]) => ({
    id: key,
    label: data.label,
    emoji: data.emoji,
    services: data.services
  }));
};

/**
 * Retorna paleta de cores padrão para um estilo
 */
const getPalette = (style) => COLOR_PALETTES[style] || COLOR_PALETTES.modern;

module.exports = {
  generateContent,
  getAllNiches,
  getNicheData,
  getPalette,
  COLOR_PALETTES,
  NICHE_DATA
};
