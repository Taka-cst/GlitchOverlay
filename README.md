# インターンシップで使用するためのJSです。
Calude Sonnet 4使用
# Glitch Overlay

リアルタイムで動作するグリッチエフェクトライブラリです。ウェブページに映画やゲームのようなクールなグリッチ効果を簡単に追加できます。

## ✨ 主な機能

- 🎨 **カスタマイズ可能な色設定** - スキャンライン、ノイズ、RGB チャンネルの色を自由に変更
- ⚡ **高パフォーマンス** - Canvas を使用した軽量なレンダリング
- 🎛️ **詳細な設定オプション** - 強度、頻度、タイミングを細かく調整可能
- 📱 **レスポンシブ対応** - デバイスサイズに自動適応
- 🔧 **簡単な API** - 直感的なメソッドで簡単に制御

## 🚀 使い方

### 基本的な使用方法

HTMLファイルの `</html>` タグの直前にスクリプトを読み込むだけです：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- あなたのコンテンツ -->
    <h1>Hello World!</h1>
    
    <!-- Glitch Overlay を追加 -->
    <script src="noise.js"></script>
</body>
</html>
```

これだけで自動的にグリッチエフェクトが開始されます！

### 手動制御

自動開始を無効にして手動で制御したい場合：

```javascript
// 自動開始を停止
GlitchUtils.stop();

// カスタム設定でグリッチを開始
const glitch = GlitchUtils.start({
    intensity: 0.7,
    randomTiming: true,
    colors: {
        scanline: '#ff0000',
        noise: '#ffffff',
        glitchR: '#ff0000',
        glitchG: '#00ff00',
        glitchB: '#0000ff'
    }
});

// 一時的な強いグリッチエフェクト
GlitchUtils.burst(2000); // 2秒間
```

## ⚙️ 設定オプション

```javascript
const options = {
    // 基本設定
    intensity: 0.5,              // エフェクトの強度 (0.0 - 1.0)
    noiseAmount: 0.1,            // ノイズの量
    glitchFrequency: 2000,       // グリッチの発生間隔（ミリ秒）
    scanlineSpeed: 0.5,          // スキャンラインの速度
    colorShift: true,            // 色収差エフェクトの有効/無効
    randomTiming: true,          // ランダムタイミングの有効/無効
    
    // 色設定
    colors: {
        scanline: '#00ff00',     // スキャンラインの色
        noise: '#ffffff',        // ノイズの色
        glitchR: '#ff0000',      // グリッチ赤チャンネル
        glitchG: '#00ff00',      // グリッチ緑チャンネル
        glitchB: '#0000ff',      // グリッチ青チャンネル
        aberration: '#ff00ff'    // 色収差の色
    },
    
    // ランダムタイミング設定
    randomRange: {
        frequencyMin: 1000,      // 最小発生間隔（ミリ秒）
        frequencyMax: 4000,      // 最大発生間隔（ミリ秒）
        durationMin: 100,        // 最小持続時間（ミリ秒）
        durationMax: 500         // 最大持続時間（ミリ秒）
    }
};

GlitchUtils.start(options);
```

## 🎮 API リファレンス

### GlitchUtils

| メソッド | 説明 |
|---------|------|
| `start(options)` | グリッチエフェクトを開始 |
| `stop()` | グリッチエフェクトを停止 |
| `burst(duration)` | 指定時間だけ強いエフェクトを実行 |
| `setColors(colors)` | 色設定を動的に変更 |
| `setRandomRange(range)` | ランダムタイミング設定を変更 |

### GlitchOverlay クラス

直接インスタンスを作成することも可能です：

```javascript
const glitch = new GlitchOverlay({
    intensity: 0.8,
    colors: { scanline: '#ff00ff' }
});

// 強度を変更
glitch.setIntensity(0.3);

// 色を変更
glitch.setColors({ noise: '#ffff00' });

// 停止
glitch.stop();
```

## 🎨 使用例

### レトロゲーム風

```javascript
GlitchUtils.start({
    intensity: 0.6,
    colors: {
        scanline: '#00ff00',
        glitchR: '#ff0000',
        glitchG: '#00ff00',
        glitchB: '#0000ff'
    },
    randomRange: {
        frequencyMin: 500,
        frequencyMax: 1500
    }
});
```

### サイバーパンク風

```javascript
GlitchUtils.start({
    intensity: 0.8,
    colors: {
        scanline: '#ff00ff',
        noise: '#00ffff',
        aberration: '#ff0080'
    },
    randomTiming: true
});
```

### 映画風ホラー

```javascript
GlitchUtils.start({
    intensity: 0.4,
    colors: {
        scanline: '#800000',
        noise: '#ffffff',
        glitchR: '#ff0000'
    },
    randomRange: {
        frequencyMin: 3000,
        frequencyMax: 8000,
        durationMin: 50,
        durationMax: 200
    }
});
```

## 🔧 カスタマイズ

### 特定の要素でのみ動作させる

デフォルトでは全画面にエフェクトが適用されますが、特定の要素に限定することも可能です（コードの修正が必要）。

### モバイル対応

自動的にデバイスピクセル比に対応し、モバイルデバイスでも最適に動作します。

## 📋 システム要件

- モダンブラウザ（Chrome 60+、Firefox 55+、Safari 12+、Edge 79+）
- Canvas 2D API サポート
- ES6 対応

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

*バグではありません、仕様です* 🐛✨
