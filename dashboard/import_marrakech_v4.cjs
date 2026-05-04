require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  'Énigme ultime': 'puzzle_riddle',
  'Vrai/Faux analytique': 'vrai_faux'
};

const MARRAKECH_DATA = {
  city: {
    id: MARRAKECH_CHALLENGE_PK,
    city_id: 'marrakech',
    city_name_fr: 'Marrakech',
    city_name_ar: 'مراكش',
    headline_fr: 'La Perle du Sud',
    description_fr: 'Marrakech, ville du business et du tourisme, vous invite à évaluer : juger la qualité des décisions, critiquer avec des arguments solides, choisir entre des options toutes valables, et justifier vos choix avec des critères explicites.',
    focus_fr: 'Jugement & Évaluation',
    illustration_url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=2070&auto=format&fit=crop',
    icon_name: 'palmtree',
    city_color: '#e11d48',
    sort_order: 4,
    is_published: true,
    acte_title: 'ACTE IV - MARRAKECH : ÉVALUATION'
  },
  missions: [
    {
      id: 'M1', title: 'La Startup Tech',
      questions: [
        { type: 'QCM', q: 'MarocDigital doit décider : investir 500K DH dans une fonctionnalité OU améliorer le marketing. Quelle méthode est la plus appropriée ?', options: [{id:'A',label_fr:'Vote à main levée'}, {id:'B',label_fr:'Intuition'}, {id:'C',label_fr:'Analyse coûts-bénéfices + test A/B + décision comité.'}], correct: 'C', pos: 'Évaluation méthodologique parfaite ! Données + test + comité = objectivité.', neg: 'Vote = Groupthink. Optez pour des preuves.' },
        { type: 'Scénario en cascade', q: 'Évaluation des arguments', steps: [{question:'CTO dit « Le pivot va tout casser ». Évaluez.', responses:[{id:'A',text:'Vrai'},{id:'B',text:'Crainte légitime mais ignore le coût de ne pas changer. Valide à 60%.'}], correct:'B', pos:'Évaluation nuancée ! Pas de jugement binaire.', neg:'Nuancez vos propos.'},{question:'CFO dit « Les chiffres disent : restez ». Évaluez.', responses:[{id:'A',text:'Argument solide (75%) mais insuffisant seul : les chiffres décrivent le passé.'},{id:'B',text:'Infaillible'}], correct:'A', pos:'Les données sont essentielles mais pas suffisantes.', neg:'Ajoutez une analyse prospective.'}] },
        { type: 'Détection d’erreurs', q: 'Évaluez la proposition d’investissement. Trouvez les 7 erreurs.', errors: [{id:'1',text_fr:'51% = perte de contrôle',is_error:true},{id:'2',text_fr:'Non-concurrence 10 ans',is_error:true},{id:'3',text_fr:'Rendement 500% en 3 ans',is_error:true},{id:'4',text_fr:'Signez avant vendredi (pression)',is_error:true}], pos: 'Due diligence parfaite ! Chaque clause évaluée.', neg: 'Relisez les clauses de contrôle et de pression.' },
        { type: 'Vrai/Faux', q: '« La meilleure décision est celle qui plaît à tout le monde. »', correct: 'faux', pos: 'Le consensus n’est pas l’objectif. L’important est d’être juste.', neg: 'Les grandes décisions déplaisent parfois.' },
        { type: 'Appariement', q: 'Reliez chaque situation au style Hersey & Blanchard.', pairs: [{id:'1',left_fr:'Novice motivé',right_fr:'Directif'},{id:'2',left_fr:'Expert démotivé',right_fr:'Participatif'},{id:'3',left_fr:'Expert motivé',right_fr:'Délégatif'}], pos: 'Évaluation situationnelle parfaite !', neg: 'Adaptez le style au niveau de maturité.' },
        { type: 'Texte à trous', q: 'Cycle Lean Startup', options: [{id:'1',text:'hypothèse'},{id:'2',text:'mesurer'},{id:'3',text:'pivoter'}], correct: 'hypothèse, mesurer, pivoter', pos: 'Cycle Lean Startup maîtrisé !', neg: 'Hypothèse → Mesure → Pivot.' },
        { type: 'Contre-la-montre', q: 'Évaluations flash en startup', steps: [{question:'3 clients demandent une fonction à 100K. Action ?', responses:[{id:'A',text:'Oui'},{id:'B',text:'Non, sauf si marché ≥500 utilisateurs.'}], correct:'B', pos:'Évaluer sur données, pas sur émotion.', neg:'Vérifiez la demande réelle.'},{question:'Concurrent vous copie. Gravité ?', responses:[{id:'A',text:'Moyenne. L’expérience client est impossible à copier.'},{id:'B',text:'Critique'}], correct:'A', pos:'Différenciez-vous par le service.', neg:'Ne paniquez pas.'}] },
        { type: 'Réponse courte', q: 'Évaluez MarocDigital (150 mots) : SWOT + Recommandation.', pos: 'Évaluation SWOT argumentée !', neg: 'Justifiez vos choix.' },
        { type: 'Prise de décision', q: 'Choisir le financement : A) BA (500K/15%), B) Fonds éthique (1.5M/30% + réseau).', options: [{id:'A',label_fr:'A'},{id:'B',label_fr:'B. Ratio acceptable + valeur ajoutée réseau.'}], correct: 'B', pos: 'La meilleure option n’est pas la plus riche mais la plus adaptée.', neg: 'Évaluez la gouvernance et le réseau.' },
        { type: 'Énigme', q: '« L’amateur dit J’AIME, le maître dit VOICI POURQUOI… »', options: [{id:'A',label_fr:'L’opinion'},{id:'B',label_fr:'Le jugement évaluatif'}], correct: 'B', pos: 'L’évaluation sépare l’amateur du maître.', neg: 'Opinion ≠ Jugement argumenté.' }
      ]
    },
    {
      id: 'M2', title: 'Riad de Luxe – Interculturel',
      questions: [
        { type: 'QCM', q: 'Chef Kenji (japonais) dit « oui » puis fait à sa façon. Problème ?', options: [{id:'A',label_fr:'Incompétence'}, {id:'B',label_fr:'Culturel : dire « non » à un chef est impoli au Japon.'}], correct: 'B', pos: 'Évaluation interculturelle juste (Hofstede).', neg: 'C’est une différence culturelle.' },
        { type: 'Scénario en cascade', q: 'Tensions interculturelles', steps: [{question:'« Les Français sont arrogants ». Évaluez.', responses:[{id:'A',text:'Vrai'},{id:'B',text:'Ressenti légitime mais généralisation abusive (50% biais).'}], correct:'B', pos:'Évaluation nuancée.', neg:'Évitez les généralisations.'},{question:'Solution ?', responses:[{id:'A',text:'Formation'},{id:'B',text:'Médiation où chacun évalue ses biais + règles communes.'}], correct:'B', pos:'Solution systémique par la co-création.', neg:'Impliquez les parties.'}] },
        { type: 'Classement', q: 'Évaluez les managers /10.', order: [{id:'1',label_fr:'Youssef (8/10)'},{id:'2',label_fr:'Omar (7/10)'},{id:'3',label_fr:'Sarah (6/10)'},{id:'4',label_fr:'Karim (5/10)'}], pos: 'Évaluation multi-critères : technique + humain.', neg: 'Le management humain compte.' },
        { type: 'Détection d’erreurs', q: 'Audit stratégie RH', errors: [{id:'1',text_fr:'Caméras partout',is_error:true},{id:'2',text_fr:'Bonus compétition toxique',is_error:true},{id:'3',text_fr:'Formation en FR seulement',is_error:true}], pos: 'Audit RH évaluatif complet.', neg: 'Défiance, compétition, exclusion.' },
        { type: 'Dialogue de situation', q: 'Client VIP furieux. Réponse évaluative ?', options: [{id:'A',label_fr:'Capituler'}, {id:'B',label_fr:'Identifier ce qui est vrai, nuancer l’interprétation, compensation juste.'}], correct: 'B', pos: 'Compensez ce qui est justifié uniquement.', neg: 'Distinguez le fait de l’émotion.' },
        { type: 'Texte à trous', q: 'Hofstede', options: [{id:'1',text:'distance'},{id:'2',text:'individualisme'},{id:'3',text:'masculinité'}], correct: 'distance, individualisme, masculinité', pos: '6 dimensions maîtrisées.', neg: 'Outils d’analyse interculturelle.' },
        { type: 'Scénario en cascade', q: 'Licenciement délicat', steps: [{question:'Karim est toxique. Gravité ?', responses:[{id:'A',text:'Normale'},{id:'B',text:'Élevée (8/10) : pattern systémique.'}], correct:'B', pos:'Turnover coûteux et climat détruit.', neg:'3 démissions = pattern.'},{question:'Approche ?', responses:[{id:'A',text:'Humilier'},{id:'B',text:'Licenciement avec dignité et respect.'}], correct:'B', pos:'L’exécution compte autant que la décision.', neg:'Gardez la dignité.'}] },
        { type: 'Contre-la-montre', q: 'Flash RH', steps: [{question:'CV instable. Action ?', responses:[{id:'A',text:'Rejeter'},{id:'B',text:'Creuser les raisons des départs.'}], correct:'B', pos:'Ne jugez pas en surface.', neg:'Investiguez.'},{question:'Plainte retard. Action ?', responses:[{id:'A',text:'Sanction'},{id:'B',text:'Vérifiez les causes réelles.'}], correct:'B', pos:'Sanction sans info = erreur.', neg:'Écoutez d’abord.'}] },
        { type: 'Réponse courte', q: 'Plan d’amélioration Riad (150 mots).', pos: 'Plan ciblé et mesurable.', neg: 'Indiquez des KPI.' },
        { type: 'Énigme', q: '« Je vois 8 couleurs là où d’autres n’en voient qu’une… »', options: [{id:'A',label_fr:'L’empathie'},{id:'B',label_fr:'L’intelligence interculturelle'}], correct: 'B', pos: 'Différence sans jugement.', neg: 'Clé du management moderne.' }
      ]
    },
    {
      id: 'M3', title: 'Souk Semmarine – Commerce',
      questions: [
        { type: 'QCM', q: 'Offre à 20% du prix au souk. Évaluation ?', options: [{id:'A',label_fr:'Bonne'}, {id:'B',label_fr:'Rationnelle (ancrage) mais offensive culturellement.'}], correct: 'B', pos: 'Le contexte prime sur la théorie pure.', neg: 'Offense au souk < 40%.' },
        { type: 'Scénario en cascade', q: 'Analyses Négos', steps: [{question:'Céder à -55% en 2 min. Évaluation ?', responses:[{id:'A',text:'OK'},{id:'B',text:'Mauvaise : pas de BATNA, panique.'}], correct:'B', pos:'Concession trop rapide = pas de négo.', neg:'Préparez votre seuil.'},{question:'Silence du client. Action ?', responses:[{id:'A',text:'Baisser le prix'},{id:'B',text:'Attendre (le silence est une arme).'}], correct:'B', pos:'Ne négociez pas contre vous-même.', neg:'Attendez.'}] },
        { type: 'Détection d’erreurs', q: 'Plan « Vendre plus ». Erreurs ?', errors: [{id:'1',text_fr:'Baisser prix 30%',is_error:true},{id:'2',text_fr:'Supprimer le thé',is_error:true},{id:'3',text_fr:'Prix fixes au souk',is_error:true}], pos: 'La valeur n’est pas le prix.', neg: 'Thé = ROI 30 000%.' },
        { type: 'Appariement', q: 'Tactiques & Évaluation', pairs: [{id:'1',left_fr:'Montrer un défaut',right_fr:'Crée confiance'},{id:'2',left_fr:'BATNA',right_fr:'Donne pouvoir'},{id:'3',left_fr:'Walk away',right_fr:'Pression ultime'}], pos: 'Évaluation tactique juste.', neg: 'Outils de négo.' },
        { type: 'Dialogue de situation', q: 'Client bluffe sur le prix concurrent. Réponse ?', options: [{id:'A',label_fr:'Céder'}, {id:'B',label_fr:'« À ce prix, je vous en achète 100 ! Mais vous n’en trouverez pas. Mon prix est... »'}], correct: 'B', pos: 'Déjouer le bluff sans humilier.', neg: 'Jouez le jeu avec intelligence.' },
        { type: 'Classement', q: 'ROI Long Terme', order: [{id:'1',label_fr:'Qualité'},{id:'2',label_fr:'Expérience'},{id:'3',label_fr:'Programme Fidélité'},{id:'4',label_fr:'Prix Bas'}], pos: 'La qualité rapporte plus que le prix bas.', neg: 'Prix bas = 0 marge.' },
        { type: 'Texte à trous', q: 'BATNA', options: [{id:'1',text:'meilleure'},{id:'2',text:'alternative'},{id:'3',text:'seuil'}], correct: 'meilleure, alternative, seuil', pos: 'BATNA maîtrisée.', neg: 'Alternative de repli.' },
        { type: 'Contre-la-montre', q: 'Flash Souk', steps: [{question:'Client : « Je reviens ». Action ?', responses:[{id:'A',text:'Oublier'},{id:'B',text:'Plusieurs causes possibles. Ne concluez pas.'}], correct:'B', pos:'Évitez les conclusions hâtives.', neg:'Soyez patient.'},{question:'Concurrent baisse de 20%. Action ?', responses:[{id:'A',text:'Baisser aussi'},{id:'B',text:'Augmenter la valeur/service.'}], correct:'B', pos:'Ne tuez pas votre marge.', neg:'Compétez sur la valeur.'}] },
        { type: 'Réponse courte', q: 'Changement/Préservation Souk (150 mots).', pos: 'Modernisation équilibrée.', neg: 'Gardez l’âme.' },
        { type: 'Énigme', q: '« Je suis l’art de savoir quand dire OUI et NON… »', options: [{id:'A',label_fr:'L’instinct'},{id:'B',label_fr:'La négociation évaluée'}], correct: 'B', pos: 'Évaluation stratégique continue.', neg: 'Négo évaluée.' }
      ]
    },
    {
      id: 'M4', title: 'Palais Selman – Événementiel',
      questions: [
        { type: 'Prise de décision', q: 'Crises Mariage. Priorité ?', options: [{id:'A',label_fr:'Logistique'}, {id:'B',label_fr:'Mariée panique (Priorité émotionnelle)'}], correct: 'B', pos: 'Sans mariée, pas de mariage. Priorité 1.', neg: 'L’émotion passe avant les chaises.' },
        { type: 'Scénario en cascade', q: 'Mariée en panique', steps: [{question:'Hyperventilation. Action ?', responses:[{id:'A',text:'Urgence'},{id:'B',text:'4-7-8 + Présence silencieuse.'}], correct:'B', pos:'Diagnostic juste : anxiété ≠ urgence.', neg:'Utilisez la respiration.'},{question:'« Je ne suis pas sûre ». Réponse ?', responses:[{id:'A',text:'Normal'},{id:'B',text:'« Qu’est-ce qui t’a fait dire OUI au début ? »'}], correct:'B', pos:'Recentrage sur le positif.', neg:'Posez une question ouverte.'}] },
        { type: 'Détection d’erreurs', q: 'Audit Planning Mariage', errors: [{id:'1',text_fr:'Zéro Plan B',is_error:true},{id:'2',text_fr:'Gâteau non réfrigéré',is_error:true},{id:'3',text_fr:'Pas de marge temps',is_error:true}], pos: 'Audit événementiel pro.', neg: 'Anticipez l’imprévu.' },
        { type: 'Appariement', q: 'Impact × Contrôlabilité', pairs: [{id:'1',left_fr:'Pluie',right_fr:'Impact haut / Contrôle bas'},{id:'2',left_fr:'DJ absent',right_fr:'Impact haut / Contrôle haut (backup)'},{id:'3',left_fr:'Chaises abîmées',right_fr:'Impact bas / Contrôle haut'}], pos: 'Évaluation des risques matricielle.', neg: 'Impact vs Contrôle.' },
        { type: 'Texte à trous', q: 'Protocole Zineb', options: [{id:'1',text:'respirer'},{id:'2',text:'évaluer'},{id:'3',text:'déléguer'}], correct: 'respirer, évaluer, déléguer', pos: 'Méthode systématique sous pression.', neg: 'Étapes de gestion de crise.' },
        { type: 'Dialogue de situation', q: 'Traiteur en retard (20 portions moins). Réponse ?', options: [{id:'A',label_fr:'Accepter'}, {id:'B',label_fr:'Paiement 70% + livraison urgente. Fin de contrat.'}], correct: 'B', pos: 'Négociation évaluative ferme.', neg: 'Sanctionnez le défaut.' },
        { type: 'Scénario en cascade', q: 'Orage Cocktail', steps: [{question:'Orage imminent. Action ?', responses:[{id:'A',text:'Minimiser'},{id:'B',text:'Bâches + Préparation intérieur (Plan B).'}], correct:'B', pos:'Sécurité et précaution.', neg:'Ne minimisez pas.'},{question:'Communication invités ?', responses:[{id:'A',text:'Panique'},{id:'B',text:'Info transparente + Autonomie de choix.'}], correct:'B', pos:'L’info calme la panique.', neg:'Donnez le choix.'}] },
        { type: 'Classement', q: 'Critères de succès Mariage', order: [{id:'1',label_fr:'Sérénité mariée'},{id:'2',label_fr:'Sécurité'},{id:'3',label_fr:'Expérience'},{id:'4',label_fr:'Ponctualité'}], pos: 'Évaluation centrée sur l’humain.', neg: 'La mariée est le KPI.' },
        { type: 'Réponse courte', q: 'Rapport post-mariage (150 mots).', pos: 'Diagnostic des causes et solutions.', neg: 'Analysez l’incident.' },
        { type: 'Énigme', q: '« Je suis la matrice qui sépare l’urgent de l’important… »', options: [{id:'A',label_fr:'Eisenhower'},{id:'B',label_fr:'Matrice Impact/Contrôle'}], correct: 'B', pos: 'Évaluation avancée des risques.', neg: 'Matrice de crise.' }
      ]
    },
    {
      id: 'M5', title: 'Palais des Congrès – Synthèse',
      questions: [
        { type: 'Prise de décision', q: 'Dernier défi : Choisir le projet de l\'année. A, B ou C ?', options: [{id:'A',label_fr:'Projet A (Profit max)'}, {id:'B',label_fr:'Projet B (Impact social + Viabilité)'}], correct: 'B', pos: 'Synthèse évaluative : Profit ≠ Valeur.', neg: 'Évaluez l’impact global.' },
        { type: 'Scénario en cascade', q: 'Défense de vision', steps: [{question:'Opposition forte. Action ?', responses:[{id:'A',text:'Céder'},{id:'B',text:'Évaluer les critiques, intégrer les 20% valides, rejeter le reste.'}], correct:'B', pos:'Leadership évaluatif : flexible mais ferme.', neg:'Écoutez sans capituler.'},{question:'Vote final. Biais à éviter ?', responses:[{id:'A',text:'Objectivité'},{id:'B',text:'Biais de confirmation et effet de halo.'}], correct:'B', pos:'Vigilance finale contre les biais.', neg:'Restez neutre.'}] },
        { type: 'Appariement', q: 'Synthèse Acte IV', pairs: [{id:'1',left_fr:'Startup',right_fr:'Due diligence'},{id:'2',left_fr:'Riad',right_fr:'Interculturel'},{id:'3',left_fr:'Souk',right_fr:'BATNA'},{id:'4',left_fr:'Palais',right_fr:'Impact/Contrôle'}], pos: 'Toute la boîte à outils évaluative maîtrisée.', neg: 'Reliez outils et lieux.' },
        { type: 'Détection d’erreurs', q: 'Audit final de votre parcours Marrakech', errors: [{id:'1',text_fr:'Jugement sans preuve',is_error:true},{id:'2',text_fr:'Généralisation culturelle',is_error:true},{id:'3',text_fr:'Concession sans BATNA',is_error:true}], pos: 'Esprit critique appliqué à soi-même.', neg: 'Évitez vos propres pièges.' },
        { type: 'Classement', q: 'Valeurs du Leader Évaluateur', order: [{id:'1',label_fr:'Intégrité'},{id:'2',label_fr:'Objectivité'},{id:'3',label_fr:'Nuance'},{id:'4',label_fr:'Rapidité'}], pos: 'L’intégrité est le socle de l’évaluation.', neg: 'Objectif avant rapide.' },
        { type: 'Texte à trous', q: 'La Maîtrise de l’Évaluation', options: [{id:'1',text:'critères'},{id:'2',text:'preuves'},{id:'3',text:'justification'}], correct: 'critères, preuves, justification', pos: 'Vous savez maintenant JUGER.', neg: 'Critères/Preuves/Arguments.' },
        { type: 'Dialogue de situation', q: 'Un collègue dit « On ne peut pas tout évaluer ». Votre réponse ?', options: [{id:'A',label_fr:'D’accord'}, {id:'B',label_fr:'« On peut tout évaluer si on a les bons indicateurs (quantis ou qualis). »'}], correct: 'B', pos: 'Tout est évaluable avec rigueur.', neg: 'Défendez la méthode.' },
        { type: 'Vrai/Faux analytique', q: '« Évaluer, c’est critiquer. »', correct: 'faux', pos: 'Évaluer, c’est estimer la valeur (positive ou négative).', neg: 'C’est une estimation de valeur.' },
        { type: 'Réponse courte', q: 'Synthèse de votre voyage à Marrakech (200 mots).', pos: 'Synthèse magistrale !', neg: 'Maîtrise du jugement argumenté.' },
        { type: 'Énigme ultime', q: '« Je suis la balance entre l’ombre et la lumière, entre le prix et la valeur… Qui suis-je ? »', options: [{id:'A',label_fr:'La ville'},{id:'B',label_fr:'Le Jugement Évaluatif'}], correct: 'B', pos: 'Félicitations ! Vous êtes un Évaluateur accompli.', neg: 'Indice : Le but de l’Acte IV.' }
      ]
    }
  ]
};

async function importMarrakech() {
  console.log('🚀 Starting Marrakech STANDARDIZED (Acte IV) import...');
  
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(MARRAKECH_DATA.city);
  if (cityErr) console.error('City error:', cityErr);
  else console.log('✅ City Marrakech upserted');

  for (const mission of MARRAKECH_DATA.missions) {
    const missionId = MISSION_IDS[mission.id];
    
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: MARRAKECH_CHALLENGE_PK,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: MARRAKECH_CHALLENGE_PK
      });
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr);
    else console.log(`✅ Mission ${mission.id} upserted`);

    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'Appariement') optionsData = { pairs: q.pairs };
      else if (q.type === 'Scénario en cascade') optionsData = { steps: q.steps };
      else if (q.type === 'Détection d’erreurs') optionsData = { errors: q.errors };
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

importMarrakech();
