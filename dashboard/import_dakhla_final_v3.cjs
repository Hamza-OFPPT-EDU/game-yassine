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

async function importDakhla() {
  console.log('🚀 Starting Dakhla HIGH-FIDELITY (Acte VI) import...');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: DAKHLA_CHALLENGE_PK,
    city_id: 'dakhla',
    city_name_fr: 'Dakhla',
    city_name_ar: 'الداخلة',
    description_fr: `Dakhla, perle de l’Atlantique, est l’ultime étape du voyage. Ici, vous ne découvrirez pas de nouveaux concepts : vous maîtriserez tous ceux que vous avez appris. La maîtrise, c’est agir avec fluidité et intuition, sans protocole, parce que les compétences sont devenues naturelles.`,
    headline_fr: `🌊 ACTE VI - LA LAGUNE BLEUE : LA MAÎTRISE`,
    sort_order: 6,
    is_published: true,
    city_color: '#06b6d4',
    icon_name: 'waves'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Dakhla upserted');

  const missionsData = [
    {
      id: MISSION_IDS.D1,
      title_fr: 'Mission D1 : Port de Pêche - La Maîtrise du Stress',
      description_fr: `Mentor: Capitaine Brahim. Soft Skill: Gestion du stress (MAÎTRISE). Agissez avec intuition et calme dans le chaos du port.`,
      questions: [
        {
          type: 'QCM',
          q: `Une tempête soudaine éclate alors que les bateaux rentrent. Vous ne trouvez pas le manuel d'urgence. Que faites-vous ?`,
          options: [
            { id: 'A', label_fr: 'Paniquer' },
            { id: 'B', label_fr: `Faire confiance à votre "Flow" : agir par instinct entraîné, coordonner sans réfléchir.` },
            { id: 'C', label_fr: 'Chercher le manuel partout' },
            { id: 'D', label_fr: 'Attendre les ordres' }
          ],
          correct: 'B',
          pos: `C'est la maîtrise ! La compétence est devenue un réflexe. Vous agissez avec fluidité.`,
          neg: `À ce stade, le manuel est en vous. L'action juste surgit de votre expérience.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un vieux marin refuse de rentrer au port malgré le danger. Comment utilisez-vous votre maîtrise pour le convaincre ?`,
          options: [
            { id: 'A', label_fr: 'Lui crier dessus' },
            { id: 'B', label_fr: `Regard calme, voix basse : « Brahim, la mer a changé de couleur. On se retrouve au thé dans 10 min ? »` },
            { id: 'C', label_fr: 'Appeler la police' }
          ],
          correct: 'B',
          pos: `Maîtrise émotionnelle and non-verbale. Vous communiquez d'âme à âme.`,
          neg: `Le conflit bloque. La maîtrise, c'est savoir contourner la résistance par le calme.`
        },
        {
          type: 'Appariement',
          q: `Reliez l'état mental à son effet sur la maîtrise.`,
          options: [
            { left_fr: 'Flow', right_fr: 'Action sans effort conscient' },
            { left_fr: 'Hyper-vigilance', right_fr: 'Détection des signaux faibles' },
            { left_fr: 'Lâcher-prise', right_fr: 'Créativité immédiate' },
            { left_fr: 'Ancrage', right_fr: 'Stabilité dans la tempête' }
          ],
          pos: `Les piliers de la maîtrise psychologique validés.`,
          neg: `Révisez les états de conscience du leader accompli.`
        },
        {
          type: 'Vrai/Faux',
          q: `« La maîtrise signifie qu'on ne fait plus d'erreurs. »`,
          correct: 'faux',
          pos: `Vrai ! La maîtrise, c'est savoir corriger ses erreurs instantanément et sans stress.`,
          neg: `L'erreur est humaine. Le maître l'intègre and la transforme.`
        },
        {
          type: 'Classement',
          q: `Classez l'évolution de votre compétence depuis Rabat.`,
          options: [
            { label_fr: `Incompétence consciente (Rabat : "Je ne sais pas")` },
            { label_fr: `Compétence consciente (Chefchaouen : "Je réfléchis pour faire")` },
            { label_fr: `Compétence inconsciente (Dakhla : "Je fais sans y penser")` },
            { label_fr: `Maîtrise (Dakhla : "Je suis la compétence")` }
          ],
          pos: `Le cycle de l'apprentissage (Maslow) complété.`,
          neg: `Vous êtes passé du "Savoir" au "Être".`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion d'une collision évitée de justesse.`,
          options: {
            steps: [
              {
                question: 'Deux navires foncent l\'un sur l\'autre. Action réflexe ?',
                responses: [
                  { id: 'A', text: 'Crier dans la radio' },
                  { id: 'B', text: 'Signal sonore bref + changement de cap instinctif' }
                ],
                correct: 'B'
              },
              {
                question: 'La collision est évitée. Votre rythme cardiaque est ?',
                responses: [
                  { id: 'A', text: 'À 180 (Panique)' },
                  { id: 'B', text: 'Stable (Calme olympien)' }
                ],
                correct: 'B'
              },
              {
                question: 'Le capitaine adverse s\'excuse. Que lui dites-vous ?',
                responses: [
                  { id: 'A', text: 'L\'insulter' },
                  { id: 'B', text: `« On a tous les deux appris aujourd'hui. Bonne mer. »` }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Maîtrise totale du corps and de l'esprit. Vous habitez la situation.`,
          neg: `Le stress résiduel est le signe d'une maîtrise incomplète. Respirez.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 3 signes d'un "Maître" qui se repose sur ses lauriers (danger).`,
          options: [
            { text_fr: 'Excès de confiance (Overconfidence)', is_error: true },
            { text_fr: 'Arrêt de l\'observation des signaux faibles', is_error: true },
            { text_fr: 'Refus des nouvelles technologies', is_error: true },
            { text_fr: 'Maintien de la "Débutant Mindset"', is_error: false }
          ],
          pos: `Le plus grand danger du maître est de croire qu'il n'a plus rien à apprendre.`,
          neg: `Gardez toujours votre "esprit de débutant" (Shoshin).`
        },
        {
          type: 'Texte à trous',
          q: `La maîtrise est l'union de la __________ (esprit) et de la __________ (corps).`,
          options: [
            { text: 'sagesse' }, { text: 'technique' }
          ],
          correct: 'sagesse, technique',
          pos: `L'équilibre parfait du leader de Dakhla.`,
          neg: `La technique sans sagesse est dangereuse. La sagesse sans technique est impuissante.`
        },
        {
          type: 'Contre-la-montre',
          q: `Urgence : Un filet se prend dans l'hélice. 5 secondes.`,
          options: [
            { id: 'A', label_fr: 'Couper le moteur, plonger' },
            { id: 'B', label_fr: 'Accélérer' }
          ],
          correct: 'A',
          pos: `Réflexe de protection immédiat.`,
          neg: `L'action juste ne souffre d'aucun délai.`
        },
        {
          type: 'Énigme',
          q: `« Je suis l'eau qui épouse la forme du vase, mais qui peut briser le rocher. Je suis sans forme mais je contiens tout le voyage. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le thé' },
            { id: 'B', label_fr: 'La maîtrise' },
            { id: 'C', label_fr: 'La mer' }
          ],
          correct: 'B',
          pos: `Comme l'eau de Bruce Lee, votre compétence est devenue fluide and adaptable.`,
          neg: "C'est l'adaptation suprême."
        }
      ]
    },
    {
      id: MISSION_IDS.D2,
      title_fr: 'Mission D2 : Station de Biologie Marine - Maîtrise de l\'Analyse',
      description_fr: `Mentor: Dr. Leila. Soft Skill: Analyse systémique (MAÎTRISE). Percevez les liens invisibles de l'écosystème lagunaire.`,
      questions: [
        {
          type: 'QCM',
          q: `Une espèce de poisson disparaît. Au lieu de chercher un coupable, que regardez-vous ?`,
          options: [
            { id: 'A', label_fr: 'Les braconniers' },
            { id: 'B', label_fr: 'Le système global : courants, température, plancton et activités humaines.' },
            { id: 'C', label_fr: 'La météo' }
          ],
          correct: 'B',
          pos: `Vision holistique ! Vous ne voyez plus des problèmes, mais des déséquilibres de système.`,
          neg: `Le coupable unique est une illusion. Tout est lié.`
        },
        {
          type: 'Appariement',
          q: `Reliez l'action à son impact systémique caché.`,
          options: [
            { left_fr: 'Planter des mangroves', right_fr: 'Protection des côtes + nurseries poissons' },
            { left_fr: 'Réduire le plastique', right_fr: 'Santé de la chaîne alimentaire' },
            { left_fr: 'Tourisme régulé', right_fr: 'Économie locale + préservation' },
            { left_fr: 'Éducation jeunes', right_fr: 'Changement de culture à long terme' }
          ],
          pos: `Vous comprenez les "effets de levier" du système.`,
          neg: `Une action simple a toujours des répercussions multiples.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un hôtelier veut construire sur la lagune. Comment lui montrez-vous le risque systémique ?`,
          options: [
            { id: 'A', label_fr: `« C'est interdit »` },
            { id: 'B', label_fr: `« Votre hôtel détruira la beauté qui attire vos clients. C'est un suicide économique. »` },
            { id: 'C', label_fr: 'Accepter pour le profit' }
          ],
          correct: 'B',
          pos: `Argumentation par la boucle de rétroaction négative. Brillant.`,
          neg: `Montrez-lui que son propre intérêt dépend de la survie du système.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Un système complexe peut être contrôlé par une seule personne. »`,
          correct: 'faux',
          pos: `Faux ! On ne contrôle pas un système, on l'influence and on danse avec lui.`,
          neg: `Le contrôle est une illusion. La maîtrise, c'est l'influence.`
        },
        {
          type: 'Classement',
          q: `Classez les niveaux d'analyse d'un problème.`,
          options: [
            { label_fr: 'Événements (Ce qui se passe)' },
            { label_fr: 'Tendances (Ce qui se répète)' },
            { label_fr: 'Structures (Ce qui cause les tendances)' },
            { label_fr: 'Modèles mentaux (Ce qui crée les structures)' }
          ],
          pos: `L'iceberg de l'analyse systémique. Vous visez la base.`,
          neg: `Ne restez pas à la surface des événements.`
        },
        {
          type: 'Scénario en cascade',
          q: `Sauvetage de la lagune d'une pollution chimique.`,
          options: {
            steps: [
              {
                question: 'Une usine rejette des produits. Action immédiate ?',
                responses: [
                  { id: 'A', text: 'Fermer l\'usine' },
                  { id: 'B', text: 'Évaluer le flux : où va le produit ? Quelles espèces sont touchées ?' }
                ],
                correct: 'B'
              },
              {
                question: 'Le produit touche les huîtres. Impact ?',
                responses: [
                  { id: 'A', text: 'Perte de stock' },
                  { id: 'B', text: 'Risque sanitaire + image de Dakhla + faillite des familles' }
                ],
                correct: 'B'
              },
              {
                question: 'Solution systémique ?',
                responses: [
                  { id: 'A', text: 'Une amende' },
                  { id: 'B', text: 'Économie circulaire : transformer le déchet de l\'usine en ressource pour une autre.' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Maîtrise de la complexité. Vous transformez un problème en opportunité système.`,
          neg: `L'amende est un pansement. La boucle circulaire est la solution.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 3 "points de rupture" dans ce projet de station marine.`,
          options: [
            { text_fr: 'Dépendance à une seule source de financement', is_error: true },
            { text_fr: 'Absence de relève locale formée', is_error: true },
            { text_fr: 'Oubli de l\'impact social sur les pêcheurs', is_error: true },
            { text_fr: 'Multiplicité des partenariats', is_error: false }
          ],
          pos: `Analyse de résilience parfaite. Vous voyez les failles du futur.`,
          neg: `Un système fragile s'effondre au premier choc. Cherchez la robustesse.`
        },
        {
          type: 'Texte à trous',
          q: `Dans un système, le __________ est plus important que les __________.`,
          options: [
            { text: 'lien' }, { text: 'éléments' }
          ],
          correct: 'lien, éléments',
          pos: `C'est la définition même de la systémique. Bravo.`,
          neg: `Un ensemble d'éléments sans liens n'est pas un système, c'est un tas.`
        },
        {
          type: 'Contre-la-montre',
          q: `Anomalie thermique détectée. 10 sec.`,
          options: [
            { id: 'A', label_fr: 'Ignorer' },
            { id: 'B', label_fr: 'Vérifier capteur -> corréler avec vent -> alerter' },
            { id: 'C', label_fr: 'Attendre demain' }
          ],
          correct: 'B',
          pos: `Réflexe d'analyste maître. Corrélation immédiate.`,
          neg: `Le signal faible est l'annonce de la crise. Ne l'ignorez pas.`
        },
        {
          type: 'Énigme',
          q: `« Je suis partout mais personne ne me voit. Je relie le battement d'aile du papillon à la tempête lointaine. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `L'air` },
            { id: 'B', label_fr: `L'interdépendance` },
            { id: 'C', label_fr: `Le destin` }
          ],
          correct: 'B',
          pos: `L'interdépendance est la loi suprême de Dakhla.`,
          neg: `Tout est lié, tout résonne.`
        }
      ]
    },
    {
      id: MISSION_IDS.D3,
      title_fr: 'Mission D3 : Parc Éolien - Maîtrise de la Décision',
      description_fr: `Mentor: Ingénieur Youssef. Soft Skill: Prise de décision (MAÎTRISE). Prenez des décisions stratégiques avec une clarté absolue.`,
      questions: [
        {
          type: 'QCM',
          q: `Une éolienne tombe en panne pendant un pic de demande. Quel est votre processus de décision maître ?`,
          options: [
            { id: 'A', label_fr: 'Réparer vite' },
            { id: 'B', label_fr: 'Analyser : Impact sur le réseau, coût de l\'arrêt vs risque sécurité, puis trancher.' },
            { id: 'C', label_fr: 'Demander l\'avis de tout le monde' }
          ],
          correct: 'B',
          pos: `Décision structurée and rapide. Vous maîtrisez le temps and les enjeux.`,
          neg: `La précipitation n'est pas la rapidité. Évaluez avant de trancher.`
        },
        {
          type: 'Appariement',
          q: `Reliez le style de décision à la situation.`,
          options: [
            { left_fr: 'Autocratique', right_fr: 'Urgence vitale (Incendie)' },
            { left_fr: 'Consultatif', right_fr: 'Problème technique complexe' },
            { left_fr: 'Consensus', right_fr: 'Vision stratégique long terme' },
            { left_fr: 'Délégué', right_fr: 'Tâches de routine maîtrisées' }
          ],
          pos: `Maîtrise des styles de leadership. Vous savez quand trancher seul ou ensemble.`,
          neg: `Un seul style ne suffit pas. Adaptez-vous au contexte.`
        },
        {
          type: 'Dialogue de situation',
          q: `Le Wali hésite entre éolien et solaire. Votre synthèse de maître ?`,
          options: [
            { id: 'A', label_fr: `« L'éolien est mieux »` },
            { id: 'B', label_fr: `« L'éolien produit la nuit, le solaire le jour. La maîtrise, c'est le mix énergétique pour une autonomie totale. »` },
            { id: 'C', label_fr: `« Comme vous voulez »` }
          ],
          correct: 'B',
          pos: `Synthèse parfaite. Vous ne vendez pas une solution, vous proposez une stratégie.`,
          neg: `Le choix n'est pas binaire. Visez l'intégration.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Une bonne décision est une décision qui plaît à tout le monde. »`,
          correct: 'faux',
          pos: `Faux ! Une bonne décision est celle qui sert l'objectif commun, même si elle est impopulaire.`,
          neg: `Le leader n'est pas un candidat à une élection, c'est un garant du futur.`
        },
        {
          type: 'Classement',
          q: `Ordre de la décision stratégique.`,
          options: [
            { label_fr: 'Cadrage (Quel est le vrai problème ?)' },
            { label_fr: 'Options (Quelles sont les alternatives ?)' },
            { label_fr: 'Arbitrage (Quel est le meilleur compromis ?)' },
            { label_fr: 'Engagement (Action et suivi)' }
          ],
          pos: `Méthode de décision infaillible.`,
          neg: `Ne sautez pas aux options avant d'avoir cadré le problème.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion d'une panne majeure du réseau.`,
          options: {
            steps: [
              {
                question: 'Blackout total à Dakhla. Priorité ?',
                responses: [
                  { id: 'A', text: 'Rétablir le port' },
                  { id: 'B', text: 'Ligne d\'urgence de l\'hôpital' }
                ],
                correct: 'B'
              },
              {
                question: 'L\'hôpital est sécurisé. Le Wali demande des comptes. Que dire ?',
                responses: [
                  { id: 'A', text: '« Je ne sais pas »' },
                  { id: 'B', text: '« Cause identifiée, rétablissement progressif zone par zone. Sécurité d\'abord. »' }
                ],
                correct: 'B'
              },
              {
                question: 'Crise terminée. Action de maître ?',
                responses: [
                  { id: 'A', text: 'Aller dormir' },
                  { id: 'B', text: 'Post-Mortem : pourquoi le système a flanché ? Créer la résilience pour la prochaine fois.' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Gestion de crise de niveau expert. Vous transformez l'échec en force.`,
          neg: `La crise ne s'arrête pas au retour du courant. Elle finit au retour de la compréhension.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 3 biais de décision dans cette réunion.`,
          options: [
            { text_fr: 'Escalade de l\'engagement (on continue car on a déjà payé)', is_error: true },
            { text_fr: 'Effet de halo (le chef a toujours raison car il est sympa)', is_error: true },
            { text_fr: 'Biais de récence (on ne parle que du dernier problème)', is_error: true },
            { text_fr: 'Analyse des données contradictoires', is_error: false }
          ],
          pos: `Votre esprit est un filtre anti-biais. Clarté absolue.`,
          neg: `Le cerveau est paresseux. Forcez-le à la rigueur.`
        },
        {
          type: 'Texte à trous',
          q: `Décider, c'est choisir un __________ parmi des __________. `,
          options: [
            { text: 'futur' }, { text: 'possibles' }
          ],
          correct: 'futur, possibles',
          pos: `Définition philosophique de la décision.`,
          neg: `Vous n'achetez pas un objet, vous créez un avenir.`
        },
        {
          type: 'Contre-la-montre',
          q: `Surcharge électrique ! 5 sec.`,
          options: [
            { id: 'A', label_fr: 'Attendre' },
            { id: 'B', label_fr: 'Délestage automatique zone industrielle' },
            { id: 'C', label_fr: 'Prier' }
          ],
          correct: 'B',
          pos: `Trancher dans le vif pour sauver l'essentiel. Bravo.`,
          neg: `L'indécision est plus coûteuse que l'erreur.`
        },
        {
          type: 'Énigme',
          q: `« Je suis le poids sur les épaules du leader, mais ses ailes quand il est juste. Je suis l'instant qui sépare le passé du futur. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `L'heure` },
            { id: 'B', label_fr: 'La décision' },
            { id: 'C', label_fr: 'Le regret' }
          ],
          correct: 'B',
          pos: `La décision est l'acte pur du leader de Dakhla.`,
          neg: "C'est là que votre destin s'écrit."
        }
      ]
    },
    {
      id: MISSION_IDS.D4,
      title_fr: 'Mission D4 : Économie Circulaire - Maîtrise de l\'Équipe',
      description_fr: `Mentor: Karim. Soft Skill: Travail en équipe (MAÎTRISE). Harmonisez les talents pour créer une lagune zéro déchet.`,
      questions: [
        {
          type: 'QCM',
          q: `Votre équipe est composée d'experts qui ne s'entendent pas. Quelle est votre action de maître ?`,
          options: [
            { id: 'A', label_fr: 'Les forcer à collaborer' },
            { id: 'B', label_fr: `Trouver le "But Suprême" qui dépasse leurs egos : La survie de la Lagune.` },
            { id: 'C', label_fr: 'Les remplacer' }
          ],
          correct: 'B',
          pos: `Superordinate Goal ! La maîtrise de l'équipe passe par le sens, pas par la force.`,
          neg: `L'ego se brise devant une mission plus grande que soi.`
        },
        {
          type: 'Appariement',
          q: `Reliez le comportement du leader à l'étape de l'équipe (Tuckman).`,
          options: [
            { left_fr: 'Directif', right_fr: 'Forming (Départ)' },
            { left_fr: 'Médiateur', right_fr: 'Storming (Conflit)' },
            { left_fr: 'Facilitateur', right_fr: 'Norming (Règles)' },
            { left_fr: 'Délégant', right_fr: 'Performing (Maîtrise)' }
          ],
          pos: `Vous guidez l'équipe à travers ses tempêtes.`,
          neg: `Ne soyez pas directif avec une équipe qui maîtrise déjà son sujet.`
        },
        {
          type: 'Dialogue de situation',
          q: `Une personne se sent inutile dans le projet circulaire. Comment utilisez-vous la SDT ?`,
          options: [
            { id: 'A', label_fr: `« Fais ton travail »` },
            { id: 'B', label_fr: `« Tu es le garant de la qualité finale. Sans toi, le cycle se brise. (Autonomie + Compétence + Affiliation) »` },
            { id: 'C', label_fr: 'L\'ignorer' }
          ],
          correct: 'B',
          pos: `Nourrir les 3 besoins psychologiques. Vous créez de l'engagement profond.`,
          neg: `L'utilité perçue est le moteur de la motivation.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Un maître n'a plus besoin d'équipe. »`,
          correct: 'faux',
          pos: `Faux ! Le maître est celui qui multiplie la force des autres par sa simple présence.`,
          neg: `Seul on va vite, ensemble on va loin. Dakhla est une aventure collective.`
        },
        {
          type: 'Classement',
          q: `Classez les niveaux de délégation.`,
          options: [
            { label_fr: 'Fais ce que je dis' },
            { label_fr: 'Propose-moi et je décide' },
            { label_fr: 'Décide et informe-moi' },
            { label_fr: 'Décide sans m\'informer (Totale confiance)' }
          ],
          pos: `L'échelle de la confiance maîtrisée.`,
          neg: `La délégation est un voyage, pas un bouton.`
        },
        {
          type: 'Scénario en cascade',
          q: `Conflit éthique dans l'équipe.`,
          options: {
            steps: [
              {
                question: 'Un membre veut tricher sur les chiffres de recyclage. Action ?',
                responses: [
                  { id: 'A', text: 'Se taire' },
                  { id: 'B', text: 'Confrontation immédiate sur les valeurs' }
                ],
                correct: 'B'
              },
              {
                question: 'Il dit : « C\'est pour sauver nos jobs ». Votre réponse ?',
                responses: [
                  { id: 'A', text: '« Bon, d\'accord »' },
                  { id: 'B', text: '« On ne sauve rien sur un mensonge. La maîtrise, c\'est assumer la vérité et trouver une solution réelle. »' }
                ],
                correct: 'B'
              },
              {
                question: 'L\'équipe est divisée. Comment ressouder ?',
                responses: [
                  { id: 'A', text: 'Un dîner' },
                  { id: 'B', text: 'Un atelier de "Vérité et Réconciliation" pour redéfinir notre éthique commune.' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Intégrité radicale. Vous êtes le garant de l'âme du projet.`,
          neg: `Le mensonge est le cancer de l'équipe. Tuez-le à la racine.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 3 signes de "Groupthink" (danger de l'équipe parfaite).`,
          options: [
            { text_fr: 'Plus personne n\'ose critiquer le leader', is_error: true },
            { text_fr: 'On ignore les infos qui contredisent le plan', is_error: true },
            { text_fr: 'On se croit invulnérable', is_error: true },
            { text_fr: 'On encourage le débat contradictoire', is_error: false }
          ],
          pos: `Le paradoxe de la maîtrise : savoir rester ouvert à la critique.`,
          neg: `Quand tout le monde pense pareil, c'est que personne ne pense.`
        },
        {
          type: 'Texte à trous',
          q: `L'intelligence __________ est la somme des intelligences __________ multipliée par la __________.`,
          options: [
            { text: 'collective' }, { text: 'individuelles' }, { text: 'confiance' }
          ],
          correct: 'collective, individuelles, confiance',
          pos: `La formule mathématique de l'équipe performante.`,
          neg: `Sans confiance, la somme est nulle.`
        },
        {
          type: 'Contre-la-montre',
          q: `Besoin d'une idée en 10 sec : Comment motiver les pêcheurs au recyclage ?`,
          options: [
            { id: 'A', label_fr: 'Amendes' },
            { id: 'B', label_fr: 'Échange filets plastiques contre bons carburant' },
            { id: 'C', label_fr: 'Rien' }
          ],
          correct: 'B',
          pos: `Économie circulaire : transformer le déchet en valeur. Gagnant-gagnant.`,
          neg: `L'incitation est plus forte que la punition.`
        },
        {
          type: 'Énigme',
          q: `« Je ne suis ni le cerveau, ni le coeur, mais le sang qui les relie. Je disparais quand tout va bien, mais on me cherche quand tout va mal. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L\'argent' },
            { id: 'B', label_fr: 'La cohésion' },
            { id: 'C', label_fr: 'Le chef' }
          ],
          correct: 'B',
          pos: `La cohésion est l'huile du système Dakhla.`,
          neg: `C'est le lien qui fait la force.`
        }
      ]
    },
    {
      id: MISSION_IDS.D5,
      title_fr: 'Mission D5 : Le Leader de la Lagune - La Synthèse Finale',
      description_fr: `Mentor: Le Wali & Tous vos Mentors. Soft Skill: Maîtrise Intégrée. L'épreuve finale du voyage.`,
      questions: [
        {
          type: 'QCM',
          q: `Après 6 villes, qu'avez-vous appris de plus important sur vous-même ?`,
          options: [
            { id: 'A', label_fr: 'Je suis le meilleur' },
            { id: 'B', label_fr: 'Je suis capable d\'apprendre, de m\'adapter et de servir une vision plus grande.' },
            { id: 'C', label_fr: 'Le voyage était trop long' },
            { id: 'D', label_fr: 'Je veux rentrer à Rabat' }
          ],
          correct: 'B',
          pos: `C'est la définition même de la croissance. Le voyage vous a transformé.`,
          neg: `Le voyage n'est pas une destination, c'est une transformation.`
        },
        {
          type: 'Classement',
          q: `Classez votre progression dans le Voyage des Compétences.`,
          options: [
            { label_fr: 'Rabat : Découverte du stress' },
            { label_fr: 'Chefchaouen : Application en équipe' },
            { label_fr: 'Fès : Analyse de la complexité' },
            { label_fr: 'Marrakech : Évaluation et Éthique' },
            { label_fr: 'Laâyoune : Création et Innovation' },
            { label_fr: 'Dakhla : Maîtrise et Sagesse' }
          ],
          pos: `Le cycle complet de la transformation humaine.`,
          neg: `Chaque étape était un pas vers vous-même.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un jeune étudiant à Rabat vous demande : "C'est quoi être un leader ?". Votre réponse ?`,
          options: [
            { id: 'A', label_fr: `« C'est commander »` },
            { id: 'B', label_fr: `« C'est être un pont entre le chaos et la solution, entre l'individu et le groupe, entre aujourd'hui et demain. »` },
            { id: 'C', label_fr: `« C'est gagner beaucoup d'argent »` }
          ],
          correct: 'B',
          pos: `Une définition digne d'un maître. Vous êtes prêt.`,
          neg: `Le leadership est un service, pas un privilège.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque mentor à sa leçon ultime.`,
          options: [
            { left_fr: 'Dr. Amina (Rabat)', right_fr: 'Le stress est une énergie' },
            { left_fr: 'Aziz (Chefchaouen)', right_fr: 'La nature est un professeur' },
            { left_fr: 'Maître Idris (Fès)', right_fr: 'L\'analyse est une patience' },
            { left_fr: 'Le Wali (Dakhla)', right_fr: 'La maîtrise est un engagement' }
          ],
          pos: `Vos mentors sont fiers de vous.`,
          neg: `N'oubliez jamais ceux qui vous ont ouvert la voie.`
        },
        {
          type: 'Scénario en cascade',
          q: `Le Choix Final d'Ishaq.`,
          options: {
            steps: [
              {
                question: 'On vous propose un poste de direction à Paris ou de créer une académie de soft skills à Dakhla. Votre choix ?',
                responses: [
                  { id: 'A', text: 'Paris (Confort et salaire)' },
                  { id: 'B', text: 'Dakhla (Impact et transmission)' }
                ],
                correct: 'B'
              },
              {
                question: 'L\'académie manque de moyens. Quelle compétence utilisez-vous ?',
                responses: [
                  { id: 'A', text: 'Stress' },
                  { id: 'B', text: 'Création frugale apprise à Laâyoune' }
                ],
                correct: 'B'
              },
              {
                question: '10 ans plus tard, vos élèves dirigent le pays. Quel est votre sentiment ?',
                responses: [
                  { id: 'A', text: 'Fierté personnelle' },
                  { id: 'B', text: 'Paix et sentiment d\'avoir accompli son "Voyage des Compétences".' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Maîtrise accomplie. Vous avez trouvé votre Ikigai.`,
          neg: `Le confort n'est pas le but. L'impact est la destination.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Le voyage est terminé. »`,
          correct: 'faux',
          pos: `Vrai ! Car le vrai voyage commence maintenant, dans la vie réelle.`,
          neg: `La fin d'un cycle est le début d'un autre. Restez curieux.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 3 erreurs de celui qui se croit "arrivé".`,
          options: [
            { text_fr: 'Cesser de lire et d\'apprendre', is_error: true },
            { text_fr: 'Mépriser les débutants', is_error: true },
            { text_fr: 'Ignorer les nouveaux problèmes du monde', is_error: true },
            { text_fr: 'Transmettre son savoir humblement', is_error: false }
          ],
          pos: `L'humilité est la marque des plus grands maîtres.`,
          neg: `L'arrogance est la fin de la maîtrise.`
        },
        {
          type: 'Texte à trous',
          q: `Le Voyage des Compétences n'est pas un __________, c'est une __________. `,
          options: [
            { text: 'jeu' }, { text: 'métamorphose' }
          ],
          correct: 'jeu, métamorphose',
          pos: `Vous n'êtes plus la même personne qu'à Rabat.`,
          neg: "C'est bien plus qu'un score XP."
        },
        {
          type: 'Contre-la-montre',
          q: `Dernier mot au Wali. 3 secondes.`,
          options: [
            { id: 'A', label_fr: 'Merci' },
            { id: 'B', label_fr: 'Prêt' },
            { id: 'C', label_fr: 'Ensemble' }
          ],
          correct: 'B',
          pos: 'Prêt pour le monde. Prêt pour le futur.',
          neg: 'Soyez prêt, toujours.'
        },
        {
          type: 'Énigme',
          q: `« J'ai commencé par un pas à Rabat, j'ai traversé les montagnes et les déserts. Je ne suis pas sur une carte, je suis dans ton coeur. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le guide' },
            { id: 'B', label_fr: 'Ton voyage' },
            { id: 'C', label_fr: 'Le Maroc' }
          ],
          correct: 'B',
          pos: `Félicitations, Leader ! Votre voyage à Dakhla s'achève, mais votre légende commence. Bravo !`,
          neg: "C'est votre histoire."
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      city_id: DAKHLA_CHALLENGE_PK,
      challenge_id: DAKHLA_CHALLENGE_PK,
      title_fr,
      description_fr,
      xp_reward: 1000,
      sort_order: parseInt(id.slice(-1)) || 1
    });

    if (mErr) { console.error(`Error upserting mission ${title_fr}:`, mErr); continue; }
    console.log(`✅ Mission ${title_fr} upserted`);

    await supabase.from('questions').delete().eq('mission_id', id);

    const questionsToInsert = questions.map((q, idx) => {
      const type = TYPE_MAPPING[q.type] || 'qcm';
      let optionsData = q.options;

      if (type === 'matching' || type === 'team_roles') {
        optionsData = { pairs: q.options.map(o => ({ left: o.left_fr, right: o.right_fr })) };
      } else if (type === 'fill_blanks') {
        optionsData = { bank: q.options.map(o => ({ text: o.text })) };
      } else if (type === 'ranking') {
        optionsData = q.options.map(o => ({ label: o.label_fr }));
      } else if (type === 'error_detection') {
        optionsData = q.options.map(o => ({ text_fr: o.text_fr, is_error: o.is_error }));
      }

      return {
        mission_id: id,
        question_type: type,
        question_fr: q.q,
        options: optionsData || [],
        correct_answer: q.correct || '',
        feedback_positive_fr: q.pos || '',
        feedback_negative_fr: q.neg || '',
        explanation_fr: q.pos || '',
        hint_fr: q.neg || '',
        xp_reward: type === 'puzzle_riddle' ? 250 : 100,
        time_limit_sec: 45,
        sort_order: idx + 1,
        is_published: true
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Error inserting questions for ${title_fr}:`, qErr);
    } else {
      console.log(`✅ 10 questions for ${id}`);
    }
  }

  console.log('🏁 Dakhla HIGH-FIDELITY import FINISHED!');
}

importDakhla();
