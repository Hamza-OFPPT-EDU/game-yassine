// translate_m3.cjs — Mission 3: Projet collaboratif à l'Université (10 exercises)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rydmefudpczpxrresflx.supabase.co', 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_');

const exercises = [
  { id: 'b2ba689c-6f27-46a8-9076-0cb9b6e64381', question_ar: 'عائشة لديها دائمًا 10 أفكار جديدة، لكنها لا تنهي شيئًا أبدًا. ما دور بلبين؟', hint_ar: 'نادية تبتكر ← مبدعة.', explanation_ar: 'التعرف على أدوار بلبين في الفريق. إشارة: شخص يولّد 10 أفكار لكن لا ينفذها يجسّد دور المبدع.', feedback_positive_ar: 'صحيح! مبدعة: تولّد أفكارًا لكنها تفتقر للتنفيذ.', feedback_negative_ar: 'نادية تبتكر ← مبدعة.', options: [{ id: 'A', label: 'القائد' }, { id: 'B', label: 'المبدع' }, { id: 'C', label: 'المحلل' }, { id: 'D', label: 'المنفذ' }] },
  { id: '0544222e-72e0-4914-9049-1ad340692319', question_ar: 'أسند لكل عضو دور بلبين المناسب.', hint_ar: 'المحلل (بيانات)، المنسق (هدوء)، القائد (يقود)، المبدع (أفكار)، المنفذ (عمل).', explanation_ar: 'توزيع أدوار بلبين حسب نقاط القوة. إشارة: كريم ← محلل، سارة ← منسقة، عمر ← قائد، نادية ← مبدعة، حسن ← منفذ.', feedback_positive_ar: 'أحسنت! فريق موزع بشكل مثالي وفق بلبين.', feedback_negative_ar: 'المحلل (بيانات)، المنسق (هدوء)، القائد (يقود)، المبدع (أفكار)، المنفذ (عمل).', options: { pairs: [
    { left_fr: 'Karim', left_ar: 'كريم', right_fr: 'Analyste', right_ar: 'محلل' },
    { left_fr: 'Sarah', left_ar: 'سارة', right_fr: 'Harmonisateur', right_ar: 'منسقة' },
    { left_fr: 'Omar', left_ar: 'عمر', right_fr: 'Leader', right_ar: 'قائد' },
    { left_fr: 'Nadia', left_ar: 'نادية', right_fr: 'Créatif', right_ar: 'مبدعة' },
    { left_fr: 'Hassan', left_ar: 'حسن', right_fr: 'Réalisateur', right_ar: 'منفذ' }
  ]}},
  { id: '87bb8bb7-f169-495e-8442-716caf42fb68', question_ar: 'كريم يهاجم نادية: «أفكارك سخيفة!» ما التدخل المناسب؟', hint_ar: 'أعد صياغة النقد كطلب تحسين تقني.', explanation_ar: 'التوسط في صراع فريق بإعادة الصياغة البنّاءة. إشارة: اطلب من كريم إعادة صياغة نقده كتحسينات تقنية لأفكار نادية.', feedback_positive_ar: 'رائع! إعادة صياغة بدون حكم، طلب ملاحظات بنّاءة.', feedback_negative_ar: 'أعد صياغة النقد كطلب تحسين تقني.', options: [{ id: 'A', label: '«أنت سيء»' }, { id: 'B', label: '«كريم، هل يمكنك إعادة الصياغة بشكل بنّاء؟»' }, { id: 'C', label: 'لا أقول شيئًا' }] },
  { id: '444195d3-63bd-4fa5-ba8a-d99c3e1149bf', question_ar: '«الصراعات في الفريق دائمًا سيئة.»', hint_ar: 'صراعات الأفكار تحفز الإبداع.', explanation_ar: 'تمييز الخرافات حول الفرق عالية الأداء. إشارة: التنوع المعرفي = +35% أداء (خطأ نفس الملامح)؛ القائد يعترف بأخطائه (خطأ يجب أن يكون دائمًا على حق)؛ صراع الأفكار = صحي (خطأ دائمًا سيء).', feedback_positive_ar: 'خطأ. صراع المهام (الأفكار) = صحي. صراع العلاقات = سام.', feedback_negative_ar: 'صراعات الأفكار تحفز الإبداع.', options: [] },
  { id: '54ace88b-be1f-4eb5-bd7a-ce4059bdf020', question_ar: 'أكمل الخطوات الأربع للتواصل اللاعنفي (OSBD).', hint_ar: 'وقائع بدون حكم، شعور بـ «أنا»، حاجة مُوضَّحة.', explanation_ar: 'إتقان الخطوات الأربع للتواصل اللاعنفي (CNV). إشارة: الملاحظة (وقائع بدون حكم)، الشعور (بـ «أنا»)، الحاجة، الطلب الملموس.', feedback_positive_ar: 'ممتاز! ملاحظة، شعور، حاجة، طلب. أساس التواصل اللاعنفي.', feedback_negative_ar: 'وقائع بدون حكم، شعور بـ «أنا»، حاجة مُوضَّحة.', options: { bank: [
    { text_fr: 'Observation', text_ar: 'ملاحظة' },
    { text_fr: 'jugement', text_ar: 'حكم' },
    { text_fr: 'tu', text_ar: 'أنتَ' },
    { text_fr: 'Sentiment', text_ar: 'شعور' },
    { text_fr: 'je', text_ar: 'أنا' },
    { text_fr: 'Besoin', text_ar: 'حاجة' },
    { text_fr: 'Demande', text_ar: 'طلب' }
  ]}},
  { id: 'c9c025fa-ca2e-47b1-9109-71f67321172c', question_ar: 'يوسف سلبي في الفريق.', hint_ar: 'الحوار الخاص يتجنب الإذلال ويعزز التضامن.', explanation_ar: 'إدارة عضو سلبي بالرفق والدعم والسرية. إشارة: تحدث معه على انفراد، اعرض المساعدة أمام صعوبته الشخصية، ثم أخبر الفريق ببساطة أنه يمر بفترة صعبة.', feedback_positive_ar: 'رفق وشفافية محترمة. كسبت ثقته.', feedback_negative_ar: 'الحوار الخاص يتجنب الإذلال ويعزز التضامن.', options: { steps: [
    { question_fr: "Youssef ne contribue pas. Première approche ?", question_ar: "يوسف لا يساهم. ما النهج الأول؟", correct: 'C', responses: [{ id: 'A', text_fr: 'Le critiquer', text_ar: 'انتقاده' }, { id: 'C', text_fr: 'Lui parler en privé avec bienveillance', text_ar: 'التحدث معه على انفراد بلطف' }] },
    { question_fr: "Il dit : « Ma mère est malade, je suis épuisé. » Réaction ?", question_ar: "يقول: «أمي مريضة، أنا منهك.» ما تصرفك؟", correct: 'B', responses: [{ id: 'A', text_fr: "« Sois pro »", text_ar: '«كن محترفًا»' }, { id: 'B', text_fr: "« Je suis désolé. Comment l'équipe peut t'aider ? »", text_ar: '«أنا آسف. كيف يمكن للفريق مساعدتك؟»' }] },
    { question_fr: "Il demande la discrétion. Que dis-tu à l'équipe ?", question_ar: "يطلب التكتم. ماذا تقول للفريق؟", correct: 'C', responses: [{ id: 'A', text_fr: 'Tout dire', text_ar: 'أخبرهم بكل شيء' }, { id: 'C', text_fr: "Expliquer qu'il a des difficultés personnelles sans détail.", text_ar: 'أوضح أنه يواجه صعوبات شخصية بدون تفاصيل.' }] }
  ]}},
  { id: '70f8d80f-6e2f-4c0d-a2cb-0a5ae134d774', question_ar: 'رتّب المراحل الخمس لتاكمان.', hint_ar: 'نتشكّل، نتصارع، ننظّم، نؤدي.', explanation_ar: 'ترتيب المراحل الخمس لحياة الفريق (تاكمان). إشارة: التشكيل، العاصفة، التطبيع، الأداء، الانفصال.', feedback_positive_ar: 'أحسنت! التشكيل، العاصفة، التطبيع، الأداء، الانفصال.', feedback_negative_ar: 'نتشكّل، نتصارع، ننظّم، نؤدي.', options: [
    { label: 'Forming', label_ar: 'التشكيل' }, { label: 'Storming', label_ar: 'العاصفة' }, { label: 'Norming', label_ar: 'التطبيع' }, { label: 'Performing', label_ar: 'الأداء' }, { label: 'Adjourning', label_ar: 'الانفصال' }
  ]},
  { id: '48629e54-b6b8-4478-88e6-3bca75afcb47', question_ar: 'اربط كل حرف من DESC بمعناه.', hint_ar: 'D=وقائع، E=شعور، S=حل، C=نتائج.', explanation_ar: 'استخدام طريقة DESC للملاحظات بدون صراع. إشارة: D ← صِف الوقائع؛ E ← عبّر عن شعورك؛ S ← اقترح حلًا؛ C ← النتائج.', feedback_positive_ar: 'ممتاز! DESC هو مفتاح الملاحظات بدون صراع.', feedback_negative_ar: 'D=وقائع، E=شعور، S=حل، C=نتائج.', options: { pairs: [
    { left_fr: 'D', left_ar: 'D', right_fr: 'Décris les faits', right_ar: 'صِف الوقائع' },
    { left_fr: 'E', left_ar: 'E', right_fr: 'Exprime ton ressenti', right_ar: 'عبّر عن شعورك' },
    { left_fr: 'S', left_ar: 'S', right_fr: 'Suggère une solution', right_ar: 'اقترح حلًا' },
    { left_fr: 'C', left_ar: 'C', right_fr: 'Conséquences', right_ar: 'النتائج' }
  ]}},
  { id: '9217e4a1-1ccb-48ee-ab48-8cc3a3937344', question_ar: 'أسند كل مهمة للملف المناسب وفق بلبين.', hint_ar: 'وزّع حسب الخبرة الطبيعية: مبدع (تصميم)، محلل (أرقام).', explanation_ar: 'تفويض المهام حسب ملامح بلبين. إشارة: التصميم ← المبدع (نادية)؛ البيانات ← المحلل (كريم)؛ التقرير ← المنفذ (حسن)؛ الصراع ← المنسق (سارة)؛ العرض ← القائد (عمر).', feedback_positive_ar: 'توزيع مثالي! كل واحد في نقطة قوته = إنتاجية قصوى.', feedback_negative_ar: 'وزّع حسب الخبرة الطبيعية: مبدع (تصميم)، محلل (أرقام).', options: [
    { id: 'A', label: 'التصميم -> نادية (مبدعة)' }, { id: 'B', label: 'البيانات -> كريم (محلل)' }, { id: 'C', label: 'التقرير -> حسن (منفذ)' }, { id: 'D', label: 'الصراع -> سارة (منسقة)' }, { id: 'E', label: 'العرض -> عمر (قائد)' }
  ]},
  { id: '06de8469-b062-4782-b80f-ec01c25f49c8', question_ar: '«وحدي لست شيئًا. في اثنين أصبح قوة. في ثلاثة، سحرًا...»', hint_ar: 'بدوني، ينهار كل شيء.', explanation_ar: 'تحديد الأسمنت الخفي لكل فريق: الثقة. إشارة: وحدها لا شيء؛ في اثنين قوة؛ في عدة أشخاص أسطورة. إن انكسرت، انهار كل شيء.', feedback_positive_ar: 'رائع! الثقة هي الأسمنت الخفي لكل فريق.', feedback_negative_ar: 'بدوني، ينهار كل شيء.', options: [{ id: 'A', label: 'القوة' }, { id: 'B', label: 'الثقة' }, { id: 'C', label: 'المال' }] }
];

async function run() {
  console.log('=== Mission 3: Université (10 exercises) ===');
  for (const ex of exercises) {
    const update = { question_ar: ex.question_ar, hint_ar: ex.hint_ar, explanation_ar: ex.explanation_ar, feedback_positive_ar: ex.feedback_positive_ar, feedback_negative_ar: ex.feedback_negative_ar };
    if (ex.options && (Array.isArray(ex.options) ? ex.options.length > 0 : Object.keys(ex.options).length > 0)) {
      const { data: curr } = await supabase.from('questions').select('options').eq('id', ex.id).single();
      let dbOpts = curr?.options || {};
      if (typeof dbOpts === 'string') try { dbOpts = JSON.parse(dbOpts); } catch(e) {}
      if (Array.isArray(ex.options) && Array.isArray(dbOpts)) {
        update.options = dbOpts.map((o, i) => ({ ...o, label_ar: ex.options[i]?.label || '' }));
      } else if (ex.options.pairs && dbOpts.pairs) {
        update.options = { ...dbOpts, pairs: dbOpts.pairs.map((p, i) => ({ ...p, left_ar: ex.options.pairs[i]?.left_ar || '', right_ar: ex.options.pairs[i]?.right_ar || '' }))};
      } else if (ex.options.steps && dbOpts.steps) {
        update.options = { ...dbOpts, steps: dbOpts.steps.map((s, i) => { const a = ex.options.steps[i] || {}; return { ...s, question_ar: a.question_ar || '', responses: (s.responses || []).map((r, j) => ({ ...r, text_ar: a.responses?.[j]?.text_ar || '' })) }; })};
      } else if (ex.options.bank && dbOpts.bank) {
        update.options = { ...dbOpts, bank: dbOpts.bank.map((b, i) => ({ ...b, text_ar: ex.options.bank[i]?.text_ar || '' }))};
      }
    }
    const { error } = await supabase.from('questions').update(update).eq('id', ex.id);
    console.log(error ? `❌ ${ex.id}: ${error.message}` : `✅ ${ex.id}`);
  }
  console.log('🎉 Mission 3 done!');
}
run().catch(console.error);
