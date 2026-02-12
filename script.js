// =====================================================
// script.js — SSPOE Physics PWA Engine
// =====================================================
// Handles: routing, language, SSPOE cycle, PWA install
// =====================================================

(function () {
    'use strict';

    // ── State ──
    const state = {
        lang: localStorage.getItem('sspoe-lang') || 'fr',
        currentView: 'home',       // home | courses | player
        currentLevel: null,        // level object
        currentCourse: null,       // course object
        currentActivity: null,     // activity object
        sspoeStep: 0,              // 0=prediction, 1=observation, 2=explanation
        selectedAnswer: null,      // user's prediction answer
        simFullscreen: false
    };

    // ── DOM refs ──
    const $app = document.getElementById('app');
    const $navTitle = document.getElementById('nav-title');
    const $btnBack = document.getElementById('btn-back');
    const $btnLang = document.getElementById('btn-lang');
    const $langLabel = document.getElementById('lang-label');
    const $installBanner = document.getElementById('install-banner');
    const $btnInstall = document.getElementById('btn-install');
    const $installText = document.getElementById('install-text');

    // ── Helpers ──
    function t(obj) {
        if (!obj) return '';
        return obj[state.lang] || obj.fr || '';
    }

    function setLang(lang) {
        state.lang = lang;
        localStorage.setItem('sspoe-lang', lang);
        document.documentElement.lang = lang === 'ar' ? 'ar' : 'fr';
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        $langLabel.textContent = t(APP_DATA.ui.language);
        $installText.textContent = t(APP_DATA.ui.installApp);
        render();
    }

    function showBackBtn(visible) {
        $btnBack.style.visibility = visible ? 'visible' : 'hidden';
    }

    // Simple markdown-like bold parser for explanation text
    function formatText(text) {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    // ── Render Router ──
    function render() {
        switch (state.currentView) {
            case 'home':
                renderHome();
                break;
            case 'courses':
                renderCourses();
                break;
            case 'player':
                renderPlayer();
                break;
        }
    }

    // ── HOME SCREEN ──
    function renderHome() {
        showBackBtn(false);
        $navTitle.textContent = t(APP_DATA.app.title);

        const levelsHTML = APP_DATA.levels.map((level) => {
            const otherLang = state.lang === 'fr' ? 'ar' : 'fr';
            return `
        <div class="level-card" data-level="${level.id}" style="--level-color: ${level.color}">
          <div class="level-icon">${level.icon}</div>
          <div class="level-info">
            <div class="level-name">${t(level.name)}</div>
            <div class="level-name-ar">${level.name[otherLang]}</div>
          </div>
          <svg class="level-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="${state.lang === 'ar' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'}"></polyline>
          </svg>
        </div>
      `;
        }).join('');

        const otherLang = state.lang === 'fr' ? 'ar' : 'fr';

        $app.innerHTML = `
      <div class="home-screen">
        <div class="home-hero">
          <span class="home-icon">⚛️</span>
          <h2 class="home-title">${t(APP_DATA.app.title)}</h2>
          <p class="home-subtitle">${t(APP_DATA.app.subtitle)}</p>
          <span class="home-ar-subtitle">${APP_DATA.app.subtitle[otherLang]}</span>
        </div>
        <p class="home-welcome">${t(APP_DATA.app.welcome)}</p>
        <div class="levels-grid">
          ${levelsHTML}
        </div>
      </div>
    `;

        // Bind level clicks
        $app.querySelectorAll('.level-card').forEach((card) => {
            card.addEventListener('click', () => {
                const levelId = card.dataset.level;
                state.currentLevel = APP_DATA.levels.find((l) => l.id === levelId);
                state.currentView = 'courses';
                render();
            });
        });
    }

    // ── COURSES LIST ──
    function renderCourses() {
        const level = state.currentLevel;
        showBackBtn(true);
        $navTitle.textContent = t(level.shortName) + ' — ' + t(APP_DATA.ui.courses);

        if (!level.courses || level.courses.length === 0) {
            $app.innerHTML = `
        <div class="course-list">
          <div class="section-header">
            <h2 class="section-title">${t(level.name)}</h2>
            <p class="section-subtitle">${level.name[state.lang === 'fr' ? 'ar' : 'fr']}</p>
          </div>
          <div class="no-courses">
            <span class="no-courses-icon">📚</span>
            <p>${t(APP_DATA.ui.noCourses)}</p>
          </div>
        </div>
      `;
            return;
        }

        const coursesHTML = level.courses.map((course) => {
            // Build activities list
            const activitiesHTML = course.activities.map((act, idx) => `
        <div class="activity-card" data-course="${course.id}" data-activity="${act.id}">
          <div class="activity-number" style="background: ${level.color}">${idx + 1}</div>
          <span class="activity-name">${t(act.title)}</span>
          <svg class="course-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="${state.lang === 'ar' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'}"></polyline>
          </svg>
        </div>
      `).join('');

            return `
        <div class="course-card-wrapper">
          <div class="course-card" style="pointer-events: none;">
            <div class="course-icon">${course.icon}</div>
            <div class="course-info">
              <div class="course-title">${t(course.title)}</div>
              <div class="course-desc">${t(course.description)}</div>
            </div>
          </div>
          <div class="activities-section">
            ${activitiesHTML}
          </div>
        </div>
      `;
        }).join('');

        $app.innerHTML = `
      <div class="course-list">
        <div class="section-header">
          <h2 class="section-title">${t(level.name)}</h2>
          <p class="section-subtitle">${level.name[state.lang === 'fr' ? 'ar' : 'fr']}</p>
        </div>
        <div class="courses-grid">
          ${coursesHTML}
        </div>
      </div>
    `;

        // Bind activity clicks
        $app.querySelectorAll('.activity-card').forEach((card) => {
            card.addEventListener('click', () => {
                const courseId = card.dataset.course;
                const activityId = card.dataset.activity;
                const course = level.courses.find((c) => c.id === courseId);
                const activity = course.activities.find((a) => a.id === activityId);

                state.currentCourse = course;
                state.currentActivity = activity;
                state.sspoeStep = 0;
                state.selectedAnswer = null;
                state.currentView = 'player';
                render();
            });
        });
    }

    // ── SSPOE PLAYER ──
    function renderPlayer() {
        const activity = state.currentActivity;
        showBackBtn(true);
        $navTitle.textContent = t(activity.title);

        const steps = [
            { label: t(APP_DATA.ui.stepPrediction), icon: '🤔' },
            { label: t(APP_DATA.ui.stepObservation), icon: '🔍' },
            { label: t(APP_DATA.ui.stepExplanation), icon: '💡' }
        ];

        const progressHTML = steps.map((step, idx) => {
            let dotClass = '';
            if (idx < state.sspoeStep) dotClass = 'completed';
            else if (idx === state.sspoeStep) dotClass = 'active';

            const lineHTML = idx < steps.length - 1
                ? `<div class="step-line ${idx < state.sspoeStep ? 'completed' : ''}"></div>`
                : '';

            return `
        <div class="step-indicator">
          <div class="step-dot ${dotClass}">
            <div class="step-circle">${step.icon}</div>
            <span class="step-label">${step.label}</span>
          </div>
          ${lineHTML}
        </div>
      `;
        }).join('');

        let stepContentHTML = '';

        // ── STEP 0: PREDICTION ──
        if (state.sspoeStep === 0) {
            stepContentHTML = renderPrediction(activity);
        }
        // ── STEP 1: OBSERVATION ──
        else if (state.sspoeStep === 1) {
            stepContentHTML = renderObservation(activity);
        }
        // ── STEP 2: EXPLANATION ──
        else if (state.sspoeStep === 2) {
            stepContentHTML = renderExplanation(activity);
        }

        $app.innerHTML = `
      <div class="sspoe-player">
        <div class="step-progress">
          ${progressHTML}
        </div>
        ${stepContentHTML}
      </div>
    `;

        // Bind step-specific events
        if (state.sspoeStep === 0) {
            bindPredictionEvents(activity);
        } else if (state.sspoeStep === 1) {
            bindObservationEvents(activity);
        } else if (state.sspoeStep === 2) {
            bindExplanationEvents();
        }
    }

    // ── PREDICTION RENDERING ──
    function renderPrediction(activity) {
        const pred = activity.prediction;

        let answersHTML = '';
        if (pred.type === 'mcq') {
            answersHTML = `
        <div class="choices-list">
          ${pred.choices.map((c) => `
            <button class="choice-btn" data-choice="${c.id}">
              <span class="choice-letter">${c.id.toUpperCase()}</span>
              <span class="choice-text">${t(c.text)}</span>
            </button>
          `).join('')}
        </div>
      `;
        } else if (pred.type === 'open') {
            answersHTML = `
        <textarea class="open-answer" id="open-answer" placeholder="${t(APP_DATA.ui.writeAnswer)}"></textarea>
      `;
        } else if (pred.type === 'truefalse') {
            answersHTML = `
        <div class="choices-list">
          <button class="choice-btn" data-choice="true">
            <span class="choice-letter">✓</span>
            <span class="choice-text">${state.lang === 'ar' ? 'صحيح' : 'Vrai'}</span>
          </button>
          <button class="choice-btn" data-choice="false">
            <span class="choice-letter">✗</span>
            <span class="choice-text">${state.lang === 'ar' ? 'خطأ' : 'Faux'}</span>
          </button>
        </div>
      `;
        }

        return `
      <div class="step-card">
        <div class="step-card-header">
          <span class="step-card-icon">🤔</span>
          <h3 class="step-card-title">${t(APP_DATA.ui.stepPrediction)}</h3>
        </div>
        <div class="prediction-question">${t(pred.question)}</div>
        ${answersHTML}
        <p class="select-hint" id="select-hint">${t(APP_DATA.ui.selectAnswer)}</p>
        <button class="btn-validate" id="btn-validate" disabled>
          ${t(APP_DATA.ui.validate)}
        </button>
      </div>
    `;
    }

    function bindPredictionEvents(activity) {
        const pred = activity.prediction;
        const $btnValidate = document.getElementById('btn-validate');
        const $hint = document.getElementById('select-hint');

        if (pred.type === 'mcq' || pred.type === 'truefalse') {
            $app.querySelectorAll('.choice-btn').forEach((btn) => {
                btn.addEventListener('click', () => {
                    $app.querySelectorAll('.choice-btn').forEach((b) => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    state.selectedAnswer = btn.dataset.choice;
                    $btnValidate.disabled = false;
                    $hint.style.display = 'none';
                });
            });
        } else if (pred.type === 'open') {
            const $textarea = document.getElementById('open-answer');
            $textarea.addEventListener('input', () => {
                state.selectedAnswer = $textarea.value.trim();
                $btnValidate.disabled = state.selectedAnswer.length === 0;
                $hint.style.display = state.selectedAnswer.length > 0 ? 'none' : '';
            });
        }

        $btnValidate.addEventListener('click', () => {
            if (state.selectedAnswer) {
                state.sspoeStep = 1;
                render();
            }
        });
    }

    // ── OBSERVATION RENDERING ──
    function renderObservation(activity) {
        const sim = activity.simulation;

        return `
      <div class="step-card">
        <div class="step-card-header">
          <span class="step-card-icon">🔍</span>
          <h3 class="step-card-title">${t(APP_DATA.ui.stepObservation)}</h3>
        </div>
        <div class="sim-instructions">${t(sim.instructions)}</div>
        <div class="sim-container" id="sim-container">
          <iframe class="sim-iframe" id="sim-iframe" src="${sim.file}" 
                  sandbox="allow-scripts allow-same-origin" 
                  loading="lazy"
                  title="${t(activity.title)}"></iframe>
        </div>
        <div class="sim-controls">
          <button class="btn-fullscreen" id="btn-fullscreen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
            </svg>
            ${t(APP_DATA.ui.fullscreen)}
          </button>
          <button class="btn-next-step" id="btn-to-explanation">
            ${t(APP_DATA.ui.showExplanation)}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="${state.lang === 'ar' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'}"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
    }

    function bindObservationEvents(activity) {
        const $simContainer = document.getElementById('sim-container');
        const $btnFS = document.getElementById('btn-fullscreen');
        const $btnExpl = document.getElementById('btn-to-explanation');

        // Fullscreen toggle
        $btnFS.addEventListener('click', () => {
            if (!state.simFullscreen) {
                enterSimFullscreen($simContainer);
            }
        });

        // Go to explanation step
        $btnExpl.addEventListener('click', () => {
            exitSimFullscreen();
            state.sspoeStep = 2;
            render();
        });
    }

    function enterSimFullscreen(container) {
        state.simFullscreen = true;
        container.classList.add('sim-fullscreen');

        // Add exit button inside fullscreen container
        const exitBtn = document.createElement('button');
        exitBtn.className = 'btn-exit-fs';
        exitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      ${t(APP_DATA.ui.exitFullscreen)}
    `;
        exitBtn.addEventListener('click', () => {
            exitSimFullscreen();
        });
        container.appendChild(exitBtn);

        // Also try native fullscreen
        if (container.requestFullscreen) {
            container.requestFullscreen().catch(() => { });
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    }

    function exitSimFullscreen() {
        state.simFullscreen = false;
        const container = document.getElementById('sim-container');
        if (container) {
            container.classList.remove('sim-fullscreen');
            const exitBtn = container.querySelector('.btn-exit-fs');
            if (exitBtn) exitBtn.remove();
        }

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        } else if (document.webkitFullscreenElement) {
            document.webkitExitFullscreen();
        }
    }

    // ── EXPLANATION RENDERING ──
    function renderExplanation(activity) {
        const expl = activity.explanation;
        const pred = activity.prediction;
        const isCorrect = state.selectedAnswer === pred.correctAnswer;

        // Determine what the user answered (text)
        let userAnswerText = state.selectedAnswer;
        if (pred.type === 'mcq') {
            const choice = pred.choices.find((c) => c.id === state.selectedAnswer);
            userAnswerText = choice ? t(choice.text) : state.selectedAnswer;
        } else if (pred.type === 'truefalse') {
            userAnswerText = state.selectedAnswer === 'true'
                ? (state.lang === 'ar' ? 'صحيح' : 'Vrai')
                : (state.lang === 'ar' ? 'خطأ' : 'Faux');
        }

        // Correct answer text
        let correctAnswerText = '';
        if (pred.type === 'mcq') {
            const correct = pred.choices.find((c) => c.id === pred.correctAnswer);
            correctAnswerText = correct ? t(correct.text) : '';
        } else if (pred.type === 'truefalse') {
            correctAnswerText = pred.correctAnswer === 'true'
                ? (state.lang === 'ar' ? 'صحيح' : 'Vrai')
                : (state.lang === 'ar' ? 'خطأ' : 'Faux');
        }

        const feedbackClass = (pred.type === 'open') ? 'feedback-correct' : (isCorrect ? 'feedback-correct' : 'feedback-incorrect');
        const feedbackText = (pred.type === 'open')
            ? t(expl.feedback.correct)
            : (isCorrect ? t(expl.feedback.correct) : t(expl.feedback.incorrect));

        // Recap section (only for mcq/truefalse)
        const recapHTML = (pred.type !== 'open') ? `
      <div class="prediction-recap">
        <div class="recap-item">
          <div class="recap-label">${t(APP_DATA.ui.yourPrediction)}</div>
          <div>${userAnswerText}</div>
        </div>
        ${correctAnswerText ? `
        <div class="recap-item">
          <div class="recap-label">${t(APP_DATA.ui.correctAnswer)}</div>
          <div>${correctAnswerText}</div>
        </div>` : ''}
      </div>
    ` : `
      <div class="prediction-recap">
        <div class="recap-item">
          <div class="recap-label">${t(APP_DATA.ui.yourPrediction)}</div>
          <div>${userAnswerText}</div>
        </div>
      </div>
    `;

        return `
      <div class="step-card">
        <div class="step-card-header">
          <span class="step-card-icon">💡</span>
          <h3 class="step-card-title">${t(APP_DATA.ui.stepExplanation)}</h3>
        </div>

        <div class="feedback-card ${feedbackClass}">
          ${feedbackText}
        </div>

        ${recapHTML}

        <div class="explanation-summary">
          ${formatText(t(expl.summary))}
        </div>

        <button class="btn-back-courses" id="btn-back-courses">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="${state.lang === 'ar' ? '9 6 15 12 9 18' : '15 18 9 12 15 6'}"></polyline>
          </svg>
          ${t(APP_DATA.ui.backToCourses)}
        </button>
      </div>
    `;
    }

    function bindExplanationEvents() {
        document.getElementById('btn-back-courses').addEventListener('click', () => {
            state.currentView = 'courses';
            state.currentActivity = null;
            state.currentCourse = null;
            state.sspoeStep = 0;
            state.selectedAnswer = null;
            render();
        });
    }

    // ── NAVIGATION ──
    $btnBack.addEventListener('click', () => {
        exitSimFullscreen();

        if (state.currentView === 'player') {
            if (state.sspoeStep > 0) {
                state.sspoeStep--;
                render();
            } else {
                state.currentView = 'courses';
                state.currentActivity = null;
                render();
            }
        } else if (state.currentView === 'courses') {
            state.currentView = 'home';
            state.currentLevel = null;
            render();
        }
    });

    // ── LANGUAGE TOGGLE ──
    $btnLang.addEventListener('click', () => {
        setLang(state.lang === 'fr' ? 'ar' : 'fr');
    });

    // ── Handle back button / Escape ──
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (state.simFullscreen) {
                exitSimFullscreen();
            }
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && state.simFullscreen) {
            exitSimFullscreen();
        }
    });

    // ── PWA INSTALL ──
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        $installBanner.classList.remove('hidden');
    });

    $btnInstall.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            if (result.outcome === 'accepted') {
                $installBanner.classList.add('hidden');
            }
            deferredPrompt = null;
        }
    });

    window.addEventListener('appinstalled', () => {
        $installBanner.classList.add('hidden');
        deferredPrompt = null;
    });

    // ── SERVICE WORKER REGISTRATION ──
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((reg) => {
                    console.log('[App] Service Worker registered:', reg.scope);
                })
                .catch((err) => {
                    console.warn('[App] Service Worker registration failed:', err);
                });
        });
    }

    // ── INIT ──
    function init() {
        setLang(state.lang);
    }

    init();
})();
