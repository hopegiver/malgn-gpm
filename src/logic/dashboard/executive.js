export default {
    layout: 'default',
    data() {
        return {
            stats: {
                companyGoalAchievement: 73,
                companyTrend: 12,
                totalEmployees: 142,
                avgTenure: 3.5,
                employeeSatisfaction: 4.2,
                surveyResponse: 87,
                turnoverRate: 8.5,
                turnoverTrend: -2.3
            },
            departments: [],
            strategicGoals: [],
            metrics: {
                retentionRate: 91.5,
                goalSetupRate: 95,
                trainingRate: 78,
                evaluationRate: 88
            },
            topPerformers: [],
            goalStats: {
                completed: 45,
                completedPercent: 35,
                inProgress: 68,
                inProgressPercent: 53,
                delayed: 15,
                delayedPercent: 12
            },
            performanceTrendChart: null,
            goalDistributionChart: null
        };
    },
    async mounted() {
        // 역할에 따른 접근 권한 체크
        const user = window.getCurrentUser();
        if (user) {
            // 임원이 아닌 경우 적절한 대시보드로 리다이렉트
            if (!window.isExecutive() &&
                (!user.roles || (!user.roles.includes(window.ROLES.CEO) &&
                                 !user.roles.includes(window.ROLES.EXECUTIVE)))) {
                // 관리자인 경우 관리자 대시보드로
                if (user.roles && (user.roles.includes(window.ROLES.DEPT_HEAD) ||
                                   user.roles.includes(window.ROLES.TEAM_LEADER))) {
                    this.navigateTo('/dashboard/manager');
                } else {
                    // 그 외 직원 대시보드로
                    this.navigateTo('/dashboard/employee');
                }
                return;
            }
        }

        // 데이터 로드
        await this.loadExecutiveDashboardData();

        // 차트 초기화
        this.$nextTick(() => {
            this.initPerformanceTrendChart();
            this.initGoalDistributionChart();
        });
    },
    beforeUnmount() {
        // 차트 정리
        if (this.performanceTrendChart) {
            this.performanceTrendChart.destroy();
        }
        if (this.goalDistributionChart) {
            this.goalDistributionChart.destroy();
        }
    },
    methods: {
        async loadExecutiveDashboardData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/dashboard/executive');

            // 임시 데모 데이터
            this.departments = [
                {
                    id: 1,
                    name: '개발',
                    color: '#6366f1',
                    head: '이영희',
                    achievement: 78,
                    memberCount: 32,
                    avgPerformance: 76,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 2,
                    name: '영업',
                    color: '#10b981',
                    head: '강민지',
                    achievement: 85,
                    memberCount: 28,
                    avgPerformance: 83,
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 3,
                    name: 'HR',
                    color: '#f59e0b',
                    head: '한지원',
                    achievement: 72,
                    memberCount: 12,
                    avgPerformance: 70,
                    status: '보통',
                    statusClass: 'warning'
                },
                {
                    id: 4,
                    name: '재무',
                    color: '#8b5cf6',
                    head: '문채원',
                    achievement: 68,
                    memberCount: 15,
                    avgPerformance: 66,
                    status: '보통',
                    statusClass: 'warning'
                },
                {
                    id: 5,
                    name: '마케팅',
                    color: '#ec4899',
                    head: '박준수',
                    achievement: 82,
                    memberCount: 22,
                    avgPerformance: 80,
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 6,
                    name: 'CS',
                    color: '#3b82f6',
                    head: '정수진',
                    achievement: 75,
                    memberCount: 18,
                    avgPerformance: 74,
                    status: '양호',
                    statusClass: 'primary'
                }
            ];

            this.strategicGoals = [
                {
                    id: 1,
                    title: '연매출 500억 달성',
                    category: '재무',
                    description: '전년 대비 30% 성장을 통한 매출 목표 달성',
                    achievement: 68,
                    dueDate: '2024-12-31',
                    owner: '김대표'
                },
                {
                    id: 2,
                    title: '신규 시장 진출',
                    category: '사업',
                    description: '동남아 3개국 시장 진출 및 현지 파트너십 구축',
                    achievement: 55,
                    dueDate: '2024-09-30',
                    owner: '이부사장'
                },
                {
                    id: 3,
                    title: '디지털 전환 완료',
                    category: '혁신',
                    description: '전 부서 클라우드 기반 업무 시스템 전환',
                    achievement: 82,
                    dueDate: '2024-06-30',
                    owner: '박CTO'
                },
                {
                    id: 4,
                    title: '인재 육성 프로그램',
                    category: '인사',
                    description: '차세대 리더 50명 육성 및 역량 강화',
                    achievement: 71,
                    dueDate: '2024-11-30',
                    owner: '최CHRO'
                }
            ];

            this.topPerformers = [
                {
                    id: 1,
                    name: '김우수',
                    department: '영업',
                    position: '과장',
                    score: 95
                },
                {
                    id: 2,
                    name: '이탁월',
                    department: '개발',
                    position: '선임',
                    score: 93
                },
                {
                    id: 3,
                    name: '박뛰어남',
                    department: '마케팅',
                    position: '대리',
                    score: 91
                },
                {
                    id: 4,
                    name: '최훌륭',
                    department: '개발',
                    position: '책임',
                    score: 90
                },
                {
                    id: 5,
                    name: '정멋진',
                    department: 'CS',
                    position: '주임',
                    score: 88
                }
            ];
        },

        initPerformanceTrendChart() {
            const ctx = this.$refs.performanceTrendChart;
            if (!ctx) return;

            this.performanceTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
                    datasets: [
                        {
                            label: '전사 목표 달성률',
                            data: [65, 68, 71, 70, 72, 73],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        },
                        {
                            label: '직원 만족도',
                            data: [3.8, 3.9, 4.0, 4.1, 4.0, 4.2],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
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
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            min: 0,
                            max: 5,
                            ticks: {
                                stepSize: 1
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        },

        initGoalDistributionChart() {
            const ctx = this.$refs.goalDistributionChart;
            if (!ctx) return;

            this.goalDistributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['완료', '진행중', '지연'],
                    datasets: [{
                        data: [
                            this.goalStats.completed,
                            this.goalStats.inProgress,
                            this.goalStats.delayed
                        ],
                        backgroundColor: [
                            '#10b981',
                            '#6366f1',
                            '#ef4444'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
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
        }
    }
};
