require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const FES_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440003';

const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
  F2: '550e8400-e29b-41d4-a716-44665544f222',
  F3: '550e8400-e29b-41d4-a716-44665544f333',
  F4: '550e8400-e29b-41d4-a716-44665544f444',
  F5: '550e8400-e29b-41d4-a716-44665544f555'
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

async function importFes() {
  console.log('🚀 Starting Fès (Acte III) import v4...');

  // 1. Upsert City (Challenge)
  const cityDescription = `# 🕌 ACTE III - FÈS : CAPITALE SPIRITUELLE ET INTELLECTUELLE

## 📖 Brief narratif
Ishaq analyse équipes, stress, décisions et systèmes avec des maîtres artisans, scientifiques et restaurateurs de la médina.

---

## 🏙️ Page de présentation de Fès

### 🎯 Ce que vous allez apprendre dans cette ville
Fès, plus vieille cité universitaire du monde, vous invite à **analyser** en profondeur : pourquoi les équipes échouent, comment le stress s’installe, pourquoi les décisions déraillent, et comment tradition et innovation coexistent.

### 📋 Les 5 missions

| Mission | Lieu | Soft skill dominant |
|---------|------|---------------------|
| F1 | Atelier de calligraphie | Travail en équipe (analyse) |
| F2 | Tanneries Chouara | Gestion du stress (analyse) |
| F3 | Université Sidi Mohamed Ben Abdellah | Prise de décision (analyse) |
| F4 | Medersa Bou Inania | Analyse systémique |
| F5 | Festival de Fès | Synthèse analytique |

### 🧠 Compétences clés de cette ville
- Analyser les dysfonctions d’équipe (Lencioni)
- Maîtriser l’analyse causale des conflits
- Appliquer le modèle du fromage suisse (Reason)
- Diagnostiquer le stress chronique avec Selye
- Éviter le Groupthink (Janis)
- Utiliser l’analyse du chemin critique (CPM)
- Résoudre des dilemmes éthiques complexes
- Pratiquer la pensée systémique (Senge)
- Cartographier les parties prenantes (Freeman)`;

  const { error: cityErr } = await supabase.from('challenges').upsert({
    id: FES_CHALLENGE_PK,
    city_id: 'fes',
    city_name_fr: 'Fès',
    city_name_ar: 'فاس',
    headline_fr: `🕌 ACTE III - FÈS : CAPITALE SPIRITUELLE ET INTELLECTUELLE`,
    description_fr: cityDescription,
    sort_order: 3,
    is_published: true,
    city_color: '#1e40af',
    icon_name: 'landmark'
  });

  if (cityErr) { console.error('City Error:', cityErr); return; }
  console.log('✅ City Fès upserted');

  const missionsData = [
    {
      id: MISSION_IDS.F1,
      title_fr: 'Mission F1 : L’Atelier de calligraphie',
      description_fr: `Lieu: Atelier de calligraphie. Soft skill: Travail en équipe (analyse). Ishaq analyse les équipes avec des maîtres artisans.`,
      questions: [
        {
          type: 'QCM',
          q: `Quel est le principal avantage du modèle maître-apprenti par rapport à un cours théorique ?`,
          options: [
            { id: 'A', label_fr: 'Le maître est plus intelligent' },
            { id: 'B', label_fr: 'L’apprenti ne paie pas' },
            { id: 'C', label_fr: 'L’apprentissage se fait dans la pratique réelle, avec feedback immédiat et progressif.' },
            { id: 'D', label_fr: 'C’est plus rapide' }
          ],
          correct: 'C',
          pos: `Analyse correcte ! Pratique réelle, feedback immédiat, progressivité = ZPD de Vygotsky.`,
          neg: `Non. Le maître n’est pas plus intelligent, juste plus expérimenté. L’avantage est la pratique contextualisée.`
        },
        {
          type: 'Appariement',
          q: `Relie chaque situation à la dysfonction Lencioni.`,
          options: [
            { left_fr: 'Hamid cache ses erreurs par peur', right_fr: 'Absence de confiance' },
            { left_fr: 'Les compagnons évitent de critiquer', right_fr: 'Peur du conflit sain' },
            { left_fr: 'Samir ne se sent pas concerné par les délais', right_fr: 'Évitement de la responsabilité' },
            { left_fr: 'Chacun travaille pour soi', right_fr: 'Inattention aux résultats' },
            { left_fr: 'Kamal refuse de s’engager sur un résultat', right_fr: 'Manque d’engagement' }
          ],
          pos: `Analyse parfaite ! Pyramide Lencioni : confiance → conflit → engagement → responsabilité → résultats.`,
          neg: `Vérifiez : 1=confiance, 2=conflit, 3=responsabilité, 4=résultats, 5=engagement.`
        },
        {
          type: 'Dialogue de situation',
          q: `Hamid a travaillé 3 mois, le maître dit « insuffisant, recommence ». Hamid démissionne. Quelle est la cause profonde ?`,
          options: [
            { id: 'A', label_fr: 'Hamid est paresseux' },
            { id: 'B', label_fr: `Manque de feedback progressif : 3 mois sans retour, puis critique totale = choc émotionnel.` },
            { id: 'C', label_fr: 'Le maître est trop sévère' },
            { id: 'D', label_fr: 'C’est normal dans l’artisanat' }
          ],
          correct: 'B',
          pos: `Analyse systémique ! Absence feedback intermédiaire, négatif uniquement, disproportion effort/reconnaissance.`,
          neg: `Ne réduisez pas au caractère. La cause est dans la méthode : feedback trop rare et brutal.`
        },
        {
          type: 'Scénario en cascade',
          q: `Analyse des conflits d'équipe.`,
          options: {
            steps: [
              {
                question: `2 compagnons refusent de travailler ensemble. Selon Tuckman, quel type de conflit ?`,
                responses: [
                  { id: 'A', text: 'Forming' },
                  { id: 'B', text: 'Storming (tempête)' }
                ],
                correct: 'B',
                pos: `Diagnostic juste. L’équipe est en phase Storming : conflits ouverts, rôles non clarifiés.`,
                neg: `Non. C’est Storming (tempête), pas Forming ni Norming.`
              },
              {
                question: `Pourquoi Kamal (qualité) et Samir (rapidité) sont en conflit ?`,
                responses: [
                  { id: 'A', text: 'Ils ne s\'aiment pas' },
                  { id: 'B', text: 'Divergence d\'opinions' },
                  { id: 'C', text: 'Conflit de rôles Belbin (Analyste vs Réalisateur), pas de personnes.' }
                ],
                correct: 'C',
                pos: `Analyse profonde ! 70% des conflits d’équipe sont des conflits de rôles déguisés.`,
                neg: `Ce n’est pas personnel. Ce sont des valeurs opposées : qualité vs rapidité.`
              },
              {
                question: `Solution structurelle ?`,
                responses: [
                  { id: 'A', text: 'Les séparer' },
                  { id: 'B', text: 'Forcer l\'un à changer' },
                  { id: 'C', text: 'Kamal contrôle qualité, Samir produit. Complémentarité.' }
                ],
                correct: 'C',
                pos: `Résolution systémique ! Transformer conflit en synergie par restructuration des rôles.`,
                neg: `Les séparer ou forcer l’un à changer ne résout rien. Créez de la complémentarité.`
              }
            ]
          }
        },
        {
          type: 'Vrai/Faux',
          q: `Évaluez ces affirmations sur le leadership et l'artisanat.`,
          options: [
            { text: `« Le meilleur artisan fait automatiquement le meilleur leader. »`, correct: 'faux', pos: `Compétence technique ≠ compétence managériale. Principe de Peter.`, neg: `Faux. Un bon artisan n’est pas forcément un bon manager. Deux compétences distinctes.` },
            { text: `« Un conflit d’idées peut améliorer la qualité. »`, correct: 'vrai', pos: `Vrai. Conflit de tâches = constructif. Conflit relationnel = destructif.`, neg: `Si bien géré, le débat d’idées améliore les solutions. Évitez le conformisme.` },
            { text: `« Le modèle maître-apprenti est obsolète à l’ère numérique. »`, correct: 'faux', pos: `Faux. Le mentoring, code review, pair programming sont des formes modernes du même modèle.`, neg: `Les meilleures entreprises tech utilisent le mentorat intensif. Le principe reste valide.` }
          ]
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 6 erreurs dans le rapport de l’atelier « Calligraphie moderne ».`,
          options: [
            { text_fr: 'Pas de hiérarchie', is_error: true },
            { text_fr: 'Aucune spécialisation', is_error: true },
            { text_fr: 'Feedback annuel', is_error: true },
            { text_fr: 'Recrutement sur diplômes sans essai', is_error: true },
            { text_fr: '2 jours théorie puis production', is_error: true },
            { text_fr: 'Turnover 80% (conséquence)', is_error: true },
            { text_fr: 'Structure hiérarchique claire', is_error: false }
          ],
          pos: `Analyse systémique ! Chaque erreur est expliquée avec sa conséquence. Pensée Senge.`,
          neg: `Relisez : structure, spécialisation, feedback, recrutement, progression, turnover.`
        },
        {
          type: 'Classement',
          q: `Classez les 7 éléments par priorité de transmission.`,
          options: [
            { label_fr: 'Éthique' },
            { label_fr: 'Philosophie' },
            { label_fr: 'Enseigner' },
            { label_fr: 'Geste' },
            { label_fr: 'Gestion' },
            { label_fr: 'Client' },
            { label_fr: 'Innovation' }
          ],
          pos: `Analyse hiérarchique ! Valeurs d’abord, pérennité, opérationnel, puis innovation.`,
          neg: `L’éthique et la philosophie viennent avant la technique et l’innovation. Revoir l’ordre.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les concepts du modèle de Lave & Wenger.`,
          options: [
            { text: 'communauté' }, { text: 'pratique' }, { text: 'participation' }, { text: 'périphérique' }, { text: 'légitime' }, { text: 'observation' }, { text: 'participation' }, { text: 'identité' }
          ],
          correct: 'communauté, pratique, participation, périphérique, légitime, observation, participation, identité',
          pos: `Théorie maîtrisée ! Participation périphérique légitime = observer puis agir.`,
          neg: `Retenez : communauté de pratique, participation périphérique légitime, observation, participation, identité.`
        },
        {
          type: 'Réponse courte',
          q: `Analysez le leadership de Maître Idris (100-130 mots) : forces, faiblesses, recommandation.`,
          pos: `Analyse critique exceptionnelle ! Vous avez évalué une autorité avec rigueur et respect.`,
          neg: `Il manque une dimension : forces, faiblesses ou recommandation. Ajoutez des références théoriques.`
        },
        {
          type: 'Énigme',
          q: `« Je suis l’outil que personne ne voit mais que tous utilisent. Lencioni me place à la base… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'Le respect' },
            { id: 'B', label_fr: 'La confiance' },
            { id: 'C', label_fr: 'L’autorité' },
            { id: 'D', label_fr: 'La compétence' }
          ],
          correct: 'B',
          pos: `Exact ! La confiance est la base de la pyramide Lencioni. Sans elle, tout s’effondre.`,
          neg: `Relisez : « Sans moi les rois tombent, les équipes se déchirent. » C’est la confiance.`
        }
      ]
    },
    {
      id: MISSION_IDS.F2,
      title_fr: 'Mission F2 : Les Tanneries Chouara',
      description_fr: `Lieu: Tanneries Chouara. Soft skill: Gestion du stress (analyse). Diagnostiquer le stress chronique avec Selye.`,
      questions: [
        {
          type: 'QCM',
          q: `Différence principale entre le stress de Dr. Karim (urgences) et celui de Saïd (tanneries) ?`,
          options: [
            { id: 'A', label_fr: 'Le stress médical est plus grave' },
            { id: 'B', label_fr: `Dr. Karim subit un stress aigu intense (pics courts), Saïd un stress chronique modéré (constant).` },
            { id: 'C', label_fr: 'Ils n’ont rien en commun' },
            { id: 'D', label_fr: 'Ils sont identiques' }
          ],
          correct: 'B',
          pos: `Analyse comparative juste ! Intensité × durée : aigu vs chronique, mécanismes différents.`,
          neg: `Non. L’un est intense et court, l’autre modéré et constant. Les deux sont dangereux.`
        },
        {
          type: 'Appariement',
          q: `Reliez chaque source de stress à sa catégorie et conséquence.`,
          options: [
            { left_fr: 'Posture penchée', right_fr: 'Ergonomique (TMS)' },
            { left_fr: 'Odeurs chimiques', right_fr: 'Chimique (respiratoire)' },
            { left_fr: 'Soleil direct', right_fr: 'Environnemental (insolation)' },
            { left_fr: 'Gestes répétitifs', right_fr: 'Biomécanique (canal carpien)' },
            { left_fr: 'Isolation sociale', right_fr: 'Psychosocial (dépression)' },
            { left_fr: 'Revenus instables', right_fr: 'Financier (anxiété)' }
          ],
          pos: `Analyse multi-dimensionnelle ! 6 types de stress dans un même lieu.`,
          neg: `Vérifiez : ergonomique, chimique, environnemental, biomécanique, psychosocial, financier.`
        },
        {
          type: 'Scénario en cascade',
          q: `Analyse d'un accident de travail.`,
          options: {
            steps: [
              {
                question: `Cause immédiate de la chute dans la cuve ?`,
                responses: [
                  { id: 'A', text: 'Maladresse' },
                  { id: 'B', text: 'Sol glissant' },
                  { id: 'C', text: 'Multi-facteurs : sol mouillé + fatigue + chaussures inadaptées + éclairage faible.' }
                ],
                correct: 'C',
                pos: `Analyse multicausale ! Modèle du fromage suisse (Reason). Jamais une seule cause.`,
                neg: `Un accident n’a jamais une seule cause. Cherchez l’accumulation de facteurs.`
              },
              {
                question: `Cause systémique (3 chutes ce mois) ?`,
                responses: [
                  { id: 'A', text: 'Imprudence des tanneurs' },
                  { id: 'B', text: 'Pas de protocole sécurité, formation, équipement, signalisation. Le système ne protège pas.' }
                ],
                correct: 'B',
                pos: `Cause systémique identifiée ! Le problème est dans l’organisation, pas dans les individus.`,
                neg: `Ce n’est pas l’imprudence des tanneurs. C’est l’absence de système de protection.`
              },
              {
                question: `Plan d’amélioration ?`,
                responses: [
                  { id: 'A', text: 'Punition' },
                  { id: 'B', text: 'Changement de bottes' },
                  { id: 'C', text: '4 niveaux : équipement, environnement, formation, culture (signalement sans punition).' }
                ],
                correct: 'C',
                pos: `Analyse sécurité parfaite ! 4 niveaux de défense Reason : individuel, physique, procédural, culturel.`,
                neg: `Punir ne résout rien. Il faut agir sur l’équipement, l’environnement, la formation et la culture.`
              }
            ]
          }
        },
        {
          type: 'Dialogue de situation',
          q: `Saïd a eu une brûlure chimique, médecins disaient « tu ne pourras plus tanner ». Quel pilier de Cyrulnik a été déterminant ?`,
          options: [
            { id: 'A', label_fr: 'Humour' },
            { id: 'B', label_fr: `Sens (« Ma famille avait besoin de moi »)` },
            { id: 'C', label_fr: 'Corps' },
            { id: 'D', label_fr: 'Spiritualité' }
          ],
          correct: 'B',
          pos: `Analyse juste ! « Celui qui a un pourquoi peut supporter n’importe quel comment » (Frankl).`,
          neg: `Le sens est le pilier le plus prédictif de la résilience. Pas l’humour ni le corps seul.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Identifiez les 5 erreurs dans le planning de Saïd.`,
          options: [
            { text_fr: '5h continues sans pause', is_error: true },
            { text_fr: '« Je bois quand j’ai soif » (déjà déshydraté)', is_error: true },
            { text_fr: 'Pas de gants', is_error: true },
            { text_fr: 'Pause 15 min pour 11h', is_error: true },
            { text_fr: '« Les étirements c’est pour les jeunes »', is_error: true },
            { text_fr: 'Hydratation régulière', is_error: false }
          ],
          pos: `Analyse ergonomique ! Mêmes patterns que burnout mental : pauses, déni, auto-négligence.`,
          neg: `Relisez : pauses, hydratation, protection, durée de pause, étirements.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 3 phases du Syndrome général d’adaptation (Selye).`,
          options: [
            { text: 'alarme' }, { text: 'cortisol' }, { text: 'résistance' }, { text: 'adaptation' }, { text: 'limité' }, { text: 'épuisement' }, { text: 'chronique' }, { text: 'récupération' }
          ],
          correct: 'alarme, cortisol, résistance, adaptation, limité, épuisement, chronique, récupération',
          pos: `Modèle Selye maîtrisé ! Alarme → résistance → épuisement. L’adaptation est un état limité.`,
          neg: `Retenez : alarme (choc), résistance (adaptation), épuisement (si stress chronique sans récupération).`
        },
        {
          type: 'Contre-la-montre',
          q: `Rapid-fire analysis aux tanneries.`,
          options: {
            steps: [
              {
                question: `Un tanneur travaille 14h/jour depuis 3 mois sans vacances. À quelle phase Selye ?`,
                responses: [{id:'A',text:'Alarme'},{id:'B',text:'Transition Résistance → Épuisement'}],
                correct: 'B',
                pos: `Bon diagnostic. L’adaptation a ses limites, l’épuisement approche.`,
                neg: `Ce n’est plus l’alarme. C’est la fin de la résistance.`
              },
              {
                question: `Pourquoi les tanneurs résistent au changement (gants, pauses) ?`,
                responses: [{id:'A',text:'Habitude + pression + culture + absence d\'alternative'},{id:'B',text:'Entêtement pure'}],
                correct: 'A',
                pos: `Analyse multicausale ! Pas juste « ils sont têtus ».`,
                neg: `Ce n’est pas de l’entêtement. Facteurs : habitude, pression, culture, manque d’alternatives.`
              },
              {
                question: `25 ans vs 55 ans, même planning. Qui est le plus en danger ?`,
                responses: [{id:'A',text:'Le jeune'},{id:'B',text:'L’ancien (corps usé + accumulation)'}],
                correct: 'B',
                pos: `Juste. L’accumulation sur 30 ans use le corps même avec adaptation.`,
                neg: `L’expérience protège, mais l’usure cumulative est dangereuse. L’ancien est plus à risque.`
              },
              {
                question: `Lien entre stress physique et stress mental de bureau ?`,
                responses: [{id:'A',text:'Mêmes mécanismes neurobiologiques (cortisol)'},{id:'B',text:'Aucun lien'}],
                correct: 'A',
                pos: `Analyse transversale ! Le stress est un phénomène universel, seul le contexte change.`,
                neg: `Les mécanismes biologiques sont les mêmes. Le cortisol ne fait pas de différence.`
              }
            ]
          }
        },
        {
          type: 'Prise de décision',
          q: `Moderniser ou préserver les tanneries ?`,
          options: [
            { id: 'A', label_fr: 'Tout moderniser' },
            { id: 'B', label_fr: 'Ne rien changer' },
            { id: 'C', label_fr: 'Moderniser la protection (gants, drainage, ventilation) mais garder les techniques traditionnelles.' }
          ],
          correct: 'C',
          pos: `Analyse dialectique ! Synthèse : protéger la santé sans détruire l’authenticité.`,
          neg: `Le tout moderne ou la tradition pure sont des impasses. La 3ème voie est possible.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un rapport d’analyse (100-130 mots) : 3 risques, 3 solutions, 1 priorité.`,
          pos: `Rapport analytique professionnel ! Vous passez de stagiaire à analyste.`,
          neg: `Il manque un élément : risques, solutions ou priorité argumentée.`
        },
        {
          type: 'Énigme',
          q: `« Je suis invisible dans le corps mais je sculpte les visages. Selye m’a cartographié… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La fatigue' },
            { id: 'B', label_fr: 'Le stress' },
            { id: 'C', label_fr: 'La douleur' },
            { id: 'D', label_fr: 'L’anxiété' }
          ],
          correct: 'B',
          pos: `Le stress, vu sous un nouvel angle : ni bon ni mauvais, c’est un phénomène à analyser.`,
          neg: `Relisez : « Selye m’a cartographié, Dr. Karim m’a combattu, Aziz m’a apprivoisé. » C’est le stress.`
        }
      ]
    },
    {
      id: MISSION_IDS.F3,
      title_fr: 'Mission F3 : L’Université – Prise de décision analytique',
      description_fr: `Lieu: Université Sidi Mohamed Ben Abdellah. Soft skill: Prise de décision (analyse). Éviter le Groupthink (Janis).`,
      questions: [
        {
          type: 'QCM',
          q: `Un comité de 8 personnes. Le président dit « excellente idée », personne ne s’oppose, mais 3 ont des doutes. Quel type d’erreur ?`,
          options: [
            { id: 'A', label_fr: 'Erreur cognitive' },
            { id: 'B', label_fr: 'Erreur informationnelle' },
            { id: 'C', label_fr: 'Erreur sociale (conformité de groupe / Groupthink)' },
            { id: 'D', label_fr: 'Pas d’erreur' }
          ],
          correct: 'C',
          pos: `Groupthink (Janis). Le leader s’exprime en premier, les autres se taisent.`,
          neg: `Ce n’est pas un biais cognitif classique. C’est la pression sociale du groupe.`
        },
        {
          type: 'Scénario en cascade',
          q: `Analyse d'un échec d'investissement.`,
          options: {
            steps: [
              {
                question: `Coopérative de 500 artisans : investir 2M DH dans e-commerce. Échec. Phase de collecte d’information ?`,
                responses: [
                  { id: 'A', text: 'Suffisante' },
                  { id: 'B', text: 'Données manquantes : compétences, coûts, concurrence, habitudes clients.' }
                ],
                correct: 'B',
                pos: `Phase 2 Simon (Collecter) bâclée. La décision a échoué avant d’être prise.`,
                neg: `L’information n’était pas complète. Plusieurs données critiques manqualient.`
              },
              {
                question: `Pourquoi le vote 60/40 a échoué ?`,
                responses: [
                  { id: 'A', text: 'Biais de disponibilité + pression du jeunisme + Groupthink.' },
                  { id: 'B', text: 'Malchance' }
                ],
                correct: 'A',
                pos: `Analyse psychosociale. Les biais ont influencé le vote, pas la raison.`,
                neg: `La majorité n’a pas toujours raison. Des biais ont faussé le vote.`
              },
              {
                question: `Quelle décision aurait dû être prise ?`,
                responses: [
                  { id: 'A', text: 'Tout investir' },
                  { id: 'B', text: 'Phase pilote 6 mois avec 10% du budget pour tester.' }
                ],
                correct: 'B',
                pos: `Lean Startup ! Tester petit avant d’investir grand. MVP, mesure, pivot ou persévère.`,
                neg: `Le tout ou rien est risqué. Un test pilote aurait évité la catastrophe.`
              }
            ]
          }
        },
        {
          type: 'Appariement',
          q: `Reliez chaque décision au biais correspondant.`,
          options: [
            { left_fr: 'Tramway car Rabat en a un', right_fr: 'Conformité' },
            { left_fr: '« Mon père vendait à ce prix »', right_fr: 'Ancrage' },
            { left_fr: 'Choisir l’artisan médiatique', right_fr: 'Halo' },
            { left_fr: 'Refuser tous touristes étrangers après un vol', right_fr: 'Généralisation' },
            { left_fr: 'Copier menu voisin', right_fr: 'Imitation' }
          ],
          pos: `Analyse contextualisée des biais ! Vous passez de « qu’est-ce qu’un biais » à « où sont-ils ».`,
          neg: `Vérifiez : conformité, ancrage, halo, généralisation, imitation.`
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 6 erreurs méthodologiques dans l’étude de marché.`,
          options: [
            { text_fr: 'Échantillon 15 amis', is_error: true },
            { text_fr: '1 jour dimanche', is_error: true },
            { text_fr: '« 100% disent oui » (complaisance)', is_error: true },
            { text_fr: '« Tout le monde veut » (généralisation)', is_error: true },
            { text_fr: '« Mon instinct » (surconfiance)', is_error: true },
            { text_fr: '3M DH sans business plan', is_error: true },
            { text_fr: 'Analyse FFOM complète', is_error: false }
          ],
          pos: `Audit méthodologique impeccable ! Vous questionnez la qualité des données, pas seulement leur présence.`,
          neg: `Relisez : taille échantillon, période, biais de complaisance, généralisation, surconfiance, absence de plan.`
        },
        {
          type: 'Classement',
          q: `Classez les 7 facteurs de succès par importance.`,
          options: [
            { label_fr: 'Qualité' },
            { label_fr: 'Adaptation' },
            { label_fr: 'Réseau' },
            { label_fr: 'Coûts' },
            { label_fr: 'Bien-être' },
            { label_fr: 'Transmission' },
            { label_fr: 'Innovation' }
          ],
          pos: `Analyse stratégique hiérarchique ! Court terme → moyen terme → long terme.`,
          neg: `La qualité est la base. L’innovation vient après avoir maîtrisé la tradition.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 8 étapes du processus anti-Groupthink.`,
          options: [
            { text: 'définir' }, { text: 'collecter' }, { text: 'générer' }, { text: 'évaluer' }, { text: 'choisir' }, { text: 'agir' }, { text: 'feedback' }, { text: 'groupthink' }
          ],
          correct: 'définir, collecter, générer, évaluer, choisir, agir, feedback, groupthink',
          pos: `Simon enrichi ! Ajout du feedback et du mécanisme anti-Groupthink (avocat du diable).`,
          neg: `Retenez les 8 étapes : définir, collecter, générer, évaluer, choisir, agir, feedback, anti-groupthink.`
        },
        {
          type: 'Dialogue de situation',
          q: `Un commerçant copie son voisin (même produit, prix, déco) et échoue. Pourquoi ?`,
          options: [
            { id: 'A', label_fr: 'Le voisin était plus chanceux' },
            { id: 'B', label_fr: `Il n’a pas analysé les différences : clientèle distincte, emplacement, relation de confiance.` },
            { id: 'C', label_fr: 'C’est la faute du voisin' },
            { id: 'D', label_fr: 'Il faut copier plus fort' }
          ],
          correct: 'B',
          pos: `Imiter sans analyser = échec. Analyser pour adapter = océan bleu.`,
          neg: `Ce n’est pas la chance. Il a copié sans comprendre le contexte spécifique.`
        },
        {
          type: 'Contre-la-montre',
          q: `Détection de biais au quart de tour.`,
          options: {
            steps: [
              {
                question: `« Je n’ai pas de clients car tout le monde est pauvre. » Biais ?`,
                responses: [{id:'A',text:'Biais d’attribution externe'},{id:'B',text:'Biais de confirmation'}],
                correct: 'A',
                pos: `Juste. Il attribue l’échec à des facteurs externes plutôt qu’à ses propres actions.`,
                neg: `C’est un biais d’attribution externe. Il rejette la faute sur l’environnement.`
              },
              {
                question: `« Je vais demander à 10 amis ce qu’ils pensent. » Problème ?`,
                responses: [{id:'A',text:'Échantillon parfait'},{id:'B',text:'Biais de sélection (amis = complaisants)'}],
                correct: 'B',
                pos: `Biais de sélection. Les amis ne sont pas un échantillon représentatif.`,
                neg: `Les amis ont tendance à être complaisants. L’échantillon est biaisé.`
              },
              {
                question: `« On a toujours fait comme ça, donc c’est bien. » Biais ?`,
                responses: [{id:'A',text:'Biais du statu quo'},{id:'B',text:'Biais d\'ancrage'}],
                correct: 'A',
                pos: `Biais du statu quo. La tradition n’est pas une justification de qualité.`,
                neg: `C’est le biais du statu quo : préférer ce qui est familier sans l’évaluer.`
              },
              {
                question: `« J’investis tout mon argent dans ce projet. » Risque ?`,
                responses: [{id:'A',text:'Confiance totale'},{id:'B',text:'Absence de diversification (risque ruine)'}],
                correct: 'B',
                pos: `Risque de ruine. Ne jamais mettre tous ses œufs dans le même panier.`,
                neg: `C’est un manque de diversification. En cas d’échec, tout est perdu.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Rédigez une recommandation (120-150 mots) pour la coopérative sur l’investissement e-commerce avec les 8 étapes anti-Groupthink.`,
          pos: `Processus décisionnel renforcé maîtrisé ! Test pilote, données, avocat du diable.`,
          neg: `Il manque un élément : définition du problème, collecte diversifiée, options, évaluation, choix, action, feedback, anti-groupthink.`
        },
        {
          type: 'Énigme',
          q: `« Je suis ce que tu ne vois pas dans les chiffres que tu lis. Kahneman m’a traqué… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’erreur' },
            { id: 'B', label_fr: 'Le biais cognitif' },
            { id: 'C', label_fr: 'L’illusion' },
            { id: 'D', label_fr: 'La heuristique' }
          ],
          correct: 'B',
          pos: `Exact ! Les biais cognitifs sont invisibles mais font échouer les meilleures décisions.`,
          neg: `Relisez : « Je me cache derrière les certitudes. » C’est le biais cognitif.`
        }
      ]
    },
    {
      id: MISSION_IDS.F4,
      title_fr: 'Mission F4 : Restauration de la Medersa Bou Inania',
      description_fr: `Lieu: Medersa Bou Inania. Soft skill: Analyse systémique (Senge). Gérer la complexité et le chemin critique (CPM).`,
      questions: [
        {
          type: 'QCM',
          q: `Pourquoi la restauration d’un monument est-elle plus complexe que la construction d’un bâtiment neuf ?`,
          options: [
            { id: 'A', label_fr: 'Il est vieux' },
            { id: 'B', label_fr: 'Artisans moins compétents' },
            { id: 'C', label_fr: `Préserver l’authenticité + respecter normes modernes + coordonner experts + anticiper l’imprévisible.` },
            { id: 'D', label_fr: 'Règles UNESCO trop strictes' }
          ],
          correct: 'C',
          pos: `Cynefin : complexe vs compliqué. Interactions imprévisibles, pas seulement beaucoup d’étapes.`,
          neg: `Ce n’est pas seulement l’âge. C’est la combinaison de 4 dimensions.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Identifiez le chemin critique dans la chaîne d’interdépendances.`,
          options: [
            { left_fr: 'Historien', right_fr: 'Étape 1' },
            { left_fr: 'Chimiste', right_fr: 'Étape 2' },
            { left_fr: 'Maçon', right_fr: 'Étape 3' },
            { left_fr: 'Zelligeur', right_fr: 'Étape 4' },
            { left_fr: 'Sculpteur', right_fr: 'Étape 5' }
          ],
          pos: `Analyse CPM parfaite ! Le retard d’un maillon retarde tout le projet.`,
          neg: `Le chemin critique est la plus longue chaîne d’interdépendances. Recalculez.`
        },
        {
          type: 'Scénario en cascade',
          q: `Dilemme des pigments.`,
          options: {
            steps: [
              {
                question: `Pigments originaux au plomb (toxiques) vs modernes. Type de dilemme ?`,
                responses: [
                  { id: 'A', text: 'Technique simple' },
                  { id: 'B', text: 'Dilemme éthique complexe : deux valeurs légitimes s’opposent (patrimoine vs santé).' }
                ],
                correct: 'B',
                pos: `Classification juste. Ce n’est pas un problème simple ou technique.`,
                neg: `Ce n’est ni simple ni faux. Deux bonnes valeurs s’opposent.`
              },
              {
                question: `Solution analytique ?`,
                responses: [
                  { id: 'A', text: 'Prioriser la santé (moderne)' },
                  { id: 'B', text: 'Pigments modernes imitant les originaux + documentation scientifique de la substitution.' }
                ],
                correct: 'B',
                pos: `3ème voie ! Synthèse entre authenticité (aspect) et sécurité (composition).`,
                neg: `Ni tout plomb ni tout moderne. Une solution hybride existe.`
              },
              {
                question: `Qui doit décider ?`,
                responses: [
                  { id: 'A', text: 'L\'architecte' },
                  { id: 'B', text: 'Comité pluridisciplinaire (architecte, chimiste, historien, UNESCO, autorité sanitaire).' }
                ],
                correct: 'B',
                pos: `Gouvernance plurielle. Pas un décideur unique, un collectif légitime.`,
                neg: `Un seul expert ne peut pas trancher un dilemme aussi complexe.`
              }
            ]
          }
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 7 erreurs dans le plan de restauration rejeté.`,
          options: [
            { text_fr: 'Une seule phase', is_error: true },
            { text_fr: 'Ciment Portland (incompatible)', is_error: true },
            { text_fr: '1 chef pour 15 personnes', is_error: true },
            { text_fr: 'Pas de documentation', is_error: true },
            { text_fr: 'Budget sans imprévu', is_error: true },
            { text_fr: '12h/jour', is_error: true },
            { text_fr: 'Décisions par l’architecte seul', is_error: true },
            { text_fr: 'Matériaux certifiés UNESCO', is_error: false }
          ],
          pos: `Analyse multi-niveaux : technique, managérial, procédural, financier, humain, patrimonial.`,
          neg: `Relisez : phasage, matériaux, span of control, documentation, marge, horaires, gouvernance.`
        },
        {
          type: 'Texte à trous',
          q: `Complétez les 7 principes de la Charte de Venise.`,
          options: [
            { text: 'minimalisme' }, { text: 'réversibilité' }, { text: 'compatibilité' }, { text: 'authenticité' }, { text: 'documentation' }, { text: 'phasage' }, { text: 'interdisciplinaire' }
          ],
          correct: 'minimalisme, réversibilité, compatibilité, authenticité, documentation, phasage, interdisciplinaire',
          pos: `Principes patrimoniaux universels. Applicables au management et à la tech.`,
          neg: `Retenez : minimalisme, réversibilité, compatibilité, authenticité, documentation, phasage, interdisciplinaire.`
        },
        {
          type: 'Dialogue de situation',
          q: `Zelligeur refuse techniques modernes. Solution ?`,
          options: [
            { id: 'A', label_fr: 'L\'obliger' },
            { id: 'B', label_fr: 'Artisan conserve la surface visible, architecte impose la structure cachée + documentation.' }
          ],
          correct: 'B',
          pos: `Solution systémique ! Répartition des couches de décision selon l’expertise.`,
          neg: `Imposer ou laisser faire totalement ne résout pas. Un compromis structuré est possible.`
        },
        {
          type: 'Classement',
          q: `Classez 8 zones par urgence × importance × irréversibilité.`,
          options: [
            { label_fr: 'Fondations' },
            { label_fr: 'Toiture' },
            { label_fr: 'Murs porteurs' },
            { label_fr: 'Mosaïques extérieures' },
            { label_fr: 'Stuc intérieur' },
            { label_fr: 'Bois cèdre' },
            { label_fr: 'Fontaines' },
            { label_fr: 'Sols' }
          ],
          pos: `Analyse tricritère ! Vous avez dépassé Eisenhower (2 dimensions) pour 3 dimensions.`,
          neg: `Les fondations et la toiture passent avant l’esthétique. Structure d’abord.`
        },
        {
          type: 'Contre-la-montre',
          q: `Analyse flash des causes.`,
          options: {
            steps: [
              {
                question: `Carreaux trop serrés. Cause systémique ?`,
                responses: [{id:'A',text:'Formation insuffisante sur la dilatation thermique.'},{id:'B',text:'Maladresse'}],
                correct: 'A',
                pos: `Cause systémique, pas maladresse. La formation manque.`,
                neg: `Ce n’est pas de la maladresse. C’est un manque de connaissance technique.`
              },
              {
                question: `Bois de cèdre fissuré. Cause ?`,
                responses: [{id:'A',text:'Bois de mauvaise qualité'},{id:'B',text:'Mauvais séchage avant pose (humidité résiduelle)'}],
                correct: 'B',
                pos: `Cause technique. Le bois n’était pas assez sec.`,
                neg: `Mauvaise qualité ? Non, mauvaise préparation.`
              },
              {
                question: `3 accidents en 2 mois. Cause ?`,
                responses: [{id:'A',text:'Absence de système de prévention'},{id:'B',text:'Malchance'}],
                correct: 'A',
                pos: `Accumulation de facteurs. Reason encore.`,
                neg: `Ce n’est pas l’imprudence. C’est l’absence de système de prévention.`
              },
              {
                question: `Budget explose (+40%). Cause ?`,
                responses: [{id:'A',text:'Mauvais pilotage budgétaire'},{id:'B',text:'Vol de matériaux'}],
                correct: 'A',
                pos: `Défaut de gestion de projet. Suivi et marge absents.`,
                neg: `Ce n’est pas la malveillance. C’est l’absence de pilotage budgétaire.`
              }
            ]
          }
        },
        {
          type: 'Réponse courte',
          q: `Rédigez un rapport analytique (120-150 mots) sur les forces et faiblesses du projet, avec 3 recommandations.`,
          pos: `Analyse systémique complète ! Forces, faiblesses, recommandations argumentées.`,
          neg: `Il manque une section : forces, faiblesses ou recommandations.`
        },
        {
          type: 'Énigme',
          q: `« Je suis vieille de 700 ans mais neuve chaque matin. Je tombe si tu me forces… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'La pierre' },
            { id: 'B', label_fr: 'La tradition' },
            { id: 'C', label_fr: 'L’histoire' },
            { id: 'D', label_fr: 'La culture' }
          ],
          correct: 'B',
          pos: `La tradition se renouvelle par l’analyse. La restaurer sans la transformer.`,
          neg: `Indice : « Youssef me restaure sans me transformer. » C’est la tradition.`
        }
      ]
    },
    {
      id: MISSION_IDS.F5,
      title_fr: 'Mission F5 : Le Festival – Défi Final Fès',
      description_fr: `Lieu: Festival de Fès. Soft skill: Synthèse analytique. Cartographier les parties prenantes (Freeman).`,
      questions: [
        {
          type: 'Prise de décision',
          q: `30 min avant l’inauguration : 3 problèmes (Ministre annule, corporations rivales, sono en panne). Classez par priorité.`,
          options: [
            { id: 'A', label_fr: 'Sono → Conflit → Ministre' },
            { id: 'B', label_fr: 'Conflit → Sono → Ministre' },
            { id: 'C', label_fr: 'Ministre → Conflit → Sono' }
          ],
          correct: 'B',
          pos: `Priorisation multicritère ! Instabilité du conflit > réparable technique > gérable politique.`,
          neg: `Le conflit humain est instable et escalade. La sono est réparable. Le ministre est gérable.`
        },
        {
          type: 'Scénario en cascade',
          q: `Gestion des conflits inter-corporations.`,
          options: {
            steps: [
              {
                question: `Conflit zelligeurs vs tanneurs sur l’eau depuis 50 ans. Vrai objet ?`,
                responses: [
                  { id: 'A', text: 'L\'eau' },
                  { id: 'B', text: 'Statut et pouvoir. L’eau est le prétexte.' }
                ],
                correct: 'B',
                pos: `Analyse en couches : surface (eau) vs profondeur (statut) vs structure (gouvernance absente).`,
                neg: `Ce n’est pas l’eau le vrai problème. Ce sont les rapports de pouvoir.`
              },
              {
                question: `Pourquoi dure-t-il 50 ans ?`,
                responses: [
                  { id: 'A', text: 'Haine ancestrale' },
                  { id: 'B', text: 'Absence de structure de résolution : pas de médiation formelle, pas de règles écrites.' }
                ],
                correct: 'B',
                pos: `Analyse institutionnelle (North). Pas de rancune, mais défaut de règles.`,
                neg: `Ce n’est pas la rancune. C’est l’absence d’institution pour résoudre.`
              },
              {
                question: `Solution ?`,
                responses: [
                  { id: 'A', text: 'Les séparer' },
                  { id: 'B', text: 'Comité de l’eau avec représentants + expertise + données + charte écrite.' }
                ],
                correct: 'B',
                pos: `Créer une institution. La solution structurelle, pas individuelle.`,
                neg: `Séparer ou forcer ne règle pas le problème structurel. Il faut des règles et des données.`
              }
            ]
          }
        },
        {
          type: 'Détection d’erreurs',
          q: `Trouvez les 6 erreurs dans le budget du festival.`,
          options: [
            { text_fr: '1 seul sponsor', is_error: true },
            { text_fr: 'Estimation optimiste des entrées', is_error: true },
            { text_fr: 'Communication 36% du budget', is_error: true },
            { text_fr: 'Artisans 7% (sous-payés)', is_error: true },
            { text_fr: 'Imprévu = 0', is_error: true },
            { text_fr: 'Budget = revenus (zéro marge)', is_error: true },
            { text_fr: 'Fond de roulement 15%', is_error: false }
          ],
          pos: `Audit budgétaire analytique ! Déséquilibres structurels identifiés.`,
          neg: `Relisez : dépendance sponsor, biais d’optimisme, disproportion communication/artisans, absence d’imprévu, zéro marge.`
        },
        {
          type: 'Rôles d’équipe',
          q: `Attribuez les 5 comités aux 5 groupes de corporations.`,
          options: [
            { left_fr: 'Zelligeurs+Maçons', right_fr: 'Technique' },
            { left_fr: 'Tanneurs+Teinturiers', right_fr: 'Conflits' },
            { left_fr: 'Brodeurs+Joailliers', right_fr: 'Communication' },
            { left_fr: 'Menuisiers+Ferronniers', right_fr: 'Logistique' },
            { left_fr: '7 petites corporations', right_fr: 'Stratégique' }
          ],
          pos: `Gouvernance analytique ! Attribuer selon les besoins, pas les préférences.`,
          neg: `Réfléchissez aux forces de chaque groupe : technique, conflits, communication, logistique, représentativité.`
        },
        {
          type: 'Vrai/Faux analytique',
          q: `Analyse des croyances sur la culture.`,
          options: [
            { text: `« La tradition bloque toujours l’innovation. »`, correct: 'faux', pos: `La tradition EST une innovation ancienne. Le problème est la rigidité, pas la tradition.`, neg: `Faux. La tradition n’est pas l’ennemie de l’innovation, c’est la rigidité.` },
            { text: `« Un festival doit être rentable financièrement. »`, correct: 'faux', pos: `Certains festivals sont des services publics culturels. Le ROI est culturel, pas financier.`, neg: `Non. La culture peut être subventionnée comme service public.` },
            { text: `« Les conflits entre corporations sont toujours négatifs. »`, correct: 'faux', pos: `Conflit constructif sur ressources ou normes peut produire des solutions créatives.`, neg: `Un conflit peut être constructif s’il a une structure de résolution.` }
          ]
        },
        {
          type: 'Contre-la-montre',
          q: `Arbitrages rapides du Wali.`,
          options: {
            steps: [
              {
                question: `Stand d’artisan prend feu. Priorité ?`,
                responses: [{id:'A',text:'Sécurité (éteindre)'},{id:'B',text:'Médias'}],
                correct: 'A',
                pos: `Urgence immédiate avant communication.`,
                neg: `La sécurité passe avant les médias.`
              },
              {
                question: `200 visiteurs bloqués (bug billet). Cause profonde ?`,
                responses: [{id:'A',text:'Absence de plan B (scan papier)'},{id:'B',text:'Serveur'}],
                correct: 'A',
                pos: `Absence de redondance. Le plan B est indispensable.`,
                neg: `Ce n’est pas l’impatience des visiteurs. C’est l’absence de solution de secours.`
              },
              {
                question: `Artisan vend contrefaçon. Action ?`,
                responses: [{id:'A',text:'Exclusion + transparence'},{id:'B',text:'Ignorer'}],
                correct: 'A',
                pos: `Tolérance zéro. Transparence pour préserver la confiance.`,
                neg: `Ignorer serait une faute. Il faut agir fermement et communiquer.`
              },
              {
                question: `Bénévoles épuisés. Solution ?`,
                responses: [{id:'A',text:'Rotation + pauses obligatoire'},{id:'B',text:'Pression'}],
                correct: 'A',
                pos: `Écouter la fatigue, organiser des pauses. SDT : bien-être au travail.`,
                neg: `« Ils n’ont qu’à se reposer après » est inhumain et contre-productif.`
              },
              {
                question: `Tension festival vs riverains. Solution ?`,
                responses: [{id:'A',text:'Dialogue (Comité de liaison)'},{id:'B',text:'Ignorer'}],
                correct: 'A',
                pos: `Gestion des parties prenantes (Freeman). Dialogue et concessions.`,
                neg: `Ignorer les riverains crée des conflits durables. Il faut les intégrer.`
              }
            ]
          }
        },
        {
          type: 'Texte à trous',
          q: `Complétez le modèle de Freeman (parties prenantes).`,
          options: [
            { text: 'identifier' }, { text: 'cartographier' }, { text: 'intérêts' }, { text: 'pouvoir' }, { text: 'légitimité' }, { text: 'urgence' }, { text: 'prioriser' }, { text: 'engager' }
          ],
          correct: 'identifier, cartographier, intérêts, pouvoir, légitimité, urgence, prioriser, engager',
          pos: `Stakeholder analysis maîtrisée ! Identifier, cartographier, prioriser, engager.`,
          neg: `Retenez : identifier, cartographier (intérêts, pouvoir, légitimité, urgence), prioriser, engager.`
        },
        {
          type: 'Dialogue de situation',
          q: `Journaliste accuse « Le festival exploite les artisans ». Analyse et réponse.`,
          options: [
            { id: 'A', label_fr: 'Déni' },
            { id: 'B', label_fr: 'Acceptation passive' },
            { id: 'C', label_fr: 'Reconnaître le fait (sous-paiement), nuancer (pas intentionnel), proposer solution (fonds de redistribution + siège au conseil).' }
          ],
          correct: 'C',
          pos: `Analyse médiatique équilibrée. Ni déni, ni acceptation naïve. Transformation structurelle.`,
          neg: `Nier ou accepter sans solution est insuffisant. Il faut reconnaître, nuancer et proposer.`
        },
        {
          type: 'Réponse courte',
          q: `Rédigez une analyse SWOT du festival (150 mots) avec 3 recommandations.`,
          pos: `SWOT complète et stratégique ! Forces, faiblesses, opportunités, menaces.`,
          neg: `Il manque une des 4 sections ou les recommandations ne sont pas justifiées.`
        },
        {
          type: 'Énigme ultime',
          q: `« Je décompose ce qui semble simple, je simplifie ce qui semble complexe. À Rabat tu as appris sans moi… Qui suis-je ? »`,
          options: [
            { id: 'A', label_fr: 'L’analyse' },
            { id: 'B', label_fr: 'La logique' },
            { id: 'C', label_fr: 'L’intelligence' },
            { id: 'D', label_fr: 'La vérité' }
          ],
          correct: 'A',
          pos: `L’analyse est le pont entre la connaissance et la sagesse. Fès te l’a révélée.`,
          neg: `Relisez : « À Fès tu m’as enfin rencontrée. » C’est l’analyse.`
        }
      ]
    }
  ];

  for (const mData of missionsData) {
    const { id, title_fr, description_fr, questions } = mData;

    // A. Upsert Mission
    const { error: mErr } = await supabase.from('missions').upsert({
      id,
      city_id: FES_CHALLENGE_PK,
      challenge_id: FES_CHALLENGE_PK,
      title_fr,
      description_fr,
      xp_reward: 1000,
      sort_order: parseInt(id.slice(-3), 16) || 1
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

  console.log('🏁 Fès HIGH-FIDELITY v4 import FINISHED!');
}

importFes();
