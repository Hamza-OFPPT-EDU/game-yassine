const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const MARRAKECH_CHALLENGE_PK = '98b50e2ddc9943efb387052637738f64';

const MISSION_IDS = {
  M1: '98b50e2d-dc99-43ef-b387-052637738a01',
  M2: '98b50e2d-dc99-43ef-b387-052637738a02',
  M3: '98b50e2d-dc99-43ef-b387-052637738a03',
  M4: '98b50e2d-dc99-43ef-b387-052637738a04',
  M5: '98b50e2d-dc99-43ef-b387-052637738a05'
};

const TYPE_MAPPING = {
  'QCM': 'qcm',
  'Scénario en cascade': 'scenario_cascade',
  'Rôles d’équipe': 'team_roles',
  'Texte à trous': 'fill_blanks',
  'Dialogue de situation': 'scenario_dialogue',
  'Détection d’erreurs': 'error_detection',
  'Contre-la-montre': 'time_attack',
  'Classement': 'ranking',
  'Réponse courte': 'short_answer',
  'Énigme': 'puzzle_riddle',
  'Vrai/Faux': 'vrai_faux'
};

const MARRAKECH_DATA = {
  city: {
    id: MARRAKECH_CHALLENGE_PK,
    city_id: 'marrakech',
    city_name_fr: 'Marrakech',
    city_name_ar: 'مراكش',
    headline_fr: 'La Perle du Sud - Évaluation',
    description_fr: 'Marrakech, ville du business et du tourisme, vous invite à évaluer : juger la qualité des décisions, critiquer avec des arguments solides.',
    focus_fr: 'Évaluation & Jugement',
    illustration_url: 'https://images.unsplash.com/photo-1597212618440-806262de474b?q=80&w=2000&auto=format&fit=crop',
    icon_name: 'palmtree',
    city_color: '#e11d48',
    sort_order: 4,
    is_published: true
  },
  missions: [
    {
      id: 'M1', title: 'M1 - Startup Tech',
      questions: [
        { type: 'QCM', q: 'Analysez ce pitch : "Thé sans eau". Quelle évaluation ?', options: [{id:'A',label_fr:'Génial'},{id:'B',label_fr:'Incohérent'},{id:'C',label_fr:'À creuser'}], correct:'B', pos:'Jugement lucide.', neg:'L’incohérence prime.' },
        { type: 'Vrai/Faux', q: 'Un bon juge doit être neutre.', correct: 'vrai', pos: 'L’impartialité est clé.', neg: 'Le biais fausse l’évaluation.' },
        { type: 'Classement', q: 'Priorités d’un investisseur.', order: [{id:'1',label_fr:'L’équipe'},{id:'2',label_fr:'Le marché'},{id:'3',label_fr:'Le produit'}], pos: 'L’humain d’abord.' },
        { type: 'Dialogue de situation', q: 'Réfuter un argument faible.', options: [{id:'A',label_fr:'« Nul »'},{id:'B',label_fr:'« Tes chiffres oublient le coût d’acquisition. »'}], correct:'B' },
        { type: 'Détection d’erreurs', q: 'Erreurs business plan.', errors: [{id:'1',text_fr:'Pas de concurrence',is_error:true},{id:'2',text_fr:'Croissance 1000%/mois',is_error:true}], pos: 'Vigilance critique.' },
        { type: 'Texte à trous', q: 'Indicateurs de performance (KPI).', options: [{id:'1',text:'ROI'},{id:'2',text:'Marge'},{id:'3',text:'CAC'}], correct: 'ROI, Marge, CAC' },
        { type: 'Scénario en cascade', q: 'Évaluation d’un pivot', steps: [{question:'Le produit ne se vend pas. Que fais-tu ?', responses:[{id:'A',text:'Insister'},{id:'B',text:'Analyser les retours clients'}], correct:'B'}] },
        { type: 'Contre-la-montre', q: '4 décisions flash business.', steps: [{question:'Investir ?', responses:[{id:'A',text:'Oui'},{id:'B',text:'Non'}], correct:'B'}] },
        { type: 'Réponse courte', q: 'Synthèse d’audit en 3 points.', pos: 'Clarté de jugement.' },
        { type: 'Énigme', q: '« Je pèse le pour et le contre mais n’ai pas de balance... »', correct: 'Le jugement' }
      ]
    },
    {
      id: 'M2', title: 'M2 - Riad de luxe',
      questions: [
        { type: 'QCM', q: 'Client japonais mécontent. Pourquoi ?', options: [{id:'A',label_fr:'Bruit'},{id:'B',label_fr:'Manque de ponctualité'},{id:'C',label_fr:'Pas de sushi'}], correct:'B' },
        { type: 'Rôles d’équipe', q: 'Équipe interculturelle.', options: [{id:'1',text:'Réception -> Polyglotte'},{id:'2',text:'Cuisine -> Traditionnel'}], correct:'ALL' },
        { type: 'Dialogue de situation', q: 'Gérer un malentendu culturel.', options: [{id:'A',label_fr:'Crier'},{id:'B',label_fr:'Observer, écouter, reformuler.'}], correct:'B' },
        { type: 'Vrai/Faux', q: 'La culture n’influence pas le stress.', correct: 'faux' },
        { type: 'Classement', q: 'Priorités accueil VIP.', order: [{id:'1',label_fr:'Sourire'},{id:'2',label_fr:'Bagages'},{id:'3',label_fr:'Thé'}], pos: 'L’hospitalité marocaine.' },
        { type: 'Détection d’erreurs', q: 'Fautes d’étiquette.', errors: [{id:'1',text_fr:'Tutoyer le client',is_error:true}], pos: 'Respect des codes.' },
        { type: 'Texte à trous', q: 'Valeurs du service de luxe.', options: [{id:'1',text:'Discrétion'},{id:'2',text:'Anticipation'}], correct: 'Discrétion, Anticipation' },
        { type: 'Scénario en cascade', q: 'Plainte client', steps: [{question:'Le client hurle. Action ?', responses:[{id:'A',text:'Crier aussi'},{id:'B',text:'L’isoler et l’écouter'}], correct:'B'}] },
        { type: 'Réponse courte', q: 'Amélioration service client.', pos: 'Jugement argumenté.' },
        { type: 'Énigme', q: '« Je suis la maison dans la maison, avec un arbre au milieu... »', correct: 'Le Riad' }
      ]
    },
    {
       id: 'M3', title: 'M3 - Souk Semmarine',
       questions: [
         { type: 'QCM', q: 'Négocier 100 tapis. Prix cible ?', options: [{id:'A',label_fr:'Prix affiché'},{id:'B',label_fr:'Prix coûtant + marge raisonnable'}], correct:'B' },
         { type: 'Dialogue de situation', q: 'Technique du "bon et du mauvais flic".', options: [{id:'A',label_fr:'C’est nul'},{id:'B',label_fr:'À utiliser avec parcimonie.'}], correct:'B' },
         { type: 'Classement', q: 'Étapes négociation.', order: [{id:'1',label_fr:'Préparation'},{id:'2',label_fr:'Échange'},{id:'3',label_fr:'Accord'}], pos: 'Méthode Harvard.' },
         { type: 'Vrai/Faux', q: 'Négocier = écraser l’autre.', correct: 'faux' },
         { type: 'Détection d’erreurs', q: 'Erreurs de négociation.', errors: [{id:'1',text_fr:'Parler trop',is_error:true}], pos: 'Écoute active.' },
         { type: 'Texte à trous', q: 'BATNA / MESORE.', options: [{id:'1',text:'Alternative'},{id:'2',text:'Solution'}], correct: 'Alternative, Solution' },
         { type: 'Scénario en cascade', q: 'Gros contrat', steps: [{question:'Le prix est bloqué. Que négocier ?', responses:[{id:'A',text:'Rien'},{id:'B',text:'Délais, transport, qualité.'}], correct:'B'}] },
         { type: 'Contre-la-montre', q: 'Vendre un objet inutile.', steps: [{question:'Argument ?', responses:[{id:'A',text:'C’est pas cher'},{id:'B',text:'C’est une pièce unique chargée d’histoire.'}], correct:'B'}] },
         { type: 'Réponse courte', q: 'Plan de négociation.', pos: 'Stratégie solide.' },
         { type: 'Énigme', q: '« Plus on me tire, plus je grandis entre deux personnes... »', correct: 'Le compromis' }
       ]
    },
    {
       id: 'M4', title: 'M4 - Événementiel',
       questions: [
         { type: 'QCM', q: 'Retard du traiteur (200 convives). Action ?', options: [{id:'A',label_fr:'Annuler'},{id:'B',label_fr:'Divertissement + Boissons + Solution B'}], correct:'B' },
         { type: 'Dialogue de situation', q: 'Annoncer un retard.', options: [{id:'A',label_fr:'Cacher'},{id:'B',label_fr:'S’excuser + Nouvelle heure + Compensation.'}], correct:'B' },
         { type: 'Détection d’erreurs', q: 'Filles plan sécurité.', errors: [{id:'1',text_fr:'Une seule issue',is_error:true}], pos: 'Vigilance maximale.' },
         { type: 'Classement', q: 'Priorités logistiques.', order: [{id:'1',label_fr:'Sécurité'},{id:'2',label_fr:'Son'},{id:'3',label_fr:'Buffet'}], pos: 'Sécurité d’abord.' },
         { type: 'Texte à trous', q: 'Gestion du stress événementiel.', options: [{id:'1',text:'Anticipation'},{id:'2',text:'Délégation'}], correct: 'Anticipation, Delegation' },
         { type: 'Scénario en cascade', q: 'Coupure électricité', steps: [{question:'Noir total. 1ère action ?', responses:[{id:'A',text:'Crier'},{id:'B',text:'Lampes secours + message rassurant.'}], correct:'B'}] },
         { type: 'Contre-la-montre', q: 'Placer les invités.', steps: [{question:'Protocole ?', responses:[{id:'A',text:'Au hasard'},{id:'B',text:'Par rang et importance.'}], correct:'B'}] },
         { type: 'Vrai/Faux', q: 'L’imprévu est prévisible.', correct: 'vrai' },
         { type: 'Réponse courte', q: 'Rapport post-événement.', pos: 'Analyse critique.' },
         { type: 'Énigme', q: '« Je commence avant et finis après la fête... »', correct: 'L’organisation' }
       ]
    },
    {
       id: 'M5', title: 'M5 - Sommet International',
       questions: [
         { type: 'QCM', q: 'Évaluer le succès du sommet.', options: [{id:'A',label_fr:'Nombre de photos'},{id:'B',label_fr:'Accords signés + satisfaction + budget tenu.'}], correct:'B' },
         { type: 'Classement', q: 'Critères d’évaluation Bloom.', order: [{id:'1',label_fr:'Connaissance'},{id:'2',label_fr:'Évaluation'}], pos: 'Niveau IV atteint.' },
         { type: 'Dialogue de situation', q: 'Argumenter contre une mauvaise décision.', options: [{id:'A',label_fr:'« Vous avez tort »'},{id:'B',label_fr:'« Si on suit ce plan, le risque X augmente de 30%. »'}], correct:'B' },
         { type: 'Scénario en cascade', q: 'Synthèse finale', steps: [{question:'Quel est le soft skill de Marrakech ?', responses:[{id:'A',text:'Stress'},{id:'B',text:'Évaluation'}], correct:'B'}] },
         { type: 'Vrai/Faux', q: 'L’évaluation clôture le cycle.', correct: 'faux', pos: 'Elle prépare la création.' },
         { type: 'Détection d’erreurs', q: 'Erreurs de jugement.', errors: [{id:'1',text_fr:'Juger sans preuves',is_error:true}], pos: 'Rigueur.' },
         { type: 'Texte à trous', q: 'Le jugement éclairé.', options: [{id:'1',text:'Critères'},{id:'2',text:'Preuves'}], correct: 'Critères, Preuves' },
         { type: 'Contre-la-montre', q: 'Voter pour le meilleur projet.', steps: [{question:'Critère ?', responses:[{id:'A',text:'Le plus beau'},{id:'B',text:'Le plus viable et utile.'}], correct:'B'}] },
         { type: 'Réponse courte', q: 'Auto-évaluation du voyage.', pos: 'Méta-cognition.' },
         { type: 'Énigme', q: '« Je suis le point final avant la page blanche... »', correct: 'L’évaluation' }
       ]
    }
  ]
};

async function importMarrakech() {
  console.log('🚀 Starting Marrakech FINAL import...');
  const { error: cityErr } = await supabase.from('challenges').upsert(MARRAKECH_DATA.city);
  if (cityErr) return console.error('❌ City Error:', cityErr);
  console.log('✅ City Marrakech Upserted');

  for (const mData of MARRAKECH_DATA.missions) {
    const missionId = MISSION_IDS[mData.id];
    await supabase.from('missions').upsert({
      id: missionId, city_id: MARRAKECH_CHALLENGE_PK, challenge_id: MARRAKECH_CHALLENGE_PK,
      title_fr: mData.title, sort_order: parseInt(mData.id.substring(1)),
      mission_type: 'scenario', xp_reward: 100, is_published: true
    });
    console.log(`✅ Mission ${mData.id} Upserted`);
    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = mData.questions.map((q, i) => {
      let opts = q.options;
      if (q.type === 'Scénario en cascade' || q.type === 'Contre-la-montre') opts = { steps: q.steps };
      else if (q.type === 'Détection d’erreurs') opts = q.errors;
      else if (q.type === 'Classement') opts = q.order;
      else if (q.type === 'Rôles d’équipe') opts = q.options;

      return {
        mission_id: missionId, question_fr: q.q, question_type: TYPE_MAPPING[q.type] || 'qcm',
        options: opts, correct_answer: q.correct || '',
        feedback_positive_fr: q.pos || 'Excellent !',
        feedback_negative_fr: q.neg || 'Réessayez.',
        sort_order: i + 1, xp_reward: 20, is_published: true, time_limit_sec: 45
      };
    });
    await supabase.from('questions').insert(questionsToInsert);
    console.log(`✅ ${questionsToInsert.length} questions for ${mData.id}`);
  }
}
importMarrakech();
