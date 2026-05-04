const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const RABAT_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440001';
const MISSION_IDS = {
  R1: '550e8400-e29b-41d4-a716-446655440111',
  R2: '550e8400-e29b-41d4-a716-446655440222',
  R3: '550e8400-e29b-41d4-a716-446655440333',
  R4: '550e8400-e29b-41d4-a716-446655440444',
  R5: '550e8400-e29b-41d4-a716-446655440555',
};

const TYPE_MAPPING = {
  'QCM': 'qcm',
  'Vrai/Faux': 'vrai_faux',
  'Appariement': 'matching',
  'Dialogue de situation': 'scenario_dialogue',
  'Texte à trous': 'fill_blanks',
  'Contre-la-montre': 'time_attack',
  'Scénario en cascade': 'scenario_cascade',
  'Détection d’erreurs': 'error_detection',
  'Prise de décision': 'scenario_decision',
  'Énigme': 'puzzle_riddle',
  'Classement': 'ranking',
  'Rôles d’équipe': 'team_roles',
  'Réponse courte': 'short_answer'
};

const RABAT_DATA = {
  city: {
    id: RABAT_CHALLENGE_PK,
    city_id: 'rabat',
    city_name_fr: 'Rabat',
    city_name_ar: 'الرباط',
    headline_fr: 'Réorganisation & Administration',
    description_fr: 'Rabat, capitale administrative et politique, vous plonge dans des contextes professionnels exigeants : urgences médicales, administration publique, recherche universitaire, gestion de crise et gouvernance territoriale.',
    focus_fr: 'Gestion du stress & Décision',
    illustration_url: 'https://images.unsplash.com/photo-1578308838025-d9134a621742?q=80&w=2070&auto=format&fit=crop',
    icon_name: 'building',
    city_color: '#0D9488',
    sort_order: 1,
    is_published: true,
    acte_title: 'ACTE I - RABAT : RÉORGANISATION'
  },
  missions: [
    {
      id: 'R1', title: 'Urgences à l’Hôpital Ibn Sina',
      questions: [
        { type: 'QCM', q: 'C’est ton premier jour de stage. Tu dois présenter dans 5 minutes. Ton cœur bat fort, tu transpires, tes mains tremblent. De quel type de stress s’agit-il ?', options: [{id:'A',label_fr:'Stress chronique'}, {id:'B',label_fr:'Stress aigu'}, {id:'C',label_fr:'Stress positif'}, {id:'D',label_fr:'Pas de stress'}], correct: 'B', pos: 'Bravo ! Stress aigu : court, intense, déclenché par un événement précis.', neg: 'Non. Chronique dure des semaines. Ici c’est bref et intense → stress aigu.' },
        { type: 'Vrai/Faux', q: 'Le stress est toujours mauvais pour la santé.', correct: 'faux', pos: 'Excellent ! Le stress positif motive. Seul le stress chronique est dangereux.', neg: 'Faux. Un athlète avant compétition a du stress qui l’aide à performer.' },
        { type: 'Vrai/Faux', q: 'On peut apprendre à gérer son stress.', correct: 'vrai', pos: 'Parfait ! La gestion du stress est une compétence qui s’apprend.', neg: 'Si ! Pilotes, chirurgiens, sportifs ont appris à gérer le stress.' },
        { type: 'Appariement', q: 'Relie chaque symptôme à sa catégorie : Physique, Émotionnel, Comportemental.', pairs: [{id:'1',left_fr:'Cœur qui bat vite',right_fr:'Physique'},{id:'2',left_fr:'Pleurer facilement',right_fr:'Émotionnel'},{id:'3',left_fr:'Manger trop/pas assez',right_fr:'Comportemental'},{id:'4',left_fr:'Mal de tête',right_fr:'Physique'},{id:'5',left_fr:'Se sentir triste',right_fr:'Émotionnel'},{id:'6',left_fr:'S’isoler',right_fr:'Comportemental'}], pos: 'Parfait ! Tu distingues les trois catégories.', neg: 'Physique = corps, émotionnel = cœur, comportemental = actions.' },
        { type: 'Dialogue de situation', q: 'Une maman paniquée avec son fils qui hurle. Dr. Amina est occupée. Quelle est ta meilleure réaction ?', options: [{id:'A',label_fr:'Je panique aussi'}, {id:'B',label_fr:'« Calmez-vous, ce n’est rien »'}, {id:'C',label_fr:'Je m’approche calmement, m’agenouille et parle doucement'}, {id:'D',label_fr:'Je ne fais rien'}], correct: 'C', pos: 'Bravo ! Corps calme, contact visuel, voix douce = co-régulation.', neg: 'Face au stress, sois calme, valide l’émotion.' },
        { type: 'Texte à trous', q: 'Complète la technique 4-7-8.', options: [{id:'1',text:'inspire'},{id:'2',text:'nez'},{id:'3',text:'4'},{id:'4',text:'bloque'},{id:'5',text:'7'},{id:'6',text:'expire'},{id:'7',text:'bouche'},{id:'8',text:'8'},{id:'9',text:'3 fois'},{id:'10',text:'parasympathique'}], correct: 'inspire, nez, 4, bloque, 7, expire, bouche, 8, 3 fois, parasympathique', pos: 'Parfait ! 4-7-8 maîtrisé.', neg: 'Retiens : 4-7-8. Nez pour inspirer, bouche pour expirer.' },
        { type: 'Contre-la-montre', q: 'Suis le guide visuel pour faire 3 cycles de respiration 4-7-8. Comment te sens-tu ?', options: [{id:'A',label_fr:'Mieux'},{id:'B',label_fr:'Pareil'},{id:'C',label_fr:'Plus calme'},{id:'D',label_fr:'Fatigué'}], correct: 'ANY', pos: 'Bravo d’avoir essayé ! La pratique régulière développe les effets.', neg: 'L’essai est déjà une victoire.' },
        { type: 'Scénario en cascade', q: 'Soutien psychologique', steps: [{question:'Décès grand-mère. PREMIÈRE action ?', responses:[{id:'A',text:'Parler fort'},{id:'B',text:'M’asseoir en silence'}], correct:'B', pos:'Le silence est puissant.', neg:'Trop parler est contre-productif.'},{question:'Il pleure. Que fais-tu ?', responses:[{id:'A',text:'« Ne pleure pas »'},{id:'B',text:'Tendre un mouchoir'}], correct:'B', pos:'Tu respectes son émotion.', neg:'Les larmes aident à évacuer le choc.'},{question:'« Elle était tout pour moi... »', responses:[{id:'A',text:'« C\'est la vie »'},{id:'B',text:'« Raconte-moi si tu veux »'}], correct:'B', pos:'Validation + invitation = soutien.', neg:'Les phrases toutes faites minimisent sa douleur.'}] },
        { type: 'Détection d’erreurs', q: 'Identifie les 5 erreurs dans le planning du Dr. Rachid.', errors: [{id:'1',text_fr:'Pas de pause',is_error:true},{id:'2',text_fr:'Sommeil 4h',is_error:true},{id:'3',text_fr:'Zéro repos',is_error:true},{id:'4',text_fr:'8 cafés/jour',is_error:true},{id:'5',text_fr:'Zéro sport',is_error:true}], pos: 'Excellent ! Tu identifies les 5 causes du burnout.', neg: 'Pause, sommeil, repos, nutrition, loisirs sont essentiels.' },
        { type: 'Énigme', q: '« Je nais dans la poitrine, je grandis dans les pensées… Qui suis-je ? »', options: [{id:'A',label_fr:'La peur'},{id:'B',label_fr:'La fatigue'},{id:'C',label_fr:'Le stress'},{id:'D',label_fr:'La douleur'}], correct: 'C', pos: 'Bravo ! Apprivoisé, il devient force.', neg: 'Indice : cœur qui bat vite, chaleur, mains qui tremblent.' }
      ]
    },
    {
      id: 'R2', title: 'Ministère & Prise de décision',
      questions: [
        { type: 'QCM', q: 'Achat de 50 ordinateurs (500 000 DH). Quel type de décision ?', options: [{id:'A',label_fr:'Opérationnelle'},{id:'B',label_fr:'Tactique'},{id:'C',label_fr:'Stratégique'}], correct: 'B', pos: 'Exact ! Tactique : budget moyen, impact 2-3 ans.', neg: 'Règle : 10K-1M = tactique.' },
        { type: 'Classement', q: 'Classe les 6 étapes de la décision selon Simon.', order: [{id:'1',label_fr:'Identifier le problème'},{id:'2',label_fr:'Collecter les informations'},{id:'3',label_fr:'Générer les options'},{id:'4',label_fr:'Évaluer les options'},{id:'5',label_fr:'Choisir la meilleure'},{id:'6',label_fr:'Agir et suivre'}], pos: 'Parfait ! Processus Simon maîtrisé.', neg: 'Logique : Identifier -> Comprendre -> Explorer -> Choisir -> Agir.' },
        { type: 'Dialogue de situation', q: 'Citoyen furieux : « Ça fait 3 fois que je viens ! » Que fais-tu ?', options: [{id:'A',label_fr:'« Revenez demain »'},{id:'B',label_fr:'S’excuser, écouter, noter, promettre suivi'}], correct: 'B', pos: 'Bravo ! Écoute active et engagement réaliste.', neg: 'Montrer de l’intérêt résout 80% du problème.' },
        { type: 'Vrai/Faux', q: 'Bonnes décisions = rapides.', correct: 'faux', pos: 'Faux. Ralentis pour mieux décider.', neg: 'La précipitation cause 90% des mauvaises décisions.' },
        { type: 'Classement', q: 'Eisenhower : Priorise ces tâches.', order: [{id:'1',label_fr:'Email Ministre (Urgent/Imp)'},{id:'2',label_fr:'Appel journaliste (Urgent)'},{id:'3',label_fr:'Réunion 11h (Imp)'},{id:'4',label_fr:'Réserver salle (Planifier)'},{id:'5',label_fr:'Stocks fournitures'},{id:'6',label_fr:'Màj site web'}], pos: 'Eisenhower maîtrisé !', neg: 'Urgent + Imp = Immédiat.' },
        { type: 'Texte à trous', q: 'Biais cognitifs', options: [{id:'1',text:'ancrage'},{id:'2',text:'première'},{id:'3',text:'confirmation'},{id:'4',text:'disponibilité'},{id:'5',text:'récents'}], correct: 'ancrage, première, confirmation, disponibilité, récents', pos: 'Parfait ! Pièges évités.', neg: 'Ancrage = 1er chiffre, Confirmation = ce qui nous arrange.' },
        { type: 'Scénario en cascade', q: 'Dilemme éthique', steps: [{question:'Erreur Karim (500 DH). Que fais-tu ?', responses:[{id:'A',text:'Signaler chef'},{id:'B',text:'Lui parler D’ABORD'}], correct:'B', pos:'Dialogue privé d\'abord.', neg:'Évite l\'escalade immédiate.'},{question:'Il nie. Que fais-tu ?', responses:[{id:'A',text:'Menacer'},{id:'B',text:'Montrer les preuves'}], correct:'B', pos:'Preuves objectives sans accusation.', neg:'Menacer ne résout rien.'},{question:'Il demande le secret.', responses:[{id:'A',text:'Accepter'},{id:'B',text:'« Veux-tu te dénoncer toi-même ? »'}], correct:'B', pos:'Intégrité exemplaire.', neg:'Cacher est une faute.'}] },
        { type: 'Détection d’erreurs', q: 'Erreurs projet « Digitalisation 2024 »', errors: [{id:'1',text_fr:'Budget 30 min',is_error:true},{id:'2',text_fr:'Pas d\'appel d\'offres',is_error:true},{id:'3',text_fr:'Zéro consultation',is_error:true},{id:'4',text_fr:'Deadline 6 mois',is_error:true},{id:'5',text_fr:'Pas de test pilote',is_error:true}], pos: 'Diagnostic parfait !', neg: 'Oubli du processus Simon.' },
        { type: 'Prise de décision', q: '100 000 DH à dépenser. Formation, Logiciel ou Rénovation ?', options: [{id:'A',label_fr:'Formation'},{id:'B',label_fr:'Logiciel'},{id:'C',label_fr:'Rénovation'},{id:'D',label_fr:'Vote démocratique'}], correct: 'D', pos: 'Leadership participatif !', neg: 'Imposer crée de la résistance.' },
        { type: 'Réponse courte', q: 'Rédige ton plan de décision (Décision, 6 étapes, 1 biais à éviter).', pos: 'Superbe réflexion !', neg: 'Relis la consigne (3 éléments).' }
      ]
    },
    {
      id: 'R3', title: 'Projet à l’Université',
      questions: [
        { type: 'QCM', q: 'Aicha a 10 idées mais ne finit rien. Quel rôle Belbin ?', options: [{id:'A',label_fr:'Leader'},{id:'B',label_fr:'Créatif'},{id:'C',label_fr:'Réalisateur'}], correct: 'B', pos: 'Exact ! Créative génère, Réalisateur exécute.', neg: 'Leader organise, Créatif invente.' },
        { type: 'Rôles d’équipe', q: 'Attribue les rôles Belbin.', options: [{id:'1',text:'Karim -> Analyste'},{id:'2',text:'Sarah -> Harmonisateur'},{id:'3',text:'Omar -> Leader'},{id:'4',text:'Nadia -> Créatif'},{id:'5',text:'Hassan -> Réalisateur'}], correct: 'ALL', pos: 'Équipe complémentaire !', neg: 'Vérifie les spécialités.' },
        { type: 'Dialogue de situation', q: '« Tes idées sont n’importe quoi ! » dit Karim à Nadia. Que fais-tu ?', options: [{id:'A',label_fr:'« Excuse-toi »'},{id:'B',label_fr:'« Peux-tu reformuler techniquement ? »'}], correct: 'B', pos: 'Recadrage sans juger.', neg: 'Ne prends pas parti.' },
        { type: 'Vrai/Faux', q: 'Les meilleures équipes = mêmes profils.', correct: 'faux', pos: 'Faux. Diversité = performance.', neg: 'Homogène = pensée unique.' },
        { type: 'Texte à trous', q: 'CNV : Observation, Sentiment, Besoin, Demande.', options: [{id:'1',text:'Observation'},{id:'2',text:'Sentiment'},{id:'3',text:'Besoin'},{id:'4',text:'Demande'}], correct: 'Observation, Sentiment, Besoin, Demande', pos: 'OSBD maîtrisé !', neg: 'Base de la CNV.' },
        { type: 'Scénario en cascade', q: 'Membre passif (Youssef)', steps: [{question:'Première approche ?', responses:[{id:'A',text:'Critique publique'},{id:'B',text:'Privé avec bienveillance'}], correct:'B', pos:'Dialogue privé.', neg:'Humiliation publique toxique.'},{question:'Il révèle un drame familial.', responses:[{id:'A',text:'« On a tous des soucis »'},{id:'B',text:'« Comment t\'aider ? »'}], correct:'B', pos:'Bienveillance et soutien.', neg:'Culpabiliser détruit la confiance.'},{question:'Que dis-tu à l\'équipe ?', responses:[{id:'A',text:'Toute la vérité'},{id:'B',text:'Difficultés sans détail'}], correct:'B', pos:'Respect de la vie privée.', neg:'Détails inutiles et trahison.'}] },
        { type: 'Classement', q: 'Étapes de Tuckman', order: [{id:'1',label_fr:'Forming'},{id:'2',label_fr:'Storming'},{id:'3',label_fr:'Norming'},{id:'4',label_fr:'Performing'},{id:'5',label_fr:'Adjourning'}], pos: 'Tuckman maîtrisé !', neg: 'Tempête avant Performance.' },
        { type: 'Appariement', q: 'DESC : Décrire, Exprimer, Suggérer, Conséquences.', pairs: [{id:'1',left_fr:'Décris les faits',right_fr:'D'},{id:'2',left_fr:'Exprime ton ressenti',right_fr:'E'},{id:'3',left_fr:'Suggère une solution',right_fr:'S'},{id:'4',left_fr:'Conséquences',right_fr:'C'}], pos: 'Feedback sans conflit.', neg: 'D=Faits, E=Je.' },
        { type: 'Prise de décision', q: 'Attribution T1-T5 aux profils.', options: [{id:'A',label_fr:'Design -> Nadia'},{id:'B',label_fr:'Données -> Karim'},{id:'C',label_fr:'Rapport -> Hassan'},{id:'D',label_fr:'Médiation -> Sarah'},{id:'E',label_fr:'Direction -> Omar'}], correct: 'ALL', pos: 'Attribution optimale !', neg: 'Force de chacun respectée.' },
        { type: 'Énigme', q: '« Seule rien, à deux force, à trois magie... »', options: [{id:'A',label_fr:'La force'},{id:'B',label_fr:'La confiance'},{id:'C',label_fr:'L\'argent'}], correct: 'B', pos: 'Ciment invisible trouvé !', neg: 'Quand je brise, tout s\'effondre.' }
      ]
    },
    {
      id: 'R4', title: 'ONG Espoir Maroc',
      questions: [
        { type: 'QCM', q: '14h/jour, vide émotionnel, perte motivation (>6 mois). Quoi ?', options: [{id:'A',label_fr:'Anxiété'},{id:'B',label_fr:'Burnout'},{id:'C',label_fr:'Dépression'}], correct: 'B', pos: 'Exact ! Épuisement + Perte de sens.', neg: 'Stress aigu est court.' },
        { type: 'Appariement', q: 'Coping : Adaptatif vs Inadaptatif.', pairs: [{id:'1',left_fr:'Parler',right_fr:'Adaptatif'},{id:'2',left_fr:'Alcool',right_fr:'Inadaptatif'},{id:'3',left_fr:'Sport',right_fr:'Adaptatif'},{id:'4',left_fr:'Nier',right_fr:'Inadaptatif'}], pos: 'Adaptatif = affronter.', neg: 'Inadaptatif = fuite.' },
        { type: 'Dialogue de situation', q: 'Annoncer licenciements.', options: [{id:'A',label_fr:'Email générique'},{id:'B',label_fr:'Réunion collective'},{id:'C',label_fr:'Individuel d’abord + Transparence'}], correct: 'C', pos: 'Dignité et transparence.', neg: 'L’email humilie.' },
        { type: 'Scénario en cascade', q: 'Recadrage Salma', steps: [{question:'« J\'ai éCHOUÉ »', responses:[{id:'A',text:'« Non c\'est faux »'},{id:'B',text:'« Apprentissage »'}], correct:'B', pos:'Transformer échec en leçon.', neg:'Déni inefficace.'},{question:'« Je suis NULLE »', responses:[{id:'A',text:'« Tu es géniale »'},{id:'B',text:'« Tu n\'es pas TA performance »'}], correct:'B', pos:'Dissocier personne/action.', neg:'Vague compliment.'},{question:'« J\'ai ruiné leur vie »', responses:[{id:'A',text:'« Tu as offert du travail »'},{id:'B',text:'« C\'est de leur faute »'}], correct:'A', pos:'Restituer les faits positifs.', neg:'Blâme inutile.'}] },
        { type: 'Texte à trous', q: '8 piliers résilience Cyrulnik.', options: [{id:'1',text:'sens'},{id:'2',text:'relations'},{id:'3',text:'humour'},{id:'4',text:'corps'}], correct: 'sens, relations, humour, corps', pos: 'Piliers identifiés !', neg: 'Pourquoi, Qui, Rire, Bouger.' },
        { type: 'Détection d’erreurs', q: 'Erreurs plan urgence Salma.', errors: [{id:'1',text_fr:'Mentir',is_error:true},{id:'2',text_fr:'16h/jour',is_error:true},{id:'3',text_fr:'Baisse 50% unilatérale',is_error:true}], pos: 'Diagnostic parfait !', neg: 'Classiques de crise.' },
        { type: 'Prise de décision', q: 'Budget -60%. Quelle stratégie ?', options: [{id:'A',label_fr:'Fermer'},{id:'B',label_fr:'Pivot stratégique (Recentrage)'}], correct: 'B', pos: 'Recentrage = survie.', neg: 'Fermer est trop radical.' },
        { type: 'Réponse courte', q: 'Rédige le message de restructuration.', pos: 'Leadership exemplaire !', neg: 'Il manque l’empathie/vision.' },
        { type: 'Énigme', q: '« Plus forte cassée et reconstruite... »', options: [{id:'A',label_fr:'La patience'},{id:'B',label_fr:'La résilience'}], correct: 'B', pos: 'Naît de l\'adversité !', neg: 'Se relever après la chute.' },
        { type: 'QCM', q: 'Respiration anti-stress Weil ?', options: [{id:'A',label_fr:'5-5-5'},{id:'B',label_fr:'4-7-8'}], correct: 'B', pos: '4-7-8 maîtrisé.', neg: '4 calme, 7 tient, 8 lâche.' }
      ]
    },
    {
      id: 'R5', title: 'Grand Défi – Wilaya',
      questions: [
        { type: 'Prise de décision', q: 'Crise : 200 blessés. 1ère action ?', options: [{id:'A',label_fr:'Interview'},{id:'B',label_fr:'Plus de médecins (Vies)'}], correct: 'B', pos: 'Priorité correcte ! Sauver avant tout.', neg: 'Vies > Communication.' },
        { type: 'Rôles d’équipe', q: 'Attribution cellule de crise.', options: [{id:'1',text:'Fatima -> Chef'},{id:'2',text:'Hassan -> Police'},{id:'3',text:'Sarah -> Com'},{id:'4',text:'Imam -> Empathie'}], correct: 'ALL', pos: 'Cellule optimale !', neg: 'Spécialités respectées.' },
        { type: 'Scénario en cascade', q: 'Com Médias', steps: [{question:'Premier message ?', responses:[{id:'A',text:'« Pas de détails »'},{id:'B',text:'« Savoir, Chercher, Faire »'}], correct:'B', pos:'Transparence et structure.', neg:'Sois factuel.'},{question:'« Combien de morts ? »', responses:[{id:'A',text:'« Beaucoup »'},{id:'B',text:'« 3 confirmés + compassion »'}], correct:'B', pos:'Factuel + Empathique.', neg:'Donne les chiffres avec humanité.'},{question:'« C\'est votre faute ! »', responses:[{id:'A',text:'« La vôtre aussi »'},{id:'B',text:'« Colère comprise + Enquête »'}], correct:'B', pos:'Professionnalisme parfait.', neg:'Recentrage sur l\'action.'}] },
        { type: 'Détection d’erreurs', q: 'Erreurs rapport analyse.', errors: [{id:'1',text_fr:'Accusations sans preuve',is_error:true},{id:'2',text_fr:'Sur-promesse 24h',is_error:true},{id:'3',text_fr:'100% Homme',is_error:true}], pos: 'Vigilance pro !', neg: 'Pièges classiques.' },
        { type: 'QCM', q: 'Agent paniqué : « Je fais quoi ? »', options: [{id:'A',label_fr:'« Respire (4-7-8) »'},{id:'B',label_fr:'« Travaille plus »'}], correct: 'A', pos: 'Calme avant tout.', neg: 'D\'abord respirer.' },
        { type: 'Vrai/Faux', q: 'Sarah a fait une gaffe. On la vire ?', correct: 'faux', pos: 'Apprentissage collectif.', neg: 'L\'erreur est une opportunité.' },
        { type: 'Vrai/Faux', q: 'Fatigue 18h. Décision ?', correct: 'faux', pos: 'Dormir d\'abord.', neg: 'La fatigue tue la qualité.' },
        { type: 'Appariement', q: 'Autodétermination (SDT).', pairs: [{id:'1',left_fr:'Liberté',right_fr:'Autonomie'},{id:'2',left_fr:'Expertise',right_fr:'Compétence'},{id:'3',left_fr:'Repas',right_fr:'Affiliation'}], pos: 'Motivation intrinsèque !', neg: 'Liberté/Reconnaissance/Lien.' },
        { type: 'Scénario en cascade', q: 'Conseil Ministre', steps: [{question:'Cacher identité ?', responses:[{id:'A',text:'Obéir'},{id:'B',text:'Dialogue d\'abord'}], correct:'B', pos:'Tenter le dialogue.', neg:'Pas d\'obéissance aveugle.'},{question:'Il menace.', responses:[{id:'A',text:'Céder'},{id:'B',text:'Expliquer risques dissimulation'}], correct:'B', pos:'Argument stratégique.', neg:'Cacher est plus risqué.'},{question:'Il reste ferme.', responses:[{id:'A',text:'Fuir'},{id:'B',text:'Vérité publique'}], correct:'B', pos:'Intégrité absolue.', neg:'La vérité avant tout.'}] },
        { type: 'Énigme', q: '« Équilibre Tête, Cœur et Mains... »', options: [{id:'A',label_fr:'Le pouvoir'},{id:'B',label_fr:'La sagesse'}], correct: 'B', pos: 'Équilibre trouvé !', neg: 'Rationnel + Empathie + Action.' }
      ]
    }
  ]
}

async function importRabat() {
  console.log('🚀 Starting Rabat FINAL import...')
  
  // 1. City
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(RABAT_DATA.city)
  if (cityErr) console.error('City error:', cityErr)
  else console.log('✅ City Rabat upserted')

  for (const mission of RABAT_DATA.missions) {
    const missionId = MISSION_IDS[mission.id]
    
    // 2. Mission
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: RABAT_CHALLENGE_PK,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: RABAT_CHALLENGE_PK
      })
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr)
    else console.log(`✅ Mission ${mission.id} upserted`)

    // 3. Questions
    await supabase.from('questions').delete().eq('mission_id', missionId)

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'Appariement') optionsData = q.pairs;
      else if (q.type === 'Scénario en cascade') optionsData = { steps: q.steps };
      else if (q.type === 'Détection d’erreurs') optionsData = q.errors;
      else if (q.type === 'Classement') optionsData = q.order;
      
      const dbType = TYPE_MAPPING[q.type] || q.type;

      return {
        mission_id: missionId,
        question_fr: q.q,
        question_type: dbType,
        options: optionsData,
        correct_answer: q.correct,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg,
        explanation_fr: q.pos,
        sort_order: i + 1,
        xp_reward: 50,
        is_published: true,
        time_limit_sec: 45
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert)
    if (qErr) {
      console.error(`Questions Mission ${mission.id} error:`, qErr);
      for (let j = 0; j < questionsToInsert.length; j++) {
        const { error: sErr } = await supabase.from('questions').insert(questionsToInsert[j]);
        if (sErr) console.error(`Culprit Q${j+1}: type=${questionsToInsert[j].question_type}`, sErr);
      }
    } else {
      console.log(`✅ ${mission.questions.length} questions inserted for ${mission.id}`)
    }
  }
}

importRabat()
