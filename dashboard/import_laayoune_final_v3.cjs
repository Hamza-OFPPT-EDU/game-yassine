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
  'Création': 'short_answer', // Mapping 'Création' to short_answer or similar
  'Dialogue créatif': 'scenario_dialogue',
  'Détection + création': 'error_detection',
  'QCM créatif': 'qcm',
  'Création stratégique': 'short_answer'
};

async function importLaayoune() {
  console.log('🚀 Starting Laâyoune HIGH-FIDELITY (Acte V) import...');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: LAAYOUNE_CHALLENGE_PK,
    city_id: 'laayoune',
    city_name_fr: 'Laâyoune',
    city_name_ar: 'العيون',
    description_fr: `Laâyoune, porte du désert, vous invite à créer là où rien n’existe. Ici, pas de manuels, pas de protocoles tout faits. Vous allez inventer des réponses originales à des problèmes inédits, avec des ressources limitées.`,
    headline_fr: `🐪 ACTE V - LAÂYOUNE : PORTE DU DÉSERT`,
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
      title_fr: 'Mission L1 : Base de protection civile',
      description_fr: `Gestion du stress (création). Ishaq crée des protocoles d’urgence sous contrainte extrême.`,
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
          q: `Q1: Véhicule principal en panne à mi-chemin. Créez une solution.`,
          options: [
            { id: 'A', label_fr: 'Attendre un mécanicien' },
            { id: 'B', label_fr: 'Faire demi-tour' },
            { id: 'C', label_fr: 'Transférer l’eau dans le véhicule fonctionnel. Le conducteur reste avec radio.' }
          ],
          correct: 'C',
          pos: `Innovation frugale ! Le véhicule en panne devient station radio fixe.`,
          neg: `Perdre du temps est critique ici.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q2: Village atteint, 15 personnes critiques, 900L d’eau. Créez un plan de distribution.`,
          options: [
            { id: 'A', label_fr: 'Distribuer également à tous' },
            { id: 'B', label_fr: 'Niveau 1 (15 critiques): 10L+sels ; Niveau 2 (60 fragiles): 6L ; Niveau 3 (125 stables): 3L.' },
            { id: 'C', label_fr: 'Tout donner aux malades' }
          ],
          correct: 'B',
          pos: `Équité proportionnelle aux besoins. Pas d’égalitarisme simple.`,
          neg: `Distribuer également ou tout aux malades est injuste ou dangereux.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q3: Tempête finie. Évacuer ou ravitailler sur place ?`,
          options: [
            { id: 'A', label_fr: 'Tout évacuer' },
            { id: 'B', label_fr: 'Tout ravitailler sur place' },
            { id: 'C', label_fr: 'Évacuer les 15 critiques, ravitailler les 185 autres, installer radio temporaire.' }
          ],
          correct: 'C',
          pos: `Solution hybride. Le meilleur des deux mondes.`,
          neg: `Tout évacuer est lourd, tout ravitailler laisse les critiques en danger.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 8 piliers de résilience adaptés au désert.`,
          options: [{id:'1',label_fr:'chameau'},{id:'2',label_fr:'tribu'},{id:'3',label_fr:'vent'},{id:'4',label_fr:'soleil'},{id:'5',label_fr:'sable'},{id:'6',label_fr:'oasis'},{id:'7',label_fr:'étoiles'},{id:'8',label_fr:'silence'}],
          correct: 'chameau,tribu,vent,soleil,sable,oasis,étoiles,silence',
          pos: `Création poétique et scientifique ! Chaque métaphore est juste.`,
          neg: `Révisez : chameau=sens, tribu=relations, vent=humour, soleil=corps, sable=apprentissage, oasis=créativité, étoiles=espoir, silence=spiritualité.`
        },
        {
          type: 'Contre-la-montre',
          q: `Q1: Radio cassée, base à 40 km. Créez une solution.`,
          options: [
            { id: 'A', label_fr: 'Envoyer quelqu’un à pied' },
            { id: 'B', label_fr: 'Signal visuel: feu + tissu mouillé = colonne de fumée. 1 fumée=OK, 3=urgence.' },
            { id: 'C', label_fr: 'Attendre' }
          ],
          correct: 'B',
          pos: `Ingénieux ! La fumée visible à 40 km par temps clair.`,
          neg: `Trop long ou inefficace.`
        },
        {
          type: 'Contre-la-montre',
          q: `Q2: Eau contaminée par le sable. Créez un filtre.`,
          options: [
            { id: 'A', label_fr: 'Bouteille coupée + tissu + charbon + sable + gravier, puis bouillir.' },
            { id: 'B', label_fr: 'Boire l’eau sale' },
            { id: 'C', label_fr: 'Ne pas boire' }
          ],
          correct: 'A',
          pos: `Filtre de survie efficace. Le charbon absorbe les toxines.`,
          neg: `Boire l’eau sale ou ne pas boire est dangereux.`
        },
        {
          type: 'Contre-la-montre',
          q: `Q3: Membre en état de choc. Créez un protocole.`,
          options: [
            { id: 'A', label_fr: '« Sois fort »' },
            { id: 'B', label_fr: 'Protocole PAIR: Pause, Accompagnement, Invitation à parler, Retour.' },
            { id: 'C', label_fr: 'L\'envoyer à l\'hôpital (200 km)' }
          ],
          correct: 'B',
          pos: `Acronyme mémorisable, inspiré de Rogers et Cyrulnik.`,
          neg: `Inadapté au contexte.`
        },
        {
          type: 'Contre-la-montre',
          q: `Q4: Équipe épuisée après 20h. Créez un discours de 3 phrases.`,
          options: [
            { id: 'A', label_fr: '« C’est un ordre »' },
            { id: 'B', label_fr: '« Partez si vous êtes fatigués »' },
            { id: 'C', label_fr: '« On a sauvé 200 vies. Encore 2h, puis 24h de repos. On termine ensemble. »' }
          ],
          correct: 'C',
          pos: `Sens, compétence, affiliation, espoir. SDT parfaite.`,
          neg: `Démobilise l'équipe.`
        },
        {
          type: 'Détection + création',
          q: `Trouvez les erreurs du plan d’évacuation V1.0 et créez le V2.0 (8 erreurs).`,
          options: [
            { id: 'A', label_fr: 'Garder le plan V1.0' },
            { id: 'B', label_fr: '1) Départ 5h, 2) +Boussole, 3) 2 véh. min, 4) Sat+Radio, 5) 5L/jour, 6) Kit bivouac, 7) Plans écrits, 8) Formation.' }
          ],
          correct: 'B',
          pos: `Transformation créative. V2 résilient à multi-couches.`,
          neg: `Relisez chaque erreur et proposez une alternative concrète.`
        }
      ]
    },
    {
      id: MISSION_IDS.L2,
      title_fr: 'Mission L2 : Coopérative de femmes',
      description_fr: `Travail en équipe (création). Ishaq invente une gouvernance communautaire adaptée et inclusive.`,
      questions: [
        {
          type: 'QCM créatif',
          q: `Créez un modèle de gouvernance pour 25 femmes (80% analphabètes, culture de consensus).`,
          options: [
            { id: 'A', label_fr: 'Démocratie pure (1 vote)' },
            { id: 'B', label_fr: 'Hiérarchie militaire' },
            { id: 'C', label_fr: 'Modèle hybride: 3 cercles (Aînées, Expérimentées, Nouvelles). Rotation 6 mois.' }
          ],
          correct: 'C',
          pos: `Création de gouvernance originale ! Respect culturel + progression + autonomie.`,
          neg: `Vote égalitaire ignore l’expertise. Autocratie tue la motivation.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q1: 5 nouvelles analphabètes. Créez la semaine 1 de formation.`,
          options: [
            { id: 'A', label_fr: 'Cours théoriques' },
            { id: 'B', label_fr: 'Manuels écrits' },
            { id: 'C', label_fr: 'J1-2: observation ; J3-4: tâches simples ; J5: création d’un objet personnel.' }
          ],
          correct: 'C',
          pos: `Pédagogie sans écrit. Observation, guidage, production personnelle.`,
          neg: `Inadapté à l’analphabétisme.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q2: Semaine 2 (travailler ensemble).`,
          options: [
            { id: 'A', label_fr: 'Compétition individuelle' },
            { id: 'B', label_fr: 'Binômes (nouvelle+exp), puis mini-équipe (3 pers), puis célébration.' },
            { id: 'C', label_fr: 'Travail solo' }
          ],
          correct: 'B',
          pos: `Progression naturelle : duo, trio, célébration collective.`,
          neg: `Passer trop vite à l’équipe est brutal.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q3: Système de suivi post-formation (sans écrit).`,
          options: [
            { id: 'A', label_fr: 'Rapport hebdomadaire' },
            { id: 'B', label_fr: 'Examen final' },
            { id: 'C', label_fr: 'Tableau mural couleurs (rouge/jaune/vert). Autocollants.' }
          ],
          correct: 'C',
          pos: `Suivi visuel inclusif. Les vertes deviennent tutrices des rouges.`,
          neg: `L’écrit exclut les membres.`
        },
        {
          type: 'Dialogue créatif',
          q: `2 femmes de tribus rivales refusent de travailler ensemble. Créez une approche nouvelle.`,
          options: [
            { id: 'A', label_fr: 'Les séparer' },
            { id: 'B', label_fr: 'Médiation classique' },
            { id: 'C', label_fr: 'Stratégie « Le Pont »: Projet commun irrésistible, but supra-ordonné.' }
          ],
          correct: 'C',
          pos: `Inspiration de Sherif (Robber’s Cave). Objectif supra-ordonné.`,
          neg: `La parole directe échoue souvent sur les conflits ancestraux.`
        },
        {
          type: 'Texte à trous',
          q: `Créez les 8 articles d’une charte adaptée au contexte sahraoui.`,
          options: [{id:'1',label_fr:'Respect'},{id:'2',label_fr:'Consensus'},{id:'3',label_fr:'Rotation'},{id:'4',label_fr:'Partage'},{id:'5',label_fr:'Pairs'},{id:'6',label_fr:'Aînées'},{id:'7',label_fr:'Célébration'},{id:'8',label_fr:'Transmission'}],
          correct: 'Respect,Consensus,Rotation,Partage,Pairs,Aînées,Célébration,Transmission',
          pos: `Charte vivante, orale, respectueuse des valeurs locales.`,
          neg: `Trop écrit ou occidental serait inadapté.`
        },
        {
          type: 'Détection + création',
          q: `Trouvez les faiblesses commerciales et créez un plan marketing innovant.`,
          options: [
            { id: 'A', label_fr: 'Baisse des prix' },
            { id: 'B', label_fr: 'Instagram (jeunes), Diversification clients, Positionnement Premium.' }
          ],
          correct: 'B',
          pos: `Analyse créative. Les solutions sont adaptées au contexte.`,
          neg: `Baisser les prix est suicidaire ici.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q1: Créez les critères de sélection des mentores.`,
          options: [
            { id: 'A', label_fr: 'Meilleure tisseuse seulement' },
            { id: 'B', label_fr: 'Expérience (2 ans), patience, bienveillance, capacité d\'explication orale.' }
          ],
          correct: 'B',
          pos: `La compétence technique ne suffit pas au mentorat.`,
          neg: `Néglige les qualités relationnelles.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q2: Créez le programme de mentorat (6 mois).`,
          options: [
            { id: 'A', label_fr: '1 semaine intensive' },
            { id: 'B', label_fr: 'M1-2: observation ; M3-4: supervisée ; M5-6: indépendante.' }
          ],
          correct: 'B',
          pos: `Progression graduée, feedback oral, autonomie croissante.`,
          neg: `Trop court = inefficace.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q3: Créez le système d’évaluation (sans écrit).`,
          options: [
            { id: 'A', label_fr: 'Examen papier' },
            { id: 'B', label_fr: 'Rencontre mensuelle orale + évaluation collective par les paires.' }
          ],
          correct: 'B',
          pos: `Oral, collectif, constructif. Pas de paperasse.`,
          neg: `L’écrit exclut les membres.`
        }
      ]
    },
    {
      id: MISSION_IDS.L3,
      title_fr: 'Mission L3 : Dispensaire mobile',
      description_fr: `Prise de décision (création en isolement). Ishaq crée un système de santé décentralisé et frugal.`,
      questions: [
        {
          type: 'Prise de décision',
          q: `30 patients, le médecin ne peut en voir que 15. Créez un système de triage rapide et visuel.`,
          options: [
            { id: 'A', label_fr: 'Premier arrivé premier servi' },
            { id: 'B', label_fr: 'Triage « 3 couleurs »: Rouge (immédiat), Jaune (1h), Vert (attendre). Rubans.' }
          ],
          correct: 'B',
          pos: `Simple, visuel, rapide, transparent.`,
          neg: `L’ordre d’arrivée ignore l’urgence vitale.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q1: Douleur abdominale depuis 3 jours. Créez 5 questions de diagnostic.`,
          options: [
            { id: 'A', label_fr: 'Questions vagues' },
            { id: 'B', label_fr: 'Où ? Depuis quand ? Fièvre ? Nausées ? Antécédents ?' }
          ],
          correct: 'B',
          pos: `Protocole « 5Q » efficace sans instruments.`,
          neg: `Manquer une question peut être fatal.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q2: Bas droite, 48h, fièvre 38.5, nausées. Diagnostic et plan ?`,
          options: [
            { id: 'A', label_fr: 'Attendre' },
            { id: 'B', label_fr: 'Appendicite. À jeun, antidouleur, évacuation urgente (200 km), satellite.' }
          ],
          correct: 'B',
          pos: `Diagnostic juste. Plan d’action complet.`,
          neg: `Attendre ou manger aggraverait l’urgence.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q3: Route coupée, hélico dans 4h. Plan de stabilisation ?`,
          options: [
            { id: 'A', label_fr: 'Attente passive' },
            { id: 'B', label_fr: 'Semi-assis, monitoring /15min, IV si possible, préparer civière/fumée.' }
          ],
          correct: 'B',
          pos: `Stabilisation en milieu extrême.`,
          neg: `L’improvisation est dangereuse.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Créez un programme pour former 10 agents de santé villageois (<500 DH).`,
          options: [
            { id: 'A', label_fr: 'Diplôme universitaire' },
            { id: 'B', label_fr: 'Formation 5j (triage, secours, hygiène) + Kit (rubans, sels, radio).' }
          ],
          correct: 'B',
          pos: `Système de santé décentralisé, économique, durable.`,
          neg: `Trop cher ou académique serait inapplicable.`
        },
        {
          type: 'Dialogue créatif',
          q: `Internet intermittent. Créez un système de télémédecine low-tech.`,
          options: [
            { id: 'A', label_fr: 'Attendre la fibre' },
            { id: 'B', label_fr: 'SMS standardisé (5Q) + Photos + Appel vocal sur réseau local.' }
          ],
          correct: 'B',
          pos: `Frugal et efficace. La télémédecine low-tech est possible.`,
          neg: `Laisse les malades sans soins.`
        },
        {
          type: 'Texte à trous',
          q: `Créez un code de 8 principes pour le médecin isolé.`,
          options: [{id:'1',label_fr:'Nuire'},{id:'2',label_fr:'Référer'},{id:'3',label_fr:'Consentement'},{id:'4',label_fr:'Limites'},{id:'5',label_fr:'Documenter'},{id:'6',label_fr:'Vulnérables'},{id:'7',label_fr:'Santé'},{id:'8',label_fr:'Espoir'}],
          correct: 'Nuire,Référer,Consentement,Limites,Documenter,Vulnérables,Santé,Espoir',
          pos: `Principes solides pour l’extrême isolement.`,
          neg: `Trop technique serait inapplicable.`
        },
        {
          type: 'Détection + création',
          q: `Trouvez 6 faiblesses du système et créez des solutions.`,
          options: [
            { id: 'A', label_fr: 'Constat seul' },
            { id: 'B', label_fr: 'Relais radio, Pharmacie comm., Dossier visuel, Points héliportés.' }
          ],
          correct: 'B',
          pos: `Chaque faiblesse devient une opportunité.`,
          neg: `Proposez des solutions concrètes.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q1: Épidémie village isolé. Créez un confinement sans murs.`,
          options: [
            { id: 'A', label_fr: 'Confinement strict type ville' },
            { id: 'B', label_fr: 'Distanciation, masques tissu, isolement bâtiment commun.' }
          ],
          correct: 'B',
          pos: `Confinement souple adapté au contexte nomade.`,
          neg: `Le strict est impossible ici.`
        },
        {
          type: 'Contre-la-montre',
          q: `Q1-4: Innovations médicales express (Brancard, Stérilisateur, Attelle, SOS).`,
          options: [
            { id: 'A', label_fr: 'Improvisation totale' },
            { id: 'B', label_fr: 'Brancard perches, Solaire boîte, Attelle branche, SOS triangle fumée.' }
          ],
          correct: 'B',
          pos: `Frugalité et survie validées.`,
          neg: `Chaque minute compte.`
        }
      ]
    },
    {
      id: MISSION_IDS.L4,
      title_fr: 'Mission L4 : Ferme solaire',
      description_fr: `Innovation frugale. Ishaq conçoit des solutions énergétiques durables avec des ressources minimales.`,
      questions: [
        {
          type: 'Prise de décision',
          q: `Puits à 5 km, budget 50k DH. Créez un système d’eau solaire.`,
          options: [
            { id: 'A', label_fr: 'Moto-pompe essence' },
            { id: 'B', label_fr: 'Camions-citernes' },
            { id: 'C', label_fr: 'Pompe solaire + Réservoir + Gravité + Bornes comm.' }
          ],
          correct: 'C',
          pos: `Frugal, durable, sans carburant.`,
          neg: `Les solutions fossiles sont trop chères à long terme.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q1: Panne solaire pleine chaleur. Diagnostic sans outils ?`,
          options: [
            { id: 'A', label_fr: 'Attendre technicien' },
            { id: 'B', label_fr: 'Visuel (connexions), Propreté (sable), Sentir les surtensions.' }
          ],
          correct: 'B',
          pos: `Diagnostic low-tech. Juste les sens.`,
          neg: `Laisse le village sans eau trop longtemps.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q2: Créez un système de backup.`,
          options: [
            { id: 'A', label_fr: 'Pas de backup' },
            { id: 'B', label_fr: 'Batteries supp, Rationnement (frais), Priorité boisson.' }
          ],
          correct: 'B',
          pos: `Gestion de crise rationnelle.`,
          neg: `L'improvisation aggrave tout.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q3: Plan de communication panne.`,
          options: [
            { id: 'A', label_fr: 'Cacher la panne' },
            { id: 'B', label_fr: 'Transparence: 24h rép, 2L/pers, priorité enfants.' }
          ],
          correct: 'B',
          pos: `Clair, respectueux, évite la panique.`,
          neg: `Le manque d'info crée la peur.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 7 principes d’innovation frugale.`,
          options: [{id:'1',label_fr:'Simplicité'},{id:'2',label_fr:'Existant'},{id:'3',label_fr:'Zéro'},{id:'4',label_fr:'Partagé'},{id:'5',label_fr:'Local'},{id:'6',label_fr:'Évolutif'},{id:'7',label_fr:'Contexte'}],
          correct: 'Simplicité,Existant,Zéro,Partagé,Local,Évolutif,Contexte',
          pos: `Principes appliqués au désert.`,
          neg: `Trop théorique.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Créez l’organigramme d’une startup solaire rurale.`,
          options: [
            { id: 'A', label_fr: 'Hiérarchie lourde' },
            { id: 'B', label_fr: 'CEO, CTO, Commercial terrain, Formateur, Maintenance local.' }
          ],
          correct: 'B',
          pos: `Structure agile adaptée au terrain.`,
          neg: `Trop de bureaux = trop de coûts.`
        },
        {
          type: 'Dialogue créatif',
          q: `Chef refuse: « sorcellerie ». Stratégie ?`,
          options: [
            { id: 'A', label_fr: 'Argumenter technique' },
            { id: 'B', label_fr: 'Démonstration mosquée/école, Associer les notables.' }
          ],
          correct: 'B',
          pos: `Preuve par l'exemple, respect des leaders.`,
          neg: `Le braquer est un échec.`
        },
        {
          type: 'Détection + création',
          q: `Sable sur panneaux. 3 solutions frugales ?`,
          options: [
            { id: 'A', label_fr: 'Nettoyage pro' },
            { id: 'B', label_fr: 'Brosses vent, Huile végétale, Inclinaison vibrante.' }
          ],
          correct: 'B',
          pos: `Simple, peu coûteux, testable.`,
          neg: `Trop cher pour le village.`
        },
        {
          type: 'Classement',
          q: `10 villages, budget pour 5. Matrice ?`,
          options: [
            { id: 'A', label_fr: 'Plus peuplé' },
            { id: 'B', label_fr: 'Matrice: Pop(3), Isolement(2), Éco(2), Engagement(1), Femmes(3).' }
          ],
          correct: 'B',
          pos: `Transparente, multicritère, juste.`,
          neg: `Critère unique injuste.`
        },
        {
          type: 'Contre-la-montre',
          q: `Express: Four solaire, Chargeur, Réfrigérateur (Zeer), Éclairage.`,
          options: [
            { id: 'A', label_fr: 'Solutions fossiles' },
            { id: 'B', label_fr: 'Boîte alu, Panneau recyclé, Pots terre/sable, LED/Solaire.' }
          ],
          correct: 'B',
          pos: `Zéro énergie, impact maximum.`,
          neg: `Peu durable.`
        }
      ]
    },
    {
      id: MISSION_IDS.L5,
      title_fr: 'Mission L5 : Le plan de développement',
      description_fr: `Synthèse créative. Ishaq élabore une vision stratégique provinciale (Défi Final).`,
      questions: [
        {
          type: 'Création stratégique',
          q: `Créez un plan de développement en 5 axes thématiques.`,
          options: [
            { id: 'A', label_fr: 'Plan standard' },
            { id: 'B', label_fr: 'SOLEIL (Énergie), OASIS (Eau), CARAVANE (Tourisme), TRIBU (Éducation), ÉTOILE (Innovation).' }
          ],
          correct: 'B',
          pos: `Vision créative et cohérente utilisant les atouts locaux.`,
          neg: `Manque de lien territorial.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q1: Budget -50%. Réponse ?`,
          options: [
            { id: 'A', label_fr: 'Tout réduire' },
            { id: 'B', label_fr: 'Phasage: SOLEIL + TRIBU génèrent les revenus pour les autres.' }
          ],
          correct: 'B',
          pos: `Argument économique d'autofinancement.`,
          neg: `Tue le projet.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q2: « Ignore les traditions ». Réponse ?`,
          options: [
            { id: 'A', label_fr: 'Nier' },
            { id: 'B', label_fr: 'CARAVANE valorise culture, TRIBU nomme structure sociale.' }
          ],
          correct: 'B',
          pos: `Diplomatique. On amplifie la tradition.`,
          neg: `Braque les locaux.`
        },
        {
          type: 'Scénario en cascade',
          q: `Q3: Jeune sans diplôme: « Et moi ? »`,
          options: [
            { id: 'A', label_fr: 'Vague' },
            { id: 'B', label_fr: 'TRIBU te forme, SOLEIL t\'emploie, ÉTOILE t\'incube.' }
          ],
          correct: 'B',
          pos: `Parcours concret et inspirant.`,
          neg: `Ne l'aide pas.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Gouvernance du plan: Décideurs et comités ?`,
          options: [
            { id: 'A', label_fr: 'Un seul chef' },
            { id: 'B', label_fr: 'Stratégique (Wali/Chefs), Technique (Experts), Citoyen (Élus).' }
          ],
          correct: 'B',
          pos: `Participative et transparente.`,
          neg: `Bloque le projet.`
        },
        {
          type: 'Détection + création',
          q: `Gestion des 6 risques majeurs.`,
          options: [
            { id: 'A', label_fr: 'Ignorer' },
            { id: 'B', label_fr: 'Contingences: Stock eau, Fonds réserve, Médiation, Maintenance local.' }
          ],
          correct: 'B',
          pos: `Chaque menace a sa réponse préventive.`,
          neg: `Risque accepté = danger.`
        },
        {
          type: 'Texte à trous',
          q: `Théorie du changement Axe Soleil.`,
          options: [{id:'1',label_fr:'50M'},{id:'2',label_fr:'100'},{id:'3',label_fr:'500'},{id:'4',label_fr:'Baisse'},{id:'5',label_fr:'Autonomie'}],
          correct: '50M,100,500,Baisse,Autonomie',
          pos: `Logique Inputs -> Activités -> Outputs -> Outcomes -> Impact.`,
          neg: `Liens trop faibles.`
        },
        {
          type: 'Dialogue créatif',
          q: `Mobiliser 1000 habitants en 5 min.`,
          options: [
            { id: 'A', label_fr: 'Technocratique' },
            { id: 'B', label_fr: 'Émotionnel/Bénéfices: Le désert devient bénédiction.' }
          ],
          correct: 'B',
          pos: `Paroles simples, images fortes, espoir.`,
          neg: `Ne mobilisera pas.`
        },
        {
          type: 'Contre-la-montre',
          q: `5 Décisions Gouverneur (Crue, Conflit, Éco vs Écolo, Profs, Migrants).`,
          options: [
            { id: 'A', label_fr: 'Attendre' },
            { id: 'B', label_fr: 'Action immédiate: Hélico, Médiation, Étude impact, Formation local, SOS.' }
          ],
          correct: 'B',
          pos: `Réaction rapide et ciblée.`,
          neg: `Coûte des vies ou du temps.`
        },
        {
          type: 'Énigme',
          q: `Énigme ultime: « Je nais du vide, je donne des ailes... »`,
          options: [
            { id: 'A', label_fr: 'Imagination' },
            { id: 'B', label_fr: 'La créativité' }
          ],
          correct: 'B',
          pos: `Sommet de Bloom. Créer l'inexistant.`,
          neg: `Relisez le thème de la ville.`
        }
      ]
    }
  ];

  // 2. Loop through missions
  for (const mission of missionsData) {
    const { error: mErr } = await supabase.from('missions').upsert({
      id: mission.id,
      challenge_id: LAAYOUNE_CHALLENGE_PK,
      city_id: 'laayoune',
      title_fr: mission.title_fr,
      description_fr: mission.description_fr,
      sort_order: missionsData.indexOf(mission) + 1
    });

    if (mErr) { console.error(`Mission ${mission.id} Error:`, mErr); continue; }
    console.log(`✅ Mission ${mission.title_fr} upserted`);

    // 3. Upsert questions for this mission
    const questionsToInsert = mission.questions.map((q, idx) => ({
      mission_id: mission.id,
      type: TYPE_MAPPING[q.type] || 'qcm',
      question_text_fr: q.q,
      options: q.options,
      correct_answer: q.correct,
      feedback_positive_fr: q.pos,
      feedback_negative_fr: q.neg,
      sort_order: idx + 1
    }));

    const { error: qErr } = await supabase.from('questions').upsert(questionsToInsert, { 
      onConflict: 'mission_id, sort_order' 
    });

    if (qErr) { console.error(`Questions for ${mission.id} Error:`, qErr); }
    else { console.log(`✅ 10 questions for ${mission.id}`); }
  }

  console.log('🏁 Laâyoune HIGH-FIDELITY import FINISHED!');
}

importLaayoune();
