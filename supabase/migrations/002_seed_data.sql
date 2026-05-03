-- ============================================
-- SEED: Instructors (auth users + profiles)
-- ============================================
-- ⚠️ Créer manuellement 4 users dans Supabase Auth Dashboard
-- ou utiliser l'API admin. Pour la démo, on insère directement
-- des profils avec des UUIDs fixes (NB: ils n'auront pas de auth.users
-- liés, donc ils ne pourront pas se logger - c'est OK pour la démo)

-- Étape 1 : créer des UUIDs constants pour les instructors démo
DO $$
DECLARE
  sarah_id UUID := '11111111-1111-1111-1111-111111111111';
  david_id UUID := '22222222-2222-2222-2222-222222222222';
  lea_id UUID := '33333333-3333-3333-3333-333333333333';
  marcus_id UUID := '44444444-4444-4444-4444-444444444444';
  alex_id UUID := '55555555-5555-5555-5555-555555555555';
  julie_id UUID := '66666666-6666-6666-6666-666666666666';

  cat_web UUID;
  cat_data UUID;
  cat_mobile UUID;
  cat_devops UUID;
  cat_cyber UUID;
  cat_design UUID;
  cat_pm UUID;
  cat_marketing UUID;

BEGIN
  -- Récupérer les IDs des catégories
  SELECT id INTO cat_web FROM categories WHERE slug = 'web-development';
  SELECT id INTO cat_data FROM categories WHERE slug = 'data-science';
  SELECT id INTO cat_mobile FROM categories WHERE slug = 'mobile-development';
  SELECT id INTO cat_devops FROM categories WHERE slug = 'devops-cloud';
  SELECT id INTO cat_cyber FROM categories WHERE slug = 'cybersecurity';
  SELECT id INTO cat_design FROM categories WHERE slug = 'ui-ux-design';
  SELECT id INTO cat_pm FROM categories WHERE slug = 'product-management';
  SELECT id INTO cat_marketing FROM categories WHERE slug = 'digital-marketing';

  -- ⚠️ DEMO ONLY : profils sans auth.users (pour data publique)
  -- En prod, les profiles sont créés via le trigger auth
  -- Disable trigger temporarily si besoin
  -- Les FK vers auth.users avec ON DELETE CASCADE poseraient problème
  -- → On fait un INSERT direct ; si la contrainte FK auth.users est stricte,
  -- ces inserts échoueront et il faudra créer les users via le dashboard auth.

  -- Pour contourner proprement : insertions ignorées si conflit
  INSERT INTO profiles (id, email, username, full_name, headline, bio, role, is_verified, is_featured, expertise, total_students, total_courses, rating, reviews_count, avatar_url) VALUES
    (sarah_id, 'sarah@learnova.demo', 'sarah-martinez', 'Sarah Martinez', 'Senior Frontend Engineer @ Vercel',
     'Ex-Meta. Spécialiste React, Next.js et Performance Web. 10+ ans d''expérience à construire des produits utilisés par des millions d''utilisateurs.',
     'INSTRUCTOR', TRUE, TRUE, ARRAY['React', 'Next.js', 'TypeScript', 'Performance', 'Architecture'],
     28420, 8, 4.9, 2840, 'https://i.pravatar.cc/200?img=47'),

    (david_id, 'david@learnova.demo', 'david-chen', 'David Chen', 'AI Research Engineer @ OpenAI',
     'PhD Stanford. Spécialiste LLMs, RAG, MLOps. Auteur de 3 papers cités. Ex-DeepMind.',
     'INSTRUCTOR', TRUE, TRUE, ARRAY['LLMs', 'RAG', 'PyTorch', 'MLOps', 'Python'],
     18920, 5, 4.8, 1240, 'https://i.pravatar.cc/200?img=33'),

    (lea_id, 'lea@learnova.demo', 'lea-dubois', 'Léa Dubois', 'Lead Designer @ Stripe',
     'Ex-Figma. Spécialiste Design Systems et motion design. Speakeuse internationale.',
     'INSTRUCTOR', TRUE, TRUE, ARRAY['Figma', 'Design Systems', 'Motion', 'UX Research'],
     12450, 6, 4.9, 980, 'https://i.pravatar.cc/200?img=45'),

    (marcus_id, 'marcus@learnova.demo', 'marcus-johnson', 'Marcus Johnson', 'Principal Cloud Architect @ AWS',
     '15+ certifs AWS. Architecte de plateformes traitant des Po de data quotidiennement.',
     'INSTRUCTOR', TRUE, TRUE, ARRAY['AWS', 'Kubernetes', 'Terraform', 'DevOps'],
     22300, 12, 4.7, 1820, 'https://i.pravatar.cc/200?img=12'),

    (alex_id, 'alex@learnova.demo', 'alex-rodriguez', 'Alex Rodriguez', 'Senior Pentester @ Synacktiv',
     'OSCP, OSCE certifié. Top 50 HackerOne. 8+ ans en sécurité offensive.',
     'INSTRUCTOR', TRUE, FALSE, ARRAY['Pentesting', 'Red Team', 'OSINT', 'Forensics'],
     8920, 4, 4.8, 920, 'https://i.pravatar.cc/200?img=68'),

    (julie_id, 'julie@learnova.demo', 'julie-moreau', 'Julie Moreau', 'Growth Lead @ Qonto',
     'Ex-Doctolib. Spécialiste SEO, Growth Hacking. Scaled 3 startups de 0 à 1M users.',
     'INSTRUCTOR', TRUE, FALSE, ARRAY['SEO', 'Growth', 'Analytics', 'Content'],
     6450, 3, 4.7, 540, 'https://i.pravatar.cc/200?img=44')
  ON CONFLICT (id) DO NOTHING;

  -- ============================================
  -- SEED: Courses
  -- ============================================
  INSERT INTO courses (slug, title, subtitle, description, thumbnail_url, instructor_id, category_id, level, status, language, price, original_price, duration_minutes, total_lessons, total_modules, what_you_learn, requirements, target_audience, tags, rating, reviews_count, students_count, is_featured, is_bestseller, is_new, has_certificate, published_at) VALUES

    -- WEB DEV
    ('nextjs-15-mastery', 'Next.js 15 Mastery', 'Construis des apps full-stack performantes avec App Router, Server Components et Server Actions',
     'Maîtrise Next.js 15 de A à Z. Du App Router aux Server Components, en passant par les Server Actions, le caching avancé et le déploiement Vercel. 32h de contenu, 12 projets concrets.',
     'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', sarah_id, cat_web,
     'ADVANCED', 'PUBLISHED', 'fr', 49.99, 199.99, 1920, 142, 14,
     ARRAY['Maîtriser App Router et Server Components', 'Construire des apps SSR/SSG performantes', 'Implémenter Server Actions et Mutations', 'Optimiser les Core Web Vitals', 'Déployer sur Vercel avec CI/CD'],
     ARRAY['Connaissance solide de React', 'Bases en TypeScript', 'Notions de Node.js'],
     ARRAY['Développeurs React voulant passer à Next.js', 'Devs full-stack', 'Freelances tech'],
     ARRAY['nextjs', 'react', 'typescript', 'fullstack', 'ssr'],
     4.9, 2840, 18420, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '60 days'),

    ('react-19-deep-dive', 'React 19 Deep Dive', 'Maîtrise les nouveautés de React 19 : Server Components, Actions, use()',
     'Plonge dans les internals de React 19. Compiler, Server Components, useOptimistic, useFormState. 24h de contenu, exercices pratiques.',
     'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800', sarah_id, cat_web,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 39.99, 149.99, 1440, 98, 10,
     ARRAY['React 19 Compiler', 'Server Components avancés', 'Hooks modernes', 'Patterns de composition'],
     ARRAY['React basics', 'JavaScript ES6+'],
     ARRAY['Développeurs React intermédiaires'],
     ARRAY['react', 'javascript', 'frontend', 'hooks'],
     4.8, 1240, 9420, TRUE, FALSE, TRUE, TRUE, NOW() - INTERVAL '15 days'),

    ('typescript-pro', 'TypeScript Pro', 'Du débutant au Type Wizard : maîtrise le système de types le plus puissant',
     'Génériques avancés, Conditional Types, Mapped Types, Template Literals. 18h pour devenir un Type Wizard.',
     'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800', sarah_id, cat_web,
     'ADVANCED', 'PUBLISHED', 'fr', 34.99, 129.99, 1080, 76, 8,
     ARRAY['Generics avancés', 'Conditional Types', 'Type-level programming', 'Patterns avancés'],
     ARRAY['JavaScript moderne', 'TypeScript basics'],
     ARRAY['Développeurs TS confirmés'],
     ARRAY['typescript', 'types', 'javascript'],
     4.9, 890, 6240, FALSE, TRUE, FALSE, TRUE, NOW() - INTERVAL '90 days'),

    -- DATA SCIENCE
    ('llm-rag-production', 'LLMs & RAG en Production', 'Maîtrise les LLMs, le RAG et le fine-tuning pour des applications de production',
     'De la théorie aux applications. RAG avec LangChain, Fine-tuning avec PEFT/LoRA, déploiement avec vLLM. 28h de contenu pointu.',
     'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', david_id, cat_data,
     'EXPERT', 'PUBLISHED', 'fr', 79.99, 249.99, 1680, 124, 12,
     ARRAY['Architecture des LLMs', 'RAG avec vector DBs', 'Fine-tuning avec LoRA', 'Évaluation et monitoring', 'Déploiement scalable'],
     ARRAY['Python avancé', 'Bases en ML', 'Notions de Deep Learning'],
     ARRAY['ML Engineers', 'Data Scientists', 'AI Engineers'],
     ARRAY['llm', 'rag', 'ai', 'python', 'pytorch'],
     4.8, 1240, 8920, TRUE, FALSE, TRUE, TRUE, NOW() - INTERVAL '7 days'),

    ('python-data-science', 'Python pour la Data Science', 'NumPy, Pandas, Matplotlib, Scikit-learn — les fondamentaux solides',
     'Le cours de référence pour démarrer en data science avec Python. Manipulation de données, visualisation, ML basics.',
     'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800', david_id, cat_data,
     'BEGINNER', 'PUBLISHED', 'fr', 29.99, 99.99, 1320, 88, 9,
     ARRAY['NumPy & Pandas', 'Matplotlib & Seaborn', 'Scikit-learn basics', 'Projets concrets'],
     ARRAY['Bases en programmation'],
     ARRAY['Débutants en data science', 'Reconvertis'],
     ARRAY['python', 'pandas', 'numpy', 'data'],
     4.7, 2120, 14820, FALSE, TRUE, FALSE, TRUE, NOW() - INTERVAL '180 days'),

    ('deep-learning-pytorch', 'Deep Learning avec PyTorch', 'CNN, RNN, Transformers — implémente les architectures modernes',
     'Construis tes propres réseaux de neurones avec PyTorch. Computer Vision, NLP, séries temporelles.',
     'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', david_id, cat_data,
     'ADVANCED', 'PUBLISHED', 'fr', 59.99, 199.99, 1500, 105, 11,
     ARRAY['PyTorch internals', 'CNN architectures', 'Transformers', 'Training pipelines'],
     ARRAY['Python', 'Math (algèbre, calcul)', 'ML basics'],
     ARRAY['Data Scientists', 'ML Engineers'],
     ARRAY['deeplearning', 'pytorch', 'neural', 'ai'],
     4.8, 740, 5240, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '120 days'),

    -- MOBILE
    ('react-native-pro', 'React Native Pro', 'Apps iOS & Android performantes avec Expo et React Native',
     'Apps mobiles cross-platform de qualité production. Animations natives, navigation, native modules.',
     'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', sarah_id, cat_mobile,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 44.99, 159.99, 1200, 86, 9,
     ARRAY['React Native + Expo', 'Animations performantes', 'Native modules', 'Publication stores'],
     ARRAY['React', 'JavaScript ES6+'],
     ARRAY['Devs React voulant faire du mobile'],
     ARRAY['reactnative', 'mobile', 'ios', 'android', 'expo'],
     4.7, 540, 3920, FALSE, FALSE, TRUE, TRUE, NOW() - INTERVAL '30 days'),

    ('flutter-mastery', 'Flutter Mastery', 'Construis des apps natives multi-plateformes avec Dart et Flutter',
     'Maîtrise Flutter de A à Z. Widgets, state management, animations, intégration natives.',
     'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', marcus_id, cat_mobile,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 39.99, 139.99, 1080, 72, 8,
     ARRAY['Dart language', 'Widget composition', 'State management', 'Performances'],
     ARRAY['Bases en POO'],
     ARRAY['Développeurs mobiles'],
     ARRAY['flutter', 'dart', 'mobile'],
     4.6, 320, 2840, FALSE, FALSE, FALSE, TRUE, NOW() - INTERVAL '150 days'),

    -- DEVOPS
    ('aws-solutions-architect', 'AWS Solutions Architect', 'Certification complète AWS Solutions Architect Associate',
     'Préparation complète à la certif AWS Solutions Architect. Tous les services clés, scénarios réels, exam prep.',
     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', marcus_id, cat_devops,
     'ADVANCED', 'PUBLISHED', 'fr', 89.99, 299.99, 2700, 184, 16,
     ARRAY['Architecture AWS', 'EC2, S3, RDS, Lambda', 'Networking VPC', 'Sécurité IAM', 'Préparation exam'],
     ARRAY['Bases cloud', 'Notions Linux'],
     ARRAY['Devs cloud', 'DevOps', 'Architects'],
     ARRAY['aws', 'cloud', 'certification', 'devops'],
     4.7, 1820, 12300, TRUE, TRUE, FALSE, TRUE, NOW() - INTERVAL '200 days'),

    ('kubernetes-production', 'Kubernetes en Production', 'De zéro à expert : déploie, opère, scale Kubernetes',
     'Cluster K8s en prod : Helm, Istio, observability, security. Scénarios réels d''ops.',
     'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800', marcus_id, cat_devops,
     'EXPERT', 'PUBLISHED', 'fr', 69.99, 229.99, 1800, 124, 12,
     ARRAY['Architecture K8s', 'Helm charts', 'Service Mesh', 'Observability', 'Production patterns'],
     ARRAY['Docker', 'Linux avancé', 'Networking'],
     ARRAY['DevOps Engineers', 'SREs'],
     ARRAY['kubernetes', 'docker', 'devops', 'production'],
     4.8, 620, 4520, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '90 days'),

    ('docker-deepdive', 'Docker Deep Dive', 'Containerisation moderne : du dev à la prod',
     'Docker à fond. Multi-stage builds, networking, volumes, sécurité, registry privé.',
     'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', marcus_id, cat_devops,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 29.99, 99.99, 720, 52, 6,
     ARRAY['Docker internals', 'Multi-stage builds', 'Compose avancé', 'Sécurité conteneurs'],
     ARRAY['Bases Linux'],
     ARRAY['Devs et DevOps'],
     ARRAY['docker', 'containers', 'devops'],
     4.6, 980, 7820, FALSE, FALSE, FALSE, TRUE, NOW() - INTERVAL '300 days'),

    -- CYBERSECURITY
    ('cybersecurity-fundamentals', 'Cybersécurité offensive', 'Pentesting & Red Team : techniques modernes',
     'Devenir pentester. Reconnaissance, exploitation, post-exploit, OSCP-ready. Labs intégrés.',
     'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', alex_id, cat_cyber,
     'ADVANCED', 'PUBLISHED', 'fr', 69.99, 229.99, 2280, 156, 14,
     ARRAY['Méthodologie pentest', 'Reconnaissance & enum', 'Exploitation Web/Network', 'Post-exploit', 'Reporting'],
     ARRAY['Réseaux TCP/IP', 'Linux avancé', 'Bases en sécurité'],
     ARRAY['Aspirants pentesters', 'Sysadmins'],
     ARRAY['pentest', 'security', 'redteam', 'oscp'],
     4.8, 920, 5680, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '60 days'),

    ('web-security-mastery', 'Web Security Mastery', 'OWASP Top 10 et au-delà : sécurise tes apps web',
     'XSS, SQLi, CSRF, SSRF, XXE — toutes les vulns web modernes expliquées et exploitées.',
     'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', alex_id, cat_cyber,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 49.99, 169.99, 1320, 92, 10,
     ARRAY['OWASP Top 10', 'Auth & sessions', 'API security', 'Auditing'],
     ARRAY['Web dev', 'HTTP basics'],
     ARRAY['Web devs', 'Security engineers'],
     ARRAY['websecurity', 'owasp', 'pentest'],
     4.7, 540, 3420, FALSE, FALSE, TRUE, TRUE, NOW() - INTERVAL '20 days'),

    -- DESIGN
    ('figma-design-systems', 'Figma Design Systems', 'De zéro à pro : construis des design systems scalables',
     'Méthodologie complète pour créer des design systems modernes. Tokens, composants, variants, auto layout.',
     'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800', lea_id, cat_design,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 39.99, 149.99, 1320, 94, 9,
     ARRAY['Design tokens', 'Composants atomiques', 'Variants & properties', 'Auto layout avancé', 'Dev handoff'],
     ARRAY['Bases en design'],
     ARRAY['Designers', 'Product designers'],
     ARRAY['figma', 'designsystem', 'ui', 'ux'],
     4.9, 980, 6450, TRUE, FALSE, TRUE, TRUE, NOW() - INTERVAL '15 days'),

    ('ux-research-fundamentals', 'UX Research Fundamentals', 'Découvre les vrais besoins utilisateurs',
     'Méthodologies de recherche UX. Interviews, tests utilisateurs, analyse, synthèse.',
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', lea_id, cat_design,
     'BEGINNER', 'PUBLISHED', 'fr', 29.99, 99.99, 900, 64, 7,
     ARRAY['Méthodes qualitatives', 'Tests utilisateurs', 'Personas et journey maps', 'Synthèse insights'],
     ARRAY['Curiosité, esprit d''analyse'],
     ARRAY['Designers', 'PMs', 'Devs'],
     ARRAY['ux', 'research', 'design'],
     4.7, 420, 2840, FALSE, FALSE, FALSE, TRUE, NOW() - INTERVAL '90 days'),

    ('motion-design-figma', 'Motion Design avec Figma', 'Anime tes interfaces comme un pro',
     'Smart animate, transitions, prototypage avancé. Crée des micro-interactions wow.',
     'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', lea_id, cat_design,
     'ADVANCED', 'PUBLISHED', 'fr', 34.99, 119.99, 720, 48, 6,
     ARRAY['Smart Animate', 'Easing curves', 'Micro-interactions', 'Lottie integration'],
     ARRAY['Figma intermédiaire'],
     ARRAY['Designers expérimentés'],
     ARRAY['motion', 'figma', 'animation', 'design'],
     4.8, 280, 1840, FALSE, FALSE, TRUE, TRUE, NOW() - INTERVAL '10 days'),

    -- PRODUCT MANAGEMENT
    ('product-discovery', 'Product Discovery', 'Trouve le bon problème avant de coder',
     'Méthodologie de discovery moderne. JTBD, opportunity tree, validation hypothèses.',
     'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', julie_id, cat_pm,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 44.99, 159.99, 960, 68, 8,
     ARRAY['Discovery framework', 'JTBD', 'User interviews', 'Validation', 'Prioritization'],
     ARRAY['Bases en produit'],
     ARRAY['PMs', 'Founders', 'Designers'],
     ARRAY['product', 'discovery', 'jtbd', 'strategy'],
     4.8, 320, 2120, FALSE, FALSE, FALSE, TRUE, NOW() - INTERVAL '60 days'),

    -- MARKETING
    ('seo-2026', 'SEO Mastery 2026', 'SEO moderne à l''ère de l''IA et des SGE',
     'SEO post-IA. Search Generative Experience, E-E-A-T, technical SEO, content strategy.',
     'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', julie_id, cat_marketing,
     'INTERMEDIATE', 'PUBLISHED', 'fr', 34.99, 119.99, 840, 58, 7,
     ARRAY['SEO 2026', 'Technical SEO', 'Content strategy', 'AI optimization', 'Analytics'],
     ARRAY['Bases en marketing'],
     ARRAY['Marketeurs', 'Founders', 'Content creators'],
     ARRAY['seo', 'marketing', 'content', 'ai'],
     4.7, 240, 1640, FALSE, FALSE, TRUE, TRUE, NOW() - INTERVAL '5 days'),

    ('growth-hacking', 'Growth Hacking Bootcamp', 'Scale ta startup de 0 à 1M users',
     'Growth playbooks. Acquisition, activation, retention, referral, revenue. Frameworks éprouvés.',
     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', julie_id, cat_marketing,
     'ADVANCED', 'PUBLISHED', 'fr', 54.99, 189.99, 1080, 78, 9,
     ARRAY['AARRR Framework', 'Acquisition channels', 'Conversion funnels', 'Retention loops', 'Experimentation'],
     ARRAY['Marketing basics'],
     ARRAY['Founders', 'Growth marketeurs'],
     ARRAY['growth', 'marketing', 'startup', 'analytics'],
     4.8, 380, 2940, TRUE, FALSE, FALSE, TRUE, NOW() - INTERVAL '45 days')

  ON CONFLICT (slug) DO NOTHING;

  -- Update categories courses_count
  UPDATE categories SET courses_count = (SELECT COUNT(*) FROM courses WHERE category_id = categories.id AND status = 'PUBLISHED');

END $$;