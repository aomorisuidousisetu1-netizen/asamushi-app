
import { SwitchStatus, FacilityStatus } from './types';

export const SWITCH_OPTIONS: SwitchStatus[] = ['ON', 'OFF'];
export const STATUS_OPTIONS: FacilityStatus[] = ['良', '不可'];

/**
 * GASのURL設定
 * Vercelの環境変数 GOOGLE_SCRIPT_URL から取得します。
 * 設定されていない場合はデフォルトのURLを使用します。
 */
const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycbzX9CPXHW93X4oKwVqZRwPjQEFeCFsaeDMH0B-KektszU_JL0w2eawZf3ZIx_W5bWzN/exec';

// Viteの define により、ビルド時に process.env.GOOGLE_SCRIPT_URL が文字列に置き換わります。
const getApiUrl = (): string => {
  try {
    // @ts-ignore: Vite will replace this during build
    const envUrl = process.env.GOOGLE_SCRIPT_URL;
    if (envUrl && envUrl !== "undefined" && envUrl.startsWith('http')) {
      return envUrl;
    }
  } catch (e) {
    // processが未定義の環境でもエラーにしない
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
