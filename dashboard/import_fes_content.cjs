const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const FES_CITY_UUID = '550e8400-e29b-41d4-a716-446655440003';
const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
  F2: '550e8400-e29b-41d4-a716-44665544f222',
  F3: '550e8400-e29b-41d4-a716-44665544f333',
  F4: '550e8400-e29b-41d4-a716-44665544f444',
  F5: '550e8400-e29b-41d4-a716-44665544f555',
};

const FES_DATA = {
  city: {
    city_id: FES_CITY_UUID,
    city_name_fr: 'Fès',
    city_name_ar: 'فاس',
    description_fr: 'Fès, plus vieille cité universitaire du monde, vous invite à analyser en profondeur : pourquoi les équipes échouent, comment le stress s’installe, pourquoi les décisions déraillent, et comment tradition et innovation coexistent.',
    focus_fr: 'Analyse & Synthèse',
    illustration_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxa5gIFvHnzNsfPn807w_ILftZAoG4nxMRqLsk2MEIhc7e7EapJbhs7n08MHs8SlJ-hmXKvHcWLeKT3ZPUYqebAYclG6b0xJsq4E_iiBMVkZn_PjCXzQG0Rt2gD55hio6_Qf03Ycfy2KmFm_YmKO6sDoeiiJJBFEetNiEohRhsacsVWf6s-dg7gvX3RS-YlUklqoRS70ISdadtfwm1Il6j4y3IakWLP45w_hYxRMj3PmZ7sqgHQhpzxCrXRx83LVEuTfslJcewa0s',
    icon_name: 'landmark',
    city_color: '#1E40AF',
    sort_order: 3
  },
  missions: [
    {
      id: 'F1', title: 'L’Atelier de calligraphie',
      questions: [
        { type: 'multiple-choice', q: 'Quel est le principal avantage du modèle maître-apprenti par rapport à un cours théorique ?', options: [{id:'A',text:'Le maître est plus intelligent'}, {id:'B',text:'L’apprenti ne paie pas'}, {id:'C',text:'L’apprentissage se fait dans la pratique réelle, avec feedback immédiat et progressif.'}], correct: 'C', pos: 'Analyse correcte ! ZPD de Vygotsky.', neg: 'Non. L’avantage est la pratique contextualisée.' },
        { type: 'matching', q: 'Relie chaque situation à la dysfonction Lencioni.', pairs: [{item:'Hamid cache ses erreurs',match:'Absence de confiance'},{item:'Éviter de critiquer',match:'Peur du conflit sain'},{item:'Pas concerné par délais',match:'Évitement de la responsabilité'},{item:'Chacun pour soi',match:'Inattention aux résultats'},{item:'Refus engagement',match:'Manque d’engagement'}], pos: 'Pyramide Lencioni maîtrisée !', neg: 'Revois la hiérarchie Lencioni.' },
        { type: 'scenario-dialogue', q: 'Hamid démissionne après une critique tardive. Cause profonde ?', options: [{id:'A',text:'Paresse'}, {id:'B',text:'Manque de feedback progressif (3 mois sans retour)'}, {id:'C',text:'Sévérité'}], correct: 'B', pos: 'Analyse systémique juste !', neg: 'C\'est un problème de méthode de feedback.' },
        { type: 'scenario-cascade', q: 'Crise d’équipe', steps: [{question:'Conflit compagnons. Type selon Tuckman ?', responses:[{id:'A',text:'Forming'},{id:'B',text:'Storming'},{id:'C',text:'Norming'}], correct:'B', pos:'Phase Storming identifiée.', neg:'Non, c\'est Storming.'},{question:'Conflit Kamal vs Samir. Pourquoi ?', responses:[{id:'A',text:'Personnel'},{id:'B',text:'Rôles Belbin (Analyste vs Réalisateur)'}], correct:'B', pos:'70% des conflits sont des conflits de rôles.', neg:'C\'est structurel, pas personnel.'}] },
        { type: 'true-false', q: 'Vrai/Faux analytique', questions: [{t:'Le meilleur artisan fait automatiquement le meilleur leader.', a:false, p:'Principe de Peter.', n:'Non, compétences distinctes.'}, {t:'Un conflit d’idées peut améliorer la qualité.', a:true, p:'Conflit de tâches constructif.', n:'Le débat d’idées est utile.'}] },
        { type: 'glitch', q: 'Trouve les 6 erreurs dans le rapport de l’atelier.', errors: ['Pas de hiérarchie', 'Aucune spécialisation', 'Feedback annuel', 'Recrutement sans essai', 'Théorie sans pratique', 'Turnover 80%'], pos: 'Analyse systémique impeccable.', neg: 'Cherche les failles structurelles.' },
        { type: 'ranking', q: 'Priorités de transmission', order: ['Éthique', 'Philosophie', 'Enseigner', 'Geste', 'Gestion', 'Client', 'Innovation'], pos: 'Hiérarchie des valeurs respectée.', neg: 'L’éthique passe avant la technique.' },
        { type: 'fill-in-blanks', q: 'Modèle Lave & Wenger', bank: ['communauté', 'pratique', 'participation', 'périphérique', 'légitime', 'observation', 'identité'], pos: 'Théorie maîtrisée !', neg: 'Revois la participation périphérique légitime.' },
        { type: 'short-answer', q: 'Analyse le leadership de Maître Idris (forces, faiblesses, recommandation).', pos: 'Analyse critique exceptionnelle !', neg: 'Il manque une dimension analytique.' },
        { type: 'puzzle-riddle', q: '« Je suis l’outil que personne ne voit mais que tous utilisent. Lencioni me place à la base… »', correct: 'La confiance', pos: 'Base de la pyramide trouvée !', neg: 'Sans moi, tout s’effondre.' }
      ]
    },
    {
      id: 'F2', title: 'Les Tanneries Chouara',
      questions: [
        { type: 'multiple-choice', q: 'Différence stress Karim vs Saïd ?', options: [{id:'A',text:'Aigu vs Chronique'},{id:'B',text:'Médical vs Physique'}], correct: 'A', pos: 'Intensité × durée identifiées.', neg: 'Aigu (urgences) vs Chronique (tanneries).' },
        { type: 'matching', q: 'Sources de stress', pairs: [{item:'Posture',match:'Ergonomique'},{item:'Odeurs',match:'Chimique'},{item:'Soleil',match:'Environnemental'},{item:'Gestes répétitifs',match:'Biomécanique'},{item:'Isolation',match:'Psychosocial'}], pos: 'Multi-dimensionnel !', neg: 'Vérifie les catégories.' },
        { type: 'scenario-cascade', q: 'Analyse d’accident', steps: [{question:'Cause chute ?', responses:[{id:'A',text:'Inattention'},{id:'B',text:'Multi-facteurs (Reason)'}], correct:'B', pos:'Modèle du fromage suisse !', neg:'Jamais une seule cause.'},{question:'Solution ?', responses:[{id:'A',text:'Punir'},{id:'B',text:'Système (Equipement/Formation)'}], correct:'B', pos:'Agir sur le système.', neg:'Punir ne résout rien.'}] },
        { type: 'scenario-dialogue', q: 'Résilience de Saïd. Quel pilier (Cyrulnik) ?', options: [{id:'A',text:'Humour'},{id:'B',text:'Sens (Famille)'}], correct: 'B', pos: 'Le sens est le moteur de la résilience.', neg: 'C\'est le sens (« pourquoi »).' },
        { type: 'glitch', q: 'Erreurs planning Saïd', errors: ['Pas de pause', 'Boit tard', 'Pas de gants', 'Pause courte', 'Pas d\'étirements'], pos: 'Analyse ergonomique juste.', neg: 'Cherche les négligences.' },
        { type: 'fill-in-blanks', q: 'Phase de Selye', bank: ['alarme', 'cortisol', 'résistance', 'adaptation', 'épuisement', 'chronique', 'récupération'], pos: 'Modèle Selye maîtrisée.', neg: 'Alarme -> Résistance -> Épuisement.' },
        { type: 'multiple-choice', q: 'Lien stress physique vs mental ?', options: [{id:'A',text:'Mêmes mécanismes (cortisol)'},{id:'B',text:'Différents'}], correct: 'A', pos: 'Le stress est universel.', neg: 'Biologie identique.' },
        { type: 'scenario-decision', q: 'Moderniser ou préserver ?', options: [{id:'A',text:'Tout changer'},{id:'B',text:'Rien changer'},{id:'C',text:'Protéger santé, garder tradition'}], correct: 'C', pos: 'Analyse dialectique parfaite.', neg: 'Cherche la 3ème voie.' },
        { type: 'short-answer', q: 'Rapport d’analyse : 3 risques, 3 solutions, 1 priorité.', pos: 'Analyse pro !', neg: 'Sois plus structuré.' },
        { type: 'puzzle-riddle', q: '« Invisible dans le corps, je sculpte les visages... »', correct: 'Le stress', pos: 'Phénomène cartographié !', neg: 'Selye m\'a étudié.' }
      ]
    },
    {
      id: 'F3', title: 'L’Université – Prise de décision',
      questions: [
        { type: 'multiple-choice', q: 'Comité silencieux malgré doutes. Type d\'erreur ?', options: [{id:'A',text:'Cognitive'},{id:'B',text:'Groupthink (Janis)'}], correct: 'B', pos: 'Pression sociale identifiée.', neg: 'C\'est le Groupthink.' },
        { type: 'scenario-cascade', q: 'Échec e-commerce', steps: [{question:'Phase info ?', responses:[{id:'A',text:'Bâclée'},{id:'B',text:'Complète'}], correct:'A', pos:'Données manquantes = échec.', neg:'Info incomplète.'},{question:'Solution ?', responses:[{id:'A',text:'Tout ou rien'},{id:'B',text:'Phase pilote (MVP)'}], correct:'B', pos:'Lean Startup : tester petit.', neg:'Investir sans test est risqué.'}] },
        { type: 'matching', q: 'Décisions vs Biais', pairs: [{item:'Copier Rabat',match:'Conformité'},{item:'Prix du père',match:'Ancrage'},{item:'Artisan média',match:'Halo'},{item:'Refus étrangers',match:'Généralisation'}], pos: 'Biais identifiés !', neg: 'Vérifie les correspondances.' },
        { type: 'glitch', q: 'Erreurs étude de marché', errors: ['Échantillon 15 amis', 'Dimanche uniquement', 'Complaisance', 'Généralisation hâtive', 'Instinct seul', 'Pas de BP'], pos: 'Audit méthodologique juste.', neg: 'Questionne la data.' },
        { type: 'ranking', q: 'Facteurs de succès', order: ['Qualité', 'Adaptation', 'Réseau', 'Coûts', 'Bien-être', 'Transmission', 'Innovation'], pos: 'Stratégie long terme.', neg: 'Qualité d\'abord.' },
        { type: 'fill-in-blanks', q: 'Processus anti-Groupthink', bank: ['définir', 'collecter', 'générer', 'évaluer', 'choisir', 'agir', 'feedback', 'avocat du diable'], pos: 'Processus complet !', neg: 'Revois les 8 étapes.' },
        { type: 'scenario-dialogue', q: 'Copier voisin sans succès. Pourquoi ?', options: [{id:'A',text:'Malchance'},{id:'B',text:'Pas d\'analyse du contexte spécifique'}], correct: 'B', pos: 'Imiter ≠ Comprendre.', neg: 'Le contexte change tout.' },
        { type: 'multiple-choice', q: '« Tout le monde est pauvre ». Biais ?', options: [{id:'A',text:'Attribution externe'},{id:'B',text:'Confirmation'}], correct: 'A', pos: 'Rejeter la faute sur l\'externe.', neg: 'Biais d\'attribution.' },
        { type: 'short-answer', q: 'Recommandation e-commerce avec 8 étapes anti-Groupthink.', pos: 'Plan solide !', neg: 'Il manque des étapes.' },
        { type: 'puzzle-riddle', q: '« Kahneman m’a traqué, je me cache derrière les certitudes... »', correct: 'Le biais cognitif', pos: 'Ennemi de la raison trouvé !', neg: 'Invisible mais fatal.' }
      ]
    },
    {
      id: 'F4', title: 'Medersa Bou Inania',
      questions: [
        { type: 'multiple-choice', q: 'Pourquoi restauration complexe ?', options: [{id:'A',text:'Vieux'},{id:'B',text:'Imprévisible (Cynefin)'}], correct: 'B', pos: 'Complexité vs Compliqué.', neg: 'C\'est l\'imprévisibilité.' },
        { type: 'ranking', q: 'Chemin critique (CPM)', order: ['Historien', 'Chimiste', 'Maçon', 'Zelligeur', 'Sculpteur'], pos: 'Analyse flux parfaite.', neg: 'Recalcule les interdépendances.' },
        { type: 'scenario-cascade', q: 'Pigments au plomb', steps: [{question:'Type dilemme ?', responses:[{id:'A',text:'Simple'},{id:'B',text:'Éthique complexe'}], correct:'B', pos:'Patrimoine vs Santé.', neg:'Deux valeurs légitimes.'},{question:'Solution ?', responses:[{id:'A',text:'Interdire'},{id:'B',text:'Hybride (Aspect/Sécurité)'}], correct:'B', pos:'3ème voie trouvée.', neg:'Synthèse nécessaire.'}] },
        { type: 'glitch', q: 'Erreurs plan restauration', errors: ['Une seule phase', 'Ciment Portland', 'Span of control', 'Pas de doc', 'Zéro imprévu', 'Décision seul'], pos: 'Analyse multi-niveaux.', neg: 'Technique et managérial.' },
        { type: 'fill-in-blanks', q: 'Charte de Venise', bank: ['réversibilité', 'authenticité', 'minimalisme', 'documentation', 'compatibilité', 'interdisciplinaire'], pos: 'Principes maîtrisés.', neg: 'Revois la charte.' },
        { type: 'scenario-dialogue', q: 'Zelligeur refuse modernité. Solution ?', options: [{id:'A',text:'Forcer'},{id:'B',text:'Répartition expertise (Structure vs Aspect)'}], correct: 'B', pos: 'Solution systémique.', neg: 'Compromis structuré.' },
        { type: 'ranking', q: 'Prioriser zones', order: ['Fondations', 'Toiture', 'Murs', 'Mosaïques', 'Stuc', 'Bois', 'Sols'], pos: 'Structure avant esthétique.', neg: 'Fondations d\'abord.' },
        { type: 'multiple-choice', q: 'Carreaux serrés. Cause ?', options: [{id:'A',text:'Maladresse'},{id:'B',text:'Défaut formation (dilatation)'}], correct: 'B', pos: 'Cause systémique.', neg: 'Manque de savoir technique.' },
        { type: 'short-answer', q: 'Rapport forces/faiblesses projet.', pos: 'Synthèse pro !', neg: 'Plus de détails.' },
        { type: 'puzzle-riddle', q: '« Vieille de 700 ans mais neuve chaque matin... »', correct: 'La tradition', pos: 'Authenticité préservée !', neg: 'Youssef me restaure.' }
      ]
    },
    {
      id: 'F5', title: 'Festival de Fès',
      questions: [
        { type: 'multiple-choice', q: 'Crise inauguration. Priorité ?', options: [{id:'A',text:'Ministre'},{id:'B',text:'Conflit humain'},{id:'C',text:'Sono'}], correct: 'B', pos: 'Humain instable > Technique.', neg: 'Le conflit peut escalader.' },
        { type: 'scenario-cascade', q: 'Conflit Corporations', steps: [{question:'Vrai objet ?', responses:[{id:'A',text:'Eau'},{id:'B',text:'Pouvoir/Statut'}], correct:'B', pos:'Eau = prétexte.', neg:'C\'est le pouvoir.'},{question:'Solution ?', responses:[{id:'A',text:'Séparer'},{id:'B',text:'Institution (Comité)'}], correct:'B', pos:'Solution structurelle.', neg:'Créer des règles.'}] },
        { type: 'glitch', q: 'Erreurs budget', errors: ['Sponsor unique', 'Optimisme', 'Trop de comm', 'Artisans sous-payés', 'Zéro imprévu', 'Zéro marge'], pos: 'Audit budgétaire juste.', neg: 'Déséquilibres identifiés.' },
        { type: 'matching', q: 'Groupes vs Comités', pairs: [{item:'Maçons',match:'Technique'},{item:'Tanneurs',match:'Conflits'},{item:'Joailliers',match:'Comm'},{item:'Ferronniers',match:'Logistique'}], pos: 'Gouvernance analytique.', neg: 'Réfléchis aux forces.' },
        { type: 'true-false', q: 'Vrai/Faux analytique', questions: [{t:'Tradition bloque innovation.', a:false, p:'Rigidité ≠ Tradition.', n:'Innovation ancienne.'}, {t:'Festival doit être rentable.', a:false, p:'Service public culturel.', n:'ROI social/culturel.'}] },
        { type: 'multiple-choice', q: 'Stand prend feu. Priorité ?', options: [{id:'A',text:'Sécurité'},{id:'B',text:'Comm'}], correct: 'A', pos: 'Sécurité d\'abord.', neg: 'Urgence vitale.' },
        { type: 'fill-in-blanks', q: 'Modèle de Freeman', bank: ['identifier', 'cartographier', 'intérêts', 'pouvoir', 'légitimité', 'urgence', 'prioriser', 'engager'], pos: 'Stakeholders maîtrisés.', neg: 'Revois le modèle.' },
        { type: 'scenario-dialogue', q: 'Accusation exploitation. Réponse ?', options: [{id:'A',text:'Déni'},{id:'B',text:'Reconnaître, Nuancer, Solution'}], correct: 'B', pos: 'Équilibre médiatique.', neg: 'Déni = danger.' },
        { type: 'short-answer', q: 'SWOT et 3 recommandations.', pos: 'Vision stratégique !', neg: 'Plus d\'arguments.' },
        { type: 'puzzle-riddle', q: '« Je décompose ce qui semble simple... À Rabat tu as appris sans moi... »', correct: 'L’analyse', pos: 'Pont vers la sagesse trouvé !', neg: 'Fès me l\'a révélé.' }
      ]
    }
  ]
}

async function importFes() {
  console.log('🚀 Starting Fès import with UUIDs...')
  
  // 1. City
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert({
      city_id: FES_CITY_UUID,
      city_name_fr: 'Fès',
      description_fr: FES_DATA.city.description_fr,
      focus_fr: FES_DATA.city.focus_fr,
      illustration_url: FES_DATA.city.illustration_url,
      icon_name: FES_DATA.city.icon_name,
      city_color: FES_DATA.city.city_color,
      sort_order: FES_DATA.city.sort_order
    })
  if (cityErr) console.error('City error:', cityErr)
  else console.log('✅ City Fès upserted')

  for (const mission of FES_DATA.missions) {
    const missionId = MISSION_IDS[mission.id]
    
    // 2. Mission
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: FES_CITY_UUID,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: FES_CITY_UUID
      })
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr)
    else console.log(`✅ Mission ${mission.id} upserted`)

    // 3. Questions
    await supabase.from('questions').delete().eq('mission_id', missionId)

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'matching') optionsData = { pairs: q.pairs };
      else if (q.type === 'scenario-cascade') optionsData = { steps: q.steps };
      else if (q.type === 'glitch') optionsData = q.errors;
      else if (q.type === 'ranking') optionsData = q.order;
      else if (q.type === 'fill-in-blanks') optionsData = { bank: q.bank };
      else if (q.type === 'true-false') optionsData = q.questions;

      return {
        mission_id: missionId,
        question_fr: q.q,
        question_type: q.type,
        options: optionsData,
        correct_answer: q.correct,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg,
        sort_order: i + 1,
        xp_reward: 50
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert)
    if (qErr) console.error(`Questions Mission ${mission.id} error:`, qErr)
    else console.log(`✅ ${mission.questions.length} questions inserted for ${mission.id}`)
  }
}

importFes()
