# Weight Tracker — Claude Code 自動セットアップ & Figmaエクスポート

## ⚠️ Claude Codeへの指示

このファイルを読み、**Step 1 から順番に全て自律的に実行**すること。  
途中の確認は最小限にすること。完了後は「✅ 全ステップ完了」と報告し、  
**ユーザーが手動で行う手順のみ**を箇条書きで提示すること。

---

## 📁 完成後のディレクトリ構成

```
weight-tracker/
├── src/
│   ├── login.html
│   ├── register.html
│   └── mypage.html
├── screenshots/
│   ├── login.png
│   ├── register.png
│   └── mypage.png
├── scripts/
│   ├── screenshot.js
│   └── generate-figma-plugin.js
├── figma-import-plugin.js   ← Figmaコンソールに貼り付けるスクリプト
├── .env
└── package.json
```

---

## Step 1: プロジェクト初期化

```bash
mkdir weight-tracker && cd weight-tracker
npm init -y
npm install puppeteer
```

---

## Step 2: .env ファイルの作成

```bash
cat > .env << 'EOF'
# Figma Personal Access Token
# 取得先: Figma > Settings > Security > Personal access tokens
FIGMA_TOKEN=YOUR_FIGMA_PERSONAL_ACCESS_TOKEN
EOF
```

---

## Step 3: HTMLファイルを作成する

`src/` ディレクトリを作成し、以下の仕様で3ファイルを作成すること。

### デザイン共通仕様

| 項目 | 値 |
|------|-----|
| 画面幅 | 1440px（Figma用固定幅） |
| プライマリカラー | `#6366F1`（Indigo） |
| アクセントカラー | `#10B981`（Emerald） |
| 背景色 | `#F9FAFB`（Gray-50） |
| フォント | Inter（Google Fonts CDN） |
| CSSフレームワーク | Tailwind CSS CDN（`https://cdn.tailwindcss.com`） |
| JSフレームワーク | Alpine.js v3 CDN |
| グラフライブラリ | Chart.js CDN（mypage.htmlのみ） |

### src/login.html の仕様

- 画面全体：横1440px、縦はコンテンツに合わせて最低900px
- 中央に白いカード（最大幅400px、rounded-2xl、shadow-xl）
- カード内の要素（上から順に）：
  1. サービスロゴ：「⚖️ WeightTracker」テキスト（indigo、text-2xl、font-bold）
  2. 見出し：「ログイン」（text-3xl、font-bold、gray-900）
  3. メールアドレス入力（label + input、full width）
  4. パスワード入力（label + input type=password、full width）
  5. 「ログイン」ボタン（背景 #6366F1、white text、full width、py-3、rounded-xl、hover効果）
  6. 区切り線「または」
  7. 「新規登録はこちら」リンク（register.htmlへのリンク）
- Alpine.jsでフォームバリデーション（空欄チェック）を実装
- ログインボタン押下時は「ログイン中...」に変わり2秒後にmypage.htmlへリダイレクト

### src/register.html の仕様

- レイアウトはlogin.htmlと同一スタイル
- カード内の要素（上から順に）：
  1. ロゴ（login.htmlと同じ）
  2. 見出し：「新規登録」
  3. ユーザー名入力
  4. メールアドレス入力
  5. パスワード入力
  6. パスワード確認入力
  7. 「アカウント作成」ボタン（#10B981 emerald色）
  8. 「すでにアカウントをお持ちの方」→ login.htmlリンク
- Alpine.jsでパスワード一致チェックを実装（不一致時に赤いエラーメッセージ表示）
- 送信後2秒でlogin.htmlへリダイレクト

### src/mypage.html の仕様

- ヘッダー（横幅全体、白背景、border-bottom）：
  - 左：「⚖️ WeightTracker」ロゴ
  - 右：ユーザーアイコン（丸いアバター、「田中 太郎」テキスト）、「ログアウト」ボタン
- メインコンテンツ（最大幅1200px、mx-auto、px-6、py-8）：

**① 体重登録カード**（上部）

- 白背景、rounded-2xl、shadow-md
- 見出し：「📝 体重を記録する」
- 横並びフォーム：
  - 日付ピッカー（input type=date、デフォルト今日）
  - 体重入力（input type=number、step=0.1、単位「kg」表示）
  - 「記録する」ボタン（#6366F1）
- 登録成功時にグリーンのトースト通知が画面右上に出て2秒で消える

**② 体重推移グラフカード**（中部）

- 白背景、rounded-2xl、shadow-md
- 見出し：「📈 体重推移」
- Chart.js の折れ線グラフ（Line chart）
  - X軸：日付（過去30日分のダミーデータ）
  - Y軸：体重（kg）、範囲55〜75kg
  - ダミーデータ：過去30日分、58〜68kgの範囲でランダムに生成（Math.random使用）
  - ライン色：`#6366F1`、塗りつぶし：`rgba(99, 102, 241, 0.1)`
  - グリッド線：薄いグレー
  - ツールチップ：日付と体重を表示
  - グラフの高さ：350px
  - **新しく登録した体重はグラフにリアルタイム追加（Alpine.jsで連携）**

**③ 記録一覧カード**（下部）

- 白背景、rounded-2xl、shadow-md
- 見出し：「📋 記録一覧」
- テーブル：日付、体重(kg)、前日差（＋/−表示、色付き）の3列
- 直近10件のダミーデータを表示
- 各行に「削除」ボタン（Alpine.jsで行削除）

Alpine.jsの`x-data`で状態管理し、全てのデータはリアクティブに動作させること。

---

## Step 4: スクリーンショット撮影スクリプトの作成・実行

`scripts/screenshot.js` を以下の仕様で作成し、実行すること。

```
// scripts/screenshot.js の仕様：
// - puppeteer を使用
// - src/ 以下の3つのHTMLをfile://プロトコルで開く
// - 各ページを viewport 1440x900 でキャプチャ
// - screenshots/ ディレクトリを作成し login.png, register.png, mypage.png として保存
// - mypage.html はChart.jsのレンダリング完了を待つため waitForTimeout(1500) を使用
// - 各ファイルの絶対パスは path.resolve(__dirname, '../src/xxx.html') で取得
// - 実行後「✅ スクリーンショット保存完了: screenshots/」と出力
```

作成後すぐに実行すること：

```bash
node scripts/screenshot.js
```

---

## Step 5: Figmaプラグインスクリプトの生成

`scripts/generate-figma-plugin.js` を以下の仕様で作成し、実行すること。

```
// scripts/generate-figma-plugin.js の仕様：
// - screenshots/ 以下の3つのPNGをfsで読み込み base64エンコード
// - 以下の figma-import-plugin.js を生成する（プロジェクトルートに出力）
//
// 生成するfigma-import-plugin.jsの動作：
// - Figmaのプラグイン開発コンソールで実行することを想定
// - figma.createFrame() で3つのフレームを作成
//   - フレーム名: "01_ログイン", "02_新規登録", "03_マイページ"
//   - サイズ: 1440 x 900
//   - X座標: 0, 1540, 3080（横に並べる）
// - 各フレームにbase64画像をfigma.createImage()で貼り付ける
//   - image.withFills() でフレームに画像フィルを設定
// - 全フレーム作成後 figma.viewport.scrollAndZoomIntoView([...]) でズームイン
// - 最後に figma.closePlugin("✅ WeightTracker 3画面をFigmaに追加しました！") で終了
//
// 注意: base64文字列はconst IMG_LOGIN = "data:image/png;base64,xxxxx" の形式で埋め込む
// 注意: 生成されるファイルは大きくなるが問題ない
```

作成後すぐに実行すること：

```bash
node scripts/generate-figma-plugin.js
```

実行後 `figma-import-plugin.js` がプロジェクトルートに生成されていることを確認する。

---

## Step 6: Figma MCP セットアップ（Claude Code自身が使う設定）

`~/.claude.json` を確認し、`mcpServers` に以下を追加すること。  
（既存の設定を上書きしないよう注意）

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "YOUR_FIGMA_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

`.env` に記載されている `FIGMA_TOKEN` の値を `YOUR_FIGMA_PERSONAL_ACCESS_TOKEN` に入れること。  
ファイルが存在しない場合は新規作成すること。

---

## Step 7: ローカル確認用サーバーの起動確認

```bash
# npxで一時的にサーバー起動（確認用コマンドをユーザーに提示するだけでOK）
# 実際の起動はユーザーが行う
echo "確認コマンド: npx live-server src/ --port=3000"
```

---

## ✅ Claude Codeが完了後にユーザーへ伝えること

以下を箇条書きで報告すること：

1. 作成したファイル一覧
2. スクリーンショットの保存場所
3. **Figmaへの取り込み手順（手動）**：
   ```
   1. Figmaを開き、任意のファイル（新規でOK）に入る
   2. メニュー: Plugins > Development > Open console
   3. figma-import-plugin.js の全内容をコピー
   4. コンソールに貼り付けてEnterを押す
   5. 3つのフレームが自動生成される
   ```
4. Claude Code MCP設定の反映方法：
   ```
   Claude Codeを再起動するとFigma MCPが有効になります
   その後: "FigmaファイルのURLを教えてください" と聞いてください
   ```
5. ローカル確認方法：`npx live-server src/ --port=3000` を実行

---

## 補足情報

### なぜFigmaコンソール経由なのか

FigmaのREST APIは「読み取り専用」が基本であり、  
デザインノード（フレームや画像）の**書き込みはPlugin API経由のみ**対応。  
Plugin APIはFigmaアプリ内のコンソールで実行できるため、この方式を採用。

### Figma MCP（figma-developer-mcp）でできること

設定後、Claude Codeは以下が可能になる：
- FigmaファイルのコンポーネントやレイヤーをAIが解析
- デザインからコード生成の逆引き（Figma → Code）
- コンポーネント名やスタイルの確認

### トラブルシューティング

| 問題 | 対処 |
|------|------|
| puppeteerのインストールが遅い | Chromiumのダウンロード中。そのまま待つ |
| スクリーンショットが真っ白 | `waitForTimeout` を2000msに増やす |
| Figmaコンソールでエラー | コンソールを閉じて再度開き、貼り付け直す |
| Chart.jsが表示されない | CDNの読み込み完了待ちを延長する |



# 方針変更
weight-tracker/figma-import-plugin.js を作り直してください。

【現在の問題】
base64でスクリーンショット画像を埋め込んでいるため246KBになり、Figmaで実行タイムアウトする。

【新しい方針】
画像は一切使わない。Figma Plugin APIのコードで画面を再現する。

【作成するもの】
login.htmlの内容をFigma Plugin APIで描画するコード。
以下の要素をfigma.createFrame(), figma.createText(), figma.createRectangle()等で作成する。

- 背景フレーム 1440x900 (#F9FAFB)
- 中央カード 400x550 white, cornerRadius:16, shadow
- ロゴテキスト「⚖️ WeightTracker」
- 見出しテキスト「ログイン」
- メールアドレスラベル + 入力欄（角丸長方形）
- パスワードラベル + 入力欄（角丸長方形）
- ログインボタン（#6366F1、白テキスト、full width）
- 区切り線「または」
- 「新規登録はこちら」テキスト（#6366F1）

フォントはfigma.loadFontAsync({ family: "Inter", style: "Regular" })を使う。
完成したらmanifest-login.jsonも更新して。