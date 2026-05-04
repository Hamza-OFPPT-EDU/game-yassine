require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DAKHLA_CHALLENGE_PK = '98b50e2ddc9943efb387052637738f66';

const MISSION_IDS = {
  D1: '98b50e2d-dc99-43ef-b387-052637738d01',
  D2: '98b50e2d-dc99-43ef-b387-052637738d02',
  D3: '98b50e2d-dc99-43ef-b387-052637738d03',
  D4: '98b50e2d-dc99-43ef-b387-052637738d04',
  D5: '98b50e2d-dc99-43ef-b387-052637738d05'
};

const TYPE_MAPPING = {
  'QCM': 'qcm',
  'QCM de maîtrise': 'qcm',
  'QCM maîtrise': 'qcm',
  'Appariement': 'matching',
  'Dialogue de situation': 'scenario_dialogue',
  'Dialogue de maîtrise': 'scenario_dialogue',
  'Dialogue final': 'scenario_dialogue',
  'Texte à trous': 'fill_blanks',
  'Texte à trous (création)': 'fill_blanks',
  'Vrai/Faux': 'vrai_faux',
  'Contre-la-montre': 'time_attack',
  'Contre-la-montre (QCM)': 'time_attack',
  'Contre-la-montre ultime': 'time_attack',
  'Scénario en cascade': 'scenario_cascade',
  'Détection d’erreurs': 'error_detection',
  'Détection d’erreurs instantanée': 'error_detection',
  'Détection + création': 'error_detection',
  'Classement': 'ranking',
  'Énigme': 'puzzle_riddle',
  'Énigme ultime': 'puzzle_riddle',
  'Rôles d’équipe': 'team_roles',
  'Prise de décision': 'scenario_decision',
  'Prise de décision créative': 'scenario_decision',
  'Situation immersive': 'scenario_decision',
  'Réponse courte': 'short_answer',
  'Création (réponse longue)': 'short_answer',
  'Création synthétique': 'short_answer',
  'Dialogue': 'scenario_dialogue'
};

const DAKHLA_DATA = {
  city: {
    id: DAKHLA_CHALLENGE_PK,
    city_id: 'dakhla',
    city_name_fr: 'Dakhla',
    city_name_ar: 'الداخلة',
    headline_fr: 'La Lagune Bleue',
    description_fr: 'Dakhla, perle de l’Atlantique, est l’ultime étape du voyage. Ici, vous ne découvrirez pas de nouveaux concepts : vous maîtriserez tous ceux que vous avez appris. La maîtrise, c’est agir avec fluidité et intuition, sans protocole, parce que les compétences sont devenues naturelles.',
    focus_fr: 'Maîtrise & Synthèse Holistique',
    illustration_url: 'https://images.unsplash.com/photo-1549213821-4708d624e1d1?q=80&w=2070&auto=format&fit=crop',
    icon_name: 'waves',
    city_color: '#0ea5e9',
    sort_order: 6,
    is_published: true,
    acte_title: 'ACTE VI - DAKHLA : MAÎTRISE'
  },
  missions: [
    {
      id: 'D1', title: 'Le Port de Pêche',
      questions: [
        { type: 'Situation immersive', q: 'Tempête soudaine, moteur tousse, 4 pêcheurs paniquent. En 30 secondes, que faites-vous ?', options: [{id:'A',label_fr:'Crier'}, {id:'B',label_fr:'Prendre la barre, donner 3 ordres clairs, respirer 4-7-8.'}], correct: 'B', pos: 'Maîtrise absolue ! Calme, ordres, respiration intégrée.', neg: 'Paniquer aggrave la tempête.' },
        { type: 'Scénario en cascade', q: 'Naufrage imminent', steps: [{question:'3 gilets pour 5. Action ?', responses:[{id:'A',text:'Tous'},{id:'B',text:'3 moins bons nageurs = gilets. Moi et le meilleur nageur sans.'}], correct:'B', pos:'Triage immédiat et lucide.', neg:'Paniquer ne sauve personne.'},{question:'Moral équipe ?', responses:[{id:'A',text:'Rien'},{id:'B',text:'« On va s’en sortir. Racontez votre meilleur souvenir. »'}], correct:'B', pos:'Soutien psy et cohésion.', neg:'L’espoir est vital.'}] },
        { type: 'Rôles d’équipe', q: 'Attribuez 5 rôles en 2 minutes.', options: [{left_fr:'Capitaine',right_fr:'Leadership'},{left_fr:'Météo',right_fr:'Analyste'},{left_fr:'Médiateur',right_fr:'Harmonisateur'}], pos: 'Attribution instinctive juste.', neg: 'Maîtrise Belbin.' },
        { type: 'Texte à trous', q: 'Maximes de sagesse maritime', options: [{id:'1',text:'marin'},{id:'2',text:'peurs'},{id:'3',text:'horizon'}], correct: 'marin, peurs, horizon', pos: 'Sagesse profonde née de l’expérience.', neg: 'Philosophie du maître.' },
        { type: 'Dialogue de situation', q: 'Conflit marins (« Tu m’as volé ! »). Réponse ?', options: [{id:'A',label_fr:'Long discours'}, {id:'B',label_fr:'« Stop. On respire. Chacun raconte, puis on partage la prise. »'}], correct: 'B', pos: 'CNV incarnée : fluide et efficace.', neg: 'Soyez calme et ferme.' },
        { type: 'Détection d’erreurs', q: 'Audit Plan Sécurité. Erreurs ?', errors: [{id:'1',text_fr:'Gilets non vérifiés',is_error:true},{id:'2',text_fr:'Pas de radio secours',is_error:true},{id:'3',text_fr:'Zéro formation',is_error:true}], pos: 'Failles détectées et corrigées mentalement.', neg: 'La sécurité est un réflexe.' },
        { type: 'Contre-la-montre', q: 'Urgences mer', steps: [{question:'Homme à la mer. Action ?', responses:[{id:'A',text:'Plonger'},{id:'B',text:'Lancer bouée, guetteur, approche lente.'}], correct:'B', pos:'Réflexe : bouée, guetteur, approche.', neg:'Plonger est risqué.'},{question:'Moteur en feu. Action ?', responses:[{id:'A',text:'Eau'},{id:'B',text:'Couper essence, couverture, extincteur.'}], correct:'B', pos:'Bon ordre d’extinction.', neg:'L’eau sur essence = explosion.'}] },
        { type: 'Classement', q: 'Priorités survie maritime', order: [{id:'1',label_fr:'Gilet'},{id:'2',label_fr:'Eau'},{id:'3',label_fr:'Radio'},{id:'4',label_fr:'Nourriture'}], pos: 'Classement de marin chevronné.', neg: 'L’eau avant tout.' },
        { type: 'Réponse courte', q: 'Rapport d’incident synthétique (150 mots).', pos: 'Factuel, analytique et professionnel.', neg: 'Analysez les causes racines.' },
        { type: 'Énigme', q: '« Je m’incline pour ne pas casser… Capitaine Aziz est mon visage. »', options: [{id:'A',label_fr:'La force'},{id:'B',label_fr:'La Maîtrise (Sagesse)'}], correct: 'B', pos: 'Félicitations ! Vous êtes un Maître.', neg: 'Indice : Le but ultime.' }
      ]
    },
    {
      id: 'D2', title: 'Biologie Marine – Systémique',
      questions: [
        { type: 'QCM maîtrise', q: 'Poissons chutent. Cause racine ?', options: [{id:'A',label_fr:'Surchauffe'}, {id:'B',label_fr:'Baisse du phytoplancton (base)'}], correct: 'B', pos: 'Pensée systémique : tout part de la base.', neg: 'Cherchez la source.' },
        { type: 'Scénario en cascade', q: 'Marée verte', steps: [{question:'Diagnostic 3Q ?', responses:[{id:'A',text:'Vagues'},{id:'B',text:'Origine? Concentration? Dynamique?'}], correct:'B', pos:'Diagnostic systémique efficace.', neg:'Source + Mesure + Tendance.'},{question:'Solutions ?', responses:[{id:'A',text:'Palliative'},{id:'B',text:'Filtres source + Valorisation biogaz.'}], correct:'B', pos:'Actions sur cause et effet.', neg:'Solution double.'}] },
        { type: 'Détection d’erreurs', q: 'Boucles Tourisme Masse', errors: [{id:'1',text_fr:'Plus touristes → dégradation → moins touristes',is_error:true},{id:'2',text_fr:'Béton → moins d’attrait',is_error:true},{id:'3',text_fr:'Bruit → départ faune',is_error:true}], pos: 'Boucles de rétroaction identifiées.', neg: 'Vision à long terme.' },
        { type: 'Texte à trous', q: 'Chaîne Lagune', options: [{id:'1',text:'phytoplancton'},{id:'2',text:'poissons'},{id:'3',text:'oiseaux'}], correct: 'phytoplancton, poissons, oiseaux', pos: 'Lecture de boucle maîtrisée.', neg: 'Interdépendances.' },
        { type: 'Dialogue', q: 'Négo Promoteur Hôtel. Argument ?', options: [{id:'A',label_fr:'Refus'}, {id:'B',label_fr:'« Éco-conception + 5% fonds lagune. Gagnant-gagnant. »'}], correct: 'B', pos: 'Intégration des intérêts.', neg: 'Sortez du binaire.' },
        { type: 'Contre-la-montre', q: 'Flash Écosystème', steps: [{question:'Dune recule. Cause ?', responses:[{id:'A',text:'Mer'},{id:'B',text:'Disparition plantes fixatrices.'}], correct:'B', pos:'Cause profonde identifiée.', neg:'Regardez la fixation.'},{question:'Oiseaux disparus. Cause ?', responses:[{id:'A',text:'Morts'},{id:'B',text:'Disparition des proies (pesticides).'}], correct:'B', pos:'Maillon milieu de chaîne.', neg:'L’oiseau est un signal.'}] },
        { type: 'Classement', q: 'Facteurs Résilience', order: [{id:'1',label_fr:'Diversité'},{id:'2',label_fr:'Connectivité'},{id:'3',label_fr:'Redondance'},{id:'4',label_fr:'Taille'}], pos: 'Diversité = Assurance-vie de la nature.', neg: 'Le système est divers.' },
        { type: 'Réponse courte', q: 'Plan de restauration systémique (150 mots).', pos: 'Intégré et multi-causes.', neg: 'Pensez global.' },
        { type: 'Énigme', q: '« Je ne vois pas l’arbre, je vois la forêt… »', options: [{id:'A',label_fr:'La vue'},{id:'B',label_fr:'La Pensée Systémique'}], correct: 'B', pos: 'Embrasser l’ensemble.', neg: 'Indice : Senge.' }
      ]
    }
  ]
};

async function importDakhla() {
  console.log('🚀 Starting Dakhla STANDARDIZED (Acte VI) import...');
  
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(DAKHLA_DATA.city);
  if (cityErr) console.error('City error:', cityErr);
  else console.log('✅ City Dakhla upserted');

  for (const mission of DAKHLA_DATA.missions) {
    const missionId = MISSION_IDS[mission.id];
    
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: DAKHLA_CHALLENGE_PK,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: DAKHLA_CHALLENGE_PK
      });
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr);
    else console.log(`✅ Mission ${mission.id} upserted`);

    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'Appariement') optionsData = { pairs: q.pairs };
      else if (q.type === 'Scénario en cascade') optionsData = { steps: q.steps };
      else if (q.type === 'Détection d’erreurs' || q.type === 'Détection + création') optionsData = { errors: q.errors };
      else if (q.type === 'Classement') optionsData = { order: q.order };
      
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
        xp_reward: q.type.includes('Énigme') ? 150 : 100,
        is_published: true,
        time_limit_sec: 45
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Questions Mission ${mission.id} error:`, qErr);
    } else {
      console.log(`✅ ${mission.questions.length} questions inserted for ${mission.id}`);
    }
  }
}

importDakhla();
