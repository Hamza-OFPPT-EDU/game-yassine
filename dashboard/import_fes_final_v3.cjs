const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const FES_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440003';
const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
  F2: '550e8400-e29b-41d4-a716-44665544f222',
  F3: '550e8400-e29b-41d4-a716-44665544f333',
  F4: '550e8400-e29b-41d4-a716-44665544f444',
  F5: '550e8400-e29b-41d4-a716-44665544f555'
};

const TYPE_MAPPING = {
  'QCM': 'qcm',
  'Appariement': 'matching',
  'Dialogue de situation': 'scenario_dialogue',
  'Texte à trous': 'fill_blanks',
  'Vrai/Faux': 'vrai_faux',
  'Contre-la-montre': 'time_attack',
  'Scénario en cascade': 'scenario_cascade',
  'Détection d’erreurs': 'error_detection',
  'Classement': 'ranking',
  'Énigme': 'puzzle_riddle',
  'Rôles d’équipe': 'team_roles',
  'Prise de décision': 'scenario_decision',
  'Réponse courte': 'short_answer'
};

async function importFes() {
  console.log('🚀 Starting Fès HIGH-FIDELITY (Bloom 3-4) import...');

  // 1. City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: FES_CHALLENGE_PK,
    city_id: 'fes',
    city_name_fr: 'Fès',
    city_name_ar: 'فاس',
    headline_fr: '🕌 ACTE III - FÈS : CAPITALE SPIRITUELLE ET INTELLECTUELLE',
    description_fr: "Fès, plus vieille cité universitaire du monde, vous invite à ANALYSER : pourquoi les équipes échouent, comment le stress s’installe, pourquoi les décisions déraillent, et comment tradition et innovation coexistent.",
    focus_fr: 'Analyse & Synthèse (Bloom 3-4)',
    sort_order: 3,
    is_published: true,
    city_color: '#1e40af',
    icon_name: 'landmark'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Fès upserted');

  const missionsData = [
    {
      id: MISSION_IDS.F1,
      title_fr: 'Mission F1 : L’Atelier de calligraphie',
      description_fr: "Mentor: Maître Idris Fassi. Soft Skill: Travail en équipe (ANALYSE). Comprendre pourquoi les équipes durent ou échouent à travers le modèle maître-apprenti et les dysfonctions de Lencioni.",
      questions: [
        {
          type: 'QCM',
          q: 'Quel est le PRINCIPAL avantage du modèle maître-apprenti par rapport à un cours théorique en salle ?',
          options: [
            { id: 'A', label_fr: 'Le maître est plus intelligent' },
            { id: 'B', label_fr: 'L’apprenti ne paie pas' },
            { id: 'C', label_fr: 'L’apprentissage se fait dans la PRATIQUE RÉELLE, avec feedback immédiat et progressif.' },
            { id: 'D', label_fr: 'C’est plus rapide' }
          ],
          correct: 'C',
          pos: 'ANALYSE CORRECTE ! Pratique réelle (Lave & Wenger), Feedback immédiat (Hattie) et Progressivité (ZPD - Vygotsky).',
          neg: 'Non. Le maître a l\'expérience pratique. L\'avantage est le feedback en temps réel dans un contexte authentique.'
        },
        {
          type: 'Appariement',
          q: 'Analyse les situations dans l\'atelier et relie-les aux 5 dysfonctions de Lencioni.',
          options: [
            { left_fr: 'Hamid cache ses erreurs par peur du jugement', right_fr: 'Absence de CONFIANCE' },
            { left_fr: 'Les compagnons évitent de critiquer le travail', right_fr: 'Peur du CONFLIT sain' },
            { left_fr: 'Samir ne se sent pas concerné par les délais', right_fr: 'Évitement de la RESPONSABILITÉ' },
            { left_fr: 'Chacun travaille pour soi sans objectif commun', right_fr: 'Inattention aux RÉSULTATS collectifs' },
            { left_fr: 'Kamal refuse de s\'engager sur un résultat', right_fr: 'Manque d\'ENGAGEMENT' }
          ],
          pos: 'ANALYSE PARFAITE ! Vous identifiez les causes profondes (Lencioni 2002) au lieu de simples symptômes.',
          neg: 'Revoir la pyramide de Lencioni : Confiance -> Conflit -> Engagement -> Responsabilité -> Résultats.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Maître Idris rejette le travail de 3 mois de Hamid sans retour intermédiaire. Quelle est la cause profonde du conflit ?',
          options: [
            { id: 'A', label_fr: 'Hamid est paresseux' },
            { id: 'B', label_fr: 'Le MANQUE DE FEEDBACK PROGRESSIF : 3 mois sans retour, puis critique totale = choc.' },
            { id: 'C', label_fr: 'Maître Idris est trop sévère' }
          ],
          correct: 'B',
          pos: 'ANALYSE SYSTÉMIQUE BRILLANTE ! Vous pointez l\'absence de feedback intermédiaire et la disproportion effort/reconnaissance.',
          neg: 'Ne blâmez pas le caractère. Cherchez la défaillance de la méthode de feedback (Hattie 2009).'
        },
        {
          type: 'Scénario en cascade',
          q: 'Crise de commande : Kamal vs Samir.',
          options: {
            steps: [
              {
                question: 'Type de conflit selon Tuckman ?',
                responses: [
                  { id: 'A', text: 'Forming' },
                  { id: 'B', text: 'Storming (tempête)' }
                ],
                correct: 'B'
              },
              {
                question: 'Cause profonde ?',
                responses: [
                  { id: 'A', text: 'Incompétence' },
                  { id: 'B', text: 'Conflit de RÔLES (Qualité vs Rapidité)' }
                ],
                correct: 'B'
              },
              {
                question: 'Solution structurelle ?',
                responses: [
                  { id: 'A', text: 'Séparer les deux' },
                  { id: 'B', text: 'Kamal (Analyste) contrôle ce que Samir (Réalisateur) produit' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'RÉSOLUTION SYSTÉMIQUE ! Tuckman + Belbin + Senge : changer le système, pas seulement les personnes.',
          neg: 'Identifier l\'étape de l\'équipe et les rôles complémentaires est la clé de l\'analyse.'
        },
        {
          type: 'Vrai/Faux',
          q: 'Affirmation : "Le meilleur artisan fait automatiquement le meilleur leader d\'atelier."',
          correct: 'faux',
          pos: 'FAUX ! Principe de Peter : les compétences techniques diffèrent des compétences managériales.',
          neg: 'Erreur ! Savoir-faire n\'est pas savoir-faire-faire.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Analysez l\'atelier concurrent qui a fermé. Quelles sont les 5 erreurs fatales ?',
          options: [
            { text_fr: 'Pas de hiérarchie claire', is_error: true },
            { text_fr: 'Aucune spécialisation', is_error: true },
            { text_fr: 'Feedback annuel uniquement', is_error: true },
            { text_fr: 'Recrutement sans essai pratique', is_error: true },
            { text_fr: 'Pas de progression graduelle (ZPD)', is_error: true }
          ],
          pos: 'ANALYSE SYSTÉMIQUE EXEMPLAIRE ! Vous voyez comment les problèmes sont interconnectés (Senge).',
          neg: 'Regardez la structure : feedback, rôles, et méthode d\'apprentissage.'
        },
        {
          type: 'Classement',
          q: 'Classez les priorités de transmission pour pérenniser l\'art.',
          options: [
            { label_fr: 'Éthique professionnelle' },
            { label_fr: 'Philosophie de l\'art' },
            { label_fr: 'Capacité à enseigner' },
            { label_fr: 'Geste technique' },
            { label_fr: 'Gestion atelier' },
            { label_fr: 'Relation client' },
            { label_fr: 'Innovation' }
          ],
          pos: 'PRIORISATION ANALYTIQUE PROFONDE ! Valeurs > Transmission > Technique > Gestion.',
          neg: 'Sans éthique et philosophie, la technique perd son sens et sa longévité.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez le modèle de Lave & Wenger sur l\'apprentissage situé.',
          options: [
            { text: 'communauté' }, { text: 'pratique' }, { text: 'participation' }, { text: 'périphérique' }, { text: 'légitime' }, { text: 'observation' }, { text: 'identité' }
          ],
          correct: 'communauté, pratique, participation, périphérique, légitime, observation, identité',
          pos: 'MAÎTRISÉ ! Vous comprenez comment l\'apprenti migre de la périphérie vers le centre du groupe.',
          neg: 'Retenez : Communauté de pratique, Participation périphérique légitime.'
        },
        {
          type: 'Réponse courte',
          q: 'Analyse le leadership de Maître Idris (Forces, Faiblesses, Recommandation).',
          correct: 'forces, faiblesses, recommandation',
          pos: 'ANALYSE CRITIQUE EXCEPTIONNELLE ! Analyser, c\'est aussi évaluer objectivement l\'autorité.',
          neg: 'Utilisez Belbin et Lencioni pour structurer votre critique.'
        },
        {
          type: 'Énigme',
          q: '« Lencioni me place à la base... Sans moi les rois tombent et les équipes se déchirent. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La force' },
            { id: 'B', label_fr: 'La confiance' }
          ],
          correct: 'B',
          pos: 'CORRECT ! La CONFIANCE est le socle de toute organisation qui dure.',
          neg: 'C\'est le ciment invisible mentionné à Rabat, mais ici c\'est la base structurelle.'
        }
      ]
    },
    {
      id: MISSION_IDS.F2,
      title_fr: 'Mission F2 : Les Tanneries Chouara',
      description_fr: "Mentor: Saïd Tazi. Soft Skill: Gestion du stress (ANALYSE). Analyser l'impact du stress physique chronique et les mécanismes de résilience (Selye & Cyrulnik).",
      questions: [
        {
          type: 'QCM',
          q: 'Différence principale entre le stress de Dr. Karim (Hôpital) et celui de Saïd (Tanneries) ?',
          options: [
            { id: 'A', label_fr: 'L\'un est grave, l\'autre pas' },
            { id: 'B', label_fr: 'Aigu/Intense vs Chronique/Modéré (basse intensité mais constant sur 30 ans)' }
          ],
          correct: 'B',
          pos: 'ANALYSE COMPARATIVE EXCELLENTE ! L\'usure progressive du cortisol est différente de l\'adrénaline aiguë.',
          neg: 'Pensez à la dimension TEMPS. Chronique = usure systémique.'
        },
        {
          type: 'Appariement',
          q: 'Relie les sources de stress des tanneries à leur catégorie et conséquence.',
          options: [
            { left_fr: 'Postures penchées', right_fr: 'Ergonomique (TMS)' },
            { left_fr: 'Odeurs chimiques', right_fr: 'Chimique (Respiratoire)' },
            { left_fr: 'Soleil direct', right_fr: 'Environnemental (Déshydratation)' },
            { left_fr: 'Gestes répétitifs', right_fr: 'Biomécanique (Canal carpien)' },
            { left_fr: 'Isolation sociale', right_fr: 'Psychosocial (Dépression)' }
          ],
          pos: 'ANALYSE MULTI-FACTORIELLE ! Vous voyez la complexité d\'un métier physique.',
          neg: 'Chaque contrainte physique a une conséquence biologique précise.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Accidents à répétition aux tanneries.',
          options: {
            steps: [
              {
                question: 'Cause de la chute d\'Ali ?',
                responses: [
                  { id: 'A', text: 'Maladresse' },
                  { id: 'B', text: 'Multi-facteurs (Fromage suisse)' }
                ],
                correct: 'B'
              },
              {
                question: 'Cause systémique ?',
                responses: [
                  { id: 'A', text: 'Imprudence' },
                  { id: 'B', text: 'Défaut du SYSTÈME de protection' }
                ],
                correct: 'B'
              },
              {
                question: 'Plan d\'action ?',
                responses: [
                  { id: 'A', text: 'Punir' },
                  { id: 'B', text: '4 niveaux : Équipement, Milieu, Procédure, Culture' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'MODÈLE DE REASON MAÎTRISÉ ! On ne punit pas l\'erreur, on répare le système.',
          neg: 'Regardez au-delà de l\'individu. L\'accident est un symptôme du système.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Saïd est revenu après une brûlure grave. Quel pilier de résilience l\'a sauvé ?',
          options: [
            { id: 'A', label_fr: 'L\'humour' },
            { id: 'B', label_fr: 'Le SENS (Sa famille comptait sur lui)' }
          ],
          correct: 'B',
          pos: 'ANALYSE PSYCHOLOGIQUE ! Le "Pourquoi" de Frankl donne la force pour le "Comment".',
          neg: 'Le sens est le pilier le plus prédictif de la reconstruction.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Analysez le planning de Saïd. Pourquoi risque-t-il l\'épuisement ?',
          options: [
            { text_fr: '5h de travail continu sans pause', is_error: true },
            { text_fr: 'Hydratation uniquement quand soif', is_error: true },
            { text_fr: 'Refus des gants de protection', is_error: true },
            { text_fr: 'Pas d\'étirements préventifs', is_error: true },
            { text_fr: 'Pause de 15 min pour 11h de travail', is_error: true }
          ],
          pos: 'ANALYSE ERGONOMIQUE JUSTE ! Le burnout physique suit les mêmes règles que le mental.',
          neg: 'Cherchez les dénis de limites et les négligences biologiques.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez le Syndrome Général d\'Adaptation (Selye).',
          options: [
            { text: 'alarme' }, { text: 'cortisol' }, { text: 'résistance' }, { text: 'adaptation' }, { text: 'épuisement' }, { text: 'chronique' }, { text: 'récupération' }
          ],
          correct: 'alarme, cortisol, résistance, adaptation, épuisement, chronique, récupération',
          pos: 'MODÈLE DE SELYE MAÎTRISÉ ! L\'adaptation masque le danger avant l\'effondrement.',
          neg: 'Alarme -> Résistance -> Épuisement. C\'est le cycle du stress chronique.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Vrai/Faux rapide : "Un stress faible mais constant est plus dangereux qu\'un stress fort ponctuel."',
          correct: 'vrai',
          pos: 'CORRECT ! C\'est l\'usure systémique de la phase de résistance.',
          neg: 'Faux ! La durée multiplie l\'impact biologique.'
        },
        {
          type: 'Prise de décision',
          q: 'Moderniser les tanneries (machines) ou garder la tradition ?',
          options: [
            { id: 'A', label_fr: 'Tout moderniser' },
            { id: 'B', label_fr: 'Rien changer' },
            { id: 'C', label_fr: 'SYNTHÈSE : Moderniser les CONDITIONS (santé) mais garder les TECHNIQUES (art)' }
          ],
          correct: 'C',
          pos: 'ANALYSE DIALECTIQUE PARFAITE ! Vous réconciliez santé et patrimoine.',
          neg: 'Ne choisissez pas un camp. Cherchez la synthèse protectrice.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige un rapport (Risques, Solutions, Priorité) pour Saïd.',
          correct: 'risques, solutions, priorité',
          pos: 'PROFESSIONNEL ! Vous passez de stagiaire à analyste de sécurité.',
          neg: 'Structurez votre réponse : Identification -> Lien de causalité -> Priorisation.'
        },
        {
          type: 'Énigme',
          q: '« Je suis ce que tu FAIS de moi... Ni bon ni mauvais, mais Selye m\'a cartographié. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La peur' },
            { id: 'B', label_fr: 'Le stress' }
          ],
          correct: 'B',
          pos: 'CORRECT ! Vous ne voyez plus le stress comme un ennemi, mais comme un phénomène à comprendre.',
          neg: 'Pensez à la transition Bloom 1 -> Bloom 4 : Connaître -> Analyser.'
        }
      ]
    },
    {
      id: MISSION_IDS.F3,
      title_fr: 'Mission F3 : L’Université – Décision Analytique',
      description_fr: "Mentor: Pr. Latifa Bennani. Soft Skill: Prise de décision (ANALYSE). Analyser les biais sociaux (Groupthink) et les échecs décisionnels via le processus de Simon et le Groupthink de Janis.",
      questions: [
        {
          type: 'QCM',
          q: 'Comité de 8 : le président parle, tout le monde se tait par respect. Type d\'erreur ?',
          options: [
            { id: 'A', label_fr: 'Erreur cognitive' },
            { id: 'B', label_fr: 'Erreur sociale (Groupthink / Janis 1972)' }
          ],
          correct: 'B',
          pos: 'ANALYSE CORRECTE ! Le silence est interprété comme un accord. 65% des réunions en souffrent.',
          neg: 'C\'est une pression sociale de conformité, pas un biais de calcul.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Échec de la plateforme e-commerce des artisans.',
          options: {
            steps: [
              {
                question: 'Pourquoi l\'échec ?',
                responses: [
                  { id: 'A', text: 'Manque d\'argent' },
                  { id: 'B', text: 'Phase de collecte d\'info BÂCLÉE (compétences, marché)' }
                ],
                correct: 'B'
              },
              {
                question: 'Biais lors du vote ?',
                responses: [
                  { id: 'A', text: 'Ancrage' },
                  { id: 'B', text: 'Biais de DISPONIBILITÉ et JEUNISME' }
                ],
                correct: 'B'
              },
              {
                question: 'Quelle aurait dû être la décision ?',
                responses: [
                  { id: 'A', text: 'Tout ou rien' },
                  { id: 'B', text: 'Phase pilote (MVP) pour tester avant d\'investir' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'ANALYSE POST-MORTEM PARFAITE ! Vous voyez que l\'erreur est en amont du choix.',
          neg: 'Le choix final est souvent la conséquence d\'une mauvaise collecte de données.'
        },
        {
          type: 'Appariement',
          q: 'Relie les décisions réelles à leur biais dominant.',
          options: [
            { left_fr: 'Investir tramway car Rabat l\'a', right_fr: 'Conformité' },
            { left_fr: 'Prix du père comme référence', right_fr: 'Ancrage' },
            { left_fr: 'Choisir l\'artisan médiatique', right_fr: 'Effet de Halo' },
            { left_fr: 'Refuser touristes après un vol', right_fr: 'Généralisation hâtive' },
            { left_fr: 'Copier menu du voisin', right_fr: 'Imitation' }
          ],
          pos: 'IDENTIFICATION RÉUSSIE ! La première étape pour mieux décider est de reconnaître ses biais.',
          neg: 'Kahneman : Les biais sont les raccourcis dangereux du cerveau.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Auditez cette étude de marché pour un nouveau Riad.',
          options: [
            { text_fr: 'Échantillon de seulement 15 amis', is_error: true },
            { text_fr: 'Période de collecte d\'un seul jour', is_error: true },
            { text_fr: 'Questions orientées (complaisance)', is_error: true },
            { text_fr: 'Pas d\'analyse de la concurrence réelle', is_error: true },
            { text_fr: 'Décision basée sur "l\'instinct"', is_error: true }
          ],
          pos: 'AUDIT CRITIQUE IMPECCABLE ! Vous questionnez la validité de la méthode avant les résultats.',
          neg: 'Ne croyez pas les chiffres s\'ils viennent d\'une source non représentative.'
        },
        {
          type: 'Classement',
          q: 'Priorisez les facteurs de survie d\'un commerce artisanal.',
          options: [
            { label_fr: 'Qualité du produit' },
            { label_fr: 'Adaptation au marché' },
            { label_fr: 'Réseau de clients fidèles' },
            { label_fr: 'Maîtrise des coûts' },
            { label_fr: 'Bien-être au travail' },
            { label_fr: 'Transmission' },
            { label_fr: 'Innovation' }
          ],
          pos: 'ANALYSE STRATÉGIQUE ! Qualité (base) -> Adaptation -> Fidélité -> Coûts.',
          neg: 'On commence par la base client et la qualité avant l\'innovation pure.'
        },
        {
          type: 'Texte à trous',
          q: 'Les 8 étapes du processus de décision ANTI-GROUPTHINK.',
          options: [
            { text: 'définir' }, { text: 'collecter' }, { text: 'générer' }, { text: 'évaluer' }, { text: 'choisir' }, { text: 'agir' }, { text: 'feedback' }, { text: 'avocat du diable' }
          ],
          correct: 'définir, collecter, générer, évaluer, choisir, agir, feedback, avocat du diable',
          pos: 'PROCESSUS RENFORCÉ ! L\'avocat du diable est essentiel pour briser la conformité.',
          neg: 'Retenez les étapes de Simon plus les garde-fous de Janis.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Un commerçant copie le voisin et échoue. Pourquoi ?',
          options: [
            { id: 'A', label_fr: 'Malchance' },
            { id: 'B', label_fr: 'IMITATION sans ANALYSE du contexte (confiance, emplacement, historique)' }
          ],
          correct: 'B',
          pos: 'EXACT ! Copier n\'est pas comprendre. La stratégie "Océan Bleu" demande l\'adaptation.',
          neg: 'L\'échec vient de l\'absence d\'étude des variables spécifiques.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Vrai/Faux : "Une décision unanime sans débat est un signe de force d\'équipe."',
          correct: 'faux',
          pos: 'FAUX ! C\'est souvent le signe d\'un Groupthink dangereux.',
          neg: 'Erreur ! Le débat est nécessaire pour la qualité décisionnelle.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige une recommandation e-commerce avec les 8 étapes.',
          correct: '8 étapes',
          pos: 'SOLIDE ! Vous utilisez la méthode pour construire une solution robuste.',
          neg: 'Appliquez le processus complet : info, critères, test, feedback.'
        },
        {
          type: 'Énigme',
          q: '« Je me cache derrière les certitudes... Kahneman m\'a traqué toute sa vie. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Le mensonge' },
            { id: 'B', label_fr: 'Le biais cognitif' }
          ],
          correct: 'B',
          pos: 'CORRECT ! Identifier ses propres biais est le sommet de la lucidité.',
          neg: 'C\'est l\'ennemi invisible de la décision rationnelle.'
        }
      ]
    },
    {
      id: MISSION_IDS.F4,
      title_fr: 'Mission F4 : Restauration de la Medersa',
      description_fr: "Mentor: Youssef Alami. Soft Skill: Analyse systémique. Gérer des projets complexes, coordonner des interdépendances et résoudre des dilemmes éthiques (Cynefin & Charte de Venise).",
      questions: [
        {
          type: 'QCM',
          q: 'Pourquoi la restauration est-elle COMPLEXE (vs compliquée) ?',
          options: [
            { id: 'A', label_fr: 'Plus d\'étapes' },
            { id: 'B', label_fr: 'Interactions IMPRÉVISIBLES (Structure, Normes, Matériaux, Experts)' }
          ],
          correct: 'B',
          pos: 'ANALYSE SYSTÉMIQUE ! Modèle Cynefin : Complexe = l\'expérimentation et l\'adaptation sont nécessaires.',
          neg: 'Compliqué = recette connue. Complexe = interactions imprévisibles.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Analysez l\'interdépendance et trouvez le CHEMIN CRITIQUE.',
          options: [
            { left_fr: 'Historien d\'art', right_fr: 'Départ (Documentation)' },
            { left_fr: 'Chimiste', right_fr: 'Validation matériaux' },
            { left_fr: 'Maçon', right_fr: 'Structure porteuse' },
            { left_fr: 'Zelligeur/Sculpteur', right_fr: 'Finitions décoratives' }
          ],
          pos: 'CHEMIN CRITIQUE IDENTIFIÉ ! Le retard d\'un maillon bloque tout le projet.',
          neg: 'Suivez la chaîne logique : Savoir -> Matière -> Structure -> Beauté.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Dilemme des pigments au plomb.',
          options: {
            steps: [
              {
                question: 'Type de dilemme ?',
                responses: [
                  { id: 'A', text: 'Simple' },
                  { id: 'B', text: 'ÉTHIQUE COMPLEXE (Patrimoine vs Santé)' }
                ],
                correct: 'B'
              },
              {
                question: 'Solution proposée ?',
                responses: [
                  { id: 'A', text: 'Choisir un camp' },
                  { id: 'B', text: 'SYNTHÈSE : Pigments imités sûrs + Documentation substitut' }
                ],
                correct: 'B'
              },
              {
                question: 'Gouvernance ?',
                responses: [
                  { id: 'A', text: 'Architecte seul' },
                  { id: 'B', text: 'Comité pluridisciplinaire transparent' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'RÉSOLUTION SYSTÉMIQUE ! Vous réconciliez les valeurs opposées par la synthèse et la transparence.',
          neg: 'Les vrais dilemmes sont entre Bien et Bien. Cherchez la 3ème voie.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Auditez le plan de restauration rejeté.',
          options: [
            { text_fr: 'Restauration en une seule phase rapide', is_error: true },
            { text_fr: 'Utilisation de ciment Portland moderne', is_error: true },
            { text_fr: 'Absence de documentation photographique', is_error: true },
            { text_fr: 'Budget sans marge d\'imprévu', is_error: true },
            { text_fr: 'Décisions prises par l\'architecte seul', is_error: true }
          ],
          pos: 'ANALYSE MULTI-NIVEAUX ! Technique, Financier, Managérial : tout était défaillant.',
          neg: 'Sentez les erreurs structurelles : phasage, matériaux, contrôle.'
        },
        {
          type: 'Texte à trous',
          q: 'Les 7 principes de la Charte de Venise.',
          options: [
            { text: 'minimalisme' }, { text: 'réversibilité' }, { text: 'compatibilité' }, { text: 'authenticité' }, { text: 'documentation' }, { text: 'phasage' }, { text: 'interdisciplinaire' }
          ],
          correct: 'minimalisme, réversibilité, compatibilité, authenticité, documentation, phasage, interdisciplinaire',
          pos: 'PRINCIPES MAÎTRISÉS ! Ils s\'appliquent aussi bien au patrimoine qu\'à la tech (rollback, compatibility).',
          neg: 'Pensez à la pérennité : Pouvoir défaire ce que l\'on a fait.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Conflit Architecte (normes) vs Artisan (tradition). Quelle gouvernance ?',
          options: [
            { id: 'A', label_fr: 'Imposer' },
            { id: 'B', label_fr: 'Artisan (Aspect visible) / Architecte (Structure cachée) + Doc' }
          ],
          correct: 'B',
          pos: 'COMPROMIS STRUCTURÉ ! Vous répartissez le problème en couches de responsabilité.',
          neg: 'Ne tuez pas la tradition, ne négligez pas la sécurité.'
        },
        {
          type: 'Classement',
          q: 'Priorisez l\'urgence de restauration par zone.',
          options: [
            { label_fr: 'Fondations' },
            { label_fr: 'Toiture' },
            { label_fr: 'Murs porteurs' },
            { label_fr: 'Mosaïques' },
            { label_fr: 'Stuc/Bois' },
            { label_fr: 'Fontaines' },
            { label_fr: 'Sols' }
          ],
          pos: 'ANALYSE TRICRITÈRE ! Structure > Protection > Esthétique.',
          neg: 'Si les fondations ou le toit lâchent, tout le reste disparaît.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Vrai/Faux : "Un problème complexe peut être résolu avec une simple checklist."',
          correct: 'faux',
          pos: 'FAUX ! Le complexe demande de l\'observation et de l\'ajustement continu.',
          neg: 'Erreur ! Checklist = Simple/Compliqué. Complexe = Systémique.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige le rapport Forces/Faiblesses du projet.',
          correct: 'forces, faiblesses',
          pos: 'SYNTHÈSE PRO ! Vous voyez le monument comme un système vivant.',
          neg: 'Identifiez les interconnexions entre technique et gestion.'
        },
        {
          type: 'Énigme',
          q: '« Je tombe si tu me forces, je tiens si tu me respectes... Youssef me restaure sans me transformer. »',
          options: [
            { id: 'A', label_fr: 'L\'histoire' },
            { id: 'B', label_fr: 'La tradition' }
          ],
          correct: 'B',
          pos: 'CORRECT ! La tradition est une innovation qui a survécu à l\'analyse du temps.',
          neg: 'Indice : Ce qui se renouvelle par le respect.'
        }
      ]
    },
    {
      id: MISSION_IDS.F5,
      title_fr: 'Mission F5 : Le Festival – Synthèse Finale',
      description_fr: "Mentor: Lalla Ghita Amrani. Soft Skill: Synthèse analytique. Coordonner les parties prenantes, gérer les crises et assurer l'intégrité éthique (Stakeholder Theory & SWOT).",
      questions: [
        {
          type: 'Prise de décision',
          q: 'Crise : Ministre absent, Conflit Artisans, Sono en panne. Priorité ?',
          options: [
            { id: 'A', label_fr: 'Sono (Technique)' },
            { id: 'B', label_fr: 'CONFLIT HUMAIN (Instable, risque d\'escalade immédiat)' },
            { id: 'C', label_fr: 'Ministre (Prestige)' }
          ],
          correct: 'B',
          pos: 'PRIORISATION ANALYTIQUE ! L\'humain est la variable la plus volatile et destructrice si ignorée.',
          neg: 'La technique se répare, le prestige se gère, le conflit humain détruit tout.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Conflit centenaire des Zelligeurs vs Tanneurs.',
          options: {
            steps: [
              {
                question: 'Vrai objet du conflit ?',
                responses: [
                  { id: 'A', text: 'L\'eau' },
                  { id: 'B', text: 'POUVOIR et STATUT (L\'eau est un prétexte)' }
                ],
                correct: 'B'
              },
              {
                question: 'Pourquoi 50 ans ?',
                responses: [
                  { id: 'A', text: 'Rancune' },
                  { id: 'B', text: 'Absence de STRUCTURE de résolution' }
                ],
                correct: 'B'
              },
              {
                question: 'Solution ?',
                responses: [
                  { id: 'A', text: 'Forcer' },
                  { id: 'B', text: 'Créer un COMITÉ INSTITUTIONNEL avec règles claires' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'ANALYSE INSTITUTIONNELLE ! Les problèmes qui durent sont des problèmes de règles, pas de gens.',
          neg: 'Ne soyez pas un pompier, soyez un architecte de la paix.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Auditez le budget du festival. Quelles failles structurelles ?',
          options: [
            { text_fr: 'Dépendance à un seul sponsor majeur', is_error: true },
            { text_fr: 'Biais d\'optimisme sur les entrées', is_error: true },
            { text_fr: 'Artisans sous-payés par rapport à la Com', is_error: true },
            { text_fr: 'Absence totale de réserve imprévu', is_error: true },
            { text_fr: 'Déséquilibre Pub vs Contenu', is_error: true }
          ],
          pos: 'AUDIT STRATÉGIQUE ! Le risque systémique est trop élevé sans diversification ni réserve.',
          neg: 'Regardez les ratios : combien pour ceux qui font le festival ?'
        },
        {
          type: 'Appariement',
          q: 'Attribuez les corporations aux comités de gouvernance.',
          options: [
            { left_fr: 'Zelligeurs (Technique)', right_fr: 'Comité Qualité' },
            { left_fr: 'Tanneurs (Conflits)', right_fr: 'Comité Médiation' },
            { left_fr: 'Joailliers (Luxe)', right_fr: 'Comité Communication' },
            { left_fr: 'Ferronniers (Terrain)', right_fr: 'Comité Logistique' }
          ],
          pos: 'GOUVERNANCE ANALYTIQUE ! Attribuer selon les besoins structurels et non les préférences.',
          neg: 'Répartissez les forces selon les enjeux du festival.'
        },
        {
          type: 'Vrai/Faux',
          q: '"La tradition est l\'ennemie jurée de l\'innovation."',
          correct: 'faux',
          pos: 'FAUX ! La tradition est une innovation ancienne qui a réussi.',
          neg: 'Erreur ! C\'est la rigidité le problème, pas la tradition.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez le modèle de Freeman (Parties Prenantes).',
          options: [
            { text: 'identifier' }, { text: 'cartographier' }, { text: 'intérêts' }, { text: 'pouvoir' }, { text: 'légitimité' }, { text: 'urgence' }, { text: 'prioriser' }, { text: 'engager' }
          ],
          correct: 'identifier, cartographier, intérêts, pouvoir, légitimité, urgence, prioriser, engager',
          pos: 'STAKEHOLDER ANALYSIS MAÎTRISÉE ! Gérer la complexité, c\'est gérer les attentes de tous.',
          neg: 'Qui a le pouvoir ? Qui a l\'intérêt ? C\'est la clé.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Presse : « Les artisans sont exploités ». Votre analyse ?',
          options: [
            { id: 'A', label_fr: 'Nier' },
            { id: 'B', label_fr: 'RECONNAÎTRE (faits), NUANCER (système), PROPOSER (redistribution %)' }
          ],
          correct: 'B',
          pos: 'ANALYSE MÉDIATIQUE STRATÉGIQUE ! Transformer la critique en solution structurelle.',
          neg: 'Ne niez pas les chiffres, changez la structure de redistribution.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige une analyse SWOT (Forces, Faiblesses, Opp, Menaces) et 3 recommandations.',
          correct: 'swot',
          pos: 'SWOT COMPLÈTE ! Vous avez la vision d\'ensemble nécessaire à un leader.',
          neg: 'N\'oubliez pas les menaces externes (économie, concurrence).'
        },
        {
          type: 'Énigme',
          q: '« Je décompose le simple, je simplifie le complexe... À Fès tu m\'as enfin rencontrée. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La logique' },
            { id: 'B', label_fr: 'L’analyse' }
          ],
          correct: 'B',
          pos: 'FÉLICITATIONS ! Vous maîtrisez l\'analyse. Direction MARRAKECH pour l\'ÉVALUATION.',
          neg: 'C\'est l\'acte de relier les savoirs pour voir les structures cachées.'
        },
        {
          type: 'QCM',
          q: 'Quelle est la leçon suprême de Fès ?',
          options: [
            { id: 'A', label_fr: 'Travailler dur' },
            { id: 'B', label_fr: 'VOIR LES STRUCTURES derrière les surfaces' }
          ],
          correct: 'B',
          pos: 'MAJESTUEUX ! L\'analyse est un acte de sagesse qui transcende les apparences.',
          neg: 'C\'est plus que de la technique, c\'est une vision du monde.'
        }
      ]
    }
  ];

  for (const m of missionsData) {
    const { error: mErr } = await supabase.from('missions').upsert({
      id: m.id,
      city_id: FES_CHALLENGE_PK,
      challenge_id: FES_CHALLENGE_PK,
      title_fr: m.title_fr,
      description_fr: m.description_fr,
      sort_order: parseInt(m.id.split('f1')[1]) || 1, // Fallback
      is_published: true
    });
    if (mErr) { console.error(`Mission ${m.title_fr} error:`, mErr); continue; }
    console.log(`✅ Mission ${m.title_fr} upserted`);

    // Clean old questions for this mission
    await supabase.from('questions').delete().eq('mission_id', m.id);

    const questionsToInsert = m.questions.map((q, idx) => {
      let optionsData = q.options;
      if (q.type === 'Appariement' || q.type === 'Rôles d’équipe') {
        optionsData = q.options.map(o => ({ left_fr: o.left_fr, right_fr: o.right_fr }));
      } else if (q.type === 'Texte à trous') {
        optionsData = q.options.map(o => ({ text: o.text }));
      } else if (q.type === 'Détection d’erreurs') {
        optionsData = q.options.map(o => ({ text_fr: o.text_fr, is_error: o.is_error }));
      } else if (q.type === 'Scénario en cascade') {
        optionsData = q.options;
      } else if (q.type === 'Classement') {
        optionsData = q.options.map(o => ({ label_fr: o.label_fr }));
      }

      return {
        mission_id: m.id,
        question_type: TYPE_MAPPING[q.type] || 'qcm',
        question_fr: q.q,
        options: optionsData || [],
        correct_answer: q.correct || '',
        explanation_fr: q.pos || '',
        hint_fr: q.neg || '',
        xp_reward: q.type === 'Énigme' ? 250 : 100,
        time_limit_sec: 45,
        sort_order: idx + 1,
        is_published: true
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Error Questions Mission ${m.id}:`, qErr);
    } else {
      console.log(`✅ ${questionsToInsert.length} questions for ${m.id}`);
    }
  }

  console.log('🏁 Fès HIGH-FIDELITY import FINISHED!');
}

importFes();
