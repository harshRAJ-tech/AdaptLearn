/**
 * data.js
 * Centralized mock data store for:
 * 1. User Profiles & Frontend Auth Simulation
 * 2. Course Catalog
 * 3. Adaptive Question Bank (categorized by course and difficulty levels)
 * 4. Simulated Cohort Analytics for Instructor Dashboard
 * 5. Dashboard Widget Data (Weekly study hours, schedule, milestone tasks)
 */

const APP_DATA = {
    // Simulated user accounts for frontend authentication
    users: {
        learner: {
            id: "L-102",
            name: "Alex Chen",
            email: "alex.chen@adaptlearn.edu",
            role: "Learner / Full-Stack Track",
            roleType: "student",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            cohort: "Spring 2026 - Alpha",
            masteryScore: 92,
            avgScore: 78.4,
            assessmentsCompleted: 14,
            studyHoursThisWeek: 6.1,
            weeklyProgress: [
                { day: "M", hours: 1.2, height: 40 },
                { day: "T", hours: 0.8, height: 30 },
                { day: "W", hours: 2.1, height: 75, active: true },
                { day: "T", hours: 1.5, height: 55 },
                { day: "F", hours: 2.4, height: 85 },
                { day: "S", hours: 1.8, height: 60 },
                { day: "S", hours: 0.5, height: 20 }
            ],
            milestoneTasks: [
                { id: "m1", title: "Review Web Box Model", category: "Core Concept", completed: true },
                { id: "m2", title: "Complete Adaptive Test #1", category: "Assessment", completed: true },
                { id: "m3", title: "Explore Event Delegation", category: "DOM Architecture", completed: true },
                { id: "m4", title: "Submit Algorithm Problem Set", category: "Practice", completed: false },
                { id: "m5", title: "Cloud Microservices Lab", category: "Infrastructure", completed: false },
                { id: "m6", title: "Instructor Diagnostic Review", category: "Milestone", completed: false },
                { id: "m7", title: "Mid-Term Adaptive Evaluation", category: "Exam", completed: false },
                { id: "m8", title: "Final Capstone Prototype", category: "Capstone", completed: false }
            ],
            scheduleEvents: [
                { time: "09:00 AM", title: "Modern Web Components Sync", tag: "Lecture", color: "primary" },
                { time: "11:30 AM", title: "Adaptive Assessment: State Logic", tag: "Quiz Slot", color: "warning" },
                { time: "03:00 PM", title: "Instructor Office Hours with Dr. Sarah", tag: "Mentorship", color: "success" }
            ]
        },
        instructor: {
            id: "INST-01",
            name: "Dr. Sarah Jenkins",
            email: "sarah.jenkins@adaptlearn.edu",
            role: "Lead Academic Instructor",
            roleType: "instructor",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            cohort: "All Active Cohorts",
            masteryScore: 98,
            avgScore: 82.5,
            assessmentsCompleted: 315,
            studyHoursThisWeek: 18.4,
            weeklyProgress: [
                { day: "M", hours: 3.5, height: 70 },
                { day: "T", hours: 4.0, height: 85 },
                { day: "W", hours: 3.8, height: 80, active: true },
                { day: "T", hours: 2.9, height: 60 },
                { day: "F", hours: 4.5, height: 95 },
                { day: "S", hours: 1.0, height: 25 },
                { day: "S", hours: 0.8, height: 18 }
            ],
            milestoneTasks: [
                { id: "im1", title: "Review Spring 2026 Cohort Submissions", category: "Grading", completed: true },
                { id: "im2", title: "Update Medium Tier Question Bank", category: "Curriculum", completed: true },
                { id: "im3", title: "Host Weekly Live Problem Solving", category: "Live Class", completed: true },
                { id: "im4", title: "Evaluate At-Risk Learner Flags", category: "Analytics", completed: false },
                { id: "im5", title: "Calibrate Hard Question Discriminations", category: "Engine", completed: false }
            ],
            scheduleEvents: [
                { time: "10:00 AM", title: "Cohort A Progress Review", tag: "Analytics", color: "primary" },
                { time: "01:30 PM", title: "Curriculum Committee Meeting", tag: "Academic", color: "info" },
                { time: "04:00 PM", title: "Adaptive Scoring Calibration", tag: "Evaluation", color: "success" }
            ]
        }
    },

    courses: [
        {
            id: "course-web-dev",
            title: "Full-Stack Web Engineering",
            category: "Web Development",
            level: "Intermediate",
            duration: "10 Weeks (40 hrs)",
            rating: 4.8,
            reviewsCount: 1240,
            instructor: "Dr. Sarah Jenkins",
            shortDesc: "Master client-side architecture, modern layouts, RESTful paradigms, and web performance optimization.",
            fullDesc: "This comprehensive course guides learners through modern web fundamentals, starting from semantic HTML5 and responsive CSS design patterns, through ES6+ JavaScript, DOM architecture, and state-driven web applications. You'll gain hands-on expertise building production-ready web apps.",
            badgeColor: "primary",
            icon: "bi-code-slash",
            modules: [
                "Module 1: Semantic HTML5 & Modern Layouts (Flexbox & CSS Grid)",
                "Module 2: Bootstrap 5 Component Architecture & Responsive Design",
                "Module 3: JavaScript ES6 Core Concepts & Asynchronous Programming",
                "Module 4: DOM Traversal, Event Delegation & State Driven UI",
                "Module 5: Adaptive Testing Paradigms & Web Architecture"
            ],
            learningOutcomes: [
                "Construct modular responsive interfaces using Bootstrap and custom CSS variables",
                "Architect event-driven client applications with zero external framework dependencies",
                "Understand state-transition logic for adaptive user interfaces",
                "Prepare codebases for progressive refactoring into modern component frameworks"
            ]
        },
        {
            id: "course-python-data",
            title: "Data Structures & Algorithmic Thinking",
            category: "Computer Science",
            level: "Beginner",
            duration: "8 Weeks (32 hrs)",
            rating: 4.9,
            reviewsCount: 980,
            instructor: "Prof. Michael Chang",
            shortDesc: "Understand fundamental data structures, computational complexity, and problem-solving patterns.",
            fullDesc: "Learn essential computer science foundations including arrays, linked lists, stacks, queues, trees, search algorithms, and sorting strategies. Explore Big-O analysis through practical code examples and interactive assessments.",
            badgeColor: "success",
            icon: "bi-diagram-3",
            modules: [
                "Module 1: Asymptotic Analysis & Big-O Notation",
                "Module 2: Linear Structures (Arrays, Lists, Stacks, Queues)",
                "Module 3: Recursion, Divide & Conquer Strategies",
                "Module 4: Trees, Binary Search Trees & Heaps",
                "Module 5: Hash Tables & Graph Traversal (BFS/DFS)"
            ],
            learningOutcomes: [
                "Analyze time and space complexity of code algorithms",
                "Implement fundamental data structures from first principles",
                "Solve common algorithmic interview problems with optimal efficiency",
                "Apply rule-based heuristics to evaluate algorithm performance"
            ]
        },
        {
            id: "course-cloud-devops",
            title: "Cloud Infrastructure & Microservices",
            category: "DevOps",
            level: "Advanced",
            duration: "12 Weeks (48 hrs)",
            rating: 4.7,
            reviewsCount: 750,
            instructor: "Elena Rostova",
            shortDesc: "Design robust distributed systems, CI/CD pipelines, containerization, and serverless architectures.",
            fullDesc: "Deep dive into enterprise cloud architectures, container orchestration with Docker and Kubernetes, automated deployment workflows, observability, and resilient microservice design patterns.",
            badgeColor: "warning",
            icon: "bi-cloud-check",
            modules: [
                "Module 1: Cloud Architecture Fundamentals & Virtualization",
                "Module 2: Docker Containers & Multi-stage Builds",
                "Module 3: CI/CD Pipeline Automation & Testing",
                "Module 4: Microservices Communication & API Gateways",
                "Module 5: High Availability, Monitoring & Resiliency"
            ],
            learningOutcomes: [
                "Deploy multi-container applications with automated health-checks",
                "Implement scalable cloud architectures following 12-factor principles",
                "Configure automated build, test, and release pipelines",
                "Analyze cloud metrics and latency bottlenecks in distributed environments"
            ]
        },
        {
            id: "course-db-systems",
            title: "Database Engineering & SQL Optimization",
            category: "Database",
            level: "Intermediate",
            duration: "6 Weeks (24 hrs)",
            rating: 4.8,
            reviewsCount: 890,
            instructor: "Marcus Aurelius Vance",
            shortDesc: "Master relational schema design, query indexing, transactions (ACID), and distributed storage systems.",
            fullDesc: "From relational normalization and index tuning to transaction isolation and distributed query execution, master the foundational persistence layer that powers high-scale web platforms.",
            badgeColor: "info",
            icon: "bi-database",
            modules: [
                "Module 1: Relational Schema Modeling & Normal Forms",
                "Module 2: Advanced SQL: Window Functions, CTEs & Aggregations",
                "Module 3: B-Tree & Hash Indexing Strategies",
                "Module 4: Transactions, Concurrency Control & ACID Guarantees",
                "Module 5: NoSQL vs Relational Storage Trade-offs"
            ],
            learningOutcomes: [
                "Design normalized relational databases that prevent redundancy and anomalies",
                "Optimize query plans by structuring targeted composite indexes",
                "Manage concurrent data access with isolation levels and locking mechanisms",
                "Assess database bottleneck reports and diagnose slow queries"
            ]
        }
    ],

    // Question bank stratified by Course ID and Difficulty (Easy, Medium, Hard)
    questionBank: {
        "course-web-dev": {
            easy: [
                {
                    id: "web-e1",
                    difficulty: "easy",
                    points: 10,
                    question: "Which HTML5 element is most semantically appropriate for the primary navigation block of a web page?",
                    options: [
                        "<section>",
                        "<nav>",
                        "<aside>",
                        "<header>"
                    ],
                    correctIndex: 1,
                    explanation: "The <nav> tag is specifically designed in HTML5 to house navigational links for the document or external pages."
                },
                {
                    id: "web-e2",
                    difficulty: "easy",
                    points: 10,
                    question: "In the CSS Box Model, which layer is situated immediately between padding and margin?",
                    options: [
                        "Content",
                        "Border",
                        "Outline",
                        "Box-sizing"
                    ],
                    correctIndex: 1,
                    explanation: "The CSS box model layers from inside out are: Content -> Padding -> Border -> Margin."
                },
                {
                    id: "web-e3",
                    difficulty: "easy",
                    points: 10,
                    question: "Which JavaScript keyword declares a block-scoped variable that cannot be reassigned?",
                    options: [
                        "var",
                        "let",
                        "const",
                        "static"
                    ],
                    correctIndex: 2,
                    explanation: "'const' creates a block-scoped identifier that cannot be reassigned once initialized."
                }
            ],
            medium: [
                {
                    id: "web-m1",
                    difficulty: "medium",
                    points: 20,
                    question: "What is the primary benefit of Event Delegation in JavaScript DOM manipulation?",
                    options: [
                        "It prevents asynchronous code execution from blocking the main thread.",
                        "It attaches a single listener to a parent element rather than multiple listeners to individual child elements.",
                        "It completely disables event bubbling and capturing across the browser window.",
                        "It allows CSS animations to execute with hardware acceleration."
                    ],
                    correctIndex: 1,
                    explanation: "Event delegation leverages event bubbling by listening on a common ancestor, significantly reducing memory usage and handling dynamically added child elements."
                },
                {
                    id: "web-m2",
                    difficulty: "medium",
                    points: 20,
                    question: "In CSS Flexbox, what does setting 'justify-content: space-between' do on a row container?",
                    options: [
                        "Centers all child items with equal margins on the sides.",
                        "Aligns items along the cross axis.",
                        "Distributes items evenly along the main axis with first item at start and last item at end.",
                        "Wraps overflowing items onto the next line automatically."
                    ],
                    correctIndex: 2,
                    explanation: "'justify-content: space-between' spreads items along the main axis such that the outer items touch the edges and space is distributed evenly between."
                },
                {
                    id: "web-m3",
                    difficulty: "medium",
                    points: 20,
                    question: "What does the browser's 'Event Loop' do when the Call Stack is empty?",
                    options: [
                        "It shuts down JavaScript execution until the user reloads.",
                        "It checks the Task (Callback) Queue and pushes ready callbacks onto the Call Stack.",
                        "It immediately executes synchronous code in reverse order.",
                        "It deletes all variables stored in local storage."
                    ],
                    correctIndex: 1,
                    explanation: "The event loop continuously monitors the Call Stack; once empty, it transfers queued microtasks and macrotasks to the stack for execution."
                }
            ],
            hard: [
                {
                    id: "web-h1",
                    difficulty: "hard",
                    points: 30,
                    question: "Why does modifying DOM layout properties (such as 'offsetHeight' or 'getComputedStyle') inside a tight loop cause severe performance degradation?",
                    options: [
                        "It permanently locks the browser's thread pool via synchronous locks.",
                        "It triggers 'Forced Synchronous Layout' (reflow thrashing) by forcing the rendering engine to recalculate geometry repeatedly.",
                        "It forces the JavaScript engine to switch from JIT compilation to pure interpretation.",
                        "It invalidates the browser's HTTP cache headers for all assets."
                    ],
                    correctIndex: 1,
                    explanation: "Reading geometry properties after DOM mutations forces the browser to synchronously execute style calculation and layout (reflow) before the next animation frame, causing severe frame drops."
                },
                {
                    id: "web-h2",
                    difficulty: "hard",
                    points: 30,
                    question: "In modern JavaScript, what is the architectural difference between a Microtask (e.g. Promise callback) and a Macrotask (e.g. setTimeout)?",
                    options: [
                        "Macrotasks run before microtasks in every browser tick.",
                        "The entire microtask queue is drained completely before the browser yields to the next macrotask or rendering step.",
                        "Microtasks are executed in separate OS worker threads, while macrotasks are synchronous.",
                        "There is no difference; modern V8 engines treat all asynchronous tasks identically."
                    ],
                    correctIndex: 1,
                    explanation: "After each macrotask completes, the JavaScript runtime exhausts all pending microtasks in the microtask queue before rendering or picking the next macrotask."
                },
                {
                    id: "web-h3",
                    difficulty: "hard",
                    points: 30,
                    question: "When refactoring vanilla JavaScript state managers to React components, why is state immutability critical?",
                    options: [
                        "Because immutable objects occupy zero memory in V8 heap allocations.",
                        "Because React uses shallow reference equality checks (Object.is) to determine if components need re-rendering.",
                        "Because JavaScript strictly forbids mutating nested objects in modern strict mode.",
                        "Because mutable data cannot be rendered within HTML tables."
                    ],
                    correctIndex: 1,
                    explanation: "Component libraries like React rely on shallow reference comparison to detect state changes. Direct mutation doesn't alter memory references, causing re-render bypasses."
                }
            ]
        },
        "course-python-data": {
            easy: [
                {
                    id: "algo-e1",
                    difficulty: "easy",
                    points: 10,
                    question: "What is the time complexity of accessing an element in an array by its index?",
                    options: [
                        "O(1)",
                        "O(n)",
                        "O(log n)",
                        "O(n^2)"
                    ],
                    correctIndex: 0,
                    explanation: "Array access by index is constant time O(1) because elements are stored in contiguous memory addresses computed directly as base + index * size."
                },
                {
                    id: "algo-e2",
                    difficulty: "easy",
                    points: 10,
                    question: "Which data structure follows the LIFO (Last-In, First-Out) principle?",
                    options: [
                        "Queue",
                        "Stack",
                        "Binary Tree",
                        "Hash Set"
                    ],
                    correctIndex: 1,
                    explanation: "A Stack operates on the LIFO principle: elements pushed last are the first to be popped."
                }
            ],
            medium: [
                {
                    id: "algo-m1",
                    difficulty: "medium",
                    points: 20,
                    question: "What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?",
                    options: [
                        "O(1)",
                        "O(n)",
                        "O(log n)",
                        "O(n log n)"
                    ],
                    correctIndex: 2,
                    explanation: "In a balanced BST, each comparison halves the remaining search space, resulting in logarithmic O(log n) time complexity."
                },
                {
                    id: "algo-m2",
                    difficulty: "medium",
                    points: 20,
                    question: "What condition must be satisfied for Binary Search to be executed on a dataset?",
                    options: [
                        "The elements must be sorted in order.",
                        "The dataset must be represented as a Linked List.",
                        "All elements must be prime numbers.",
                        "The array size must be an exact power of two."
                    ],
                    correctIndex: 0,
                    explanation: "Binary search requires monotonic ordering (sorted elements) with random access to eliminate half the search space at each iteration."
                }
            ],
            hard: [
                {
                    id: "algo-h1",
                    difficulty: "hard",
                    points: 30,
                    question: "In hash table implementations, how does 'Separate Chaining' differ from 'Open Addressing' during collision resolution?",
                    options: [
                        "Chaining recalculates the hash function using quadratic probing; open addressing ignores collisions.",
                        "Chaining stores colliding keys in linked lists at each bucket index, whereas open addressing searches for alternative empty slots within the array.",
                        "Chaining requires no extra memory; open addressing allocates independent linked lists.",
                        "Chaining guarantees worst-case O(1) lookup under adversarial inputs."
                    ],
                    correctIndex: 1,
                    explanation: "Separate chaining handles collisions by holding a linked structure at each bucket index; open addressing probes for the next available cell in the table itself."
                }
            ]
        },
        "course-cloud-devops": {
            easy: [
                {
                    id: "cloud-e1",
                    difficulty: "easy",
                    points: 10,
                    question: "What is the primary role of a container runtime like Docker?",
                    options: [
                        "To compile C++ code into machine bytecode",
                        "To package applications and dependencies into isolated, reproducible execution units",
                        "To replace standard relational databases with flat files",
                        "To encrypt DNS requests over TLS"
                    ],
                    correctIndex: 1,
                    explanation: "Containers package application code, system libraries, and runtime dependencies together, ensuring consistent execution across development and production environments."
                }
            ],
            medium: [
                {
                    id: "cloud-m1",
                    difficulty: "medium",
                    points: 20,
                    question: "In high-availability cloud architecture, what is the role of a Reverse Proxy / Load Balancer?",
                    options: [
                        "To recompile application code dynamically upon each incoming request",
                        "To distribute incoming traffic across multiple healthy target servers and handle SSL termination",
                        "To permanently store persistent database backups in memory",
                        "To restrict all external web traffic to internal IP addresses"
                    ],
                    correctIndex: 1,
                    explanation: "Reverse proxies and load balancers distribute client requests among healthy upstream services, preventing overload and offering SSL termination."
                }
            ],
            hard: [
                {
                    id: "cloud-h1",
                    difficulty: "hard",
                    points: 30,
                    question: "In distributed microservices, how does the 'Circuit Breaker' pattern prevent cascading failures?",
                    options: [
                        "By automatically restarting failed database pods every 5 seconds",
                        "By temporarily short-circuiting calls to a degraded dependent service, returning fast fallbacks rather than exhausting thread pools",
                        "By forcing all microservices to share a unified monolithic database schema",
                        "By doubling timeout thresholds every time a timeout occurs"
                    ],
                    correctIndex: 1,
                    explanation: "The Circuit Breaker pattern trips open when downstream error rates exceed a threshold, failing fast and giving the downstream service time to recover without bringing down the caller."
                }
            ]
        },
        "course-db-systems": {
            easy: [
                {
                    id: "db-e1",
                    difficulty: "easy",
                    points: 10,
                    question: "In SQL, which clause filters rows BEFORE aggregate functions like SUM() or AVG() are computed?",
                    options: [
                        "HAVING",
                        "ORDER BY",
                        "WHERE",
                        "GROUP BY"
                    ],
                    correctIndex: 2,
                    explanation: "WHERE filters rows before aggregation occurs; HAVING filters grouped rows after aggregation."
                }
            ],
            medium: [
                {
                    id: "db-m1",
                    difficulty: "medium",
                    points: 20,
                    question: "What does the 'I' in ACID database transactions stand for, and what guarantee does it provide?",
                    options: [
                        "Indexing: All foreign keys must have B-Tree indexes.",
                        "Isolation: Concurrent transactions execute without cross-transaction interference or dirty reads depending on isolation level.",
                        "Iteration: Queries can loop over cursors indefinitely.",
                        "Idempotence: Every transaction must produce the exact same primary key."
                    ],
                    correctIndex: 1,
                    explanation: "Isolation ensures concurrent execution of transactions leaves the database in the same state as if they had been executed sequentially."
                }
            ],
            hard: [
                {
                    id: "db-h1",
                    difficulty: "hard",
                    points: 30,
                    question: "Why can a B+ Tree index perform range scans (e.g. WHERE age BETWEEN 25 AND 35) significantly faster than a standard Hash Index?",
                    options: [
                        "Hash indexes encrypt data blocks whereas B+ trees keep all values uncompressed.",
                        "B+ tree leaf nodes are linked sequentially in sorted order, enabling fast linear traversals once the starting key is located.",
                        "Hash indexes can only store string values, not integers.",
                        "B+ trees are stored entirely in CPU L1 cache, avoiding disk I/O."
                    ],
                    correctIndex: 1,
                    explanation: "In B+ trees, all leaf nodes contain ordered records and are doubly or singly linked, allowing range scans to jump to the lower bound and walk sequentially along the leaves."
                }
            ]
        }
    },

    cohorts: [
        {
            id: "cohort-spring-2026",
            name: "Spring 2026 - Alpha Cohort (Full-Stack Track)",
            courseId: "course-web-dev",
            totalEnrolled: 84,
            completedAssessments: 76,
            averageScore: 78.4,
            completionRate: 90.5,
            difficultyDistribution: {
                easy: 28,
                medium: 48,
                hard: 24
            },
            scoreDistribution: [
                { bracket: "0-40%", count: 3 },
                { bracket: "41-60%", count: 11 },
                { bracket: "61-80%", count: 34 },
                { bracket: "81-100%", count: 28 }
            ],
            learners: [
                { id: "L-101", name: "Aarav Sharma", course: "Full-Stack Web Engineering", lastDifficulty: "Hard", score: 92, questionsAnswered: 7, status: "Mastered", date: "2026-10-27" },
                { id: "L-102", name: "Alex Chen", course: "Full-Stack Web Engineering", lastDifficulty: "Hard", score: 92, questionsAnswered: 7, status: "Mastered", date: "2026-10-26" },
                { id: "L-103", name: "Marcus Rodriguez", course: "Full-Stack Web Engineering", lastDifficulty: "Medium", score: 74, questionsAnswered: 7, status: "Proficient", date: "2026-10-28" },
                { id: "L-104", name: "Priya Patel", course: "Full-Stack Web Engineering", lastDifficulty: "Medium", score: 70, questionsAnswered: 6, status: "Proficient", date: "2026-10-28" },
                { id: "L-105", name: "Liam O'Connor", course: "Full-Stack Web Engineering", lastDifficulty: "Easy", score: 52, questionsAnswered: 6, status: "Needs Practice", date: "2026-10-25" },
                { id: "L-106", name: "Fatima Al-Sayed", course: "Full-Stack Web Engineering", lastDifficulty: "Hard", score: 95, questionsAnswered: 8, status: "Mastered", date: "2026-10-29" },
                { id: "L-107", name: "David Kim", course: "Full-Stack Web Engineering", lastDifficulty: "Medium", score: 68, questionsAnswered: 6, status: "Proficient", date: "2026-10-27" },
                { id: "L-108", name: "Zoe Kravitz", course: "Full-Stack Web Engineering", lastDifficulty: "Easy", score: 48, questionsAnswered: 5, status: "Needs Practice", date: "2026-10-24" }
            ]
        },
        {
            id: "cohort-fall-2025",
            name: "Fall 2025 - Beta Cohort (Algorithms & Core CS)",
            courseId: "course-python-data",
            totalEnrolled: 62,
            completedAssessments: 58,
            averageScore: 72.1,
            completionRate: 93.5,
            difficultyDistribution: {
                easy: 35,
                medium: 45,
                hard: 20
            },
            scoreDistribution: [
                { bracket: "0-40%", count: 4 },
                { bracket: "41-60%", count: 14 },
                { bracket: "61-80%", count: 26 },
                { bracket: "81-100%", count: 14 }
            ],
            learners: [
                { id: "L-201", name: "Siddharth Rao", course: "Data Structures & Algorithmic Thinking", lastDifficulty: "Hard", score: 85, questionsAnswered: 6, status: "Mastered", date: "2026-10-22" },
                { id: "L-202", name: "Chloe Bennett", course: "Data Structures & Algorithmic Thinking", lastDifficulty: "Medium", score: 71, questionsAnswered: 6, status: "Proficient", date: "2026-10-21" },
                { id: "L-203", name: "Tariq Mansoor", course: "Data Structures & Algorithmic Thinking", lastDifficulty: "Easy", score: 45, questionsAnswered: 5, status: "Needs Practice", date: "2026-10-20" },
                { id: "L-204", name: "Ananya Deshmukh", course: "Data Structures & Algorithmic Thinking", lastDifficulty: "Hard", score: 90, questionsAnswered: 7, status: "Mastered", date: "2026-10-19" },
                { id: "L-205", name: "Benjamin Ross", course: "Data Structures & Algorithmic Thinking", lastDifficulty: "Medium", score: 66, questionsAnswered: 6, status: "Proficient", date: "2026-10-18" }
            ]
        },
        {
            id: "cohort-enterprise-cloud",
            name: "Corporate Cohort - Cloud Systems & DevOps",
            courseId: "course-cloud-devops",
            totalEnrolled: 45,
            completedAssessments: 42,
            averageScore: 81.6,
            completionRate: 93.3,
            difficultyDistribution: {
                easy: 18,
                medium: 52,
                hard: 30
            },
            scoreDistribution: [
                { bracket: "0-40%", count: 1 },
                { bracket: "41-60%", count: 5 },
                { bracket: "61-80%", count: 18 },
                { bracket: "81-100%", count: 18 }
            ],
            learners: [
                { id: "L-301", name: "Vikram Malhotra", course: "Cloud Infrastructure & Microservices", lastDifficulty: "Hard", score: 96, questionsAnswered: 6, status: "Mastered", date: "2026-10-28" },
                { id: "L-302", name: "Sonia Gandhi", course: "Cloud Infrastructure & Microservices", lastDifficulty: "Hard", score: 86, questionsAnswered: 6, status: "Mastered", date: "2026-10-27" },
                { id: "L-303", name: "Arthur Pendelton", course: "Cloud Infrastructure & Microservices", lastDifficulty: "Medium", score: 75, questionsAnswered: 5, status: "Proficient", date: "2026-10-26" }
            ]
        }
    ]
};
