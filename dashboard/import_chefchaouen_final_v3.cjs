require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  console.log('🚀 Starting Chefchaouen HIGH-FIDELITY (Acte II) import...');

  // 1. Upsert City (Challenge)
  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: CHEF_CHALLENGE_PK,
    city_id: 'chefchaouen',
    city_name_fr: 'Chefchaouen',
    city_name_ar: 'شفشاون',
    description_fr: `Chefchaouen, ville bleue nichée dans le Rif, vous invite à appliquer concrètement les concepts découverts à Rabat. Ici, pas de théorie : on pratique en montagne, à l’atelier de tissage, au souk, à l’herboristerie et au festival.`,
    headline_fr: `🏔️ ACTE II - LA PERLE BLEUE : L'APPLICATION`,
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
      description_fr: `Mentor: Aziz Moussaoui (Guide). Soft Skill: Gestion du stress (APPLICATION). Appliquez la technique STOP et la visualisation positive en situation réelle de montagne.`,
      questions: [
        {
          type: 'QCM',
          q: `Un touriste a le vertige et crie « Je ne peux plus bouger ! ». Selon la technique STOP, quelle est votre première action ?`,
          options: [
            { id: 'A', label_fr: 'Lui crier « Avance, c’est pas dangereux »' },
            { id: 'B', label_fr: 'Courir vers lui' },
            { id: 'C', label_fr: 'Dire calmement « STOP. On s’arrête. Respirez avec moi. »' },
            { id: 'D', label_fr: 'Appeler les secours' }
          ],
          correct: 'C',
          pos: `Parfait ! STOP : Stop, Take breath, Observe, Proceed. Vous appliquez la co-régulation.`,
          neg: `Crier ou courir aggrave la panique. Restez calme and respirez avec lui.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque stresseur de montagne à la meilleure stratégie.`,
          options: [
            { left_fr: 'Panique d’altitude', right_fr: '4-7-8 + co-régulation' },
            { left_fr: 'Orage', right_fr: 'abri immédiat' },
            { left_fr: 'Épuisement', right_fr: 'encouragement + micro-objectifs' },
            { left_fr: 'Dispute sur direction', right_fr: 'médiation CNV' },
            { left_fr: 'Blessure légère', right_fr: 'premiers secours + évaluation' },
            { left_fr: 'Perte du sentier', right_fr: 'STOP + carte + GPS' }
          ],
          pos: `Transfert parfait ! Vous appliquez Rabat en montagne. Niveau Bloom 3 réussi.`,
          neg: `Révisez : panique = respiration, orage = abri, épuisement = encouragement, dispute = médiation.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un touriste diabétique, perdu dans le brouillard, panique. Que faites-vous en premier ?`,
          options: [
            { id: 'A', label_fr: '« Restez calme, tout va bien » puis courir chercher Aziz' },
            { id: 'B', label_fr: 'Vous asseoir à côté, appliquer STOP, évaluer : « Quand avez-vous pris votre dernière insuline ? »' },
            { id: 'C', label_fr: 'Crier pour appeler Aziz' },
            { id: 'D', label_fr: 'Paniquer aussi' }
          ],
          correct: 'B',
          pos: `Excellente application ! STOP + co-régulation + collecte d’info (Simon). Urgence diabète gérée.`,
          neg: `Nier la réalité ou laisser seul aggrave la panique. Validez l’émotion, puis agissez.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les étapes de la visualisation positive.`,
          options: [
            { text: 'yeux' }, { text: 'lieu' }, { text: 'sécurité' }, { text: 'détails' },
            { text: '5 sens' }, { text: 'calme' }, { text: 'mental' }, { text: 'corps' }
          ],
          correct: 'yeux, lieu, sécurité, détails, 5 sens, calme, mental, corps',
          pos: `Parfait ! La visualisation active les mêmes zones cérébrales que l’expérience réelle.`,
          neg: `Retenez : fermez les yeux, lieu sûr, détails sensoriels, le mental calme le corps.`
        },
        {
          type: 'Vrai/Faux',
          q: `« La nature réduit automatiquement le stress. »`,
          correct: 'vrai',
          pos: `Vrai, 20 min en forêt font baisser le cortisol de 15% (Shinrin-yoku).`,
          neg: `Les études le confirment. Mais la nature ne remplace pas les techniques respiratoires.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Un bon guide ne ressent jamais de stress. »`,
          correct: 'faux',
          pos: `Faux. Les experts canalisent le stress, ils ne le suppriment pas.`,
          neg: `Nier son stress en montagne est dangereux. Il faut le gérer, pas l’ignorer.`
        },
        {
          type: 'Vrai/Faux',
          q: `« En urgence, il faut d’abord agir, puis réfléchir. »`,
          correct: 'faux',
          pos: `Faux. STOP d’abord : s’arrêter, respirer, observer, puis agir.`,
          neg: `Agir sans réfléchir en montagne mène à la chute. Évaluez avant d’agir.`
        },
        {
          type: 'Contre-la-montre',
          q: `URGENCE : Randonneur fait un malaise (chaleur). Première action ?`,
          options: [
            { id: 'A', label_fr: 'Le forcer à marcher' },
            { id: 'B', label_fr: 'Ombre, pieds surélevés, eau' },
            { id: 'C', label_fr: 'Asperger d\'eau froide' }
          ],
          correct: 'B',
          pos: `Réflexe juste ! Position latérale de sécurité et réhydratation.`,
          neg: `Le forcer à marcher ou l’asperger d’eau froide est dangereux.`
        },
        {
          type: 'Scénario en cascade',
          q: `Randonneur blessé à la cheville.`,
          options: {
            steps: [
              {
                question: `Blessé à la cheville, ne peut plus marcher. Première action ?`,
                responses: [
                  { id: 'A', text: 'Le porter' },
                  { id: 'B', text: 'STOP, évaluer la blessure, immobiliser' }
                ],
                correct: 'B'
              },
              {
                question: `Cheville enflée mais pas cassée. Organisation de la descente ?`,
                responses: [
                  { id: 'A', text: 'Porter vous-même' },
                  { id: 'B', text: '2 personnes soutiennent la victime, vous ouvrez, Aziz ferme' }
                ],
                correct: 'B'
              },
              {
                question: `Ahmed panique : « Et si c’est cassé ? » Que répondre ?`,
                responses: [
                  { id: 'A', text: 'Ignorer' },
                  { id: 'B', text: '« Pas cassée. On avance à ton rythme. On va y arriver ensemble. »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `STOP + évaluation Simon. Base des premiers secours. Distribution Belbin appliquée. Recadrage + autonomie + affiliation.`,
          neg: `Le porter ou courir chercher de l’aide aggrave la situation. Laisser marcher seul ou porter vous-même est risqué.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 5 erreurs dans la checklist du touriste.`,
          options: [
            { text_fr: 'Baskets de ville', is_error: true },
            { text_fr: '50cl eau', is_error: true },
            { text_fr: 'Départ 13h', is_error: true },
            { text_fr: 'Personne ne sait où il va', is_error: true },
            { text_fr: 'Téléphone à 40%', is_error: true }
          ],
          pos: `5 erreurs mortelles. Même logique que la détection de burnout.`,
          neg: `Relisez : chaussures, eau, horaire, information, batterie. La prévention sauve.`
        },
        {
          type: 'Classement',
          q: `Classez les 6 actions dans l’ordre correct d'évacuation.`,
          options: [
            { label_fr: 'Sécuriser zone' },
            { label_fr: 'Évaluer blessé' },
            { label_fr: 'Protéger' },
            { label_fr: 'Appeler secours' },
            { label_fr: 'Donner coordonnées' },
            { label_fr: 'Rassurer groupe' }
          ],
          pos: `Ordre parfait. Même processus Simon adapté à l’évacuation.`,
          neg: `Rappel : sécurité d’abord, évaluer, protéger, appeler, coordonner, puis rassurer.`
        },
        {
          type: 'Énigme',
          q: `« Je suis invisible mais je te maintiens debout. En montagne, si tu me perds, tes jambes te trahissent… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La force' },
            { id: 'B', label_fr: 'Le courage' },
            { id: 'C', label_fr: 'Le calme intérieur' },
            { id: 'D', label_fr: 'L’expérience' }
          ],
          correct: 'C',
          pos: `Bravo ! Le calme intérieur n’est pas l’absence de stress, mais la présence de contrôle.`,
          neg: `Relisez : « Les enfants l’ont sans efforts » – c’est le calme intérieur.`
        }
      ]
    },
    {
      id: MISSION_IDS.C2,
      title_fr: 'Mission C2 : Coopérative tisseuse du Rif',
      description_fr: `Mentor: Khadija Moussaoui. Soft Skill: Travail en équipe (APPLICATION). Transférer les rôles Belbin dans un contexte artisanal.`,
      questions: [
        {
          type: 'QCM',
          q: `Zahra (60 ans) ne tisse plus, corrige les gestes, encourage, calme les disputes. Quel rôle Belbin ?`,
          options: [
            { id: 'A', label_fr: 'Créative' },
            { id: 'B', label_fr: 'Harmonisatrice' },
            { id: 'C', label_fr: 'Leader' },
            { id: 'D', label_fr: 'Réalisatrice' }
          ],
          correct: 'B',
          pos: `Exact ! L’harmonisatrice gère les tensions et encourage l’équipe.`,
          neg: `Non. Zahra ne crée pas, ne dirige pas seule, n’exécute pas. Elle harmonise.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Attribuez les 5 tisseuses aux rôles optimaux.`,
          options: [
            { left_fr: 'Fatima (rapide, motif identique)', right_fr: 'Réalisatrice' },
            { left_fr: 'Nora (invente des motifs)', right_fr: 'Créative' },
            { left_fr: 'Zahra (voit les erreurs)', right_fr: 'Analyste' },
            { left_fr: 'Halima (gère les conflits)', right_fr: 'Harmonisatrice' },
            { left_fr: 'Meryem (commande, comptes)', right_fr: 'Leader' }
          ],
          pos: `Distribution parfaite ! Belbin transféré du labo à l’atelier.`,
          neg: `Révisez : réalisatrice = production standard, créative = innovation, analyste = contrôle, harmonisatrice = médiation, leader = logistique.`
        },
        {
          type: 'Dialogue de situation',
          q: `Nora (moderne) et Fatima (tradition) se disputent. Quelle intervention ?`,
          options: [
            { id: 'A', label_fr: '« Fatima a raison »' },
            { id: 'B', label_fr: '« Gardez les symboles de Fatima dans une composition moderne. »' },
            { id: 'C', label_fr: '« Nora a raison »' },
            { id: 'D', label_fr: '« Ce n’est pas mon affaire »' }
          ],
          correct: 'B',
          pos: `Médiation générationnelle parfaite. « Oui ET… » concilie tradition et innovation.`,
          neg: `Prendre parti ou fuir détruit l’équipe. Cherchez la 3ème voie.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez le texte sur la technique « Oui ET… ».`,
          options: [
            { text: '« mais »' }, { text: 'bloque' }, { text: 'opposition' }, { text: 'idée' },
            { text: 'construit' }, { text: 'enrichit' }, { text: 'collaboration' }, { text: 'innovation' }
          ],
          correct: '« mais », bloque, opposition, idée, construit, enrichit, collaboration, innovation',
          pos: `Parfait ! « Oui MAIS » bloque, « Oui ET » construit et innove.`,
          neg: `Retenez : « mais » annule, « et » enrichit. La collaboration naît du « et ».`
        },
        {
          type: 'Vrai/Faux',
          q: `« Une équipe de femmes est plus collaborative qu’une équipe d’hommes. »`,
          correct: 'faux',
          pos: `Faux. La collaboration dépend des compétences, pas du genre.`,
          neg: `Les stéréotypes sont des obstacles. La diversité (mixte) est la plus efficace.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Le savoir-faire artisanal se transmet mieux par la pratique que par la théorie. »`,
          correct: 'vrai',
          pos: `Vrai. C’est l’apprentissage situé de Lave & Wenger.`,
          neg: `Les ateliers apprennent par observation puis participation, pas par cours.`
        },
        {
          type: 'Vrai/Faux',
          q: `« Dans une coopérative, toutes les décisions doivent être prises par vote. »`,
          correct: 'faux',
          pos: `Faux. Décisions techniques par l’expert, stratégiques par vote, urgentes par le leader.`,
          neg: `Rappelez-vous R2 : stratégique, tactique, opérationnel. Le vote n’est pas universel.`
        },
        {
          type: 'Scénario en cascade',
          q: `Tisseuse en difficulté : Samia fait des erreurs.`,
          options: {
            steps: [
              {
                question: `Samia fait des erreurs. Première action ?`,
                responses: [
                  { id: 'A', text: 'La critiquer publiquement' },
                  { id: 'B', text: 'Lui parler en privé avec bienveillance' }
                ],
                correct: 'B'
              },
              {
                question: `Samia révèle : « Mon mari veut m’arrêter. »`,
                responses: [
                  { id: 'A', text: 'Ignorer' },
                  { id: 'B', text: '« Comment la coopérative peut te soutenir ? »' }
                ],
                correct: 'B'
              },
              {
                question: `Samia demande le secret. Que dire à l’équipe ?`,
                responses: [
                  { id: 'A', text: 'Raconter toute l\'histoire' },
                  { id: 'B', text: '« Samia traverse une période difficile. Elle a besoin de soutien. »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Dialogue privé d’abord. Bienveillance et soutien pratique. Respect de la confidentialité + solidarité.`,
          neg: `La critiquer publiquement ou la remplacer brusquement aggrave les choses. Ignorer ou juger sa situation est inapproprié.`
        },
        {
          type: 'Classement',
          q: `Classez les 7 étapes du processus collaboratif de création.`,
          options: [
            { label_fr: 'Comprendre commande' },
            { label_fr: 'Choisir motifs' },
            { label_fr: 'Distribuer tâches' },
            { label_fr: 'Produire' },
            { label_fr: 'Contrôle qualité' },
            { label_fr: 'Ajuster' },
            { label_fr: 'Livrer' }
          ],
          pos: `Même structure que le processus Simon. Universel.`,
          neg: `Rappel : comprendre, choisir, distribuer, produire, contrôler, ajuster, livrer.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 5 dysfonctions dans la réunion.`,
          options: [
            { text_fr: 'Décision unilatérale', is_error: true },
            { text_fr: 'Attaque personnelle', is_error: true },
            { text_fr: 'Désengagement (téléphone)', is_error: true },
            { text_fr: 'Ignorer qualité', is_error: true },
            { text_fr: 'Réunion sans résolution', is_error: true }
          ],
          pos: `Parfait. Vous identifiez les 5 dysfonctions de Lencioni.`,
          neg: `Relisez : décision chef seul, critique personnelle, absentéisme, court-termisme, départ sans conclusion.`
        },
        {
          type: 'Prise de décision',
          q: `L’hôtel veut changer les motifs après 5 jours de travail. Que faire ?`,
          options: [
            { id: 'A', label_fr: 'Accepter et tout recommencer' },
            { id: 'B', label_fr: 'Refuser' },
            { id: 'C', label_fr: 'Compromis : 50% floraux existants à prix réduit + 50% nouveaux géométriques, surcoût partagé.' }
          ],
          correct: 'C',
          pos: `Négociation win-win. Ni soumission ni rupture. Créativité commerciale.`,
          neg: `Accepter ou refuser brutalement est perdant. Le compromis intelligent sauve la relation.`
        },
        {
          type: 'Énigme',
          q: `« Chaque fil seul est fragile. Ensemble ils deviennent tapis. Chaque personne seule est limitée. Ensemble elles deviennent… ? »`,
          options: [
            { id: 'A', label_fr: 'Une entreprise' },
            { id: 'B', label_fr: 'Une famille' },
            { id: 'C', label_fr: 'Une force' },
            { id: 'D', label_fr: 'Un problème' }
          ],
          correct: 'C',
          pos: `Magnifique ! L’équipe transforme la fragilité individuelle en force collective.`,
          neg: `Relisez : « un fil fragile → tapis solide, une note → musique. » C’est une force.`
        }
      ]
    },
    {
      id: MISSION_IDS.C3,
      title_fr: 'Mission C3 : Le Souk et le Restaurant',
      description_fr: `Mentor: Omar. Soft Skill: Prise de décision (APPLICATION). Négocier avec la méthode BATNA et détecter les biais cognitifs.`,
      questions: [
        {
          type: 'QCM',
          q: `Omar hésite entre : A) 5 kg de tomates (50 DH), B) Changer le menu été, C) Ouvrir 2ème restaurant à Tanger. Classez.`,
          options: [
            { id: 'A', label_fr: 'A=Strat., B=Tact., C=Opér.' },
            { id: 'B', label_fr: 'A=Tact., B=Opér., C=Strat.' },
            { id: 'C', label_fr: 'A=Opérationnelle, B=Tactique, C=Stratégique' }
          ],
          correct: 'C',
          pos: `Classification parfaite. Transfert du ministère au commerce local.`,
          neg: `Règle : <10K DH = opérationnelle, 10K-1M = tactique, >1M = stratégique.`
        },
        {
          type: 'Dialogue de situation',
          q: `Abdellah demande 50 DH/kg pour les olives, Omar propose 30. À vous de conclure.`,
          options: [
            { id: 'A', label_fr: '« 35, dernier prix »' },
            { id: 'B', label_fr: '« 40 DH si qualité garantie chaque semaine, 20 kg/semaine en exclusivité. »' },
            { id: 'C', label_fr: '« 45, d’accord »' },
            { id: 'D', label_fr: '« 20, pas plus »' }
          ],
          correct: 'B',
          pos: `Négociation win-win ! Intérêts (volume, stabilité) plutôt que positions (prix).`,
          neg: `L’ultimatum ou la capitulation sont perdants. Créez de la valeur (volume + exclusivité).`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque situation au biais correspondant au restaurant.`,
          options: [
            { left_fr: 'Note 4.8/5', right_fr: 'Confirmation' },
            { left_fr: 'plat à 120 DH après un à 200 DH', right_fr: 'Ancrage' },
            { left_fr: 'refuse poisson car ami malade', right_fr: 'Disponibilité' },
            { left_fr: 'commande « le plus commandé »', right_fr: 'Conformité sociale' }
          ],
          pos: `Transfert des biais cognitifs. Vous les repérez partout.`,
          neg: `Révisez : ancrage, confirmation, disponibilité, conformité.`
        },
        {
          type: 'Classement',
          q: `Classez les 8 tâches selon la matrice d’Eisenhower pour un chef.`,
          options: [
            { label_fr: 'allergie' },
            { label_fr: 'serveur absent' },
            { label_fr: 'VIP' },
            { label_fr: 'avis TripAdvisor' },
            { label_fr: 'légumes' },
            { label_fr: 'menu' },
            { label_fr: 'robinet' },
            { label_fr: 'Instagram' }
          ],
          pos: `Priorisation de chef. Même logique Eisenhower, contexte différent.`,
          neg: `Rappel : urgent+important d’abord, urgent+moins important ensuite, important+pas urgent ensuite, le reste.`
        },
        {
          type: 'Scénario en cascade',
          q: `Intoxication alimentaire au restaurant.`,
          options: {
            steps: [
              {
                question: `Un client dit « mon fils a vomi après avoir mangé chez vous ». Première réaction ?`,
                responses: [
                  { id: 'A', text: 'Nier' },
                  { id: 'B', text: 'Empathie, demander détails, vérifier en cuisine' }
                ],
                correct: 'B'
              },
              {
                question: `Vous trouvez des crevettes stockées à 12°C (norme 4°C). Action ?`,
                responses: [
                  { id: 'A', text: 'Cacher' },
                  { id: 'B', text: 'Retirer TOUS les plats concernés, noter l’incident, appeler les autres clients.' }
                ],
                correct: 'B'
              },
              {
                question: `Le père veut porter plainte. Approche ?`,
                responses: [
                  { id: 'A', text: 'Dénier toute responsabilité' },
                  { id: 'B', text: '« Je prends toute la responsabilité, je paie les frais, venez vérifier nos mesures. »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Gestion de crise exemplaire. Transparence totale. Modèle de gestion de crise.`,
          neg: `Nier ou fermer immédiatement est une erreur. Jeter et cacher est une faute éthique. Se défendre ou payer sans transparence aggrave la méfiance.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 7 principes de Fisher & Ury.`,
          options: [
            { text: 'intérêts' }, { text: 'positions' }, { text: 'options' }, { text: 'critères' },
            { text: 'BATNA' }, { text: 'relation' }, { text: 'écoute' }
          ],
          correct: 'intérêts, positions, options, critères, BATNA, relation, écoute',
          pos: `Parfait ! Intérêts > positions. BATNA = meilleure alternative.`,
          neg: `Retenez : intérêts, options, critères objectifs, BATNA, relation, écoute.`
        },
        {
          type: 'Contre-la-montre',
          q: `RUSH : 3 tables, 1 serveur absent. Priorité ?`,
          options: [
            { id: 'A', label_fr: 'Table avec enfant qui pleure' },
            { id: 'B', label_fr: 'Table VIP' },
            { id: 'C', label_fr: 'Table qui attend depuis longtemps' }
          ],
          correct: 'A',
          pos: `Empathie avant hiérarchie. Urgence émotionnelle d’abord.`,
          neg: `Le VIP passe après l’urgence sociale. L’enfant en détresse est prioritaire.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 5 erreurs dans le business plan du restaurant.`,
          options: [
            { text_fr: '100% économies (risque ruine)', is_error: true },
            { text_fr: 'Étude « j’ai mangé à Tanger » (subjective)', is_error: true },
            { text_fr: 'Emplacement choisi par un ami (non visité)', is_error: true },
            { text_fr: 'Gérer seul 2 restaurants (burnout)', is_error: true },
            { text_fr: 'Menu identique (clientèle différente)', is_error: true }
          ],
          pos: `Diagnostic financier parfait. Mêmes erreurs que le projet ministère.`,
          neg: `Relisez : financement, étude de marché, local, charge mentale, adaptation.`
        },
        {
          type: 'Réponse courte',
          q: `Créez un plan d’expansion (80-120 mots) : étude de marché, financement, équipe, calendrier.`,
          correct: 'plan d\'expansion',
          pos: `Plan stratégique solide. Vous appliquez Simon au commerce.`,
          neg: `Il manque une des 4 sections ou une justification claire.`
        },
        {
          type: 'Énigme',
          q: `« Au souk je nais chaque matin, en cuisine je vis chaque midi… Si tu me fuis tu perds, si tu me maîtrises tu gagnes. Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le prix' },
            { id: 'B', label_fr: 'La décision' },
            { id: 'C', label_fr: 'La négociation' },
            { id: 'D', label_fr: 'L’expérience' }
          ],
          correct: 'B',
          pos: `Exact ! La décision est partout : souk, cuisine, négo. Omar la pratique 200 fois par jour.`,
          neg: `Relisez : « Fatima me connaît bien (R2), Omar me pratique. » C’est la décision.`
        }
      ]
    },
    {
      id: MISSION_IDS.C4,
      title_fr: 'Mission C4 : L’Herboristerie de la Résilience',
      description_fr: `Mentor: Zineb. Soft Skill: Résilience (APPLICATION). Appliquer les 8 piliers de Cyrulnik.`,
      questions: [
        {
          type: 'QCM',
          q: `Zineb pleure au travail, dort mal depuis 4 mois, dit « je ne sers à rien ». Diagnostic ?`,
          options: [
            { id: 'A', label_fr: 'Stress aigu' },
            { id: 'B', label_fr: 'Burnout' },
            { id: 'C', label_fr: 'Anxiété passagère' },
            { id: 'D', label_fr: 'Fatigue normale' }
          ],
          correct: 'B',
          pos: `Diagnostic correct. Burnout : épuisement émotionnel, cynisme, inefficacité.`,
          neg: `Le stress aigu est court. L’anxiété n’a pas d’épuisement. Ici c’est burnout.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez l’histoire d’Amina avec les 8 piliers de Cyrulnik.`,
          options: [
            { text: 'Sens' }, { text: 'Relations' }, { text: 'Humour' }, { text: 'Corps' },
            { text: 'Apprentissage' }, { text: 'Créativité' }, { text: 'Espoir' }, { text: 'Spiritualité' }
          ],
          correct: 'Sens, Relations, Humour, Corps, Apprentissage, Créativité, Espoir, Spiritualité',
          pos: `8/8. Vous reconnaissez chaque pilier dans une histoire vécue.`,
          neg: `Révisez les piliers : sens, relations, humour, corps, apprentissage, créativité, espoir, spiritualité.`
        },
        {
          type: 'Dialogue de situation',
          q: `Une femme pleure car son fils parti en Espagne ne l’appelle plus. Que faire ?`,
          options: [
            { id: 'A', label_fr: 'Donner de la valériane' },
            { id: 'B', label_fr: '« Asseyez-vous. Racontez-moi. Quand l’avez-vous vu pour la dernière fois ? »' },
            { id: 'C', label_fr: '« Votre fils est adulte »' },
            { id: 'D', label_fr: '« Ne vous inquiétez pas »' }
          ],
          correct: 'B',
          pos: `Écoute active parfaite. L’herboristerie soigne aussi par la parole.`,
          neg: `Traiter seulement le symptôme (valériane) ou minimiser sa douleur est inefficace.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque plante au pilier de résilience.`,
          options: [
            { left_fr: 'Verveine (calme)', right_fr: 'Calme émotionnel' },
            { left_fr: 'Romarin (mémoire)', right_fr: 'Apprentissage' },
            { left_fr: 'Safran (humeur)', right_fr: 'Espoir' },
            { left_fr: 'Thym (énergie)', right_fr: 'Corps' }
          ],
          pos: `Phytothérapie au service de la résilience. Contexte culturel intégré.`,
          neg: `Révisez : verveine = calme, romarin = mémoire, safran = humeur, thym = corps.`
        },
        {
          type: 'Scénario en cascade',
          q: `Recadrage cognitif pour Zineb.`,
          options: {
            steps: [
              {
                question: `Zineb dit : « Personne ne vient. » Recadrage ?`,
                responses: [
                  { id: 'A', text: 'Nier' },
                  { id: 'B', text: '« 15 clients la semaine dernière, ce n’est pas personne. »' }
                ],
                correct: 'B'
              },
              {
                question: `« Les gens préfèrent les médicaments chimiques. » Recadrage ?`,
                responses: [
                  { id: 'A', text: 'Oui c\'est vrai' },
                  { id: 'B', text: '« Ils veulent les deux. Chimique et naturel sont complémentaires. »' }
                ],
                correct: 'B'
              },
              {
                question: `« L’herboristerie est morte. » Recadrage ?`,
                responses: [
                  { id: 'A', text: 'Hélas' },
                  { id: 'B', text: '« Le marché bio mondial vaut 200 milliards. Nos produits sont exactement ce que le monde cherche. »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Recadrage par les chiffres. Complémentarité. Recadrage par les données mondiales.`,
          neg: `Nier ou minimiser sans preuve ne fonctionne pas. Dire « tu as raison » est un extrême. « Arrête d’être négative » est inefficace.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 6 erreurs dans la routine toxique de Zineb.`,
          options: [
            { text_fr: '13h30 sans pause', is_error: true },
            { text_fr: 'Écran 3h avant coucher', is_error: true },
            { text_fr: 'Zéro sport', is_error: true },
            { text_fr: 'Isolement social', is_error: true },
            { text_fr: 'Aucune vacance depuis 2 ans', is_error: true },
            { text_fr: '3 cafés matin vide', is_error: true }
          ],
          pos: `Mêmes erreurs que Dr. Rachid. Burnout : mêmes patterns partout.`,
          neg: `Relisez : pauses, écran, sport, amis, vacances, petit-déjeuner.`
        },
        {
          type: 'Classement',
          q: `Classez les 6 actions du plan de récupération par priorité.`,
          options: [
            { label_fr: 'Médecin' },
            { label_fr: 'Vacances' },
            { label_fr: 'Limiter heures' },
            { label_fr: 'Éteindre écran' },
            { label_fr: 'Sport' },
            { label_fr: 'Amie' }
          ],
          pos: `Priorisation juste : urgence médicale → récupération → prévention.`,
          neg: `Commencer par le sport ou les amis sans bilan médical est dangereux.`
        },
        {
          type: 'Contre-la-montre',
          q: `URGENCE : Client : « Mal de tête depuis 3 jours. » Votre réponse ?`,
          options: [
            { id: 'A', label_fr: '« Consultez un médecin d’abord, puis revenez. »' },
            { id: 'B', label_fr: 'Donner une tisane' }
          ],
          correct: 'A',
          pos: `Prudence professionnelle. Reconnaître ses limites.`,
          neg: `Donner une tisane sans diagnostic préalable est dangereux.`
        },
        {
          type: 'Réponse courte',
          q: `Écrivez une lettre (80-120 mots) à Zineb utilisant les 8 piliers.`,
          correct: 'lettre à Zineb',
          pos: 'Lettre magnifique. Chaque phrase = un pilier concret.',
          neg: 'Il manque un ou plusieurs piliers. Citez-les tous.'
        },
        {
          type: 'Énigme',
          q: `« Je pousse dans les fissures, là où rien ne devrait vivre. Plus la terre est sèche, plus mes racines plongent… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La plante' },
            { id: 'B', label_fr: 'La résilience' },
            { id: 'C', label_fr: 'L’espoir' }
          ],
          correct: 'B',
          pos: `Magnifique ! La résilience grandit dans l’adversité, comme une plante dans la rocaille.`,
          neg: `Relisez : « Jardins parfaits ne me connaissent pas, seules les terres blessées me voient fleurir. » = résilience.`
        }
      ]
    },
    {
      id: MISSION_IDS.C5,
      title_fr: 'Mission C5 : Le Festival – Défi Final Chefchaouen',
      description_fr: `Mentor: Nabil. Soft Skill: Synthèse (stress + équipe + décision). Gérer une crise en milieu isolé.`,
      questions: [
        {
          type: 'Prise de décision',
          q: `7h, 3 crises : stand non monté, artisans mécontents, traiteur annule. Que faire ?`,
          options: [
            { id: 'A', label_fr: 'Stand d’abord' },
            { id: 'B', label_fr: 'Déléguer stand aux bénévoles, gérer artisans, Nabil remplace traiteur.' },
            { id: 'C', label_fr: 'Traiteur d’abord' },
            { id: 'D', label_fr: 'Artisans d’abord seul' }
          ],
          correct: 'B',
          pos: `Gestion parallèle parfaite. Eisenhower + délégation Belbin.`,
          neg: `Ne pas déléguer ou tout faire soi-même est inefficace. Répartissez.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Attribuez les 6 postes aux 6 profils pour le festival.`,
          options: [
            { left_fr: 'Accueil', right_fr: 'Yassine (extraverti, 3 langues)' },
            { left_fr: 'Sécurité', right_fr: 'Soukaina (sportive, secours)' },
            { left_fr: 'Logistique', right_fr: 'Mehdi (costaud, manutention)' },
            { left_fr: 'Communication', right_fr: 'Lina (photographe)' },
            { left_fr: 'Restauration', right_fr: 'Rachid (chef cuisinier)' },
            { left_fr: 'Médiation', right_fr: 'Hind (médiatrice familiale)' }
          ],
          pos: `Distribution optimale. Right person, right place.`,
          neg: `Révisez : accueil = souriant, sécurité = sportif, logistique = manutention, com’ = photo, resto = cuisinier, médiation = calme.`
        },
        {
          type: 'Scénario en cascade',
          q: `Conflit artisans : stand à côté des toilettes.`,
          options: {
            steps: [
              {
                question: `Artisan potier furieux car son stand est à côté des toilettes. Première réaction ?`,
                responses: [
                  { id: 'A', text: 'Crier' },
                  { id: 'B', text: '« Je comprends votre frustration. Laissez-moi voir ce qu’on peut faire. »' }
                ],
                correct: 'B'
              },
              {
                question: `Pas de stand libre. Solution ?`,
                responses: [
                  { id: 'A', text: 'Ne rien faire' },
                  { id: 'B', text: 'Paravent décoratif + titre « Artisan d’honneur » dans la brochure.' }
                ],
                correct: 'B'
              },
              {
                question: `Mustapha demande une compensation financière. Réponse ?`,
                responses: [
                  { id: 'A', text: 'Payer' },
                  { id: 'B', text: '« Le titre + visibilité sont plus précieux. Vos ventes vont augmenter. »' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Validation + engagement. Solution créative. Négociation par les intérêts.`,
          neg: `« C’est le tirage au sort » aggrave le conflit. Ne rien faire est inacceptable. Refuser sèchement est perdant.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 6 erreurs dans le programme du festival.`,
          options: [
            { text_fr: 'Discours 45 min (trop long)', is_error: true },
            { text_fr: 'Tous ateliers même salle', is_error: true },
            { text_fr: 'Pas de menu alternatif', is_error: true },
            { text_fr: 'Jury = Nabil seul', is_error: true },
            { text_fr: 'Pas de remerciement artisans', is_error: true },
            { text_fr: '1 agent sécurité / 5 000 visiteurs', is_error: true }
          ],
          pos: `Audit complet. Mêmes erreurs de planification que le ministère (R2).`,
          neg: `Relisez : discours, capacité des salles, régimes alimentaires, biais du jury, reconnaissance, sécurité.`
        },
        {
          type: 'Contre-la-montre',
          q: `URGENCES : Visiteur fait un malaise. Action ?`,
          options: [
            { id: 'A', label_fr: 'Ombre + eau + Soukaina (secouriste)' },
            { id: 'B', label_fr: 'Attendre' }
          ],
          correct: 'A',
          pos: `Urgence médicale = protocole. Bon réflexe.`,
          neg: `Attendre ou appeler d’abord perd du temps. Agissez immédiatement.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque problème à la solution SDT (Autonomie, Compétence, Affiliation).`,
          options: [
            { left_fr: 'Bénévole démotivé', right_fr: 'Compétence' },
            { left_fr: 'Artisan frustré', right_fr: 'Autonomie' },
            { left_fr: 'Visiteur perdu', right_fr: 'Affiliation' }
          ],
          pos: `SDT appliquée au festival. Les 3 besoins sont universels.`,
          neg: `Révisez : compétence = reconnaissance, autonomie = liberté, affiliation = appartenance.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez le plan de communication de crise du festival.`,
          options: [
            { text: 'public' }, { text: 'canal' }, { text: 'timing' }, { text: 'empathie' },
            { text: 'transparence' }, { text: 'solution' }, { text: 'action' }
          ],
          correct: 'public, canal, timing, empathie, transparence, solution, action',
          pos: `Même protocole que le Wali (R5). Universel.`,
          neg: `Retenez : public, canal, timing, empathie, transparence, solution, action.`
        },
        {
          type: 'Scénario en cascade',
          q: `Dilemme éthique : Sponsor offre 50 000 DH.`,
          options: {
            steps: [
              {
                question: `Sponsor offre 50 000 DH pour exclure un artisan concurrent. Conseil ?`,
                responses: [
                  { id: 'A', text: 'Accepter' },
                  { id: 'B', text: 'Refuser le chantage. Chercher autre sponsor ou réduire budget.' }
                ],
                correct: 'B'
              },
              {
                question: `Sponsor menace : « Sans moi, pas de festival l’année prochaine. » Réponse ?`,
                responses: [
                  { id: 'A', text: 'Céder' },
                  { id: 'B', text: '« Un festival qui exclut perd sa crédibilité. C’est plus cher que 50 000 DH. »' }
                ],
                correct: 'B'
              },
              {
                question: `Sponsor part. Comment compenser 50 000 DH ?`,
                responses: [
                  { id: 'A', text: 'Annuler' },
                  { id: 'B', text: 'Crowdfunding communautaire + réduire coûts logistiques + contribution symbolique artisans.' }
                ],
                correct: 'B'
              }
            ]
          },
          pos: `Intégrité absolue. Argumentation stratégique. Pivot stratégique.`,
          neg: `Accepter le chantage détruit la crédibilité. Céder par peur est une erreur. Annuler ou emprunter sans plan est irresponsable.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un bilan (120-150 mots) : réussites, améliorations, recommandations pour le festival.`,
          correct: 'bilan festival',
          pos: `Bilan professionnel complet. Vous passez de stagiaire à analyste.`,
          neg: `Il manque une des trois sections ou des justifications.`
        },
        {
          type: 'Énigme',
          q: `« Je suis ce qui reste quand tu as tout appris et tout oublié. Aziz me voit dans la montagne, Khadija me tisse… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le savoir' },
            { id: 'B', label_fr: 'La compétence' },
            { id: 'C', label_fr: 'L’intelligence' },
            { id: 'D', label_fr: 'Le talent' }
          ],
          correct: 'B',
          pos: `Magnifique ! La compétence est le pont entre théorie (Rabat) et pratique (Chefchaouen).`,
          neg: `Relisez : « À Rabat tu m’as découverte, à Chefchaouen tu m’as vécue. » C’est la compétence.`
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      city_id: CHEF_CHALLENGE_PK,
      challenge_id: CHEF_CHALLENGE_PK,
      title_fr,
      description_fr,
      xp_reward: 1000,
      sort_order: parseInt(id.slice(-1)) || 1
    });

    if (mErr) { console.error(`Error upserting mission ${title_fr}:`, mErr); continue; }
    console.log(`✅ Mission ${title_fr} upserted`);

    // B. Delete existing questions for this mission
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
      }

      return {
        mission_id: id,
        question_type: type,
        question_fr: q.q,
        correct_answer: q.correct || null,
        options: optionsData || [],
        xp_reward: type === 'puzzle_riddle' ? 250 : 100,
        sort_order: idx + 1,
        feedback_positive_fr: q.pos,
        feedback_negative_fr: q.neg,
        explanation_fr: q.pos,
        hint_fr: q.neg,
        is_published: true,
        time_limit_sec: 45
      };
    });

    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) {
      console.error(`Error inserting questions for ${title_fr}:`, qErr);
    } else {
      console.log(`✅ 10 questions for ${id}`);
    }
  }

  console.log('🏁 Chefchaouen HIGH-FIDELITY import FINISHED!');
}

importChefchaouen();
