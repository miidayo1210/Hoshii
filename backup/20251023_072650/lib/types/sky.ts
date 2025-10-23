/** ===== 固定の型（アプリ全体で共有） ===== */
export type SkyId = string;   // 例: "LEAPDAY2025" / "member:rin"
export type ISODate = string;

export type ActionKind = "in_person" | "online";
export interface ActionDef {
  key: string;             // 例: "support_message"
  label: string;           // 表示名
  kind?: ActionKind;       // 既定: "in_person"
  weight?: number;         // 既定: 1
  phase?: "before" | "day";
}

export interface Participation {
  id: string;
  skyId: SkyId;
  actionKey: string;
  name?: string | null;
  email?: string | null;
  comment?: string | null;
  createdAt: ISODate;
}

export interface SkyMeta {
  id: SkyId;
  title: string;
  // 必要ならメンバー/コミュニティ情報を付与
}

export interface SkyStats {
  skyId: SkyId;
  totalStars: number;       // 重み付け反映後
  totalActions: number;     // 純件数
  updatedAt: ISODate;
}

/** ===== 表示用：密度関数・しきい値 ===== */
export interface DensityConfig {
  base: number;  // 例: 50
  gain: number;  // 例: 0.6
  min: number;   // 例: 40
  max: number;   // 例: 500
}

export const DEFAULT_DENSITY: DensityConfig = {
  base: 50,
  gain: 0.6,
  min: 40,
  max: 500,
};

export function toDensity(totalStars: number, c: DensityConfig = DEFAULT_DENSITY) {
  const v = Math.floor(c.base + c.gain * totalStars);
  return Math.max(c.min, Math.min(c.max, v));
}

/** ===== コメント表示ポリシー（定数） ===== */
export const COMMENT = {
  maxLen: 300,
  fetchLimit: 40,
} as const;





