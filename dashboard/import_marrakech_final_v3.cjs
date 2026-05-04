const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
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
  'Réponse courte': 'short_answer'
};

async function importMarrakech() {
  console.log('🚀 Starting Marrakech HIGH-FIDELITY (Acte IV) import...');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: MARRAKECH_CHALLENGE_PK,
    city_id: 'marrakech',
    city_name_fr: 'Marrakech',
    city_name_ar: 'مراكش',
    description_fr: "Marrakech, ville du business et du tourisme, vous invite à évaluer : juger la qualité des décisions, critiquer avec des arguments solides, choisir entre des options toutes valables, et justifier vos choix avec des critères explicites.",
    headline_fr: '🏜️ ACTE IV - LA PERLE DU SUD : L\'ÉVALUATION',
    sort_order: 4,
    is_published: true,
    city_color: '#e11d48',
    icon_name: 'palmtree'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Marrakech upserted');

  const missionsData = [
    {
      id: MISSION_IDS.M1,
      title_fr: 'Mission M1 : Startup Tech - Le Pitch d’Or',
      description_fr: "Mentor: Mehdi (Entrepreneur). Soft Skill: Prise de décision (ÉVALUATION). Apprenez à évaluer la viabilité d'un projet et à critiquer de manière constructive.",
      questions: [
        {
          type: 'QCM',
          q: 'Une startup propose une IA pour "traduire le silence". Quel est votre jugement critique prioritaire ?',
          options: [
            { id: 'A', label_fr: `Le design de l'application` },
            { id: 'B', label_fr: `La pertinence du besoin client (Product-Market Fit)` },
            { id: 'C', label_fr: `Le nom de la startup` },
            { id: 'D', label_fr: `La couleur du logo` }
          ],
          correct: 'B',
          pos: `Parfait ! L'évaluation commence par la validation du besoin réel. Le "silence" n'est pas un problème à résoudre.`,
          neg: `L'esthétique est secondaire. Évaluez d'abord si l'idée répond à un vrai problème.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque indicateur (KPI) à ce qu'il évalue réellement.`,
          options: [
            { left_fr: `CAC (Coût d'Acquisition)`, right_fr: `Efficacité marketing` },
            { left_fr: `Churn Rate`, right_fr: `Fidélité client` },
            { left_fr: `Burn Rate`, right_fr: `Vitesse de consommation du cash` },
            { left_fr: `NPS`, right_fr: `Satisfaction et recommandation` }
          ],
          pos: `Excellente maîtrise des outils d'évaluation business.`,
          neg: `Révisez : Churn = départ clients, Burn = dépenses, NPS = satisfaction.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un fondateur refuse votre critique : "Vous ne comprenez pas mon génie". Que répondez-vous ?`,
          options: [
            { id: 'A', label_fr: `« Vous avez raison, désolé. »` },
            { id: 'B', label_fr: `« Mon évaluation repose sur des critères objectifs : coût de revient vs prix marché. »` },
            { id: 'C', label_fr: `« C'est nul, point final. »` }
          ],
          correct: 'B',
          pos: `Bravo ! L'évaluation n'est pas une opinion, c'est un jugement basé sur des critères explicites.`,
          neg: `Ne cédez pas à l'émotion. Justifiez votre position par des faits et des critères.`
        },
        {
          type: 'Classement',
          q: `Classez les étapes d'une évaluation rigoureuse.`,
          options: [
            { label_fr: `Définir les critères` },
            { label_fr: `Collecter les données` },
            { label_fr: `Comparer aux standards` },
            { label_fr: `Émettre un jugement argumenté` }
          ],
          pos: `Méthode parfaite. C'est le coeur du niveau Bloom 5.`,
          neg: `On ne juge pas avant d'avoir collecté les données et défini les critères.`
        },
        {
          type: 'Vrai/Faux',
          q: `« L'évaluation doit toujours être négative pour être utile. »`,
          correct: 'faux',
          pos: `Exact ! Évaluer, c'est peser le positif et le négatif par rapport à un objectif.`,
          neg: `Critiquer n'est pas démolir. C'est analyser la valeur réelle, bonne ou mauvaise.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 3 "red flags" (erreurs) dans ce business plan.`,
          options: [
            { text_fr: `« Pas de concurrents sur ce marché »`, is_error: true },
            { text_fr: `« Croissance de 500% garantie sans budget pub »`, is_error: true },
            { text_fr: `« Équipe composée uniquement de développeurs »`, is_error: true },
            { text_fr: `« Analyse des risques détaillée »`, is_error: false }
          ],
          pos: `Vigilance critique activée ! L'absence de concurrents est souvent le signe d'un marché inexistant.`,
          neg: `Une croissance "garantie" et une équipe non diversifiée sont des signes de danger.`
        },
        {
          type: 'Texte à trous',
          q: `L’évaluation __________ permet de corriger le tir, tandis que l’évaluation __________ valide le résultat final.`,
          options: [
            { text: 'formative' }, { text: 'sommative' }
          ],
          correct: 'formative, sommative',
          pos: `Juste ! En startup, l'évaluation formative (continue) est vitale.`,
          neg: `Rappelez-vous : formative = pendant (pour apprendre), sommative = après (pour juger).`
        },
        {
          type: 'Contre-la-montre',
          q: `Décision d'investissement éclair : Projet A (Risque élevé, ROI x10) vs Projet B (Risque faible, ROI x2). Votre critère ?`,
          options: [
            { id: 'A', label_fr: `Toujours le risque faible` },
            { id: 'B', label_fr: `L'alignement avec la stratégie globale` },
            { id: 'C', label_fr: `L'intuition` }
          ],
          correct: 'B',
          pos: `L'évaluation dépend toujours du contexte stratégique. Bien joué.`,
          neg: `Le risque ou le gain ne disent rien sans la stratégie globale.`
        },
        {
          type: 'Scénario en cascade',
          q: `Audit d'une startup en crise.`,
          options: {
            steps: [
              {
                question: `La startup a perdu 40% de ses clients. Première action d'évaluation ?`,
                responses: [
                  { id: 'A', text: `Licencier l'équipe` },
                  { id: 'B', text: `Interroger les clients partis (Exit Interview)` }
                ],
                correct: 'B'
              },
              {
                question: `Les clients disent : "Le prix est trop élevé pour le service". Jugement ?`,
                responses: [
                  { id: 'A', text: `Baisser les prix immédiatement` },
                  { id: 'B', text: `Évaluer le rapport Valeur/Prix par rapport à la concurrence` }
                ],
                correct: 'B'
              },
              {
                question: `La concurrence est 20% moins chère avec les mêmes fonctions. Conclusion ?`,
                responses: [
                  { id: 'A', text: `Le modèle actuel n'est plus viable, il faut pivoter ou réduire les coûts.` },
                  { id: 'B', text: `Continuer et espérer` }
                ],
                correct: 'A'
              }
            ]
          },
          pos: `Audit logique et implacable. Vous évaluez les causes réelles.`,
          neg: `Les décisions impulsives sans évaluation des causes mènent à l'échec.`
        },
        {
          type: 'Énigme',
          q: `« Je suis le pont entre ce qui est et ce qui devrait être. Je pèse sans balance et je tranche sans couteau. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `Le temps` },
            { id: 'B', label_fr: `Le jugement` },
            { id: 'C', label_fr: `L'argent` }
          ],
          correct: 'B',
          pos: `Le jugement argumenté est votre outil le plus précieux à Marrakech.`,
          neg: `C'est le jugement qui permet de mesurer l'écart entre le réel et l'idéal.`
        }
      ]
    },
    {
      id: MISSION_IDS.M2,
      title_fr: `Mission M2 : Riad de Luxe - L'Évaluation Interculturelle`,
      description_fr: `Mentor: Lalla Mina (Maîtresse de maison). Soft Skill: Travail en équipe (ÉVALUATION). Évaluez la qualité d'un service et gérez les subtilités culturelles.`,
      questions: [
        {
          type: 'QCM',
          q: `Un client VIP se plaint du "manque de chaleur" du personnel, alors que tout est techniquement parfait. Que devez-vous évaluer ?`,
          options: [
            { id: 'A', label_fr: `Le respect du protocole` },
            { id: 'B', label_fr: `La dimension émotionnelle et culturelle de l'accueil` },
            { id: 'C', label_fr: `Le prix de la chambre` },
            { id: 'D', label_fr: `La propreté du sol` }
          ],
          correct: 'B',
          pos: `Exact ! Dans le luxe, l'évaluation porte autant sur l'émotion que sur la technique.`,
          neg: `Le protocole ne suffit pas si l'âme et l'hospitalité manquent.`
        },
        {
          type: 'Appariement',
          q: `Reliez le comportement du client à son besoin culturel probable.`,
          options: [
            { left_fr: `Client japonais (silencieux)`, right_fr: `Besoin de discrétion et respect` },
            { left_fr: `Client américain (enthousiaste)`, right_fr: `Besoin de reconnaissance et rapidité` },
            { left_fr: `Client marocain (discute)`, right_fr: `Besoin de relation et chaleur` },
            { left_fr: `Client allemand (ponctuel)`, right_fr: `Besoin de précision et efficacité` }
          ],
          pos: `Maîtrise parfaite des codes interculturels.`,
          neg: `Révisez les styles de communication : high-context vs low-context.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un employé a fait une erreur devant un client. Comment évaluez-vous sa performance en privé ?`,
          options: [
            { id: 'A', label_fr: `« Tu as été nul, ne recommence plus. »` },
            { id: 'B', label_fr: `« Ton accueil était bon, mais ton timing sur le thé a stressé le client. Comment faire mieux ? »` },
            { id: 'C', label_fr: `Ignorer pour ne pas le blesser` }
          ],
          correct: 'B',
          pos: `Feedback sandwich ! Évaluation constructive qui encourage le progrès.`,
          neg: `Le blâme bloque l'apprentissage. L'évaluation doit être un levier de croissance.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Dans un Riad, la tradition prime toujours sur les standards internationaux de luxe. »`,
          correct: 'faux',
          pos: `Juste ! L'excellence réside dans l'équilibre évalué entre authenticité et standards.`,
          neg: `Le luxe exige les deux. Il faut savoir quand privilégier l'un ou l'autre.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 3 erreurs de protocole dans ce service de thé.`,
          options: [
            { text_fr: `Servir avec la main gauche`, is_error: true },
            { text_fr: `Remplir le verre à ras bord`, is_error: true },
            { text_fr: `Ne pas faire mousser le thé`, is_error: true },
            { text_fr: `Servir les aînés en premier`, is_error: false }
          ],
          pos: `Précision culturelle ! Ces détails font la différence entre un 3* et un 5*.`,
          neg: `La main gauche et le manque de mousse sont des fautes graves de savoir-vivre ici.`
        },
        {
          type: 'Classement',
          q: `Classez les priorités pour gérer un client "difficile".`,
          options: [
            { label_fr: `Écouter sans interrompre` },
            { label_fr: `Valider l'émotion (« Je comprends votre gêne »)` },
            { label_fr: `Évaluer la source du problème` },
            { label_fr: `Proposer deux solutions évaluées` }
          ],
          pos: `L'ordre de la désescalade. L'écoute vient avant l'action.`,
          neg: `Ne proposez pas de solution avant d'avoir écouté et validé l'émotion.`
        },
        {
          type: 'Texte à trous',
          q: `L'hospitalité marocaine repose sur la __________, tandis que le luxe international exige la __________.`,
          options: [
            { text: 'générosité' }, { text: 'rigueur' }
          ],
          correct: 'générosité, rigueur',
          pos: `C'est l'alliance de ces deux mondes que vous évaluez chaque jour.`,
          neg: `Générosité et rigueur sont les deux piliers du Riad moderne.`
        },
        {
          type: 'Contre-la-montre',
          q: `Audit flash de la cuisine : 5 mouches, sol propre, chef sans toque. Verdict ?`,
          options: [
            { id: 'A', label_fr: `Critique mais acceptable` },
            { id: 'B', label_fr: `Inacceptable (Hygiène compromise)` },
            { id: 'C', label_fr: `Passable` }
          ],
          correct: 'B',
          pos: `L'hygiène ne se négocie pas. Évaluation sans concession.`,
          neg: `Les mouches et l'absence de toque sont des motifs de fermeture immédiate.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gérer une équipe multiculturelle sous pression.`,
          options: {
            steps: [
              {
                question: `Le chef français et le serveur marocain se disputent sur le rythme. Action ?`,
                responses: [
                  { id: 'A', text: `Soutenir le chef` },
                  { id: 'B', text: `Évaluer les perceptions de chacun sur le temps (monochronique vs polychronique)` }
                ],
                correct: 'B'
              },
              {
                question: `Ils réalisent que leur stress vient d'une définition différente de "l'urgence". Solution ?`,
                responses: [
                  { id: 'A', text: `Imposer une seule règle` },
                  { id: 'B', text: `Créer un lexique commun des urgences pour l'équipe` }
                ],
                correct: 'B'
              },
              {
                question: `Le service redevient fluide. Comment valider ce succès ?`,
                responses: [
                  { id: 'A', text: `Par le sourire des clients` },
                  { id: 'B', text: `Par un débriefing d'évaluation avec l'équipe` }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Intelligence culturelle ! Vous évaluez les schémas mentaux, pas juste les actes.`,
          neg: `Prendre parti aggrave le conflit. Cherchez la cause culturelle.`
        },
        {
          type: 'Énigme',
          q: `« Je suis le détail qui ne se voit pas mais qui se ressent. Je suis le luxe qui ne brille pas mais qui rassure. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `L'or` },
            { id: 'B', label_fr: `L'anticipation` },
            { id: 'C', label_fr: `Le silence` }
          ],
          correct: 'B',
          pos: `Anticiper, c'est évaluer les besoins du client avant qu'il ne les exprime.`,
          neg: `Le vrai luxe est dans l'anticipation constante.`
        }
      ]
    },
    {
      id: MISSION_IDS.M3,
      title_fr: `Mission M3 : Souk Semmarine - L'Évaluation Éthique`,
      description_fr: `Mentor: Omar (Négociant). Soft Skill: Prise de décision (ÉVALUATION). Évaluez la valeur réelle des choses et l'éthique des échanges.`,
      questions: [
        {
          type: 'QCM',
          q: `On vous propose un tapis "antique" à un prix dérisoire. Quelle est votre évaluation immédiate ?`,
          options: [
            { id: 'A', label_fr: `C'est l'affaire du siècle !` },
            { id: 'B', label_fr: `Trop beau pour être vrai : risque de contrefaçon ou vol.` },
            { id: 'C', label_fr: `Acheter sans discuter` }
          ],
          correct: 'B',
          pos: `Esprit critique ! Un prix trop bas est un signal d'alerte dans l'évaluation d'un bien.`,
          neg: `L'avidité aveugle le jugement. Évaluez la cohérence prix/qualité.`
        },
        {
          type: 'Appariement',
          q: `Reliez l'argument du vendeur au biais qu'il tente d'exploiter.`,
          options: [
            { left_fr: `« C'est le dernier en stock ! »`, right_fr: `Biais de rareté` },
            { left_fr: `« Je l'ai vendu à un prince hier »`, right_fr: `Preuve sociale` },
            { left_fr: `« Normalement c'est 2000, pour toi 1000 »`, right_fr: `Biais d'ancrage` },
            { left_fr: `« Tiens, bois ce thé d'abord »`, right_fr: `Réciprocité` }
          ],
          pos: `Vous déjouez les pièges cognitifs du Souk. Impressionnant !`,
          neg: `Révisez les techniques d'influence de Cialdini.`
        },
        {
          type: 'Dialogue de situation',
          q: `Omar vous demande : "Pourquoi ce cuir est-il meilleur que l'autre ?". Comment argumentez-vous ?`,
          options: [
            { id: 'A', label_fr: `« Parce qu'il est plus joli »` },
            { id: 'B', label_fr: `« Souplesse, grain régulier, odeur naturelle et tannage végétal. »` },
            { id: 'C', label_fr: `« Parce qu'il est plus cher »` }
          ],
          correct: 'B',
          pos: `Critères techniques validés. L'évaluation repose sur des preuves tangibles.`,
          neg: `Le prix ou la beauté sont subjectifs. Utilisez des critères techniques.`
        },
        {
          type: 'Classement',
          q: `Classez les étapes d'une négociation éthique.`,
          options: [
            { label_fr: `Vérifier la provenance du produit` },
            { label_fr: `Évaluer la marge juste pour les deux` },
            { label_fr: `Négocier sur les intérêts, pas les prix` },
            { label_fr: `Conclure sur un accord durable` }
          ],
          pos: `La négociation raisonnée (Harvard) appliquée au Souk. Win-win.`,
          neg: `L'éthique commence par la provenance. Ne l'oubliez pas.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Gagner une négociation signifie que l'autre a perdu. »`,
          correct: 'faux',
          pos: `Faux ! Une bonne décision évaluée crée de la valeur pour les deux parties.`,
          neg: `C'est la vision court-termiste. Le long terme exige le win-win.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 3 comportements contraires à l'éthique commerciale.`,
          options: [
            { text_fr: `Cacher un défaut du produit`, is_error: true },
            { text_fr: `Gonfler artificiellement le prix de départ`, is_error: true },
            { text_fr: `Promettre une livraison impossible`, is_error: true },
            { text_fr: `Offrir un échantillon gratuit`, is_error: false }
          ],
          pos: `L'intégrité est le socle d'une réputation durable.`,
          neg: `Le mensonge et la manipulation détruisent la confiance.`
        },
        {
          type: 'Texte à trous',
          q: `La __________ est la valeur subjective que je donne, le __________ est la valeur objective du marché.`,
          options: [
            { text: 'valeur' }, { text: 'prix' }
          ],
          correct: 'valeur, prix',
          pos: `Exact ! Savoir évaluer l'écart entre prix et valeur est la clé du commerce.`,
          neg: `Le prix est ce que vous payez, la valeur est ce que vous recevez.`
        },
        {
          type: 'Contre-la-montre',
          q: `Un client propose un prix insultant pour un travail d'artisan. Votre réaction ?`,
          options: [
            { id: 'A', label_fr: `Le mettre dehors` },
            { id: 'B', label_fr: `Ré-évaluer devant lui le coût matière et temps` },
            { id: 'C', label_fr: `Accepter par peur` }
          ],
          correct: 'B',
          pos: `Pédagogie de la valeur. Vous défendez l'artisan par l'argumentation.`,
          neg: `Éduquez le client sur la valeur réelle au lieu de vous fâcher.`
        },
        {
          type: 'Scénario en cascade',
          q: `Choix d'un fournisseur pour le Riad.`,
          options: {
            steps: [
              {
                question: `Fournisseur A (Moins cher, provenance inconnue) vs B (Plus cher, coopérative locale). Critère ?`,
                responses: [
                  { id: 'A', text: `Le prix d'abord` },
                  { id: 'B', text: `Impact social et durabilité` }
                ],
                correct: 'B'
              },
              {
                question: `Le propriétaire du Riad veut le moins cher. Comment argumenter pour B ?`,
                responses: [
                  { id: 'A', text: `« C'est plus gentil »` },
                  { id: 'B', text: `« Le fournisseur B est un argument marketing puissant pour nos clients VIP. »` }
                ],
                correct: 'B'
              },
              {
                question: `Le client accepte. Quel indicateur suivre ?`,
                responses: [
                  { id: 'A', text: `Le bénéfice immédiat` },
                  { id: 'B', text: `Le taux de recommandation lié à l'éthique du Riad` }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `L'évaluation éthique devient un atout business. Visionnaire !`,
          neg: `Le prix seul est une mauvaise boussole. Évaluez la valeur globale.`
        },
        {
          type: 'Énigme',
          q: `« Je suis le fruit de la parole donnée. Je vaux plus que l'or mais je ne pèse rien. Si on me brise une fois, on ne me répare jamais. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `Le silence` },
            { id: 'B', label_fr: `La confiance` },
            { id: 'C', label_fr: `Le vent` }
          ],
          correct: 'B',
          pos: `Dans le Souk comme en affaires, la confiance est la monnaie suprême.`,
          neg: `La confiance est fragile. Évaluez-la avec soin.`
        }
      ]
    },
    {
      id: MISSION_IDS.M4,
      title_fr: `Mission M4 : Sommet Climat - Évaluation de Crise`,
      description_fr: `Mentor: Dr. Malika (Experte). Soft Skill: Gestion du stress (ÉVALUATION). Évaluez les risques en situation d'urgence climatique et organisationnelle.`,
      questions: [
        {
          type: 'QCM',
          q: `Une inondation menace le site du sommet. Quelle est la première évaluation à faire ?`,
          options: [
            { id: 'A', label_fr: `Le coût du matériel` },
            { id: 'B', label_fr: `La sécurité des personnes (Vies humaines)` },
            { id: 'C', label_fr: `L'image de marque dans les médias` },
            { id: 'D', label_fr: `Le retard du programme` }
          ],
          correct: 'B',
          pos: `Hiérarchie des valeurs respectée. L'humain prime toujours dans l'évaluation de crise.`,
          neg: `Le matériel ou l'image se réparent, pas les vies.`
        },
        {
          type: 'Appariement',
          q: `Reliez le niveau d'alerte à l'action évaluée correspondante.`,
          options: [
            { left_fr: `Alerte Verte`, right_fr: `Vigilance normale` },
            { left_fr: `Alerte Jaune`, right_fr: `Préparation et vérification` },
            { left_fr: `Alerte Orange`, right_fr: `Restriction et pré-évacuation` },
            { left_fr: `Alerte Rouge`, right_fr: `Action immédiate et protection` }
          ],
          pos: `Gestion des seuils d'alerte maîtrisée.`,
          neg: `Ne confondez pas vigilance et action immédiate.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un délégué panique et veut annuler tout le sommet. Comment évaluez-vous sa proposition ?`,
          options: [
            { id: 'A', label_fr: `« Vous avez raison, tout est fini. »` },
            { id: 'B', label_fr: `« Analysons les zones sèches : 80% du site est sûr. Annuler est disproportionné. »` },
            { id: 'C', label_fr: `« Taisez-vous et asseyez-vous. »` }
          ],
          correct: 'B',
          pos: `Garder la tête froide par l'analyse factuelle. C'est la gestion du stress par l'évaluation.`,
          neg: `La panique est contagieuse. Répondez par des chiffres et des zones sûres.`
        },
        {
          type: 'Vrai/Faux',
          q: `« En gestion de crise, l'intuition est plus fiable que les procédures. »`,
          correct: 'faux',
          pos: `Faux ! Les procédures sont des évaluations faites à froid pour sauver des vies à chaud.`,
          neg: `L'intuition est trompeuse sous stress. Fiez-vous aux protocoles évalués.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 3 failles dans ce plan d'évacuation.`,
          options: [
            { text_fr: `Ascenseurs utilisés en priorité`, is_error: true },
            { text_fr: `Point de rassemblement à l'intérieur`, is_error: true },
            { text_fr: `Aucun responsable identifié par zone`, is_error: true },
            { text_fr: `Signalisation lumineuse autonome`, is_error: false }
          ],
          pos: `Audit de sécurité vital. Vous avez l'oeil du préventeur.`,
          neg: `Pas d'ascenseur, rassemblement extérieur, et leaders clairs sont obligatoires.`
        },
        {
          type: 'Classement',
          q: `Ordre de communication en crise.`,
          options: [
            { label_fr: `Vérifier l'information (Évaluer)` },
            { label_fr: `Informer les autorités` },
            { label_fr: `Informer le personnel` },
            { label_fr: `Communiquer au public/médias` }
          ],
          pos: `Maîtrise de la chaîne de l'information. Pas de rumeur.`,
          neg: `Ne parlez jamais aux médias avant d'avoir vérifié l'info et prévenu les autorités.`
        },
        {
          type: 'Texte à trous',
          q: `La __________ d'un risque est sa probabilité multipliée par sa __________.`,
          options: [
            { text: 'criticité' }, { text: 'gravité' }
          ],
          correct: 'criticité, gravité',
          pos: `La formule mathématique du risque. Indispensable pour prioriser.`,
          neg: `Probabilité x Gravité = Criticité. Retenez ce calcul.`
        },
        {
          type: 'Contre-la-montre',
          q: `Fuite de gaz détectée. Action flash ?`,
          options: [
            { id: 'A', label_fr: `Appeler le Wali` },
            { id: 'B', label_fr: `Évacuer, ventiler, couper l'arrivée` },
            { id: 'C', label_fr: `Chercher l'origine avec un briquet` }
          ],
          correct: 'B',
          pos: `Réflexe de survie parfait. L'évaluation mène à l'action immédiate.`,
          neg: `Le briquet est suicidaire ! L'évacuation est la priorité absolue.`
        },
        {
          type: 'Scénario en cascade',
          q: `Dilemme de continuation du sommet.`,
          options: {
            steps: [
              {
                question: `Une tempête arrive dans 4h. Le discours de clôture dure 2h. Risque ?`,
                responses: [
                  { id: 'A', text: 'Faible' },
                  { id: 'B', text: `Élevé (embouteillages et évacuation sous la pluie)` }
                ],
                correct: 'B'
              },
              {
                question: `Faut-il maintenir, avancer ou annuler le discours ?`,
                responses: [
                  { id: 'A', text: 'Maintenir' },
                  { id: 'B', text: `Avancer le discours maintenant pour libérer tout le monde avant la pluie` }
                ],
                correct: 'B'
              },
              {
                question: `Les VIP protestent. Argument d'évaluation ?`,
                responses: [
                  { id: 'A', text: `« C'est comme ça »` },
                  { id: 'B', text: `« La météo prévoit 80km/h de vent. Ma priorité est de garantir votre départ en toute sécurité. »` }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Arbitrage courageux. Vous utilisez l'évaluation pour protéger les autres.`,
          neg: `Le prestige ne vaut pas un accident. Évaluez le risque météo.`
        },
        {
          type: 'Énigme',
          q: `« Je suis l'art de prévoir l'imprévisible. Je suis calme quand tout brûle car j'ai déjà tout imaginé. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `Le pompier` },
            { id: 'B', label_fr: `L'anticipation` },
            { id: 'C', label_fr: `La chance` }
          ],
          correct: 'B',
          pos: `L'anticipation est l'évaluation du futur. Elle réduit le stress de 80%.`,
          neg: `Ce n'est pas de la chance, c'est de la préparation.`
        }
      ]
    },
    {
      id: MISSION_IDS.M5,
      title_fr: `Mission M5 : Sommet International des Leaders - Le Défi Final`,
      description_fr: `Mentor: Le Wali. Soft Skill: Synthèse & Jugement (ÉVALUATION). L'épreuve ultime pour valider votre capacité à évaluer des systèmes complexes.`,
      questions: [
        {
          type: 'QCM',
          q: `Après 4 villes, quelle est selon vous la qualité première d'un leader pour évaluer une situation ?`,
          options: [
            { id: 'A', label_fr: `L'autorité` },
            { id: 'B', label_fr: `L'humilité intellectuelle (reconnaître ses biais)` },
            { id: 'C', label_fr: `La force physique` },
            { id: 'D', label_fr: `La richesse` }
          ],
          correct: 'B',
          pos: `Exact ! Un bon juge sait qu'il peut se tromper. C'est le début de la sagesse.`,
          neg: `L'autorité sans humilité mène à l'erreur de jugement.`
        },
        {
          type: 'Classement',
          q: `Classez les 4 soft skills par ordre de complexité (selon Bloom).`,
          options: [
            { label_fr: `Gestion du stress (Découverte)` },
            { label_fr: `Travail en équipe (Application)` },
            { label_fr: `Analyse de situation (Analyse)` },
            { label_fr: `Jugement argumenté (Évaluation)` }
          ],
          pos: `Vous avez gravi la pyramide de Bloom. Félicitations !`,
          neg: `Révisez la progression pédagogique du voyage.`
        },
        {
          type: 'Dialogue de situation',
          q: `Le Wali vous demande : "Quel est le plus grand risque pour le développement du Maroc ?". Évaluez.`,
          options: [
            { id: 'A', label_fr: `« Je ne sais pas »` },
            { id: 'B', label_fr: `« Le risque majeur est le manque de capital humain. Investir dans les soft skills est la clé. »` },
            { id: 'C', label_fr: `« Le manque de pétrole »` }
          ],
          correct: 'B',
          pos: `Réponse de haut niveau. Vous évaluez les causes structurelles, pas juste les symptômes.`,
          neg: `Pensez au-delà des ressources matérielles. Le capital humain est la vraie richesse.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque ville à sa leçon d'évaluation principale.`,
          options: [
            { left_fr: 'Rabat', right_fr: `Évaluer ses propres limites (Stress)` },
            { left_fr: 'Chefchaouen', right_fr: `Évaluer la force du groupe (Équipe)` },
            { left_fr: 'Fès', right_fr: `Évaluer la cohérence des systèmes (Analyse)` },
            { left_fr: 'Marrakech', right_fr: `Évaluer la valeur et l'éthique (Jugement)` }
          ],
          pos: `Synthèse parfaite de votre parcours.`,
          neg: `Chaque ville a une fonction précise dans votre progression.`
        },
        {
          type: 'Scénario en cascade',
          q: `L'épreuve du Grand Jury.`,
          options: {
            steps: [
              {
                question: `On vous présente 3 projets pour la ville. Lequel choisir ?`,
                responses: [
                  { id: 'A', text: 'Le plus rentable' },
                  { id: 'B', text: `Celui qui équilibre économie, social et environnement` }
                ],
                correct: 'B'
              },
              {
                question: `Le jury critique votre choix : "C'est trop lent". Votre défense ?`,
                responses: [
                  { id: 'A', text: `« Vous avez peut-être raison »` },
                  { id: 'B', text: `« La durabilité est un investissement, pas une dépense. Le coût de l'inaction sera plus élevé. »` }
                ],
                correct: 'B'
              },
              {
                question: `Verdict final : Vous êtes nommé Ambassadeur des Compétences. Votre réaction ?`,
                responses: [
                  { id: 'A', text: 'Être fier et s\'arrêter là' },
                  { id: 'B', text: `Accepter avec la responsabilité de transmettre et de continuer à apprendre` }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Leadership accompli. Vous évaluez avec sagesse et responsabilité.`,
          neg: `Le profit seul est une vision pauvre. L'ambition sans transmission est vaine.`
        },
        {
          type: 'Vrai/Faux',
          q: `« On peut tout évaluer avec des chiffres. »`,
          correct: 'faux',
          pos: `Faux. La dignité, la culture et l'émotion ne se chiffrent pas, mais s'évaluent par le coeur et l'esprit.`,
          neg: `Le piège du "tout-quantitatif" est une erreur de jugement classique.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 3 biais qui menacent ce sommet final.`,
          options: [
            { text_fr: `Biais de groupe (tout le monde est d'accord)`, is_error: true },
            { text_fr: `Biais de statu quo (peur du changement)`, is_error: true },
            { text_fr: `Biais d'autorité (écouter le plus gradé sans réfléchir)`, is_error: true },
            { text_fr: `Pensée critique et divergente`, is_error: false }
          ],
          pos: `Vigilance épistémologique ! Vous protégez la qualité du débat.`,
          neg: `Le consensus forcé et l'obéissance aveugle sont les ennemis du jugement.`
        },
        {
          type: 'Texte à trous',
          q: `Évaluer, c'est transformer des __________ en __________ pour prendre une __________.`,
          options: [
            { text: 'données' }, { text: 'connaissances' }, { text: 'décision' }
          ],
          correct: 'données, connaissances, décision',
          pos: `La pyramide DIKW (Data-Info-Knowledge-Wisdom) maîtrisée.`,
          neg: `Retenez ce cycle : Données -> Connaissances -> Décision.`
        },
        {
          type: 'Contre-la-montre',
          q: `Un imprévu diplomatique : deux leaders refusent de s'asseoir ensemble. Action ?`,
          options: [
            { id: 'A', label_fr: `Annuler le dîner` },
            { id: 'B', label_fr: `Médiation flash : trouver un terrain d'entente neutre` },
            { id: 'C', label_fr: `Les forcer` }
          ],
          correct: 'B',
          pos: `Intelligence diplomatique. Vous évaluez les egos pour sauver la mission.`,
          neg: `La force ou l'annulation sont des aveux d'échec.`
        },
        {
          type: 'Énigme',
          q: `« J'ai été ton ombre à Rabat, ton outil à Chefchaouen, ton compas à Fès et ton trône à Marrakech. Sans moi, tu n'es qu'un voyageur. Avec moi, tu es un guide. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: `Le passeport` },
            { id: 'B', label_fr: `La compétence` },
            { id: 'C', label_fr: `Le souvenir` }
          ],
          correct: 'B',
          pos: `Félicitations ! Vous avez maîtrisé l'art de l'évaluation. Prochaine étape : Laâyoune et la Création !`,
          neg: `C'est la compétence qui donne un sens à votre voyage.`
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      challenge_id: MARRAKECH_CHALLENGE_PK,
      title_fr,
      description_fr,
      xp_reward: 1000,
      sort_order: parseInt(id.slice(-1))
    });

    if (mErr) { console.error(`Error upserting mission ${title_fr}:`, mErr); continue; }
    console.log(`✅ Mission ${title_fr} upserted`);

    // B. Delete existing questions for this mission
    await supabase.from('questions').delete().eq('mission_id', id);

    // C. Insert new questions
    const questionsToInsert = questions.map((q, idx) => {
      const type = TYPE_MAPPING[q.type] || 'qcm';
      const questionData = {
        mission_id: id,
        type,
        question_text_fr: q.q,
        correct_answer: q.correct || null,
        options: q.options || null,
        xp_reward: 100,
        sort_order: idx + 1,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg
      };

      if (type === 'vrai_faux' && !q.options) {
        questionData.options = [
          { id: 'vrai', label_fr: 'VRAI' },
          { id: 'faux', label_fr: 'FAUX' }
        ];
      }

      if (type === 'scenario_cascade') {
        questionData.options = q.options;
      }

      return questionData;
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Error inserting questions for ${title_fr}:`, qErr);
    } else {
      console.log(`✅ 10 questions for ${id}`);
    }
  }

  console.log('🏁 Marrakech HIGH-FIDELITY import FINISHED!');
}

importMarrakech();
