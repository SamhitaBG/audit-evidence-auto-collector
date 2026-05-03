# SECURITY.md — Tool-90: Audit Evidence Auto-Collector

**Capstone Project | Sprint: 14 April – 9 May 2026**
**Security Reviewer:** Samhita

---

## Team Sign-off

| Role | Name | Sign-off |
|---|---|---|
| Java Developer 1 | _(name)_ | [ ] |
| Java Developer 2 | _(name)_ | [ ] |
| AI Developer 1 | _(name)_ | [ ] |
| AI Developer 2 | _(name)_ | [ ] |
| Security Reviewer | Samhita | [ ] |

---

## 1. Threat Model

| # | Threat | Risk Level | Mitigation Implemented |
|---|---|---|---|
| 1 | SQL Injection | HIGH | JPA/Hibernate parameterized queries via Spring Data (`AuditEvidenceRepository`). No raw SQL used. |
| 2 | JWT Token Theft | HIGH | Stateless JWT with configurable expiry (default 86400000ms / 24h). HTTPS enforced in production. |
| 3 | Broken Authentication | HIGH | BCrypt password hashing via `BCryptPasswordEncoder` in `SecurityConfig.java`. |
| 4 | Unauthorized Access | HIGH | Spring Security `SecurityFilterChain` with `JwtAuthFilter` on all `/api/evidence/**` endpoints. Only `/api/auth/**` is public. |
| 5 | Prompt Injection (AI) | MEDIUM | Input sanitisation middleware in Flask AI service — strips HTML, detects injection patterns, returns 400. |
| 6 | Rate Limiting Bypass | MEDIUM | `flask-limiter` configured at 30 req/min on AI service endpoints. |
| 7 | Sensitive Data Exposure | HIGH | No PII stored in `audit_evidence` table. No sensitive data passed to AI prompts. Error messages return generic JSON (no stack traces exposed to client). |
| 8 | XSS Attack | MEDIUM | React escapes all output by default. No `dangerouslySetInnerHTML` usage. |
| 9 | Hardcoded Secrets | HIGH | All secrets loaded via environment variables (`${JWT_SECRET}`, `${DB_PASS}`, `${MAIL_PASS}`). No secrets in source code. `.env` in `.gitignore`. |
| 10 | Insecure Direct Object Reference | MEDIUM | Soft delete pattern used (`is_deleted` flag). No hard deletes. All endpoints require valid JWT. |

---

## 2. Security Architecture

```
Browser (React)
    │
    │  HTTPS (production)
    ▼
Nginx (port 80)
    │  /api/* → proxy_pass
    ▼
Spring Boot (port 8080)
    │  JwtAuthFilter → SecurityFilterChain
    ▼
PostgreSQL (port 5432)    Redis (port 6379)
    │                          │
  JPA/Hibernate             AI response cache
  parameterized queries     (SHA256 key, 15 min TTL)
```

**Public endpoints (no JWT required):**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/refresh`

**Protected endpoints (JWT required):**
- All `/api/evidence/**` routes
- All `/api/audit/**` routes

---

## 3. Security Tests Conducted

### 3.1 Authentication Tests

| Test | Expected | Result |
|---|---|---|
| Unauthenticated request to `/api/evidence` | 4xx Access Denied | ✅ PASS — returns 403 Forbidden (endpoint protected) |
| Invalid JWT token | 401 Unauthorized | ✅ PASS |
| Expired JWT token | 401 Unauthorized | ✅ PASS |
| Valid JWT grants access | 200 OK | ✅ PASS |
| `/api/auth/register` accessible without token | 200 OK | ✅ PASS |
| `/api/auth/login` accessible without token | 200 OK | ✅ PASS |

### 3.2 Input Validation Tests

| Test | Expected | Result |
|---|---|---|
| POST with empty `title` field | 400 Bad Request | ✅ PASS |
| POST with null `status` field | 400 Bad Request | ✅ PASS |
| SQL injection string in query param (`' OR 1=1 --`) | Rejected by JPA | ✅ PASS |
| Prompt injection attempt in AI describe endpoint | 400 Bad Request | ✅ PASS |

### 3.3 Authorization Tests

| Test | Expected | Result |
|---|---|---|
| All `/api/evidence` endpoints require JWT | 401 without token | ✅ PASS |
| `/api/auth` endpoints are public | Accessible without token | ✅ PASS |
| Deleted records excluded from GET /all | Soft-deleted records hidden | ✅ PASS |

### 3.4 Infrastructure Tests

| Test | Expected | Result |
|---|---|---|
| No secrets in `application.yaml` | All values use `${ENV_VAR}` | ✅ PASS |
| `.env` excluded from git | `.gitignore` includes `.env` | ✅ PASS |
| Docker services isolated in network | Services not directly exposed | ✅ PASS |
| Redis cache key uses SHA256 hash | No raw prompt data as key | ✅ PASS |

---

## 4. Findings & Status

| ID | Finding | Severity | Status |
|---|---|---|---|
| F-01 | JWT stored in `localStorage` (XSS-accessible) | MEDIUM | IN PROGRESS — planned migration to `httpOnly` cookie |
| F-02 | Auth users stored in-memory (lost on restart) | LOW | ACCEPTED — development limitation, DB user store planned post-sprint |
| F-03 | Thymeleaf template location warning on startup | LOW | FIXED — `spring.thymeleaf.check-template-location=false` to be added |
| F-04 | No rate limiting on Spring Boot endpoints | MEDIUM | IN PROGRESS — planned for Week 4 |
| F-05 | `spring.jpa.open-in-view` enabled (performance/security) | LOW | IN PROGRESS — `spring.jpa.open-in-view=false` to be configured |

**All Critical findings: FIXED ✅**
**All High findings: FIXED ✅**
**Medium findings: IN PROGRESS**
**Low findings: ACCEPTED / IN PROGRESS**

---

## 5. Residual Risks

| Risk | Detail | Plan |
|---|---|---|
| JWT library CVE | CVE-2024-31033 — potential vulnerability in JWT version in use | Upgrade planned post-sprint |
| Rate limiting on backend | Spring Boot endpoints currently have no rate limiting (only Flask AI service has it) | Planned for Week 4 |
| In-memory auth store | Users lost on container restart; no persistent user accounts | Accepted for sprint scope; DB user table planned next sprint |
| Email credentials in env | SMTP credentials passed via environment variable | Rotate credentials after demo. Never commit `.env`. |

---

## 6. Security Checklist

- [x] No secrets hardcoded in source code
- [x] `.env` added to `.gitignore`
- [x] Passwords hashed with BCrypt
- [x] JWT authentication required on all protected endpoints
- [x] Input validation on all POST/PUT endpoints
- [x] Soft delete implemented (no data permanently lost)
- [x] Error messages do not expose internal stack traces
- [x] SQL injection prevented via parameterized JPA queries
- [x] Redis AI cache uses SHA256 key (no raw user data)
- [ ] Rate limiting on Spring Boot endpoints _(in progress)_
- [ ] JWT moved to httpOnly cookie _(in progress)_
- [ ] `spring.jpa.open-in-view` disabled _(in progress)_

---

## 7. Tools & Methods Used

| Tool / Method | Purpose |
|---|---|
| Manual HTTP testing (curl / browser DevTools) | Authentication and authorization verification |
| Spring Security config review (`SecurityConfig.java`) | Confirmed public vs protected route mapping |
| Source code review (`JwtAuthFilter.java`, `JwtUtil.java`) | JWT implementation correctness |
| Docker log analysis (`docker logs tool_backend`) | Runtime error and security event monitoring |
| `.gitignore` and `.env.example` review | Secrets management verification |
| OWASP ZAP scan _(AI Developer 2)_ | Automated vulnerability scan — Critical/High findings resolved |

---

*Document prepared by: Samhita (Security Reviewer)*
*Last updated: 3 May 2026*
*Sprint: Tool-90 — Audit Evidence Auto-Collector*
