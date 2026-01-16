export default {
    layout: 'default',
    data() {
        return {
            userName: '',
            stats: {
                goalAchievement: 75,
                goalTrend: 5,
                weeklyExecution: 68,
                completedTasks: 17,
                totalTasks: 25,
                growthScore: 82,
                competencyCount: 5,
                feedbackCount: 12,
                newFeedback: 3
            },
            todayTasks: [],
            myGoals: [],
            recentFeedback: [],
            weeklyChart: null,
            radarChart: null
        };
    },
    async mounted() {
        // 사용자 정보 로드
        this.loadUserInfo();

        // 데이터 로드
        await this.loadDashboardData();

        // 차트 초기화
        this.$nextTick(() => {
            this.initWeeklyChart();
            this.initRadarChart();
        });
    },
    beforeUnmount() {
        // 차트 정리
        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }
        if (this.radarChart) {
            this.radarChart.destroy();
        }
    },
    methods: {
        loadUserInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.userName = user.name || '사용자';
            }
        },

        async loadDashboardData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/dashboard/employee');

            // 임시 데모 데이터
            this.todayTasks = [
                {
                    id: 1,
                    title: '신규 기능 개발 완료',
                    goalName: 'Q1 개발 목표',
                    priority: 'High',
                    estimatedTime: 4,
                    completed: false
                },
                {
                    id: 2,
                    title: '코드 리뷰 완료',
                    goalName: '팀 협업',
                    priority: 'Medium',
                    estimatedTime: 2,
                    completed: true
                },
                {
                    id: 3,
                    title: '주간 보고서 작성',
                    goalName: '업무 관리',
                    priority: 'High',
                    estimatedTime: 1,
                    completed: false
                },
                {
                    id: 4,
                    title: '기술 문서 작성',
                    goalName: 'Q1 개발 목표',
                    priority: 'Low',
                    estimatedTime: 3,
                    completed: false
                }
            ];

            this.myGoals = [
                {
                    id: 1,
                    title: 'Q1 신규 기능 개발 완료',
                    description: '사용자 대시보드 및 리포트 기능 개발',
                    achievement: 75,
                    dueDate: '2024-03-31'
                },
                {
                    id: 2,
                    title: 'React 전문성 향상',
                    description: 'React 고급 패턴 학습 및 적용',
                    achievement: 60,
                    dueDate: '2024-06-30'
                },
                {
                    id: 3,
                    title: '코드 품질 개선',
                    description: '테스트 커버리지 80% 달성',
                    achievement: 45,
                    dueDate: '2024-04-30'
                }
            ];

            this.recentFeedback = [
                {
                    id: 1,
                    fromName: '김팀장',
                    fromInitial: '김',
                    content: '이번 주 코드 리뷰에서 좋은 개선 제안을 해주셨네요. 계속 이런 적극적인 태도 부탁드립니다!',
                    type: 'positive',
                    date: '2일 전'
                },
                {
                    id: 2,
                    fromName: '이부장',
                    fromInitial: '이',
                    content: '기술 문서 작성 시 더 구체적인 예시를 포함하면 좋을 것 같습니다.',
                    type: 'suggestion',
                    date: '5일 전'
                },
                {
                    id: 3,
                    fromName: '박대리',
                    fromInitial: '박',
                    content: '페어 프로그래밍 시 설명을 정말 잘해주셔서 많이 배웠습니다. 감사합니다!',
                    type: 'positive',
                    date: '1주 전'
                }
            ];
        },

        initWeeklyChart() {
            const ctx = this.$refs.weeklyChart;
            if (!ctx) return;

            this.weeklyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['월', '화', '수', '목', '금'],
                    datasets: [
                        {
                            label: '계획 시간',
                            data: [8, 8, 8, 8, 8],
                            backgroundColor: 'rgba(209, 250, 229, 0.8)',
                            borderColor: '#10b981',
                            borderWidth: 2
                        },
                        {
                            label: '실행 시간',
                            data: [7.5, 6.5, 8, 5.5, 7],
                            backgroundColor: 'rgba(99, 102, 241, 0.8)',
                            borderColor: '#6366f1',
                            borderWidth: 2
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
                            max: 10,
                            ticks: {
                                callback: function(value) {
                                    return value + 'h';
                                }
                            }
                        }
                    }
                }
            });
        },

        initRadarChart() {
            const ctx = this.$refs.radarChart;
            if (!ctx) return;

            this.radarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['기술역량', '문제해결', '커뮤니케이션', '협업', '리더십'],
                    datasets: [{
                        label: '현재 수준',
                        data: [85, 78, 72, 80, 65],
                        fill: true,
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        borderColor: '#8b5cf6',
                        borderWidth: 2,
                        pointBackgroundColor: '#8b5cf6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#8b5cf6'
                    }]
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
                            display: false
                        }
                    }
                }
            });
        },

        toggleTask(taskId) {
            const task = this.todayTasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;

                // TODO: API 호출로 상태 업데이트
                // await this.$api.patch(`/api/tasks/${taskId}`, { completed: task.completed });

                // 통계 업데이트
                this.updateStats();
            }
        },

        updateStats() {
            const completed = this.todayTasks.filter(t => t.completed).length;
            const total = this.todayTasks.length;

            this.stats.completedTasks = completed;
            this.stats.totalTasks = total;
            this.stats.weeklyExecution = total > 0 ? Math.round((completed / total) * 100) : 0;
        },

        getSignalClass(value) {
            if (value >= 70) return 'green';
            if (value >= 40) return 'yellow';
            return 'red';
        },

        getBootstrapSignalClass(value) {
            if (value >= 70) return 'success';
            if (value >= 40) return 'warning';
            return 'danger';
        },

        getPriorityClass(priority) {
            switch (priority) {
                case 'High':
                    return 'danger';
                case 'Medium':
                    return 'warning';
                case 'Low':
                    return 'primary';
                default:
                    return 'primary';
            }
        }
    }
};
