const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

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

const LAAYOUNE_DATA = {
  city: {
    id: LAAYOUNE_CHALLENGE_PK,
    city_id: 'laayoune',
    city_name_fr: 'Laâyoune',
    city_name_ar: 'العيون',
    headline_fr: 'Porte du Désert - Création',
    description_fr: 'Laâyoune vous invite à créer là où rien n’existe. Vous allez inventer des réponses originales à des problèmes inédits.',
    focus_fr: 'Création & Innovation',
    illustration_url: 'https://images.unsplash.com/photo-1548685913-fe6678babe0d?q=80&w=2000&auto=format&fit=crop',
    icon_name: 'desert',
    city_color: '#f59e0b',
    sort_order: 5,
    is_published: true
  },
  missions: [
    {
       id: 'L1', title: 'L1 - Protection Civile',
       questions: [
         { type: 'QCM', q: 'Inondation désertique. Pas de protocole. Action ?', options: [{id:'A',label_fr:'Attendre'},{id:'B',label_fr:'Inventer un système de digues avec les moyens du bord.'}], correct:'B' },
         { type: 'Scénario en cascade', q: 'Sauvetage nomades', steps: [{question:'Sable mouvant. Moyen ?', responses:[{id:'A',text:'Rien'},{id:'B',text:'Cordes de chameau + planches de bois.'}], correct:'B'}] },
         { type: 'Dialogue de situation', q: 'Rassurer les familles sans mentir.', options: [{id:'A',label_fr:'« Tout va bien »'},{id:'B',label_fr:'« On fait le maximum, voici les 3 étapes... »'}], correct:'B' },
         { type: 'Vrai/Faux', q: 'Créer demande du calme.', correct: 'vrai' },
         { type: 'Détection d’erreurs', q: 'Faille dans l’improvisation.', errors: [{id:'1',text_fr:'Oublier la sécurité de base',is_error:true}], pos: 'Création sécurisée.' },
         { type: 'Texte à trous', q: 'Principes de survie créative.', options: [{id:'1',text:'Ressources'},{id:'2',text:'Ingéniosité'}], correct: 'Ressources, Ingeniosité' },
         { type: 'Classement', q: 'Priorités urgence.', order: [{id:'1',label_fr:'Vies'},{id:'2',label_fr:'Eau'},{id:'3',label_fr:'Matériel'}], pos: 'L’humain prime.' },
         { type: 'Contre-la-montre', q: '4 décisions flash survie.', steps: [{question:'S’orienter ?', responses:[{id:'A',text:'Étoiles'},{id:'B',text:'Soleil'}], correct:'A'}] },
         { type: 'Réponse courte', q: 'Nouveau protocole d’urgence.', pos: 'Innovation salvatrice.' },
         { type: 'Énigme', q: '« Je suis la source au milieu du sable... »', correct: 'L’oasis' }
       ]
    },
    {
       id: 'L2', title: 'L2 - Coopérative Femmes',
       questions: [
         { type: 'Rôles d’équipe', q: 'Lancer une marque. 5 rôles.', options: [{id:'1',text:'Prod -> Aicha'},{id:'2',text:'Vente -> Fatima'}], correct:'ALL' },
         { type: 'QCM', q: 'Design du produit. Innovant ou traditionnel ?', options: [{id:'A',label_fr:'Vieux'},{id:'B',label_fr:'Moderne'},{id:'C',label_fr:'Fusion (Tradition + Design moderne).'}], correct:'C' },
         { type: 'Dialogue de situation', q: 'Gérer une jalousie.', options: [{id:'A',label_fr:'Ignorer'},{id:'B',label_fr:'Valoriser chaque talent publiquement.'}], correct:'B' },
         { type: 'Vrai/Faux', q: 'La création est collective.', correct: 'vrai' },
         { type: 'Détection d’erreurs', q: 'Erreurs de branding.', errors: [{id:'1',text_fr:'Pas d’histoire',is_error:true}], pos: 'Le Storytelling.' },
         { type: 'Texte à trous', q: 'Économie sociale et solidaire.', options: [{id:'1',text:'Partage'},{id:'2',text:'Dignité'}], correct: 'Partage, Dignité' },
         { type: 'Scénario en cascade', q: 'Lancement site web', steps: [{question:'Pas d’internet. Solution ?', responses:[{id:'A',text:'Abandonner'},{id:'B',text:'Réseau local + point de relais en ville.'}], correct:'B'}] },
         { type: 'Classement', q: 'Étapes création entreprise.', order: [{id:'1',label_fr:'Idée'},{id:'2',label_fr:'Test'},{id:'3',label_fr:'Vente'}], pos: 'Lean Startup.' },
         { type: 'Réponse courte', q: 'Pitch de la coopérative.', pos: 'Convaincre avec le cœur.' },
         { type: 'Énigme', q: '« Tissée à plusieurs mains, je réchauffe les cœurs... »', correct: 'La solidarité' }
       ]
    },
    {
       id: 'L3', title: 'L3 - Santé décentralisée',
       questions: [
         { type: 'QCM', q: 'Soigner à distance (télémédecine). Obstacle ?', options: [{id:'A',label_fr:'Langue'},{id:'B',label_fr:'Confiance'},{id:'C',label_fr:'Confiance + Technique.'}], correct:'C' },
         { type: 'Scénario en cascade', q: 'Épidémie locale', steps: [{question:'Pas d’hôpital proche. Action ?', responses:[{id:'A',text:'Transfert'},{id:'B',text:'Unité mobile + formation relais locaux.'}], correct:'B'}] },
         { type: 'Dialogue de situation', q: 'Convaincre un chef de village.', options: [{id:'A',label_fr:'Forcer'},{id:'B',label_fr:'Expliquer les bénéfices pour les enfants.'}], correct:'B' },
         { type: 'Vrai/Faux', q: 'Créer des systèmes = durabilité.', correct: 'vrai' },
         { type: 'Détection d’erreurs', q: 'Failles hygiène.', errors: [{id:'1',text_fr:'Eau non bouillie',is_error:true}], pos: 'Prévention.' },
         { type: 'Texte à trous', q: 'Santé pour tous.', options: [{id:'1',text:'Accès'},{id:'2',text:'Prévention'}], correct: 'Accès, Prévention' },
         { type: 'Classement', q: 'Priorités médicales.', order: [{id:'1',label_fr:'Urgences'},{id:'2',label_fr:'Vaccins'},{id:'3',label_fr:'Suivi'}], pos: 'Triage.' },
         { type: 'Contre-la-montre', q: 'Gestes de secours.', steps: [{question:'Saignement ?', responses:[{id:'A',text:'Appuyer'},{id:'B',text:'Lever'}], correct:'A'}] },
         { type: 'Réponse courte', q: 'Plan santé mobile.', pos: 'Ingéniosité sociale.' },
         { type: 'Énigme', q: '« Je voyage dans une mallette mais sauve des vies... »', correct: 'Le kit de secours' }
       ]
    },
    {
       id: 'L4', title: 'L4 - Innovation frugale',
       questions: [
         { type: 'QCM', q: 'Frigo sans électricité (Zeer pot). Principe ?', options: [{id:'A',label_fr:'Glace'},{id:'B',label_fr:'Évaporation eau entre deux pots de terre.'}], correct:'B' },
         { type: 'Dialogue de situation', q: 'Vendre l’innovation frugale.', options: [{id:'A',label_fr:'« C’est pas cher »'},{id:'B',label_fr:'« C’est efficace, local et durable. »'}], correct:'B' },
         { type: 'Vrai/Faux', q: 'L’innovation est toujours high-tech.', correct: 'faux' },
         { type: 'Détection d’erreurs', q: 'Faille technique low-tech.', errors: [{id:'1',text_fr:'Mauvaise étanchéité',is_error:true}], pos: 'Rigueur technique.' },
         { type: 'Texte à trous', q: 'Jugaad innovation.', options: [{id:'1',text:'Simple'},{id:'2',text:'Ingénieux'}], correct: 'Simple, Ingenieux' },
         { type: 'Scénario en cascade', q: 'Pompe à eau solaire DIY', steps: [{question:'Pas de panneau. Alternative ?', responses:[{id:'A',text:'Vélos'},{id:'B',text:'Éolienne bois + transmission cuir.'}], correct:'B'}] },
         { type: 'Classement', q: 'Processus créatif.', order: [{id:'1',label_fr:'Besoin'},{id:'2',label_fr:'Bricolage'},{id:'3',label_fr:'Solution'}], pos: 'L’agilité.' },
         { type: 'Contre-la-montre', q: 'Réparer un outil cassé.', steps: [{question:'Colle ou Fil ?', responses:[{id:'A',text:'Colle'},{id:'B',text:'Fil de fer'}], correct:'B'}] },
         { type: 'Réponse courte', q: 'Inventez un outil pour le désert.', pos: 'Imagination fertile.' },
         { type: 'Énigme', q: '« Je fais beaucoup avec presque rien... Qui suis-je ? »', correct: 'La frugalité' }
       ]
    },
    {
       id: 'L5', title: 'L5 - Plan développement',
       questions: [
         { type: 'QCM', q: 'Vision 2050 pour Laâyoune.', options: [{id:'A',label_fr:'Béton'},{id:'B',label_fr:'Hub vert + Solaire + Savoir local.'}], correct:'B' },
         { type: 'Scénario en cascade', q: 'Synthèse Acte V', steps: [{question:'Soft skill dominant ?', responses:[{id:'A',text:'Création'}], correct:'A'}] },
         { type: 'Dialogue de situation', q: 'Inspirer la jeunesse.', options: [{id:'A',label_fr:'« Travaillez »'},{id:'B',label_fr:'« Le désert est une page blanche, écrivez votre futur. »'}], correct:'B' },
         { type: 'Vrai/Faux', q: 'Créer est le stade ultime de Bloom (avant maîtrise).', correct: 'vrai' },
         { type: 'Détection d’erreurs', q: 'Failles plan long terme.', errors: [{id:'1',text_fr:'Ignorer l’eau',is_error:true}], pos: 'Réalisme.' },
         { type: 'Texte à trous', q: 'Durable, Désirable, Faisable.', options: [{id:'1',text:'Futur'},{id:'2',text:'Projet'}], correct: 'Futur, Projet' },
         { type: 'Classement', q: 'Piliers développement.', order: [{id:'1',label_fr:'Eau'},{id:'2',label_fr:'Énergie'},{id:'3',label_fr:'Éducation'}], pos: 'Les bases.' },
         { type: 'Contre-la-montre', q: 'Choisir un projet prioritaire.', steps: [{question:'Solaire ou Route ?', responses:[{id:'A',text:'Solaire'},{id:'B',text:'Route'}], correct:'A'}] },
         { type: 'Réponse courte', q: 'Votre héritage à Laâyoune.', pos: 'Bâtisseur de futur.' },
         { type: 'Énigme', q: '« Je suis la porte de demain... »', correct: 'La vision' }
       ]
    }
  ]
};

async function importLaayoune() {
  console.log('🚀 Starting Laâyoune FINAL import...');
  const { error: cityErr } = await supabase.from('challenges').upsert(LAAYOUNE_DATA.city);
  if (cityErr) return console.error('❌ City Error:', cityErr);
  console.log('✅ City Laâyoune Upserted');

  for (const mData of LAAYOUNE_DATA.missions) {
    const missionId = MISSION_IDS[mData.id];
    await supabase.from('missions').upsert({
      id: missionId, city_id: LAAYOUNE_CHALLENGE_PK, challenge_id: LAAYOUNE_CHALLENGE_PK,
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
importLaayoune();
