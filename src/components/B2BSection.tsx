import React from 'react';
import {
  Building2,
  FileCheck,
  Percent,
  Truck,
  Database,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

interface B2BSectionProps {
  onOpenRFQ: () => void;
  onOpenOdooModal: () => void;
}

export const B2BSection: React.FC<B2BSectionProps> = ({
  onOpenRFQ,
  onOpenOdooModal,
}) => {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 via-white to-slate-100/50 text-slate-900 border-y border-slate-200 relative overflow-hidden">
      {/* Background architectural pattern */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Байгууллагын B2B Хамтын ажиллагаа</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight font-display">
              Барилгын компани, гүйцэтгэгчдэд зориулсан <br className="hidden sm:inline" />
              <span className="text-amber-600">Бөөний гэрээт хамтын ажиллагаа</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Барилгын томоохон төсөл, гүйцэтгэгч байгууллагуудад зориулсан татан авалтын үнийн санал, нэхэмжлэх, гэрээт төлбөрийн нөхцөл болон талбай дээрх крантай шуурхай нийлүүлэлт.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-100">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">5-18% Бөөний тусгай үнэ</div>
                  <div className="text-[11px] text-slate-500">Төслийн хэмжээнээс хамаарсан шатлалт хөнгөлөлт</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">НӨАТ & E-barimt 100%</div>
                  <div className="text-[11px] text-slate-500">Байгууллагын зардлын баримт шууд олгогдоно</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Крантай тусгай логистик</div>
                  <div className="text-[11px] text-slate-500">Талбай дээр өргөж буулгах 18 тэрэгний парк</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">MNS Лабораторийн сорилт</div>
                  <div className="text-[11px] text-slate-500">Бүх бүтээгдэхүүний сорилтын гэрчилгээтэй</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenRFQ}
                className="px-6 py-3.5 rounded-xl btn-liquid-dark font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <span className="text-white">B2B Төслийн үнийн санал илгээх</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Card / Contact Banner */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950 font-display">
                  Төслийн татан авалтын шууд шугам
                </h3>
                <span className="text-xs text-slate-500">Мэргэшсэн барилгын инженерийн зөвлөгөө</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Хэрэв танай төсөлд 100+ тонн цемент, 5,000+ ширхэг хийт блок, арматурын их хэмжээний татан авалт хийх шаардлагатай бол манай тусгай гэрээний менежертэй шууд холбогдоно уу.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">B2B Утас:</span>
                <a href="tel:77112244" className="font-bold text-amber-700 underline">
                  7711-2244, 9911-0022
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">И-мэйл:</span>
                <span className="font-mono font-semibold text-slate-800">b2b@barilgachin.mn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Хариу өгөх хугацаа:</span>
                <span className="font-bold text-emerald-700">15-30 минутад</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
