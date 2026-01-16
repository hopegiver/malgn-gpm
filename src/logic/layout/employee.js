export default {
    data() {
        return {
            appName: window.APP_NAME,
            sidebarIconMode: false,
            openAccordions: ['goals', 'execution', 'growth', 'review'],
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

        // 현재 경로에 따라 아코디언 열기
        this.openCurrentAccordion();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
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
                this.openAccordions.splice(index, 1);
            } else {
                this.openAccordions.push(name);
            }
        },
        isAccordionOpen(name) {
            return this.openAccordions.includes(name);
        },
        openCurrentAccordion() {
            const path = window.location.hash.substring(1);

            if (path.startsWith('/goals')) {
                if (!this.openAccordions.includes('goals')) {
                    this.openAccordions.push('goals');
                }
            } else if (path.startsWith('/execution')) {
                if (!this.openAccordions.includes('execution')) {
                    this.openAccordions.push('execution');
                }
            } else if (path.startsWith('/growth')) {
                if (!this.openAccordions.includes('growth')) {
                    this.openAccordions.push('growth');
                }
            } else if (path.startsWith('/review')) {
                if (!this.openAccordions.includes('review')) {
                    this.openAccordions.push('review');
                }
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
