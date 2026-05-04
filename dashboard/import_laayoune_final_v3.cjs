const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const LAAYOUNE_CHALLENGE_PK = '98b50e2ddc9943efb387052637738f65';

const MISSION_IDS = {
  L1: '98b50e2d-dc99-43ef-b387-052637738b01',
  L2: '98b50e2d-dc99-43ef-b387-052637738b02',
  L3: '98b50e2d-dc99-43ef-b387-052637738b03',
  L4: '98b50e2d-dc99-43ef-b387-052637738b04',
  L5: '98b50e2d-dc99-43ef-b387-052637738b05'
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

async function importLaayoune() {
  console.log('🚀 Starting Laâyoune HIGH-FIDELITY (Acte V) import...');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: LAAYOUNE_CHALLENGE_PK,
    city_id: 'laayoune',
    city_name_fr: 'Laâyoune',
    city_name_ar: 'العيون',
    description_fr: "Laâyoune, porte du désert, vous invite à créer là où rien n’existe. Ici, pas de manuels, pas de protocoles tout faits. Vous allez inventer des réponses originales à des problèmes inédits, avec des ressources limitées.",
    headline_fr: '🐪 ACTE V - LA PORTE DU DÉSERT : LA CRÉATION',
    sort_order: 5,
    is_published: true,
    city_color: '#f59e0b',
    icon_name: 'sun'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Laâyoune upserted');

  const missionsData = [
    {
      id: MISSION_IDS.L1,
      title_fr: 'Mission L1 : Base de Protection Civile - Créer l\'Urgence',
      description_fr: "Mentor: Commandant Hassan. Soft Skill: Gestion du stress (CRÉATION). Inventez des protocoles pour des situations inédites.",
      questions: [
        {
          type: 'QCM',
          q: 'Une tempête de sable d\'un type nouveau bloque toute communication. Vous devez créer un protocole de signalisation visuelle. Quelle est votre première étape créative ?',
          options: [
            { id: 'A', label_fr: 'Attendre que la tempête passe' },
            { id: 'B', label_fr: 'Diverger : Lister tous les objets colorés ou lumineux disponibles' },
            { id: 'C', label_fr: 'Lire le manuel de Rabat' },
            { id: 'D', label_fr: 'Ne rien faire' }
          ],
          correct: 'B',
          pos: 'Parfait ! La création commence par la divergence : lister les ressources disponibles sans jugement.',
          neg: 'Le manuel de Rabat ne prévoit pas l\'inédit. Vous devez inventer avec ce que vous avez.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Votre équipe est tétanisée par l\'absence de consignes. Que proposez-vous pour libérer leur créativité sous stress ?',
          options: [
            { id: 'A', label_fr: '« C\'est un ordre, trouvez une idée ! »' },
            { id: 'B', label_fr: '« Imaginons la solution la plus folle, puis voyons comment la rendre réelle. »' },
            { id: 'C', label_fr: 'Les licencier' }
          ],
          correct: 'B',
          pos: 'Technique du "Provocateur" ! Libérer l\'imaginaire pour briser la paralysie du stress.',
          neg: 'L\'ordre n\'engendre pas la créativité. Le jeu et l\'hypothèse, si.'
        },
        {
          type: 'Appariement',
          q: 'Reliez chaque technique de créativité à son usage en urgence.',
          options: [
            { left_fr: 'SCAMPER', right_fr: 'Modifier un protocole existant' },
            { left_fr: 'Brainstorming', right_fr: 'Générer un maximum d\'idées' },
            { left_fr: 'Pensée Latérale', right_fr: 'Changer d\'angle de vue' },
            { left_fr: 'Mind Mapping', right_fr: 'Structurer le chaos' }
          ],
          pos: 'Boîte à outils créative validée !',
          neg: 'Révisez vos techniques : SCAMPER est idéal pour adapter l\'existant.'
        },
        {
          type: 'Vrai/Faux',
          q: '« La créativité est un don inné, on ne peut pas l\'apprendre. »',
          correct: 'faux',
          pos: 'Vrai ! C\'est un muscle qui se travaille, surtout dans l\'adversité.',
          neg: 'Tout le monde est créatif. Laâyoune est là pour vous le prouver.'
        },
        {
          type: 'Classement',
          q: 'Classez les étapes du processus de création (Graham Wallas).',
          options: [
            { label_fr: 'Préparation (Étude du problème)' },
            { label_fr: 'Incubation (Lâcher prise)' },
            { label_fr: 'Illumination (L\'idée surgit)' },
            { label_fr: 'Vérification (Test de l\'idée)' }
          ],
          pos: 'Le cycle classique de l\'invention. L\'incubation est souvent la clé.',
          neg: 'N\'oubliez pas l\'incubation. Le cerveau travaille en arrière-plan.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Création d\'un kit de survie "Frugal".',
          options: {
            steps: [
              {
                question: 'Vous avez du sable, des sacs plastiques et du soleil. Comment créer de l\'eau distillée ?',
                responses: [
                  { id: 'A', text: 'On ne peut pas' },
                  { id: 'B', text: 'Utiliser la condensation : trou dans le sable + plante + plastique' }
                ],
                correct: 'B'
              },
              {
                question: 'L\'eau est produite mais elle est tiède. Comment la refroidir sans électricité ?',
                responses: [
                  { id: 'A', text: 'Souffler dessus' },
                  { id: 'B', text: 'Évaporation : envelopper dans un linge humide à l\'ombre' }
                ],
                correct: 'B'
              },
              {
                question: 'Vous avez créé un protocole. Comment le transmettre simplement ?',
                responses: [
                  { id: 'A', text: 'Un rapport de 50 pages' },
                  { id: 'B', text: 'Un dessin (pictogramme) compréhensible par tous' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'Innovation frugale ! "Doing more with less". C\'est l\'esprit de Laâyoune.',
          neg: 'La complexité est l\'ennemie de l\'urgence. Visez la simplicité ingénieuse.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifiez les 3 "tueurs d\'idées" dans une réunion de création.',
          options: [
            { text_fr: '« On a déjà essayé et ça n\'a pas marché »', is_error: true },
            { text_fr: '« C\'est trop cher »', is_error: true },
            { text_fr: '« C\'est pas dans le manuel »', is_error: true },
            { text_fr: '« Et si on essayait de... »', is_error: false }
          ],
          pos: 'La censure est le poison de la création. À Laâyoune, on l\'interdit.',
          neg: 'Ces phrases bloquent l\'innovation. Remplacez-les par "Oui, et...".'
        },
        {
          type: 'Texte à trous',
          q: 'La pensée __________ génère des options, la pensée __________ choisit la meilleure.',
          options: [
            { text: 'divergente' }, { text: 'convergente' }
          ],
          correct: 'divergente, convergente',
          pos: 'Le double diamant de la création ! Ouvrir puis fermer.',
          neg: 'Il faut d\'abord diverger avant de converger.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Besoins vitaux : 10 secondes pour inventer un signal de détresse avec un miroir.',
          options: [
            { id: 'A', label_fr: 'Le casser' },
            { id: 'B', label_fr: 'Utiliser le reflet du soleil vers l\'horizon' },
            { id: 'C', label_fr: 'Se regarder dedans' }
          ],
          correct: 'B',
          pos: 'Héliographe improvisé ! Simple et efficace.',
          neg: 'Le miroir est un outil de com\' longue distance au désert.'
        },
        {
          type: 'Énigme',
          q: '« Je n\'ai pas besoin d\'argent pour exister, juste d\'un problème et d\'un esprit libre. Plus on me partage, plus je grandis. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Le vent' },
            { id: 'B', label_fr: 'L\'idée' },
            { id: 'C', label_fr: 'Le sable' }
          ],
          correct: 'B',
          pos: 'L\'idée est la seule ressource infinie du désert.',
          neg: 'C\'est l\'idée qui transforme le désert en oasis.'
        }
      ]
    },
    {
      id: MISSION_IDS.L2,
      title_fr: 'Mission L2 : Coopérative de Femmes - Créer l\'Impact',
      description_fr: "Mentor: Aminatou. Soft Skill: Travail en équipe (CRÉATION). Inventez de nouveaux modèles de collaboration et de produits.",
      questions: [
        {
          type: 'QCM',
          q: 'La coopérative produit du couscous, mais les ventes stagnent. Quelle approche créative adopter ?',
          options: [
            { id: 'A', label_fr: 'Baisser les prix' },
            { id: 'B', label_fr: 'Design Thinking : Immerger dans le quotidien des clients pour créer un nouveau packaging ou usage' },
            { id: 'C', label_fr: 'Travailler plus' },
            { id: 'D', label_fr: 'Attendre les subventions' }
          ],
          correct: 'B',
          pos: 'L\'empathie est le moteur de la création de valeur. Bien vu.',
          neg: 'Baisser les prix n\'est pas créer. Innover dans l\'usage, si.'
        },
        {
          type: 'Appariement',
          q: 'Reliez le besoin au concept de produit créé.',
          options: [
            { left_fr: 'Cadeau de luxe', right_fr: 'Couscous bio en coffret bois sculpté' },
            { left_fr: 'Snack rapide', right_fr: 'Barre de céréales au amlou' },
            { left_fr: 'Écologie', right_fr: 'Sacs en toile recyclée teints au henné' },
            { left_fr: 'Tourisme', right_fr: 'Atelier "Ma vie de tisseuse" (Expérience)' }
          ],
          pos: 'Diversification créative réussie !',
          neg: 'Pensez à adapter le produit au segment de clientèle.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Une tisseuse propose une idée absurde : "Vendre de l\'air du désert". Comment réagissez-vous ?',
          options: [
            { id: 'A', label_fr: '« C\'est ridicule »' },
            { id: 'B', label_fr: '« Intéressant. Quel sentiment ou souvenir cet air pourrait-il transporter ? »' },
            { id: 'C', label_fr: 'Rire d\'elle' }
          ],
          correct: 'B',
          pos: 'Suspension du jugement ! C\'est ainsi que naissent les concepts marketing (ex: parfums d\'ambiance).',
          neg: 'Ne tuez jamais une idée à sa naissance. Explorez son potentiel.'
        },
        {
          type: 'Classement',
          q: 'Ordre du Design Thinking.',
          options: [
            { label_fr: 'Empathie' },
            { label_fr: 'Définition du problème' },
            { label_fr: 'Idéation' },
            { label_fr: 'Prototypage & Test' }
          ],
          pos: 'La boucle de création centrée utilisateur.',
          neg: 'On ne commence pas par l\'idée, mais par l\'humain.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Dans une coopérative, la création doit être individuelle pour être originale. »',
          correct: 'faux',
          pos: 'Faux ! La co-création (intelligence collective) produit des idées plus riches.',
          neg: 'Le génie solitaire est un mythe. Le groupe est plus créatif.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Création d\'un nouveau modèle de gouvernance.',
          options: {
            steps: [
              {
                question: 'Trop de chefs, personne ne décide. Quel modèle créer ?',
                responses: [
                  { id: 'A', text: 'Un seul chef suprême' },
                  { id: 'B', text: 'Une Holacratie : rôles tournants et autonomie par cercle' }
                ],
                correct: 'B'
              },
              {
                question: 'Le cercle "Création" veut lancer un produit sans l\'avis du cercle "Finance". Risque ?',
                responses: [
                  { id: 'A', text: 'Aucun, c\'est l\'autonomie' },
                  { id: 'B', text: 'Rupture de stock ou faillite. Il faut créer un lien (Double-Link).' }
                ],
                correct: 'B'
              },
              {
                question: 'Comment célébrer les échecs créatifs ?',
                responses: [
                  { id: 'A', text: 'En punissant' },
                  { id: 'B', text: 'En créant le "Mur de l\'Apprentissage" : ce qu\'on a raté et ce qu\'on a appris.' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'Gouvernance innovante ! Vous créez le cadre de la création.',
          neg: 'La dictature tue l\'idée. L\'anarchie la perd. Créez des cercles.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 3 erreurs dans ce prototype de produit.',
          options: [
            { text_fr: 'Packaging non recyclable', is_error: true },
            { text_fr: 'Trop complexe à utiliser seul', is_error: true },
            { text_fr: 'Coût de production > Prix de vente', is_error: true },
            { text_fr: 'Répond à un besoin testé', is_error: false }
          ],
          pos: 'Prototype invalidé. Retour à l\'idéation.',
          neg: 'Un produit doit être viable, désirable et faisable.'
        },
        {
          type: 'Texte à trous',
          q: 'L\'innovation __________ améliore ce qui existe, l\'innovation __________ crée un nouveau marché.',
          options: [
            { text: 'incrémentale' }, { text: 'disruptive' }
          ],
          correct: 'incrémentale, disruptive',
          pos: 'Maîtrise des concepts d\'innovation.',
          neg: 'Incrémentale = petit pas, Disruptive = rupture.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Besoin urgent : 3 noms de marque pour du miel du désert en 15 sec.',
          options: [
            { id: 'A', label_fr: 'Miel 1, Miel 2, Miel 3' },
            { id: 'B', label_fr: 'Or des Dunes, Sahara Nectar, Perle d\'Ambre' },
            { id: 'C', label_fr: 'Sais pas' }
          ],
          correct: 'B',
          pos: 'Évocateur et poétique. La création, c\'est aussi le langage.',
          neg: 'Soyez évocateur. Le nom est l\'âme du produit.'
        },
        {
          type: 'Énigme',
          q: '« Je ne suis pas une usine, pourtant je produis. Je ne suis pas une famille, pourtant je m\'entraide. Je suis le futur de l\'économie sociale. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Une banque' },
            { id: 'B', label_fr: 'Une coopérative créative' },
            { id: 'C', label_fr: 'Une boutique' }
          ],
          correct: 'B',
          pos: 'La coopérative est le terreau de la création collective.',
          neg: 'C\'est l\'union des forces et des idées.'
        }
      ]
    },
    {
      id: MISSION_IDS.L3,
      title_fr: 'Mission L3 : Centre de Santé Nomade - Création Frugale',
      description_fr: "Mentor: Dr. Sarah. Soft Skill: Prise de décision (CRÉATION). Inventez des solutions de santé avec presque rien.",
      questions: [
        {
          type: 'QCM',
          q: 'Pas de réfrigérateur pour les vaccins dans un camp isolé. Que créez-vous ?',
          options: [
            { id: 'A', label_fr: 'Attendre l\'hélicoptère' },
            { id: 'B', label_fr: 'Un frigo "Pot-in-Pot" (Zeer) : deux pots en terre, du sable humide et évaporation.' },
            { id: 'C', label_fr: 'Les mettre au soleil' }
          ],
          correct: 'B',
          pos: 'Jugaad Innovation ! L\'ingéniosité frugale sauve des vies.',
          neg: 'Le désert offre ses propres solutions de froid. Utilisez l\'évaporation.'
        },
        {
          type: 'Appariement',
          q: 'Reliez le déchet à la solution de santé créée.',
          options: [
            { left_fr: 'Bouteille plastique vide', right_fr: 'Attelle de fortune' },
            { left_fr: 'Vieux pneu', right_fr: 'Semelles protectrices pour pieds brûlés' },
            { left_fr: 'Smartphone cassé', right_fr: 'Loupe pour examen cutané' },
            { left_fr: 'Papier journal', right_fr: 'Isolation thermique pour nouveau-né' }
          ],
          pos: 'Recyclage créatif au service de la vie.',
          neg: 'Rien n\'est un déchet, tout est une ressource.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Un chef de tribu refuse le vaccin. Quelle solution créative pour le convaincre ?',
          options: [
            { id: 'A', label_fr: 'Le menacer' },
            { id: 'B', label_fr: 'Créer une cérémonie de "Bénédiction de la Santé" avec lui, intégrant le vaccin.' },
            { id: 'C', label_fr: 'Partir' }
          ],
          correct: 'B',
          pos: 'Syncrétisme créatif. Respecter la culture pour faire passer le progrès.',
          neg: 'La science sans culture est impuissante. Créez un pont.'
        },
        {
          type: 'Classement',
          q: 'Étapes de la "Lean Startup" appliquée à la santé.',
          options: [
            { label_fr: 'Construire (Solution minimum viable)' },
            { label_fr: 'Mesurer (Impact sur les patients)' },
            { label_fr: 'Apprendre (Ce qui marche ou pas)' },
            { label_fr: 'Pivoter ou Persévérer' }
          ],
          pos: 'La méthode agile pour créer des services efficaces.',
          neg: 'Ne construisez pas tout de suite le grand hôpital. Commencez petit.'
        },
        {
          type: 'Vrai/Faux',
          q: '« L\'innovation frugale est une solution de pauvre pour les pauvres. »',
          correct: 'faux',
          pos: 'Faux ! C\'est une stratégie mondiale (Jugaad) pour l\'efficience et l\'écologie.',
          neg: 'C\'est l\'intelligence des ressources, utile partout dans le monde.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Inventer un système de triage en cas d\'afflux.',
          options: {
            steps: [
              {
                question: '50 personnes arrivent. Comment les trier sans matériel ?',
                responses: [
                  { id: 'A', text: 'Au hasard' },
                  { id: 'B', text: 'Système de pierres colorées : Rouge (Vital), Jaune (Urgent), Vert (Stable)' }
                ],
                correct: 'B'
              },
              {
                question: 'Les gens ne comprennent pas les couleurs. Autre idée ?',
                responses: [
                  { id: 'A', text: 'Crier' },
                  { id: 'B', text: 'Utiliser des symboles universels : Main sur le coeur (Rouge), Main levée (Jaune), Assis (Vert)' }
                ],
                correct: 'B'
              },
              {
                question: 'Le système marche. Comment le pérenniser ?',
                responses: [
                  { id: 'A', text: 'Former un membre de chaque tribu' },
                  { id: 'B', text: 'Garder le secret' }
                ],
                correct: 'A'
              }
            ]
          },
          pos: 'Design de service improvisé. Vous créez de l\'ordre dans le chaos.',
          neg: 'La méthode est inutile si elle n\'est pas comprise ou transmise.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 3 erreurs dans cette "Innovation Frugale".',
          options: [
            { text_fr: 'Utilise des piles jetables (difficile à trouver)', is_error: true },
            { text_fr: 'Nécessite une connexion 5G', is_error: true },
            { text_fr: 'Notice uniquement en anglais', is_error: true },
            { text_fr: 'Réparable avec des outils locaux', is_error: false }
          ],
          pos: 'L\'innovation doit être adaptée au terrain (Contextual Design).',
          neg: 'Si c\'est high-tech et non local, ce n\'est pas du Jugaad.'
        },
        {
          type: 'Texte à trous',
          q: 'Le __________ est l\'ennemi de la création, la __________ est sa meilleure alliée.',
          options: [
            { text: 'confort' }, { text: 'contrainte' }
          ],
          correct: 'confort, contrainte',
          pos: 'L\'adage de Léonard de Vinci : "L\'art vit de contraintes et meurt de liberté".',
          neg: 'C\'est parce que c\'est difficile qu\'on devient créatif.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Invention flash : Comment transporter un blessé sans brancard ? (10 sec)',
          options: [
            { id: 'A', label_fr: 'Le traîner' },
            { id: 'B', label_fr: 'Deux bâtons + deux chemises boutonnées' },
            { id: 'C', label_fr: 'Attendre' }
          ],
          correct: 'B',
          pos: 'Ingéniosité de terrain. Bravo.',
          neg: 'Utilisez vos vêtements, ce sont des outils.'
        },
        {
          type: 'Énigme',
          q: '« Je transforme la rareté en abondance et le manque en opportunité. Je suis le génie de ceux qui n\'ont rien mais qui savent tout faire. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Le vol' },
            { id: 'B', label_fr: 'L\'innovation frugale (Jugaad)' },
            { id: 'C', label_fr: 'La magie' }
          ],
          correct: 'B',
          pos: 'Le Jugaad est l\'âme de la survie créative.',
          neg: "C'est l'intelligence appliquée aux ressources limitées."
        }
      ]
    },
    {
      id: MISSION_IDS.L4,
      title_fr: 'Mission L4 : FabLab du Désert - L\'Innovation Systémique',
      description_fr: "Mentor: Karim. Soft Skill: Analyse systémique (CRÉATION). Créez des écosystèmes d'innovation technologique adaptés au Sahara.",
      questions: [
        {
          type: 'QCM',
          q: 'Le FabLab veut créer un drone pour livrer des médicaments. Quel aspect "systémique" créer en premier ?',
          options: [
            { id: 'A', label_fr: 'Le moteur du drone' },
            { id: 'B', label_fr: 'Le réseau de maintenance par les forgerons locaux' },
            { id: 'C', label_fr: 'Le logiciel de vol' },
            { id: 'D', label_fr: 'La couleur du drone' }
          ],
          correct: 'B',
          pos: 'Pensée systémique ! Une techno n\'existe pas seule, elle a besoin d\'un écosystème de soin.',
          neg: 'Le drone ne servira à rien s\'il tombe en panne et que personne ne peut le réparer.'
        },
        {
          type: 'Appariement',
          q: 'Reliez la technologie à son adaptation créative au désert.',
          options: [
            { left_fr: 'Impression 3D', right_fr: 'Utiliser du sable fondu (Sintering)' },
            { left_fr: 'Énergie Solaire', right_fr: 'Panneaux pivotants anti-poussière' },
            { left_fr: 'Internet', right_fr: 'Réseau Mesh entre tentes' },
            { left_fr: 'Robotique', right_fr: 'Nettoyeur de puits autonome' }
          ],
          pos: 'L\'innovation, c\'est adapter la techno à l\'environnement.',
          neg: 'La techno standard échoue souvent au Sahara. Adaptez-la.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Un investisseur dit : "La 3D au désert, c\'est un gadget". Votre argument créatif ?',
          options: [
            { id: 'A', label_fr: '« C\'est cool »' },
            { id: 'B', label_fr: '« C\'est la fin de la dépendance logistique : on imprime la pièce cassée ici, au lieu d\'attendre 1 mois. »' },
            { id: 'C', label_fr: 'Se taire' }
          ],
          correct: 'B',
          pos: 'Vision stratégique. Vous vendez l\'autonomie, pas le gadget.',
          neg: 'L\'innovation, c\'est résoudre un problème de flux et de temps.'
        },
        {
          type: 'Vrai/Faux',
          q: '« L\'innovation systémique signifie qu\'il faut tout changer en même temps. »',
          correct: 'faux',
          pos: 'Faux ! Cela signifie changer un élément en comprenant ses impacts sur tout le reste.',
          neg: 'C\'est la vision des interconnexions, pas le chaos.'
        },
        {
          type: 'Classement',
          q: 'Étapes pour créer un écosystème d\'innovation.',
          options: [
            { label_fr: 'Identifier les acteurs locaux' },
            { label_fr: 'Créer des connexions entre eux' },
            { label_fr: 'Lancer un projet pilote' },
            { label_fr: 'Passer à l\'échelle (Scale-up)' }
          ],
          pos: 'Vous construisez un réseau, pas juste un mur.',
          neg: 'L\'innovation seule meurt. L\'innovation en réseau survit.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Création d\'une monnaie locale pour le FabLab.',
          options: {
            steps: [
              {
                question: 'Les gens n\'ont pas d\'argent pour payer les impressions 3D. Idée ?',
                responses: [
                  { id: 'A', text: 'Leur donner gratuitement' },
                  { id: 'B', text: 'Créer le "Sable-Coin" : monnaie basée sur le temps donné au FabLab' }
                ],
                correct: 'B'
              },
              {
                question: 'Le commerçant refuse le Sable-Coin. Comment créer de la valeur pour lui ?',
                responses: [
                  { id: 'A', text: 'L\'obliger' },
                  { id: 'B', text: 'Le FabLab répare ses machines gratuitement en échange de Sable-Coins' }
                ],
                correct: 'B'
              },
              {
                question: 'L\'écosystème tourne. Quel est le risque systémique ?',
                responses: [
                  { id: 'A', text: 'L\'inflation de Sable-Coins' },
                  { id: 'B', text: 'Que le FabLab ferme' }
                ],
                correct: 'A'
              }
            ]
          },
          pos: 'Ingénierie sociale et économique. Vous créez un système de confiance.',
          neg: 'Tout système a ses limites. Anticipez l\'inflation ou la dépréciation.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 3 erreurs dans cette "Smart City" du désert.',
          options: [
            { text_fr: 'Importation de gazon (consomme trop d\'eau)', is_error: true },
            { text_fr: 'Bâtiments en verre (chauffent trop)', is_error: true },
            { text_fr: 'Dépendance totale au cloud externe', is_error: true },
            { text_fr: 'Architecture bioclimatique en terre', is_error: false }
          ],
          pos: 'L\'innovation idiote (copy-paste de Dubaï) vs Innovation intelligente.',
          neg: 'Copier sans adapter est l\'erreur fatale de la création.'
        },
        {
          type: 'Texte à trous',
          q: 'Le __________ est une solution ponctuelle, le __________ est une solution durable.',
          options: [
            { text: 'pansement' }, { text: 'système' }
          ],
          correct: 'pansement, système',
          pos: 'À Laâyoune, on ne soigne pas les symptômes, on crée des systèmes.',
          neg: 'Visez la racine, pas la surface.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Besoin : Rafraîchir une tente sans clim. 10 sec.',
          options: [
            { id: 'A', label_fr: 'Ouvrir les fenêtres' },
            { id: 'B', label_fr: 'Tour à vent (Malqaf) ou cheminée solaire' },
            { id: 'C', label_fr: 'Mettre des glaçons' }
          ],
          correct: 'B',
          pos: 'Architecture ancestrale redécouverte. Bravo.',
          neg: 'Le vent est votre allié si vous savez le diriger.'
        },
        {
          type: 'Énigme',
          q: '« Je suis la main qui fabrique ce que l\'esprit imagine. Je suis l\'usine du futur dans un garage de sable. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Le FabLab' },
            { id: 'B', label_fr: 'Le rêve' },
            { id: 'C', label_fr: 'La mine' }
          ],
          correct: 'A',
          pos: 'Le FabLab est le coeur battant de la création technologique locale.',
          neg: "C'est là que les idées deviennent des objets."
        }
      ]
    },
    {
      id: MISSION_IDS.L5,
      title_fr: 'Mission L5 : Plan Laâyoune 2030 - La Synthèse Créative',
      description_fr: "Mentor: Le Wali de Laâyoune. Soft Skill: Synthèse (CRÉATION). Concevez le futur de la région.",
      questions: [
        {
          type: 'QCM',
          q: 'On vous demande de créer la "Vision 2030". Quelle est votre posture créative ?',
          options: [
            { id: 'A', label_fr: 'Copier le plan de Casablanca' },
            { id: 'B', label_fr: 'Synthèse : Combiner patrimoine nomade, énergies vertes et hub technologique.' },
            { id: 'C', label_fr: 'Ne rien changer' },
            { id: 'D', label_fr: 'Tout raser pour reconstruire' }
          ],
          correct: 'B',
          pos: 'La création au plus haut niveau : la synthèse harmonieuse de contraires.',
          neg: 'La copie est paresseuse, la destruction est facile. La synthèse est un art.'
        },
        {
          type: 'Classement',
          q: 'Classez les priorités pour un futur durable.',
          options: [
            { label_fr: 'Éducation & Soft Skills' },
            { label_fr: 'Eau & Énergie' },
            { label_fr: 'Infrastructures' },
            { label_fr: 'Loisirs' }
          ],
          pos: 'L\'humain d\'abord. Sans compétences, les murs ne servent à rien.',
          neg: 'Commencez par le socle : l\'humain et les ressources vitales.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Un investisseur veut construire un parc d\'attractions gourmand en eau. Comment lui proposez-vous une alternative créative ?',
          options: [
            { id: 'A', label_fr: 'Refuser net' },
            { id: 'B', label_fr: '« Créons un parc de "Land Art" et d\'astronomie : l\'eau est remplacée par la lumière et le sable. »' },
            { id: 'C', label_fr: 'Accepter' }
          ],
          correct: 'B',
          pos: 'Sublimation du manque ! Vous transformez une faiblesse en un concept unique au monde.',
          neg: 'Ne dites pas non, dites "mieux". Utilisez les atouts du désert.'
        },
        {
          type: 'Appariement',
          q: 'Reliez chaque défi à sa solution créative 2030.',
          options: [
            { left_fr: 'Chômage jeunes', right_fr: 'Académie des métiers du futur (Drones/Solaire)' },
            { left_fr: 'Désertification', right_fr: 'Grande muraille verte + Permaculture' },
            { left_fr: 'Isolement', right_fr: 'Hub logistique maritime et aérien' },
            { left_fr: 'Santé', right_fr: 'Télémédecine et centres nomades high-tech' }
          ],
          pos: 'Vision 2030 cohérente et audacieuse.',
          neg: 'Chaque défi a une réponse dans l\'innovation systémique.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Lancement du Plan Vision 2030.',
          options: {
            steps: [
              {
                question: 'Comment impliquer la population dans la création du plan ?',
                responses: [
                  { id: 'A', text: 'Affichage public' },
                  { id: 'B', text: 'Ateliers de Co-conception dans chaque quartier' }
                ],
                correct: 'B'
              },
              {
                question: 'Une idée géniale sort d\'un enfant de 10 ans. Que faire ?',
                responses: [
                  { id: 'A', text: 'L\'ignorer' },
                  { id: 'B', text: 'L\'intégrer et nommer l\'enfant "Conseiller Junior"' }
                ],
                correct: 'B'
              },
              {
                question: 'Le plan est prêt. Quel est le message final ?',
                responses: [
                  { id: 'A', text: '« Suivez le guide »' },
                  { id: 'B', text: '« Nous sommes les créateurs de notre propre futur. »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'Leadership participatif. Vous créez un mouvement, pas juste un document.',
          neg: 'Le plan appartient à ceux qui le font. Impliquez-les.'
        },
        {
          type: 'Vrai/Faux',
          q: '« La création s\'arrête quand le plan est écrit. »',
          correct: 'faux',
          pos: 'Faux ! L\'exécution est une création continue face aux imprévus.',
          neg: 'Le plan n\'est que le début. La vie est une création permanente.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifiez les 3 erreurs de "Pensée Unique" à éviter.',
          options: [
            { text_fr: '« Il n\'y a qu\'une seule solution »', is_error: true },
            { text_fr: '« C\'est impossible ici »', is_error: true },
            { text_fr: '« On l\'a toujours fait comme ça »', is_error: true },
            { text_fr: '« Explorons d\'autres voies »', is_error: false }
          ],
          pos: 'Vous avez tué les saboteurs de la création. Le désert est libre.',
          neg: 'La pensée unique est le désert de l\'esprit. Fuyez-la.'
        },
        {
          type: 'Texte à trous',
          q: 'À Rabat vous avez __________, à Chefchaouen __________, à Fès __________, à Marrakech __________ et ici vous avez __________. ',
          options: [
            { text: 'découvert' }, { text: 'appliqué' }, { text: 'analysé' }, { text: 'évalué' }, { text: 'créé' }
          ],
          correct: 'découvert, appliqué, analysé, évalué, créé',
          pos: 'Le cycle de Bloom est complet ! Vous êtes un concepteur accompli.',
          neg: 'Révisez votre ascension. Chaque étape était nécessaire.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Le Wali vous demande : "Définissez Laâyoune 2030 en un mot". 5 sec.',
          options: [
            { id: 'A', label_fr: 'Sable' },
            { id: 'B', label_fr: 'Innovation' },
            { id: 'C', label_fr: 'Renaissance' }
          ],
          correct: 'B',
          pos: 'Court, puissant, évocateur. C\'est l\'esprit de la synthèse.',
          neg: 'Un mot doit porter tout un futur.'
        },
        {
          type: 'Énigme',
          q: '« Je suis la fin du voyage pour l\'élève, mais le début pour le maître. Je suis le moment où l\'on cesse de suivre pour commencer à tracer. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La retraite' },
            { id: 'B', label_fr: 'La Création (Maîtrise)' },
            { id: 'C', label_fr: 'Le retour' }
          ],
          correct: 'B',
          pos: 'Félicitations ! Vous avez franchi la Porte du Désert. Direction Dakhla pour la Maîtrise Finale !',
          neg: "C'est l'acte de créer qui fait de vous un leader."
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      challenge_id: LAAYOUNE_CHALLENGE_PK,
      title_fr,
      description_fr,
      xp_reward: 1000,
      sort_order: parseInt(id.slice(-1))
    });

    if (mErr) { console.error(`Error upserting mission ${title_fr}:`, mErr); continue; }
    console.log(`✅ Mission ${title_fr} upserted`);

    // B. Delete existing questions for this mission
    await supabase.from('questions').delete().eq('mission_id', id);

    // C. Insert new questions
    const questionsToInsert = questions.map((q, idx) => {
      const type = TYPE_MAPPING[q.type] || 'qcm';
      const questionData = {
        mission_id: id,
        type,
        question_text_fr: q.q,
        correct_answer: q.correct || null,
        options: q.options || null,
        xp_reward: 100,
        sort_order: idx + 1,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg
      };

      if (type === 'vrai_faux' && !q.options) {
        questionData.options = [
          { id: 'vrai', label_fr: 'VRAI' },
          { id: 'faux', label_fr: 'FAUX' }
        ];
      }

      if (type === 'scenario_cascade') {
        questionData.options = q.options;
      }

      return questionData;
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Error inserting questions for ${title_fr}:`, qErr);
    } else {
      console.log(`✅ 10 questions for ${id}`);
    }
  }

  console.log('🏁 Laâyoune HIGH-FIDELITY import FINISHED!');
}

importLaayoune();
