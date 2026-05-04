require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  'Réponse courte': 'short_answer',
  'Création': 'short_answer',
  'Dialogue créatif': 'scenario_dialogue',
  'Détection + création': 'error_detection',
  'QCM créatif': 'qcm',
  'Création stratégique': 'short_answer',
  'Énigme ultime': 'puzzle_riddle',
  'Vrai/Faux créatif': 'vrai_faux',
  'Prise de décision créative': 'scenario_decision',
  'Contre-la-montre créatif': 'time_attack',
  'Classement créatif': 'ranking'
};

const LAAYOUNE_DATA = {
  city: {
    id: LAAYOUNE_CHALLENGE_PK,
    city_id: 'laayoune',
    city_name_fr: 'Laâyoune',
    city_name_ar: 'العيون',
    headline_fr: 'Porte du Désert',
    description_fr: 'Laâyoune, porte du désert, vous invite à créer là où rien n’existe. Ici, pas de manuels, pas de protocoles tout faits, pas de solutions toutes prêtes. Vous allez inventer des réponses originales à des problèmes inédits, avec des ressources limitées.',
    focus_fr: 'Création & Innovation Frugale',
    illustration_url: 'https://images.unsplash.com/photo-1547466832-1d2cc6306c99?q=80&w=2070&auto=format&fit=crop',
    icon_name: 'sun',
    city_color: '#f59e0b',
    sort_order: 5,
    is_published: true,
    acte_title: 'ACTE V - LAÂYOUNE : CRÉATION'
  },
  missions: [
    {
      id: 'L1', title: 'La Base du Désert',
      questions: [
        { type: 'Création', q: 'Tempête de sable, village isolé (200 pers., plus d’eau depuis 48h). Créez un plan d’intervention en 5 étapes.', options: [{id:'A',label_fr:'Attendre'}, {id:'B',label_fr:'1) Comm, 2) Prépa, 3) Départ accalmie, 4) Triage, 5) Suivi'}], correct: 'B', pos: 'Création géniale ! Redondance, triage, documentation.', neg: 'Attendre = mort. Votre plan doit être robuste.' },
        { type: 'Scénario en cascade', q: 'Gestion de panne', steps: [{question:'Véhicule en panne à mi-chemin. Solution ?', responses:[{id:'A',text:'Attendre'},{id:'B',text:'Transférer l’eau. Le véhicule en panne devient station radio fixe.'}], correct:'B', pos:'Innovation frugale ! Relais radio improvisé.', neg:'Le temps est vital.'},{question:'Distribution d’eau limitée. Plan ?', responses:[{id:'A',text:'Égalité'},{id:'B',text:'Triage : Critiques (10L), Fragiles (6L), Stables (3L).'}], correct:'B', pos:'Équité proportionnelle aux besoins.', neg:'L’égalitarisme ignore l’urgence.'}] },
        { type: 'Texte à trous', q: 'Piliers de résilience désert', options: [{id:'1',text:'chameau'},{id:'2',text:'tribu'},{id:'3',text:'oasis'}], correct: 'chameau, tribu, oasis', pos: 'Métaphores justes et puissantes.', neg: 'Révisez les piliers de résilience.' },
        { type: 'Contre-la-montre créatif', q: 'Urgences isolées', steps: [{question:'Radio cassée. Solution ?', responses:[{id:'A',text:'Pied'},{id:'B',text:'Signal visuel fumée (1=OK, 3=SOS).'}], correct:'B', pos:'Ingénieux ! Visible à 40 km.', neg:'Trop long à pied.'},{question:'Eau contaminée. Filtre ?', responses:[{id:'A',text:'Bouteille + Charbon + Sable + Gravier.'},{id:'B',text:'Rien'}], correct:'A', pos:'Filtre de survie efficace.', neg:'L’eau sale est fatale.'}] },
        { type: 'Détection + création', q: 'Audit Plan Évacuation. Erreurs ?', errors: [{id:'1',text_fr:'Départ 12h (chaleur)',is_error:true},{id:'2',text_fr:'1 seul véhicule',is_error:true},{id:'3',text_fr:'Pas de plan B',is_error:true}], pos: 'Transformation créative réussie.', neg: 'Sécurité d’abord.' },
        { type: 'Vrai/Faux créatif', q: '« L’innovation naît de l’abondance. »', correct: 'faux', pos: 'L’innovation frugale naît de la contrainte.', neg: 'Le manque est un moteur.' },
        { type: 'Dialogue créatif', q: 'Collègue en état de choc. Protocole ?', options: [{id:'A',label_fr:'« Sois fort »'}, {id:'B',label_fr:'Protocole PAIR : Protéger, Accueillir, Inviter, Réintégrer.'}], correct: 'B', pos: 'Création originale et utile.', neg: 'Nécessite de l’empathie.' },
        { type: 'Classement créatif', q: 'Priorités survie désert', order: [{id:'1',label_fr:'Ombre'},{id:'2',label_fr:'Eau'},{id:'3',label_fr:'Moral'},{id:'4',label_fr:'Nourriture'}], pos: 'Pyramide contextuelle juste.', neg: 'L’ombre avant l’eau.' },
        { type: 'Réponse courte', q: 'Manuel de survie psychologique (200 mots).', pos: 'Création littéraire et technique.', neg: 'Incluez des outils concrets.' },
        { type: 'Énigme', q: '« Quand tu n’as rien, je suis ta seule arme… »', options: [{id:'A',label_fr:'L’argent'},{id:'B',label_fr:'L’ingéniosité'}], correct: 'B', pos: 'L’ingéniosité naît du vide.', neg: 'Indice : Ishaq au désert.' }
      ]
    },
    {
      id: 'L2', title: 'Coopérative de femmes',
      questions: [
        { type: 'QCM créatif', q: 'Gouvernance coopérative (analphabète). Modèle ?', options: [{id:'A',label_fr:'Hiérarchie'}, {id:'B',label_fr:'Modèle 3 cercles : Aînées, Expérimentées, Nouvelles. Rotation.'}], correct: 'B', pos: 'Respect culturel et autonomie.', neg: 'Privilégiez le consensus.' },
        { type: 'Scénario en cascade', q: 'Formation inclusive', steps: [{question:'Apprendre sans écrit. Semaine 1 ?', responses:[{id:'A',text:'Manuels'},{id:'B',text:'Observation + Tutoring + Création perso.'}], correct:'B', pos:'Pédagogie active sans écrit.', neg:'Inadapté à l’analphabétisme.'},{question:'Suivi progrès ?', responses:[{id:'A',text:'Rapports'},{id:'B',text:'Tableau mural couleurs (Vert/Jaune/Rouge).'}], correct:'B', pos:'Suivi visuel inclusif.', neg:'Pas d’écrit.'}] },
        { type: 'Dialogue créatif', q: 'Conflit de tribus. Solution ?', options: [{id:'A',label_fr:'Séparer'}, {id:'B',label_fr:'But supra-ordonné : Projet commun irrésistible.'}], correct: 'B', pos: 'Coopération par intérêt supérieur.', neg: 'Allez au-delà du conflit.' },
        { type: 'Texte à trous', q: 'Charte Sahara', options: [{id:'1',text:'respect'},{id:'2',text:'consensus'},{id:'3',text:'transmission'}], correct: 'respect, consensus, transmission', pos: 'Charte vivante et orale.', neg: 'Valeurs locales.' },
        { type: 'Détection + création', q: 'Audit Marketing. Erreurs ?', errors: [{id:'1',text_fr:'Zéro digital',is_error:true},{id:'2',text_fr:'Packaging inexistant',is_error:true},{id:'3',text_fr:'Prix trop bas',is_error:true}], pos: 'Repositionnement premium réussi.', neg: 'Storytelling manquant.' },
        { type: 'Scénario en cascade', q: 'Mentorat', steps: [{question:'Critères mentore ?', responses:[{id:'A',text:'Technique seule'},{id:'B',text:'Expérience + Patience + Bienveillance.'}], correct:'B', pos:'Relationnel avant tout.', neg:'Le mentorat est humain.'},{question:'Évaluation ?', responses:[{id:'A',text:'Examen'},{id:'B',text:'Rencontre orale + Feedback collectif.'}], correct:'B', pos:'Évaluation constructive sans écrit.', neg:'Privilégiez la parole.'}] },
        { type: 'Contre-la-montre créatif', q: 'Crises Coop', steps: [{question:'Perte client 50%. Action ?', responses:[{id:'A',text:'Panique'},{id:'B',text:'Offre parrainage + Campagne locale.'}], correct:'B', pos:'Diversification rapide.', neg:'Réaction proactive.'},{question:'Concurrence -70%. Action ?', responses:[{id:'A',text:'Baisser prix'},{id:'B',text:'Storytelling + Certification authenticité.'}], correct:'B', pos:'Différenciation par la valeur.', neg:'Ne tuez pas la marge.'}] },
        { type: 'Classement créatif', q: 'Plan 5 ans (25 → 100 femmes)', order: [{id:'1',label_fr:'Stabiliser'},{id:'2',label_fr:'Former Mentores'},{id:'3',label_fr:'Essaimage'},{id:'4',label_fr:'E-commerce'}], pos: 'Croissance progressive et saine.', neg: 'Ne perdez pas l’âme.' },
        { type: 'Réponse courte', q: 'Lettre d’accueil orale (200 mots).', pos: 'Fraternelle et puissante.', neg: 'Sobriété et chaleur.' },
        { type: 'Énigme', q: '« 25 mains me tissent, 25 voix me chantent… »', options: [{id:'A',label_fr:'La chanson'},{id:'B',label_fr:'La communauté'}], correct: 'B', pos: 'Construite grain par grain.', neg: 'Indice : Avant Aicha.' }
      ]
    },
    {
      id: 'L3', title: 'Le Médecin du Désert',
      questions: [
        { type: 'Prise de décision créative', q: 'Triage sans tech. Système ?', options: [{id:'A',label_fr:'Attente'}, {id:'B',label_fr:'Rubans 3 couleurs : Rouge (Urgent), Jaune, Vert.'}], correct: 'B', pos: 'Simple, visuel, vital.', neg: 'Triage par couleur.' },
        { type: 'Scénario en cascade', q: 'Diagnostic isolement', steps: [{question:'Douleur abdominale. 5Q ?', responses:[{id:'A',text:'Vagues'},{id:'B',text:'Où? Quand? Fièvre? Sang? Antécédents?'}], correct:'B', pos:'Protocole 5Q efficace.', neg:'Soyez précis.'},{question:'Hélico dans 4h. Plan ?', responses:[{id:'A',text:'Attente'},{id:'B',text:'0-1h: Semi-assis ; 1-2h: IV ; 2-4h: Signal SOS.'}], correct:'B', pos:'Stabilisation programmée.', neg:'Ne soyez pas passif.'}] },
        { type: 'Rôles d’équipe', q: 'Former agents villageois. Kit ?', options: [{id:'A',label_fr:'Tech'}, {id:'B',label_fr:'Profil respecté + Formation 5j + Kit (Rubans, Radio).'}], correct: 'B', pos: 'Santé décentralisée et durable.', neg: 'Low-cost et efficace.' },
        { type: 'Dialogue créatif', q: 'Consultation sans internet. Système ?', options: [{id:'A',label_fr:'Rien'}, {id:'B',label_fr:'SMS Protocole + Photos + Appel vocal local.'}], correct: 'B', pos: 'Télémédecine low-tech.', neg: 'Le SMS sauve.' },
        { type: 'Texte à trous', q: 'Code Médecin Isolé', options: [{id:'1',text:'nuire'},{id:'2',text:'traiter'},{id:'3',text:'consentement'}], correct: 'nuire, traiter, consentement', pos: 'Principes d’isolement extrêmes.', neg: 'Éthique du soin.' },
        { type: 'Détection + création', q: 'Audit Système Santé. Solutions ?', errors: [{id:'1',text_fr:'Zéro radio',is_error:true},{id:'2',text_fr:'Pas de stock meds',is_error:true},{id:'3',text_fr:'Isolement psy',is_error:true}], pos: 'Opportunités organisationnelles identifiées.', neg: 'Plan d’action nécessaire.' },
        { type: 'Scénario en cascade', q: 'Épidémie sans murs', steps: [{question:'Confinement ?', responses:[{id:'A',text:'Strict'},{id:'B',text:'Distanciation + Masques tissu + Drap rouge (SOS).'}], correct:'B', pos:'Adapté au nomadisme.', neg:'Souplesse requise.'},{question:'Logistique ?', responses:[{id:'A',text:'Attendre'},{id:'B',text:'Dépôt vivres par moto à point relais.'}], correct:'B', pos:'Ravitaillement maintenu.', neg:'Logistique alternative.'}] },
        { type: 'Contre-la-montre créatif', q: 'Innovations Médicales', steps: [{question:'Brancard ?', responses:[{id:'A',text:'Bras'},{id:'B',text:'2 perches + Couverture.'}], correct:'B', pos:'Frugal et efficace.', neg:'Sécurité patient.'},{question:'Stérilisateur ?', responses:[{id:'A',text:'Soleil'},{id:'B',text:'Boîte métal noire + Verre + 4h soleil.'}], correct:'B', pos:'Zéro énergie.', neg:'Stérilisation vitale.'}] },
        { type: 'Réponse courte', q: 'Vision « Santé Sahara 2030 » (200 mots).', pos: 'Vision intégrative puissante.', neg: 'Tech + Trad + Comm.' },
        { type: 'Énigme', q: '« Je guéris sans hôpital… »', options: [{id:'A',label_fr:'Le médicament'},{id:'B',label_fr:'La médecine humaine'}], correct: 'B', pos: 'L’essence du soin.', neg: 'Indice : Karim.' }
      ]
    }
  ]
};

async function importLaayoune() {
  console.log('🚀 Starting Laâyoune STANDARDIZED (Acte V) import...');
  
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(LAAYOUNE_DATA.city);
  if (cityErr) console.error('City error:', cityErr);
  else console.log('✅ City Laâyoune upserted');

  for (const mission of LAAYOUNE_DATA.missions) {
    const missionId = MISSION_IDS[mission.id];
    
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: LAAYOUNE_CHALLENGE_PK,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: LAAYOUNE_CHALLENGE_PK
      });
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr);
    else console.log(`✅ Mission ${mission.id} upserted`);

    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'Appariement') optionsData = { pairs: q.pairs };
      else if (q.type === 'Scénario en cascade') optionsData = { steps: q.steps };
      else if (q.type === 'Détection d’erreurs' || q.type === 'Détection + création') optionsData = { errors: q.errors };
      else if (q.type === 'Classement' || q.type === 'Classement créatif') optionsData = { order: q.order };
      
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

importLaayoune();
