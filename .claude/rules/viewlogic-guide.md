# ViewLogic 핵심 개발 규칙

## 파일 구조

```
src/
├── views/         # HTML만 (CSS 금지)
│   └── goals/my-goals.html
└── logic/         # JavaScript만
    └── goals/my-goals.js
```

**규칙:**
- 파일명 동일: `my-goals.html` ↔ `my-goals.js`
- 폴더명 = 라우트: `goals/my-goals` → `#/goals/my-goals`

## 기본 구조

```javascript
export default {
    layout: 'default',  // 또는 null (로그인 등)

    data() {
        return {
            items: [],
            loading: false
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            const response = await this.$api.get('/api/data');
            this.items = response.data;
        }
    }
}
```

## 필수 패턴

1. **페이지 이동**
   ```javascript
   this.navigateTo('/goals/my-goals');
   this.navigateTo('/goals', { id: 123 });
   ```

2. **상세보기 라우팅** ⚠️ 중요
   ```javascript
   // ✅ 올바름: navigateTo + 쿼리 파라미터
   this.navigateTo('/goals/detail', { id: 123 });
   this.navigateTo('/team/member-goals', { id: 5 });

   // ❌ 금지: window.location 직접 조작
   window.location.hash = '#/goals/detail?id=123';

   // ❌ 금지: 라우트 경로 파라미터
   this.navigateTo('/goals/detail/123');
   ```

3. **파라미터 받기**
   ```javascript
   data() {
       return {
           id: this.getParam('id'),
           allParams: this.getParams()
       }
   }
   ```

4. **API 호출**
   ```javascript
   await this.$api.get('/api/goals');
   await this.$api.post('/api/goals', data);
   await this.$api.put('/api/goals/123', data);
   await this.$api.delete('/api/goals/123');
   ```

5. **모달 처리**
   ```javascript
   mounted() {
       this.$nextTick(() => {
           this.modalInstance = new bootstrap.Modal(
               document.getElementById('myModal')
           );
       });
   }
   ```

6. **폼 제출**
   ```html
   <form @submit.prevent="handleSubmit">
   ```

## ViewLogic 내장 메서드

**라우팅**
```javascript
this.navigateTo('/goals/my-goals');           // 페이지 이동
this.navigateTo('/goals', { id: 123 });       // 파라미터와 함께 이동
this.getCurrentRoute();                        // 현재 라우트 정보
this.getParam('id');                          // 단일 파라미터
this.getParams();                             // 모든 파라미터
```

**인증**
```javascript
this.isAuth();                                // 로그인 여부
this.getToken();                              // 인증 토큰
this.logout();                                // 로그아웃
```

**데이터**
```javascript
await this.fetchData('/api/goals');           // 간편 API 호출
this.$state.user;                             // 전역 상태 접근
```

**다국어**
```javascript
this.$t('common.save');                       // 번역 텍스트
this.getLanguage();                           // 현재 언어
this.setLanguage('ko');                       // 언어 변경
```

**디버깅**
```javascript
this.log('debug message');                    // 개발 로그
```

## 금지 사항

- ❌ HTML 파일에 `<style>` 태그
- ❌ `layout: false` (null 사용)
- ❌ index를 key로 사용 (`:key="index"`)
- ❌ Promise then/catch (async/await 사용)
- ❌ `window.location.hash`, `window.location.href` (navigateTo 사용)

## computed vs methods

- **computed**: 자주 변경되지 않는 계산값
- **methods**: 매번 새로 계산해야 하는 값
