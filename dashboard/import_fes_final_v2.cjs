const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

// Fixed UUIDs
const FES_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440003';
const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
  F2: '550e8400-e29b-41d4-a716-44665544f222',
  F3: '550e8400-e29b-41d4-a716-44665544f333',
  F4: '550e8400-e29b-41d4-a716-44665544f444',
  F5: '550e8400-e29b-41d4-a716-44665544f555',
};

const TYPE_MAPPING = {
  'multiple-choice': 'qcm',
  'matching': 'matching',
  'scenario-dialogue': 'scenario_dialogue',
  'scenario-cascade': 'scenario_cascade',
  'true-false': 'vrai_faux',
  'glitch': 'error_detection',
  'ranking': 'ranking',
  'fill-in-blanks': 'fill_blanks',
  'short-answer': 'short_answer',
  'puzzle-riddle': 'puzzle_riddle'
};

const FES_DATA = {
  city: {
    id: FES_CHALLENGE_PK,
    city_id: 'fes',
    city_name_fr: 'Fès',
    city_name_ar: 'فاس',
    headline_fr: 'Capitale Spirituelle et Intellectuelle',
    description_fr: 'Fès, plus vieille cité universitaire du monde, vous invite à analyser en profondeur : pourquoi les équipes échouent, comment le stress s’installe, pourquoi les décisions déraillent, et comment tradition et innovation coexistent.',
    focus_fr: 'Analyse & Synthèse',
    illustration_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxa5gIFvHnzNsfPn807w_ILftZAoG4nxMRqLsk2MEIhc7e7EapJbhs7n08MHs8SlJ-hmXKvHcWLeKT3ZPUYqebAYclG6b0xJsq4E_iiBMVkZn_PjCXzQG0Rt2gD55hio6_Qf03Ycfy2KmFm_YmKO6sDoeiiJJBFEetNiEohRhsacsVWf6s-dg7gvX3RS-YlUklqoRS70ISdadtfwm1Il6j4y3IakWLP45w_hYxRMj3PmZ7sqgHQhpzxCrXRx83LVEuTfslJcewa0s',
    icon_name: 'landmark',
    city_color: '#1E40AF',
    sort_order: 3,
    is_published: true,
    progress: 0.25
  },
  missions: [
    {
      id: 'F1', title: 'L’Atelier de calligraphie',
      questions: [
        { type: 'multiple-choice', q: 'Quel est le principal avantage du modèle maître-apprenti par rapport à un cours théorique ?', options: [{id:'A',label_fr:'Le maître est plus intelligent'}, {id:'B',label_fr:'L’apprenti ne paie pas'}, {id:'C',label_fr:'L’apprentissage se fait dans la pratique réelle, avec feedback immédiat et progressif.'}], correct: 'C', pos: 'Analyse correcte ! ZPD de Vygotsky.', neg: 'Non. L’avantage est la pratique contextualisée.' },
        { type: 'matching', q: 'Relie chaque situation à la dysfonction Lencioni.', pairs: [{id:'1',left_fr:'Hamid cache ses erreurs',right_fr:'Absence de confiance'},{id:'2',left_fr:'Éviter de critiquer',right_fr:'Peur du conflit sain'},{id:'3',left_fr:'Pas concerné par délais',right_fr:'Évitement de la responsabilité'},{id:'4',left_fr:'Chacun pour soi',right_fr:'Inattention aux résultats'},{id:'5',left_fr:'Refus engagement',right_fr:'Manque d’engagement'}], pos: 'Pyramide Lencioni maîtrisée !', neg: 'Revois la hiérarchie Lencioni.' },
        { type: 'scenario-dialogue', q: 'Hamid démissionne après une critique tardive. Cause profonde ?', options: [{id:'A',label_fr:'Paresse'}, {id:'B',label_fr:'Manque de feedback progressif (3 mois sans retour)'}, {id:'C',label_fr:'Sévérité'}], correct: 'B', pos: 'Analyse systémique juste !', neg: 'C\'est un problème de méthode de feedback.' },
        { type: 'scenario-cascade', q: 'Crise d’équipe', steps: [{question:'Conflit compagnons. Type selon Tuckman ?', responses:[{id:'A',text:'Forming'},{id:'B',text:'Storming'},{id:'C',text:'Norming'}], correct:'B', pos:'Phase Storming identifiée.', neg:'Non, c\'est Storming.'},{question:'Conflit Kamal vs Samir. Pourquoi ?', responses:[{id:'A',text:'Personnel'},{id:'B',text:'Rôles Belbin (Analyste vs Réalisateur)'}], correct:'B', pos:'70% des conflits sont des conflits de rôles.', neg:'C\'est structurel, pas personnel.'}] },
        { type: 'true-false', q: 'Le meilleur artisan fait automatiquement le meilleur leader.', correct: 'faux', pos: 'Principe de Peter.', neg: 'Non, compétences distinctes.' },
        { type: 'glitch', q: 'Trouve les 6 erreurs dans le rapport de l’atelier.', errors: [{id:'1',text_fr:'Pas de hiérarchie',is_error:true},{id:'2',text_fr:'Aucune spécialisation',is_error:true},{id:'3',text_fr:'Feedback annuel',is_error:true},{id:'4',text_fr:'Recrutement sans essai',is_error:true},{id:'5',text_fr:'Théorie sans pratique',is_error:true},{id:'6',text_fr:'Turnover 80%',is_error:true}], pos: 'Analyse systémique impeccable.', neg: 'Cherche les failles structurelles.' },
        { type: 'ranking', q: 'Priorités de transmission', order: [{id:'1',label_fr:'Éthique'},{id:'2',label_fr:'Philosophie'},{id:'3',label_fr:'Enseigner'},{id:'4',label_fr:'Geste'},{id:'5',label_fr:'Gestion'},{id:'6',label_fr:'Client'},{id:'7',label_fr:'Innovation'}], pos: 'Hiérarchie des valeurs respectée.', neg: 'L’éthique passe avant la technique.' },
        { type: 'fill-in-blanks', q: 'Modèle Lave & Wenger', options: [{id:'1',text:'communauté'},{id:'2',text:'pratique'},{id:'3',text:'participation'},{id:'4',text:'périphérique'},{id:'5',text:'légitime'},{id:'6',text:'observation'},{id:'7',text:'identité'}], correct: 'communauté, pratique, participation', pos: 'Théorie maîtrisée !', neg: 'Revois la participation périphérique légitime.' },
        { type: 'short-answer', q: 'Analyse le leadership de Maître Idris (forces, faiblesses, recommandation).', pos: 'Analyse critique exceptionnelle !', neg: 'Il manque une dimension analytique.' },
        { type: 'puzzle-riddle', q: '« Je suis l’outil que personne ne voit mais que tous utilisent. Lencioni me place à la base… »', correct: 'La confiance', pos: 'Base de la pyramide trouvée !', neg: 'Sans moi, tout s’effondre.' }
      ]
    },
    {
      id: 'F2', title: 'Les Tanneries Chouara', skill: 'Gestion du stress (analyse)',
      questions: [
        { type: 'multiple-choice', q: 'Différence stress Karim vs Saïd ?', options: [{id:'A',label_fr:'Aigu vs Chronique'},{id:'B',label_fr:'Médical vs Physique'}], correct: 'A', pos: 'Intensité × durée identifiées.', neg: 'Aigu (urgences) vs Chronique (tanneries).' },
        { type: 'matching', q: 'Sources de stress', pairs: [{id:'1',left_fr:'Posture',right_fr:'Ergonomique'},{id:'2',left_fr:'Odeurs',right_fr:'Chimique'},{id:'3',left_fr:'Soleil',right_fr:'Environnemental'},{id:'4',left_fr:'Gestes répétitifs',right_fr:'Biomécanique'},{id:'5',left_fr:'Isolation',right_fr:'Psychosocial'}], pos: 'Multi-dimensionnel !', neg: 'Vérifie les catégories.' },
        { type: 'scenario-cascade', q: 'Analyse d’accident', steps: [{question:'Cause chute ?', responses:[{id:'A',text:'Inattention'},{id:'B',text:'Multi-facteurs (Reason)'}], correct:'B', pos:'Modèle du fromage suisse !', neg:'Jamais une seule cause.'},{question:'Solution ?', responses:[{id:'A',text:'Punir'},{id:'B',text:'Système (Equipement/Formation)'}], correct:'B', pos:'Agir sur le système.', neg:'Punir ne résout rien.'}] },
        { type: 'scenario-dialogue', q: 'Résilience de Saïd. Quel pilier (Cyrulnik) ?', options: [{id:'A',label_fr:'Humour'},{id:'B',label_fr:'Sens (Famille)'}], correct: 'B', pos: 'Le sens est le moteur de la résilience.', neg: 'C\'est le sens (« pourquoi »).' },
        { type: 'glitch', q: 'Erreurs planning Saïd', errors: [{id:'1',text_fr:'Pas de pause',is_error:true},{id:'2',text_fr:'Boit tard',is_error:true},{id:'3',text_fr:'Pas de gants',is_error:true},{id:'4',text_fr:'Pause courte',is_error:true},{id:'5',text_fr:'Pas d\'étirements',is_error:true}], pos: 'Analyse ergonomique juste.', neg: 'Cherche les négligences.' },
        { type: 'fill-in-blanks', q: 'Phase de Selye', options: [{id:'1',text:'alarme'},{id:'2',text:'cortisol'},{id:'3',text:'résistance'},{id:'4',text:'adaptation'},{id:'5',text:'épuisement'},{id:'6',text:'chronique'},{id:'7',text:'récupération'}], pos: 'Modèle Selye maîtrisée.', neg: 'Alarme -> Résistance -> Épuisement.' },
        { type: 'multiple-choice', q: 'Lien stress physique vs mental ?', options: [{id:'A',label_fr:'Mêmes mécanismes (cortisol)'},{id:'B',label_fr:'Différents'}], correct: 'A', pos: 'Le stress est universel.', neg: 'Biologie identique.' },
        { type: 'scenario-dialogue', q: 'Moderniser ou préserver ?', options: [{id:'A',label_fr:'Tout changer'},{id:'B',label_fr:'Rien changer'},{id:'C',label_fr:'Protéger santé, garder tradition'}], correct: 'C', pos: 'Analyse dialectique parfaite.', neg: 'Cherche la 3ème voie.' },
        { type: 'short-answer', q: 'Rapport d’analyse : 3 risques, 3 solutions, 1 priorité.', pos: 'Analyse pro !', neg: 'Sois plus structuré.' },
        { type: 'puzzle-riddle', q: '« Invisible dans le corps, je sculpte les visages... »', correct: 'Le stress', pos: 'Phénomène cartographié !', neg: 'Selye m\'a étudié.' }
      ]
    },
    {
      id: 'F3', title: 'L’Université – Prise de décision', skill: 'Prise de décision (analyse)',
      questions: [
        { type: 'multiple-choice', q: 'Comité silencieux malgré doutes. Type d\'erreur ?', options: [{id:'A',label_fr:'Cognitive'},{id:'B',label_fr:'Groupthink (Janis)'}], correct: 'B', pos: 'Pression sociale identifiée.', neg: 'C\'est le Groupthink.' },
        { type: 'scenario-cascade', q: 'Échec e-commerce', steps: [{question:'Phase info ?', responses:[{id:'A',text:'Bâclée'},{id:'B',text:'Complète'}], correct:'A', pos:'Données manquantes = échec.', neg:'Info incomplète.'},{question:'Solution ?', responses:[{id:'A',text:'Tout ou rien'},{id:'B',text:'Phase pilote (MVP)'}], correct:'B', pos:'Lean Startup : tester petit.', neg:'Investir sans test est risqué.'}] },
        { type: 'matching', q: 'Décisions vs Biais', pairs: [{id:'1',left_fr:'Copier Rabat',right_fr:'Conformité'},{id:'2',left_fr:'Prix du père',right_fr:'Ancrage'},{id:'3',left_fr:'Artisan média',right_fr:'Halo'},{id:'4',left_fr:'Refus étrangers',right_fr:'Généralisation'}], pos: 'Biais identifiés !', neg: 'Vérifie les correspondances.' },
        { type: 'glitch', q: 'Erreurs étude de marché', errors: [{id:'1',text_fr:'Échantillon 15 amis',is_error:true},{id:'2',text_fr:'Dimanche uniquement',is_error:true},{id:'3',text_fr:'Complaisance',is_error:true},{id:'4',text_fr:'Généralisation hâtive',is_error:true},{id:'5',text_fr:'Instinct seul',is_error:true},{id:'6',text_fr:'Pas de BP',is_error:true}], pos: 'Audit méthodologique juste.', neg: 'Questionne la data.' },
        { type: 'ranking', q: 'Facteurs de succès', order: [{id:'1',label_fr:'Qualité'},{id:'2',label_fr:'Adaptation'},{id:'3',label_fr:'Réseau'},{id:'4',label_fr:'Coûts'},{id:'5',label_fr:'Bien-être'},{id:'6',label_fr:'Transmission'},{id:'7',label_fr:'Innovation'}], pos: 'Stratégie long terme.', neg: 'Qualité d\'abord.' },
        { type: 'fill-in-blanks', q: 'Processus anti-Groupthink', options: [{id:'1',text:'définir'},{id:'2',text:'collecter'},{id:'3',text:'générer'},{id:'4',text:'évaluer'},{id:'5',text:'choisir'},{id:'6',text:'agir'},{id:'7',text:'feedback'},{id:'8',text:'avocat du diable'}], pos: 'Processus complet !', neg: 'Revois les 8 étapes.' },
        { type: 'scenario-dialogue', q: 'Copier voisin sans succès. Pourquoi ?', options: [{id:'A',label_fr:'Malchance'},{id:'B',label_fr:'Pas d\'analyse du contexte spécifique'}], correct: 'B', pos: 'Imiter ≠ Comprendre.', neg: 'Le contexte change tout.' },
        { type: 'multiple-choice', q: '« Tout le monde est pauvre ». Biais ?', options: [{id:'A',label_fr:'Attribution externe'},{id:'B',label_fr:'Confirmation'}], correct: 'A', pos: 'Rejeter la faute sur l\'externe.', neg: 'Biais d\'attribution.' },
        { type: 'short-answer', q: 'Recommandation e-commerce avec 8 étapes anti-Groupthink.', pos: 'Plan solide !', neg: 'Il manque des étapes.' },
        { type: 'puzzle-riddle', q: '« Kahneman m’a traqué, je me cache derrière les certitudes... »', correct: 'Le biais cognitif', pos: 'Ennemi de la raison trouvé !', neg: 'Invisible mais fatal.' }
      ]
    },
    {
      id: 'F4', title: 'Medersa Bou Inania', skill: 'Analyse systémique',
      questions: [
        { type: 'multiple-choice', q: 'Pourquoi restauration complexe ?', options: [{id:'A',label_fr:'Vieux'},{id:'B',label_fr:'Imprévisible (Cynefin)'}], correct: 'B', pos: 'Complexité vs Compliqué.', neg: 'C\'est l\'imprévisibilité.' },
        { type: 'ranking', q: 'Chemin critique (CPM)', order: [{id:'1',label_fr:'Historien'},{id:'2',label_fr:'Chimiste'},{id:'3',label_fr:'Maçon'},{id:'4',label_fr:'Zelligeur'},{id:'5',label_fr:'Sculpteur'}], pos: 'Analyse flux parfaite.', neg: 'Recalcule les interdépendances.' },
        { type: 'scenario-cascade', q: 'Pigments au plomb', steps: [{question:'Type dilemme ?', responses:[{id:'A',text:'Simple'},{id:'B',text:'Éthique complexe'}], correct:'B', pos:'Patrimoine vs Santé.', neg:'Deux valeurs légitimes.'},{question:'Solution ?', responses:[{id:'A',text:'Interdire'},{id:'B',text:'Hybride (Aspect/Sécurité)'}], correct:'B', pos:'3ème voie trouvée.', neg:'Synthèse nécessaire.'}] },
        { type: 'glitch', q: 'Erreurs plan restauration', errors: [{id:'1',text_fr:'Une seule phase',is_error:true},{id:'2',text_fr:'Ciment Portland',is_error:true},{id:'3',text_fr:'Span of control',is_error:true},{id:'4',text_fr:'Pas de doc',is_error:true},{id:'5',text_fr:'Zéro imprévu',is_error:true},{id:'6',text_fr:'Décision seul',is_error:true}], pos: 'Analyse multi-niveaux.', neg: 'Technique et managérial.' },
        { type: 'fill-in-blanks', q: 'Charte de Venise', options: [{id:'1',text:'réversibilité'},{id:'2',text:'authenticité'},{id:'3',text:'minimalisme'},{id:'4',text:'documentation'},{id:'5',text:'compatibilité'},{id:'6',text:'interdisciplinaire'}], pos: 'Principes maîtrisés.', neg: 'Revois la charte.' },
        { type: 'scenario-dialogue', q: 'Zelligeur refuse modernité. Solution ?', options: [{id:'A',label_fr:'Forcer'},{id:'B',label_fr:'Répartition expertise (Structure vs Aspect)'}], correct: 'B', pos: 'Solution systémique.', neg: 'Compromis structuré.' },
        { type: 'ranking', q: 'Prioriser zones', order: [{id:'1',label_fr:'Fondations'},{id:'2',label_fr:'Toiture'},{id:'3',label_fr:'Murs'},{id:'4',label_fr:'Mosaïques'},{id:'5',label_fr:'Stuc'},{id:'6',label_fr:'Bois'},{id:'7',label_fr:'Sols'}], pos: 'Structure avant esthétique.', neg: 'Fondations d\'abord.' },
        { type: 'multiple-choice', q: 'Carreaux serrés. Cause ?', options: [{id:'A',label_fr:'Maladresse'},{id:'B',label_fr:'Défaut formation (dilatation)'}], correct: 'B', pos: 'Cause systémique.', neg: 'Manque de savoir technique.' },
        { type: 'short-answer', q: 'Rapport forces/faiblesses projet.', pos: 'Synthèse pro !', neg: 'Plus de détails.' },
        { type: 'puzzle-riddle', q: '« Vieille de 700 ans mais neuve chaque matin... »', correct: 'La tradition', pos: 'Authenticité préservée !', neg: 'Youssef me restaure.' }
      ]
    },
    {
      id: 'F5', title: 'Festival de Fès', skill: 'Synthèse analytique',
      questions: [
        { type: 'multiple-choice', q: 'Crise inauguration. Priorité ?', options: [{id:'A',label_fr:'Ministre'},{id:'B',label_fr:'Conflit humain'},{id:'C',label_fr:'Sono'}], correct: 'B', pos: 'Humain instable > Technique.', neg: 'Le conflit peut escalader.' },
        { type: 'scenario-cascade', q: 'Conflit Corporations', steps: [{question:'Vrai objet ?', responses:[{id:'A',text:'Eau'},{id:'B',text:'Pouvoir/Statut'}], correct:'B', pos:'Eau = prétexte.', neg:'C\'est le pouvoir.'},{question:'Solution ?', responses:[{id:'A',text:'Séparer'},{id:'B',text:'Institution (Comité)'}], correct:'B', pos:'Solution structurelle.', neg:'Créer des règles.'}] },
        { type: 'glitch', q: 'Erreurs budget', errors: [{id:'1',text_fr:'Sponsor unique',is_error:true},{id:'2',text_fr:'Optimisme',is_error:true},{id:'3',text_fr:'Trop de comm',is_error:true},{id:'4',text_fr:'Artisans sous-payés',is_error:true},{id:'5',text_fr:'Zéro imprévu',is_error:true},{id:'6',text_fr:'Zéro marge',is_error:true}], pos: 'Audit budgétaire juste.', neg: 'Déséquilibres identifiés.' },
        { type: 'matching', q: 'Groupes vs Comités', pairs: [{id:'1',left_fr:'Maçons',right_fr:'Technique'},{id:'2',left_fr:'Tanneurs',right_fr:'Conflits'},{id:'3',left_fr:'Joailliers',right_fr:'Comm'},{id:'4',left_fr:'Ferronniers',right_fr:'Logistique'}], pos: 'Gouvernance analytique.', neg: 'Réfléchis aux forces.' },
        { type: 'true-false', q: 'Tradition bloque innovation.', correct: 'faux', pos: 'Rigidité ≠ Tradition.', neg: 'Innovation ancienne.' },
        { type: 'multiple-choice', q: 'Stand prend feu. Priorité ?', options: [{id:'A',label_fr:'Sécurité'},{id:'B',label_fr:'Comm'}], correct: 'A', pos: 'Sécurité d\'abord.', neg: 'Urgence vitale.' },
        { type: 'fill-in-blanks', q: 'Modèle de Freeman', options: [{id:'1',text:'identifier'},{id:'2',text:'cartographier'},{id:'3',text:'intérêts'},{id:'4',text:'pouvoir'},{id:'5',text:'légitimité'},{id:'6',text:'urgence'},{id:'7',text:'prioriser'},{id:'8',text:'engager'}], pos: 'Stakeholders maîtrisés.', neg: 'Revois le modèle.' },
        { type: 'scenario-dialogue', q: 'Accusation exploitation. Réponse ?', options: [{id:'A',label_fr:'Déni'},{id:'B',label_fr:'Reconnaître, Nuancer, Solution'}], correct: 'B', pos: 'Équilibre médiatique.', neg: 'Déni = danger.' },
        { type: 'short-answer', q: 'SWOT et 3 recommandations.', pos: 'Vision stratégique !', neg: 'Plus d\'arguments.' },
        { type: 'puzzle-riddle', q: '« Je décompose ce qui semble simple... À Rabat tu as appris sans moi... »', correct: 'L’analyse', pos: 'Pont vers la sagesse trouvé !', neg: 'Fès me l\'a révélé.' }
      ]
    }
  ]
}

async function importFes() {
  console.log('🚀 Starting Fès FINAL import...')
  
  // 1. City with fixed ID (PK)
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(FES_DATA.city)
  if (cityErr) console.error('City error:', cityErr)
  else console.log('✅ City Fès upserted')

  for (const mission of FES_DATA.missions) {
    const missionId = MISSION_IDS[mission.id]
    
    // 2. Mission
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: FES_CHALLENGE_PK,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: FES_CHALLENGE_PK
      })
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr)
    else console.log(`✅ Mission ${mission.id} upserted`)

    // 3. Questions
    await supabase.from('questions').delete().eq('mission_id', missionId)

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'matching') optionsData = q.pairs; // Array of paires [{id, left_fr, right_fr}]
      else if (q.type === 'scenario-cascade') optionsData = { steps: q.steps };
      else if (q.type === 'glitch') optionsData = q.errors; // Array of segments [{id, text_fr, is_error}]
      else if (q.type === 'ranking') optionsData = q.order; // Array of items [{id, label_fr}]
      else if (q.type === 'fill-in-blanks') optionsData = q.options; // Array of puces [{id, text}]
      
      const dbType = TYPE_MAPPING[q.type] || q.type;

      return {
        mission_id: missionId,
        question_fr: q.q,
        question_type: dbType,
        options: optionsData,
        correct_answer: q.correct,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg,
        explanation_fr: q.pos, // Duplicate for explanation field
        sort_order: i + 1,
        xp_reward: 50,
        is_published: true,
        time_limit_sec: 45
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert)
    if (qErr) {
      console.error(`Questions Mission ${mission.id} error:`, qErr);
      // Try one by one to find the culprit
      for (let j = 0; j < questionsToInsert.length; j++) {
        const { error: singleErr } = await supabase.from('questions').insert(questionsToInsert[j]);
        if (singleErr) console.error(`Culprit Q${j+1}: type=${questionsToInsert[j].question_type}`, singleErr);
      }
    } else {
      console.log(`✅ ${mission.questions.length} questions inserted for ${mission.id}`)
    }
  }
}

importFes()
