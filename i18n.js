const translations = {
  '方寸': 'Fangcun',
  '方寸 · 舒尔特方格': 'Fangcun · Schulte Grid',
  '给注意力，一点留白': 'Make room for focus',
  '舒尔特方格 / SCHULTE TABLE': 'SCHULTE TABLE / FOCUS PRACTICE',
  '把注意力，放回眼前。': 'Find your focus. One square at a time.',
  '按顺序寻找数字，在方寸之间，练习专注。': 'Find the numbers in order. Take a moment to focus.',
  '训练区域': 'Training area',
  '方格大小': 'Grid size',
  '训练用时': 'Time elapsed',
  '按从小到大的顺序点击数字': 'Click the numbers in ascending order',
  '视线尽量停留在中心，用余光寻找数字': 'Keep your gaze near the center and use your peripheral vision.',
  '本次训练': 'This session',
  '方格规模': 'Grid size',
  '点击失误': 'Mistakes',
  '完成进度': 'Progress',
  '个人最佳': 'Personal best',
  '仅记录当前方格规模的成绩': 'Best time for the selected grid size',
  '简单三步，进入专注': 'Three steps to focus',
  '从 1 开始': 'Start with 1',
  '按从小到大的顺序点击数字。': 'Click the numbers in ascending order.',
  '保持节奏': 'Find your rhythm',
  '点错不会扣时，找到正确数字继续。': 'No time penalty for mistakes. Find the next number and continue.',
  '挑战自己': 'Challenge yourself',
  '找到全部数字，记录本次用时。': 'Find every number to record your time.',
  '不必着急。': 'Take your time.',
  '每一次专注，都算进步。': 'Every moment of focus counts.',
  '方寸之间，专注当下。': 'Small squares. A moment of focus.',
  '无需登录 · 成绩保存在此浏览器': 'No sign-in · Records saved in this browser',
  '秒': 's', '次': 'errors',
  '这是你的专注印记。准备再进一步？': 'Your best so far. Ready to go a little further?',
  '完成一次训练，留下你的第一笔记录。': 'Finish a session to set your first record.',
  '全部找到': 'All found', '下一个数字': 'Next number',
  '已找到 {done} / {total}': 'Found {done} / {total}',
  '开始训练': 'Start training', '重新排列': 'Shuffle grid',
  '准备就绪': 'Ready', '入门': 'Beginner', '轻松': 'Easy',
  '标准': 'Standard', '挑战': 'Challenge', '数字 {n}': 'Number {n}',
  '暂停训练': 'Pause', '重新挑战': 'Restart', '专注进行中': 'In progress',
  '继续训练': 'Resume', '已暂停': 'Paused', '休息一下': 'Take a breather',
  '准备好后，继续你的专注时刻。': 'Resume whenever you are ready.',
  '训练完成': 'Completed', '再挑战一次': 'Try again',
  '新的个人最佳！': 'A new personal best!', '专注训练完成': 'Session complete',
  '用时 {seconds} 秒 · 失误 {mistakes} 次': 'Time: {seconds} s · Mistakes: {mistakes}',
  '声音：开': 'Sound: on', '声音：关': 'Sound: off',
  '关闭声音': 'Turn sound off', '开启声音': 'Turn sound on'
};
let language = 'zh';
try { if (localStorage.getItem('fangcun-language') === 'en') language = 'en'; } catch {}
function t(key, values = {}) {
  let text = language === 'en' ? (translations[key] ?? key) : key;
  return text.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}
function translatePage() {
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.title = t('方寸 · 舒尔特方格');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.getElementById('language').textContent = language === 'en' ? '中文' : 'English';
  document.getElementById('language').setAttribute('aria-label', language === 'en' ? '切换到中文' : 'Switch to English');
}
