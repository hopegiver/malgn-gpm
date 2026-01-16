export default {
    data() {
        // 초기 렌더링 시점부터 경로에 맞는 아코디언을 열기
        const path = window.location.hash.substring(1);
        let initialOpenAccordions = [];

        if (path.startsWith('/goals')) {
            initialOpenAccordions = ['goals'];
        } else if (path.startsWith('/execution')) {
            initialOpenAccordions = ['execution'];
        } else if (path.startsWith('/growth')) {
            initialOpenAccordions = ['growth'];
        } else if (path.startsWith('/review')) {
            initialOpenAccordions = ['review'];
        } else if (path.startsWith('/settings')) {
            initialOpenAccordions = ['settings'];
        }

        return {
            appName: window.APP_NAME,
            sidebarIconMode: false,
            openAccordions: initialOpenAccordions,
            searchQuery: '',
            notificationCount: 3,
            feedbackCount: 2,
            userName: '',
            userRole: '',
            userInitial: ''
        };
    },
    computed: {
        toggleIconClass() {
            return this.sidebarIconMode ? 'bi-chevron-right' : 'bi-chevron-left';
        }
    },
    mounted() {
        // 사용자 정보 로드
        this.loadUserInfo();

        // 화면 크기에 따라 사이드바 모드 설정
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize);

        // 라우트 변경 시 아코디언 자동 업데이트
        window.addEventListener('hashchange', this.openCurrentAccordion);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
        window.removeEventListener('hashchange', this.openCurrentAccordion);
    },
    methods: {
        loadUserInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.userName = user.name || '사용자';
                this.userRole = this.getRoleText(user.roles);
                this.userInitial = this.userName.charAt(0).toUpperCase();
            }
        },
        getRoleText(roles) {
            if (!roles || roles.length === 0) return '직원';

            if (roles.includes(window.ROLES.CEO)) return 'CEO';
            if (roles.includes(window.ROLES.EXECUTIVE)) return '임원';
            if (roles.includes(window.ROLES.DEPT_HEAD)) return '부서장';
            if (roles.includes(window.ROLES.TEAM_LEADER)) return '팀장';
            return '직원';
        },
        checkScreenSize() {
            if (window.innerWidth <= 1024) {
                this.sidebarIconMode = true;
            } else {
                this.sidebarIconMode = false;
            }
        },
        toggleSidebar() {
            this.sidebarIconMode = !this.sidebarIconMode;
        },
        toggleAccordion(name) {
            const index = this.openAccordions.indexOf(name);
            if (index > -1) {
                // 이미 열려있으면 닫기
                this.openAccordions.splice(index, 1);
            } else {
                // 다른 모든 아코디언 닫고 선택한 것만 열기
                this.openAccordions = [name];
            }
        },
        isAccordionOpen(name) {
            return this.openAccordions.includes(name);
        },
        openCurrentAccordion() {
            const path = window.location.hash.substring(1);

            // 현재 경로에 맞는 아코디언 하나만 열기
            if (path.startsWith('/goals')) {
                this.openAccordions = ['goals'];
            } else if (path.startsWith('/execution')) {
                this.openAccordions = ['execution'];
            } else if (path.startsWith('/growth')) {
                this.openAccordions = ['growth'];
            } else if (path.startsWith('/review')) {
                this.openAccordions = ['review'];
            } else if (path.startsWith('/settings')) {
                this.openAccordions = ['settings'];
            }
        },
        isActive(path) {
            const currentPath = window.location.hash.substring(1);
            return currentPath === path;
        },
        handleSearch() {
            if (this.searchQuery.trim()) {
                console.log('검색:', this.searchQuery);
                // TODO: 검색 기능 구현
            }
        },
        toggleNotifications() {
            console.log('알림 토글');
            // TODO: 알림 패널 표시/숨기기
        },
        goToFeedback() {
            window.location.hash = '#/growth/my-map';
        },
        toggleUserMenu() {
            console.log('사용자 메뉴 토글');
            // TODO: 사용자 메뉴 표시/숨기기 (로그아웃, 설정 등)
        }
    }
};
