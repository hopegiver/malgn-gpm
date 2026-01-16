export default {
    layout: 'employee',
    data() {
        return {
            competencyCategories: [],
            newActionPlan: {},
            showLevelModal: false,
            selectedCategory: null,
            selectedCompetency: null,
            levelUpdateForm: {
                current: 1,
                target: 1,
                reason: ''
            },
            radarChart: null,
            trendChart: null
        };
    },
    computed: {
        overallAverage() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return 0;
            const sum = allCompetencies.reduce((acc, c) => acc + c.current, 0);
            return (sum / allCompetencies.length).toFixed(1);
        },
        goalAchievementRate() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return 0;
            const achieved = allCompetencies.filter(c => c.current >= c.target).length;
            return Math.round((achieved / allCompetencies.length) * 100);
        },
        achievedCompetencies() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            return allCompetencies.filter(c => c.current >= c.target).length;
        },
        totalCompetencies() {
            return this.competencyCategories.flatMap(c => c.competencies).length;
        },
        topGrowthCompetency() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return '-';
            const sorted = [...allCompetencies].sort((a, b) => b.growth - a.growth);
            return sorted[0]?.name || '-';
        },
        topGrowthValue() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return 0;
            const sorted = [...allCompetencies].sort((a, b) => b.growth - a.growth);
            return sorted[0]?.growth?.toFixed(1) || 0;
        },
        weakestCompetency() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return '-';
            const sorted = [...allCompetencies].sort((a, b) => a.current - b.current);
            return sorted[0]?.name || '-';
        },
        weakestValue() {
            const allCompetencies = this.competencyCategories.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return 0;
            const sorted = [...allCompetencies].sort((a, b) => a.current - b.current);
            return sorted[0]?.current || 0;
        }
    },
    async mounted() {
        await this.loadCompetencies();
        this.$nextTick(() => {
            this.initCharts();
        });
    },
    beforeUnmount() {
        if (this.radarChart) this.radarChart.destroy();
        if (this.trendChart) this.trendChart.destroy();
    },
    methods: {
        async loadCompetencies() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/growth/competencies');

            // 데모 데이터
            this.competencyCategories = [
                {
                    id: 1,
                    name: '기술 역량 (Technical Skills)',
                    icon: 'bi bi-code-square',
                    color: '#6366f1',
                    average: 3.5,
                    competencies: [
                        {
                            id: 11,
                            name: 'Frontend 개발',
                            description: 'React, Vue.js 등 프론트엔드 프레임워크 활용 능력',
                            current: 4.0,
                            target: 4.5,
                            growth: 0.5,
                            showAddForm: false,
                            actionPlans: [
                                { action: 'React 고급 패턴 학습 (Compound Components, Render Props)', completed: true },
                                { action: 'TypeScript 프로젝트 적용 및 실습', completed: false },
                                { action: '성능 최적화 기법 학습 (메모이제이션, 지연 로딩)', completed: false }
                            ]
                        },
                        {
                            id: 12,
                            name: 'Backend 개발',
                            description: 'Node.js, Python 등 백엔드 개발 능력',
                            current: 3.0,
                            target: 4.0,
                            growth: 0.3,
                            showAddForm: false,
                            actionPlans: [
                                { action: 'RESTful API 설계 베스트 프랙티스 학습', completed: true },
                                { action: 'DB 쿼리 최적화 실습', completed: false }
                            ]
                        },
                        {
                            id: 13,
                            name: '시스템 아키텍처',
                            description: '확장 가능한 시스템 설계 및 아키텍처 능력',
                            current: 3.5,
                            target: 4.0,
                            growth: 0.8,
                            showAddForm: false,
                            actionPlans: [
                                { action: '마이크로서비스 아키텍처 패턴 스터디', completed: false }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    name: '리더십 역량 (Leadership)',
                    icon: 'bi bi-people',
                    color: '#8b5cf6',
                    average: 3.2,
                    competencies: [
                        {
                            id: 21,
                            name: '팀 리딩',
                            description: '팀원 관리, 동기부여, 목표 설정 능력',
                            current: 3.0,
                            target: 4.0,
                            growth: 0.5,
                            showAddForm: false,
                            actionPlans: [
                                { action: '주간 1on1 미팅 진행', completed: true },
                                { action: '팀 회고 퍼실리테이션 연습', completed: false }
                            ]
                        },
                        {
                            id: 22,
                            name: '의사결정',
                            description: '데이터 기반 의사결정 및 판단력',
                            current: 3.5,
                            target: 4.0,
                            growth: 0.2,
                            showAddForm: false,
                            actionPlans: []
                        },
                        {
                            id: 23,
                            name: '멘토링',
                            description: '주니어 개발자 육성 및 코칭',
                            current: 3.0,
                            target: 4.0,
                            growth: 0.4,
                            showAddForm: false,
                            actionPlans: [
                                { action: '코드 리뷰 피드백 품질 개선', completed: false }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    name: '비즈니스 역량 (Business Acumen)',
                    icon: 'bi bi-briefcase',
                    color: '#ec4899',
                    average: 2.8,
                    competencies: [
                        {
                            id: 31,
                            name: '비즈니스 이해도',
                            description: '회사 비즈니스 모델 및 산업 이해',
                            current: 3.0,
                            target: 4.0,
                            growth: 0.5,
                            showAddForm: false,
                            actionPlans: [
                                { action: '경쟁사 서비스 분석 및 벤치마킹', completed: false }
                            ]
                        },
                        {
                            id: 32,
                            name: '데이터 분석',
                            description: '비즈니스 데이터 분석 및 인사이트 도출',
                            current: 2.5,
                            target: 3.5,
                            growth: 0.3,
                            showAddForm: false,
                            actionPlans: []
                        },
                        {
                            id: 33,
                            name: '프로젝트 관리',
                            description: '일정, 리소스, 위험 관리 능력',
                            current: 3.0,
                            target: 4.0,
                            growth: 0.4,
                            showAddForm: false,
                            actionPlans: [
                                { action: 'Agile/Scrum 방법론 심화 학습', completed: false }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    name: '협업 역량 (Collaboration)',
                    icon: 'bi bi-chat-dots',
                    color: '#f59e0b',
                    average: 3.8,
                    competencies: [
                        {
                            id: 41,
                            name: '커뮤니케이션',
                            description: '명확하고 효과적인 의사소통 능력',
                            current: 4.0,
                            target: 4.5,
                            growth: 0.5,
                            showAddForm: false,
                            actionPlans: [
                                { action: '기술 문서 작성 품질 개선', completed: true }
                            ]
                        },
                        {
                            id: 42,
                            name: '협업 도구 활용',
                            description: 'Jira, Confluence, Slack 등 협업 도구 능숙도',
                            current: 4.0,
                            target: 4.0,
                            growth: 0.2,
                            showAddForm: false,
                            actionPlans: []
                        },
                        {
                            id: 43,
                            name: '갈등 해결',
                            description: '팀 내 갈등 중재 및 해결 능력',
                            current: 3.5,
                            target: 4.0,
                            growth: 0.3,
                            showAddForm: false,
                            actionPlans: []
                        }
                    ]
                }
            ];

            // 각 카테고리의 평균 계산
            this.competencyCategories.forEach(category => {
                const sum = category.competencies.reduce((acc, c) => acc + c.current, 0);
                category.average = (sum / category.competencies.length).toFixed(1);
            });
        },

        toggleActionPlan(categoryId, competencyId, planIndex) {
            const category = this.competencyCategories.find(c => c.id === categoryId);
            const competency = category?.competencies.find(c => c.id === competencyId);
            if (competency && competency.actionPlans[planIndex]) {
                competency.actionPlans[planIndex].completed = !competency.actionPlans[planIndex].completed;

                // TODO: 실제 API 호출로 대체
                // await this.$api.put('/api/growth/action-plans', { ... });
            }
        },

        addActionPlan(categoryId, competencyId) {
            const category = this.competencyCategories.find(c => c.id === categoryId);
            const competency = category?.competencies.find(c => c.id === competencyId);

            if (competency && this.newActionPlan[competencyId]) {
                if (!competency.actionPlans) {
                    competency.actionPlans = [];
                }
                competency.actionPlans.push({
                    action: this.newActionPlan[competencyId],
                    completed: false
                });

                // TODO: 실제 API 호출로 대체
                // await this.$api.post('/api/growth/action-plans', { ... });

                this.newActionPlan[competencyId] = '';
                competency.showAddForm = false;
            }
        },

        openLevelUpdateModal(categoryId, competencyId) {
            const category = this.competencyCategories.find(c => c.id === categoryId);
            const competency = category?.competencies.find(c => c.id === competencyId);

            if (competency) {
                this.selectedCategory = category;
                this.selectedCompetency = competency;
                this.levelUpdateForm.current = competency.current;
                this.levelUpdateForm.target = competency.target;
                this.levelUpdateForm.reason = '';
                this.showLevelModal = true;
            }
        },

        closeLevelModal() {
            this.showLevelModal = false;
            this.selectedCategory = null;
            this.selectedCompetency = null;
        },

        async updateCompetencyLevel() {
            if (this.selectedCompetency) {
                this.selectedCompetency.current = this.levelUpdateForm.current;
                this.selectedCompetency.target = this.levelUpdateForm.target;

                // TODO: 실제 API 호출로 대체
                // await this.$api.put('/api/growth/competencies', {
                //     id: this.selectedCompetency.id,
                //     current: this.levelUpdateForm.current,
                //     target: this.levelUpdateForm.target,
                //     reason: this.levelUpdateForm.reason
                // });

                // 카테고리 평균 재계산
                const sum = this.selectedCategory.competencies.reduce((acc, c) => acc + c.current, 0);
                this.selectedCategory.average = (sum / this.selectedCategory.competencies.length).toFixed(1);

                // 차트 업데이트
                this.$nextTick(() => {
                    this.updateCharts();
                });

                alert('역량 레벨이 업데이트되었습니다.');
                this.closeLevelModal();
            }
        },

        initCharts() {
            this.initRadarChart();
            this.initTrendChart();
        },

        updateCharts() {
            if (this.radarChart) {
                this.radarChart.destroy();
                this.initRadarChart();
            }
            if (this.trendChart) {
                this.trendChart.destroy();
                this.initTrendChart();
            }
        },

        initRadarChart() {
            const ctx = this.$refs.radarChart;
            if (!ctx) return;

            // 각 역량의 평균값 계산
            const labels = this.competencyCategories.map(c => c.name.split('(')[0].trim());
            const currentData = this.competencyCategories.map(c => parseFloat(c.average));
            const targetData = this.competencyCategories.map(c => {
                const sum = c.competencies.reduce((acc, comp) => acc + comp.target, 0);
                return sum / c.competencies.length;
            });

            this.radarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '현재 레벨',
                            data: currentData,
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            pointBackgroundColor: '#6366f1',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#6366f1'
                        },
                        {
                            label: '목표 레벨',
                            data: targetData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#10b981',
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        initTrendChart() {
            const ctx = this.$refs.trendChart;
            if (!ctx) return;

            // 데모 데이터: 최근 6개월 추이
            const months = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push(`${d.getMonth() + 1}월`);
            }

            this.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: this.competencyCategories.map(category => ({
                        label: category.name.split('(')[0].trim(),
                        data: this.generateTrendData(parseFloat(category.average)),
                        borderColor: category.color,
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
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
                    }
                }
            });
        },

        generateTrendData(currentValue) {
            // 현재 값에서 역으로 추세 데이터 생성 (데모용)
            const data = [];
            let value = currentValue - 0.5;
            for (let i = 0; i < 6; i++) {
                data.push(Math.max(1, Math.min(5, value)));
                value += Math.random() * 0.2;
            }
            return data;
        }
    }
};
