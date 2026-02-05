
export type SwitchStatus = 'ON' | 'OFF';
export type FacilityStatus = '良' | '不可' | '';

export interface InspectionRecord {
  id?: string;
  timestamp: string;
  inspectionDate: string;
  powerMeter100V: string;
  // 計算用フィールド
  powerUsage?: string;         // 今回の使用量
  dailyPowerUsage?: string;    // 一日あたりの使用量
  cumulativePower?: string;    // 年度累計
  
  pressureMPa: string;
  waterTempC: string;
  ventilationFan: SwitchStatus;
  tapeHeater: SwitchStatus;
  panelHeater: SwitchStatus;
  roadHeater: SwitchStatus;
  residualChlorineBefore: string;
  residualChlorineAfter: string;
  measuredResidualChlorine: string;
  facilityStatus: FacilityStatus;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  remarks: string;
}

export type AppState = 'loading' | 'form' | 'success' | 'error';
