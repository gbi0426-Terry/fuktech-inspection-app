/* 富泰空調 巡檢填報系統 - 行動端填報原型
   依四份範例表單建模：
   1. P-T02-05 機具設備每日點檢表(電動堆高機)
   2. I-Z01-03 有機溶劑每日點檢表(磁石組立)
   3. I-Z01-02A 化學品區域查檢表(每月)
   4. AED 日常檢查紀錄表(每月) */

const FORMS = {
  forklift: {
    code: "P-T02-05",
    title: "機具設備每日點檢表",
    sub: "機器名稱：電動堆高機　型號：8FBR20",
    dept: "潤淨設備整建部",
    freq: "day",
    image: "images/forklift.svg",
    items: [
      { no: 1, name: "A.電動方向盤　B.警示燈/方向燈　C.安全裝置", method: "操作檢查" },
      { no: 2, name: "A.輪胎狀況　B.照明　C.電瓶", method: "目視檢查" },
      { no: 3, name: "A.儀表　B.指示燈　C.儀表面板", method: "目視檢查" },
      { no: 4, name: "A.警示音　B.警示燈", method: "聲響檢查" },
      { no: 5, name: "A.油壓　B.漏油狀況外洩", method: "目視檢查" },
      { no: 6, name: "A.制動裝置　B.方向裝置", method: "操作檢查" },
      { no: 7, name: "A.機載裝置　B.油壓裝置", method: "操作檢查" },
      { no: 8, name: "A.車輪　B.車軸　C.傳動機構", method: "目視檢查" },
    ],
    resultOptions: ["○ 正常", "△ 待觀察", "✕ 異常"],
  },
  solvent: {
    code: "I-Z01-03",
    title: "有機溶劑每日點檢表",
    sub: "部門：磁石組立　區域：有機溶劑作業區",
    dept: "磁石組立部",
    freq: "day",
    image: "images/solvent.svg",
    items: [
      { no: 1, name: "容器加蓋密閉、無洩漏", method: "目視檢查" },
      { no: 2, name: "化學品標示清晰、存放區標示正確", method: "目視檢查" },
      { no: 3, name: "個人防護具(口罩/手套)齊備並正確佩戴", method: "目視檢查" },
      { no: 4, name: "作業區通風設備運作正常", method: "操作檢查" },
      { no: 5, name: "滅火器/消防器材在有效期內且可取得", method: "目視檢查" },
      { no: 6, name: "廢棄物分類存放，無溢出堆積", method: "目視檢查" },
      { no: 7, name: "安全裝置(緊急沖洗/警示燈)功能正常", method: "操作檢查" },
    ],
    resultOptions: ["○ 正常", "△ 待觀察", "✕ 異常"],
    shiftNote: "本表每日上午/下午各填報一次",
  },
  chem: {
    code: "I-Z01-02A",
    title: "化學品區域查檢表",
    sub: "廠區/區域：　管理部門：　查檢人：",
    dept: "工安室",
    freq: "month",
    image: "images/chem.svg",
    items: [
      { no: 1, name: "化學品儲存容器上有依法定標示", method: "判定標準：可辨識" },
      { no: 2, name: "儲存空間有明確標示擺放位置", method: "判定標準：有標示" },
      { no: 3, name: "化學品之安全資料表(SDS)有如實放置", method: "判定標準：有放置" },
      { no: 4, name: "化學品儲存容器無破損及嚴重鏽蝕", method: "判定標準：無破損" },
      { no: 5, name: "儲存區域無化學品洩漏之危害", method: "判定標準：無洩漏" },
      { no: 6, name: "相關消防設備及器具功能正常", method: "判定標準：有效期內" },
      { no: 7, name: "區域內無助燃性之無關物品", method: "判定標準：無雜物" },
    ],
    resultOptions: ["符合", "不符合"],
  },
  aed: {
    code: "-",
    title: "AED 日常檢查紀錄表",
    sub: "設置地點：一廠總機　機器型號：ARK-501　管理員：謝定甫",
    dept: "工安室",
    freq: "month",
    image: "images/aed.svg",
    items: [
      { no: 1, name: "本月 AED 機體外觀／電源指示燈檢查", method: "正常／異常" },
    ],
    resultOptions: ["□ 正常", "□ 異常"],
    consumables: [
      { name: "電擊貼片", expire: "2026-01-29" },
      { name: "電池", expire: "2029-03-25" },
    ],
  },
};

const SIDE_NOTES = {
  forklift: [
    "頻率：每日，紙本原表為 1~31 日橫向格子，行動端改為「每次提交一筆」，由後台依日期彙總成月報。",
    "點檢方式區分操作檢查／目視檢查／聲響檢查，沿用原表分類。",
    "任一項選「✕ 異常」即展開異常說明＋拍照欄位。",
  ],
  solvent: [
    "原表上午/下午各有一組簽核欄位與 QR Code 貼紙，行動端以「巡檢時段」欄位取代，並用登入帳號自動取得巡檢員。",
    "異常項目需文字說明＋現場照片，比對原表「異常備註」欄。",
  ],
  chem: [
    "原表頻率為每月，且同一月份可查檢多次（次數1234），故以「年月＋次數」作為一筆紀錄的鍵值。",
    "保留原表「判定標準」說明，查檢人作答時可參考標準後再選符合/不符合。",
  ],
  aed: [
    "原表為整年一張表，列是月份1~12，行動端改為「每月提交一次」，正常/異常二選一。",
    "耗材效期（電擊貼片、電池）為原表附帶資訊，先以唯讀方式呈現，效期提醒功能本階段不開發。",
  ],
};

let currentForm = "forklift";

function renderPhone(formKey) {
  const f = FORMS[formKey];
  const screen = document.getElementById("phoneScreen");

  let itemRows = f.items.map((it) => `
    <tr data-item="${it.no}">
      <td style="width:22px;color:#9aa3ad;">${it.no}</td>
      <td>
        <div class="item-name">${it.name}</div>
        <div class="item-criteria">${it.method}</div>
      </td>
      <td style="width:88px;">
        <select class="result-select" onchange="handleResultChange(this, ${it.no})">
          <option value="">請選擇</option>
          ${f.resultOptions.map((o) => `<option value="${o}">${o}</option>`).join("")}
        </select>
      </td>
    </tr>
  `).join("");

  let dateField = f.freq === "day"
    ? `<div class="field-block">
         <div class="field-label"><span class="num">2</span>巡檢日期</div>
         <input type="date" class="field-input" value="2026-06-16">
       </div>`
    : `<div class="field-block">
         <div class="field-label"><span class="num">2</span>查檢年月／次數</div>
         <input type="month" class="field-input" value="2026-06">
       </div>`;

  let consumableBlock = "";
  if (f.consumables) {
    consumableBlock = `
      <div class="field-block">
        <div class="field-label"><span class="num">4</span>耗材使用效期（唯讀）</div>
        <div class="month-grid">
          ${f.consumables.map(c => `
            <div class="month-cell">
              <div class="m-label">${c.name}</div>
              <div>${c.expire}</div>
            </div>
          `).join("")}
        </div>
      </div>`;
  }

  screen.innerHTML = `
    <div class="app-statusbar"><span>9:58</span><span>5G 96%</span></div>
    <div class="app-topbar">
      <span class="back">‹</span>
      <span class="title">巡檢填報</span>
    </div>
    <div class="app-banner" style="background-image:url('${f.image}')">
      <span class="form-no">${f.code}</span>
    </div>
    <div class="app-body">
      <div class="field-block">
        <div class="field-label"><span class="num">1</span>巡檢員 / 部門</div>
        <input type="text" class="field-input" value="${f.dept}" readonly>
      </div>
      ${dateField}
      <div class="field-block">
        <div class="field-label"><span class="num">3</span>檢測項目</div>
        <table class="item-table">
          <thead><tr><th>項次</th><th>檢查項目</th><th>結果</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>

      <div class="abnormal-box" id="abnormalBox">
        <div class="field-label">⚠ 異常情形說明</div>
        <textarea placeholder="請描述異常原因 / 處理方式"></textarea>
        <div class="photo-upload">
          <div class="photo-slot">＋</div>
          <div class="photo-slot">＋</div>
        </div>
      </div>

      ${consumableBlock}

      <div class="field-block">
        <div class="field-label"><span class="num">${f.consumables ? 5 : 4}</span>巡檢員簽章</div>
        <div class="signature-box">點擊簽名 / 上傳簽名圖檔</div>
      </div>

      <button class="submit-btn" onclick="handleSubmit()">提　交</button>
    </div>
    <div class="bottom-bar">
      <span class="icon">📷<span>拍照</span></span>
      <span class="icon">📍<span>定位</span></span>
      <span class="icon">📑<span>歷史紀錄</span></span>
      <span class="icon">⬇<span>下載</span></span>
    </div>
  `;
}

function handleResultChange(select, itemNo) {
  const val = select.value;
  const badWords = ["✕", "異常", "不符合"];
  const isBad = badWords.some((w) => val.includes(w));
  select.classList.remove("is-bad", "is-good");
  if (val === "") return;
  select.classList.add(isBad ? "is-bad" : "is-good");

  const allSelects = document.querySelectorAll(".result-select");
  const anyBad = Array.from(allSelects).some((s) =>
    badWords.some((w) => s.value.includes(w))
  );
  document.getElementById("abnormalBox").classList.toggle("show", anyBad);
}

function handleSubmit() {
  alert("（原型）已模擬提交一筆巡檢紀錄，正式版將寫入帆軟資料庫並產生月報。");
}

function renderSideNote(formKey) {
  const notes = SIDE_NOTES[formKey];
  document.getElementById("sideNote").innerHTML = `
    <h3>本表行動填報設計說明</h3>
    <ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul>
  `;
}

function switchForm(formKey) {
  currentForm = formKey;
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.form === formKey);
  });
  renderPhone(formKey);
  renderSideNote(formKey);
}

document.getElementById("formTabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  switchForm(btn.dataset.form);
});

switchForm(currentForm);
