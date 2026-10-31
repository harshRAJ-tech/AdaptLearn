/**
 * engine.js
 * Rule-Based Client-Side Adaptive Assessment Engine
 * 
 * Logic:
 * - Starts at base difficulty level ('medium' by default).
 * - Tracks learner performance, answer correctness, and streaks.
 * - Local Scoring & Difficulty Transition Rules:
 *     * Correct Answer:
 *         - Easy -> Medium
 *         - Medium -> Hard
 *         - Hard -> Hard (retains peak difficulty level)
 *     * Incorrect Answer:
 *         - Hard -> Medium
 *         - Medium -> Easy
 *         - Easy -> Easy (retains foundational difficulty level)
 * - Keeps an immutable audit trail of the adaptive path traversed.
 * - Ready for pure React refactoring (state machine with isolated state).
 */

class AdaptiveQuizEngine {
    constructor(options = {}) {
        this.maxQuestions = options.maxQuestions || 5;
        this.baseDifficulty = options.baseDifficulty || 'medium';
        this.currentCourseId = null;
        this.currentCourse = null;
        
        // Internal Engine State
        this.state = {
            status: 'idle', // 'idle' | 'in_progress' | 'feedback' | 'completed'
            currentQuestionNumber: 0,
            currentDifficulty: this.baseDifficulty,
            currentQuestion: null,
            score: 0,
            maxPossibleScore: 0,
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            history: [], // [{ question, selectedIndex, isCorrect, difficulty, pointsEarned }]
            servedQuestionIds: new Set(),
            difficultyPath: [] // ['medium', 'hard', ...]
        };

        this.listeners = [];
    }

    // Subscribe to state change notifications (Observer pattern for UI decoupling)
    subscribe(listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);
        }
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(fn => fn(this.getState()));
    }

    getState() {
        return {
            ...this.state,
            maxQuestions: this.maxQuestions,
            course: this.currentCourse,
            progressPercent: Math.min(100, Math.round((this.state.currentQuestionNumber / this.maxQuestions) * 100)),
            accuracyPercent: this.state.history.length > 0 
                ? Math.round((this.state.history.filter(h => h.isCorrect).length / this.state.history.length) * 100) 
                : 0
        };
    }

    /**
     * Start a new adaptive test for a specific course
     */
    startAssessment(courseId) {
        const course = APP_DATA.courses.find(c => c.id === courseId);
        if (!course) {
            console.error("Course not found:", courseId);
            return false;
        }

        const bank = APP_DATA.questionBank[courseId];
        if (!bank) {
            console.error("No question bank found for course:", courseId);
            return false;
        }

        this.currentCourseId = courseId;
        this.currentCourse = course;

        this.state = {
            status: 'in_progress',
            currentQuestionNumber: 0,
            currentDifficulty: this.baseDifficulty,
            currentQuestion: null,
            score: 0,
            maxPossibleScore: 0,
            consecutiveCorrect: 0,
            consecutiveIncorrect: 0,
            history: [],
            servedQuestionIds: new Set(),
            difficultyPath: []
        };

        this.fetchNextAdaptiveQuestion();
        return true;
    }

    /**
     * Rule-based question selection based on current difficulty
     */
    fetchNextAdaptiveQuestion() {
        if (this.state.currentQuestionNumber >= this.maxQuestions) {
            this.state.status = 'completed';
            this.notify();
            return;
        }

        const bank = APP_DATA.questionBank[this.currentCourseId];
        const currentDiff = this.state.currentDifficulty;

        // Try getting an unserved question at current difficulty
        let pool = (bank[currentDiff] || []).filter(q => !this.state.servedQuestionIds.has(q.id));

        // Fallback: If pool is exhausted at this difficulty, fall back to adjacent difficulties
        if (pool.length === 0) {
            const difficulties = ['easy', 'medium', 'hard'];
            for (let diff of difficulties) {
                const altPool = (bank[diff] || []).filter(q => !this.state.servedQuestionIds.has(q.id));
                if (altPool.length > 0) {
                    pool = altPool;
                    this.state.currentDifficulty = diff;
                    break;
                }
            }
        }

        if (pool.length === 0) {
            // All questions in bank have been exhausted
            this.state.status = 'completed';
            this.notify();
            return;
        }

        // Pick question randomly from candidate pool
        const randomIndex = Math.floor(Math.random() * pool.length);
        const selectedQuestion = pool[randomIndex];

        this.state.servedQuestionIds.add(selectedQuestion.id);
        this.state.currentQuestion = selectedQuestion;
        this.state.currentQuestionNumber += 1;
        this.state.difficultyPath.push(this.state.currentDifficulty);
        this.state.status = 'in_progress';

        this.notify();
    }

    /**
     * Submit an answer for the current question and execute adaptive difficulty adjustment
     */
    submitAnswer(selectedIndex) {
        if (this.state.status !== 'in_progress' || !this.state.currentQuestion) {
            return;
        }

        const q = this.state.currentQuestion;
        const isCorrect = (selectedIndex === q.correctIndex);
        const points = isCorrect ? q.points : 0;

        this.state.score += points;
        this.state.maxPossibleScore += q.points;

        const record = {
            questionId: q.id,
            questionText: q.question,
            options: q.options,
            selectedIndex: selectedIndex,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            difficulty: this.state.currentDifficulty,
            pointsEarned: points,
            isCorrect: isCorrect,
            streakAtTime: isCorrect ? this.state.consecutiveCorrect + 1 : 0
        };

        this.state.history.push(record);

        // Compute next difficulty using client-side adaptive rules
        const prevDifficulty = this.state.currentDifficulty;
        let nextDifficulty = prevDifficulty;

        if (isCorrect) {
            this.state.consecutiveCorrect += 1;
            this.state.consecutiveIncorrect = 0;

            if (prevDifficulty === 'easy') {
                nextDifficulty = 'medium';
            } else if (prevDifficulty === 'medium') {
                nextDifficulty = 'hard';
            } else {
                nextDifficulty = 'hard'; // peak reached
            }
        } else {
            this.state.consecutiveIncorrect += 1;
            this.state.consecutiveCorrect = 0;

            if (prevDifficulty === 'hard') {
                nextDifficulty = 'medium';
            } else if (prevDifficulty === 'medium') {
                nextDifficulty = 'easy';
            } else {
                nextDifficulty = 'easy'; // base reached
            }
        }

        // Apply updated difficulty for subsequent step
        this.state.currentDifficulty = nextDifficulty;
        this.state.status = 'feedback';

        this.notify();

        return {
            isCorrect,
            pointsEarned: points,
            explanation: q.explanation,
            prevDifficulty,
            nextDifficulty
        };
    }

    /**
     * Proceed from feedback view to next question
     */
    proceedNext() {
        if (this.state.status === 'feedback') {
            this.fetchNextAdaptiveQuestion();
        }
    }

    /**
     * Restart current assessment
     */
    restart() {
        if (this.currentCourseId) {
            this.startAssessment(this.currentCourseId);
        }
    }

    /**
     * Returns an assessment diagnostic evaluation
     */
    getSummary() {
        const history = this.state.history;
        const total = history.length;
        if (total === 0) return null;

        const correctCount = history.filter(h => h.isCorrect).length;
        const accuracy = Math.round((correctCount / total) * 100);

        // Breakdown by difficulty
        const breakdown = {
            easy: { total: 0, correct: 0 },
            medium: { total: 0, correct: 0 },
            hard: { total: 0, correct: 0 }
        };

        history.forEach(item => {
            if (breakdown[item.difficulty]) {
                breakdown[item.difficulty].total += 1;
                if (item.isCorrect) {
                    breakdown[item.difficulty].correct += 1;
                }
            }
        });

        // Adaptive Tier Assessment
        let masteryTier = "Foundational";
        let tierColor = "secondary";
        let recommendation = "Review core principles before attempting complex problem sets.";

        const hardCorrect = breakdown.hard.correct;
        const mediumCorrect = breakdown.medium.correct;

        if (hardCorrect >= 2 || (hardCorrect >= 1 && mediumCorrect >= 2)) {
            masteryTier = "Mastery / Advanced";
            tierColor = "success";
            recommendation = "Exceptional performance! You demonstrated firm command across difficult questions.";
        } else if (mediumCorrect >= 2 || accuracy >= 60) {
            masteryTier = "Proficient / Competent";
            tierColor = "primary";
            recommendation = "Solid conceptual understanding. Practice advanced scenarios to reach mastery.";
        } else {
            masteryTier = "Developing / Foundational";
            tierColor = "warning";
            recommendation = "Focus on reinforcing fundamental building blocks and syntax rules.";
        }

        return {
            totalQuestions: total,
            correctCount,
            accuracy,
            score: this.state.score,
            maxPossibleScore: this.state.maxPossibleScore,
            masteryTier,
            tierColor,
            recommendation,
            breakdown,
            path: this.state.difficultyPath,
            history: this.state.history
        };
    }
}

// Global instance ready for application usage
window.quizEngine = new AdaptiveQuizEngine({ maxQuestions: 5, baseDifficulty: 'medium' });

