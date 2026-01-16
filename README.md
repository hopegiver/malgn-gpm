# 성과운영 시스템 (Performance Management System)

목표 중심의 성과 관리 및 개인 성장 플랫폼

## 개발 가이드 문서

프로젝트 개발을 시작하기 전에 다음 필수 가이드를 확인하세요:

- **[핵심 스타일 가이드](.claude/rules/style-guide.md)** - CSS 구조, 색상 시스템, 컴포넌트 스타일링 규칙
- **[ViewLogic 개발 가이드](.claude/rules/viewlogic-guide.md)** - ViewLogic Router 사용법, Best Practices, 개발 패턴

## 프로젝트 개요

이 시스템은 다음과 같은 철학을 바탕으로 설계되었습니다:
- **목표 중심**: 전략 → 목표 → 실행 → 체크 → 평가의 흐름
- **성장 중심**: 단순 평가가 아닌 개인의 역량과 스킬 성장에 초점
- **간편한 사용**: 직원은 쉽게 작성하고 보고, 관리자는 빠르게 파악하고 개입

## 기술 스택

- **Frontend Framework**: Vue 3
- **Router**: ViewLogic Router
- **CSS Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Charts**: Chart.js
- **Architecture**: 역할 기반 접근 제어 (RBAC)

## 프로젝트 구조

```
performance/
├── index.html                      # 메인 HTML 파일
├── .claude/
│   └── rules/                      # 개발 가이드 문서
│       ├── style-guide.md
│       └── viewlogic-guide.md
├── css/
│   └── base.css                    # 공통 스타일시트
├── src/
│   ├── views/                      # View 템플릿
│   │   ├── layout/
│   │   │   └── employee.html       # 직원용 레이아웃
│   │   ├── login.html              # 로그인 페이지
│   │   ├── dashboard/
│   │   │   └── employee.html       # 직원 대시보드
│   │   ├── goals/
│   │   │   └── my-goals.html       # 나의 목표
│   │   └── execution/
│   │       └── today.html          # 오늘의 업무
│   └── logic/                      # Logic 파일 (Vue 컴포넌트)
│       ├── layout/
│       │   └── employee.js
│       ├── login.js
│       ├── dashboard/
│       │   └── employee.js
│       ├── goals/
│       │   └── my-goals.js
│       └── execution/
│           └── today.js
└── README.md
```

## 메뉴 구조 (직원용)

### 🏠 대시보드
- 목표 달성률, 실행율, 성장 점수, 피드백 통계
- 오늘의 업무 목록
- 이번 주 실행 현황 차트
- 나의 목표 진행 상황
- 최근 피드백
- 역량 레이더 차트

### 🎯 목표
- **나의 목표**: 개인 MBO 목표 관리
  - 목표 설정 및 수정
  - 핵심 결과(KR) 관리
  - 진행 상황 업데이트
- **팀 목표 보기**: 팀 목표 참고

### ⚡ 실행
- **오늘의 업무**: 일일 업무 로그
  - 업무 추가/수정/삭제
  - 우선순위 관리
  - 시간 추적
  - 목표 연결
- **이번 주**: 주간 계획 및 보고
- **실행 이력**: 달력 보기

### 🌱 성장
- **나의 성장 맵**: 역량 현황 및 피드백
- **학습 & 개발**: 학습 계획 및 진행 상황

### 📝 평가
- **자기평가**: 자기평가 작성
- **평가 이력**: 과거 평가 내역

## 실행 방법

### 1. 로컬 서버 실행

간단한 HTTP 서버를 실행하여 애플리케이션을 확인할 수 있습니다.

#### Python 사용:
```bash
cd g:/workspace/performance
python -m http.server 8000
```

#### Node.js (http-server) 사용:
```bash
npm install -g http-server
cd g:/workspace/performance
http-server -p 8000
```

#### VS Code Live Server 사용:
1. VS Code에서 `index.html` 파일 열기
2. 우클릭 → "Open with Live Server"

### 2. 브라우저에서 접속

```
http://localhost:8000
```

### 3. 데모 로그인

로그인 페이지에서 다음 데모 계정 버튼을 클릭하세요:

- **직원**: 직원 역할의 대시보드 확인
- **관리자**: 관리자 역할의 대시보드 확인 (추후 구현 예정)
- **임원**: 임원 역할의 대시보드 확인 (추후 구현 예정)

또는 직접 이메일로 로그인:
- 직원: `employee@example.com`
- 관리자: `manager@example.com`
- 임원: `executive@example.com`

비밀번호: `demo1234` (모든 계정 동일)

## 주요 기능

### 현재 구현된 기능 ✅

1. **로그인 시스템**
   - 역할 기반 인증
   - 역할별 대시보드 리다이렉트

2. **직원 대시보드**
   - 실시간 통계 카드 (목표 달성률, 실행율, 성장 점수, 피드백)
   - 오늘의 업무 목록
   - 이번 주 실행 현황 차트
   - 나의 목표 진행 상황
   - 빠른 실행 메뉴
   - 최근 피드백
   - 역량 레이더 차트

3. **목표 관리**
   - 목표 목록 조회 (전체/진행중/완료)
   - 새 목표 추가 (모달 폼)
     - 제목, 설명, 카테고리, 시작일, 목표일 입력
     - 핵심 결과(KR) 동적 추가/삭제
     - SMART 체크리스트
     - 폼 유효성 검사
   - 목표별 핵심 결과(KR) 체크리스트
   - 달성률 진행바 및 신호등 시스템
   - 목표 일정 타임라인
   - 통계 자동 업데이트

4. **일일 업무 관리**
   - 업무 추가/수정/삭제
   - 우선순위 설정 (높음/보통/낮음)
   - 목표 연결
   - 시간 추적 (예상 시간 / 실제 시간)
   - 업무 완료 체크
   - 일일 통계 및 요약
   - 목표별 업무 분포 차트

5. **신호등 시스템**
   - 🟢 녹색: 70% 이상 (양호)
   - 🟡 노란색: 40-70% (주의)
   - 🔴 빨간색: 40% 미만 (위험)

### 향후 구현 예정 기능 📋

1. **관리자 대시보드**
   - Red Flag 시스템 (위험 요소 자동 감지)
   - 팀원 목표 현황 한눈에 보기
   - 1:1 미팅 관리

2. **임원 대시보드**
   - 전사 목표 현황
   - 부서별 성과 분석
   - 전략적 인사이트

3. **성장 관리**
   - 역량 평가 및 개발 계획
   - 스킬 트리
   - 학습 이력 관리

4. **평가 시스템**
   - 자기평가
   - 동료평가
   - 상사평가
   - 360도 피드백

5. **실시간 알림**
   - 목표 기한 알림
   - 피드백 알림
   - 1:1 미팅 요청

6. **API 연동**
   - 실제 백엔드 API 연동
   - 데이터 영속성

## 디자인 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크 테마 준비**: CSS 변수를 통한 테마 시스템
- **아이콘 모드 사이드바**: 화면 공간 최적화
- **Bootstrap 5 기반**: 일관된 UI/UX
- **Chart.js 시각화**: 데이터 시각화

## 색상 시스템

- **Primary (Indigo)**: 목표/성과 관련
- **Success (Green)**: 달성/완료 상태
- **Danger (Red)**: 위험/지연 상태
- **Warning (Amber)**: 주의 필요 상태
- **Growth (Purple)**: 성장/역량 관련

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 라이센스

Copyright © 2024 성과운영 시스템. All rights reserved.

## 문의

support@performance.com
