# Fluento — Performance & Engineering Standards

## 1. Core Engineering Principles

### 1.1 Mobile-First & Low-End Device Target
- **Baseline Target Device**: Entry-level Android smartphones with ~4 GB RAM and 4G Network connections.
- **CPU & GPU Budget**: Limit long tasks (>50ms) during user interaction. All speech, voice processing, and animations must run smoothly without dropping below 30 FPS on budget mobile hardware.
- **Memory Footprint**: Keep client-side heap usage below 100 MB. Release unused objects, clean up audio contexts, and terminate background Web Workers when leaving media-intensive views.

### 1.2 Performance Budget
- **Initial Bundle Size**: < 200 KB compressed (gzip/brotli).
- **Time to Interactive (TTI)**: < 2.0 seconds on 4G networks.
- **First Contentful Paint (FCP)**: < 1.0 second.
- **Largest Contentful Paint (LCP)**: < 2.2 seconds.
- **Cumulative Layout Shift (CLS)**: < 0.05.
- **First Input Delay (FID) / Interaction to Next Paint (INP)**: < 100ms.

---

## 2. Code Architecture & Component Standards

### 2.1 Code Splitting & Dynamic Imports
- **Route-Based Lazy Loading**: All major application views (`Dashboard`, `LessonRoom`, `Analytics`, `Progress`, `Profile`, `Settings`, `Pricing`, `Onboarding`, `Placement`) **MUST** be lazily loaded via `React.lazy()` and wrapped in `<Suspense fallback={<SkeletonLoader />} />`.
- **Heavy Library Splitting**: Large analytical, charting, or audio-processing libraries must be imported dynamically on-demand only when the relevant feature is activated.

### 2.2 Re-render Prevention & Memory Hygiene
- **Memoization Rules**: Wrap heavy sub-components in `React.memo()`. Stabilize object references and callbacks with `useMemo()` and `useCallback()`.
- **Timer & Listener Cleanup**: All `setInterval`, `setTimeout`, `ResizeObserver`, and audio stream listeners **MUST** be systematically cleaned up in `useEffect` cleanup return callbacks.
- **DOM Tree Flattening**: Avoid unnecessary wrapper `<div>` elements. Keep total DOM nodes per page under 1,500 elements.

---

## 3. UI, Touch & Mobile UX Guidelines

### 3.1 Touch Targets & Safe Areas
- **Minimum Touch Target**: 44px × 44px for all interactive elements (buttons, inputs, icons, tabs) on touch devices.
- **Mobile Paddings & Spacing**: Use responsive spacing utilities (`p-4 sm:p-6 md:p-8`). Respect mobile notch and home bar safe areas using `env(safe-area-inset-*)`.
- **Form Inputs**: Prevent automatic zoom on iOS by setting minimum text input font size to `16px` or `text-sm`.

### 3.2 Accessibility (WCAG AA)
- **Contrast Ratios**: Minimum 4.5:1 for normal body text against background; 3.0:1 for large display titles.
- **Focus Rings**: All interactive controls must feature high-contrast visible focus outlines (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
- **Semantic Structure**: Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) with explicit `aria-label` attributes where visual labels are omitted.

---

## 4. Media, Assets & Animations

### 4.1 Fonts & Vector Assets
- **Font Subsetting**: Utilize system font stacks or performant web fonts with `font-display: swap` to prevent FOIT (Flash of Unstyled Text).
- **Vector Icons**: Use lightweight, tree-shakeable SVG icons (`lucide-react`) with explicit `width` and `height` dimensions.

### 4.2 Animation Guidelines
- **Hardware Acceleration**: Animate only composited properties (`transform`, `opacity`). Never animate layout properties like `width`, `height`, `margin`, or `padding`.
- **Reduced Motion Support**: Respect `prefers-reduced-motion: reduce` for users with motion sensitivity.

---

## 5. Pedagogy & Anti-Anxiety Principles

- **No Artificial Pressure**: Never display aggressive red timer warnings, loss-streak penalizations, or public shaming metrics.
- **Calm Micro-Interactions**: Provide encouraging, constructive feedback. Frame mistakes as natural steps in language acquisition.
- **Low Cognitive Load**: Maintain ample negative space (whitespace), clean visual hierarchy, and clear single-action focal points per view.

---

## 6. PWA & Offline Readiness

- **Service Worker Caching**: Cache core static shell assets and application icons.
- **Graceful Offline Degradation**: Provide meaningful cached views or fallback offline messages when network connectivity is lost.
