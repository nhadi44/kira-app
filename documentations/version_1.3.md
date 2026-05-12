# PHASE 10 — BACKGROUND SCAN ORCHESTRATION & REAL-TIME SCAN PROGRESS

Upgrade KIRA scanning architecture into a resilient enterprise-grade asynchronous scanning system.

The scanning experience MUST feel:

- operationally believable
- transparent
- stable
- reliable
- production-grade
- asynchronous
- intelligently orchestrated

Users must NEVER feel:

- confused
- uncertain
- abandoned during loading
- unsure whether scanning is still running
- forced to keep the tab open

The platform must clearly communicate:

- scan progress
- current processing stage
- estimated system activity
- background continuation behavior
- scan persistence

Avoid:

- fake loading bars
- static spinners
- infinite loading ambiguity
- vague progress states
- misleading animations

The objective is:

- improve trust
- improve UX confidence
- reduce abandonment
- make scanning feel real
- simulate enterprise-grade audit pipelines

---

# CORE REQUIREMENT

KIRA scans MUST become asynchronous background jobs.

Requirements:

- scans continue even if user reloads page
- scans continue even if user navigates away
- scans persist across sessions
- scan state is recoverable
- progress updates stream in real-time

This architecture is mandatory.

---

# BACKGROUND SCAN ARCHITECTURE

Implement:

- asynchronous scan queue
- persistent scan jobs
- resumable scan sessions
- real-time progress tracking

Recommended architecture:

/jobs
/scan-engine
/progress-tracker
/queue
/workers
/events

---

# DATABASE CHANGES

Extend `Audit` model.

Add fields:

- progressPercentage
- currentStage
- estimatedCompletionSeconds
- startedAt
- completedAt
- failedAt
- backgroundJobId

Status enum:

- pending
- queued
- extracting
- analyzing
- correlating
- generating_tests
- validating
- finalizing
- completed
- failed

Requirements:

- indexed status fields
- efficient polling
- resumable state tracking

---

# REAL-TIME PROGRESS TRACKING

KIRA MUST display:

- actual scan progress
- current stage
- processing state
- estimated activity

Examples:

- 12% — Extracting archive structure
- 34% — Mapping authentication boundaries
- 57% — Correlating vulnerabilities
- 73% — Generating validation tests
- 91% — Finalizing security report

Purpose:

- reduce uncertainty
- improve trust
- communicate active processing

---

# PROGRESS ENGINE RULES

IMPORTANT:
Progress MUST NOT be fake random increments.

Progress should be derived from:

- file extraction completion
- dependency analysis completion
- AI analysis completion
- validation generation completion
- report generation completion

Requirements:

- deterministic stage progression
- realistic timing
- smooth updates
- no frozen UI

---

# SCAN STAGE PIPELINE

Create structured stages:

1. Upload Verification
2. Archive Extraction
3. Project Fingerprinting
4. Dependency Mapping
5. Security Analysis
6. Vulnerability Correlation
7. Exploitability Assessment
8. Validation Test Generation
9. Report Assembly
10. Finalization

Each stage must:

- emit progress updates
- emit timestamps
- persist state

---

# REAL-TIME TRANSPORT

Implement real-time progress updates.

Preferred:

- Server-Sent Events (SSE)

Fallback:

- polling

Requirements:

- low overhead
- reconnect support
- resilient state recovery

---

# SCAN PERSISTENCE

If user:

- reloads page
- closes tab
- navigates away

Then:

- scan MUST continue
- progress MUST persist
- report MUST remain recoverable

On return:

- automatically reconnect
- restore scan state
- continue streaming progress

---

# PAGE LEAVE / RELOAD PROTECTION

When scan is active:
display intelligent navigation warning.

Example:

"Security scan is still running in the background.

Your audit will continue processing even if you leave this page.
You may safely return later to review the final report."

Requirements:

- modern modal design
- non-alarming language
- subtle enterprise tone
- accessible interactions

Avoid:

- browser-native ugly dialogs when possible
- aggressive blocking behavior

---

# BACKGROUND SCAN NOTIFICATION SYSTEM

Implement persistent notifications.

Examples:

- Scan queued
- Deep scan running
- Validation tests generated
- Audit completed
- Scan failed

Requirements:

- toast notifications
- persistent scan center
- notification history

---

# SCAN RECOVERY EXPERIENCE

When user returns:
show:

## Resume Scan Session

Display:

- current progress
- active stage
- estimated completion
- elapsed processing time

Purpose:

- reinforce reliability
- improve operational realism

---

# SCAN DASHBOARD WIDGET

Add:

## Active Scans

Display:

- project name
- status
- progress %
- current stage
- started time
- estimated completion

Behavior:

- live updating
- resumable
- clickable

---

# MULTI-SCAN SUPPORT

Architecture must support:

- multiple concurrent scans
- queued processing
- worker scaling
- future distributed execution

---

# SCAN ORCHESTRATION ENGINE

Implement orchestration layer:

Responsibilities:

- stage sequencing
- retry logic
- timeout handling
- worker communication
- state synchronization

Requirements:

- resilient execution
- fault tolerance
- retry-safe transitions

---

# FAILURE HANDLING

Handle:

- corrupted archives
- unsupported projects
- AI failures
- timeout failures
- extraction failures
- validation generation failures

Requirements:

- structured error states
- resumable failures where possible
- actionable user messaging

Avoid:

- generic "Something went wrong"

---

# PROGRESS UI DESIGN

IMPORTANT:
Progress UI must feel:

- enterprise-grade
- calm
- trustworthy
- operational

Avoid:

- neon terminal aesthetics
- fake hacker visuals
- chaotic animations

---

# PROGRESS COMPONENT REQUIREMENTS

Include:

- animated progress bar
- stage indicators
- elapsed time
- estimated completion
- subtle motion transitions

Recommended styling:

- Zinc surfaces
- soft emerald active states
- muted typography
- subtle borders

---

# SCANNING TERMINOLOGY

Use believable enterprise language.

Examples:

- Initializing scan pipeline...
- Extracting application topology...
- Correlating authentication flows...
- Mapping dependency graph...
- Building validation suite...
- Finalizing intelligence report...

Avoid:

- movie-hacker jargon
- fake command spam
- unrealistic terminology

---

# USER TRUST LAYER

Display reassurance messaging:

Examples:

- "Your scan continues securely in the background."
- "Application archives are processed in isolated ephemeral environments."
- "Raw source files are automatically deleted after audit completion."

Purpose:

- reinforce trust
- reduce anxiety
- improve perceived reliability

---

# ACCESSIBILITY

Requirements:

- accessible progress indicators
- aria progress support
- keyboard navigation
- screen-reader stage updates
- reduced-motion support

---

# PERFORMANCE

Requirements:

- efficient SSE connections
- minimal rerenders
- debounced progress updates
- lazy hydration
- optimized queue polling

---

# OBSERVABILITY

Log:

- scan lifecycle events
- stage transitions
- worker failures
- reconnect events
- abandoned sessions
- recovery events

Include:

- request IDs
- scan IDs
- timestamps

Never log:

- raw source code
- secrets
- uploaded archives

---

# IMPLEMENTATION REQUIREMENTS

For EACH subsystem:

1. Explain architecture decisions briefly
2. Show folder/file structure first
3. Generate production-ready code
4. Include strict TypeScript types
5. Include queue architecture
6. Include background workers
7. Include real-time progress transport
8. Include retry handling
9. Include loading/error states
10. Include accessibility support

Never generate pseudo-code.

All implementations must:

- compile successfully
- follow strict TypeScript
- avoid any
- feel enterprise-grade
- feel operationally believable
- support future scalability
