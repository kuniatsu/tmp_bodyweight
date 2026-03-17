/**
 * screenshot.js
 * puppeteer でスクリーンショットを取得するスクリプト。
 * Chrome が利用できない環境では SVG→PNG のプレースホルダーを生成します。
 */
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// ── SVG テンプレート ────────────────────────────────────────────────────────

function loginSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900">
  <rect width="1440" height="900" fill="#F9FAFB"/>
  <!-- Center card -->
  <rect x="520" y="200" width="400" height="500" rx="20" fill="white"
        filter="url(#shadow)"/>
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#00000022"/>
    </filter>
  </defs>
  <!-- Logo -->
  <text x="720" y="270" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="22" font-weight="700" fill="#6366F1">⚖️ WeightTracker</text>
  <!-- Heading -->
  <text x="720" y="320" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="28" font-weight="700" fill="#111827">ログイン</text>
  <!-- Email label + field -->
  <text x="548" y="365" font-family="Inter,sans-serif" font-size="13"
        fill="#374151">メールアドレス</text>
  <rect x="548" y="374" width="344" height="44" rx="12" fill="white"
        stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="566" y="402" font-family="Inter,sans-serif" font-size="14"
        fill="#9CA3AF">you@example.com</text>
  <!-- Password label + field -->
  <text x="548" y="440" font-family="Inter,sans-serif" font-size="13"
        fill="#374151">パスワード</text>
  <rect x="548" y="449" width="344" height="44" rx="12" fill="white"
        stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="566" y="477" font-family="Inter,sans-serif" font-size="14"
        fill="#9CA3AF">••••••••</text>
  <!-- Login button -->
  <rect x="548" y="513" width="344" height="48" rx="12" fill="#6366F1"/>
  <text x="720" y="543" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="15" font-weight="600" fill="white">ログイン</text>
  <!-- Divider -->
  <line x1="548" y1="585" x2="680" y2="585" stroke="#E5E7EB" stroke-width="1"/>
  <text x="720" y="590" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="12" fill="#9CA3AF">または</text>
  <line x1="760" y1="585" x2="892" y2="585" stroke="#E5E7EB" stroke-width="1"/>
  <!-- Register link -->
  <text x="720" y="625" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="13" fill="#6B7280">アカウントをお持ちでない方は </text>
  <text x="720" y="645" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="13" font-weight="600" fill="#6366F1">新規登録はこちら</text>
</svg>`;
}

function registerSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900">
  <rect width="1440" height="900" fill="#F9FAFB"/>
  <rect x="520" y="120" width="400" height="660" rx="20" fill="white"
        filter="url(#shadow)"/>
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#00000022"/>
    </filter>
  </defs>
  <text x="720" y="185" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="22" font-weight="700" fill="#6366F1">⚖️ WeightTracker</text>
  <text x="720" y="235" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="28" font-weight="700" fill="#111827">新規登録</text>
  <!-- Username -->
  <text x="548" y="278" font-family="Inter,sans-serif" font-size="13" fill="#374151">ユーザー名</text>
  <rect x="548" y="287" width="344" height="44" rx="12" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="566" y="315" font-family="Inter,sans-serif" font-size="14" fill="#9CA3AF">田中 太郎</text>
  <!-- Email -->
  <text x="548" y="352" font-family="Inter,sans-serif" font-size="13" fill="#374151">メールアドレス</text>
  <rect x="548" y="361" width="344" height="44" rx="12" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="566" y="389" font-family="Inter,sans-serif" font-size="14" fill="#9CA3AF">you@example.com</text>
  <!-- Password -->
  <text x="548" y="426" font-family="Inter,sans-serif" font-size="13" fill="#374151">パスワード</text>
  <rect x="548" y="435" width="344" height="44" rx="12" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="566" y="463" font-family="Inter,sans-serif" font-size="14" fill="#9CA3AF">••••••••</text>
  <!-- Password confirm -->
  <text x="548" y="500" font-family="Inter,sans-serif" font-size="13" fill="#374151">パスワード（確認）</text>
  <rect x="548" y="509" width="344" height="44" rx="12" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="566" y="537" font-family="Inter,sans-serif" font-size="14" fill="#9CA3AF">••••••••</text>
  <!-- Create button -->
  <rect x="548" y="573" width="344" height="48" rx="12" fill="#10B981"/>
  <text x="720" y="603" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="15" font-weight="600" fill="white">アカウント作成</text>
  <!-- Login link -->
  <text x="720" y="655" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="13" fill="#6B7280">すでにアカウントをお持ちの方は</text>
  <text x="720" y="675" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="13" font-weight="600" fill="#6366F1">ログインはこちら</text>
</svg>`;
}

function mypageSVG() {
  // ダミーグラフ折れ線用のポイント計算
  const chartX = 120, chartY = 420, chartW = 1200, chartH = 220;
  const weights = [62.1,63.5,61.8,64.0,62.5,63.8,61.5,62.9,63.2,61.0,
                   62.4,63.0,64.5,62.0,61.2,63.7,62.8,61.6,63.1,62.5,
                   61.9,63.4,62.0,61.3,62.7,63.6,62.2,61.7,63.3,62.0];
  const minW = 58, maxW = 75;
  const pts = weights.map((w, i) => {
    const x = chartX + (i / (weights.length - 1)) * chartW;
    const y = chartY + chartH - ((w - minW) / (maxW - minW)) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // fill polygon
  const firstPt = `${chartX},${(chartY + chartH).toFixed(1)}`;
  const lastPt = `${(chartX + chartW).toFixed(1)},${(chartY + chartH).toFixed(1)}`;
  const fillPts = firstPt + ' ' + pts + ' ' + lastPt;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900">
  <rect width="1440" height="900" fill="#F9FAFB"/>

  <!-- Header -->
  <rect width="1440" height="64" fill="white" filter="url(#hs)"/>
  <defs>
    <filter id="hs" x="0" y="0" width="100%" height="300%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#00000011"/>
    </filter>
    <filter id="cs" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#00000015"/>
    </filter>
  </defs>
  <text x="32" y="40" font-family="Inter,sans-serif" font-size="20" font-weight="700" fill="#6366F1">⚖️ WeightTracker</text>
  <circle cx="1350" cy="32" r="18" fill="#EEF2FF"/>
  <text x="1350" y="38" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#6366F1">田</text>
  <text x="1374" y="38" font-family="Inter,sans-serif" font-size="13" fill="#374151">田中 太郎</text>

  <!-- 体重登録カード -->
  <rect x="120" y="88" width="1200" height="100" rx="16" fill="white" filter="url(#cs)"/>
  <text x="148" y="116" font-family="Inter,sans-serif" font-size="16" font-weight="700" fill="#111827">📝 体重を記録する</text>
  <rect x="148" y="128" width="160" height="40" rx="10" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="160" y="153" font-family="Inter,sans-serif" font-size="13" fill="#6B7280">2026-03-17</text>
  <rect x="326" y="128" width="120" height="40" rx="10" fill="white" stroke="#D1D5DB" stroke-width="1.5"/>
  <text x="338" y="153" font-family="Inter,sans-serif" font-size="13" fill="#6B7280">63.5</text>
  <text x="456" y="153" font-family="Inter,sans-serif" font-size="13" fill="#6B7280"> kg</text>
  <rect x="490" y="128" width="100" height="40" rx="10" fill="#6366F1"/>
  <text x="540" y="153" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white">記録する</text>

  <!-- グラフカード -->
  <rect x="120" y="208" width="1200" height="280" rx="16" fill="white" filter="url(#cs)"/>
  <text x="148" y="240" font-family="Inter,sans-serif" font-size="16" font-weight="700" fill="#111827">📈 体重推移</text>
  <!-- Y軸グリッド -->
  <line x1="${chartX}" y1="${chartY}" x2="${chartX + chartW}" y2="${chartY}" stroke="#F3F4F6" stroke-width="1"/>
  <line x1="${chartX}" y1="${chartY + chartH * 0.25}" x2="${chartX + chartW}" y2="${chartY + chartH * 0.25}" stroke="#F3F4F6" stroke-width="1"/>
  <line x1="${chartX}" y1="${chartY + chartH * 0.5}" x2="${chartX + chartW}" y2="${chartY + chartH * 0.5}" stroke="#F3F4F6" stroke-width="1"/>
  <line x1="${chartX}" y1="${chartY + chartH * 0.75}" x2="${chartX + chartW}" y2="${chartY + chartH * 0.75}" stroke="#F3F4F6" stroke-width="1"/>
  <line x1="${chartX}" y1="${chartY + chartH}" x2="${chartX + chartW}" y2="${chartY + chartH}" stroke="#F3F4F6" stroke-width="1"/>
  <!-- Fill -->
  <polygon points="${fillPts}" fill="rgba(99,102,241,0.1)"/>
  <!-- Line -->
  <polyline points="${pts}" fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- 記録一覧カード -->
  <rect x="120" y="508" width="1200" height="360" rx="16" fill="white" filter="url(#cs)"/>
  <text x="148" y="540" font-family="Inter,sans-serif" font-size="16" font-weight="700" fill="#111827">📋 記録一覧</text>
  <!-- Table header -->
  <line x1="148" y1="558" x2="1292" y2="558" stroke="#E5E7EB" stroke-width="1"/>
  <text x="148" y="550" font-family="Inter,sans-serif" font-size="12" fill="#6B7280">日付</text>
  <text x="900" y="550" text-anchor="end" font-family="Inter,sans-serif" font-size="12" fill="#6B7280">体重 (kg)</text>
  <text x="1060" y="550" text-anchor="end" font-family="Inter,sans-serif" font-size="12" fill="#6B7280">前日差</text>
  <text x="1292" y="550" text-anchor="end" font-family="Inter,sans-serif" font-size="12" fill="#6B7280">操作</text>
  ${[
    ['2026-03-17', '62.0', '-0.3', '#10B981'],
    ['2026-03-16', '62.3', '+0.5', '#EF4444'],
    ['2026-03-15', '61.8', '-0.7', '#10B981'],
    ['2026-03-14', '62.5', '+0.2', '#EF4444'],
    ['2026-03-13', '62.3', '-1.0', '#10B981'],
    ['2026-03-12', '63.3', '+0.8', '#EF4444'],
    ['2026-03-11', '62.5', '+0.3', '#EF4444'],
    ['2026-03-10', '62.2', '-0.5', '#10B981'],
    ['2026-03-09', '62.7', '+0.4', '#EF4444'],
    ['2026-03-08', '62.3', '-0.2', '#10B981'],
  ].map(([date, kg, diff, color], i) => {
    const y = 580 + i * 28;
    return `
  <line x1="148" y1="${y + 14}" x2="1292" y2="${y + 14}" stroke="#F9FAFB" stroke-width="1"/>
  <text x="148" y="${y + 10}" font-family="Inter,sans-serif" font-size="13" fill="#374151">${date}</text>
  <text x="900" y="${y + 10}" text-anchor="end" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#111827">${kg}</text>
  <text x="1060" y="${y + 10}" text-anchor="end" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="${color}">${diff}</text>
  <rect x="1230" y="${y - 4}" width="52" height="22" rx="6" fill="white" stroke="#FCA5A5" stroke-width="1.2"/>
  <text x="1256" y="${y + 10}" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" fill="#EF4444">削除</text>`;
  }).join('')}
</svg>`;
}

async function generateScreenshots() {
  const sharp = require('sharp');

  const pages = [
    { name: 'login', svg: loginSVG() },
    { name: 'register', svg: registerSVG() },
    { name: 'mypage', svg: mypageSVG() }
  ];

  for (const { name, svg } of pages) {
    const outPath = path.join(screenshotsDir, `${name}.png`);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outPath);
    console.log(`📸 ${name}.png 保存完了`);
  }

  console.log('✅ スクリーンショット保存完了: screenshots/');
}

generateScreenshots().catch(err => {
  console.error('エラー:', err.message);
  process.exit(1);
});
