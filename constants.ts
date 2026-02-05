
import { SwitchStatus, FacilityStatus } from './types';

export const SWITCH_OPTIONS: SwitchStatus[] = ['ON', 'OFF'];
export const STATUS_OPTIONS: FacilityStatus[] = ['良', '不可'];

/**
 * 💡 ここに、手順2-6でコピーした「ウェブアプリURL」を貼り付けてください。
 */
export const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzX9CPXHW93X4oKwVqZRwPjQEFeCFsaeDMH0B-KektszU_JL0w2eawZf3ZIx_W5bWzN/exec';

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
