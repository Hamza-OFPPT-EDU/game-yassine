const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportGameData() {
  console.log('🔄 Récupération des données depuis la base de données Supabase...');

  // 1. Récupérer toutes les villes (challenges)
  const { data: cities, error: citiesError } = await supabase
    .from('challenges')
    .select('*')
    .order('sort_order', { ascending: true });

  if (citiesError) {
    console.error('❌ Erreur lors de la récupération des villes :', citiesError);
    return;
  }

  // 2. Récupérer toutes les missions
  const { data: missions, error: missionsError } = await supabase
    .from('missions')
    .select('*')
    .order('sort_order', { ascending: true });

  if (missionsError) {
    console.error('❌ Erreur lors de la récupération des missions :', missionsError);
    return;
  }

  // 3. Récupérer tous les exercices (questions)
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .order('sort_order', { ascending: true });

  if (questionsError) {
    console.error('❌ Erreur lors de la récupération des exercices :', questionsError);
    return;
  }

  console.log('🧠 Structuration et préparation des espaces réservés (Placeholders) pour la version Arabe...');

  const structuredData = cities.map(city => {
    // Filtrer les missions pour cette ville
    const cityMissions = missions
      .filter(mission => mission.challenge_id === city.id || mission.city_id === city.city_id)
      .map(mission => {
        // Filtrer les exercices pour cette mission
        const missionQuestions = questions
          .filter(q => q.mission_id === mission.id)
          .map(q => {
            // Analyser et localiser le JSON des options de réponses
            let rawOptions = q.options;
            if (typeof q.options === 'string') {
              try {
                rawOptions = JSON.parse(q.options);
              } catch (e) {
                rawOptions = q.options;
              }
            }

            let formattedOptions = rawOptions;

            // Formater les options pour inclure des placeholders si absents
            if (Array.isArray(rawOptions)) {
              formattedOptions = rawOptions.map(opt => {
                const labelFr = opt.label_fr || opt.text_fr || opt.text || "";
                const labelAr = opt.label_ar || opt.text_ar || "";
                return {
                  id: opt.id || "",
                  label_fr: labelFr,
                  label_ar: labelAr // Espace réservé pour la version Arabe
                };
              });
            } else if (rawOptions && typeof rawOptions === 'object') {
              // Gestion des paires pour l'exercice 'matching'
              if (rawOptions.pairs) {
                formattedOptions = {
                  pairs: rawOptions.pairs.map(pair => ({
                    left_fr: pair.left_fr || pair.left || "",
                    left_ar: pair.left_ar || "", // Espace réservé Arabe
                    right_fr: pair.right_fr || pair.right || "",
                    right_ar: pair.right_ar || "" // Espace réservé Arabe
                  }))
                };
              }
              // Gestion des étapes pour l'exercice 'scenario_cascade'
              else if (rawOptions.steps) {
                formattedOptions = {
                  steps: rawOptions.steps.map(step => ({
                    question_fr: step.question_fr || step.question || "",
                    question_ar: step.question_ar || "", // Espace réservé Arabe
                    correct: step.correct || "",
                    responses: (step.responses || []).map(resp => ({
                      id: resp.id || "",
                      text_fr: resp.text_fr || resp.text || "",
                      text_ar: resp.text_ar || "" // Espace réservé Arabe
                    }))
                  }))
                };
              }
              // Gestion de la banque de mots pour 'fill_blanks'
              else if (rawOptions.bank) {
                formattedOptions = {
                  bank: rawOptions.bank.map(b => ({
                    text_fr: b.text_fr || b.text || "",
                    text_ar: b.text_ar || "" // Espace réservé Arabe
                  }))
                };
              }
            }

            return {
              id: q.id,
              type: q.question_type,
              
              // Textes principaux
              question_fr: q.question_fr || "",
              question_ar: q.question_ar || "", // Déjà présent ou vide
              
              // Options localisées
              options: formattedOptions,
              
              correct_answer: q.correct_answer || "",
              
              // Feedbacks localisés
              feedback_positive: {
                fr: q.feedback_positive_fr || "",
                ar: q.feedback_positive_ar || "" // Espace réservé Arabe
              },
              feedback_negative: {
                fr: q.feedback_negative_fr || "",
                ar: q.feedback_negative_ar || "" // Espace réservé Arabe
              },
              
              // Indices et Explications
              hint: {
                fr: q.hint_fr || "",
                ar: q.hint_ar || "" // Espace réservé Arabe
              },
              explanation: {
                fr: q.explanation_fr || "",
                ar: q.explanation_ar || "" // Espace réservé Arabe
              },
              
              // Contexte dialogue
              context_dialogue: q.context_dialogue || null,
              
              presentation: {
                fr: q.presentation_fr || "",
                ar: q.presentation_ar || "" // Espace réservé Arabe
              },
              
              // Données de score / progression
              scores: {
                decision: q.score_decision || 0,
                equipe: q.score_equipe || 0,
                stress: q.score_stress || 0,
                xp: q.xp_reward || 0
              },
              time_limit_sec: q.time_limit_sec,
              soft_skills_impact: q.soft_skills_impact || {},
              
              // Médias (Voix off)
              audio_url_fr: q.audio_url || "",
              audio_url_ar: q.audio_url_ar || "", // Espace réservé Arabe pour audio voix off
              
              created_at: q.created_at,
              updated_at: q.updated_at
            };
          });

        return {
          id: mission.id,
          
          // Titres et descriptions localisés
          title_fr: mission.title_fr || "",
          title_ar: mission.title_ar || "", // Déjà présent ou vide
          description_fr: mission.description_fr || "",
          description_ar: mission.description_ar || "", // Déjà présent ou vide
          
          type: mission.mission_type,
          xp_reward: mission.xp_reward || 0,
          bloom_level: mission.bloom_level || "",
          soft_skill_dominant: mission.soft_skill_dominant || "",
          duration_minutes: mission.duration_minutes || null,
          success_threshold: mission.success_threshold || 70,
          
          // Mentor localisé
          mentor: {
            name_fr: mission.mentor_name || "",
            name_ar: mission.mentor_name_ar || "", // Espace réservé Arabe
            age: mission.mentor_age || null,
            role_fr: mission.mentor_role || "",
            role_ar: mission.mentor_role_ar || "", // Espace réservé Arabe
            location_fr: mission.mentor_location || "",
            location_ar: mission.mentor_location_ar || "" // Espace réservé Arabe
          },
          
          // Dialogues (Script d'ouverture et fermeture)
          scripts: {
            opening_fr: mission.script_opening || "",
            opening_ar: mission.script_opening_ar || "", // Espace réservé Arabe
            closing_fr: mission.script_closing || "",
            closing_ar: mission.script_closing_ar || "" // Espace réservé Arabe
          },
          
          // Cinématique localisée
          cinematic: {
            text_fr: mission.cinematic_text || "",
            text_ar: mission.cinematic_text_ar || "", // Espace réservé Arabe
            gif_url: mission.cinematic_gif_url || "",
            audio_url_fr: mission.cinematic_audio_url || "",
            audio_url_ar: mission.cinematic_audio_url_ar || "" // Espace réservé Arabe pour voix off cinématique
          },
          
          theories_fr: mission.theories_fr || "",
          theories_ar: mission.theories_ar || "", // Espace réservé Arabe
          
          exercises: missionQuestions,
          created_at: mission.created_at,
          updated_at: mission.updated_at
        };
      });

    return {
      id: city.id,
      city_id: city.city_id,
      
      // Identifiants textuels de la ville
      name_fr: city.city_name_fr || "",
      name_ar: city.city_name_ar || "", 
      
      color: city.city_color || "",
      icon: city.icon_name || "",
      
      // Accroches et descriptifs
      headline_fr: city.headline_fr || "",
      headline_ar: city.headline_ar || "",
      description_fr: city.description_fr || "",
      description_ar: city.description_ar || "",
      
      focus_fr: city.focus_fr || "",
      focus_ar: city.focus_ar || "", // Espace réservé Arabe
      
      illustration_url: city.illustration_url || "",
      
      // Théories et objectifs de formation de la ville
      pedagogical_theories_fr: city.pedagogical_theories || [],
      pedagogical_theories_ar: city.pedagogical_theories_ar || [], // Espace réservé Arabe
      
      learning_outcomes_fr: city.learning_outcomes || [],
      learning_outcomes_ar: city.learning_outcomes_ar || [], // Espace réservé Arabe
      
      missions: cityMissions,
      created_at: city.created_at,
      updated_at: city.updated_at
    };
  });

  const outputFilePath = path.join(__dirname, 'game_content_export.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(structuredData, null, 2), 'utf-8');
  
  console.log(`\n🎉 Génération réussie du template d'exportation bilingue !`);
  console.log(`📁 Fichier sauvegardé sous : ${outputFilePath}`);
  console.log(`📊 Statistiques :`);
  console.log(`   - ${structuredData.length} Villes configurées`);
  console.log(`   - ${missions.length} Missions configurées`);
  console.log(`   - ${questions.length} Exercices configurés avec placeholders arabes.`);
}

exportGameData();
