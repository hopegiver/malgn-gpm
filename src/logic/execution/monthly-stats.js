export default {
    layout: 'employee',
    data() {
        return {
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            monthlyStats: {
                total: 0,
                completed: 0,
                completionRate: 0,
                totalHours: 0,
                avgDaily: 0,
                avgHoursDaily: 0,
                estimatedHours: 0,
                actualHours: 0,
                efficiency: 0
            },
            weeklyBreakdown: [],
            goalPerformance: [],
            insights: {
                bestWeek: '',
                bestWeekRate: 0,
                topGoal: '',
                topGoalHours: 0,
                efficiencyText: ''
            },
            charts: {
                weeklyTrend: null,
                priority: null,
                goalTime: null,
                timeComparison: null
            }
        };
    },
    computed: {
        currentMonthText() {
            return `${this.currentYear}년 ${this.currentMonth + 1}월`;
        }
    },
    async mounted() {
        await this.loadMonthlyData();
        this.$nextTick(() => {
            this.initCharts();
        });
    },
    beforeUnmount() {
        // Destroy all charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
    },
    methods: {
        goToCurrentMonth() {
            this.currentYear = new Date().getFullYear();
            this.currentMonth = new Date().getMonth();
            this.loadMonthlyData();
        },

        previousMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
            this.loadMonthlyData();
        },

        nextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
            this.loadMonthlyData();
        },

        async loadMonthlyData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/execution/monthly', {
            //     year: this.currentYear,
            //     month: this.currentMonth + 1
            // });

            // 임시 데모 데이터 생성
            this.generateDemoData();
            this.calculateMonthlyStats();
            this.calculateInsights();

            // 차트 업데이트
            this.$nextTick(() => {
                this.updateCharts();
            });
        },

        generateDemoData() {
            // 주차별 데이터 (4주)
            this.weeklyBreakdown = [
                {
                    week: 1,
                    weekLabel: '1주차',
                    total: 12,
                    completed: 10,
                    completionRate: 83,
                    hours: 42,
                    estimatedHours: 40
                },
                {
                    week: 2,
                    weekLabel: '2주차',
                    total: 15,
                    completed: 12,
                    completionRate: 80,
                    hours: 48,
                    estimatedHours: 50
                },
                {
                    week: 3,
                    weekLabel: '3주차',
                    total: 13,
                    completed: 11,
                    completionRate: 85,
                    hours: 45,
                    estimatedHours: 42
                },
                {
                    week: 4,
                    weekLabel: '4주차',
                    total: 14,
                    completed: 9,
                    completionRate: 64,
                    hours: 38,
                    estimatedHours: 45
                }
            ];

            // 목표별 성과
            this.goalPerformance = [
                {
                    name: 'Q1 신규 기능 개발 완료',
                    count: 18,
                    completed: 14,
                    completionRate: 78,
                    hours: 72
                },
                {
                    name: '코드 품질 개선',
                    count: 15,
                    completed: 13,
                    completionRate: 87,
                    hours: 58
                },
                {
                    name: '팀 협업 프로세스 개선',
                    count: 10,
                    completed: 8,
                    completionRate: 80,
                    hours: 35
                },
                {
                    name: 'React 전문성 향상',
                    count: 8,
                    completed: 7,
                    completionRate: 88,
                    hours: 28
                },
                {
                    name: '기타',
                    count: 3,
                    completed: 2,
                    completionRate: 67,
                    hours: 10
                }
            ];
        },

        calculateMonthlyStats() {
            // 전체 통계 계산
            this.monthlyStats.total = this.weeklyBreakdown.reduce((sum, w) => sum + w.total, 0);
            this.monthlyStats.completed = this.weeklyBreakdown.reduce((sum, w) => sum + w.completed, 0);
            this.monthlyStats.completionRate = this.monthlyStats.total > 0
                ? Math.round((this.monthlyStats.completed / this.monthlyStats.total) * 100)
                : 0;

            this.monthlyStats.totalHours = this.weeklyBreakdown.reduce((sum, w) => sum + w.hours, 0);
            this.monthlyStats.estimatedHours = this.weeklyBreakdown.reduce((sum, w) => sum + w.estimatedHours, 0);
            this.monthlyStats.actualHours = this.monthlyStats.totalHours;

            // 일평균 계산 (주 5일 근무 기준, 4주 = 20일)
            const workingDays = this.weeklyBreakdown.length * 5;
            this.monthlyStats.avgDaily = workingDays > 0
                ? Math.round((this.monthlyStats.total / workingDays) * 10) / 10
                : 0;
            this.monthlyStats.avgHoursDaily = workingDays > 0
                ? Math.round((this.monthlyStats.totalHours / workingDays) * 10) / 10
                : 0;

            // 효율성 계산
            this.monthlyStats.efficiency = this.monthlyStats.estimatedHours > 0
                ? Math.round((this.monthlyStats.estimatedHours / this.monthlyStats.actualHours) * 100)
                : 0;
        },

        calculateInsights() {
            // 최고 생산성 주차
            const bestWeek = this.weeklyBreakdown.reduce((best, week) =>
                week.completionRate > best.completionRate ? week : best
            , this.weeklyBreakdown[0]);

            this.insights.bestWeek = bestWeek.weekLabel;
            this.insights.bestWeekRate = bestWeek.completionRate;

            // 가장 많은 시간 투입 목표
            const topGoal = this.goalPerformance.reduce((top, goal) =>
                goal.hours > top.hours ? goal : top
            , this.goalPerformance[0]);

            this.insights.topGoal = topGoal.name;
            this.insights.topGoalHours = topGoal.hours;

            // 효율성 텍스트
            const efficiency = this.monthlyStats.efficiency;
            if (efficiency >= 100) {
                this.insights.efficiencyText = '예상보다 빠르게 완료했어요! 👍';
            } else if (efficiency >= 90) {
                this.insights.efficiencyText = '예상 시간과 비슷해요 ✅';
            } else if (efficiency >= 80) {
                this.insights.efficiencyText = '조금 더 시간이 소요되었어요';
            } else {
                this.insights.efficiencyText = '시간 예측 개선이 필요해요';
            }
        },

        initCharts() {
            this.initWeeklyTrendChart();
            this.initPriorityChart();
            this.initGoalTimeChart();
            this.initTimeComparisonChart();
        },

        updateCharts() {
            if (this.charts.weeklyTrend) {
                this.charts.weeklyTrend.destroy();
                this.initWeeklyTrendChart();
            }
            if (this.charts.priority) {
                this.charts.priority.destroy();
                this.initPriorityChart();
            }
            if (this.charts.goalTime) {
                this.charts.goalTime.destroy();
                this.initGoalTimeChart();
            }
            if (this.charts.timeComparison) {
                this.charts.timeComparison.destroy();
                this.initTimeComparisonChart();
            }
        },

        initWeeklyTrendChart() {
            const ctx = this.$refs.weeklyTrendChart;
            if (!ctx) return;

            this.charts.weeklyTrend = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.weeklyBreakdown.map(w => w.weekLabel),
                    datasets: [{
                        label: '완료율 (%)',
                        data: this.weeklyBreakdown.map(w => w.completionRate),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7
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
                                label: (context) => `완료율: ${context.parsed.y}%`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: (value) => value + '%'
                            }
                        }
                    }
                }
            });
        },

        initPriorityChart() {
            const ctx = this.$refs.priorityChart;
            if (!ctx) return;

            // 우선순위별 데이터 (데모)
            const priorityData = {
                high: 22,
                medium: 20,
                low: 12
            };

            this.charts.priority = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['높음', '보통', '낮음'],
                    datasets: [{
                        data: [priorityData.high, priorityData.medium, priorityData.low],
                        backgroundColor: [
                            '#ef4444',
                            '#f59e0b',
                            '#6366f1'
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
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
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        },

        initGoalTimeChart() {
            const ctx = this.$refs.goalTimeChart;
            if (!ctx) return;

            this.charts.goalTime = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.goalPerformance.map(g => this.truncateText(g.name, 20)),
                    datasets: [{
                        label: '투입 시간 (h)',
                        data: this.goalPerformance.map(g => g.hours),
                        backgroundColor: [
                            '#6366f1',
                            '#8b5cf6',
                            '#ec4899',
                            '#f59e0b',
                            '#10b981'
                        ],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => `${context.parsed.x}시간`
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => value + 'h'
                            }
                        }
                    }
                }
            });
        },

        initTimeComparisonChart() {
            const ctx = this.$refs.timeComparisonChart;
            if (!ctx) return;

            this.charts.timeComparison = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.weeklyBreakdown.map(w => w.weekLabel),
                    datasets: [
                        {
                            label: '예상 시간',
                            data: this.weeklyBreakdown.map(w => w.estimatedHours),
                            backgroundColor: 'rgba(99, 102, 241, 0.5)',
                            borderRadius: 6
                        },
                        {
                            label: '실제 시간',
                            data: this.weeklyBreakdown.map(w => w.hours),
                            backgroundColor: '#6366f1',
                            borderRadius: 6
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
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => `${context.dataset.label}: ${context.parsed.y}시간`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => value + 'h'
                            }
                        }
                    }
                }
            });
        },

        truncateText(text, maxLength) {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }
    }
};
