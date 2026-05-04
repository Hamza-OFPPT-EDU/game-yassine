const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const RABAT_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440001';
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
  console.log('🚀 Starting Chefchaouen HIGH-FIDELITY import...');

  // 0. WIPE RABAT QUESTIONS (As requested)
  console.log('🧹 Wiping existing Rabat questions...');
  const { error: wipeRabatErr } = await supabase
    .from('questions')
    .delete()
    .in('mission_id', [
      '550e8400-e29b-41d4-a716-446655440111',
      '550e8400-e29b-41d4-a716-446655440222',
      '550e8400-e29b-41d4-a716-446655440333',
      '550e8400-e29b-41d4-a716-446655440444',
      '550e8400-e29b-41d4-a716-446655440555'
    ]);
  if (wipeRabatErr) console.warn('Note: Could not wipe Rabat questions (might be empty or missing missions).');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: CHEF_CHALLENGE_PK,
    city_id: 'chefchaouen',
    city_name_fr: 'Chefchaouen',
    city_name_ar: 'شفشاون',
    description_fr: "Chefchaouen, ville bleue nichée dans le Rif, vous invite à appliquer concrètement les concepts découverts à Rabat. Ici, pas de théorie : on pratique en montagne, à l’atelier de tissage, au souk, à l’herboristerie et au festival.",
    headline_fr: '🏔️ ACTE II - LA PERLE BLEUE : L\'APPLICATION',
    sort_order: 2,
    is_published: true,
    city_color: '#3b82f6',
    icon_name: 'mountain'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Chefchaouen upserted');

  const missionsData = [
    {
      id: MISSION_IDS.C1,
      title_fr: 'Mission C1 : Randonnée au Parc Talassemtane',
      description_fr: "Mentor: Aziz Moussaoui (Guide). Soft Skill: Gestion du stress (APPLICATION). Appliquez la technique STOP et la visualisation positive en situation réelle de montagne.",
      questions: [
        {
          type: 'QCM',
          q: 'Un touriste a le vertige et crie « J’AI LE VERTIGE, JE NE PEUX PLUS BOUGER ! ». Quelle est ta première action selon la technique STOP ?',
          options: [
            { id: 'A', label_fr: 'Lui crier « Avance, c’est pas dangereux ! »' },
            { id: 'B', label_fr: 'Courir vers lui pour le tirer' },
            { id: 'C', label_fr: 'Dire calmement « STOP. On s’arrête. Respirez avec moi »' },
            { id: 'D', label_fr: 'Appeler les secours immédiatement' }
          ],
          correct: 'C',
          pos: 'PARFAIT ! S (Stop), T (Take a breath), O (Observe), P (Proceed). Vous transférez la co-régulation apprise à Rabat dans un danger réel.',
          neg: 'Crier aggrave la panique. Courir sur un sentier étroit est dangereux. Le calme d\'abord.'
        },
        {
          type: 'Appariement',
          q: 'Relie chaque stresseur de montagne à la meilleure stratégie de coping.',
          options: [
            { left_fr: 'Panique d’altitude', right_fr: 'Technique 4-7-8 + co-régulation' },
            { left_fr: 'Orage soudain', right_fr: 'Abri immédiat' },
            { left_fr: 'Randonneur épuisé', right_fr: 'Encouragement + micro-objectifs' },
            { left_fr: 'Dispute direction', right_fr: 'Médiation CNV' },
            { left_fr: 'Blessure légère', right_fr: 'Premiers secours + évaluation' },
            { left_fr: 'Perte du sentier', right_fr: 'STOP + observation + carte' }
          ],
          pos: 'EXCELLENT TRANSFERT ! Rabat (Réflexion) -> Chefchaouen (Expérimentation).',
          neg: 'Révisez les correspondances : panique=respiration, orage=abri, conflit=médiation.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Pierre, diabétique, est perdu dans le brouillard et panique. Que fais-tu en premier ?',
          options: [
            { id: 'A', label_fr: '« Restez calme » puis courir chercher Aziz' },
            { id: 'B', label_fr: 'S\'asseoir à côté, STOP, évaluer : « Quand avez-vous pris votre insuline ? »' },
            { id: 'C', label_fr: 'Crier fort pour appeler Aziz' },
            { id: 'D', label_fr: 'Paniquer aussi' }
          ],
          correct: 'B',
          pos: 'PARFAIT ! Présence, STOP, Co-régulation et Collecte d\'info (Simon).',
          neg: 'Ne laissez jamais un blessé paniqué seul dans le brouillard. Validez l\'émotion.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez les 5 étapes de la VISUALISATION POSITIVE.',
          options: [
            { text: 'yeux' }, { text: 'lieu' }, { text: 'sécurité' }, { text: 'détails' },
            { text: '5 sens' }, { text: 'calme' }, { text: 'mental' }, { text: 'corps' }
          ],
          correct: 'yeux, lieu, sécurité, détails, 5 sens, calme, mental, corps',
          pos: 'BRAVO ! Le cerveau ne distingue pas le réel de l\'imaginé : les hormones de détente sont libérées.',
          neg: 'Retenez l\'ordre : Yeux fermés -> Lieu sûr -> Détails sensoriels -> Calme.'
        },
        {
          type: 'Vrai/Faux',
          q: '« La nature réduit automatiquement le stress (cortisol). »',
          correct: 'vrai',
          pos: 'VRAI ! 20 min en forêt = -15% cortisol (Shinrin-yoku).',
          neg: 'C\'est prouvé scientifiquement, le contact visuel avec la verdure apaise.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Un bon guide ne ressent jamais de stress. »',
          correct: 'faux',
          pos: 'FAUX ! L\'expert canalise le stress, il ne le supprime pas. Nier son stress est un danger.',
          neg: 'Même après 25 ans, Aziz ressent le stress. Il a juste appris à le gérer.'
        },
        {
          type: 'Contre-la-montre',
          q: 'URGENCE : Orage sur une crête exposée. Action ?',
          options: [
            { id: 'A', label_fr: 'Rester debout' },
            { id: 'B', label_fr: 'Descendre vers la vallée, position basse' },
            { id: 'C', label_fr: 'S’abriter sous un arbre' }
          ],
          correct: 'B',
          pos: 'RÉFLEXE DE PRO ! Évaluation du risque (Eisenhower : Urgent + Important).',
          neg: 'Rester sur une crête ou sous un arbre est mortel pendant un orage.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Randonneur blessé : Ahmed s\'est tordu la cheville.',
          options: {
            steps: [
              {
                question: 'Première action ?',
                responses: [
                  { id: 'A', text: 'Le porter' },
                  { id: 'B', text: 'STOP + Immobiliser' }
                ],
                correct: 'B'
              },
              {
                question: 'Organisation descente ?',
                responses: [
                  { id: 'A', text: 'Il marche seul' },
                  { id: 'B', text: '2 soutiens + toi leader' }
                ],
                correct: 'B'
              },
              {
                question: 'Ahmed panique : « Et si c\'est cassé ? »',
                responses: [
                  { id: 'A', text: '« Marche ! »' },
                  { id: 'B', text: '« Pas cassé, on avance ENSEMBLE »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'GESTION EXCEPTIONNELLE ! Recadrage, Autonomie et Affiliation appliqués.',
          neg: 'Face à la peur, donnez des faits, du contrôle et de la solidarité.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 5 erreurs mortelles dans la checklist de Jean-Pierre.',
          options: [
            { text_fr: 'Baskets de ville', is_error: true },
            { text_fr: '50cl d\'eau pour 6h', is_error: true },
            { text_fr: 'Départ 13h', is_error: true },
            { text_fr: 'Personne ne sait où il va', is_error: true },
            { text_fr: 'Téléphone à 40%', is_error: true }
          ],
          pos: 'DIAGNOSTIC PARFAIT ! Mauvaise préparation = catastrophe prévisible.',
          neg: 'Baskets, manque d\'eau, horaire tardif, isolement et batterie faible sont fatals.'
        },
        {
          type: 'Classement',
          q: 'Classe les étapes d\'évacuation d\'urgence dans l\'ordre.',
          options: [
            { label_fr: 'Sécuriser la zone' },
            { label_fr: 'Évaluer le blessé' },
            { label_fr: 'Protéger le blessé' },
            { label_fr: 'Appeler les secours' },
            { label_fr: 'Donner coordonnées GPS' },
            { label_fr: 'Rassurer le groupe' }
          ],
          pos: 'ORDRE PARFAIT ! Sécurité -> Évaluation -> Protection -> Appel -> GPS -> Calme.',
          neg: 'On appelle les secours APRÈS avoir sécurisé et évalué.'
        },
        {
          type: 'Énigme',
          q: '« Je suis invisible mais je te maintiens debout... Dr. Karim te l\'a enseigné, Aziz te l\'a fait vivre. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La force' },
            { id: 'B', label_fr: 'Le courage' },
            { id: 'C', label_fr: 'Le calme intérieur' },
            { id: 'D', label_fr: 'L\'expérience' }
          ],
          correct: 'C',
          pos: 'BRAVO ! Le calme n\'est pas l\'absence de stress, mais la présence de contrôle intérieur.',
          neg: 'Relis : « Les enfants m\'ont sans efforts... ta voix tremble en réunion ».'
        }
      ]
    },
    {
      id: MISSION_IDS.C2,
      title_fr: 'Mission C2 : Coopérative tisseuse du Rif',
      description_fr: "Mentor: Khadija Moussaoui (Maître tisseuse). Soft Skill: Travail en équipe (APPLICATION). Identifiez les rôles Belbin et gérez les conflits dans un atelier artisanal.",
      questions: [
        {
          type: 'QCM',
          q: 'Zahra (60 ans) ne tisse plus, elle encourage, corrige et calme les disputes. Quel rôle Belbin (R3) applique-t-elle ?',
          options: [
            { id: 'A', label_fr: 'Créative' },
            { id: 'B', label_fr: 'Harmonisatrice' },
            { id: 'C', label_fr: 'Leader' },
            { id: 'D', label_fr: 'Réalisatrice' }
          ],
          correct: 'B',
          pos: 'EXACT ! Zahra harmonise les tensions par sa sagesse. Belbin s\'applique même sans théorie.',
          neg: 'Elle ne crée pas ni ne dirige seule. Elle assure la cohésion.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Distribuez les tâches selon les forces des tisseuses pour la commande urgente.',
          options: [
            { left_fr: 'Fatima (rapide, motif fixe)', right_fr: 'Réalisatrice' },
            { left_fr: 'Nora (invente des motifs)', right_fr: 'Créative' },
            { left_fr: 'Zahra (voit les erreurs)', right_fr: 'Analyste' },
            { left_fr: 'Halima (gère les conflits)', right_fr: 'Harmonisatrice' },
            { left_fr: 'Meryem (gestion, comptes)', right_fr: 'Leader' }
          ],
          pos: 'PARFAIT ! Lave & Wenger : les rôles existent dans toute communauté de pratique.',
          neg: 'Révisez : Fatima=Production, Nora=Innovation, Zahra=Qualité, Halima=Lien, Meryem=Pilotage.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Conflit : Nora veut du moderne, Fatima veut du traditionnel. Que fais-tu ?',
          options: [
            { id: 'A', label_fr: 'Donner raison à Fatima' },
            { id: 'B', label_fr: '« Symboles traditionnels dans une composition moderne »' },
            { id: 'C', label_fr: 'Donner raison à Nora' },
            { id: 'D', label_fr: 'Ne rien faire' }
          ],
          correct: 'B',
          pos: 'MAGNIFIQUE ! Médiation CNV + « Oui ET... » : Innovation + Tradition = Avantage concurrentiel.',
          neg: 'Prendre parti tue l\'équipe. L\'innovation sans tradition est déracinée.'
        },
        {
          type: 'Texte à trous',
          q: 'Appliquez la technique « OUI ET... » vs « OUI MAIS... ».',
          options: [
            { text: '« mais »' }, { text: 'bloque' }, { text: 'opposition' }, { text: 'idée' },
            { text: 'construit' }, { text: 'enrichit' }, { text: 'collaboration' }, { text: 'innovation' }
          ],
          correct: '« mais », bloque, opposition, idée, construit, enrichit, collaboration, innovation',
          pos: 'EXCELLENT ! « Oui MAIS » est une fin, « Oui ET » est un début.',
          neg: 'Le « mais » annule ce qui précède et crée un blocage.'
        },
        {
          type: 'Vrai/Faux',
          q: '« Dans une coopérative, TOUTES les décisions doivent être prises par vote. »',
          correct: 'faux',
          pos: 'FAUX ! Il y a des décisions techniques (experts), tactiques et stratégiques (collectives).',
          neg: 'Le vote permanent paralyse l\'action. Il faut distinguer les types de décisions.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Soutien à Samia (difficultés personnelles).',
          options: {
            steps: [
              {
                question: 'Première action ?',
                responses: [
                  { id: 'A', text: 'Critique publique' },
                  { id: 'B', text: 'Privé + Bienveillance' }
                ],
                correct: 'B'
              },
              {
                question: 'Elle parle de son mari.',
                responses: [
                  { id: 'A', text: '« C\'est ton problème »' },
                  { id: 'B', text: '« Comment t\'aider ? »' }
                ],
                correct: 'B'
              },
              {
                question: 'Confidentialité ?',
                responses: [
                  { id: 'A', text: 'Tout raconter' },
                  { id: 'B', text: '« Soutenons-la »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'BLOOM NIVEAU 3 CONFIRMÉ ! Vous adaptez la bienveillance de Rabat au contexte culturel.',
          neg: 'Supposer la bonne foi fonctionne dans tous les contextes.'
        },
        {
          type: 'Classement',
          q: 'Classez les 7 étapes de la création collaborative.',
          options: [
            { label_fr: 'Comprendre commande' },
            { label_fr: 'Vote motifs/couleurs' },
            { label_fr: 'Distribuer tâches' },
            { label_fr: 'Production individuelle' },
            { label_fr: 'Contrôle qualité' },
            { label_fr: 'Ajustements' },
            { label_fr: 'Livraison' }
          ],
          pos: 'MAÎTRISÉ ! Même structure que Simon (R2.2), contexte différent.',
          neg: 'On commence par comprendre et on finit par livrer.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Identifie les 5 dysfonctions de Lencioni dans cette réunion.',
          options: [
            { text_fr: 'Meryem décide SEULE', is_error: true },
            { text_fr: 'Fatima attaque Nora', is_error: true },
            { text_fr: 'Nora sur son téléphone', is_error: true },
            { text_fr: 'Ignorer les 3 erreurs', is_error: true },
            { text_fr: 'Réunion sans décision', is_error: true }
          ],
          pos: 'DIAGNOSTIC PARFAIT ! Les dysfonctions sont universelles, de l\'atelier au CAC40.',
          neg: 'Relisez Lencioni : Confiance, Conflit sain, Engagement, Responsabilité, Résultats.'
        },
        {
          type: 'Prise de décision',
          q: 'L\'hôtel change d\'avis après 5 jours. Quelle négociation ?',
          options: [
            { id: 'A', label_fr: 'Tout refaire gratuitement' },
            { id: 'B', label_fr: 'Refuser tout net' },
            { id: 'C', label_fr: 'Compromis : 50/50 floraux/géo + surcoût partagé' }
          ],
          correct: 'C',
          pos: 'WIN-WIN ! Intérêts (argent/temps) respectés pour les deux. (Fisher & Ury).',
          neg: 'La soumission ou la rupture sont des échecs stratégiques.'
        },
        {
          type: 'Énigme',
          q: '« Chaque fil seul est fragile... Ensemble elles deviennent... ? »',
          options: [
            { id: 'A', label_fr: 'Une entreprise' },
            { id: 'B', label_fr: 'Une famille' },
            { id: 'C', label_fr: 'Une force' },
            { id: 'D', label_fr: 'Un problème' }
          ],
          correct: 'C',
          pos: 'BRAVO ! L\'artisanat nous apprend que la force vient du lien.',
          neg: 'L\'équipe transforme la fragilité en solidité.'
        }
      ]
    },
    {
      id: MISSION_IDS.C3,
      title_fr: 'Mission C3 : Le Souk et le Restaurant',
      description_fr: "Mentor: Omar Chaouni (Chef). Soft Skill: Prise de décision (APPLICATION). Négociez au souk et gérez le rush d'un restaurant en appliquant Eisenhower et Fisher & Ury.",
      questions: [
        {
          type: 'QCM',
          q: 'Classez : A) 5kg tomates, B) Menu été, C) 2ème resto à Tanger.',
          options: [
            { id: 'A', label_fr: 'Strat, Tact, Opér' },
            { id: 'B', label_fr: 'Tact, Opér, Strat' },
            { id: 'C', label_fr: 'Opérationnelle, Tactique, Stratégique' }
          ],
          correct: 'C',
          pos: 'PARFAIT ! Transfert réussi : la logique de Fatima (R2) s\'applique au restaurant.',
          neg: 'Petit montant = opér, saison = tact, expansion = strat.'
        },
        {
          type: 'Dialogue de situation',
          q: 'Négociation olives : 50 DH demandé, 30 proposé. Conclusion ?',
          options: [
            { id: 'A', label_fr: '35 DH dernier prix' },
            { id: 'B', label_fr: '40 DH + Volume garanti + Exclusivité' },
            { id: 'C', label_fr: '45 DH d\'accord' },
            { id: 'D', label_fr: '20 DH' }
          ],
          correct: 'B',
          pos: 'WIN-WIN ! Vous créez de la valeur (stabilité pour lui, prix pour vous).',
          neg: 'L\'ultimatum blesse la relation indispensable au souk.'
        },
        {
          type: 'Appariement',
          q: 'Reliez les biais cognitifs aux situations du restaurant.',
          options: [
            { left_fr: 'Note Google 4.8/5', right_fr: 'Biais de confirmation' },
            { left_fr: 'Plat 120 DH vs 200 DH', right_fr: 'Biais d\'ancrage' },
            { left_fr: 'Refus poisson (ami malade)', right_fr: 'Biais de disponibilité' },
            { left_fr: 'Le plus commandé', right_fr: 'Conformité sociale' }
          ],
          pos: 'DÉTECTION RÉUSSIE ! Les biais sont les mêmes au ministère ou au souk.',
          neg: 'Kahneman : Nous décidons 95% du temps avec nos biais.'
        },
        {
          type: 'Classement',
          q: 'Priorisez ces 8 tâches selon la matrice d\'Eisenhower.',
          options: [
            { label_fr: 'Allergie noix' },
            { label_fr: 'Serveur absent' },
            { label_fr: 'Client VIP menu' },
            { label_fr: 'Avis TripAdvisor' },
            { label_fr: 'Réserver légumes' },
            { label_fr: 'Planifier menu' },
            { label_fr: 'Robinet fuit' },
            { label_fr: 'Post Instagram' }
          ],
          pos: 'PRIORISATION DE CHEF ! Vies > Service > Business > Réputation > Logistique.',
          neg: 'Eisenhower : Urgent+Important est TOUJOURS premier.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Crise : Intoxication alimentaire.',
          options: {
            steps: [
              {
                question: 'Réaction client ?',
                responses: [
                  { id: 'A', text: 'Nier' },
                  { id: 'B', text: 'Empathie + Vérifier' }
                ],
                correct: 'B'
              },
              {
                question: 'Crevettes à 12°C ?',
                responses: [
                  { id: 'A', text: 'Cacher' },
                  { id: 'B', text: 'Retirer + Appeler clients' }
                ],
                correct: 'B'
              },
              {
                question: 'Plainte du père ?',
                responses: [
                  { id: 'A', text: 'Tribunal' },
                  { id: 'B', text: 'Responsabilité + Frais' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'Coombs : Empathie + Transparence + Action + Responsabilité. Bravo.',
          neg: 'L\'échelle change (1 personne vs 200), mais les principes du Wali restent.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez les 7 principes de Fisher & Ury.',
          options: [
            { text: 'intérêts' }, { text: 'positions' }, { text: 'options' }, { text: 'critères' },
            { text: 'BATNA' }, { text: 'relation' }, { text: 'écoute' }
          ],
          correct: 'intérêts, positions, options, critères, BATNA, relation, écoute',
          pos: 'MAÎTRISÉ ! Apprenez votre BATNA (meilleure alternative) pour ne jamais être coincé.',
          neg: 'Positions vs Intérêts est la base de toute négociation.'
        },
        {
          type: 'Contre-la-montre',
          q: 'SERVICE : Un cuisinier se coupe le doigt (saigne). Action ?',
          options: [
            { id: 'A', label_fr: 'Pansement et continue' },
            { id: 'B', label_fr: 'Sortie cuisine + Soins + Remplaçant' },
            { id: 'C', label_fr: 'Fermer le restaurant' }
          ],
          correct: 'B',
          pos: 'DÉCISION JUSTE ! Hygiène absolue et continuité du service.',
          neg: 'On ne cuisine pas avec du sang. On ne ferme pas pour une coupure légère.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Audit du Business Plan de Tanger. Trouvez les 5 erreurs.',
          options: [
            { text_fr: '100% économies personnelles', is_error: true },
            { text_fr: 'Étude subjective "c\'est pas bon"', is_error: true },
            { text_fr: 'Local choisi sans visite', is_error: true },
            { text_fr: 'Gérer 2 restos seul', is_error: true },
            { text_fr: 'Menu identique (Tanger != Chef)', is_error: true }
          ],
          pos: 'PARFAIT ! Surcharge (R1.8) + Biais (R2.6) + Simon bâclé = Échec.',
          neg: 'Oubli du risque, de l\'étude réelle et de la charge mentale.'
        },
        {
          type: 'Réponse courte',
          q: 'Écris le plan d\'expansion stratégique (Étude, Financement, Équipe, Calendrier).',
          correct: 'Étude, Financement, Équipe, Calendrier',
          pos: 'SOLIDE ! Vous avez l\'instinct du commerçant et la méthode du manager.',
          neg: 'Vérifiez que vous avez bien inclus les 4 piliers demandés.'
        },
        {
          type: 'Énigme',
          q: '« Au souk je nais, en cuisine je vis... Omar me pratique 200 fois par jour. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Le profit' },
            { id: 'B', label_fr: 'La décision' },
            { id: 'C', label_fr: 'Le temps' }
          ],
          correct: 'B',
          pos: 'EXACT ! La décision est l\'atome du commerce.',
          neg: 'Indice : On peut la précipiter, la fuir ou la maîtriser.'
        }
      ]
    },
    {
      id: MISSION_IDS.C4,
      title_fr: 'Mission C4 : L’Herboristerie de la Résilience',
      description_fr: "Mentor: Amina Jebli (Pharmacienne). Soft Skill: Résilience (APPLICATION). Diagnostiquez le burnout et appliquez les 8 piliers de Cyrulnik dans le soin par les plantes.",
      questions: [
        {
          type: 'QCM',
          q: 'Zineb pleure, dort mal, se sent inutile depuis 4 mois. Diagnostic ?',
          options: [
            { id: 'A', label_fr: 'Stress aigu' },
            { id: 'B', label_fr: 'Burnout' },
            { id: 'C', label_fr: 'Anxiété' }
          ],
          correct: 'B',
          pos: 'EXACT ! Maslach : Épuisement, Cynisme, Inefficacité. Identique à Rabat.',
          neg: 'Chronique (> 3 mois) et perte de sens = Burnout.'
        },
        {
          type: 'Texte à trous',
          q: 'Complétez l\'histoire d\'Amina avec les piliers de Cyrulnik.',
          options: [
            { text: 'Sens' }, { text: 'Relations' }, { text: 'Humour' }, { text: 'Corps' },
            { text: 'Apprentissage' }, { text: 'Créativité' }, { text: 'Espoir' }, { text: 'Spiritualité' }
          ],
          correct: 'Sens, Relations, Humour, Corps, Apprentissage, Créativité, Espoir, Spiritualité',
          pos: '8/8 ! Vous maîtrisez les outils de reconstruction post-trauma.',
          neg: 'Révisez les piliers : Pourquoi, Entourage, Rire, Mouvement...'
        },
        {
          type: 'Dialogue de situation',
          q: 'Mère éplorée (fils parti). Que fais-tu ?',
          options: [
            { id: 'A', label_fr: 'Tisane sommeil direct' },
            { id: 'B', label_fr: '« Asseyez-vous. Racontez-moi »' },
            { id: 'C', label_fr: '« C\'est normal »' }
          ],
          correct: 'B',
          pos: 'BRAVO ! L\'écoute inconditionnelle (Rogers) guérit plus que les plantes.',
          neg: 'Minimiser la douleur ou traiter le symptôme sans la cause est une erreur.'
        },
        {
          type: 'Appariement',
          q: 'Plantes et Piliers de Résilience.',
          options: [
            { left_fr: 'Verveine (calme)', right_fr: 'Calme émotionnel' },
            { left_fr: 'Romarin (mémoire)', right_fr: 'Apprentissage' },
            { left_fr: 'Safran (humeur)', right_fr: 'Espoir' },
            { left_fr: 'Thym (énergie)', right_fr: 'Corps' }
          ],
          pos: 'Révisez : les outils biologiques soutiennent le travail mental.',
          neg: 'Chaque plante soutient une fonction liée à un pilier.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Recadrage Zineb : « L\'herboristerie est morte ».',
          options: {
            steps: [
              {
                question: '« Personne ne vient »',
                responses: [
                  { id: 'A', text: 'D\'accord' },
                  { id: 'B', text: '« 15 clients = pas personne »' }
                ],
                correct: 'B'
              },
              {
                question: '« Ils préfèrent le chimique »',
                responses: [
                  { id: 'A', text: 'Oui' },
                  { id: 'B', text: '« On est complémentaires »' }
                ],
                correct: 'B'
              },
              {
                question: '« C\'est mort »',
                responses: [
                  { id: 'A', text: 'Hélas' },
                  { id: 'B', text: '« Marché mondial en hausse »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'RECADRAGE MAÎTRISÉ ! Faits contre Distorsions (Généralisation, Catastrophisme).',
          neg: 'Identifiez le fait objectif pour briser la croyance limitante.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Trouvez les 6 erreurs dans la routine de Zineb.',
          options: [
            { text_fr: '13h30 sans pause', is_error: true },
            { text_fr: 'Écran 3h avant dormir', is_error: true },
            { text_fr: 'Zéro sport', is_error: true },
            { text_fr: 'Isolement social', is_error: true },
            { text_fr: 'Aucune vacance 2 ans', is_error: true },
            { text_fr: '3 cafés à jeun', is_error: true }
          ],
          pos: 'DIAGNOSTIC IDENTIQUE AU DR RACHID ! Les causes du burnout sont universelles.',
          neg: 'Surcharge, lumière bleue, isolement et stimulants sont les ennemis.'
        },
        {
          type: 'Classement',
          q: 'Priorisez le plan de récupération de Zineb.',
          options: [
            { label_fr: 'Consulter médecin' },
            { label_fr: 'Prendre vacances' },
            { label_fr: 'Limiter heures' },
            { label_fr: 'Éteindre écran' },
            { label_fr: 'Faire sport' },
            { label_fr: 'Voir amie' }
          ],
          pos: 'LOGIQUE : Médical -> Récupération -> Prévention. Parfait.',
          neg: 'On commence toujours par le bilan médical en cas de burnout.'
        },
        {
          type: 'Contre-la-montre',
          q: 'Femme enceinte demande une tisane. Réaction ?',
          options: [
            { id: 'A', label_fr: 'Donner camomille' },
            { id: 'B', label_fr: '« Contre-indications, voyez un médecin »' }
          ],
          correct: 'B',
          pos: 'SÉCURITÉ ! Un bon pro reconnaît ses limites (R1.9).',
          neg: 'Certaines plantes sont abortives ou toxiques pendant la grossesse.'
        },
        {
          type: 'Réponse courte',
          q: 'Écris une lettre à Zineb utilisant les 8 piliers.',
          correct: '8 piliers',
          pos: 'TOUCHANT ! La résilience se construit par des micro-actions.',
          neg: 'Vérifiez la présence des piliers (Sens, Humour, Relations...).'
        },
        {
          type: 'Énigme',
          q: '« Je pousse dans les fissures... Seules les terres blessées me voient fleurir. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La menthe' },
            { id: 'B', label_fr: 'La résilience' },
            { id: 'C', label_fr: 'La patience' }
          ],
          correct: 'B',
          pos: 'MAGNIFIQUE ! Post-trauma = Croissance. C\'est la leçon d\'Amina.',
          neg: 'Indice : Plus la terre est sèche, plus mes racines plongent.'
        }
      ]
    },
    {
      id: MISSION_IDS.C5,
      title_fr: 'Mission C5 : Le Festival – Défi Final',
      description_fr: "Mentor: Nabil Tazghini (Directeur). Soft Skill: Synthèse (APPLICATION). Gérez les crises, coordonnez les bénévoles et sauvez l'éthique du festival.",
      questions: [
        {
          type: 'Prise de décision',
          q: '3 crises à 7h : Stand pas monté, Artisans râlent, Traiteur annule.',
          options: [
            { id: 'A', label_fr: 'Stand d\'abord' },
            { id: 'B', label_fr: 'Déléguer Stand, Gérer Artisans, Nabil -> Traiteur' },
            { id: 'C', label_fr: 'Tout faire seul' }
          ],
          correct: 'B',
          pos: 'SYNTHÈSE PARFAITE ! Eisenhower (Priorité) + Belbin (Délégation).',
          neg: 'Ne restez pas seul. Déléguez selon les types de tâches.'
        },
        {
          type: 'Rôles d’équipe',
          q: 'Attribuez les 6 bénévoles aux bons postes.',
          options: [
            { left_fr: 'Yassine (extraverti)', right_fr: 'Accueil' },
            { left_fr: 'Soukaina (secouriste)', right_fr: 'Sécurité' },
            { left_fr: 'Mehdi (manutention)', right_fr: 'Logistique' },
            { left_fr: 'Lina (Instagram)', right_fr: 'Communication' },
            { left_fr: 'Rachid (chef)', right_fr: 'Restauration' },
            { left_fr: 'Hind (médiatrice)', right_fr: 'Médiation artisans' }
          ],
          pos: 'RIGHT PERSON, RIGHT PLACE ! Belbin transféré à l\'événementiel.',
          neg: 'Utilisez les compétences passées de chacun.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Médiation Mustapha (stand toilettes).',
          options: {
            steps: [
              {
                question: 'Première réaction ?',
                responses: [
                  { id: 'A', text: 'C\'est le sort' },
                  { id: 'B', text: 'Validation + Solution' }
                ],
                correct: 'B'
              },
              {
                question: 'Proposition ?',
                responses: [
                  { id: 'A', text: 'Rien' },
                  { id: 'B', text: 'Paravent + Titre Honneur' }
                ],
                correct: 'B'
              },
              {
                question: 'Il demande de l\'argent.',
                responses: [
                  { id: 'A', text: 'Payer' },
                  { id: 'B', text: 'Visibilité > Argent' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'SYNTHÈSE TOTALE ! Validation (R1) + CNV (R3) + Créativité (C2) + Négo (C3).',
          neg: 'Son intérêt est la reconnaissance, pas seulement l\'emplacement.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Audit du Programme du Festival. Trouvez les 6 erreurs.',
          options: [
            { text_fr: 'Discours 45 min', is_error: true },
            { text_fr: 'Ateliers même salle', is_error: true },
            { text_fr: 'Pas de menu alternatif', is_error: true },
            { text_fr: 'Jury = Nabil seul', is_error: true },
            { text_fr: 'Pas de remerciements', is_error: true },
            { text_fr: '1 agent / 5000 pers', is_error: true }
          ],
          pos: 'EXCELLENT ! Surcharge (R1) + Simon (R2) + Belbin (R3) + Com (R5).',
          neg: 'Relisez les normes de sécurité et d\'inclusion.'
        },
        {
          type: 'Contre-la-montre',
          q: 'URGENCE : Journaliste veut Nabil (occupé).',
          options: [
            { id: 'A', label_fr: 'Tu réponds avec les faits clés' },
            { id: 'B', label_fr: 'Lui dire de repasser' }
          ],
          correct: 'A',
          pos: 'MAÎTRISE ! Tu as mobilisé les faits et géré l\'interface média (R5).',
          neg: 'Ne perdez jamais une occasion de communication positive.'
        },
        {
          type: 'Appariement',
          q: 'Appliquez la SDT (Autodétermination) aux bénévoles.',
          options: [
            { left_fr: 'Bénévole oublié', right_fr: 'Compétence (Merci)' },
            { left_fr: 'Artisan micro-géré', right_fr: 'Autonomie (Choix)' },
            { left_fr: 'Visiteur seul', right_fr: 'Affiliation (Lien)' }
          ],
          pos: 'MAÎTRISÉ ! Les 3 besoins sont universels (Deci & Ryan).',
          neg: 'Reconnaissance, Liberté et Appartenance sont les clés.'
        },
        {
          type: 'Texte à trous',
          q: 'Plan de communication de crise (Festival).',
          options: [
            { text: 'public' }, { text: 'canal' }, { text: 'timing' }, { text: 'empathie' },
            { text: 'transparence' }, { text: 'solution' }, { text: 'action' }
          ],
          correct: 'public, canal, timing, empathie, transparence, solution, action',
          pos: 'PROTOCOLE MAÎTRISÉ ! Identique à la communication du Wali (R5).',
          neg: 'L\'empathie et la transparence sont indispensables en crise.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Dilemme Éthique : Sponsor vs Concurrent.',
          options: {
            steps: [
              {
                question: 'Chantage sponsor ?',
                responses: [
                  { id: 'A', text: 'Accepter' },
                  { id: 'B', text: 'Refuser' }
                ],
                correct: 'B'
              },
              {
                question: 'Menace future ?',
                responses: [
                  { id: 'A', text: 'Céder' },
                  { id: 'B', text: 'Crédibilité > Argent' }
                ],
                correct: 'B'
              },
              {
                question: 'Compenser perte ?',
                responses: [
                  { id: 'A', text: 'Annuler' },
                  { id: 'B', text: 'Crowdfunding + Réduction' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: 'INTÉGRITÉ ABSOLUE ! L\'éthique coûte cher à court terme mais rapporte à vie.',
          neg: 'Céder au chantage détruit la réputation du festival à jamais.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédige le BILAN professionnel du festival (Réussites, Améliorations, Recommandations).',
          correct: 'Réussites, Améliorations, Recommandations',
          pos: 'PROFESSIONNEL ! Vous passez au niveau Bloom 4 (Analyser).',
          neg: 'Assurez-vous de couvrir les 3 sections du bilan.'
        },
        {
          type: 'Énigme',
          q: '« Je suis le PONT entre théorie et pratique... À Rabat tu m\'as découvert, à Chefchaouen tu m\'as VÉCU. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'Le savoir' },
            { id: 'B', label_fr: 'La compétence' },
            { id: 'C', label_fr: 'Le talent' }
          ],
          correct: 'B',
          pos: 'FÉLICITATIONS ! Tu as conquis Chefchaouen. Direction FÈS pour l\'ANALYSE.',
          neg: 'Indice : Ce qui reste quand on a tout oublié.'
        }
      ]
    }
  ];

  for (const m of missionsData) {
    const { error: mErr } = await supabase.from('missions').upsert({
      id: m.id,
      city_id: CHEF_CHALLENGE_PK,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr: m.title_fr,
      description_fr: m.description_fr,
      sort_order: parseInt(m.id.split('c0')[1]), // ID ends in c01, c02...
      is_published: true
    });
    if (mErr) { console.error(`Mission ${m.title_fr} error:`, mErr); continue; }
    console.log(`✅ Mission ${m.title_fr} upserted`);

    // Clean old questions
    await supabase.from('questions').delete().eq('mission_id', m.id);

    const questionsToInsert = m.questions.map((q, idx) => {
      let optionsData = q.options;
      if (q.type === 'Appariement' || q.type === 'Rôles d’équipe') {
        optionsData = q.options.map(o => ({ left_fr: o.left_fr, right_fr: o.right_fr }));
      } else if (q.type === 'Texte à trous') {
        optionsData = q.options.map(o => ({ text: o.text }));
      } else if (q.type === 'Détection d’erreurs') {
        optionsData = q.options.map(o => ({ text_fr: o.text_fr, is_error: o.is_error }));
      } else if (q.type === 'Scénario en cascade') {
        optionsData = q.options;
      } else if (q.type === 'Classement') {
        optionsData = q.options.map(o => ({ label_fr: o.label_fr }));
      }

      return {
        mission_id: m.id,
        question_type: TYPE_MAPPING[q.type] || 'qcm',
        question_fr: q.q,
        options: optionsData || [],
        correct_answer: q.correct || '',
        explanation_fr: q.pos || '',
        hint_fr: q.neg || '',
        xp_reward: q.type === 'Énigme' ? 250 : 100,
        time_limit_sec: q.type === 'Contre-la-montre' ? 20 : 45,
        sort_order: idx + 1,
        is_published: true
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Error Mission ${m.id}:`, qErr);
      // fallback
      for (const qi of questionsToInsert) {
        const { error: sErr } = await supabase.from('questions').insert(qi);
        if (sErr) console.error(`Culprit Q${qi.sort_order}:`, sErr);
      }
    } else {
      console.log(`✅ ${questionsToInsert.length} questions for ${m.id}`);
    }
  }

  console.log('🏁 Chefchaouen HIGH-FIDELITY import FINISHED!');
}

importChefchaouen();
