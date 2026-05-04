require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const FES_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440003';

const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
  F2: '550e8400-e29b-41d4-a716-44665544f222',
  F3: '550e8400-e29b-41d4-a716-44665544f333',
  F4: '550e8400-e29b-41d4-a716-44665544f444',
  F5: '550e8400-e29b-41d4-a716-44665544f555'
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

const FES_DATA = {
  city: {
    id: FES_CHALLENGE_PK,
    city_id: 'fes',
    city_name_fr: 'Fès',
    city_name_ar: 'فاس',
    headline_fr: 'Capitale Spirituelle et Intellectuelle',
    description_fr: 'Fès, plus vieille cité universitaire du monde, vous invite à analyser en profondeur : pourquoi les équipes échouent, comment le stress s’installe, pourquoi les décisions déraillent, et comment tradition et innovation coexistent.',
    focus_fr: 'Analyse & Pensée Critique',
    illustration_url: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?q=80&w=2070&auto=format&fit=crop',
    icon_name: 'landmark',
    city_color: '#1e40af',
    sort_order: 3,
    is_published: true,
    acte_title: 'ACTE III - FÈS : ANALYSE'
  },
  missions: [
    {
      id: 'F1', title: 'L’Atelier de calligraphie',
      questions: [
        { type: 'QCM', q: 'Quel est le principal avantage du modèle maître-apprenti par rapport à un cours théorique ?', options: [{id:'A',label_fr:'Le maître est plus intelligent'}, {id:'B',label_fr:'L’apprenti ne paie pas'}, {id:'C',label_fr:'L’apprentissage se fait dans la pratique réelle, avec feedback immédiat et progressif.'}, {id:'D',label_fr:'C’est plus rapide'}], correct: 'C', pos: 'Analyse correcte ! Pratique réelle, feedback immédiat, progressivité = ZPD de Vygotsky.', neg: 'Non. Le maître n’est pas plus intelligent, juste plus expérimenté. L’avantage est la pratique contextualisée.' },
        { type: 'Appariement', q: 'Relie chaque situation à la dysfonction Lencioni.', pairs: [{id:'1',left_fr:'Hamid cache ses erreurs par peur',right_fr:'Absence de confiance'},{id:'2',left_fr:'Les compagnons évitent de critiquer',right_fr:'Peur du conflit sain'},{id:'3',left_fr:'Samir ne se sent pas concerné par les délais',right_fr:'Évitement de la responsabilité'},{id:'4',left_fr:'Chacun travaille pour soi',right_fr:'Inattention aux résultats'},{id:'5',left_fr:'Kamal refuse de s’engager sur un résultat',right_fr:'Manque d’engagement'}], pos: 'Analyse parfaite ! Pyramide Lencioni : confiance → conflit → engagement → responsabilité → résultats.', neg: 'Vérifiez : 1=confiance, 2=conflit, 3=responsabilité, 4=résultats, 5=engagement.' },
        { type: 'Dialogue de situation', q: 'Hamid a travaillé 3 mois, le maître dit « insuffisant, recommence ». Hamid démissionne. Quelle est la cause profonde ?', options: [{id:'A',label_fr:'Hamid est paresseux'}, {id:'B',label_fr:'Manque de feedback progressif : 3 mois sans retour, puis critique totale = choc émotionnel.'}, {id:'C',label_fr:'Le maître est trop sévère'}, {id:'D',label_fr:'C’est normal dans l’artisanat'}], correct: 'B', pos: 'Analyse systémique ! Absence feedback intermédiaire, négatif uniquement, disproportion effort/reconnaissance.', neg: 'Ne réduisez pas au caractère. La cause est dans la méthode : feedback trop rare et brutal.' },
        { type: 'Scénario en cascade', q: 'Analyse des conflits d\'équipe', steps: [{question:'2 compagnons refusent de travailler ensemble. Phase Tuckman ?', responses:[{id:'A',text:'Forming'},{id:'B',text:'Storming (tempête)'}], correct:'B', pos:'Diagnostic juste. Phase Storming : conflits ouverts.', neg:'Non. C’est Storming (tempête).'},{question:'Pourquoi Kamal (qualité) et Samir (rapidité) sont en conflit ?', responses:[{id:'A',text:'Ils ne s\'aiment pas'},{id:'B',text:'Conflit de rôles Belbin (Analyste vs Réalisateur)'}], correct:'B', pos:'70% des conflits sont des conflits de rôles.', neg:'Ce n’est pas personnel. Valeurs opposées.'},{question:'Solution structurelle ?', responses:[{id:'A',text:'Les séparer'},{id:'B',text:'Kamal contrôle, Samir produit. Complémentarité.'}], correct:'B', pos:'Résolution systémique par restructuration.', neg:'Les séparer ne résout rien.'}] },
        { type: 'Vrai/Faux', q: '« Le meilleur artisan fait automatiquement le meilleur leader. »', correct: 'faux', pos: 'Compétence technique ≠ compétence managériale. Principe de Peter.', neg: 'Faux. Deux compétences distinctes.' },
        { type: 'Détection d’erreurs', q: 'Trouvez les 6 erreurs dans le rapport de l’atelier.', errors: [{id:'1',text_fr:'Pas de hiérarchie',is_error:true},{id:'2',text_fr:'Aucune spécialisation',is_error:true},{id:'3',text_fr:'Feedback annuel',is_error:true},{id:'4',text_fr:'Recrutement sans essai',is_error:true},{id:'5',text_fr:'2 jours théorie puis production',is_error:true},{id:'6',text_fr:'Turnover 80%',is_error:true}], pos: 'Analyse systémique ! Chaque erreur a une conséquence.', neg: 'Relisez : structure, spécialisation, feedback, recrutement.' },
        { type: 'Classement', q: 'Classez les 7 éléments par priorité de transmission.', order: [{id:'1',label_fr:'Éthique'},{id:'2',label_fr:'Philosophie'},{id:'3',label_fr:'Enseigner'},{id:'4',label_fr:'Geste'},{id:'5',label_fr:'Gestion'},{id:'6',label_fr:'Client'},{id:'7',label_fr:'Innovation'}], pos: 'Analyse hiérarchique ! Valeurs d’abord.', neg: 'L’éthique et la philosophie passent avant.' },
        { type: 'Texte à trous', q: 'Modèle de Lave & Wenger', options: [{id:'1',text:'communauté'},{id:'2',text:'participation'},{id:'3',text:'périphérique'},{id:'4',text:'légitime'}], correct: 'communauté, participation, périphérique, légitime', pos: 'Participation périphérique légitime maîtrisée.', neg: 'Relisez les piliers de Lave & Wenger.' },
        { type: 'Réponse courte', q: 'Analysez le leadership de Maître Idris (forces, faiblesses, recommandation).', pos: 'Analyse critique exceptionnelle !', neg: 'Ajoutez des références théoriques.' },
        { type: 'Énigme', q: '« Lencioni me place à la base… Qui suis-je ? »', options: [{id:'A',label_fr:'Le respect'},{id:'B',label_fr:'La confiance'}], correct: 'B', pos: 'Exact ! Base de la pyramide Lencioni.', neg: 'C’est la confiance.' }
      ]
    },
    {
      id: 'F2', title: 'Les Tanneries Chouara',
      questions: [
        { type: 'QCM', q: 'Différence principale entre stress médical (Karim) et tanneries (Saïd) ?', options: [{id:'A',label_fr:'Stress médical est plus grave'}, {id:'B',label_fr:'Karim subit un stress aigu (pics), Saïd un stress chronique (constant).'}], correct: 'B', pos: 'Analyse comparative juste ! Aigu vs Chronique.', neg: 'L’un est intense et court, l’autre constant.' },
        { type: 'Appariement', q: 'Reliez chaque source de stress à sa conséquence.', pairs: [{id:'1',left_fr:'Posture penchée',right_fr:'Ergonomique (TMS)'},{id:'2',left_fr:'Odeurs chimiques',right_fr:'Chimique'},{id:'3',left_fr:'Soleil direct',right_fr:'Environnemental'},{id:'4',left_fr:'Gestes répétitifs',right_fr:'Biomécanique'}], pos: 'Analyse multi-dimensionnelle du stress.', neg: 'Vérifiez les catégories ergonomique/chimique.' },
        { type: 'Scénario en cascade', q: 'Analyse d\'un accident de travail', steps: [{question:'Cause immédiate de la chute ?', responses:[{id:'A',text:'Maladresse'},{id:'B',text:'Multi-facteurs (Fromage Suisse)'}], correct:'B', pos:'Modèle du fromage suisse (Reason). Jamais une seule cause.', neg:'Un accident n’a jamais une seule cause.'},{question:'Cause systémique ?', responses:[{id:'A',text:'Imprudence'},{id:'B',text:'Absence de protocole sécurité'}], correct:'B', pos:'Le problème est dans l’organisation.', neg:'Ce n’est pas l’imprudence.'},{question:'Plan d’amélioration ?', responses:[{id:'A',text:'Punition'},{id:'B',text:'Equipement + Formation + Culture'}], correct:'B', pos:'4 niveaux de défense Reason.', neg:'Punir ne résout rien.'}] },
        { type: 'Dialogue de situation', q: 'Quel pilier de Cyrulnik a sauvé Saïd de sa brûlure ?', options: [{id:'A',label_fr:'Humour'}, {id:'B',label_fr:'Sens (« Ma famille »)'}], correct: 'B', pos: '« Celui qui a un pourquoi peut supporter n’importe quel comment ».', neg: 'Le sens est le pilier le plus prédictif.' },
        { type: 'Détection d’erreurs', q: 'Erreurs dans le planning de Saïd', errors: [{id:'1',text_fr:'5h sans pause',is_error:true},{id:'2',text_fr:'Boire quand on a soif',is_error:true},{id:'3',text_fr:'Pas de gants',is_error:true},{id:'4',text_fr:'Zéro étirement',is_error:true}], pos: 'Analyse ergonomique ! Auto-négligence détectée.', neg: 'Relisez : pauses, hydratation, protection.' },
        { type: 'Texte à trous', q: 'Syndrome général d’adaptation (Selye)', options: [{id:'1',text:'alarme'},{id:'2',text:'résistance'},{id:'3',text:'épuisement'}], correct: 'alarme, résistance, épuisement', pos: 'Modèle Selye maîtrisé !', neg: 'Alarme → résistance → épuisement.' },
        { type: 'Contre-la-montre', q: 'Analyse flash aux tanneries', steps: [{question:'14h/jour depuis 3 mois. Phase ?', responses:[{id:'A',text:'Alarme'},{id:'B',text:'Transition Résistance → Épuisement'}], correct:'B', pos:'L’épuisement approche.', neg:'C’est la fin de la résistance.'},{question:'Lien stress physique/mental ?', responses:[{id:'A',text:'Mêmes mécanismes (cortisol)'},{id:'B',text:'Aucun lien'}], correct:'A', pos:'Le stress est universel au niveau neurobio.', neg:'Mêmes hormones (cortisol).'}] },
        { type: 'Prise de décision', q: 'Moderniser ou préserver ?', options: [{id:'A',label_fr:'Tout moderniser'},{id:'B',label_fr:'Synthèse : Protéger santé + Garder techniques'}], correct: 'B', pos: 'Analyse dialectique ! Protéger sans détruire.', neg: 'Cherchez la 3ème voie.' },
        { type: 'Réponse courte', q: 'Rapport d’analyse : 3 risques, 3 solutions, 1 priorité.', pos: 'Rapport analytique professionnel !', neg: 'Il manque un élément.' },
        { type: 'Énigme', q: '« Selye m’a cartographié… Qui suis-je ? »', options: [{id:'A',label_fr:'La fatigue'},{id:'B',label_fr:'Le stress'}], correct: 'B', pos: 'C’est le stress analytique.', neg: 'C’est le stress.' }
      ]
    },
    {
      id: 'F3', title: 'L’Université – Prise de décision',
      questions: [
        { type: 'QCM', q: '8 personnes, le chef dit « OK », tout le monde se tait malgré des doutes. Type d’erreur ?', options: [{id:'A',label_fr:'Erreur cognitive'}, {id:'B',label_fr:'Groupthink (Janis)'}], correct: 'B', pos: 'Groupthink : la pression du groupe tue la pensée critique.', neg: 'C’est une erreur sociale : Groupthink.' },
        { type: 'Scénario en cascade', q: 'Analyse d\'un échec e-commerce', steps: [{question:'Données manquantes lors de la collecte ?', responses:[{id:'A',text:'Rien'},{id:'B',text:'Compétences, coûts, concurrence'}], correct:'B', pos:'Phase 2 Simon bâclée.', neg:'L’information n’était pas complète.'},{question:'Pourquoi le vote 60/40 a échoué ?', responses:[{id:'A',text:'Malchance'},{id:'B',text:'Biais de disponibilité + Groupthink'}], correct:'B', pos:'Les biais ont faussé le vote.', neg:'La majorité n’a pas toujours raison.'},{question:'Quelle approche Lean ?', responses:[{id:'A',text:'Tout investir'},{id:'B',text:'Phase pilote MVP'}], correct:'B', pos:'Tester petit avant d’investir grand.', neg:'Le tout ou rien est risqué.'}] },
        { type: 'Appariement', q: 'Reliez la situation au biais.', pairs: [{id:'1',left_fr:'Tramway comme Rabat',right_fr:'Conformité'},{id:'2',left_fr:'« Mon père faisait ainsi »',right_fr:'Ancrage'},{id:'3',left_fr:'Choisir le plus célèbre',right_fr:'Halo'}], pos: 'Analyse contextualisée des biais !', neg: 'Vérifiez conformité/ancrage/halo.' },
        { type: 'Détection d’erreurs', q: 'Erreurs dans l’étude de marché', errors: [{id:'1',text_fr:'15 amis',is_error:true},{id:'2',text_fr:'100% de oui',is_error:true},{id:'3',text_fr:'Zéro business plan',is_error:true},{id:'4',text_fr:'Instinct pur',is_error:true}], pos: 'Audit méthodologique impeccable !', neg: 'Échantillon, complaisance, plan.' },
        { type: 'Classement', q: 'Priorités de succès stratégique', order: [{id:'1',label_fr:'Qualité'},{id:'2',label_fr:'Adaptation'},{id:'3',label_fr:'Coûts'},{id:'4',label_fr:'Innovation'}], pos: 'Stratégie hiérarchique : Base → Innovation.', neg: 'La qualité est la base.' },
        { type: 'Texte à trous', q: 'Simon enrichi (Anti-Groupthink)', options: [{id:'1',text:'collecter'},{id:'2',text:'générer'},{id:'3',text:'feedback'},{id:'4',text:'avocat du diable'}], correct: 'collecter, générer, feedback, avocat du diable', pos: 'Mécanisme anti-groupthink intégré.', neg: 'N’oubliez pas l’avocat du diable.' },
        { type: 'Dialogue de situation', q: 'Commerçant copie son voisin et échoue. Pourquoi ?', options: [{id:'A',label_fr:'Pas de chance'}, {id:'B',label_fr:'Copier sans analyser le contexte spécifique.'}], correct: 'B', pos: 'Imiter ≠ Analyser.', neg: 'Il a ignoré le contexte local.' },
        { type: 'Contre-la-montre', q: 'Biais au quart de tour', steps: [{question:'« On a toujours fait comme ça »', responses:[{id:'A',text:'Statu Quo'},{id:'B',text:'Ancrage'}], correct:'A', pos:'Biais du statu quo.', neg:'C’est le statu quo.'},{question:'« J’investis TOUT ici »', responses:[{id:'A',text:'Confiance'},{id:'B',text:'Absence de diversification'}], correct:'B', pos:'Risque de ruine.', neg:'Trop risqué.'}] },
        { type: 'Réponse courte', q: 'Recommandation e-commerce avec les 8 étapes.', pos: 'Processus décisionnel renforcé maîtrisé !', neg: 'Il manque des étapes.' },
        { type: 'Énigme', q: '« Kahneman m’a traqué… Qui suis-je ? »', options: [{id:'A',label_fr:'L’erreur'},{id:'B',label_fr:'Le biais cognitif'}], correct: 'B', pos: 'Exact ! Invisible mais fatal.', neg: 'C’est le biais cognitif.' }
      ]
    },
    {
      id: 'F4', title: 'Medersa Bou Inania – Systémique',
      questions: [
        { type: 'QCM', q: 'Pourquoi restaurer est-il COMPLEXE (Cynefin) ?', options: [{id:'A',label_fr:'Trop d’étapes'}, {id:'B',label_fr:'Interactions imprévisibles experts/normes/patrimoine.'}], correct: 'B', pos: 'Complexe vs Compliqué. Synergie imprévisible.', neg: 'C’est l’imprévisibilité systémique.' },
        { type: 'Rôles d’équipe', q: 'Interdépendances CPM', options: [{id:'1',text:'Historien -> E1'},{id:'2',text:'Chimiste -> E2'},{id:'3',text:'Maçon -> E3'},{id:'4',text:'Zelligeur -> E4'}], correct: 'ALL', pos: 'Analyse du chemin critique (CPM) parfaite.', neg: 'Le maillon faible retarde tout.' },
        { type: 'Scénario en cascade', q: 'Dilemme des pigments', steps: [{question:'Pigments toxiques vs modernes. Type ?', responses:[{id:'A',text:'Simple'},{id:'B',text:'Dilemme éthique (Patrimoine vs Santé)'}], correct:'B', pos:'Deux valeurs légitimes s’opposent.', neg:'Ce n’est pas simple.'},{question:'Solution analytique ?', responses:[{id:'A',text:'Santé d\'abord'},{id:'B',text:'Hybride : Aspect original + Composition sûre'}], correct:'B', pos:'Synthèse par la 3ème voie.', neg:'Cherchez l’hybridation.'},{question:'Qui décide ?', responses:[{id:'A',text:'Architecte seul'},{id:'B',text:'Comité pluridisciplinaire'}], correct:'B', pos:'Gouvernance plurielle pour dilemme complexe.', neg:'Un seul expert ne suffit pas.'}] },
        { type: 'Détection d’erreurs', q: 'Erreurs dans le plan de restauration', errors: [{id:'1',text_fr:'Ciment Portland',is_error:true},{id:'2',text_fr:'Budget sans imprévu',is_error:true},{id:'3',text_fr:'Pas de documentation',is_error:true},{id:'4',text_fr:'Chef seul décideur',is_error:true}], pos: 'Analyse multi-niveaux maîtrisée.', neg: 'Relisez : matériaux, gestion, gouvernance.' },
        { type: 'Texte à trous', q: 'Charte de Venise', options: [{id:'1',text:'minimalisme'},{id:'2',text:'réversibilité'},{id:'3',text:'compatibilité'}], correct: 'minimalisme, réversibilité, compatibilité', pos: 'Principes patrimoniaux maîtrisés.', neg: 'Minimalisme/Réversibilité/Compatibilité.' },
        { type: 'Dialogue de situation', q: 'Artisan refuse le moderne. Solution ?', options: [{id:'A',label_fr:'L’obliger'}, {id:'B',label_fr:'Couche visible traditionnelle + Structure moderne.'}], correct: 'B', pos: 'Répartition des couches de décision.', neg: 'Séparez visible/invisible.' },
        { type: 'Classement', q: 'Urgence × Importance × Irréversibilité', order: [{id:'1',label_fr:'Fondations'},{id:'2',label_fr:'Toiture'},{id:'3',label_fr:'Zelliges'},{id:'4',label_fr:'Décoration'}], pos: 'Analyse tricritère parfaite.', neg: 'Structure d’abord.' },
        { type: 'Contre-la-montre', q: 'Analyse flash des causes', steps: [{question:'Bois fissuré. Cause ?', responses:[{id:'A',text:'Mauvaise qualité'},{id:'B',text:'Mauvais séchage'}], correct:'B', pos:'Cause technique identifiée.', neg:'Mauvais séchage.'},{question:'Budget +40%. Cause ?', responses:[{id:'A',text:'Vol'},{id:'B',text:'Absence de pilotage'}] , correct:'B', pos:'Défaut de gestion de projet.', neg:'Manque de pilotage.'}] },
        { type: 'Réponse courte', q: 'Rapport systémique (150 mots) : 3 reco.', pos: 'Analyse systémique complète !', neg: 'Argumentez vos recos.' },
        { type: 'Énigme', q: '« Je tombe si tu me forces… Qui suis-je ? »', options: [{id:'A',label_fr:'La pierre'},{id:'B',label_fr:'La tradition'}], correct: 'B', pos: 'La tradition demande de l’analyse.', neg: 'C’est la tradition.' }
      ]
    },
    {
      id: 'F5', title: 'Festival de Fès – Synthèse',
      questions: [
        { type: 'Prise de décision', q: 'H-30 min : 3 crises. Priorité ?', options: [{id:'A',label_fr:'Sono'}, {id:'B',label_fr:'Conflit humain → Sono → Politique'}], correct: 'B', pos: 'Priorisation multicritère : Instable > Technique.', neg: 'L’humain escalade plus vite.' },
        { type: 'Scénario en cascade', q: 'Conflits de corporations', steps: [{question:'Rivalité ancienne. Approche ?', responses:[{id:'A',text:'Négociation de positions'},{id:'B',text:'Cartographie des intérêts (Freeman)'}], correct:'B', pos:'Analyse des parties prenantes.', neg:'Allez au-delà des positions.'},{question:'Solution de synthèse ?', responses:[{id:'A',text:'Choisir un gagnant'},{id:'B',text:'Exposition commune par étapes'}], correct:'B', pos:'Transformer rivalité en complémentarité.', neg:'Évitez le gagnant/perdant.'},{question:'Mesure de succès ?', responses:[{id:'A',text:'Ventes'},{id:'B',text:'Réduction des incidents + Collaboration future'}], correct:'B', pos:'KPI systémiques.', neg:'Voyez le long terme.'}] },
        { type: 'Appariement', q: 'Freeman : Cartographiez le festival.', pairs: [{id:'1',left_fr:'Artisans',right_fr:'Cœur de métier'},{id:'2',left_fr:'Public',right_fr:'Bénéficiaires'},{id:'3',left_fr:'Sponsors',right_fr:'Financeurs'},{id:'4',left_fr:'État',right_fr:'Régulateurs'}], pos: 'Cartographie des parties prenantes impeccable.', neg: 'Qui fait quoi dans le système ?' },
        { type: 'Détection d’erreurs', q: 'Audit final du festival', errors: [{id:'1',text_fr:'Zéro médiation',is_error:true},{id:'2',text_fr:'Budget 100% public',is_error:true},{id:'3',text_fr:'Pas de plan de secours',is_error:true},{id:'4',text_fr:'Exclusion des jeunes',is_error:true}], pos: 'Diagnostic global réussi.', neg: 'Médiation, financement, backup, inclusion.' },
        { type: 'Classement', q: 'Chaîne de valeur du festival', order: [{id:'1',label_fr:'Identité'},{id:'2',label_fr:'Artistes'},{id:'3',label_fr:'Logistique'},{id:'4',label_fr:'Marketing'}], pos: 'Synthèse analytique juste.', neg: 'Identité d’abord.' },
        { type: 'Texte à trous', q: 'Théorie de la complexité', options: [{id:'1',text:'émergence'},{id:'2',text:'boucle'},{id:'3',text:'rétroaction'}], correct: 'émergence, boucle, rétroaction', pos: 'Pensée systémique avancée.', neg: 'Émergence/Boucle/Rétroaction.' },
        { type: 'Dialogue de situation', q: 'Échec d’une performance. Analyse ?', options: [{id:'A',label_fr:'Mauvais artiste'}, {id:'B',label_fr:'Désalignement attente public / environnement / performance.'}], correct: 'B', pos: 'Analyse de l’alignement systémique.', neg: 'Ne blâmez pas l’individu.' },
        { type: 'Vrai/Faux analytique', q: '« Plus c’est gros, plus c’est efficace. »', correct: 'faux', pos: 'Déséconomies d’échelle et complexité croissante.', neg: 'La taille augmente la complexité.' },
        { type: 'Réponse courte', q: 'Synthèse de votre voyage à Fès (200 mots).', pos: 'Synthèse magistrale !', neg: 'Reliez équipe/stress/décision/système.' },
        { type: 'Énigme ultime', q: '« Je suis le lien entre le passé et le futur, entre l’un et le tout… Qui suis-je ? »', options: [{id:'A',label_fr:'La ville'},{id:'B',label_fr:'La synthèse analytique'}], correct: 'B', pos: 'Félicitations ! Vous maîtrisez l’Analyse.', neg: 'Indice : « Je suis le but de Fès. »' }
      ]
    }
  ]
};

async function importFes() {
  console.log('🚀 Starting Fès STANDARDIZED (Acte III) import...');
  
  // 1. City (Challenge)
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(FES_DATA.city);
  if (cityErr) console.error('City error:', cityErr);
  else console.log('✅ City Fès upserted');

  for (const mission of FES_DATA.missions) {
    const missionId = MISSION_IDS[mission.id];
    
    // 2. Mission
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: FES_CHALLENGE_PK,
        title_fr: mission.title,
        sort_order: parseInt(mission.id.substring(1)),
        challenge_id: FES_CHALLENGE_PK
      });
    if (missErr) console.error(`Mission ${mission.id} error:`, missErr);
    else console.log(`✅ Mission ${mission.id} upserted`);

    // 3. Questions
    // Delete existing questions for this mission to avoid duplicates
    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = mission.questions.map((q, i) => {
      let optionsData = q.options;
      if (q.type === 'Appariement') optionsData = { pairs: q.pairs };
      else if (q.type === 'Scénario en cascade') optionsData = { steps: q.steps };
      else if (q.type === 'Détection d’erreurs') optionsData = { errors: q.errors };
      else if (q.type === 'Classement') optionsData = { order: q.order };
      else if (q.type === 'Rôles d’équipe') optionsData = q.options; // Keep as is if already array of {text, is_error}
      
      const dbType = TYPE_MAPPING[q.type] || q.type;

      return {
        mission_id: missionId,
        question_fr: q.q,
        question_type: dbType,
        options: optionsData,
        correct_answer: q.correct,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg,
        explanation_fr: q.pos, // Using positive feedback as explanation
        sort_order: i + 1,
        xp_reward: q.type.includes('Énigme') ? 150 : 100,
        is_published: true,
        time_limit_sec: 45
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Questions Mission ${mission.id} error:`, qErr);
      // Fallback for debugging specific questions
      for (const qToIn of questionsToInsert) {
        const { error: sErr } = await supabase.from('questions').insert(qToIn);
        if (sErr) console.error(`Culprit Q: type=${qToIn.question_type}`, sErr);
      }
    } else {
      console.log(`✅ ${mission.questions.length} questions inserted for ${mission.id}`);
    }
  }
}

importFes();
