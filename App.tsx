
import React, { useState, useEffect } from 'react';
import { RecordData } from './types';
import EntryForm from './components/EntryForm';
import { sheetService } from './services/sheetService';
import { ChevronLeft, ChevronRight, History as HistoryIcon, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    const loadedRecords = sheetService.getRecords();
    setRecords(loadedRecords);
    if (loadedRecords.length > 0) {
      setViewIndex(loadedRecords.length - 1);
    }
  }, []);

  const handleSave = async (newRecord: RecordData) => {
    const success = await sheetService.saveRecord(newRecord);
    const updatedRecords = sheetService.getRecords();
    setRecords(updatedRecords);
    setViewIndex(updatedRecords.length - 1);
    
    if (success) {
      alert('保存完了しました。');
    } else {
      alert('ローカルに保存しました（後で自動送信されます）。');
    }
  };

  const nextRecord = () => { if (viewIndex < records.length - 1) setViewIndex(viewIndex + 1); };
  const prevRecord = () => { if (viewIndex > 0) setViewIndex(viewIndex - 1); };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-3xl mx-auto shadow-2xl relative font-sans">
      <header className="bg-blue-900 text-white p-5 shadow-lg sticky top-0 z-50 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-[0.1em]">浅虫テレメータ</h1>
        {!navigator.onLine && <WifiOff className="text-yellow-400" size={24} />}
      </header>

      <div className="bg-slate-50 border-b border-slate-200 p-4 sticky top-[68px] z-40 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={prevRecord} disabled={viewIndex <= 0} className="p-3 text-blue-600 disabled:text-slate-200 active:scale-75 transition-transform">
            <ChevronLeft size={48} strokeWidth={3} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <HistoryIcon size={18} className="text-blue-400" />
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-blue-900 tabular-nums">{records.length > 0 ? viewIndex + 1 : 0}</span>
                <span className="text-slate-400 text-lg font-bold">/ {records.length}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">過去ログ参照中</p>
          </div>

          <button onClick={nextRecord} disabled={viewIndex >= records.length - 1} className="p-3 text-blue-600 disabled:text-slate-200 active:scale-75 transition-transform">
            <ChevronRight size={48} strokeWidth={3} />
          </button>
        </div>
      </div>

      <main className="flex-1">
        <EntryForm 
          onSave={handleSave} 
          historicalRecord={records[viewIndex]} 
          allRecords={records}
        />
      </main>

      <div className="safe-area-bottom h-10"></div>
    </div>
  );
};

export default App;
