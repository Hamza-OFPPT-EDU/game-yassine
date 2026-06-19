import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import GameButton from './GameButton';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'ar';
}

export default function TermsModal({ isOpen, onClose, language }: TermsModalProps) {
  const isAr = language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-[#FFF8F0] border-2 border-[#E5D5B8]/50 w-full max-w-lg rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[85vh] z-10 text-[#1A1A2E]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E5D5B8]/30 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-voyage-primary/10 flex items-center justify-center text-voyage-primary">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${isAr ? 'arabic-font' : ''}`}>
                    {isAr ? "شروط الاستخدام وحماية البيانات" : "Conditions d'Utilisation & Données"}
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#7B3F1A]/60">
                    {isAr ? "مطابق لمتطلبات CNDP المغرب" : "Conforme CNDP Maroc - Loi 09-08"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-red-50 border border-[#E5D5B8]/40 text-[#7B3F1A] hover:text-red-600 transition-colors shadow-sm"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-[#1A1A2E]/80">
              {isAr ? (
                // Arabic Content
                <div className="space-y-4 arabic-font text-right">
                  <div className="p-4 bg-voyage-primary/5 rounded-2xl border border-voyage-primary/15 text-xs text-voyage-primary font-bold">
                    حماية معطياتكم ذات الطابع الشخصي هي أولويتنا. يلتزم هذا التطبيق التزاماً تاماً بمقتضيات القانون رقم 09-08 بالمغرب.
                  </div>

                  <section className="space-y-2">
                    <span className="block text-sm font-black text-voyage-primary-dark">1. إطار قانوني (قانون 09-08)</span>
                    <p className="text-[13px] leading-relaxed">
                      طبقاً للظهير الشريف رقم 1-09-15 الصادر في 22 من صفر 1430 (18 فبراير 2009) بتنفيذ القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، فإن هذا التطبيق يضمن معالجة معطياتكم بكل شفافية وأمان.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <span className="block text-sm font-black text-voyage-primary-dark">2. الغرض من جمع البيانات</span>
                    <p className="text-[13px] leading-relaxed">
                      يتم جمع المعطيات التي تدخلوها (الاسم، النسب، تاريخ الميلاد، التخصص الدراسي) حصرياً من أجل:
                    </p>
                    <ul className="list-disc list-inside text-[13px] space-y-1 pr-2">
                      <li>إنشاء وإدارة حسابكم الشخصي كمسافر.</li>
                      <li>تتبع وحفظ تقدمكم التعليمي ونقاط الخبرة (XP) والشارات المحصل عليها.</li>
                      <li>إدراجكم في لوائح المتصدرين (الرتب والتحديات الجماعية).</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <span className="block text-sm font-black text-voyage-primary-dark">3. مدة الحفظ والأمان</span>
                    <p className="text-[13px] leading-relaxed">
                      يتم حفظ معطياتكم طيلة فترة نشاط حسابكم. ونحن نتخذ كافة التدابير التقنية والتنظيمية اللازمة لضمان أمان معطياتكم وحمايتها من أي ولوج غير مرخص به أو إتلاف.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <span className="block text-sm font-black text-voyage-primary-dark">4. حقوقكم (الولوج، التصحيح والتعرض)</span>
                    <p className="text-[13px] leading-relaxed">
                      بموجب القانون رقم 09-08، لديكم كامل الحق في:
                    </p>
                    <ul className="list-disc list-inside text-[13px] space-y-1 pr-2">
                      <li><strong>حق الولوج:</strong> الاطلاع على كافة المعطيات الخاصة بكم.</li>
                      <li><strong>حق التصحيح:</strong> تعديل أو تصحيح أي معلومات غير دقيقة من خلال صفحة الملف الشخصي.</li>
                      <li><strong>حق التعرض:</strong> الاعتراض على معالجة معطياتكم أو طلب حذف حسابكم نهائياً.</li>
                    </ul>
                    <p className="text-[13px] mt-2">
                      لممارسة هذه الحقوق، يمكنكم التواصل معنا عبر البريد الإلكتروني: <span className="font-bold underline text-voyage-primary">privacy@voyage.ma</span>
                    </p>
                  </section>

                  <section className="space-y-2 border-t border-[#E5D5B8]/30 pt-4">
                    <span className="block text-sm font-black text-voyage-primary-dark">5. ترخيص CNDP</span>
                    <p className="text-[13px] leading-relaxed text-[#7B3F1A]/70 italic">
                      إن معالجة المعطيات المنجزة بواسطة هذا التطبيق تم التصريح بها / إخطارها لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) تحت رقم الملف الجاري إعداده.
                    </p>
                  </section>
                </div>
              ) : (
                // French Content
                <div className="space-y-4">
                  <div className="p-4 bg-voyage-primary/5 rounded-2xl border border-voyage-primary/15 text-xs text-voyage-primary font-bold">
                    La protection de vos données personnelles est notre priorité absolue. Ce site s'engage à respecter scrupuleusement la réglementation de la CNDP au Maroc.
                  </div>

                  <section className="space-y-1">
                    <h4 className="text-sm font-black text-voyage-primary-dark">1. Cadre Légal (Loi 09-08)</h4>
                    <p className="text-[13px] leading-relaxed">
                      Conformément au Dahir n° 1-09-15 du 18 février 2009 portant promulgation de la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, le traitement de vos données est effectué de manière transparente et sécurisée.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h4 className="text-sm font-black text-voyage-primary-dark">2. Finalités du traitement</h4>
                    <p className="text-[13px] leading-relaxed">
                      Les données collectées (nom, prénom, date de naissance, spécialité scolaire) sont strictement réservées aux finalités suivantes :
                    </p>
                    <ul className="list-disc list-inside text-[13px] space-y-1 pl-2">
                      <li>Création et gestion de votre compte voyageur.</li>
                      <li>Suivi et sauvegarde de votre progression pédagogique (XP, badges).</li>
                      <li>Calcul des classements au sein des ligues compétitives.</li>
                    </ul>
                  </section>

                  <section className="space-y-1">
                    <h4 className="text-sm font-black text-voyage-primary-dark">3. Durée de conservation & Sécurité</h4>
                    <p className="text-[13px] leading-relaxed">
                      Vos données sont conservées tant que votre compte est actif. Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé ou altération.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h4 className="text-sm font-black text-voyage-primary-dark">4. Vos Droits (Accès, Rectification & Opposition)</h4>
                    <p className="text-[13px] leading-relaxed">
                      En vertu de la loi 09-08, vous disposez d'un droit d'accès aux données vous concernant, d'un droit de rectification pour les mettre à jour via votre espace profil, et d'un droit d'opposition à leur traitement.
                    </p>
                    <p className="text-[13px] mt-2">
                      Pour exercer ces droits, vous pouvez nous écrire à l'adresse : <span className="font-bold underline text-voyage-primary">privacy@voyage.ma</span>
                    </p>
                  </section>

                  <section className="space-y-1 border-t border-[#E5D5B8]/30 pt-4">
                    <h4 className="text-sm font-black text-voyage-primary-dark">5. Notification CNDP</h4>
                    <p className="text-[13px] leading-relaxed text-[#7B3F1A]/70 italic">
                      Ce traitement de données a fait l'objet d'une notification ou déclaration en cours auprès de la CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel).
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#E5D5B8]/30 flex justify-end bg-white/50">
              <GameButton
                variant="primary"
                size="md"
                onClick={onClose}
                className="px-8 shadow-md"
              >
                <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse arabic-font' : ''}`}>
                  <span>{isAr ? "فهمت" : "J'ai compris"}</span>
                  <ArrowRight className={isAr ? "rotate-180" : ""} size={16} strokeWidth={2.5} />
                </div>
              </GameButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
