const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const RABAT_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440001';
const MISSION_IDS = {
  R1: '550e8400-e29b-41d4-a716-446655441111',
  R2: '550e8400-e29b-41d4-a716-446655442222',
  R3: '550e8400-e29b-41d4-a716-446655443333',
  R4: '550e8400-e29b-41d4-a716-446655444444',
  R5: '550e8400-e29b-41d4-a716-446655445555'
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
  'Réponse courte': 'short_answer',
  'Puzzle/Énigme': 'puzzle_riddle'
};

async function importRabat() {
  console.log('🚀 Starting Rabat HIGH-FIDELITY (Acte I) import...');

  // 1. City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: RABAT_CHALLENGE_PK,
    city_id: 'rabat',
    city_name_fr: 'Rabat',
    city_name_ar: 'الرباط',
    headline_fr: '🏛️ ACTE I - RABAT : RÉORGANISATION',
    description_fr: "Rabat, capitale administrative et politique, vous plonge dans des contextes professionnels exigeants : urgences médicales, administration publique, recherche universitaire, gestion de crise et gouvernance territoriale.",
    focus_fr: 'Découverte & Fondations (Bloom 1-2)',
    sort_order: 1,
    is_published: true,
    city_color: '#059669',
    icon_name: 'landmark'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Rabat upserted');

  const missionsData = [
    {
      id: MISSION_IDS.R1,
      title_fr: 'Mission R1 : Urgences à l’Hôpital Ibn Sina',
      description_fr: "Mentor: Dr. Amina Fassi. Soft Skill: Gestion du stress. Apprendre à identifier les types de stress, les symptômes physiques et pratiquer la technique 4-7-8.",
      questions: [
        {
          type: 'QCM',
          q: 'C’est ton premier jour de stage. Tu dois présenter dans 5 minutes. Ton cœur bat fort, tu transpires, tes mains tremblent. De quel type de stress s’agit-il ?',
          options: [{id:'A',label_fr:'Stress chronique'},{id:'B',label_fr:'Stress aigu'},{id:'C',label_fr:'Stress positif'},{id:'D',label_fr:'Pas de stress'}],
          correct: 'B',
          pos: 'Bravo ! Stress aigu : court, intense, déclenché par un événement précis.',
          neg: 'Non. Chronique dure des semaines. Ici c’est bref et intense → stress aigu.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Le stress est toujours mauvais pour la santé. »',
          correct: 'faux',
          pos: 'Excellent ! Le stress positif motive. Seul le stress chronique est dangereux.',
          neg: 'Faux. Un athlète avant compétition a du stress qui l’aide à performer.'
        },
        {
          type: 'Appariement',
          q: 'Relie chaque symptôme à sa catégorie : Physique, Émotionnel, Comportemental.',
          options: [
            { left_fr: 'Cœur qui bat vite', right_fr: 'Physique' },
            { left_fr: 'Pleurer facilement', right_fr: 'Émotionnel' },
            { left_fr: 'Manger trop ou pas assez', right_fr: 'Comportemental' },
            { left_fr: 'Mal de tête', right_fr: 'Physique' },
            { left_fr: 'Se sentir triste sans raison', right_fr: 'Émotionnel' },
            { left_fr: 'S’isoler des autres', right_fr: 'Comportemental' }
          ],
          pos: 'Parfait ! Tu distingues les trois catégories : corps, sentiments, actions.',
          neg: 'Bien essayé. Physique = corps, émotionnel = cœur, comportemental = actions.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Une maman paniquée avec son fils qui hurle. Dr. Amina est occupée. Quelle est ta meilleure réaction ?',
          options: [
            {id:'A',label_fr:'Je panique aussi'},
            {id:'B',label_fr:'« Calmez-vous, ce n’est rien »'},
            {id:'C',label_fr:'Je m’approche calmement, je m’agenouille vers l’enfant, je parle doucement à la maman.'}
          ],
          correct: 'C',
          pos: 'Bravo ! Corps calme, contact visuel enfant, voix douce = co-régulation émotionnelle.',
          neg: 'Face au stress, sois calme, valide l’émotion, n’ignore pas la détresse.'
        },
        {
          type: 'Texte à trous',
          q: 'Complète le texte sur la technique 4-7-8.',
          options: [
            {text:'inspire'},{text:'nez'},{text:'4'},{text:'bloque'},{text:'7'},{text:'expire'},{text:'bouche'},{text:'8'},{text:'3 fois'},{text:'parasympathique'}
          ],
          correct: 'inspire, nez, 4, bloque, 7, expire, bouche, 8, 3 fois, parasympathique',
          pos: 'Parfait ! Inspire 4s par nez, bloque 7s, expire 8s par bouche, répète 3 fois.',
          neg: 'Retiens : 4-7-8. Nez pour inspirer, bouche pour expirer.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Suis le guide visuel pour faire 3 cycles complets de respiration 4-7-8. Comment te sens-tu maintenant ?',
          options: [{id:'A',label_fr:'Plus calme'},{id:'B',label_fr:'Pareil'},{id:'C',label_fr:'Un peu étourdi'},{id:'D',label_fr:'Concentré'}],
          correct: 'A', // Any accepted but script needs one
          pos: 'Bravo d’avoir essayé ! La pratique régulière développe les effets. Continue !',
          neg: 'L’essai est déjà une victoire. Réessaie 2-3 fois par jour.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Soutien émotionnel après un choc.',
          options: {
            steps: [
              {
                question: 'Un jeune homme apprend le décès de sa grand-mère. Quelle est ta PREMIÈRE action ?',
                responses: [{id:'A',text:'Lui parler'},{id:'B',text:'M’asseoir à côté de lui en silence.'}],
                correct: 'B'
              },
              {
                question: 'Il commence à pleurer. Que fais-tu ?',
                responses: [{id:'A',text:'Lui dire d\'arrêter'},{id:'B',text:'Lui tendre un mouchoir en silence.'}],
                correct: 'B'
              },
              {
                question: 'Il dit : « Elle était tout pour moi… ». Que réponds-tu ?',
                responses: [{id:'A',text:'« C\'est la vie »'},{id:'C',text:'« Elle comptait beaucoup pour toi. Raconte-moi si tu veux. »'}],
                correct: 'C'
              }
            ]
          },
          pos: 'Excellent ! Validation + invitation + non-jugement = base du soutien émotionnel.',
          neg: 'Le silence et l\'écoute sont souvent plus puissants que les mots.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifie les 5 erreurs majeures dans le planning du Dr. Rachid.',
          options: [
            {text_fr:'Aucune pause quotidienne',is_error:true},
            {text_fr:'Sommeil insuffisant (4-5h)',is_error:true},
            {text_fr:'Aucun jour de repos complet',is_error:true},
            {text_fr:'Nutrition catastrophique (8 cafés)',is_error:true},
            {text_fr:'Aucun loisir / zéro sport',is_error:true}
          ],
          pos: 'Excellent diagnostic ! Tu identifies les 5 causes du burnout.',
          neg: 'Cherche les manques fondamentaux : sommeil, repos, nutrition, loisirs.'
        },
        {
          type: 'Prise de décision',
          q: 'Dr. Amina, épuisée après 12h de garde, doit décider : rester ou passer le relais ?',
          options: [{id:'A',label_fr:'Elle reste pour finir'},{id:'B',label_fr:'Elle passe le relais à un collègue frais.'}],
          correct: 'B',
          pos: 'Décision professionnelle parfaite ! Reconnaître ses limites priorise la sécurité du patient.',
          neg: 'Un médecin épuisé commet 3 fois plus d’erreurs. Passer le relais est une force.'
        },
        {
          type: 'Puzzle/Énigme',
          q: '« Je nais dans la poitrine, je grandis dans les pensées… Qui suis-je ? »',
          options: [{id:'A',label_fr:'La peur'},{id:'B',label_fr:'La fatigue'},{id:'C',label_fr:'Le stress'}],
          correct: 'C',
          pos: 'Bravo ! Le stress naît dans le cœur, grandit dans l’esprit. Apprivoisé, il devient force.',
          neg: 'Indice : cœur qui bat vite, chaleur, mains qui tremblent.'
        }
      ]
    },
    {
      id: MISSION_IDS.R2,
      title_fr: 'Mission R2 : Ministère & Prise de décision',
      description_fr: "Mentor: Le Directeur. Soft Skill: Prise de décision. Maîtriser le processus de Simon (6 étapes), la matrice d’Eisenhower et identifier les biais cognitifs.",
      questions: [
        {
          type: 'QCM',
          q: 'Le directeur de ton ISTA veut acheter 50 ordinateurs (500 000 DH). Quel type de décision ?',
          options: [{id:'A',label_fr:'Opérationnelle'},{id:'B',label_fr:'Tactique'},{id:'C',label_fr:'Stratégique'}],
          correct: 'B',
          pos: 'Exact ! Tactique : budget moyen, impact 2-3 ans.',
          neg: 'Règle : <10K = op, 10K-1M = tactique, >1M = stratégique.'
        },
        {
          type: 'Classement',
          q: 'Classe les 6 étapes de la décision selon Simon.',
          options: [
            {label_fr:'Identifier le problème'},{label_fr:'Collecter les informations'},{label_fr:'Générer les options'},{label_fr:'Évaluer les options'},{label_fr:'Choisir la meilleure'},{label_fr:'Mettre en œuvre'}
          ],
          pos: 'Parfait ! Tu maîtrises le processus Simon : Identifier, Collecter, Générer, Évaluer, Choisir, Agir.',
          neg: 'Retiens la logique : d’abord identifier, puis comprendre, explorer, évaluer, choisir.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Citoyen furieux : « Ça fait 3 fois que je viens ! » Ton supérieur absent. Quelle réaction ?',
          options: [
            {id:'A',label_fr:'« Revenez demain »'},
            {id:'B',label_fr:'« Je m’excuse, j’écoute, je note tout, je promets un suivi. »'},
            {id:'C',label_fr:'« Je lui donne un faux numéro »'}
          ],
          correct: 'B',
          pos: 'Bravo ! Écoute active, validation, engagement réaliste = gestion client mécontent.',
          neg: 'Montrer de l’intérêt résout souvent 80% du problème émotionnel.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Ne pas décider = décider. »',
          correct: 'vrai',
          pos: 'Vrai. L’indécision laisse les événements décider pour toi.',
          neg: 'L’indécision est une forme de décision passive.'
        },
        {
          type: 'Classement',
          q: 'Classe ces tâches par priorité (Matrice d’Eisenhower).',
          options: [
            {label_fr:'Email du Ministre (Urgent/Imp)'},
            {label_fr:'Appel urgent journaliste'},
            {label_fr:'Préparer réunion 11h'},
            {label_fr:'Réserver salle semaine prochaine'},
            {label_fr:'Fournitures (stocks 2 sem)'},
            {label_fr:'Mise à jour site web'}
          ],
          pos: 'Excellent ! Matrice Eisenhower maîtrisée : urgent/important d\'abord.',
          neg: 'Urgent + Important = Faire ; Important non urgent = Planifier.'
        },
        {
          type: 'Texte à trous',
          q: 'Complète le texte sur les biais cognitifs.',
          options: [
            {text:'ancrage'},{text:'première'},{text:'confirmation'},{text:'disponibilité'},{text:'récents'},{text:'biais'}
          ],
          correct: 'ancrage, première, confirmation, disponibilité, récents, biais',
          pos: 'Parfait ! Ancrage, confirmation, disponibilité : trois pièges à éviter.',
          neg: 'Ancrage = 1er chiffre, Confirmation = chercher ce qui conforte, Disponibilité = souvenirs récents.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Dilemme éthique : l\'erreur de Karim.',
          options: {
            steps: [
              {
                question: 'Erreur de 500 DH sur les frais de Karim. Première réaction ?',
                responses: [{id:'A',text:'Le dénoncer'},{id:'C',text:'Parler D’ABORD à Karim'}],
                correct: 'C'
              },
              {
                question: 'Karim nie l\'erreur. Que fais-tu ?',
                responses: [{id:'A',text:'Laisser tomber'},{id:'C',text:'Lui montrer les preuves calmement'}],
                correct: 'C'
              },
              {
                question: 'Il demande le secret. Que réponds-tu ?',
                responses: [{id:'A',text:'D\'accord'},{id:'B',text:'« Je vais devoir signaler à Fatima. Veux-tu le faire toi-même ? »'}],
                correct: 'B'
              }
            ]
          },
          pos: 'Intégrité exemplaire ! Le dialogue avant l\'escalade, mais sans compromission.',
          neg: 'L\'éthique demande de la transparence et du courage.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifie les 5 erreurs de décision dans le projet Digitalisation.',
          options: [
            {text_fr:'Budget décidé trop vite (30 min)',is_error:true},
            {text_fr:'Pas d’appel d’offres',is_error:true},
            {text_fr:'Zéro consultation employés',is_error:true},
            {text_fr:'Deadline irréaliste (6 mois)',is_error:true},
            {text_fr:'Aucun test pilote',is_error:true}
          ],
          pos: 'Diagnostic parfait ! Tu as identifié les violations du processus Simon.',
          neg: 'Cherche la précipitation et l\'absence de consultation.'
        },
        {
          type: 'Prise de décision',
          q: '100 000 DH à dépenser. Trois projets possibles. Quel choix ?',
          options: [
            {id:'A',label_fr:'Formation'},
            {id:'B',label_fr:'Logiciel'},
            {id:'D',label_fr:'Je demande aux employés de voter'}
          ],
          correct: 'D',
          pos: 'Leadership participatif ! L\'engagement est garanti quand les utilisateurs choisissent.',
          neg: 'Imposer une solution crée de la résistance.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige ton plan de décision personnel (Décision, 6 étapes, Biais).',
          correct: 'décision, étapes, biais',
          pos: 'Superbe réflexion métacognitive ! Plan concret.',
          neg: 'Vérifie que tu as cité une décision, les étapes et un biais.'
        }
      ]
    },
    {
      id: MISSION_IDS.R3,
      title_fr: 'Mission R3 : Projet collaboratif à l’Université',
      description_fr: "Mentor: Dr. Sarah. Soft Skill: Travail en équipe. Découvrir les rôles Belbin, pratiquer la CNV et comprendre le cycle de vie d'une équipe (Tuckman).",
      questions: [
        {
          type: 'QCM',
          q: 'Aicha a TOUJOURS 10 idées nouvelles, mais ne finit jamais rien. Quel rôle Belbin ?',
          options: [{id:'A',label_fr:'Leader'},{id:'B',label_fr:'Créatif'},{id:'C',label_fr:'Analyste'},{id:'D',label_fr:'Réalisateur'}],
          correct: 'B',
          pos: 'Exact ! Créative : génère des idées mais manque d’exécution.',
          neg: 'Nadia invente → créative.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Attribue à chaque membre le rôle Belbin.',
          options: [
            { left_fr: 'Karim', right_fr: 'Analyste' },
            { left_fr: 'Sarah', right_fr: 'Harmonisateur' },
            { left_fr: 'Omar', right_fr: 'Leader' },
            { left_fr: 'Nadia', right_fr: 'Créatif' },
            { left_fr: 'Hassan', right_fr: 'Réalisateur' }
          ],
          pos: 'Bravo ! Équipe parfaitement distribuée selon Belbin.',
          neg: 'Analyste (données), Harmonisateur (calme), Leader (dirige), Créatif (idées), Réalisateur (action).'
        },
        {
          type: 'Dialogue de situation',
          q: 'Karim attaque Nadia : « Tes idées sont n’importe quoi ! » Quelle intervention ?',
          options: [
            {id:'A',label_fr:'« Tu es méchant »'},
            {id:'B',label_fr:'« Karim, peux-tu reformuler de façon constructive ? »'},
            {id:'C',label_fr:'Je ne dis rien'}
          ],
          correct: 'B',
          pos: 'Magnifique ! Recadrage sans juger, demande de feedback constructif.',
          neg: 'Reformule la critique en demande d’amélioration technique.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Les conflits dans une équipe sont TOUJOURS mauvais. »',
          correct: 'faux',
          pos: 'Faux. Conflit de tâches (idées) = sain. Conflit relationnel = toxique.',
          neg: 'Les conflits d\'idées stimulent la créativité.'
        },
        {
          type: 'Texte à trous',
          q: 'Complète les 4 étapes de la CNV (OSBD).',
          options: [
            {text:'Observation'},{text:'jugement'},{text:'tu'},{text:'Sentiment'},{text:'je'},{text:'Besoin'},{text:'Demande'}
          ],
          correct: 'Observation, jugement, tu, Sentiment, je, Besoin, Demande',
          pos: 'Parfait ! Observation, Sentiment, Besoin, Demande. Base de la CNV.',
          neg: 'Faits sans jugement, Sentiment avec « je », Besoin expliqué.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Youssef est passif dans l\'équipe.',
          options: {
            steps: [
              {
                question: 'Youssef ne contribue pas. Première approche ?',
                responses: [{id:'A',text:'Le critiquer'},{id:'C',text:'Lui parler en privé avec bienveillance'}],
                correct: 'C'
              },
              {
                question: 'Il dit : « Ma mère est malade, je suis épuisé. » Réaction ?',
                responses: [{id:'A',text:'« Sois pro »'},{id:'B',text:'« Je suis désolé. Comment l’équipe peut t’aider ? »'}],
                correct: 'B'
              },
              {
                question: 'Il demande la discrétion. Que dis-tu à l’équipe ?',
                responses: [{id:'A',text:'Tout dire'},{id:'C',text:'Expliquer qu’il a des difficultés personnelles sans détail.'}],
                correct: 'C'
              }
            ]
          },
          pos: 'Bienveillance et transparence respectueuse. Tu as gagné sa confiance.',
          neg: 'Le dialogue privé évite l\'humiliation et renforce la solidarité.'
        },
        {
          type: 'Classement',
          q: 'Classe les 5 étapes de Tuckman.',
          options: [
            {label_fr:'Forming'},{label_fr:'Storming'},{label_fr:'Norming'},{label_fr:'Performing'},{label_fr:'Adjourning'}
          ],
          pos: 'Bravo ! Formation, Tempête, Normalisation, Performance, Dissolution.',
          neg: 'On forme, on se confronte, on s’organise, on performe.'
        },
        {
          type: 'Appariement',
          q: 'Relie chaque lettre de DESC à sa signification.',
          options: [
            { left_fr: 'D', right_fr: 'Décris les faits' },
            { left_fr: 'E', right_fr: 'Exprime ton ressenti' },
            { left_fr: 'S', right_fr: 'Suggère une solution' },
            { left_fr: 'C', right_fr: 'Conséquences' }
          ],
          pos: 'Parfait ! DESC est la clé du feedback sans conflit.',
          neg: 'D=faits, E=sentiment, S=solution, C=impact.'
        },
        {
          type: 'Prise de décision',
          q: 'Attribue chaque tâche au bon profil Belbin.',
          options: [
            {id:'A',label_fr:'Design -> Nadia (créative)'},
            {id:'B',label_fr:'Données -> Karim (analyste)'},
            {id:'C',label_fr:'Rapport -> Hassan (réalisateur)'},
            {id:'D',label_fr:'Conflit -> Sarah (harmonisateur)'},
            {id:'E',label_fr:'Présentation -> Omar (leader)'}
          ],
          correct: 'A', // Representative
          pos: 'Attribution optimale ! Chacun dans sa force = productivité maximale.',
          neg: 'Répartis selon l\'expertise naturelle : créatif (design), analyste (chiffres).'
        },
        {
          type: 'Puzzle/Énigme',
          q: '« Seule, je ne suis rien. À deux, je deviens force. À trois, magie... »',
          options: [{id:'A',label_fr:'La force'},{id:'B',label_fr:'La confiance'},{id:'C',label_fr:'L’argent'}],
          correct: 'B',
          pos: 'Magnifique ! La confiance est le ciment invisible de toute équipe.',
          neg: 'Sans moi, tout s\'effondre.'
        }
      ]
    },
    {
      id: MISSION_IDS.R4,
      title_fr: 'Mission R4 : ONG Espoir Maroc',
      description_fr: "Mentor: Salma. Soft Skill: Résilience. Identifier le burnout, pratiquer le coping adaptatif et maîtriser les piliers de la résilience (Cyrulnik).",
      questions: [
        {
          type: 'QCM',
          q: 'Employé travaille 14h/j depuis 6 mois, vide émotionnel, plus de motivation. Quel mal ?',
          options: [{id:'A',label_fr:'Stress aigu'},{id:'B',label_fr:'Anxiété'},{id:'C',label_fr:'Burnout'}],
          correct: 'C',
          pos: 'Exact ! Burnout : épuisement émotionnel, cynisme, inefficacité.',
          neg: 'Stress aigu est bref. Ici c\'est l\'épuisement chronique.'
        },
        {
          type: 'Appariement',
          q: 'Relie chaque action à sa catégorie : Adaptatif ou Inadaptatif.',
          options: [
            { left_fr: 'Parler à un ami', right_fr: 'Adaptatif' },
            { left_fr: 'Alcool', right_fr: 'Inadaptatif' },
            { left_fr: 'Sport', right_fr: 'Adaptatif' },
            { left_fr: 'Nier le problème', right_fr: 'Inadaptatif' },
            { left_fr: 'Méditer', right_fr: 'Adaptatif' },
            { left_fr: 'Blâmer les autres', right_fr: 'Inadaptatif' }
          ],
          pos: 'Excellent ! Coping adaptatif = affronter. Inadaptatif = éviter.',
          neg: 'Adaptatif = solutions saines. Inadaptatif = fuite ou déni.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Salma doit annoncer 4 licenciements. Meilleure approche ?',
          options: [
            {id:'A',label_fr:'Email générique'},
            {id:'C',label_fr:'Réunir individuellement d\'abord, puis réunion collective.'}
          ],
          correct: 'C',
          pos: 'Approche professionnelle ! Dignité individuelle et transparence collective.',
          neg: 'L’email ou la réunion collective directe humilie les personnes.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Vrai/Faux rapide : "Le coping par isolement est adaptatif."',
          correct: 'faux',
          pos: 'Exact. L’isolement aggrave le stress au lieu de le résoudre.',
          neg: 'Le soutien social est un pilier de la résilience.'
        },
        {
          type: 'Texte à trous',
          q: 'Complète les 8 piliers de la résilience de Cyrulnik.',
          options: [
            {text:'sens'},{text:'relations'},{text:'humour'},{text:'corps'},{text:'apprentissage'},{text:'créativité'},{text:'espoir'},{text:'spiritualité'}
          ],
          correct: 'sens, relations, humour, corps, apprentissage, créativité, espoir, spiritualité',
          pos: 'Parfait ! Les piliers de Cyrulnik permettent de se reconstruire.',
          neg: 'Pourquoi, avec qui, rire, bouger, apprendre, créer...'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifie 6 erreurs dans le plan d’urgence de Salma.',
          options: [
            {text_fr:'Mentir aux employés',is_error:true},
            {text_fr:'Travailler 16h/jour',is_error:true},
            {text_fr:'Salaires -50% sans discussion',is_error:true},
            {text_fr:'Supplier le financeur',is_error:true},
            {text_fr:'Embaucher en CDI pendant la crise',is_error:true},
            {text_fr:'Sacrifier sa propre santé',is_error:true}
          ],
          pos: 'Diagnostic parfait ! Ces erreurs sont classiques en gestion de crise.',
          neg: 'Cherche le déni, le surtravail et le manque de stratégie.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Recadrage cognitif de Salma.',
          options: {
            steps: [
              {
                question: 'Salma dit : « J’ai échoué ». Comment recadrer ?',
                responses: [{id:'A',text:'« C\'est vrai »'},{id:'B',text:'« Un événement n’est pas un échec si tu apprends. »'}],
                correct: 'B'
              },
              {
                question: 'Elle dit : « Je suis nulle ». Recadrage ?',
                responses: [{id:'A',text:'« Non t\'es forte »'},{id:'B',text:'« Tu as fait des erreurs mais tu n’es pas TA performance. »'}],
                correct: 'B'
              },
              {
                question: '« J’ai ruiné la vie de 10 personnes. » Recadrage ?',
                responses: [{id:'A',text:'« Tu leur as offert des années de travail. L’économie est difficile. »'},{id:'B',text:'« C\'est ta faute »'}],
                correct: 'A'
              }
            ]
          },
          pos: 'Excellent recadrage ! Dissocier l\'être de l\'acte et transformer l\'erreur en leçon.',
          neg: 'La résilience commence par le changement de regard sur les faits.'
        },
        {
          type: 'Prise de décision',
          q: 'Budget coupé de 60%. Quelle stratégie de survie ?',
          options: [
            {id:'A',label_fr:'Fermer immédiatement'},
            {id:'C',label_fr:'Pivot stratégique : réduire l\'équipe et se recentrer sur 2 projets forts.'}
          ],
          correct: 'C',
          pos: 'Stratégie gagnante ! Réalisme, focus et pivot sauvent les organisations.',
          neg: 'Miser sur une seule solution (comme le crowdfunding) est trop risqué.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige le message de restructuration (Transparence, Empathie, Vision).',
          correct: 'message',
          pos: 'Message exemplaire ! Leadership en temps de crise.',
          neg: 'N\'oublie pas d\'inclure l\'empathie et une vision claire pour la suite.'
        },
        {
          type: 'Puzzle/Énigme',
          q: '« Je suis plus forte quand tu me casses et me reconstruis… Qui suis-je ? »',
          options: [{id:'A',label_fr:'La foi'},{id:'B',label_fr:'La résilience'},{id:'C',label_fr:'La patience'}],
          correct: 'B',
          pos: 'Magnifique ! La résilience naît de l’adversité.',
          neg: 'Indice : apprendre à se relever.'
        }
      ]
    },
    {
      id: MISSION_IDS.R5,
      title_fr: 'Mission R5 : Le Grand Défi Final – Wilaya',
      description_fr: "Mentor: Le Wali. Synthèse des 3 soft skills (Stress, Décision, Équipe). Gérer une crise sanitaire majeure et arbitrer des dilemmes éthiques de haut niveau.",
      questions: [
        {
          type: 'Prise de décision',
          q: 'Crise sanitaire : 200 hospitalisés. Une décision en 60 secondes. Laquelle ?',
          options: [
            {id:'A',label_fr:'Donner une interview'},
            {id:'B',label_fr:'Envoyer plus de médecins à l’hôpital (sauver des vies)'}
          ],
          correct: 'B',
          pos: 'Priorité correcte ! Sauver les vies avant d’expliquer ou d\'enquêter.',
          neg: 'La hiérarchie : 1) Vies, 2) Enquête, 3) Com, 4) Empathie.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Attribue chaque rôle de la cellule de crise.',
          options: [
            { left_fr: 'Chef', right_fr: 'Fatima (expérience)' },
            { left_fr: 'Médical', right_fr: 'Dr. Karim' },
            { left_fr: 'Enquêteur', right_fr: 'Hassan' },
            { left_fr: 'Porte-parole', right_fr: 'Sarah' },
            { left_fr: 'Empathie', right_fr: 'Imam' },
            { left_fr: 'Données', right_fr: 'Youssef' }
          ],
          pos: 'Cellule de crise optimale ! Expertise, légitimité et diversité.',
          neg: 'Apparie selon la fonction : médecin (médical), police (enquête), imam (empathie).'
        },
        {
          type: 'Scénario en cascade',
          q: 'Communication médias en temps de crise.',
          options: {
            steps: [
              {
                question: 'Premier message aux journalistes ?',
                responses: [{id:'A',text:'« Pas de détails »'},{id:'B',text:'« Voici ce que nous savons, cherchons et faisons. »'}],
                correct: 'B'
              },
              {
                question: '« Combien de morts ? »',
                responses: [{id:'A',text:'« Beaucoup »'},{id:'B',text:'« 3 décès confirmés. Nous sommes avec les familles. »'}],
                correct: 'B'
              },
              {
                question: '« C’est votre faute ! »',
                responses: [{id:'A',text:'Attaquer'},{id:'C',text:'« Je comprends votre colère. L\'enquête déterminera tout. Je sauve des vies. »'}],
                correct: 'C'
              }
            ]
          },
          pos: 'Professionnalisme parfait ! Factuel, empathique et recentré sur l\'action.',
          neg: 'Ne jamais attaquer en retour, reste sur les faits et la compassion.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouve les 5 erreurs dans le rapport d’analyse de crise.',
          options: [
            {text_fr:'Données « 100% homme » suspectes',is_error:true},
            {text_fr:'Projections sans modèle justifié',is_error:true},
            {text_fr:'Conclusion sur seulement 10 témoignages',is_error:true},
            {text_fr:'Accusations sans preuves',is_error:true},
            {text_fr:'Promesse : « Tout sera fini dans 24h »',is_error:true}
          ],
          pos: 'Vigilance professionnelle ! Tu as évité les conclusions hâtives et les sur-promesses.',
          neg: 'Cherche les biais de données et les promesses intenables.'
        },
        {
          type: 'Contre-la-montre',
          q: '5 décisions rapides en crise. Agent paniqué ? Enfant peur ? Gaffe Sarah ?',
          options: [{id:'A',label_fr:'Respirer 4-7-8'},{id:'B',label_fr:'Agenouiller/Doux'},{id:'C',label_fr:'Analyser erreur ensemble'},{id:'D',label_fr:'Dormir d\'abord'}],
          correct: 'A', // Representative
          pos: 'Leadership juste et humain. Calme avant l\'action, limites reconnues.',
          neg: 'La panique demande du souffle, la fatigue demande du repos.'
        },
        {
          type: 'Appariement',
          q: 'Relie les piliers de l\'autodétermination (SDT).',
          options: [
            { left_fr: 'Autonomie', right_fr: '« Gère comme tu le sens »' },
            { left_fr: 'Compétence', right_fr: '« Célèbre l’expertise »' },
            { left_fr: 'Affiliation', right_fr: '« Repas d’équipe »' }
          ],
          pos: 'Maîtrise de la SDT ! Base de la motivation intrinsèque.',
          neg: 'Autonomie (liberté), Compétence (maîtrise), Affiliation (lien).'
        },
        {
          type: 'Scénario en cascade',
          q: 'Dilemme éthique avec le Ministre.',
          options: {
            steps: [
              {
                question: 'Le Ministre demande de cacher un nom. Conseil ?',
                responses: [{id:'A',text:'Obéir'},{id:'B',text:'« Dialoguez d’abord. »'}],
                correct: 'B'
              },
              {
                question: 'Il menace. Que réponds-tu ?',
                responses: [{id:'A',text:'Céder'},{id:'C',text:'Expliquer les risques énormes du secret s\'il est découvert.'}],
                correct: 'C'
              },
              {
                question: 'Il reste ferme. Action ?',
                responses: [{id:'A',text:'Se taire'},{id:'B',text:'Dire la vérité publiquement.'}],
                correct: 'B'
              }
            ]
          },
          pos: 'Intégrité absolue. Votre carrière finira, votre intégrité jamais.',
          neg: 'L\'obéissance aveugle est une faute dans la gestion publique.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige ton plan 100 jours comme Wali (Priorités, Équipe, Prévention).',
          correct: 'plan',
          pos: 'Vision stratégique excellente ! Plan structuré et réaliste.',
          neg: 'Assure-toi de couvrir les priorités, l\'équipe et la prévention.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Délégation finale des 8 tâches aux 6 membres.',
          options: [
            {id:'A',label_fr:'Conf presse -> Sarah'},{id:'B',label_fr:'Hôpital -> Imam'},{id:'C',label_fr:'Source -> Hassan'},{id:'D',label_fr:'Rapport -> Fatima'}
          ],
          correct: 'A', // Representative
          pos: 'Délégation stratégique parfaite ! Charge équilibrée.',
          neg: 'Fais correspondre chaque tâche à l\'expertise du membre.'
        },
        {
          type: 'Puzzle/Énigme',
          q: '« Je naîtrai quand tu équilibreras la tête, le cœur et les mains… »',
          options: [{id:'A',label_fr:'L’expérience'},{id:'B',label_fr:'Le charisme'},{id:'C',label_fr:'La sagesse'}],
          correct: 'C',
          pos: 'Magnifique ! La sagesse = équilibre entre raison, empathie et action.',
          neg: 'Équilibre entre stress et calme, moi et nous.'
        }
      ]
    }
  ];

  for (const m of missionsData) {
    const { error: mErr } = await supabase.from('missions').upsert({
      id: m.id,
      city_id: RABAT_CHALLENGE_PK,
      challenge_id: RABAT_CHALLENGE_PK,
      title_fr: m.title_fr,
      description_fr: m.description_fr,
      sort_order: parseInt(m.id.slice(-4)) / 1111 || 1, 
      is_published: true
    });
    if (mErr) { console.error(`Mission ${m.title_fr} error:`, mErr); continue; }
    console.log(`✅ Mission ${m.title_fr} upserted`);

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
        xp_reward: q.type === 'Énigme' || q.type === 'Puzzle/Énigme' ? 250 : 100,
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

  console.log('🏁 Rabat HIGH-FIDELITY import FINISHED!');
}

importRabat();
