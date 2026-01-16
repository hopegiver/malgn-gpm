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
    layout: 'employee',  // 또는 null (로그인 등)

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

2. **파라미터 받기**
   ```javascript
   data() {
       return {
           id: this.getParam('id'),
           allParams: this.getParams()
       }
   }
   ```

3. **API 호출**
   ```javascript
   await this.$api.get('/api/goals');
   await this.$api.post('/api/goals', data);
   await this.$api.put('/api/goals/123', data);
   await this.$api.delete('/api/goals/123');
   ```

4. **모달 처리**
   ```javascript
   mounted() {
       this.$nextTick(() => {
           this.modalInstance = new bootstrap.Modal(
               document.getElementById('myModal')
           );
       });
   }
   ```

5. **폼 제출**
   ```html
   <form @submit.prevent="handleSubmit">
   ```

## 금지 사항

- ❌ HTML 파일에 `<style>` 태그
- ❌ `layout: false` (null 사용)
- ❌ index를 key로 사용 (`:key="index"`)
- ❌ Promise then/catch (async/await 사용)

## computed vs methods

- **computed**: 자주 변경되지 않는 계산값
- **methods**: 매번 새로 계산해야 하는 값
