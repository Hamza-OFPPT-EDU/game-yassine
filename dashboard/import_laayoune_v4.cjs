require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  'Création': 'short_answer',
  'Dialogue créatif': 'scenario_dialogue',
  'Détection + création': 'error_detection',
  'QCM créatif': 'qcm',
  'Création stratégique': 'short_answer',
  'Énigme ultime': 'puzzle_riddle',
  'Vrai/Faux créatif': 'vrai_faux',
  'Prise de décision créative': 'scenario_decision',
  'Contre-la-montre créatif': 'time_attack',
  'Classement créatif': 'ranking'
};

async function importLaayoune() {
  console.log('🚀 Starting Laâyoune (Acte V) import v4...');

  // 1. Upsert City (Challenge)
  const cityDescription = `# 🐪 ACTE V - LAÂYOUNE : PORTE DU DÉSERT

## 📖 Brief narratif
Ishaq crée des protocoles d’urgence, une coopérative, une santé décentralisée, des innovations frugales et un plan de développement.

---

## 🏙️ Page de présentation de Laâyoune

### 🎯 Ce que vous allez apprendre dans cette ville
Laâyoune, porte du désert, vous invite à **créer** là où rien n’existe. Ici, pas de manuels, pas de protocoles tout faits, pas de solutions toutes prêtes. Vous allez inventer des réponses originales à des problèmes inédits, avec des ressources limitées.

### 📋 Les 5 missions

| Mission | Lieu | Soft skill dominant |
|---------|------|---------------------|
| L1 | Base de protection civile | Gestion du stress (création) |
| L2 | Coopérative de femmes | Travail en équipe (création) |
| L3 | Dispensaire mobile | Prise de décision (création en isolement) |
| L4 | Ferme solaire | Innovation frugale |
| L5 | Wilaya | Synthèse créative |

### 🧠 Compétences clés de cette ville
- Créer un protocole d’urgence sans modèle existant
- Inventer une gouvernance communautaire adaptée
- Concevoir une formation pour personnes analphabètes
- Créer un système de santé décentralisé
- Innover avec des ressources minimales (frugalité)
- Élaborer une vision stratégique provinciale
- Défendre une création face à l’opposition
- Transformer chaque contrainte en opportunité
- Maîtriser la pensée design (Design Thinking)
- Produire du nouveau par combinaison d’existants`;

  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: LAAYOUNE_CHALLENGE_PK,
    city_id: 'laayoune',
    city_name_fr: 'Laâyoune',
    city_name_ar: 'العيون',
    headline_fr: `🐪 ACTE V - LAÂYOUNE : PORTE DU DÉSERT`,
    description_fr: cityDescription,
    sort_order: 5,
    is_published: true,
    city_color: '#f59e0b',
    icon_name: 'sun'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Laâyoune upserted');

  const missionsData = [
    {
      id: MISSION_IDS.L1,
      title_fr: 'Mission L1 : La Base du Désert',
      description_fr: `Lieu: Base de protection civile. Soft skill: Gestion du stress (création). Créer un protocole d’urgence sans modèle existant.`,
      questions: [
        {
          type: 'Création',
          q: `Tempête de sable, village isolé (200 pers., plus d’eau depuis 48h). Créez un plan d’intervention en 5 étapes.`,
          options: [
            { id: 'A', label_fr: 'Attendre la fin de la tempête' },
            { id: 'B', label_fr: 'Envoyer un seul véhicule immédiatement' },
            { id: 'C', label_fr: '1) Communication, 2) Préparation, 3) Départ accalmie, 4) Triage, 5) Suivi' }
          ],
          correct: 'C',
          pos: `Création géniale ! Redondance, fenêtre d’opportunité, triage, documentation.`,
          neg: `Attendre = mort. Un seul véhicule = risque de perte. Votre plan doit être robuste.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion de la panne véhicule.`,
          options: {
            steps: [
              {
                question: `Véhicule principal en panne à mi-chemin. Créez une solution.`,
                responses: [
                  { id: 'A', text: 'Attendre un mécanicien' },
                  { id: 'B', text: 'Faire demi-tour' },
                  { id: 'C', text: 'Transférer l’eau dans le véhicule fonctionnel. Le conducteur reste avec radio (relais).' }
                ],
                correct: 'C',
                pos: `Innovation frugale ! Le véhicule en panne devient station radio fixe.`,
                neg: `Attendre un mécanicien ou faire demi-tour perd trop de temps.`
              },
              {
                question: `Village atteint, 15 personnes critiques, 900L d’eau. Créez un plan de distribution.`,
                responses: [
                  { id: 'A', text: 'Distribuer également à tous' },
                  { id: 'B', text: 'Niveau 1 (15 critiques) : 10L + sels ; Niveau 2 (60 fragiles) : 6L ; Niveau 3 (125 stables) : 3L.' },
                  { id: 'C', text: 'Tout donner aux malades' }
                ],
                correct: 'B',
                pos: `Équité proportionnelle aux besoins. Pas d’égalitarisme simple.`,
                neg: `Distribuer également ou tout aux malades est injuste ou dangereux.`
              },
              {
                question: `Tempête finie. Évacuer ou ravitailler sur place ?`,
                responses: [
                  { id: 'A', text: 'Tout évacuer' },
                  { id: 'B', text: 'Tout ravitailler sur place' },
                  { id: 'C', text: 'Évacuer les 15 critiques, ravitailler les 185 autres sur place, installer radio temporaire.' }
                ],
                correct: 'C',
                pos: `Solution hybride. Le meilleur des deux mondes.`,
                neg: `Tout évacuer est lourd, tout ravitailler laisse les critiques en danger.`
              }
            ]
          }
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 8 piliers de résilience adaptés au désert.`,
          options: [
            { text: 'chameau' }, { text: 'tribu' }, { text: 'vent' }, { text: 'soleil' }, { text: 'sable' }, { text: 'oasis' }, { text: 'étoiles' }, { text: 'silence' }
          ],
          correct: 'chameau, tribu, vent, soleil, sable, oasis, étoiles, silence',
          pos: `Création poétique et scientifique ! Chaque métaphore est juste.`,
          neg: `Révisez : chameau=sens, tribu=relations, vent=humour, soleil=corps, sable=apprentissage, oasis=créativité, étoiles=espoir, silence=spiritualité.`
        },
        {
          type: 'Contre-la-montre créatif',
          q: `Urgences en base isolée.`,
          options: {
            steps: [
              {
                question: `Radio cassée, base à 40 km. Créez une solution.`,
                responses: [{id:'A',text:'Envoyer quelqu\'un à pied'},{id:'B',text:'Signal visuel : feu + tissu mouillé = colonne de fumée. 1 fumée = OK, 3 = urgence.'}],
                correct: 'B',
                pos: `Ingénieux ! La fumée visible à 40 km par temps clair.`,
                neg: `Envoyer quelqu’un à pied (8h) ou attendre est trop long.`
              },
              {
                question: `Eau contaminée par le sable. Créez un filtre.`,
                responses: [{id:'A',text:'Bouteille coupée + tissu + charbon + sable + gravier, puis bouillir.'},{id:'B',text:'Boire l\'eau sale'}],
                correct: 'A',
                pos: `Filtre de survie efficace. Le charbon absorbe les toxines.`,
                neg: `Boire l’eau sale ou ne pas boire est dangereux.`
              },
              {
                question: `Membre en état de choc. Créez un protocole.`,
                responses: [{id:'A',text:'« Sois fort »'},{id:'B',text:'Protocole PAIR : Pause, Accompagnement silencieux, Invitation à parler, Retour progressif.'}],
                correct: 'B',
                pos: `Acronyme mémorisable, inspiré de Rogers et Cyrulnik.`,
                neg: `« Sois fort » ou l’envoyer à l’hôpital (200 km) sont inadaptés.`
              },
              {
                question: `Équipe épuisée après 20h. Créez un discours de 3 phrases.`,
                responses: [{id:'A',text:'« C’est un ordre »'},{id:'C',text:'« On a sauvé 200 vies. Personne d’autre n’aurait pu. Encore 2h, puis 24h de repos. »'}],
                correct: 'C',
                pos: `Sens, compétence, affiliation, espoir. SDT parfaite.`,
                neg: `« C’est un ordre » ou « partez si vous êtes fatigués » démobilise.`
              }
            ]
          }
        },
        {
          type: 'Détection d’erreurs + création',
          q: `Trouvez les 8 erreurs du plan d’évacuation V1.0 et créez le V2.0.`,
          options: [
            { text_fr: 'Départ 12h (chaleur)', is_error: true },
            { text_fr: 'GPS seul (pas de backup)', is_error: true },
            { text_fr: '1 seul véhicule', is_error: true },
            { text_fr: 'Téléphone seul (pas de sat)', is_error: true },
            { text_fr: '500ml eau/pers (insiffisant)', is_error: true },
            { text_fr: 'Retour même jour (pas de bivouac)', is_error: true },
            { text_fr: '« On improvisera » (pas de plan B)', is_error: true },
            { text_fr: 'Aucune formation préalable', is_error: true },
            { text_fr: 'Sécurité incendie présente', is_error: false }
          ],
          pos: `Transformation créative. V2 résilient à multi-couches.`,
          neg: `Relisez chaque erreur : heure, backup, redondance, comm, eau, bivouac, plans B/C, formation.`
        },
        {
          type: 'Vrai/Faux créatif',
          q: `Affirmations sur l'innovation et le leadership.`,
          options: [
            { text: `« L’innovation naît de l’abondance de ressources. »`, correct: 'faux', pos: `L’innovation frugale naît de la contrainte. Moins tu as, plus tu crées.`, neg: `Le manque est un moteur. Voir Jugaad Innovation.` },
            { text: `« Un bon leader au désert ne montre jamais sa peur. »`, correct: 'faux', pos: `Un leader reconnaît sa peur et agit malgré elle. Le courage n’est pas l’absence de peur.`, neg: `Nier la peur mène à des décisions suicidaires.` },
            { text: `« Créer, c’est inventer à partir de rien. »`, correct: 'faux', pos: `Créer = recombiner des éléments existants de façon nouvelle (Steve Jobs).`, neg: `Rien ne naît de rien. La créativité recycle et connecte.` }
          ]
        },
        {
          type: 'Dialogue créatif',
          q: `Youssef (24 ans) revient de récupération de corps, tremble, ne parle pas. Créez un protocole psychologique adapté.`,
          options: [
            { id: 'A', label_fr: '« Sois fort »' },
            { id: 'B', label_fr: '« Un psy t’attend à 200 km »' },
            { id: 'C', label_fr: 'Protocole PAIR : Protéger (tente calme), Accueillir (silence), Inviter, Réintégrer. Suivi 48h.' }
          ],
          correct: 'C',
          pos: `Création originale et utile. Ce protocole pourrait être réellement utilisé.`,
          neg: `« Sois fort » ou l’éloigner ne sont pas des solutions immédiates.`
        },
        {
          type: 'Classement créatif',
          q: `Créez votre propre hiérarchie de survie au désert (8 éléments).`,
          options: [
            { label_fr: 'Abri (ombre)' },
            { label_fr: 'Eau' },
            { label_fr: 'Secours (soins)' },
            { label_fr: 'Communication' },
            { label_fr: 'Orientation' },
            { label_fr: 'Signalisation' },
            { label_fr: 'Moral' },
            { label_fr: 'Nourriture' }
          ],
          pos: `Pyramide contextuelle. Pas copie de Maslow, adaptation au désert (Eau > Nourriture).`,
          neg: `L’ombre et l’eau passent avant la nourriture (30 jours sans manger, 48h sans eau).`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez l’introduction d’un manuel de survie psychologique (150-200 mots).`,
          pos: `Création littéraire et technique. Un document publiable incluant STOP, 4-7-8, PAIR.`,
          neg: `Il manque des outils concrets de régulation émotionnelle.`
        },
        {
          type: 'Énigme',
          q: `« Dans l’abondance je me cache, dans le vide je me révèle. Quand tu n’as rien, je suis ta seule arme… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La créativité' },
            { id: 'B', label_fr: 'L’ingéniosité' },
            { id: 'C', label_fr: 'L’intelligence' },
            { id: 'D', label_fr: 'La débrouillardise' }
          ],
          correct: 'B',
          pos: `L’ingéniosité naît du manque. Le désert t’a révélé cette force.`,
          neg: `Relisez : « Ishaq l’a découverte à Rabat, mais c’est au désert qu’il l’a créée. » = ingéniosité.`
        }
      ]
    },
    {
      id: MISSION_IDS.L2,
      title_fr: 'Mission L2 : Coopérative de femmes',
      description_fr: `Lieu: Coopérative de femmes. Soft skill: Travail en équipe (création). Inventer une gouvernance communautaire adaptée.`,
      questions: [
        {
          type: 'QCM créatif',
          q: `Créez un modèle de gouvernance pour 25 femmes (80% analphabètes, culture de consensus).`,
          options: [
            { id: 'A', label_fr: 'Démocratie pure (1 personne = 1 vote)' },
            { id: 'B', label_fr: 'Hiérarchie militaire (Aicha décide tout)' },
            { id: 'C', label_fr: 'Modèle hybride : 3 cercles (Aînées/Strat, Exp/Tact, Nouv/Op). Rotation 6 mois.' }
          ],
          correct: 'C',
          pos: `Création de gouvernance originale ! Respect culturel + progression + autonomie.`,
          neg: `Vote égalitaire ignore l’expertise. Autocratie tue la motivation.`
        },
        {
          type: 'Scénario en cascade',
          q: `Formation et intégration des membres.`,
          options: {
            steps: [
              {
                question: `5 nouvelles analphabètes. Créez la semaine 1 de formation.`,
                responses: [
                  { id: 'A', text: 'Cours théoriques' },
                  { id: 'B', text: 'Manuels écrits' },
                  { id: 'C', text: 'J1-2 : observation ; J3-4 : tâches simples avec tutrice ; J5 : création d’un objet personnel.' }
                ],
                correct: 'C',
                pos: `Pédagogie sans écrit. Observation, guidage, production personnelle.`,
                neg: `Cours théoriques ou manuels sont inadaptés à l’analphabétisme.`
              },
              {
                question: `Semaine 2 : apprendre à travailler ensemble.`,
                responses: [
                  { id: 'A', text: 'Travail solo' },
                  { id: 'B', text: 'J6-7 : binômes (Nouv+Exp) ; J8-9 : mini-équipe (3 pers) ; J10 : célébration collective.' }
                ],
                correct: 'B',
                pos: `Progression naturelle : duo, trio, célébration collective.`,
                neg: `Passer trop vite à l’équipe sans binôme est brutal.`
              },
              {
                question: `Système de suivi post-formation sans écrit.`,
                responses: [
                  { id: 'A', text: 'Rapports oraux' },
                  { id: 'B', text: 'Examen pratique' },
                  { id: 'C', text: 'Tableau mural avec couleurs (Rouge/Jaune/Vert). Autocollants déplacés par chacune.' }
                ],
                correct: 'C',
                pos: `Suivi visuel inclusif. Les vertes deviennent tutrices des rouges.`,
                neg: `Un suivi écrit est exclu. Les couleurs sont universelles.`
              }
            ]
          }
        },
        {
          type: 'Dialogue créatif',
          q: `2 femmes de tribus rivales refusent de travailler ensemble (conflit ancestral). Créez une approche nouvelle.`,
          options: [
            { id: 'A', label_fr: 'Les séparer' },
            { id: 'B', label_fr: 'Médiation directe traditionnelle' },
            { id: 'C', label_fr: 'Stratégie « Le Pont » : Projet commun irrésistible (savoir-faire mixé) + but supra-ordonné.' }
          ],
          correct: 'C',
          pos: `Inspiration de Sherif (Robber’s Cave). Objectif supra-ordonné.`,
          neg: `La parole directe échoue souvent sur les traumatismes ancestraux.`
        },
        {
          type: 'Texte à trous',
          q: `Créez les 8 articles d’une charte adaptée au contexte sahraoui (oral, visuel).`,
          options: [
            { text: 'respect' }, { text: 'consensus' }, { text: 'rotation' }, { text: 'partage' }, { text: 'pairs' }, { text: 'aînées' }, { text: 'célébration' }, { text: 'transmission' }
          ],
          correct: 'respect, consensus, rotation, partage, pairs, aînées, célébration, transmission',
          pos: `Charte vivante, orale, respectueuse des valeurs locales.`,
          neg: `Retenez : respect, consensus, rotation, partage 50/50, formation pairs, médiation aînées.`
        },
        {
          type: 'Détection + création',
          q: `Trouvez 6 faiblesses stratégiques et créez un plan marketing innovant.`,
          options: [
            { text_fr: 'Zéro digital (créer Instagram jeunes)', is_error: true },
            { text_fr: '1 seul client (prospecter 3 nouveaux)', is_error: true },
            { text_fr: 'Prix trop bas (repositionner premium)', is_error: true },
            { text_fr: 'Pas de packaging (créer étuis paille)', is_error: true },
            { text_fr: 'Vente locale seule (e-commerce)', is_error: true },
            { text_fr: 'Pas de storytelling (vidéos portraits)', is_error: true },
            { text_fr: 'Qualité artisanale certifiée', is_error: false }
          ],
          pos: `Analyse créative. Les solutions transforment les faiblesses en forces.`,
          neg: `Ne vous contentez pas de critiquer. Proposez des solutions réalisables.`
        },
        {
          type: 'Scénario en cascade',
          q: `Création du programme de mentorat.`,
          options: {
            steps: [
              {
                question: `Créez les critères de sélection des mentores.`,
                responses: [
                  { id: 'A', text: 'Meilleures tisseuses seulement' },
                  { id: 'B', text: 'Expérience (2 ans), patience, bienveillance, capacité à expliquer sans écrire.' }
                ],
                correct: 'B',
                pos: `Critères pertinents. La compétence technique ne suffit pas au mentorat.`,
                neg: `Ne négligez pas les qualités relationnelles et pédagogiques.`
              },
              {
                question: `Créez le programme de mentorat (6 mois).`,
                responses: [
                  { id: 'A', text: 'Apprentissage solo' },
                  { id: 'B', text: 'M1-2 : observation ; M3-4 : production supervisée ; M5-6 : production indépendante.' }
                ],
                correct: 'B',
                pos: `Progression graduée, feedback oral, autonomie croissante.`,
                neg: `Un programme trop court ou sans progression est inefficace.`
              },
              {
                question: `Système d’évaluation du mentorat (sans écrit).`,
                responses: [
                  { id: 'A', text: 'Examen final' },
                  { id: 'B', text: 'Rencontre mensuelle orale + évaluation collective par les paires devant le cercle.' }
                ],
                correct: 'B',
                pos: `Oral, collectif, constructif. Pas de paperasse.`,
                neg: `L’écrit exclut les membres. Privilégiez la parole.`
              }
            ]
          }
        },
        {
          type: 'Contre-la-montre créatif',
          q: `Crises en coopérative.`,
          options: {
            steps: [
              {
                question: `Perte du client principal (50% revenus). Solution ?`,
                responses: [{id:'A',text:'Paniquer'},{id:'B',text:'Contacter 10 anciens, offre parrainage, campagne locale.'}],
                correct: 'B',
                pos: `Réaction rapide et pragmatique. Diversification.`,
                neg: `Baisser les prix ou paniquer est contre-productif.`
              },
              {
                question: `Sécheresse affecte la production de cactus. Solution ?`,
                responses: [{id:'A',text:'Attendre'},{id:'B',text:'Récupérer pluie, goutte-à-goutte solaire (frugal), diversifier plantes.'}],
                correct: 'B',
                pos: `Innovation frugale et proactive.`,
                neg: `Subir sans agir condamne la production.`
              },
              {
                question: `Une membre tombe malade (longue durée). Solution ?`,
                responses: [{id:'A',text:'La remplacer'},{id:'B',text:'Répartir tâches entre 24 autres, salaire partiel, visites.'}],
                correct: 'B',
                pos: `Solidarité organisationnelle. La coopérative protège ses membres.`,
                neg: `La laisser tomber détruit la confiance collective.`
              },
              {
                question: `Concurrence industrielle (prix -70%). Solution ?`,
                responses: [{id:'A',text:'Baisser les prix'},{id:'B',text:'Miser sur authenticité « fait main », certification, storytelling.'}],
                correct: 'B',
                pos: `Différenciation par la valeur, pas par le prix.`,
                neg: `Baisser les prix pour rivaliser est suicidaire.`
              }
            ]
          }
        },
        {
          type: 'Classement créatif',
          q: `Créez un plan de développement (25 à 100 femmes en 5 ans).`,
          options: [
            { label_fr: 'Stabiliser modèle (6 mois)' },
            { label_fr: 'Former 5 mentores (1 an)' },
            { label_fr: 'Ouvrir 2ème atelier (1 an)' },
            { label_fr: 'Recruter 20 nouvelles (1 an)' },
            { label_fr: 'Lancer e-commerce (6 mois)' },
            { label_fr: 'Partenariat hôtels (6 mois)' },
            { label_fr: 'Essaimage village voisin (6 mois)' }
          ],
          pos: `Croissance réaliste, progressive, sans perdre l’âme.`,
          neg: `Une croissance trop rapide tuerait la qualité et la cohésion.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez une lettre d’accueil pour les nouvelles membres (orale, lue à voix haute) – 150-200 mots.`,
          pos: `Lettre puissante, simple, fraternelle. Parfaite pour une lecture orale.`,
          neg: `Trop longue ou trop écrite. Soyez sobre et chaleureux.`
        },
        {
          type: 'Énigme',
          q: `« Je ne suis pas donnée, je suis construite. 25 mains me tissent, 25 voix me chantent… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La tribu' },
            { id: 'B', label_fr: 'La communauté' },
            { id: 'C', label_fr: 'La coopérative' },
            { id: 'D', label_fr: 'La famille' }
          ],
          correct: 'B',
          pos: `La communauté se crée grain par grain, comme un collier d’ambre.`,
          neg: `Relisez : « Avant Aicha il n’y avait que du sable. » = communauté.`
        }
      ]
    },
    {
      id: MISSION_IDS.L3,
      title_fr: 'Mission L3 : Le Médecin du Désert',
      description_fr: `Lieu: Dispensaire mobile. Soft skill: Prise de décision (création en isolement). Créer un système de santé décentralisé.`,
      questions: [
        {
          type: 'Prise de décision créative',
          q: `30 patients, triage sans technologie. Créez un système visuel rapide.`,
          options: [
            { id: 'A', label_fr: 'Premier arrivé premier servi' },
            { id: 'B', label_fr: 'Triage « 3 couleurs » : Rouge (urgent/immédiat), Jaune (1h), Vert (attendre). Rubans au poignet.' }
          ],
          correct: 'B',
          pos: `Simple, visuel, rapide (30 sec/patient), transparent.`,
          neg: `L’ordre d’arrivée ignore l’urgence. Les couleurs sauvent des vies.`
        },
        {
          type: 'Scénario en cascade',
          q: `Diagnostic et stabilisation en isolement.`,
          options: {
            steps: [
              {
                question: `Douleur abdominale (35 ans). Créez 5 questions de diagnostic.`,
                responses: [
                  { id: 'A', text: 'Vagues' },
                  { id: 'B', text: '1) Où ? 2) Depuis quand ? 3) Alimentation ? 4) Fièvre/Nausées/Sang ? 5) Déjà eu ?' }
                ],
                correct: 'B',
                pos: `Protocole « 5Q » efficace sans instruments.`,
                neg: `Une question manquante peut faire rater un diagnostic vital.`
              },
              {
                question: `Bas droite, 48h, fièvre 38.5, nausées. Diagnostic ?`,
                responses: [
                  { id: 'A', text: 'Attendre' },
                  { id: 'B', text: 'Appendicite. Plan : À jeun, antidouleur, évacuation urgente (200 km), appel satellite.' }
                ],
                correct: 'B',
                pos: `Diagnostic différentiel juste. Plan d’action complet.`,
                neg: `Attendre ou donner à manger aggraverait l’urgence.`
              },
              {
                question: `Route coupée, hélico dans 4h. Plan de stabilisation ?`,
                responses: [
                  { id: 'A', text: 'Attente passive' },
                  { id: 'B', text: '0-1h : semi-assis, rien oral ; 1-2h : IV/antibio ; 2-4h : surveillance, civière, signal fumée.' }
                ],
                correct: 'B',
                pos: `Stabilisation en milieu extrême. Chaque heure programmée.`,
                neg: `L’improvisation ou l’attente passive est dangereuse.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Créez un programme pour former 10 agents de santé villageois (<500 DH).`,
          options: [
            { left_fr: 'Profil', right_fr: 'Respecté, bilingue, motivé' },
            { left_fr: 'Formation (5 jours)', right_fr: 'Triage, secours, hygiène, simulation' },
            { left_fr: 'Kit matériel', right_fr: 'Rubans, thermomètre, sels, radio' }
          ],
          pos: `Système de santé décentralisé, économique, durable.`,
          neg: `Une formation académique ou un kit trop cher serait inapplicable.`
        },
        {
          type: 'Dialogue créatif',
          q: `Internet intermittent, pas de visio. Créez un système de consultation à distance.`,
          options: [
            { id: 'A', label_fr: 'Attendre connexion' },
            { id: 'B', label_fr: 'SMS protocole (signes + 5Q) + Photos + Appel vocal local + Protocole réponse écrit.' }
          ],
          correct: 'B',
          pos: `Frugal et efficace. La télémédecine low-tech est possible.`,
          neg: `Attendre une connexion parfaite laisse les malades sans soins.`
        },
        {
          type: 'Texte à trous',
          q: `Créez un code de 8 principes pour le médecin isolé.`,
          options: [
            { text: 'nuire' }, { text: 'traiter' }, { text: 'consentement' }, { text: 'limites' }, { text: 'documenter' }, { text: 'vulnérables' }, { text: 'santé' }, { text: 'espoir' }
          ],
          correct: 'nuire, traiter, consentement, limites, documenter, vulnérables, santé, espoir',
          pos: `Principes solides pour l’extrême isolement.`,
          neg: `Retenez : Primum non nocere, traiter/référer, consentement oral, limites, docu, vulnérables, auto-santé.`
        },
        {
          type: 'Détection + création',
          q: `Trouvez 6 faiblesses du système et créez des solutions innovantes.`,
          options: [
            { text_fr: 'Absence radio (relais)', is_error: true },
            { text_fr: 'Pas de stock meds (pharmacie comm)', is_error: true },
            { text_fr: 'Manque formation (agents villageois)', is_error: true },
            { text_fr: 'Délais évacuation (points héliportés)', is_error: true },
            { text_fr: 'Isolement psy (soutien pairs)', is_error: true },
            { text_fr: 'Pas de dossier (carnet visuel)', is_error: true },
            { text_fr: 'Hôpital à 200km', is_error: false }
          ],
          pos: `Chaque faiblesse se transforme en opportunité organisationnelle.`,
          neg: `Ne vous arrêtez pas au constat, proposez des solutions.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion d'épidémie sans murs.`,
          options: {
            steps: [
              {
                question: `Créez un protocole de confinement sans murs.`,
                responses: [
                  { id: 'A', text: 'Confinement strict ville' },
                  { id: 'B', text: 'Distanciation famille, points eau désinfectés, masques tissu, isolement bâtiment commun.' }
                ],
                correct: 'B',
                pos: `Confinement souple adapté au contexte nomade.`,
                neg: `Un confinement strict type « ville » est impossible.`
              },
              {
                question: `Créez un système de communication d’alerte.`,
                responses: [
                  { id: 'A', text: 'Internet' },
                  { id: 'B', text: 'Chaîne : Médecin → Chef village → Familles. Drap rouge pour cas suspects.' }
                ],
                correct: 'B',
                pos: `Communication low-tech, rapide, fiable.`,
                neg: `Attendre un réseau internet est illusoire.`
              },
              {
                question: `Créez un plan de ravitaillement sans route.`,
                responses: [
                  { id: 'A', text: 'Attendre' },
                  { id: 'B', text: 'Dépôt vivres/meds par moto-crotte à un point de rendez-vous (tour de rôle).' }
                ],
                correct: 'B',
                pos: `Organisation logistique adaptée au terrain.`,
                neg: `L’arrêt des routes ne doit pas arrêter l’aide.`
              }
            ]
          }
        },
        {
          type: 'Contre-la-montre créatif',
          q: `Innovations médicales express.`,
          options: {
            steps: [
              {
                question: `Créez un brancard de fortune.`,
                responses: [{id:'A',text:'Porter à bras'},{id:'B',text:'2 perches + couverture/veste attachée.'}],
                correct: 'B',
                pos: `Frugal et efficace.`,
                neg: `Risque de fatigue et chute.`
              },
              {
                question: `Créez un stérilisateur solaire.`,
                responses: [{id:'A',text:'Boîte métal noire + verre + 4h soleil.'},{id:'B',text:'Bouillir au bois rare'}],
                correct: 'A',
                pos: `Zéro énergie, zéro combustible.`,
                neg: `L’infection secondaire tue sans stérilisation.`
              },
              {
                question: `Créez une attelle improvisée.`,
                responses: [{id:'A',text:'Rien'},{id:'B',text:'Branche droite + tissu enroulé.'}],
                correct: 'B',
                pos: `Immobilisation correcte.`,
                neg: `Risque d'aggravation fracture.`
              },
              {
                question: `Créez un signal SOS visuel.`,
                responses: [{id:'A',text:'Crier'},{id:'B',text:'Tissu rouge/blanc triangle (3 pts) ou miroir soleil.'}],
                correct: 'B',
                pos: `Repérable par avion à plusieurs km.`,
                neg: `Crier est peu visible de haut.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Créez une vision « Santé Sahara 2030 » (200 mots).`,
          pos: `Vision intégrative (Tech/Trad/Comm), inspirante et réaliste.`,
          neg: `Il manque un des trois piliers (technologie, tradition, communauté).`
        },
        {
          type: 'Énigme',
          q: `« Je guéris sans hôpital, mon seul outil : l’écoute… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La présence' },
            { id: 'B', label_fr: 'La médecine humaine' },
            { id: 'C', label_fr: 'L’empathie' },
            { id: 'D', label_fr: 'La compassion' }
          ],
          correct: 'B',
          pos: `La médecine humaine est l’essence du soin quand la technique manque.`,
          neg: `Relisez : « Dr. Karim l’a en abondance, Dr. Mourad en solitude. » = médecine humaine.`
        }
      ]
    },
    {
      id: MISSION_IDS.L4,
      title_fr: 'Mission L4 : La Ferme Solaire',
      description_fr: `Lieu: Ferme solaire. Soft skill: Innovation frugale. Innover avec des ressources minimales.`,
      questions: [
        {
          type: 'Prise de décision créative',
          q: `Village sans eau potable, 50k DH. Créez un système solaire.`,
          options: [
            { id: 'A', label_fr: 'Moto-pompe essence' },
            { id: 'B', label_fr: 'Camions-citernes' },
            { id: 'C', label_fr: 'Pompe solaire (20k) + Réservoir (15k) + Gravité (10k) + Maintenance (5k).' }
          ],
          correct: 'C',
          pos: `Frugal, durable, sans carburant, entretien local.`,
          neg: `Les solutions fossiles ou logistiques sont non durables.`
        },
        {
          type: 'Scénario en cascade',
          q: `Panne et gestion des ressources.`,
          options: {
            steps: [
              {
                question: `Panne solaire pleine chaleur. Diagnostic sans outils ?`,
                responses: [
                  { id: 'A', text: 'Attendre technicien' },
                  { id: 'B', text: 'Visuel (connexions), Propreté (sable), État batterie, Sentir les surtensions.' }
                ],
                correct: 'B',
                pos: `Diagnostic low-tech efficace.`,
                neg: `L’attente laisse le village sans eau.`
              },
              {
                question: `Créez un système de backup.`,
                responses: [
                  { id: 'A', text: 'Improviser' },
                  { id: 'B', text: 'Batteries supp, Rationnement (distribution frais), Priorité vitale (boisson).' }
                ],
                correct: 'B',
                pos: `Gestion de crise rationnelle. L’essentiel d’abord.`,
                neg: `L’improvisation sans plan aggrave tout.`
              },
              {
                question: `Plan de communication aux villageois.`,
                responses: [
                  { id: 'A', text: 'Cacher' },
                  { id: 'B', text: 'Annonce orale : 24h rép, 2L/pers, priorité enfants/malades.' }
                ],
                correct: 'B',
                pos: `Transparence, consignes claires, respect.`,
                neg: `Cacher ou mentir crée la panique.`
              }
            ]
          }
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 7 principes d’innovation frugale.`,
          options: [
            { text: 'simplicité' }, { text: 'existant' }, { text: 'zéro' }, { text: 'partagées' }, { text: 'local' }, { text: 'évolutivité' }, { text: 'contexte' }
          ],
          correct: 'simplicité, existant, zéro, partagées, local, évolutivité, contexte',
          pos: `Principes d’innovation frugale maîtrisés.`,
          neg: `Retenez : Simplicité, Existant, Zéro déchet, Partage, Maintenance locale, Évolutivité, Contexte.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Créez l’organigramme d’une startup solaire rurale (100 villages).`,
          options: [
            { left_fr: 'Direction', right_fr: 'CEO (vision)' },
            { left_fr: 'Technique', right_fr: 'CTO (terrain)' },
            { left_fr: 'Contact', right_fr: 'Commercial (villages)' },
            { left_fr: 'Savoir', right_fr: 'Formateur (villageois)' },
            { left_fr: 'Pérennité', right_fr: 'Maintenance local' }
          ],
          pos: `Structure agile adaptée au terrain.`,
          neg: `Trop de hiérarchie = trop de coûts.`
        },
        {
          type: 'Dialogue créatif',
          q: `Le chef refuse le solaire (« sorcellerie »). Stratégie de persuasion ?`,
          options: [
            { id: 'A', label_fr: 'Argumenter technique' },
            { id: 'B', label_fr: 'Démonstration : petit panneau pour mosquée/école. Impliquer notables.' }
          ],
          correct: 'B',
          pos: `Respect des croyances, preuve par l’exemple, implication des leaders.`,
          neg: `Traiter le chef d’ignorant le braque.`
        },
        {
          type: 'Détection + création',
          q: `Sable sur panneaux. 3 solutions innovantes frugales ?`,
          options: [
            { id: 'A', label_fr: 'Nettoyage pro' },
            { id: 'B', label_fr: '1) Brosses vent, 2) Huile végétale (hydrophobe), 3) Inclinaison + vibration.' }
          ],
          correct: 'B',
          pos: `Trois solutions simples, peu coûteuses, testables localement.`,
          neg: `Attendre des pros est impossible ici.`
        },
        {
          type: 'Classement créatif',
          q: `10 villages demandeurs, budget pour 5. Matrice de priorisation ?`,
          options: [
            { label_fr: 'Population (poids 3)' },
            { label_fr: 'Impact femmes/enfants (poids 3)' },
            { label_fr: 'Isolement (poids 2)' },
            { label_fr: 'Activité économique (poids 2)' },
            { label_fr: 'Engagement communautaire (poids 1)' }
          ],
          pos: `Méthode transparente, multicritère, juste.`,
          neg: `Choisir sur un seul critère (ex: pop) serait injuste.`
        },
        {
          type: 'Contre-la-montre',
          q: `Innovations frugales express.`,
          options: {
            steps: [
              {
                question: `Four solaire.`,
                responses: [{id:'A',text:'Carton + alu + vitre + noir. 1-3h.'},{id:'B',text:'Bois rare'}],
                correct: 'A',
                pos: `Zéro énergie, durable.`,
                neg: `Brûler du bois est moins durable.`
              },
              {
                question: `Chargeur téléphone solaire.`,
                responses: [{id:'A',text:'Panneau recyclé (10-20W) + régulateur + USB.'},{id:'B',text:'Batterie jetable'}],
                correct: 'A',
                pos: `Autonomie numérique locale.`,
                neg: `Isole les agents de santé.`
              },
              {
                question: `Réfrigérateur désertique.`,
                responses: [{id:'A',text:'Pots terre + sable mouillé (Zeer). Évaporation.'},{id:'B',text:'Frigo élec'}],
                correct: 'A',
                pos: `Zéro électricité, garde au frais.`,
                neg: `Impossible hors réseau.`
              },
              {
                question: `Éclairage public.`,
                responses: [{id:'A',text:'Panneau 20W + batterie + LED + crépusculaire.'},{id:'B',text:'Kérosène'}],
                correct: 'A',
                pos: `Sécurise la nuit à coût zéro.`,
                neg: `Cher et polluant.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Pitch pour lever 5M DH (électrifier 100 villages) - 200 mots.`,
          pos: `Pitch clair, chiffré, inspirant.`,
          neg: `Trop technique ou trop vague.`
        },
        {
          type: 'Énigme',
          q: `« Je brûle les imprudents mais je nourris les ingénieux… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le feu' },
            { id: 'B', label_fr: 'Le soleil' },
            { id: 'C', label_fr: 'La chaleur' },
            { id: 'D', label_fr: 'L’énergie' }
          ],
          correct: 'B',
          pos: `Le soleil, ressource gratuite et infinie.`,
          neg: `Relisez le thème de la ferme.`
        }
      ]
    },
    {
      id: MISSION_IDS.L5,
      title_fr: 'Mission L5 : Le Plan de Développement',
      description_fr: `Lieu: Wilaya. Soft skill: Synthèse créative. Élaborer une vision stratégique provinciale.`,
      questions: [
        {
          type: 'Création stratégique',
          q: `Créez un plan de développement en 5 axes avec des noms créatifs.`,
          options: [
            { id: 'A', label_fr: 'Plan standard' },
            { id: 'B', label_fr: '1) SOLEIL (Énergie), 2) OASIS (Eau/Agri), 3) CARAVANE (Tourisme), 4) TRIBU (Édu), 5) ÉTOILE (Connectivité).' }
          ],
          correct: 'B',
          pos: `Vision stratégique créative et cohérente.`,
          neg: `Manque d'évocation ou de lien territorial.`
        },
        {
          type: 'Scénario en cascade',
          q: `Défendre et adapter le plan.`,
          options: {
            steps: [
              {
                question: `Budget -50%. Créez une réponse.`,
                responses: [
                  { id: 'A', text: 'Réduire tout' },
                  { id: 'B', text: 'Phasage : Axe SOLEIL + Axe TRIBU (revenus/emplois) financent la suite.' }
                ],
                correct: 'B',
                pos: `Argument économique solide d'autofinancement.`,
                neg: `Baisser le budget sans stratégie tue le projet.`
              },
              {
                question: `Opposant : « Ignore les traditions ». Réponse ?`,
                responses: [
                  { id: 'A', text: 'Nier' },
                  { id: 'B', text: 'CARAVANE valorise culture, TRIBU s’appuie sur structure sociale. On amplifie.' }
                ],
                correct: 'B',
                pos: `Réponse diplomatique et respectueuse.`,
                neg: `S’énerver ou nier est contre-productif.`
              },
              {
                question: `Jeune sans diplôme : « Et moi ? » Réponse ?`,
                responses: [
                  { id: 'A', text: 'Vague' },
                  { id: 'B', text: 'TRIBU te forme (6 mois), SOLEIL t’emploie, ÉTOILE t’incube. Entrepreneur en 2 ans.' }
                ],
                correct: 'B',
                pos: `Parcours personnel, concret, inspirant.`,
                neg: `Réponse générale inefficace.`
              }
            ]
          }
        },
        {
          type: 'Rôles d’équipe',
          q: `Structure de gouvernance du plan.`,
          options: [
            { left_fr: 'Stratégique', right_fr: 'Wali + chefs d’axes' },
            { left_fr: 'Technique', right_fr: 'Comité experts' },
            { left_fr: 'Citoyen', right_fr: 'Représentants élus' },
            { left_fr: 'Fréquence', right_fr: 'Trimestrielle' },
            { left_fr: 'Décision', right_fr: 'Consensus (75%)' }
          ],
          pos: `Gouvernance participative, transparente, légitime.`,
          neg: `Un seul décideur bloquerait le projet.`
        },
        {
          type: 'Détection + création',
          q: `Identifiez 6 risques majeurs et créez un plan de contingence.`,
          options: [
            { text_fr: 'Sécheresse (stockage eau)', is_error: true },
            { text_fr: 'Financement (fonds réserve)', is_error: true },
            { text_fr: 'Résistance locale (médiation)', is_error: true },
            { text_fr: 'Panne tech (maintenance locale)', is_error: true },
            { text_fr: 'Instabilité pol (transparence)', is_error: true },
            { text_fr: 'Urgence sanitaire (kits pré-positionnés)', is_error: true },
            { text_fr: 'Étude d\'impact', is_error: false }
          ],
          pos: `Plan de risques complet. Chaque menace a sa réponse.`,
          neg: `Ignorer un risque c’est l’accepter.`
        },
        {
          type: 'Texte à trous',
          q: `Théorie du changement de l'Axe Soleil.`,
          options: [
            { text: 'inputs' }, { text: 'activités' }, { text: 'outputs' }, { text: 'outcomes' }, { text: 'impact' }
          ],
          correct: 'inputs, activités, outputs, outcomes, impact',
          pos: `Logique stratégique solide : de l'investissement à l'autonomie.`,
          neg: `Retenez : Inputs (50M) → Activités (100 fermes) → Outputs (500 emplois) → Outcomes (facture baisse) → Impact (autonomie).`
        },
        {
          type: 'Dialogue créatif',
          q: `Créez un discours de 5 min pour mobiliser 1 000 habitants (oral).`,
          options: [
            { id: 'A', label_fr: 'Technocratique' },
            { id: 'B', label_fr: '« Le désert devient bénédiction (Soleil/Espace). Projets pilotes, formation, emploi. »' }
          ],
          correct: 'B',
          pos: `Paroles simples, images fortes, bénéfices concrets.`,
          neg: `Un discours froid ne mobilisera pas.`
        },
        {
          type: 'Contre-la-montre',
          q: `5 décisions du Gouverneur.`,
          options: {
            steps: [
              {
                question: `Crue soudaine, village isolé.`,
                responses: [{id:'A',text:'Hélico évac + vivres parachutés + ponton.'},{id:'B',text:'Attendre évaluation'}],
                correct: 'A',
                pos: `Réaction rapide, ciblée, efficace.`,
                neg: `L'attente coûte des vies.`
              },
              {
                question: `Conflit tribus sur un puits.`,
                responses: [{id:'A',text:'Décret'},{id:'B',text:'Chaudière mixte (tribus+experts). Patrouille de paix.'}],
                correct: 'B',
                pos: `Justice participative, pas imposée.`,
                neg: `Envenime le conflit.`
              },
              {
                question: `Ferme crevettes vs Lagune.`,
                responses: [{id:'A',text:'Refuser sauf étude impact irréprochable + compensation.'},{id:'B',text:'Accepter'}],
                correct: 'A',
                pos: `Économie oui, mais pas au prix de l’écologie.`,
                neg: `Détruirait une ressource vitale.`
              },
              {
                question: `Pénurie de profs.`,
                responses: [{id:'A',text:'Former assistants locaux + salaire attractif + logement.'},{id:'B',text:'Recrutement national'}],
                correct: 'A',
                pos: `Solution locale et durable.`,
                neg: `Prendrait des années.`
              },
              {
                question: `Arrivée massive migrants.`,
                responses: [{id:'A',text:'Réquisition tentes prot civile + coordination ONG + aide nat.'},{id:'B',text:'Attendre ordres'}],
                correct: 'A',
                pos: `Urgence humanitaire, action immédiate.`,
                neg: `Inhumain ou passif.`
              }
            ]
          }
        },
        {
          type: 'Classement créatif',
          q: `Créez un calendrier 5 ans (phasage intelligent).`,
          options: [
            { label_fr: 'Année 1 : SOLEIL + TRIBU (énergie+formation)' },
            { label_fr: 'Année 2 : OASIS (eau via énergie)' },
            { label_fr: 'Année 3 : CARAVANE (tourisme via eau)' },
            { label_fr: 'Année 4 : ÉTOILE (connectivité via attraction)' },
            { label_fr: 'Année 5 : Évaluation et ajustement' }
          ],
          pos: `Séquençage logique, chaque axe prépare le suivant.`,
          neg: `Vouloir tout faire à la fois est irréaliste.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez une lettre au Roi (200 mots) synthétisant le plan.`,
          pos: `Lettre respectueuse, claire, ambitieuse, réaliste.`,
          neg: `Inadapté au format ou au destinataire.`
        },
        {
          type: 'Énigme ultime',
          q: `« Là où tout le monde voit du vide, je vois un commencement… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’innovation' },
            { id: 'B', label_fr: 'La créativité' },
            { id: 'C', label_fr: 'L’imagination' },
            { id: 'D', label_fr: 'Le génie' }
          ],
          correct: 'B',
          pos: `La créativité naît de tous les apprentissages précédents. C’est le sommet de Bloom.`,
          neg: `Relisez le thème final : Créer l’inexistant.`
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      city_id: LAAYOUNE_CHALLENGE_PK,
      challenge_id: LAAYOUNE_CHALLENGE_PK,
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

  console.log('🏁 Laâyoune HIGH-FIDELITY v4 import FINISHED!');
}

importLaayoune();
