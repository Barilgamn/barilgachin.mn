import React, { useState, useEffect } from 'react';
import { Database, Server, RefreshCw, CheckCircle2, Cpu, ShieldCheck, ArrowUpRight, Copy, Check } from 'lucide-react';
import { ODOO_CONFIG_INFO } from '../data/mockData';

interface OdooSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OdooSyncModal: React.FC<OdooSyncModalProps> = ({ isOpen, onClose }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'endpoints' | 'logs'>('status');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefreshSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">Odoo 18 ERP Интеграцийн төв</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Барааны үлдэгдэл, B2B үнийн санал, захиалга Odoo ERP системтэй бодит хугацаанд синхрончлогдож байна
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Синхрончлолын төлөв
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'endpoints'
                ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            API & Webhook холболтууд
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'logs'
                ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Бодит хугацааны бүртгэл (Logs)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {activeTab === 'status' && (
            <>
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">ERP Хувилбар</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">{ODOO_CONFIG_INFO.version}</div>
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Хувилбар нийцтэй
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">Сүлжээний хоцролт (Latency)</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">{ODOO_CONFIG_INFO.syncLatencyMs} ms</div>
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                    <Cpu className="w-3 h-3" /> Хэт хурдан холболт
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">Сүүлийн шалгалт</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">{ODOO_CONFIG_INFO.lastSyncTimestamp}</div>
                  <button
                    onClick={handleRefreshSync}
                    disabled={isRefreshing}
                    className="text-[11px] text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-1 font-medium cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Шалгаж байна...' : 'Одоо шалгах'}
                  </button>
                </div>
              </div>

              {/* Connected Odoo Models Table */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Холбогдсон Odoo Модулиуд & Моделууд</span>
                  <span className="text-xs font-normal text-slate-500">5 модуль идэвхтэй</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {ODOO_CONFIG_INFO.connectedModules.map((mod, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-mono text-xs font-bold">
                          {mod.name.substring(5, 7).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{mod.label}</div>
                          <div className="text-xs font-mono text-slate-500">{mod.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-emerald-600 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {mod.status}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{mod.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warehouse Stocks Live mapping */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-amber-900">Бөөний худалдан авалт & Төслийн үнийн санал</h5>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Барилгачин.мн сайтаас үүсгэсэн аливаа худалдан авалт, төслийн үнийн санал нь Odoo ERP-ийн <strong>sale.order</strong> болон <strong>crm.lead</strong> объектод автоматаар орж, борлуулалтын менежерийн самбарт бодит хугацаанд мэдэгдэнэ.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Barilgachin.mn цахим дэлгүүр нь Odoo 18 Enterprise XML-RPC болон REST Webhook API-аар дамжуулан 2 талын синхрончлол хийдэг:
              </p>

              {[
                {
                  id: 'stock_quant',
                  title: '1. Бодит үлдэгдэл татах (Stock Quant API)',
                  method: 'GET',
                  endpoint: `${ODOO_CONFIG_INFO.serverHost}/object/execute_kw/stock.quant/search_read`,
                  desc: '4 агуулахын бэлэн болон захиалгын үлдэгдлийг 30 секунд тутам автоматаар шинэчилнэ.',
                },
                {
                  id: 'sale_order',
                  title: '2. Цахим захиалга & Үнийн санал илгээх (Sale Order Push)',
                  method: 'POST',
                  endpoint: `${ODOO_CONFIG_INFO.serverHost}/object/execute_kw/sale.order/create`,
                  desc: 'Хэрэглэгчийн сагс болон B2B RFQ хүсэлтийг Odoo Sales модульд "Quotation" төлөвт үүсгэнэ.',
                },
                {
                  id: 'fleet_dispatch',
                  title: '3. Тээврийн логистик хуваарилалт (Fleet & Delivery)',
                  method: 'POST',
                  endpoint: `${ODOO_CONFIG_INFO.serverHost}/object/execute_kw/stock.picking/button_validate`,
                  desc: 'Ачааны даац, машины төрөл болон жолоочийн хуваарилалтыг Odoo Delivery Order-той холбоно.',
                },
              ].map((api) => (
                <div key={api.id} className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{api.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/30 text-purple-300 border border-purple-500/40">
                      {api.method}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                    <span className="flex-1 truncate">{api.endpoint}</span>
                    <button
                      onClick={() => copyToClipboard(api.endpoint, api.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedEndpoint === api.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">{api.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-slate-950 text-slate-300 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 max-h-72 overflow-y-auto">
              <div className="text-emerald-400">[2026-08-29 13:00:15] [INFO] Odoo 18 XML-RPC connection established successfully.</div>
              <div className="text-slate-400">[2026-08-29 13:00:15] [STOCK] Fetched 7,190 units for SKU: CEM-MAK-PC425 across 4 warehouses.</div>
              <div className="text-slate-400">[2026-08-29 13:00:16] [STOCK] Fetched 10,550 units for SKU: BLK-MAK-AAC600 (AAC D600).</div>
              <div className="text-purple-300">[2026-08-29 13:00:16] [PRICE] Synced Tiered B2B Pricelist rule: 40+ qty discount 3.8% applied.</div>
              <div className="text-slate-400">[2026-08-29 13:00:18] [FLEET] Connected 18 delivery vehicles in Odoo Fleet Management.</div>
              <div className="text-emerald-400">[2026-08-29 13:00:20] [SYNC] All product catalogues & inventories are 100% in sync.</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-purple-600" />
            <span>Сервер: <strong>erp.barilgachin.mn</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl btn-liquid-dark text-white text-xs font-semibold cursor-pointer"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};
