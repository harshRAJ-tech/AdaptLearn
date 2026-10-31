# AdaptLearn - Rule-Based Client-Side Adaptive Learning Platform

A responsive frontend platform demonstrating a **client-side rule-based adaptive assessment engine** and an **instructor analytics dashboard**, built strictly with **HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript (ES6)**.

---

## 1. Problem Statement
Traditional static course websites present the same fixed curriculum and rigid assessment difficulty to every learner regardless of individual capability. Instructors lack lightweight, real-time visual tracking of learner difficulty trajectories across cohorts.

**AdaptLearn** solves this by delivering:
- A responsive **Course Catalog** with real-time filtering and detailed syllabus views.
- A client-side, rule-based **Adaptive Question Engine** that dynamically adjusts question difficulty (Easy $\leftrightarrow$ Medium $\leftrightarrow$ Hard) based on real-time learner answers—using simple local scoring rules without depending on external infrastructure.
- An **Instructor Analytics Dashboard** visualizing cohort score distributions, completion rates, difficulty attainment metrics, and learner rosters.
- Clean component-oriented architecture prepared for progressive migration to **React**.

---

## 2. System Architecture & Modules

### 2.1 Course Browser Module (`#viewCourses`)
- Displays available courses with title, category, difficulty rating, and duration.
- Live search bar and filtering by category (Web Development, Computer Science, DevOps, Database) and level.
- Detailed syllabus modal with learning outcomes and direct launch into assessment.

### 2.2 Adaptive Question Engine (`#viewAssessment`)
- Starts learners at base difficulty (Medium).
- **Correct Answer**: Promotes difficulty (`Easy -> Medium -> Hard`) and increases streak counter.
- **Incorrect Answer**: Steps down difficulty (`Hard -> Medium -> Easy`) to reinforce foundational concepts.
- Dynamic difficulty badge, question counter, live score, and streak counter.
- Instant feedback explanations and post-assessment diagnostic summary with traversed difficulty path.

### 2.3 Instructor Dashboard (`#viewInstructorAnalytics`)
- Cohort switcher (e.g., *Spring 2026 Alpha*, *Fall 2025 Beta*, *Enterprise Cloud*).
- KPI metric cards: Total Enrolled, Average Score, Completion Rate, and Peak Hard Attainment.
- Visual Charts:
  - **Difficulty Distribution**: Multi-segmented progress bar showing % of Easy, Medium, and Hard questions served.
  - **Score Bracket Histogram**: Bar chart showing student counts across performance brackets.
- Searchable learner roster table with diagnostic modal.

### 2.4 React Migration Specification (`#viewArchitecture`)
Explains how vanilla ES6 objects and controllers map 1:1 to React components without altering underlying scoring rules:
- `APP_DATA` $\rightarrow$ Centralized state/context or API mock.
- `AdaptiveQuizEngine` $\rightarrow$ Custom React Hook (`useAdaptiveQuiz`).
- `renderCourses()` $\rightarrow$ `<CourseCatalog />` and `<CourseCard />`.
- `DashboardModule` $\rightarrow$ `<InstructorDashboard />` and `<DifficultyChart />`.

---

## 3. Technology Stack (Phase 1)
- **HTML5**: Clean semantic layout.
- **CSS3**: Custom variables, responsive design, soft elevation shadows, and micro-interactions.
- **Bootstrap 5.3.3**: Responsive 12-column grid system, cards, progress bars, buttons, and modals.
- **Bootstrap Icons 1.11.3**: Modern UI iconography.
- **JavaScript (ES6)**: Pure client-side JavaScript using classes, the Observer pattern, array methods, and event delegation. No heavy frameworks or backend dependencies.

---

## 4. How to Run
1. Double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, run using any lightweight HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.
