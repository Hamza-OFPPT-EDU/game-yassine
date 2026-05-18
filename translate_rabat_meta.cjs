// translate_rabat_city_missions.cjs — Correct DB column mapping
const { createClient } = require('@supabase/supabase-js');
const url = 'https://rydmefudpczpxrresflx.supabase.co';
const key = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(url, key);

async function run() {
  console.log('=== Step 1: City metadata ===');
  const { error: e1 } = await supabase.from('challenges').update({
    city_name_ar: 'الرباط',
    headline_ar: 'إعادة التنظيم والإدارة',
    description_ar: 'يكتشف إسحاق المستشفى والوزارة والجامعة والمنظمة غير الحكومية والولاية. يتعلم إدارة الضغط واتخاذ القرارات وقيادة الفريق.'
  }).eq('id', '550e8400-e29b-41d4-a716-446655440001');
  console.log(e1 ? `❌ ${e1.message}` : '✅ City updated');

  console.log('\n=== Step 2: Missions ===');
  const missions = [
    { id: '550e8400-e29b-41d4-a716-446655441111', title_ar: 'حالات الطوارئ في مستشفى ابن سينا', description_ar: 'المرشدة: د. أمينة الفاسي. المهارة الناعمة: إدارة الضغط. تعلّم التعرف على أنواع الضغط والأعراض الجسدية وممارسة تقنية 4-7-8.' },
    { id: '550e8400-e29b-41d4-a716-446655442222', title_ar: 'الوزارة واتخاذ القرار', description_ar: 'المرشدة: فاطمة الزرهوني. المهارة الناعمة: اتخاذ القرار. إتقان عملية سيمون (6 خطوات) ومصفوفة أيزنهاور وتحديد التحيزات المعرفية.' },
    { id: '550e8400-e29b-41d4-a716-446655443333', title_ar: 'مشروع تعاوني في الجامعة', description_ar: 'المرشد: أ. يوسف بنجلون. المهارة الناعمة: العمل الجماعي. اكتشاف أدوار بلبين وممارسة التواصل اللاعنفي وفهم دورة حياة الفريق (تاكمان).' },
    { id: '550e8400-e29b-41d4-a716-446655444444', title_ar: 'منظمة أمل المغرب', description_ar: 'المرشدة: سلمى. المهارة الناعمة: المرونة. التعرف على الاحتراق الوظيفي وممارسة التكيف الإيجابي وإتقان ركائز المرونة (سيرولنيك).' },
    { id: '550e8400-e29b-41d4-a716-446655445555', title_ar: 'التحدي الأكبر الأخير – الولاية', description_ar: 'المرشد: الوالي. تجميع المهارات الثلاث (الضغط، القرار، الفريق). إدارة أزمة صحية كبرى والتحكيم في معضلات أخلاقية عالية المستوى.' }
  ];
  for (const m of missions) {
    const { error } = await supabase.from('missions').update({ title_ar: m.title_ar, description_ar: m.description_ar }).eq('id', m.id);
    console.log(error ? `❌ ${m.id}: ${error.message}` : `✅ ${m.title_ar}`);
  }
  console.log('\n🎉 Done!');
}
run().catch(console.error);
