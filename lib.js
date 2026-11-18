/* Húsnæði.is: undirsíður (heimildasafn, afrita tilvísun, myndbandalisti) */
(function(){
  const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[­]/g, "");

  /* ---------- Heimildasafn ---------- */
  const lib = document.querySelector("[data-lib]");
  if(lib){
    const input = lib.querySelector(".lib-search input");
    const sort = lib.querySelector(".lib-sort");
    const chips = [...lib.querySelectorAll(".chip")];
    const groups = [...lib.querySelectorAll(".lib-group")];
    const empty = lib.querySelector(".lib-empty");
    let cat = "all";
    groups.forEach(g => [...g.querySelectorAll(".refs > li")].forEach((li, i) => { li.dataset.o = i; if(li.dataset.s) li.dataset.n = norm(li.dataset.s); }));

    function order(){
      const how = sort.value;
      groups.forEach(g => {
        const ol = g.querySelector(".refs");
        const items = [...ol.children];
        items.sort((a, b) => {
          if(how === "def") return a.dataset.o - b.dataset.o;
          const ya = +(a.dataset.year || 0), yb = +(b.dataset.year || 0);
          if(how === "new") return (yb || -1) - (ya || -1) || a.dataset.o - b.dataset.o;
          return (ya || 9999) - (yb || 9999) || a.dataset.o - b.dataset.o;
        });
        items.forEach(li => ol.appendChild(li));
      });
    }
    function apply(){
      const q = norm(input.value.trim());
      const words = q.split(/\s+/).filter(Boolean);
      let any = false;
      groups.forEach(g => {
        const inCat = cat === "all" || g.dataset.cat === cat;
        let n = 0;
        g.querySelectorAll(".ref").forEach(li => {
          const ok = !words.length || words.every(w => li.dataset.n.includes(w));
          li.hidden = !ok; if(ok) n++;
        });
        g.querySelectorAll(".ref-sub").forEach(s => s.hidden = !!words.length || sort.value !== "def");
        g.hidden = !inCat || n === 0;
        if(!g.hidden) any = true;
      });
      empty.hidden = any;
    }
    let tmr;
    input.addEventListener("input", () => { clearTimeout(tmr); tmr = setTimeout(apply, 120); });
    sort.addEventListener("change", () => { order(); apply(); });
    chips.forEach(c => c.addEventListener("click", () => {
      cat = c.dataset.cat;
      chips.forEach(x => x.setAttribute("aria-pressed", x === c));
      apply();
      const top = lib.getBoundingClientRect().top + scrollY - 90;
      if(scrollY > top) scrollTo({top, behavior: "smooth"});
    }));
  }

  /* ---------- Afrita tilvísun ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest(".ref-cite");
    if(!b) return;
    const label = b.querySelector("span");
    const done = () => { label.textContent = t("copied") + " ✓"; setTimeout(() => label.textContent = t("copyCite"), 1800); };
    try{ navigator.clipboard.writeText(b.dataset.cite).then(done).catch(() => {}); }catch(err){}
  });

  /* ---------- Myndbandalisti ---------- */
  const vw = document.querySelector("[data-videos]");
  if(vw){
    const V = JSON.parse(vw.dataset.videos);
    const frame = vw.querySelector(".v-frame"), title = vw.querySelector(".v-main-title"), yt = vw.querySelector(".v-yt"), list = vw.querySelector(".v-list");
    let cur = 0;
    const thumb = id => `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">`;
    const vt = v => v.t[lang] || v.t.is;
    function show(i, play){
      cur = i; const v = V[i];
      if(play){
        ytPlay(frame, v.id, vt(v));
      } else {
        frame.innerHTML = ytPoster(v.id, vt(v)) + `<button class="v-btn" aria-label="${t("play")}: ${vt(v)}"><span class="v-play">${ICONS.play}</span></button>`;
        frame.querySelector(".v-btn").addEventListener("click", () => show(cur, true));
      }
      title.textContent = vt(v);
      yt.href = "https://www.youtube.com/watch?v=" + v.id;
      list.innerHTML = V.map((x, k) => `<li><button class="v-item" aria-current="${k === i}" data-k="${k}">
        <span class="v-thumb">${thumb(x.id)}<i>${ICONS.play}</i></span>
        <span><b>${vt(x)}</b><small>${k === i ? t("nowShowing") : t("watch")}</small></span></button></li>`).join("");
      list.querySelectorAll(".v-item").forEach(b => b.addEventListener("click", () => show(+b.dataset.k, true)));
    }
    onLang(() => show(cur, false));
  }

  startSite();
})();
