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
            sidebarVisible: true, // 사이드바 표시 여부 (기본값: 표시)
            isMobile: false,
            openAccordions: initialOpenAccordions,
            searchQuery: '',
            notificationCount: 3,
            feedbackCount: 2,
            userName: '',
            userRole: '',
            userInitial: '',
            showUserMenu: false
        };
    },
    computed: {
        toggleIconClass() {
            return this.sidebarIconMode ? 'bi-chevron-right' : 'bi-chevron-left';
        },
        // 역할별 메뉴 표시 권한
        canAccessSettings() {
            // HR 또는 임원만 환경설정(직원관리, 조직도) 접근 가능
            return window.hasRole(window.ROLES.HR) ||
                   window.hasRole(window.ROLES.STRATEGY) ||
                   window.isExecutive();
        },
        // 역할별 대시보드 URL
        dashboardUrl() {
            const user = window.getCurrentUser();
            if (!user) return '#/dashboard/employee';

            // 임원 (CEO, Executive)
            if (window.isExecutive() ||
                (user.roles && (user.roles.includes(window.ROLES.CEO) ||
                                user.roles.includes(window.ROLES.EXECUTIVE)))) {
                return '#/dashboard/executive';
            }

            // 관리자 (부서장, 팀장)
            if (user.roles && (user.roles.includes(window.ROLES.DEPT_HEAD) ||
                               user.roles.includes(window.ROLES.TEAM_LEADER))) {
                return '#/dashboard/manager';
            }

            // 일반 직원
            return '#/dashboard/employee';
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

        // 외부 클릭 시 메뉴 닫기
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
        window.removeEventListener('hashchange', this.openCurrentAccordion);
        document.removeEventListener('click', this.handleClickOutside);
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
            this.isMobile = window.innerWidth < 768; // Bootstrap md breakpoint
        },
        toggleSidebar() {
            // 모든 화면 크기에서 사이드바 전체 토글
            this.sidebarVisible = !this.sidebarVisible;
        },
        closeSidebar() {
            if (this.isMobile) {
                this.sidebarVisible = false;
            }
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
        toggleUserMenu(event) {
            event.stopPropagation();
            this.showUserMenu = !this.showUserMenu;
        },
        handleClickOutside(event) {
            const userMenuElement = event.target.closest('.user-menu');
            if (!userMenuElement && this.showUserMenu) {
                this.showUserMenu = false;
            }
        },
        goToProfile() {
            this.showUserMenu = false;
            window.location.hash = '#/profile';
        },
        goToSettings() {
            this.showUserMenu = false;
            window.location.hash = '#/settings/my-settings';
        },
        handleLogout() {
            this.showUserMenu = false;
            if (confirm('로그아웃 하시겠습니까?')) {
                // TODO: 실제 로그아웃 API 호출
                // await this.$api.post('/api/auth/logout');

                // 세션 정리
                window.sessionStorage.clear();
                window.localStorage.removeItem('auth_token');

                // 로그인 페이지로 이동
                window.location.href = '#/login';
            }
        }
    }
};
