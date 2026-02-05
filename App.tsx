
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { InspectionRecord, AppState } from './types';
import { storageService } from './services/storageService';
import { SWITCH_OPTIONS, STATUS_OPTIONS, FIELD_LABELS } from './constants';
import FormGroup from './components/FormGroup';
import PhotoUpload from './components/PhotoUpload';

const App: React.FC = () => {
  const [history, setHistory] = useState<InspectionRecord[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [appState, setAppState] = useState<AppState>('form');
  const [validationError, setValidationError] = useState(false);
  
  const getInitialForm = (lastRecord?: InspectionRecord): InspectionRecord => ({
    timestamp: new Date().toISOString(),
    inspectionDate: new Date().toISOString().split('T')[0],
    powerMeter100V: '',
    pressureMPa: '',
    waterTempC: '',
    ventilationFan: lastRecord?.ventilationFan || 'OFF',
    tapeHeater: lastRecord?.tapeHeater || 'OFF',
    panelHeater: lastRecord?.panelHeater || 'OFF',
    roadHeater: lastRecord?.roadHeater || 'OFF',
    residualChlorineBefore: '',
    residualChlorineAfter: '',
    measuredResidualChlorine: '',
    facilityStatus: '',
    remarks: '',
    photo1: undefined,
    photo2: undefined,
    photo3: undefined,
  });

  const [formData, setFormData] = useState<InspectionRecord>(getInitialForm());
  const [baseFormData, setBaseFormData] = useState<InspectionRecord>(getInitialForm());

  useEffect(() => {
    // 1. ローカルから即座に表示
    const localData = storageService.getRecords();
    setHistory(localData);
    if (localData.length > 0) {
      const initial = getInitialForm(localData[0]);
      setFormData(initial);
      setBaseFormData(initial);
    }

    // 2. スプレッドシートから最新を取得
    storageService.syncFromSheet().then(remoteData => {
      setHistory(remoteData);
      if (remoteData.length > 0) {
        const initial = getInitialForm(remoteData[0]);
        setFormData(initial);
        setBaseFormData(initial);
      }
    });
  }, []);

  const getBgClass = (field: keyof InspectionRecord) => {
    const isModified = formData[field] !== baseFormData[field];
    return isModified ? "bg-[#e1f5fe]" : "bg-[#fffde7]";
  };

  const getStatusBgClass = () => {
    if (validationError && !formData.facilityStatus) {
      return "bg-[#fff1f3] border-red-300";
    }
    return getBgClass('facilityStatus');
  };

  const inputBaseClass = "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg transition-colors duration-200";
  const selectBaseClass = "w-full px-4 py-3 rounded-lg border border-slate-300 outline-none text-lg font-bold transition-colors duration-200";
  const switchSelectClass = "w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-base transition-colors duration-200";

  const handlePrevHistory = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(prev => prev + 1);
  };

  const handleNextHistory = () => {
    if (historyIndex > 0) setHistoryIndex(prev => prev - 1);
  };

  const updateField = (field: keyof InspectionRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFiscalYearStart = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const fiscalYear = month >= 4 ? year : year - 1;
    return new Date(`${fiscalYear}-04-01`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.facilityStatus) {
      setValidationError(true);
      const el = document.getElementById('facility-status-field');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setAppState('loading');
    
    const latestRecord = history[0];
    let calculatedData = { ...formData };
    
    if (latestRecord && formData.powerMeter100V) {
      const currentReading = parseFloat(formData.powerMeter100V);
      const prevReading = parseFloat(latestRecord.powerMeter100V);
      
      if (!isNaN(currentReading) && !isNaN(prevReading)) {
        const usage = currentReading - prevReading;
        calculatedData.powerUsage = usage.toFixed(2);

        const currDate = new Date(formData.inspectionDate);
        const prevDate = new Date(latestRecord.inspectionDate);
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        calculatedData.dailyPowerUsage = (usage / diffDays).toFixed(2);

        const fiscalStart = getFiscalYearStart(formData.inspectionDate);
        const prevFiscalStart = getFiscalYearStart(latestRecord.inspectionDate);
        
        if (fiscalStart.getTime() !== prevFiscalStart.getTime()) {
          calculatedData.cumulativePower = usage.toFixed(2);
        } else {
          const prevCumulative = parseFloat(latestRecord.cumulativePower || '0') || 0;
          calculatedData.cumulativePower = (prevCumulative + usage).toFixed(2);
        }
      }
    }

    try {
      await storageService.saveRecord(calculatedData);
      const updatedHistory = storageService.getRecords();
      setHistory(updatedHistory);
      setAppState('success');
      setTimeout(() => {
        const nextInitial = getInitialForm(updatedHistory[0]);
        setFormData(nextInitial);
        setBaseFormData(nextInitial);
        setValidationError(false);
        setAppState('form');
        setHistoryIndex(0);
      }, 2000);
    } catch (err) {
      setAppState('error');
    }
  };

  const prevRecord = history[historyIndex];

  return (
    <div className="min-h-screen pb-32 safe-pb flex flex-col">
      <header className="sticky top-0 z-50 bg-blue-700 text-white shadow-lg safe-pt">
        <div className="px-4 py-4 flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-tight mb-2">浅虫ＴＭ巡回</h1>
          <div className="flex items-center justify-between w-full max-sm bg-blue-800/50 rounded-lg p-1">
            <button type="button" onClick={handlePrevHistory} disabled={historyIndex >= history.length - 1} className="p-2 disabled:opacity-30 active:scale-95 transition-transform"><ChevronLeft size={24} /></button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] opacity-70">比較履歴データ</span>
              <span className="text-sm font-semibold">{prevRecord ? prevRecord.inspectionDate : '履歴なし'}</span>
            </div>
            <button type="button" onClick={handleNextHistory} disabled={historyIndex <= 0} className="p-2 disabled:opacity-30 active:scale-95 transition-transform"><ChevronRight size={24} /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {appState === 'loading' && (
          <div className="fixed inset-0 bg-white/80 z-[60] flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-medium text-slate-600">保存中...</p>
            </div>
          </div>
        )}

        {appState === 'success' && (
          <div className="fixed inset-0 bg-white z-[60] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-bounce"><CheckCircle2 size={64} className="text-green-500" /><p className="text-xl font-bold text-slate-800">記録しました</p></div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup label={FIELD_LABELS.inspectionDate} prevValue={prevRecord?.inspectionDate} prevDate={prevRecord?.inspectionDate}>
            <input type="date" value={formData.inspectionDate} onChange={(e) => updateField('inspectionDate', e.target.value)} className={`${inputBaseClass} ${getBgClass('inspectionDate')}`} required />
          </FormGroup>

          <FormGroup 
            label={FIELD_LABELS.powerMeter100V} 
            prevValue={prevRecord ? `${prevRecord.powerMeter100V}` : undefined}
            prevDate={prevRecord?.inspectionDate}
          >
            <input type="text" inputMode="decimal" value={formData.powerMeter100V} onChange={(e) => updateField('powerMeter100V', e.target.value)} placeholder="現在の指針値を入力" className={`${inputBaseClass} ${getBgClass('powerMeter100V')} mb-2`} />
            {prevRecord && (
              <div className="grid grid-cols-1 gap-1 text-[11px] bg-white/60 p-2 rounded border border-blue-100 mt-2">
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-slate-500">前回使用量:</span>
                  <span className="font-bold text-blue-700">{prevRecord.powerUsage || '0.00'} kWh</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 py-1">
                  <span className="text-slate-500">一日平均:</span>
                  <span className="font-bold text-blue-700">{prevRecord.dailyPowerUsage || '0.00'} kWh/日</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">年度累計 (4/1-):</span>
                  <span className="font-bold text-blue-800">{prevRecord.cumulativePower || '0.00'} kWh</span>
                </div>
              </div>
            )}
          </FormGroup>

          <div className="space-y-1">
            <FormGroup label={FIELD_LABELS.pressureMPa} prevValue={prevRecord?.pressureMPa} prevDate={prevRecord?.inspectionDate}>
              <input type="text" inputMode="decimal" value={formData.pressureMPa} onChange={(e) => updateField('pressureMPa', e.target.value)} placeholder="数値を入力" className={`${inputBaseClass} ${getBgClass('pressureMPa')}`} />
            </FormGroup>
            <FormGroup label={FIELD_LABELS.waterTempC} prevValue={prevRecord?.waterTempC} prevDate={prevRecord?.inspectionDate}>
              <input type="text" inputMode="decimal" value={formData.waterTempC} onChange={(e) => updateField('waterTempC', e.target.value)} placeholder="数値を入力" className={`${inputBaseClass} ${getBgClass('waterTempC')}`} />
            </FormGroup>
          </div>

          <div className="mb-6 bg-slate-100 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1 flex justify-between"><span>機器・ヒーター設定</span><span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">前回値を維持</span></h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormGroup label={FIELD_LABELS.ventilationFan} prevValue={prevRecord?.ventilationFan} prevDate={prevRecord?.inspectionDate}>
                <select value={formData.ventilationFan} onChange={(e) => updateField('ventilationFan', e.target.value as any)} className={`${switchSelectClass} ${getBgClass('ventilationFan')}`}>
                  {SWITCH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormGroup>
              <FormGroup label={FIELD_LABELS.tapeHeater} prevValue={prevRecord?.tapeHeater} prevDate={prevRecord?.inspectionDate}>
                <select value={formData.tapeHeater} onChange={(e) => updateField('tapeHeater', e.target.value as any)} className={`${switchSelectClass} ${getBgClass('tapeHeater')}`}>
                  {SWITCH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormGroup>
              <FormGroup label={FIELD_LABELS.panelHeater} prevValue={prevRecord?.panelHeater} prevDate={prevRecord?.inspectionDate}>
                <select value={formData.panelHeater} onChange={(e) => updateField('panelHeater', e.target.value as any)} className={`${switchSelectClass} ${getBgClass('panelHeater')}`}>
                  {SWITCH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormGroup>
              <FormGroup label={FIELD_LABELS.roadHeater} prevValue={prevRecord?.roadHeater} prevDate={prevRecord?.inspectionDate}>
                <select value={formData.roadHeater} onChange={(e) => updateField('roadHeater', e.target.value as any)} className={`${switchSelectClass} ${getBgClass('roadHeater')}`}>
                  {SWITCH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </FormGroup>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-4">
            <div className="flex-1">
              <FormGroup label={FIELD_LABELS.residualChlorineBefore} prevValue={prevRecord?.residualChlorineBefore} prevDate={prevRecord?.inspectionDate}>
                <input type="text" inputMode="decimal" value={formData.residualChlorineBefore} onChange={(e) => updateField('residualChlorineBefore', e.target.value)} className={`${inputBaseClass} ${getBgClass('residualChlorineBefore')}`} />
              </FormGroup>
            </div>
            <div className="pt-14 flex items-center justify-center text-slate-400">
              <ArrowRight size={24} />
            </div>
            <div className="flex-1">
              <FormGroup label={FIELD_LABELS.residualChlorineAfter} prevValue={prevRecord?.residualChlorineAfter} prevDate={prevRecord?.inspectionDate}>
                <input type="text" inputMode="decimal" value={formData.residualChlorineAfter} onChange={(e) => updateField('residualChlorineAfter', e.target.value)} className={`${inputBaseClass} ${getBgClass('residualChlorineAfter')}`} />
              </FormGroup>
            </div>
          </div>

          <FormGroup label={FIELD_LABELS.measuredResidualChlorine} prevValue={prevRecord?.measuredResidualChlorine} prevDate={prevRecord?.inspectionDate}>
            <input type="text" inputMode="decimal" value={formData.measuredResidualChlorine} onChange={(e) => updateField('measuredResidualChlorine', e.target.value)} className={`${inputBaseClass} ${getBgClass('measuredResidualChlorine')}`} />
          </FormGroup>

          <div id="facility-status-field">
            <FormGroup label={FIELD_LABELS.facilityStatus} prevValue={prevRecord?.facilityStatus} prevDate={prevRecord?.inspectionDate}>
              <select 
                value={formData.facilityStatus} 
                onChange={(e) => {
                  updateField('facilityStatus', e.target.value as any);
                  if (e.target.value) setValidationError(false);
                }} 
                className={`${selectBaseClass} ${getStatusBgClass()} ${!formData.facilityStatus ? 'text-slate-400' : ''}`} 
                required
              >
                <option value="" disabled>選択してください</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className={opt === '良' ? 'text-green-600' : 'text-red-600'}>{opt}</option>
                ))}
              </select>
              {validationError && !formData.facilityStatus && (
                <p className="mt-2 text-xs font-bold text-red-500 animate-pulse">※ 施設状況は必須項目です</p>
              )}
            </FormGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <PhotoUpload label="写真１" value={formData.photo1} onChange={(val) => updateField('photo1', val)} modified={formData.photo1 !== baseFormData.photo1} />
            <PhotoUpload label="写真２" value={formData.photo2} onChange={(val) => updateField('photo2', val)} modified={formData.photo2 !== baseFormData.photo2} />
            <PhotoUpload label="写真３" value={formData.photo3} onChange={(val) => updateField('photo3', val)} modified={formData.photo3 !== baseFormData.photo3} />
          </div>

          <FormGroup label={FIELD_LABELS.remarks} prevValue={prevRecord?.remarks} prevDate={prevRecord?.inspectionDate}>
            <textarea value={formData.remarks} onChange={(e) => updateField('remarks', e.target.value)} rows={3} className={`${inputBaseClass} ${getBgClass('remarks')} text-base`} placeholder="特記事項があれば入力" />
          </FormGroup>
        </form>
      </main>

      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.1)] safe-pb z-40">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={handleSubmit} 
            disabled={appState === 'loading'} 
            className="w-full flex items-center justify-center gap-2 py-5 px-6 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save size={24} />
            <span>巡回記録を保存</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
