export default {
    layout: 'default',
    data() {
        return {
            evaluations: [],
            filterType: 'all',
            expandedEvaluations: [],
            scoreTrendChart: null,
            competencyTrendChart: null
        };
    },
    computed: {
        filteredEvaluations() {
            if (this.filterType === 'all') {
                return this.evaluations;
            }
            return this.evaluations.filter(e => e.type === this.filterType);
        },
        totalEvaluations() {
            return this.evaluations.length;
        },
        averageScore() {
            if (this.evaluations.length === 0) return 0;
            const sum = this.evaluations.reduce((acc, e) => acc + e.totalScore, 0);
            return (sum / this.evaluations.length).toFixed(1);
        },
        averageAchievement() {
            if (this.evaluations.length === 0) return 0;
            const sum = this.evaluations.reduce((acc, e) => acc + e.goalAchievement, 0);
            return Math.round(sum / this.evaluations.length);
        },
        topGrowthCompetency() {
            // 가장 많이 성장한 역량 계산 (데모)
            return 'Frontend 개발';
        },
        topGrowthValue() {
            return 1.2;
        }
    },
    async mounted() {
        await this.loadEvaluations();
        this.$nextTick(() => {
            this.initCharts();
        });
    },
    beforeUnmount() {
        if (this.scoreTrendChart) this.scoreTrendChart.destroy();
        if (this.competencyTrendChart) this.competencyTrendChart.destroy();
    },
    methods: {
        async loadEvaluations() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/review/history');

            // 데모 데이터
            this.evaluations = [
                {
                    id: 1,
                    type: 'quarterly',
                    title: '2024년 4분기 평가',
                    period: '2024년 10월 - 12월',
                    evaluator: '김팀장',
                    totalScore: 4.2,
                    goalAchievement: 88,
                    competencyAverage: 4.1,
                    submittedAt: '2024-12-31',
                    evaluatedAt: '2025-01-10',
                    managerFeedback: '이번 분기 동안 React 고급 패턴을 적용하여 프로젝트 성능을 크게 개선한 점이 인상적이었습니다. 특히 코드 리뷰 품질이 많이 향상되었고, 팀원들에게 좋은 피드백을 제공하고 있습니다.\n\n다만, 프로젝트 일정 관리에서 일부 지연이 있었습니다. 다음 분기에는 초기 계획 단계에서 버퍼를 충분히 고려하면 좋겠습니다.',
                    majorAchievements: '- React 고급 패턴 적용으로 렌더링 성능 30% 개선\n- 신규 대시보드 3개 개발 완료\n- 코드 리뷰 품질 향상 (팀 평균 리뷰 시간 단축)',
                    areasForImprovement: '- 프로젝트 일정 관리 개선 필요\n- Backend 역량 강화 필요\n- 기술 문서 작성 빈도 증가',
                    nextPeriodPlan: '- TypeScript 완벽 적용\n- 시스템 아키텍처 학습\n- 주니어 개발자 멘토링 강화',
                    goalDetails: [
                        {
                            id: 1,
                            title: 'Q4 신규 기능 개발 완료',
                            achievements: 'React 대시보드 3개 신규 개발 및 배포 완료',
                            achievement: 90,
                            score: 4,
                            feedback: '목표를 초과 달성했습니다. 특히 성능 최적화가 뛰어났습니다.'
                        },
                        {
                            id: 2,
                            title: 'React 전문성 향상',
                            achievements: 'React 고급 패턴 학습 및 프로젝트 적용 완료',
                            achievement: 85,
                            score: 4,
                            feedback: '실제 프로젝트에 잘 적용했습니다.'
                        },
                        {
                            id: 3,
                            title: '코드 품질 개선',
                            achievements: '코드 리뷰 품질 향상, 리팩토링 지속 수행',
                            achievement: 90,
                            score: 5,
                            feedback: '코드 리뷰 품질이 크게 향상되었습니다.'
                        }
                    ],
                    competencyDetails: [
                        {
                            id: 11,
                            name: 'Frontend 개발',
                            previousLevel: 3.5,
                            currentLevel: 4.0,
                            feedback: 'React 전문성이 크게 향상되었습니다.'
                        },
                        {
                            id: 12,
                            name: 'Backend 개발',
                            previousLevel: 2.5,
                            currentLevel: 3.0,
                            feedback: 'Node.js 학습을 통해 개선되었습니다.'
                        },
                        {
                            id: 21,
                            name: '팀 리딩',
                            previousLevel: 3.0,
                            currentLevel: 3.5,
                            feedback: '팀원 멘토링이 좋아졌습니다.'
                        },
                        {
                            id: 41,
                            name: '커뮤니케이션',
                            previousLevel: 4.0,
                            currentLevel: 4.0,
                            feedback: '지속적으로 우수합니다.'
                        }
                    ]
                },
                {
                    id: 2,
                    type: 'quarterly',
                    title: '2024년 3분기 평가',
                    period: '2024년 7월 - 9월',
                    evaluator: '김팀장',
                    totalScore: 3.8,
                    goalAchievement: 75,
                    competencyAverage: 3.7,
                    submittedAt: '2024-09-30',
                    evaluatedAt: '2024-10-10',
                    managerFeedback: '전반적으로 안정적인 성과를 보였습니다. 특히 코드 품질 개선에 많은 노력을 기울인 점이 좋았습니다.\n\n다음 분기에는 React 고급 패턴을 학습하여 프로젝트에 적용해보시길 권장합니다.',
                    majorAchievements: '- 레거시 코드 리팩토링 완료\n- 신규 기능 2개 개발\n- 팀 협업 프로세스 개선',
                    areasForImprovement: '- React 고급 패턴 학습 필요\n- 프로젝트 일정 준수율 개선',
                    nextPeriodPlan: '- React 고급 패턴 학습\n- 신규 대시보드 개발\n- 코드 리뷰 품질 향상',
                    goalDetails: [
                        {
                            id: 4,
                            title: 'Q3 신규 기능 개발',
                            achievements: '신규 기능 2개 개발 완료',
                            achievement: 75,
                            score: 4,
                            feedback: '목표를 달성했습니다.'
                        },
                        {
                            id: 5,
                            title: '코드 품질 개선',
                            achievements: '레거시 코드 리팩토링',
                            achievement: 80,
                            score: 4,
                            feedback: '코드 품질이 향상되었습니다.'
                        },
                        {
                            id: 6,
                            title: '팀 협업 개선',
                            achievements: '협업 프로세스 문서화',
                            achievement: 70,
                            score: 3,
                            feedback: '좋은 시도였습니다.'
                        }
                    ],
                    competencyDetails: [
                        {
                            id: 11,
                            name: 'Frontend 개발',
                            previousLevel: 3.0,
                            currentLevel: 3.5,
                            feedback: '지속적으로 향상되고 있습니다.'
                        },
                        {
                            id: 12,
                            name: 'Backend 개발',
                            previousLevel: 2.5,
                            currentLevel: 2.5,
                            feedback: '학습이 필요합니다.'
                        },
                        {
                            id: 21,
                            name: '팀 리딩',
                            previousLevel: 2.5,
                            currentLevel: 3.0,
                            feedback: '개선되고 있습니다.'
                        },
                        {
                            id: 41,
                            name: '커뮤니케이션',
                            previousLevel: 3.5,
                            currentLevel: 4.0,
                            feedback: '커뮤니케이션이 좋아졌습니다.'
                        }
                    ]
                },
                {
                    id: 3,
                    type: 'half-yearly',
                    title: '2024년 상반기 평가',
                    period: '2024년 1월 - 6월',
                    evaluator: '김팀장',
                    totalScore: 3.5,
                    goalAchievement: 70,
                    competencyAverage: 3.4,
                    submittedAt: '2024-06-30',
                    evaluatedAt: '2024-07-15',
                    managerFeedback: '상반기 동안 꾸준히 성장하는 모습을 보여주었습니다. Vue.js에서 React로 전환하는 과정에서 빠르게 적응했습니다.\n\n하반기에는 더 도전적인 프로젝트를 맡아보시길 권장합니다.',
                    majorAchievements: '- React 기초 학습 완료\n- Vue.js 프로젝트 3개 완료\n- 팀 온보딩 프로세스 개선',
                    areasForImprovement: '- React 고급 개념 학습\n- 프로젝트 리딩 경험 필요',
                    nextPeriodPlan: '- React 프로젝트 리딩\n- 코드 품질 개선\n- 팀 협업 강화',
                    goalDetails: [
                        {
                            id: 7,
                            title: 'React 전환',
                            achievements: 'React 기초 학습 및 소규모 프로젝트 적용',
                            achievement: 70,
                            score: 3,
                            feedback: '새로운 기술 습득이 빨랐습니다.'
                        },
                        {
                            id: 8,
                            title: '프로젝트 완료',
                            achievements: 'Vue.js 프로젝트 3개 완료',
                            achievement: 75,
                            score: 4,
                            feedback: '안정적으로 완료했습니다.'
                        },
                        {
                            id: 9,
                            title: '팀 기여',
                            achievements: '온보딩 프로세스 문서화',
                            achievement: 65,
                            score: 3,
                            feedback: '좋은 기여였습니다.'
                        }
                    ],
                    competencyDetails: [
                        {
                            id: 11,
                            name: 'Frontend 개발',
                            previousLevel: 2.5,
                            currentLevel: 3.0,
                            feedback: '기초가 탄탄합니다.'
                        },
                        {
                            id: 12,
                            name: 'Backend 개발',
                            previousLevel: 2.0,
                            currentLevel: 2.5,
                            feedback: '학습 중입니다.'
                        },
                        {
                            id: 21,
                            name: '팀 리딩',
                            previousLevel: 2.0,
                            currentLevel: 2.5,
                            feedback: '경험이 필요합니다.'
                        },
                        {
                            id: 41,
                            name: '커뮤니케이션',
                            previousLevel: 3.0,
                            currentLevel: 3.5,
                            feedback: '의사소통이 명확합니다.'
                        }
                    ]
                }
            ];
        },

        getEvaluationTypeText(type) {
            const types = {
                'quarterly': '분기 평가',
                'half-yearly': '반기 평가',
                'annual': '연간 평가'
            };
            return types[type] || type;
        },

        getEvaluationTypeBadgeClass(type) {
            const classes = {
                'quarterly': 'bg-primary',
                'half-yearly': 'bg-success',
                'annual': 'bg-danger'
            };
            return classes[type] || 'bg-secondary';
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        },

        toggleEvaluationDetail(id) {
            const index = this.expandedEvaluations.indexOf(id);
            if (index > -1) {
                this.expandedEvaluations.splice(index, 1);
            } else {
                this.expandedEvaluations.push(id);
            }
        },

        isExpanded(id) {
            return this.expandedEvaluations.includes(id);
        },

        initCharts() {
            this.initScoreTrendChart();
            this.initCompetencyTrendChart();
        },

        initScoreTrendChart() {
            const ctx = this.$refs.scoreTrendChart;
            if (!ctx) return;

            // 최근 평가들의 데이터
            const labels = this.evaluations.slice().reverse().map(e => e.title.replace('평가', ''));
            const scores = this.evaluations.slice().reverse().map(e => e.totalScore);
            const achievements = this.evaluations.slice().reverse().map(e => e.goalAchievement);

            this.scoreTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '평가 점수',
                            data: scores,
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: '목표 달성률 (%)',
                            data: achievements,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true,
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
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            max: 5,
                            title: {
                                display: true,
                                text: '평가 점수'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                drawOnChartArea: false
                            },
                            title: {
                                display: true,
                                text: '달성률 (%)'
                            }
                        }
                    }
                }
            });
        },

        initCompetencyTrendChart() {
            const ctx = this.$refs.competencyTrendChart;
            if (!ctx) return;

            // 주요 역량들의 시간별 변화 (데모)
            const labels = this.evaluations.slice().reverse().map(e => e.title.replace('평가', ''));

            this.competencyTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Frontend 개발',
                            data: [3.0, 3.5, 4.0],
                            borderColor: '#6366f1',
                            backgroundColor: 'transparent',
                            tension: 0.4
                        },
                        {
                            label: 'Backend 개발',
                            data: [2.5, 2.5, 3.0],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'transparent',
                            tension: 0.4
                        },
                        {
                            label: '팀 리딩',
                            data: [2.5, 3.0, 3.5],
                            borderColor: '#ec4899',
                            backgroundColor: 'transparent',
                            tension: 0.4
                        },
                        {
                            label: '커뮤니케이션',
                            data: [3.5, 4.0, 4.0],
                            borderColor: '#f59e0b',
                            backgroundColor: 'transparent',
                            tension: 0.4
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
                                    size: 11
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    }
};
