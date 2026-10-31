/**
 * app.js
 * Main Controller orchestrating:
 * - Frontend-only Authentication (Learner & Instructor simulation)
 * - Navigation between Public Pages (Home, Services, About Us, Login)
 *   and Authenticated Modules (Dashboard, Courses, Adaptive Assessment, Instructor Analytics, React Spec)
 * - Creatio-Style Interactive Dashboard Widgets (Focus Timer, Milestones, Weekly Chart, Schedule)
 * - Course Catalog Filtering & Adaptive Quiz UI bindings
 */

// Application Auth & Global State
const AuthState = {
    currentUser: null, // Initialized from localStorage or null

    init() {
        const saved = localStorage.getItem("adaptlearn_user");
        if (saved && APP_DATA.users[saved]) {
            this.currentUser = APP_DATA.users[saved];
        }
        this.updateNavAuthUI();
    },

    login(roleType = "learner") {
        const user = APP_DATA.users[roleType] || APP_DATA.users.learner;
        this.currentUser = user;
        localStorage.setItem("adaptlearn_user", roleType);
        this.updateNavAuthUI();
        
        // Populate Creatio Dashboard with user data
        renderCreatioDashboard(user);

        // Transition to Dashboard view
        switchAppView("viewDashboard");
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem("adaptlearn_user");
        this.updateNavAuthUI();
        switchAppView("viewHome");
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    updateNavAuthUI() {
        const publicNavGroup = document.getElementById("publicNavGroup");
        const authNavGroup = document.getElementById("authNavGroup");
        const userPill = document.getElementById("navUserPill");
        const userAvatar = document.getElementById("navUserAvatar");
        const userName = document.getElementById("navUserName");

        if (this.isLoggedIn()) {
            if (publicNavGroup) publicNavGroup.classList.add("d-none");
            if (authNavGroup) authNavGroup.classList.remove("d-none");
            if (userPill) userPill.classList.remove("d-none");
            if (userAvatar) userAvatar.src = this.currentUser.avatar;
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (publicNavGroup) publicNavGroup.classList.remove("d-none");
            if (authNavGroup) authNavGroup.classList.add("d-none");
            if (userPill) userPill.classList.add("d-none");
        }
    }
};

// Global view switching function
window.switchAppView = function(targetId) {
    // If attempting to access authenticated view without login, redirect to login
    const protectedViews = ["viewDashboard", "viewAssessment", "viewCourses", "viewInstructorAnalytics", "viewArchitecture"];
    if (protectedViews.includes(targetId) && !AuthState.isLoggedIn()) {
        targetId = "viewLogin";
    }

    const views = document.querySelectorAll(".app-view");
    const navLinks = document.querySelectorAll("[data-nav-target]");

    views.forEach(v => {
        v.classList.remove("active");
        if (v.id === targetId) {
            v.classList.add("active");
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute("data-nav-target") === targetId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", () => {
    AuthState.init();
    initNavigation();
    initAuthForms();
    initCourseCatalog();
    initAdaptiveAssessmentUI();
    initCreatioWidgets();
    DashboardModule.init();

    // Default view routing
    if (AuthState.isLoggedIn()) {
        renderCreatioDashboard(AuthState.currentUser);
        switchAppView("viewDashboard");
    } else {
        switchAppView("viewHome");
    }
});

/**
 * Navigation Event Listeners
 */
function initNavigation() {
    document.querySelectorAll("[data-nav-target]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("data-nav-target");
            switchAppView(target);
        });
    });

    const logoutBtn = document.getElementById("navLogoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            AuthState.logout();
        });
    }
}

/**
 * Authentication Forms & Quick Login Buttons
 */
function initAuthForms() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // Client-side simulation: any input logs in as learner
            AuthState.login("learner");
        });
    }

    const btnQuickStudent = document.getElementById("btnQuickStudent");
    if (btnQuickStudent) {
        btnQuickStudent.addEventListener("click", () => {
            AuthState.login("learner");
        });
    }

    const btnQuickInstructor = document.getElementById("btnQuickInstructor");
    if (btnQuickInstructor) {
        btnQuickInstructor.addEventListener("click", () => {
            AuthState.login("instructor");
        });
    }
}

/**
 * Render the Creatio-Style Soft Dashboard with Active User's Data
 */
function renderCreatioDashboard(user) {
    if (!user) return;

    // Greeting
    const greetingEl = document.getElementById("creatioGreetingName");
    if (greetingEl) greetingEl.textContent = user.name;

    // KPI Metrics in Header
    const masteryEl = document.getElementById("creatioMasteryScore");
    const avgScoreEl = document.getElementById("creatioAvgScore");
    const questionsEl = document.getElementById("creatioQuestionsDone");

    if (masteryEl) masteryEl.textContent = `+${user.masteryScore}`;
    if (avgScoreEl) avgScoreEl.textContent = `+${user.avgScore}`;
    if (questionsEl) questionsEl.textContent = `+${user.assessmentsCompleted * 22}`;

    // Profile Card
    const profileImg = document.getElementById("creatioProfileImg");
    const profileName = document.getElementById("creatioProfileName");
    const profileRole = document.getElementById("creatioProfileRole");
    const profileId = document.getElementById("creatioProfileId");

    if (profileImg) profileImg.src = user.avatar;
    if (profileName) profileName.textContent = user.name;
    if (profileRole) profileRole.textContent = user.role;
    if (profileId) profileId.textContent = user.id;

    // Weekly Progress Chart
    renderWeeklyBarChart(user.weeklyProgress, user.studyHoursThisWeek);

    // Milestones Checklist
    renderMilestoneChecklist(user.milestoneTasks);

    // Schedule Events
    renderScheduleEvents(user.scheduleEvents);
}

/**
 * Weekly Bar Chart Widget
 */
function renderWeeklyBarChart(days = [], totalHours = 6.1) {
    const container = document.getElementById("creatioWeeklyBars");
    const hoursEl = document.getElementById("creatioWeeklyHours");
    if (hoursEl) hoursEl.textContent = `${totalHours} h`;

    if (!container) return;

    container.innerHTML = days.map((d, idx) => `
        <div class="weekly-bar-col" onclick="selectWeeklyDay(${idx})">
            <div class="weekly-bar-pill ${d.active ? 'active' : ''}" 
                 style="height: ${d.height}px;" 
                 title="${d.day}: ${d.hours} hrs study">
            </div>
            <span class="small text-muted mt-2 fw-semibold" style="font-size: 0.75rem;">${d.day}</span>
        </div>
    `).join("");
}

window.selectWeeklyDay = function(index) {
    const user = AuthState.currentUser;
    if (!user) return;

    user.weeklyProgress.forEach((d, i) => {
        d.active = (i === index);
    });
    renderWeeklyBarChart(user.weeklyProgress, user.studyHoursThisWeek);
};

/**
 * Navy Milestone Card Checklist Widget
 */
function renderMilestoneChecklist(tasks = []) {
    const container = document.getElementById("creatioMilestoneList");
    const countEl = document.getElementById("creatioMilestoneCount");
    const progressEl = document.getElementById("creatioMilestoneProgress");

    if (!container) return;

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const percent = Math.round((completedCount / totalCount) * 100);

    if (countEl) countEl.textContent = `${completedCount}/${totalCount}`;
    if (progressEl) progressEl.textContent = `${percent}%`;

    container.innerHTML = tasks.slice(0, 5).map(task => `
        <div class="navy-task-item ${task.completed ? 'done' : ''}" onclick="toggleMilestone('${task.id}')">
            <div class="d-flex align-items-center">
                <div class="navy-check-circle">
                    ${task.completed ? '<i class="bi bi-check-lg"></i>' : ''}
                </div>
                <div>
                    <div class="small fw-semibold ${task.completed ? 'text-white-50' : 'text-white'}">${task.title}</div>
                    <div class="text-white-50" style="font-size: 0.7rem;">${task.category}</div>
                </div>
            </div>
            <i class="bi bi-chevron-right text-white-50 small"></i>
        </div>
    `).join("");
}

window.toggleMilestone = function(taskId) {
    const user = AuthState.currentUser;
    if (!user) return;

    const task = user.milestoneTasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderMilestoneChecklist(user.milestoneTasks);
    }
};

/**
 * Schedule Events Widget
 */
function renderScheduleEvents(events = []) {
    const container = document.getElementById("creatioScheduleEvents");
    if (!container) return;

    container.innerHTML = events.map(evt => `
        <div class="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border mb-2">
            <div class="d-flex align-items-center gap-3">
                <span class="badge bg-white text-dark border px-2 py-1 small fw-bold">${evt.time}</span>
                <span class="small fw-semibold text-dark">${evt.title}</span>
            </div>
            <span class="badge bg-${evt.color}-subtle text-${evt.color} rounded-pill">${evt.tag}</span>
        </div>
    `).join("");
}

/**
 * Interactive Focus Timer (Circular Gauge Widget)
 */
let timerInterval = null;
let timerSeconds = 225; // 03:45 default
let isTimerRunning = false;

function initCreatioWidgets() {
    const toggleBtn = document.getElementById("timerToggleBtn");
    const resetBtn = document.getElementById("timerResetBtn");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            if (isTimerRunning) {
                pauseFocusTimer();
            } else {
                startFocusTimer();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            resetFocusTimer();
        });
    }

    updateTimerDisplay();

    // Calendar day selector interactivity
    const calendarDays = document.querySelectorAll(".calendar-day-pill");
    calendarDays.forEach(day => {
        day.addEventListener("click", () => {
            calendarDays.forEach(d => d.classList.remove("active"));
            day.classList.add("active");
        });
    });
}

function startFocusTimer() {
    isTimerRunning = true;
    const btn = document.getElementById("timerToggleBtn");
    if (btn) btn.innerHTML = '<i class="bi bi-pause-fill"></i>';

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            pauseFocusTimer();
            alert("Focus study block complete! Great session.");
        }
    }, 1000);
}

function pauseFocusTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    const btn = document.getElementById("timerToggleBtn");
    if (btn) btn.innerHTML = '<i class="bi bi-play-fill"></i>';
}

function resetFocusTimer() {
    pauseFocusTimer();
    timerSeconds = 225;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const displayEl = document.getElementById("timerDisplay");
    const circleEl = document.getElementById("timerProgressCircle");

    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (displayEl) displayEl.textContent = formatted;

    if (circleEl) {
        const total = 300; // 5 min base
        const circumference = 339.292;
        const offset = circumference - (timerSeconds / total) * circumference;
        circleEl.style.strokeDashoffset = Math.max(0, offset);
    }
}

/**
 * Course Browser Module (Catalog, Filtering & Detail Modal)
 */
function initCourseCatalog() {
    const catalogContainer = document.getElementById("courseCatalogContainer");
    const searchInput = document.getElementById("courseSearchInput");
    const categoryFilter = document.getElementById("courseCategoryFilter");
    const levelFilter = document.getElementById("courseLevelFilter");

    let currentSearch = "";
    let currentCategory = "all";
    let currentLevel = "all";

    function renderCourses() {
        if (!catalogContainer) return;

        let filtered = APP_DATA.courses.filter(course => {
            const matchesSearch = 
                course.title.toLowerCase().includes(currentSearch) || 
                course.shortDesc.toLowerCase().includes(currentSearch) ||
                course.instructor.toLowerCase().includes(currentSearch);
            
            const matchesCategory = currentCategory === "all" || course.category === currentCategory;
            const matchesLevel = currentLevel === "all" || course.level === currentLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });

        if (filtered.length === 0) {
            catalogContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted mb-3"><i class="bi bi-journal-x fs-1"></i></div>
                    <h5 class="fw-bold">No Courses Match Your Criteria</h5>
                    <p class="text-secondary small">Try adjusting your keyword search or category filter.</p>
                </div>
            `;
            return;
        }

        catalogContainer.innerHTML = filtered.map(course => `
            <div class="col-md-6 col-lg-6 col-xl-3 mb-4">
                <div class="card h-100 course-card shadow-sm border-0">
                    <div class="card-header bg-transparent border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                        <span class="badge text-bg-${course.badgeColor} px-2 py-1">${course.category}</span>
                        <span class="badge bg-light text-dark border">${course.level}</span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="course-icon-badge my-3 text-${course.badgeColor} bg-${course.badgeColor}-subtle rounded-3 d-inline-flex align-items-center justify-content-center p-3">
                            <i class="bi ${course.icon} fs-3"></i>
                        </div>
                        <h5 class="card-title fw-bold text-dark mb-2">${course.title}</h5>
                        <p class="card-text text-secondary small flex-grow-1">${course.shortDesc}</p>
                        
                        <div class="course-meta small text-muted mb-3 pt-2 border-top">
                            <div class="d-flex justify-content-between mb-1">
                                <span><i class="bi bi-clock me-1"></i> ${course.duration}</span>
                                <span><i class="bi bi-star-fill text-warning me-1"></i> ${course.rating}</span>
                            </div>
                            <div><i class="bi bi-person me-1"></i> ${course.instructor}</div>
                        </div>

                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary btn-sm fw-medium" onclick="openCourseDetails('${course.id}')">
                                <i class="bi bi-info-circle me-1"></i> View Details
                            </button>
                            <button class="btn btn-primary btn-sm fw-semibold" onclick="startCourseAssessment('${course.id}')">
                                <i class="bi bi-play-circle me-1"></i> Start Adaptive Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderCourses();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", (e) => {
            currentCategory = e.target.value;
            renderCourses();
        });
    }

    if (levelFilter) {
        levelFilter.addEventListener("change", (e) => {
            currentLevel = e.target.value;
            renderCourses();
        });
    }

    renderCourses();
}

/**
 * Course Details Modal
 */
window.openCourseDetails = function(courseId) {
    const course = APP_DATA.courses.find(c => c.id === courseId);
    if (!course) return;

    document.getElementById("modalCourseTitle").textContent = course.title;
    document.getElementById("modalCourseCategory").textContent = course.category;
    document.getElementById("modalCourseLevel").textContent = course.level;
    document.getElementById("modalCourseInstructor").textContent = course.instructor;
    document.getElementById("modalCourseDuration").textContent = course.duration;
    document.getElementById("modalCourseDesc").textContent = course.fullDesc;

    const modulesEl = document.getElementById("modalCourseModules");
    modulesEl.innerHTML = course.modules.map(m => `
        <li class="list-group-item d-flex align-items-center">
            <i class="bi bi-check2-circle text-primary me-2"></i> ${m}
        </li>
    `).join("");

    const outcomesEl = document.getElementById("modalCourseOutcomes");
    outcomesEl.innerHTML = course.learningOutcomes.map(o => `
        <li class="mb-2 d-flex align-items-start">
            <i class="bi bi-lightning-charge-fill text-warning me-2 mt-1"></i>
            <span>${o}</span>
        </li>
    `).join("");

    const startBtn = document.getElementById("modalStartAssessmentBtn");
    startBtn.onclick = () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById("courseDetailModal"));
        if (modal) modal.hide();
        startCourseAssessment(courseId);
    };

    const modal = new bootstrap.Modal(document.getElementById("courseDetailModal"));
    modal.show();
};

/**
 * Trigger Adaptive Quiz from Catalog or Modal
 */
window.startCourseAssessment = function(courseId) {
    if (!AuthState.isLoggedIn()) {
        AuthState.login("learner");
    }
    const success = window.quizEngine.startAssessment(courseId);
    if (success) {
        switchAppView("viewAssessment");
    }
};

/**
 * Adaptive Assessment UI Orchestrator
 */
function initAdaptiveAssessmentUI() {
    let selectedOptionIndex = null;

    window.quizEngine.subscribe((state) => {
        renderQuizView(state);
    });

    const assessmentCourseSelect = document.getElementById("assessmentCourseSelect");
    if (assessmentCourseSelect) {
        assessmentCourseSelect.innerHTML = APP_DATA.courses.map(c => `
            <option value="${c.id}">${c.title}</option>
        `).join("");

        assessmentCourseSelect.addEventListener("change", (e) => {
            window.quizEngine.startAssessment(e.target.value);
        });
    }

    window.selectQuizOption = function(index) {
        if (window.quizEngine.state.status !== 'in_progress') return;

        selectedOptionIndex = index;
        const optionBtns = document.querySelectorAll(".quiz-option-btn");
        optionBtns.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });

        const submitBtn = document.getElementById("quizSubmitBtn");
        if (submitBtn) submitBtn.disabled = false;
    };

    const submitBtn = document.getElementById("quizSubmitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            if (selectedOptionIndex !== null) {
                window.quizEngine.submitAnswer(selectedOptionIndex);
                selectedOptionIndex = null;
            }
        });
    }

    const nextBtn = document.getElementById("quizNextBtn");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            window.quizEngine.proceedNext();
        });
    }

    const restartBtn = document.getElementById("quizRestartBtn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            window.quizEngine.restart();
        });
    }

    if (window.quizEngine.state.status === 'idle') {
        window.quizEngine.startAssessment(APP_DATA.courses[0].id);
    }
}

/**
 * Render the Adaptive Assessment Screen based on Engine State
 */
function renderQuizView(state) {
    const activeCard = document.getElementById("quizActiveCard");
    const summaryCard = document.getElementById("quizSummaryCard");

    const courseTitleEl = document.getElementById("quizCourseTitle");
    if (courseTitleEl && state.course) {
        courseTitleEl.textContent = state.course.title;
    }

    const select = document.getElementById("assessmentCourseSelect");
    if (select && state.course) {
        select.value = state.course.id;
    }

    const diffBadge = document.getElementById("quizDifficultyBadge");
    const diffIcon = document.getElementById("quizDifficultyIcon");
    const diffText = document.getElementById("quizDifficultyText");

    if (diffBadge) {
        const diff = state.currentDifficulty.toUpperCase();
        diffText.textContent = diff;

        if (diff === "EASY") {
            diffBadge.className = "badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6";
            diffIcon.className = "bi bi-speedometer2 me-1";
        } else if (diff === "MEDIUM") {
            diffBadge.className = "badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6";
            diffIcon.className = "bi bi-reception-3 me-1";
        } else {
            diffBadge.className = "badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 fs-6";
            diffIcon.className = "bi bi-lightning-charge-fill me-1";
        }
    }

    const qCountEl = document.getElementById("quizQuestionCounter");
    if (qCountEl) {
        qCountEl.textContent = `Question ${state.currentQuestionNumber} of ${state.maxQuestions}`;
    }

    const progressBar = document.getElementById("quizProgressBar");
    if (progressBar) {
        progressBar.style.width = `${state.progressPercent}%`;
    }

    const liveScoreEl = document.getElementById("quizLiveScore");
    if (liveScoreEl) {
        liveScoreEl.textContent = `${state.score} pts`;
    }

    const streakEl = document.getElementById("quizStreakBadge");
    if (streakEl) {
        streakEl.textContent = `${state.consecutiveCorrect}🔥`;
    }

    if (state.status === 'completed') {
        if (activeCard) activeCard.classList.add("d-none");
        if (summaryCard) summaryCard.classList.remove("d-none");
        renderAssessmentSummary();
        return;
    }

    if (activeCard) activeCard.classList.remove("d-none");
    if (summaryCard) summaryCard.classList.add("d-none");

    const questionTextEl = document.getElementById("quizQuestionText");
    const optionsContainer = document.getElementById("quizOptionsContainer");
    const feedbackBanner = document.getElementById("quizFeedbackBanner");
    const submitBtn = document.getElementById("quizSubmitBtn");
    const nextBtn = document.getElementById("quizNextBtn");

    if (!state.currentQuestion) return;

    if (questionTextEl) {
        questionTextEl.textContent = state.currentQuestion.question;
    }

    if (optionsContainer) {
        const isFeedback = state.status === 'feedback';
        const lastRecord = isFeedback ? state.history[state.history.length - 1] : null;

        optionsContainer.innerHTML = state.currentQuestion.options.map((opt, idx) => {
            let extraClass = "";
            let badgeIcon = `<span class="option-label-circle me-3">${String.fromCharCode(65 + idx)}</span>`;

            if (isFeedback && lastRecord) {
                if (idx === lastRecord.correctIndex) {
                    extraClass = "correct border-success bg-success-subtle text-success-emphasis fw-bold";
                    badgeIcon = `<i class="bi bi-check-circle-fill text-success fs-5 me-3"></i>`;
                } else if (idx === lastRecord.selectedIndex) {
                    extraClass = "incorrect border-danger bg-danger-subtle text-danger-emphasis";
                    badgeIcon = `<i class="bi bi-x-circle-fill text-danger fs-5 me-3"></i>`;
                } else {
                    extraClass = "disabled opacity-50";
                }
            }

            return `
                <button type="button" 
                        class="quiz-option-btn list-group-item list-group-item-action d-flex align-items-center p-3 mb-2 rounded border ${extraClass}" 
                        onclick="selectQuizOption(${idx})"
                        ${isFeedback ? "disabled" : ""}>
                    ${badgeIcon}
                    <div class="text-start flex-grow-1">${opt}</div>
                </button>
            `;
        }).join("");
    }

    if (feedbackBanner) {
        if (state.status === 'feedback') {
            const lastRecord = state.history[state.history.length - 1];
            const isCorrect = lastRecord.isCorrect;
            
            let adaptiveMessage = "";
            if (isCorrect) {
                adaptiveMessage = state.currentDifficulty === 'hard' && lastRecord.difficulty === 'hard'
                    ? "Great job! Maintained peak difficulty (Hard)."
                    : `Correct! Adaptive Engine adjusted difficulty to <strong>${state.currentDifficulty.toUpperCase()}</strong>.`;
            } else {
                adaptiveMessage = `Incorrect. Adaptive Engine stepped difficulty down to <strong>${state.currentDifficulty.toUpperCase()}</strong> for foundational reinforcement.`;
            }

            feedbackBanner.className = `alert alert-${isCorrect ? 'success' : 'warning'} mt-3 mb-0 d-block`;
            feedbackBanner.innerHTML = `
                <div class="d-flex align-items-start">
                    <i class="bi ${isCorrect ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-warning'} fs-4 me-2"></i>
                    <div>
                        <h6 class="alert-heading fw-bold mb-1">${isCorrect ? 'Well Done! (+ ' + lastRecord.pointsEarned + ' pts)' : 'Review Concept'}</h6>
                        <p class="mb-2 small">${lastRecord.explanation}</p>
                        <div class="small fw-semibold border-top pt-2 mt-1 text-dark">
                            <i class="bi bi-sliders me-1"></i> Rule Trigger: ${adaptiveMessage}
                        </div>
                    </div>
                </div>
            `;
            if (submitBtn) submitBtn.classList.add("d-none");
            if (nextBtn) {
                nextBtn.classList.remove("d-none");
                nextBtn.focus();
            }
        } else {
            feedbackBanner.className = "d-none";
            if (submitBtn) {
                submitBtn.classList.remove("d-none");
                submitBtn.disabled = true;
            }
            if (nextBtn) nextBtn.classList.add("d-none");
        }
    }
}

/**
 * Render Final Assessment Results & Adaptive Path Visualization
 */
function renderAssessmentSummary() {
    const summary = window.quizEngine.getSummary();
    if (!summary) return;

    document.getElementById("summaryScore").textContent = `${summary.score} / ${summary.maxPossibleScore}`;
    document.getElementById("summaryAccuracy").textContent = `${summary.accuracy}%`;
    document.getElementById("summaryTier").textContent = summary.masteryTier;
    document.getElementById("summaryTier").className = `badge bg-${summary.tierColor} px-3 py-2 fs-6`;
    document.getElementById("summaryRecommendation").textContent = summary.recommendation;

    const easyCount = summary.breakdown.easy.correct;
    const easyTotal = summary.breakdown.easy.total;
    const medCount = summary.breakdown.medium.correct;
    const medTotal = summary.breakdown.medium.total;
    const hardCount = summary.breakdown.hard.correct;
    const hardTotal = summary.breakdown.hard.total;

    document.getElementById("summaryEasyStat").textContent = `${easyCount} / ${easyTotal}`;
    document.getElementById("summaryMedStat").textContent = `${medCount} / ${medTotal}`;
    document.getElementById("summaryHardStat").textContent = `${hardCount} / ${hardTotal}`;

    const pathContainer = document.getElementById("summaryAdaptivePath");
    if (pathContainer) {
        pathContainer.innerHTML = summary.history.map((h, i) => {
            const badgeClass = 
                h.difficulty === 'hard' ? 'bg-danger' : 
                h.difficulty === 'medium' ? 'bg-primary' : 'bg-success';
            
            const icon = h.isCorrect ? '<i class="bi bi-check-lg ms-1"></i>' : '<i class="bi bi-x-lg ms-1"></i>';

            return `
                <div class="d-flex align-items-center">
                    <span class="badge ${badgeClass} p-2 d-flex align-items-center shadow-sm">
                        Q${i + 1}: ${h.difficulty.toUpperCase()} ${icon}
                    </span>
                    ${i < summary.history.length - 1 ? '<i class="bi bi-arrow-right mx-2 text-muted"></i>' : ''}
                </div>
            `;
        }).join("");
    }
}
