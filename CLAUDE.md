# 성과운영 시스템 (GPM - Goal Performance Management)

## 프로젝트 개요
목표 중심의 성과 관리 및 개인 성장 플랫폼. OKR/MBO 기반 목표 설정, 실행 관리, 성장 추적, 평가를 통합 지원.

**기술 스택:** Vue 3 + ViewLogic Router + Bootstrap 5 + Chart.js

## 핵심 아키텍처

### 1. ViewLogic Router 패턴
```
src/
├── views/         # HTML 템플릿 (CSS 금지)
│   ├── goals/my-goals.html
│   └── team/tasks.html
└── logic/         # JavaScript 로직
    ├── goals/my-goals.js
    └── team/tasks.js
```
- **파일명 = 라우트**: `goals/my-goals.html` → `#/goals/my-goals`
- **분리 원칙**: HTML과 JS 완전 분리

### 2. 역할 기반 메뉴 (Role-Based Menu)

**일반 직원 (EMPLOYEE)**
- 목표: 나의 목표, 팀 목표 보기, 회사 목표 보기
- 실행: 오늘의 업무, 이번 주, 주간 보고서, 월간 통계
- 성장: 나의 성장 맵, 학습 & 개발, 역량 진단
- 평가: 자기평가, 평가 이력

**팀장 (TEAM_LEADER, DEPT_HEAD)** - 직원 메뉴 +
- 목표: 팀 목표 관리 (팀 목표 보기 대신)
- 팀 관리:
  - 팀원 업무 현황 (`/team/tasks`)
  - 팀 실행 현황 (`/team/status`)
  - 팀원 주간보고서 (`/team/weekly-reports`)
  - 팀원 성과
- 성장: 팀원 성장 지원
- 평가: 팀원 평가

**임원 (EXECUTIVE, CEO)**
- 전략 목표: 회사 목표 관리, 부서별 목표 현황, 전사 목표 대시보드
- 조직 성과: 부서별 성과, 조직 역량 분석, 인재 현황
- 평가 & 보상: 평가 관리, 보상 관리
- 분석 & 리포트: 경영 리포트, 성과 트렌드

## BSC (Balanced Scorecard) 관점

회사 목표는 4개 관점으로 분류:
- **재무** (primary) - 매출, 수익성
- **고객** (success) - 만족도, 유지율
- **프로세스** (warning) - 효율성, 품질
- **학습과성장** (info) - 교육, 혁신

팀/개인 목표는 반드시 회사 KPI와 연계 (`companyKPIId`)

## 주요 데이터 흐름

### Mock API 패턴 (개발 중)
```javascript
// 현재: Mock JSON 파일 사용
const response = await fetch('/mock-api/company-goals.json');
const data = await response.json();

// 향후: 실제 API로 전환
// const data = await this.$api.get('/api/goals/company');
```

**Mock 데이터 위치:**
- `/mock-api/company-goals.json` - 회사 전체 목표
- `/mock-api/team-goals.json` - 팀 목표 (KPI)

### 목표 데이터 구조
```javascript
{
  id: 1,
  companyKPIId: 1,          // 회사 목표 연계 (필수)
  category: "재무",          // BSC 관점
  title: "신규 프로덕트 출시 3개 이상",
  description: "...",
  targetValue: 3,           // 목표 수치
  currentValue: 2,          // 현재 수치
  unit: "개",               // 단위
  achievement: 70,          // 달성률 (%)
  dueDate: "2024-12-31",
  owner: "김민수",
  status: "진행중",         // 진행중|완료|지연|보류
  parentGoalId: null        // 상위 목표 (계층 구조)
}
```

## CSS 규칙 (.claude/rules/style-guide.md)

### 절대 원칙
❌ **HTML 파일에 `<style>` 태그 절대 금지**
✅ 모든 CSS는 `css/base.css`에 작성

### Bootstrap 우선
```html
<!-- ✅ 올바름 -->
<div class="d-flex gap-3 mb-4">
  <div class="col-12 col-md-6">

<!-- ❌ 금지 -->
<div style="display: flex; gap: 12px;">
```

### CSS 변수 사용
```css
color: var(--primary-color);      /* #6366f1 */
background: var(--success-color);  /* #10b981 */
```

### 신호등 시스템
- 🔴 Red (40% 미만): `var(--signal-red)` #ef4444
- 🟡 Yellow (40-70%): `var(--signal-yellow)` #f59e0b
- 🟢 Green (70% 이상): `var(--signal-green)` #10b981

## 핵심 페이지 설명

### 팀 목표 관리 (`/goals/team-goals`)
- 팀장만 접근 가능
- 회사 KPI와 연계된 팀 목표 생성/수정/삭제
- BSC 관점별 회사 KPI 선택 (optgroup)
- 목표 수치, 단위, 담당자, 마감일 필수 입력

### 팀원 업무 현황 (`/team/tasks`)
- 팀원들의 오늘 업무를 카드 형식으로 표시 (3열)
- 실시간 완료/미완료 체크리스트
- 팀 전체 통계: 총 업무, 완료, 진행중, 평균 완료율

### 팀 실행 현황 (`/team/status`)
- 주간 단위 네비게이션 (이전/다음 주, 오늘)
- 팀원별 오늘/주간 업무 현황 (테이블)
- 차트: 주간 업무 진행 추이, 업무 분포

### 팀원 주간보고서 (`/team/weekly-reports`)
- 주간 단위 팀원 보고서 조회
- 달성률, 완료 업무, 이슈 사항 표시
- 팀장 피드백 작성/수정 기능
- 제출 현황, 피드백 대기 통계

## 아코디언 메뉴 동작

라우트 변경 시 자동으로 해당 메뉴 열림:
```javascript
// src/logic/layout/default.js
if (path.startsWith('/goals')) this.openAccordions = ['goals'];
if (path.startsWith('/team')) this.openAccordions = ['team'];
```

## 권한 체크 패턴

```javascript
async mounted() {
  const user = window.getCurrentUser();
  if (!user?.roles?.includes(window.ROLES.TEAM_LEADER)) {
    alert('팀장만 접근할 수 있습니다.');
    window.location.hash = '#/dashboard/employee';
    return;
  }
}
```

## 글로벌 함수

```javascript
window.getCurrentUser()  // 현재 사용자 정보
window.hasRole(role)     // 역할 확인
window.isManager()       // 팀장 이상 여부
window.isExecutive()     // 임원 여부
```

## 다음 개발 예정

1. **실제 API 연동**
   - Mock JSON → REST API 전환
   - `this.$api.get/post/put/delete` 활용

2. **개인 목표 관리**
   - 나의 목표 페이지 완성
   - 목표 상세 페이지 (`/goals/detail/:id`)
   - Key Results 관리

3. **실행 관리 강화**
   - 오늘의 업무 페이지
   - 이번 주 페이지
   - 주간 보고서 작성 (개인)

4. **성장 & 평가**
   - 역량 맵 시각화
   - 자기평가 폼
   - 팀원 평가 페이지

## 주의사항

- ✅ `layout: 'default'` 사용 (null 사용 금지)
- ✅ `:key`는 고유 ID 사용 (index 금지)
- ✅ async/await 사용 (Promise then/catch 금지)
- ✅ `@submit.prevent` 폼 제출
- ✅ Bootstrap Modal은 `$nextTick`에서 초기화
- ✅ 모든 경로는 hash 모드 (`#/...`)

## 파일 찾기 팁

```bash
# 목표 관련
src/views/goals/           # 목표 화면
src/logic/goals/           # 목표 로직

# 팀 관리
src/views/team/            # 팀 관리 화면
src/logic/team/            # 팀 관리 로직

# 실행 관리
src/views/execution/       # 실행 관리 화면
src/logic/execution/       # 실행 관리 로직

# 레이아웃
src/views/layout/default.html    # 메인 레이아웃
src/logic/layout/default.js      # 레이아웃 로직
```

---
**마지막 업데이트:** 2024-01-19
**개발 규칙:** `.claude/rules/` 폴더 참조
