// translate_m5.cjs — Mission 5: Le Grand Défi Final – Wilaya (10 exercises)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rydmefudpczpxrresflx.supabase.co', 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_');

const exercises = [
  { id: '19c408f7-07e4-4ca2-96c5-7865b018d59b', question_ar: 'أزمة صحية: 200 في المستشفى. قرار في 60 ثانية. أيّها؟', hint_ar: 'التسلسل: 1) الأرواح، 2) التحقيق، 3) التواصل، 4) التعاطف.', explanation_ar: 'إعطاء الأولوية لإنقاذ الأرواح في حالة الأزمة. إشارة: أرسل المزيد من الأطباء للمستشفى (إنقاذ الأرواح) قبل أي تواصل.', feedback_positive_ar: 'أولوية صحيحة! إنقاذ الأرواح قبل الشرح أو التحقيق.', feedback_negative_ar: 'التسلسل: 1) الأرواح، 2) التحقيق، 3) التواصل، 4) التعاطف.', options: [{ id: 'A', label: 'إجراء مقابلة صحفية' }, { id: 'B', label: 'إرسال المزيد من الأطباء للمستشفى (إنقاذ الأرواح)' }] },
  { id: '26d707ab-83eb-4ded-924f-01ca1b2bf4de', question_ar: 'أسند كل دور في خلية الأزمة.', hint_ar: 'طابق حسب الوظيفة: طبيب (طبي)، شرطة (تحقيق)، إمام (تعاطف).', explanation_ar: 'تشكيل خلية أزمة بملامح متكاملة. إشارة: الرئيس (فاطمة)، طبي (د. كريم)، محقق (النقيب حسن)، المتحدث الرسمي (سارة)، التعاطف (الإمام)، البيانات (يوسف).', feedback_positive_ar: 'خلية أزمة مثالية! خبرة ومصداقية وتنوع.', feedback_negative_ar: 'طابق حسب الوظيفة: طبيب (طبي)، شرطة (تحقيق)، إمام (تعاطف).', options: { pairs: [
    { left_fr: 'Chef', left_ar: 'الرئيس', right_fr: 'Fatima (expérience)', right_ar: 'فاطمة (خبرة)' },
    { left_fr: 'Médical', left_ar: 'طبي', right_fr: 'Dr. Karim', right_ar: 'د. كريم' },
    { left_fr: 'Enquêteur', left_ar: 'محقق', right_fr: 'Hassan', right_ar: 'حسن' },
    { left_fr: 'Porte-parole', left_ar: 'المتحدث الرسمي', right_fr: 'Sarah', right_ar: 'سارة' },
    { left_fr: 'Empathie', left_ar: 'التعاطف', right_fr: 'Imam', right_ar: 'الإمام' },
    { left_fr: 'Données', left_ar: 'البيانات', right_fr: 'Youssef', right_ar: 'يوسف' }
  ]}},
  { id: '57e3e6d3-939e-4753-8130-f0887f81ecb1', question_ar: 'التواصل الإعلامي أثناء الأزمة.', hint_ar: 'لا تهاجم أبدًا، التزم بالوقائع والتعاطف.', explanation_ar: 'التواصل في الأزمة بشفافية وتعاطف وإعادة التركيز على العمل. إشارة: أخبر بما تعرفه/لا تعرفه، أعطِ الأرقام بتعاطف، اعترف بالغضب ثم أعد التركيز على العمل.', feedback_positive_ar: 'احترافية مثالية! واقعي، متعاطف ومعاد التركيز على العمل.', feedback_negative_ar: 'لا تهاجم أبدًا، التزم بالوقائع والتعاطف.', options: { steps: [
    { question_fr: "Premier message aux journalistes ?", question_ar: "أول رسالة للصحفيين؟", correct: 'B', responses: [{ id: 'A', text_fr: "« Pas de détails »", text_ar: '«لا تفاصيل»' }, { id: 'B', text_fr: "« Voici ce que nous savons, cherchons et faisons. »", text_ar: '«إليكم ما نعرفه ونبحث عنه ونقوم به.»' }] },
    { question_fr: "« Combien de morts ? »", question_ar: "«كم عدد الوفيات؟»", correct: 'B', responses: [{ id: 'A', text_fr: "« Beaucoup »", text_ar: '«كثير»' }, { id: 'B', text_fr: "« 3 décès confirmés. Nous sommes avec les familles. »", text_ar: '«3 وفيات مؤكدة. نحن مع العائلات.»' }] },
    { question_fr: "« C'est votre faute ! »", question_ar: "«هذا خطؤكم!»", correct: 'C', responses: [{ id: 'A', text_fr: "Attaquer", text_ar: 'الهجوم' }, { id: 'C', text_fr: "« Je comprends votre colère. L'enquête déterminera tout. Je sauve des vies. »", text_ar: '«أتفهم غضبكم. التحقيق سيحدد كل شيء. أنا أنقذ أرواحًا.»' }] }
  ]}},
  { id: '555ffff0-b2c1-473c-8463-5fe72e855c96', question_ar: 'اعثر على 5 أخطاء في تقرير تحليل الأزمة.', hint_ar: 'ابحث عن تحيزات البيانات والوعود المستحيلة.', explanation_ar: 'تحليل تقرير خاطئ مع تجنب الأخطاء الشائعة. إشارة: بيانات مشبوهة (100% رجال)، إسقاطات غير مبررة، استنتاج متسرع (10 شهادات)، اتهام بدون دليل، وعد مستحيل (24 ساعة).', feedback_positive_ar: 'يقظة مهنية! تجنبت الاستنتاجات المتسرعة والوعود المبالغ فيها.', feedback_negative_ar: 'ابحث عن تحيزات البيانات والوعود المستحيلة.', options: [
    { id: '1', label: 'بيانات «100% رجال» مشبوهة' }, { id: '2', label: 'إسقاطات بدون نموذج مبرر' }, { id: '3', label: 'استنتاج على 10 شهادات فقط' },
    { id: '4', label: 'اتهامات بدون أدلة' }, { id: '5', label: 'وعد: «كل شيء سينتهي خلال 24 ساعة»' }
  ]},
  { id: '13b08bea-cdd4-44dd-ae23-d620d38f0846', question_ar: '5 قرارات سريعة في الأزمة. عنصر مذعور؟ طفل خائف؟ خطأ سارة؟', hint_ar: 'الذعر يحتاج تنفسًا، والتعب يحتاج راحة.', explanation_ar: 'اتخاذ 5 قرارات سريعة تحت الضغط باستخدام المكتسبات السابقة. إشارة: ذعر ← 4-7-8؛ طفل ← انزل لمستواه؛ معارض ← تجاهل؛ خطأ ← تحليل جماعي؛ إرهاق ← سلّم المناوبة.', feedback_positive_ar: 'قيادة عادلة وإنسانية. هدوء قبل العمل، اعتراف بالحدود.', feedback_negative_ar: 'الذعر يحتاج تنفسًا، والتعب يحتاج راحة.', options: [{ id: 'A', label: 'تنفس 4-7-8' }, { id: 'B', label: 'انزل لمستواه/لطيف' }, { id: 'C', label: 'تحليل الخطأ معًا' }, { id: 'D', label: 'النوم أولًا' }] },
  { id: '6f6a477f-4888-4d85-8e04-93eeb4ea25d2', question_ar: 'اربط ركائز تقرير المصير (SDT).', hint_ar: 'الاستقلالية (حرية)، الكفاءة (إتقان)، الانتماء (رابط).', explanation_ar: 'تطبيق الركائز الثلاث لتقرير المصير (SDT). إشارة: الاستقلالية ← «تصرّف كما تراه مناسبًا»؛ الكفاءة ← «احتفل بالخبرة»؛ الانتماء ← «وجبة جماعية».', feedback_positive_ar: 'إتقان SDT! أساس الدافع الذاتي.', feedback_negative_ar: 'الاستقلالية (حرية)، الكفاءة (إتقان)، الانتماء (رابط).', options: { pairs: [
    { left_fr: 'Autonomie', left_ar: 'الاستقلالية', right_fr: "« Gère comme tu le sens »", right_ar: '«تصرّف كما تراه مناسبًا»' },
    { left_fr: 'Compétence', left_ar: 'الكفاءة', right_fr: "« Célèbre l'expertise »", right_ar: '«احتفل بالخبرة»' },
    { left_fr: 'Affiliation', left_ar: 'الانتماء', right_fr: "« Repas d'équipe »", right_ar: '«وجبة جماعية»' }
  ]}},
  { id: 'efe93cd3-a41a-4482-8fc5-cbf2a63f25af', question_ar: 'معضلة أخلاقية مع الوزير.', hint_ar: 'الطاعة العمياء خطأ في الإدارة العامة.', explanation_ar: 'حل معضلة أخلاقية بنزاهة. إشارة: تحاور أولًا، أظهر مخاطر الإخفاء، ثم إذا لزم الأمر، قل الحقيقة علنيًا.', feedback_positive_ar: 'نزاهة مطلقة. مسيرتك المهنية تنتهي، لكن نزاهتك أبدًا.', feedback_negative_ar: 'الطاعة العمياء خطأ في الإدارة العامة.', options: { steps: [
    { question_fr: "Le Ministre demande de cacher un nom. Conseil ?", question_ar: "الوزير يطلب إخفاء اسم. نصيحتك؟", correct: 'B', responses: [{ id: 'A', text_fr: "Obéir", text_ar: 'أطيع' }, { id: 'B', text_fr: "« Dialoguez d'abord. »", text_ar: '«تحاوروا أولًا.»' }] },
    { question_fr: "Il menace. Que réponds-tu ?", question_ar: "يهدد. ماذا تجيب؟", correct: 'C', responses: [{ id: 'A', text_fr: "Céder", text_ar: 'أستسلم' }, { id: 'C', text_fr: "Expliquer les risques énormes du secret s'il est découvert.", text_ar: 'أشرح المخاطر الهائلة للسر إذا انكشف.' }] },
    { question_fr: "Il reste ferme. Action ?", question_ar: "يبقى متمسكًا. ما الإجراء؟", correct: 'B', responses: [{ id: 'A', text_fr: "Se taire", text_ar: 'أصمت' }, { id: 'B', text_fr: "Dire la vérité publiquement.", text_ar: 'قول الحقيقة علنيًا.' }] }
  ]}},
  { id: 'abcca1d7-d9f6-4890-b558-258bfb3e522e', question_ar: 'اكتب خطتك لـ 100 يوم كوالٍ (أولويات، فريق، وقاية).', hint_ar: 'تأكد من تغطية الأولويات والفريق والوقاية.', explanation_ar: 'وضع خطة عمل 100 يوم مهيكلة. إشارة: 3 أولويات واضحة، فريق محدد، وقاية ملموسة، تواصل مواطني ملتزم.', feedback_positive_ar: 'رؤية استراتيجية ممتازة! خطة مهيكلة وواقعية.', feedback_negative_ar: 'تأكد من تغطية الأولويات والفريق والوقاية.', options: [] },
  { id: 'f3ae2dbe-48d5-4e32-ac5a-917a2145a3d4', question_ar: 'التفويض النهائي لـ 8 مهام على 6 أعضاء.', hint_ar: 'طابق كل مهمة بخبرة العضو.', explanation_ar: 'تفويض مهام الأزمة حسب الخبرات. إشارة: المؤتمر الصحفي ووسائل التواصل ← سارة؛ زيارة المستشفى ← الإمام؛ إغلاق المصدر ← حسن؛ التقرير والدروس المستفادة ← فاطمة؛ البيانات ← يوسف؛ تنسيق المستشفيات ← د. كريم.', feedback_positive_ar: 'تفويض استراتيجي مثالي! حمل متوازن.', feedback_negative_ar: 'طابق كل مهمة بخبرة العضو.', options: null }, // empty pairs in DB, skip
  { id: '5d32fc8c-1edf-493e-bdad-d300dbc08129', question_ar: '«سأولد عندما توازن الرأس والقلب واليدين...»', hint_ar: 'التوازن بين الضغط والهدوء، الأنا والنحن.', explanation_ar: 'تحديد الحكمة كتوازن بين العقل والتعاطف والعمل. إشارة: «سأولد عندما توازن الرأس والقلب واليدين. بين الضغط والهدوء، الأنا والنحن، الآن والغد.»', feedback_positive_ar: 'رائع! الحكمة = توازن بين العقل والتعاطف والعمل.', feedback_negative_ar: 'التوازن بين الضغط والهدوء، الأنا والنحن.', options: [{ id: 'A', label: 'الخبرة' }, { id: 'B', label: 'الكاريزما' }, { id: 'C', label: 'الحكمة' }] }
];

async function run() {
  console.log('=== Mission 5: Wilaya (10 exercises) ===');
  for (const ex of exercises) {
    const update = { question_ar: ex.question_ar, hint_ar: ex.hint_ar, explanation_ar: ex.explanation_ar, feedback_positive_ar: ex.feedback_positive_ar, feedback_negative_ar: ex.feedback_negative_ar };
    if (ex.options && (Array.isArray(ex.options) ? ex.options.length > 0 : Object.keys(ex.options).length > 0)) {
      const { data: curr } = await supabase.from('questions').select('options').eq('id', ex.id).single();
      let dbOpts = curr?.options || {};
      if (typeof dbOpts === 'string') try { dbOpts = JSON.parse(dbOpts); } catch(e) {}
      if (Array.isArray(ex.options) && Array.isArray(dbOpts)) { update.options = dbOpts.map((o, i) => ({ ...o, label_ar: ex.options[i]?.label || '' })); }
      else if (ex.options.pairs && dbOpts.pairs) { update.options = { ...dbOpts, pairs: dbOpts.pairs.map((p, i) => ({ ...p, left_ar: ex.options.pairs[i]?.left_ar || '', right_ar: ex.options.pairs[i]?.right_ar || '' }))}; }
      else if (ex.options.steps && dbOpts.steps) { update.options = { ...dbOpts, steps: dbOpts.steps.map((s, i) => { const a = ex.options.steps[i] || {}; return { ...s, question_ar: a.question_ar || '', responses: (s.responses || []).map((r, j) => ({ ...r, text_ar: a.responses?.[j]?.text_ar || '' })) }; })}; }
      else if (ex.options.bank && dbOpts.bank) { update.options = { ...dbOpts, bank: dbOpts.bank.map((b, i) => ({ ...b, text_ar: ex.options.bank[i]?.text_ar || '' }))}; }
    }
    const { error } = await supabase.from('questions').update(update).eq('id', ex.id);
    console.log(error ? `❌ ${ex.id}: ${error.message}` : `✅ ${ex.id}`);
  }
  console.log('🎉 Mission 5 done!');
}
run().catch(console.error);
