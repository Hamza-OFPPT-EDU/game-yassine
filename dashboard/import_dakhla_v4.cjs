require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DAKHLA_CHALLENGE_PK = '98b50e2ddc9943efb387052637738f66';

const MISSION_IDS = {
  D1: '98b50e2d-dc99-43ef-b387-052637738c01',
  D2: '98b50e2d-dc99-43ef-b387-052637738c02',
  D3: '98b50e2d-dc99-43ef-b387-052637738c03',
  D4: '98b50e2d-dc99-43ef-b387-052637738c04',
  D5: '98b50e2d-dc99-43ef-b387-052637738c05'
};

const TYPE_MAPPING = {
  'QCM': 'qcm',
  'QCM de maîtrise': 'qcm',
  'QCM maîtrise': 'qcm',
  'Appariement': 'matching',
  'Dialogue de situation': 'scenario_dialogue',
  'Dialogue de maîtrise': 'scenario_dialogue',
  'Dialogue final': 'scenario_dialogue',
  'Texte à trous': 'fill_blanks',
  'Texte à trous (création)': 'fill_blanks',
  'Vrai/Faux': 'vrai_faux',
  'Contre-la-montre': 'time_attack',
  'Contre-la-montre (QCM)': 'time_attack',
  'Contre-la-montre ultime': 'time_attack',
  'Scénario en cascade': 'scenario_cascade',
  'Détection d’erreurs': 'error_detection',
  'Détection d’erreurs instantanée': 'error_detection',
  'Détection + création': 'error_detection',
  'Classement': 'ranking',
  'Énigme': 'puzzle_riddle',
  'Énigme ultime': 'puzzle_riddle',
  'Rôles d’équipe': 'team_roles',
  'Prise de décision': 'scenario_decision',
  'Prise de décision créative': 'scenario_decision',
  'Situation immersive': 'scenario_decision',
  'Réponse courte': 'short_answer',
  'Création (réponse longue)': 'short_answer',
  'Création synthétique': 'short_answer',
  'Dialogue': 'scenario_dialogue'
};

async function importDakhla() {
  console.log('🚀 Starting Dakhla (Acte VI) import v4...');

  // 1. Upsert City (Challenge)
  const cityDescription = `# 🌊 ACTE VI - DAKHLA : LA LAGUNE BLEUE

## 📖 Brief narratif
Ishaq maîtrise mer, biologie, économie circulaire, énergie éolienne et vision intégrée pour devenir un leader accompli.

---

## 🏙️ Page de présentation de Dakhla

### 🎯 Ce que vous allez apprendre dans cette ville
Dakhla, perle de l’Atlantique, est l’ultime étape du voyage. Ici, vous ne découvrirez pas de nouveaux concepts : vous **maîtriserez** tous ceux que vous avez appris. La maîtrise, c’est agir avec fluidité et intuition, sans protocole, parce que les compétences sont devenues naturelles.

### 📋 Les 5 missions

| Mission | Lieu | Soft skill dominant |
|---------|------|---------------------|
| D1 | Port de pêche | Gestion du stress (maîtrise) |
| D2 | Station de biologie marine | Analyse systémique (maîtrise) |
| D3 | Ferme d’algues | Prise de décision (maîtrise) |
| D4 | Parc éolien | Innovation durable (maîtrise) |
| D5 | Palais des Congrès | Synthèse totale (maîtrise absolue) |

### 🧠 Compétences clés de cette ville
- Maîtriser la gestion de crise avec fluidité (plus de protocole)
- Diagnostiquer un écosystème en 3 questions clés
- Créer une économie circulaire intégrant tous les acteurs
- Gérer un parc éolien et les relations avec les riverains
- Défendre une vision stratégique avec des preuves terrain
- Écrire un discours de clôture inspirant (synthèse du voyage)
- Agir sans réfléchir : l’intuition du maître
- Intégrer stress, décision et équipe en une seule compétence
- Maîtriser la pensée systémique (Senge)
- Devenir soi-même un mentor pour les générations futures`;

  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: DAKHLA_CHALLENGE_PK,
    city_id: 'dakhla',
    city_name_fr: 'Dakhla',
    city_name_ar: 'الداخلة',
    headline_fr: `🌊 ACTE VI - DAKHLA : LA LAGUNE BLEUE`,
    description_fr: cityDescription,
    sort_order: 6,
    is_published: true,
    city_color: '#0ea5e9',
    icon_name: 'waves'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Dakhla upserted');

  const missionsData = [
    {
      id: MISSION_IDS.D1,
      title_fr: 'Mission D1 : Le Port de Pêche',
      description_fr: `Lieu: Port de pêche. Soft skill: Gestion du stress (maîtrise). Leadership naturel et calme en tempête.`,
      questions: [
        {
          type: 'Situation immersive',
          q: `Barque au large. Tempête soudaine, vagues de 3 m, moteur tousse, 4 pêcheurs paniquent. Radio morte. En 30 secondes, que faites-vous ?`,
          options: [
            { id: 'A', label_fr: 'Crier « Ramez ! »' },
            { id: 'B', label_fr: 'Rester calme, prendre la barre, donner 3 ordres clairs : « Gilets de sauvetage ! Vider l’eau ! Toi, écoute le moteur ! » Puis respirer discrètement 4-7-8.' },
            { id: 'C', label_fr: 'Appeler les secours' },
            { id: 'D', label_fr: 'Laisser le plus expérimenté décider' }
          ],
          correct: 'B',
          pos: `Maîtrise absolue ! Calme, ordres, co-régulation, respiration intégrée.`,
          neg: `Paniquer ou ne rien faire aggrave la tempête. Agissez avec clarté.`
        },
        {
          type: 'Scénario en cascade',
          q: `Naufrage imminent.`,
          options: {
            steps: [
              {
                question: `Moteur explose, barque prend l’eau, 3 gilets pour 5. Première action (10 secondes) ?`,
                responses: [
                  { id: 'A', text: 'Donner un gilet à tout le monde' },
                  { id: 'B', text: '« Les 3 moins bons nageurs prennent les gilets. Les 2 bons nageurs restent sans. Moi, je reste avec le bateau. »' }
                ],
                correct: 'B',
                pos: `Triage immédiat et lucide. Évaluation éclair (Marrakech) + décision créative.`,
                neg: `Donner un gilet à tout le monde ou paniquer ne sauve personne.`
              },
              {
                question: `Deuxième action (récupérer de l’aide) ?`,
                responses: [
                  { id: 'A', text: 'Nager vers le port' },
                  { id: 'C', text: 'Miroir de survie pour signaler au loin + feu avec briquet + chiffon imbibé d’essence.' }
                ],
                correct: 'C',
                pos: `Signalisation créative et efficace. Combinaison de techniques de survie.`,
                neg: `Nager vers le port ou attendre un SOS est trop lent.`
              },
              {
                question: `Troisième action (gérer le moral des 4 autres) ?`,
                responses: [
                  { id: 'A', text: '« Ne vous inquiétez pas »' },
                  { id: 'B', text: '« On va s’en sortir. Le signal est parti. 30 minutes à tenir. Racontez-moi votre meilleur souvenir en mer. »' }
                ],
                correct: 'B',
                pos: `Soutien psychologique (R1.7) et cohésion d’équipe. Vous êtes un leader.`,
                neg: `« Ne vous inquiétez pas » ou ignorer ne calme personne.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Attribuez 5 rôles à 5 marins en 2 minutes (une phrase de justification).`,
          options: [
            { left_fr: 'Capitaine', right_fr: 'Plus expérimenté (Leadership)' },
            { left_fr: 'Mécanicien', right_fr: 'Réalisateur' },
            { left_fr: 'Météorologue', right_fr: 'Analyste' },
            { left_fr: 'Trappeur', right_fr: 'Créatif' },
            { left_fr: 'Médiateur', right_fr: 'Harmonisateur (gère conflits)' }
          ],
          pos: `Attribution instinctive juste. La maîtrise rend Belbin évident.`,
          neg: `Hésiter ou attribuer au hasard montre un manque d’intégration.`
        },
        {
          type: 'Texte à trous',
          q: `Créez 8 maximes de sagesse maritime (synthèse de Cyrulnik, Selye, Frankl, etc.).`,
          options: [
            { text: 'enseigne' }, { text: 'rit' }, { text: 'marin' }, { text: 'peurs' }, { text: 'horizon' }, { text: 'ancre' }, { text: 'rame' }, { text: 'écoute' }
          ],
          correct: 'enseigne, rit, marin, peurs, horizon, ancre, rame, écoute',
          pos: `Maximes profondes et mémorables. Une sagesse née de l’expérience.`,
          neg: `Relisez : 1) enseigne, 2) rit, 3) marin, 4) peurs, 5) horizon, 6) ancre, 7) rame, 8) écoute.`
        },
        {
          type: 'Dialogue de situation',
          q: `Deux marins s’insultent (« Tu m’as volé ma prise ! – T’es qu’un menteur ! »). Intervention en 3 phrases, sans CNV théorique mais CNV incarnée.`,
          options: [
            { id: 'A', label_fr: 'Prendre parti' },
            { id: 'B', label_fr: 'Long discours théorique' },
            { id: 'C', label_fr: '« Stop. On respire. Chacun raconte sa version sans s’interrompre. Ensuite, on partage la prise. »' }
          ],
          correct: 'C',
          pos: `CNV naturelle : stop, respiration, écoute, partage. Fluide et efficace.`,
          neg: `Prendre parti ou longs discours théoriques ne calment rien.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Plan de sécurité obsolète. Trouvez 6 erreurs en 2 minutes.`,
          options: [
            { text_fr: 'Gilets non vérifiés', is_error: true },
            { text_fr: 'Radio sans batterie de secours', is_error: true },
            { text_fr: 'Pas de signal de détresse visuel', is_error: true },
            { text_fr: 'Eau potable insuffisante', is_error: true },
            { text_fr: 'Absence de formation aux gestes de survie', is_error: true },
            { text_fr: 'Pas de point de ralliement convenu', is_error: true },
            { text_fr: 'Moteur révisé hier', is_error: false }
          ],
          pos: `Six failles majeures détectées et corrigées mentalement.`,
          neg: `Un plan ignoré est aussi dangereux qu’absent.`
        },
        {
          type: 'Contre-la-montre',
          q: `Urgences en mer.`,
          options: {
            steps: [
              {
                question: `Vague par-dessus bord, homme à la mer. Décision ?`,
                responses: [{id:'A',text:'Plonger'},{id:'B',text:'Lancer bouée, désigner un guetteur, moteur en neutral, approche lente.'}],
                correct: 'B',
                pos: `Réflexe : bouée, guetteur, approche. Pas de panique.`,
                neg: `Plonger ou faire demi-tour brutal aggrave le danger.`
              },
              {
                question: `Moteur en feu. Décision ?`,
                responses: [{id:'A',text:'Eau sur essence'},{id:'B',text:'Éteindre alimentation essence, jeter couverture anti-feu, extincteur.'}],
                correct: 'B',
                pos: `Bon ordre : essence, feu, extinction. La sécurité d’abord.`,
                neg: `L’eau sur feu essence est explosive. Ne pas faire cette erreur.`
              },
              {
                question: `Blessé à la tête, inconscient. Décision ?`,
                responses: [{id:'A',text:'Le bouger'},{id:'B',text:'Position latérale de sécurité, respiration, appel secours.'}],
                correct: 'B',
                pos: `Réflexe PLS, toujours prioritaire sur l’évacuation immédiate.`,
                neg: `Le bouger ou le lever sans PLS peut aggraver la blessure.`
              },
              {
                question: `Épuisé après 20h, vous devez barrer. Décision ?`,
                responses: [{id:'A',text:'Forcer'},{id:'B',text:'Passer la barre au second, dormir 1h par tranches.'}],
                correct: 'B',
                pos: `Connaître ses limites. La fatigue tue.`,
                neg: `Forcer sous fatigue = mettre tout l’équipage en danger.`
              }
            ]
          }
        },
        {
          type: 'Classement',
          q: `Classez 10 éléments instinctivement (pas de délibération).`,
          options: [
            { label_fr: 'Gilet' },
            { label_fr: 'Radeau' },
            { label_fr: 'Eau' },
            { label_fr: 'Radio balise' },
            { label_fr: 'Miroir' },
            { label_fr: 'Nourriture' },
            { label_fr: 'Moteur de secours' },
            { label_fr: 'Cartes' },
            { label_fr: 'Cigarettes' },
            { label_fr: 'Bière' }
          ],
          pos: `Classement de marin. L’instinct prime sur la réflexion.`,
          neg: `Mettre la nourriture avant l’eau ou l’alcool avant tout est une erreur.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez le rapport d’incident (150 mots) avec tous les apprentissages intégrés.`,
          pos: `Rapport clair, factuel, avec analyse des causes et leçons appris. Professionnel.`,
          neg: `Un rapport confus ou sans analyse ne sert à rien.`
        },
        {
          type: 'Énigme',
          q: `« Je ne résiste pas à la tempête, je m’incline pour ne pas casser. Je ne crie pas plus fort que le vent, je murmure pour me faire entendre… Capitaine Aziz est mon visage, Ishaq est devenu mon reflet. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La patience' },
            { id: 'B', label_fr: 'La sagesse maritime (la maîtrise)' },
            { id: 'C', label_fr: 'La force' },
            { id: 'D', label_fr: 'L’expérience' }
          ],
          correct: 'B',
          pos: `La sagesse flexion mais ne rompt pas. Maîtrise incarnée.`,
          neg: `Relisez : « L’eau s’adapte, le roseau plie. » = sagesse maritime.`
        }
      ]
    },
    {
      id: MISSION_IDS.D2,
      title_fr: 'Mission D2 : La Station de Biologie Marine',
      description_fr: `Lieu: Station de biologie marine. Soft skill: Analyse systémique (maîtrise). Diagnostiquer un écosystème en 3 questions clés.`,
      questions: [
        {
          type: 'QCM de maîtrise',
          q: `La population de poissons chute. 5 hypothèses. Quelle est la cause racine ?`,
          options: [
            { id: 'A', label_fr: 'Surchauffe' },
            { id: 'B', label_fr: 'Surpêche' },
            { id: 'C', label_fr: 'Baisse du phytoplancton (base de la chaîne)' },
            { id: 'D', label_fr: 'Prédateurs' },
            { id: 'E', label_fr: 'Pollution' }
          ],
          correct: 'C',
          pos: `Pensée systémique : le phytoplancton est la source. Tout s’effondre sans lui.`,
          neg: `Les autres causes sont des symptômes. La cause profonde est unique.`
        },
        {
          type: 'Scénario en cascade',
          q: `Marée verte toxique.`,
          options: {
            steps: [
              {
                question: `Marée verte dans la lagune. Diagnostiquez en 3 questions.`,
                responses: [
                  { id: 'A', text: 'Vagues' },
                  { id: 'B', text: '1) Origine ? (agriculture, eaux usées) 2) Concentration ? 3) Dynamique (augmente, stagne) ?' }
                ],
                correct: 'B',
                pos: `Diagnostic efficace : source, mesure, tendance.`,
                neg: `Ignorer la tendance, c’est soigner sans comprendre l’évolution.`
              },
              {
                question: `Proposez 2 solutions systémiques.`,
                responses: [
                  { id: 'A', text: 'Une seule solution' },
                  { id: 'B', text: '1) Réduire les nitrates à la source (filtres végétaux), 2) Récolter les algues pour biogaz.' }
                ],
                correct: 'B',
                pos: `Actions sur cause et sur effet, avec valorisation.`,
                neg: `Une seule solution, curative ou palliative, ne résout rien.`
              },
              {
                question: `Anticipez les effets secondaires de ces solutions.`,
                responses: [
                  { id: 'A', text: 'Ignorer' },
                  { id: 'B', text: 'Récolte d’algues → bruit, transport ; filtres végétaux → entretien.' }
                ],
                correct: 'B',
                pos: `Aucune solution n’est parfaite. Anticiper, c’est maîtriser.`,
                neg: `Ignorer les effets secondaires, c’est échouer deux fois.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `6 scientifiques. Attribuez les rôles en 2 minutes (Belbin + forces cognitives).`,
          options: [
            { left_fr: 'Leader', right_fr: 'Directeur de labo' },
            { left_fr: 'Analyste', right_fr: 'Statisticien' },
            { left_fr: 'Créatif', right_fr: 'Modélisateur' },
            { left_fr: 'Réalisateur', right_fr: 'Technicien de terrain' },
            { left_fr: 'Harmonisateur', right_fr: 'Gestionnaire de projet' },
            { left_fr: 'Expert', right_fr: 'Vieux biologiste' }
          ],
          pos: `Distribution naturelle. La maîtrise rend Belbin transparent.`,
          neg: `Mettre un créatif à la gestion ou un leader à l’analyse est contre-productif.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez 7 boucles de rétroaction négatives dans un projet de tourisme de masse.`,
          options: [
            { text_fr: 'Plus de touristes → pollution → dégradation → moins de touristes', is_error: true },
            { text_fr: 'Plus de béton → moins de plage → moins d’attrait', is_error: true },
            { text_fr: 'Épuisement eau → fermeture piscines → mauvais avis', is_error: true },
            { text_fr: 'Bruit → départ faune → perte de biodiversité', is_error: true },
            { text_fr: 'Emplois précaires → turnover → mauvaise qualité', is_error: true },
            { text_fr: 'Déchets → nuisibles → dégradation', is_error: true },
            { text_fr: 'Trafic → temps perdu → insatisfaction', is_error: true },
            { text_fr: 'Protection de la lagune renforcée', is_error: false }
          ],
          pos: `Sept boucles identifiées. Pensée systémique maîtrisée.`,
          neg: `Ne pas voir les rétroactions, c’est condamner le projet.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez un schéma systémique (causes et effets circulaires) sur la lagune.`,
          options: [
            { text: 'poissons' }, { text: 'oiseaux' }, { text: 'nutriments' }, { text: 'phytoplancton' }
          ],
          correct: 'poissons, oiseaux, nutriments, phytoplancton',
          pos: `Boucle vertueuse ou vicieuse? Vous savez les lire.`,
          neg: `Révisez : Phytoplancton → poissons → oiseaux → nutriments → phytoplancton.`
        },
        {
          type: 'Dialogue',
          q: `Promoteur veut construire un hôtel. Créez un argumentaire intégrant les besoins des deux parties.`,
          options: [
            { id: 'A', label_fr: '« Non » sec' },
            { id: 'B', label_fr: '« Votre hôtel peut être éco-conçu. Nous vous aidons à le certifier. En retour, un fonds de 5% des bénéfices va à la protection de la lagune. Gagnant-gagnant. »' }
          ],
          correct: 'B',
          pos: `Intégration des intérêts. Pas d’opposition binaire.`,
          neg: `« Non » sec ou « oui » aveugle sont des échecs.`
        },
        {
          type: 'Contre-la-montre',
          q: `Diagnostics écosystémiques flash.`,
          options: {
            steps: [
              {
                question: `Dune en recul. Cause racine ?`,
                responses: [{id:'A',text:'Mer monte'},{id:'B',text:'Disparition des plantes fixatrices (piétinement excessif ou ramassage).'}],
                correct: 'B',
                pos: `Cause profonde, pas le vent ou la mer.`,
                neg: `« La mer monte » est trop vague. Cherchez ce qui fixait.`
              },
              {
                question: `Oiseaux disparus. Cause ?`,
                responses: [{id:'A',text:'Prédateurs'},{id:'B',text:'Disparition de leurs proies (insectes, petits crustacés) par pesticide ou nettoiement des plages.'}],
                correct: 'B',
                pos: `Maillon milieu de chaîne. L’oiseau n’est qu’un symptôme.`,
                neg: `« Des prédateurs » est hypothèse rare. Regardez la ressource.`
              },
              {
                question: `Algues prolifèrent. Cause ?`,
                responses: [{id:'A',text:'Mangeurs d\'algues'},{id:'B',text:'Nitrates excédentaires (agriculture intensive, égouts).'}],
                correct: 'B',
                pos: `L’eutrophisation classique, mais bien identifiée.`,
                neg: `« Manque de poissons mangeurs d’algues » est secondaire.`
              },
              {
                question: `Eau plus chaude. Conséquences ?`,
                responses: [{id:'A',text:'Moins d’oxygène, mortalité des espèces d’eau froide, migration.'},{id:'B',text:'Tuer poissons'}],
                correct: 'A',
                pos: `Chaîne causale complète. Réchauffement → oxygène → mortalité.`,
                neg: `« Ça va tuer des poissons » sans mécanisme est insuffisant.`
              }
            ]
          }
        },
        {
          type: 'Classement',
          q: `Classez 10 facteurs par importance pour la résilience d'un écosystème.`,
          options: [
            { label_fr: 'Diversité' },
            { label_fr: 'Connectivité' },
            { label_fr: 'Redondance' },
            { label_fr: 'Taille pop' },
            { label_fr: 'Reproduction' },
            { label_fr: 'Stress exogènes' },
            { label_fr: 'Hétérogénéité' },
            { label_fr: 'Mémoire éco' },
            { label_fr: 'Nutriments' },
            { label_fr: 'Température' }
          ],
          pos: `Priorisation juste. La diversité est la première assurance-vie de la nature.`,
          neg: `Mettre la température ou les nutriments avant la diversité est une erreur.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un plan systémique de restauration de la lagune (150 mots).`,
          pos: `Plan intégré, multi-causes, actions emboîtées. Parfait.`,
          neg: `Solution unique ou trop locale. Le système exige du global.`
        },
        {
          type: 'Énigme',
          q: `« Je ne vois pas l’arbre, je vois la forêt. Je ne vois pas la vague, je vois l’océan. Je ne vois pas le conflit, je vois le système… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’intelligence' },
            { id: 'B', label_fr: 'La pensée systémique (Senge, 1990)' },
            { id: 'C', label_fr: 'La logique' },
            { id: 'D', label_fr: 'L’analyse' }
          ],
          correct: 'B',
          pos: `La pensée systémique embrasse l’ensemble, pas les fragments.`,
          neg: `Relisez : « Nadia m’a apprise, Ishaq m’a incarnée. » = pensée systémique.`
        }
      ]
    },
    {
      id: MISSION_IDS.D3,
      title_fr: 'Mission D3 : La Ferme d’Algues',
      description_fr: `Lieu: Ferme d’algues. Soft skill: Prise de décision (maîtrise). Créer une économie circulaire intégrant tous les acteurs.`,
      questions: [
        {
          type: 'QCM maîtrise',
          q: `Client propose 2x le prix pour exporter les algues brutes. Décision ?`,
          options: [
            { id: 'A', label_fr: 'Accepter (profit court terme)' },
            { id: 'B', label_fr: 'Refuser (principe)' },
            { id: 'C', label_fr: 'Contrat hybride : 50% brut à prix élevé (finance R&D), 50% transformé localement (emplois). Investissement du client dans la ferme.' }
          ],
          correct: 'C',
          pos: `Décision systémique équilibrée. Ni argent, ni dogme.`,
          neg: `Le binaire conduit à une perte. La créativité est la solution.`
        },
        {
          type: 'Scénario en cascade',
          q: `Pénurie d’engrais naturel.`,
          options: {
            steps: [
              {
                question: `Identifiez 3 alternatives locales.`,
                responses: [
                  { id: 'A', text: 'Chimiques' },
                  { id: 'B', text: 'Compost d’algues, fientes de volaille, résidus de poisson.' }
                ],
                correct: 'B',
                pos: `Trois ressources locales, gratuites ou peu chères.`,
                neg: `Importer des engrais chimiques ruinerait le modèle circulaire.`
              },
              {
                question: `Créez une boucle circulaire (déchets → ressource).`,
                responses: [
                  { id: 'A', text: 'Incomplète' },
                  { id: 'B', text: 'Les déchets de poisson → engrais liquide pour algues. Les algues excédentaires → aliment pour volaille. Les fientes de volaille → engrais.' }
                ],
                correct: 'B',
                pos: `Boucle vertueuse fermée. Zéro déchet.`,
                neg: `Une boucle incomplète laisse encore des pertes.`
              },
              {
                question: `Convainquez les acteurs réticents.`,
                responses: [
                  { id: 'A', text: 'Morale' },
                  { id: 'B', text: '« Vous économisez 40% sur l’engrais. En échange, vous recevez une part des algues produites. »' }
                ],
                correct: 'B',
                pos: `Argument économique et coopératif. Gagnant-gagnant.`,
                neg: `La morale pure (« c’est bien pour la planète ») ne suffit pas.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Attribuez les rôles selon forces ET interdépendances (Belbin + systémique).`,
          options: [
            { left_fr: 'Leader', right_fr: 'Coordinateur' },
            { left_fr: 'Analyste', right_fr: 'Contrôle qualité' },
            { left_fr: 'Créatif', right_fr: 'Innovation produit' },
            { left_fr: 'Réalisateur', right_fr: 'Exploitation' },
            { left_fr: 'Harmonisateur', right_fr: 'Relations' },
            { left_fr: 'Expert technique', right_fr: 'Algoculture' }
          ],
          pos: `Interdépendances prises en compte. Chaque rôle soutient l’autre.`,
          neg: `Isoler les rôles sans penser leurs liaisons est contre-productif.`
        },
        {
          type: 'Détection + création',
          q: `Trouvez 6 failles du modèle « prendre-faire-jeter ».`,
          options: [
            { text_fr: 'Déchets → valorisation', is_error: true },
            { text_fr: 'Énergie fossile → solaire', is_error: true },
            { text_fr: 'Mono-culture → polyculture', is_error: true },
            { text_fr: 'Eau perdue → recyclage', is_error: true },
            { text_fr: 'Transport lointain → circuit court', is_error: true },
            { text_fr: 'Obsolescence → réparation', is_error: true },
            { text_fr: 'Production locale', is_error: false }
          ],
          pos: `Chaque faille transformée en opportunité. Modèle circulaire robuste.`,
          neg: `Ne voir qu’une faille, c’est ignorer la systémique.`
        },
        {
          type: 'Texte à trous',
          q: `7 principes de l’économie circulaire appliqués à la ferme.`,
          options: [
            { text: 'déchet' }, { text: 'solaire' }, { text: 'modulaire' }, { text: 'locaux' }, { text: 'réparation' }, { text: 'partage' }, { text: 'éco-conception' }
          ],
          correct: 'déchet, solaire, modulaire, locaux, réparation, partage, éco-conception',
          pos: `Sept principes illustrés. Vous êtes un expert circulaire.`,
          neg: `Révisez : Zéro déchet, Énergie solaire, Conception modulaire, Clients locaux, Réparation interne, Partage outils, Éco-conception.`
        },
        {
          type: 'Dialogue',
          q: `Pitch de 3 minutes pour un prêt de 2M DH (ROI écolo + financier).`,
          options: [
            { id: 'A', label_fr: 'Seulement écolo' },
            { id: 'B', label_fr: '« 2M DH, remboursable en 5 ans sur les bénéfices supplémentaires. ROI écologique : économie d’eau de 70%, zéro déchet. ROI financier : marge doublée par le label “éco-circulaire”. »' }
          ],
          correct: 'B',
          pos: `Double argumentation : vert + argent. Irrésistible.`,
          neg: `Seulement écologique ou seulement financier ne suffit pas.`
        },
        {
          type: 'Contre-la-montre',
          q: `Micro-décisions commerciales.`,
          options: {
            steps: [
              {
                question: `Client refuse : « trop cher ».`,
                responses: [{id:'A',text:'Baisser prix'},{id:'B',text:'Proposer un lot plus petit à prix réduit, avec échantillon gratuit.'}],
                correct: 'B',
                pos: `Refuser n’est pas une option. Transformer l’opposition.`,
                neg: `Baisser le prix sans contrepartie tue la marge.`
              },
              {
                question: `Concurrent à -20%.`,
                responses: [{id:'A',text:'Baisser'},{id:'B',text:'Mettre en avant la certification circulaire et la traçabilité locale. Pas de baisse de prix.'}],
                correct: 'B',
                pos: `Compétence sur la valeur, pas le prix.`,
                neg: `Baisser et perdre la différenciation.`
              },
              {
                question: `Délai paiement 90 jours.`,
                responses: [{id:'A',text:'Refuser'},{id:'B',text:'Accepter avec un petit intérêt (3%) et une première livraison payée d’avance.'}],
                correct: 'B',
                pos: `Équilibre entre confiance et protection.`,
                neg: `Refuser net ou accepter sans garantie.`
              },
              {
                question: `Fournisseur +30%.`,
                responses: [{id:'A',text:'Accepter'},{id:'B',text:'Chercher une alternative locale ou un matériau de récupération. Négocier un volume contractuel.'}],
                correct: 'B',
                pos: `Anticiper, diversifier, négocier. Pas de panique.`,
                neg: `Accepter la hausse sans sourciller ou rompre brutalement.`
              }
            ]
          }
        },
        {
          type: 'Classement',
          q: `Classez 8 actions RSE par impact social + environnemental + économique.`,
          options: [
            { label_fr: 'Réduction déchets' },
            { label_fr: 'Énergie renouvelable' },
            { label_fr: 'Sécurité travailleurs' },
            { label_fr: 'Égalité salariale' },
            { label_fr: 'Formation continue' },
            { label_fr: 'Achats locaux' },
            { label_fr: 'Mécénat' },
            { label_fr: 'Bilan carbone' }
          ],
          pos: `Classement cohérent avec triple bottom line.`,
          neg: `Mettre le mécénat avant la sécurité des travailleurs est injuste.`
        },
        {
          type: 'Réponse courte',
          q: `Évaluez la ferme avec des indicateurs intégrés (triple bottom line – 150 mots).`,
          pos: `Indicateurs pertinents : profit, personnes, planète. Évaluation équilibrée.`,
          neg: `Ignorer l’un des trois piliers fausse l’évaluation.`
        },
        {
          type: 'Énigme',
          q: `« Je transforme le déchet en ressource, la contrainte en opportunité, le passé en avenir. Je ne jette rien, je transforme tout. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le recyclage' },
            { id: 'B', label_fr: 'L’économie circulaire' },
            { id: 'C', label_fr: 'L’écologie' },
            { id: 'D', label_fr: 'L’innovation' }
          ],
          correct: 'B',
          pos: `L’économie circulaire est une philosophie, pas juste une technique.`,
          neg: `Le recyclage n’est qu’une partie. C’est plus large.`
        }
      ]
    },
    {
      id: MISSION_IDS.D4,
      title_fr: 'Mission D4 : Le Parc Éolien',
      description_fr: `Lieu: Parc éolien. Soft skill: Innovation durable (maîtrise). Gérer un parc éolien et les relations avec les riverains.`,
      questions: [
        {
          type: 'QCM maîtrise',
          q: `Habitants demandent l’arrêt des éoliennes. Argumentation ?`,
          options: [
            { id: 'A', label_fr: '« C’est obligatoire »' },
            { id: 'B', label_fr: '« On vous paiera »' },
            { id: 'C', label_fr: '10% d’électricité gratuite pour les foyers locaux + fonds communal + visites écoles + plantation d’arbres.' }
          ],
          correct: 'C',
          pos: `Intégration parfaite des intérêts : économique, social, éducatif, esthétique.`,
          neg: `L’argent seul ou l’injonction ne fonctionnent pas.`
        },
        {
          type: 'Scénario en cascade',
          q: `Panne générale par grand vent.`,
          options: {
            steps: [
              {
                question: `Diagnostic immédiat (sans outils).`,
                responses: [
                  { id: 'A', text: 'Technicien' },
                  { id: 'B', text: 'Vérifier les disjoncteurs, écouter si les pales tournent librement, sentir les câbles (pas de surchauffe).' }
                ],
                correct: 'B',
                pos: `Diagnostic de terrain efficace.`,
                neg: `De viser un technicien à 200 km prend trop de temps.`
              },
              {
                question: `Décision : redémarrer ou arrêter ?`,
                responses: [
                  { id: 'A', text: 'Îlotage' },
                  { id: 'B', text: 'Arrêter. L’îlotage peut détruire le réseau local. Attendre l’expert.' }
                ],
                correct: 'B',
                pos: `Prudence. Mieux vaut arrêter que casser.`,
                neg: `Redémarrer en îlotage est très risqué sans expertise.`
              },
              {
                question: `Communication aux 50 000 habitants.`,
                responses: [
                  { id: 'A', text: 'Cacher' },
                  { id: 'B', text: '« Panne sur les éoliennes. Durée estimée 4h. Nous avons activé les groupes électrogènes de secours pour les hôpitaux. Merci de votre patience. »' }
                ],
                correct: 'B',
                pos: `Transparence, délai, solution pour urgences, respect.`,
                neg: `Cacher ou minimiser crée la panique.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `5 techniciens. Attribuez les rôles en 2 minutes (sécurité, technique, logistique, relations, innovation).`,
          options: [
            { left_fr: 'Sécurité', right_fr: 'Expert en protocole' },
            { left_fr: 'Technique', right_fr: 'Le plus expérimenté' },
            { left_fr: 'Logistique', right_fr: 'Approvisionnement' },
            { left_fr: 'Relations', right_fr: 'Liaison avec riverains' },
            { left_fr: 'Innovation', right_fr: 'Améliorations process' }
          ],
          pos: `Distribution claire des 5 fonctions vitales.`,
          neg: `Confondre sécurité et technique ou innovation et logistique.`
        },
        {
          type: 'Détection d’erreurs',
          q: `7 failles dans un protocole de sécurité obsolète (Reason).`,
          options: [
            { text_fr: 'Absence double vérification', is_error: true },
            { text_fr: 'Gants non adaptés', is_error: true },
            { text_fr: 'Echelles non certifiées', is_error: true },
            { text_fr: 'Pas de balisage zone', is_error: true },
            { text_fr: 'Pas de téléphone satellite', is_error: true },
            { text_fr: 'Formation annuelle trop rare', is_error: true },
            { text_fr: 'Absence retour expérience', is_error: true },
            { text_fr: 'Extincteur vérifié', is_error: false }
          ],
          pos: `Sept failles. Modèle Reason appliqué à l’éolien.`,
          neg: `Ignorer les failles, c’est accepter l’accident.`
        },
        {
          type: 'Texte à trous',
          q: `Les 5 vents de l’innovation appliqués à Dakhla.`,
          options: [
            { text: 'stratégique' }, { text: 'technique' }, { text: 'social' }, { text: 'économique' }, { text: 'environnemental' }
          ],
          correct: 'stratégique, technique, social, économique, environnemental',
          pos: `Métaphore filée avec cohérence. Poétique et précis.`,
          neg: `Révisez : Stratégique, Technique, Social, Économique, Environnemental.`
        },
        {
          type: 'Dialogue',
          q: `Pêcheurs craignent câbles sous-marins. Solution technique + sociale ?`,
          options: [
            { id: 'A', label_fr: 'Ignorer' },
            { id: 'B', label_fr: 'Technique : pose différée (période de reproduction) + gainage lisse. Social : comité de suivi (pêcheurs + électriciens) + compensation financière indexée sur les captures.' }
          ],
          correct: 'B',
          pos: `Double réponse technique et sociale. Gagnant-gagnant.`,
          neg: `Ignorer les craintes ou ne proposer qu’un chèque.`
        },
        {
          type: 'Contre-la-montre',
          q: `Micro-urgences énergétiques.`,
          options: {
            steps: [
              {
                question: `Surtension sur le réseau.`,
                responses: [{id:'A',text:'Tout couper'},{id:'B',text:'Couper automatiquement les lignes non critiques, protéger les transformateurs.'}],
                correct: 'B',
                pos: `Réflexe de protection du cœur de réseau.`,
                neg: `Tout couper aggrave la panique.`
              },
              {
                question: `Incendie au pied d’une éolienne.`,
                responses: [{id:'A',text:'Eau'},{id:'B',text:'Couper l’alimentation, pompiers, périmètre sécurité.'}],
                correct: 'B',
                pos: `Sécurité d’abord : coupure, enfermement, intervention.`,
                neg: `Vouloir éteindre sans couper le courant est mortel.`
              },
              {
                question: `Chute de pale.`,
                responses: [{id:'A',text:'Minimiser'},{id:'B',text:'Arrêt de toutes les éoliennes du parc, inspection, message aux habitants rassurant.'}],
                correct: 'B',
                pos: `Précaution, transparence, pas de panique.`,
                neg: `Minimiser ou cacher l’incident est irresponsable.`
              },
              {
                question: `Cyberattaque.`,
                responses: [{id:'A',text:'Auto'},{id:'B',text:'Passe immédiate en mode manuel local, isolement du réseau, audit de sécurité.'}],
                correct: 'B',
                pos: `Passe en manuel, isole, analyse. Procédure de crise.`,
                neg: `Continuer en automatique expose à une catastrophe.`
              }
            ]
          }
        },
        {
          type: 'Classement',
          q: `Classez 10 technologies pour Dakhla avec critères intégrés.`,
          options: [
            { label_fr: 'Solaire' },
            { label_fr: 'Éolien' },
            { label_fr: 'Hydrolien' },
            { label_fr: 'Biomasse' },
            { label_fr: 'Stockage batterie' },
            { label_fr: 'Réseau intelligent' },
            { label_fr: 'Énergie marémotrice' },
            { label_fr: 'Géothermie' },
            { label_fr: 'Hydrogène vert' },
            { label_fr: 'Nucléaire' }
          ],
          pos: `Priorisation cohérente avec les ressources locales.`,
          neg: `Mettre le nucléaire avant le solaire à Dakhla serait absurde.`
        },
        {
          type: 'Réponse courte',
          q: `Plan énergie Dakhla 2040 (200 mots).`,
          pos: `Vision intégrée, réaliste, ambitieuse. Digne d’un vrai plan.`,
          neg: `Utopie vague ou copie d’un plan générique.`
        },
        {
          type: 'Énigme',
          q: `« Je souffle sans visage, je déplace les montagnes de sable, je remplis les voiles, je fais tourner les pales. Les marins me redoutent, les ingénieuses m’apprivoisent. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’air' },
            { id: 'B', label_fr: 'Le vent' },
            { id: 'C', label_fr: 'L’énergie' },
            { id: 'D', label_fr: 'La tempête' }
          ],
          correct: 'B',
          pos: `Le vent est la plus ancienne et la plus moderne des énergies.`,
          neg: `« Tempête » est trop limité. Le vent doux aussi travaille.`
        }
      ]
    },
    {
      id: MISSION_IDS.D5,
      title_fr: 'Mission D5 : Le Palais des Congrès',
      description_fr: `Lieu: Palais des Congrès. Soft skill: Synthèse totale (maîtrise absolue). Écrire un discours de clôture inspirant.`,
      questions: [
        {
          type: 'Création synthétique',
          q: `Rédigez la vision 2040 de la région Dakhla-Oued Ed-Dahab.`,
          pos: `Synthèse parfaite. Cohérente, inspirante, ancrée localement.`,
          neg: `Trop vague, trop ambitieuse sans jalons, ou trop technique.`
        },
        {
          type: 'Scénario en cascade',
          q: `Opposition politique.`,
          options: {
            steps: [
              {
                question: `Élu local : « Ce plan est utopique. » Réponse ?`,
                responses: [
                  { id: 'A', text: 'Fâché' },
                  { id: 'B', text: '« Il n’est pas utopique : la ferme d’algues est rentable, le parc éolien alimente 10 000 foyers, l’école d’Aziz forme 50 jeunes par an. Nous amplifions ce qui marche déjà. »' }
                ],
                correct: 'B',
                pos: `Preuves terrain, pas de théorie. L’élu ne peut pas nier les faits.`,
                neg: `Se fâcher ou donner des promesses vagues.`
              },
              {
                question: `Contre-argument sur le coût.`,
                responses: [
                  { id: 'A', text: 'Vague' },
                  { id: 'B', text: '« L’inaction coûte plus cher. Financement mixte : État + privé + fonds climat + crowdfunding local. ROI social supérieur au coût. »' }
                ],
                correct: 'B',
                pos: `Argument de risque et de mutualisation. Solide.`,
                neg: `Dire « on trouvera l’argent » sans précision.`
              },
              {
                question: `« Les habitants ne veulent pas d’éoliennes ».`,
                responses: [
                  { id: 'A', text: 'Ignorer' },
                  { id: 'B', text: '« 65% des riverains sont favorables après électricité gratuite. Les femmes d’Aicha vendent déjà leurs produits aux visiteurs. L’acceptation est une réussite, pas un problème. »' }
                ],
                correct: 'B',
                pos: `Preuves d’acceptation réelle. Pas de déni.`,
                neg: `Ignorer les mécontents ou les traiter d’obscurantistes.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Comité de pilotage final. 5 comités. Nommez responsables.`,
          options: [
            { left_fr: 'Stratégique', right_fr: 'Wali Benkirane + Gouverneur Amrani' },
            { left_fr: 'Énergie & Eau', right_fr: 'Brahim + Fatima-Zahra' },
            { left_fr: 'Économie bleue', right_fr: 'Capitaine Aziz + Younès' },
            { left_fr: 'Social & Édu', right_fr: 'Aicha + Nadia' },
            { left_fr: 'Financement', right_fr: 'Hicham + Pr. Latifa' }
          ],
          pos: `Chaque binôme associe compétence et territoire. Maîtrise de la gouvernance systémique.`,
          neg: `Désigner des responsables sans leur champ de compétence.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Un consultant émet 10 critiques. Réfutez chaque erreur.`,
          options: [
            { text_fr: 'Solaire pas nuit → éolien complément', is_error: true },
            { text_fr: 'Dessalement énergivore → solaire surplus', is_error: true },
            { text_fr: 'Algoculture pas rentable → Younès preuve', is_error: true },
            { text_fr: 'Tourisme pas attractif → Costa Rica +20%', is_error: true },
            { text_fr: 'Jeunes ville → 200 formés Aziz', is_error: true },
            { text_fr: 'Femmes pas travailler → 25 chez Aicha', is_error: true },
            { text_fr: 'Lagune irrécupérable → station Nadia', is_error: true },
            { text_fr: 'Pêcheurs conservateurs → 80% filets', is_error: true },
            { text_fr: 'Vent imprévisible → 95% modèles', is_error: true },
            { text_fr: 'Budget insuffisant → amorçage ROI 5 ans', is_error: true },
            { text_fr: 'Mentorat fonctionnel', is_error: false }
          ],
          pos: `Dix réfutations instantanées, chaque mentor est une preuve vivante.`,
          neg: `Des réponses vagues ou sans exemple concret.`
        },
        {
          type: 'Texte à trous',
          q: `Les 10 commandements du leadership maître.`,
          options: [
            { text: 'calme' }, { text: 'intuition' }, { text: 'systèmes' }, { text: 'parties prenantes' }, { text: 'création' }, { text: 'adaptation' }, { text: 'silence' }, { text: 'présence' }, { text: 'confiance' }, { text: 'humour' }
          ],
          correct: 'calme, intuition, systèmes, parties prenantes, création, adaptation, silence, présence, confiance, humour',
          pos: `Synthèse des 6 villes en 10 lignes. Sagesse.`,
          neg: `Révisez l'ordre : 1=calme, 2=intuition, 3=systèmes, 4=parties prenantes, 5=création, 6=adaptation, 7=silence, 8=presence, 9=confiance, 10=humour.`
        },
        {
          type: 'Dialogue final',
          q: `Rédigez votre discours de clôture (200-250 mots).`,
          pos: `Discours parfait : structure, émotion, promesse de transmission.`,
          neg: `Trop long, trop vague, ou sans lien avec les mentors.`
        },
        {
          type: 'Contre-la-montre ultime',
          q: `6 décisions en 3 minutes (une par ville). Pas de révision, du fluide.`,
          options: {
            steps: [
              { question: `Rabat : stress aigu ?`, responses: [{id:'A',text:'Chronique'},{id:'B',text:'Aigu'}], correct: 'B' },
              { question: `Chefchaouen : technique ?`, responses: [{id:'A',text:'PAUSE'},{id:'B',text:'STOP'}], correct: 'B' },
              { question: `Fès : analyse ?`, responses: [{id:'A',text:'Linéaire'},{id:'B',text:'Systémique'}], correct: 'B' },
              { question: `Marrakech : évaluation ?`, responses: [{id:'A',text:'Pif'},{id:'B',text:'Multicritère'}], correct: 'B' },
              { question: `Laâyoune : création ?`, responses: [{id:'A',text:'Chère'},{id:'B',text:'Frugale'}], correct: 'B' },
              { question: `Dakhla : niveau ?`, responses: [{id:'A',text:'Savoir'},{id:'B',text:'Maîtrise'}], correct: 'B' }
            ]
          },
          pos: `Six réponses instinctives. Vous ne réfléchissez plus, vous saisissez.`,
          neg: `Hésiter ou chercher dans sa mémoire montre une maîtrise incomplète.`
        },
        {
          type: 'Classement',
          q: `Classez les compétences acquises par ville (Bloom).`,
          options: [
            { label_fr: 'Connaître (Rabat)' },
            { label_fr: 'Appliquer (Chefchaouen)' },
            { label_fr: 'Analyser (Fès)' },
            { label_fr: 'Évaluer (Marrakech)' },
            { label_fr: 'Créer (Laâyoune)' },
            { label_fr: 'Maîtriser (Dakhla)' }
          ],
          pos: `Pyramide de Bloom parfaitement intégrée.`,
          neg: `Mélanger l’ordre ou sauter un niveau.`
        },
        {
          type: 'Réponse courte',
          q: `Écrivez la lettre d’Ishaq à son père (250 mots).`,
          pos: `Lettre touchante, sincère, intelligente. Fière du parcours.`,
          neg: `Froide, trop technique, ou sans émotion.`
        },
        {
          type: 'Énigme ultime',
          q: `« Je suis le fruit de 6 arbres mais ne suis ni une pomme ni une datte. J’ai visité Rabat, Chefchaouen, Fès, Marrakech, Laâyoune, Dakhla… Les autres te l’ont enseigné, mais maintenant il m’appartient. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La sagesse' },
            { id: 'B', label_fr: 'La compétence (intégrée, incarnée, maîtrisée)' },
            { id: 'C', label_fr: 'Le savoir' },
            { id: 'D', label_fr: 'L’expérience' }
          ],
          correct: 'B',
          pos: `La compétence est la capacité d’agir avec fluidité. Vous l’avez acquise.`,
          neg: `Relisez : « Ce qui reste quand tu as tout appris et tout oublié » = compétence.`
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
      xp_reward: 1500,
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
      } else if (type === 'vrai_faux') {
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
        xp_reward: type === 'puzzle_riddle' ? 500 : 200,
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

  console.log('🏁 Dakhla MASTERY v4 import FINISHED!');
}

importDakhla();
