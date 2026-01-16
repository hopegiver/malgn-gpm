# CSS 스타일 핵심 규칙

## ⚡ 최우선 원칙

**Bootstrap 5를 최대한 활용, Custom CSS는 최소화**
- Layout: `d-flex`, `row`, `col-*`, `gap-*`
- Spacing: `p-*`, `m-*`, `mb-3`, `gap-2`
- Text: `fw-bold`, `text-center`, `text-secondary`
- Border: `rounded-3`, `border`, `shadow-sm`

## 🚫 절대 금지

**HTML 파일에 `<style>` 태그 사용 금지**
```html
<!-- ❌ 금지 -->
<style>.sidebar { width: 250px; }</style>

<!-- ✅ 올바름 -->
모든 CSS는 css/base.css 에 작성
```

## 필수 규칙

1. **CSS 변수 사용**
   ```css
   /* 항상 CSS 변수 사용 */
   color: var(--primary-color);
   background: var(--gray-100);
   ```

2. **주요 색상**
   - `--primary-color: #6366f1` - 주요 버튼, 활성 메뉴
   - `--success-color: #10b981` - 완료, 달성
   - `--danger-color: #ef4444` - 삭제, Red Flag
   - `--warning-color: #f59e0b` - 경고
   - `--growth-color: #8b5cf6` - 성장 관련

3. **신호등 시스템**
   - `--signal-red: #ef4444` - 40% 미만
   - `--signal-yellow: #f59e0b` - 40-70%
   - `--signal-green: #10b981` - 70% 이상

4. **주요 클래스**
   ```css
   .stat-card          /* 통계 카드 */
   .stat-icon.primary  /* 아이콘 색상 */
   .signal-light.green /* 신호등 */
   .progress-fill.red  /* 진행바 */
   .red-flag-alert     /* 위험 알림 */
   .badge.success      /* 배지 */
   ```

5. **반응형**
   - 모바일: `@media (max-width: 768px)`
   - 태블릿: `@media (max-width: 1024px)` - 사이드바 아이콘 모드
   - Bootstrap grid 사용: `col-12 col-md-6 col-xl-3`
