import { useState, useEffect, useRef, useReducer, createContext, useContext } from "react";

// ═══════════════════════════════════════
// i18n
// ═══════════════════════════════════════
const LangCtx = createContext("ja");
const useLang = () => useContext(LangCtx);
const fmt = (s, v) => { let r = s; for (const [k, val] of Object.entries(v || {})) r = r.replace(`{${k}}`, val); return r; };

const TX = {
  subtitle:       { ja:"破滅の棘 × 無限の剣製", kr:"파멸의 가시 × 무한의 검제" },
  tagline:        { ja:"聖杯の残骸 — 協力ローグライク", kr:"성배의 잔해 — 협동 로그라이크" },
  newGame:        { ja:"NEW GAME", kr:"NEW GAME" },
  cont:           { ja:"CONTINUE", kr:"CONTINUE" },
  disclaimer:     { ja:"※ファンゲームです。Fateシリーズの全権利はTYPE-MOONに帰属します。", kr:"※ 팬게임입니다. Fate 시리즈의 모든 권리는 TYPE-MOON에 귀속됩니다." },
  diffLabel:      { ja:"難易度選択", kr:"난이도 선택" },
  easy:           { ja:"EASY", kr:"EASY" },
  normal:         { ja:"NORMAL", kr:"NORMAL" },
  hard:           { ja:"HARD", kr:"HARD" },
  sys1:           { ja:"[システム] 聖杯戦争残余データに接続中…", kr:"[시스템] 성배전쟁 잔여 데이터 접속 중..." },
  sys2:           { ja:"[システム] サーヴァント反応2騎検知。Lancer × Archer。", kr:"[시스템] 서번트 반응 2기 감지. Lancer × Archer." },
  sys3:           { ja:"[システム] 汚染された地下空間を検知。10階下に汚染核。", kr:"[시스템] 오염된 지하 공간 탐지. 10층 아래에 오염핵 존재." },
  sys4:           { ja:"[システム] コマンドを入力してください。(trace on)", kr:"[시스템] 명령어를 입력하세요. (trace on)" },
  cuTrace:        { ja:"クー・フーリン：「よし、降りればいいんだろ？簡単だな！」", kr:"쿠 훌린: \"좋아, 내려가면 되는 거지? 간단하군!\"" },
  emTrace:        { ja:"エミヤ：「…無謀だが、行くしかない。」", kr:"에미야: \"...무모하지만, 가는 수밖에 없다.\"" },
  startExplore:   { ja:"⚔ 地下探索開始", kr:"⚔ 지하 탐색 개시" },
  exploring:      { ja:"探索中", kr:"탐색 중" },
  dirLabel:       { ja:"── 探索方向選択 ──", kr:"── 탐색 방향 선택 ──" },
  north:          { ja:"🚪 北の通路", kr:"🚪 북쪽 통로" },
  east:           { ja:"🚪 東の廊下", kr:"🚪 동쪽 복도" },
  west:           { ja:"🚪 西の部屋", kr:"🚪 서쪽 방" },
  south:          { ja:"🚪 南の階段", kr:"🚪 남쪽 계단" },
  descend:        { ja:"⬇ B{n}Fへ降下", kr:"⬇ B{n}F로 하강" },
  finalBoss:      { ja:"👹 最下層 — 汚染核へ", kr:"👹 최하층 — 오염핵으로" },
  save:           { ja:"💾 保存", kr:"💾 저장" },
  saving:         { ja:"保存中…", kr:"저장중..." },
  saveOk:         { ja:"💾 セーブ完了！", kr:"💾 저장 완료!" },
  saveFail:       { ja:"❌ セーブ失敗", kr:"❌ 저장 실패" },
  saveNoBattle:   { ja:"⚔ 戦闘中はセーブ不可", kr:"⚔ 전투 중 세이브 불가" },
  loadOk:         { ja:"💾 セーブデータをロードしました。", kr:"💾 세이브 데이터를 불러왔습니다." },
  reachedFloor:   { ja:"📍 B{n}Fに到達した。", kr:"📍 B{n}F에 도달했다." },
  floor10arrive:  { ja:"最深部に到達した。空気が変わる。汚染核の鼓動が聞こえる。", kr:"최심부에 도달했다. 공기가 변한다. 오염핵의 고동이 들린다." },
  rmTrap:         { ja:"⚠️ 罠！{who}に{d}ダメージ！", kr:"⚠️ 함정! {who}에게 {d} 데미지!" },
  rmRest:         { ja:"🏕️ 安全区域。HP/リソース回復！", kr:"🏕️ 안전 구역. HP/자원 회복!" },
  roomLabels:     { ja:["空の通路","敵遭遇！","補給品発見","罠！","イベント","安全区域"], kr:["텅 빈 복도","적 조우!","보급품 발견","함정!","이벤트","안전 구역"] },
  contBtn:        { ja:"続ける", kr:"계속" },
  contExplore:    { ja:"探索を続ける", kr:"계속 탐색" },
  lootFound:      { ja:"📦 補給品発見！", kr:"📦 보급품 발견!" },
  lancerTurn:     { ja:"🔱 クー・フーリンのターン", kr:"🔱 쿠 훌린의 턴" },
  archerTurn:     { ja:"🗡 エミヤのターン", kr:"🗡 에미야의 턴" },
  enemyTurn:      { ja:"💀 敵のターン", kr:"💀 적의 턴" },
  thrust:         { ja:"🔱 突き", kr:"🔱 찌르기" },
  rune:           { ja:"ᚱ ルーン(15)", kr:"ᚱ 룬(15)" },
  bolg:           { ja:"🔱 ボルク(35)", kr:"🔱 볼크(35)" },
  slash:          { ja:"⚔ 干将莫耶", kr:"⚔ 간장막야" },
  project:        { ja:"🗡 投影(15)", kr:"🗡 투영(15)" },
  ubw:            { ja:"🔥 UBW(30)", kr:"🔥 UBW(30)" },
  shield:         { ja:"🛡 アイアス", kr:"🛡 아이아스" },
  skip:           { ja:"▶ SKIP", kr:"▶ SKIP" },
  noRune:         { ja:"❌ ルーン不足", kr:"❌ 룬 부족" },
  noProj:         { ja:"❌ 投影力不足", kr:"❌ 투영력 부족" },
  cuThrust:       { ja:"🔱 クー・フーリン — 突き！ {d}dmg", kr:"🔱 쿠 훌린 — 창 찌르기! {d}dmg" },
  cuRune:         { ja:"ᚱ 炎のルーン！ {d}dmg", kr:"ᚱ 불의 룬! {d}dmg" },
  cuBolg:         { ja:"🔱 ゲイ・ボルク!! {d}dmg\n「その心臓、貰い受ける」", kr:"🔱 게이 볼크!! {d}dmg\n\"그 심장, 뚫린다!\"" },
  emSlash:        { ja:"⚔ 干将·莫耶！ {d}dmg", kr:"⚔ 간장·막야! {d}dmg" },
  emProj:         { ja:"🗡 カラドボルグII！ {d}dmg", kr:"🗡 칼라드볼그 II! {d}dmg" },
  emUbw:          { ja:"🔥 無限の剣製！ {d}dmg", kr:"🔥 무한의 검제! {d}dmg" },
  emShield:       { ja:"🛡 ロー・アイアス！", kr:"🛡 로 아이아스!" },
  combo:          { ja:"💥 合同攻撃！ {d}dmg！", kr:"💥 합동공격! {d}dmg!" },
  defeated:       { ja:"✨ {n} 撃破！", kr:"✨ {n} 격파!" },
  eDmgL:          { ja:"💀 {n}→クー・フーリン {d}dmg", kr:"💀 {n}→쿠 훌린 {d}dmg" },
  eDmgA:          { ja:"💀 {n}→エミヤ {d}dmg", kr:"💀 {n}→에미야 {d}dmg" },
  rescueL:        { ja:"🔴 エミヤ：「まだだ、猟犬。」HP 20 回復", kr:"🔴 에미야: \"아직이다, 수렵견.\" HP 20 회복" },
  rescueA:        { ja:"🔵 クー・フーリン：「死ぬのは許さん。」HP 20 回復", kr:"🔵 쿠 훌린: \"죽는 건 허락 안 한다.\" HP 20 회복" },
  cuName:         { ja:"🔱 クー・フーリン", kr:"🔱 쿠 훌린" },
  emName:         { ja:"🗡 エミヤ", kr:"🗡 에미야" },
  bond:           { ja:"絆", kr:"유대" },
  synergy:        { ja:"シナジー", kr:"시너지" },
  kills:          { ja:"撃破", kr:"처치" },
  explore_s:      { ja:"探索", kr:"탐색" },
  restart:        { ja:"最初からやり直す", kr:"처음부터 다시" },
  cuSay:          { ja:"クー・フーリン", kr:"쿠 훌린" },
  emSay:          { ja:"エミヤ", kr:"에미야" },
  cuRuneLow:      { ja:"「チッ…魔力切れかよ」", kr:"\"쳇...마력이 바닥이냐\"" },
  emProjLow:      { ja:"「…くっ、まだいける」", kr:"\"...큭, 아직 버틸 수 있다\"" },
  emProjCrit:     { ja:"「…体が、剣で出来ていることを思い出す」", kr:"\"...몸이, 검으로 이루어져 있음을 떠올린다\"" },
  preBoss1:       { ja:"空間が激しく震動する。汚染核が目前に迫る。", kr:"공간이 격렬하게 진동한다. 오염핵이 눈앞에 다가온다." },
  preBoss2:       { ja:"エミヤ：「──── I am the bone of my sword.」", kr:"에미야: \"──── I am the bone of my sword.\"" },
  preBoss3:       { ja:"クー・フーリン：「ハッ！最高の舞台じゃねぇか！」", kr:"쿠 훌린: \"하! 최고의 무대 아니냐!\"" },
  preBoss4:       { ja:"二人の英霊が、最後の戦いに向けて構える──", kr:"두 영령이, 마지막 전투를 향해 구성한다──" },
  preBossBtn:     { ja:"⚔ 最終決戦", kr:"⚔ 최종 결전" },
  cookEvt:        { ja:"エミヤが即席の竈で料理を始めた。\n「…腹が減っては戦はできまい。食え、ランサー。」\nクー・フーリン：「ハッ！お前の料理だけは認めてやるぜ。」", kr:"에미야가 즉석 화덕에서 요리를 시작했다.\n\"...배가 고파서야 싸울 수 없지. 먹어라, 랜서.\"\n쿠 훌린: \"하! 네놈 요리만큼은 인정한다.\"" },
  metaBonus:      { ja:"次回プレイへの遺産", kr:"다음 회차 유산" },
  metaNone:       { ja:"(初回クリア — 遺産なし)", kr:"(첫 클리어 — 유산 없음)" },
};

// ═══════════════════════════════════════
// Effects
// ═══════════════════════════════════════
function GlitchText({ text, intensity = 1, fontSize = 48, color = "#fff" }) {
  const id = useRef(`g${Math.random().toString(36).slice(2, 7)}`).current;
  return (<div style={{ position: "relative", display: "inline-block" }}>
    <style>{`.${id}{position:relative;font-size:${fontSize}px;font-weight:900;font-family:'Courier New',monospace;color:${color};letter-spacing:2px}.${id}::before,.${id}::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden}.${id}::before{color:#0af;animation:${id}b ${2/intensity}s infinite linear alternate-reverse;clip-path:polygon(0 0,100% 0,100% 35%,0 35%)}.${id}::after{color:#f04;animation:${id}a ${3/intensity}s infinite linear alternate-reverse;clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%)}@keyframes ${id}b{0%,100%{transform:translate(0)}50%{transform:translate(${-3*intensity}px,${intensity}px)}}@keyframes ${id}a{0%,100%{transform:translate(0)}50%{transform:translate(${2*intensity}px,${-2*intensity}px)}}`}</style>
    <div className={id} data-text={text}>{text}</div></div>);
}
function Scanlines({ opacity = 0.05 }) { return <div style={{ position: "fixed", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,${opacity}) 2px,rgba(0,0,0,${opacity}) 4px)`, pointerEvents: "none", zIndex: 9999 }} />; }
function Corrupt({ text, level = 0.3 }) { const g = "█▓▒░▀▄ÆÐÞꙮ⌀"; const [d, setD] = useState(text); useEffect(() => { const i = setInterval(() => setD(text.split("").map(c => c === " " ? c : Math.random() < level ? g[Math.floor(Math.random() * g.length)] : c).join("")), 150); return () => clearInterval(i); }, [text, level]); return <span style={{ fontFamily: "monospace", color: "#4fc3f7" }}>{d}</span>; }
function Decode({ text, duration = 2000 }) { const [d, setD] = useState(""); useEffect(() => { let f = 0; const tot = duration / 30; const iv = setInterval(() => { f++; const p = f / tot; setD(text.split("").map((c, j) => { const cp = p - (j / text.length) * 0.5; return cp > 0.8 ? c : cp > 0.5 ? "▒▓░█"[Math.floor(Math.random() * 4)] : Math.random() > 0.5 ? "0" : "1"; }).join("")); if (f >= tot) clearInterval(iv); }, 30); return () => clearInterval(iv); }, [text, duration]); return <span style={{ fontFamily: "monospace" }}>{d}</span>; }

// Sound
class SFX { constructor(){this.ctx=null;this.on=false;this.mg=null;} init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.mg=this.ctx.createGain();this.mg.gain.value=0.2;this.mg.connect(this.ctx.destination);} toggle(){this.on=!this.on;if(this.on)this.init();return this.on;} _osc(f,t,d,v=0.06){if(!this.on||!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+d);o.connect(g);g.connect(this.mg);o.start();o.stop(this.ctx.currentTime+d);} beep(){this._osc(440,"square",0.08);} hit(){this._osc(200,"triangle",0.1,0.08);} clash(){this._osc(120,"sawtooth",0.2,0.12);setTimeout(()=>this._osc(80,"square",0.12,0.08),80);} heal(){this._osc(523,"sine",0.3,0.05);setTimeout(()=>this._osc(659,"sine",0.2,0.04),150);} glitch(){if(!this.on||!this.ctx)return;const b=this.ctx.createBuffer(1,this.ctx.sampleRate*0.06,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=b;g.gain.value=0.1;s.connect(g);g.connect(this.mg);s.start();} }

// SVGs
const LancerSVG=({size=80})=>(<svg width={size} height={size} viewBox="0 0 100 100"><defs><linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3498db" stopOpacity="0.9"/><stop offset="100%" stopColor="#1a3a5c" stopOpacity="0.7"/></linearGradient></defs><ellipse cx="50" cy="26" rx="10" ry="11" fill="url(#lg2)"/><path d="M38,36 Q33,52 35,78 L42,78 L45,52 L55,52 L58,78 L65,78 Q67,52 62,36 Z" fill="url(#lg2)"/><line x1="72" y1="8" x2="60" y2="78" stroke="#c8a050" strokeWidth="2.5"/><polygon points="72,8 75,16 69,16" fill="#e0c060"/></svg>);
const ArcherSVG=({size=80})=>(<svg width={size} height={size} viewBox="0 0 100 100"><defs><linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f44" stopOpacity="0.9"/><stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.7"/></linearGradient></defs><ellipse cx="50" cy="26" rx="10" ry="11" fill="url(#ag2)"/><path d="M38,36 Q33,52 35,78 L42,78 L45,52 L55,52 L58,78 L65,78 Q67,52 62,36 Z" fill="url(#ag2)"/><line x1="28" y1="32" x2="20" y2="60" stroke="#aaa" strokeWidth="2"/><line x1="72" y1="32" x2="80" y2="60" stroke="#aaa" strokeWidth="2"/></svg>);

// ═══════════════════════════════════════
// Constants & Data
// ═══════════════════════════════════════
const CU = "#5bcefa", EM = "#ff6b6b";
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ★ Difficulty multipliers
const DIFF = {
  easy:   { enemyHp: 0.7, enemyAtk: 0.7, bondMult: 1.3, label: "EASY" },
  normal: { enemyHp: 1.0, enemyAtk: 1.0, bondMult: 1.0, label: "NORMAL" },
  hard:   { enemyHp: 1.4, enemyAtk: 1.25, bondMult: 0.8, label: "HARD" },
};

const ROOM_TYPES = [
  { id: "empty", weight: 15, icon: "🏚️" }, { id: "enemy", weight: 35, icon: "⚔" },
  { id: "loot", weight: 20, icon: "📦" }, { id: "trap", weight: 10, icon: "⚠️" },
  { id: "event", weight: 10, icon: "✨" }, { id: "rest", weight: 10, icon: "🏕️" },
];

const ENEMIES_BY_TIER = [
  [{ name:{ja:"シャドウサーヴァント",kr:"그림자 서번트"},hp:50,atk:8,sym:"S",color:"#9b59b6" },{name:{ja:"魔獣",kr:"마수"},hp:40,atk:10,sym:"K",color:"#e67e22"}],
  [{ name:{ja:"アサシンクラス",kr:"어새신 클래스"},hp:55,atk:14,sym:"A",color:"#2ecc71" },{name:{ja:"呪われた騎士",kr:"저주받은 기사"},hp:70,atk:12,sym:"N",color:"#95a5a6"}],
  [{ name:{ja:"デーモン",kr:"데몬"},hp:90,atk:16,sym:"D",color:"#c0392b" },{name:{ja:"キメラ",kr:"키메라"},hp:80,atk:18,sym:"K2",color:"#e67e22"}],
  [{ name:{ja:"魔神柱残骸",kr:"마신주 잔해"},hp:120,atk:20,sym:"柱",color:"#1abc9c" },{name:{ja:"変異サーヴァント",kr:"변이 서번트"},hp:100,atk:22,sym:"Σ",color:"#9b59b6"}],
];

const BOSSES = [
  { name:{ja:"魔神柱 — フォルネウス",kr:"마신주 — 포르네우스"},hp:180,atk:22,sym:"柱",color:"#1abc9c" },
  { name:{ja:"影のヘラクレス",kr:"그림자 헤라클레스"},hp:250,atk:26,sym:"H",color:"#e74c3c" },
  { name:{ja:"聖杯の汚染体 — アンリマユ",kr:"성배의 오염체 — 앙그라 마이뉴"},hp:320,atk:30,sym:"Ω",color:"#ff0040" },
];

// ★ Loot: indexed for dedup
const LOOT_TABLE = [
  { id:0, name:{ja:"魔力結晶",kr:"마력 결정"},effect:"rune",val:15,icon:"💎" },
  { id:1, name:{ja:"霊基の欠片",kr:"영기 파편"},effect:"projection",val:12,icon:"🔮" },
  { id:2, name:{ja:"治癒のルーン石",kr:"치유의 룬석"},effect:"healL",val:25,icon:"💙" },
  { id:3, name:{ja:"エミヤの料理",kr:"에미야의 요리"},effect:"healA",val:20,icon:"🍳" },
  { id:4, name:{ja:"強化の護符",kr:"강화의 부적"},effect:"atkL",val:2,icon:"⚔️" },
  { id:5, name:{ja:"投影触媒",kr:"투영 촉매"},effect:"atkA",val:2,icon:"🗡️" },
  { id:6, name:{ja:"シナジー結晶",kr:"시너지 결정"},effect:"synergy",val:5,icon:"💛" },
  { id:7, name:{ja:"万能霊薬",kr:"만능 영약"},effect:"healBoth",val:30,icon:"✨" },
];

const EVENTS = [
  { text:{ja:"クー・フーリンが壁にもたれて槍を磨いている。\n「…チッ、退屈な場所だな。」",kr:"쿠 훌린이 벽에 기대 창을 닦고 있다.\n\"...쳇, 지루한 곳이군.\""},speaker:"cu",bond:1 },
  { text:{ja:"エミヤが周囲の構造を解析している。\n「…この空間の術式が不安定になってきている。」",kr:"에미야가 주변 구조를 분석하고 있다.\n\"...이 공간의 술식이 점점 불안정해지고 있어.\""},speaker:"em",bond:1 },
  { text:{ja:"二人が背中合わせで警戒している。\n束の間の沈黙が、不思議と心地よい。",kr:"두 사람이 등을 맞대고 경계하고 있다.\n잠시의 침묵이, 이상하게도 편안하다."},speaker:"both",bond:3 },
  { text:{ja:"壁面にルーン文字が刻まれている。\nクー・フーリンが原初のルーンで解読する。",kr:"벽면에 룬 문자가 새겨져 있다.\n쿠 훌린이 원시 룬으로 해독한다."},speaker:"cu",runeBonus:10 },
  { text:{ja:"剣の残骸が散らばっている。\nエミヤが構造を解析し投影魔術に応用する。",kr:"검의 잔해가 흩어져 있다.\n에미야가 구조를 해석하여 투영 마술에 응용한다."},speaker:"em",projBonus:10 },
];

const FLOOR_DLG = {
  3:{speaker:"em",text:{ja:"…汚染が濃くなっている。この先、深くなるほど危険だ。",kr:"...오염이 짙어지고 있다. 이 아래로 갈수록 위험해진다."},opts:[{text:{ja:"「壊せばいいだろ？簡単だ。」",kr:"\"부수면 되는 거 아니냐. 간단하지.\""},bond:2},{text:{ja:"「…分かっている。備えておこう。」",kr:"\"...알고 있다. 대비는 해두자.\""},bond:1}],resp:[{ja:"単純明快だな。悪くない。",kr:"단순명쾌하군. 나쁘지 않다."},{ja:"慎重だな。お前らしくない。",kr:"신중하군. 네놈답지 않은 말이야."}]},
  5:{speaker:"cu",text:{ja:"お前の背中、預けるのも悪くねぇな。\n…って、何見てんだよ。",kr:"네놈의 등, 맡기는 것도 나쁘지 않군.\n...뭘 보는 거냐."},opts:[{text:{ja:"「…同感だ。」",kr:"\"...동감이다.\""},bond:3},{text:{ja:"「油断するなよ、猟犬。」",kr:"\"방심하지 마, 사냥개.\""},bond:1}],resp:[{ja:"…ハッ、お前がそう言うと背中がむず痒くなるな。",kr:"...하! 네놈이 그렇게 말하니 등이 근질근질하군."},{ja:"わかってるよ。お前こそな。",kr:"알고 있다고. 네놈이야말로."}]},
  6:{speaker:"cu",text:{ja:"この空間に閉じ込められてかなり経つな。\n…正直、お前がいなけりゃ少し退屈だったぜ。",kr:"이 공간에 갇힌 지도 꽤 됐군.\n...솔직히, 네놈이 없었으면 좀 심심했을 거다."},opts:[{text:{ja:"「ハ、俺もだ。」",kr:"\"하, 나도 마찬가지다.\""},bond:4},{text:{ja:"「感傷はいい、先に進むぞ。」",kr:"\"감상은 됐고, 앞으로 가자.\""},bond:1}],resp:[{ja:"…悪い気はしない。",kr:"...기분 나쁘진 않다."},{ja:"チッ、ドライな奴め。",kr:"쳇, 건조한 놈."}]},
  8:{speaker:"em",text:{ja:"…ランサー。お前と組んで分かったことがある。\nお前は無茶をするが…信頼に足る戦士だ。",kr:"...랜서. 네놈과 함께하면서 알게 된 것이 있다.\n무모하지만...신뢰할 만한 전사라는 것."},opts:[{text:{ja:"「当たり前だ。お前もな。」",kr:"\"당연하지. 네놈도 마찬가지다.\""},bond:4},{text:{ja:"「褒めても何も出ないぜ。」",kr:"\"칭찬해도 나올 거 없다.\""},bond:2}],resp:[{ja:"…そうか。悪くない返事だ。",kr:"...그래. 나쁘지 않은 대답이군."},{ja:"別に褒めてない。…事実を述べただけだ。",kr:"칭찬이 아니다. ...사실을 말했을 뿐."}]},
  9:{speaker:"em",text:{ja:"…最後だ。この下に汚染の核がある。\n準備はいいか、ランサー。",kr:"...마지막이다. 이 아래에 오염의 핵이 있다.\n준비는 됐나, 랜서."},opts:[{text:{ja:"「背中は任せろ。必ず突破する。」",kr:"\"등 뒤는 맡겨라. 반드시 뚫는다.\""},bond:5},{text:{ja:"「お前の心配でもしてろ。」",kr:"\"네놈 걱정이나 해라.\""},bond:2}],resp:[{ja:"…いいだろう。今度だけは信頼する、クー・フーリン。",kr:"...좋다. 이번만은 신뢰한다, 쿠 훌린."},{ja:"自信満々だな。…お前らしい。",kr:"자신만만하군. ...네놈답다."}]},
};

// ★ Hidden ending added
const ENDINGS_DATA = {
  true_bond:{title:{ja:"真・絆エンド — 永遠に繋がる魂",kr:"진·유대 엔딩 — 영원히 이어지는 혼"},color:"#ff44ff",lines:{
    ja:["全ての汚染が浄化された。","だが、二人の英霊は消えなかった。","絆が、シナジーが、データの法則すら書き換えた。","クー・フーリン：「…なぁ、アーチャー。こういうのを、奇跡って言うんだろ？」","エミヤ：「…奇跡じゃない。これは、俺たちが勝ち取った結果だ。」","二人は並んで歩き始めた。","もはやどこにも繋がらないデータの残骸の中を。","だが、それで良かった。","蒼い槍と紅い外套が並んでいる限り、","そこが、二人の戦場だから。"],
    kr:["모든 오염이 정화되었다.","하지만 두 영령은 사라지지 않았다.","유대가, 시너지가, 데이터의 법칙마저 다시 썼다.","쿠 훌린: \"...이봐, 아처. 이런 걸 기적이라고 하는 거 아니냐?\"","에미야: \"...기적이 아니다. 이건 우리가 쟁취한 결과다.\"","두 사람은 나란히 걷기 시작했다.","이제 어디에도 이어지지 않는 데이터의 잔해 속을.","하지만 그것으로 좋았다.","푸른 창과 붉은 외투가 나란히 있는 한,","거기가 두 사람의 전장이니까."]}},
  boss_extreme:{title:{ja:"極限共闘エンド — 同時NP解放",kr:"극한 공투 엔딩 — 동시 보구 해방"},color:"#ff44cc",lines:{
    ja:["汚染核が最後の咆哮を上げる。","「アーチャー！今だ！！」","「言われなくとも──」","ゲイ・ボルクと無限の剣製が同時に解放された。","二つの宝具が交差した瞬間、空間が書き換えられた。","「…ハッ、背中を預けてくれたな。」","「…お前もだ、猟犬。」","崩壊する世界の中で、二人は互いの手を取った。","蒼と紅が溶け合うように、光の中へ消えていく。"],
    kr:["오염핵이 마지막 포효를 올린다.","\"아처! 지금이다!!\"","\"말 안 해도──\"","게이 볼크와 무한의 검제가 동시에 해방되었다.","두 보구가 교차한 순간, 공간이 다시 쓰여졌다.","\"...하, 등을 맡겨줬군.\"","\"...네놈도다, 수렵견.\"","붕괴하는 세계 속에서, 두 사람은 서로의 손을 잡았다.","푸른빛과 붉은빛이 녹아들듯, 빛 속으로 사라져 간다."]}},
  boss_clear:{title:{ja:"真エンド — 記録されない戦争",kr:"진 엔딩 — 기록되지 않은 전쟁"},color:"#ffd700",lines:{
    ja:["汚染体が消滅した。","「ハッ！！最高の獲物だった！」","「…認めたくはないが、お前がいなければ不可能だった。」","「…嘘をつくな、猟犬。」","二人の英霊は互いを見て — 笑った。"],
    kr:["오염체가 소멸했다.","\"하!! 최고의 사냥감이었다!\"","\"...인정하기 싫지만, 네놈이 없었으면 불가능했다.\"","\"...거짓말을 하는군, 수렵견.\"","두 영령은 서로 마주보며 — 웃었다."]}},
  bond_high:{title:{ja:"共闘エンド — 蒼い槍と紅い外套",kr:"공투 엔딩 — 푸른 창과 붉은 외투"},color:CU,lines:{ja:["空間が崩れ始めた。","「…背中を預けてくれたこと、感謝する。」","「ハッ！次もお前の背中は俺が守る。」"],kr:["공간이 부서지기 시작했다.","\"...등 뒤를 맡겨줘서 고맙다.\"","\"하! 다음에도 네놈 등 뒤는 내가 지킨다.\""]}},
  bond_mid:{title:{ja:"黙認エンド — 戦士の礼",kr:"묵인 엔딩 — 전사의 예의"},color:"#f1c40f",lines:{ja:["「…なかなかやるな。」","「次の戦場で会おう。」"],kr:["\"...꽤 하더군.\"","\"다음 전장에서 보자.\""]}},
  bond_low:{title:{ja:"孤独エンド — 各自の道",kr:"고독 엔딩 — 각자의 길"},color:"#888",lines:{ja:["結局、互いを信頼できなかった。"],kr:["결국 신뢰하지 못했다."]}},
  defeat:{title:{ja:"敗北エンド — データ消失",kr:"패배 엔딩 — 데이터 소실"},color:"#556",lines:{ja:["霊基が限界に達した。","聖杯の汚染が全てを飲み込んだ。"],kr:["영기가 한계에 달했다.","성배의 오염이 모든 것을 삼켰다."]}},
};

// ═══════════════════════════════════════
// ★ Storage with fallback
// ═══════════════════════════════════════
const SAVE_KEY = "fate_lost_log_save";
const storage = {
  async set(k, v) { try { await window.storage.set(k, v); } catch { try { localStorage.setItem(k, v); } catch {} } },
  async get(k) { try { const r = await window.storage.get(k); return r?.value || null; } catch { try { return localStorage.getItem(k); } catch { return null; } } },
  async del(k) { try { await window.storage.delete(k); } catch { try { localStorage.removeItem(k); } catch {} } },
};
async function saveGame(s) { try { await storage.set(SAVE_KEY, JSON.stringify({ floor:s.floor, roomsExplored:s.roomsExplored, bond:s.bond, synergy:s.synergy, kills:s.kills, lancer:s.lancer, archer:s.archer, flags:s.flags, diff:s.difficulty, ts:Date.now() })); return true; } catch { return false; } }
async function loadGame() { try { const r = await storage.get(SAVE_KEY); if (!r) return null; return JSON.parse(r); } catch { return null; } }
async function deleteSave() { await storage.del(SAVE_KEY); }

// ═══════════════════════════════════════
// State
// ═══════════════════════════════════════
const INIT = () => ({ phase: "title", floor: 1, roomsExplored: 0, bond: 0, synergy: 0, kills: 0, difficulty: "normal", lancer: { hp: 120, maxHp: 120, atk: 18, rune: 50, maxRune: 50 }, archer: { hp: 100, maxHp: 100, atk: 15, projection: 40, maxProjection: 40 }, battle: null, log: [], flags: {}, terminal: [], floorRooms: 0 });

function reducer(s, a) {
  switch (a.type) {
    case "SET": return { ...s, ...a.value };
    case "PHASE": return { ...s, phase: a.value };
    case "LOG": return { ...s, log: [...s.log.slice(-80), { msg: a.msg, color: a.color }] };
    case "TERM": return { ...s, terminal: [...s.terminal, a.value] };
    case "FLAG": return { ...s, flags: { ...s.flags, [a.value]: true } };
    case "UPDATE_LANCER": return { ...s, lancer: { ...s.lancer, ...a.value } };
    case "UPDATE_ARCHER": return { ...s, archer: { ...s.archer, ...a.value } };
    case "RESET": return INIT();
    default: return s;
  }
}

// ═══════════════════════════════════════
// Styles (★ mobile min-height)
// ═══════════════════════════════════════
const S = {
  app: { background: "#060810", color: "#dddde4", fontFamily: "'Courier New',monospace", minHeight: "100vh", fontSize: 15, lineHeight: 1.7 },
  panel: { border: "1px solid #1a2a3e", borderRadius: 6, padding: 12, marginBottom: 10, background: "#0a0e18" },
  btn: (c = CU, dis = false) => ({
    background: dis ? "#0a0e18" : "#0e1420", color: dis ? "#445" : c,
    border: `1px solid ${dis ? "#1a1a24" : c}`, padding: "10px 16px",
    cursor: dis ? "not-allowed" : "pointer", fontFamily: "monospace", fontSize: 14,
    borderRadius: 4, margin: 3, transition: "all 0.15s", opacity: dis ? 0.5 : 1,
    minHeight: 48, // ★ mobile touch target
    pointerEvents: dis ? "none" : "auto", // ★ acting block
  }),
  log: { maxHeight: 160, overflowY: "auto", padding: 8, background: "#080c14", border: "1px solid #1a2030", borderRadius: 4, fontSize: 13, marginTop: 8, lineHeight: 1.6 },
  hpBg: { width: "100%", height: 8, background: "#1a1a24", borderRadius: 4, marginTop: 3 },
  hpBar: (p, c) => ({ width: `${p}%`, height: 8, background: c, borderRadius: 4, transition: "width 0.3s" }),
};

function LogPanel({ log }) { const ref = useRef(null); useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [log]); return <div ref={ref} style={S.log}>{log.map((l, i) => <div key={i} style={{ color: l.color || "#99a", margin: "2px 0", lineHeight: 1.6 }}>{l.msg}</div>)}</div>; }

function StatusBar({ s }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const lH = Math.max(0, (s.lancer.hp / s.lancer.maxHp) * 100);
  const aH = Math.max(0, (s.archer.hp / s.archer.maxHp) * 100);
  return (
    <div style={{ ...S.panel, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ flex: 1, minWidth: 130 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ color: CU, fontWeight: "bold", fontSize: 13 }}>{t("cuName")}</span><span style={{ color: "#78899a", fontSize: 11 }}>ATK:{s.lancer.atk}</span></div>
        <div style={S.hpBg}><div style={S.hpBar(lH, lH > 50 ? "#3498db" : "#f44")} /></div>
        <div style={{ color: "#78899a", fontSize: 10 }}>HP {s.lancer.hp}/{s.lancer.maxHp} | ルーン {s.lancer.rune}/{s.lancer.maxRune}</div>
        {s.lancer.rune <= 10 && <div style={{ color: CU, fontSize: 11, fontStyle: "italic" }}>{t("cuRuneLow")}</div>}
      </div>
      <div style={{ flex: 1, minWidth: 130 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ color: EM, fontWeight: "bold", fontSize: 13 }}>{t("emName")}</span><span style={{ color: "#78899a", fontSize: 11 }}>ATK:{s.archer.atk}</span></div>
        <div style={S.hpBg}><div style={S.hpBar(aH, aH > 50 ? "#e74c3c" : "#f44")} /></div>
        <div style={{ color: "#78899a", fontSize: 10 }}>HP {s.archer.hp}/{s.archer.maxHp} | 投影 {s.archer.projection}/{s.archer.maxProjection}</div>
        {s.archer.projection <= 10 && s.archer.projection > 0 && <div style={{ color: EM, fontSize: 11, fontStyle: "italic" }}>{t("emProjLow")}</div>}
        {s.archer.projection <= 0 && <div style={{ color: EM, fontSize: 11, fontStyle: "italic" }}>{t("emProjCrit")}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
        <span style={{ color: CU }}>{t("bond")}:{s.bond}</span><span style={{ color: "#ffaa33" }}>{t("synergy")}:{s.synergy}</span>
        <span style={{ color: "#f1c40f" }}>{t("kills")}:{s.kills}</span><span style={{ color: "#99aabb" }}>B{s.floor}F [{DIFF[s.difficulty]?.label}]</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Title (★ difficulty select)
// ═══════════════════════════════════════
function TitlePhase({ dispatch, sfx, lang, setLang }) {
  const L = lang, t = k => TX[k]?.[L] || "";
  const [show, setShow] = useState(false);
  const [si, setSi] = useState(null);
  const [ld, setLd] = useState(true);
  const [diff, setDiff] = useState("normal");

  useEffect(() => { const tm = setTimeout(() => setShow(true), 500); (async () => { setSi(await loadGame()); setLd(false); })(); return () => clearTimeout(tm); }, []);

  return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Scanlines opacity={0.04} />
      <div style={{ position: "fixed", top: 8, left: 8, zIndex: 10001, display: "flex", gap: 4 }}>
        {[["ja", "🇯🇵"], ["kr", "🇰🇷"]].map(([c, f]) => (<button key={c} onClick={() => setLang(c)} style={{ padding: "4px 10px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 13, background: L === c ? "#4fc3f7" : "#1a1a24", color: L === c ? "#000" : "#667", fontFamily: "monospace" }}>{f}</button>))}
      </div>
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 3s", textAlign: "center" }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 20, justifyContent: "center" }}><LancerSVG size={90} /><ArcherSVG size={85} /></div>
        <GlitchText text="FATE // LOST_LOG" intensity={0.5} fontSize={40} color={CU} />
        <div style={{ fontSize: 15, color: "#8899aa", marginTop: 10, letterSpacing: 3 }}><Corrupt text={t("subtitle")} level={0.1} /></div>
        <div style={{ fontSize: 13, color: "#556677", marginTop: 8, marginBottom: 20 }}>{t("tagline")}</div>

        {/* ★ Difficulty selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#78899a", fontSize: 12, marginBottom: 8 }}>{t("diffLabel")}</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {(["easy", "normal", "hard"]).map(d => (
              <button key={d} onClick={() => setDiff(d)} style={{
                padding: "6px 16px", borderRadius: 4, border: `1px solid ${diff === d ? "#f1c40f" : "#334"}`,
                background: diff === d ? "#f1c40f22" : "transparent", color: diff === d ? "#f1c40f" : "#667",
                cursor: "pointer", fontFamily: "monospace", fontSize: 13, minHeight: 36,
              }}>{t(d)}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { sfx.current?.beep(); dispatch({ type: "SET", value: { difficulty: diff } }); dispatch({ type: "PHASE", value: "terminal" }); }} style={{ ...S.btn(CU), padding: "14px 36px", fontSize: 15, letterSpacing: 3 }}>{t("newGame")}</button>
          {!ld && si && <button onClick={async () => { sfx.current?.beep(); dispatch({ type: "SET", value: { floor: si.floor, roomsExplored: si.roomsExplored, bond: si.bond, synergy: si.synergy, kills: si.kills, lancer: si.lancer, archer: si.archer, flags: si.flags || {}, floorRooms: 0, difficulty: si.diff || "normal" } }); dispatch({ type: "LOG", msg: t("loadOk"), color: "#2ecc71" }); dispatch({ type: "PHASE", value: "explore" }); }} style={{ ...S.btn("#2ecc71"), padding: "14px 36px", fontSize: 15 }}>{t("cont")} (B{si.floor}F)</button>}
        </div>
        <div style={{ marginTop: 40, fontSize: 11, color: "#445566" }}>{t("disclaimer")}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Terminal
// ═══════════════════════════════════════
function TerminalPhase({ state, dispatch, sfx }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [input, setInput] = useState(""); const [ready, setReady] = useState(false); const logRef = useRef(null);
  useEffect(() => { const ts = [setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys1") } }), 500), setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys2") } }), 2000), setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys3") } }), 3500), setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys4") } }), 5000)]; return () => ts.forEach(clearTimeout); }, []);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [state.terminal]);
  const exec = () => { if (!input.trim()) return; const c = input.trim().toLowerCase(); dispatch({ type: "TERM", value: { ty: "in", m: `> ${input.trim()}` } }); setInput(""); if (c.includes("trace") && c.includes("on")) { dispatch({ type: "TERM", value: { ty: "cu", m: t("cuTrace") } }); sfx.current?.clash(); setTimeout(() => { dispatch({ type: "TERM", value: { ty: "em", m: t("emTrace") } }); setReady(true); }, 1500); } else { dispatch({ type: "TERM", value: { ty: "e", m: `Unknown: ${input.trim()}` } }); sfx.current?.beep(); } };
  return (<div style={{ ...S.app, display: "flex", flexDirection: "column" }}><Scanlines opacity={0.03} /><div style={{ background: "#0a0e18", borderBottom: "1px solid #1a2a3e", padding: "10px 14px" }}><span style={{ color: CU, fontSize: 13 }}>FATE_LOST_LOG@Terminal</span></div>
    <div ref={logRef} style={{ flex: 1, overflow: "auto", padding: 14, maxHeight: "calc(100vh - 120px)" }}>{state.terminal.map((e, i) => (<div key={i} style={{ color: e.ty === "in" ? CU : e.ty === "e" ? "#ff6b6b" : e.ty === "cu" ? CU : e.ty === "em" ? EM : "#778", marginBottom: 5, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7 }}>{e.ty === "sys" ? <Decode text={e.m} duration={1500} /> : e.m}</div>))}
      {ready && <div style={{ marginTop: 16 }}><button onClick={() => { sfx.current?.glitch(); dispatch({ type: "PHASE", value: "explore" }); }} style={{ ...S.btn(CU), padding: "12px 24px", fontSize: 14, fontWeight: "bold", animation: "pulse 2s ease-in-out infinite" }}>{t("startExplore")}</button></div>}</div>
    <div style={{ borderTop: "1px solid #1a2a3e", padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: CU, fontSize: 14 }}>$</span><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && exec()} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: CU, fontFamily: "monospace", fontSize: 15 }} autoFocus placeholder="trace on" /></div></div>);
}

// ═══════════════════════════════════════
// Explore (★ dedup loot, floor10 event, save block msg, difficulty applied)
// ═══════════════════════════════════════
function ExplorePhase({ state, dispatch, sfx }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [dlg, setDlg] = useState(null); const [dlgS, setDlgS] = useState(0); const [saving, setSaving] = useState(false);
  const [loot, setLoot] = useState(null); const [evt, setEvt] = useState(null); const [room, setRoom] = useState(null);
  const [preBoss, setPreBoss] = useState(false); const [f10Evt, setF10Evt] = useState(false);
  const df = DIFF[state.difficulty] || DIFF.normal;

  useEffect(() => { const fd = FLOOR_DLG[state.floor]; if (fd && !state.flags[`fd_${state.floor}`] && state.floorRooms === 0) { setDlg(fd); dispatch({ type: "FLAG", value: `fd_${state.floor}` }); } }, [state.floor]);
  useEffect(() => { if (state.lancer.hp <= 0 || state.archer.hp <= 0) dispatch({ type: "PHASE", value: "ending" }); }, [state.lancer.hp, state.archer.hp]);

  const doSave = async () => { setSaving(true); const ok = await saveGame(state); dispatch({ type: "LOG", msg: ok ? t("saveOk") : t("saveFail"), color: ok ? "#2ecc71" : "#ff6b6b" }); setSaving(false); };
  const rollRoom = () => { const tw = ROOM_TYPES.reduce((s, r) => s + r.weight, 0); let roll = Math.random() * tw, acc = 0; for (const r of ROOM_TYPES) { acc += r.weight; if (roll < acc) return r; } return ROOM_TYPES[0]; };

  const applyLoot = (it) => {
    if (it.effect === "rune") dispatch({ type: "UPDATE_LANCER", value: { rune: Math.min(state.lancer.maxRune, state.lancer.rune + it.val) } });
    else if (it.effect === "projection") dispatch({ type: "UPDATE_ARCHER", value: { projection: Math.min(state.archer.maxProjection, state.archer.projection + it.val) } });
    else if (it.effect === "healL") dispatch({ type: "UPDATE_LANCER", value: { hp: clamp(state.lancer.hp + it.val, 0, state.lancer.maxHp) } });
    else if (it.effect === "healA") dispatch({ type: "UPDATE_ARCHER", value: { hp: clamp(state.archer.hp + it.val, 0, state.archer.maxHp) } });
    else if (it.effect === "healBoth") { dispatch({ type: "UPDATE_LANCER", value: { hp: clamp(state.lancer.hp + it.val, 0, state.lancer.maxHp) } }); dispatch({ type: "UPDATE_ARCHER", value: { hp: clamp(state.archer.hp + it.val, 0, state.archer.maxHp) } }); }
    else if (it.effect === "atkL") dispatch({ type: "UPDATE_LANCER", value: { atk: state.lancer.atk + it.val } });
    else if (it.effect === "atkA") dispatch({ type: "UPDATE_ARCHER", value: { atk: state.archer.atk + it.val } });
    else if (it.effect === "synergy") dispatch({ type: "SET", value: { synergy: state.synergy + it.val } });
    dispatch({ type: "LOG", msg: `${it.icon} ${it.name[L] || it.name.ja}`, color: "#f1c40f" }); sfx.current?.beep();
  };

  const explore = (dir) => {
    sfx.current?.beep(); const rt = rollRoom(); const nr = state.floorRooms + 1;
    dispatch({ type: "SET", value: { floorRooms: nr, roomsExplored: state.roomsExplored + 1 } });
    const labels = TX.roomLabels[L]; const idx = ROOM_TYPES.findIndex(r => r.id === rt.id);
    dispatch({ type: "LOG", msg: `🚪 ${dir} … ${rt.icon} ${labels[idx]}`, color: "#99aabb" });

    if (rt.id === "enemy") {
      const tier = Math.min(Math.floor((state.floor - 1) / 3), ENEMIES_BY_TIER.length - 1);
      const base = pick(ENEMIES_BY_TIER[tier]); const m = 1 + (state.floor - 1) * 0.12;
      // ★ difficulty multiplier
      const en = { name: base.name[L] || base.name.ja, hp: Math.floor(base.hp * m * df.enemyHp), maxHp: Math.floor(base.hp * m * df.enemyHp), atk: Math.floor(base.atk * m * df.enemyAtk), sym: base.sym, color: base.color };
      dispatch({ type: "SET", value: { battle: { enemy: en, turn: 0 } } }); dispatch({ type: "PHASE", value: "battle" });
    } else if (rt.id === "loot") {
      // ★ Dedup: shuffle and pick unique items
      const shuffled = [...LOOT_TABLE].sort(() => Math.random() - 0.5);
      const items = shuffled.slice(0, Math.random() < 0.4 ? 2 : 1);
      setLoot(items);
    } else if (rt.id === "trap") {
      const d = 5 + state.floor * 2; const who = Math.random() < 0.5 ? "lancer" : "archer";
      if (who === "lancer") dispatch({ type: "UPDATE_LANCER", value: { hp: Math.max(1, state.lancer.hp - d) } });
      else dispatch({ type: "UPDATE_ARCHER", value: { hp: Math.max(1, state.archer.hp - d) } });
      dispatch({ type: "LOG", msg: fmt(t("rmTrap"), { who: who === "lancer" ? TX.cuSay[L] : TX.emSay[L], d }), color: who === "lancer" ? CU : EM });
    } else if (rt.id === "event") {
      if (state.bond >= 5 && Math.random() < 0.3 && !state.flags.cookEvt) {
        setEvt({ text: TX.cookEvt, speaker: "both", bond: 3, healBoth: 20, isCook: true }); dispatch({ type: "FLAG", value: "cookEvt" });
      } else setEvt(pick(EVENTS));
    } else if (rt.id === "rest") {
      dispatch({ type: "UPDATE_LANCER", value: { hp: clamp(state.lancer.hp + 20 + state.floor * 2, 0, state.lancer.maxHp), rune: Math.min(state.lancer.maxRune, state.lancer.rune + 15) } });
      dispatch({ type: "UPDATE_ARCHER", value: { hp: clamp(state.archer.hp + 15 + state.floor * 2, 0, state.archer.maxHp), projection: Math.min(state.archer.maxProjection, state.archer.projection + 12) } });
      dispatch({ type: "LOG", msg: t("rmRest"), color: "#2ecc71" }); sfx.current?.heal();
    }
    if (nr >= 5 && rt.id !== "enemy") setRoom("stairs"); else setRoom(rt.id);
  };

  const goNext = () => {
    if (state.floor >= 10) {
      // ★ Floor 10 arrival event
      if (!state.flags.f10arrive) { setF10Evt(true); dispatch({ type: "FLAG", value: "f10arrive" }); return; }
      setPreBoss(true); return;
    }
    dispatch({ type: "SET", value: { floor: state.floor + 1, floorRooms: 0 } });
    dispatch({ type: "UPDATE_LANCER", value: { rune: Math.min(state.lancer.maxRune, state.lancer.rune + 10) } });
    dispatch({ type: "UPDATE_ARCHER", value: { projection: Math.min(state.archer.maxProjection, state.archer.projection + 8) } });
    dispatch({ type: "LOG", msg: fmt(t("reachedFloor"), { n: state.floor + 1 }), color: "#f1c40f" });
    setRoom(null); sfx.current?.glitch();
  };

  // ★ Floor 10 arrival mini-event
  if (f10Evt) return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.06} /><div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
    <GlitchText text="B10F" intensity={0.8} fontSize={36} color="#ff0040" />
    <div style={{ ...S.panel, color: "#e8e8ee", fontSize: 15, lineHeight: 2, whiteSpace: "pre-wrap", marginTop: 20 }}>{t("floor10arrive")}</div>
    <button onClick={() => { setF10Evt(false); setPreBoss(true); }} style={{ ...S.btn("#ff0040"), marginTop: 16, fontSize: 15, fontWeight: "bold" }}>{t("contBtn")}</button>
  </div></div>);

  // Pre-boss cutscene
  if (preBoss) return (<div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}><Scanlines opacity={0.06} />
    <div style={{ textAlign: "center", maxWidth: 600 }}>
      <div style={{ marginBottom: 20, display: "flex", gap: 20, justifyContent: "center" }}><LancerSVG size={80} /><ArcherSVG size={75} /></div>
      <div style={{ ...S.panel, color: "#e8e8ee", fontSize: 15, lineHeight: 2.2, whiteSpace: "pre-wrap" }}>
        <div style={{ color: "#99aabb", marginBottom: 8 }}>{t("preBoss1")}</div>
        <div style={{ color: EM, marginBottom: 6 }}>{t("preBoss2")}</div>
        <div style={{ color: CU, marginBottom: 6 }}>{t("preBoss3")}</div>
        <div style={{ color: "#ddd", marginTop: 12 }}>{t("preBoss4")}</div>
      </div>
      <button onClick={() => {
        const boss = state.bond >= 20 ? BOSSES[2] : state.bond >= 8 ? BOSSES[1] : BOSSES[0];
        const en = { ...boss, name: boss.name[L] || boss.name.ja, hp: Math.floor(boss.hp * df.enemyHp), maxHp: Math.floor(boss.hp * df.enemyHp), atk: Math.floor(boss.atk * df.enemyAtk) };
        dispatch({ type: "SET", value: { battle: { enemy: en, turn: 0 } } }); dispatch({ type: "PHASE", value: "battle" });
      }} style={{ ...S.btn("#ff0040"), padding: "14px 32px", fontSize: 16, fontWeight: "bold", marginTop: 16, animation: "pulse 2s ease-in-out infinite" }}>{t("preBossBtn")}</button>
    </div></div>);

  // Floor dialogue
  if (dlg && dlgS === 0) { const isL = dlg.speaker === "cu"; return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.04} /><div style={{ maxWidth: 620, margin: "40px auto" }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>{isL ? <LancerSVG size={55} /> : <ArcherSVG size={55} />}<span style={{ color: isL ? CU : EM, fontWeight: "bold", fontSize: 16 }}>{isL ? TX.cuSay[L] : TX.emSay[L]}</span></div>
    <div style={{ ...S.panel, color: "#e8e8ee", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{dlg.text[L]}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
      {dlg.opts.map((o, i) => {
        // ★ Bond gain affected by difficulty
        const bondGain = Math.max(1, Math.floor((o.bond || 0) * df.bondMult));
        return (<button key={i} onClick={() => { dispatch({ type: "SET", value: { bond: state.bond + bondGain } }); dispatch({ type: "LOG", msg: `→ ${dlg.resp[i][L]}`, color: isL ? CU : EM }); setDlgS(1); sfx.current?.glitch(); }} style={{ ...S.btn(o.bond >= 3 ? CU : EM), textAlign: "left", lineHeight: 1.7, fontSize: 14 }}>{o.text[L]}</button>);
      })}
    </div></div></div>); }
  if (dlg && dlgS === 1) return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.04} /><div style={{ maxWidth: 620, margin: "40px auto", textAlign: "center" }}><div style={{ ...S.panel, color: "#ccd", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{state.log[state.log.length - 1]?.msg}</div><button onClick={() => { setDlg(null); setDlgS(0); }} style={{ ...S.btn(CU), marginTop: 16 }}>{t("contBtn")}</button></div></div>);

  // Loot
  if (loot) return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.04} /><StatusBar s={state} /><div style={{ maxWidth: 500, margin: "20px auto" }}><div style={{ ...S.panel, textAlign: "center" }}>
    <div style={{ color: "#f1c40f", fontSize: 16, marginBottom: 12 }}>{t("lootFound")}</div>
    {loot.map((it, i) => (<button key={`${it.id}-${i}`} onClick={() => { applyLoot(it); setLoot(l => l.filter((_, j) => j !== i)); }} style={{ ...S.btn("#f1c40f"), display: "block", width: "100%", textAlign: "left", marginBottom: 6 }}>{it.icon} {it.name[L] || it.name.ja} +{it.val}</button>))}
    {loot.length === 0 && <button onClick={() => setLoot(null)} style={{ ...S.btn("#99aabb"), marginTop: 8 }}>{t("contExplore")}</button>}
  </div></div></div>);

  // Event
  if (evt) { const applyEvt = () => {
    const bondGain = Math.max(1, Math.floor((evt.bond || 0) * df.bondMult));
    if (evt.bond) dispatch({ type: "SET", value: { bond: state.bond + bondGain } });
    if (evt.runeBonus) dispatch({ type: "UPDATE_LANCER", value: { rune: Math.min(state.lancer.maxRune, state.lancer.rune + evt.runeBonus) } });
    if (evt.projBonus) dispatch({ type: "UPDATE_ARCHER", value: { projection: Math.min(state.archer.maxProjection, state.archer.projection + evt.projBonus) } });
    if (evt.healBoth) { dispatch({ type: "UPDATE_LANCER", value: { hp: clamp(state.lancer.hp + evt.healBoth, 0, state.lancer.maxHp) } }); dispatch({ type: "UPDATE_ARCHER", value: { hp: clamp(state.archer.hp + evt.healBoth, 0, state.archer.maxHp) } }); }
    if (evt.isCook) sfx.current?.heal(); setEvt(null);
  }; return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.04} /><StatusBar s={state} /><div style={{ maxWidth: 520, margin: "20px auto", textAlign: "center" }}>
    <div style={{ ...S.panel, color: evt.speaker === "cu" ? CU : evt.speaker === "em" ? EM : "#ddd", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{evt.text[L] || evt.text.ja}</div>
    <button onClick={applyEvt} style={{ ...S.btn(CU), marginTop: 12 }}>{t("contBtn")}</button></div></div>); }

  const stairsOk = room === "stairs" || state.floorRooms >= 5;
  const dirs = [t("north"), t("east"), t("west"), t("south")];

  return (<div style={{ ...S.app, padding: 10 }}><Scanlines opacity={0.03} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a2a3e", paddingBottom: 8, marginBottom: 10 }}>
      <span style={{ color: CU, fontSize: 16, fontWeight: "bold" }}><Corrupt text={`B${state.floor}F`} level={0.06} /> — {t("exploring")}</span>
      <button onClick={doSave} disabled={saving} style={{ ...S.btn("#2ecc71", saving), padding: "6px 14px", fontSize: 12 }}>{saving ? t("saving") : t("save")}</button>
    </div>
    <StatusBar s={state} />
    <div style={S.panel}>
      <div style={{ color: "#99aabb", fontSize: 13, marginBottom: 10 }}>{t("dirLabel")}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>{dirs.map(d => (<button key={d} onClick={() => explore(d)} style={S.btn(CU)}>{d}</button>))}</div>
      {stairsOk && <div style={{ marginTop: 12, textAlign: "center" }}><button onClick={goNext} style={{ ...S.btn(state.floor >= 10 ? "#ff0040" : "#f1c40f"), fontWeight: "bold", fontSize: 15, padding: "12px 24px", animation: "pulse 2s ease-in-out infinite" }}>{state.floor >= 10 ? t("finalBoss") : fmt(t("descend"), { n: state.floor + 1 })}</button></div>}
    </div>
    <LogPanel log={state.log} /></div>);
}

// ═══════════════════════════════════════
// Battle (★ SKIP button, combo scales with bond, difficulty applied)
// ═══════════════════════════════════════
function BattlePhase({ state, dispatch, sfx }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [log, setLog] = useState([]); const [acting, setActing] = useState(false); const [turn, setTurn] = useState("lancer");
  const logRef = useRef(null); const timerRef = useRef(null);
  const b = state.battle; const e = b?.enemy;

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const addLog = (m, c) => setLog(p => [...p, { msg: m, color: c }]);

  // ★ Combo chance scales with bond (not static)
  const comboChance = Math.min(0.5, state.bond * 0.015);

  const doAction = (who, action) => {
    if (acting || !e || e.hp <= 0) return; setActing(true);
    const syn = 1 + state.synergy * 0.01;
    let dmg = 0; const msgs = []; let enemyDmgTotal = 0; let shield = false;
    let newL = { ...state.lancer }; let newA = { ...state.archer };

    if (who === "lancer") {
      if (action === "thrust") { dmg = Math.floor((newL.atk + Math.random() * 8) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("cuThrust"), { d: dmg }), color: CU }); sfx.current?.hit(); }
      else if (action === "rune") { if (newL.rune < 15) msgs.push({ msg: t("noRune"), color: "#99a" }); else { newL.rune -= 15; dmg = Math.floor((newL.atk * 1.8 + Math.random() * 12) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("cuRune"), { d: dmg }), color: "#ffaa33" }); } }
      else if (action === "bolg") { if (newL.rune < 35) msgs.push({ msg: t("noRune") + " (35)", color: "#99a" }); else { newL.rune -= 35; dmg = Math.floor((newL.atk * 3.5 + Math.random() * 20) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("cuBolg"), { d: dmg }), color: "#00ccff" }); sfx.current?.clash(); } }
      if (newL.rune <= 10 && newL.rune > 0) msgs.push({ msg: t("cuRuneLow"), color: CU });
      setTurn("archer");
    } else {
      if (action === "slash") { dmg = Math.floor((newA.atk + Math.random() * 6) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("emSlash"), { d: dmg }), color: EM }); sfx.current?.hit(); }
      else if (action === "project") { if (newA.projection < 15) msgs.push({ msg: t("noProj"), color: "#99a" }); else { newA.projection -= 15; dmg = Math.floor((newA.atk * 2 + Math.random() * 10) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("emProj"), { d: dmg }), color: "#ffaa33" }); } }
      else if (action === "ubw") { if (newA.projection < 30) msgs.push({ msg: t("noProj") + " (30)", color: "#99a" }); else { newA.projection -= 30; dmg = Math.floor((newA.atk * 3 + Math.random() * 18) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("emUbw"), { d: dmg }), color: "#ff8833" }); sfx.current?.clash(); } }
      else if (action === "shield") { shield = true; msgs.push({ msg: t("emShield"), color: CU }); }
      if (newA.projection <= 10 && newA.projection > 0) msgs.push({ msg: t("emProjLow"), color: EM });
      if (newA.projection <= 0) msgs.push({ msg: t("emProjCrit"), color: EM });
      setTurn("enemy");
    }

    // ★ Combo: probability scales with bond
    if (who === "archer" && state.synergy >= 15 && state.bond >= 8 && Math.random() < comboChance) {
      const cd = Math.floor((newL.atk + newA.atk) * 1.5); enemyDmgTotal += cd;
      msgs.push({ msg: fmt(t("combo"), { d: cd }), color: "#f1c40f" }); sfx.current?.clash();
    }

    const newEHp = Math.max(0, e.hp - enemyDmgTotal);
    dispatch({ type: "UPDATE_LANCER", value: newL }); dispatch({ type: "UPDATE_ARCHER", value: newA });
    dispatch({ type: "SET", value: { battle: { ...b, enemy: { ...e, hp: newEHp }, shielding: shield } } });

    if (newEHp <= 0) {
      dispatch({ type: "SET", value: { kills: state.kills + 1 } });
      msgs.push({ msg: fmt(t("defeated"), { n: e.name }), color: "#f1c40f" });
      msgs.forEach(m => addLog(m.msg, m.color));
      const isBoss = ["柱", "H", "Ω"].includes(e.sym);
      timerRef.current = setTimeout(() => dispatch({ type: "PHASE", value: isBoss ? "ending" : "explore" }), 1200);
      setActing(false); return;
    }

    if (who === "archer") {
      timerRef.current = setTimeout(() => {
        const ea = e.atk + Math.floor(Math.random() * 8); const sh = shield;
        const tL = Math.random() < 0.5; let ed = sh ? Math.floor(ea * 0.4) : ea;
        let uL = { ...newL }; let uA = { ...newA };
        if (tL) { uL.hp = Math.max(0, uL.hp - ed); msgs.push({ msg: fmt(t("eDmgL"), { n: e.name, d: ed }), color: "#e67e22" }); }
        else { uA.hp = Math.max(0, uA.hp - ed); msgs.push({ msg: fmt(t("eDmgA"), { n: e.name, d: ed }), color: "#e67e22" }); }
        if (uL.hp <= 0 && state.bond >= 10) { uL.hp = 20; msgs.push({ msg: t("rescueL"), color: EM }); }
        if (uA.hp <= 0 && state.bond >= 10) { uA.hp = 20; msgs.push({ msg: t("rescueA"), color: CU }); }
        msgs.forEach(m => addLog(m.msg, m.color));
        dispatch({ type: "UPDATE_LANCER", value: uL }); dispatch({ type: "UPDATE_ARCHER", value: uA });
        dispatch({ type: "SET", value: { battle: { ...b, enemy: { ...e, hp: newEHp }, turn: (b?.turn || 0) + 1, shielding: false } } });
        setTurn("lancer"); setActing(false);
        if (uL.hp <= 0 || uA.hp <= 0) timerRef.current = setTimeout(() => dispatch({ type: "PHASE", value: "ending" }), 800);
      }, 700);
    } else { msgs.forEach(m => addLog(m.msg, m.color)); setActing(false); }
  };

  const eHp = e ? Math.max(0, (e.hp / e.maxHp) * 100) : 0;
  const isL = turn === "lancer", isA = turn === "archer";

  return (<div style={{ ...S.app, padding: 10, display: "flex", flexDirection: "column" }}><Scanlines opacity={0.03} />
    <div style={{ background: "#0a0e18", borderBottom: "1px solid #1a2a3e", padding: "8px 12px", display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <span style={{ color: isL ? CU : isA ? EM : "#e67e22", fontWeight: "bold" }}>{isL ? t("lancerTurn") : isA ? t("archerTurn") : t("enemyTurn")}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* ★ Save blocked in battle */}
        <span style={{ color: "#445", fontSize: 11 }}>{t("saveNoBattle")}</span>
        <span style={{ color: "#78899a" }}>B{state.floor}F · Turn {(b?.turn || 0) + 1}</span>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "14px 6px", flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ opacity: isL ? 1 : 0.5, border: isL ? `2px solid ${CU}` : "2px solid transparent", borderRadius: 8, padding: 6, textAlign: "center" }}>
          <LancerSVG size={55} /><div style={{ color: CU, fontSize: 11 }}>HP {state.lancer.hp}/{state.lancer.maxHp}</div><div style={{ color: "#78899a", fontSize: 10 }}>ルーン {state.lancer.rune}</div></div>
        <div style={{ opacity: isA ? 1 : 0.5, border: isA ? `2px solid ${EM}` : "2px solid transparent", borderRadius: 8, padding: 6, textAlign: "center" }}>
          <ArcherSVG size={55} /><div style={{ color: EM, fontSize: 11 }}>HP {state.archer.hp}/{state.archer.maxHp}</div><div style={{ color: "#78899a", fontSize: 10 }}>投影 {state.archer.projection}</div></div>
      </div>
      <div style={{ color: "#556", fontSize: 22 }}>VS</div>
      {e && <div style={{ textAlign: "center" }}><div style={{ fontSize: 44, color: e.color }}>{e.sym}</div><div style={{ color: e.color, fontSize: 14, fontWeight: "bold" }}>{e.name}</div><div style={S.hpBg}><div style={S.hpBar(eHp, "#e74c3c")} /></div><div style={{ color: "#78899a", fontSize: 11 }}>HP {Math.max(0, e.hp)}/{e.maxHp}</div></div>}
    </div>
    {isL && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      <button style={S.btn(CU, acting)} onClick={() => doAction("lancer", "thrust")} disabled={acting}>{t("thrust")}</button>
      <button style={S.btn("#ffaa33", acting)} onClick={() => doAction("lancer", "rune")} disabled={acting}>{t("rune")}</button>
      <button style={S.btn("#00ccff", acting)} onClick={() => doAction("lancer", "bolg")} disabled={acting}>{t("bolg")}</button>
    </div>}
    {isA && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      <button style={S.btn(EM, acting)} onClick={() => doAction("archer", "slash")} disabled={acting}>{t("slash")}</button>
      <button style={S.btn("#ffaa33", acting)} onClick={() => doAction("archer", "project")} disabled={acting}>{t("project")}</button>
      <button style={S.btn("#ff8833", acting)} onClick={() => doAction("archer", "ubw")} disabled={acting}>{t("ubw")}</button>
      <button style={S.btn(CU, acting)} onClick={() => doAction("archer", "shield")} disabled={acting}>{t("shield")}</button>
    </div>}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
      <div style={{ fontSize: 11, color: "#445" }}>Combo: {Math.round(comboChance * 100)}%</div>
      {/* ★ SKIP button: fast-forward acting delay */}
      {acting && <button onClick={() => { if (timerRef.current) { clearTimeout(timerRef.current); setActing(false); setTurn("lancer"); } }} style={{ ...S.btn("#556"), padding: "4px 12px", fontSize: 11, minHeight: 28 }}>{t("skip")}</button>}
    </div>
    <div ref={logRef} style={S.log}>{log.map((l, i) => <div key={i} style={{ color: l.color || "#78899a", margin: "2px 0", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{l.msg}</div>)}</div>
  </div>);
}

// ═══════════════════════════════════════
// Ending (★ hidden ending, meta bonus display)
// ═══════════════════════════════════════
function EndingPhase({ state, dispatch }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [vis, setVis] = useState(0);

  const getEnd = () => {
    if (state.lancer.hp <= 0 || state.archer.hp <= 0) return "defeat";
    const isBoss = state.battle?.enemy?.hp <= 0 && ["柱", "H", "Ω"].includes(state.battle.enemy.sym);
    // ★ Hidden ending: bond>=25, synergy>=40, boss clear
    if (isBoss && state.bond >= 25 && state.synergy >= 40) return "true_bond";
    if (isBoss && state.bond >= 20) return "boss_extreme";
    if (isBoss) return "boss_clear";
    if (state.bond >= 15) return "bond_high";
    if (state.bond >= 7) return "bond_mid";
    return "bond_low";
  };

  const key = getEnd();
  const ed = ENDINGS_DATA[key];
  const lines = ed.lines[L] || ed.lines.ja;
  const title = ed.title[L] || ed.title.ja;

  useEffect(() => {
    const ts = lines.map((_, i) => setTimeout(() => setVis(i + 1), 2000 + i * 2200));
    if (key !== "defeat") deleteSave();
    return () => ts.forEach(clearTimeout);
  }, []);

  // ★ Meta bonus text
  const metaText = key === "true_bond" ? "Synergy +10, Bond +5 (次回開始時)" :
    key === "boss_extreme" ? "Synergy +5 (次回開始時)" :
    key === "boss_clear" ? "Bond +3 (次回開始時)" : "";

  return (<div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}><Scanlines opacity={0.06} />
    <div style={{ textAlign: "center", maxWidth: 640 }}>
      <div style={{ marginBottom: 24, display: "flex", gap: 20, justifyContent: "center" }}><LancerSVG size={75} /><ArcherSVG size={70} /></div>
      <GlitchText text={title} intensity={0.4} fontSize={20} color={ed.color} />
      <div style={{ marginTop: 32 }}>
        {lines.slice(0, vis).map((line, i) => (<div key={i} style={{ color: i === vis - 1 ? "#fff" : "#bbc", fontSize: 15, lineHeight: 2.4, marginBottom: 8, animation: "fadeIn 2s" }}>{line}</div>))}
      </div>
      {vis >= lines.length && (<div style={{ marginTop: 36, animation: "fadeIn 2s" }}>
        <div style={{ color: "#78899a", fontSize: 12, marginBottom: 8 }}>
          B{state.floor}F | {t("bond")}:{state.bond} | {t("synergy")}:{state.synergy} | {t("kills")}:{state.kills} | [{DIFF[state.difficulty]?.label}]
        </div>
        {/* ★ Meta bonus display */}
        {metaText ? (
          <div style={{ ...S.panel, color: "#f1c40f", fontSize: 13, marginBottom: 16 }}>
            <div style={{ color: "#99aabb", fontSize: 11, marginBottom: 4 }}>{t("metaBonus")}</div>
            {metaText}
          </div>
        ) : (
          <div style={{ color: "#445", fontSize: 11, marginBottom: 16 }}>{t("metaNone")}</div>
        )}
        <button onClick={() => dispatch({ type: "RESET" })} style={{ ...S.btn("#99aabb"), padding: "14px 36px", letterSpacing: 2 }}>{t("restart")}</button>
      </div>)}
    </div></div>);
}

// ═══════════════════════════════════════
// App
// ═══════════════════════════════════════
export default function FateLostLog() {
  const [state, dispatch] = useReducer(reducer, INIT());
  const [sndOn, setSndOn] = useState(false);
  const sfx = useRef(new SFX());
  const [lang, setLang] = useState("ja");

  return (
    <LangCtx.Provider value={lang}><div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#060810}::-webkit-scrollbar-thumb{background:#334;border-radius:3px}::selection{background:#4fc3f7;color:#000}body{background:#060810}`}</style>
      <button onClick={() => setSndOn(sfx.current.toggle())} style={{ position: "fixed", top: 8, right: 8, zIndex: 10000, padding: "4px 10px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12, background: sndOn ? "#4fc3f7" : "#0e1420", color: sndOn ? "#000" : "#445", fontFamily: "monospace" }}>{sndOn ? "🔊" : "🔇"}</button>
      {state.phase !== "title" && <div style={{ position: "fixed", top: 8, left: 8, zIndex: 10001, display: "flex", gap: 4 }}>{[["ja", "🇯🇵"], ["kr", "🇰🇷"]].map(([c, f]) => (<button key={c} onClick={() => setLang(c)} style={{ padding: "4px 10px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 13, background: lang === c ? "#4fc3f7" : "#1a1a24", color: lang === c ? "#000" : "#667", fontFamily: "monospace" }}>{f}</button>))}</div>}
      {state.phase === "title" && <TitlePhase dispatch={dispatch} sfx={sfx} lang={lang} setLang={setLang} />}
      {state.phase === "terminal" && <TerminalPhase state={state} dispatch={dispatch} sfx={sfx} />}
      {state.phase === "explore" && <ExplorePhase state={state} dispatch={dispatch} sfx={sfx} />}
      {state.phase === "battle" && <BattlePhase state={state} dispatch={dispatch} sfx={sfx} />}
      {state.phase === "ending" && <EndingPhase state={state} dispatch={dispatch} />}
    </div></LangCtx.Provider>
  );
}
