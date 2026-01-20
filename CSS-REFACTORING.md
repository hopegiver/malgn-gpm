# CSS Refactoring Guide - Bootstrap 5 전환

## 📋 목차
1. [Bootstrap 5로 대체 가능한 CSS](#bootstrap-5로-대체-가능한-css)
2. [유지해야 할 커스텀 CSS](#유지해야-할-커스텀-css)
3. [로그인 페이지 개선안](#로그인-페이지-개선안)
4. [대시보드 개선안](#대시보드-개선안)

---

## Bootstrap 5로 대체 가능한 CSS

### 1. 레이아웃 (Layout)

#### 현재 (base.css)
```css
.app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.app-body {
    display: flex;
    margin-top: var(--header-height);
    min-height: calc(100vh - var(--header-height));
}
```

#### Bootstrap 대체
```html
<div class="d-flex flex-column min-vh-100">
  <div class="d-flex" style="margin-top: 64px; min-height: calc(100vh - 64px);">
  </div>
</div>
```

### 2. 헤더 (Header)

#### 현재
```css
.header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-900);
}
```

#### Bootstrap 대체
```html
<div class="d-flex align-items-center gap-2">
  <h1 class="d-flex align-items-center gap-2 fs-5 fw-bold mb-0 text-dark">
  </h1>
</div>
```

### 3. 검색 (Search)

#### 현재
```css
.header-search {
    position: relative;
    width: 100%;
}

.header-search input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-lg);
}
```

#### Bootstrap 대체
```html
<div class="position-relative w-100">
  <input type="text" class="form-control ps-5 rounded-3" placeholder="검색...">
  <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
</div>
```

### 4. 버튼 (Buttons)

#### 현재
```css
.header-action {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--gray-600);
}

.header-action:hover {
    background: var(--gray-100);
    color: var(--gray-900);
}
```

#### Bootstrap 대체
```html
<button class="btn btn-link text-secondary p-2 position-relative">
  <i class="bi bi-bell"></i>
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    3
  </span>
</button>
```

### 5. 사용자 메뉴 (User Menu)

#### 현재
```css
.user-menu {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-lg);
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
}
```

#### Bootstrap 대체
```html
<div class="dropdown">
  <button class="btn d-flex align-items-center gap-3 rounded-3" data-bs-toggle="dropdown">
    <div class="rounded-circle d-flex align-items-center justify-content-center"
         style="width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary-color), var(--primary-light));">
      <span class="text-white fw-semibold">김</span>
    </div>
    <div class="d-none d-md-flex flex-column">
      <span class="fw-semibold small">김민수</span>
      <span class="text-secondary" style="font-size: 0.75rem;">팀장</span>
    </div>
  </button>
  <ul class="dropdown-menu dropdown-menu-end shadow">
    <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i> 프로필</a></li>
    <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i> 설정</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i> 로그아웃</a></li>
  </ul>
</div>
```

### 6. 사이드바 (Sidebar)

#### 현재
```css
.nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    color: var(--gray-700);
    font-weight: 500;
}

.nav-link.active {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: white;
}
```

#### Bootstrap 대체
```html
<ul class="nav flex-column">
  <li class="nav-item">
    <a class="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-2" href="#">
      <i class="bi bi-house"></i>
      <span>대시보드</span>
    </a>
  </li>
</ul>

<!-- CSS 커스터마이징 -->
<style>
.nav-link.active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
}
</style>
```

### 7. 아코디언 (Accordion)

#### 현재
```css
.nav-accordion {
    margin: 0.25rem 0.75rem;
}

.accordion-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
}
```

#### Bootstrap 대체
```html
<div class="accordion accordion-flush" id="sidebarAccordion">
  <div class="accordion-item border-0">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed px-3 py-2" type="button"
              data-bs-toggle="collapse" data-bs-target="#goals">
        <i class="bi bi-bullseye me-3"></i>
        목표
      </button>
    </h2>
    <div id="goals" class="accordion-collapse collapse" data-bs-parent="#sidebarAccordion">
      <div class="accordion-body p-0">
        <a href="#" class="nav-link ps-5 py-2">나의 목표</a>
        <a href="#" class="nav-link ps-5 py-2">팀 목표 보기</a>
      </div>
    </div>
  </div>
</div>
```

### 8. 페이지 헤더 (Page Header)

#### 현재
```css
.page-header {
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
}

.page-subtitle {
    color: var(--gray-600);
    font-size: 0.875rem;
}
```

#### Bootstrap 대체
```html
<div class="mb-4">
  <h1 class="fw-bold mb-2" style="font-size: 1.75rem;">페이지 제목</h1>
  <p class="text-secondary small mb-0">페이지 설명</p>
</div>
```

### 9. 카드 (Cards)

#### 현재
```css
.stat-card {
    background: white;
    border: 1px solid var(--gray-200);
    transition: all var(--transition-base);
}

.stat-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}
```

#### Bootstrap 대체
```html
<div class="card border shadow-sm h-100 hover-lift">
  <div class="card-body p-4">
    <!-- 내용 -->
  </div>
</div>

<!-- CSS 추가 -->
<style>
.hover-lift {
  transition: all 0.2s;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  border-color: var(--primary-color) !important;
}
</style>
```

### 10. 테이블 (Tables)

#### 현재
```css
.table-container {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.table tbody tr:hover {
    background: var(--gray-50);
}
```

#### Bootstrap 대체
```html
<div class="card border-0 shadow-sm rounded-3 overflow-hidden">
  <div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="bg-light">
        <tr>
          <th>이름</th>
          <th>직급</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>김민수</td>
          <td>팀장</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 11. 배지 (Badges)

#### 현재
```css
.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    font-weight: 600;
}

.badge.primary { background: var(--primary-light); color: white; }
.badge.success { background: var(--success-color); color: white; }
```

#### Bootstrap 대체
```html
<span class="badge bg-primary">진행중</span>
<span class="badge bg-success">완료</span>
<span class="badge bg-danger">지연</span>
<span class="badge bg-warning text-dark">주의</span>
```

### 12. 프로그레스 바 (Progress)

#### 현재
```css
.progress-bar-container {
    margin: 1rem 0;
}

.progress-bar {
    height: 10px;
    background: var(--gray-200);
    border-radius: 5px;
}

.progress-fill {
    height: 100%;
    border-radius: 5px;
}

.progress-fill.green {
    background: linear-gradient(90deg, var(--signal-green), #34d399);
}
```

#### Bootstrap 대체
```html
<div class="my-3">
  <div class="d-flex justify-content-between mb-2 small">
    <span>목표 달성률</span>
    <span class="fw-semibold">75%</span>
  </div>
  <div class="progress" style="height: 10px;">
    <div class="progress-bar bg-success" role="progressbar"
         style="width: 75%; background: linear-gradient(90deg, var(--signal-green), #34d399);"
         aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
  </div>
</div>
```

### 13. 그리드 레이아웃 (Grid)

#### 현재
```css
.quick-menu {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
}
```

#### Bootstrap 대체
```html
<div class="row g-4">
  <div class="col-6 col-md-4 col-lg-3">
    <!-- 카드 -->
  </div>
  <div class="col-6 col-md-4 col-lg-3">
    <!-- 카드 -->
  </div>
</div>
```

### 14. 스페이싱 (Spacing)

| 현재 CSS | Bootstrap 클래스 |
|---------|----------------|
| `margin-bottom: 0.5rem` | `mb-2` |
| `margin-bottom: 1rem` | `mb-3` |
| `margin-bottom: 1.5rem` | `mb-4` |
| `margin-bottom: 2rem` | `mb-4` 또는 `mb-5` |
| `padding: 1rem` | `p-3` |
| `padding: 1.5rem` | `p-4` |
| `padding: 2rem` | `p-5` |
| `gap: 0.5rem` | `gap-2` |
| `gap: 0.75rem` | `gap-3` |
| `gap: 1rem` | `gap-3` |

### 15. 텍스트 유틸리티

| 현재 CSS | Bootstrap 클래스 |
|---------|----------------|
| `font-weight: 400` | `fw-normal` |
| `font-weight: 500` | `fw-medium` |
| `font-weight: 600` | `fw-semibold` |
| `font-weight: 700` | `fw-bold` |
| `font-size: 0.75rem` | `small` 또는 custom |
| `font-size: 0.875rem` | `fs-6` 또는 `small` |
| `text-align: center` | `text-center` |
| `color: var(--gray-600)` | `text-secondary` |
| `color: var(--gray-900)` | `text-dark` |

### 16. 색상 유틸리티

| 현재 CSS | Bootstrap 클래스 |
|---------|----------------|
| `background: white` | `bg-white` |
| `background: var(--gray-50)` | `bg-light` |
| `color: var(--primary-color)` | `text-primary` |
| `color: var(--success-color)` | `text-success` |
| `color: var(--danger-color)` | `text-danger` |
| `color: var(--warning-color)` | `text-warning` |

---

## 유지해야 할 커스텀 CSS

다음 항목들은 프로젝트 고유 디자인이므로 **유지 필요**:

### 1. CSS Variables (필수)
```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    --signal-red: #ef4444;
    --signal-yellow: #f59e0b;
    --signal-green: #10b981;
    --growth-color: #8b5cf6;
    --gray-*: ...;
}
```

### 2. Stat Icon (커스텀 그라데이션)
```css
.stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.stat-icon.primary {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: white;
}

.stat-icon.success {
    background: linear-gradient(135deg, var(--success-color), #34d399);
    color: white;
}

.stat-icon.growth {
    background: linear-gradient(135deg, var(--growth-color), var(--growth-light));
    color: white;
}
```

### 3. Red Flag Alert (고유 디자인)
```css
.red-flag-alert {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    border: 2px solid var(--danger-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
}

.red-flag-item {
    background: white;
    border-left: 4px solid var(--danger-color);
    padding: 1rem;
    border-radius: var(--radius-md);
}
```

### 4. Signal Light (신호등 시스템)
```css
.signal-light {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-lg);
    font-weight: 600;
}

.signal-light.red {
    background: #fee2e2;
    color: var(--signal-red);
}

.signal-light.yellow {
    background: #fef3c7;
    color: var(--signal-yellow);
}

.signal-light.green {
    background: #d1fae5;
    color: var(--signal-green);
}
```

### 5. Login Page Styles (전체 유지)
```css
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.login-card {
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 480px;
    width: 100%;
}

.login-header {
    padding: 3rem 2rem 2rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    color: white;
}

.btn-login {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    border: none;
    color: white;
    font-weight: 600;
}

.btn-demo {
    padding: 0.75rem;
    border: 2px solid var(--gray-200);
    background: white;
    border-radius: var(--radius-md);
}

.login-divider {
    text-align: center;
    margin: 2rem 0;
    position: relative;
}

.login-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--gray-200);
}

.login-divider span {
    position: relative;
    background: white;
    padding: 0 1rem;
    color: var(--gray-500);
}
```

### 6. Organization Chart (조직도 전용)
```css
.org-chart { ... }
.org-node { ... }
.org-card { ... }
.org-avatar { ... }
```

### 7. Sidebar Toggle Animation
```css
.app-sidebar {
    transition: transform 0.3s ease, width 0.3s ease;
}

.app-sidebar:not(.show) {
    transform: translateX(-100%);
}
```

### 8. User Dropdown (고유 스타일)
```css
.user-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 240px;
    background: white;
    border: 1px solid var(--gray-200);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

---

## 로그인 페이지 개선안

### 현재 문제점
1. 인라인 스타일 사용: `style="color: var(--gray-600); font-size: 0.875rem;"`
2. Bootstrap과 커스텀 CSS 혼재

### 개선 방안

**옵션 1: 최소 변경 (인라인 스타일만 제거)**
```html
<!-- 현재 -->
<p class="text-center mb-3" style="color: var(--gray-600); font-size: 0.875rem;">
  데모 계정으로 빠르게 시작하기
</p>

<!-- 개선 -->
<p class="text-center text-secondary small mb-3">
  데모 계정으로 빠르게 시작하기
</p>
```

**옵션 2: 완전 리팩토링 (권장하지 않음)**
- 로그인 페이지는 현재 디자인이 완성도가 높음
- 그라데이션, 카드 스타일 등 고유 디자인 요소가 많음
- **결론**: 인라인 스타일만 제거하고 나머지는 유지

---

## 대시보드 개선안

### 현재 상태
대시보드는 이미 Bootstrap 5를 잘 활용하고 있음:
- `card`, `card-body`
- `row`, `col-*` 그리드
- `d-flex`, `gap-*`, `shadow-sm`
- Bootstrap utilities

### 개선 필요 항목

1. **`.stat-icon` 클래스**
   - 유지 필요 (그라데이션 배경)
   - base.css에 정의되어 있음

2. **인라인 스타일**
```html
<!-- 현재 -->
<div class="progress mb-2" style="height: 8px;">

<!-- 개선 -->
<div class="progress mb-2 progress-sm">

<!-- base.css에 추가 -->
.progress-sm {
    height: 8px;
}
```

---

## 액션 아이템

### 즉시 적용 가능 (Low Risk)
1. ✅ 인라인 스타일 제거
2. ✅ Bootstrap 유틸리티로 대체 가능한 CSS 클래스 치환
3. ✅ 스페이싱 클래스 통일 (`mb-3`, `p-4` 등)

### 신중한 검토 필요 (Medium Risk)
1. ⚠️ Sidebar 아코디언 → Bootstrap Accordion 전환
2. ⚠️ User Dropdown → Bootstrap Dropdown 전환
3. ⚠️ 커스텀 프로그레스 바 그라데이션

### 유지 권장 (Don't Touch)
1. 🔒 CSS Variables
2. 🔒 Login Page 전체 스타일
3. 🔒 Stat Icon 그라데이션
4. 🔒 Red Flag Alert
5. 🔒 Signal Light
6. 🔒 Organization Chart

---

## 마이그레이션 전략

### Phase 1: 안전한 변경 (1-2일)
- 인라인 스타일 제거
- Bootstrap 유틸리티로 치환 가능한 간단한 CSS 변경
- 테스트: 전체 페이지 육안 확인

### Phase 2: 컴포넌트 개선 (3-5일)
- Sidebar, Dropdown 등 주요 컴포넌트 Bootstrap 전환
- 기능 테스트 포함

### Phase 3: 최적화 (선택)
- 사용하지 않는 CSS 제거
- CSS 번들 크기 최적화

---

**마지막 업데이트**: 2026-01-19
