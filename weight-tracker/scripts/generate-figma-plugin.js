/**
 * generate-figma-plugin.js
 * screenshots/ 以下の PNG を base64 エンコードして
 * figma-import-plugin.js を生成します。
 */
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.resolve(__dirname, '../screenshots');
const outputFile = path.resolve(__dirname, '../figma-import-plugin.js');

const screens = [
  { name: 'login', label: '01_ログイン', x: 0 },
  { name: 'register', label: '02_新規登録', x: 1540 },
  { name: 'mypage', label: '03_マイページ', x: 3080 },
];

function toBase64(filePath) {
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

function generate() {
  const dataVars = screens.map(s => {
    const imgPath = path.join(screenshotsDir, `${s.name}.png`);
    if (!fs.existsSync(imgPath)) {
      throw new Error(`スクリーンショットが見つかりません: ${imgPath}`);
    }
    const b64 = toBase64(imgPath);
    return `const IMG_${s.name.toUpperCase()} = "${b64}";`;
  }).join('\n');

  const frameBlocks = screens.map(s => `
  // ${s.label}
  {
    const frame = figma.createFrame();
    frame.name = "${s.label}";
    frame.resize(1440, 900);
    frame.x = ${s.x};
    frame.y = 0;
    const imgData_${s.name} = IMG_${s.name.toUpperCase()}.replace(/^data:image\\/png;base64,/, "");
    const bytes_${s.name} = Uint8Array.from(atob(imgData_${s.name}), c => c.charCodeAt(0));
    const img_${s.name} = figma.createImage(bytes_${s.name});
    frame.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: img_${s.name}.hash }];
    frames.push(frame);
  }`).join('\n');

  const plugin = `// figma-import-plugin.js
// Figma の Plugins > Development > Open console に貼り付けて実行してください。
// 3つのフレーム (1440×900) が横並びで作成されます。

(async () => {
  const frames = [];

  ${dataVars}

${frameBlocks}

  figma.currentPage.selection = frames;
  figma.viewport.scrollAndZoomIntoView(frames);
  figma.closePlugin("✅ WeightTracker 3画面をFigmaに追加しました！");
})();
`;

  fs.writeFileSync(outputFile, plugin, 'utf8');
  const kb = Math.round(fs.statSync(outputFile).size / 1024);
  console.log(`✅ figma-import-plugin.js 生成完了 (${kb} KB)`);
}

generate();
