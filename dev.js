/* ============================================================
   開発用：すべての場面を一覧から選んで遊べるようにする
   ・タイトル画面の「フリープレイ」の下に「一覧（開発用）」ボタンが出る
   ・公開するときは、index.html の <script src="dev.js" ...> の1行を消すだけでよい
     （このファイルを消しても、ゲームには何の影響もない）
   ============================================================ */
(() => {
  const $ = id => document.getElementById(id);

  // 場面のタイプ（一覧に表示する札）
  function typeOf(v) {
    const twist = v.song ? "曲" : v.call ? "電話" : v.battery != null ? "電池"
      : (v.banners || []).length ? "通知"
      : (v.others || []).some(o => o.typing != null) ? "入力中"
      : (v.others || []).some(o => o.unsend) ? "取り消し"
      : (v.others || []).some(o => o.photoText) ? "写真" : (v.status ? "ひとこと" : "");
    let base;
    if (v.skip.score === 100) base = "返さない";
    else {
      const i = v.zones.findIndex(z => z.score === 100);
      const lo = i > 0 ? v.zones[i - 1].max : 0;
      base = lo >= 60 ? "遅め" : lo >= 3 ? "少し待つ" : "即レス";
    }
    return twist ? `★${twist}` : base;
  }
  // 遊べる形にする（名前・アイコン・ひとことを人から引き継ぐ）
  function toScene(v) {
    const pi = PEOPLE.findIndex(p => p.who === v.who);
    const p = PEOPLE[pi];
    return { who: p.who, icon: p.icon, status: p.status, personIndex: pi, ...v };
  }

  // 一覧の画面
  const sec = document.createElement("section");
  sec.id = "devList";
  sec.style.cssText = "display:none;flex:1;flex-direction:column;background:#f4f6fa;";
  const css = document.createElement("style");
  css.textContent = `
    #devList header { background: var(--header); color: #fff; padding: 14px 16px; display: flex; align-items: center; gap: 10px; position: sticky; top: 0; z-index: 2; }
    #devList header b { font-size: 16px; }
    #devList header button { margin-left: auto; background: #fff; border: none; border-radius: 999px; padding: 6px 14px; font: inherit; font-weight: 700; cursor: pointer; }
    #devList .dev-body { padding: 8px 12px 40px; overflow-y: auto; }
    #devList h3 { font-size: 13px; color: var(--sub); margin: 18px 4px 6px; }
    #devList .dev-item { display: flex; gap: 10px; align-items: flex-start; width: 100%; text-align: left; background: #fff; border: none; border-radius: 12px; padding: 10px 12px; margin-bottom: 6px; font: inherit; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
    #devList .dev-item:active { transform: scale(.98); }
    #devList .dev-no { flex: 0 0 auto; font-size: 12px; font-weight: 800; color: var(--accent); min-width: 34px; padding-top: 2px; }
    #devList .dev-main { flex: 1; min-width: 0; }
    #devList .dev-who { font-size: 13px; font-weight: 700; }
    #devList .dev-msg { font-size: 13px; color: var(--sub); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #devList .dev-tag { flex: 0 0 auto; font-size: 11px; font-weight: 700; background: #eef1f6; color: #33415a; border-radius: 999px; padding: 3px 8px; }
    #devList .dev-tag.twist { background: #fff1c2; color: #8a5a00; }
    .dev-badge { font-size: 11px; color: var(--sub); }
  `;
  document.head.appendChild(css);

  const item = (no, v) => {
    const t = typeOf(v);
    const b = document.createElement("button");
    b.className = "dev-item";
    b.innerHTML = `<span class="dev-no">${no}</span>
      <span class="dev-main"><div class="dev-who"></div><div class="dev-msg"></div></span>
      <span class="dev-tag${t.startsWith("★") ? " twist" : ""}">${t}</span>`;
    b.querySelector(".dev-who").textContent = v.who;
    b.querySelector(".dev-msg").textContent = v.message;
    b.onclick = () => startCustom([toScene(v)]);
    return b;
  };

  function build() {
    sec.innerHTML = `<header><b>一覧（開発用）</b><span class="dev-badge" id="devCount"></span><button id="devBack">タイトルへ</button></header><div class="dev-body" id="devBody"></div>`;
    const body = sec.querySelector("#devBody");
    let n = 0;
    if (typeof DAILY !== "undefined") {
      const h = document.createElement("h3"); h.textContent = "今日の新作（1日目〜）"; body.appendChild(h);
      DAILY.forEach((v, i) => { body.appendChild(item(`${i + 1}日`, v)); n++; });
    }
    PEOPLE.forEach(p => {
      const h = document.createElement("h3"); h.textContent = `フリープレイ：${p.icon} ${p.who}`; body.appendChild(h);
      p.variants.forEach((v, i) => { body.appendChild(item(`#${i + 1}`, { who: p.who, ...v })); n++; });
    });
    sec.querySelector("#devCount").textContent = `全${n}場面`;
    sec.querySelector("#devBack").onclick = () => { refreshTitle(); show("title"); };
  }

  function openList() { build(); show("devList"); window.scrollTo(0, 0); }

  $("phone").appendChild(sec);

  // タイトル画面：「フリープレイ」の下にボタン
  const btn = document.createElement("button");
  btn.className = "btn btn-sub";
  btn.textContent = "一覧（開発用）";
  btn.style.cssText = "border:2px dashed #b9c2cf;box-shadow:none;";
  btn.onclick = openList;
  $("startBtn").after(btn);

  // 結果画面：一覧に戻るボタン
  const back = document.createElement("button");
  back.className = "btn btn-sub";
  back.textContent = "一覧に戻る（開発用）";
  back.style.cssText = "border:2px dashed #b9c2cf;box-shadow:none;";
  back.onclick = openList;
  $("toTitleBtn").after(back);
})();
