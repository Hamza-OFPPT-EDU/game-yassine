const fs = require('fs');

const data = JSON.parse(fs.readFileSync('game_content_export.json', 'utf8'));
const rabat = data.find(c => c.city_id === 'rabat');

const rabatFrData = {
  city: {
    id: rabat.id,
    name_fr: rabat.name_fr,
    headline_fr: rabat.headline_fr,
    description_fr: rabat.description_fr,
    focus_fr: rabat.focus_fr,
    pedagogical_theories_fr: rabat.pedagogical_theories_fr,
    learning_outcomes_fr: rabat.learning_outcomes_fr
  },
  missions: rabat.missions.map(m => ({
    id: m.id,
    title_fr: m.title_fr,
    description_fr: m.description_fr,
    mentor: m.mentor,
    scripts: m.scripts,
    cinematic: m.cinematic,
    theories_fr: m.theories_fr,
    exercises: m.exercises.map(ex => ({
      id: ex.id,
      type: ex.type,
      question_fr: ex.question_fr,
      options: ex.options,
      correct_answer: ex.correct_answer,
      feedback_positive_fr: ex.feedback_positive.fr,
      feedback_negative_fr: ex.feedback_negative.fr,
      hint_fr: ex.hint.fr,
      explanation_fr: ex.explanation.fr,
      presentation_fr: ex.presentation.fr
    }))
  }))
};

fs.writeFileSync('rabat_fr.json', JSON.stringify(rabatFrData, null, 2), 'utf8');
console.log('✅ Rabat French content successfully extracted to rabat_fr.json');
