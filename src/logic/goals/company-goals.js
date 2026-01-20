export default {
    layout: 'default',

    data() {
        return {
            goals: [],
            filterCategory: '',
            filterStatus: '',
            searchKeyword: '',

            bscCategories: [
                { name: '재무', color: 'primary', icon: 'cash-stack' },
                { name: '고객', color: 'success', icon: 'people' },
                { name: '프로세스', color: 'warning', icon: 'gear' },
                { name: '학습과성장', color: 'info', icon: 'lightbulb' }
            ],

            isEditMode: false,
            form: {
                id: null,
                category: '',
                title: '',
                description: '',
                targetValue: 0,
                currentValue: 0,
                unit: '',
                owner: '',
                dueDate: '',
                status: '진행중'
            },

            currentGoal: null,
            progressForm: {
                currentValue: 0,
                status: '진행중'
            },

            goalModal: null,
            progressModal: null
        };
    },

    computed: {
        filteredGoals() {
            let filtered = this.goals;

            if (this.filterCategory) {
                filtered = filtered.filter(g => g.category === this.filterCategory);
            }

            if (this.filterStatus) {
                filtered = filtered.filter(g => g.status === this.filterStatus);
            }

            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                filtered = filtered.filter(g =>
                    g.title.toLowerCase().includes(keyword) ||
                    g.owner.toLowerCase().includes(keyword)
                );
            }

            return filtered;
        },

        calculatedAchievement() {
            if (!this.currentGoal || this.currentGoal.targetValue === 0) return 0;
            const achievement = Math.round((this.progressForm.currentValue / this.currentGoal.targetValue) * 100);
            return Math.min(achievement, 100);
        }
    },

    async mounted() {
        // 권한 체크
        if (!window.isExecutive()) {
            alert('임원만 접근할 수 있습니다.');
            this.navigateTo('/dashboard/employee');
            return;
        }

        await this.loadGoals();

        // 모달 초기화
        this.$nextTick(() => {
            const goalModalEl = document.getElementById('goalModal');
            const progressModalEl = document.getElementById('progressModal');

            if (goalModalEl) {
                this.goalModal = new bootstrap.Modal(goalModalEl);
            }
            if (progressModalEl) {
                this.progressModal = new bootstrap.Modal(progressModalEl);
            }
        });
    },

    methods: {
        async loadGoals() {
            try {
                // TODO: 실제 API로 전환
                const response = await fetch('/mock-api/company-goals.json');
                const data = await response.json();
                this.goals = data.goals || [];
            } catch (error) {
                console.error('목표 로딩 실패:', error);
                this.goals = this.getMockGoals();
            }
        },

        getMockGoals() {
            return [
                {
                    id: 1,
                    category: '재무',
                    title: '매출 1,000억 달성',
                    description: '신규 프로덕트 출시 및 기존 고객 확대를 통한 매출 증대',
                    targetValue: 1000,
                    currentValue: 720,
                    unit: '억원',
                    achievement: 72,
                    owner: 'CFO 김재무',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 2,
                    category: '재무',
                    title: '영업이익률 15% 달성',
                    description: '원가 절감 및 운영 효율성 향상',
                    targetValue: 15,
                    currentValue: 12,
                    unit: '%',
                    achievement: 80,
                    owner: 'CFO 김재무',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 3,
                    category: '고객',
                    title: '고객 만족도 90% 이상',
                    description: 'NPS 조사를 통한 고객 만족도 향상',
                    targetValue: 90,
                    currentValue: 85,
                    unit: '%',
                    achievement: 94,
                    owner: 'CMO 박마케팅',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 4,
                    category: '고객',
                    title: '신규 고객 500개사 확보',
                    description: 'B2B 마케팅 강화 및 영업망 확대',
                    targetValue: 500,
                    currentValue: 280,
                    unit: '개사',
                    achievement: 56,
                    owner: 'CMO 박마케팅',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 5,
                    category: '프로세스',
                    title: '불량률 1% 이하 유지',
                    description: '품질 관리 프로세스 개선',
                    targetValue: 1,
                    currentValue: 0.8,
                    unit: '%',
                    achievement: 80,
                    owner: 'COO 이운영',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 6,
                    category: '프로세스',
                    title: '생산성 20% 향상',
                    description: '자동화 도입 및 프로세스 최적화',
                    targetValue: 20,
                    currentValue: 14,
                    unit: '%',
                    achievement: 70,
                    owner: 'COO 이운영',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 7,
                    category: '학습과성장',
                    title: '임직원 교육 시간 40시간 이상',
                    description: '1인당 연간 교육 이수 시간',
                    targetValue: 40,
                    currentValue: 28,
                    unit: '시간',
                    achievement: 70,
                    owner: 'CHRO 최인사',
                    dueDate: '2024-12-31',
                    status: '진행중'
                },
                {
                    id: 8,
                    category: '학습과성장',
                    title: '핵심 인재 유지율 95% 이상',
                    description: '핵심 인재 이탈 방지 및 육성',
                    targetValue: 95,
                    currentValue: 92,
                    unit: '%',
                    achievement: 97,
                    owner: 'CHRO 최인사',
                    dueDate: '2024-12-31',
                    status: '진행중'
                }
            ];
        },

        getCategoryGoals(category) {
            return this.filteredGoals.filter(g => g.category === category);
        },

        getCategoryCount(category) {
            return this.getCategoryGoals(category).length;
        },

        getProgressClass(achievement) {
            if (achievement >= 70) return 'bg-success';
            if (achievement >= 40) return 'bg-warning';
            return 'bg-danger';
        },

        getAchievementClass(achievement) {
            if (achievement >= 70) return 'text-success fw-semibold';
            if (achievement >= 40) return 'text-warning fw-semibold';
            return 'text-danger fw-semibold';
        },

        getStatusBadgeClass(status) {
            switch (status) {
                case '완료': return 'bg-success';
                case '진행중': return 'bg-primary';
                case '지연': return 'bg-danger';
                case '보류': return 'bg-secondary';
                default: return 'bg-secondary';
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
        },

        openAddModal() {
            this.isEditMode = false;
            this.resetForm();
            this.goalModal.show();
        },

        openEditModal(goal) {
            this.isEditMode = true;
            this.form = { ...goal };
            this.goalModal.show();
        },

        resetForm() {
            this.form = {
                id: null,
                category: '',
                title: '',
                description: '',
                targetValue: 0,
                currentValue: 0,
                unit: '',
                owner: '',
                dueDate: '',
                status: '진행중'
            };
        },

        async saveGoal() {
            try {
                // 달성률 계산
                const achievement = this.form.targetValue > 0
                    ? Math.round((this.form.currentValue / this.form.targetValue) * 100)
                    : 0;

                if (this.isEditMode) {
                    // 수정
                    const index = this.goals.findIndex(g => g.id === this.form.id);
                    if (index > -1) {
                        this.goals[index] = {
                            ...this.form,
                            achievement
                        };
                    }

                    // TODO: 실제 API 호출
                    // await this.$api.put(`/api/goals/company/${this.form.id}`, this.form);
                } else {
                    // 추가
                    const newGoal = {
                        ...this.form,
                        id: Date.now(),
                        achievement
                    };
                    this.goals.push(newGoal);

                    // TODO: 실제 API 호출
                    // await this.$api.post('/api/goals/company', this.form);
                }

                this.goalModal.hide();
                this.resetForm();
            } catch (error) {
                console.error('목표 저장 실패:', error);
                alert('목표 저장에 실패했습니다.');
            }
        },

        updateProgress(goal) {
            this.currentGoal = goal;
            this.progressForm.currentValue = goal.currentValue;
            this.progressForm.status = goal.status;
            this.progressModal.show();
        },

        async saveProgress() {
            try {
                const index = this.goals.findIndex(g => g.id === this.currentGoal.id);
                if (index > -1) {
                    this.goals[index].currentValue = this.progressForm.currentValue;
                    this.goals[index].status = this.progressForm.status;
                    this.goals[index].achievement = this.calculatedAchievement;
                }

                // TODO: 실제 API 호출
                // await this.$api.patch(`/api/goals/company/${this.currentGoal.id}/progress`, this.progressForm);

                this.progressModal.hide();
                this.currentGoal = null;
            } catch (error) {
                console.error('진행 업데이트 실패:', error);
                alert('진행 업데이트에 실패했습니다.');
            }
        },

        async deleteGoal(goal) {
            if (!confirm(`'${goal.title}' 목표를 삭제하시겠습니까?`)) {
                return;
            }

            try {
                const index = this.goals.findIndex(g => g.id === goal.id);
                if (index > -1) {
                    this.goals.splice(index, 1);
                }

                // TODO: 실제 API 호출
                // await this.$api.delete(`/api/goals/company/${goal.id}`);
            } catch (error) {
                console.error('목표 삭제 실패:', error);
                alert('목표 삭제에 실패했습니다.');
            }
        }
    }
};
