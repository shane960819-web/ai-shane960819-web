// App State
let currentSubject = "geography";
let currentVolume = "vol1";
let currentChapterId = "geo_v1_c1";
let currentTab = "map"; // map, flashcard, diagram, lifestyle, quiz
let quizState = {
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedOption: null
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    // Determine the default chapter on startup
    const firstChapter = socialStudiesData[currentSubject][currentVolume][0];
    if (firstChapter) {
        currentChapterId = firstChapter.id;
    }
    
    // Sync logo branding on start
    syncLogoBranding();
    
    // Render sidebar and load first chapter
    renderChaptersNav();
    loadChapter(currentChapterId);
}

// Update Logo Section and subheader depending on active subject/volume
function syncLogoBranding() {
    const logoIcon = document.getElementById("logo-icon-id");
    const logoTitle = document.getElementById("logo-title");
    const logoSubtitle = document.getElementById("logo-subtitle");

    if (logoIcon && logoTitle) {
        if (currentSubject === "geography") {
            logoIcon.textContent = "🌍";
            logoTitle.textContent = "地理學習 Hub";
        } else if (currentSubject === "history") {
            logoIcon.textContent = "📜";
            logoTitle.textContent = "歷史學習 Hub";
        } else if (currentSubject === "civics") {
            logoIcon.textContent = "⚖️";
            logoTitle.textContent = "公民學習 Hub";
        }
    }

    if (logoSubtitle) {
        if (currentVolume === "vol1") logoSubtitle.textContent = "第一冊 (1下) 教材";
        else if (currentVolume === "vol2") logoSubtitle.textContent = "第二冊 (2下) 教材";
        else if (currentVolume === "vol3") logoSubtitle.textContent = "第三冊 (3下) 教材";
    }
}

// Render the Sidebar Navigation List
function renderChaptersNav() {
    const navList = document.getElementById("chapters-nav-list");
    navList.innerHTML = "";
    
    const chapters = socialStudiesData[currentSubject][currentVolume];
    if (!chapters || chapters.length === 0) {
        navList.innerHTML = "<li style='padding: 20px; font-size: 13px; color: var(--text-muted); text-align:center;'>此冊無相關單元</li>";
        return;
    }
    
    chapters.forEach(ch => {
        const li = document.createElement("li");
        li.className = `nav-item ${ch.id === currentChapterId ? 'active' : ''}`;
        li.dataset.id = ch.id;
        
        let icon = "🌍";
        if (currentSubject === "history") icon = "📜";
        else if (currentSubject === "civics") icon = "⚖️";
        
        li.innerHTML = `
            <button>
                <span class="logo-icon" style="color: hsl(${ch.hue}, 80%, 50%)">${icon}</span>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 11px; color: var(--text-muted); font-weight: bold;">${ch.tag}</span>
                    <span>${ch.title}</span>
                </div>
            </button>
        `;
        
        li.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
            li.classList.add("active");
            loadChapter(ch.id);
        });
        
        navList.appendChild(li);
    });
}

// Setup Event Listeners for tabs, theme toggles, and subject/volume switches
function setupEventListeners() {
    // Header navigation tabs
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            switchTab(btn.dataset.tab);
        });
    });

    // Theme Switch Event Listener
    const themeBtn = document.getElementById("theme-toggle-btn");
    themeBtn.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        document.body.setAttribute("data-theme", newTheme);
        themeBtn.textContent = newTheme === "light" ? "☀️" : "🌙";
    });

    // Subject tabs
    const subjectTabs = document.querySelectorAll(".subject-tab");
    subjectTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            subjectTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            switchSubject(tab.dataset.subject);
        });
    });

    // Volume buttons
    const volBtns = document.querySelectorAll(".vol-btn");
    volBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            volBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            switchVolume(btn.dataset.volume);
        });
    });
}

// Switch between Geography, History, and Civics
function switchSubject(subject) {
    currentSubject = subject;
    syncLogoBranding();
    
    // Auto-select first chapter of the active subject & volume
    const chapters = socialStudiesData[currentSubject][currentVolume];
    if (chapters && chapters.length > 0) {
        currentChapterId = chapters[0].id;
    } else {
        currentChapterId = "";
    }
    
    renderChaptersNav();
    if (currentChapterId) {
        loadChapter(currentChapterId);
    } else {
        clearChapterDisplay();
    }
}

// Switch between Vol 1 (Grade 7), Vol 2 (Grade 8), and Vol 3 (Grade 9)
function switchVolume(volume) {
    currentVolume = volume;
    syncLogoBranding();
    
    const chapters = socialStudiesData[currentSubject][currentVolume];
    if (chapters && chapters.length > 0) {
        currentChapterId = chapters[0].id;
    } else {
        currentChapterId = "";
    }
    
    renderChaptersNav();
    if (currentChapterId) {
        loadChapter(currentChapterId);
    } else {
        clearChapterDisplay();
    }
}

function clearChapterDisplay() {
    document.getElementById("header-tag").textContent = "無課程";
    document.getElementById("header-title").textContent = "目前學科在此冊無搭配單元";
    document.getElementById("header-subtitle").textContent = "請切換其他冊別或科目學習";
    document.getElementById("map-cards-container").innerHTML = "<div class='info-card'>該學科本冊無單元課程資料。</div>";
    document.getElementById("flashcards-grid-container").innerHTML = "";
    document.getElementById("lifestyle-grid-container").innerHTML = "";
}

// Switch between tabs (Map, Flashcard, Diagram, Lifestyle, Quiz)
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.remove("active");
    });
    
    const activePanel = document.getElementById(`${tabName}-panel`);
    if (activePanel) {
        activePanel.classList.add("active");
        if (tabName === "quiz") {
            resetQuiz();
        } else if (tabName === "diagram") {
            loadDynamicDiagram();
        }
    }
}

// Helper: Find a chapter object recursively by its ID
function findChapterById(id) {
    for (const sub in socialStudiesData) {
        for (const vol in socialStudiesData[sub]) {
            const ch = socialStudiesData[sub][vol].find(c => c.id === id);
            if (ch) return ch;
        }
    }
    return null;
}

// Load a specific chapter's content
function loadChapter(id) {
    currentChapterId = id;
    const ch = findChapterById(id);
    if (!ch) return;

    // Dynamically adjust theme accent color based on chapter hue
    document.documentElement.style.setProperty('--theme-color', `hsl(${ch.hue}, 80%, 48%)`);
    document.documentElement.style.setProperty('--theme-color-light', `hsla(${ch.hue}, 80%, 48%, 0.1)`);
    
    // Set Header
    document.getElementById("header-tag").textContent = ch.tag;
    document.getElementById("header-title").textContent = ch.title;
    document.getElementById("header-subtitle").textContent = `${ch.tag}完整教學與互動探索模組`;

    // Render Tab Panels
    renderLearningMap(ch);
    renderFlashcards(ch.flashcards);
    renderLifestyle(ch.news, ch.travel);
    
    // Force active tab to Map on chapter load
    const mapTabBtn = document.querySelector('[data-tab="map"]');
    if (mapTabBtn) {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        mapTabBtn.classList.add("active");
        switchTab("map");
    }

    updateOverallProgress();
}

// Draw climograph dynamically using SVG
function drawClimograph(months, temps, rains) {
    const width = 340;
    const height = 210;
    const paddingLeft = 40;
    const paddingRight = 40;
    const paddingTop = 20;
    const paddingBottom = 30;
    
    const maxRain = Math.max(...rains, 100);
    const maxTemp = 40;
    const minTemp = 0;
    
    let svgContent = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="background:transparent;">`;
    
    // Draw grid lines
    for(let i = 0; i <= 4; i++) {
        const y = paddingTop + (i * (height - paddingTop - paddingBottom) / 4);
        svgContent += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="var(--border-color)" stroke-dasharray="2,2"/>`;
        // Left Temp label
        const tempVal = maxTemp - (i * (maxTemp - minTemp) / 4);
        svgContent += `<text x="${paddingLeft - 8}" y="${y + 4}" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="end">${Math.round(tempVal)}°C</text>`;
        // Right Rain label
        const rainVal = maxRain - (i * maxRain / 4);
        svgContent += `<text x="${width - paddingRight + 8}" y="${y + 4}" fill="#3b82f6" font-size="10" font-weight="bold" text-anchor="start">${Math.round(rainVal)}mm</text>`;
    }
    
    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;
    const colWidth = plotWidth / 12;
    
    // Draw monthly precipitation (blue bars)
    rains.forEach((r, idx) => {
        const x = paddingLeft + (idx * colWidth) + 2;
        const barHeight = (r / maxRain) * plotHeight;
        const y = height - paddingBottom - barHeight;
        svgContent += `<rect x="${x}" y="${y}" width="${colWidth - 4}" height="${barHeight}" fill="#3b82f6" opacity="0.6" rx="2"/>`;
        svgContent += `<text x="${x + colWidth/2 - 2}" y="${height - 10}" fill="var(--text-muted)" font-size="9" font-weight="bold" text-anchor="middle">${idx + 1}月</text>`;
    });
    
    // Draw monthly temperature (red line)
    let points = "";
    temps.forEach((t, idx) => {
        const x = paddingLeft + (idx * colWidth) + colWidth/2;
        const y = height - paddingBottom - ((t - minTemp) / (maxTemp - minTemp)) * plotHeight;
        points += `${x},${y} `;
        svgContent += `<circle cx="${x}" cy="${y}" r="3.5" fill="#ef4444"/>`;
    });
    svgContent += `<polyline points="${points}" fill="none" stroke="#ef4444" stroke-width="2.5"/>`;
    
    svgContent += `</svg>`;
    return svgContent;
}

// Render "📖 知識學習地圖"
function renderLearningMap(ch) {
    const container = document.getElementById("map-cards-container");
    container.innerHTML = "";
    
    // 1. Render core concept summaries
    ch.summary.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "info-card";
        card.innerHTML = `
            <div class="card-title">
                <i>📌</i> ${item.title}
            </div>
            <p style="font-size: 15px; line-height: 1.7; color: var(--text-secondary);">${item.desc}</p>
        `;
        container.appendChild(card);
    });

    // 2. Render visual card
    if (ch.visual) {
        const visualCard = document.createElement("div");
        visualCard.className = "info-card";
        visualCard.style.gridColumn = "1 / -1";
        
        let rightSideHTML = "";
        
        if (currentSubject === "geography" && ch.visual.climateName) {
            rightSideHTML = `
                <div class="visual-climate-side" style="display: flex; flex-direction: column; gap: 14px; align-items: center; width: 100%;">
                    <h4 style="font-weight: 700; color: var(--text-primary); font-size: 15px; width: 100%; text-align: center;">📊 ${ch.visual.climateName}</h4>
                    <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); width: 100%; display: flex; justify-content: center; box-shadow: inset var(--shadow-sm);">
                        ${drawClimograph([1,2,3,4,5,6,7,8,9,10,11,12], ch.visual.temps, ch.visual.rains)}
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; width: 100%; background-color: var(--theme-color-light); padding: 14px; border-radius: 8px; border-left: 4px solid var(--theme-color);">
                        ${ch.visual.tip}
                    </div>
                </div>
            `;
        } else if (currentSubject === "history" && ch.timelineEvents) {
            let timelineItemsHTML = "";
            ch.timelineEvents.forEach(evt => {
                timelineItemsHTML += `
                    <div style="display: flex; gap: 10px; font-size: 13px; margin-bottom: 8px; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
                        <span style="font-weight: 800; color: var(--theme-color); min-width: 60px;">${evt.year}</span>
                        <span style="color: var(--text-primary); font-weight: 700;">${evt.title}</span>
                    </div>
                `;
            });
            rightSideHTML = `
                <div class="visual-climate-side" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                    <h4 style="font-weight: 700; color: var(--text-primary); font-size: 15px; text-align: center; margin-bottom: 8px;">⏳ 歷史重要紀事速覽</h4>
                    <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); width: 100%; box-shadow: inset var(--shadow-sm);">
                        ${timelineItemsHTML}
                    </div>
                    <p style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 6px;">💡 提示：切換至<b>「原理圖解」</b>分頁可使用完整互動時間軸！</p>
                </div>
            `;
        } else {
            rightSideHTML = `
                <div class="visual-climate-side" style="display: flex; flex-direction: column; gap: 14px; align-items: center; width: 100%;">
                    <h4 style="font-weight: 700; color: var(--text-primary); font-size: 15px; width: 100%; text-align: center;">⚖️ 社會運作與利益分配機制</h4>
                    <div style="background-color: var(--bg-tertiary); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); width: 100%; text-align: center; box-shadow: inset var(--shadow-sm);">
                        <span style="font-size: 48px;">⚖️</span>
                        <p style="font-size: 14px; font-weight: 700; color: var(--theme-color); margin-top: 10px;">互動模擬器已備妥</p>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; width: 100%; background-color: var(--theme-color-light); padding: 14px; border-radius: 8px; border-left: 4px solid var(--theme-color);">
                        💡 請切換至<b>「原理圖解」</b>分頁，調整滑桿或點選元件，即可即時模擬社會法治、政策或智慧財產等利益運作！
                    </div>
                </div>
            `;
        }

        // Use standard local image path, fallback to unsplash image if local asset doesn't load
        const localImgPath = ch.visual.img;
        
        visualCard.innerHTML = `
            <div class="card-title">
                <i>📸</i> 實地社會科寫實影像 & 視覺探索圖表
            </div>
            <div class="visual-card-content">
                <div class="visual-photo-side" style="display: flex; flex-direction: column; gap: 12px;">
                    <img src="${localImgPath}" alt="${ch.title}" style="width: 100%; border-radius: 8px; box-shadow: var(--shadow-sm); aspect-ratio: 16/10; object-fit: cover; border: 1px solid var(--border-color);" onerror="this.src='https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'"/>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; padding: 6px 10px; border-left: 4px solid var(--theme-color); background-color: var(--bg-tertiary); border-radius: 0 8px 8px 0;">
                        ${ch.visual.caption}
                    </p>
                </div>
                ${rightSideHTML}
            </div>
        `;
        container.appendChild(visualCard);
    }
}

// Render "💡 詞彙閃卡"
function renderFlashcards(flashcardsData) {
    const container = document.getElementById("flashcards-grid-container");
    container.innerHTML = "";
    
    if (!flashcardsData || flashcardsData.length === 0) {
        container.innerHTML = "<div style='color: var(--text-muted); text-align: center; grid-column: 1/-1;'>本單元尚無閃卡。</div>";
        return;
    }
    
    flashcardsData.forEach(cardData => {
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "flashcard";
        
        cardWrapper.innerHTML = `
            <div class="flashcard-face flashcard-front">
                <h3>${cardData.term}</h3>
                <span class="badge-tag" style="background-color: var(--theme-color-light); color: var(--theme-color); font-size: 10px;">點擊翻面</span>
                <p class="flashcard-hint">提示: ${cardData.hint}</p>
            </div>
            <div class="flashcard-face flashcard-back">
                <h4 style="margin-bottom: 10px; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; font-size: 16px;">${cardData.term}</h4>
                <p>${cardData.desc}</p>
            </div>
        `;
        
        cardWrapper.addEventListener("click", () => {
            cardWrapper.classList.toggle("flipped");
        });
        
        container.appendChild(cardWrapper);
    });
}

// Render "🌍 生活聯結" (時事新聞與旅遊經驗)
function renderLifestyle(news, travel) {
    const container = document.getElementById("lifestyle-grid-container");
    
    if (!news || !travel) {
        container.innerHTML = "<div style='color: var(--text-muted); text-align: center;'>本單元尚無生活聯結資料。</div>";
        return;
    }
    
    container.innerHTML = `
        <div class="lifestyle-card">
            <div>
                <span class="badge-tag badge-news">📰 時事社會科連結</span>
            </div>
            <h3>${news.title}</h3>
            <p class="lifestyle-content">${news.desc}</p>
            <div class="map-highlight-pane">
                <i>📍</i> 涉及焦點領域: <span>${news.highlight}</span>
            </div>
            <div class="lifestyle-discussion">
                💡 ${news.discuss}
            </div>
        </div>
        
        <div class="lifestyle-card">
            <div>
                <span class="badge-tag badge-travel">🎒 生活經驗與反思</span>
            </div>
            <h3>${travel.title}</h3>
            <p class="lifestyle-content">${travel.desc}</p>
            <div class="lifestyle-discussion" style="border-left-color: var(--color-success)">
                ✈️ ${travel.question}
            </div>
        </div>
    `;
}

// Render & Setup "🔄 原理圖解" Simulators
function loadDynamicDiagram() {
    const stage = document.getElementById("diagram-stage-container");
    stage.innerHTML = "";
    
    const ch = findChapterById(currentChapterId);
    if (!ch) return;

    // 1. Geography Vol 2 Simulators (kept from previous code)
    if (ch.diagramType === "monsoon-sea-land") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">🍂 東南亞季風成因與風向模擬器</h3>
            <div class="simulator-controls">
                <button class="sim-btn active" id="btn-summer">☀️ 夏季 (7月) 吹西南風</button>
                <button class="sim-btn" id="btn-winter">❄️ 冬季 (1月) 吹東北風</button>
            </div>
            <div class="climate-svg-container" id="climate-svg-box">
                <svg width="100%" height="100%" viewBox="0 0 600 300" style="background-color: var(--bg-secondary);">
                    <rect x="0" y="150" width="600" height="150" fill="#bae6fd" opacity="0.6"/>
                    <path d="M 250 150 Q 350 110, 600 80 L 600 150 Z" fill="#e2e8f0" stroke="var(--border-color)"/>
                    <text x="450" y="120" font-weight="bold" fill="var(--text-secondary)">亞洲大陸 (陸地)</text>
                    <text x="100" y="240" font-weight="bold" fill="#0369a1">太平洋 / 印度洋 (海洋)</text>
                    <g id="summer-graphics">
                        <circle cx="150" cy="200" r="25" fill="#3b82f6" opacity="0.3"/>
                        <text x="135" y="205" font-weight="bold" fill="#2563eb">H (高壓)</text>
                        <circle cx="480" cy="90" r="25" fill="#ef4444" opacity="0.3"/>
                        <text x="468" y="95" font-weight="bold" fill="#dc2626">L (低壓)</text>
                        <path d="M 170 180 C 240 140, 350 110, 440 90" fill="none" stroke="#059669" stroke-width="4" marker-end="url(#arrow)" class="wind-arrow"/>
                        <text x="260" y="60" fill="#059669" font-weight="bold" font-size="14">西南季風 (帶水氣、產物雨季)</text>
                    </g>
                    <g id="winter-graphics" style="display: none;">
                        <circle cx="150" cy="200" r="25" fill="#ef4444" opacity="0.3"/>
                        <text x="138" y="205" font-weight="bold" fill="#dc2626">L (低壓)</text>
                        <circle cx="480" cy="90" r="25" fill="#3b82f6" opacity="0.3"/>
                        <text x="465" y="95" font-weight="bold" fill="#2563eb">H (高壓)</text>
                        <path d="M 440 95 C 350 110, 240 140, 170 180" fill="none" stroke="#ea580c" stroke-width="4" marker-end="url(#arrow-red)" class="wind-arrow"/>
                        <text x="260" y="60" fill="#ea580c" font-weight="bold" font-size="14">東北季風 (乾燥寒冷、產物乾季)</text>
                    </g>
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
                        </marker>
                        <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ea580c" />
                        </marker>
                    </defs>
                </svg>
            </div>
            <p id="monsoon-desc" style="font-size: 13px; color: var(--text-secondary); margin-top: 14px; text-align: center; max-width: 600px; margin-left: auto; margin-right: auto;">
                <b>夏季成因：</b>陸地吸熱快氣溫高形成低壓(L)，海洋吸熱慢氣溫低為高壓(H)。風由海洋吹向陸地（西南季風），挾帶大量水氣，形成<b>雨季</b>。
            </p>
        `;
        
        const btnSummer = document.getElementById("btn-summer");
        const btnWinter = document.getElementById("btn-winter");
        const summerG = document.getElementById("summer-graphics");
        const winterG = document.getElementById("winter-graphics");
        const descText = document.getElementById("monsoon-desc");
        
        btnSummer.addEventListener("click", () => {
            btnSummer.classList.add("active");
            btnWinter.classList.remove("active");
            summerG.style.display = "block";
            winterG.style.display = "none";
            descText.innerHTML = "<b>夏季成因：</b>陸地吸熱快氣溫高形成低壓(L)，海洋吸熱慢氣溫低為高壓(H)。風由海洋吹向陸地（西南季風），挾帶大量水氣，形成<b>雨季</b>。";
        });
        btnWinter.addEventListener("click", () => {
            btnSummer.classList.remove("active");
            btnWinter.classList.add("active");
            summerG.style.display = "none";
            winterG.style.display = "block";
            descText.innerHTML = "<b>冬季成因：</b>陸地散熱快氣溫低形成高壓(H)，海洋散熱慢氣溫高為低壓(L)。風由陸地吹向海洋（東北季風），空氣乾燥，形成<b>乾季</b>。";
        });
    }
    else if (ch.diagramType === "timezone-dial") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 8px; font-weight: 700; text-align: center;">🕒 印度與美國時差接力互動輪盤</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">點擊輪盤，模擬高科技軟體外包24小時不間斷接力！</p>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div class="dialer-wheel" id="time-dialer" style="width: 200px; height: 200px; border-radius: 50%; border: 4px solid var(--theme-color); position: relative; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow-md); background-color: var(--bg-secondary);">
                    <div class="dial-center" id="dial-center-text" style="display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.6s ease;">
                        <span id="dial-us-time" style="font-size: 14px; font-weight: 800; color: var(--text-primary);">08:00 AM</span>
                        <span style="font-size: 10px; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 4px; margin-top: 4px;">相差 12 小時</span>
                        <span id="dial-in-time" style="font-size: 14px; font-weight: 800; color: var(--theme-color);">08:00 PM</span>
                    </div>
                </div>
                <div id="dialer-status-desc" style="background-color: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); font-size: 14px; text-align: center; max-width: 500px; width: 100%;">
                    💻 <b>此時狀態：</b>美國矽谷工程師開始上班，此時印度邦加羅爾已經是下班休息時間。矽谷團隊傍晚下班前，將檔案傳給剛上班的印度團隊。
                </div>
            </div>
        `;
        
        const dialer = document.getElementById("time-dialer");
        const usTimeText = document.getElementById("dial-us-time");
        const inTimeText = document.getElementById("dial-in-time");
        const statusText = document.getElementById("dialer-status-desc");
        let rotateAngle = 0;
        let step = 0;
        
        dialer.addEventListener("click", () => {
            rotateAngle += 180;
            step = (step + 1) % 2;
            dialer.style.transform = `rotate(${rotateAngle}deg)`;
            
            const center = document.getElementById("dial-center-text");
            center.style.transform = `rotate(-${rotateAngle}deg)`;
            
            if (step === 0) {
                usTimeText.textContent = "08:00 AM";
                inTimeText.textContent = "08:00 PM";
                statusText.innerHTML = "💻 <b>此時狀態：</b>美國矽谷工程師開始上班，此時印度邦加羅爾已經是下班休息時間。矽谷團隊傍晚下班前，將檔案傳給剛上班的印度團隊。";
            } else {
                usTimeText.textContent = "08:00 PM";
                inTimeText.textContent = "08:00 AM";
                statusText.innerHTML = "🌙 <b>此時狀態：</b>美國矽谷進入深夜下班時間。剛起床的印度工程師接續上班，進行軟體測試與維護。如此形成 24 小時不間斷研發！";
            }
        });
    }
    else if (ch.diagramType === "kanat-interactive") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">❄️ 伊朗坎井地下輸水剖面模擬圖</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px; text-align: center;">移至發光點，了解各結構名稱與減少蒸發的智慧！</p>
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                <svg width="100%" height="240" viewBox="0 0 600 240" style="background-color: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
                    <path d="M 380 240 L 450 80 Q 510 30, 600 30 L 600 240 Z" fill="#cbd5e1"/>
                    <text x="480" y="60" font-weight="bold" font-size="12" fill="#64748b">高山積雪 (水源)</text>
                    <path d="M 0 200 L 200 180 L 400 120 L 450 80" fill="none" stroke="var(--text-muted)" stroke-width="4"/>
                    <path d="M 200 220 Q 300 190, 420 140" fill="none" stroke="#38bdf8" stroke-width="6" stroke-dasharray="5,3"/>
                    <line x1="180" y1="182" x2="400" y2="135" stroke="#0284c7" stroke-width="6" />
                    
                    <line x1="220" y1="178" x2="220" y2="220" stroke="#78350f" stroke-width="2" stroke-dasharray="3,3"/>
                    <line x1="280" y1="160" x2="280" y2="200" stroke="#78350f" stroke-width="2" stroke-dasharray="3,3"/>
                    <line x1="340" y1="138" x2="340" y2="170" stroke="#78350f" stroke-width="2" stroke-dasharray="3,3"/>
                    
                    <circle cx="90" cy="190" r="8" fill="#22c55e" />
                    <text x="50" y="215" font-size="11" font-weight="bold" fill="#15803d">綠洲灌溉區</text>
                    
                    <circle cx="280" cy="148" r="12" fill="#f97316" id="hotspot-tunnel" style="cursor:pointer; fill-opacity:0.8; stroke:white; stroke-width:2;" />
                    <circle cx="280" cy="180" r="12" fill="#eab308" id="hotspot-shaft" style="cursor:pointer; fill-opacity:0.8; stroke:white; stroke-width:2;" />
                    <circle cx="120" cy="188" r="12" fill="#06b6d4" id="hotspot-open" style="cursor:pointer; fill-opacity:0.8; stroke:white; stroke-width:2;" />
                </svg>
                <div id="kanat-info-box" style="background-color: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); font-size: 14px; text-align: center; width: 100%; max-width: 500px;">
                    💡 <b>請點擊或滑鼠移至上面的發光圓點了解細節！</b>
                </div>
            </div>
        `;
        
        const hotspotTunnel = document.getElementById("hotspot-tunnel");
        const hotspotShaft = document.getElementById("hotspot-shaft");
        const hotspotOpen = document.getElementById("hotspot-open");
        const infoBox = document.getElementById("kanat-info-box");
        
        const showTunnel = () => { infoBox.innerHTML = "🌊 <b>地下暗渠 (Tunnel)：</b>坎井的主體。建在地下，以微小的坡度讓水自動引流下山。能完全隔絕烈日，<b>防止水分在乾旱環境中大量蒸發</b>！"; };
        const showShaft = () => { infoBox.innerHTML = "🕳️ <b>垂直豎井 (Shafts)：</b>每隔一段距離挖設的井口。主要用於施工時<b>排出泥沙、提供通風</b>，並作為日後清理暗渠的通道。"; };
        const showOpen = () => { infoBox.innerHTML = "🌴 <b>明渠與出口 (Open Channel)：</b>當暗渠到達平原時，流出地表成為明渠。這時居民引水灌溉，種植大麥與椰棗，形成綠洲聚落。"; };
        
        hotspotTunnel.addEventListener("mouseover", showTunnel);
        hotspotShaft.addEventListener("mouseover", showShaft);
        hotspotOpen.addEventListener("mouseover", showOpen);
        
        hotspotTunnel.addEventListener("click", showTunnel);
        hotspotShaft.addEventListener("click", showShaft);
        hotspotOpen.addEventListener("click", showOpen);
    }
    else if (ch.diagramType === "climate-mediterranean-sim") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">☀️ 地中海型氣候「夏乾冬雨」動態模擬</h3>
            <div class="simulator-controls">
                <button class="sim-btn active" id="med-summer">☀️ 夏季 (7月) 高壓籠罩 - 夏乾</button>
                <button class="sim-btn" id="med-winter">❄️ 冬季 (1月) 西風南移 - 冬雨</button>
            </div>
            <div class="climate-svg-container" style="height: 200px;">
                <svg width="100%" height="100%" viewBox="0 0 600 200" style="background-color: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
                    <rect x="0" y="30" width="600" height="140" fill="#f1f5f9" />
                    <path d="M 150 100 Q 300 70, 450 100 Q 300 130, 150 100 Z" fill="#93c5fd" opacity="0.8"/>
                    <text x="280" y="50" font-weight="bold" fill="var(--text-secondary)">歐洲大陸</text>
                    <text x="280" y="160" font-weight="bold" fill="var(--text-secondary)">北非撒哈拉</text>
                    <text x="280" y="105" font-weight="bold" fill="#1e3a8a">地中海</text>
                    
                    <g id="med-summer-graphics">
                        <circle cx="300" cy="130" r="30" fill="#f97316" opacity="0.3" />
                        <text x="270" y="134" font-weight="bold" fill="#ea580c" font-size="10">副熱帶高壓</text>
                        <path d="M 300 80 L 300 100" stroke="#ea580c" stroke-width="3" marker-end="url(#arrow-orange)"/>
                        <text x="50" y="80" font-weight="bold" fill="#ea580c" font-size="14">🔥 夏乾：炎熱乾燥</text>
                    </g>
                    
                    <g id="med-winter-graphics" style="display: none;">
                        <path d="M 50 80 C 150 80, 250 90, 350 100" fill="none" stroke="#2563eb" stroke-width="4" marker-end="url(#arrow-blue)" class="wind-arrow"/>
                        <text x="120" y="65" fill="#2563eb" font-weight="bold" font-size="12">盛行西風帶 (帶來大西洋雨水)</text>
                        <text x="50" y="50" font-weight="bold" fill="#2563eb" font-size="14">🌧️ 冬雨：溫和多雨</text>
                    </g>
                    <defs>
                        <marker id="arrow-orange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ea580c" />
                        </marker>
                        <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
                        </marker>
                    </defs>
                </svg>
            </div>
            <p id="med-desc-box" style="font-size: 13px; color: var(--text-secondary); margin-top: 14px; text-align: center; max-width: 600px; margin-left: auto; margin-right: auto;">
                <b>夏季成因：</b>因氣壓帶北移，地中海沿岸被<b>副熱帶高壓帶</b>籠罩，下沉氣流旺盛，雲霧消散，降水極稀，炎熱乾燥。
            </p>
        `;
        
        const btnSummer = document.getElementById("med-summer");
        const btnWinter = document.getElementById("med-winter");
        const summerG = document.getElementById("med-summer-graphics");
        const winterG = document.getElementById("med-winter-graphics");
        const descText = document.getElementById("med-desc-box");
        
        btnSummer.addEventListener("click", () => {
            btnSummer.classList.add("active");
            btnWinter.classList.remove("active");
            summerG.style.display = "block";
            winterG.style.display = "none";
            descText.innerHTML = "<b>夏季成因：</b>因氣壓帶北移，地中海沿岸被<b>副熱帶高壓帶</b>籠罩，下沉氣流旺盛，雲霧消散，降水極稀，炎熱乾燥。";
        });
        btnWinter.addEventListener("click", () => {
            btnSummer.classList.remove("active");
            btnWinter.classList.add("active");
            summerG.style.display = "none";
            winterG.style.display = "block";
            descText.innerHTML = "<b>冬季成因：</b>氣壓帶南移，高壓退回撒哈拉，<b>盛行西風帶</b>往南移動到此緯度，從大西洋攜帶水氣進入地中海，溫和多雨。";
        });
    }
    else if (ch.diagramType === "africa-symmetry-card") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 8px; font-weight: 700; text-align: center;">🌍 漠南非洲「赤道對稱」氣候探索圖</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">點擊不同緯度的氣候，查看其氣候對稱規律！</p>
            <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;">
                <button class="sim-btn" id="btn-sym-desert-n">北緯20°: 撒哈拉沙漠</button>
                <button class="sim-btn" id="btn-sym-savanna-n">北緯10°: 北非莽原</button>
                <button class="sim-btn active" id="btn-sym-rainforest">赤道0°: 剛果雨林</button>
                <button class="sim-btn" id="btn-sym-savanna-s">南緯10°: 南非莽原</button>
                <button class="sim-btn" id="btn-sym-desert-s">南緯20°: 喀拉哈里</button>
            </div>
            <div id="symmetry-info-card" style="background-color: var(--bg-secondary); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); width: 100%; max-width: 500px; box-shadow: var(--shadow-sm); text-align: center; margin: 0 auto;">
                <h4 style="color: var(--color-success); font-weight: 800; font-size: 16px; margin-bottom: 8px;">🟢 赤道 0度：熱帶雨林氣候 (剛果盆地)</h4>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
                    地處赤道低壓帶，對流雨極旺盛。特徵為<b>終年高溫多雨</b>，發育出繁茂的剛果熱帶雨林。
                </p>
                <div style="margin-top: 12px; font-size: 11px; color: var(--text-muted); font-weight: bold; background-color: var(--bg-tertiary); padding: 6px; border-radius: 4px;">
                    對稱中心點
                </div>
            </div>
        `;
        
        const infoCard = document.getElementById("symmetry-info-card");
        const buttons = {
            "btn-sym-desert-n": { title: "🔴 北緯 20度：熱帶沙漠氣候 (撒哈拉沙漠)", text: "受副熱帶高氣壓控制，下沉氣流旺盛，極度炎熱且全年乾燥少雨。為世界面積最大的沙漠地區。", sym: "對稱南緯 20度的喀拉哈里沙漠", color: "var(--color-danger)" },
            "btn-sym-savanna-n": { title: "🟡 北緯 10度：熱帶莽原氣候 (東非莽原)", text: "乾溼季節分明。夏季受赤道低壓北移影響為<b>雨季</b>，冬季受副熱帶高壓南下控制為<b>乾季</b>。以野生動物大遷徙聞名。", sym: "對稱南緯 10度的中南非莽原", color: "var(--color-warning)" },
            "btn-sym-rainforest": { title: "🟢 赤道 0度：熱帶雨林氣候 (剛果盆地)", text: "地處赤道低壓帶，對流雨極為旺盛。特徵為<b>終年高溫多雨</b>，發育出繁茂的熱帶雨林，是剛果河水量的主要發源地。", sym: "對稱中心點", color: "var(--color-success)" },
            "btn-sym-savanna-s": { title: "🟡 南緯 10度：熱帶莽原氣候 (中南非高原)", text: "氣候特徵同樣乾溼分明，但由於地處南半球，其雨季落在 11月~3月(南半球夏季)，與北半球莽原乾溼季節剛好相反！", sym: "對稱北緯 10度的北非莽原", color: "var(--color-warning)" },
            "btn-sym-desert-s": { title: "🔴 南緯 20度：熱帶沙漠氣候 (喀拉哈里沙漠)", text: "同樣受到副熱帶高氣壓影響，降雨稀少，多為乾燥沙礫或荒漠，氣候乾熱。", sym: "對稱北緯 20度的撒哈拉沙漠", color: "var(--color-danger)" }
        };

        Object.keys(buttons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            btn.addEventListener("click", () => {
                document.querySelectorAll(".diagram-stage .sim-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                const data = buttons[btnId];
                infoCard.innerHTML = `
                    <h4 style="color: ${data.color}; font-weight: 800; font-size: 16px; margin-bottom: 8px;">${data.title}</h4>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">${data.text}</p>
                    <div style="margin-top: 12px; font-size: 11px; color: var(--text-muted); font-weight: bold; background-color: var(--bg-tertiary); padding: 6px; border-radius: 4px;">
                        🔗 氣候對稱關聯：${data.sym}
                    </div>
                `;
            });
        });
    }
    else if (ch.diagramType === "chocolate-value-sim") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 8px; font-weight: 700; text-align: center;">🍫 巧克力產業鏈利潤與公平貿易分配模擬器</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px; text-align: center;">拖動價格滑桿並切換貿易模式，了解農民如何擺脫西方跨國企業剝削！</p>
            
            <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 16px; align-items: center; margin: 0 auto;">
                <div style="display: flex; gap: 12px; margin-bottom: 5px; width: 100%; justify-content: center;">
                    <button class="sim-btn active" id="btn-trade-normal">⚠️ 一般貿易模式 (剝削)</button>
                    <button class="sim-btn" id="btn-trade-fair">🌱 公平貿易模式 (保障)</button>
                </div>
                
                <div style="width: 100%; display: flex; flex-direction: column; gap: 6px; align-items: center; background-color: var(--bg-secondary); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="font-weight: 800; font-size: 14px; color: var(--text-primary);">巧克力市售價格 (NTD)：<span id="price-val" style="color: var(--color-warning); font-size: 20px;">100</span> 元</div>
                    <input type="range" id="price-slider" min="10" max="500" value="100" step="5" style="width: 90%; cursor: pointer;" />
                </div>
                
                <div id="chart-container" style="width: 100%; display: flex; flex-direction: column; gap: 8px; background-color: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                    <div id="row-farmer" style="display: flex; flex-direction: column; gap: 2px;"></div>
                    <div id="row-community" style="display: flex; flex-direction: column; gap: 2px; display: none;"></div>
                    <div id="row-exporter" style="display: flex; flex-direction: column; gap: 2px;"></div>
                    <div id="row-manufacturer" style="display: flex; flex-direction: column; gap: 2px;"></div>
                    <div id="row-retailer" style="display: flex; flex-direction: column; gap: 2px;"></div>
                </div>

                <div id="trade-desc-card" style="background-color: var(--bg-tertiary); padding: 16px; border-radius: 10px; font-size: 13px; color: var(--text-secondary); line-height: 1.6; border-left: 4px solid var(--color-danger); width: 100%;">
                    <b>一般貿易分析：</b>可可小農得到的利潤極微（僅約 7.5%）。大半利潤被跨國製造商與銷售商掠奪，農民陷入貧困與童工的惡性循環（課本第77/85頁）。
                </div>
            </div>
        `;
        
        const slider = document.getElementById("price-slider");
        const priceVal = document.getElementById("price-val");
        const btnNormal = document.getElementById("btn-trade-normal");
        const btnFair = document.getElementById("btn-trade-fair");
        const rowFarmer = document.getElementById("row-farmer");
        const rowCommunity = document.getElementById("row-community");
        const rowExporter = document.getElementById("row-exporter");
        const rowManufacturer = document.getElementById("row-manufacturer");
        const rowRetailer = document.getElementById("row-retailer");
        const descCard = document.getElementById("trade-desc-card");
        
        let isFairTrade = false;
        
        function updateChart() {
            const price = parseFloat(slider.value);
            priceVal.textContent = price;
            
            let shares = {};
            if (!isFairTrade) {
                shares = {
                    farmer: { label: "👨‍🌾 可可小農 (7.5%)", pct: 7.5, color: "#f59e0b" },
                    exporter: { label: "🚢 運輸與出口商 (20%)", pct: 20, color: "#6b7280" },
                    manufacturer: { label: "🏭 跨國製造商 (35%)", pct: 35, color: "#3b82f6" },
                    retailer: { label: "🏪 通路與銷售商 (37.5%)", pct: 37.5, color: "#10b981" }
                };
                rowCommunity.style.display = "none";
                descCard.style.borderLeftColor = "var(--color-danger)";
                descCard.innerHTML = `<b>一般貿易分析：</b>可可小農得到的利潤極微（僅約 7.5%）。大半利潤被跨國製造商與銷售商支配，農民陷入貧困與童工的惡性循環。`;
            } else {
                shares = {
                    farmer: { label: "👨‍🌾 可可小農 (25.0%)", pct: 25, color: "#10b981" },
                    community: { label: "🏫 公平貿易社群基金 (10.0%)", pct: 10, color: "#8b5cf6" },
                    exporter: { label: "🚢 運輸與出口商 (15.0%)", pct: 15, color: "#6b7280" },
                    manufacturer: { label: "🏭 跨國製造商 (25.0%)", pct: 25, color: "#3b82f6" },
                    retailer: { label: "🏪 通路與銷售商 (25.0%)", pct: 25, color: "#3b82f6" }
                };
                rowCommunity.style.display = "flex";
                descCard.style.borderLeftColor = "var(--color-success)";
                descCard.innerHTML = `<b>公平貿易分析：</b>保障小農最低收購價格，利潤提升至 25%！提撥 10% 的社群合作基金，用於興建學校與醫療基建，且嚴格禁用童工。`;
            }
            
            Object.keys(shares).forEach(key => {
                const item = shares[key];
                const row = document.getElementById("row-" + key);
                const amt = (price * (item.pct / 100)).toFixed(1);
                
                row.innerHTML = `
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 2px;">
                        <span>${item.label}</span>
                        <span style="color: var(--text-primary); font-family: monospace;">$${amt} 元</span>
                    </div>
                    <div style="width: 100%; height: 10px; background-color: var(--bg-tertiary); border-radius: 5px; overflow: hidden; margin-bottom: 8px;">
                        <div style="width: ${item.pct}%; height: 100%; background-color: ${item.color}; border-radius: 5px; transition: width 0.3s ease;"></div>
                    </div>
                `;
            });
        }
        
        btnNormal.addEventListener("click", () => {
            btnNormal.classList.add("active");
            btnFair.classList.remove("active");
            isFairTrade = false;
            updateChart();
        });
        
        btnFair.addEventListener("click", () => {
            btnNormal.classList.remove("active");
            btnFair.classList.add("active");
            isFairTrade = true;
            updateChart();
        });
        
        slider.addEventListener("input", updateChart);
        updateChart();
    }
    // 2. History Timelines (for all volumes)
    else if (ch.diagramType === "timeline-interactive" && ch.timelineEvents) {
        let timelineHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">⏳ 歷史事件動態時間軸</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">點擊時間節點，展開詳細歷史背景與事件影響！</p>
            <div class="timeline-container" style="text-align: left;">
                <div class="timeline-line"></div>
        `;
        ch.timelineEvents.forEach((evt, idx) => {
            timelineHTML += `
                <div class="timeline-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                    <div class="timeline-badge"></div>
                    <div class="timeline-content-card">
                        <div class="timeline-year">${evt.year}</div>
                        <h4 class="timeline-title">${evt.title}</h4>
                        <p class="timeline-desc">${evt.desc}</p>
                    </div>
                </div>
            `;
        });
        timelineHTML += `</div>`;
        stage.innerHTML = timelineHTML;
        
        const items = stage.querySelectorAll(".timeline-item");
        items.forEach(item => {
            item.addEventListener("click", () => {
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
            });
        });
    }
    // 3. Civics Policy Sliders
    else if (ch.diagramType === "policy-slider") {
        let title = "📊 政策影響與利益分配模擬器";
        let label1 = "參與度 / 投資比率";
        let label2 = "正面效益指數";
        let label3 = "社會滿意度";
        let desc = "拖動滑桿，觀察不同資源配置對社會各面向的影響力！";
        
        if (ch.id === "civ_v1_c1") {
            title = "🗳️ 公民參與度與施政透明度模擬器";
            label1 = "公民自願參與公共事務比率";
            label2 = "政府施政透明度";
            label3 = "社會凝聚力與信賴度";
            desc = "當公民積極參與公共會議時，施政透明度將顯著攀升，落實草根民主。";
        } else if (ch.id === "civ_v1_c2") {
            title = "🤝 第三部門（NPO/NGO）公益覆蓋率";
            label1 = "民間志願服務投入資金與人力";
            label2 = "弱勢照顧與環境保育成效";
            label3 = "政府公共財政壓力減輕率";
            desc = "第三部門的蓬勃發展，能有效修補市場與政府的服務缺口，提升整體社會安全網。";
        } else if (ch.id === "civ_v1_c3") {
            title = "🎪 文化政策：同化政策 vs. 多元文化主義";
            label1 = "多元文化推廣與語言保障比例";
            label2 = "少數族群文化保存率";
            label3 = "社會和諧與族群衝突降低率";
            desc = "偏向100%代表尊重保障（多元文化），偏向0%代表強迫融入（同化）。";
        } else if (ch.id === "civ_v1_c5") {
            title = "💻 城鄉數位落差消除補助模擬器";
            label1 = "偏鄉寬頻與教學硬體補助比例";
            label2 = "偏鄉學童資訊近用與學習效率";
            label3 = "城鄉教育資源均等指數";
            desc = "拉近數位落差是推動社會公平正義的關鍵。提高補助能直接提升偏鄉教育競爭力。";
        } else if (ch.id === "civ_v2_c6") {
            title = "🏫 兒少偏差行為：保護處分輔導模擬器";
            label1 = "觀護人與社區輔導資源投入";
            label2 = "偏差少年重返社會成功率";
            label3 = "重複觸法（再犯率）降低率";
            desc = "少年事件處理法強調輔導重於刑罰。增加輔導資源能顯著幫助少年重返正軌。";
        } else if (ch.id === "civ_v3_c3") {
            title = "🌎 全球化經貿關稅與市場分配模擬器";
            label1 = "全球貿易開放程度 (降稅比率)";
            label2 = "進口商品種類與消費者省錢指數";
            label3 = "在地小農與傳統產業生存空間";
            desc = "全球化降低消費成本（利），但過度開放會重創本土小農與傳統產業（弊）。";
        }
        
        stage.innerHTML = `
            <h3 style="margin-bottom: 8px; font-weight: 700; text-align: center;">${title}</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">${desc}</p>
            <div style="width: 100%; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;">
                <div style="background-color: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px; align-items: center;">
                    <div style="font-weight: 800; font-size: 14px;">調整比率：<span id="civ-slider-val" style="color: var(--theme-color); font-size: 20px;">50</span>%</div>
                    <input type="range" id="civ-policy-slider" min="0" max="100" value="50" style="width: 90%; cursor: pointer;" />
                </div>
                <div class="slider-info-box" style="text-align: left;">
                    <div class="sim-bar-label">
                        <span>${label1}</span>
                        <span id="civ-val-1">50%</span>
                    </div>
                    <div class="sim-bar-track"><div class="sim-bar-fill" id="civ-fill-1" style="width: 50%;"></div></div>
                    
                    <div class="sim-bar-label">
                        <span>${label2}</span>
                        <span id="civ-val-2">50%</span>
                    </div>
                    <div class="sim-bar-track"><div class="sim-bar-fill" id="civ-fill-2" style="width: 50%;"></div></div>
                    
                    <div class="sim-bar-label">
                        <span>${label3}</span>
                        <span id="civ-val-3">50%</span>
                    </div>
                    <div class="sim-bar-track"><div class="sim-bar-fill" id="civ-fill-3" style="width: 50%;"></div></div>
                </div>
            </div>
        `;
        
        const slider = document.getElementById("civ-policy-slider");
        const sliderVal = document.getElementById("civ-slider-val");
        const val1 = document.getElementById("civ-val-1");
        const val2 = document.getElementById("civ-val-2");
        const val3 = document.getElementById("civ-val-3");
        const fill1 = document.getElementById("civ-fill-1");
        const fill2 = document.getElementById("civ-fill-2");
        const fill3 = document.getElementById("civ-fill-3");
        
        function updateCivSim() {
            const val = parseInt(slider.value);
            sliderVal.textContent = val;
            
            val1.textContent = val + "%";
            fill1.style.width = val + "%";
            
            let v2 = Math.round(val * 0.9 + 5);
            val2.textContent = v2 + "%";
            fill2.style.width = v2 + "%";
            
            if (ch.id === "civ_v3_c3") {
                v3 = 100 - val;
                val3.textContent = (100 - val) + "%";
                fill3.style.width = (100 - val) + "%";
            } else {
                v3 = Math.round(val * 0.85 + 10);
                val3.textContent = v3 + "%";
                fill3.style.width = v3 + "%";
            }
        }
        
        slider.addEventListener("input", updateCivSim);
        updateCivSim();
    }
    // 4. Welfare Budget Simulator
    else if (ch.diagramType === "welfare-budget-simulator") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 8px; font-weight: 700; text-align: center;">🏥 國家社會福利預算分配模擬器</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px; text-align: center;">分配三大福利支出比例，平衡安全網與國家財政！</p>
            <div style="width: 100%; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; text-align: left;">
                <div style="background-color: var(--bg-secondary); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px;">
                    <div class="sim-bar-label"><span>🛡️ 社會保險 (健保/勞保) 補助：<span id="budget-1-val">30</span>%</span></div>
                    <input type="range" id="budget-1" min="10" max="60" value="30" style="width: 100%; cursor: pointer;" />
                    
                    <div class="sim-bar-label"><span>🆘 社會救助 (低收補助) 預算：<span id="budget-2-val">30</span>%</span></div>
                    <input type="range" id="budget-2" min="10" max="60" value="30" style="width: 100%; cursor: pointer;" />
                    
                    <div class="sim-bar-label"><span>👶 福利服務 (育兒/長照) 投入：<span id="budget-3-val">30</span>%</span></div>
                    <input type="range" id="budget-3" min="10" max="60" value="30" style="width: 100%; cursor: pointer;" />
                </div>
                
                <div class="slider-info-box">
                    <div class="sim-bar-label">
                        <span>🕸️ 社會安全網涵蓋率</span>
                        <span id="safety-net-val">60%</span>
                    </div>
                    <div class="sim-bar-track"><div class="sim-bar-fill" id="safety-net-fill" style="width: 60%; background-color: var(--color-success);"></div></div>
                    
                    <div class="sim-bar-label">
                        <span>💸 國家財政赤字與稅收壓力</span>
                        <span id="tax-pressure-val">60%</span>
                    </div>
                    <div class="sim-bar-track"><div class="sim-bar-fill" id="tax-pressure-fill" style="width: 60%; background-color: var(--color-danger);"></div></div>
                </div>
            </div>
        `;
        
        const b1 = document.getElementById("budget-1");
        const b2 = document.getElementById("budget-2");
        const b3 = document.getElementById("budget-3");
        const b1v = document.getElementById("budget-1-val");
        const b2v = document.getElementById("budget-2-val");
        const b3v = document.getElementById("budget-3-val");
        const safetyNetVal = document.getElementById("safety-net-val");
        const safetyNetFill = document.getElementById("safety-net-fill");
        const taxPressureVal = document.getElementById("tax-pressure-val");
        const taxPressureFill = document.getElementById("tax-pressure-fill");
        
        function updateBudgetSim() {
            const v1 = parseInt(b1.value);
            const v2 = parseInt(b2.value);
            const v3 = parseInt(b3.value);
            
            b1v.textContent = v1;
            b2v.textContent = v2;
            b3v.textContent = v3;
            
            const total = v1 + v2 + v3;
            const safety = Math.round((v1 * 0.4 + v2 * 0.35 + v3 * 0.25) * 1.5);
            const pressure = Math.round((total / 180) * 100);
            
            safetyNetVal.textContent = safety + "%";
            safetyNetFill.style.width = safety + "%";
            
            taxPressureVal.textContent = pressure + "%";
            taxPressureFill.style.width = pressure + "%";
        }
        
        [b1, b2, b3].forEach(el => el.addEventListener("input", updateBudgetSim));
        updateBudgetSim();
    }
    // 5. Civil capacity age detector
    else if (ch.diagramType === "civil-capacity") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">🛍️ 臺灣民法「行為能力」互動檢測器</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">拖動滑桿，檢測該年齡在法律上可以獨立做哪些事情！</p>
            <div style="width: 100%; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; text-align: left;">
                <div style="background-color: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px; align-items: center;">
                    <div style="font-weight: 800; font-size: 15px;">受檢測者年齡：<span id="capacity-age" style="color: var(--theme-color); font-size: 24px;">15</span> 歲</div>
                    <input type="range" id="capacity-slider" min="0" max="25" value="15" style="width: 90%; cursor: pointer;" />
                </div>
                <div id="capacity-result-card" style="background-color: var(--theme-color-light); border-left: 4px solid var(--theme-color); padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6;">
                    <b>法律地位：限制行為能力人</b><br>
                    - 購買飲料、文具等日常必需行為：<b>有效</b>！<br>
                    - 購買五萬元高檔手機、獨自簽約、辦理信用卡：<b>效力未定</b>，需家長（法定代理人）同意始生效力。<br>
                    - 純獲利益（受贈零用錢）：<b>有效</b>！
                </div>
            </div>
        `;
        
        const slider = document.getElementById("capacity-slider");
        const ageText = document.getElementById("capacity-age");
        const resultCard = document.getElementById("capacity-result-card");
        
        function updateCapacity() {
            const age = parseInt(slider.value);
            ageText.textContent = age;
            
            if (age < 7) {
                resultCard.innerHTML = `
                    <b style="color: var(--color-danger);">法律地位：無行為能力人 (未滿7歲)</b><br>
                    - 所有民事行為（如買飲料、玩具）：<b>無效</b>！<br>
                    - 必須由法定代理人（家長）代為意思表示。<br>
                    - 即使是受贈壓歲錢，也需由法定代理人處理。
                `;
            } else if (age >= 7 && age < 18) {
                resultCard.innerHTML = `
                    <b style="color: var(--theme-color);">法律地位：限制行為能力人 (7至18歲)</b><br>
                    - 購買點心、搭公車等日常必需行為：<b>有效</b>！<br>
                    - 純獲利益行為（如收受長輩贈送的零用錢）：<b>有效</b>！<br>
                    - 簽約、辦理銀行開戶、購買昂貴手機：<b>效力未定</b>，需法定代理人事前同意或事後承認，否則無效。
                `;
            } else {
                resultCard.innerHTML = `
                    <b style="color: var(--color-success);">法律地位：完全行為能力人 (滿18歲成年)</b><br>
                    - 具有完全的法律行為能力！<br>
                    - 可以獨立簽訂任何合法契約（租屋、買車、申辦信用卡）。<br>
                    - 可獨立開立銀行戶頭、成立公司，並對自身的簽約行為負完全責任。
                `;
            }
        }
        slider.addEventListener("input", updateCapacity);
        updateCapacity();
    }
    // 6. Criminal liability age detector
    else if (ch.diagramType === "criminal-punishment") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">⚖️ 我國刑法「責任能力與刑罰」判定器</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">調整年齡，檢測觸犯法律時的刑事責任判定！</p>
            <div style="width: 100%; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; text-align: left;">
                <div style="background-color: var(--bg-secondary); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 8px; align-items: center;">
                    <div style="font-weight: 800; font-size: 15px;">涉案者年齡：<span id="criminal-age" style="color: var(--theme-color); font-size: 24px;">15</span> 歲</div>
                    <input type="range" id="criminal-slider" min="0" max="90" value="15" style="width: 90%; cursor: pointer;" />
                </div>
                <div id="criminal-result-card" style="background-color: var(--theme-color-light); border-left: 4px solid var(--theme-color); padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6;">
                    <b>刑事責任：限制責任能力人 (14-18歲)</b><br>
                    - 觸犯刑法時，得減輕其刑。<br>
                    - 優先適用《少年事件處理法》，由少年法庭審理，判處保護處分（如保護管束），引導改過自新，而非直接投入成人監獄。
                </div>
            </div>
        `;
        
        const slider = document.getElementById("criminal-slider");
        const ageText = document.getElementById("criminal-age");
        const resultCard = document.getElementById("criminal-result-card");
        
        function updateCriminal() {
            const age = parseInt(slider.value);
            ageText.textContent = age;
            
            if (age < 14) {
                resultCard.innerHTML = `
                    <b style="color: var(--color-danger);">刑事地位：無責任能力人 (未滿14歲)</b><br>
                    - 其行為不予處罰（不罰）。<br>
                    - 偏差行為改由學校及家長加強輔導，結合社政資源提供關懷。<br>
                    - 注意：雖然免除刑罰，但被害人仍可向家長索取民事損害賠償。
                `;
            } else if (age >= 14 && age < 18) {
                resultCard.innerHTML = `
                    <b style="color: var(--theme-color);">刑事地位：限制責任能力人 (14至18歲)</b><br>
                    - 觸犯刑法時，<b>得減輕其刑</b>。<br>
                    - 優先適用《少年事件處理法》，由少年法庭審理保護處分（如保護管束、感化教育）。<br>
                    - 18歲以下觸法不得判處死刑或無期徒刑。
                `;
            } else if (age >= 18 && age < 80) {
                resultCard.innerHTML = `
                    <b style="color: var(--color-success);">刑事地位：完全責任能力人 (18至80歲)</b><br>
                    - 具有完全刑事責任能力！<br>
                    - 觸犯刑法時，將面臨刑事起訴與刑罰（如徒刑、罰金），並留有刑事前科。
                `;
            } else {
                resultCard.innerHTML = `
                    <b style="color: var(--theme-color);">刑事地位：限制責任能力人 (滿80歲高齡者)</b><br>
                    - 考量高齡者生理機能，刑法規定滿80歲以上者犯罪，<b>得減輕其刑</b>。
                `;
            }
        }
        slider.addEventListener("input", updateCriminal);
        updateCriminal();
    }
    // 7. Law Hierarchy pyramid
    else if (ch.diagramType === "law-hierarchy") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">📐 臺灣法規位階互動金字塔</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">點擊金字塔各階層，了解法規位階關係！</p>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div class="pyramid-wrapper" style="width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
                    <button id="pyr-1" class="sim-btn" style="width: 50%; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); height: 60px; background-color: #f59e0b; color: white; font-weight: bold; padding-top: 25px;">憲法 (最高)</button>
                    <button id="pyr-2" class="sim-btn" style="width: 80%; height: 50px; background-color: #3b82f6; color: white; font-weight: bold;">法律 (中)</button>
                    <button id="pyr-3" class="sim-btn" style="width: 100%; height: 50px; background-color: #10b981; color: white; font-weight: bold;">命令 (最低)</button>
                </div>
                <div id="pyramid-desc-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; text-align: center; width: 100%; max-width: 500px;">
                    💡 點選金字塔階層查看各法規位階定義與實例。
                </div>
            </div>
        `;
        
        const p1 = document.getElementById("pyr-1");
        const p2 = document.getElementById("pyr-2");
        const p3 = document.getElementById("pyr-3");
        const descCard = document.getElementById("pyramid-desc-card");
        
        function setPyramidActive(activeBtn, text) {
            [p1, p2, p3].forEach(b => b.classList.remove("active"));
            activeBtn.classList.add("active");
            descCard.innerHTML = text;
        }
        
        p1.addEventListener("click", () => {
            setPyramidActive(p1, `<b>⭐ 憲法 (Constitution)</b><br> - <b>效力最高：</b>為國家根本大法，效力高於法律及命令。下位階法規牴觸者無效。<br> - <b>實例：</b>中華民國憲法、憲法增修條文。<br> - <b>修改最難：</b>需經超高門檻之國會決議與公民複決。`);
        });
        p2.addEventListener("click", () => {
            setPyramidActive(p2, `<b>📘 法律 (Statutes)</b><br> - <b>效力中等：</b>不得牴觸憲法。名稱通常為『法、律、條例、通則』。<br> - <b>實例：</b>民法、刑法、社會秩序維護法。<br> - <b>制定權限：</b>立法院三讀通過，總統公布實施。`);
        });
        p3.addEventListener("click", () => {
            setPyramidActive(p3, `<b>🟢 命令 (Regulations / Orders)</b><br> - <b>效力最低：</b>不得牴觸憲法及法律。名稱多為『規程、規則、細則、辦法』。<br> - <b>實例：</b>民法施行細則、道路交通安全規則。<br> - <b>制定權限：</b>行政機關（如教育部、交通部）發布。`);
        });
        p1.click();
    }
    // 8. IP protection matching
    else if (ch.diagramType === "ip-protection") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">💡 智慧財產權 (IP) 分類配對檢測</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px; text-align: center;">點擊不同權利，查看保護年限與所屬實例！</p>
            <div style="display: flex; gap: 10px; margin-bottom: 16px; justify-content: center; flex-wrap: wrap;">
                <button class="sim-btn active" id="ip-btn-1">📘 著作權 (Copyright)</button>
                <button class="sim-btn" id="ip-btn-2">📙 專利權 (Patent)</button>
                <button class="sim-btn" id="ip-btn-3">🟢 商標權 (Trademark)</button>
            </div>
            <div id="ip-result-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto; box-shadow: var(--shadow-sm); text-align: left;">
                <b>📘 著作權 (Copyright)</b><br>
                - <b>取得方式：</b>創作完成即自動取得（無須登記申請）。<br>
                - <b>保護年限：</b>著作人終身加上死後 50 年。<br>
                - <b>實例範圍：</b>小說、音樂、詞曲、照片、畫作、程式代碼、網頁設計。
            </div>
        `;
        
        const b1 = document.getElementById("ip-btn-1");
        const b2 = document.getElementById("ip-btn-2");
        const b3 = document.getElementById("ip-btn-3");
        const card = document.getElementById("ip-result-card");
        
        function setIPActive(activeBtn, text) {
            [b1, b2, b3].forEach(b => b.classList.remove("active"));
            activeBtn.classList.add("active");
            card.innerHTML = text;
        }
        
        b1.addEventListener("click", () => {
            setIPActive(b1, `<b>📘 著作權 (Copyright)</b><br> - <b>取得方式：</b>創作完成即自動取得。<br> - <b>保護年限：</b>著作人終身加上死後 50 年。<br> - <b>實例範圍：</b>小說、音樂、詞曲、照片、畫作、程式代碼。`);
        });
        b2.addEventListener("click", () => {
            setIPActive(b2, `<b>📙 專利權 (Patent)</b><br> - <b>取得方式：</b>必須向經濟部智慧財產局「申請核准」始取得。<br> - <b>保護年限：</b>發明專利為 20 年；新型為 10 年；設計為 15 年。<br> - <b>實例範圍：</b>晶圓製程晶片結構、摺疊螢幕鉸鏈設計、新藥配方。`);
        });
        b3.addEventListener("click", () => {
            setIPActive(b3, `<b>🟢 商標權 (Trademark)</b><br> - <b>取得方式：</b>必須向經濟部智慧財產局「申請註冊」始取得。<br> - <b>保護年限：</b>登記註冊後 10 年，<b>可無限期延展續展</b>。<br> - <b>實例範圍：</b>Apple標誌、麥當勞M型標誌、Nike勾勾符號。`);
        });
    }
    // 9. Media literacy check
    else if (ch.diagramType === "media-literacy") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">📱 假新聞與標題黨「事實查核」檢測器</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px; text-align: center;">點擊下列新聞標題，檢測是否含有假訊息成分！</p>
            <div style="display: flex; flex-direction: column; gap: 10px; max-width: 500px; margin: 0 auto; width: 100%; text-align: left;">
                <button class="option-btn" id="fake-1">⚠️「震驚！吃這個水果會引發急性中毒死亡，轉發救人！」</button>
                <button class="option-btn" id="fake-2">⚠️「某國外首腦與外星人秘密協議曝光？驚天秘密流出」</button>
                <button class="option-btn" id="fake-3">✅「氣象署：強颱即將於週五登陸，請中南部山區加強防颱準備」</button>
                <div id="fake-result" style="background-color: var(--bg-tertiary); padding: 14px; border-radius: 8px; font-size: 13px; text-align: center; border-left: 4px solid var(--border-color); margin-top: 10px;">
                    💡 請點擊上方的新聞標題進行識讀查核。
                </div>
            </div>
        `;
        
        const f1 = document.getElementById("fake-1");
        const f2 = document.getElementById("fake-2");
        const f3 = document.getElementById("fake-3");
        const result = document.getElementById("fake-result");
        
        f1.addEventListener("click", () => {
            result.style.borderLeftColor = "var(--color-danger)";
            result.innerHTML = `❌ <b>檢測結果：典型的誇張標題黨（假訊息）！</b><br> - <b>識讀要點：</b>使用『震驚、快轉發』等煽動性字眼。內容缺乏權威醫學依據，請勿轉發！`;
        });
        f2.addEventListener("click", () => {
            result.style.borderLeftColor = "var(--color-danger)";
            result.innerHTML = `❌ <b>檢測結果：陰謀論與捏造假訊息！</b><br> - <b>識讀要點：</b>使用模糊照片或未指明來源的『秘密曝光』，通常為騙點閱率的陰謀論，請保持懷疑。`;
        });
        f3.addEventListener("click", () => {
            result.style.borderLeftColor = "var(--color-success)";
            result.innerHTML = `🟢 <b>檢測結果：可信度高的事實新聞！</b><br> - <b>識讀要點：</b>明確指出資訊權威來源（氣象署），內容客觀、不帶偏激字眼，符合公眾利益。`;
        });
    }
    // 10. Place names map
    else if (ch.diagramType === "placename-map") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 8px; font-weight: 700; text-align: center;">🗺️ 臺灣地名命名由來探索圖</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px; text-align: center;">點擊不同類型的命名，了解地名背後的地理與歷史印記！</p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">
                <button class="sim-btn active" id="place-btn-1">⛰️ 地形與自然</button>
                <button class="sim-btn" id="place-btn-2">🌾 開墾與產權</button>
                <button class="sim-btn" id="place-btn-3">🏹 原住民音譯</button>
                <button class="sim-btn" id="place-btn-4">⚔️ 軍事屯田</button>
            </div>
            <div id="place-desc" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 18px; border-radius: 12px; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto; box-shadow: var(--shadow-sm); text-align: left;">
                <b>⛰️ 與地形、自然環境有關的命名</b><br>
                - <b>地名實例：</b>竹山 (南投)、楊梅 (桃園)、恆春 (屏東，氣候四季如春)。<br>
                - <b>地理意義：</b>反映當地的原始地形特色或植物特產，印證人地互動。
            </div>
        `;
        
        const b1 = document.getElementById("place-btn-1");
        const b2 = document.getElementById("place-btn-2");
        const b3 = document.getElementById("place-btn-3");
        const b4 = document.getElementById("place-btn-4");
        const desc = document.getElementById("place-desc");
        
        function setPlaceActive(activeBtn, text) {
            [b1, b2, b3, b4].forEach(b => b.classList.remove("active"));
            activeBtn.classList.add("active");
            desc.innerHTML = text;
        }
        
        b1.addEventListener("click", () => {
            setPlaceActive(b1, `<b>⛰️ 與地形、自然環境有關的命名</b><br> - <b>地名實例：</b>竹山 (南投)、楊梅 (桃園)、恆春 (屏東，氣候四季如春)。<br> - <b>地理意義：</b>直接反映當地的原始地形特色或植物特產，印證人地互動。`);
        });
        b2.addEventListener("click", () => {
            setPlaceActive(b2, `<b>🌾 與開墾、股份產權有關的命名</b><br> - <b>地名實例：</b>五股 (新北)、九份 (新北，開墾樟腦股份)、頭城 (宜蘭)。<br> - <b>地理意義：</b>記錄清代漢人合作拓墾時的契約股份、開墾順序，是開墾史的活化石。`);
        });
        b3.addEventListener("click", () => {
            setPlaceActive(b3, `<b>🏹 與原住民音譯有關的命名</b><br> - <b>地名實例：</b>打狗 (高雄，源自竹林Takau)、打貓 (嘉義民雄)、烏來 (新北，源自溫泉Ulay)。<br> - <b>地理意義：</b>以漢語拼寫原住民族語，保留了原住民族在這片土地最早居住的痕跡。`);
        });
        b4.addEventListener("click", () => {
            setPlaceActive(b4, `<b>⚔️ 與鄭氏時期軍事屯田有關的命名</b><br> - <b>地名實例：</b>左營 (高雄)、前鎮 (高雄)、新營 (臺南)、柳營 (臺南)。<br> - <b>地理意義：</b>鄭氏政權實行軍隊屯田開墾，各營盤駐紮點名稱因而演變為今日地名。`);
        });
    }
    // 11. Food safety flow
    else if (ch.diagramType === "foodsafety-flow") {
        stage.innerHTML = `
            <h3 style="margin-bottom: 12px; font-weight: 700; text-align: center;">🥗 臺灣食品安全認證與食物里程模擬</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">點擊食材來源，比較其「食物里程」與「食品標章」的健康與減碳成效！</p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">
                <button class="sim-btn active" id="food-btn-1">🥩 紐西蘭進口冷藏牛肉</button>
                <button class="sim-btn" id="food-btn-2">🥬 臺灣國產有機 TAP 青菜</button>
            </div>
            <div id="food-desc" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 18px; border-radius: 12px; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto; box-shadow: var(--shadow-sm); text-align: left;">
                <b>🥩 紐西蘭進口冷藏牛肉</b><br>
                - <b>運輸途徑：</b>跨越 9,000 公里海運動送達臺灣。<br>
                - <b>食物里程：</b>極高（碳排放大，運輸碳足跡沉重）。<br>
                - <b>食安檢測：</b>需經海關檢疫，認明標章與藥物檢驗報告。
            </div>
        `;
        
        const b1 = document.getElementById("food-btn-1");
        const b2 = document.getElementById("food-btn-2");
        const desc = document.getElementById("food-desc");
        
        b1.addEventListener("click", () => {
            b1.classList.add("active");
            b2.classList.remove("active");
            desc.innerHTML = `<b>🥩 紐西蘭進口冷藏牛肉</b><br> - <b>運輸途徑：</b>跨越 9,000 公里海運送達臺灣。<br> - <b>食物里程：</b>極高（碳排放大，運輸碳足跡沉重）。<br> - <b>食安檢測：</b>需經海關檢疫，認明產地與無藥物殘留報告。`;
        });
        b2.addEventListener("click", () => {
            b1.classList.remove("active");
            b2.classList.add("active");
            desc.innerHTML = `<b>🥬 臺灣國產有機 TAP 青菜 (地產地消)</b><br> - <b>運輸途徑：</b>在地小農產地直送，運輸少於 100 公里。<br> - <b>食物里程：</b>極低（近乎零運輸碳足跡，綠色環保）。<br> - <b>食安標章：</b>印有 <b>TAP 產銷履歷</b> 與 <b>CAS 有機認證</b>，可掃描 QR Code 追溯耕作施肥歷程。`;
        });
    }
    // Fallback for other diagramTypes
    else {
        stage.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <span style="font-size: 48px;">🎯</span>
                <p style="margin-top: 10px; font-weight: bold;">本單元已提供完整摘要、詞彙閃卡與測驗題庫</p>
                <p style="font-size: 12px; margin-top: 4px;">本學習模組專注於基礎概念地圖與挑戰自我小測驗！</p>
            </div>
        `;
    }
}

// Render & Setup "📝 挑戰自我小測驗"
function resetQuiz() {
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.answered = false;
    quizState.selectedOption = null;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const ch = findChapterById(currentChapterId);
    if (!ch || !ch.quizzes || ch.quizzes.length === 0) {
        document.getElementById("quiz-panel").innerHTML = "<div class='info-card' style='text-align:center;'>本單元尚無測驗題庫。</div>";
        return;
    }
    
    quizState.answered = false;
    quizState.selectedOption = null;
    
    const currentQ = ch.quizzes[quizState.currentIndex];
    
    document.getElementById("quiz-current-num").textContent = quizState.currentIndex + 1;
    document.getElementById("quiz-score").textContent = `${quizState.score} / ${ch.quizzes.length}`;
    document.getElementById("quiz-question").textContent = currentQ.q;
    
    const optionsContainer = document.getElementById("quiz-options-container");
    optionsContainer.innerHTML = "";
    
    currentQ.a.forEach((optionText, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<span style="font-weight: bold; margin-right: 8px;">${idx + 1}.</span> ${optionText}`;
        btn.dataset.idx = idx;
        
        btn.addEventListener("click", () => {
            if (quizState.answered) return;
            selectOption(idx, ch.quizzes[quizState.currentIndex]);
        });
        
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById("quiz-explanation").style.display = "none";
    
    const nextBtn = document.getElementById("quiz-next-btn");
    nextBtn.disabled = true;
    nextBtn.textContent = quizState.currentIndex === ch.quizzes.length - 1 ? "完成測驗" : "下一題";
}

function selectOption(selectedIdx, quizData) {
    quizState.answered = true;
    quizState.selectedOption = selectedIdx;
    
    const options = document.querySelectorAll(".quiz-options .option-btn");
    options.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === quizData.correct) {
            btn.classList.add("correct");
        } else if (idx === selectedIdx) {
            btn.classList.add("wrong");
        }
    });
    
    if (selectedIdx === quizData.correct) {
        quizState.score++;
        document.getElementById("quiz-score").textContent = `${quizState.score} / ${options.length}`;
    }
    
    // Show explanation
    const expBox = document.getElementById("quiz-explanation");
    const expText = document.getElementById("quiz-explanation-text");
    const expTitle = document.getElementById("quiz-exp-title");
    
    if (selectedIdx === quizData.correct) {
        expTitle.innerHTML = "🎉 答對了！解析小撇步";
        expBox.style.borderLeftColor = "var(--color-success)";
    } else {
        expTitle.innerHTML = "💡 答錯了！解析小撇步";
        expBox.style.borderLeftColor = "var(--color-danger)";
    }
    
    expText.textContent = quizData.exp;
    expBox.style.display = "block";
    
    const nextBtn = document.getElementById("quiz-next-btn");
    nextBtn.disabled = false;
    
    nextBtn.onclick = () => {
        const ch = findChapterById(currentChapterId);
        if (quizState.currentIndex === ch.quizzes.length - 1) {
            showQuizResult();
        } else {
            quizState.currentIndex++;
            loadQuizQuestion();
        }
    };
}

function showQuizResult() {
    const panel = document.getElementById("quiz-panel");
    const ch = findChapterById(currentChapterId);
    const totalQuestions = ch.quizzes.length;
    const pct = Math.round((quizState.score / totalQuestions) * 100);
    
    let comment = "繼續加油！多複習摘要可以考更好喔。";
    if (pct === 100) comment = "太完美了！你對本單元的核心概念掌握得無懈可擊！";
    else if (pct >= 80) comment = "非常優秀！你已經具備段考奪冠的實力！";
    else if (pct >= 60) comment = "表現不錯，差一點就完美了，再接再厲！";
    
    panel.innerHTML = `
        <div class="info-card" style="text-align: center; padding: 40px; animation: fadeIn var(--transition-normal);">
            <div style="font-size: 64px; margin-bottom: 20px;">🏆</div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 12px; color: var(--text-primary);">本單元測驗完成！</h2>
            <div style="font-size: 48px; font-weight: 900; color: var(--theme-color); margin-bottom: 12px;">${pct} 分</div>
            <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 8px;">答對題數：${quizState.score} / ${totalQuestions} 題</p>
            <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 30px; font-style: italic;">"${comment}"</p>
            <button class="quiz-action-btn" onclick="resetQuizPage()">重新挑戰測驗</button>
        </div>
    `;
    
    const recordKey = `ch_${currentChapterId}_score`;
    const prevMax = parseInt(localStorage.getItem(recordKey) || "0");
    if (quizState.score > prevMax) {
        localStorage.setItem(recordKey, quizState.score.toString());
    }
    
    updateOverallProgress();
}

function resetQuizPage() {
    const panel = document.getElementById("quiz-panel");
    panel.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <div style="font-weight: 700;">第 <span id="quiz-current-num">1</span> 題 / 共 5 題</div>
                <div class="quiz-score-display">得分：<span id="quiz-score">0 / 5</span></div>
            </div>
            
            <div class="quiz-question-box" id="quiz-question">
                載入題目中...
            </div>
            
            <div class="quiz-options" id="quiz-options-container">
                <!-- Options populated dynamically -->
            </div>
            
            <div class="quiz-explanation-box" id="quiz-explanation" style="display: none;">
                <div class="explanation-title">
                    <span id="quiz-exp-title">💡 解析小撇步</span>
                </div>
                <p id="quiz-explanation-text" style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                    解析內容載入中...
                </p>
            </div>
            
            <div class="quiz-footer">
                <button class="quiz-action-btn" id="quiz-next-btn" disabled>下一題</button>
            </div>
        </div>
    `;
    resetQuiz();
}

// Track and update the overall progress bar across all 9 volumes
function updateOverallProgress() {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    for (const sub in socialStudiesData) {
        for (const vol in socialStudiesData[sub]) {
            socialStudiesData[sub][vol].forEach(ch => {
                const score = parseInt(localStorage.getItem(`ch_${ch.id}_score`) || "0");
                totalScore += score;
                maxPossibleScore += ch.quizzes ? ch.quizzes.length : 5;
            });
        }
    }
    
    const pct = maxPossibleScore > 0 ? Math.min(Math.round((totalScore / maxPossibleScore) * 100), 100) : 0;
    
    const fill = document.getElementById("overall-progress-fill");
    const text = document.getElementById("overall-progress-text");
    if (fill && text) {
        fill.style.width = `${pct}%`;
        text.textContent = `${pct}%`;
    }
}
