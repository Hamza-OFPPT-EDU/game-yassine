const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const DAKHLA_CHALLENGE_PK = '98b50e2ddc9943efb387052637738f66';

const MISSION_IDS = {
  D1: '98b50e2d-dc99-43ef-b387-052637738d01',
  D2: '98b50e2d-dc99-43ef-b387-052637738d02',
  D3: '98b50e2d-dc99-43ef-b387-052637738d03',
  D4: '98b50e2d-dc99-43ef-b387-052637738d04',
  D5: '98b50e2d-dc99-43ef-b387-052637738d05'
};

const TYPE_MAPPING = {
  'Situation immersive': 'scenario_decision',
  'Scénario en cascade': 'scenario_cascade',
  'Rôles d’équipe': 'team_roles',
  'Texte à trous': 'fill_blanks',
  'Dialogue de situation': 'scenario_dialogue',
  'Détection d’erreurs': 'error_detection',
  'Contre-la-montre': 'time_attack',
  'Classement': 'ranking',
  'Réponse courte': 'short_answer',
  'Énigme': 'puzzle_riddle',
  'QCM': 'qcm',
  'Dialogue de maîtrise': 'scenario_dialogue'
};

const DAKHLA_DATA = {
  city: {
    id: DAKHLA_CHALLENGE_PK,
    city_id: 'dakhla',
    city_name_fr: 'Dakhla',
    city_name_ar: 'الداخلة',
    headline_fr: 'La Lagune Bleue - Maîtrise Absolue',
    description_fr: 'Dakhla, perle de l’Atlantique, est l’ultime étape du voyage. Ici, vous maîtriserez tous les concepts appris. La maîtrise, c’est agir avec fluidité et intuition.',
    focus_fr: 'Maîtrise & Intuition',
    illustration_url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2000&auto=format&fit=crop',
    icon_name: 'waves',
    city_color: '#0ea5e9',
    sort_order: 6,
    is_published: true
  },
  missions: [
    {
      id: 'D1',
      title: 'D1 - Le Port de Pêche',
      description: 'Leadership naturel et gestion de crise en mer.',
      questions: [
        {
          type: 'Situation immersive',
          q: 'Barque au large. Tempête soudaine, vagues de 3 m, moteur tousse, 4 pêcheurs paniquent. Radio morte. En 30 secondes, que faites-vous ?',
          options: [
            { id: 'A', label_fr: 'Crier « Ramez ! »', impact_decision: -10, feedback_fr: 'Paniquer aggrave la situation.' },
            { id: 'B', label_fr: 'Rester calme, prendre la barre, donner 3 ordres clairs : « Gilets de sauvetage ! Vider l’eau ! Toi, écoute le moteur ! »', impact_decision: 20, feedback_fr: 'Maîtrise absolue ! Calme, ordres, respiration intégrée.' },
            { id: 'C', label_fr: 'Appeler les secours', impact_decision: 0, feedback_fr: 'La radio est morte, rappelez-vous.' },
            { id: 'D', label_fr: 'Laisser le plus expérimenté décider', impact_decision: 5, feedback_fr: 'Vous êtes le leader ici.' }
          ],
          correct: 'B',
          pos: 'Maîtrise absolue ! Calme, ordres, respiration intégrée.',
          neg: 'Paniquer ou ne rien faire aggrave la tempête. Agissez avec clarté.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Naufrage imminent',
          steps: [
            {
              question: 'Moteur explose, barque prend l’eau, 3 gilets pour 5. Première action (10 secondes) ?',
              responses: [
                { id: 'A', text: 'Donner un gilet à tout le monde' },
                { id: 'B', text: '« Les 3 moins bons nageurs prennent les gilets. Les 2 bons nageurs restent sans. Moi, je reste avec le bateau. »' }
              ],
              correct: 'B',
              pos: 'Triage immédiat et lucide.',
              neg: 'Paniquer ne sauve personne.'
            },
            {
              question: 'Deuxième action (récupérer de l’aide) ?',
              responses: [
                { id: 'A', text: 'Nager vers le port' },
                { id: 'B', text: 'Attendre un SOS' },
                { id: 'C', text: 'Miroir de survie + feu avec briquet + chiffon imbibé d’essence.' }
              ],
              correct: 'C',
              pos: 'Signalisation créative et efficace.',
              neg: 'Trop lent ou passif.'
            },
            {
              question: 'Troisième action (gérer le moral des 4 autres) ?',
              responses: [
                { id: 'A', text: '« Ne vous inquiétez pas »' },
                { id: 'B', text: '« On va s’en sortir. Le signal est parti. 30 minutes à tenir. Racontez-moi votre meilleur souvenir en mer. »' }
              ],
              correct: 'B',
              pos: 'Soutien psychologique et cohésion.',
              neg: 'Ignorer ne calme personne.'
            }
          ]
        },
        {
          type: 'Rôles d’équipe',
          q: 'Attribuez 5 rôles à 5 marins en 2 minutes.',
          options: [
            { id: 'capitaine', label_fr: 'Capitaine', role: 'leadership' },
            { id: 'mecanicien', label_fr: 'Mécanicien', role: 'réalisateur' },
            { id: 'meteorologue', label_fr: 'Météorologue', role: 'analyste' },
            { id: 'trappeur', label_fr: 'Trappeur', role: 'créatif' },
            { id: 'mediateur', label_fr: 'Médiateur', role: 'harmonisateur' }
          ],
          correct: 'ALL',
          pos: 'Attribution instinctive juste. La maîtrise rend Belbin évident.',
          neg: 'Hésiter montre un manque d’intégration.'
        },
        {
          type: 'Texte à trous',
          q: 'Créez 8 maximes de sagesse maritime.',
          options: [
            { id: '1', text: 'enseigne' },
            { id: '2', text: 'tangue' },
            { id: '3', text: 'marin' },
            { id: '4', text: 'guérit' },
            { id: '5', text: 'horizon' },
            { id: '6', text: 'ancre' },
            { id: '7', text: 'avanceras' },
            { id: '8', text: 'écoute' }
          ],
          correct: 'enseigne, tangue, marin, guérit, horizon, ancre, avanceras, écoute',
          pos: 'Maximes profondes et mémorables.',
          neg: 'Des phrases sans lien avec la sagesse maritime.'
        },
        {
          type: 'Dialogue de maîtrise',
          q: 'Deux marins s’insultent. Intervention en 3 phrases, CNV incarnée.',
          options: [
            { id: 'A', label_fr: '« Calmez-vous ou je vous jette à l’eau ! »' },
            { id: 'B', label_fr: '« Stop. On respire. Chacun raconte sa version sans s’interrompre. Ensuite, on partage la prise. »' }
          ],
          correct: 'B',
          pos: 'CNV naturelle : stop, respiration, écoute, partage.',
          neg: 'Prendre parti ou longs discours sont des échecs.'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Plan de sécurité obsolète. Trouvez 6 erreurs.',
          errors: [
            { id: '1', text_fr: 'Gilets non vérifiés', is_error: true },
            { id: '2', text_fr: 'Radio sans batterie de secours', is_error: true },
            { id: '3', text_fr: 'Pas de signal de détresse visuel', is_error: true },
            { id: '4', text_fr: 'Eau potable insuffisante', is_error: true },
            { id: '5', text_fr: 'Absence de formation aux gestes de survie', is_error: true },
            { id: '6', text_fr: 'Pas de point de ralliement convenu', is_error: true }
          ],
          pos: 'Six failles majeures détectées.',
          neg: 'Un plan ignoré est dangereux.'
        },
        {
          type: 'Contre-la-montre',
          q: '4 micro-décisions de survie.',
          steps: [
            {
              question: 'Vague par-dessus bord, homme à la mer. Décision ?',
              responses: [
                { id: 'A', text: 'Plonger pour le sauver' },
                { id: 'B', text: 'Lancer bouée, désigner un guetteur, moteur en neutral, approche lente.' }
              ],
              correct: 'B'
            },
            {
              question: 'Moteur en feu. Décision ?',
              responses: [
                { id: 'A', text: 'Jeter de l’eau' },
                { id: 'B', text: 'Éteindre alimentation essence, jeter couverture anti-feu, extincteur.' }
              ],
              correct: 'B'
            },
            {
              question: 'Blessé à la tête, inconscient. Décision ?',
              responses: [
                { id: 'A', text: 'Le bouger vite' },
                { id: 'B', text: 'Position latérale de sécurité, respiration, appel secours.' }
              ],
              correct: 'B'
            },
            {
              question: 'Épuisé après 20h, vous devez barrer. Décision ?',
              responses: [
                { id: 'A', text: 'Continuer par courage' },
                { id: 'B', text: 'Passer la barre au second, dormir 1h par tranches.' }
              ],
              correct: 'B'
            }
          ],
          pos: 'Réflexes de marin confirmés.',
          neg: 'La panique ou l’ignorance tuent en mer.'
        },
        {
          type: 'Classement',
          q: 'Priorités de survie en mer (10 éléments).',
          order: [
            { id: '1', label_fr: 'Gilet' },
            { id: '2', label_fr: 'Radeau' },
            { id: '3', label_fr: 'Eau' },
            { id: '4', label_fr: 'Radio balise' },
            { id: '5', label_fr: 'Miroir' },
            { id: '6', label_fr: 'Nourriture' },
            { id: '7', label_fr: 'Moteur de secours' },
            { id: '8', label_fr: 'Cartes' },
            { id: '9', label_fr: 'Cigarettes' },
            { id: '10', label_fr: 'Bière' }
          ],
          pos: 'Classement de marin. L’instinct prime.',
          neg: 'Mettre l’alcool avant l’eau est fatal.'
        },
        {
          type: 'Réponse courte',
          q: 'Rédigez le rapport d’incident (150 mots) avec tous les apprentissages intégrés.',
          pos: 'Rapport clair, factuel et professionnel.',
          neg: 'Un rapport confus ne sert à rien.'
        },
        {
          type: 'Énigme',
          q: '« Je ne résiste pas à la tempête, je m’incline pour ne pas casser. Qui suis-je ? »',
          options: [
            { id: 'A', label_fr: 'La patience' },
            { id: 'B', label_fr: 'La sagesse maritime' }
          ],
          correct: 'B',
          pos: 'La sagesse fléchit mais ne rompt pas.',
          neg: 'Relisez : l’eau s’adapte, le roseau plie.'
        }
      ]
    },
    {
      id: 'D2',
      title: 'D2 - La Station de Biologie Marine',
      description: 'Analyse systémique et diagnostics complexes.',
      questions: [
        {
          type: 'QCM',
          q: 'La population de poissons chute. Quelle est la cause racine ?',
          options: [
            { id: 'A', label_fr: 'Surchauffe' },
            { id: 'B', label_fr: 'Surpêche' },
            { id: 'C', label_fr: 'Baisse du phytoplancton' },
            { id: 'D', label_fr: 'Prédateurs' }
          ],
          correct: 'C',
          pos: 'Pensée systémique : le phytoplancton est la source.',
          neg: 'Les autres sont des symptômes ou facteurs secondaires.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Marée verte toxique',
          steps: [
            {
              question: 'Diagnostiquez en 3 questions.',
              responses: [
                { id: 'A', text: 'Combien ça coûte ?' },
                { id: 'B', text: '1) Origine ? 2) Concentration ? 3) Dynamique ?' }
              ],
              correct: 'B'
            },
            {
              question: 'Proposez 2 solutions systémiques.',
              responses: [
                { id: 'A', text: 'Nettoyer la plage' },
                { id: 'B', text: '1) Réduire les nitrates à la source, 2) Récolter pour biogaz.' }
              ],
              correct: 'B'
            },
            {
              question: 'Anticipez les effets secondaires.',
              responses: [
                { id: 'A', text: 'Aucun' },
                { id: 'B', text: 'Récolte d’algues → bruit, transport ; filtres → entretien.' }
              ],
              correct: 'B'
            }
          ]
        },
        {
          type: 'Rôles d’équipe',
          q: '6 scientifiques. Attribuez les rôles Belbin.',
          options: [
            { id: 'leader', label_fr: 'Directeur de labo', role: 'leader' },
            { id: 'analyste', label_fr: 'Statisticien', role: 'analyste' },
            { id: 'creatif', label_fr: 'Modélisateur', role: 'créatif' },
            { id: 'realisateur', label_fr: 'Technicien de terrain', role: 'réalisateur' },
            { id: 'harmonisateur', label_fr: 'Gestionnaire de projet', role: 'harmonisateur' },
            { id: 'expert', label_fr: 'Vieux biologiste', role: 'expert' }
          ],
          correct: 'ALL'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Projet de tourisme de masse. Trouvez 7 boucles de rétroaction négatives.',
          errors: [
            { id: '1', text_fr: 'Plus de touristes → plus de pollution → moins de touristes', is_error: true },
            { id: '2', text_fr: 'Plus de béton → moins de plage naturelle', is_error: true },
            { id: '3', text_fr: 'Épuisement eau → fermeture piscines', is_error: true },
            { id: '4', text_fr: 'Bruit → départ faune', is_error: true },
            { id: '5', text_fr: 'Emplois précaires → turnover', is_error: true },
            { id: '6', text_fr: 'Déchets → nuisibles', is_error: true },
            { id: '7', text_fr: 'Trafic → insatisfaction', is_error: true }
          ]
        },
        {
          type: 'Texte à trous',
          q: 'Complétez le schéma systémique : Phytoplancton → poissons → oiseaux → nutriments → phytoplancton.',
          options: [
            { id: '1', text: 'poissons' },
            { id: '2', text: 'oiseaux' },
            { id: '3', text: 'nutriments' },
            { id: '4', text: 'cassure' }
          ],
          correct: 'poissons, oiseaux, nutriments, cassure'
        },
        {
          type: 'Dialogue de situation',
          q: 'Hôtel vs Écologie. Créez un argumentaire Fisher & Ury.',
          options: [
            { id: 'A', label_fr: '« C’est interdit, point. »' },
            { id: 'B', label_fr: '« Votre hôtel peut être éco-conçu. Certification contre fonds de protection. »' }
          ],
          correct: 'B'
        },
        {
          type: 'Contre-la-montre',
          q: 'Diagnostics flash.',
          steps: [
            { question: 'Dune en recul. Cause ?', responses: [{id:'A', text:'Vent'}, {id:'B', text:'Disparition plantes fixatrices'}], correct: 'B' },
            { question: 'Oiseaux disparus. Cause ?', responses: [{id:'A', text:'Migration'}, {id:'B', text:'Disparition des proies'}], correct: 'B' },
            { question: 'Algues prolifèrent. Cause ?', responses: [{id:'A', text:'Chaleur'}, {id:'B', text:'Nitrates excédentaires'}], correct: 'B' },
            { question: 'Eau plus chaude. Conséquences ?', responses: [{id:'A', text:'Baignade'}, {id:'B', text:'Moins d’oxygène, mortalité'}], correct: 'B' }
          ]
        },
        {
          type: 'Classement',
          q: 'Facteurs de résilience (10 facteurs).',
          order: [
            { id: '1', label_fr: 'Diversité' },
            { id: '2', label_fr: 'Connectivité' },
            { id: '3', label_fr: 'Redondance' },
            { id: '4', label_fr: 'Taille population' },
            { id: '5', label_fr: 'Capacité repro' },
            { id: '6', label_fr: 'Résistance stress' },
            { id: '7', label_fr: 'Hétérogénéité' },
            { id: '8', label_fr: 'Mémoire écologique' },
            { id: '9', label_fr: 'Flux nutriments' },
            { id: '10', label_fr: 'Température' }
          ]
        },
        {
          type: 'Réponse courte',
          q: 'Rédigez un plan systémique de restauration de la lagune (150 mots).',
          pos: 'Plan intégré et multi-causes.'
        },
        {
          type: 'Énigme',
          q: '« Je ne vois pas l’arbre, je vois la forêt... Qui suis-je ? »',
          options: [{id:'A', label_fr:'Pensée systémique'}, {id:'B', label_fr:'Analyse'}],
          correct: 'A'
        }
      ]
    },
    {
      id: 'D3',
      title: 'D3 - La Ferme d’Algues',
      description: 'Économie circulaire et décisions durables.',
      questions: [
        {
          type: 'QCM',
          q: 'Client veut exporter brut (profit) vs transformer local (emplois).',
          options: [
            { id: 'A', label_fr: 'Accepter le profit' },
            { id: 'B', label_fr: 'Refuser par principe' },
            { id: 'C', label_fr: 'Contrat hybride : 50% brut (finance R&D), 50% transformé (emplois).' }
          ],
          correct: 'C'
        },
        {
          type: 'Scénario en cascade',
          q: 'Pénurie d’engrais naturel',
          steps: [
            { question: '3 alternatives locales ?', responses: [{id:'A', text:'Chimique'}, {id:'B', text:'Compost algues, fientes, résidus poisson'}], correct: 'B' },
            { question: 'Boucle circulaire ?', responses: [{id:'A', text:'Déchets jetés'}, {id:'B', text:'Déchets poisson → engrais → algues → volaille → fientes → engrais.'}], correct: 'B' },
            { question: 'Convaincre les acteurs ?', responses: [{id:'A', text:'Morale'}, {id:'B', text:'« Économisez 40% contre part de production. »'}], correct: 'B' }
          ]
        },
        {
          type: 'Rôles d’équipe',
          q: 'Ferme circulaire. Attribuez les rôles.',
          options: [
            { id: 'leader', label_fr: 'Coordinateur', role: 'leader' },
            { id: 'analyste', label_fr: 'Contrôle qualité', role: 'analyste' },
            { id: 'creatif', label_fr: 'Innovation produit', role: 'créatif' },
            { id: 'realisateur', label_fr: 'Exploitation', role: 'réalisateur' },
            { id: 'harmonisateur', label_fr: 'Relations fournisseurs', role: 'harmonisateur' }
          ],
          correct: 'ALL'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Business plan linéaire. Trouvez 6 failles.',
          errors: [
            { id: '1', text_fr: 'Déchets non valorisés', is_error: true },
            { id: '2', text_fr: 'Énergie fossile dominante', is_error: true },
            { id: '3', text_fr: 'Monoculture risquée', is_error: true },
            { id: '4', text_fr: 'Eau non recyclée', is_error: true },
            { id: '5', text_fr: 'Transport lointain', is_error: true },
            { id: '6', text_fr: 'Obsolescence programmée', is_error: true }
          ]
        },
        {
          type: 'Texte à trous',
          q: '7 principes de l’économie circulaire.',
          options: [
            { id: '1', text: 'Zéro déchet' },
            { id: '2', text: 'Solaire' },
            { id: '3', text: 'Modulaire' },
            { id: '4', text: 'Proximité' },
            { id: '5', text: 'Réparation' },
            { id: '6', text: 'Partage' },
            { id: '7', text: 'Biodégradables' }
          ],
          correct: 'Zéro déchet, Solaire, Modulaire, Proximité, Réparation, Partage, Biodégradables'
        },
        {
          type: 'Dialogue de situation',
          q: 'Pitch pour prêt 2M DH. ROI Triple Bottom Line.',
          options: [
            { id: 'A', label_fr: 'Argent seulement' },
            { id: 'B', label_fr: 'Marge doublée + 70% eau économisée + zéro déchet.' }
          ],
          correct: 'B'
        },
        {
          type: 'Contre-la-montre',
          q: 'Décisions commerciales.',
          steps: [
            { question: 'Client dit « trop cher ».', responses: [{id:'A', text:'Baisser prix'}, {id:'B', text:'Lot plus petit + échantillon.'}], correct: 'B' },
            { question: 'Concurrent -20%.', responses: [{id:'A', text:'Suivre'}, {id:'B', text:'Mettre en avant certification.'}], correct: 'B' },
            { question: 'Délai 90 jours.', responses: [{id:'A', text:'Refuser'}, {id:'B', text:'Accepter + intérêt 3% + avance.'}], correct: 'B' },
            { question: 'Hausse matière 30%.', responses: [{id:'A', text:'Subir'}, {id:'B', text:'Alternative locale / récupération.'}], correct: 'B' }
          ]
        },
        {
          type: 'Classement',
          q: 'Priorités RSE (8 actions).',
          order: [
            { id: '1', label_fr: 'Réduction déchets' },
            { id: '2', label_fr: 'Énergie renouvelable' },
            { id: '3', label_fr: 'Sécurité travailleurs' },
            { id: '4', label_fr: 'Égalité salariale' },
            { id: '5', label_fr: 'Formation' },
            { id: '6', label_fr: 'Achats locaux' },
            { id: '7', label_fr: 'Mécénat' },
            { id: '8', label_fr: 'Bilan carbone' }
          ]
        },
        {
          type: 'Réponse courte',
          q: 'Évaluez la ferme (Triple Bottom Line).',
          pos: 'Profit, People, Planet.'
        },
        {
          type: 'Énigme',
          q: '« Je transforme le déchet en ressource... Qui suis-je ? »',
          options: [{id:'A', label_fr:'Économie circulaire'}, {id:'B', label_fr:'Recyclage'}],
          correct: 'A'
        }
      ]
    },
    {
      id: 'D4',
      title: 'D4 - Le Parc Éolien',
      description: 'Énergie invisible et médiation sociale.',
      questions: [
        {
          type: 'QCM',
          q: 'Médiation avec habitants hostiles.',
          options: [
            { id: 'A', label_fr: 'Injonction' },
            { id: 'B', label_fr: 'Argent' },
            { id: 'C', label_fr: 'Électricité gratuite + fonds communal + écoles.' }
          ],
          correct: 'C'
        },
        {
          type: 'Scénario en cascade',
          q: 'Panne générale par grand vent',
          steps: [
            { question: 'Diagnostic sans outils ?', responses: [{id:'A', text:'Attendre expert'}, {id:'B', text:'Disjoncteurs, écoute pales, odeur câbles.'}], correct: 'B' },
            { question: 'Redémarrer en îlotage ?', responses: [{id:'A', text:'Oui'}, {id:'B', text:'Arrêter. Risque réseau trop haut.'}], correct: 'B' },
            { question: 'Communication publique ?', responses: [{id:'A', text:'Silence'}, {id:'B', text:'Transparence, délai 4h, secours activés.'}], correct: 'B' }
          ]
        },
        {
          type: 'Rôles d’équipe',
          q: 'Équipe maintenance. 5 techniciens.',
          options: [
            { id: 'secu', label_fr: 'Expert protocole', role: 'sécurité' },
            { id: 'tech', label_fr: 'Plus expérimenté', role: 'technique' },
            { id: 'log', label_fr: 'Approvisionnement', role: 'logistique' },
            { id: 'rel', label_fr: 'Liaison riverains', role: 'relations' },
            { id: 'inv', label_fr: 'Améliorations', role: 'innovation' }
          ],
          correct: 'ALL'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Protocole sécurité obsolète. 7 failles.',
          errors: [
            { id: '1', text_fr: 'Pas de double vérification', is_error: true },
            { id: '2', text_fr: 'Gants inadaptés', is_error: true },
            { id: '3', text_fr: 'Echelles non certifiées', is_error: true },
            { id: '4', text_fr: 'Pas de balisage danger', is_error: true },
            { id: '5', text_fr: 'Pas de téléphone satellite', is_error: true },
            { id: '6', text_fr: 'Formation trop rare', is_error: true },
            { id: '7', text_fr: 'Pas de retour expérience', is_error: true }
          ]
        },
        {
          type: 'Texte à trous',
          q: 'Les 5 vents de l’innovation.',
          options: [
            { id: '1', text: 'Vision' },
            { id: '2', text: 'R&D' },
            { id: '3', text: 'Acceptation' },
            { id: '4', text: 'Financement' },
            { id: '5', text: 'Carbone' }
          ],
          correct: 'Vision, R&D, Acceptation, Financement, Carbone'
        },
        {
          type: 'Dialogue de situation',
          q: 'Conflit pêcheurs vs câbles. Solution ?',
          options: [
            { id: 'A', label_fr: 'Ignorer' },
            { id: 'B', label_fr: 'Pose différée + gainage lisse + comité de suivi.' }
          ],
          correct: 'B'
        },
        {
          type: 'Contre-la-montre',
          q: 'Urgences énergétiques.',
          steps: [
            { question: 'Surtension réseau.', responses: [{id:'A', text:'Tout couper'}, {id:'B', text:'Couper non critique, protéger transfo.'}], correct: 'B' },
            { question: 'Incendie pied éolienne.', responses: [{id:'A', text:'Eau'}, {id:'B', text:'Couper, pompiers, périmètre.'}], correct: 'B' },
            { question: 'Chute de pale.', responses: [{id:'A', text:'Cacher'}, {id:'B', text:'Arrêt parc, inspection, rassurer.'}], correct: 'B' },
            { question: 'Cyberattaque.', responses: [{id:'A', text:'Ignorer'}, {id:'B', text:'Mode manuel local, isoler, audit.'}], correct: 'B' }
          ]
        },
        {
          type: 'Classement',
          q: 'Priorités investissement (10 techno).',
          order: [
            { id: '1', label_fr: 'Solaire' },
            { id: '2', label_fr: 'Éolien' },
            { id: '3', label_fr: 'Hydrolien' },
            { id: '4', label_fr: 'Biomasse' },
            { id: '5', label_fr: 'Batteries' },
            { id: '6', label_fr: 'Smart Grid' },
            { id: '7', label_fr: 'Marémotrice' },
            { id: '8', label_fr: 'Géothermie' },
            { id: '9', label_fr: 'Hydrogène vert' },
            { id: '10', label_fr: 'Nucléaire' }
          ]
        },
        {
          type: 'Réponse courte',
          q: 'Plan énergie Dakhla 2040.',
          pos: 'Vision 100% renouvelable et intégrée.'
        },
        {
          type: 'Énigme',
          q: '« Je souffle sans visage... Qui suis-je ? »',
          options: [{id:'A', label_fr:'Le vent'}, {id:'B', label_fr:'L’air'}],
          correct: 'A'
        }
      ]
    },
    {
      id: 'D5',
      title: 'D5 - Le Palais des Congrès',
      description: 'Maîtrise absolue et synthèse du voyage.',
      questions: [
        {
          type: 'Réponse courte',
          q: 'Rédigez la vision 2040 de Dakhla.',
          pos: 'Synthèse parfaite : énergie, eau, social.'
        },
        {
          type: 'Scénario en cascade',
          q: 'Opposition politique',
          steps: [
            { question: 'Réponse à l’élu sceptique ?', responses: [{id:'A', text:'Promesses'}, {id:'B', text:'Preuves terrain (ferme, école, parc).'}], correct: 'B' },
            { question: 'Contre-argument coût ?', responses: [{id:'A', text:'On verra'}, {id:'B', text:'Inaction coûte plus cher + financement mixte.'}], correct: 'B' },
            { question: 'Acceptation sociale ?', responses: [{id:'A', text:'Osef'}, {id:'B', text:'65% favorables, revenus femmes Aicha.'}], correct: 'B' }
          ]
        },
        {
          type: 'Rôles d’équipe',
          q: 'Comité de pilotage. Associez mentors et domaines.',
          options: [
            { id: 'strat', label_fr: 'Stratégique', roles: 'Wali Benkirane + Amrani' },
            { id: 'env', label_fr: 'Énergie', roles: 'Brahim + Fatima' },
            { id: 'eco', label_fr: 'Économie bleue', roles: 'Aziz + Younès' },
            { id: 'soc', label_fr: 'Social', roles: 'Aicha + Nadia' },
            { id: 'fin', label_fr: 'Financement', roles: 'Hicham + Latifa' }
          ],
          correct: 'ALL'
        },
        {
          type: 'Détection d’erreurs',
          q: 'Réfutez 10 critiques du consultant.',
          errors: [
            { id: '1', text_fr: 'Solaire/éolien complémentarité', is_error: true },
            { id: '2', text_fr: 'Dessalement sur excédent', is_error: true },
            { id: '3', text_fr: 'Algoculture rentable', is_error: true },
            { id: '4', text_fr: 'Tourisme durable attractif', is_error: true },
            { id: '5', text_fr: 'Jeunes formés par Aziz', is_error: true },
            { id: '6', text_fr: 'Femmes actives Aicha', is_error: true },
            { id: '7', text_fr: 'Station Nadia récupère lagune', is_error: true },
            { id: '8', text_fr: 'Filets sélectifs adoptés', is_error: true },
            { id: '9', text_fr: 'Vent prévisible 95%', is_error: true },
            { id: '10', text_fr: 'ROI 5 ans', is_error: true }
          ]
        },
        {
          type: 'Texte à trous',
          q: '10 commandements du maître.',
          options: [
            { id: '1', text: 'calme' }, { id: '2', text: 'intuition' }, { id: '3', text: 'systèmes' },
            { id: '4', text: 'parties prenantes' }, { id: '5', text: 'création' }, { id: '6', text: 'adaptation' },
            { id: '7', text: 'silence' }, { id: '8', text: 'présence' }, { id: '9', text: 'confiance' },
            { id: '10', text: 'humour' }
          ],
          correct: 'calme, intuition, systèmes, parties prenantes, création, adaptation, silence, présence, confiance, humour'
        },
        {
          type: 'Dialogue de situation',
          q: 'Discours de clôture final.',
          options: [
            { id: 'A', label_fr: 'Bref' },
            { id: 'B', label_fr: 'Synthèse 6 villes, remerciements mentors, promesse transmission.' }
          ],
          correct: 'B'
        },
        {
          type: 'Contre-la-montre',
          q: 'Flash-back 6 villes.',
          steps: [
            { question: 'Rabat ?', responses: [{id:'A', text:'Stress aigu'}], correct: 'A' },
            { question: 'Chefchaouen ?', responses: [{id:'A', text:'STOP'}], correct: 'A' },
            { question: 'Fès ?', responses: [{id:'A', text:'Systémique'}], correct: 'A' },
            { question: 'Marrakech ?', responses: [{id:'A', text:'Évaluation'}], correct: 'A' },
            { question: 'Laâyoune ?', responses: [{id:'A', text:'Frugale'}], correct: 'A' },
            { question: 'Dakhla ?', responses: [{id:'A', text:'Maîtrise'}], correct: 'A' }
          ]
        },
        {
          type: 'Classement',
          q: 'Les 6 niveaux de Bloom.',
          order: [
            { id: '1', label_fr: 'Connaître' },
            { id: '2', label_fr: 'Appliquer' },
            { id: '3', label_fr: 'Analyser' },
            { id: '4', label_fr: 'Évaluer' },
            { id: '5', label_fr: 'Créer' },
            { id: '6', label_fr: 'Maîtriser' }
          ]
        },
        {
          type: 'Réponse courte',
          q: 'Lettre au père : bilan final.',
          pos: 'Émotionnel et professionnel.'
        },
        {
          type: 'Énigme',
          q: '« Fruit de 6 arbres... Qui suis-je ? »',
          options: [{id:'A', label_fr:'La compétence'}, {id:'B', label_fr:'Le voyage'}],
          correct: 'A'
        }
      ]
    }
  ]
};

async function importDakhla() {
  console.log('🚀 Starting Dakhla FINAL import...');

  // 1. City / Challenge
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert(DAKHLA_DATA.city);
  
  if (cityErr) {
    console.error('❌ City Error:', cityErr);
    return;
  }
  console.log('✅ City Dakhla Upserted');

  // 2. Missions and Questions
  for (const mData of DAKHLA_DATA.missions) {
    const missionId = MISSION_IDS[mData.id];
    
    const { error: missErr } = await supabase
      .from('missions')
      .upsert({
        id: missionId,
        city_id: DAKHLA_CHALLENGE_PK,
        challenge_id: DAKHLA_CHALLENGE_PK,
        title_fr: mData.title,
        description_fr: mData.description,
        sort_order: parseInt(mData.id.substring(1)),
        mission_type: 'scenario',
        xp_reward: 100,
        is_published: true
      });

    if (missErr) {
      console.error(`❌ Mission ${mData.id} Error:`, missErr);
      continue;
    }
    console.log(`✅ Mission ${mData.id} Upserted`);

    // Clean existing questions
    await supabase.from('questions').delete().eq('mission_id', missionId);

    const questionsToInsert = mData.questions.map((q, i) => {
      const dbType = TYPE_MAPPING[q.type] || 'qcm';
      
      let finalOptions = q.options;
      if (q.type === 'Scénario en cascade' || q.type === 'Contre-la-montre') {
        finalOptions = { steps: q.steps };
      } else if (q.type === 'Détection d’erreurs') {
        finalOptions = q.errors;
      } else if (q.type === 'Classement') {
        finalOptions = q.order;
      }

      return {
        mission_id: missionId,
        question_fr: q.q,
        question_type: dbType,
        options: finalOptions,
        correct_answer: q.correct || '',
        feedback_positive_fr: q.pos || 'Excellent !',
        feedback_negative_fr: q.neg || 'Pas tout à fait.',
        explanation_fr: q.pos || '',
        sort_order: i + 1,
        xp_reward: 20,
        is_published: true,
        time_limit_sec: 45,
        score_decision: 10,
        score_equipe: 10,
        score_stress: 10
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`❌ Questions Error (Mission ${mData.id}):`, qErr);
    } else {
      console.log(`✅ ${questionsToInsert.length} questions inserted for ${mData.id}`);
    }
  }

  console.log('🏁 Import Dakhla Terminée !');
}

importDakhla();
