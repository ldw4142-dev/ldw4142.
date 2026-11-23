/* 안전진단 작업대 - 프로그램 공통 도구 (programs/*.html 에서 불러 사용)
   <body data-pid="프로그램id"> 를 반드시 지정하세요. 저장 키: wb:<id>:<항목> */
const WB = {
  pid: document.body.dataset.pid || "unknown",
  get(k, d) { try { const v = localStorage.getItem(`wb:${this.pid}:${k}`); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(`wb:${this.pid}:${k}`, JSON.stringify(v)); } catch (e) { } },
  num(v) { const n = parseFloat(String(v ?? "").replace(",", ".")); return isNaN(n) ? null : n; },
  $(s) { return document.querySelector(s); },
  esc(s) { return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); },
  toast(m) {
    const d = document.createElement("div"); d.textContent = m;
    d.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 18px;border-radius:20px;z-index:99";
    document.body.appendChild(d); setTimeout(() => d.remove(), 1300);
  },
  copy(t) {
    const done = () => this.toast("복사됨");
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, () => this._fb(t, done)); else this._fb(t, done);
  },
  _fb(t, done) { const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); document.execCommand("copy"); a.remove(); done(); },
  csv(name, rows) {
    const t = "﻿" + rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" })); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  },
  /* 입력칸 자동 저장: WB.bind(["a","b"], 콜백) — id가 같은 input/select 값을 기억 */
  bind(ids, cb) {
    ids.forEach(id => {
      const el = document.getElementById(id); if (!el) return;
      const v = this.get("f_" + id); if (v !== undefined) el.value = v;
      el.addEventListener("input", () => { this.set("f_" + id, el.value); cb && cb(); });
    });
  },
  /* 측정값 연속 입력: 입력 후 Enter/추가 → 칩으로 쌓임. 반환 {get(), clear(), set(arr)} */
  readings(el, key, opts = {}) {
    let vals = this.get("r_" + key, []);
    const max = opts.max || 999, unit = opts.unit || "";
    const self = this;
    el.innerHTML = `<div class="row"><label style="flex:2">${opts.label || "측정값"}<input type="text" inputmode="decimal" placeholder="숫자 입력 후 Enter"></label>
      <button class="p" style="align-self:flex-end">추가</button><button class="d" style="align-self:flex-end">비우기</button></div><div class="chips"></div><div class="muted"></div>`;
    const inp = el.querySelector("input"), [add, clr] = el.querySelectorAll("button"), chips = el.querySelector(".chips"), info = el.querySelector(".muted");
    function draw(init) {
      chips.innerHTML = vals.map((v, i) => `<span class="chip ${opts.isEx && opts.isEx(v, vals) ? "ex" : ""}">${v}${unit}<button data-i="${i}">×</button></span>`).join("");
      info.textContent = `${vals.length}개` + (opts.max ? ` / ${opts.max}` : "");
      self.set("r_" + key, vals); if (!init) opts.onChange && opts.onChange(vals);
    }
    function push() {
      const n = self.num(inp.value); if (n === null) return;
      if (vals.length >= max) return self.toast(`최대 ${max}개`);
      vals.push(n); inp.value = ""; inp.focus(); draw();
    }
    add.onclick = push; inp.onkeydown = e => { if (e.key === "Enter") push(); };
    clr.onclick = () => { if (vals.length && confirm("측정값을 모두 지울까요?")) { vals = []; draw(); } };
    chips.onclick = e => { const b = e.target.closest("button[data-i]"); if (b) { vals.splice(+b.dataset.i, 1); draw(); } };
    draw(true);
    return { get: () => vals, clear: () => { vals = []; draw(); } };
  },
  /* 측정 기록: WB.log.mount("#log", ["열1","열2"]) 후 WB.log.add(["값1","값2"]) */
  log: {
    cols: [], el: null,
    mount(sel, cols) {
      this.cols = ["시각", "위치/메모", ...cols]; this.el = document.querySelector(sel); this.draw();
    },
    list() { return WB.get("log", []); },
    add(row) {
      const label = (document.getElementById("loc") || {}).value || "";
      const d = new Date(), t = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const l = this.list(); l.push([t, label, ...row]); WB.set("log", l); this.draw(); WB.toast("기록 저장됨");
    },
    draw() {
      const l = this.list();
      this.el.innerHTML = `<h2>측정 기록 (${l.length})</h2><div style="overflow:auto"><table><tr>${this.cols.map(c => `<th>${WB.esc(c)}</th>`).join("")}<th></th></tr>
      ${l.map((r, i) => `<tr>${r.map(c => `<td>${WB.esc(c)}</td>`).join("")}<td><button data-d="${i}" style="min-height:28px;padding:0 8px">×</button></td></tr>`).join("") || `<tr><td colspan="${this.cols.length + 1}" class="muted">기록 없음</td></tr>`}</table></div>
      <div class="row"><button data-a="copy">엑셀용 복사</button><button data-a="csv">CSV 저장</button><button class="d" data-a="clr">기록 삭제</button></div>`;
      this.el.onclick = e => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.d !== undefined) { const x = this.list(); x.splice(+b.dataset.d, 1); WB.set("log", x); this.draw(); }
        else if (b.dataset.a === "copy") WB.copy([this.cols, ...this.list()].map(r => r.join("\t")).join("\n"));
        else if (b.dataset.a === "csv") WB.csv(`${WB.pid}_기록.csv`, [this.cols, ...this.list()]);
        else if (b.dataset.a === "clr" && confirm("기록을 모두 삭제할까요?")) { WB.set("log", []); this.draw(); }
      };
    }
  }
};
/* 테마: 틀(부모 창)의 다크/라이트와 동기화 */
(function () {
  function apply(t) { if (t) document.documentElement.dataset.theme = t; }
  try { apply(parent.document.documentElement.dataset.theme); } catch (e) { }
  window.addEventListener("message", e => { if (e.data && e.data.wbTheme) apply(e.data.wbTheme); });
})();
