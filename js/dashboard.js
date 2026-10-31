/**
 * dashboard.js
 * Visual Instructor Analytics Dashboard Module
 * 
 * Features:
 * - Dynamic Cohort switching with animated metric updates
 * - Custom SVG & CSS-based responsive data visualizations:
 *     * Difficulty distribution breakdown
 *     * Score bracket frequency histogram
 * - Learner Roster table with live search & status filter
 * - Learner inspection modal simulating individual student adaptive trace
 */

const DashboardModule = (() => {
    let currentCohortId = APP_DATA.cohorts[0].id;
    let currentSearchTerm = "";
    let currentStatusFilter = "all";

    function init() {
        populateCohortSelector();
        renderDashboard();
        attachEventListeners();
    }

    function populateCohortSelector() {
        const selector = document.getElementById("cohortSelect");
        if (!selector) return;

        selector.innerHTML = APP_DATA.cohorts.map(c => `
            <option value="${c.id}" ${c.id === currentCohortId ? "selected" : ""}>
                ${c.name}
            </option>
        `).join("");

        selector.addEventListener("change", (e) => {
            currentCohortId = e.target.value;
            renderDashboard();
        });
    }

    function attachEventListeners() {
        const searchInput = document.getElementById("learnerSearch");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                currentSearchTerm = e.target.value.toLowerCase();
                renderLearnerTable();
            });
        }

        const statusFilter = document.getElementById("statusFilter");
        if (statusFilter) {
            statusFilter.addEventListener("change", (e) => {
                currentStatusFilter = e.target.value;
                renderLearnerTable();
            });
        }
    }

    function getActiveCohort() {
        return APP_DATA.cohorts.find(c => c.id === currentCohortId) || APP_DATA.cohorts[0];
    }

    function renderDashboard() {
        const cohort = getActiveCohort();
        if (!cohort) return;

        // Update Stat Cards
        renderStatCards(cohort);

        // Render Charts
        renderDifficultyBreakdown(cohort);
        renderScoreHistogram(cohort);

        // Render Learner Table
        renderLearnerTable();
    }

    function renderStatCards(cohort) {
        const totalLearnersEl = document.getElementById("statTotalLearners");
        const avgScoreEl = document.getElementById("statAvgScore");
        const completionRateEl = document.getElementById("statCompletionRate");
        const highestBracketEl = document.getElementById("statHighestBracket");

        if (totalLearnersEl) totalLearnersEl.textContent = cohort.totalEnrolled;
        if (avgScoreEl) avgScoreEl.textContent = `${cohort.averageScore}%`;
        if (completionRateEl) completionRateEl.textContent = `${cohort.completionRate}%`;
        if (highestBracketEl) {
            const hardPct = cohort.difficultyDistribution.hard;
            highestBracketEl.textContent = `${hardPct}% in Hard`;
        }
    }

    function renderDifficultyBreakdown(cohort) {
        const container = document.getElementById("difficultyChartContainer");
        if (!container) return;

        const diff = cohort.difficultyDistribution;
        
        container.innerHTML = `
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1 small">
                    <span class="text-success fw-bold"><i class="bi bi-circle-fill me-1"></i> Easy (${diff.easy}%)</span>
                    <span class="text-primary fw-bold"><i class="bi bi-circle-fill me-1"></i> Medium (${diff.medium}%)</span>
                    <span class="text-danger fw-bold"><i class="bi bi-circle-fill me-1"></i> Hard (${diff.hard}%)</span>
                </div>
                <!-- Segmented Multi-Bar -->
                <div class="progress" style="height: 22px; border-radius: 8px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${diff.easy}%" title="Easy: ${diff.easy}%">${diff.easy}%</div>
                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${diff.medium}%" title="Medium: ${diff.medium}%">${diff.medium}%</div>
                    <div class="progress-bar bg-danger" role="progressbar" style="width: ${diff.hard}%" title="Hard: ${diff.hard}%">${diff.hard}%</div>
                </div>
            </div>

            <div class="row g-2 mt-2 pt-2 border-top text-center">
                <div class="col-4">
                    <div class="p-2 rounded bg-success-subtle text-success-emphasis">
                        <div class="small fw-semibold">Easy Questions</div>
                        <div class="h5 mb-0 fw-bold">${diff.easy}%</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="p-2 rounded bg-primary-subtle text-primary-emphasis">
                        <div class="small fw-semibold">Medium Questions</div>
                        <div class="h5 mb-0 fw-bold">${diff.medium}%</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="p-2 rounded bg-danger-subtle text-danger-emphasis">
                        <div class="small fw-semibold">Hard Questions</div>
                        <div class="h5 mb-0 fw-bold">${diff.hard}%</div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderScoreHistogram(cohort) {
        const container = document.getElementById("scoreHistogramContainer");
        if (!container) return;

        const brackets = cohort.scoreDistribution;
        const maxCount = Math.max(...brackets.map(b => b.count), 1);

        const barsHtml = brackets.map(b => {
            const heightPercent = Math.round((b.count / maxCount) * 100);
            return `
                <div class="d-flex flex-column align-items-center flex-grow-1" style="height: 140px;">
                    <div class="small fw-bold text-muted mb-1">${b.count}</div>
                    <div class="w-100 d-flex align-items-end justify-content-center flex-grow-1">
                        <div class="histogram-bar bg-primary bg-gradient rounded-top" 
                             style="height: ${heightPercent}%; width: 65%; min-height: 8px;"
                             data-bs-toggle="tooltip" 
                             title="${b.count} learners scored between ${b.bracket}">
                        </div>
                    </div>
                    <div class="small text-muted mt-2 fw-medium text-nowrap">${b.bracket}</div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div class="d-flex align-items-end justify-content-between h-100 gap-2 px-2 pt-2">
                ${barsHtml}
            </div>
        `;
    }

    function renderLearnerTable() {
        const tbody = document.getElementById("learnerTableBody");
        if (!tbody) return;

        const cohort = getActiveCohort();
        let list = cohort.learners || [];

        // Apply filters
        if (currentSearchTerm) {
            list = list.filter(l => 
                l.name.toLowerCase().includes(currentSearchTerm) || 
                l.id.toLowerCase().includes(currentSearchTerm)
            );
        }

        if (currentStatusFilter !== "all") {
            list = list.filter(l => l.status.toLowerCase() === currentStatusFilter.toLowerCase());
        }

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        <i class="bi bi-search fs-3 d-block mb-2"></i>
                        No learners matched your filter criteria.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(l => {
            const badgeClass = 
                l.status === "Mastered" ? "bg-success" : 
                l.status === "Proficient" ? "bg-primary" : "bg-warning text-dark";

            const diffBadgeClass = 
                l.lastDifficulty === "Hard" ? "badge text-bg-danger" : 
                l.lastDifficulty === "Medium" ? "badge text-bg-primary" : "badge text-bg-success";

            return `
                <tr>
                    <td class="fw-semibold text-secondary">${l.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2 bg-light text-primary fw-bold">
                                ${l.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <span class="fw-bold text-dark">${l.name}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="${diffBadgeClass}">${l.lastDifficulty}</span></td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-bold">${l.score}%</span>
                            <div class="progress flex-grow-1" style="height: 6px; min-width: 60px;">
                                <div class="progress-bar ${l.score >= 80 ? 'bg-success' : l.score >= 60 ? 'bg-primary' : 'bg-warning'}" 
                                     style="width: ${l.score}%"></div>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge ${badgeClass} rounded-pill px-3 py-1">${l.status}</span></td>
                    <td class="text-muted small">${l.date}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary" onclick="DashboardModule.inspectLearner('${l.id}')">
                            <i class="bi bi-eye"></i> Details
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function inspectLearner(learnerId) {
        const cohort = getActiveCohort();
        const learner = cohort.learners.find(l => l.id === learnerId);
        if (!learner) return;

        const modalEl = document.getElementById("learnerModal");
        if (!modalEl) return;

        document.getElementById("modalLearnerName").textContent = learner.name;
        document.getElementById("modalLearnerId").textContent = learner.id;
        document.getElementById("modalLearnerCourse").textContent = learner.course;
        document.getElementById("modalLearnerScore").textContent = `${learner.score}%`;
        document.getElementById("modalLearnerStatus").textContent = learner.status;
        document.getElementById("modalLearnerDiff").textContent = learner.lastDifficulty;
        document.getElementById("modalLearnerDate").textContent = learner.date;

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    return {
        init,
        renderDashboard,
        inspectLearner
    };
})();

