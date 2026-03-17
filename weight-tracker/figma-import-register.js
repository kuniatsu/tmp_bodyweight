// figma-import-register.js
// Figma の Plugins > Development > Open console に貼り付けて実行してください。
// register.html の画面を Figma Plugin API で再現します。

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

  function createInputField(label, width, placeholder) {
    const group = figma.createFrame();
    group.resize(width, 68);
    group.fills = [];
    group.clipsContent = false;

    const labelNode = createText(label, { fontSize: 14, color: "#374151", style: "Medium" });
    labelNode.x = 0;
    labelNode.y = 0;
    group.appendChild(labelNode);

    const inputBg = createRect({
      width,
      height: 44,
      fill: "#FFFFFF",
      cornerRadius: 8,
      stroke: "#D1D5DB",
      strokeWeight: 1,
    });
    inputBg.x = 0;
    inputBg.y = 24;
    group.appendChild(inputBg);

    const placeholderNode = createText(placeholder, { fontSize: 14, color: "#9CA3AF" });
    placeholderNode.x = 12;
    placeholderNode.y = 24 + 15;
    group.appendChild(placeholderNode);

    return group;
  }

  // ── メインフレーム（背景） 1440x900 ───────────────

  const frame = figma.createFrame();
  frame.name = "02_新規登録";
  frame.resize(1440, 900);
  frame.fills = [{ type: "SOLID", color: hexToRgb("#F9FAFB") }];

  // ── カード 400x620 ────────────────────────────

  const cardWidth = 400;
  const cardHeight = 620;
  const cardX = (1440 - cardWidth) / 2;
  const cardY = (900 - cardHeight) / 2;

  const card = figma.createFrame();
  card.name = "カード";
  card.resize(cardWidth, cardHeight);
  card.x = cardX;
  card.y = cardY;
  card.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  card.cornerRadius = 16;
  card.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.12 },
      offset: { x: 0, y: 8 },
      radius: 24,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const padding = 40;
  let currentY = padding;

  // ロゴ「⚖️ WeightTracker」
  const logo = createText("⚖️ WeightTracker", {
    fontSize: 20,
    color: "#6366F1",
    style: "Bold",
  });
  logo.x = padding;
  logo.y = currentY;
  card.appendChild(logo);
  currentY += 36 + 16;

  // 見出し「新規登録」
  const heading = createText("新規登録", {
    fontSize: 28,
    color: "#111827",
    style: "Bold",
  });
  heading.x = padding;
  heading.y = currentY;
  card.appendChild(heading);
  currentY += 40 + 20;

  const fieldWidth = cardWidth - padding * 2;

  // ユーザー名入力欄
  const usernameField = createInputField("ユーザー名", fieldWidth, "田中 太郎");
  usernameField.x = padding;
  usernameField.y = currentY;
  card.appendChild(usernameField);
  currentY += 68 + 12;

  // メールアドレス入力欄
  const emailField = createInputField("メールアドレス", fieldWidth, "you@example.com");
  emailField.x = padding;
  emailField.y = currentY;
  card.appendChild(emailField);
  currentY += 68 + 12;

  // パスワード入力欄
  const passwordField = createInputField("パスワード", fieldWidth, "••••••••");
  passwordField.x = padding;
  passwordField.y = currentY;
  card.appendChild(passwordField);
  currentY += 68 + 12;

  // パスワード確認入力欄
  const confirmField = createInputField("パスワード確認", fieldWidth, "••••••••");
  confirmField.x = padding;
  confirmField.y = currentY;
  card.appendChild(confirmField);
  currentY += 68 + 20;

  // 「アカウント作成」ボタン（#10B981 emerald）
  const btnWidth = fieldWidth;
  const createBtn = createRect({
    width: btnWidth,
    height: 48,
    fill: "#10B981",
    cornerRadius: 12,
  });
  createBtn.name = "アカウント作成ボタン";
  createBtn.x = padding;
  createBtn.y = currentY;
  card.appendChild(createBtn);

  const btnLabel = createText("アカウント作成", {
    fontSize: 15,
    color: "#FFFFFF",
    style: "Bold",
  });
  btnLabel.x = padding + (btnWidth - btnLabel.width) / 2;
  btnLabel.y = currentY + (48 - 20) / 2;
  card.appendChild(btnLabel);
  currentY += 48 + 20;

  // 「すでにアカウントをお持ちの方」リンク
  const loginLink = createText("すでにアカウントをお持ちの方はこちら", {
    fontSize: 13,
    color: "#6366F1",
    style: "Medium",
  });
  loginLink.x = padding + (btnWidth - loginLink.width) / 2;
  loginLink.y = currentY;
  card.appendChild(loginLink);

  // カードをメインフレームへ追加
  frame.appendChild(card);

  // ビューポートを移動してズーム
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin("✅ WeightTracker 新規登録画面を Figma に追加しました！");
})();
