export enum OnOffStatus {
  ON = 'ON',
  OFF = 'OFF'
}

export enum FacilityStatus {
  GOOD = '良',
  BAD = '不可'
}

export interface RecordData {
  id: string;
  // 基本情報
  inspectionDate: string; // 巡回日
  
  // 数値項目
  pressureMpa: string;    // 圧力MPa
  waterTemp: string;      // 水温℃
  
  // 設備状態 (ON/OFF)
  fanStatus: OnOffStatus;        // 換気扇
  tapeHeaterStatus: OnOffStatus; // テープヒータ
  panelHeaterStatus: OnOffStatus; // パネルヒータ
  roadHeaterStatus: OnOffStatus;  // ロードヒータ
  
  // 水質項目
  chlorineBefore: string; // 計器残塩(校正前)mlg
  chlorineAfter: string;  // 計器残塩(校正後)mlg
  chlorineMeasured: string; // 実測残塩mlg
  
  // 施設・電力
  facilityStatus: FacilityStatus; // 施設状況
  power100V: string;              // 100V電力
  
  // 共通
  photos: string[];
  remarks: string;
  createdAt: number;
}