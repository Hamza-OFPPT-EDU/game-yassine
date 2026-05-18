// translate_m4.cjs — Mission 4: ONG Espoir Maroc (10 exercises)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rydmefudpczpxrresflx.supabase.co', 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_');

const exercises = [
  { id: '1d06d753-7c27-4e34-97bf-d5d11f1304b7', question_ar: 'موظف يعمل 14 ساعة/يوم منذ 6 أشهر، فراغ عاطفي، فقدان الحافز. ما المشكلة؟', hint_ar: 'الضغط الحاد قصير. هنا إنهاك مزمن.', explanation_ar: 'تشخيص الاحتراق الوظيفي (إنهاك عاطفي، سخرية، عدم فعالية). إشارة: 14 ساعة/يوم لمدة 6 أشهر، فقدان الحافز، فراغ عاطفي ← احتراق وظيفي.', feedback_positive_ar: 'صحيح! الاحتراق الوظيفي: إنهاك عاطفي، سخرية، عدم فعالية.', feedback_negative_ar: 'الضغط الحاد قصير. هنا إنهاك مزمن.', options: [{ id: 'A', label: 'ضغط حاد' }, { id: 'B', label: 'قلق' }, { id: 'C', label: 'احتراق وظيفي' }] },
  { id: '8ba04d81-3b10-48af-a3d3-8cb7ca9c832f', question_ar: 'اربط كل فعل بفئته: تكيفي أو غير تكيفي.', hint_ar: 'تكيفي = حلول صحية. غير تكيفي = هروب أو إنكار.', explanation_ar: 'التمييز بين استراتيجيات التكيف الإيجابية (الصحية) والسلبية (التجنب). إشارة: تكيفي: التحدث، الرياضة، المساعدة المهنية، التأمل. غير تكيفي: الكحول، الإنكار، العزلة، اللوم.', feedback_positive_ar: 'ممتاز! التكيف الإيجابي = المواجهة. غير التكيفي = التجنب.', feedback_negative_ar: 'تكيفي = حلول صحية. غير تكيفي = هروب أو إنكار.', options: { pairs: [
    { left_fr: 'Parler à un ami', left_ar: 'التحدث مع صديق', right_fr: 'Adaptatif', right_ar: 'تكيفي' },
    { left_fr: 'Alcool', left_ar: 'الكحول', right_fr: 'Inadaptatif', right_ar: 'غير تكيفي' },
    { left_fr: 'Sport', left_ar: 'الرياضة', right_fr: 'Adaptatif', right_ar: 'تكيفي' },
    { left_fr: 'Nier le problème', left_ar: 'إنكار المشكلة', right_fr: 'Inadaptatif', right_ar: 'غير تكيفي' },
    { left_fr: 'Méditer', left_ar: 'التأمل', right_fr: 'Adaptatif', right_ar: 'تكيفي' },
    { left_fr: 'Blâmer les autres', left_ar: 'لوم الآخرين', right_fr: 'Inadaptatif', right_ar: 'غير تكيفي' }
  ]}},
  { id: '5196f205-cf56-4887-85e2-1474d0768966', question_ar: 'سلمى عليها إعلان 4 تسريحات. ما أفضل نهج؟', hint_ar: 'البريد الإلكتروني أو الاجتماع الجماعي المباشر يُذل الأشخاص.', explanation_ar: 'إعلان خبر سيء بكرامة وشفافية. إشارة: اجتمع أولًا بشكل فردي مع المسرَّحين، ثم نظّم اجتماعًا جماعيًا شفافًا.', feedback_positive_ar: 'نهج مهني! كرامة فردية وشفافية جماعية.', feedback_negative_ar: 'البريد الإلكتروني أو الاجتماع الجماعي المباشر يُذل الأشخاص.', options: [{ id: 'A', label: 'بريد إلكتروني عام' }, { id: 'C', label: 'اجتماع فردي أولًا، ثم اجتماع جماعي.' }] },
  { id: '270fb862-7e41-4b19-874f-553e6866fa6c', question_ar: 'صح/خطأ سريع: "التكيف بالعزلة تكيفي."', hint_ar: 'الدعم الاجتماعي ركيزة من ركائز المرونة.', explanation_ar: 'معرفة تقنيات مكافحة الضغط ونماذج الاحتراق الوظيفي. إشارة: تنفس 4-7-8، الأبعاد الثلاثة للاحتراق (ماسلاش)، العزلة = تكيف غير ملائم.', feedback_positive_ar: 'صحيح. العزلة تفاقم الضغط بدل حله.', feedback_negative_ar: 'الدعم الاجتماعي ركيزة من ركائز المرونة.', options: [] },
  { id: 'bc36307d-4eef-4822-b70d-2e2df5c0e8b9', question_ar: 'أكمل الركائز الثمان للمرونة عند سيرولنيك.', hint_ar: 'لماذا، مع من، الضحك، التحرك، التعلم، الابتكار...', explanation_ar: 'حفظ الركائز الثمان للمرونة (سيرولنيك). إشارة: المعنى، العلاقات، الفكاهة، الجسم، التعلم، الإبداع، الأمل، الروحانية.', feedback_positive_ar: 'ممتاز! ركائز سيرولنيك تسمح بإعادة البناء.', feedback_negative_ar: 'لماذا، مع من، الضحك، التحرك، التعلم، الابتكار...', options: { bank: [
    { text_fr: 'sens', text_ar: 'المعنى' }, { text_fr: 'relations', text_ar: 'العلاقات' }, { text_fr: 'humour', text_ar: 'الفكاهة' }, { text_fr: 'corps', text_ar: 'الجسم' },
    { text_fr: 'apprentissage', text_ar: 'التعلم' }, { text_fr: 'créativité', text_ar: 'الإبداع' }, { text_fr: 'espoir', text_ar: 'الأمل' }, { text_fr: 'spiritualité', text_ar: 'الروحانية' }
  ]}},
  { id: 'e1d09da1-3771-4c7c-b120-5ac95a1b7f77', question_ar: 'حدد 6 أخطاء في خطة الطوارئ لسلمى.', hint_ar: 'ابحث عن الإنكار والعمل المفرط وغياب الاستراتيجية.', explanation_ar: 'رصد الأخطاء الكلاسيكية في خطة طوارئ المنظمات. إشارة: الكذب، 16 ساعة/يوم، تخفيض الرواتب 50% بشكل أحادي، التوسل، التوظيف بعقد دائم أثناء الأزمة، التضحية بالصحة.', feedback_positive_ar: 'تشخيص مثالي! هذه أخطاء كلاسيكية في إدارة الأزمات.', feedback_negative_ar: 'ابحث عن الإنكار والعمل المفرط وغياب الاستراتيجية.', options: [
    { id: '1', label: 'الكذب على الموظفين' }, { id: '2', label: 'العمل 16 ساعة/يوم' }, { id: '3', label: 'تخفيض الرواتب 50% بدون نقاش' },
    { id: '4', label: 'التوسل للممول' }, { id: '5', label: 'التوظيف بعقد دائم أثناء الأزمة' }, { id: '6', label: 'التضحية بصحتها الشخصية' }
  ]},
  { id: '1b155607-e4dc-41b1-86ae-60c01886cbaf', question_ar: 'إعادة التأطير المعرفي لسلمى.', hint_ar: 'المرونة تبدأ بتغيير النظرة للوقائع.', explanation_ar: 'إعادة تأطير الأفكار السلبية (بيك) لاستعادة الثقة. إشارة: «فشلت» ← «تعلمتِ»؛ «أنا فاشلة» ← فصل الشخص عن الفعل؛ «دمرت 10 حياة» ← التذكير بالجوانب الإيجابية والعوامل الخارجية.', feedback_positive_ar: 'إعادة تأطير ممتازة! فصل الكينونة عن الفعل وتحويل الخطأ لدرس.', feedback_negative_ar: 'المرونة تبدأ بتغيير النظرة للوقائع.', options: { steps: [
    { question_fr: "Salma dit : « J'ai échoué ». Comment recadrer ?", question_ar: "سلمى تقول: «فشلت». كيف تعيد التأطير؟", correct: 'B', responses: [{ id: 'A', text_fr: "« C'est vrai »", text_ar: '«هذا صحيح»' }, { id: 'B', text_fr: "« Un événement n'est pas un échec si tu apprends. »", text_ar: '«الحدث ليس فشلًا إذا تعلمتِ منه.»' }] },
    { question_fr: "Elle dit : « Je suis nulle ». Recadrage ?", question_ar: "تقول: «أنا فاشلة». إعادة التأطير؟", correct: 'B', responses: [{ id: 'A', text_fr: "« Non t'es forte »", text_ar: '«لا، أنتِ قوية»' }, { id: 'B', text_fr: "« Tu as fait des erreurs mais tu n'es pas TA performance. »", text_ar: '«ارتكبتِ أخطاء لكنكِ لستِ أداءَكِ.»' }] },
    { question_fr: "« J'ai ruiné la vie de 10 personnes. » Recadrage ?", question_ar: "«دمرت حياة 10 أشخاص.» إعادة التأطير؟", correct: 'A', responses: [{ id: 'A', text_fr: "« Tu leur as offert des années de travail. L'économie est difficile. »", text_ar: '«منحتِهم سنوات من العمل. الاقتصاد صعب.»' }, { id: 'B', text_fr: "« C'est ta faute »", text_ar: '«إنه خطؤكِ»' }] }
  ]}},
  { id: 'fdafd8e1-9424-4b88-8468-1b507539fd85', question_ar: 'الميزانية خُفضت بنسبة 60%. ما استراتيجية البقاء؟', hint_ar: 'الرهان على حل واحد (مثل التمويل الجماعي) محفوف بالمخاطر.', explanation_ar: 'إجراء تحول استراتيجي ذكي في فترة الأزمة. إشارة: قلّصوا الفريق إلى 5 موظفين، ركّزوا على مشروعين قويين، نوّعوا مصادر التمويل.', feedback_positive_ar: 'استراتيجية رابحة! الواقعية والتركيز والتحول ينقذون المنظمات.', feedback_negative_ar: 'الرهان على حل واحد (مثل التمويل الجماعي) محفوف بالمخاطر.', options: [{ id: 'A', label: 'الإغلاق فورًا' }, { id: 'C', label: 'تحول استراتيجي: تقليص الفريق والتركيز على مشروعين قويين.' }] },
  { id: '24165562-52b4-4f0e-af17-e03fcc744e68', question_ar: 'اكتب رسالة إعادة الهيكلة (شفافية، تعاطف، رؤية).', hint_ar: 'لا تنسَ تضمين التعاطف ورؤية واضحة للمستقبل.', explanation_ar: 'التواصل حول إعادة الهيكلة بتعاطف وشفافية ورؤية. إشارة: يجب أن تتضمن الرسالة: شفافية، تعاطف، خيارات، رؤية، التزام شخصي.', feedback_positive_ar: 'رسالة مثالية! قيادة في أوقات الأزمات.', feedback_negative_ar: 'لا تنسَ تضمين التعاطف ورؤية واضحة للمستقبل.', options: [] },
  { id: '074eb261-75d7-4c39-af92-957f301945f2', question_ar: '«أنا أقوى عندما تكسرني وتعيد بنائي... من أنا؟»', hint_ar: 'دليل: تعلّم النهوض من جديد.', explanation_ar: 'تحديد المرونة. إشارة: «أنا أقوى عندما تكسرني وتعيد بنائي. الأطفال يملكونها بالفطرة، والكبار يجب أن يتعلموها من جديد.»', feedback_positive_ar: 'رائع! المرونة تولد من الشدائد.', feedback_negative_ar: 'دليل: تعلّم النهوض من جديد.', options: [{ id: 'A', label: 'الإيمان' }, { id: 'B', label: 'المرونة' }, { id: 'C', label: 'الصبر' }] }
];

async function run() {
  console.log('=== Mission 4: ONG (10 exercises) ===');
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
  console.log('🎉 Mission 4 done!');
}
run().catch(console.error);
