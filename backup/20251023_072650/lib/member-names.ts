// 11名のメンバー名リスト（あいうえお順）
export const memberNames = [
  "あおり",
  "あいる", 
  "いみい",
  "えこうせい",
  "おたけ",
  "かひめか",
  "きひより",
  "くみく",
  "けるか",
  "こふみか",
  "さりょう"
];

// URLエンコードされた名前のリスト
export const encodedMemberNames = memberNames.map(name => encodeURIComponent(name));

// 個人ページのURLを生成
export const memberUrls = memberNames.map(name => `/leapday/member/${encodeURIComponent(name)}`);

// メンバー名とURLのマッピング
export const memberMapping = memberNames.map((name, index) => ({
  name,
  encodedName: encodedMemberNames[index],
  url: memberUrls[index]
}));
