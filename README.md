# 方寸 · 舒尔特方格 / Fangcun · Schulte Grid

[在线游玩 / Play online](https://hy031116.github.io/Sample-Schulte-Grid/)

[中文说明](#中文说明) · [English](#english)

## 中文说明

一个轻量的中文舒尔特方格游戏。按从小到大的顺序寻找数字，完成一轮专注练习。

## 开始使用

下载仓库后，用现代浏览器打开 `index.html`，点击「开始训练」。无需安装依赖、无需登录。

点击开始后，依次点击 1、2、3，直到找到全部数字。点错会记录失误，但不会增加惩罚时间。点击「暂停训练」可休息，点击「继续训练」恢复计时。切换方格规模或重新排列会重置当前一轮。

- 支持 3×3、4×4、5×5、6×6 四种规模。
- 支持计时、暂停、重新排列、失误统计和可选音效。
- 切换到后台时自动暂停。
- 按方格规模分别保存个人最佳成绩。
- 支持手机布局和键盘 Tab / Enter 操作。
- 点击页头 English / 中文 切换语言；选择会自动保存，切换不重置训练。

成绩保存在当前浏览器的 localStorage 中；清理浏览器数据会清除成绩。若浏览器限制本地文件存储，仍可正常游戏，但成绩可能无法保存。页面字体会尝试从 Google Fonts 加载，离线时使用系统字体。

## 本地开发

直接编辑源文件并刷新页面即可：

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面结构与中文文案 |
| `style.css` | 样式、响应式布局与动效 |
| `app.js` | 游戏状态、计时和成绩保存 |
| `i18n.js` | 中英翻译与语言偏好 |
| `tests/game.test.cjs` | 无依赖的游戏逻辑回归检查 |

安装 Node.js 22 或更高版本后运行：

```sh
npm test
```

测试不需要 `npm install`。GitHub Actions 在推送和拉取请求时执行同一组检查。

测试使用模拟 DOM 验证游戏逻辑，不代替真实浏览器的视觉、音效及存储验证。提交前还应检查手机布局、完整通关、后台暂停和刷新后的成绩恢复。

## 反馈与维护

发现问题请在 [Issues](https://github.com/HY031116/Sample-Schulte-Grid/issues) 中提供复现步骤、浏览器版本、屏幕尺寸及截图。修改流程见 [CONTRIBUTING.md](CONTRIBUTING.md)，版本变化见 [CHANGELOG.md](CHANGELOG.md)。

## English

A lightweight Schulte grid game for a short focus practice. The game supports Chinese and English. Use the language button in the header to switch at any time. Your choice is saved in this browser, and switching languages preserves the current session.

### Play

Open the [online game](https://hy031116.github.io/Sample-Schulte-Grid/), or download this repository and open `index.html` in a modern browser. No account, installation, or build step is required.

1. Choose a grid size: 3×3, 4×4, 5×5, or 6×6.
2. Select **开始训练 (Start training)** to start the timer.
3. Click the numbers in ascending order, starting at 1. Find every number to finish.

An incorrect click increases the mistake counter without adding a time penalty. Select **暂停训练 (Pause)** to take a break and **继续训练 (Resume)** to continue. Switching grid sizes or selecting **重新排列 / 重新挑战 (Shuffle / Restart)** resets the current round.

### Features and controls

- Timer, progress display, mistake counter, and optional sound via **声音 (Sound)**.
- Automatic pause when the page goes into the background.
- Personal best times stored separately for each grid size.
- Responsive mobile layout and keyboard navigation with Tab and Enter.

Best times are saved in this browser's localStorage. Clearing browser data removes them. If your browser restricts storage for local files, the game still works, but records may not persist. The page attempts to load a font from Google Fonts and falls back to system fonts when offline.

### Development and testing

Edit the source files and refresh the page:

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and Chinese interface text |
| `style.css` | Styling, responsive layouts, and motion |
| `app.js` | Game state, timer, and saved records |
| `i18n.js` | Chinese/English translations and language preference |
| `tests/game.test.cjs` | Dependency-free game logic regression tests |

With Node.js 22 or newer, run `npm test`. No `npm install` is required. GitHub Actions runs these checks on pushes and pull requests.

Tests use a simulated DOM. Before submitting changes, also check the layout on desktop and mobile, keyboard controls, sound, a complete round, background pausing, and saved records after reloading in a real browser.

### Feedback and maintenance

Report problems in [Issues](https://github.com/HY031116/Sample-Schulte-Grid/issues), including reproduction steps, browser version, screen size, and screenshots where useful. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [CHANGELOG.md](CHANGELOG.md) for release notes.

### GitHub Pages

The Pages workflow tests the game and publishes only `index.html`, `style.css`, `i18n.js`, and `app.js` when changes are pushed to `main`. It can also be started manually from the Actions tab. Pull requests run checks without publishing.
