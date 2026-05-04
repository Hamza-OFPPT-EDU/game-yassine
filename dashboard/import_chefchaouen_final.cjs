const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const CHEF_CHALLENGE_PK = '98b50e2ddc9943efb387052637738f62';

const MISSION_IDS = {
  C1: '98b50e2d-dc99-43ef-b387-052637738c01',
  C2: '98b50e2d-dc99-43ef-b387-052637738c02',
  C3: '98b50e2d-dc99-43ef-b387-052637738c03',
  C4: '98b50e2d-dc99-43ef-b387-052637738c04',
  C5: '98b50e2d-dc99-43ef-b387-052637738c05'
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

async function importChefchaouen() {
  console.log('🚀 Starting Chefchaouen FINAL import...');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: CHEF_CHALLENGE_PK,
    city_id: 'chefchaouen',
    city_name_fr: 'Chefchaouen',
    city_name_ar: 'شفشاون',
    description_fr: 'Chefchaouen, ville bleue nichée dans le Rif, vous invite à appliquer concrètement les concepts découverts à Rabat.',
    description_ar: 'شفشاون، المدينة الزرقاء الواقعة في الريف، تدعوك لتطبيق المفاهيم التي تم اكتشافها في الرباط بشكل ملموس.',
    headline_fr: 'La Perle Bleue - Mise en pratique',
    sort_order: 2, // Rabat=1, Chef=2, Fès=3
    is_published: true,
    city_color: '#3b82f6', // Blue
    icon_name: 'mountain'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Chefchaouen upserted');

  // 2. Missions Data
  const missions = [
    {
      id: MISSION_IDS.C1,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr: 'Randonnée au Parc Talassemtane',
      description_fr: 'Gestion du stress (application)',
      sort_order: 1,
      is_published: true,
      questions: [
        {
          type: 'QCM',
          q: 'Un touriste a le vertige et crie « Je ne peux plus bouger ! ». Selon la technique STOP, quelle est votre première action ?',
          options: [
            { id: 'a', label_fr: 'Lui crier « Avance, c’est pas dangereux »' },
            { id: 'b', label_fr: 'Courir vers lui' },
            { id: 'c', label_fr: 'Dire calmement « STOP. On s’arrête. Respirez avec moi. »' },
            { id: 'd', label_fr: 'Appeler les secours' }
          ],
          correct: 'c',
          feedback_pos: 'Parfait ! STOP : Stop, Take breath, Observe, Proceed. Vous appliquez la co-régulation.',
          feedback_neg: 'Crier ou courir aggrave la panique. Restez calme et respirez avec lui.'
        },
        {
          type: 'Appariement',
          q: 'Reliez chaque stresseur de montagne à la meilleure stratégie.',
          options: [
            { left_fr: 'Panique d’altitude', right_fr: '4-7-8 + co-régulation' },
            { left_fr: 'Orage', right_fr: 'abri immédiat' },
            { left_fr: 'Épuisement', right_fr: 'encouragement + micro-objectifs' },
            { left_fr: 'Dispute sur direction', right_fr: 'médiation CNV' },
            { left_fr: 'Blessure légère', right_fr: 'premiers secours + évaluation' },
            { left_fr: 'Perte du sentier', right_fr: 'STOP + carte + GPS' }
          ],
          feedback_pos: 'Transfert parfait ! Vous appliquez Rabat en montagne.',
          feedback_neg: 'Révisez : panique = respiration, orage = abri, épuisement = encouragement, dispute = médiation.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Un touriste diabétique, perdu dans le brouillard, panique. Que faites-vous en premier ?',
          options: [
            { id: 'a', label_fr: '« Restez calme, tout va bien » puis courir chercher Aziz' },
            { id: 'b', label_fr: 'Vous asseoir à côté, appliquer STOP, évaluer : « Quand avez-vous pris votre dernière insuline ? »' },
            { id: 'c', label_fr: 'Crier pour appeler Aziz' },
            { id: 'd', label_fr: 'Paniquer aussi' }
          ],
          correct: 'b',
          feedback_pos: 'Excellente application ! STOP + co-régulation + collecte d’info (Simon).',
          feedback_neg: 'Nier la réalité ou laisser seul aggrave la panique. Validez l’émotion, puis agissez.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez les étapes de la visualisation positive.',
          options: [
            { text: 'yeux' }, { text: 'lieu' }, { text: 'sécurité' }, { text: 'détails' },
            { text: '5 sens' }, { text: 'calme' }, { text: 'mental' }, { text: 'corps' }
          ],
          correct: 'yeux, lieu, sécurité, détails, 5 sens, calme, mental, corps',
          feedback_pos: 'Parfait ! La visualisation active les mêmes zones cérébrales que l’expérience réelle.',
          feedback_neg: 'Retenez : fermez les yeux, lieu sûr, détails sensoriels, le mental calme le corps.'
        },
        {
          type: 'Vrai/Faux',
          q: '« La nature réduit automatiquement le stress. »',
          correct: 'vrai',
          feedback_pos: 'Vrai, 20 min en forêt font baisser le cortisol de 15% (Shinrin-yoku).',
          feedback_neg: 'Les études le confirment. Mais la nature ne remplace pas les techniques respiratoires.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Un bon guide ne ressent jamais de stress. »',
          correct: 'faux',
          feedback_pos: 'Faux. Les experts canalisent le stress, ils ne le suppriment pas.',
          feedback_neg: 'Nier son stress en montagne est dangereux. Il faut le gérer, pas l’ignorer.'
        },
        {
          type: 'Vrai/Faux',
          q: '« En urgence, il faut d’abord agir, puis réfléchir. »',
          correct: 'faux',
          feedback_pos: 'Faux. STOP d’abord : s’arrêter, respirer, observer, puis agir.',
          feedback_neg: 'Agir sans réfléchir en montagne mène à la chute. Évaluez avant d’agir.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Urgences en montagne - Q1 : Randonneur fait un malaise (chaleur). Première action ?',
          options: [
            { id: 'a', label_fr: 'Le forcer à marcher' },
            { id: 'b', label_fr: 'Ombre, pieds surélevés, eau' },
            { id: 'c', label_fr: 'L’asperger d’eau froide' }
          ],
          correct: 'b',
          feedback_pos: 'Réflexe juste ! Position latérale de sécurité et réhydratation.',
          feedback_neg: 'Le forcer à marcher ou l’asperger d’eau froide est dangereux.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Urgences en montagne - Q2 : Orage sur crête exposée. Action ?',
          options: [
            { id: 'a', label_fr: 'Rester debout' },
            { id: 'b', label_fr: 'Descendre vers la vallée, position basse' },
            { id: 'c', label_fr: 'S’abriter sous un arbre' }
          ],
          correct: 'b',
          feedback_pos: 'Parfait. Évaluation du risque prioritaire.',
          feedback_neg: 'Rester debout ou sous un arbre est mortel. Descendez immédiatement.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Randonneur blessé Q1/3 : Blessé à la cheville, ne peut plus marcher. Première action ?',
          options: [
            { id: 'a', label_fr: 'Le porter immédiatement' },
            { id: 'b', label_fr: 'STOP, évaluer la blessure, immobiliser', feedback_fr: 'STOP + évaluation Simon. Base des premiers secours.' },
            { id: 'c', label_fr: 'Courir chercher de l’aide' }
          ],
          correct: 'b',
          feedback_pos: 'STOP + évaluation Simon. Base des premiers secours.',
          feedback_neg: 'Le porter ou courir chercher de l’aide aggrave la situation.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 5 erreurs dans la checklist du touriste.',
          options: [
            { text_fr: 'Baskets de ville', is_error: true },
            { text_fr: '50cl eau', is_error: true },
            { text_fr: 'Départ 13h', is_error: true },
            { text_fr: 'Personne ne sait où il va', is_error: true },
            { text_fr: 'Téléphone à 40%', is_error: true }
          ],
          feedback_pos: '5 erreurs mortelles. Même logique que la détection de burnout.',
          feedback_neg: 'Relisez : chaussures, eau, horaire, information, batterie.'
        },
        {
          type: 'Classement',
          q: 'Classez les 6 actions d’évacuation dans l’ordre correct.',
          options: [
            { label_fr: 'Sécuriser zone' },
            { label_fr: 'Évaluer blessé' },
            { label_fr: 'Protéger' },
            { label_fr: 'Appeler secours' },
            { label_fr: 'Donner coordonnées' },
            { label_fr: 'Rassurer groupe' }
          ],
          feedback_pos: 'Ordre parfait. Même processus Simon adapté à l’évacuation.',
          feedback_neg: 'Rappel : sécurité d’abord, évaluer, protéger, appeler, coordonner, puis rassurer.'
        },
        {
          type: 'Énigme',
          q: '« Je suis invisible mais je te maintiens debout. En montagne, si tu me perds, tes jambes te trahissent… Qui suis-je ? »',
          correct: 'Le calme intérieur',
          feedback_pos: 'Bravo ! Le calme intérieur n’est pas l’absence de stress, mais la présence de contrôle.',
          feedback_neg: 'Relisez : « Les enfants l’ont sans efforts » – c’est le calme intérieur.'
        }
      ]
    },
    {
      id: MISSION_IDS.C2,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr: 'Coopérative tisseuse du Rif',
      description_fr: 'Travail en équipe (application)',
      sort_order: 2,
      is_published: true,
      questions: [
        {
          type: 'QCM',
          q: 'Zahra (60 ans) ne tisse plus, corrige les gestes, encourage, calme les disputes. Quel rôle Belbin ?',
          options: [
            { id: 'a', label_fr: 'Créative' },
            { id: 'b', label_fr: 'Harmonisatrice' },
            { id: 'c', label_fr: 'Leader' },
            { id: 'd', label_fr: 'Réalisatrice' }
          ],
          correct: 'b',
          feedback_pos: 'Exact ! L’harmonisatrice gère les tensions et encourage l’équipe.',
          feedback_neg: 'Non. Zahra ne crée pas, ne dirige pas seule, n’exécute pas. Elle harmonise.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Attribuez les 5 tisseuses aux rôles optimaux.',
          options: [
            { left_fr: 'Fatima (rapide, motif identique)', right_fr: 'Réalisatrice' },
            { left_fr: 'Nora (invente des motifs)', right_fr: 'Créative' },
            { left_fr: 'Zahra (voit les erreurs)', right_fr: 'Analyste' },
            { left_fr: 'Halima (gère les conflits)', right_fr: 'Harmonisatrice' },
            { left_fr: 'Meryem (commande, comptes)', right_fr: 'Leader' }
          ],
          feedback_pos: 'Distribution parfaite ! Belbin transféré du labo à l’atelier.',
          feedback_neg: 'Révisez : réalisatrice, créative, analyste, harmonisatrice, leader.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Nora (moderne) et Fatima (tradition) se disputent. Quelle intervention ?',
          options: [
            { id: 'a', label_fr: '« Fatima a raison »' },
            { id: 'b', label_fr: '« Gardez les symboles de Fatima dans une composition moderne. »' },
            { id: 'c', label_fr: '« Nora a raison »' },
            { id: 'd', label_fr: '« Ce n’est pas mon affaire »' }
          ],
          correct: 'b',
          feedback_pos: 'Médiation générationnelle parfaite. « Oui ET… » concilie tradition et innovation.',
          feedback_neg: 'Prendre parti ou fuir détruit l’équipe. Cherchez la 3ème voie.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez le texte sur la technique « Oui ET… »',
          options: [
            { text: '« mais »' }, { text: 'bloque' }, { text: 'opposition' }, { text: 'idée' },
            { text: 'construit' }, { text: 'enrichit' }, { text: 'collaboration' }, { text: 'innovation' }
          ],
          correct: '« mais », bloque, opposition, idée, construit, enrichit, collaboration, innovation',
          feedback_pos: 'Parfait ! « Oui MAIS » bloque, « Oui ET » construit et innove.',
          feedback_neg: 'Retenez : « mais » annule, « et » enrichit.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Une équipe de femmes est plus collaborative qu’une équipe d’hommes. »',
          correct: 'faux',
          feedback_pos: 'Faux. La collaboration dépend des compétences, pas du genre.',
          feedback_neg: 'Les stéréotypes sont des obstacles. La diversité (mixte) est la plus efficace.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Tisseuse en difficulté Q1/3 : Samia fait des erreurs. Première action ?',
          options: [
            { id: 'a', label_fr: 'La critiquer publiquement' },
            { id: 'b', label_fr: 'La remplacer brusquement' },
            { id: 'c', label_fr: 'Lui parler en privé avec bienveillance', feedback_fr: 'Dialogue privé d’abord.' }
          ],
          correct: 'c',
          feedback_pos: 'Dialogue privé d’abord. Même principe que Youssef (membre passif).',
          feedback_neg: 'La critiquer publiquement ou la remplacer brusquement aggrave les choses.'
        },
        {
          type: 'Classement',
          q: 'Classez les 7 étapes du processus collaboratif de création.',
          options: [
            { label_fr: 'Comprendre commande' },
            { label_fr: 'Choisir motifs' },
            { label_fr: 'Distribuer tâches' },
            { label_fr: 'Produire' },
            { label_fr: 'Contrôle qualité' },
            { label_fr: 'Ajuster' },
            { label_fr: 'Livrer' }
          ],
          feedback_pos: 'Même structure que le processus Simon. Universel.',
          feedback_neg: 'Rappel : comprendre, choisir, distribuer, produire, contrôler, ajuster, livrer.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifiez les 5 dysfonctions dans la réunion de la coopérative.',
          options: [
            { text_fr: 'Décision unilatérale', is_error: true },
            { text_fr: 'Attaque personnelle', is_error: true },
            { text_fr: 'Désengagement (téléphone)', is_error: true },
            { text_fr: 'Ignorer qualité', is_error: true },
            { text_fr: 'Réunion sans résolution', is_error: true }
          ],
          feedback_pos: 'Parfait. Vous identifiez les 5 dysfonctions de Lencioni.',
          feedback_neg: 'Relisez les patterns de dysfonction d’équipe.'
        },
        {
          type: 'Prise de décision',
          q: 'L’hôtel veut changer les motifs après 5 jours de travail. Que faire ?',
          options: [
            { id: 'a', label_fr: 'Accepter et tout recommencer', impact_decision: 0 },
            { id: 'b', label_fr: 'Refuser catégoriquement', impact_decision: 0 },
            { id: 'c', label_fr: 'Compromis : 50% floraux existants à prix réduit + 50% nouveaux, surcoût partagé', impact_decision: 50, feedback_fr: 'Négociation win-win.' }
          ],
          correct: 'c',
          feedback_pos: 'Négociation win-win. Ni soumission ni rupture.',
          feedback_neg: 'Accepter ou refuser brutalement est perdant. Le compromis intelligent sauve la relation.'
        },
        {
          type: 'Énigme',
          q: '« Chaque fil seul est fragile. Ensemble ils deviennent tapis. Chaque personne seule est limitée. Ensemble elles deviennent… ? »',
          correct: 'Une force',
          feedback_pos: 'Magnifique ! L’équipe transforme la fragilité individuelle en force collective.',
          feedback_neg: 'C’est une force.'
        }
      ]
    },
    {
      id: MISSION_IDS.C3,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr: 'Le Souk et le Restaurant',
      description_fr: 'Prise de décision (application)',
      sort_order: 3,
      is_published: true,
      questions: [
        {
          type: 'QCM',
          q: 'Omar hésite : A) 5 kg de tomates (50 DH), B) Changer le menu été, C) Ouvrir 2ème restaurant à Tanger. Classez.',
          options: [
            { id: 'a', label_fr: 'A=Strat., B=Tact., C=Opér.' },
            { id: 'b', label_fr: 'A=Tact., B=Opér., C=Strat.' },
            { id: 'c', label_fr: 'A=Opérationnelle, B=Tactique, C=Stratégique' }
          ],
          correct: 'c',
          feedback_pos: 'Classification parfaite. Transfert du ministère au commerce local.',
          feedback_neg: 'Règle : opérationnelle (quotidien), tactique (moyen terme), stratégique (long terme).'
        },
        {
          type: 'Dialogue de situation',
          q: 'Abdellah demande 50 DH/kg, Omar propose 30. Quelle stratégie de conclusion ?',
          options: [
            { id: 'a', label_fr: '« 35, dernier prix »' },
            { id: 'b', label_fr: '« 40 DH si qualité garantie chaque semaine, 20 kg/semaine en exclusivité. »' },
            { id: 'c', label_fr: '« 45, d’accord »' }
          ],
          correct: 'b',
          feedback_pos: 'Négociation win-win ! Intérêts (volume, stabilité) plutôt que positions.',
          feedback_neg: 'L’ultimatum ou la capitulation sont perdants. Créez de la valeur.'
        },
        {
          type: 'Appariement',
          q: 'Reliez chaque situation au biais cognitif correspondant.',
          options: [
            { left_fr: 'Note 4.8/5', right_fr: 'Confirmation' },
            { left_fr: 'Plat à 120 DH après un à 200 DH', right_fr: 'Ancrage' },
            { left_fr: 'Refuse poisson car ami malade', right_fr: 'Disponibilité' },
            { left_fr: 'Commande le plus commandé', right_fr: 'Conformité sociale' }
          ],
          feedback_pos: 'Transfert des biais cognitifs. Vous les repérez partout.',
          feedback_neg: 'Révisez : ancrage, confirmation, disponibilité, conformité.'
        },
        {
          type: 'Classement',
          q: 'Classez les tâches selon la matrice d’Eisenhower (Urgent/Important).',
          options: [
            { label_fr: 'Client allergie (U+/I+)' },
            { label_fr: 'Serveur absent (U+/I)' },
            { label_fr: 'Visite VIP (I+/U-)' },
            { label_fr: 'Répondre avis TripAdvisor' },
            { label_fr: 'Achat légumes' },
            { label_fr: 'Réfléchir nouveau menu' },
            { label_fr: 'Réparer robinet' },
            { label_fr: 'Photo Instagram' }
          ],
          feedback_pos: 'Priorisation de chef. Même logique Eisenhower.',
          feedback_neg: 'Rappel : urgent+important d’abord.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Intoxication Q1/3 : Un client dit « mon fils a vomi après avoir mangé chez vous ». Première réaction ?',
          options: [
            { id: 'a', label_fr: 'Nier la responsabilité' },
            { id: 'b', label_fr: 'Fermer immédiatement le restaurant' },
            { id: 'c', label_fr: 'Empathie, demander détails, vérifier en cuisine', feedback_fr: 'Gestion de crise exemplaire.' }
          ],
          correct: 'c',
          feedback_pos: 'Gestion de crise exemplaire. Empathie puis action.',
          feedback_neg: 'Nier ou fermer immédiatement est une erreur.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez les 7 principes de Fisher & Ury (Négociation raisonnée).',
          options: [
            { text: 'intérêts' }, { text: 'positions' }, { text: 'options' }, { text: 'critères' },
            { text: 'BATNA' }, { text: 'relation' }, { text: 'écoute' }
          ],
          correct: 'intérêts, positions, options, critères, BATNA, relation, écoute',
          feedback_pos: 'Parfait ! Intérêts > positions. BATNA = meilleure alternative.',
          feedback_neg: 'Retenez : intérêts, options, critères objectifs, BATNA.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Rush du service - Q1 : 3 tables, 1 serveur absent. Qui servir en premier ?',
          options: [
            { id: 'a', label_fr: 'Table avec enfant qui pleure' },
            { id: 'b', label_fr: 'Table VIP' },
            { id: 'c', label_fr: 'Table arrivée en premier' }
          ],
          correct: 'a',
          feedback_pos: 'Empathie avant hiérarchie. Urgence émotionnelle d’abord.',
          feedback_neg: 'Le VIP passe après l’urgence sociale.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 5 erreurs dans le business plan du restaurant.',
          options: [
            { text_fr: '100% économies personnelles', is_error: true },
            { text_fr: 'Étude subjective (Tanger)', is_error: true },
            { text_fr: 'Emplacement non visité', is_error: true },
            { text_fr: 'Gérer seul 2 restos', is_error: true },
            { text_fr: 'Menu identique sans adaptation', is_error: true }
          ],
          feedback_pos: 'Diagnostic financier parfait.',
          feedback_neg: 'Relisez : financement, étude de marché, local, charge mentale.'
        },
        {
          type: 'Réponse courte',
          q: 'Créez un plan d’expansion (étude de marché, financement, équipe, calendrier).',
          correct: 'étude de marché, financement, équipe, calendrier',
          feedback_pos: 'Plan stratégique solide. Vous appliquez Simon au commerce.',
          feedback_neg: 'Il manque une des 4 sections.'
        },
        {
          type: 'Énigme',
          q: '« Au souk je nais chaque matin, en cuisine je vis chaque midi… Si tu me fuis tu perds, si tu me maîtrises tu gagnes. Qui suis-je ? »',
          correct: 'La décision',
          feedback_pos: 'Exact ! La décision est partout.',
          feedback_neg: 'C’est la décision.'
        }
      ]
    },
    {
      id: MISSION_IDS.C4,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr: 'L’Herboristerie de la Résilience',
      description_fr: 'Résilience (application)',
      sort_order: 4,
      is_published: true,
      questions: [
        {
          type: 'QCM',
          q: 'Zineb pleure, dort mal depuis 4 mois, dit « je ne sers à rien ». Quel est le diagnostic probable ?',
          options: [
            { id: 'a', label_fr: 'Stress aigu' },
            { id: 'b', label_fr: 'Burnout' },
            { id: 'c', label_fr: 'Anxiété passagère' },
            { id: 'd', label_fr: 'Fatigue normale' }
          ],
          correct: 'b',
          feedback_pos: 'Diagnostic correct. Burnout : épuisement, cynisme, inefficacité.',
          feedback_neg: 'Le stress aigu est court. Ici c’est un épuisement profond.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez l’histoire d’Amina avec les 8 piliers de Cyrulnik.',
          options: [
            { text: 'Sens' }, { text: 'Relations' }, { text: 'Humour' }, { text: 'Corps' },
            { text: 'Apprentissage' }, { text: 'Créativité' }, { text: 'Espoir' }, { text: 'Spiritualité' }
          ],
          correct: 'Sens, Relations, Humour, Corps, Apprentissage, Créativité, Espoir, Spiritualité',
          feedback_pos: '8/8. Vous reconnaissez chaque pilier.',
          feedback_neg: 'Révisez les 8 piliers de la résilience.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Une cliente pleure car son fils ne l’appelle plus. Quelle écoute active ?',
          options: [
            { id: 'a', label_fr: 'Donner de la valériane immédiatement' },
            { id: 'b', label_fr: '« Asseyez-vous. Racontez-moi. Quand l’avez-vous vu pour la dernière fois ? »' },
            { id: 'c', label_fr: '« Votre fils est adulte, c’est normal »' }
          ],
          correct: 'b',
          feedback_pos: 'Écoute active parfaite. L’herboristerie soigne aussi par la parole.',
          feedback_neg: 'Minimiser sa douleur est inefficace.'
        },
        {
          type: 'Appariement',
          q: 'Reliez chaque plante au pilier de résilience correspondant.',
          options: [
            { left_fr: 'Verveine (calme)', right_fr: 'Calme émotionnel' },
            { left_fr: 'Romarin (mémoire)', right_fr: 'Apprentissage' },
            { left_fr: 'Safran (humeur)', right_fr: 'Espoir' },
            { left_fr: 'Thym (énergie)', right_fr: 'Corps' }
          ],
          feedback_pos: 'Phytothérapie au service de la résilience.',
          feedback_neg: 'Révisez les vertus des plantes du Rif.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Recadrage Q1/3 : Zineb dit « Personne ne vient au magasin ». Comment recadrer ?',
          options: [
            { id: 'a', label_fr: '« C’est vrai, c’est calme »' },
            { id: 'b', label_fr: '« 15 clients la semaine dernière, ce n’est pas personne. »', feedback_fr: 'Recadrage par les chiffres.' },
            { id: 'c', label_fr: '« Ça va s’arranger »' }
          ],
          correct: 'b',
          feedback_pos: 'Recadrage par les chiffres. Distorsion de généralisation corrigée.',
          feedback_neg: 'Donnez un fait objectif pour briser la distorsion.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 6 erreurs dans la routine toxique de Zineb.',
          options: [
            { text_fr: 'Travailler jusqu’à 13h30 sans pause', is_error: true },
            { text_fr: 'Écran 3h avant coucher', is_error: true },
            { text_fr: 'Zéro activité physique', is_error: true },
            { text_fr: 'Isolement social total', is_error: true },
            { text_fr: 'Aucune vacance depuis 2 ans', is_error: true },
            { text_fr: '3 cafés à jeun le matin', is_error: true }
          ],
          feedback_pos: 'Patterns de burnout identifiés.',
          feedback_neg: 'Relisez les piliers de l’hygiène de vie.'
        },
        {
          type: 'Classement',
          q: 'Classez les actions de récupération de Zineb par priorité.',
          options: [
            { label_fr: 'Consulter médecin' },
            { label_fr: 'Prendre vacances' },
            { label_fr: 'Limiter heures' },
            { label_fr: 'Éteindre écran' },
            { label_fr: 'Faire sport' },
            { label_fr: 'Voir amie' }
          ],
          feedback_pos: 'Priorisation juste : médical → repos → prévention.',
          feedback_neg: 'Le bilan médical est la priorité n°1.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Gestion client - Q1 : Client avec mal de tête depuis 3 jours. Conseil ?',
          options: [
            { id: 'a', label_fr: '« Consultez un médecin d’abord »' },
            { id: 'b', label_fr: '« Prenez cette tisane de menthe »' },
            { id: 'c', label_fr: '« C’est le stress, respirez »' }
          ],
          correct: 'a',
          feedback_pos: 'Prudence professionnelle. Reconnaître ses limites.',
          feedback_neg: 'Ne remplacez jamais un avis médical.'
        },
        {
          type: 'Réponse courte',
          q: 'Écrivez une lettre à Zineb (80-120 mots) intégrant les 8 piliers de résilience.',
          correct: '8 piliers',
          feedback_pos: 'Lettre magnifique. Chaque phrase = un pilier concret.',
          feedback_neg: 'Il manque un ou plusieurs piliers.'
        },
        {
          type: 'Énigme',
          q: '« Je pousse dans les fissures, là où rien ne devrait vivre. Plus la terre est sèche, plus mes racines plongent… Qui suis-je ? »',
          correct: 'La résilience',
          feedback_pos: 'La résilience grandit dans l’adversité.',
          feedback_neg: 'C’est la résilience.'
        }
      ]
    },
    {
      id: MISSION_IDS.C5,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr: 'Le Festival – Défi Final',
      description_fr: 'Synthèse (stress + équipe + décision)',
      sort_order: 5,
      is_published: true,
      questions: [
        {
          type: 'Prise de décision',
          q: '7h du matin, 3 crises simultanées. Comment gérer les priorités ?',
          options: [
            { id: 'a', label_fr: 'Tout faire seul rapidement', impact_decision: 0 },
            { id: 'b', label_fr: 'Déléguer stand, gérer artisans, remplaçant traiteur', impact_decision: 100, feedback_fr: 'Gestion parallèle parfaite.' },
            { id: 'c', label_fr: 'Annuler le festival', impact_decision: 0 }
          ],
          correct: 'b',
          feedback_pos: 'Gestion parallèle parfaite. Eisenhower + délégation Belbin.',
          feedback_neg: 'Déléguez pour ne pas être submergé.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Attribuez les postes aux profils des bénévoles.',
          options: [
            { left_fr: 'Yassine (extraverti, 3 langues)', right_fr: 'Accueil' },
            { left_fr: 'Soukaina (sportive, secouriste)', right_fr: 'Sécurité' },
            { left_fr: 'Mehdi (costaud)', right_fr: 'Logistique' },
            { left_fr: 'Lina (photographe)', right_fr: 'Communication' },
            { left_fr: 'Rachid (chef)', right_fr: 'Restauration' },
            { left_fr: 'Hind (calme)', right_fr: 'Médiation' }
          ],
          feedback_pos: 'Distribution optimale. Right person, right place.',
          feedback_neg: 'Utilisez les forces de chacun.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Conflit artisans Q1/3 : Un artisan est furieux de son emplacement. Réaction ?',
          options: [
            { id: 'a', label_fr: 'L’ignorer' },
            { id: 'b', label_fr: '« Je comprends votre frustration. Voyons une solution. »', feedback_fr: 'Validation + engagement.' },
            { id: 'c', label_fr: 'Lui dire de partir' }
          ],
          correct: 'b',
          feedback_pos: 'Validation + engagement. Base de la médiation.',
          feedback_neg: 'L’empathie désamorce la colère.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 6 erreurs dans l’organisation du programme du festival.',
          options: [
            { text_fr: 'Discours inaugural de 45 min', is_error: true },
            { text_fr: 'Tous les ateliers dans la même salle', is_error: true },
            { text_fr: 'Aucun menu alternatif (allergies)', is_error: true },
            { text_fr: 'Jury composé d’une seule personne', is_error: true },
            { text_fr: 'Oubli des remerciements aux artisans', is_error: true },
            { text_fr: '1 agent de sécurité pour 5000 pers', is_error: true }
          ],
          feedback_pos: 'Audit complet réussi.',
          feedback_neg: 'Vérifiez la logistique et la sécurité.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Urgence Festival - Q1 : Visiteur fait un malaise. Action ?',
          options: [
            { id: 'a', label_fr: 'Ombre + eau + secouriste' },
            { id: 'b', label_fr: 'Attendre les secours' },
            { id: 'c', label_fr: 'Lui donner à manger' }
          ],
          correct: 'a',
          feedback_pos: 'Réaction immédiate et correcte.',
          feedback_neg: 'Agissez vite pour les malaises.'
        },
        {
          type: 'Appariement',
          q: 'Reliez le problème à la solution SDT (Besoin psychologique).',
          options: [
            { left_fr: 'Bénévole sans merci', right_fr: 'Compétence' },
            { left_fr: 'Artisan micro-géré', right_fr: 'Autonomie' },
            { left_fr: 'Visiteur seul', right_fr: 'Affiliation' }
          ],
          feedback_pos: 'SDT appliquée au festival.',
          feedback_neg: 'Révisez Autonomie, Compétence, Affiliation.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez le plan de communication de crise du festival.',
          options: [
            { text: 'public' }, { text: 'canal' }, { text: 'timing' }, { text: 'empathie' },
            { text: 'transparence' }, { text: 'solution' }, { text: 'action' }
          ],
          correct: 'public, canal, timing, empathie, transparence, solution, action',
          feedback_pos: 'Protocole de communication maîtrisé.',
          feedback_neg: 'Empathie et transparence sont les clés.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Dilemme sponsor Q1/3 : Un sponsor veut exclure un concurrent. Réponse ?',
          options: [
            { id: 'a', label_fr: 'Accepter l’argent' },
            { id: 'b', label_fr: 'Refuser le chantage et garder l’intégrité', feedback_fr: 'Intégrité absolue.' },
            { id: 'c', label_fr: 'Demander plus d’argent' }
          ],
          correct: 'b',
          feedback_pos: 'Intégrité absolue. L’éthique prime sur le budget.',
          feedback_neg: 'La corruption détruit le festival.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédigez un bilan du festival (réussites, améliorations, recommandations).',
          correct: 'réussites, améliorations, recommandations',
          feedback_pos: 'Bilan professionnel complet.',
          feedback_neg: 'Structurez votre bilan.'
        },
        {
          type: 'Énigme ultime',
          q: '« Je suis ce qui reste quand tu as tout appris et tout oublié. Qui suis-je ? »',
          correct: 'La compétence',
          feedback_pos: 'La compétence est le pont entre théorie et pratique.',
          feedback_neg: 'C’est la compétence.'
        }
      ]
    }
  ];

  for (const m of missions) {
    const missionId = MISSION_IDS[m.id];
    const { error: mErr } = await supabase.from('missions').upsert({
      id: missionId,
      city_id: CHEF_CHALLENGE_PK,
      challenge_id: m.challenge_id,
      title_fr: m.title_fr,
      description_fr: m.description_fr,
      sort_order: m.sort_order,
      is_published: m.is_published
    });
    if (mErr) { console.error(`Mission ${m.title_fr} error:`, mErr); continue; }
    console.log(`✅ Mission ${m.title_fr.split(' ')[0]} upserted`);

    // Questions
    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = m.questions.map((q, idx) => ({
      mission_id: missionId,
      question_type: TYPE_MAPPING[q.type] || 'qcm',
      question_fr: q.q,
      options: q.options || [],
      correct_answer: q.correct || '',
      explanation_fr: q.feedback_pos || '',
      hint_fr: q.feedback_neg || '',
      xp_reward: 20,
      time_limit_sec: q.type === 'Contre-la-montre' ? 15 : 30,
      sort_order: idx + 1,
      is_published: true
    }));

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) { 
      console.error(`Questions Mission ${m.title_fr.split(' ')[0]} error:`, qErr);
      // Fallback: insert one by one to find culprit
      for (const q of questionsToInsert) {
        const { error: sqErr } = await supabase.from('questions').insert(q);
        if (sqErr) console.error(`Culprit Q${q.sort_order}: type=${q.question_type}`, sqErr);
      }
    } else {
      console.log(`✅ ${questionsToInsert.length} questions inserted for ${m.title_fr.split(' ')[0]}`);
    }
  }

  console.log('🏁 Chefchaouen import FINISHED!');
}

importChefchaouen();
