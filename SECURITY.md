# Security, Performance, and SEO Baseline - Fluento

This document outlines the security measures, performance optimizations, and SEO foundations implemented for the Fluento project.

## 1. Security Baseline

### Implemented Protections
- **AI Security Proxy (16A.1)**: All AI generation requests are strictly proxied through a secure server-side Express router (`/api/ai/*`).
  - **Strict Validation**: Every request is validated using **Zod** (`AiGenerationSchema`) for type safety, required fields, and safe value ranges.
  - **Request Limits**: Enforces a 10,000-character limit for prompts and 5,000-character limit for system instructions.
  - **Standardized Error Contract**: All API errors follow a machine-readable `{ error: { code, message, details } }` contract, sanitizing internal failures (e.g., timeouts, missing keys) into safe public messages.
  - **Provider Isolation**: The client never selects the underlying AI provider (Gemini, OpenAI, etc.). Provider failover and selection happen entirely within the server-side `AIRuntime`.
- **Secure API Proxy**: API keys (e.g., `GEMINI_API_KEY`) are stored in `.env` and accessed only by the server. Stubs in the browser bundle prevent accidental leaks.
- **Security Headers (Helmet)**:
  - **Content-Security-Policy (CSP)**: Restricts resource loading. Production builds strictly block `'unsafe-inline'` and `'unsafe-eval'` for scripts.
- **Rate Limiting**: Express-level rate limiting (100 req/15m) protects all `/api/` routes, with health checks exempted for monitoring.
- **Safe Error Handling**: Production error responses are sanitized to avoid leaking implementation details, stack traces, or environment variables.
- **Environment Isolation**: Sensitive credentials are managed via `.env` files and never hardcoded in source code.
- **Client-Side Stubs**: Providers for Gemini, OpenAI, and Anthropic are stubbed on the client side to prevent accidentally bundling server-only SDKs.

### Future Security Requirements
- **Authentication**: Implementing real server-side authentication (e.g., Firebase Auth or OAuth) is required before storing real user data.
- **Authorization**: Role-based access control (RBAC) should be implemented once persistent databases are active.
- **File Upload Hardening**: When implementing photo/video uploads, ensure:
  - MIME type validation (server-side).
  - Filename sanitization and randomized storage names.
  - Integration with secure storage (e.g., Google Cloud Storage or Firebase Storage).

## 2. Performance Baseline

- **Code Splitting & Lazy Loading**: Critical routes and components are lazy-loaded to minimize the initial bundle size.
- **Asset Optimization**: Standard Vite build pipeline optimizes JS and CSS.
- **Server-Side Rendering (SEO)**: While the app is a React SPA, critical metadata is served in the static `index.html`.

## 3. SEO & Discoverability

- **Semantic HTML**: Marketing sections use semantic tags for better accessibility and indexing.
- **Meta Tags**: Optimized for "AI language learning" and "aprender línguas com IA".
- **Social Metadata**: Comprehensive OpenGraph and Twitter cards for professional social sharing.
- **Structured Data**: JSON-LD `WebApplication` schema included in the homepage.
- **Robots & Sitemap**: `robots.txt` and `sitemap.xml` are configured to guide search engine crawlers.
- **AI Context**: `llms.txt` provides structured context for AI agents and LLMs.

## 4. Production Checklist

- [ ] Set `NODE_ENV=production` in deployment.
- [ ] Ensure `GEMINI_API_KEY` is set in the production environment variables.
- [ ] Verify SSL/HTTPS is active (HSTS is enabled via Helmet).
- [ ] Perform a full Lighthouse audit in the production environment.
- [ ] Configure real persistence (Firestore/Cloud SQL) and Auth.
