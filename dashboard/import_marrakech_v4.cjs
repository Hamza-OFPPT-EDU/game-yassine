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

async function importMarrakech() {
  console.log('🚀 Starting Marrakech (Acte IV) import v4...');

  // 1. Upsert City (Challenge)
  const cityDescription = `# 🏜️ ACTE IV - MARRAKECH : LA PERLE DU SUD

## 📖 Brief narratif
Ishaq évalue startups, riads, souk, événements et sommet international pour maîtriser le jugement argumenté.

---

## 🏙️ Page de présentation de Marrakech

### 🎯 Ce que vous allez apprendre dans cette ville
Marrakech, ville du business et du tourisme, vous invite à **évaluer** : juger la qualité des décisions, critiquer avec des arguments solides, choisir entre des options toutes valables, et justifier vos choix avec des critères explicites.

### 📋 Les 5 missions

| Mission | Lieu | Soft skill dominant |
|---------|------|---------------------|
| M1 | Startup tech | Prise de décision (évaluation) |
| M2 | Riad de luxe | Travail en équipe (évaluation interculturelle) |
| M3 | Souk Semmarine | Prise de décision (évaluation commerciale) |
| M4 | Palais Selman (événementiel) | Gestion du stress (évaluation sous pression) |
| M5 | Palais des Congrès | Synthèse évaluative |

### 🧠 Compétences clés de cette ville
- Évaluer des méthodes de décision (Lean Startup)
- Juger des arguments avec des pourcentages de validité
- Réaliser une due diligence d’investissement
- Adapter son leadership selon la situation (Hersey & Blanchard)
- Évaluer des performances humaines avec critères multiples
- Maîtriser l’intelligence interculturelle (Hofstede)
- Négocier avec la méthode BATNA
- Évaluer des risques avec matrice Impact × Contrôlabilité
- Utiliser une matrice de décision pondérée
- Défendre une vision stratégique face à l’opposition`;

  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: MARRAKECH_CHALLENGE_PK,
    city_id: 'marrakech',
    city_name_fr: 'Marrakech',
    city_name_ar: 'مراكش',
    headline_fr: `🏜️ ACTE IV - MARRAKECH : LA PERLE DU SUD`,
    description_fr: cityDescription,
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
      title_fr: 'Mission M1 : La Startup Tech',
      description_fr: `Lieu: Startup tech. Soft skill: Prise de décision (évaluation). Évaluer des méthodes de décision (Lean Startup).`,
      questions: [
        {
          type: 'QCM',
          q: `MarocDigital doit décider : investir 500K DH dans une nouvelle fonctionnalité OU améliorer le marketing. Quelle méthode est la plus appropriée ?`,
          options: [
            { id: 'A', label_fr: 'Vote à main levée' },
            { id: 'B', label_fr: 'Intuition du fondateur' },
            { id: 'C', label_fr: 'Analyse coûts-bénéfices + test A/B de 2 semaines + décision du comité stratégique.' },
            { id: 'D', label_fr: 'Copier le concurrent' }
          ],
          correct: 'C',
          pos: `Évaluation méthodologique parfaite ! Données + test + comité = objectivité.`,
          neg: `Vote = Groupthink, intuition = biais, copier = imitation. Optez pour des preuves.`
        },
        {
          type: 'Scénario en cascade',
          q: `Évaluation des arguments de l'équipe.`,
          options: {
            steps: [
              {
                question: `CTO dit « Le pivot va tout casser ». Évaluez son argument.`,
                responses: [
                  { id: 'A', text: 'Totalement vrai' },
                  { id: 'B', text: 'Totalement faux' },
                  { id: 'C', text: 'Crainte légitime (risque technique) mais raisonnement incomplet : il ignore le coût de ne pas changer. Valide à 60%.' }
                ],
                correct: 'C',
                pos: `Évaluation nuancée ! Force + limite. Pas de jugement binaire.`,
                neg: `Ne dites ni « totalement raison » ni « totalement tort ». Nuancez.`
              },
              {
                question: `CMO dit « Le tourisme c’est l’avenir ». Évaluez.`,
                responses: [
                  { id: 'A', text: 'Argument visionnaire' },
                  { id: 'B', text: 'Argument optimiste mais vague. Sans données précises : valide à 40%.' }
                ],
                correct: 'B',
                pos: `« L’avenir » n’est pas une stratégie. Demandez des chiffres.`,
                neg: `Une opinion sans données ne vaut pas une stratégie.`
              },
              {
                question: `CFO dit « Les chiffres disent : restez ». Évaluez.`,
                responses: [
                  { id: 'A', text: 'Argument le plus solide (75%) mais insuffisant seul : les chiffres décrivent le passé, pas l’avenir.' },
                  { id: 'B', text: 'Argument infaillible' }
                ],
                correct: 'A',
                pos: `Les données sont essentielles, mais pas suffisantes. Projection nécessaire.`,
                neg: `Les chiffres ne prédisent pas tout. Ajoutez une analyse prospective.`
              }
            ]
          }
        },
        {
          type: 'Détection d’erreurs',
          q: `Évaluez la proposition d’investissement de Sahara Capital. Trouvez les 7 erreurs.`,
          options: [
            { text_fr: '51% = perte de contrôle', is_error: true },
            { text_fr: 'Non-concurrence 10 ans (excessif)', is_error: true },
            { text_fr: '3 directeurs imposés', is_error: true },
            { text_fr: 'Rendement 500% en 3 ans (irréaliste)', is_error: true },
            { text_fr: 'Liquidation préférentielle totale', is_error: true },
            { text_fr: '« Signez avant vendredi » (pression)', is_error: true },
            { text_fr: 'Pas de droit de veto', is_error: true },
            { text_fr: 'Droit de regard financier', is_error: false }
          ],
          pos: `Due diligence parfaite ! Chaque clause évaluée par rapport aux standards.`,
          neg: `Relisez : contrôle, durée, gouvernance, rendement, liquidation, pression, veto.`
        },
        {
          type: 'Vrai/Faux',
          q: `Évaluez ces affirmations sur l'entrepreneuriat.`,
          options: [
            { text: `« Un bon entrepreneur doit écouter tous les conseils de ses investisseurs. »`, correct: 'faux', pos: `Écouter ≠ obéir. Évaluez chaque conseil selon expertise, alignement et données.`, neg: `Suivre aveuglément est dangereux. Gardez votre capacité de jugement.` },
            { text: `« L’échec est toujours une bonne chose car on apprend. »`, correct: 'faux', pos: `L’échec est utile seulement si on l’analyse et qu’on change de comportement.`, neg: `Échouer sans réflexion ne mène qu’à répéter les mêmes erreurs.` },
            { text: `« La meilleure décision est celle qui plaît à tout le monde. »`, correct: 'faux', pos: `Une décision qui plaît à tous est souvent médiocre. L’engagement n’est pas le consensus.`, neg: `Les grandes décisions déplaisent parfois. L’important est d’être juste, pas populaire.` }
          ]
        },
        {
          type: 'Appariement',
          q: `Reliez chaque situation au style de leadership (Hersey & Blanchard).`,
          options: [
            { left_fr: 'Junior développeur (incompétent + motivé)', right_fr: 'Directif' },
            { left_fr: 'Senior marketing (expert + démotivé)', right_fr: 'Participatif' },
            { left_fr: 'Stagiaire design (semi-compétent + motivé)', right_fr: 'Persuasif' },
            { left_fr: 'CTO cofondateur (expert + motivé)', right_fr: 'Délégatif' }
          ],
          pos: `Évaluation situationnelle parfaite ! Adapter le style au niveau de compétence et motivation.`,
          neg: `Vérifiez : directif pour novice, persuasif pour débutant motivé, participatif pour expert démotivé, délégatif pour expert motivé.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez le cycle du Lean Startup.`,
          options: [
            { text: 'hypothèse' }, { text: 'tester' }, { text: 'mesurer' }, { text: 'pivoter' }, { text: 'persévérer' }, { text: 'minimum' }, { text: 'données' }, { text: 'échec' }
          ],
          correct: 'hypothèse, minimum, tester, Mesurer, données, persévérer, pivoter, échec',
          pos: `Cycle Lean Startup maîtrisé ! Hypothèse → MVP → Mesurer → Pivoter ou persévérer.`,
          neg: `Retenez : hypothèse, produit minimum viable, tester, mesurer, données, pivoter ou persévérer.`
        },
        {
          type: 'Contre-la-montre',
          q: `Évaluations flash en startup.`,
          options: {
            steps: [
              {
                question: `3 clients demandent une fonctionnalité à 100K DH. La développer ?`,
                responses: [{id:'A',text:'Oui'},{id:'B',text:'Non, sauf si ≥500 utilisateurs la veulent. 3 ≠ marché.'}],
                correct: 'B',
                pos: `Évaluer sur données, pas sur émotion. 3 clients ne justifient pas 100K.`,
                neg: `« Le client a toujours raison » est dangereux. Vérifiez la demande réelle.`
              },
              {
                question: `Un concurrent copie votre fonctionnalité principale. Gravité ?`,
                responses: [{id:'A',text:'Moyenne. L’expérience utilisateur est impossible à copier. Investissez dans le service.'},{id:'B',text:'Critique'}],
                correct: 'A',
                pos: `Copier est facile, l’expérience unique ne l’est pas. Restez serein.`,
                neg: `Paniquer ou copier en retour est une erreur. Différenciez-vous par le service.`
              },
              {
                question: `Votre meilleur développeur demande 50% d’augmentation. Décision ?`,
                responses: [{id:'A',text:'Accepter'},{id:'B',text:'Évaluez : salaire vs marché, contribution réelle, alternatives. Négociez objectivement.'}],
                correct: 'B',
                pos: `Décision objective. Comparez les données, ne réagissez pas à chaud.`,
                neg: `Accepter ou refuser sous émotion est risqué. Analysez froidement.`
              },
              {
                question: `Un article dit « Les startups de livraison sont mortes ». Impact ?`,
                responses: [{id:'A',text:'Cherchez les données derrière l’article. Un article ≠ réalité.'},{id:'B',text:'Pivoter immédiatement'}],
                correct: 'A',
                pos: `Biais de disponibilité. Un article n’est pas une preuve. Vérifiez les sources.`,
                neg: `Paniquer sur un seul article est irrationnel. Cherchez des données contradictoires.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Évaluez MarocDigital (120-150 mots) : 3 forces, 3 faiblesses, 1 recommandation argumentée.`,
          pos: `Évaluation SWOT argumentée ! Jugement, critères explicites, recommandation justifiée.`,
          neg: `Il manque un élément : forces, faiblesses ou recommandation.`
        },
        {
          type: 'Prise de décision',
          q: `Trois propositions de financement : A) Business Angel (500K/15%), B) Fonds éthique (1.5M/30% + réseau), C) Autofinancement. Laquelle choisir ?`,
          options: [
            { id: 'A', label_fr: 'Business Angel (réseau limité)' },
            { id: 'B', label_fr: 'Fonds éthique. Ratio acceptable, gouvernance saine, valeur ajoutée réseau, alignement des valeurs.' },
            { id: 'C', label_fr: 'Autofinancement (croissance trop lente)' }
          ],
          correct: 'B',
          pos: `Évaluation comparative juste. La meilleure option n’est pas la plus riche mais la plus adaptée.`,
          neg: `Ne choisissez pas sur un seul critère. Comparez contrôle, valeur ajoutée, alignement.`
        },
        {
          type: 'Énigme',
          q: `« Je ne suis ni OUI ni NON. Je suis le POURQUOI après chacun. L’amateur dit J’AIME, le maître dit VOICI POURQUOI… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’opinion' },
            { id: 'B', label_fr: 'Le jugement évaluatif' },
            { id: 'C', label_fr: 'L’intuition' },
            { id: 'D', label_fr: 'La certitude' }
          ],
          correct: 'B',
          pos: `L’évaluation critique sépare l’amateur du maître. Opinion ≠ jugement argumenté.`,
          neg: `Relisez : « Sans moi les décisions sont des paris, avec moi des stratégies. » = jugement évaluatif.`
        }
      ]
    },
    {
      id: MISSION_IDS.M2,
      title_fr: 'Mission M2 : Riad de Luxe',
      description_fr: `Lieu: Riad de luxe. Soft skill: Travail en équipe (évaluation interculturelle). Maîtriser l’intelligence interculturelle (Hofstede).`,
      questions: [
        {
          type: 'QCM',
          q: `Kenji (chef japonais) ne dit jamais « non », dit « oui » puis fait à sa façon. Problème de compétence ou de culture ?`,
          options: [
            { id: 'A', label_fr: 'Incompétence' },
            { id: 'B', label_fr: 'Insubordination' },
            { id: 'C', label_fr: 'Culturel. Au Japon, dire « non » à un supérieur est irrespectueux. Adaptez la communication.' },
            { id: 'D', label_fr: 'Stéréotype' }
          ],
          correct: 'C',
          pos: `Évaluation interculturelle juste. Hofstede : forte distance hiérarchique.`,
          neg: `Ce n’est ni incompétence ni insubordination. C’est une différence culturelle à respecter.`
        },
        {
          type: 'Scénario en cascade',
          q: `Analyse des tensions interculturelles.`,
          options: {
            steps: [
              {
                question: `Fatima (marocaine) dit « Les Français sont arrogants ». Évaluez sa plainte.`,
                responses: [
                  { id: 'A', text: 'Elle a raison' },
                  { id: 'B', text: 'Elle a tort' },
                  { id: 'C', text: 'Ressenti légitime mais généralisation abusive. 50% valide + 50% biais.' }
                ],
                correct: 'C',
                pos: `Évaluation nuancée. Validez le ressenti, corrigez la généralisation.`,
                neg: `Ne dites ni « elle a raison » ni « elle a tort ». Montrez les nuances.`
              },
              {
                question: `Pierre (français) dit « Les Marocains sont inefficaces ». Évaluez.`,
                responses: [
                  { id: 'A', text: 'Vrai' },
                  { id: 'B', text: 'Faux' },
                  { id: 'C', text: 'Observation partiellement vraie (relationnel avant transactionnel) mais interprétation fausse. 30% valide + 70% biais culturel.' }
                ],
                correct: 'C',
                pos: `L’efficacité n’est pas universelle. Le relationnel marocain a sa propre logique.`,
                neg: `Ce n’est ni totalement vrai ni totalement faux. Comprenez le contexte culturel.`
              },
              {
                question: `Recommandation pour résoudre le conflit ?`,
                responses: [
                  { id: 'A', text: 'Les séparer' },
                  { id: 'B', text: 'Formation' },
                  { id: 'C', text: 'Médiation où chacun évalue ses biais + co-création de règles + feedback mensuel.' }
                ],
                correct: 'C',
                pos: `Solution systémique. Chacun reconnaît ses biais, l’équipe crée ses règles.`,
                neg: `Les séparer ou les former sans médiation ne suffit pas. Impliquez-les dans la solution.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Évaluez les 5 managers (note /10) et classez-les du meilleur au moins bon.`,
          options: [
            { left_fr: 'Karim (chef toxique)', right_fr: '5/10' },
            { left_fr: 'Sarah (bienveillante sans exigence)', right_fr: '6/10' },
            { left_fr: 'Omar (rigide)', right_fr: '7/10' },
            { left_fr: 'Nadia (souriante mais désorganisée)', right_fr: '6/10' },
            { left_fr: 'Youssef (équilibré)', right_fr: '8/10' }
          ],
          pos: `Évaluation multi-critères ! Technique + management. Karim excellent technicien mais manager toxique.`,
          neg: `Ne notez pas sur la seule compétence technique. Le management humain compte tout autant.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 7 erreurs dans la stratégie RH du consultant.`,
          options: [
            { text_fr: '10h/jour (productivité marginale décroissante)', is_error: true },
            { text_fr: 'Pause 30 min (burnout)', is_error: true },
            { text_fr: 'Caméras partout (détruit la confiance)', is_error: true },
            { text_fr: 'Bonus « meilleur employé » (compétition toxique)', is_error: true },
            { text_fr: '50 DH/min retard (disproportionné)', is_error: true },
            { text_fr: 'Formation en français seulement (exclut non-francophones)', is_error: true },
            { text_fr: 'Réunion 3h/mois (trop longue et trop rare)', is_error: true },
            { text_fr: 'Feedback hebdomadaire', is_error: false }
          ],
          pos: `Audit RH évaluatif complet. Chaque mesure a un impact réel négatif.`,
          neg: `Relisez : horaires, pauses, confidentialité, reconnaissance, sanctions, langue, fréquence réunions.`
        },
        {
          type: 'Dialogue de situation',
          q: `Client VIP furieux : « Cette suite est indigne d’un 5 étoiles ! » Évaluez sa plainte et répondez.`,
          options: [
            { id: 'A', label_fr: '« Je suis désolé, voici 20% » (capitulation)' },
            { id: 'B', label_fr: '« Vous exagérez » (défensive)' },
            { id: 'C', label_fr: 'Identifier ce qui est vrai (poussière, spa bondé), nuancer l’interprétation (lenteur = style marocain), proposer compensation proportionnelle.' }
          ],
          correct: 'C',
          pos: `Évaluation ciblée. Compenser uniquement ce qui est justifié, pas tout.`,
          neg: `Capituler ou se défendre est inefficace. Distinguez le vrai du faux.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 6 dimensions culturelles de Hofstede.`,
          options: [
            { text: 'distance' }, { text: 'individualisme' }, { text: 'masculinité' }, { text: 'évitement' }, { text: 'long terme' }, { text: 'indulgence' }
          ],
          correct: 'distance, individualisme, masculinité, évitement, long terme, indulgence',
          pos: `6 dimensions maîtrisées. Utiles pour analyser les conflits interculturels.`,
          neg: `Retenez : distance hiérarchique, individualisme, masculinité, évitement incertitude, orientation long terme, indulgence.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion d'un licenciement délicat.`,
          options: {
            steps: [
              {
                question: `Karim a humilié un apprenti, 3 démissions en 6 mois. Évaluez la gravité.`,
                responses: [
                  { id: 'A', text: 'Conflit normal' },
                  { id: 'B', text: 'Gravité 8/10 : pattern de toxicité. Risque culturel et financier (turnover coûteux).' }
                ],
                correct: 'B',
                pos: `Évaluation juste. Le turnover coûte 3 mois de salaire par départ.`,
                neg: `Ce n’est pas un conflit normal. 3 démissions = pattern systémique.`
              },
              {
                question: `Alternatives : licenciement, coaching, autre ?`,
                responses: [
                  { id: 'A', text: '4ème chance' },
                  { id: 'B', text: 'Coaching' },
                  { id: 'C', text: 'Solution hybride : licenciement pour faute mais avec indemnité transactionnelle (humain).' }
                ],
                correct: 'C',
                pos: `Décision éthique. Licencier sans humanité détruit la confiance collective.`,
                neg: `Une 4ème chance serait injuste pour les démissionnaires. Licenciez mais avec respect.`
              },
              {
                question: `Comment annoncer la décision à Karim ?`,
                responses: [
                  { id: 'A', text: 'L\'humilier' },
                  { id: 'B', text: 'SMS' },
                  { id: 'C', text: 'En privé, avec respect : reconnaître ses qualités culinaires, expliquer l’incompatibilité managériale.' }
                ],
                correct: 'C',
                pos: `L’exécution compte autant que la décision. La dignité préservée.`,
                neg: `L’humilier en retour serait une faute. Un licenciement se fait avec respect.`
              }
            ]
          }
        },
        {
          type: 'Contre-la-montre',
          q: `Évaluations managériales flash.`,
          options: {
            steps: [
              {
                question: `CV : 10 ans, 6 entreprises (2 ans max chacune). Évaluation ?`,
                responses: [{id:'A',text:'Instabilité possible mais peut être expert en missions. Demandez pourquoi chaque départ.'},{id:'B',text:'Excellent'}],
                correct: 'A',
                pos: `Ne jugez pas un CV à la surface. Creusez les raisons.`,
                neg: `Évitez « excellent » ou « mauvais » sans investigation.`
              },
              {
                question: `Plainte : « Ma collègue arrive en retard chaque jour. » Action ?`,
                responses: [{id:'A',text:'Sanction'},{id:'B',text:'Vérifiez les raisons (enfants, transports). Ne sanctionnez pas sans INFO.'}],
                correct: 'B',
                pos: `Évaluation juste. Une sanction sans enquête est une erreur.`,
                neg: `Ne sanctionnez jamais sur une seule plainte. Écoutez les deux parties.`
              },
              {
                question: `Demande de congé 1 mois avant haute saison. Décision ?`,
                responses: [{id:'A',text:'Refus brut'},{id:'B',text:'Évaluez : validité, remplacement possible, accord équipe. Solution : congé partiel 2 semaines.'}],
                correct: 'B',
                pos: `Décision équilibrée. Ni acceptation aveugle, ni refus brutal.`,
                neg: `Refuser sans analyse démotive. Accepter sans condition désorganise.`
              },
              {
                question: `Conflit : « Pierre ne fait jamais sa part. » Action ?`,
                responses: [{id:'A',text:'Prendre parti'},{id:'B',text:'Écoutez les deux parties + regardez les données objectives.'}],
                correct: 'B',
                pos: `Ne croyez jamais une seule version. Les faits sont plus fiables que les récits.`,
                neg: `Prendre parti sans enquête est dangereux. Demandez des preuves.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un plan d’amélioration pour le Riad (120-150 mots) : 3 points à améliorer, 3 actions, 1 indicateur de succès.`,
          pos: `Plan opérationnel, ciblé, mesurable. Bonne évaluation des priorités.`,
          neg: `Il manque un des trois éléments ou l’indicateur n’est pas mesurable.`
        },
        {
          type: 'Énigme',
          q: `« Je vois 8 couleurs là où d’autres n’en voient qu’une. Je ne juge pas les personnes, je juge les comportements… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’empathie' },
            { id: 'B', label_fr: 'L’intelligence interculturelle' },
            { id: 'C', label_fr: 'La tolérance' },
            { id: 'D', label_fr: 'La diplomatie' }
          ],
          correct: 'B',
          pos: `L’intelligence interculturelle voit les différences sans jugement. Clé du management diversifié.`,
          neg: `Relisez : « Rachida la pratique chaque jour avec 40 âmes de 8 pays. » = intelligence interculturelle.`
        }
      ]
    },
    {
      id: MISSION_IDS.M3,
      title_fr: 'Mission M3 : Souk Semmarine',
      description_fr: `Lieu: Souk Semmarine. Soft skill: Prise de décision (évaluation commerciale). Négocier avec la méthode BATNA.`,
      questions: [
        {
          type: 'QCM',
          q: `Touriste offre 1 000 DH pour un tapis affiché 5 000 DH (20%). Évaluez sa stratégie.`,
          options: [
            { id: 'A', label_fr: 'Bonne stratégie' },
            { id: 'B', label_fr: 'Insulte' },
            { id: 'C', label_fr: 'Économiquement rationnel (ancrage bas) mais culturellement inadéquat (offense au souk marocain).' },
            { id: 'D', label_fr: 'Prix fixe' }
          ],
          correct: 'C',
          pos: `Évaluation contextuelle. Une stratégie peut être bonne sur un critère, mauvaise sur un autre.`,
          neg: `Au souk, offrir <40% est une offense. La culture prime sur la théorie.`
        },
        {
          type: 'Scénario en cascade',
          q: `Analyse de 3 négociations.`,
          options: {
            steps: [
              {
                question: `Touriste américain : offre 800 → Hassan cède à 900. Évaluez.`,
                responses: [
                  { id: 'A', text: 'Excellente' },
                  { id: 'B', text: 'Mauvaise. Hassan a paniqué et cédé 55%. Pas de BATNA, concession trop rapide.' }
                ],
                correct: 'B',
                pos: `Évaluation juste. La technique du « walk away » a marché sur Hassan.`,
                neg: `Une bonne négociation ne se conclut pas en panique. Préparez votre BATNA.`
              },
              {
                question: `Couple français : obtient -17% + emballage + thé. Évaluez.`,
                responses: [
                  { id: 'A', text: 'Moyenne' },
                  { id: 'B', text: 'Bonne. Win-win réel. Le thé (coût 5 DH) crée une valeur perçue de 500 DH.' }
                ],
                correct: 'B',
                pos: `Win-win parfait. La petite attention rapporte gros.`,
                neg: `Certains diraient « Hassan a trop cédé ». Non, il a gagné un client fidèle.`
              },
              {
                question: `Japonais : silence, Hassan baisse 3 fois seul. Évaluez.`,
                responses: [
                  { id: 'A', text: 'Mauvaise. Le silence était une arme. Hassan a négocié contre lui-même.' },
                  { id: 'B', text: 'Bonne' }
                ],
                correct: 'A',
                pos: `Le silence n’est pas un refus. C’est une technique culturelle.`,
                neg: `Ne jamais interpréter le silence comme un « non ». Attendez, ne baissez pas seul.`
              }
            ]
          }
        },
        {
          type: 'Détection d’erreurs',
          q: `Évaluez les 6 mesures du plan commercial « Vendre plus en 6 mois ».`,
          options: [
            { text_fr: 'Baisser 30% → guerre des prix', is_error: true },
            { text_fr: 'Prix fixes → tue l’identité du souk', is_error: true },
            { text_fr: 'Amazon → commission 30% et perte du tactile', is_error: true },
            { text_fr: 'Machine → perte différenciation', is_error: true },
            { text_fr: 'Uniquement Chinois → mono-risque', is_error: true },
            { text_fr: 'Supprimer le thé → ROI 30 000% perdu', is_error: true },
            { text_fr: 'Qualité artisanale certifiée', is_error: false }
          ],
          pos: `Évaluation commerciale magistrale. Le thé à 5 DH génère 1 500 DH de vente.`,
          neg: `Relisez chaque mesure avec un œil critique. Le détail (thé) a le meilleur ROI.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque stratégie de négociation à son évaluation.`,
          options: [
            { left_fr: 'Prix très élevé', right_fr: 'risquée (client peut partir)' },
            { left_fr: 'Montrer un défaut', right_fr: 'efficace (crée confiance)' },
            { left_fr: 'Concession = demande concession', right_fr: 'efficace (réciprocité)' },
            { left_fr: 'Silence après offre', right_fr: 'efficace (met pression sans parler)' },
            { left_fr: 'Complimenter concurrent', right_fr: 'risquée (client peut y aller)' }
          ],
          pos: `Évaluation tactique. Pas de jugement absolu, seulement adapté ou non au contexte.`,
          neg: `Une stratégie n’est jamais bonne ou mauvaise en soi. Tout dépend du contexte.`
        },
        {
          type: 'Dialogue de situation',
          q: `Client dit « J’ai vu le même tapis à 500 DH chez le concurrent ». C’est impossible (coût matière 1 200 DH). Évaluez et répondez.`,
          options: [
            { id: 'A', label_fr: '« Vous mentez »' },
            { id: 'B', label_fr: '« Allez chez lui »' },
            { id: 'C', label_fr: '« À 500 DH, je vous en achète 100 pièces. Mais vous n’en trouverez pas. Mon prix est 2 800, je peux faire 2 600 livré. »' },
            { id: 'D', label_fr: 'Accepter le bluff' }
          ],
          correct: 'C',
          pos: `Déjouer le bluff sans humilier. Offrez d’acheter au prix qu’il prétend.`,
          neg: `Traiter le client de menteur est la pire erreur. Jouez le jeu intelligemment.`
        },
        {
          type: 'Classement',
          q: `Classez les 7 stratégies par ROI long terme.`,
          options: [
            { label_fr: 'Qualité constante' },
            { label_fr: 'Expérience personnalisée' },
            { label_fr: 'Service 24/7' },
            { label_fr: 'Programme fidélité' },
            { label_fr: 'Réduction surprise' },
            { label_fr: 'Newsletter' },
            { label_fr: 'Prix bas' }
          ],
          pos: `Classification économique pertinente. La qualité coûte peu et rapporte beaucoup.`,
          neg: `Le prix bas est en bas du classement : il détruit les marges et ne fidélise pas.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez la méthode BATNA.`,
          options: [
            { text: 'meilleure' }, { text: 'alternative' }, { text: 'négocié' }, { text: 'alternatives' }, { text: 'BATNA' }, { text: 'seuil' }, { text: 'pouvoir' }
          ],
          correct: 'meilleure, alternative, négocié, alternatives, BATNA, seuil, pouvoir',
          pos: `BATNA maîtrisée. Ne jamais accepter une offre pire que sa meilleure alternative.`,
          neg: `Connaître sa BATNA, c’est avoir le pouvoir de dire non.`
        },
        {
          type: 'Contre-la-montre',
          q: `Évaluations commerciales flash.`,
          options: {
            steps: [
              {
                question: `Client dit « Je reviens dans 10 min » et ne revient pas. Évaluation ?`,
                responses: [{id:'A',text:'Pas intéressé'},{id:'B',text:'Plusieurs causes possibles. Ne concluez pas « pas intéressé ».'}],
                correct: 'B',
                pos: `Ne tirez pas de conclusion hâtive. Relancez une fois.`,
                neg: `« Pas intéressé » est une conclusion trop rapide. Soyez curieux.`
              },
              {
                question: `Touriste prend 20 photos et part. Évaluation ?`,
                responses: [{id:'A',text:'Voleur d\'idées'},{id:'B',text:'Probablement touriste normal. 90% des touristes prennent des photos sans copier.'}],
                correct: 'B',
                pos: `La paranoïa commerciale est inutile. La plupart des gens sont juste des visiteurs.`,
                neg: `Ne présumez pas de mauvaise intention. Relaxez-vous.`
              },
              {
                question: `Client fait 5 allers-retours sans acheter. Évaluation ?`,
                responses: [{id:'A',text:'Pénible'},{id:'B',text:'Client indécis mais intéressé. Haut potentiel. Aidez-le à décider.'}],
                correct: 'B',
                pos: `L’indécision est un signal d’intérêt, pas un rejet.`,
                neg: `Ne dites pas « client pénible ». C’est une opportunité.`
              },
              {
                question: `Concurrent baisse ses prix de 20%. Réaction ?`,
                responses: [{id:'A',text:'Baisser aussi'},{id:'B',text:'Maintenez le prix mais augmentez la valeur (service, qualité, cadeau).'}],
                correct: 'B',
                pos: `La guerre des prix tue tout le monde. Compétence sur la valeur, pas le prix.`,
                neg: `Baisser aussi déclenche une spirale perdant-perdant.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Évaluez ce qui doit changer et être préservé au souk (120-150 mots).`,
          pos: `Évaluation équilibrée. Modernisation sans perdre l’âme du souk.`,
          neg: `Il manque soit les changements soit les éléments à préserver.`
        },
        {
          type: 'Énigme',
          q: `« Je suis l’art de savoir quand dire OUI et NON, quand pousser et reculer. Au souk je suis reine… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le marchandage' },
            { id: 'B', label_fr: 'La négociation évaluée' },
            { id: 'C', label_fr: 'L’intuition' },
            { id: 'D', label_fr: 'La persuasion' }
          ],
          correct: 'B',
          pos: `La négociation n’est ni un art ni une science : c’est une évaluation stratégique.`,
          neg: `Relisez : « Omar m’a pratiquée, Hassan m’a perfectionnée. » = la négociation évaluée.`
        }
      ]
    },
    {
      id: MISSION_IDS.M4,
      title_fr: 'Mission M4 : L’événementiel sous pression',
      description_fr: `Lieu: Palais Selman (événementiel). Soft skill: Gestion du stress (évaluation sous pression). Évaluer des risques avec matrice Impact × Contrôlabilité.`,
      questions: [
        {
          type: 'Prise de décision',
          q: `6h, 5 crises : traiteur (100 portions manquantes), mariée panique, DJ absent, photographe coincé, 50 chaises abîmées. Classez par priorité.`,
          options: [
            { id: 'A', label_fr: 'Sono → Conflit → Ministre' },
            { id: 'B', label_fr: 'mariée → traiteur → DJ → chaises → photographe' },
            { id: 'C', label_fr: 'chaises → photographe → mariée' }
          ],
          correct: 'B',
          pos: `Évaluation multicritère (Impact × Contrôlabilité). Mariée d’abord : sans elle, pas de mariage.`,
          neg: `L’ordre émotionnel passe avant le logistique. La mariée est la priorité absolue.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion de la mariée en panique.`,
          options: {
            steps: [
              {
                question: `Mariée hyperventile. Évaluation et action ?`,
                responses: [
                  { id: 'A', text: 'Urgence médicale' },
                  { id: 'B', text: 'L\'ignorer' },
                  { id: 'C', text: 'Crise d’anxiété, pas urgence médicale. 4-7-8 + présence silencieuse.' }
                ],
                correct: 'C',
                pos: `Diagnostic juste. La rassurer prend 10 min, pas 1h aux urgences.`,
                neg: `« Calme-toi » ne marche pas. Utilisez la respiration et la présence.`
              },
              {
                question: `Mariée dit « Je ne suis pas sûre de l’aimer ». Réaction ?`,
                responses: [
                  { id: 'A', text: '« C’est normal »' },
                  { id: 'B', text: '« Leila, ce doute est courant. Qu’est-ce qui t’a fait dire OUI initialement ? »' }
                ],
                correct: 'B',
                pos: `Vous n’êtes pas psy. Aidez-la à retrouver ses propres raisons.`,
                neg: `Ne dites pas « c’est normal ». Posez une question qui recentre sur le positif.`
              },
              {
                question: `La mère arrive et aggrave. Action ?`,
                responses: [
                  { id: 'A', text: 'La confronter' },
                  { id: 'B', text: '« Madame, Leila va bien. Elle a besoin de calme. Pouvez-vous nous donner 5 minutes ? »' }
                ],
                correct: 'B',
                pos: `Protéger la mariée du stress externe. Intervention respectueuse mais ferme.`,
                neg: `Laisser la mère parler ou la confronter est inefficace. Isolez la mariée calmement.`
              }
            ]
          }
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 8 erreurs dans le planning du mariage.`,
          options: [
            { text_fr: 'Pas de marge', is_error: true },
            { text_fr: 'Orchestre non testé', is_error: true },
            { text_fr: 'Pas de menu végétarien', is_error: true },
            { text_fr: '1 serveur pour 50 invités', is_error: true },
            { text_fr: 'Pas de micro secours', is_error: true },
            { text_fr: 'Gâteau non réfrigéré', is_error: true },
            { text_fr: 'DJ sans playlist', is_error: true },
            { text_fr: 'Zéro Plan B', is_error: true },
            { text_fr: 'Sécurité incendie présente', is_error: false }
          ],
          pos: `Audit événementiel pro. Chaque erreur a un coût de prévention dérisoire.`,
          neg: `Relisez : marges, test, régimes, personnel, secours, chaîne du froid, playlist, plan B.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Attribuez les postes aux 8 membres de l’équipe selon leurs forces.`,
          options: [
            { left_fr: 'Amal', right_fr: 'accueil' },
            { left_fr: 'Karim', right_fr: 'logistique' },
            { left_fr: 'Nadia', right_fr: 'back-office' },
            { left_fr: 'Youssef', right_fr: 'gestion crise' },
            { left_fr: 'Fatima', right_fr: 'budget' },
            { left_fr: 'Hamid', right_fr: 'création' },
            { left_fr: 'Leila', right_fr: 'secrétariat' },
            { left_fr: 'Samir', right_fr: 'assistant' }
          ],
          pos: `Restructuration évaluative. Placez chacun selon ses forces, pas ses faiblesses.`,
          neg: `Une équipe efficace n’a pas que des « bons ». Elle a des gens aux bons postes.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez le protocole de crise de Zineb.`,
          options: [
            { text: 'respirer' }, { text: 'évaluer' }, { text: 'prioriser' }, { text: 'déléguer' }, { text: 'communiquer' }, { text: 'exécuter' }, { text: 'documenter' }, { text: 'anticiper' }
          ],
          correct: 'respirer, évaluer, prioriser, déléguer, communiquer, exécuter, documenter, anticiper',
          pos: `Protocole de crise systématique. Le Wali improvisait, Zineb suit une méthode.`,
          neg: `Retenez : respirer, évaluer, prioriser, déléguer, communiquer, exécuter, documenter, anticiper.`
        },
        {
          type: 'Dialogue de situation',
          q: `Traiteur livre en retard et avec 20 portions manquantes. Excuse « C’est la faute du livreur ». Évaluez et répondez.`,
          options: [
            { id: 'A', label_fr: 'Accepter les excuses' },
            { id: 'B', label_fr: 'Chercher un autre traiteur' },
            { id: 'C', label_fr: '« Je paie 70% (pénalité 30%) et vous livrez les 20 portions en urgence. Sinon, rien. »' }
          ],
          correct: 'C',
          pos: `Négociation de crise évaluative. Paiement partiel + urgence + fin de relation.`,
          neg: `Accepter les excuses ou chercher un autre traiteur à 10h est impossible. Un prestataire qui rejette la faute est à remplacer.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion d'un orage imminent.`,
          options: {
            steps: [
              {
                question: `Orage dans 15 min. 300 invités cocktail extérieur. Gravité ?`,
                responses: [
                  { id: 'A', text: 'Minimale' },
                  { id: 'B', text: 'Élevée (8/10). Sécurité électrique, sols glissants, image du mariage.' }
                ],
                correct: 'B',
                pos: `Évaluation juste. Ne minimisez pas les risques.`,
                neg: `Ce n’est pas « juste un peu de pluie ». Les risques sont réels.`
              },
              {
                question: `Trois options : rentrer (30 min), bâches (15 min), annuler. Choix ?`,
                responses: [
                  { id: 'A', text: 'Bâches immédiatement + préparation intérieur en parallèle.' },
                  { id: 'B', text: 'Attendre' }
                ],
                correct: 'A',
                pos: `Solution rapide + plan de secours. Le meilleur des deux mondes.`,
                neg: `Attendre ou n’avoir qu’un seul plan est risqué.`
              },
              {
                question: `Les invités paniquent. Communication ?`,
                responses: [
                  { id: 'A', text: '« Rentrez vite »' },
                  { id: 'B', text: '« Ne vous inquiétez pas »' },
                  { id: 'C', text: '« Orage dans 10 min. Bâches installées. Vous pouvez rester ou rentrer. À vous de choisir. »' }
                ],
                correct: 'C',
                pos: `Autonomie + transparence. Les gens paniquent par manque d’info.`,
                neg: `« Rentrez vite » ou « Ne vous inquiétez pas » sont inefficaces. Donnez l’info et le choix.`
              }
            ]
          }
        },
        {
          type: 'Contre-la-montre',
          q: `5 micro-urgences événementielles.`,
          options: {
            steps: [
              {
                question: `Gâteau effondré. Action ?`,
                responses: [{id:'A',text:'Dégât esthétique seulement. Découpez et servez normalement.'},{id:'B',text:'Hurler'}],
                correct: 'A',
                pos: `Évaluation juste : panique inutile. Personne ne saura.`,
                neg: `Appeler la pâtisserie en hurlant ne répare rien. Calmez-vous.`
              },
              {
                question: `Invité fait un malaise (chaleur). Action ?`,
                responses: [{id:'A',text:'Urgences vitale'},{id:'B',text:'Déshydratation légère : ombre, eau, observer. Si aggravation, pompiers.'}],
                correct: 'B',
                pos: `Ne pas escalader trop vite. Observez avant d’appeler les secours.`,
                neg: `Chaque malaise n’est pas une urgence vitale. Évaluez d’abord.`
              },
              {
                question: `Discours du marié dure 30 min (prévu 10). Action ?`,
                responses: [{id:'A',text:'Couper le micro'},{id:'B',text:'Signe discret (regard, montre). Ne jamais couper le micro en public.'}],
                correct: 'B',
                pos: `Respect. L’humiliation publique est pire que l’ennui.`,
                neg: `Couper le micro est une faute professionnelle.`
              },
              {
                question: `Confettis déclenche l’alarme incendie. Action ?`,
                responses: [{id:'A',text:'Crier au feu'},{id:'B',text:'Annonce calme : « Fausse alerte, restez assis. » Évitez la panique.'}],
                correct: 'B',
                pos: `La panique est plus dangereuse que la fausse alerte.`,
                neg: `Crier « au feu » crée un mouvement de foule dangereux.`
              },
              {
                question: `Voisin menace d’appeler la police pour le bruit. Action ?`,
                responses: [{id:'A',text:'Ignorer'},{id:'B',text:'« On baisse de 20% et on termine dans 1h. Acceptez-vous ? »'}],
                correct: 'B',
                pos: `Négociation gagnant-gagnant. Compromis raisonnable.`,
                neg: `Baisser tout ou ignorer sont des erreurs. Négociez.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un bilan post-événement (130-160 mots) : 3 réussites, 3 échecs, 3 recommandations.`,
          pos: `Bilan structuré, honnête, orienté solution. Professionnel.`,
          neg: `Il manque une des trois sections ou les recommandations sont vagues.`
        },
        {
          type: 'Énigme',
          q: `« Sous pression je ne casse pas, je deviens plus claire. Quand tout le monde panique, je reste le dernier debout… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le courage' },
            { id: 'B', label_fr: 'La lucidité sous pression' },
            { id: 'C', label_fr: 'La force' },
            { id: 'D', label_fr: 'Le sang-froid' }
          ],
          correct: 'B',
          pos: `La lucidité n’est pas l’absence de peur, c’est la clarté dans la tempête.`,
          neg: `Relisez : « Zineb me maîtrise après 200 mariages. » = lucidité sous pression.`
        }
      ]
    },
    {
      id: MISSION_IDS.M5,
      title_fr: 'Mission M5 : Palais des Congrès',
      description_fr: `Lieu: Palais des Congrès. Soft skill: Synthèse évaluative. Utiliser une matrice de décision pondérée.`,
      questions: [
        {
          type: 'Prise de décision',
          q: `5 propositions (Costa Rica, Dubaï, Bhoutan, Portugal, Maroc). Évaluez et recommandez les 2 meilleures pour le Maroc.`,
          options: [
            { id: 'A', label_fr: 'A, B, C' },
            { id: 'B', label_fr: 'Maroc hybride (E) + Portugal diversifié (D)' },
            { id: 'C', label_fr: 'Dubaï' }
          ],
          correct: 'B',
          pos: `Évaluation géostratégique. Cinq critères : adaptabilité, écologie, économie, faisabilité, résilience.`,
          neg: `Ne copiez pas un modèle étranger. Évaluez ce qui s’adapte au contexte marocain.`
        },
        {
          type: 'Scénario en cascade',
          q: `Dilemme diplomatique.`,
          options: {
            steps: [
              {
                question: `Dubaï menace de retirer 500M DH si sa proposition n’est pas retenue. Crédibilité ?`,
                responses: [
                  { id: 'A', text: '100% crédible' },
                  { id: 'B', text: 'Partiellement crédible (20%). Dubaï a d’autres intérêts au Maroc. Bluff probable.' }
                ],
                correct: 'B',
                pos: `Évaluation diplomatique. Une menace n’est jamais 100% crédible.`,
                neg: `Ne cédez pas à la panique. Analysez les intérêts réels.`
              },
              {
                question: `Meilleure réponse diplomatique ?`,
                responses: [
                  { id: 'A', text: 'Accepter' },
                  { id: 'B', text: 'Exclure' },
                  { id: 'C', text: '« Votre expertise sera intégrée comme composante de notre modèle hybride. Groupe de travail bilatéral. »' }
                ],
                correct: 'C',
                pos: `Inclure sans adopter. Préserver la relation sans céder au chantage.`,
                neg: `Accepter ou exclure sont des erreurs. Trouvez une 3ème voie.`
              },
              {
                question: `Était-ce éthique ?`,
                responses: [
                  { id: 'A', text: 'Manipulation' },
                  { id: 'B', text: 'Oui. Vous n’avez pas menti. Transparence sur les principes, flexibilité sur les formes.' }
                ],
                correct: 'B',
                pos: `L’éthique diplomatique accepte la nuance. Honnête et stratégique.`,
                neg: `Ce n’est pas de la manipulation. C’est de la diplomatie intelligente.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Répartissez les 5 sièges du comité international de manière optimale.`,
          options: [
            { left_fr: 'Maroc', right_fr: 'Hôte' },
            { left_fr: 'Portugal', right_fr: 'Expertise diversification' },
            { left_fr: 'Costa Rica', right_fr: 'Écotourisme' },
            { left_fr: 'Bhoutan', right_fr: 'Haute valeur' },
            { left_fr: 'Rwanda', right_fr: 'Afrique' }
          ],
          pos: `Équilibre géographique, expertise, représentativité. Pondération des critères.`,
          neg: `Ne donnez pas les sièges aux plus puissants. Cherchez la diversité et l’expertise.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Évaluez les 8 recommandations du rapport final.`,
          options: [
            { text_fr: 'Subvention hôtels écolos → bonne mais insuffisante', is_error: true },
            { text_fr: '10 nouveaux riads → risque surtourisme', is_error: true },
            { text_fr: 'Former 5 000 guides → excellent', is_error: true },
            { text_fr: 'Baisser prix → dangereux', is_error: true },
            { text_fr: 'Label « Made in Maroc » → bonne idée mais contrôles', is_error: true },
            { text_fr: 'Interdire jets privés → populiste', is_error: true },
            { text_fr: 'Rail Marrakech-Atlas → excellent', is_error: true },
            { text_fr: 'Budget 10M sur 1 an → irréaliste', is_error: true },
            { text_fr: 'Plan stratégique 5 ans', is_error: false }
          ],
          pos: `Évaluation politique nuancée. Distinguez excellent, bon, dangereux, populiste, irréaliste.`,
          neg: `Ne dites pas simplement « bon » ou « mauvais ». Nuancez selon le contexte.`
        },
        {
          type: 'Vrai/Faux analytique',
          q: `Analyse des croyances sur le tourisme durable.`,
          options: [
            { text: `« Le tourisme durable est plus cher. »`, correct: 'faux', pos: `Coût initial plus élevé, mais coût long terme inférieur. ROI durable.`, neg: `Le coût d’entrée peut être plus haut, mais l’investissement est rentable.` },
            { text: `« Les touristes ne veulent pas payer plus pour l’écologie. »`, correct: 'faux', pos: `73% des touristes veulent voyager durable, 45% acceptent 10-20% de plus.`, neg: `Le marché existe. Ne le sous-estimez pas.` },
            { text: `« Il faut choisir entre développement économique et protection de l’environnement. »`, correct: 'faux', pos: `Faux dilemme. Le Costa Rica s’est développé PAR l’écotourisme.`, neg: `Les deux peuvent aller ensemble. C’est une fausse opposition.` }
          ]
        },
        {
          type: 'Texte à trous',
          q: `Complétez la matrice de décision pondérée.`,
          options: [
            { text: 'critères' }, { text: 'pondération' }, { text: 'pondéré' }, { text: 'total' }, { text: 'priorité' }, { text: 'subjective' }
          ],
          correct: 'critères, pondération, pondéré, total, priorité, subjective',
          pos: `Outil ultime d’évaluation quantifiée. Poids + notes + total.`,
          neg: `Retenez : critères, pondération, note pondérée, total, priorité, subjectivité à valider collectivement.`
        },
        {
          type: 'Dialogue de situation',
          q: `Journaliste : « Ce sommet est du greenwashing ! » Évaluez et répondez.`,
          options: [
            { id: 'A', label_fr: 'Déni' },
            { id: 'B', label_fr: 'Acceptation passive' },
            { id: 'C', label_fr: '« Je comprends votre scepticisme. Voici 3 engagements concrets avec dates et budgets : 1) Audit hôtels 12 mois (2M DH), 2) Formation 5 000 guides 3 ans (10M DH), 3) Comité citoyen de suivi. Revenez dans 1 an. »' }
          ],
          correct: 'C',
          pos: `Gestion de presse hostile maîtrisée. Valider, prouver, inviter au contrôle.`,
          neg: `Nier ou s’énerver est contre-productif. Donnez des preuves vérifiables.`
        },
        {
          type: 'Contre-la-montre',
          q: `5 évaluations stratégiques flash.`,
          options: {
            steps: [
              {
                question: `« Créer un ministère du tourisme durable. » Évaluation ?`,
                responses: [{id:'A',text:'Excellent'},{id:'B',text:'Bureaucratie. Mieux : mission permanente au ministère existant.'}],
                correct: 'B',
                pos: `Évaluation judicieuse. Un ministère de plus n’est pas toujours la solution.`,
                neg: `Plus de ministères = plus de bureaucratie, pas forcément plus d’action.`
              },
              {
                question: `« Taxer les touristes 50 DH par nuit. » Évaluation ?`,
                responses: [{id:'A',text:'Mauvaise'},{id:'B',text:'Acceptable si réinvesti localement et transparent. Le suivi est la clé.'}],
                correct: 'B',
                pos: `Conditionnel. La taxe n’est pas mauvaise en soi, son usage l’est.`,
                neg: `Ne dites ni « bonne » ni « mauvaise » sans préciser les conditions.`
              },
              {
                question: `« Fermer les riads non conformes. » Évaluation ?`,
                responses: [{id:'A',text:'Nécessaire mais brutal. Mieux : période de mise aux normes (2 ans) + subventions.'},{id:'B',text:'Excellent'}],
                correct: 'A',
                pos: `L’intention est bonne, la méthode doit être progressive.`,
                neg: `La fermeture immédiate détruit des vies. Un étalement est plus humain.`
              },
              {
                question: `« Lancer une campagne “Vivez Marrakech comme un local”. » Évaluation ?`,
                responses: [{id:'A',text:'Bonne mais risque d’usurpation culturelle. Co-créer avec les habitants.'},{id:'B',text:'Mauvaise'}],
                correct: 'A',
                pos: `Impliquez la communauté, ne parlez pas à sa place.`,
                neg: `Le tourisme communautaire doit être construit avec, pas pour.`
              },
              {
                question: `« Interdire les plastiques dans tous les hôtels. » Évaluation ?`,
                responses: [{id:'A',text:'Bonne mais délai 6 mois trop court. Mieux : 12 mois + solution subventionnée.'},{id:'B',text:'Trop lent'}],
                correct: 'A',
                pos: `L’intention est bonne, le délai irréaliste. Etalez.`,
                neg: `Une interdiction brutale sans alternative est vouée à l’échec.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un discours de clôture (150 mots) : bilan, critiques entendues, engagements concrets.`,
          pos: `Discours de clôture inspirant et concret. Bilan honnête, critiques intégrées, promesses vérifiables.`,
          neg: `Il manque une des trois parties ou les engagements sont flous.`
        },
        {
          type: 'Énigme ultime',
          q: `« Je suis ce qui sépare l’amateur du maître, l’opinion de la vérité. L’amateur dit “j’aime”, le maître dit “voici pourquoi”… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’objectivité' },
            { id: 'B', label_fr: 'L’évaluation critique' },
            { id: 'C', label_fr: 'L’expérience' },
            { id: 'D', label_fr: 'La sagesse' }
          ],
          correct: 'B',
          pos: `L’évaluation critique est le sommet de Marrakech. Juger avec des critères et des preuves.`,
          neg: `Relisez : « À Marrakech tu m’as enfin trouvée. » = évaluation critique.`
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      city_id: MARRAKECH_CHALLENGE_PK,
      challenge_id: MARRAKECH_CHALLENGE_PK,
      title_fr,
      description_fr,
      xp_reward: 1000,
      sort_order: parseInt(id.slice(-1)) || 1
    });

    if (mErr) { console.error(`Error upserting mission ${title_fr}:`, mErr); continue; }
    console.log(`✅ Mission ${title_fr} upserted`);

    // B. Delete existing questions
    await supabase.from('questions').delete().eq('mission_id', id);

    // C. Insert new questions
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
      } else if (type === 'vrai_faux' || type === 'vrai_faux_analytique') {
        optionsData = q.options;
      } else if (type === 'scenario_cascade' || type === 'time_attack') {
        optionsData = q.options;
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

  console.log('🏁 Marrakech HIGH-FIDELITY v4 import FINISHED!');
}

importMarrakech();
