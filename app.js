class ZeroGBreakdownEngine {
  constructor() {
    this.domains = {
      academic: {
        label: "學術研究",
        keywords: ["文獻", "閱讀", "論文", "研究", "資料", "報告"],
        tasks: [
          "打開文獻檔案並閱讀前言 3 分鐘",
          "快速標出摘要中的 3 個關鍵字",
          "在筆記上記錄本篇文獻的核心研究問題",
          "將本節最重要的一點用一句話摘要",
          "查找並下載 1 篇相關的參考文獻",
          "快速翻閱目錄與小標，建立全書架構認知",
          "在文獻中找出 2 個不理解的學術名詞並檢索其定義",
          "將作者的主要論點列出 3 個項目 (bullet points)",
          "對比另一篇同領域文獻，寫下 1 個相似或相異之處",
          "把目前讀到的精華想法用一句話寫在便利貼上"
        ]
      },
      project: {
        label: "專案規劃",
        keywords: ["專案", "程式", "開發", "網站", "app", "系統", "功能"],
        tasks: [
          "新建專案資料夾並建立核心檔案",
          "列出本專案最核心的 3 個主要功能模組",
          "撰寫第一個模組的偽代碼大綱",
          "編譯或執行初始骨架，確保環境通暢",
          "設計資料庫或資料結構的 4 個核心欄位",
          "畫出用戶操作流程的簡易草圖",
          "在紙上列出專案可能遇到的 2 個最大技術難點",
          "撰寫 README.md 並寫下專案目標與啟動指令",
          "建立一個待辦清單 (Todo list)，並排出優先級",
          "完成第一個介面按鈕的 HTML/CSS 排版"
        ]
      },
      exam: {
        label: "考試準備",
        keywords: ["考試", "背", "準備", "複習", "題目", "名詞"],
        tasks: [
          "打開課本或講義，選出今天最想複習的 5 個名詞",
          "背誦或默寫這 5 個名詞的定義",
          "挑選 3 題錯題或模擬選擇題進行練習",
          "閉上眼睛 2 分鐘，快速回想剛剛複習的重點",
          "翻到課本隨機一頁，快速閱讀 1 個圖表或案例",
          "拿出一張空白紙，畫出本章的核心概念心智圖",
          "找出 1 個常考的公式或法條，大聲朗讀 3 遍",
          "用自己的話向虛擬對象解釋這章最難的概念",
          "做 1 組 5 題的閃卡 (Flashcards) 自我測試",
          "記錄今天的強項與弱點，排定明日複習順序"
        ]
      },
      admin: {
        label: "生活行政",
        keywords: ["核銷", "行政", "整理", "報帳", "收據", "發票", "申請"],
        tasks: [
          "打開檔案總管，建立核銷單據資料夾",
          "將發票或收據拍照或掃描並歸檔至該資料夾",
          "打開核銷試算表填寫前 2 筆費用明細",
          "檢查單據金額是否正確並存檔備用",
          "登入行政系統，確認本次核銷或申請的時程限制",
          "草擬一封給承辦人員或小隊員的進度確認信",
          "將桌面雜亂的單據依照日期進行簡單排序",
          "檢查信箱是否有漏掉的繳費或回信通知",
          "填寫申請表單的第一部分（基本資料與連絡方式）",
          "把需要紙本簽名的文件列印並放在包包裡"
        ]
      },
      general: {
        label: "通用規劃",
        keywords: [],
        tasks: [
          "找一張白紙，列出眼前最重要的一件事",
          "做這件事之前，先深呼吸並準備好需要的工具",
          "開始執行最簡單的第一步，限時 5 分鐘",
          "在紙上記錄目前的進度，準備下一棒的微任務",
          "把桌面上的垃圾清空，只留下目前任務需要的物品",
          "關閉瀏覽器中所有與當前任務無關的分頁",
          "將手機設為靜音或番茄鐘模式，放置於視線之外",
          "寫下完成這項工作後，你想給自己的 1 個小獎勵",
          "把目前最棘手的問題拆成 3 個是非題",
          "列出這個目標中你絕對不需要做的 3 件事以減輕負擔"
        ]
      }
    };
  }

  breakdown(goal, selectedDomain = "auto") {
    const domainKey = selectedDomain === "auto" ? this.detectDomain(goal) : selectedDomain;
    const domain = this.domains[domainKey] || this.domains.general;

    // 預設抓前 4 個任務作為初始值，使用者可點擊隨機換一批
    const selectedTasks = domain.tasks.slice(0, 4);

    return selectedTasks.map((text, index) => ({
      id: `${domainKey}-${Date.now()}-${index}`,
      text,
      completed: false,
      domain: domain.label,
      domainKey: domainKey
    }));
  }

  detectDomain(goal) {
    const normalizedGoal = goal.toLowerCase();
    const candidates = Object.entries(this.domains).filter(([key]) => key !== "general");

    let bestMatch = "general";
    let bestScore = 0;

    candidates.forEach(([key, domain]) => {
      const score = domain.keywords.reduce((total, keyword) => {
        return total + (normalizedGoal.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    });

    return bestMatch;
  }
}

class ParticlePool {
  constructor(limit = 240) {
    this.limit = limit;
    this.items = [];
  }

  spawn(options = {}) {
    let particle = this.items.find((item) => !item.active);
    if (!particle) {
      if (this.items.length >= this.limit) {
        return null;
      }
      particle = {};
      this.items.push(particle);
    }

    Object.assign(particle, {
      active: true,
      age: 0,
      life: 1,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 2,
      alpha: 1,
      color: "rgba(255,255,255,0.7)",
      rotation: 0,
      rotationSpeed: 0,
      spin: 0,
      drift: 0,
      type: "dust"
    }, options);

    return particle;
  }

  step(dt, updateFn) {
    for (const particle of this.items) {
      if (!particle.active) continue;
      updateFn(particle, dt);
      particle.age += dt;
      if (particle.age >= particle.life || particle.active === false) {
        particle.active = false;
      }
    }
  }

  draw(context, drawFn) {
    for (const particle of this.items) {
      if (particle.active) {
        drawFn(context, particle);
      }
    }
  }

  burst(x, y, count, options = {}) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + (options.angleOffset || 0);
      const speed = options.speed || (40 + Math.random() * 90);
      this.spawn({
        x,
        y,
        vx: Math.cos(angle) * speed * (0.7 + Math.random() * 0.6),
        vy: Math.sin(angle) * speed * (0.7 + Math.random() * 0.6),
        life: options.life || 0.9 + Math.random() * 0.55,
        size: options.size ? options.size() : 1.5 + Math.random() * 2.5,
        alpha: options.alpha || 0.9,
        color: options.color || "rgba(255,255,255,0.72)",
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: -2 + Math.random() * 4,
        drift: options.drift || 0,
        type: options.type || "spark"
      });
    }
  }
}

class AmbientAudioController {
  constructor() {
    this.context = null;
    this.playing = false;
    this.activeType = "none";
    this.volume = 0.35;
    this.cleanup = [];
    this.master = null;
  }

  async toggle(type) {
    if (this.playing) {
      this.stop();
      return false;
    }

    await this.start(type);
    return this.playing;
  }

  async start(type) {
    if (!type || type === "none") {
      return false;
    }

    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }

    await this.context.resume();
    this.stop(false);

    this.activeType = type;
    this.playing = true;
    this.master = this.context.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.context.destination);

    if (type === "breeze") {
      this.startBreeze();
    } else if (type === "sea") {
      this.startSea();
    } else if (type === "rain") {
      this.startRain();
    }

    return true;
  }

  stop(updateState = true) {
    this.cleanup.forEach((dispose) => {
      try {
        dispose();
      } catch (error) {
        // ignore cleanup errors
      }
    });
    this.cleanup = [];

    if (this.master) {
      try {
        this.master.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
      this.master = null;
    }

    this.playing = false;
    this.activeType = "none";

    if (updateState) {
      updateAudioButton();
    }
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(volume, this.context.currentTime, 0.03);
    }
  }

  createNoiseBuffer(durationSeconds = 2) {
    const sampleRate = this.context.sampleRate;
    const length = Math.floor(sampleRate * durationSeconds);
    const buffer = this.context.createBuffer(1, length, sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  createSource(durationSeconds = 2) {
    const source = this.context.createBufferSource();
    source.buffer = this.createNoiseBuffer(durationSeconds);
    source.loop = true;
    return source;
  }

  connectNode(node) {
    this.cleanup.push(() => {
      try {
        node.disconnect();
      } catch (error) {
        // ignore disconnect errors
      }
    });
    return node;
  }

  registerStop(node) {
    this.cleanup.push(() => {
      try {
        node.stop();
      } catch (error) {
        // ignore stop errors
      }
    });
    return node;
  }

  startBreeze() {
    const source = this.registerStop(this.createSource(2.2));
    const bandpass = this.connectNode(this.context.createBiquadFilter());
    const lowpass = this.connectNode(this.context.createBiquadFilter());
    const gain = this.connectNode(this.context.createGain());
    const lfo = this.registerStop(this.context.createOscillator());
    const lfoGain = this.connectNode(this.context.createGain());

    bandpass.type = "bandpass";
    bandpass.frequency.value = 420;
    bandpass.Q.value = 0.7;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1200;
    gain.gain.value = 0.18;
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 220;

    source.connect(bandpass).connect(lowpass).connect(gain).connect(this.master);
    lfo.connect(lfoGain).connect(bandpass.frequency);
    lfo.start();
    source.start();
  }

  startSea() {
    const source = this.registerStop(this.createSource(3));
    const lowpass = this.connectNode(this.context.createBiquadFilter());
    const gain = this.connectNode(this.context.createGain());
    const lfo = this.registerStop(this.context.createOscillator());
    const lfoGain = this.connectNode(this.context.createGain());

    lowpass.type = "lowpass";
    lowpass.frequency.value = 480;
    gain.gain.value = 0.16;
    lfo.type = "sine";
    lfo.frequency.value = 0.16;
    lfoGain.gain.value = 0.08;

    source.connect(lowpass).connect(gain).connect(this.master);
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    source.start();
  }

  startRain() {
    const source = this.registerStop(this.createSource(1.4));
    const highpass = this.connectNode(this.context.createBiquadFilter());
    const gain = this.connectNode(this.context.createGain());
    const lfo = this.registerStop(this.context.createOscillator());
    const lfoGain = this.connectNode(this.context.createGain());

    highpass.type = "highpass";
    highpass.frequency.value = 1800;
    gain.gain.value = 0.11;
    lfo.type = "sine";
    lfo.frequency.value = 0.32;
    lfoGain.gain.value = 0.04;

    source.connect(highpass).connect(gain).connect(this.master);
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    source.start();

    const dropTimer = window.setInterval(() => {
      if (!this.playing || this.activeType !== "rain" || !this.context) {
        return;
      }
      const now = this.context.currentTime;
      const peak = 0.16 + Math.random() * 0.1;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    }, 180 + Math.random() * 120);

    this.cleanup.push(() => window.clearInterval(dropTimer));
  }
}

const engine = new ZeroGBreakdownEngine();
const ambientAudio = new AmbientAudioController();

const dom = {
  bgCanvas: document.querySelector("#bgCanvas"),
  orbitCanvas: document.querySelector("#orbitCanvas"),
  goalInput: document.querySelector("#goalInput"),
  categorySelect: document.querySelector("#categorySelect"),
  breakdownButton: document.querySelector("#breakdownButton"),
  addTaskButton: document.querySelector("#addTaskButton"),
  batchImportButton: document.querySelector("#batchImportButton"),
  batchImportArea: document.querySelector("#batchImportArea"),
  batchInput: document.querySelector("#batchInput"),
  confirmBatchImport: document.querySelector("#confirmBatchImport"),
  cancelBatchImport: document.querySelector("#cancelBatchImport"),
  clearAllButton: document.querySelector("#clearAllButton"),
  exportButton: document.querySelector("#exportButton"),
  taskList: document.querySelector("#taskList"),
  taskSummary: document.querySelector("#taskSummary"),
  feedbackText: document.querySelector("#feedbackText"),
  breathBubble: document.querySelector("#breathBubble"),
  breathModeSelect: document.querySelector("#breathModeSelect"),
  breathPhaseLabel: document.querySelector("#breathPhaseLabel"),
  breathHint: document.querySelector("#breathHint"),
  ambientSelect: document.querySelector("#ambientSelect"),
  ambientVolume: document.querySelector("#ambientVolume"),
  ambientToggleButton: document.querySelector("#ambientToggleButton"),
  overloadButton: document.querySelector("#overloadButton")
};

const bgContext = dom.bgCanvas.getContext("2d");
const orbitContext = dom.orbitCanvas.getContext("2d");

const BREATH_MODES = {
  none: {
    label: "呼吸休息",
    hint: "先讓節奏慢一點，等一下再前進也可以。",
    phases: [
      { key: "rest", label: "呼吸休息", hint: "先讓節奏慢一點。", duration: 6000, scale: 0.96, motion: 0.42, opacity: 0.72, wave: 0.45 }
    ]
  },
  "478": {
    label: "4-7-8",
    hint: "吸氣 4 秒、屏息 7 秒、呼氣 8 秒。",
    phases: [
      { key: "inhale", label: "吸氣中...", hint: "讓空氣先進來。", duration: 4000, scale: 1.18, motion: 1.25, opacity: 1, wave: 1.1 },
      { key: "hold", label: "屏息中...", hint: "先穩住，不用趕。", duration: 7000, scale: 1.18, motion: 0.16, opacity: 0.9, wave: 0.32 },
      { key: "exhale", label: "呼氣中...", hint: "慢慢把力氣放掉。", duration: 8000, scale: 0.9, motion: 0.72, opacity: 0.98, wave: 0.66 }
    ]
  },
  "44": {
    label: "4-4",
    hint: "吸氣 4 秒、屏息 4 秒、呼氣 4 秒、屏息 4 秒。",
    phases: [
      { key: "inhale", label: "吸氣中...", hint: "先把空氣帶進來。", duration: 4000, scale: 1.14, motion: 1.18, opacity: 1, wave: 1.05 },
      { key: "hold-a", label: "屏息中...", hint: "讓節奏停在這裡。", duration: 4000, scale: 1.14, motion: 0.2, opacity: 0.92, wave: 0.36 },
      { key: "exhale", label: "呼氣中...", hint: "慢慢放鬆就好。", duration: 4000, scale: 0.92, motion: 0.7, opacity: 0.98, wave: 0.64 },
      { key: "hold-b", label: "屏息中...", hint: "留一點空白給自己。", duration: 4000, scale: 0.92, motion: 0.22, opacity: 0.9, wave: 0.34 }
    ]
  }
};

const state = {
  tasks: [],
  overloadActive: false,
  activeBreathMode: "none",
  bgWidth: 0,
  bgHeight: 0,
  orbitWidth: 0,
  orbitHeight: 0,
  lastFrame: 0,
  bgSpawnCarry: 0,
  bgWavePhase: 0,
  orbitPulse: 0,
  taskTransitions: new Map(),
  bubbles: new ParticlePool(260),
  orbitParticles: new ParticlePool(180)
};

function resizeCanvas(canvas, context) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function resizeCanvases() {
  const bgSize = resizeCanvas(dom.bgCanvas, bgContext);
  const orbitSize = resizeCanvas(dom.orbitCanvas, orbitContext);
  state.bgWidth = bgSize.width;
  state.bgHeight = bgSize.height;
  state.orbitWidth = orbitSize.width;
  state.orbitHeight = orbitSize.height;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function getCurrentBreathMode() {
  return BREATH_MODES[state.activeBreathMode] || BREATH_MODES.none;
}

function computeBreathState(now) {
  const mode = getCurrentBreathMode();
  const phases = mode.phases;
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  const cycleTime = totalDuration === 0 ? 0 : now % totalDuration;
  let cursor = 0;
  let selectedPhase = phases[0];
  let phaseStart = 0;

  for (const phase of phases) {
    const nextCursor = cursor + phase.duration;
    if (cycleTime < nextCursor) {
      selectedPhase = phase;
      phaseStart = cursor;
      break;
    }
    cursor = nextCursor;
  }

  const rawProgress = selectedPhase.duration === 0 ? 0 : (cycleTime - phaseStart) / selectedPhase.duration;
  const phaseProgress = clamp(rawProgress, 0, 1);
  const eased = easeInOutCubic(phaseProgress);
  const bubbleScale = mode === BREATH_MODES.none
    ? 0.96
    : selectedPhase.key.includes("hold")
      ? selectedPhase.scale
      : selectedPhase.key === "inhale"
        ? 0.88 + (selectedPhase.scale - 0.88) * eased
        : 1.14 - (1.14 - selectedPhase.scale) * eased;

  return {
    modeLabel: mode.label,
    hint: mode.hint,
    phaseLabel: selectedPhase.label,
    phaseHint: selectedPhase.hint,
    phaseKey: selectedPhase.key,
    phaseProgress,
    scale: bubbleScale,
    motion: selectedPhase.motion,
    opacity: selectedPhase.opacity,
    wave: selectedPhase.wave
  };
}

function updateBreathBubble(breathState) {
  dom.breathPhaseLabel.textContent = breathState.phaseLabel;
  dom.breathHint.textContent = breathState.phaseHint;
  dom.breathBubble.style.setProperty("--bubble-scale", String(breathState.scale));
  dom.breathBubble.style.setProperty("--bubble-opacity", String(breathState.opacity));
}

function setFeedback(message) {
  dom.feedbackText.textContent = message;
}

function updateSummary() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.completed).length;
  dom.taskSummary.textContent = total === 0 ? "尚未拆解" : `${completed}/${total} 已完成`;
}

function getFocusTaskId() {
  const focusTask = state.tasks.find((task) => !task.completed);
  return focusTask ? focusTask.id : null;
}

function renderTasks() {
  dom.taskList.innerHTML = "";

  if (state.tasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "還沒有微米任務。輸入一個大目標，讓它先變輕一點。";
    dom.taskList.append(empty);
    updateSummary();
    return;
  }

  const focusId = state.overloadActive ? getFocusTaskId() : null;

  state.tasks.forEach((task) => {
    const item = document.createElement("article");
    item.className = "task-item";
    item.classList.toggle("completed", task.completed);
    item.classList.toggle("focus-task", focusId === task.id);
    item.dataset.taskId = task.id;

    const toggle = document.createElement("button");
    toggle.className = "task-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", task.completed ? "標記為未完成" : "標記為完成");
    toggle.textContent = task.completed ? "✓" : "";
    toggle.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("div");
    text.className = "task-text";
    text.contentEditable = "true";
    text.spellcheck = false;
    text.textContent = task.text;
    text.addEventListener("blur", () => updateTaskText(task.id, text.textContent));
    text.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        text.blur();
      }
    });

    const shuffle = document.createElement("button");
    shuffle.className = "shuffle-task";
    shuffle.type = "button";
    shuffle.setAttribute("aria-label", "隨機換一個任務");
    shuffle.textContent = "⟳";
    shuffle.addEventListener("click", () => shuffleTask(task.id));

    const remove = document.createElement("button");
    remove.className = "delete-task";
    remove.type = "button";
    remove.setAttribute("aria-label", "刪除任務");
    remove.textContent = "×";
    remove.addEventListener("click", () => deleteTask(task.id));

    item.append(toggle, text, shuffle, remove);
    dom.taskList.append(item);
  });

  updateSummary();
}

function spawnOrbitBurst(x, y, palette = "rgba(255,255,255,0.72)") {
  state.orbitParticles.burst(x, y, 12, {
    color: palette,
    speed: 58,
    life: 0.85,
    size: () => 1 + Math.random() * 2.2,
    drift: 12
  });
}

function getOrbitPoint(index, total, completed, now) {
  const width = state.orbitWidth || dom.orbitCanvas.width;
  const height = state.orbitHeight || dom.orbitCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const count = Math.max(total, 1);
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2 + (now / 10000) * 0.28;
  const baseRadiusX = completed ? 62 : 104;
  const baseRadiusY = completed ? 36 : 60;
  const orbitStretch = index % 2 === 0 ? 1 : 1.18;

  return {
    x: centerX + Math.cos(angle) * baseRadiusX * orbitStretch,
    y: centerY + Math.sin(angle) * baseRadiusY * orbitStretch,
    angle,
    centerX,
    centerY
  };
}

function markTransitionForCompletion(task, index, now) {
  const total = Math.max(state.tasks.length, 1);
  const point = getOrbitPoint(index, total, false, now);
  state.taskTransitions.set(task.id, {
    start: now,
    fromX: point.x,
    fromY: point.y
  });
  spawnOrbitBurst(point.x, point.y, "rgba(255,255,255,0.78)");
  state.orbitPulse = 1;
}

function toggleTask(id) {
  const previousTask = state.tasks.find((task) => task.id === id);
  const now = performance.now();

  state.tasks = state.tasks.map((task) => {
    if (task.id !== id) return task;
    return { ...task, completed: !task.completed };
  });

  const nextTask = state.tasks.find((task) => task.id === id);
  if (nextTask?.completed && previousTask && !previousTask.completed) {
    markTransitionForCompletion(nextTask, state.tasks.findIndex((task) => task.id === id), now);
    setFeedback("很好，這一步已經被你輕輕放下了。");
  } else {
    state.taskTransitions.delete(id);
    setFeedback("這一步的狀態已更新。");
  }

  renderTasks();
}

function updateTaskText(id, nextText) {
  const trimmedText = nextText.trim();

  state.tasks = state.tasks.map((task) => {
    if (task.id !== id) return task;
    return { ...task, text: trimmedText || task.text };
  });

  renderTasks();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  state.taskTransitions.delete(id);
  setFeedback("已移除這一步，清單又更輕一點。");
  renderTasks();
}

function shuffleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;

  const domainKey = task.domainKey || "general";
  const pool = engine.domains[domainKey]?.tasks || engine.domains.general.tasks;

  const currentTexts = state.tasks.map((t) => t.text);
  const available = pool.filter((text) => !currentTexts.includes(text));

  const candidates = available.length > 0 ? available : pool;
  const newText = candidates[Math.floor(Math.random() * candidates.length)];

  state.tasks = state.tasks.map((t) => {
    if (t.id !== id) return t;
    return { ...t, text: newText };
  });

  setFeedback("已為您隨機更換一個新的微米任務。");
  renderTasks();
}

function addTask() {
  state.tasks = [
    ...state.tasks,
    {
      id: `custom-${Date.now()}`,
      text: "寫下一個 5 分鐘內可以開始的小動作",
      completed: false,
      domain: "自訂"
    }
  ];
  setFeedback("新增了一個空白小步，點文字就能改。");
  renderTasks();
}

function handleBreakdown() {
  const goal = dom.goalInput.value.trim();

  if (!goal) {
    setFeedback("先寫一句大目標就好，不需要一次想完整。");
    dom.goalInput.focus();
    return;
  }

  state.tasks = engine.breakdown(goal, dom.categorySelect.value);
  state.taskTransitions.clear();
  state.orbitPulse = 1;
  const firstDomain = state.tasks[0]?.domain || "通用規劃";
  setFeedback(`已用「${firstDomain}」拆成幾個可以馬上開始的小步。`);
  renderTasks();
}

function setOverloadActive(enabled) {
  state.overloadActive = enabled;
  document.body.classList.toggle("overload-active", enabled);
  dom.overloadButton.textContent = enabled ? "解除重力過載" : "重力過載";

  if (enabled) {
    setFeedback("現在，我們先只做這一步就好，其他事情先放著，慢慢來。");
  } else {
    setFeedback("節奏已經放回正常步調。");
  }

  renderTasks();
}

function drawBackground(now, dt, breathState) {
  const width = state.bgWidth;
  const height = state.bgHeight;
  const context = bgContext;

  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(238,242,247,0.88)");
  gradient.addColorStop(0.52, "rgba(225,233,245,0.78)");
  gradient.addColorStop(1, "rgba(239,244,251,0.9)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const pulse = breathState.motion;
  state.bgWavePhase += dt * (0.22 + pulse * 0.3);

  const waveConfigs = [
    { y: height * 0.22, amplitude: 10 + pulse * 8, speed: 0.65, color: "rgba(240,184,220,0.22)" },
    { y: height * 0.5, amplitude: 14 + pulse * 10, speed: 0.45, color: "rgba(106,141,240,0.18)" },
    { y: height * 0.77, amplitude: 9 + pulse * 7, speed: 0.35, color: "rgba(159,216,202,0.2)" }
  ];

  waveConfigs.forEach((wave, index) => {
    context.beginPath();
    for (let x = 0; x <= width; x += 8) {
      const y = wave.y + Math.sin(x * 0.012 + state.bgWavePhase * wave.speed + index) * wave.amplitude;
      if (x === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.strokeStyle = wave.color;
    context.lineWidth = 2;
    context.stroke();
  });

  state.bgSpawnCarry += dt * (5 + pulse * 6);
  while (state.bgSpawnCarry >= 1) {
    state.bgSpawnCarry -= 1;
    const x = Math.random() * width;
    const y = height + 24 + Math.random() * 60;
    const drift = (Math.random() - 0.5) * 8;
    const rise = -18 - Math.random() * 24 - pulse * 12;
    state.bubbles.spawn({
      x,
      y,
      vx: drift,
      vy: rise,
      life: 7 + Math.random() * 4,
      size: 1.2 + Math.random() * 2.4,
      alpha: 0.18 + Math.random() * 0.22,
      color: Math.random() > 0.5 ? "rgba(106,141,240,0.7)" : "rgba(240,184,220,0.72)",
      drift: 14 + pulse * 10
    });
  }

  state.bubbles.step(dt, (particle) => {
    const flutter = 1 + pulse * 0.55;
    particle.x += particle.vx * dt * flutter + Math.sin((particle.age + now * 0.001) * 1.2) * 0.2;
    particle.y += particle.vy * dt * (0.46 + pulse * 0.42);
    particle.alpha *= 1;
    particle.rotation += particle.rotationSpeed * dt;
    if (particle.y < -40 || particle.x < -40 || particle.x > width + 40) {
      particle.active = false;
    }
  });

  state.bubbles.draw(context, (ctx, particle) => {
    const fade = 1 - particle.age / particle.life;
    ctx.save();
    ctx.globalAlpha = particle.alpha * clamp(fade, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawOrbit(now, dt, breathState) {
  const width = state.orbitWidth;
  const height = state.orbitHeight;
  const context = orbitContext;
  context.clearRect(0, 0, width, height);

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "rgba(255,255,255,0.7)");
  sky.addColorStop(1, "rgba(235,242,252,0.92)");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const pulse = 1 + state.orbitPulse * 0.12 + breathState.motion * 0.03;
  state.orbitPulse = Math.max(0, state.orbitPulse - dt * 1.6);

  context.save();
  context.translate(centerX, centerY);
  context.strokeStyle = "rgba(106,141,240,0.16)";
  context.lineWidth = 1;
  [52, 76, 104].forEach((radius, index) => {
    context.beginPath();
    context.ellipse(0, 0, radius * 1.25, radius * 0.75, 0.05 * index, 0, Math.PI * 2);
    context.stroke();
  });
  context.restore();

  const starGlow = context.createRadialGradient(centerX, centerY, 4, centerX, centerY, 74);
  starGlow.addColorStop(0, "rgba(255,255,255,1)");
  starGlow.addColorStop(0.2, "rgba(255,228,171,0.95)");
  starGlow.addColorStop(0.45, "rgba(243,184,95,0.72)");
  starGlow.addColorStop(1, "rgba(243,184,95,0)");
  context.fillStyle = starGlow;
  context.beginPath();
  context.arc(centerX, centerY, 74 * pulse, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f3b85f";
  context.beginPath();
  context.arc(centerX, centerY, 18 + state.tasks.filter((task) => task.completed).length * 2.2, 0, Math.PI * 2);
  context.fill();

  const total = Math.max(state.tasks.length, 1);
  state.tasks.forEach((task, index) => {
    const transition = state.taskTransitions.get(task.id);
    const point = getOrbitPoint(index, total, task.completed, now);
    const orbitX = point.x;
    const orbitY = point.y;
    let drawX = orbitX;
    let drawY = orbitY;
    let radius = task.completed ? 4.6 : 6.4;
    let alpha = task.completed ? 0.9 : 1;
    let color = task.completed ? "#9fd8ca" : "#6a8df0";

    if (transition) {
      const progress = clamp((now - transition.start) / 760, 0, 1);
      const eased = easeOutCubic(progress);
      drawX = transition.fromX + (centerX - transition.fromX) * eased;
      drawY = transition.fromY + (centerY - transition.fromY) * eased;
      radius = 6.5 - eased * 2.8;
      alpha = 1 - eased * 0.15;
      color = "rgba(255,255,255,0.92)";
      context.save();
      context.globalAlpha = 0.42 * (1 - eased);
      context.strokeStyle = "rgba(243,184,95,0.8)";
      context.beginPath();
      context.moveTo(transition.fromX, transition.fromY);
      context.lineTo(drawX, drawY);
      context.stroke();
      context.restore();

      if (progress >= 1) {
        state.taskTransitions.delete(task.id);
      }
    }

    context.save();
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.beginPath();
    context.arc(drawX, drawY, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });

  state.orbitParticles.step(dt, (particle) => {
    particle.x += particle.vx * dt + particle.drift * Math.cos(particle.age * 2.2) * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.98;
    particle.vy *= 0.98;
    particle.rotation += particle.rotationSpeed * dt;
    if (particle.age > particle.life) {
      particle.active = false;
    }
  });

  state.orbitParticles.draw(context, (ctx, particle) => {
    const fade = 1 - particle.age / particle.life;
    ctx.save();
    ctx.globalAlpha = particle.alpha * clamp(fade, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  if (state.tasks.length === 0) {
    context.save();
    context.fillStyle = "rgba(68, 84, 128, 0.46)";
    context.font = "600 15px Inter, Microsoft JhengHei, sans-serif";
    context.textAlign = "center";
    context.fillText("等待第一個微米任務", centerX, centerY + 92);
    context.restore();
  }
}

function updateAudioButton() {
  if (ambientAudio.playing) {
    dom.ambientToggleButton.textContent = "停止環境音";
  } else {
    dom.ambientToggleButton.textContent = "播放環境音";
  }
}

async function handleAmbientToggle() {
  const selectedType = dom.ambientSelect.value;

  if (!ambientAudio.playing && selectedType === "none") {
    setFeedback("先選一種環境音，再按播放。");
    return;
  }

  if (ambientAudio.playing) {
    ambientAudio.stop();
    setFeedback("環境音先停下來了，房間又安靜一些。");
    updateAudioButton();
    return;
  }

  await ambientAudio.start(selectedType);
  if (ambientAudio.playing) {
    setFeedback(`已開啟 ${dom.ambientSelect.selectedOptions[0].textContent}，慢慢用就好。`);
  }
  updateAudioButton();
}

function handleExport() {
  window.print();
}

function toggleBatchImportArea() {
  dom.batchImportArea.classList.toggle("hidden");
  if (!dom.batchImportArea.classList.contains("hidden")) {
    dom.batchInput.value = "";
    dom.batchInput.focus();
  }
}

function handleBatchImport() {
  const value = dom.batchInput.value.trim();
  if (!value) {
    setFeedback("請在文字框中輸入多個微米任務。");
    dom.batchInput.focus();
    return;
  }

  const lines = value.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    setFeedback("請輸入有效的任務內容，每行一個。");
    dom.batchInput.focus();
    return;
  }

  const newTasks = lines.map((text, index) => ({
    id: `custom-batch-${Date.now()}-${index}`,
    text,
    completed: false,
    domain: "自訂",
    domainKey: "general"
  }));

  state.tasks = [...state.tasks, ...newTasks];
  dom.batchInput.value = "";
  dom.batchImportArea.classList.add("hidden");
  setFeedback(`成功匯入 ${lines.length} 個自訂任務。`);
  renderTasks();
}

function clearAllTasks() {
  if (state.tasks.length === 0) {
    setFeedback("清單已經是空的了。");
    return;
  }
  if (!confirm("確定要清空所有的微米任務嗎？")) {
    return;
  }
  state.tasks = [];
  state.taskTransitions.clear();
  setFeedback("已清空所有微米任務，清單歸零。");
  renderTasks();
}

function syncOverloadButtonState() {
  dom.overloadButton.textContent = state.overloadActive ? "解除重力過載" : "重力過載";
}

function animate(now) {
  if (!state.lastFrame) {
    state.lastFrame = now;
  }

  const dt = clamp((now - state.lastFrame) / 1000, 0, 0.034);
  state.lastFrame = now;

  const breathState = computeBreathState(now);
  updateBreathBubble(breathState);
  document.documentElement.style.setProperty("--bubble-scale", String(breathState.scale));
  document.documentElement.style.setProperty("--bubble-opacity", String(breathState.opacity));

  drawBackground(now, dt, breathState);
  drawOrbit(now, dt, breathState);

  requestAnimationFrame(animate);
}

function init() {
  resizeCanvases();
  renderTasks();
  updateAudioButton();
  syncOverloadButtonState();
  updateBreathBubble(computeBreathState(performance.now()));
  requestAnimationFrame(animate);
}

dom.breakdownButton.addEventListener("click", handleBreakdown);
dom.addTaskButton.addEventListener("click", addTask);
dom.batchImportButton.addEventListener("click", toggleBatchImportArea);
dom.confirmBatchImport.addEventListener("click", handleBatchImport);
dom.cancelBatchImport.addEventListener("click", toggleBatchImportArea);
dom.clearAllButton.addEventListener("click", clearAllTasks);
dom.exportButton.addEventListener("click", handleExport);
dom.goalInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    handleBreakdown();
  }
});
dom.overloadButton.addEventListener("click", () => setOverloadActive(!state.overloadActive));
dom.breathModeSelect.addEventListener("change", () => {
  state.activeBreathMode = dom.breathModeSelect.value;
  updateBreathBubble(computeBreathState(performance.now()));
  setFeedback(state.activeBreathMode === "none" ? "呼吸引導已關閉。" : "呼吸節奏已切換。");
});
dom.ambientVolume.addEventListener("input", () => {
  ambientAudio.setVolume(Number(dom.ambientVolume.value) / 100);
});
dom.ambientToggleButton.addEventListener("click", handleAmbientToggle);
dom.ambientSelect.addEventListener("change", async () => {
  if (ambientAudio.playing) {
    if (dom.ambientSelect.value === "none") {
      ambientAudio.stop();
    } else {
      await ambientAudio.start(dom.ambientSelect.value);
    }
  }
});
window.addEventListener("resize", resizeCanvases);
window.addEventListener("beforeprint", () => {
  if (ambientAudio.playing) {
    ambientAudio.stop();
  }
});

state.activeBreathMode = dom.breathModeSelect.value;
ambientAudio.setVolume(Number(dom.ambientVolume.value) / 100);
init();
