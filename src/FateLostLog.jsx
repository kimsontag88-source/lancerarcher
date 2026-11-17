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
  howToPlay:      { ja:"遊び方", kr:"플레이 방법" },
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
  dirLabel:       { ja:"── 探索方向を選んでください ──", kr:"── 탐색 방향을 선택하세요 ──" },
  north:          { ja:"北の通路", kr:"북쪽 통로" },
  east:           { ja:"東の廊下", kr:"동쪽 복도" },
  west:           { ja:"西の部屋", kr:"서쪽 방" },
  south:          { ja:"南の階段", kr:"남쪽 계단" },
  descend:        { ja:"⬇ B{n}Fへ降下", kr:"⬇ B{n}F로 하강" },
  finalBoss:      { ja:"最下層 — 汚染核へ", kr:"최하층 — 오염핵으로" },
  save:           { ja:"保存", kr:"저장" },
  saving:         { ja:"保存中…", kr:"저장중..." },
  saveOk:         { ja:"セーブ完了！", kr:"저장 완료!" },
  saveFail:       { ja:"セーブ失敗", kr:"저장 실패" },
  saveNoBattle:   { ja:"戦闘中はセーブ不可", kr:"전투 중 세이브 불가" },
  loadOk:         { ja:"セーブデータをロードしました。", kr:"세이브 데이터를 불러왔습니다." },
  reachedFloor:   { ja:"B{n}Fに到達した。", kr:"B{n}F에 도달했다." },
  floor10arrive:  { ja:"最深部に到達した。空気が変わる。\n汚染核の鼓動が聞こえる。", kr:"최심부에 도달했다. 공기가 변한다.\n오염핵의 고동이 들린다." },
  rmTrap:         { ja:"罠！{who}に{d}ダメージ！", kr:"함정! {who}에게 {d} 데미지!" },
  rmRest:         { ja:"安全区域。HP/リソース回復！", kr:"안전 구역. HP/자원 회복!" },
  roomLabels:     { ja:["空の通路","敵遭遇","補給品発見","罠！","イベント","安全区域"], kr:["텅 빈 복도","적 조우","보급품 발견","함정!","이벤트","안전 구역"] },
  contBtn:        { ja:"続ける", kr:"계속" },
  contExplore:    { ja:"探索を続ける", kr:"계속 탐색" },
  lootFound:      { ja:"補給品発見！", kr:"보급품 발견!" },
  lancerTurn:     { ja:"クー・フーリンのターン", kr:"쿠 훌린의 턴" },
  archerTurn:     { ja:"エミヤのターン", kr:"에미야의 턴" },
  enemyTurn:      { ja:"敵のターン", kr:"적의 턴" },
  thrust:         { ja:"突き", kr:"찌르기" },
  thrustDesc:     { ja:"基本攻撃。コストなし。", kr:"기본 공격. 코스트 없음." },
  rune:           { ja:"ルーン", kr:"룬" },
  runeDesc:       { ja:"ルーン魔術。コスト15。威力1.8倍。", kr:"룬 마술. 코스트 15. 위력 1.8배." },
  bolg:           { ja:"ゲイ・ボルク", kr:"게이 볼크" },
  bolgDesc:       { ja:"必中の一撃。コスト35。威力3.5倍。", kr:"필중의 일격. 코스트 35. 위력 3.5배." },
  slash:          { ja:"干将莫耶", kr:"간장막야" },
  slashDesc:      { ja:"双剣攻撃。コストなし。", kr:"쌍검 공격. 코스트 없음." },
  project:        { ja:"投影", kr:"투영" },
  projectDesc:    { ja:"投影魔術。コスト15。威力2倍。", kr:"투영 마술. 코스트 15. 위력 2배." },
  ubw:            { ja:"UBW", kr:"UBW" },
  ubwDesc:        { ja:"無限の剣製。コスト30。威力3倍。", kr:"무한의 검제. 코스트 30. 위력 3배." },
  shield:         { ja:"アイアス", kr:"아이아스" },
  shieldDesc:     { ja:"防御。次ターン被ダメ60%減。", kr:"방어. 다음 턴 피해 60% 감소." },
  skip:           { ja:"SKIP", kr:"SKIP" },
  noRune:         { ja:"ルーン不足", kr:"룬 부족" },
  noProj:         { ja:"投影力不足", kr:"투영력 부족" },
  cuThrust:       { ja:"クー・フーリン — 突き！ {d}dmg", kr:"쿠 훌린 — 창 찌르기! {d}dmg" },
  cuRune:         { ja:"炎のルーン！ {d}dmg", kr:"불의 룬! {d}dmg" },
  cuBolg:         { ja:"ゲイ・ボルク!! {d}dmg", kr:"게이 볼크!! {d}dmg" },
  emSlash:        { ja:"干将·莫耶！ {d}dmg", kr:"간장·막야! {d}dmg" },
  emProj:         { ja:"カラドボルグII！ {d}dmg", kr:"칼라드볼그 II! {d}dmg" },
  emUbw:          { ja:"無限の剣製！ {d}dmg", kr:"무한의 검제! {d}dmg" },
  emShield:       { ja:"ロー・アイアス！", kr:"로 아이아스!" },
  combo:          { ja:"合同攻撃！ {d}dmg！", kr:"합동공격! {d}dmg!" },
  defeated:       { ja:"{n} 撃破！", kr:"{n} 격파!" },
  eDmgL:          { ja:"{n}→クー・フーリン {d}dmg", kr:"{n}→쿠 훌린 {d}dmg" },
  eDmgA:          { ja:"{n}→エミヤ {d}dmg", kr:"{n}→에미야 {d}dmg" },
  rescueL:        { ja:"エミヤ：「まだだ、猟犬。」HP 20 回復", kr:"에미야: \"아직이다, 수렵견.\" HP 20 회복" },
  rescueA:        { ja:"クー・フーリン：「死ぬのは許さん。」HP 20 回復", kr:"쿠 훌린: \"죽는 건 허락 안 한다.\" HP 20 회복" },
  cuName:         { ja:"クー・フーリン", kr:"쿠 훌린" },
  emName:         { ja:"エミヤ", kr:"에미야" },
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
  preBossBtn:     { ja:"最終決戦", kr:"최종 결전" },
  cookEvt:        { ja:"エミヤが即席の竈で料理を始めた。\n「…腹が減っては戦はできまい。食え、ランサー。」\nクー・フーリン：「ハッ！お前の料理だけは認めてやるぜ。」", kr:"에미야가 즉석 화덕에서 요리를 시작했다.\n\"...배가 고파서야 싸울 수 없지. 먹어라, 랜서.\"\n쿠 훌린: \"하! 네놈 요리만큼은 인정한다.\"" },
  metaBonus:      { ja:"次回プレイへの遺産", kr:"다음 회차 유산" },
  metaNone:       { ja:"(初回クリア — 遺産なし)", kr:"(첫 클리어 — 유산 없음)" },
  // Run History
  histTitle:      { ja:"探索記録", kr:"탐색 기록" },
  histEmpty:      { ja:"まだ記録がありません。", kr:"아직 기록이 없습니다." },
  histBtn:        { ja:"探索記録", kr:"탐색 기록" },
  histClose:      { ja:"閉じる", kr:"닫기" },
  histFloor:      { ja:"到達階", kr:"도달 층" },
  histResult:     { ja:"結末", kr:"결말" },
  // Tutorial
  tutTitle:       { ja:"遊び方ガイド", kr:"플레이 가이드" },
  tutGoal:        { ja:"目標", kr:"목표" },
  tutGoalDesc:    { ja:"二人の英霊を操り、地下10階の汚染核を破壊せよ。\n各階で5部屋以上探索すると次の階へ降りられます。", kr:"두 영령을 조작하여 지하 10층의 오염핵을 파괴하라.\n각 층에서 5개 이상의 방을 탐색하면 다음 층으로 내려갑니다." },
  tutBattle:      { ja:"戦闘", kr:"전투" },
  tutBattleDesc:  { ja:"ランサー→アーチャーの順で行動します。\n各キャラにコストなしの基本攻撃と、\nリソースを消費する強力なスキルがあります。\nアーチャーのアイアスは次ターンの被ダメを軽減します。", kr:"랜서→아처 순으로 행동합니다.\n각 캐릭터에게 코스트 없는 기본 공격과\n자원을 소비하는 강력한 스킬이 있습니다.\n아처의 아이아스는 다음 턴의 피해를 줄여줍니다." },
  tutBond:        { ja:"絆とシナジー", kr:"유대와 시너지" },
  tutBondDesc:    { ja:"イベントでの選択で絆が上がります。\n絆が高いと合同攻撃が発生し、\n仲間が倒れそうな時に救出してくれます。\nシナジーは全攻撃のダメージ倍率に影響します。", kr:"이벤트에서의 선택으로 유대가 오릅니다.\n유대가 높으면 합동 공격이 발생하고,\n동료가 쓰러지려 할 때 구출해줍니다.\n시너지는 전체 공격의 데미지 배율에 영향을 줍니다." },
  tutTip:         { ja:"ヒント", kr:"힌트" },
  tutTipDesc:     { ja:"安全区域ではHPとリソースが回復します。\n絆の深さで最終ボスの強さが変わります。\n高い絆 = 強い敵 + 良いエンディング！", kr:"안전 구역에서는 HP와 자원이 회복됩니다.\n유대의 깊이에 따라 최종 보스의 강도가 달라집니다.\n높은 유대 = 강한 적 + 좋은 엔딩!" },
  tutClose:       { ja:"閉じる", kr:"닫기" },
  // Floor objectives
  objTitle:       { ja:"── 探索目標 ──", kr:"── 탐색 목표 ──" },
  objExplore:     { ja:"5部屋以上探索する", kr:"5개 이상의 방 탐색" },
  objBond:        { ja:"絆を深める", kr:"유대 쌓기" },
  objLoot:        { ja:"補給品を確保する", kr:"보급품 확보" },
  objSurvive:     { ja:"両者のHPを保つ", kr:"둘 다 HP 유지" },
  // Status effects
  bleedWarn:      { ja:"出血！毎ターンHP減少中", kr:"출혈! 매 턴 HP 감소 중" },
  inspireWarn:    { ja:"鼓舞！攻撃力上昇中", kr:"고무! 공격력 상승 중" },
};

// ═══════════════════════════════════════
// NPC Personality Engine (simplified from v4.2)
// ═══════════════════════════════════════
const NPC_TRAITS = {
  cu: { formality: 0.15, warmth: 0.6, verbosity: 0.7, humor: 0.5, confidence: 0.95 },
  em: { formality: 0.55, warmth: 0.35, verbosity: 0.3, humor: 0.15, confidence: 0.7 },
};

const VOICE_LINES = {
  battle_start: {
    cu: {
      ja: ["ハッ！来たか！","お、やる気のある奴だな！","さっさと片付けるぞ！","面白え！掛かってこい！","退屈凌ぎにちょうどいいぜ！","ようやく暴れられるな！"],
      kr: ["하! 왔나!","오, 할 맛 나는 놈이군!","빨리 처리하자!","재밌겠군! 덤벼라!","심심풀이로 딱이다!","드디어 한판 할 수 있겠군!"],
    },
    em: {
      ja: ["…油断するな。","体は剣で出来ている。","構えろ、ランサー。","さっさと終わらせよう。","…分析完了。弱点は見えた。","この程度の相手なら。"],
      kr: ["...방심하지 마.","몸은 검으로 이루어져 있다.","구성해라, 랜서.","빨리 끝내자.","...분석 완료. 약점이 보인다.","이 정도 상대라면."],
    },
  },
  battle_win: {
    cu: {
      ja: ["楽勝だ！","まだまだ足りねぇな！","ハッ！いい運動になったぜ！","次の獲物はどこだ？","この程度か？"],
      kr: ["식은 죽 먹기지!","아직 부족하군!","하! 좋은 운동이 됐다!","다음 먹잇감은 어디냐?","이 정도냐?"],
    },
    em: {
      ja: ["終わったか。","…次へ行こう。","無駄な戦いだった。","ふん、予測通りだ。","…さて。"],
      kr: ["끝났나.","...다음으로 가자.","불필요한 싸움이었다.","흥, 예측대로다.","...그래."],
    },
  },
  take_damage: {
    cu: {
      ja: ["チッ！","痛ぇな！","くっ…やるじゃねぇか！","ぐっ…！その程度か？","なかなかやるな！"],
      kr: ["쳇!","아프잖아!","큿...꽤 하잖아!","윽...! 그 정도냐?","꽤 하는군!"],
    },
    em: {
      ja: ["くっ…！","…想定内だ。","この程度…","甘いな。","…まだだ。"],
      kr: ["큿...!","...예상 범위다.","이 정도는...","허술하군.","...아직이다."],
    },
  },
  low_hp: {
    cu: {
      ja: ["ちっ…思ったよりキツいな…","まだ…倒れるかよ…！","俺のBattle Continuationを舐めるなよ…！"],
      kr: ["쳇...생각보다 빡세군...","아직...쓰러질 줄 알았냐...!","내 전투 속행을 얕보지 마...!"],
    },
    em: {
      ja: ["…限界が近い。","理想を、まだ捨てるわけにはいかない…","体は剣で出来ている…ならまだ戦える。"],
      kr: ["...한계가 가깝다.","이상을, 아직 버릴 수는 없다...","몸은 검으로 이루어져 있다...그렇다면 아직 싸울 수 있다."],
    },
  },
  use_skill: {
    cu: {
      ja: ["喰らえ！","刺し穿つ！","ルーンの炎よ！","オラオラァ！"],
      kr: ["받아라!","꿰뚫어라!","룬의 불꽃이여!","오라오라!"],
    },
    em: {
      ja: ["投影、開始。","I am the bone of my sword.","この剣を以て──","壊れた幻想だ。"],
      kr: ["투영, 개시.","I am the bone of my sword.","이 검으로써──","부서진 환상이다."],
    },
  },
  explore_empty: {
    cu: {
      ja: ["何もねぇな。","つまんねぇ場所だ。","ハズレか。","…さっさと次行こうぜ。"],
      kr: ["아무것도 없군.","재미없는 곳이다.","꽝이냐.","...빨리 다음 가자."],
    },
    em: {
      ja: ["…何もないな。","次だ。","時間の無駄だった。","…進もう。"],
      kr: ["...아무것도 없다.","다음이다.","시간 낭비였다.","...가자."],
    },
  },
  explore_loot: {
    cu: {
      ja: ["おっ、何か見つけたぞ！","ラッキーだな！","よし、いいもんがある！"],
      kr: ["오, 뭔가 찾았다!","운이 좋군!","좋아, 괜찮은 게 있다!"],
    },
    em: {
      ja: ["…使えるものがある。","確保しておこう。","これは役に立つ。"],
      kr: ["...쓸 만한 게 있다.","확보해두자.","이건 도움이 될 것이다."],
    },
  },
  explore_trap: {
    cu: {
      ja: ["いってぇ！何だこの罠！","ぐあっ！くそ！","チッ…引っかかっちまった！"],
      kr: ["아야! 이게 뭔 함정이야!","으앗! 제길!","쳇...걸려버렸다!"],
    },
    em: {
      ja: ["っ…！不覚…。","…罠か。注意が足りなかった。","この程度で…くっ。"],
      kr: ["윽...! 실수...","...함정이라니. 주의가 부족했다.","이 정도로...큿."],
    },
  },
  high_bond: {
    cu: {
      ja: ["なぁ、アーチャー…悪くねぇコンビだよな、俺達。","背中預けるぜ。","お前とならどんな敵でも怖くねぇ。","…お前の紅茶、もう一杯貰えるか？","隣にいると…なんか落ち着くな。変な話だが。"],
      kr: ["이봐, 아처...나쁘지 않은 콤비 아니냐, 우리.","등 맡긴다.","네놈이라면 어떤 적이라도 무섭지 않다.","...네놈 홍차, 한 잔 더 줄 수 있나?","옆에 있으면...왠지 안심이 되는군. 이상한 얘기지만."],
    },
    em: {
      ja: ["…ランサー。お前の背中は、信頼に値する。","認めよう。いいコンビだ。","…頼りにしている。","…お前がいると、退屈しない。それだけだ。","…なぜか、お前の隣だと剣が軽い。"],
      kr: ["...랜서. 네놈의 등은 신뢰할 만하다.","인정하지. 좋은 콤비다.","...의지하고 있다.","...네놈이 있으면 지루하지 않다. 그뿐이다.","...이상하게, 네놈 옆이면 검이 가볍다."],
    },
  },
  // BL couple interactions — idle chatter during explore
  idle_banter: {
    cu: {
      ja: ["おい、アーチャー。ここ出たら飯奢れよ。","…お前、たまに笑えよ。その仏頂面、損してるぜ。","なぁ、お前の得意料理って何だ？…いや、全部美味いけどよ。","お前と背中合わせで戦ってると、体が勝手に動くんだよな。","おい、ちょっと休憩。…隣座っていいか？"],
      kr: ["야, 아처. 여기 나가면 밥 사라.","...네놈, 가끔은 웃어라. 그 무표정, 손해야.","이봐, 네놈 자신작 요리가 뭐냐? ...아니, 다 맛있긴 한데.","네놈과 등 맞대고 싸우면 몸이 저절로 움직여.","야, 잠깐 쉬자. ...옆에 앉아도 되냐?"],
    },
    em: {
      ja: ["…ランサー。少し静かにしてくれ。…いや、やっぱりいい。","お前の槍捌き、見ていて飽きないな。…何でもない。","…料理を作ってやるから、黙って食え。","あのバカ犬…いつも無茶をする。…心配してるわけじゃない。","…隣にいるな。…いや、離れるなという意味だ。"],
      kr: ["...랜서. 좀 조용히 해라. ...아니, 됐다.","네놈의 창술, 보고 있으면 질리지 않아. ...아무것도 아니다.","...요리를 해줄 테니 조용히 먹어라.","저 바보 개...항상 무리를 해. ...걱정하는 건 아니다.","...옆에 있어라. ...아니, 떨어지지 말라는 뜻이다."],
    },
  },
  // After-battle couple moments
  post_battle_bond: {
    cu: {
      ja: ["お前のおかげだ。…なんだよ、その顔。","なぁ、怪我してないか？見せろよ。","ハッ！やっぱ最高だな、お前と組むの！","…お前の剣、綺麗だったぜ。"],
      kr: ["네놈 덕이야. ...뭐야, 그 표정.","야, 다치진 않았어? 보여봐.","하! 역시 최고다, 네놈과 팀 짜는 건!","...네놈 검, 아름다웠다."],
    },
    em: {
      ja: ["…怪我はないか、ランサー。","お前の戦い方…悪くない。認めよう。","…ランサー、その傷…いつの間に。診せろ。","…良いコンビネーションだった。"],
      kr: ["...다치진 않았나, 랜서.","네놈의 싸움법...나쁘지 않다. 인정하지.","...랜서, 그 상처...언제. 보여라.","...좋은 콤비네이션이었다."],
    },
  },
};

// Run history comments — characters react to past run results
const HISTORY_COMMENTS = {
  true_bond: {
    cu: { ja: "…ハッ、俺達最強だろ？", kr: "...하, 우리 최강 아니냐?" },
    em: { ja: "…奇跡ではない。必然だ。", kr: "...기적이 아니다. 필연이다." },
  },
  boss_extreme: {
    cu: { ja: "あの時の同時NP、痺れたな！", kr: "그때 동시 보구, 짜릿했지!" },
    em: { ja: "…お前の背中を信じた結果だ。", kr: "...네놈의 등을 믿은 결과다." },
  },
  boss_clear: {
    cu: { ja: "ま、悪くない結果だろ。", kr: "뭐, 나쁘지 않은 결과지." },
    em: { ja: "…次はもっと上手くやれる。", kr: "...다음엔 더 잘할 수 있다." },
  },
  bond_high: {
    cu: { ja: "惜しかったな…もう少しだった。", kr: "아쉬웠다...조금만 더였는데." },
    em: { ja: "…悪くない戦いだった。", kr: "...나쁘지 않은 싸움이었다." },
  },
  bond_mid: {
    cu: { ja: "チッ、次こそは…！", kr: "쳇, 다음엔...!" },
    em: { ja: "反省点が多い。", kr: "반성할 점이 많다." },
  },
  bond_low: {
    cu: { ja: "…もっと話せばよかったな。", kr: "...더 얘기할 걸 그랬다." },
    em: { ja: "…信頼が、足りなかった。", kr: "...신뢰가 부족했다." },
  },
  defeat: {
    cu: { ja: "くそ…次は負けねぇ…！", kr: "제길...다음엔 안 진다...!" },
    em: { ja: "…この悔しさを、忘れるな。", kr: "...이 분함을 잊지 마." },
  },
};

function getVoiceLine(situation, who, lang, bond) {
  const pool = VOICE_LINES[situation]?.[who]?.[lang];
  if (!pool || pool.length === 0) return null;
  // Bond-gated high_bond lines
  if (situation === "high_bond" && bond < 10) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════
// Effects
// ═══════════════════════════════════════
function GlitchText({ text, intensity = 1, fontSize = 48, color = "#fff" }) {
  const id = useRef(`g${Math.random().toString(36).slice(2, 7)}`).current;
  return (<div style={{ position: "relative", display: "inline-block" }}>
    <style>{`.${id}{position:relative;font-size:${typeof fontSize === "number" ? fontSize + "px" : fontSize};white-space:nowrap;font-weight:900;font-family:'Georgia','Times New Roman',serif;color:${color};letter-spacing:3px}.${id}::before,.${id}::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden}.${id}::before{color:${GOLD};animation:${id}b ${2/intensity}s infinite linear alternate-reverse;clip-path:polygon(0 0,100% 0,100% 35%,0 35%)}.${id}::after{color:${CRIM};animation:${id}a ${3/intensity}s infinite linear alternate-reverse;clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%)}@keyframes ${id}b{0%,100%{transform:translate(0)}50%{transform:translate(${-2*intensity}px,${intensity*0.5}px)}}@keyframes ${id}a{0%,100%{transform:translate(0)}50%{transform:translate(${intensity}px,${-intensity}px)}}`}</style>
    <div className={id} data-text={text}>{text}</div></div>);
}
function Scanlines({ opacity = 0.04 }) { return <div style={{ position: "fixed", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,${opacity}) 2px,rgba(0,0,0,${opacity}) 4px)`, pointerEvents: "none", zIndex: 9999 }} />; }
function Corrupt({ text, level = 0.15 }) { const g = "█▓▒░"; const [d, setD] = useState(text); useEffect(() => { const i = setInterval(() => setD(text.split("").map(c => c === " " ? c : Math.random() < level ? g[Math.floor(Math.random() * g.length)] : c).join("")), 200); return () => clearInterval(i); }, [text, level]); return <span>{d}</span>; }
function Decode({ text, duration = 2000 }) { const [d, setD] = useState(""); useEffect(() => { let f = 0; const tot = duration / 30; const iv = setInterval(() => { f++; const p = f / tot; setD(text.split("").map((c, j) => { const cp = p - (j / text.length) * 0.5; return cp > 0.8 ? c : cp > 0.5 ? "▒▓░█"[Math.floor(Math.random() * 4)] : Math.random() > 0.5 ? "0" : "1"; }).join("")); if (f >= tot) clearInterval(iv); }, 30); return () => clearInterval(iv); }, [text, duration]); return <span style={{ fontFamily: "monospace" }}>{d}</span>; }

// Sound
class SFX { constructor(){this.ctx=null;this.on=false;this.mg=null;} init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.mg=this.ctx.createGain();this.mg.gain.value=0.2;this.mg.connect(this.ctx.destination);} toggle(){this.on=!this.on;if(this.on)this.init();return this.on;} _osc(f,t,d,v=0.06){if(!this.on||!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+d);o.connect(g);g.connect(this.mg);o.start();o.stop(this.ctx.currentTime+d);} beep(){this._osc(440,"square",0.08);} hit(){this._osc(200,"triangle",0.1,0.08);} clash(){this._osc(120,"sawtooth",0.2,0.12);setTimeout(()=>this._osc(80,"square",0.12,0.08),80);} heal(){this._osc(523,"sine",0.3,0.05);setTimeout(()=>this._osc(659,"sine",0.2,0.04),150);} glitch(){if(!this.on||!this.ctx)return;const b=this.ctx.createBuffer(1,this.ctx.sampleRate*0.06,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=b;g.gain.value=0.1;s.connect(g);g.connect(this.mg);s.start();} }

// SVGs — refined character silhouettes
const LancerSVGFallback = ({ size = 80 }) => (<svg width={size} height={size} viewBox="0 0 100 100">
  <defs><linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4fa8d6" stopOpacity="0.95"/><stop offset="100%" stopColor="#1a3a5c" stopOpacity="0.8"/></linearGradient>
  <filter id="lglow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <ellipse cx="50" cy="26" rx="10" ry="11" fill="url(#lg2)" filter="url(#lglow)"/>
  <path d="M38,36 Q33,52 35,78 L42,78 L45,52 L55,52 L58,78 L65,78 Q67,52 62,36 Z" fill="url(#lg2)"/>
  <line x1="72" y1="8" x2="60" y2="78" stroke="#d4a574" strokeWidth="2.5"/>
  <polygon points="72,8 75,16 69,16" fill="#d4a574"/></svg>);
const ArcherSVGFallback = ({ size = 80 }) => (<svg width={size} height={size} viewBox="0 0 100 100">
  <defs><linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d35050" stopOpacity="0.95"/><stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.8"/></linearGradient>
  <filter id="aglow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <ellipse cx="50" cy="26" rx="10" ry="11" fill="url(#ag2)" filter="url(#aglow)"/>
  <path d="M38,36 Q33,52 35,78 L42,78 L45,52 L55,52 L58,78 L65,78 Q67,52 62,36 Z" fill="url(#ag2)"/>
  <line x1="28" y1="32" x2="20" y2="60" stroke="#b8c4d0" strokeWidth="2"/>
  <line x1="72" y1="32" x2="80" y2="60" stroke="#b8c4d0" strokeWidth="2"/></svg>);

// SD 도트 스프라이트 (public/img). 이미지가 없거나 로드에 실패하면 fallback을 그린다.
function Sprite({ src, size, fallback }) {
  const [err, setErr] = useState(false);
  if (err) return fallback;
  return <img src={src} width={size} height={size} alt="" onError={() => setErr(true)} style={{ imageRendering: "pixelated", objectFit: "contain" }} />;
}
const LancerSVG = ({ size = 80 }) => <Sprite src="/img/lancer.png" size={size} fallback={<LancerSVGFallback size={size} />} />;
const ArcherSVG = ({ size = 80 }) => <Sprite src="/img/archer.png" size={size} fallback={<ArcherSVGFallback size={size} />} />;

// ═══════════════════════════════════════
// Design System — Fate VN Aesthetic
// ═══════════════════════════════════════
const GOLD = "#d4a574";
const CRIM = "#c43e3e";
const NAVY = "#0a0f1e";
const PANEL_BG = "#0e1324";
const PANEL_BORDER = "#2a3050";
const ACCENT = "#e8c47c";
const TEXT_PRIMARY = "#e8e4dc";
const TEXT_SECONDARY = "#8a92a8";
const CU_COLOR = "#4fa8d6";
const EM_COLOR = "#d35050";

const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

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
  [{ name:{ja:"シャドウサーヴァント",kr:"그림자 서번트"},hp:50,atk:8,sym:"S",color:"#9b59b6",img:"enemy_shadow" },{name:{ja:"魔獣",kr:"마수"},hp:40,atk:10,sym:"K",color:"#e67e22",img:"enemy_beast" }],
  [{ name:{ja:"アサシンクラス",kr:"어새신 클래스"},hp:55,atk:14,sym:"A",color:"#2ecc71",img:"enemy_assassin" },{name:{ja:"呪われた騎士",kr:"저주받은 기사"},hp:70,atk:12,sym:"N",color:"#95a5a6",img:"enemy_knight" }],
  [{ name:{ja:"デーモン",kr:"데몬"},hp:90,atk:16,sym:"D",color:"#c0392b",img:"enemy_demon" },{name:{ja:"キメラ",kr:"키메라"},hp:80,atk:18,sym:"K2",color:"#e67e22",img:"enemy_chimera" }],
  [{ name:{ja:"魔神柱残骸",kr:"마신주 잔해"},hp:120,atk:20,sym:"柱",color:"#1abc9c",img:"enemy_pillar" },{name:{ja:"変異サーヴァント",kr:"변이 서번트"},hp:100,atk:22,sym:"Σ",color:"#9b59b6",img:"enemy_mutant" }],
];

const BOSSES = [
  { name:{ja:"魔神柱 — フォルネウス",kr:"마신주 — 포르네우스"},hp:180,atk:22,sym:"柱",color:"#1abc9c",img:"boss_forneus",boss:true },
  { name:{ja:"影のヘラクレス",kr:"그림자 헤라클레스"},hp:250,atk:26,sym:"H",color:"#e74c3c",img:"boss_heracles",boss:true },
  { name:{ja:"聖杯の汚染体 — アンリマユ",kr:"성배의 오염체 — 앙그라 마이뉴"},hp:320,atk:30,sym:"Ω",color:"#ff0040",img:"boss_angra",boss:true },
];

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
  bond_high:{title:{ja:"共闘エンド — 蒼い槍と紅い外套",kr:"공투 엔딩 — 푸른 창과 붉은 외투"},color:CU_COLOR,lines:{ja:["空間が崩れ始めた。","「…背中を預けてくれたこと、感謝する。」","「ハッ！次もお前の背中は俺が守る。」"],kr:["공간이 부서지기 시작했다.","\"...등 뒤를 맡겨줘서 고맙다.\"","\"하! 다음에도 네놈 등 뒤는 내가 지킨다.\""]}},
  bond_mid:{title:{ja:"黙認エンド — 戦士の礼",kr:"묵인 엔딩 — 전사의 예의"},color:"#f1c40f",lines:{ja:["「…なかなかやるな。」","「次の戦場で会おう。」"],kr:["\"...꽤 하더군.\"","\"다음 전장에서 보자.\""]}},
  bond_low:{title:{ja:"孤独エンド — 各自の道",kr:"고독 엔딩 — 각자의 길"},color:"#888",lines:{ja:["結局、互いを信頼できなかった。"],kr:["결국 신뢰하지 못했다."]}},
  defeat:{title:{ja:"敗北エンド — データ消失",kr:"패배 엔딩 — 데이터 소실"},color:"#556",lines:{ja:["霊基が限界に達した。","聖杯の汚染が全てを飲み込んだ。"],kr:["영기가 한계에 달했다.","성배의 오염이 모든 것을 삼켰다."]}},
};

// ═══════════════════════════════════════
// Storage
// ═══════════════════════════════════════
const SAVE_KEY = "fate_lost_log_save";
const LANG_KEY = "fate_lost_log_lang";
const storage = {
  async set(k, v) { try { await window.storage.set(k, v); } catch { try { localStorage.setItem(k, v); } catch {} } },
  async get(k) { try { const r = await window.storage.get(k); return r?.value || null; } catch { try { return localStorage.getItem(k); } catch { return null; } } },
  async del(k) { try { await window.storage.delete(k); } catch { try { localStorage.removeItem(k); } catch {} } },
};
async function saveGame(s) { try { await storage.set(SAVE_KEY, JSON.stringify({ floor:s.floor, roomsExplored:s.roomsExplored, bond:s.bond, synergy:s.synergy, kills:s.kills, lancer:s.lancer, archer:s.archer, flags:s.flags, diff:s.difficulty, status:s.status, floorRooms:s.floorRooms, ts:Date.now() })); return true; } catch { return false; } }
async function loadGame() { try { const r = await storage.get(SAVE_KEY); if (!r) return null; const parsed = JSON.parse(r); if (!parsed.status) parsed.status = { bleedL:0, bleedA:0, inspireL:0, inspireA:0 }; return parsed; } catch { return null; } }
async function deleteSave() { await storage.del(SAVE_KEY); }

// Run history
const HISTORY_KEY = "fate_lost_log_history";
async function loadHistory() { try { const r = await storage.get(HISTORY_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
async function saveHistory(entry) {
  try {
    const hist = await loadHistory();
    hist.unshift(entry);
    if (hist.length > 20) hist.length = 20;
    await storage.set(HISTORY_KEY, JSON.stringify(hist));
  } catch {}
}

// ═══════════════════════════════════════
// State
// ═══════════════════════════════════════
const INIT = () => ({ phase: "title", floor: 1, roomsExplored: 0, bond: 0, synergy: 0, kills: 0, difficulty: "normal", lancer: { hp: 120, maxHp: 120, atk: 18, rune: 50, maxRune: 50 }, archer: { hp: 100, maxHp: 100, atk: 15, projection: 40, maxProjection: 40 }, battle: null, log: [], flags: {}, terminal: [], floorRooms: 0, status: { bleedL: 0, bleedA: 0, inspireL: 0, inspireA: 0 } });

function reducer(s, a) {
  switch (a.type) {
    case "SET": return { ...s, ...a.value };
    case "PHASE": return { ...s, phase: a.value };
    case "LOG": return { ...s, log: [...s.log.slice(-80), { msg: a.msg, color: a.color }] };
    case "TERM": return { ...s, terminal: [...s.terminal, a.value] };
    case "FLAG": return { ...s, flags: { ...s.flags, [a.value]: true } };
    case "UPDATE_LANCER": return { ...s, lancer: { ...s.lancer, ...a.value } };
    case "UPDATE_ARCHER": return { ...s, archer: { ...s.archer, ...a.value } };
    case "STATUS": return { ...s, status: { ...s.status, ...a.value } };
    case "RESET": return INIT();
    default: return s;
  }
}

// ═══════════════════════════════════════
// Styles — Fate VN Aesthetic
// ═══════════════════════════════════════
const S = {
  app: { background: `linear-gradient(180deg, ${NAVY} 0%, #0d1228 50%, #10152e 100%)`, color: TEXT_PRIMARY, fontFamily: "'Georgia','Hiragino Mincho ProN','Yu Mincho','serif'", minHeight: "100vh", fontSize: 15, lineHeight: 1.8 },
  panel: { border: `1px solid ${PANEL_BORDER}`, borderRadius: 8, padding: 16, marginBottom: 12, background: `linear-gradient(135deg, ${PANEL_BG} 0%, #111830 100%)`, boxShadow: `0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,165,116,0.05)` },
  panelGold: { border: `1px solid ${GOLD}40`, borderRadius: 8, padding: 16, marginBottom: 12, background: `linear-gradient(135deg, #13182e 0%, #1a1f38 100%)`, boxShadow: `0 2px 16px rgba(212,165,116,0.08), inset 0 1px 0 rgba(212,165,116,0.1)` },
  btn: (c = CU_COLOR, dis = false) => ({
    background: dis ? "#0e1324" : `linear-gradient(180deg, #161d35 0%, #0e1324 100%)`,
    color: dis ? "#3a4060" : c,
    border: `1px solid ${dis ? "#1a2040" : c}50`,
    padding: "12px 20px",
    cursor: dis ? "not-allowed" : "pointer",
    fontFamily: "'Georgia','Hiragino Mincho ProN',serif",
    fontSize: 14,
    borderRadius: 6,
    margin: 4,
    transition: "all 0.25s ease",
    opacity: dis ? 0.4 : 1,
    minHeight: 48,
    pointerEvents: dis ? "none" : "auto",
    letterSpacing: 1,
    textAlign: "center",
    boxShadow: dis ? "none" : `0 2px 8px ${c}15`,
  }),
  btnPrimary: (c = GOLD, dis = false) => ({
    background: dis ? "#0e1324" : `linear-gradient(180deg, ${c}20 0%, ${c}08 100%)`,
    color: dis ? "#3a4060" : c,
    border: `1px solid ${dis ? "#1a2040" : c}60`,
    padding: "14px 28px",
    cursor: dis ? "not-allowed" : "pointer",
    fontFamily: "'Georgia','Hiragino Mincho ProN',serif",
    fontSize: 16, fontWeight: "bold",
    borderRadius: 8,
    margin: 4,
    transition: "all 0.3s ease",
    opacity: dis ? 0.4 : 1,
    minHeight: 52,
    pointerEvents: dis ? "none" : "auto",
    letterSpacing: 2,
    textAlign: "center",
    boxShadow: dis ? "none" : `0 4px 20px ${c}20`,
  }),
  log: { maxHeight: 180, overflowY: "auto", padding: 12, background: "#080c18", border: `1px solid ${PANEL_BORDER}`, borderRadius: 6, fontSize: 13, marginTop: 10, lineHeight: 1.7 },
  hpBg: { width: "100%", height: 10, background: "#1a1e30", borderRadius: 5, marginTop: 4, overflow: "hidden" },
  hpBar: (p, c) => ({ width: `${p}%`, height: 10, background: `linear-gradient(90deg, ${c}, ${c}cc)`, borderRadius: 5, transition: "width 0.4s ease", boxShadow: `0 0 8px ${c}40` }),
  resourceBar: (p, c) => ({ width: `${p}%`, height: 6, background: `linear-gradient(90deg, ${c}cc, ${c}80)`, borderRadius: 3, transition: "width 0.4s ease" }),
  divider: { width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}30, transparent)`, margin: "12px 0" },
};

function Divider() { return <div style={S.divider} />; }

function LogPanel({ log }) { const ref = useRef(null); useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [log]); return <div ref={ref} style={S.log}>{log.map((l, i) => <div key={i} style={{ color: l.color || TEXT_SECONDARY, margin: "3px 0", lineHeight: 1.7 }}>{l.msg}</div>)}</div>; }

// ═══════════════════════════════════════
// Status Bar — elegant resource display
// ═══════════════════════════════════════
function StatusBar({ s }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const lH = Math.max(0, (s.lancer.hp / s.lancer.maxHp) * 100);
  const aH = Math.max(0, (s.archer.hp / s.archer.maxHp) * 100);
  const lR = Math.max(0, (s.lancer.rune / s.lancer.maxRune) * 100);
  const aP = Math.max(0, (s.archer.projection / s.archer.maxProjection) * 100);
  const st = s.status || {};
  return (
    <div style={{ ...S.panel, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
      <div style={{ flex: 1, minWidth: 150 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: CU_COLOR, fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{t("cuName")}</span>
          <span style={{ color: TEXT_SECONDARY, fontSize: 11, fontFamily: "monospace" }}>ATK {s.lancer.atk}</span>
          {st.bleedL > 0 && <span style={{ color: "#ff4444", fontSize: 10 }}>出血</span>}
          {st.inspireL > 0 && <span style={{ color: GOLD, fontSize: 10 }}>鼓舞</span>}
        </div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 2 }}>HP {s.lancer.hp}/{s.lancer.maxHp}</div>
        <div style={S.hpBg}><div style={S.hpBar(lH, lH > 50 ? CU_COLOR : lH > 25 ? "#e67e22" : "#e74c3c")} /></div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 2 }}>Rune {s.lancer.rune}/{s.lancer.maxRune}</div>
        <div style={{ ...S.hpBg, height: 6 }}><div style={S.resourceBar(lR, "#6bc5f0")} /></div>
      </div>
      <div style={{ flex: 1, minWidth: 150 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: EM_COLOR, fontWeight: "bold", fontSize: 14, letterSpacing: 1 }}>{t("emName")}</span>
          <span style={{ color: TEXT_SECONDARY, fontSize: 11, fontFamily: "monospace" }}>ATK {s.archer.atk}</span>
          {st.bleedA > 0 && <span style={{ color: "#ff4444", fontSize: 10 }}>出血</span>}
          {st.inspireA > 0 && <span style={{ color: GOLD, fontSize: 10 }}>鼓舞</span>}
        </div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginBottom: 2 }}>HP {s.archer.hp}/{s.archer.maxHp}</div>
        <div style={S.hpBg}><div style={S.hpBar(aH, aH > 50 ? EM_COLOR : aH > 25 ? "#e67e22" : "#e74c3c")} /></div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 2 }}>Projection {s.archer.projection}/{s.archer.maxProjection}</div>
        <div style={{ ...S.hpBg, height: 6 }}><div style={S.resourceBar(aP, "#e07070")} /></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, fontSize: 13, minWidth: 100 }}>
        <span style={{ color: GOLD }}>{t("bond")} : {s.bond}</span>
        <span style={{ color: ACCENT }}>{t("synergy")} : {s.synergy}</span>
        <span style={{ color: TEXT_SECONDARY }}>{t("kills")} : {s.kills}</span>
        <span style={{ color: TEXT_SECONDARY, fontSize: 11, fontFamily: "monospace" }}>B{s.floor}F [{DIFF[s.difficulty]?.label}]</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Floor Objectives (zpandemic-style)
// ═══════════════════════════════════════
function FloorObjectives({ s }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const objs = [
    { text: t("objExplore"), done: s.floorRooms >= 5 },
    { text: t("objBond"), done: s.bond >= Math.max(1, s.floor * 2) },
    { text: t("objSurvive"), done: s.lancer.hp > s.lancer.maxHp * 0.3 && s.archer.hp > s.archer.maxHp * 0.3 },
  ];
  return (
    <div style={{ ...S.panel, padding: 10 }}>
      <div style={{ color: GOLD, fontSize: 12, marginBottom: 6, letterSpacing: 2, textAlign: "center" }}>{t("objTitle")}</div>
      {objs.map((o, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: o.done ? "#4ade80" : TEXT_SECONDARY, marginBottom: 2 }}>
          <span style={{ fontFamily: "monospace" }}>{o.done ? "✓" : "○"}</span>
          <span style={{ textDecoration: o.done ? "line-through" : "none", opacity: o.done ? 0.6 : 1 }}>{o.text}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Run History Overlay
// ═══════════════════════════════════════
function RunHistoryOverlay({ onClose, lang }) {
  const L = lang, t = k => TX[k]?.[L] || "";
  const [runs, setRuns] = useState([]);
  useEffect(() => { loadHistory().then(setRuns); }, []);
  const endLabels = { true_bond: { ja: "真・絆", kr: "진·유대" }, boss_extreme: { ja: "極限共闘", kr: "극한 공투" }, boss_clear: { ja: "真エンド", kr: "진 엔딩" }, bond_high: { ja: "共闘", kr: "공투" }, bond_mid: { ja: "黙認", kr: "묵인" }, bond_low: { ja: "孤独", kr: "고독" }, defeat: { ja: "敗北", kr: "패배" } };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 20000, background: "rgba(6,8,16,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ color: GOLD, fontSize: 20, fontWeight: "bold", letterSpacing: 3, fontFamily: "'Georgia',serif" }}>{t("histTitle")}</div>
          <Divider />
        </div>
        {runs.length === 0 && <div style={{ textAlign: "center", color: TEXT_SECONDARY, fontSize: 14 }}>{t("histEmpty")}</div>}
        {runs.map((r, i) => {
          const endKey = r.ending || "defeat";
          const comment = HISTORY_COMMENTS[endKey];
          const cuC = comment?.cu?.[L] || "";
          const emC = comment?.em?.[L] || "";
          return (
            <div key={i} style={{ ...S.panel, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: GOLD, fontSize: 13, fontWeight: "bold" }}>#{runs.length - i}</span>
                <span style={{ color: TEXT_SECONDARY, fontSize: 11, fontFamily: "monospace" }}>{r.date || "---"}</span>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: TEXT_SECONDARY, marginBottom: 8 }}>
                <span>{t("histFloor")}: B{r.floor}F</span>
                <span>{t("bond")}: {r.bond}</span>
                <span>{t("synergy")}: {r.synergy}</span>
                <span>{t("kills")}: {r.kills}</span>
                <span style={{ color: ENDINGS_DATA[endKey]?.color || TEXT_SECONDARY }}>{t("histResult")}: {endLabels[endKey]?.[L] || endKey}</span>
              </div>
              {cuC && <div style={{ fontSize: 12, color: CU_COLOR, marginBottom: 2, fontStyle: "italic" }}>Cu: 「{cuC}」</div>}
              {emC && <div style={{ fontSize: 12, color: EM_COLOR, fontStyle: "italic" }}>Em: 「{emC}」</div>}
            </div>
          );
        })}
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={onClose} style={S.btnPrimary(GOLD)}>{t("histClose")}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Tutorial Overlay
// ═══════════════════════════════════════
function TutorialOverlay({ onClose, lang }) {
  const L = lang, t = k => TX[k]?.[L] || "";
  const sections = [
    { title: t("tutGoal"), body: t("tutGoalDesc") },
    { title: t("tutBattle"), body: t("tutBattleDesc") },
    { title: t("tutBond"), body: t("tutBondDesc") },
    { title: t("tutTip"), body: t("tutTipDesc") },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 20000, background: "rgba(6,8,16,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ color: GOLD, fontSize: 22, fontWeight: "bold", letterSpacing: 3, fontFamily: "'Georgia',serif" }}>{t("tutTitle")}</div>
          <div style={S.divider} />
        </div>
        {sections.map((sec, i) => (
          <div key={i} style={{ ...S.panelGold, marginBottom: 14 }}>
            <div style={{ color: GOLD, fontSize: 15, fontWeight: "bold", marginBottom: 8, letterSpacing: 1 }}>{sec.title}</div>
            <div style={{ color: TEXT_PRIMARY, fontSize: 14, lineHeight: 2, whiteSpace: "pre-wrap" }}>{sec.body}</div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onClose} style={S.btnPrimary(GOLD)}>{t("tutClose")}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Title
// ═══════════════════════════════════════
function TitlePhase({ dispatch, sfx, lang, setLang }) {
  const L = lang, t = k => TX[k]?.[L] || "";
  const [show, setShow] = useState(false);
  const [si, setSi] = useState(null);
  const [ld, setLd] = useState(true);
  const [diff, setDiff] = useState("normal");
  const [tut, setTut] = useState(false);
  const [hist, setHist] = useState(false);

  useEffect(() => { const tm = setTimeout(() => setShow(true), 500); (async () => { setSi(await loadGame()); setLd(false); })(); return () => clearTimeout(tm); }, []);

  return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Scanlines opacity={0.03} />
      {tut && <TutorialOverlay onClose={() => setTut(false)} lang={L} />}
      {hist && <RunHistoryOverlay onClose={() => setHist(false)} lang={L} />}
      <div style={{ position: "fixed", top: 10, left: 10, zIndex: 10001, display: "flex", gap: 4 }}>
        {[["ja", "日本語"], ["kr", "한국어"]].map(([c, f]) => (<button key={c} onClick={() => setLang(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${L === c ? GOLD + "60" : "#1a2040"}`, cursor: "pointer", fontSize: 12, background: L === c ? GOLD + "15" : "transparent", color: L === c ? GOLD : "#556", fontFamily: "'Georgia',serif", letterSpacing: 1 }}>{f}</button>))}
      </div>
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 2.5s ease", textAlign: "center", maxWidth: 600, padding: 20 }}>
        <div style={{ marginBottom: 24, display: "flex", gap: 28, justifyContent: "center", alignItems: "flex-end" }}>
          <LancerSVG size={95} /><ArcherSVG size={90} />
        </div>
        <GlitchText text="FATE // LOST_LOG" intensity={0.3} fontSize="min(36px, 7.6vw)" color={GOLD} />
        <div style={{ fontSize: 15, color: TEXT_SECONDARY, marginTop: 14, letterSpacing: 4, fontStyle: "italic" }}>
          <Corrupt text={t("subtitle")} level={0.06} />
        </div>
        <div style={{ fontSize: 13, color: "#556677", marginTop: 8, marginBottom: 28, letterSpacing: 2 }}>{t("tagline")}</div>

        {/* Difficulty selector */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: TEXT_SECONDARY, fontSize: 13, marginBottom: 10, letterSpacing: 2 }}>{t("diffLabel")}</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {(["easy", "normal", "hard"]).map(d => (
              <button key={d} onClick={() => setDiff(d)} style={{
                padding: "8px 22px", borderRadius: 6,
                border: `1px solid ${diff === d ? GOLD + "80" : PANEL_BORDER}`,
                background: diff === d ? GOLD + "12" : "transparent",
                color: diff === d ? GOLD : TEXT_SECONDARY,
                cursor: "pointer", fontFamily: "'Georgia',serif", fontSize: 14, minHeight: 40, letterSpacing: 2,
                transition: "all 0.25s ease",
              }}>{t(d)}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <button onClick={() => { sfx.current?.beep(); dispatch({ type: "SET", value: { difficulty: diff } }); dispatch({ type: "PHASE", value: "terminal" }); }} style={S.btnPrimary(GOLD)}>
            {t("newGame")}
          </button>
          {!ld && si && <button onClick={async () => { sfx.current?.beep(); dispatch({ type: "SET", value: { floor: si.floor, roomsExplored: si.roomsExplored, bond: si.bond, synergy: si.synergy, kills: si.kills, lancer: si.lancer, archer: si.archer, flags: si.flags || {}, floorRooms: si.floorRooms || 0, difficulty: si.diff || "normal", status: si.status || { bleedL:0,bleedA:0,inspireL:0,inspireA:0 } } }); dispatch({ type: "LOG", msg: t("loadOk"), color: "#4ade80" }); dispatch({ type: "PHASE", value: "explore" }); }} style={S.btnPrimary("#4ade80")}>
            {t("cont")} (B{si.floor}F{si.ts ? ` · ${new Date(si.ts).toLocaleDateString()}` : ""})
          </button>}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => setTut(true)} style={{ ...S.btn(TEXT_SECONDARY), fontSize: 13, padding: "8px 20px" }}>
            {t("howToPlay")}
          </button>
          <button onClick={() => setHist(true)} style={{ ...S.btn(TEXT_SECONDARY), fontSize: 13, padding: "8px 20px" }}>
            {t("histBtn")}
          </button>
        </div>
        <div style={{ marginTop: 40, fontSize: 11, color: "#3a4060", letterSpacing: 1 }}>{t("disclaimer")}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Terminal — auto-skip option for casual players
// ═══════════════════════════════════════
function TerminalPhase({ state, dispatch, sfx }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [input, setInput] = useState(""); const [ready, setReady] = useState(false); const logRef = useRef(null);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    const ts = [
      setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys1") } }), 500),
      setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys2") } }), 2000),
      setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys3") } }), 3500),
      setTimeout(() => dispatch({ type: "TERM", value: { ty: "sys", m: t("sys4") } }), 5000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [state.terminal]);

  // Auto-skip: after sys4 appears, auto-type "trace on"
  useEffect(() => {
    if (autoMode && state.terminal.length >= 4 && !ready) {
      const tm = setTimeout(() => {
        dispatch({ type: "TERM", value: { ty: "in", m: "> trace on" } });
        dispatch({ type: "TERM", value: { ty: "cu", m: t("cuTrace") } });
        sfx.current?.clash();
        setTimeout(() => {
          dispatch({ type: "TERM", value: { ty: "em", m: t("emTrace") } });
          setReady(true);
        }, 1500);
      }, 1000);
      return () => clearTimeout(tm);
    }
  }, [autoMode, state.terminal.length, ready]);

  const exec = () => { if (!input.trim()) return; const c = input.trim().toLowerCase(); dispatch({ type: "TERM", value: { ty: "in", m: `> ${input.trim()}` } }); setInput(""); if (c.includes("trace") && c.includes("on")) { dispatch({ type: "TERM", value: { ty: "cu", m: t("cuTrace") } }); sfx.current?.clash(); setTimeout(() => { dispatch({ type: "TERM", value: { ty: "em", m: t("emTrace") } }); setReady(true); }, 1500); } else { dispatch({ type: "TERM", value: { ty: "e", m: `Unknown: ${input.trim()}` } }); sfx.current?.beep(); } };

  return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column" }}>
      <Scanlines opacity={0.03} />
      <div style={{ background: PANEL_BG, borderBottom: `1px solid ${PANEL_BORDER}`, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: GOLD, fontSize: 14, letterSpacing: 2, fontFamily: "'Georgia',serif" }}>FATE_LOST_LOG — Terminal</span>
        {!ready && !autoMode && <button onClick={() => setAutoMode(true)} style={{ ...S.btn(TEXT_SECONDARY), padding: "4px 12px", fontSize: 11, minHeight: 28 }}>AUTO</button>}
      </div>
      <div ref={logRef} style={{ flex: 1, overflow: "auto", padding: 16, maxHeight: "calc(100vh - 130px)" }}>
        {state.terminal.map((e, i) => (
          <div key={i} style={{ color: e.ty === "in" ? CU_COLOR : e.ty === "e" ? CRIM : e.ty === "cu" ? CU_COLOR : e.ty === "em" ? EM_COLOR : TEXT_SECONDARY, marginBottom: 6, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8, fontFamily: e.ty === "sys" ? "monospace" : "'Georgia',serif" }}>
            {e.ty === "sys" ? <Decode text={e.m} duration={1500} /> : e.m}
          </div>
        ))}
        {ready && <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={() => { sfx.current?.glitch(); dispatch({ type: "PHASE", value: "explore" }); }} style={{ ...S.btnPrimary(GOLD), animation: "pulse 2s ease-in-out infinite" }}>{t("startExplore")}</button>
        </div>}
      </div>
      {!ready && !autoMode && (
        <div style={{ borderTop: `1px solid ${PANEL_BORDER}`, padding: "12px 16px", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: GOLD, fontSize: 14, fontFamily: "monospace" }}>$</span>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && exec()} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: TEXT_PRIMARY, fontFamily: "monospace", fontSize: 15 }} autoFocus placeholder="trace on" />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Explore
// ═══════════════════════════════════════
function ExplorePhase({ state, dispatch, sfx }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [dlg, setDlg] = useState(null); const [dlgS, setDlgS] = useState(0); const [saving, setSaving] = useState(false);
  const [loot, setLoot] = useState(null); const [evt, setEvt] = useState(null); const [room, setRoom] = useState(null);
  const [preBoss, setPreBoss] = useState(false); const [f10Evt, setF10Evt] = useState(false);
  const df = DIFF[state.difficulty] || DIFF.normal;

  useEffect(() => { const fd = FLOOR_DLG[state.floor]; if (fd && !state.flags[`fd_${state.floor}`] && state.floorRooms === 0) { setDlg(fd); dispatch({ type: "FLAG", value: `fd_${state.floor}` }); } }, [state.floor]);
  useEffect(() => { if (state.lancer.hp <= 0 || state.archer.hp <= 0) dispatch({ type: "PHASE", value: "ending" }); }, [state.lancer.hp, state.archer.hp]);

  // Status effect tick: bleeding deals damage
  useEffect(() => {
    const st = state.status || {};
    if (st.bleedL > 0) { dispatch({ type: "UPDATE_LANCER", value: { hp: Math.max(1, state.lancer.hp - 3) } }); dispatch({ type: "STATUS", value: { bleedL: st.bleedL - 1 } }); dispatch({ type: "LOG", msg: `🩸 ${t("cuName")} ${L === "ja" ? "出血ダメージ 3" : "출혈 데미지 3"}`, color: "#ff4444" }); }
    if (st.bleedA > 0) { dispatch({ type: "UPDATE_ARCHER", value: { hp: Math.max(1, state.archer.hp - 3) } }); dispatch({ type: "STATUS", value: { bleedA: st.bleedA - 1 } }); dispatch({ type: "LOG", msg: `🩸 ${t("emName")} ${L === "ja" ? "出血ダメージ 3" : "출혈 데미지 3"}`, color: "#ff4444" }); }
  }, [state.floorRooms]);

  // 자동 저장: 방을 하나 지나거나 층이 바뀔 때마다 (탭을 닫아도 이어할 수 있게)
  useEffect(() => { if (state.lancer.hp > 0 && state.archer.hp > 0 && state.roomsExplored > 0) saveGame(state); }, [state.floor, state.floorRooms, state.roomsExplored]);

  const doSave = async () => { setSaving(true); const ok = await saveGame(state); dispatch({ type: "LOG", msg: ok ? t("saveOk") : t("saveFail"), color: ok ? "#4ade80" : CRIM }); setSaving(false); };
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
    dispatch({ type: "LOG", msg: `${it.icon} ${it.name[L] || it.name.ja}`, color: GOLD }); sfx.current?.beep();
  };

  const explore = (dir) => {
    sfx.current?.beep(); const rt = rollRoom(); const nr = state.floorRooms + 1;
    dispatch({ type: "SET", value: { floorRooms: nr, roomsExplored: state.roomsExplored + 1 } });
    const labels = TX.roomLabels[L]; const idx = ROOM_TYPES.findIndex(r => r.id === rt.id);
    dispatch({ type: "LOG", msg: `${dir} … ${rt.icon} ${labels[idx]}`, color: TEXT_SECONDARY });

    // Voice line for explore events + couple banter
    if (rt.id === "empty") {
      const who = Math.random() < 0.5 ? "cu" : "em";
      // High bond: couple idle banter instead of generic empty lines
      if (state.bond >= 8 && Math.random() < 0.5) {
        const banter = getVoiceLine("idle_banter", who, L, state.bond);
        if (banter) dispatch({ type: "LOG", msg: banter, color: who === "cu" ? CU_COLOR : EM_COLOR });
      } else {
        const vl = getVoiceLine("explore_empty", who, L, state.bond);
        if (vl) dispatch({ type: "LOG", msg: vl, color: who === "cu" ? CU_COLOR : EM_COLOR });
      }
    }

    if (rt.id === "enemy") {
      const tier = Math.min(Math.floor((state.floor - 1) / 3), ENEMIES_BY_TIER.length - 1);
      const base = pick(ENEMIES_BY_TIER[tier]); const m = 1 + (state.floor - 1) * 0.12;
      const en = { name: base.name[L] || base.name.ja, hp: Math.floor(base.hp * m * df.enemyHp), maxHp: Math.floor(base.hp * m * df.enemyHp), atk: Math.floor(base.atk * m * df.enemyAtk), sym: base.sym, color: base.color, img: base.img };
      dispatch({ type: "SET", value: { battle: { enemy: en, turn: 0 } } }); dispatch({ type: "PHASE", value: "battle" });
    } else if (rt.id === "loot") {
      const shuffled = [...LOOT_TABLE].sort(() => Math.random() - 0.5);
      const items = shuffled.slice(0, Math.random() < 0.4 ? 2 : 1);
      const vl = getVoiceLine("explore_loot", Math.random() < 0.5 ? "cu" : "em", L, state.bond);
      if (vl) dispatch({ type: "LOG", msg: vl, color: GOLD });
      setLoot(items);
    } else if (rt.id === "trap") {
      const d = 5 + state.floor * 2; const who = Math.random() < 0.5 ? "lancer" : "archer";
      if (who === "lancer") dispatch({ type: "UPDATE_LANCER", value: { hp: Math.max(1, state.lancer.hp - d) } });
      else dispatch({ type: "UPDATE_ARCHER", value: { hp: Math.max(1, state.archer.hp - d) } });
      dispatch({ type: "LOG", msg: fmt(t("rmTrap"), { who: who === "lancer" ? TX.cuSay[L] : TX.emSay[L], d }), color: who === "lancer" ? CU_COLOR : EM_COLOR });
      // Voice line + bleeding chance (zpandemic-style)
      const vl = getVoiceLine("explore_trap", who === "lancer" ? "cu" : "em", L, state.bond);
      if (vl) dispatch({ type: "LOG", msg: vl, color: who === "lancer" ? CU_COLOR : EM_COLOR });
      if (Math.random() < 0.3) {
        dispatch({ type: "STATUS", value: who === "lancer" ? { bleedL: 2 } : { bleedA: 2 } });
        dispatch({ type: "LOG", msg: `🩸 ${L === "ja" ? "出血状態！" : "출혈 상태!"}`, color: "#ff4444" });
      }
    } else if (rt.id === "event") {
      if (state.bond >= 5 && Math.random() < 0.3 && !state.flags.cookEvt) {
        setEvt({ text: TX.cookEvt, speaker: "both", bond: 3, healBoth: 20, isCook: true }); dispatch({ type: "FLAG", value: "cookEvt" });
      } else {
        // Inspire buff from some events (zpandemic-style)
        const baseEvt = pick(EVENTS);
        if (Math.random() < 0.25) {
          dispatch({ type: "STATUS", value: { inspireL: 2, inspireA: 2 } });
          dispatch({ type: "LOG", msg: `✦ ${L === "ja" ? "鼓舞！次の戦闘で攻撃力UP" : "고무! 다음 전투에서 공격력 UP"}`, color: GOLD });
        }
        setEvt(baseEvt);
      }
      // High bond voice line
      if (state.bond >= 10 && Math.random() < 0.3) {
        const vl = getVoiceLine("high_bond", Math.random() < 0.5 ? "cu" : "em", L, state.bond);
        if (vl) dispatch({ type: "LOG", msg: vl, color: GOLD });
      }
    } else if (rt.id === "rest") {
      dispatch({ type: "UPDATE_LANCER", value: { hp: clamp(state.lancer.hp + 20 + state.floor * 2, 0, state.lancer.maxHp), rune: Math.min(state.lancer.maxRune, state.lancer.rune + 15) } });
      dispatch({ type: "UPDATE_ARCHER", value: { hp: clamp(state.archer.hp + 15 + state.floor * 2, 0, state.archer.maxHp), projection: Math.min(state.archer.maxProjection, state.archer.projection + 12) } });
      // Clear bleeding on rest
      dispatch({ type: "STATUS", value: { bleedL: 0, bleedA: 0 } });
      dispatch({ type: "LOG", msg: t("rmRest"), color: "#4ade80" }); sfx.current?.heal();
    }
    if (nr >= 5 && rt.id !== "enemy") setRoom("stairs"); else setRoom(rt.id);
  };

  const goNext = () => {
    if (state.floor >= 10) {
      if (!state.flags.f10arrive) { setF10Evt(true); dispatch({ type: "FLAG", value: "f10arrive" }); return; }
      setPreBoss(true); return;
    }
    dispatch({ type: "SET", value: { floor: state.floor + 1, floorRooms: 0 } });
    dispatch({ type: "UPDATE_LANCER", value: { rune: Math.min(state.lancer.maxRune, state.lancer.rune + 10) } });
    dispatch({ type: "UPDATE_ARCHER", value: { projection: Math.min(state.archer.maxProjection, state.archer.projection + 8) } });
    dispatch({ type: "LOG", msg: fmt(t("reachedFloor"), { n: state.floor + 1 }), color: GOLD });
    setRoom(null); sfx.current?.glitch();
  };

  // Floor 10 arrival
  if (f10Evt) return (<div style={{ ...S.app, padding: 20 }}><Scanlines opacity={0.04} /><div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center" }}>
    <GlitchText text="B10F" intensity={0.6} fontSize={36} color={CRIM} />
    <div style={{ ...S.panelGold, color: TEXT_PRIMARY, fontSize: 15, lineHeight: 2.2, whiteSpace: "pre-wrap", marginTop: 24 }}>{t("floor10arrive")}</div>
    <button onClick={() => { setF10Evt(false); setPreBoss(true); }} style={{ ...S.btnPrimary(CRIM), marginTop: 20 }}>{t("contBtn")}</button>
  </div></div>);

  // Pre-boss
  if (preBoss) return (<div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}><Scanlines opacity={0.04} />
    <div style={{ textAlign: "center", maxWidth: 600 }}>
      <div style={{ marginBottom: 24, display: "flex", gap: 24, justifyContent: "center" }}><LancerSVG size={85} /><ArcherSVG size={80} /></div>
      <div style={{ ...S.panelGold, color: TEXT_PRIMARY, fontSize: 15, lineHeight: 2.4, whiteSpace: "pre-wrap" }}>
        <div style={{ color: TEXT_SECONDARY, marginBottom: 10 }}>{t("preBoss1")}</div>
        <div style={{ color: EM_COLOR, marginBottom: 8 }}>{t("preBoss2")}</div>
        <div style={{ color: CU_COLOR, marginBottom: 8 }}>{t("preBoss3")}</div>
        <Divider />
        <div style={{ color: GOLD, marginTop: 8 }}>{t("preBoss4")}</div>
      </div>
      <button onClick={() => {
        const boss = state.bond >= 20 ? BOSSES[2] : state.bond >= 8 ? BOSSES[1] : BOSSES[0];
        const en = { ...boss, name: boss.name[L] || boss.name.ja, hp: Math.floor(boss.hp * df.enemyHp), maxHp: Math.floor(boss.hp * df.enemyHp), atk: Math.floor(boss.atk * df.enemyAtk) };
        dispatch({ type: "SET", value: { battle: { enemy: en, turn: 0 } } }); dispatch({ type: "PHASE", value: "battle" });
      }} style={{ ...S.btnPrimary(CRIM), marginTop: 20, animation: "pulse 2s ease-in-out infinite" }}>{t("preBossBtn")}</button>
    </div></div>);

  // Floor dialogue
  if (dlg && dlgS === 0) { const isL = dlg.speaker === "cu"; return (<div style={{ ...S.app, padding: 20 }}><Scanlines opacity={0.03} /><div style={{ maxWidth: 620, margin: "40px auto" }}>
    <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>{isL ? <LancerSVG size={60} /> : <ArcherSVG size={60} />}<span style={{ color: isL ? CU_COLOR : EM_COLOR, fontWeight: "bold", fontSize: 17, letterSpacing: 1 }}>{isL ? TX.cuSay[L] : TX.emSay[L]}</span></div>
    <div style={{ ...S.panelGold, color: TEXT_PRIMARY, fontSize: 15, lineHeight: 2, whiteSpace: "pre-wrap" }}>{dlg.text[L]}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
      {dlg.opts.map((o, i) => {
        const bondGain = Math.max(1, Math.floor((o.bond || 0) * df.bondMult));
        return (<button key={i} onClick={() => { dispatch({ type: "SET", value: { bond: state.bond + bondGain } }); dispatch({ type: "LOG", msg: `→ ${dlg.resp[i][L]}`, color: isL ? CU_COLOR : EM_COLOR }); setDlgS(1); sfx.current?.glitch(); }} style={{ ...S.btn(o.bond >= 3 ? GOLD : TEXT_SECONDARY), textAlign: "left", lineHeight: 1.8, fontSize: 14 }}>
          {o.text[L]}
          <div style={{ fontSize: 11, color: GOLD, marginTop: 2 }}>{L === "ja" ? `絆+${bondGain}` : `유대+${bondGain}`}</div>
        </button>);
      })}
    </div></div></div>); }
  if (dlg && dlgS === 1) return (<div style={{ ...S.app, padding: 20 }}><Scanlines opacity={0.03} /><div style={{ maxWidth: 620, margin: "40px auto", textAlign: "center" }}><div style={{ ...S.panelGold, color: TEXT_PRIMARY, fontSize: 15, lineHeight: 2, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{state.log[state.log.length - 1]?.msg}</div><button onClick={() => { setDlg(null); setDlgS(0); }} style={{ ...S.btn(GOLD), marginTop: 16 }}>{t("contBtn")}</button></div></div>);

  // Loot
  if (loot) return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.03} /><StatusBar s={state} /><div style={{ maxWidth: 500, margin: "20px auto" }}><div style={{ ...S.panelGold, textAlign: "center" }}>
    <div style={{ color: GOLD, fontSize: 17, marginBottom: 14, letterSpacing: 2 }}>{t("lootFound")}</div>
    {loot.map((it, i) => (<button key={`${it.id}-${i}`} onClick={() => { applyLoot(it); setLoot(l => l.filter((_, j) => j !== i)); }} style={{ ...S.btn(GOLD), display: "block", width: "100%", textAlign: "left", marginBottom: 8 }}>{it.icon} {it.name[L] || it.name.ja} <span style={{ color: "#4ade80", fontSize: 12 }}>+{it.val}</span></button>))}
    {loot.length === 0 && <button onClick={() => setLoot(null)} style={{ ...S.btn(TEXT_SECONDARY), marginTop: 8 }}>{t("contExplore")}</button>}
  </div></div></div>);

  // Event
  if (evt) { const applyEvt = () => {
    const bondGain = Math.max(1, Math.floor((evt.bond || 0) * df.bondMult));
    if (evt.bond) dispatch({ type: "SET", value: { bond: state.bond + bondGain } });
    if (evt.runeBonus) dispatch({ type: "UPDATE_LANCER", value: { rune: Math.min(state.lancer.maxRune, state.lancer.rune + evt.runeBonus) } });
    if (evt.projBonus) dispatch({ type: "UPDATE_ARCHER", value: { projection: Math.min(state.archer.maxProjection, state.archer.projection + evt.projBonus) } });
    if (evt.healBoth) { dispatch({ type: "UPDATE_LANCER", value: { hp: clamp(state.lancer.hp + evt.healBoth, 0, state.lancer.maxHp) } }); dispatch({ type: "UPDATE_ARCHER", value: { hp: clamp(state.archer.hp + evt.healBoth, 0, state.archer.maxHp) } }); }
    if (evt.isCook) sfx.current?.heal(); setEvt(null);
  }; return (<div style={{ ...S.app, padding: 16 }}><Scanlines opacity={0.03} /><StatusBar s={state} /><div style={{ maxWidth: 520, margin: "20px auto", textAlign: "center" }}>
    <div style={{ ...S.panelGold, color: evt.speaker === "cu" ? CU_COLOR : evt.speaker === "em" ? EM_COLOR : TEXT_PRIMARY, fontSize: 15, lineHeight: 2, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{evt.text[L] || evt.text.ja}</div>
    <button onClick={applyEvt} style={{ ...S.btn(GOLD), marginTop: 14 }}>{t("contBtn")}</button></div></div>); }

  const stairsOk = room === "stairs" || state.floorRooms >= 5;
  const dirs = [t("north"), t("east"), t("west"), t("south")];

  return (<div style={{ ...S.app, padding: 12 }}><Scanlines opacity={0.02} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${PANEL_BORDER}`, paddingBottom: 10, marginBottom: 12 }}>
      <span style={{ color: GOLD, fontSize: 17, fontWeight: "bold", letterSpacing: 2 }}><Corrupt text={`B${state.floor}F`} level={0.04} /> — {t("exploring")}</span>
      <button onClick={doSave} disabled={saving} style={{ ...S.btn("#4ade80", saving), padding: "6px 16px", fontSize: 12 }}>{saving ? t("saving") : t("save")}</button>
    </div>
    <StatusBar s={state} />
    <FloorObjectives s={state} />
    <div style={S.panel}>
      <div style={{ color: TEXT_SECONDARY, fontSize: 13, marginBottom: 12, textAlign: "center", letterSpacing: 2 }}>{t("dirLabel")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 360, margin: "0 auto" }}>
        {dirs.map(d => (<button key={d} onClick={() => explore(d)} style={S.btn(CU_COLOR)}>{d}</button>))}
      </div>
      {stairsOk && <div style={{ marginTop: 16, textAlign: "center" }}><button onClick={goNext} style={{ ...S.btnPrimary(state.floor >= 10 ? CRIM : GOLD), animation: "pulse 2s ease-in-out infinite" }}>{state.floor >= 10 ? t("finalBoss") : fmt(t("descend"), { n: state.floor + 1 })}</button></div>}
    </div>
    <LogPanel log={state.log} /></div>);
}

// ═══════════════════════════════════════
// Battle — with tooltips and voice lines
// ═══════════════════════════════════════
function BattlePhase({ state, dispatch, sfx }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [log, setLog] = useState([]); const [acting, setActing] = useState(false); const [turn, setTurn] = useState("lancer");
  const logRef = useRef(null); const timerRef = useRef(null);
  const b = state.battle; const e = b?.enemy;
  const [tooltip, setTooltip] = useState(null);
  const st = state.status || {};

  // Battle start voice line
  useEffect(() => {
    if (e) {
      const cuLine = getVoiceLine("battle_start", "cu", L, state.bond);
      const emLine = getVoiceLine("battle_start", "em", L, state.bond);
      if (cuLine) setLog(p => [...p, { msg: cuLine, color: CU_COLOR }]);
      if (emLine) setTimeout(() => setLog(p => [...p, { msg: emLine, color: EM_COLOR }]), 400);
    }
  }, []);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const addLog = (m, c) => setLog(p => [...p, { msg: m, color: c }]);
  const comboChance = Math.min(0.5, state.bond * 0.015);

  // Inspire buff: +20% ATK
  const inspireMultL = st.inspireL > 0 ? 1.2 : 1;
  const inspireMultA = st.inspireA > 0 ? 1.2 : 1;

  const doAction = (who, action) => {
    if (acting || !e || e.hp <= 0) return; setActing(true);
    const syn = 1 + state.synergy * 0.01;
    let dmg = 0; const msgs = []; let enemyDmgTotal = 0; let shield = false;
    let newL = { ...state.lancer }; let newA = { ...state.archer };

    if (who === "lancer") {
      const atkMult = inspireMultL;
      if (action === "thrust") { dmg = Math.floor((newL.atk * atkMult + Math.random() * 8) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("cuThrust"), { d: dmg }), color: CU_COLOR }); sfx.current?.hit(); }
      else if (action === "rune") { if (newL.rune < 15) msgs.push({ msg: t("noRune"), color: TEXT_SECONDARY }); else { newL.rune -= 15; dmg = Math.floor((newL.atk * 1.8 * atkMult + Math.random() * 12) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("cuRune"), { d: dmg }), color: ACCENT }); const vl = getVoiceLine("use_skill", "cu", L, state.bond); if (vl) msgs.push({ msg: vl, color: CU_COLOR }); } }
      else if (action === "bolg") { if (newL.rune < 35) msgs.push({ msg: t("noRune") + " (35)", color: TEXT_SECONDARY }); else { newL.rune -= 35; dmg = Math.floor((newL.atk * 3.5 * atkMult + Math.random() * 20) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("cuBolg"), { d: dmg }), color: "#00bbff" }); sfx.current?.clash(); } }
      setTurn("archer");
    } else {
      const atkMult = inspireMultA;
      if (action === "slash") { dmg = Math.floor((newA.atk * atkMult + Math.random() * 6) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("emSlash"), { d: dmg }), color: EM_COLOR }); sfx.current?.hit(); }
      else if (action === "project") { if (newA.projection < 15) msgs.push({ msg: t("noProj"), color: TEXT_SECONDARY }); else { newA.projection -= 15; dmg = Math.floor((newA.atk * 2 * atkMult + Math.random() * 10) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("emProj"), { d: dmg }), color: ACCENT }); const vl = getVoiceLine("use_skill", "em", L, state.bond); if (vl) msgs.push({ msg: vl, color: EM_COLOR }); } }
      else if (action === "ubw") { if (newA.projection < 30) msgs.push({ msg: t("noProj") + " (30)", color: TEXT_SECONDARY }); else { newA.projection -= 30; dmg = Math.floor((newA.atk * 3 * atkMult + Math.random() * 18) * syn); enemyDmgTotal += dmg; msgs.push({ msg: fmt(t("emUbw"), { d: dmg }), color: "#ff8833" }); sfx.current?.clash(); } }
      else if (action === "shield") { shield = true; msgs.push({ msg: t("emShield"), color: CU_COLOR }); }
      setTurn("enemy");
    }

    // Combo
    if (who === "archer" && state.synergy >= 15 && state.bond >= 8 && Math.random() < comboChance) {
      const cd = Math.floor((newL.atk + newA.atk) * 1.5); enemyDmgTotal += cd;
      msgs.push({ msg: fmt(t("combo"), { d: cd }), color: GOLD }); sfx.current?.clash();
    }

    const newEHp = Math.max(0, e.hp - enemyDmgTotal);
    dispatch({ type: "UPDATE_LANCER", value: newL }); dispatch({ type: "UPDATE_ARCHER", value: newA });
    dispatch({ type: "SET", value: { battle: { ...b, enemy: { ...e, hp: newEHp }, shielding: shield } } });

    // Consume inspire on use
    if (who === "lancer" && st.inspireL > 0) dispatch({ type: "STATUS", value: { inspireL: st.inspireL - 1 } });
    if (who === "archer" && st.inspireA > 0) dispatch({ type: "STATUS", value: { inspireA: st.inspireA - 1 } });

    if (newEHp <= 0) {
      dispatch({ type: "SET", value: { kills: state.kills + 1 } });
      msgs.push({ msg: fmt(t("defeated"), { n: e.name }), color: GOLD });
      // Victory voice line
      const vl = getVoiceLine("battle_win", Math.random() < 0.5 ? "cu" : "em", L, state.bond);
      if (vl) msgs.push({ msg: vl, color: GOLD });
      // Post-battle couple moment at high bond
      if (state.bond >= 12 && Math.random() < 0.4) {
        const who = Math.random() < 0.5 ? "cu" : "em";
        const pb = getVoiceLine("post_battle_bond", who, L, state.bond);
        if (pb) msgs.push({ msg: pb, color: who === "cu" ? CU_COLOR : EM_COLOR });
      }
      msgs.forEach(m => addLog(m.msg, m.color));
      const isBoss = !!e.boss; // 기호 비교 대신 플래그 (일반 적 魔神柱残骸도 기호가 "柱"라 엔딩으로 넘어가던 버그)
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
        // Damage voice line
        const dmgWho = tL ? "cu" : "em";
        const vl = getVoiceLine("take_damage", dmgWho, L, state.bond);
        if (vl && Math.random() < 0.5) msgs.push({ msg: vl, color: tL ? CU_COLOR : EM_COLOR });
        // Low HP voice line
        if (uL.hp > 0 && uL.hp <= 30) { const lv = getVoiceLine("low_hp", "cu", L, state.bond); if (lv && Math.random() < 0.4) msgs.push({ msg: lv, color: CU_COLOR }); }
        if (uA.hp > 0 && uA.hp <= 25) { const lv = getVoiceLine("low_hp", "em", L, state.bond); if (lv && Math.random() < 0.4) msgs.push({ msg: lv, color: EM_COLOR }); }
        // Rescue
        if (uL.hp <= 0 && state.bond >= 10) { uL.hp = 20; msgs.push({ msg: t("rescueL"), color: EM_COLOR }); }
        if (uA.hp <= 0 && state.bond >= 10) { uA.hp = 20; msgs.push({ msg: t("rescueA"), color: CU_COLOR }); }
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

  // Skill button with tooltip
  const SkillBtn = ({ label, desc, color, disabled, onClick }) => (
    <div style={{ position: "relative", flex: 1, minWidth: 80 }}
      onMouseEnter={() => setTooltip(desc)} onMouseLeave={() => setTooltip(null)}>
      <button style={{ ...S.btn(color, disabled || acting), width: "100%", fontSize: 13 }} onClick={onClick} disabled={disabled || acting}>{label}</button>
    </div>
  );

  return (<div style={{ ...S.app, padding: 12, display: "flex", flexDirection: "column" }}><Scanlines opacity={0.02} />
    <div style={{ background: PANEL_BG, borderBottom: `1px solid ${PANEL_BORDER}`, padding: "10px 14px", display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
      <span style={{ color: isL ? CU_COLOR : isA ? EM_COLOR : "#e67e22", fontWeight: "bold", letterSpacing: 1 }}>{isL ? t("lancerTurn") : isA ? t("archerTurn") : t("enemyTurn")}</span>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#3a4060", fontSize: 11 }}>{t("saveNoBattle")}</span>
        <span style={{ color: TEXT_SECONDARY, fontFamily: "monospace", fontSize: 12 }}>B{state.floor}F · T{(b?.turn || 0) + 1}</span>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "16px 8px", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ opacity: isL ? 1 : 0.5, border: isL ? `2px solid ${CU_COLOR}40` : "2px solid transparent", borderRadius: 10, padding: 8, textAlign: "center", background: isL ? `${CU_COLOR}08` : "transparent", transition: "all 0.3s" }}>
          <LancerSVG size={58} /><div style={{ color: CU_COLOR, fontSize: 12, marginTop: 4 }}>HP {state.lancer.hp}/{state.lancer.maxHp}</div><div style={{ color: TEXT_SECONDARY, fontSize: 10 }}>Rune {state.lancer.rune}</div>
          {st.inspireL > 0 && <div style={{ color: GOLD, fontSize: 9 }}>✦鼓舞</div>}
        </div>
        <div style={{ opacity: isA ? 1 : 0.5, border: isA ? `2px solid ${EM_COLOR}40` : "2px solid transparent", borderRadius: 10, padding: 8, textAlign: "center", background: isA ? `${EM_COLOR}08` : "transparent", transition: "all 0.3s" }}>
          <ArcherSVG size={58} /><div style={{ color: EM_COLOR, fontSize: 12, marginTop: 4 }}>HP {state.archer.hp}/{state.archer.maxHp}</div><div style={{ color: TEXT_SECONDARY, fontSize: 10 }}>Proj {state.archer.projection}</div>
          {st.inspireA > 0 && <div style={{ color: GOLD, fontSize: 9 }}>✦鼓舞</div>}
        </div>
      </div>
      <div style={{ color: GOLD, fontSize: 18, fontWeight: "bold", letterSpacing: 4 }}>VS</div>
      {e && <div style={{ textAlign: "center" }}><Sprite src={`/img/${e.img}.png`} size={e.boss ? 128 : 96} fallback={<div style={{ fontSize: 44, color: e.color, textShadow: `0 0 16px ${e.color}40` }}>{e.sym}</div>} /><div style={{ color: e.color, fontSize: 15, fontWeight: "bold", letterSpacing: 1 }}>{e.name}</div><div style={{ ...S.hpBg, marginTop: 6 }}><div style={S.hpBar(eHp, CRIM)} /></div><div style={{ color: TEXT_SECONDARY, fontSize: 11, marginTop: 2 }}>HP {Math.max(0, e.hp)}/{e.maxHp}</div></div>}
    </div>

    {/* Tooltip */}
    {tooltip && <div style={{ background: `${PANEL_BG}ee`, border: `1px solid ${GOLD}40`, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: TEXT_PRIMARY, textAlign: "center", marginBottom: 4, lineHeight: 1.6 }}>{tooltip}</div>}

    {isL && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      <SkillBtn label={t("thrust")} desc={t("thrustDesc")} color={CU_COLOR} onClick={() => doAction("lancer", "thrust")} />
      <SkillBtn label={t("rune")} desc={t("runeDesc")} color={ACCENT} disabled={state.lancer.rune < 15} onClick={() => doAction("lancer", "rune")} />
      <SkillBtn label={t("bolg")} desc={t("bolgDesc")} color="#00bbff" disabled={state.lancer.rune < 35} onClick={() => doAction("lancer", "bolg")} />
    </div>}
    {isA && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      <SkillBtn label={t("slash")} desc={t("slashDesc")} color={EM_COLOR} onClick={() => doAction("archer", "slash")} />
      <SkillBtn label={t("project")} desc={t("projectDesc")} color={ACCENT} disabled={state.archer.projection < 15} onClick={() => doAction("archer", "project")} />
      <SkillBtn label={t("ubw")} desc={t("ubwDesc")} color="#ff8833" disabled={state.archer.projection < 30} onClick={() => doAction("archer", "ubw")} />
      <SkillBtn label={t("shield")} desc={t("shieldDesc")} color={CU_COLOR} onClick={() => doAction("archer", "shield")} />
    </div>}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
      <div style={{ fontSize: 11, color: TEXT_SECONDARY }}>Combo: {Math.round(comboChance * 100)}%</div>
      {acting && <button onClick={() => { if (timerRef.current) { clearTimeout(timerRef.current); setActing(false); setTurn("lancer"); } }} style={{ ...S.btn(TEXT_SECONDARY), padding: "4px 14px", fontSize: 11, minHeight: 28 }}>{t("skip")}</button>}
    </div>
    <div ref={logRef} style={S.log}>{log.map((l, i) => <div key={i} style={{ color: l.color || TEXT_SECONDARY, margin: "3px 0", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{l.msg}</div>)}</div>
  </div>);
}

// ═══════════════════════════════════════
// Ending
// ═══════════════════════════════════════
function EndingPhase({ state, dispatch }) {
  const L = useLang(), t = k => TX[k]?.[L] || "";
  const [vis, setVis] = useState(0);

  const getEnd = () => {
    if (state.lancer.hp <= 0 || state.archer.hp <= 0) return "defeat";
    const isBoss = state.battle?.enemy?.hp <= 0 && !!state.battle.enemy.boss;
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
    // Save run to history
    saveHistory({ ending: key, floor: state.floor, bond: state.bond, synergy: state.synergy, kills: state.kills, diff: state.difficulty, date: new Date().toLocaleDateString() });
    return () => ts.forEach(clearTimeout);
  }, []);

  const metaText = key === "true_bond" ? "Synergy +10, Bond +5 (次回開始時)" :
    key === "boss_extreme" ? "Synergy +5 (次回開始時)" :
    key === "boss_clear" ? "Bond +3 (次回開始時)" : "";

  return (<div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}><Scanlines opacity={0.04} />
    <div style={{ textAlign: "center", maxWidth: 640 }}>
      <div style={{ marginBottom: 28, display: "flex", gap: 24, justifyContent: "center" }}><LancerSVG size={80} /><ArcherSVG size={75} /></div>
      <GlitchText text={title} intensity={0.3} fontSize={20} color={ed.color} />
      <Divider />
      <div style={{ marginTop: 28 }}>
        {lines.slice(0, vis).map((line, i) => (<div key={i} style={{ color: i === vis - 1 ? "#fff" : TEXT_PRIMARY, fontSize: 15, lineHeight: 2.6, marginBottom: 8, animation: "fadeIn 2s", letterSpacing: 0.5 }}>{line}</div>))}
      </div>
      {vis >= lines.length && (<div style={{ marginTop: 40, animation: "fadeIn 2s" }}>
        <div style={{ color: TEXT_SECONDARY, fontSize: 12, marginBottom: 10, fontFamily: "monospace" }}>
          B{state.floor}F | {t("bond")}:{state.bond} | {t("synergy")}:{state.synergy} | {t("kills")}:{state.kills} | [{DIFF[state.difficulty]?.label}]
        </div>
        {metaText ? (
          <div style={{ ...S.panelGold, color: GOLD, fontSize: 13, marginBottom: 18 }}>
            <div style={{ color: TEXT_SECONDARY, fontSize: 11, marginBottom: 6 }}>{t("metaBonus")}</div>
            {metaText}
          </div>
        ) : (
          <div style={{ color: "#3a4060", fontSize: 11, marginBottom: 18 }}>{t("metaNone")}</div>
        )}
        <button onClick={() => dispatch({ type: "RESET" })} style={{ ...S.btnPrimary(TEXT_SECONDARY), letterSpacing: 3 }}>{t("restart")}</button>
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
  const [lang, setLangState] = useState("ja");
  // 언어 선택 기억
  useEffect(() => { (async () => { const l = await storage.get(LANG_KEY); if (l === "ja" || l === "kr") setLangState(l); })(); }, []);
  const setLang = (l) => { setLangState(l); storage.set(LANG_KEY, l); };

  return (
    <LangCtx.Provider value={lang}><div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${NAVY}}::-webkit-scrollbar-thumb{background:#2a3050;border-radius:3px}::selection{background:${GOLD};color:#000}body{background:${NAVY};font-family:'Georgia','Hiragino Mincho ProN','Yu Mincho',serif}`}</style>
      <button onClick={() => setSndOn(sfx.current.toggle())} style={{ position: "fixed", top: 10, right: 10, zIndex: 10000, padding: "6px 14px", borderRadius: 20, border: `1px solid ${sndOn ? GOLD + "60" : "#1a2040"}`, cursor: "pointer", fontSize: 12, background: sndOn ? GOLD + "15" : "transparent", color: sndOn ? GOLD : "#3a4060", fontFamily: "'Georgia',serif" }}>{sndOn ? "Sound ON" : "Sound OFF"}</button>
      {state.phase !== "title" && <div style={{ position: "fixed", top: 10, left: 10, zIndex: 10001, display: "flex", gap: 4 }}>{[["ja", "日本語"], ["kr", "한국어"]].map(([c, f]) => (<button key={c} onClick={() => setLang(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${lang === c ? GOLD + "60" : "#1a2040"}`, cursor: "pointer", fontSize: 12, background: lang === c ? GOLD + "15" : "transparent", color: lang === c ? GOLD : "#556", fontFamily: "'Georgia',serif", letterSpacing: 1 }}>{f}</button>))}</div>}
      {state.phase === "title" && <TitlePhase dispatch={dispatch} sfx={sfx} lang={lang} setLang={setLang} />}
      {state.phase === "terminal" && <TerminalPhase state={state} dispatch={dispatch} sfx={sfx} />}
      {state.phase === "explore" && <ExplorePhase state={state} dispatch={dispatch} sfx={sfx} />}
      {state.phase === "battle" && <BattlePhase state={state} dispatch={dispatch} sfx={sfx} />}
      {state.phase === "ending" && <EndingPhase state={state} dispatch={dispatch} />}
    </div></LangCtx.Provider>
  );
}
