
import { SwitchStatus, FacilityStatus } from './types';

export const SWITCH_OPTIONS: SwitchStatus[] = ['ON', 'OFF'];
export const STATUS_OPTIONS: FacilityStatus[] = ['良', '不可'];

const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycbzX9CPXHW93X4oKwVqZRwPjQEFeCFsaeDMH0B-KektszU_JL0w2eawZf3ZIx_W5bWzN/exec';

const getApiUrl = (): string => {
  try {
    // 実行環境（ブラウザ/ビルド時）の両方でエラーが出ないよう window や global を経由してアクセスを試みる
    const env = (window as any).process?.env?.GOOGLE_SCRIPT_URL || (globalThis as any).process?.env?.GOOGLE_SCRIPT_URL;
    if (env && env !== "undefined" && env.startsWith('http')) {
      return env;
    }
  } catch (e) {
    // エラー時はデフォルトを使用
  }
  return DEFAULT_URL;
};

export const SHEETS_API_URL = getApiUrl();

export const FIELD_LABELS = {
  inspectionDate: '巡回日',
  powerMeter100V: '100V電力計',
  pressureMPa: '圧力MPa',
  waterTempC: '水温℃',
  ventilationFan: '換気扇',
  tapeHeater: 'テープヒータ',
  panelHeater: 'パネルヒータ',
  roadHeater: 'ロードヒータ',
  residualChlorineBefore: '計器残塩(校正前)mlg',
  residualChlorineAfter: '計器残塩(校正後)mlg',
  measuredResidualChlorine: '実測残塩mlg',
  facilityStatus: '施設状況',
  remarks: '備考'
};
