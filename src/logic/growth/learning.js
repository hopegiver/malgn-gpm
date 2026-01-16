export default {
    layout: 'default',
    data() {
        return {
            learningItems: [],
            learningFilter: 'all',
            showLearningModal: false,
            showProgressModal: false,
            selectedLearningItem: null,
            learningForm: {
                id: null,
                type: 'course',
                title: '',
                provider: '',
                competencyId: null,
                totalHours: 0,
                startDate: '',
                description: '',
                url: ''
            },
            progressForm: {
                progress: 0,
                additionalHours: 0,
                note: ''
            },
            availableCompetencies: [],
            weeklyGoal: 5, // 주간 학습 목표 시간
            learningTrendChart: null
        };
    },
    computed: {
        filteredLearningItems() {
            if (this.learningFilter === 'all') {
                return this.learningItems;
            }
            return this.learningItems.filter(item => {
                if (this.learningFilter === 'in-progress') return item.status === 'in-progress';
                if (this.learningFilter === 'completed') return item.status === 'completed';
                if (this.learningFilter === 'planned') return item.status === 'planned';
                return true;
            });
        },
        totalCount() {
            return this.learningItems.length;
        },
        completedCount() {
            return this.learningItems.filter(item => item.status === 'completed').length;
        },
        inProgressCount() {
            return this.learningItems.filter(item => item.status === 'in-progress').length;
        },
        plannedCount() {
            return this.learningItems.filter(item => item.status === 'planned').length;
        },
        totalHours() {
            return this.learningItems.reduce((sum, item) => sum + (item.spentHours || 0), 0);
        },
        thisMonthHours() {
            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();

            return this.learningItems
                .filter(item => {
                    if (!item.startDate) return false;
                    const startDate = new Date(item.startDate);
                    return startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear;
                })
                .reduce((sum, item) => sum + (item.spentHours || 0), 0);
        },
        weeklyHours() {
            // 최근 7일간 학습 시간 (데모)
            return Math.round(this.thisMonthHours / 4);
        },
        avgProgress() {
            const inProgress = this.learningItems.filter(item => item.status === 'in-progress');
            if (inProgress.length === 0) return 0;
            const sum = inProgress.reduce((acc, item) => acc + item.progress, 0);
            return Math.round(sum / inProgress.length);
        }
    },
    async mounted() {
        await this.loadCompetencies();
        await this.loadLearningItems();
        this.$nextTick(() => {
            this.initCharts();
        });
    },
    beforeUnmount() {
        if (this.learningTrendChart) {
            this.learningTrendChart.destroy();
        }
    },
    methods: {
        async loadCompetencies() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/growth/competencies');

            // 데모 데이터 (my-map.js와 동일한 구조)
            const categories = [
                {
                    id: 1,
                    name: '기술 역량',
                    competencies: [
                        { id: 11, name: 'Frontend 개발' },
                        { id: 12, name: 'Backend 개발' },
                        { id: 13, name: '시스템 아키텍처' }
                    ]
                },
                {
                    id: 2,
                    name: '리더십 역량',
                    competencies: [
                        { id: 21, name: '팀 리딩' },
                        { id: 22, name: '의사결정' },
                        { id: 23, name: '멘토링' }
                    ]
                },
                {
                    id: 3,
                    name: '비즈니스 역량',
                    competencies: [
                        { id: 31, name: '비즈니스 이해도' },
                        { id: 32, name: '데이터 분석' },
                        { id: 33, name: '프로젝트 관리' }
                    ]
                },
                {
                    id: 4,
                    name: '협업 역량',
                    competencies: [
                        { id: 41, name: '커뮤니케이션' },
                        { id: 42, name: '협업 도구 활용' },
                        { id: 43, name: '갈등 해결' }
                    ]
                }
            ];

            this.availableCompetencies = categories.flatMap(cat =>
                cat.competencies.map(comp => ({
                    id: comp.id,
                    name: comp.name,
                    categoryName: cat.name
                }))
            );
        },

        async loadLearningItems() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/growth/learning');

            // 데모 데이터
            this.learningItems = [
                {
                    id: 1,
                    type: 'course',
                    title: 'React 고급 패턴 마스터하기',
                    provider: 'Udemy',
                    competencyId: 11,
                    competencyName: '기술 역량 - Frontend 개발',
                    status: 'in-progress',
                    progress: 65,
                    totalHours: 20,
                    spentHours: 13,
                    startDate: '2024-01-05',
                    description: 'Compound Components, Render Props, HOC 등 고급 패턴 학습',
                    url: 'https://www.udemy.com/course/react-advanced-patterns'
                },
                {
                    id: 2,
                    type: 'book',
                    title: '클린 아키텍처',
                    provider: '로버트 C. 마틴',
                    competencyId: 13,
                    competencyName: '기술 역량 - 시스템 아키텍처',
                    status: 'completed',
                    progress: 100,
                    totalHours: 15,
                    spentHours: 15,
                    startDate: '2024-12-10',
                    description: '소프트웨어 아키텍처의 본질과 원칙',
                    url: null
                },
                {
                    id: 3,
                    type: 'course',
                    title: 'TypeScript 완벽 가이드',
                    provider: '인프런',
                    competencyId: 11,
                    competencyName: '기술 역량 - Frontend 개발',
                    status: 'in-progress',
                    progress: 30,
                    totalHours: 12,
                    spentHours: 3.5,
                    startDate: '2024-01-15',
                    description: 'TypeScript 기초부터 고급 타입까지',
                    url: 'https://www.inflearn.com/course/typescript'
                },
                {
                    id: 4,
                    type: 'certification',
                    title: 'AWS Solutions Architect Associate',
                    provider: 'AWS',
                    competencyId: 13,
                    competencyName: '기술 역량 - 시스템 아키텍처',
                    status: 'planned',
                    progress: 0,
                    totalHours: 40,
                    spentHours: 0,
                    startDate: '2024-02-01',
                    description: 'AWS 클라우드 아키텍처 설계 자격증',
                    url: 'https://aws.amazon.com/certification'
                },
                {
                    id: 5,
                    type: 'seminar',
                    title: '애자일 코칭 워크샵',
                    provider: '사내 교육',
                    competencyId: 21,
                    competencyName: '리더십 역량 - 팀 리딩',
                    status: 'completed',
                    progress: 100,
                    totalHours: 8,
                    spentHours: 8,
                    startDate: '2024-12-20',
                    description: '애자일 방법론과 팀 코칭 실습',
                    url: null
                },
                {
                    id: 6,
                    type: 'conference',
                    title: 'FEConf 2024',
                    provider: 'FEConf',
                    competencyId: 11,
                    competencyName: '기술 역량 - Frontend 개발',
                    status: 'planned',
                    progress: 0,
                    totalHours: 8,
                    spentHours: 0,
                    startDate: '2024-10-26',
                    description: '프론트엔드 개발 컨퍼런스',
                    url: 'https://2024.feconf.kr'
                }
            ];
        },

        getLearningTypeText(type) {
            const types = {
                'course': '온라인 강의',
                'book': '도서',
                'seminar': '세미나',
                'conference': '컨퍼런스',
                'certification': '자격증',
                'project': '프로젝트',
                'other': '기타'
            };
            return types[type] || type;
        },

        getLearningTypeBadgeClass(type) {
            const classes = {
                'course': 'bg-primary',
                'book': 'bg-info',
                'seminar': 'bg-warning',
                'conference': 'bg-danger',
                'certification': 'bg-success',
                'project': 'bg-secondary',
                'other': 'bg-dark'
            };
            return classes[type] || 'bg-secondary';
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        },

        openAddLearningModal() {
            this.learningForm = {
                id: null,
                type: 'course',
                title: '',
                provider: '',
                competencyId: null,
                totalHours: 0,
                startDate: '',
                description: '',
                url: ''
            };
            this.showLearningModal = true;
        },

        closeLearningModal() {
            this.showLearningModal = false;
        },

        async saveLearning() {
            if (!this.learningForm.title) {
                alert('학습 제목을 입력해주세요.');
                return;
            }

            const competency = this.availableCompetencies.find(c => c.id === this.learningForm.competencyId);

            if (this.learningForm.id) {
                // 수정
                const item = this.learningItems.find(i => i.id === this.learningForm.id);
                if (item) {
                    Object.assign(item, {
                        type: this.learningForm.type,
                        title: this.learningForm.title,
                        provider: this.learningForm.provider,
                        competencyId: this.learningForm.competencyId,
                        competencyName: competency ? `${competency.categoryName} - ${competency.name}` : null,
                        totalHours: this.learningForm.totalHours,
                        startDate: this.learningForm.startDate,
                        description: this.learningForm.description,
                        url: this.learningForm.url
                    });
                }
            } else {
                // 추가
                this.learningItems.unshift({
                    id: Date.now(),
                    type: this.learningForm.type,
                    title: this.learningForm.title,
                    provider: this.learningForm.provider,
                    competencyId: this.learningForm.competencyId,
                    competencyName: competency ? `${competency.categoryName} - ${competency.name}` : null,
                    status: 'planned',
                    progress: 0,
                    totalHours: this.learningForm.totalHours,
                    spentHours: 0,
                    startDate: this.learningForm.startDate,
                    description: this.learningForm.description,
                    url: this.learningForm.url
                });
            }

            // TODO: 실제 API 호출로 대체
            // await this.$api.post('/api/growth/learning', this.learningForm);

            this.closeLearningModal();
        },

        editLearning(id) {
            const item = this.learningItems.find(i => i.id === id);
            if (item) {
                this.learningForm = {
                    id: item.id,
                    type: item.type,
                    title: item.title,
                    provider: item.provider,
                    competencyId: item.competencyId,
                    totalHours: item.totalHours,
                    startDate: item.startDate,
                    description: item.description,
                    url: item.url
                };
                this.showLearningModal = true;
            }
        },

        async deleteLearning(id) {
            if (confirm('이 학습을 삭제하시겠습니까?')) {
                const index = this.learningItems.findIndex(i => i.id === id);
                if (index > -1) {
                    this.learningItems.splice(index, 1);
                }

                // TODO: 실제 API 호출로 대체
                // await this.$api.delete('/api/growth/learning/' + id);
            }
        },

        startLearning(id) {
            const item = this.learningItems.find(i => i.id === id);
            if (item) {
                item.status = 'in-progress';
                item.startDate = new Date().toISOString().split('T')[0];

                // TODO: 실제 API 호출로 대체
                // await this.$api.put('/api/growth/learning/' + id, { status: 'in-progress' });
            }
        },

        updateProgress(id) {
            const item = this.learningItems.find(i => i.id === id);
            if (item) {
                this.selectedLearningItem = item;
                this.progressForm = {
                    progress: item.progress,
                    additionalHours: 0,
                    note: ''
                };
                this.showProgressModal = true;
            }
        },

        closeProgressModal() {
            this.showProgressModal = false;
            this.selectedLearningItem = null;
        },

        async saveProgress() {
            if (this.selectedLearningItem) {
                this.selectedLearningItem.progress = this.progressForm.progress;
                this.selectedLearningItem.spentHours += this.progressForm.additionalHours;

                // TODO: 실제 API 호출로 대체
                // await this.$api.put('/api/growth/learning/' + this.selectedLearningItem.id + '/progress', {
                //     progress: this.progressForm.progress,
                //     additionalHours: this.progressForm.additionalHours,
                //     note: this.progressForm.note
                // });

                this.closeProgressModal();
            }
        },

        async completeLearning(id) {
            if (confirm('이 학습을 완료 처리하시겠습니까?')) {
                const item = this.learningItems.find(i => i.id === id);
                if (item) {
                    item.status = 'completed';
                    item.progress = 100;
                    if (item.totalHours && item.spentHours < item.totalHours) {
                        item.spentHours = item.totalHours;
                    }

                    // TODO: 실제 API 호출로 대체
                    // await this.$api.put('/api/growth/learning/' + id, { status: 'completed' });
                }
            }
        },

        openUrl(url) {
            if (url) {
                window.open(url, '_blank');
            }
        },

        initCharts() {
            this.initLearningTrendChart();
        },

        initLearningTrendChart() {
            const ctx = this.$refs.learningTrendChart;
            if (!ctx) return;

            // 최근 6개월 데이터 생성
            const months = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push(`${d.getMonth() + 1}월`);
            }

            // 데모 데이터
            const learningHours = [4, 6, 8, 10, 12, 13];
            const goalHours = Array(6).fill(this.weeklyGoal * 4); // 주간 목표 * 4주

            this.learningTrendChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: '학습 시간',
                            data: learningHours,
                            backgroundColor: '#6366f1',
                            borderRadius: 6
                        },
                        {
                            label: '목표 시간',
                            data: goalHours,
                            type: 'line',
                            borderColor: '#10b981',
                            backgroundColor: 'transparent',
                            borderDash: [5, 5],
                            pointRadius: 0,
                            tension: 0
                        }
                    ]
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
        }
    }
};
