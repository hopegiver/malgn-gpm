export default {
    layout: 'default',
    data() {
        return {
            teamName: '',
            stats: {
                teamGoalAchievement: 78,
                teamTrend: 8,
                teamMemberCount: 8,
                avgPerformance: 75,
                activeGoals: 12,
                completedGoals: 5,
                pendingFeedback: 3,
                givenFeedback: 8
            },
            teamMembers: [],
            teamGoals: [],
            pendingApprovals: [],
            performanceChart: null,
            competencyChart: null
        };
    },
    async mounted() {
        // 역할에 따른 접근 권한 체크
        const user = window.getCurrentUser();
        if (user) {
            // 임원인 경우 임원 대시보드로 리다이렉트
            if (window.isExecutive() ||
                (user.roles && (user.roles.includes(window.ROLES.CEO) ||
                                user.roles.includes(window.ROLES.EXECUTIVE)))) {
                this.navigateTo('/dashboard/executive');
                return;
            }

            // 관리자가 아닌 경우 직원 대시보드로 리다이렉트
            if (!user.roles || (!user.roles.includes(window.ROLES.DEPT_HEAD) &&
                                !user.roles.includes(window.ROLES.TEAM_LEADER))) {
                this.navigateTo('/dashboard/employee');
                return;
            }
        }

        // 팀 정보 로드
        this.loadTeamInfo();

        // 데이터 로드
        await this.loadManagerDashboardData();

        // 차트 초기화
        this.$nextTick(() => {
            this.initPerformanceChart();
            this.initCompetencyChart();
        });
    },
    beforeUnmount() {
        // 차트 정리
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }
        if (this.competencyChart) {
            this.competencyChart.destroy();
        }
    },
    methods: {
        loadTeamInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.teamName = user.team || '프론트엔드';
            }
        },

        async loadManagerDashboardData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/dashboard/manager');

            // 임시 데모 데이터
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    goalAchievement: 85,
                    weeklyTasks: 8,
                    totalTasks: 10,
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    goalAchievement: 72,
                    weeklyTasks: 6,
                    totalTasks: 8,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    goalAchievement: 65,
                    weeklyTasks: 5,
                    totalTasks: 9,
                    status: '보통',
                    statusClass: 'warning'
                },
                {
                    id: 4,
                    name: '최서연',
                    initial: '최',
                    position: '개발자',
                    goalAchievement: 78,
                    weeklyTasks: 7,
                    totalTasks: 8,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 5,
                    name: '정동욱',
                    initial: '정',
                    position: '선임 개발자',
                    goalAchievement: 82,
                    weeklyTasks: 9,
                    totalTasks: 10,
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 6,
                    name: '강민지',
                    initial: '강',
                    position: '주니어 개발자',
                    goalAchievement: 58,
                    weeklyTasks: 4,
                    totalTasks: 8,
                    status: '개선필요',
                    statusClass: 'danger'
                },
                {
                    id: 7,
                    name: '윤서진',
                    initial: '윤',
                    position: '개발자',
                    goalAchievement: 76,
                    weeklyTasks: 7,
                    totalTasks: 9,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 8,
                    name: '임태양',
                    initial: '임',
                    position: '선임 개발자',
                    goalAchievement: 88,
                    weeklyTasks: 10,
                    totalTasks: 11,
                    status: '우수',
                    statusClass: 'success'
                }
            ];

            this.teamGoals = [
                {
                    id: 1,
                    title: 'Q1 신규 기능 개발 완료',
                    description: '사용자 대시보드 및 관리자 기능 개발',
                    achievement: 75,
                    dueDate: '2024-03-31',
                    owner: '김민수'
                },
                {
                    id: 2,
                    title: '코드 품질 개선 프로젝트',
                    description: '레거시 코드 리팩토링 및 테스트 커버리지 향상',
                    achievement: 62,
                    dueDate: '2024-04-15',
                    owner: '정동욱'
                },
                {
                    id: 3,
                    title: '성능 최적화',
                    description: '페이지 로딩 속도 30% 개선',
                    achievement: 48,
                    dueDate: '2024-04-30',
                    owner: '이지은'
                }
            ];

            this.pendingApprovals = [
                {
                    id: 1,
                    title: '연차 신청',
                    requester: '박준호',
                    date: '1일 전',
                    type: '휴가'
                },
                {
                    id: 2,
                    title: '교육 신청',
                    requester: '강민지',
                    date: '2일 전',
                    type: '교육'
                },
                {
                    id: 3,
                    title: '목표 수정 요청',
                    requester: '윤서진',
                    date: '3일 전',
                    type: '목표'
                }
            ];
        },

        initPerformanceChart() {
            const ctx = this.$refs.performanceChart;
            if (!ctx) return;

            this.performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                    datasets: [
                        {
                            label: '팀 목표 달성률',
                            data: [68, 72, 75, 78, 76, 78],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2
                        },
                        {
                            label: '회사 평균',
                            data: [65, 68, 70, 72, 74, 75],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12,
                                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", Roboto'
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        },

        initCompetencyChart() {
            const ctx = this.$refs.competencyChart;
            if (!ctx) return;

            this.competencyChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['기술역량', '문제해결', '커뮤니케이션', '협업', '리더십'],
                    datasets: [
                        {
                            label: '우리 팀',
                            data: [82, 78, 85, 88, 75],
                            fill: true,
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            borderColor: '#6366f1',
                            borderWidth: 2,
                            pointBackgroundColor: '#6366f1',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#6366f1'
                        },
                        {
                            label: '회사 평균',
                            data: [75, 72, 78, 80, 70],
                            fill: true,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderColor: '#10b981',
                            borderWidth: 2,
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#10b981'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 10,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        },

        getBootstrapSignalClass(value) {
            if (value >= 70) return 'success';
            if (value >= 40) return 'warning';
            return 'danger';
        },

        viewMemberDetail(memberId) {
            // TODO: 팀원 상세 페이지로 이동
            this.navigateTo('/team/member', { id: memberId });
        },

        giveFeedback(memberId) {
            // TODO: 피드백 작성 모달 열기
            alert(`팀원 ${memberId}에게 피드백을 작성합니다.`);
        },

        approveRequest(approvalId) {
            // TODO: API 호출로 승인 처리
            const approval = this.pendingApprovals.find(a => a.id === approvalId);
            if (approval && confirm(`${approval.requester}의 ${approval.title}을 승인하시겠습니까?`)) {
                const index = this.pendingApprovals.findIndex(a => a.id === approvalId);
                if (index > -1) {
                    this.pendingApprovals.splice(index, 1);
                    this.stats.pendingFeedback--;
                    alert('승인되었습니다.');
                }
            }
        },

        rejectRequest(approvalId) {
            // TODO: API 호출로 거절 처리
            const approval = this.pendingApprovals.find(a => a.id === approvalId);
            if (approval && confirm(`${approval.requester}의 ${approval.title}을 거절하시겠습니까?`)) {
                const index = this.pendingApprovals.findIndex(a => a.id === approvalId);
                if (index > -1) {
                    this.pendingApprovals.splice(index, 1);
                    this.stats.pendingFeedback--;
                    alert('거절되었습니다.');
                }
            }
        }
    }
};
