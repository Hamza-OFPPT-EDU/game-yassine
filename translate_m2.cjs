// translate_m2.cjs — Mission 2: Ministère & Prise de décision (10 exercises)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rydmefudpczpxrresflx.supabase.co', 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_');

const exercises = [
  {
    id: '40f6ff19-b6fe-41a0-8a02-dfd0469b5dd4', // QCM decision type
    question_ar: 'مدير معهدك يريد شراء 50 حاسوبًا (500,000 درهم). ما نوع القرار؟',
    hint_ar: 'القاعدة: <10 آلاف = تشغيلي، 10 آلاف-مليون = تكتيكي، >مليون = استراتيجي.',
    explanation_ar: 'تصنيف القرار حسب ميزانيته وأثره الزمني. إشارة: ميزانية متوسطة (500 ألف درهم) وأثر 2-3 سنوات ← قرار تكتيكي (لا تشغيلي ولا استراتيجي).',
    feedback_positive_ar: 'صحيح! تكتيكي: ميزانية متوسطة، أثر 2-3 سنوات.',
    feedback_negative_ar: 'القاعدة: <10 آلاف = تشغيلي، 10 آلاف-مليون = تكتيكي، >مليون = استراتيجي.',
    options: [
      { id: 'A', label: 'تشغيلي' },
      { id: 'B', label: 'تكتيكي' },
      { id: 'C', label: 'استراتيجي' }
    ]
  },
  {
    id: '047e74f0-116d-4e05-9ff0-f14125630b1d', // ranking Simon 6 steps
    question_ar: 'رتّب الخطوات الست لاتخاذ القرار وفق سيمون.',
    hint_ar: 'اتبع المنطق: أولًا حدد المشكلة، ثم افهم، استكشف، قيّم، اختر.',
    explanation_ar: 'إتقان الخطوات الست لعملية اتخاذ القرار وفق سيمون. إشارة: الترتيب المنطقي: تحديد المشكلة، جمع المعلومات، توليد الخيارات، التقييم، الاختيار، التنفيذ والمتابعة.',
    feedback_positive_ar: 'ممتاز! أتقنت عملية سيمون: تحديد، جمع، توليد، تقييم، اختيار، تنفيذ.',
    feedback_negative_ar: 'اتبع المنطق: أولًا حدد المشكلة، ثم افهم، استكشف، قيّم، اختر.',
    options: [
      { label: 'تحديد المشكلة', label_ar: 'تحديد المشكلة' },
      { label: 'جمع المعلومات', label_ar: 'جمع المعلومات' },
      { label: 'توليد الخيارات', label_ar: 'توليد الخيارات' },
      { label: 'تقييم الخيارات', label_ar: 'تقييم الخيارات' },
      { label: 'اختيار الأفضل', label_ar: 'اختيار الأفضل' },
      { label: 'التنفيذ', label_ar: 'التنفيذ' }
    ]
  },
  {
    id: '80cffac2-05a8-40bd-9249-bc1c49056df5', // scenario_dialogue citizen
    question_ar: 'مواطن غاضب: «هذه المرة الثالثة التي آتي فيها!» رئيسك غائب. ما تصرفك؟',
    hint_ar: 'إظهار الاهتمام يحل غالبًا 80% من المشكلة العاطفية.',
    explanation_ar: 'التعامل مع مواطن غاضب بالإنصات الفعال والالتزام. إشارة: اعتذر، أنصت، دوّن كل شيء، التزم بالمتابعة – الإنصات يحل 80% من المشكلة.',
    feedback_positive_ar: 'أحسنت! إنصات فعال، تقبّل، التزام واقعي = إدارة شكوى المواطن.',
    feedback_negative_ar: 'إظهار الاهتمام يحل غالبًا 80% من المشكلة العاطفية.',
    options: [
      { id: 'A', label: '«عُد غدًا»' },
      { id: 'B', label: '«أعتذر، أنصت إليك، أدوّن كل شيء، وأعدك بالمتابعة.»' },
      { id: 'C', label: '«أعطيه رقمًا خاطئًا»' }
    ]
  },
  {
    id: '3c51ea18-52d6-4c74-acae-98093da9a970', // vrai_faux - ne pas décider
    question_ar: '«عدم اتخاذ القرار = اتخاذ قرار.»',
    hint_ar: 'التردد شكل من أشكال القرار السلبي.',
    explanation_ar: 'تمييز الأفكار الخاطئة حول اتخاذ القرار. إشارة: القرارات الجيدة ≠ سريعة (خطأ)؛ الحدس والمنطق يتكاملان (خطأ أن الحدس أفضل من المنطق)؛ عدم القرار = قرار (صحيح).',
    feedback_positive_ar: 'صحيح. التردد يترك الأحداث تقرر بدلًا عنك.',
    feedback_negative_ar: 'التردد شكل من أشكال القرار السلبي.',
    options: []
  },
  {
    id: '811ffc3a-5fe0-47bf-969f-c2433b0b6fee', // ranking Eisenhower
    question_ar: 'رتّب هذه المهام حسب الأولوية (مصفوفة أيزنهاور).',
    hint_ar: 'عاجل + مهم = نفّذ؛ مهم غير عاجل = خطط.',
    explanation_ar: 'استخدام مصفوفة أيزنهاور لترتيب المهام. إشارة: عاجل + مهم أولًا (بريد الوزير، اتصال الصحفي)، ثم عاجل (تحضير الاجتماع)، ثم مهم غير عاجل (حجز القاعة، اللوازم)، وأخيرًا الباقي.',
    feedback_positive_ar: 'ممتاز! أتقنت مصفوفة أيزنهاور: عاجل/مهم أولًا.',
    feedback_negative_ar: 'عاجل + مهم = نفّذ؛ مهم غير عاجل = خطط.',
    options: [
      { label: 'بريد الوزير (عاجل/مهم)', label_ar: 'بريد الوزير (عاجل/مهم)' },
      { label: 'اتصال عاجل من صحفي', label_ar: 'اتصال عاجل من صحفي' },
      { label: 'تحضير اجتماع الساعة 11', label_ar: 'تحضير اجتماع الساعة 11' },
      { label: 'حجز قاعة الأسبوع المقبل', label_ar: 'حجز قاعة الأسبوع المقبل' },
      { label: 'اللوازم (مخزون أسبوعين)', label_ar: 'اللوازم (مخزون أسبوعين)' },
      { label: 'تحديث الموقع الإلكتروني', label_ar: 'تحديث الموقع الإلكتروني' }
    ]
  },
  {
    id: '9a4a6b39-5359-46a2-860a-862a9fa80042', // fill_blanks cognitive biases
    question_ar: 'أكمل النص حول التحيزات المعرفية.',
    hint_ar: 'الترسيخ = الرقم الأول، التأكيد = البحث عما يعزز، التوفر = الذكريات الأخيرة.',
    explanation_ar: 'تحديد ثلاثة تحيزات معرفية (الترسيخ، التأكيد، التوفر). إشارة: الترسيخ (الرقم الأول)، التأكيد (البحث عما يؤكد)، التوفر (الحكم بالذكريات الأخيرة).',
    feedback_positive_ar: 'ممتاز! الترسيخ، التأكيد، التوفر: ثلاثة فخاخ يجب تجنبها.',
    feedback_negative_ar: 'الترسيخ = الرقم الأول، التأكيد = البحث عما يعزز، التوفر = الذكريات الأخيرة.',
    options: { bank: [
      { text_fr: 'ancrage', text_ar: 'الترسيخ' },
      { text_fr: 'première', text_ar: 'الأولى' },
      { text_fr: 'confirmation', text_ar: 'التأكيد' },
      { text_fr: 'disponibilité', text_ar: 'التوفر' },
      { text_fr: 'récents', text_ar: 'الأخيرة' },
      { text_fr: 'biais', text_ar: 'التحيزات' }
    ]}
  },
  {
    id: '7785c4fe-975b-42de-982d-34101ece238a', // scenario_cascade Karim error
    question_ar: 'معضلة أخلاقية: خطأ كريم.',
    hint_ar: 'الأخلاق تتطلب الشفافية والشجاعة.',
    explanation_ar: 'حل معضلة أخلاقية بالحوار الخاص والأدلة والنزاهة. إشارة: تحدث أولًا مع كريم، أظهر الأدلة بهدوء، ثم اقترح عليه أن يبلّغ بنفسه.',
    feedback_positive_ar: 'نزاهة مثالية! الحوار قبل التصعيد، لكن بدون تنازل.',
    feedback_negative_ar: 'الأخلاق تتطلب الشفافية والشجاعة.',
    options: { steps: [
      { question_fr: "Erreur de 500 DH sur les frais de Karim. Première réaction ?", question_ar: "خطأ بمبلغ 500 درهم في نفقات كريم. ما ردة فعلك الأولى؟", correct: 'C', responses: [
        { id: 'A', text_fr: 'Le dénoncer', text_ar: 'أبلّغ عنه' },
        { id: 'C', text_fr: "Parler D'ABORD à Karim", text_ar: 'التحدث أولًا مع كريم' }
      ]},
      { question_fr: "Karim nie l'erreur. Que fais-tu ?", question_ar: "كريم ينكر الخطأ. ماذا تفعل؟", correct: 'C', responses: [
        { id: 'A', text_fr: 'Laisser tomber', text_ar: 'أتخلى عن الأمر' },
        { id: 'C', text_fr: 'Lui montrer les preuves calmement', text_ar: 'أريه الأدلة بهدوء' }
      ]},
      { question_fr: "Il demande le secret. Que réponds-tu ?", question_ar: "يطلب السرية. ماذا تجيب؟", correct: 'B', responses: [
        { id: 'A', text_fr: "D'accord", text_ar: 'حسنًا' },
        { id: 'B', text_fr: "« Je vais devoir signaler à Fatima. Veux-tu le faire toi-même ? »", text_ar: '«سأضطر لإبلاغ فاطمة. هل تريد أن تفعل ذلك بنفسك؟»' }
      ]}
    ]}
  },
  {
    id: '52317c29-2dff-4819-9773-af2fb0efa53a', // error_detection digitalisation
    question_ar: 'حدد الأخطاء الخمس في قرارات مشروع الرقمنة.',
    hint_ar: 'ابحث عن التسرع وغياب الاستشارة.',
    explanation_ar: 'رصد الأخطاء الشائعة في اتخاذ قرارات المشاريع. إشارة: ميزانية سريعة جدًا، لا طلب عروض، عدم استشارة الموظفين، موعد نهائي غير واقعي، لا اختبار تجريبي.',
    feedback_positive_ar: 'تشخيص مثالي! حددت انتهاكات عملية سيمون.',
    feedback_negative_ar: 'ابحث عن التسرع وغياب الاستشارة.',
    options: [
      { id: '1', label: 'ميزانية قُررت بسرعة (30 دقيقة)' },
      { id: '2', label: 'لا طلب عروض' },
      { id: '3', label: 'صفر استشارة للموظفين' },
      { id: '4', label: 'موعد نهائي غير واقعي (6 أشهر)' },
      { id: '5', label: 'لا اختبار تجريبي' }
    ]
  },
  {
    id: '84f05ba9-694f-4138-b0f0-97fd425c07ca', // scenario_decision 100K budget
    question_ar: '100,000 درهم للإنفاق. ثلاثة مشاريع ممكنة. ما اختيارك؟',
    hint_ar: 'فرض حل يخلق مقاومة.',
    explanation_ar: 'تبني قيادة تشاركية لتوزيع الميزانية. إشارة: اطلب رأي جميع الموظفين عبر تصويت ديمقراطي – الالتزام مضمون.',
    feedback_positive_ar: 'قيادة تشاركية! الالتزام مضمون عندما يختار المستخدمون.',
    feedback_negative_ar: 'فرض حل يخلق مقاومة.',
    options: [
      { id: 'A', label: 'تكوين' },
      { id: 'B', label: 'برمجيات' },
      { id: 'D', label: 'أطلب من الموظفين التصويت' }
    ]
  },
  {
    id: '4ee82767-5edb-4526-b95c-0eee4e10459a', // short_answer decision plan
    question_ar: 'اكتب خطتك الشخصية لاتخاذ القرار (القرار، 6 خطوات، التحيز).',
    hint_ar: 'تحقق من ذكر قرار واحد، والخطوات، وتحيز معرفي.',
    explanation_ar: 'تطبيق خطوات سيمون الست على قرار شخصي مع توقع تحيز. إشارة: اختر قرارًا حقيقيًا، اتبع الخطوات، وسمِّ تحيزًا (مثل: الترسيخ، التأكيد، التوفر).',
    feedback_positive_ar: 'تفكير ما وراء معرفي رائع! خطة ملموسة.',
    feedback_negative_ar: 'تحقق من ذكر قرار واحد، والخطوات، وتحيز معرفي.',
    options: []
  }
];

async function run() {
  console.log('=== Mission 2: Ministère (10 exercises) ===');
  for (const ex of exercises) {
    const update = {
      question_ar: ex.question_ar,
      hint_ar: ex.hint_ar,
      explanation_ar: ex.explanation_ar,
      feedback_positive_ar: ex.feedback_positive_ar,
      feedback_negative_ar: ex.feedback_negative_ar
    };

    if (ex.options && (Array.isArray(ex.options) ? ex.options.length > 0 : Object.keys(ex.options).length > 0)) {
      const { data: curr } = await supabase.from('questions').select('options').eq('id', ex.id).single();
      let dbOpts = curr?.options || {};
      if (typeof dbOpts === 'string') try { dbOpts = JSON.parse(dbOpts); } catch(e) {}

      if (Array.isArray(ex.options) && Array.isArray(dbOpts)) {
        update.options = dbOpts.map((o, i) => ({ ...o, label_ar: ex.options[i]?.label || '' }));
      } else if (ex.options.pairs && dbOpts.pairs) {
        update.options = { ...dbOpts, pairs: dbOpts.pairs.map((p, i) => ({ ...p, left_ar: ex.options.pairs[i]?.left_ar || '', right_ar: ex.options.pairs[i]?.right_ar || '' }))};
      } else if (ex.options.steps && dbOpts.steps) {
        update.options = { ...dbOpts, steps: dbOpts.steps.map((s, i) => {
          const arStep = ex.options.steps[i] || {};
          return { ...s, question_ar: arStep.question_ar || '', responses: (s.responses || []).map((r, j) => ({ ...r, text_ar: arStep.responses?.[j]?.text_ar || '' })) };
        })};
      } else if (ex.options.bank && dbOpts.bank) {
        update.options = { ...dbOpts, bank: dbOpts.bank.map((b, i) => ({ ...b, text_ar: ex.options.bank[i]?.text_ar || '' }))};
      } else if (Array.isArray(ex.options) && dbOpts && !Array.isArray(dbOpts)) {
        // ranking with {order:[]} structure in DB
        if (dbOpts.order) {
          update.options = { ...dbOpts, order: dbOpts.order.map((o, i) => ({ ...o, label_ar: ex.options[i]?.label_ar || '' }))};
        }
      }
    }

    const { error } = await supabase.from('questions').update(update).eq('id', ex.id);
    console.log(error ? `❌ ${ex.id}: ${error.message}` : `✅ ${ex.id}`);
  }
  console.log('🎉 Mission 2 done!');
}

run().catch(console.error);
