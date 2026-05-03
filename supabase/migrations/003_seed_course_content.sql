-- ============================================
-- SEED: Modules + Lessons + Reviews
-- pour le cours "nextjs-15-mastery" (showcase)
-- ============================================

DO $$
DECLARE
  course_nextjs UUID;
  course_llm UUID;
  course_figma UUID;
  course_aws UUID;
  course_react UUID;
  course_python UUID;

  module_id UUID;

  -- Pool de profils étudiants démo (UUIDs random)
  student_1 UUID := 'a1111111-1111-1111-1111-111111111111';
  student_2 UUID := 'a2222222-2222-2222-2222-222222222222';
  student_3 UUID := 'a3333333-3333-3333-3333-333333333333';
  student_4 UUID := 'a4444444-4444-4444-4444-444444444444';
  student_5 UUID := 'a5555555-5555-5555-5555-555555555555';
  student_6 UUID := 'a6666666-6666-6666-6666-666666666666';
  student_7 UUID := 'a7777777-7777-7777-7777-777777777777';
  student_8 UUID := 'a8888888-8888-8888-8888-888888888888';
BEGIN
  -- Récupérer les IDs des cours
  SELECT id INTO course_nextjs FROM courses WHERE slug = 'nextjs-15-mastery';
  SELECT id INTO course_llm FROM courses WHERE slug = 'llm-rag-production';
  SELECT id INTO course_figma FROM courses WHERE slug = 'figma-design-systems';
  SELECT id INTO course_aws FROM courses WHERE slug = 'aws-solutions-architect';
  SELECT id INTO course_react FROM courses WHERE slug = 'react-19-deep-dive';
  SELECT id INTO course_python FROM courses WHERE slug = 'python-data-science';

  -- ============================================
  -- COURS NEXT.JS 15 MASTERY : Curriculum complet
  -- ============================================
  IF course_nextjs IS NOT NULL THEN

    -- Module 1: Introduction
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'Introduction & Setup', 'Découvre Next.js 15 et configure ton environnement de développement', 1, 95, 6)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview, description) VALUES
      (module_id, course_nextjs, 'Bienvenue dans le cours', 'VIDEO', 8, 1, TRUE, 'Présentation du programme et des objectifs'),
      (module_id, course_nextjs, 'Pourquoi Next.js 15 ?', 'VIDEO', 12, 2, TRUE, 'Les apports de la version 15 et le positionnement vs alternatives'),
      (module_id, course_nextjs, 'Setup environnement (Node, Bun, VS Code)', 'VIDEO', 18, 3, FALSE, NULL),
      (module_id, course_nextjs, 'Création du projet avec create-next-app', 'VIDEO', 15, 4, FALSE, NULL),
      (module_id, course_nextjs, 'Architecture App Router', 'VIDEO', 22, 5, FALSE, NULL),
      (module_id, course_nextjs, 'Quiz : les bases', 'QUIZ', 20, 6, FALSE, NULL);

    -- Module 2: Routing
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'App Router en profondeur', 'Maîtrise le système de routing file-based de Next.js 15', 2, 145, 8)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (module_id, course_nextjs, 'Routes statiques et dynamiques', 'VIDEO', 18, 1, FALSE),
      (module_id, course_nextjs, 'Layouts imbriqués et templates', 'VIDEO', 22, 2, FALSE),
      (module_id, course_nextjs, 'Loading & Error UI', 'VIDEO', 16, 3, FALSE),
      (module_id, course_nextjs, 'Route Groups et Parallel Routes', 'VIDEO', 24, 4, FALSE),
      (module_id, course_nextjs, 'Intercepting Routes', 'VIDEO', 20, 5, FALSE),
      (module_id, course_nextjs, 'Navigation avec Link et useRouter', 'VIDEO', 15, 6, FALSE),
      (module_id, course_nextjs, 'Middleware et redirections', 'VIDEO', 18, 7, FALSE),
      (module_id, course_nextjs, 'Exercice : construire un blog', 'EXERCISE', 12, 8, FALSE);

    -- Module 3: Server Components
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'Server Components & Data Fetching', 'La nouvelle approche : moins de JS, plus de perf', 3, 165, 9)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (module_id, course_nextjs, 'Server vs Client Components', 'VIDEO', 20, 1, TRUE),
      (module_id, course_nextjs, 'Fetch et caching avancé', 'VIDEO', 25, 2, FALSE),
      (module_id, course_nextjs, 'React cache() et unstable_cache', 'VIDEO', 18, 3, FALSE),
      (module_id, course_nextjs, 'Streaming avec Suspense', 'VIDEO', 22, 4, FALSE),
      (module_id, course_nextjs, 'Revalidation : ISR et on-demand', 'VIDEO', 20, 5, FALSE),
      (module_id, course_nextjs, 'Connexion à Supabase', 'VIDEO', 16, 6, FALSE),
      (module_id, course_nextjs, 'Pagination server-side', 'VIDEO', 14, 7, FALSE),
      (module_id, course_nextjs, 'Recherche avec URL state', 'VIDEO', 18, 8, FALSE),
      (module_id, course_nextjs, 'Quiz Server Components', 'QUIZ', 12, 9, FALSE);

    -- Module 4: Server Actions
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'Server Actions & Mutations', 'Forms et mutations sans API routes', 4, 130, 7)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (module_id, course_nextjs, 'Introduction aux Server Actions', 'VIDEO', 18, 1, FALSE),
      (module_id, course_nextjs, 'Validation avec Zod', 'VIDEO', 22, 2, FALSE),
      (module_id, course_nextjs, 'useFormState et useFormStatus', 'VIDEO', 20, 3, FALSE),
      (module_id, course_nextjs, 'Optimistic UI avec useOptimistic', 'VIDEO', 24, 4, FALSE),
      (module_id, course_nextjs, 'Authentification avec Supabase', 'VIDEO', 28, 5, FALSE),
      (module_id, course_nextjs, 'Upload de fichiers', 'VIDEO', 18, 6, FALSE),
      (module_id, course_nextjs, 'Projet : To-do app temps réel', 'EXERCISE', 0, 7, FALSE);

    -- Module 5: Performance
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'Performance & Optimisations', 'Core Web Vitals, images, fonts, bundling', 5, 110, 6)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (module_id, course_nextjs, 'Image Optimization avec next/image', 'VIDEO', 20, 1, FALSE),
      (module_id, course_nextjs, 'Fonts avec next/font', 'VIDEO', 14, 2, FALSE),
      (module_id, course_nextjs, 'Code splitting et dynamic imports', 'VIDEO', 18, 3, FALSE),
      (module_id, course_nextjs, 'Bundle Analyzer', 'VIDEO', 16, 4, FALSE),
      (module_id, course_nextjs, 'Caching strategies avancées', 'VIDEO', 22, 5, FALSE),
      (module_id, course_nextjs, 'Audit Lighthouse complet', 'VIDEO', 20, 6, FALSE);

    -- Module 6: Deployment
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'Production & Déploiement', 'Déployer sur Vercel, Docker, et plus', 6, 95, 5)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (module_id, course_nextjs, 'Préparer pour la production', 'VIDEO', 16, 1, FALSE),
      (module_id, course_nextjs, 'Déploiement sur Vercel', 'VIDEO', 22, 2, FALSE),
      (module_id, course_nextjs, 'Variables d''environnement et secrets', 'VIDEO', 14, 3, FALSE),
      (module_id, course_nextjs, 'Monitoring et logs', 'VIDEO', 18, 4, FALSE),
      (module_id, course_nextjs, 'Containerisation Docker', 'VIDEO', 25, 5, FALSE);

    -- Module 7: Projet final
    INSERT INTO modules (id, course_id, title, description, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), course_nextjs, 'Projet final : SaaS complet', 'Construis une vraie app SaaS de A à Z', 7, 220, 8)
    RETURNING id INTO module_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (module_id, course_nextjs, 'Architecture du projet', 'VIDEO', 18, 1, FALSE),
      (module_id, course_nextjs, 'Auth avec Supabase + middleware', 'VIDEO', 32, 2, FALSE),
      (module_id, course_nextjs, 'Dashboard et CRUD', 'VIDEO', 38, 3, FALSE),
      (module_id, course_nextjs, 'Subscription Stripe', 'VIDEO', 35, 4, FALSE),
      (module_id, course_nextjs, 'Real-time avec Supabase Realtime', 'VIDEO', 28, 5, FALSE),
      (module_id, course_nextjs, 'Tests E2E avec Playwright', 'VIDEO', 24, 6, FALSE),
      (module_id, course_nextjs, 'Déploiement & monitoring', 'VIDEO', 20, 7, FALSE),
      (module_id, course_nextjs, 'Conclusion & ressources', 'VIDEO', 25, 8, FALSE);

    -- Update aggregates
    UPDATE courses SET
      total_modules = 7,
      total_lessons = 49,
      duration_minutes = 960
    WHERE id = course_nextjs;
  END IF;

  -- ============================================
  -- Curriculum simplifié pour les autres cours featured
  -- (3 modules x 5 leçons chacun = pour la démo)
  -- ============================================

  PERFORM seed_simple_curriculum(course_llm, ARRAY[
    'Fondamentaux des LLMs',
    'RAG en production',
    'Fine-tuning avec LoRA'
  ]) WHERE course_llm IS NOT NULL;

  PERFORM seed_simple_curriculum(course_figma, ARRAY[
    'Bases du design system',
    'Composants atomiques',
    'Auto layout & variants'
  ]) WHERE course_figma IS NOT NULL;

  PERFORM seed_simple_curriculum(course_aws, ARRAY[
    'AWS Foundations',
    'Compute & Storage',
    'Networking & Security'
  ]) WHERE course_aws IS NOT NULL;

  PERFORM seed_simple_curriculum(course_react, ARRAY[
    'React 19 nouveautés',
    'Server Components',
    'Hooks modernes'
  ]) WHERE course_react IS NOT NULL;

  PERFORM seed_simple_curriculum(course_python, ARRAY[
    'NumPy basics',
    'Pandas DataFrames',
    'Visualisation'
  ]) WHERE course_python IS NOT NULL;

  -- ============================================
  -- REVIEWS pour Next.js 15 Mastery (showcase)
  -- ============================================
  IF course_nextjs IS NOT NULL THEN
    -- Pour insérer des reviews avec des FK valides, on supprime temporairement la contrainte
    -- ⚠️ Solution propre : créer ces étudiants dans auth.users via dashboard
    -- Pour démo on insère directement (peut échouer selon contraintes)

    BEGIN
      INSERT INTO profiles (id, email, full_name, avatar_url, role) VALUES
        (student_1, 'student1@demo.com', 'Thomas Lefèvre', 'https://i.pravatar.cc/200?img=11', 'STUDENT'),
        (student_2, 'student2@demo.com', 'Amina Khalil', 'https://i.pravatar.cc/200?img=49', 'STUDENT'),
        (student_3, 'student3@demo.com', 'Lucas Bernard', 'https://i.pravatar.cc/200?img=15', 'STUDENT'),
        (student_4, 'student4@demo.com', 'Sophie Tran', 'https://i.pravatar.cc/200?img=42', 'STUDENT'),
        (student_5, 'student5@demo.com', 'Karim Benali', 'https://i.pravatar.cc/200?img=18', 'STUDENT'),
        (student_6, 'student6@demo.com', 'Emma Rossi', 'https://i.pravatar.cc/200?img=23', 'STUDENT'),
        (student_7, 'student7@demo.com', 'Hugo Martin', 'https://i.pravatar.cc/200?img=20', 'STUDENT'),
        (student_8, 'student8@demo.com', 'Julie Moreau', 'https://i.pravatar.cc/200?img=31', 'STUDENT')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO reviews (user_id, course_id, rating, title, comment, helpful_count) VALUES
        (student_1, course_nextjs, 5, 'Le meilleur cours Next.js que j''ai suivi',
         'Sarah explique avec une pédagogie incroyable. Les exemples concrets et le projet final m''ont permis de décrocher mon job de Senior Frontend chez Doctolib. Je recommande à 100%, vraiment au-dessus de tout ce que j''ai vu sur Udemy.',
         142),
        (student_2, course_nextjs, 5, 'Pédagogie exceptionnelle',
         'J''ai tout appris : App Router, Server Components, Server Actions. Le module sur les performances vaut à lui seul le prix du cours. Bravo Sarah !',
         98),
        (student_3, course_nextjs, 5, 'Up-to-date avec les dernières features',
         'C''est rare de trouver un cours aussi à jour. Sarah explique même les RFCs en cours. Le projet SaaS final est top, on apprend Stripe, Supabase, Auth, real-time. Game changer.',
         87),
        (student_4, course_nextjs, 4, 'Excellent mais demande des bases solides',
         'Très bon cours mais il faut vraiment bien maîtriser React avant. Je conseille de faire d''abord le React 19 Deep Dive. Sinon contenu pointu et prof au top.',
         54),
        (student_5, course_nextjs, 5, 'Reconversion réussie',
         'Reconversion en dev fullstack à 35 ans. Ce cours m''a donné toutes les clés pour décrocher mes premiers contrats freelance. Sarah est une excellente formatrice.',
         121),
        (student_6, course_nextjs, 5, 'Du contenu directement applicable',
         'Pas de blabla, du concret. Chaque module aboutit à du code que je réutilise dans mes projets perso et pro. Le module Server Actions m''a bluffé.',
         76),
        (student_7, course_nextjs, 4, 'Très complet, parfois dense',
         'Cours très dense, parfois je devais repasser certaines sections. Mais c''est aussi sa force : c''est très complet. Le bonus discord avec Sarah est un vrai plus.',
         43),
        (student_8, course_nextjs, 5, 'Référence absolue sur Next.js',
         'J''ai testé 4 cours différents sur Next.js, c''est sans hésitation le meilleur. Et Sarah répond aux questions en commentaires. Service après-vente impeccable.',
         95)
      ON CONFLICT (user_id, course_id) DO NOTHING;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Reviews skipped (FK constraint or other error)';
    END;
  END IF;

END $$;

-- ============================================
-- Helper function for simple curriculum
-- ============================================
CREATE OR REPLACE FUNCTION seed_simple_curriculum(p_course_id UUID, p_module_titles TEXT[])
RETURNS VOID AS $$
DECLARE
  i INT;
  m_id UUID;
  total_lessons_count INT := 0;
  total_duration INT := 0;
  module_duration INT;
BEGIN
  IF p_course_id IS NULL THEN RETURN; END IF;

  FOR i IN 1..array_length(p_module_titles, 1) LOOP
    module_duration := 75 + (random() * 60)::INT;

    INSERT INTO modules (id, course_id, title, display_order, duration_minutes, lessons_count)
    VALUES (gen_random_uuid(), p_course_id, p_module_titles[i], i, module_duration, 5)
    RETURNING id INTO m_id;

    INSERT INTO lessons (module_id, course_id, title, type, duration_minutes, display_order, is_preview) VALUES
      (m_id, p_course_id, 'Introduction au module ' || i, 'VIDEO', 12, 1, i = 1),
      (m_id, p_course_id, 'Concepts clés', 'VIDEO', 18, 2, FALSE),
      (m_id, p_course_id, 'Mise en pratique', 'VIDEO', 20, 3, FALSE),
      (m_id, p_course_id, 'Exercice guidé', 'EXERCISE', 15, 4, FALSE),
      (m_id, p_course_id, 'Quiz de validation', 'QUIZ', 10, 5, FALSE);

    total_lessons_count := total_lessons_count + 5;
    total_duration := total_duration + module_duration;
  END LOOP;

  UPDATE courses SET
    total_modules = array_length(p_module_titles, 1),
    total_lessons = total_lessons_count,
    duration_minutes = total_duration
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql;