export default {
    layout: 'default',
    data() {
        return {
            evaluation: {
                type: 'quarterly',
                year: new Date().getFullYear(),
                period: this.getCurrentPeriod('quarterly'),
                status: 'new', // 'new', 'draft', 'submitted'
                majorAchievements: '',
                areasForImprovement: '',
                nextPeriodPlan: '',
                supportNeeded: '',
                savedAt: null,
                submittedAt: null
            },
            goalEvaluations: [],
            competencyEvaluations: [],
            availableYears: []
        };
    },
    computed: {
        availablePeriods() {
            if (this.evaluation.type === 'quarterly') {
                return [
                    { value: 'Q1', label: '1분기 (1-3월)' },
                    { value: 'Q2', label: '2분기 (4-6월)' },
                    { value: 'Q3', label: '3분기 (7-9월)' },
                    { value: 'Q4', label: '4분기 (10-12월)' }
                ];
            } else if (this.evaluation.type === 'half-yearly') {
                return [
                    { value: 'H1', label: '상반기 (1-6월)' },
                    { value: 'H2', label: '하반기 (7-12월)' }
                ];
            } else {
                return [
                    { value: 'Y', label: '연간' }
                ];
            }
        },
        averageGoalAchievement() {
            if (this.goalEvaluations.length === 0) return 0;
            const sum = this.goalEvaluations.reduce((acc, g) => acc + g.achievement, 0);
            return Math.round(sum / this.goalEvaluations.length);
        },
        averageCompetencyScore() {
            const allCompetencies = this.competencyEvaluations.flatMap(c => c.competencies);
            if (allCompetencies.length === 0) return 0;
            const sum = allCompetencies.reduce((acc, c) => acc + c.currentLevel, 0);
            return (sum / allCompetencies.length).toFixed(1);
        }
    },
    mounted() {
        this.initAvailableYears();
        this.loadEvaluationData();
    },
    methods: {
        initAvailableYears() {
            const currentYear = new Date().getFullYear();
            this.availableYears = [currentYear - 1, currentYear, currentYear + 1];
        },

        getCurrentPeriod(type) {
            const month = new Date().getMonth() + 1;
            if (type === 'quarterly') {
                if (month <= 3) return 'Q1';
                if (month <= 6) return 'Q2';
                if (month <= 9) return 'Q3';
                return 'Q4';
            } else if (type === 'half-yearly') {
                return month <= 6 ? 'H1' : 'H2';
            }
            return 'Y';
        },

        onEvaluationTypeChange() {
            this.evaluation.period = this.getCurrentPeriod(this.evaluation.type);
            this.loadEvaluationData();
        },

        async loadEvaluationData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/review/self', {
            //     type: this.evaluation.type,
            //     year: this.evaluation.year,
            //     period: this.evaluation.period
            // });

            // 기존 평가 데이터 로드 시도
            const existingEvaluation = this.loadExistingEvaluation();

            if (existingEvaluation) {
                // 기존 평가가 있으면 로드
                Object.assign(this.evaluation, existingEvaluation);
                this.goalEvaluations = existingEvaluation.goalEvaluations;
                this.competencyEvaluations = existingEvaluation.competencyEvaluations;
            } else {
                // 새 평가 생성
                this.evaluation.status = 'new';
                this.evaluation.majorAchievements = '';
                this.evaluation.areasForImprovement = '';
                this.evaluation.nextPeriodPlan = '';
                this.evaluation.supportNeeded = '';
                this.evaluation.savedAt = null;
                this.evaluation.submittedAt = null;

                await this.loadGoalsForPeriod();
                await this.loadCompetencies();
            }
        },

        loadExistingEvaluation() {
            // TODO: 실제 API 호출로 대체
            // 데모: 현재 분기의 평가만 draft로 가정
            const currentYear = new Date().getFullYear();
            const currentPeriod = this.getCurrentPeriod('quarterly');

            if (this.evaluation.year === currentYear &&
                this.evaluation.period === currentPeriod &&
                this.evaluation.type === 'quarterly') {
                // 데모 데이터 반환 (작성 중인 평가)
                return null; // 일단 null로 반환하여 새로 생성하도록
            }

            return null;
        },

        async loadGoalsForPeriod() {
            // TODO: 실제 API 호출로 대체
            // const goals = await this.$api.get('/api/goals/period', {
            //     year: this.evaluation.year,
            //     period: this.evaluation.period
            // });

            // 데모 데이터
            this.goalEvaluations = [
                {
                    goalId: 1,
                    goalTitle: 'Q1 신규 기능 개발 완료',
                    goalDescription: 'React 기반 대시보드 3개 신규 개발',
                    achievement: 85,
                    score: 4,
                    achievements: '',
                    challenges: ''
                },
                {
                    goalId: 2,
                    goalTitle: 'React 전문성 향상',
                    goalDescription: '고급 패턴 학습 및 프로젝트 적용',
                    achievement: 70,
                    score: 3,
                    achievements: '',
                    challenges: ''
                },
                {
                    goalId: 3,
                    goalTitle: '코드 품질 개선',
                    goalDescription: '코드 리뷰 품질 향상 및 리팩토링',
                    achievement: 90,
                    score: 4,
                    achievements: '',
                    challenges: ''
                }
            ];
        },

        async loadCompetencies() {
            // TODO: 실제 API 호출로 대체
            // const competencies = await this.$api.get('/api/growth/competencies');

            // 데모 데이터
            this.competencyEvaluations = [
                {
                    id: 1,
                    name: '기술 역량',
                    icon: 'bi bi-code-square',
                    color: '#6366f1',
                    competencies: [
                        {
                            id: 11,
                            name: 'Frontend 개발',
                            description: 'React, Vue.js 등 프론트엔드 프레임워크 활용',
                            currentLevel: 4,
                            evidence: ''
                        },
                        {
                            id: 12,
                            name: 'Backend 개발',
                            description: 'Node.js, Python 등 백엔드 개발',
                            currentLevel: 3,
                            evidence: ''
                        },
                        {
                            id: 13,
                            name: '시스템 아키텍처',
                            description: '확장 가능한 시스템 설계',
                            currentLevel: 3,
                            evidence: ''
                        }
                    ]
                },
                {
                    id: 2,
                    name: '리더십 역량',
                    icon: 'bi bi-people',
                    color: '#8b5cf6',
                    competencies: [
                        {
                            id: 21,
                            name: '팀 리딩',
                            description: '팀원 관리 및 동기부여',
                            currentLevel: 3,
                            evidence: ''
                        },
                        {
                            id: 22,
                            name: '의사결정',
                            description: '데이터 기반 의사결정',
                            currentLevel: 3,
                            evidence: ''
                        },
                        {
                            id: 23,
                            name: '멘토링',
                            description: '주니어 개발자 육성',
                            currentLevel: 3,
                            evidence: ''
                        }
                    ]
                },
                {
                    id: 3,
                    name: '비즈니스 역량',
                    icon: 'bi bi-briefcase',
                    color: '#ec4899',
                    competencies: [
                        {
                            id: 31,
                            name: '비즈니스 이해도',
                            description: '비즈니스 모델 및 산업 이해',
                            currentLevel: 3,
                            evidence: ''
                        },
                        {
                            id: 32,
                            name: '데이터 분석',
                            description: '데이터 분석 및 인사이트 도출',
                            currentLevel: 2,
                            evidence: ''
                        },
                        {
                            id: 33,
                            name: '프로젝트 관리',
                            description: '일정 및 리소스 관리',
                            currentLevel: 3,
                            evidence: ''
                        }
                    ]
                },
                {
                    id: 4,
                    name: '협업 역량',
                    icon: 'bi bi-chat-dots',
                    color: '#f59e0b',
                    competencies: [
                        {
                            id: 41,
                            name: '커뮤니케이션',
                            description: '명확한 의사소통',
                            currentLevel: 4,
                            evidence: ''
                        },
                        {
                            id: 42,
                            name: '협업 도구 활용',
                            description: 'Jira, Confluence 등 활용',
                            currentLevel: 4,
                            evidence: ''
                        },
                        {
                            id: 43,
                            name: '갈등 해결',
                            description: '갈등 중재 및 해결',
                            currentLevel: 3,
                            evidence: ''
                        }
                    ]
                }
            ];
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        },

        async saveDraft() {
            // 필수 입력 검증
            if (!this.validateEvaluation(false)) {
                return;
            }

            this.evaluation.status = 'draft';
            this.evaluation.savedAt = new Date().toISOString();

            // TODO: 실제 API 호출로 대체
            // await this.$api.post('/api/review/self/draft', {
            //     evaluation: this.evaluation,
            //     goalEvaluations: this.goalEvaluations,
            //     competencyEvaluations: this.competencyEvaluations
            // });

            alert('평가가 임시 저장되었습니다.');
        },

        async submitEvaluation() {
            // 필수 입력 검증
            if (!this.validateEvaluation(true)) {
                return;
            }

            if (!confirm('평가를 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')) {
                return;
            }

            this.evaluation.status = 'submitted';
            this.evaluation.submittedAt = new Date().toISOString();

            // TODO: 실제 API 호출로 대체
            // await this.$api.post('/api/review/self/submit', {
            //     evaluation: this.evaluation,
            //     goalEvaluations: this.goalEvaluations,
            //     competencyEvaluations: this.competencyEvaluations
            // });

            alert('평가가 제출되었습니다.');
        },

        validateEvaluation(isSubmit) {
            // 목표 평가 검증
            if (this.goalEvaluations.length > 0) {
                const incompleteGoals = this.goalEvaluations.filter(g =>
                    !g.achievements || g.achievements.trim() === ''
                );

                if (isSubmit && incompleteGoals.length > 0) {
                    alert('모든 목표에 대한 주요 성과를 작성해주세요.');
                    return false;
                }
            }

            // 역량 평가 검증
            const allCompetencies = this.competencyEvaluations.flatMap(c => c.competencies);
            const incompleteCompetencies = allCompetencies.filter(c =>
                !c.evidence || c.evidence.trim() === ''
            );

            if (isSubmit && incompleteCompetencies.length > 0) {
                alert('모든 역량에 대한 개선 활동 및 근거를 작성해주세요.');
                return false;
            }

            // 종합 의견 검증
            if (isSubmit) {
                if (!this.evaluation.majorAchievements || this.evaluation.majorAchievements.trim() === '') {
                    alert('주요 성취를 작성해주세요.');
                    return false;
                }
                if (!this.evaluation.areasForImprovement || this.evaluation.areasForImprovement.trim() === '') {
                    alert('개선이 필요한 영역을 작성해주세요.');
                    return false;
                }
                if (!this.evaluation.nextPeriodPlan || this.evaluation.nextPeriodPlan.trim() === '') {
                    alert('다음 기간 목표 및 계획을 작성해주세요.');
                    return false;
                }
            }

            return true;
        }
    }
};
