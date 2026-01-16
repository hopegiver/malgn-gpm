export default {
    layout: null, // 레이아웃 사용 안 함
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            isLoading: false
        };
    },
    mounted() {
        // 이미 로그인된 경우 대시보드로 리다이렉트
        const user = window.getCurrentUser();
        if (user) {
            this.redirectToDashboard(user);
        }
    },
    methods: {
        async handleLogin() {
            if (!this.email || !this.password) {
                alert('이메일과 비밀번호를 입력해주세요.');
                return;
            }

            this.isLoading = true;

            try {
                // TODO: 실제 API 호출로 대체
                // const response = await this.$api.post('/api/auth/login', {
                //     email: this.email,
                //     password: this.password,
                //     rememberMe: this.rememberMe
                // });

                // 임시 로그인 처리 (데모)
                await this.simulateLogin(this.email);

            } catch (error) {
                console.error('로그인 오류:', error);
                alert('로그인에 실패했습니다. 다시 시도해주세요.');
            } finally {
                this.isLoading = false;
            }
        },

        async simulateLogin(email) {
            // 임시 사용자 데이터 생성
            let user = {
                id: 1,
                email: email,
                name: '홍길동',
                roles: [window.ROLES.EMPLOYEE],
                department: '개발팀',
                team: '프론트엔드팀',
                position: '대리'
            };

            // 이메일에 따라 역할 설정 (데모용)
            if (email.includes('manager') || email.includes('leader')) {
                user.roles = [window.ROLES.TEAM_LEADER];
                user.name = '김팀장';
                user.position = '팀장';
            } else if (email.includes('executive') || email.includes('ceo')) {
                user.roles = [window.ROLES.EXECUTIVE];
                user.name = '박임원';
                user.position = '임원';
            }

            // 로컬 스토리지에 저장
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', 'demo-token-' + Date.now());

            // 대시보드로 리다이렉트
            setTimeout(() => {
                this.redirectToDashboard(user);
            }, 500);
        },

        loginAsEmployee() {
            this.email = 'employee@example.com';
            this.password = 'demo1234';
            this.handleLogin();
        },

        loginAsManager() {
            this.email = 'manager@example.com';
            this.password = 'demo1234';
            this.handleLogin();
        },

        loginAsExecutive() {
            this.email = 'executive@example.com';
            this.password = 'demo1234';
            this.handleLogin();
        },

        redirectToDashboard(user) {
            // 역할에 따라 적절한 대시보드로 리다이렉트
            if (user.roles.includes(window.ROLES.EXECUTIVE) || user.roles.includes(window.ROLES.CEO)) {
                window.location.hash = '#/dashboard/executive';
            } else if (user.roles.includes(window.ROLES.TEAM_LEADER) || user.roles.includes(window.ROLES.DEPT_HEAD)) {
                window.location.hash = '#/dashboard/manager';
            } else {
                window.location.hash = '#/dashboard/employee';
            }
        }
    }
};
