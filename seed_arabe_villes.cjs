// seed_arabe_villes.cjs - Seeding complete Arabic content for Laâyoune, Marrakech, Chefchaouen, Fès, and Dakhla
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

const files = [
  'chefchaouen.json',
  'fes_arabe.json',
  'laayoune_arabe.json',
  'marrakech_arabe.json',
  'dakhla_arabe.json'
];

async function seed() {
  console.log('🚀 Starting Arabic translations database seeding...');

  for (const filename of files) {
    const filePath = path.join(__dirname, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Warning: ${filename} does not exist. Skipping.`);
      continue;
    }

    console.log(`\n📦 Processing city file: ${filename}...`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let cityData;
    try {
      cityData = JSON.parse(fileContent);
    } catch (e) {
      console.error(`❌ Error parsing JSON in ${filename}:`, e.message);
      continue;
    }

    const cityId = cityData.id;
    console.log(`🏙️  City: ${cityData.name_fr} (${cityData.name_ar})`);

    // 1. Update Challenges (Cities) Table
    const challengeUpdate = {
      city_name_ar: cityData.name_ar,
      headline_ar: cityData.headline_ar,
      description_ar: cityData.description_ar,
      missions_title_ar: 'المهمات :'
    };

    const { error: cityError } = await supabase
      .from('challenges')
      .update(challengeUpdate)
      .eq('id', cityId);

    if (cityError) {
      console.error(`❌ Error updating city ${cityId}:`, cityError.message);
    } else {
      console.log(`✅ Successfully updated city metadata for ${cityData.name_fr}`);
    }

    // 2. Loop through missions and exercises
    if (Array.isArray(cityData.missions)) {
      for (const m of cityData.missions) {
        console.log(`  🎬 Mission: ${m.title_fr} (${m.title_ar})`);

        // Update Mission Title and Description
        const missionUpdate = {
          title_ar: m.title_ar,
          description_ar: m.description_ar
        };

        const { error: missionError } = await supabase
          .from('missions')
          .update(missionUpdate)
          .eq('id', m.id);

        if (missionError) {
          console.error(`  ❌ Error updating mission ${m.id}:`, missionError.message);
        } else {
          console.log(`  ✅ Successfully updated mission title/desc`);
        }

        // Loop through exercises/questions
        if (Array.isArray(m.exercises)) {
          for (const ex of m.exercises) {
            // Find existing question from DB to merge options
            const { data: dbQuestion, error: fetchError } = await supabase
              .from('questions')
              .select('*')
              .eq('id', ex.id)
              .single();

            if (fetchError || !dbQuestion) {
              console.warn(`  ⚠️ Question ${ex.id} not found in DB. Skipping merge, writing raw.`);
            }

            const getArValue = (val) => {
              if (!val) return null;
              if (typeof val === 'string') return val;
              return val.ar || val.fr || null;
            };

            const questionUpdate = {
              question_ar: ex.question_ar,
              hint_ar: getArValue(ex.hint),
              explanation_ar: getArValue(ex.explanation),
              feedback_positive_ar: getArValue(ex.feedback_positive),
              feedback_negative_ar: getArValue(ex.feedback_negative),
              presentation_ar: getArValue(ex.presentation)
            };

            // Merge option translations
            if (ex.options) {
              let dbOpts = dbQuestion?.options || [];
              if (typeof dbOpts === 'string') {
                try {
                  dbOpts = JSON.parse(dbOpts);
                } catch (e) {
                  dbOpts = [];
                }
              }

              // Format options based on type
              if (Array.isArray(ex.options) && Array.isArray(dbOpts)) {
                // Standard multiple choice or true/false options
                questionUpdate.options = dbOpts.map((dbOpt, idx) => {
                  const exOpt = ex.options.find(o => o.id === dbOpt.id) || ex.options[idx];
                  if (exOpt) {
                    return {
                      ...dbOpt,
                      label_ar: exOpt.label_ar || exOpt.text_ar || exOpt.text || '',
                      text_ar: exOpt.text_ar || exOpt.label_ar || exOpt.text || ''
                    };
                  }
                  return dbOpt;
                });
              } else if (ex.options.pairs && dbOpts.pairs) {
                // Matching pairs
                questionUpdate.options = {
                  ...dbOpts,
                  pairs: dbOpts.pairs.map((dbPair, idx) => {
                    const exPair = ex.options.pairs[idx];
                    if (exPair) {
                      return {
                        ...dbPair,
                        left_ar: exPair.left_ar || exPair.left || '',
                        right_ar: exPair.right_ar || exPair.right || ''
                      };
                    }
                    return dbPair;
                  })
                };
              } else if (ex.options.steps && dbOpts.steps) {
                // Scenario cascade steps
                questionUpdate.options = {
                  ...dbOpts,
                  steps: dbOpts.steps.map((dbStep, idx) => {
                    const exStep = ex.options.steps[idx];
                    if (exStep) {
                      return {
                        ...dbStep,
                        question_ar: exStep.question_ar || exStep.question || '',
                        responses: (dbStep.responses || []).map((dbResp, rIdx) => {
                          const exResp = exStep.responses?.[rIdx];
                          if (exResp) {
                            return {
                              ...dbResp,
                              text_ar: exResp.text_ar || exResp.text || ''
                            };
                          }
                          return dbResp;
                        })
                      };
                    }
                    return dbStep;
                  })
                };
              } else if (ex.options.bank && dbOpts.bank) {
                // Fill in the blanks word bank
                questionUpdate.options = {
                  ...dbOpts,
                  bank: dbOpts.bank.map((dbItem, idx) => {
                    const exItem = ex.options.bank[idx];
                    if (exItem) {
                      return {
                        ...dbItem,
                        text_ar: exItem.text_ar || exItem.text || (typeof exItem === 'string' ? exItem : '')
                      };
                    }
                    return dbItem;
                  })
                };
              } else {
                // Fallback: use options directly from JSON if types don't match or DB is empty
                questionUpdate.options = ex.options;
              }
            }

            const { error: qError } = await supabase
              .from('questions')
              .update(questionUpdate)
              .eq('id', ex.id);

            if (qError) {
              console.error(`    ❌ Error updating question ${ex.id}:`, qError.message);
            } else {
              console.log(`    ✅ Updated question: ${ex.id}`);
            }
          }
        }
      }
    }
  }

  console.log('\n🎉 Finished seeding all Arabic translations!');
}

seed().catch(console.error);
