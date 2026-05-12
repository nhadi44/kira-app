# MULTI-AGENT PROVIDER STRATEGY — DEVELOPMENT & FREE-TIER OPTIMIZATION

IMPORTANT:
KIRA must support a cost-efficient development mode optimized for:

- hackathon environments
- MVP development
- rapid iteration
- limited API budgets
- rate-limit resilience

The architecture must allow:

- provider swapping
- free-tier prioritization
- automatic fallback routing
- adaptive model selection

---

# DEVELOPMENT MODE REQUIREMENTS

KIRA should support two runtime modes:

## 1. Development Mode

Optimized for:

- free tiers
- high rate limits
- experimentation
- low cost

## 2. Production Mode

Optimized for:

- reliability
- quality
- consistency
- enterprise workloads

The orchestrator must dynamically support both.

---

# RECOMMENDED FREE / LOW-COST MODELS

Use the following provider strategy during development.

---

# PRIMARY PROVIDER — GOOGLE GEMINI

Provider:
[Google AI Studio](https://aistudio.google.com?utm_source=chatgpt.com)

Recommended models:

- gemini-2.5-flash
- gemini-1.5-flash

Purpose:

- primary orchestration
- structured JSON generation
- fast classification
- report assembly
- lightweight reasoning
- high-throughput scanning

Reason:

- generous free quota
- large context window
- low latency
- strong structured output capability

Preferred development default:
gemini-2.5-flash

Use as:

- Alpha Orchestrator
- primary routing engine
- general-purpose analysis model

---

# SECONDARY PROVIDER — OPENAI

Provider:
[OpenAI Platform](https://platform.openai.com?utm_source=chatgpt.com)

Recommended development models:

- gpt-4.1-mini
- gpt-4o-mini

Purpose:

- remediation generation
- security validation test generation
- exploitability reasoning
- structured technical explanations

Reason:

- lower cost
- reliable structured responses
- strong code reasoning

Recommended usage:
ONLY for:

- advanced reasoning
- remediation workflows
- security validation generation

Avoid using OpenAI for:

- entire repository scans
- huge context ingestion
- unnecessary summarization

Purpose:
preserve token budget.

---

# THIRD PROVIDER — ANTHROPIC CLAUDE

Provider:
[Anthropic Console](https://console.anthropic.com?utm_source=chatgpt.com)

Recommended models:

- claude-3-haiku
- claude-3.5-haiku

Purpose:

- architecture analysis
- long-context repository reasoning
- authentication flow review
- codebase understanding

Reason:

- excellent reasoning quality
- strong code understanding
- efficient long-context handling

Recommended usage:
ONLY for:

- deep reasoning tasks
- architecture-level analysis
- large project interpretation

Do NOT use Claude for:

- repetitive small scans
- high-frequency orchestration

Purpose:
reduce quota pressure.

---

# OPTIONAL PROVIDER — OPENROUTER

Provider:
[OpenRouter](https://openrouter.ai?utm_source=chatgpt.com)

Purpose:

- unified API abstraction
- provider failover
- model experimentation
- dynamic routing

Benefits:

- one API key
- many providers
- simpler orchestration
- easier failover

Recommended during hackathon:
optional but highly useful.

---

# PROVIDER ROLE DISTRIBUTION

KIRA should intelligently distribute workloads.

Recommended architecture:

## Gemini Flash

Handles:

- orchestration
- fast scanning
- structured outputs
- taxonomy mapping
- report formatting

## GPT-4o Mini / GPT-4.1 Mini

Handles:

- remediation
- validation tests
- exploitability reasoning
- developer guidance

## Claude Haiku

Handles:

- long-context analysis
- authentication flow analysis
- architectural reasoning
- attack surface understanding

---

# INTELLIGENT RATE-LIMIT ROUTING

The orchestrator MUST:

- detect provider rate limits
- monitor token exhaustion
- rebalance workloads automatically

Behavior example:

If:
Gemini quota exhausted

Then:

- move remediation generation to GPT
- move architecture reasoning to Claude

If:
OpenAI overloaded

Then:

- fallback to Gemini reasoning

Users should NEVER see:

- provider-specific failures
- quota messages
- raw API errors

Instead display:

- "Rebalancing analysis workload..."
- "Continuing distributed security analysis..."

---

# MODEL ROUTING STRATEGY

IMPORTANT:
Not every task requires expensive reasoning.

Use lightweight models first.

Example routing priority:

1. deterministic static analysis
2. Gemini Flash
3. Claude Haiku
4. GPT-4o Mini
5. larger premium models only if necessary

Purpose:

- reduce cost
- reduce rate limits
- improve scalability

---

# TOKEN OPTIMIZATION RULES

Implement:

- chunking
- summarization
- context compression
- deduplication
- snippet extraction

Never send:

- entire repositories unnecessarily
- duplicate files
- binary assets
- vendor folders
- build folders

Exclude:

- node_modules
- dist
- build
- .next
- vendor
- coverage
- logs

---

# FREE-TIER DEVELOPMENT STRATEGY

Recommended hackathon setup:

## Main Orchestrator

gemini-2.5-flash

## Deep Reasoning

claude-3-haiku

## Remediation + Validation

gpt-4o-mini

This setup balances:

- quality
- cost
- free-tier sustainability
- token efficiency

---

# PROVIDER HEALTH ENGINE

Track:

- provider latency
- token usage
- failure rate
- rate-limit frequency

Use metrics to:

- dynamically prioritize stable providers
- reduce failing provider load
- optimize routing

---

# COST PROTECTION

Implement:

- soft token limits
- daily provider quotas
- per-scan token estimation
- provider budgeting

Purpose:
prevent runaway API costs during development.

---

# LOCAL-FIRST SECURITY ANALYSIS

IMPORTANT:
AI should NOT handle everything.

Use deterministic local scanners for:

- regex-based secret detection
- dependency inspection
- entropy analysis
- unsafe function detection
- config validation
- env leakage

Reserve AI for:

- contextual reasoning
- exploitability analysis
- remediation generation
- attack chain correlation
- validation test generation

Purpose:
reduce token consumption massively.

---

# RECOMMENDED DEVELOPMENT STACK

Minimal hackathon-ready setup:

## REQUIRED

- Gemini Flash

## STRONGLY RECOMMENDED

- OpenAI GPT-4o Mini

## OPTIONAL

- Claude Haiku

This provides:

- resilience
- failover
- distributed reasoning
- manageable cost

---

# ENVIRONMENT VARIABLES

Required:

GEMINI_API_KEY=

Optional:

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=

The orchestrator must gracefully operate even if:

- some providers are unavailable
- some API keys are missing
- some providers hit limits

---

# FAILOVER REQUIREMENTS

If a provider becomes unavailable:

- reroute automatically
- preserve scan continuity
- continue progress tracking
- maintain user confidence

Never terminate scans unnecessarily.

---

# IMPLEMENTATION REQUIREMENTS

The implementation must:

- support dynamic provider registration
- support weighted routing
- support provider health scoring
- support future local LLM integration
- support retry-safe orchestration

All provider integrations must:

- use strict schema validation
- sanitize responses
- normalize outputs
- enforce structured JSON contracts

Never trust raw AI responses directly.
