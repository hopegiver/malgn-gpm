export default {
    layout: 'default',
    data() {
        return {
            teamName: '',
            stats: {
                avgPerformance: 76,
                topPerformers: 3,
                needImprovement: 2,
                pendingFeedback: 4
            },
            teamMembers: [],
            performanceChart: null
        };
    },
    async mounted() {
        const user = window.getCurrentUser();
        if (!user || !user.roles ||
            (!user.roles.includes(window.ROLES.DEPT_HEAD) &&
             !user.roles.includes(window.ROLES.TEAM_LEADER))) {
            alert('팀장만 접근할 수 있습니다.');
            this.navigateTo('/dashboard/employee');
            return;
        }

        this.loadTeamInfo();
        await this.loadPerformanceData();

        this.$nextTick(() => {
            this.initPerformanceChart();
        });
    },
    beforeUnmount() {
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }
    },
    methods: {
        loadTeamInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.teamName = user.team || '프론트엔드';
            }
        },

        async loadPerformanceData() {
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    goalAchievement: 85,
                    activeGoals: 5,
                    weeklyTasks: 8,
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    goalAchievement: 72,
                    activeGoals: 4,
                    weeklyTasks: 6,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    goalAchievement: 58,
                    activeGoals: 3,
                    weeklyTasks: 4,
                    status: '개선필요',
                    statusClass: 'warning'
                },
                {
                    id: 4,
                    name: '최서연',
                    initial: '최',
                    position: '개발자',
                    goalAchievement: 78,
                    activeGoals: 4,
                    weeklyTasks: 7,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 5,
                    name: '정동욱',
                    initial: '정',
                    position: '선임 개발자',
                    goalAchievement: 82,
                    activeGoals: 5,
                    weeklyTasks: 9,
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 6,
                    name: '강민지',
                    initial: '강',
                    position: '주니어 개발자',
                    goalAchievement: 55,
                    activeGoals: 3,
                    weeklyTasks: 4,
                    status: '개선필요',
                    statusClass: 'danger'
                },
                {
                    id: 7,
                    name: '윤서진',
                    initial: '윤',
                    position: '개발자',
                    goalAchievement: 76,
                    activeGoals: 4,
                    weeklyTasks: 7,
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 8,
                    name: '임태양',
                    initial: '임',
                    position: '선임 개발자',
                    goalAchievement: 88,
                    activeGoals: 6,
                    weeklyTasks: 10,
                    status: '우수',
                    statusClass: 'success'
                }
            ];
        },

        initPerformanceChart() {
            const ctx = this.$refs.performanceChart;
            if (!ctx) return;

            this.performanceChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.teamMembers.map(m => m.name),
                    datasets: [{
                        label: '목표 달성률 (%)',
                        data: this.teamMembers.map(m => m.goalAchievement),
                        backgroundColor: this.teamMembers.map(m => {
                            if (m.goalAchievement >= 80) return 'rgba(16, 185, 129, 0.8)';
                            if (m.goalAchievement >= 60) return 'rgba(99, 102, 241, 0.8)';
                            return 'rgba(239, 68, 68, 0.8)';
                        }),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
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

        viewMemberDetail(memberId) {
            this.navigateTo('/team/member', { id: memberId });
        },

        getProgressClass(value) {
            if (value >= 80) return 'success';
            if (value >= 60) return 'primary';
            if (value >= 40) return 'warning';
            return 'danger';
        }
    }
};
