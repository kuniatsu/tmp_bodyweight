// figma-import-mypage.js
// Figma の Plugins > Development > Open console に貼り付けて実行してください。
// mypage.html の画面を Figma Plugin API で再現します。

(async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  // ── ヘルパー関数 ──────────────────────────────

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  }

  function createText(content, options = {}) {
    const node = figma.createText();
    node.characters = content;
    node.fontName = { family: "Inter", style: options.style || "Regular" };
    node.fontSize = options.fontSize || 14;
    node.fills = [{ type: "SOLID", color: hexToRgb(options.color || "#111827") }];
    return node;
  }

  function createRect(options = {}) {
    const node = figma.createRectangle();
    node.resize(options.width || 100, options.height || 40);
    node.fills = [{ type: "SOLID", color: hexToRgb(options.fill || "#FFFFFF") }];
    node.cornerRadius = options.cornerRadius || 0;
    if (options.stroke) {
      node.strokes = [{ type: "SOLID", color: hexToRgb(options.stroke) }];
      node.strokeWeight = options.strokeWeight || 1;
    }
    return node;
  }

  // ── メインフレーム（背景） 1440x900 ───────────────

  const frame = figma.createFrame();
  frame.name = "03_マイページ";
  frame.resize(1440, 900);
  frame.fills = [{ type: "SOLID", color: hexToRgb("#F9FAFB") }];

  // ── ヘッダー ────────────────────────────────

  const header = figma.createFrame();
  header.name = "ヘッダー";
  header.resize(1440, 64);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  header.strokes = [{ type: "SOLID", color: hexToRgb("#E5E7EB") }];
  header.strokeWeight = 1;
  header.strokeAlign = "INSIDE";

  const headerLogo = createText("⚖️ WeightTracker", {
    fontSize: 18,
    color: "#6366F1",
    style: "Bold",
  });
  headerLogo.x = 24;
  headerLogo.y = (64 - 24) / 2;
  header.appendChild(headerLogo);

  // ユーザー情報（右側）
  const avatarBg = createRect({ width: 36, height: 36, fill: "#6366F1", cornerRadius: 18 });
  avatarBg.x = 1440 - 24 - 120 - 16 - 36;
  avatarBg.y = (64 - 36) / 2;
  header.appendChild(avatarBg);

  const avatarText = createText("田", { fontSize: 14, color: "#FFFFFF", style: "Bold" });
  avatarText.x = avatarBg.x + 11;
  avatarText.y = avatarBg.y + 10;
  header.appendChild(avatarText);

  const userName = createText("田中 太郎", { fontSize: 14, color: "#374151" });
  userName.x = avatarBg.x + 44;
  userName.y = (64 - 20) / 2;
  header.appendChild(userName);

  const logoutBtn = createRect({ width: 80, height: 32, fill: "#F3F4F6", cornerRadius: 8, stroke: "#D1D5DB", strokeWeight: 1 });
  logoutBtn.x = 1440 - 24 - 80;
  logoutBtn.y = (64 - 32) / 2;
  header.appendChild(logoutBtn);

  const logoutText = createText("ログアウト", { fontSize: 13, color: "#6B7280" });
  logoutText.x = logoutBtn.x + (80 - logoutText.width) / 2;
  logoutText.y = logoutBtn.y + 8;
  header.appendChild(logoutText);

  frame.appendChild(header);

  // ── コンテンツエリア（最大幅1200px、中央揃え） ───────────

  const contentX = (1440 - 1200) / 2;
  let currentY = 64 + 32;

  // ① 体重登録カード
  const registerCard = figma.createFrame();
  registerCard.name = "体重登録カード";
  registerCard.resize(1200, 100);
  registerCard.x = contentX;
  registerCard.y = currentY;
  registerCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  registerCard.cornerRadius = 16;
  registerCard.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.06 },
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const registerTitle = createText("📝 体重を記録する", {
    fontSize: 16,
    color: "#111827",
    style: "Bold",
  });
  registerTitle.x = 24;
  registerTitle.y = 20;
  registerCard.appendChild(registerTitle);

  // 日付ピッカー
  const datePicker = createRect({ width: 160, height: 40, fill: "#FFFFFF", cornerRadius: 8, stroke: "#D1D5DB", strokeWeight: 1 });
  datePicker.x = 24;
  datePicker.y = 50;
  registerCard.appendChild(datePicker);

  const dateText = createText("2026-03-17", { fontSize: 14, color: "#374151" });
  dateText.x = 36;
  dateText.y = 63;
  registerCard.appendChild(dateText);

  // 体重入力
  const weightInput = createRect({ width: 160, height: 40, fill: "#FFFFFF", cornerRadius: 8, stroke: "#D1D5DB", strokeWeight: 1 });
  weightInput.x = 200;
  weightInput.y = 50;
  registerCard.appendChild(weightInput);

  const weightText = createText("65.0 kg", { fontSize: 14, color: "#9CA3AF" });
  weightText.x = 212;
  weightText.y = 63;
  registerCard.appendChild(weightText);

  // 記録ボタン
  const recordBtn = createRect({ width: 100, height: 40, fill: "#6366F1", cornerRadius: 8 });
  recordBtn.x = 376;
  recordBtn.y = 50;
  registerCard.appendChild(recordBtn);

  const recordBtnText = createText("記録する", { fontSize: 14, color: "#FFFFFF", style: "Bold" });
  recordBtnText.x = 376 + (100 - recordBtnText.width) / 2;
  recordBtnText.y = 50 + 11;
  registerCard.appendChild(recordBtnText);

  frame.appendChild(registerCard);
  currentY += 100 + 24;

  // ② 体重推移グラフカード
  const graphCard = figma.createFrame();
  graphCard.name = "体重推移グラフカード";
  graphCard.resize(1200, 420);
  graphCard.x = contentX;
  graphCard.y = currentY;
  graphCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  graphCard.cornerRadius = 16;
  graphCard.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.06 },
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const graphTitle = createText("📈 体重推移", {
    fontSize: 16,
    color: "#111827",
    style: "Bold",
  });
  graphTitle.x = 24;
  graphTitle.y = 20;
  graphCard.appendChild(graphTitle);

  // グラフエリア（Rectangleで代替）
  const graphArea = createRect({
    width: 1152,
    height: 350,
    fill: "#F8FAFF",
    cornerRadius: 8,
    stroke: "#E0E7FF",
    strokeWeight: 1,
  });
  graphArea.x = 24;
  graphArea.y = 52;
  graphCard.appendChild(graphArea);

  // グラフ軸ラベル（Y軸）
  const yLabels = ["75kg", "70kg", "65kg", "60kg", "55kg"];
  yLabels.forEach((label, i) => {
    const yLabel = createText(label, { fontSize: 11, color: "#9CA3AF" });
    yLabel.x = 24;
    yLabel.y = 52 + i * (350 / 4) - 8;
    graphCard.appendChild(yLabel);
  });

  // グラフラインのプレースホルダーテキスト
  const graphPlaceholder = createText("Chart.js 折れ線グラフ（体重推移 過去30日分）", {
    fontSize: 14,
    color: "#6366F1",
    style: "Medium",
  });
  graphPlaceholder.x = 24 + (1152 - graphPlaceholder.width) / 2;
  graphPlaceholder.y = 52 + (350 - 20) / 2;
  graphCard.appendChild(graphPlaceholder);

  frame.appendChild(graphCard);
  currentY += 420 + 24;

  // ③ 記録一覧カード
  const tableCard = figma.createFrame();
  tableCard.name = "記録一覧カード";
  tableCard.resize(1200, 200);
  tableCard.x = contentX;
  tableCard.y = currentY;
  tableCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  tableCard.cornerRadius = 16;
  tableCard.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.06 },
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const tableTitle = createText("📋 記録一覧", {
    fontSize: 16,
    color: "#111827",
    style: "Bold",
  });
  tableTitle.x = 24;
  tableTitle.y = 20;
  tableCard.appendChild(tableTitle);

  // テーブルヘッダー行
  const tableHeaderBg = createRect({ width: 1152, height: 36, fill: "#F9FAFB", cornerRadius: 0, stroke: "#E5E7EB", strokeWeight: 1 });
  tableHeaderBg.x = 24;
  tableHeaderBg.y = 52;
  tableCard.appendChild(tableHeaderBg);

  const colHeaders = ["日付", "体重 (kg)", "前日差", "操作"];
  const colX = [24, 200, 400, 1000];
  colHeaders.forEach((col, i) => {
    const colHeader = createText(col, { fontSize: 13, color: "#6B7280", style: "Medium" });
    colHeader.x = colX[i] + 8;
    colHeader.y = 52 + 10;
    tableCard.appendChild(colHeader);
  });

  // テーブルデータ行（3行サンプル）
  const rows = [
    ["2026-03-17", "65.2 kg", "+0.3 kg", ""],
    ["2026-03-16", "64.9 kg", "-0.5 kg", ""],
    ["2026-03-15", "65.4 kg", "+0.2 kg", ""],
  ];
  const rowColors = ["#10B981", "#EF4444", "#10B981"];

  rows.forEach((row, rowIdx) => {
    const rowY = 88 + rowIdx * 36;

    const rowBg = createRect({ width: 1152, height: 36, fill: rowIdx % 2 === 0 ? "#FFFFFF" : "#F9FAFB", cornerRadius: 0, stroke: "#E5E7EB", strokeWeight: 1 });
    rowBg.x = 24;
    rowBg.y = rowY;
    tableCard.appendChild(rowBg);

    row.forEach((cell, colIdx) => {
      if (colIdx === 3) {
        // 削除ボタン
        const delBtn = createRect({ width: 48, height: 24, fill: "#FEF2F2", cornerRadius: 4, stroke: "#FCA5A5", strokeWeight: 1 });
        delBtn.x = colX[3] + 8;
        delBtn.y = rowY + 6;
        tableCard.appendChild(delBtn);

        const delText = createText("削除", { fontSize: 12, color: "#EF4444" });
        delText.x = colX[3] + 8 + (48 - delText.width) / 2;
        delText.y = rowY + 12;
        tableCard.appendChild(delText);
      } else {
        const cellColor = colIdx === 2 ? rowColors[rowIdx] : "#374151";
        const cellText = createText(cell, { fontSize: 14, color: cellColor });
        cellText.x = colX[colIdx] + 8;
        cellText.y = rowY + 10;
        tableCard.appendChild(cellText);
      }
    });
  });

  frame.appendChild(tableCard);

  // ビューポートを移動してズーム
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin("✅ WeightTracker マイページ画面を Figma に追加しました！");
})();
