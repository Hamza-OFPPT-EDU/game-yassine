// translate_m1.cjs — Mission 1: Ibn Sina (10 exercises)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rydmefudpczpxrresflx.supabase.co', 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_');

const exercises = [
  {
    id: 'ad31f2ed-0342-4d5f-997a-89d5b2ea28f1', // QCM stress type
    question_ar: 'إنه يومك الأول في التدريب. عليك تقديم عرض خلال 5 دقائق. قلبك ينبض بقوة، تتعرق، يداك ترتجفان. ما نوع الضغط الذي تعاني منه؟',
    hint_ar: 'لا. الضغط المزمن يستمر لأسابيع. هنا الأمر قصير وشديد ← ضغط حاد.',
    explanation_ar: 'التعرف على أنواع الضغط المختلفة (حاد، مزمن، إيجابي). إشارة: ضغط قصير وشديد مرتبط بحدث محدد كعرض وشيك هو ضغط حاد.',
    feedback_positive_ar: 'أحسنت! الضغط الحاد: قصير، شديد، يُثيره حدث محدد.',
    feedback_negative_ar: 'لا. الضغط المزمن يستمر لأسابيع. هنا الأمر قصير وشديد ← ضغط حاد.',
    options: [
      { id: 'A', label: 'ضغط مزمن' },
      { id: 'B', label: 'ضغط حاد' },
      { id: 'C', label: 'ضغط إيجابي' },
      { id: 'D', label: 'لا يوجد ضغط' }
    ]
  },
  {
    id: 'f2cd80af-f489-4381-bad0-8d7ce97639cb', // V/F stress always bad
    question_ar: '«الضغط دائمًا ضار بالصحة.»',
    hint_ar: 'خطأ. الرياضي قبل المنافسة يشعر بضغط يساعده على الأداء.',
    explanation_ar: 'تبديد الأفكار الخاطئة حول الضغط. إشارة: الضغط الإيجابي يُحفز (خطأ أن الضغط دائمًا سيء)؛ إدارة الضغط مهارة مكتسبة (صحيح)؛ الضغط ليس علامة ضعف (خطأ).',
    feedback_positive_ar: 'ممتاز! الضغط الإيجابي يُحفز. فقط الضغط المزمن هو الخطير.',
    feedback_negative_ar: 'خطأ. الرياضي قبل المنافسة يشعر بضغط يساعده على الأداء.',
    options: [] // vrai_faux has no options in DB
  },
  {
    id: '21a48fdd-c9d8-4a56-8138-0c7c0579b211', // matching symptoms
    question_ar: 'اربط كل عرض بفئته: جسدي، عاطفي، سلوكي.',
    hint_ar: 'حاول مجددًا. جسدي = الجسم، عاطفي = المشاعر، سلوكي = التصرفات.',
    explanation_ar: 'تصنيف أعراض الضغط في ثلاث فئات: جسدي، عاطفي، سلوكي. إشارة: تسارع نبض القلب ← جسدي؛ البكاء ← عاطفي؛ الأكل المفرط ← سلوكي؛ صداع الرأس ← جسدي؛ الحزن ← عاطفي؛ العزلة ← سلوكي.',
    feedback_positive_ar: 'ممتاز! تميز بين الفئات الثلاث: الجسم، المشاعر، التصرفات.',
    feedback_negative_ar: 'حاول مجددًا. جسدي = الجسم، عاطفي = المشاعر، سلوكي = التصرفات.',
    options: { pairs: [
      { left_fr: 'Cœur qui bat vite', left_ar: 'تسارع نبض القلب', right_fr: 'Physique', right_ar: 'جسدي' },
      { left_fr: 'Pleurer facilement', left_ar: 'البكاء بسهولة', right_fr: 'Émotionnel', right_ar: 'عاطفي' },
      { left_fr: 'Manger trop ou pas assez', left_ar: 'الأكل المفرط أو القليل', right_fr: 'Comportemental', right_ar: 'سلوكي' },
      { left_fr: 'Mal de tête', left_ar: 'صداع الرأس', right_fr: 'Physique', right_ar: 'جسدي' },
      { left_fr: 'Se sentir triste sans raison', left_ar: 'الشعور بالحزن بدون سبب', right_fr: 'Émotionnel', right_ar: 'عاطفي' },
      { left_fr: "S'isoler des autres", left_ar: 'العزلة عن الآخرين', right_fr: 'Comportemental', right_ar: 'سلوكي' }
    ]}
  },
  {
    id: '089b7834-e444-4473-a942-bf64630ce3db', // scenario panicked mom
    question_ar: 'أم مذعورة مع ابنها الذي يصرخ. د. أمينة مشغولة. ما أفضل تصرف لك؟',
    hint_ar: 'في مواجهة الضغط، كن هادئًا، تقبّل المشاعر، لا تتجاهل الضائقة.',
    explanation_ar: 'استخدام التنظيم المشترك للمشاعر لتهدئة شخص مذعور. إشارة: اقترب بهدوء، انزل إلى مستوى الطفل، تحدث بلطف مع الأم – هدوؤك ينتقل إليهم.',
    feedback_positive_ar: 'أحسنت! جسم هادئ، تواصل بصري مع الطفل، صوت لطيف = تنظيم مشترك للمشاعر.',
    feedback_negative_ar: 'في مواجهة الضغط، كن هادئًا، تقبّل المشاعر، لا تتجاهل الضائقة.',
    options: [
      { id: 'A', label: 'أصاب بالذعر أيضًا' },
      { id: 'B', label: '«اهدئي، ليس الأمر خطيرًا»' },
      { id: 'C', label: 'أقترب بهدوء، أنزل إلى مستوى الطفل، وأتحدث بلطف مع الأم.' }
    ]
  },
  {
    id: 'b69b217d-0e87-48db-8504-7e15caf41db6', // fill_blanks 4-7-8
    question_ar: 'أكمل النص حول تقنية التنفس 4-7-8.',
    hint_ar: 'تذكر: 4-7-8. الأنف للشهيق، الفم للزفير.',
    explanation_ar: 'إتقان تقنية التنفس 4-7-8 لتقليل الضغط بسرعة. إشارة: استنشق من الأنف 4 ثوانٍ، احبس 7 ثوانٍ، ازفر من الفم 8 ثوانٍ، كرر 3 مرات – ينشط الجهاز العصبي نظير الودي.',
    feedback_positive_ar: 'ممتاز! استنشق 4 ثوانٍ من الأنف، احبس 7 ثوانٍ، ازفر 8 ثوانٍ من الفم، كرر 3 مرات.',
    feedback_negative_ar: 'تذكر: 4-7-8. الأنف للشهيق، الفم للزفير.',
    options: { bank: [
      { text_fr: 'inspire', text_ar: 'استنشق' },
      { text_fr: 'nez', text_ar: 'الأنف' },
      { text_fr: '4', text_ar: '4' },
      { text_fr: 'bloque', text_ar: 'احبس' },
      { text_fr: '7', text_ar: '7' },
      { text_fr: 'expire', text_ar: 'ازفر' },
      { text_fr: 'bouche', text_ar: 'الفم' },
      { text_fr: '8', text_ar: '8' },
      { text_fr: '3 fois', text_ar: '3 مرات' },
      { text_fr: 'parasympathique', text_ar: 'نظير الودي' }
    ]}
  },
  {
    id: 'ef4c273b-e7e3-4c57-a9c8-9075cc1adf17', // time_attack breathing
    question_ar: 'اتبع الدليل البصري لإتمام 3 دورات كاملة من التنفس 4-7-8. كيف تشعر الآن؟',
    hint_ar: 'المحاولة بحد ذاتها انتصار. أعد المحاولة 2-3 مرات يوميًا.',
    explanation_ar: 'ممارسة تقنية مضادة للضغط بانتظام. إشارة: أي إجابة مقبولة – المحاولة بحد ذاتها انتصار، والممارسة المنتظمة تعزز الآثار.',
    feedback_positive_ar: 'أحسنت على المحاولة! الممارسة المنتظمة تعزز الآثار. استمر!',
    feedback_negative_ar: 'المحاولة بحد ذاتها انتصار. أعد المحاولة 2-3 مرات يوميًا.',
    options: [
      { id: 'A', label: 'أكثر هدوءًا' },
      { id: 'B', label: 'كما كنت' },
      { id: 'C', label: 'بدوار قليلًا' },
      { id: 'D', label: 'أكثر تركيزًا' }
    ]
  },
  {
    id: '30eee2f3-4b42-4600-92be-d34be57964b5', // scenario_cascade grief
    question_ar: 'الدعم العاطفي بعد صدمة.',
    hint_ar: 'الصمت والإنصات غالبًا أقوى من الكلمات.',
    explanation_ar: 'مرافقة شخص حزين بالحضور الصامت واحترام الدموع والإنصات الفعال والتقبّل. إشارة: اجلس بصمت، قدم منديلًا، ثم قل «كانت تعني لك الكثير. أخبرني إن أردت.»',
    feedback_positive_ar: 'ممتاز! التقبّل + الدعوة + عدم الحكم = أساس الدعم العاطفي.',
    feedback_negative_ar: 'الصمت والإنصات غالبًا أقوى من الكلمات.',
    options: { steps: [
      { question_fr: "Un jeune homme apprend le décès de sa grand-mère. Quelle est ta PREMIÈRE action ?", question_ar: "شاب يعلم بوفاة جدته. ما أول تصرف لك؟", correct: 'B', responses: [
        { id: 'A', text_fr: 'Lui parler', text_ar: 'التحدث إليه' },
        { id: 'B', text_fr: "M'asseoir à côté de lui en silence.", text_ar: 'الجلوس بجانبه بصمت.' }
      ]},
      { question_fr: "Il commence à pleurer. Que fais-tu ?", question_ar: "بدأ بالبكاء. ماذا تفعل؟", correct: 'B', responses: [
        { id: 'A', text_fr: "Lui dire d'arrêter", text_ar: 'أطلب منه التوقف' },
        { id: 'B', text_fr: 'Lui tendre un mouchoir en silence.', text_ar: 'أقدم له منديلًا بصمت.' }
      ]},
      { question_fr: "Il dit : « Elle était tout pour moi… ». Que réponds-tu ?", question_ar: "يقول: «كانت كل شيء بالنسبة لي...». ماذا تجيب؟", correct: 'C', responses: [
        { id: 'A', text_fr: "« C'est la vie »", text_ar: '«هذه هي الحياة»' },
        { id: 'C', text_fr: "« Elle comptait beaucoup pour toi. Raconte-moi si tu veux. »", text_ar: '«كانت تعني لك الكثير. أخبرني إن أردت.»' }
      ]}
    ]}
  },
  {
    id: '485c0388-1184-42ea-8822-38e7a5e15c26', // error_detection burnout
    question_ar: 'حدد الأخطاء الخمس الكبرى في جدول الدكتور رشيد.',
    hint_ar: 'ابحث عن النقص الأساسي: النوم، الراحة، التغذية، الترفيه.',
    explanation_ar: 'تحديد عوامل الاحتراق الوظيفي. إشارة: لا استراحة، نوم غير كافٍ، لا يوم راحة كامل، تغذية كارثية، صفر ترفيه/رياضة – هذه الأسباب الخمسة.',
    feedback_positive_ar: 'تشخيص ممتاز! حددت الأسباب الخمسة للاحتراق الوظيفي.',
    feedback_negative_ar: 'ابحث عن النقص الأساسي: النوم، الراحة، التغذية، الترفيه.',
    options: [
      { id: '1', label: 'لا استراحة يومية' },
      { id: '2', label: 'نوم غير كافٍ (4-5 ساعات)' },
      { id: '3', label: 'لا يوم راحة كامل' },
      { id: '4', label: 'تغذية كارثية (8 أكواب قهوة)' },
      { id: '5', label: 'لا ترفيه / صفر رياضة' }
    ]
  },
  {
    id: '147da4f2-526f-4324-acd7-7a3bf25fa592', // scenario_decision relay
    question_ar: 'د. أمينة، منهكة بعد 12 ساعة مناوبة، عليها أن تقرر: تبقى أو تسلّم لزميل؟',
    hint_ar: 'الطبيب المنهك يرتكب 3 أضعاف الأخطاء. تسليم المناوبة قوة.',
    explanation_ar: 'الاعتراف بحدودك لحماية المرضى. إشارة: الطبيب المنهك يرتكب 3 أضعاف الأخطاء – أفضل قرار هو تسليم المناوبة لزميل مرتاح.',
    feedback_positive_ar: 'قرار مهني مثالي! الاعتراف بالحدود يُعطي الأولوية لسلامة المريض.',
    feedback_negative_ar: 'الطبيب المنهك يرتكب 3 أضعاف الأخطاء. تسليم المناوبة قوة.',
    options: [
      { id: 'A', label: 'تبقى لتنهي عملها' },
      { id: 'B', label: 'تسلّم المناوبة لزميل مرتاح.' }
    ]
  },
  {
    id: '326b303b-fd5d-4205-8c30-8193a562532a', // puzzle_riddle stress
    question_ar: '«أولد في الصدر، وأكبر في الأفكار... من أنا؟»',
    hint_ar: 'دليل: قلب ينبض بسرعة، حرارة، أيدٍ ترتجف.',
    explanation_ar: 'فهم أن الضغط، إذا أُحسنت إدارته، يصبح قوة. إشارة: يولد في الصدر، يكبر في الأفكار، خطير إذا هربت منه، قوي إذا روّضته – إنه الضغط.',
    feedback_positive_ar: 'أحسنت! الضغط يولد في القلب، يكبر في العقل. إذا روّضته، يصبح قوة.',
    feedback_negative_ar: 'دليل: قلب ينبض بسرعة، حرارة، أيدٍ ترتجف.',
    options: [
      { id: 'A', label: 'الخوف' },
      { id: 'B', label: 'التعب' },
      { id: 'C', label: 'الضغط' }
    ]
  }
];

async function run() {
  console.log('=== Mission 1: Ibn Sina (10 exercises) ===');
  for (const ex of exercises) {
    // Build the update object for the questions table
    const update = {
      question_ar: ex.question_ar,
      hint_ar: ex.hint_ar,
      explanation_ar: ex.explanation_ar,
      feedback_positive_ar: ex.feedback_positive_ar,
      feedback_negative_ar: ex.feedback_negative_ar
    };

    // Merge Arabic labels into existing options
    if (ex.options) {
      // Fetch current options from DB to merge
      const { data: curr } = await supabase.from('questions').select('options').eq('id', ex.id).single();
      let dbOpts = curr?.options || {};
      if (typeof dbOpts === 'string') try { dbOpts = JSON.parse(dbOpts); } catch(e) {}

      if (Array.isArray(ex.options) && Array.isArray(dbOpts)) {
        // Simple array options (qcm, vrai_faux, etc.)
        update.options = dbOpts.map((o, i) => {
          const ar = ex.options[i];
          return { ...o, label_ar: ar?.label || '' };
        });
      } else if (ex.options.pairs && dbOpts.pairs) {
        update.options = { ...dbOpts, pairs: dbOpts.pairs.map((p, i) => ({
          ...p,
          left_ar: ex.options.pairs[i]?.left_ar || '',
          right_ar: ex.options.pairs[i]?.right_ar || ''
        }))};
      } else if (ex.options.steps && dbOpts.steps) {
        update.options = { ...dbOpts, steps: dbOpts.steps.map((s, i) => {
          const arStep = ex.options.steps[i] || {};
          return {
            ...s,
            question_ar: arStep.question_ar || '',
            responses: (s.responses || []).map((r, j) => ({
              ...r,
              text_ar: arStep.responses?.[j]?.text_ar || ''
            }))
          };
        })};
      } else if (ex.options.bank && dbOpts.bank) {
        update.options = { ...dbOpts, bank: dbOpts.bank.map((b, i) => ({
          ...b,
          text_ar: ex.options.bank[i]?.text_ar || ''
        }))};
      }
    }

    const { error } = await supabase.from('questions').update(update).eq('id', ex.id);
    console.log(error ? `❌ ${ex.id}: ${error.message}` : `✅ ${ex.id}`);
  }
  console.log('🎉 Mission 1 done!');
}

run().catch(console.error);
