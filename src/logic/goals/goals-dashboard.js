export default {
    layout: 'default',

    data() {
        return {
            bscCategories: [
                { name: '재무', color: 'primary', icon: 'cash-stack', achievement: 0, count: 0, completed: 0 },
                { name: '고객', color: 'success', icon: 'people', achievement: 0, count: 0, completed: 0 },
                { name: '프로세스', color: 'warning', icon: 'gear', achievement: 0, count: 0, completed: 0 },
                { name: '학습과성장', color: 'info', icon: 'lightbulb', achievement: 0, count: 0, completed: 0 }
            ],
            departments: [],
            goals: [],
            bscChart: null,
            statusChart: null,
            trendChart: null
        };
    },

    computed: {
        totalGoals() {
            return this.goals.length;
        },

        completedGoals() {
            return this.goals.filter(g => g.status === '완료').length;
        },

        completionRate() {
            if (this.totalGoals === 0) return 0;
            return Math.round((this.completedGoals / this.totalGoals) * 100);
        },

        averageAchievement() {
            if (this.goals.length === 0) return 0;
            const sum = this.goals.reduce((acc, g) => acc + g.achievement, 0);
            return Math.round(sum / this.goals.length);
        },

        atRiskGoals() {
            return this.goals.filter(g => g.achievement < 40).length;
        },

        atRiskGoalsList() {
            return this.goals
                .filter(g => g.achievement < 40)
                .sort((a, b) => a.achievement - b.achievement)
                .slice(0, 5);
        },

        rankedDepartments() {
            return [...this.departments].sort((a, b) => b.achievement - a.achievement);
        }
    },

    async mounted() {
        // 권한 체크
        if (!window.isExecutive()) {
            alert('임원만 접근할 수 있습니다.');
            this.navigateTo('/dashboard/employee');
            return;
        }

        await this.loadData();
        this.calculateBSCStats();

        this.$nextTick(() => {
            this.initCharts();
        });
    },

    methods: {
        async loadData() {
            try {
                // TODO: 실제 API로 전환
                // const [goalsRes, deptsRes] = await Promise.all([
                //     this.$api.get('/api/goals/all'),
                //     this.$api.get('/api/departments')
                // ]);
                // this.goals = goalsRes.data;
                // this.departments = deptsRes.data;

                this.goals = this.getMockGoals();
                this.departments = this.getMockDepartments();
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                this.goals = this.getMockGoals();
                this.departments = this.getMockDepartments();
            }
        },

        getMockGoals() {
            return [
                // 재무
                { id: 1, category: '재무', title: '매출 1,000억 달성', achievement: 72, status: '진행중', dueDate: '2024-12-31', department: '영업본부', owner: 'CFO 김재무' },
                { id: 2, category: '재무', title: '영업이익률 15% 달성', achievement: 80, status: '진행중', dueDate: '2024-12-31', department: '재무팀', owner: 'CFO 김재무' },
                { id: 3, category: '재무', title: '신규 계약 500억', achievement: 76, status: '진행중', dueDate: '2024-12-31', department: '영업본부', owner: '김영업' },
                // 고객
                { id: 4, category: '고객', title: '고객 만족도 90% 이상', achievement: 94, status: '진행중', dueDate: '2024-12-31', department: '마케팅팀', owner: 'CMO 박마케팅' },
                { id: 5, category: '고객', title: '신규 고객 500개사', achievement: 56, status: '지연', dueDate: '2024-12-31', department: '영업본부', owner: 'CMO 박마케팅' },
                { id: 6, category: '고객', title: '브랜드 인지도 30% 향상', achievement: 83, status: '진행중', dueDate: '2024-12-31', department: '마케팅팀', owner: '박마케팅' },
                // 프로세스
                { id: 7, category: '프로세스', title: '불량률 1% 이하', achievement: 80, status: '진행중', dueDate: '2024-12-31', department: '개발본부', owner: 'COO 이운영' },
                { id: 8, category: '프로세스', title: '생산성 20% 향상', achievement: 70, status: '진행중', dueDate: '2024-12-31', department: '개발본부', owner: 'COO 이운영' },
                { id: 9, category: '프로세스', title: '신규 기능 10개 출시', achievement: 70, status: '진행중', dueDate: '2024-12-31', department: '개발본부', owner: '이개발' },
                { id: 10, category: '프로세스', title: '버그 발생률 2% 이하', achievement: 65, status: '진행중', dueDate: '2024-12-31', department: '개발본부', owner: '김개발' },
                // 학습과성장
                { id: 11, category: '학습과성장', title: '임직원 교육 40시간', achievement: 70, status: '진행중', dueDate: '2024-12-31', department: '인사팀', owner: 'CHRO 최인사' },
                { id: 12, category: '학습과성장', title: '핵심 인재 유지율 95%', achievement: 97, status: '진행중', dueDate: '2024-12-31', department: '인사팀', owner: 'CHRO 최인사' },
                { id: 13, category: '학습과성장', title: '직원 교육 이수율 100%', achievement: 78, status: '진행중', dueDate: '2024-12-31', department: '인사팀', owner: '박인사' }
            ];
        },

        getMockDepartments() {
            return [
                { id: 1, name: '영업본부', head: '김영업', achievement: 75, goalCount: 3 },
                { id: 2, name: '마케팅팀', head: '박마케팅', achievement: 82, goalCount: 2 },
                { id: 3, name: '개발본부', head: '이개발', achievement: 68, goalCount: 4 },
                { id: 4, name: '인사팀', head: '최인사', achievement: 88, goalCount: 3 },
                { id: 5, name: '재무팀', head: '김재무', achievement: 80, goalCount: 1 }
            ];
        },

        calculateBSCStats() {
            this.bscCategories.forEach(category => {
                const categoryGoals = this.goals.filter(g => g.category === category.name);
                category.count = categoryGoals.length;
                category.completed = categoryGoals.filter(g => g.status === '완료').length;

                if (categoryGoals.length > 0) {
                    const sum = categoryGoals.reduce((acc, g) => acc + g.achievement, 0);
                    category.achievement = Math.round(sum / categoryGoals.length);
                } else {
                    category.achievement = 0;
                }
            });
        },

        initCharts() {
            this.initBSCChart();
            this.initStatusChart();
            this.initTrendChart();
        },

        initBSCChart() {
            const ctx = document.getElementById('bscChart');
            if (!ctx) return;

            this.bscChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.bscCategories.map(c => c.name),
                    datasets: [{
                        label: '평균 달성률 (%)',
                        data: this.bscCategories.map(c => c.achievement),
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(59, 130, 246, 0.8)'
                        ],
                        borderColor: [
                            'rgb(99, 102, 241)',
                            'rgb(16, 185, 129)',
                            'rgb(245, 158, 11)',
                            'rgb(59, 130, 246)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '달성률: ' + context.parsed.y + '%';
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

        initStatusChart() {
            const ctx = document.getElementById('statusChart');
            if (!ctx) return;

            const statusCounts = {
                '진행중': this.goals.filter(g => g.status === '진행중').length,
                '완료': this.goals.filter(g => g.status === '완료').length,
                '지연': this.goals.filter(g => g.status === '지연').length,
                '보류': this.goals.filter(g => g.status === '보류').length
            };

            this.statusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(107, 114, 128, 0.8)'
                        ],
                        borderColor: [
                            'rgb(99, 102, 241)',
                            'rgb(16, 185, 129)',
                            'rgb(239, 68, 68)',
                            'rgb(107, 114, 128)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((context.parsed / total) * 100);
                                    return context.label + ': ' + context.parsed + '개 (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        },

        initTrendChart() {
            const ctx = document.getElementById('trendChart');
            if (!ctx) return;

            const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
            const currentMonth = new Date().getMonth();
            const displayMonths = months.slice(0, currentMonth + 1);

            // Mock 데이터: 월별 달성률 추이
            const trendData = displayMonths.map((_, index) => {
                return Math.min(40 + (index * 5) + Math.random() * 10, 90);
            });

            this.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: displayMonths,
                    datasets: [{
                        label: '평균 달성률',
                        data: trendData,
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '달성률: ' + Math.round(context.parsed.y) + '%';
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

        getProgressClass(achievement) {
            if (achievement >= 70) return 'bg-success';
            if (achievement >= 40) return 'bg-warning';
            return 'bg-danger';
        },

        getAchievementClass(achievement) {
            if (achievement >= 70) return 'text-success';
            if (achievement >= 40) return 'text-warning';
            return 'text-danger';
        },

        getRankBadgeClass(index) {
            if (index === 0) return 'bg-warning';
            if (index === 1) return 'bg-secondary';
            if (index === 2) return 'bg-light text-dark';
            return 'bg-light text-dark';
        },

        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }
    },

    beforeUnmount() {
        // 차트 인스턴스 정리
        if (this.bscChart) this.bscChart.destroy();
        if (this.statusChart) this.statusChart.destroy();
        if (this.trendChart) this.trendChart.destroy();
    }
};
