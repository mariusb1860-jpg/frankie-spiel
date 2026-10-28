// Test helpers for the Frankie game (not part of the game). Inject into a page served
// by tools/nocache_server.py:  await page.addScriptTag({ url: '/tools/test-helpers.js' })
// Everything ends up in window.T:
//   T.bot(level, { d })                     full run, jumps at distance d (px) before each target
//   T.run(level, fromX, taps, passX, opts)  one scripted attempt: 'o' passed, 'X' crash, '?' timeout
//   T.windowSeq(...) / T.dWindow(...)       sweep the timing (ms) / distance (px) of one tap
//   T.window / T.trial / T.trialTime        older single-target shortcuts
//   T.jumpProfile(level)                    apex (px) and time in the air (s) of one jump
//   T.flipTimes(index, ms)                  how long a walking animal walks per direction (ms)
//   T.startButtons() / T.stars()            start screen buttons / stars in the celebration
//   T.grownUps(on)                          paprika button (levels 6-10) or child button (1-5)
//   T.textures(keys)                        textures that are missing or empty
(function () {
  const GROUND_Y = 460;
  const TIER1 = GROUND_Y - 130;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const scene = () => window.game.scene.getScene('GameScene');

  async function waitFor(check, timeoutMs = 15000) {
    const t0 = performance.now();
    while (!check()) {
      if (performance.now() - t0 > timeoutMs) return false;
      await sleep(50);
    }
    return true;
  }

  async function startLevel(level) {
    const active = window.game.scene.getScenes(true)[0];
    active.scene.start('GameScene', { level });
    await sleep(450);
    return scene();
  }

  // Like pressing the paprika button (on = true) or the child button (on = false) on the start
  // screen; waits until the start screen shows the other levels. Needed before levels 6-10:
  // their worlds only load on the first switch.
  async function grownUps(on = true) {
    const first = on ? '6' : '1';
    window.game.scene.getScene('StartScene').switchLevels(on);
    const ok = await waitFor(() => {
      const s = window.game.scene.getScene('StartScene');
      return window.game.scene.isActive('StartScene') && s.children.list.some((o) => o.type === 'Text' && o.text === first);
    }, 30000);
    await sleep(400);
    return ok;
  }

  // Jump distances (d = target x minus Frankie x when the bot taps), tuned for levels 1-5.
  // hop: from one block to the next block of the same floor (stepping stones).
  const DEFAULT_D = { high: 114, gap: 60, tier1: 100, tier2: 70, hop: 190, obstacle: 125 };

  // current: true = play the level that is already running (started by the game itself).
  async function bot(level, { d = {}, timeoutMs = 90000, current = false } = {}) {
    const g = current ? scene() : await startLevel(level);
    const D = { ...DEFAULT_D, ...d };
    const L = g.level;
    const obstacles = g.course.obstacles.getChildren();
    const t = [];
    L.sausages.filter((s) => s.y === GROUND_Y - 160).forEach((s) => t.push({ x: s.x, d: D.high, kind: 'high' }));
    L.obstacles.forEach((o, i) => {
      const obj = obstacles[i];
      const moving = Boolean(obj.patrol || obj.roll || obj.hop);
      t.push({ x: o.x, d: D[o.kind] ?? D.obstacle, kind: o.kind, obj: moving ? obj : null });
    });
    L.gaps.forEach((gp) => t.push({ x: gp.x0, d: D.gap, kind: 'gap' }));
    L.platforms.forEach((p) => {
      // A block row that directly continues another one at the same height needs no jump.
      if (L.platforms.some((q) => q !== p && q.tier === p.tier && q.x1 === p.x0)) return;
      // A block shortly after another block of the same floor: hop across.
      const hop = L.platforms.some((q) => q !== p && q.tier === p.tier && q.x1 < p.x0 && p.x0 - q.x1 < 200);
      const kind = hop ? 'hop' : 'tier' + p.tier;
      t.push({ x: p.x0, d: D[kind], kind });
    });
    t.sort((a, b) => a.x - a.d - (b.x - b.d));
    const log = [];
    let minFps = 999;
    const t0 = performance.now();
    window.__bot = setInterval(() => {
      const s = scene();
      if (!t.length || s.crashed || s.finished) return;
      const next = t[0];
      const x = next.obj ? next.obj.x : next.x;
      if (x - s.frankie.x < next.d) {
        const onBlock = s.frankie.body.bottom <= TIER1 + 4;
        const skip = (next.kind === 'gap' && onBlock) || (next.kind === 'high' && onBlock);
        if (!skip) s.queueJump();
        log.push(`${next.kind}@${Math.round(x)}${skip ? '(skip)' : ''}`);
        t.shift();
      }
    }, 4);
    const fpsTimer = setInterval(() => {
      minFps = Math.min(minFps, Math.round(window.game.loop.actualFps));
    }, 500);
    let result = null;
    let collected = 0;
    while (!result) {
      await sleep(100);
      const s = window.game.scene.getScene('GameScene');
      if (s.sys.isActive()) collected = s.collected;
      if (window.game.scene.isActive('EatScene')) result = { ok: true };
      else if (s.sys.isActive() && s.crashed) result = { ok: false, crashAt: Math.round(s.frankie.x), last: log.slice(-3) };
      else if (performance.now() - t0 > timeoutMs) result = { ok: false, timeout: true, x: Math.round(s.frankie.x) };
    }
    clearInterval(window.__bot);
    clearInterval(fpsTimer);
    return { ...result, seconds: Math.round((performance.now() - t0) / 100) / 10, collected, total: L.sausages.length, minFps, jumps: log.length };
  }

  // One scripted attempt. Frankie starts at fromX. Taps fire in order: { x | index, d } taps
  // when the target is closer than d (index: obstacle number, its current x); a tap with
  // { sweep: true, refD } taps dt ms after its target came closer than refD.
  // passIf(scene): extra condition when Frankie passes passX (e.g. "stands on a block").
  async function run(level, fromX, taps, passX, { dt = 0, setup, delay = 0, timeoutMs = 8000, passIf } = {}) {
    const g = await startLevel(level);
    if (setup) setup(g);
    if (delay) {
      g.runningFrom = Infinity;
      await sleep(delay);
    }
    g.runningFrom = 0;
    g.frankie.x = fromX;
    let i = 0;
    let seenAt = null;
    const t0 = performance.now();
    return new Promise((resolve) => {
      const iv = setInterval(() => {
        const s = scene();
        const tap = taps[i];
        if (tap) {
          const tx = tap.index === undefined ? tap.x : s.course.obstacles.getChildren()[tap.index].x;
          const ahead = tx - s.frankie.x;
          if (tap.sweep) {
            if (seenAt === null && ahead < tap.refD) seenAt = s.time.now;
            if (seenAt !== null && s.time.now - seenAt >= dt) {
              s.queueJump();
              i++;
            }
          } else if (ahead < tap.d) {
            s.queueJump();
            i++;
          }
        }
        if (s.crashed) {
          clearInterval(iv);
          resolve('X');
        } else if (s.frankie.x > passX) {
          clearInterval(iv);
          resolve(!passIf || passIf(s) ? 'o' : 'X');
        } else if (performance.now() - t0 > timeoutMs) {
          clearInterval(iv);
          resolve('?');
        }
      }, 4);
    });
  }

  // Longest run of successes in a sweep: [first, last] value and its size.
  function longestRun(marks) {
    let best = null;
    let start = null;
    for (const [v, r] of marks) {
      if (r !== 'o') {
        start = null;
        continue;
      }
      if (start === null) start = v;
      if (!best || v - start > best[1] - best[0]) best = [start, v];
    }
    return { range: best, size: best ? best[1] - best[0] : -1, marks: marks.map(([, r]) => r).join('') };
  }

  // Sweeps dt (ms) of the tap marked { sweep: true }.
  async function windowSeq(level, fromX, taps, passX, { from = 0, to = 800, step = 20, ...opts } = {}) {
    const marks = [];
    for (let dt = from; dt <= to; dt += step) marks.push([dt, await run(level, fromX, taps, passX, { ...opts, dt })]);
    return longestRun(marks);
  }

  // Sweeps the distance d (px) of the tap marked { sweep: true } (it becomes a plain d tap).
  async function dWindow(level, fromX, taps, passX, { from = -80, to = 240, step = 10, ...opts } = {}) {
    const marks = [];
    for (let d = from; d <= to; d += step) {
      const list = taps.map((t) => (t.sweep ? { ...t, sweep: false, d } : t));
      marks.push([d, await run(level, fromX, list, passX, opts)]);
    }
    return longestRun(marks);
  }

  // Older single-target recipes (target: x number or { index }).
  const one = (target) => (typeof target === 'number' ? { x: target } : target);
  const trial = (level, fromX, target, d, passX, opts) => run(level, fromX, [{ ...one(target), d }], passX, opts);
  const trialTime = (level, fromX, target, refD, dt, passX, opts) =>
    run(level, fromX, [{ ...one(target), sweep: true, refD }], passX, { ...opts, dt });
  async function window_(level, fromX, target, refD, passX, opts) {
    const r = await windowSeq(level, fromX, [{ ...one(target), sweep: true, refD }], passX, opts);
    return { ms: r.size, range: r.range, marks: r.marks };
  }

  // One jump from flat ground: apex above the ground (px) and time in the air (s).
  // Landing counts only back at ground level (touching a sausage also sets touching.down).
  async function jumpProfile(level, x = 400) {
    const g = await startLevel(level);
    g.runningFrom = 0;
    g.frankie.x = x;
    await sleep(250);
    const ground = g.frankie.body.bottom;
    let minBottom = ground;
    let t0 = null;
    g.queueJump();
    return new Promise((resolve) => {
      const iv = setInterval(() => {
        const s = scene();
        const b = s.frankie.body;
        if (t0 === null && b.velocity.y < 0) t0 = s.time.now;
        minBottom = Math.min(minBottom, b.bottom);
        if (t0 !== null && s.time.now - t0 > 100 && b.bottom >= ground - 0.5 && (b.blocked.down || b.touching.down)) {
          clearInterval(iv);
          resolve({ apex: Math.round(ground - minBottom), air: Math.round(s.time.now - t0) / 1000 });
        }
      }, 2);
    });
  }

  // Stops Frankie and measures how long a walking animal walks in one direction (ms, scene clock).
  async function flipTimes(index, ms) {
    const s = scene();
    s.runningFrom = Infinity;
    s.frankie.setVelocityX(0);
    const o = s.course.obstacles.getChildren()[index];
    const turns = [];
    let last = o.flipX;
    const t0 = performance.now();
    while (performance.now() - t0 < ms) {
      await sleep(4);
      if (o.flipX !== last) {
        last = o.flipX;
        turns.push(s.time.now);
      }
    }
    return turns.slice(1).map((t, i) => Math.round(t - turns[i]));
  }

  // Level buttons on the start screen: open ones (number, x, pulsing?) and locked ones (x).
  function startButtons() {
    const s = window.game.scene.getScene('StartScene');
    const list = s.children.list;
    const open = list
      .filter((o) => o.type === 'Text' && /^\d+$/.test(o.text))
      .map((o) => ({ n: Number(o.text), x: Math.round(o.x), pulse: s.tweens.getTweensOf(o).length > 0 }));
    const locked = list.filter((o) => o.texture?.key === 'btn-level-locked').map((o) => Math.round(o.x));
    return { open, locked };
  }

  function stars() {
    return window.game.scene.getScene('VictoryScene').children.list.filter((o) => o.texture?.key === 'star-big').length;
  }

  // Missing or fully transparent textures (an SVG with an error stays empty).
  function textures(keys) {
    const tm = window.game.textures;
    const bad = [];
    for (const key of keys) {
      if (!tm.exists(key)) {
        bad.push(`${key}: missing`);
        continue;
      }
      const img = tm.get(key).getSourceImage();
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let filled = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) filled++;
      if (filled === 0) bad.push(`${key}: empty`);
    }
    return bad;
  }

  window.T = {
    bot, run, windowSeq, dWindow, window: window_, trial, trialTime, jumpProfile, flipTimes,
    startButtons, stars, textures, startLevel, grownUps, waitFor, sleep,
  };
})();
