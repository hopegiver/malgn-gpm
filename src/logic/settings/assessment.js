export default {
    layout: 'default',
    data() {
        return {
            stats: {
                totalCategories: 6,
                totalQuestions: 78,
                monthlyCompleted: 142,
                avgCompletionRate: 87
            },
            categories: [],
            questions: [],
            currentCategory: null,
            showCategoryModal: false,
            showQuestionModal: false,
            categoryForm: {
                id: null,
                name: '',
                description: '',
                icon: 'bi bi-code-square',
                color: '#6366f1',
                active: true
            },
            completionTrendChart: null,
            categoryDistributionChart: null
        };
    },
    async mounted() {
        // 역할에 따른 접근 권한 체크
        const user = window.getCurrentUser();
        if (user) {
            // 일반 직원은 접근 불가
            if (!user.roles || (!user.roles.includes(window.ROLES.CEO) &&
                                !user.roles.includes(window.ROLES.EXECUTIVE) &&
                                !user.roles.includes(window.ROLES.DEPT_HEAD) &&
                                !user.roles.includes(window.ROLES.HR))) {
                window.location.hash = '#/dashboard/employee';
                return;
            }
        }

        // 데이터 로드
        await this.loadAssessmentData();

        // 차트 초기화
        this.$nextTick(() => {
            this.initCompletionTrendChart();
            this.initCategoryDistributionChart();
        });
    },
    beforeUnmount() {
        // 차트 정리
        if (this.completionTrendChart) {
            this.completionTrendChart.destroy();
        }
        if (this.categoryDistributionChart) {
            this.categoryDistributionChart.destroy();
        }
    },
    methods: {
        async loadAssessmentData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/settings/assessment');

            // 임시 데모 데이터
            this.categories = [
                {
                    id: 1,
                    name: '기술 역량',
                    description: '직무 수행에 필요한 전문 기술 및 지식',
                    icon: 'bi bi-code-square',
                    color: '#6366f1',
                    questionCount: 15,
                    active: true,
                    completedCount: 128
                },
                {
                    id: 2,
                    name: '문제 해결',
                    description: '복잡한 문제를 분석하고 해결하는 능력',
                    icon: 'bi bi-puzzle',
                    color: '#10b981',
                    questionCount: 12,
                    active: true,
                    completedCount: 115
                },
                {
                    id: 3,
                    name: '커뮤니케이션',
                    description: '효과적인 의사소통 및 협업 능력',
                    icon: 'bi bi-chat-dots',
                    color: '#f59e0b',
                    questionCount: 10,
                    active: true,
                    completedCount: 142
                },
                {
                    id: 4,
                    name: '리더십',
                    description: '팀을 이끌고 동기부여하는 능력',
                    icon: 'bi bi-people',
                    color: '#8b5cf6',
                    questionCount: 14,
                    active: true,
                    completedCount: 98
                },
                {
                    id: 5,
                    name: '시간 관리',
                    description: '업무 우선순위 설정 및 효율적 시간 활용',
                    icon: 'bi bi-clock',
                    color: '#ec4899',
                    questionCount: 8,
                    active: false,
                    completedCount: 67
                },
                {
                    id: 6,
                    name: '창의성',
                    description: '새로운 아이디어 창출 및 혁신 역량',
                    icon: 'bi bi-lightbulb',
                    color: '#3b82f6',
                    questionCount: 11,
                    active: true,
                    completedCount: 89
                }
            ];
        },

        initCompletionTrendChart() {
            const ctx = this.$refs.completionTrendChart;
            if (!ctx) return;

            this.completionTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                    datasets: [{
                        label: '월별 진단 완료',
                        data: [95, 108, 122, 135, 128, 142],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
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
                                    return context.parsed.y + '건 완료';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '건';
                                }
                            }
                        }
                    }
                }
            });
        },

        initCategoryDistributionChart() {
            const ctx = this.$refs.categoryDistributionChart;
            if (!ctx) return;

            const activeCategories = this.categories.filter(c => c.active);

            this.categoryDistributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: activeCategories.map(c => c.name),
                    datasets: [{
                        data: activeCategories.map(c => c.completedCount),
                        backgroundColor: activeCategories.map(c => c.color),
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
                                padding: 15,
                                font: {
                                    size: 11,
                                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", Roboto'
                                },
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    return data.labels.map((label, i) => ({
                                        text: label + ' (' + data.datasets[0].data[i] + ')',
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    }));
                                }
                            }
                        }
                    }
                }
            });
        },

        openAddCategoryModal() {
            this.categoryForm = {
                id: null,
                name: '',
                description: '',
                icon: 'bi bi-code-square',
                color: '#6366f1',
                active: true
            };
            this.showCategoryModal = true;
        },

        editCategory(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            if (category) {
                this.categoryForm = {
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    icon: category.icon,
                    color: category.color,
                    active: category.active
                };
                this.showCategoryModal = true;
            }
        },

        closeCategoryModal() {
            this.showCategoryModal = false;
            this.categoryForm = {
                id: null,
                name: '',
                description: '',
                icon: 'bi bi-code-square',
                color: '#6366f1',
                active: true
            };
        },

        async saveCategory() {
            // 유효성 검사
            if (!this.categoryForm.name.trim()) {
                alert('카테고리명을 입력해주세요.');
                return;
            }

            // TODO: 실제 API 호출로 대체
            // if (this.categoryForm.id) {
            //     await this.$api.put(`/api/settings/assessment/categories/${this.categoryForm.id}`, this.categoryForm);
            // } else {
            //     await this.$api.post('/api/settings/assessment/categories', this.categoryForm);
            // }

            if (this.categoryForm.id) {
                // 수정
                const index = this.categories.findIndex(c => c.id === this.categoryForm.id);
                if (index > -1) {
                    this.categories[index] = {
                        ...this.categories[index],
                        name: this.categoryForm.name,
                        description: this.categoryForm.description,
                        icon: this.categoryForm.icon,
                        color: this.categoryForm.color,
                        active: this.categoryForm.active
                    };
                }
            } else {
                // 추가
                const newCategory = {
                    id: Math.max(...this.categories.map(c => c.id)) + 1,
                    name: this.categoryForm.name,
                    description: this.categoryForm.description,
                    icon: this.categoryForm.icon,
                    color: this.categoryForm.color,
                    active: this.categoryForm.active,
                    questionCount: 0,
                    completedCount: 0
                };
                this.categories.push(newCategory);
                this.stats.totalCategories++;
            }

            // 차트 업데이트
            this.$nextTick(() => {
                if (this.categoryDistributionChart) {
                    this.categoryDistributionChart.destroy();
                }
                this.initCategoryDistributionChart();
            });

            this.closeCategoryModal();
        },

        async deleteCategory(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            if (!category) return;

            if (!confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?\n해당 카테고리의 모든 질문도 함께 삭제됩니다.`)) {
                return;
            }

            // TODO: 실제 API 호출로 대체
            // await this.$api.delete(`/api/settings/assessment/categories/${categoryId}`);

            const index = this.categories.findIndex(c => c.id === categoryId);
            if (index > -1) {
                this.stats.totalQuestions -= this.categories[index].questionCount;
                this.categories.splice(index, 1);
                this.stats.totalCategories--;
            }

            // 차트 업데이트
            this.$nextTick(() => {
                if (this.categoryDistributionChart) {
                    this.categoryDistributionChart.destroy();
                }
                this.initCategoryDistributionChart();
            });
        },

        async toggleCategoryActive(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            if (category) {
                category.active = !category.active;

                // TODO: 실제 API 호출로 대체
                // await this.$api.patch(`/api/settings/assessment/categories/${categoryId}`, { active: category.active });

                // 차트 업데이트
                this.$nextTick(() => {
                    if (this.categoryDistributionChart) {
                        this.categoryDistributionChart.destroy();
                    }
                    this.initCategoryDistributionChart();
                });
            }
        },

        async manageQuestions(categoryId) {
            this.currentCategory = this.categories.find(c => c.id === categoryId);
            if (!this.currentCategory) return;

            // TODO: 실제 API 호출로 대체
            // this.questions = await this.$api.get(`/api/settings/assessment/categories/${categoryId}/questions`);

            // 임시 데모 데이터
            this.questions = [
                {
                    id: 1,
                    text: '업무 수행에 필요한 기술적 지식을 충분히 보유하고 있습니까?',
                    answerType: 'scale'
                },
                {
                    id: 2,
                    text: '새로운 기술을 학습하고 적용하는 능력이 있습니까?',
                    answerType: 'scale'
                },
                {
                    id: 3,
                    text: '복잡한 기술 문제를 독립적으로 해결할 수 있습니까?',
                    answerType: 'scale'
                }
            ];

            this.showQuestionModal = true;
        },

        closeQuestionModal() {
            this.showQuestionModal = false;
            this.currentCategory = null;
            this.questions = [];
        },

        addQuestion() {
            // TODO: 질문 추가 기능 구현
            const newQuestion = {
                id: this.questions.length > 0 ? Math.max(...this.questions.map(q => q.id)) + 1 : 1,
                text: '새로운 질문을 입력하세요',
                answerType: 'scale'
            };
            this.questions.push(newQuestion);

            if (this.currentCategory) {
                this.currentCategory.questionCount++;
                this.stats.totalQuestions++;
            }
        },

        editQuestion(questionId) {
            // TODO: 질문 수정 모달 또는 인라인 편집 구현
            const question = this.questions.find(q => q.id === questionId);
            if (question) {
                const newText = prompt('질문 내용을 수정하세요:', question.text);
                if (newText && newText.trim()) {
                    question.text = newText.trim();
                    // TODO: API 호출
                }
            }
        },

        async deleteQuestion(questionId) {
            if (!confirm('이 질문을 삭제하시겠습니까?')) {
                return;
            }

            // TODO: 실제 API 호출로 대체
            // await this.$api.delete(`/api/settings/assessment/questions/${questionId}`);

            const index = this.questions.findIndex(q => q.id === questionId);
            if (index > -1) {
                this.questions.splice(index, 1);
                if (this.currentCategory) {
                    this.currentCategory.questionCount--;
                    this.stats.totalQuestions--;
                }
            }
        }
    }
};
