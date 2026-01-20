export default {
    layout: 'default',

    data() {
        return {
            departments: [],
            filterDepartment: '',
            filterAchievement: '',
            searchKeyword: '',
            selectedGoal: null,
            goalDetailModal: null
        };
    },

    computed: {
        totalDepartments() {
            return this.departments.length;
        },

        totalGoals() {
            return this.departments.reduce((sum, dept) => sum + dept.goals.length, 0);
        },

        averageAchievement() {
            const allGoals = this.departments.flatMap(d => d.goals);
            if (allGoals.length === 0) return 0;
            const sum = allGoals.reduce((acc, g) => acc + g.achievement, 0);
            return Math.round(sum / allGoals.length);
        },

        delayedGoals() {
            const allGoals = this.departments.flatMap(d => d.goals);
            return allGoals.filter(g => g.status === '지연').length;
        },

        filteredDepartments() {
            let filtered = this.departments;

            // 부서 필터
            if (this.filterDepartment) {
                filtered = filtered.filter(d => d.name === this.filterDepartment);
            }

            // 달성률 필터
            if (this.filterAchievement) {
                filtered = filtered.map(dept => {
                    const filteredGoals = dept.goals.filter(g => {
                        if (this.filterAchievement === 'high') return g.achievement >= 70;
                        if (this.filterAchievement === 'medium') return g.achievement >= 40 && g.achievement < 70;
                        if (this.filterAchievement === 'low') return g.achievement < 40;
                        return true;
                    });
                    return { ...dept, goals: filteredGoals };
                }).filter(d => d.goals.length > 0);
            }

            // 검색 필터
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                filtered = filtered.map(dept => {
                    if (dept.name.toLowerCase().includes(keyword)) {
                        return dept;
                    }
                    const filteredGoals = dept.goals.filter(g =>
                        g.title.toLowerCase().includes(keyword) ||
                        g.description.toLowerCase().includes(keyword)
                    );
                    return { ...dept, goals: filteredGoals };
                }).filter(d => d.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) || d.goals.length > 0);
            }

            return filtered;
        }
    },

    async mounted() {
        // 권한 체크
        if (!window.isExecutive()) {
            alert('임원만 접근할 수 있습니다.');
            this.navigateTo('/dashboard/employee');
            return;
        }

        await this.loadDepartments();

        // 모달 초기화
        this.$nextTick(() => {
            const modalEl = document.getElementById('goalDetailModal');
            if (modalEl) {
                this.goalDetailModal = new bootstrap.Modal(modalEl);
            }
        });
    },

    methods: {
        async loadDepartments() {
            try {
                // TODO: 실제 API로 전환
                // const response = await this.$api.get('/api/goals/departments');
                // this.departments = response.data;
                this.departments = this.getMockDepartments();
            } catch (error) {
                console.error('부서 목표 로딩 실패:', error);
                this.departments = this.getMockDepartments();
            }
        },

        getMockDepartments() {
            return [
                {
                    id: 1,
                    name: '영업본부',
                    head: '김영업',
                    averageAchievement: 75,
                    goals: [
                        {
                            id: 101,
                            category: '재무',
                            title: '신규 고객 계약 500억 달성',
                            description: 'B2B 영업 강화를 통한 신규 고객 확보',
                            targetValue: 500,
                            currentValue: 380,
                            unit: '억원',
                            achievement: 76,
                            owner: '김영업',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '매출 1,000억 달성'
                        },
                        {
                            id: 102,
                            category: '고객',
                            title: '신규 고객 300개사 확보',
                            description: '중소기업 시장 공략',
                            targetValue: 300,
                            currentValue: 220,
                            unit: '개사',
                            achievement: 73,
                            owner: '이영업',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '신규 고객 500개사 확보'
                        }
                    ]
                },
                {
                    id: 2,
                    name: '마케팅팀',
                    head: '박마케팅',
                    averageAchievement: 82,
                    goals: [
                        {
                            id: 201,
                            category: '고객',
                            title: '브랜드 인지도 30% 향상',
                            description: '디지털 마케팅 캠페인 강화',
                            targetValue: 30,
                            currentValue: 25,
                            unit: '%',
                            achievement: 83,
                            owner: '박마케팅',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '고객 만족도 90% 이상'
                        },
                        {
                            id: 202,
                            category: '프로세스',
                            title: '리드 전환율 20% 달성',
                            description: '마케팅 자동화 시스템 구축',
                            targetValue: 20,
                            currentValue: 16,
                            unit: '%',
                            achievement: 80,
                            owner: '최마케팅',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '생산성 20% 향상'
                        }
                    ]
                },
                {
                    id: 3,
                    name: '개발본부',
                    head: '이개발',
                    averageAchievement: 68,
                    goals: [
                        {
                            id: 301,
                            category: '프로세스',
                            title: '신규 기능 10개 출시',
                            description: 'AI 기반 기능 개발',
                            targetValue: 10,
                            currentValue: 7,
                            unit: '개',
                            achievement: 70,
                            owner: '이개발',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '생산성 20% 향상'
                        },
                        {
                            id: 302,
                            category: '프로세스',
                            title: '버그 발생률 2% 이하',
                            description: '코드 품질 향상 및 테스트 자동화',
                            targetValue: 2,
                            currentValue: 2.6,
                            unit: '%',
                            achievement: 65,
                            owner: '김개발',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '불량률 1% 이하 유지'
                        }
                    ]
                },
                {
                    id: 4,
                    name: '인사팀',
                    head: '최인사',
                    averageAchievement: 88,
                    goals: [
                        {
                            id: 401,
                            category: '학습과성장',
                            title: '핵심 인재 유지율 95%',
                            description: '경력 개발 프로그램 강화',
                            targetValue: 95,
                            currentValue: 94,
                            unit: '%',
                            achievement: 99,
                            owner: '최인사',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '핵심 인재 유지율 95% 이상'
                        },
                        {
                            id: 402,
                            category: '학습과성장',
                            title: '직원 교육 이수율 100%',
                            description: '연간 필수 교육 프로그램 운영',
                            targetValue: 100,
                            currentValue: 78,
                            unit: '%',
                            achievement: 78,
                            owner: '박인사',
                            dueDate: '2024-12-31',
                            status: '진행중',
                            companyKPITitle: '임직원 교육 시간 40시간 이상'
                        }
                    ]
                },
                {
                    id: 5,
                    name: '고객지원팀',
                    head: '정고객',
                    averageAchievement: 55,
                    goals: [
                        {
                            id: 501,
                            category: '고객',
                            title: '고객 만족도 90% 달성',
                            description: 'CS 품질 향상 및 응대 시간 단축',
                            targetValue: 90,
                            currentValue: 50,
                            unit: '%',
                            achievement: 56,
                            owner: '정고객',
                            dueDate: '2024-12-31',
                            status: '지연',
                            companyKPITitle: '고객 만족도 90% 이상'
                        },
                        {
                            id: 502,
                            category: '프로세스',
                            title: '평균 응답 시간 2시간 이내',
                            description: '챗봇 도입 및 CS 인력 확충',
                            targetValue: 2,
                            currentValue: 3.2,
                            unit: '시간',
                            achievement: 54,
                            owner: '한고객',
                            dueDate: '2024-12-31',
                            status: '지연',
                            companyKPITitle: '생산성 20% 향상'
                        }
                    ]
                }
            ];
        },

        getProgressClass(achievement) {
            if (achievement >= 70) return 'bg-success';
            if (achievement >= 40) return 'bg-warning';
            return 'bg-danger';
        },

        getAchievementClass(achievement) {
            if (achievement >= 70) return 'text-success fw-semibold';
            if (achievement >= 40) return 'text-warning fw-semibold';
            return 'text-danger fw-semibold';
        },

        getCategoryBadgeClass(category) {
            switch (category) {
                case '재무': return 'bg-primary';
                case '고객': return 'bg-success';
                case '프로세스': return 'bg-warning';
                case '학습과성장': return 'bg-info';
                default: return 'bg-secondary';
            }
        },

        getStatusBadgeClass(status) {
            switch (status) {
                case '완료': return 'bg-success';
                case '진행중': return 'bg-primary';
                case '지연': return 'bg-danger';
                case '보류': return 'bg-secondary';
                default: return 'bg-secondary';
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
        },

        viewGoalDetail(goal) {
            this.selectedGoal = goal;
            this.goalDetailModal.show();
        }
    }
};
