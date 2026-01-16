export default {
    layout: 'default',
    data() {
        return {
            stats: {
                totalCompleted: 8,
                lastAssessmentDate: '2024-12-15',
                daysSinceLastAssessment: 32,
                nextAssessmentDate: '2024-03-15',
                daysUntilNextAssessment: 28
            },
            assessmentCategories: [],
            recentResults: [],
            recommendations: [],
            showAssessmentModal: false,
            currentAssessment: {
                categoryId: null,
                categoryName: '',
                currentQuestion: 1,
                totalQuestions: 10,
                question: '',
                options: [],
                selectedAnswer: null,
                answers: []
            }
        };
    },
    async mounted() {
        await this.loadAssessmentData();
    },
    methods: {
        async loadAssessmentData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/growth/assessment');

            // 데모 데이터
            this.assessmentCategories = [
                {
                    id: 1,
                    name: '기술 역량',
                    description: '직무 수행에 필요한 전문 기술 및 지식',
                    icon: 'bi bi-code-square',
                    color: '#6366f1',
                    progress: 100,
                    completedQuestions: 15,
                    totalQuestions: 15
                },
                {
                    id: 2,
                    name: '문제 해결',
                    description: '복잡한 문제를 분석하고 해결하는 능력',
                    icon: 'bi bi-puzzle',
                    color: '#10b981',
                    progress: 60,
                    completedQuestions: 9,
                    totalQuestions: 15
                },
                {
                    id: 3,
                    name: '커뮤니케이션',
                    description: '효과적인 의사소통 및 협업 능력',
                    icon: 'bi bi-chat-dots',
                    color: '#f59e0b',
                    progress: 100,
                    completedQuestions: 12,
                    totalQuestions: 12
                },
                {
                    id: 4,
                    name: '리더십',
                    description: '팀을 이끌고 동기부여하는 능력',
                    icon: 'bi bi-people',
                    color: '#8b5cf6',
                    progress: 0,
                    completedQuestions: 0,
                    totalQuestions: 10
                },
                {
                    id: 5,
                    name: '시간 관리',
                    description: '업무 우선순위 설정 및 효율적 시간 활용',
                    icon: 'bi bi-clock',
                    color: '#ec4899',
                    progress: 80,
                    completedQuestions: 8,
                    totalQuestions: 10
                },
                {
                    id: 6,
                    name: '창의성',
                    description: '새로운 아이디어 창출 및 혁신적 사고',
                    icon: 'bi bi-lightbulb',
                    color: '#14b8a6',
                    progress: 0,
                    completedQuestions: 0,
                    totalQuestions: 12
                }
            ];

            this.recentResults = [
                {
                    id: 1,
                    categoryName: '기술 역량',
                    color: '#6366f1',
                    score: 85,
                    date: '2024-12-15',
                    questionsCount: 15,
                    strengths: '최신 기술 트렌드 파악, 코드 품질 관리',
                    weaknesses: '레거시 시스템 이해도 향상 필요'
                },
                {
                    id: 2,
                    categoryName: '커뮤니케이션',
                    color: '#f59e0b',
                    score: 78,
                    date: '2024-12-10',
                    questionsCount: 12,
                    strengths: '명확한 의사 전달, 적극적인 경청',
                    weaknesses: '비대면 커뮤니케이션 스킬 개선 필요'
                },
                {
                    id: 3,
                    categoryName: '시간 관리',
                    color: '#ec4899',
                    score: 72,
                    date: '2024-12-05',
                    questionsCount: 10,
                    strengths: '우선순위 설정 능력 우수',
                    weaknesses: '예상치 못한 업무 대응 시 일정 관리 어려움'
                }
            ];

            this.recommendations = [
                {
                    id: 1,
                    categoryId: 4,
                    icon: 'bi bi-people-fill',
                    title: '리더십 진단',
                    description: '팀 리딩 역량을 확인하고 발전 방향을 찾아보세요'
                },
                {
                    id: 2,
                    categoryId: 6,
                    icon: 'bi bi-lightbulb-fill',
                    title: '창의성 진단',
                    description: '혁신적 사고와 문제 해결 능력을 측정해보세요'
                },
                {
                    id: 3,
                    categoryId: 2,
                    icon: 'bi bi-puzzle-fill',
                    title: '문제 해결 진단 완료',
                    description: '미완료된 진단을 이어서 진행하세요'
                }
            ];
        },

        startAssessment(categoryId) {
            const category = this.assessmentCategories.find(c => c.id === categoryId);
            if (!category) return;

            this.currentAssessment = {
                categoryId: categoryId,
                categoryName: category.name,
                currentQuestion: 1,
                totalQuestions: category.totalQuestions,
                question: '',
                options: [],
                selectedAnswer: null,
                answers: []
            };

            this.loadNextQuestion();
            this.showAssessmentModal = true;
        },

        loadNextQuestion() {
            // TODO: 실제 API에서 질문 로드
            // const question = await this.$api.get(`/api/assessment/${categoryId}/question/${currentQuestion}`);

            // 데모 질문 생성
            const questions = this.generateDemoQuestions(this.currentAssessment.categoryId);
            const questionData = questions[this.currentAssessment.currentQuestion - 1];

            if (questionData) {
                this.currentAssessment.question = questionData.question;
                this.currentAssessment.options = questionData.options;
                this.currentAssessment.selectedAnswer = null;
            }
        },

        generateDemoQuestions(categoryId) {
            const questionSets = {
                1: [ // 기술 역량
                    {
                        question: '새로운 기술이나 프레임워크를 학습하고 적용하는 속도는 어떤가요?',
                        options: [
                            { value: 5, label: '매우 빠름 - 즉시 학습하고 실무에 적용' },
                            { value: 4, label: '빠름 - 1-2주 내 학습 완료' },
                            { value: 3, label: '보통 - 한 달 정도 소요' },
                            { value: 2, label: '느림 - 몇 달 소요' },
                            { value: 1, label: '매우 느림 - 학습에 어려움' }
                        ]
                    },
                    {
                        question: '코드 품질과 유지보수성을 얼마나 고려하나요?',
                        options: [
                            { value: 5, label: '항상 - 테스트, 문서화, 리팩토링 모두 수행' },
                            { value: 4, label: '자주 - 대부분의 경우 고려' },
                            { value: 3, label: '보통 - 필요시 고려' },
                            { value: 2, label: '가끔 - 시간 여유가 있을 때만' },
                            { value: 1, label: '거의 안함 - 동작하는 것에 집중' }
                        ]
                    }
                ],
                2: [ // 문제 해결
                    {
                        question: '복잡한 문제에 직면했을 때 어떻게 접근하나요?',
                        options: [
                            { value: 5, label: '체계적 분석 - 문제를 작은 단위로 나누어 해결' },
                            { value: 4, label: '계획적 접근 - 해결 방법을 먼저 설계' },
                            { value: 3, label: '시행착오 - 다양한 방법을 시도' },
                            { value: 2, label: '도움 요청 - 먼저 다른 사람에게 문의' },
                            { value: 1, label: '회피 - 가능하면 다른 업무로 전환' }
                        ]
                    }
                ],
                3: [ // 커뮤니케이션
                    {
                        question: '팀원들과 의견이 다를 때 어떻게 대처하나요?',
                        options: [
                            { value: 5, label: '건설적 토론 - 논리적으로 설득하고 타협점 찾기' },
                            { value: 4, label: '경청 우선 - 상대방 의견을 충분히 듣고 조정' },
                            { value: 3, label: '다수 의견 따름 - 팀 결정에 맞춤' },
                            { value: 2, label: '소극적 동의 - 큰 문제 없으면 수용' },
                            { value: 1, label: '회피 - 갈등 상황을 피함' }
                        ]
                    }
                ],
                4: [ // 리더십
                    {
                        question: '팀원들을 동기부여하는 데 얼마나 자신 있나요?',
                        options: [
                            { value: 5, label: '매우 자신있음 - 팀 분위기를 주도적으로 이끔' },
                            { value: 4, label: '자신있음 - 필요시 동기부여 가능' },
                            { value: 3, label: '보통 - 상황에 따라 다름' },
                            { value: 2, label: '부족 - 어려움을 느낌' },
                            { value: 1, label: '매우 부족 - 경험이 없음' }
                        ]
                    }
                ],
                5: [ // 시간 관리
                    {
                        question: '업무 우선순위를 어떻게 설정하나요?',
                        options: [
                            { value: 5, label: '체계적 - 중요도/긴급도 매트릭스 활용' },
                            { value: 4, label: '계획적 - 일일/주간 계획 수립' },
                            { value: 3, label: '유연하게 - 상황에 따라 조정' },
                            { value: 2, label: '즉흥적 - 그때그때 판단' },
                            { value: 1, label: '어려움 - 우선순위 설정이 힘듦' }
                        ]
                    }
                ],
                6: [ // 창의성
                    {
                        question: '새로운 아이디어를 얼마나 자주 제안하나요?',
                        options: [
                            { value: 5, label: '매우 자주 - 주 1회 이상' },
                            { value: 4, label: '자주 - 월 2-3회' },
                            { value: 3, label: '보통 - 월 1회 정도' },
                            { value: 2, label: '가끔 - 분기 1-2회' },
                            { value: 1, label: '거의 안함 - 필요시에만' }
                        ]
                    }
                ]
            };

            // 각 카테고리별로 동일한 질문을 반복해서 총 문항 수 맞춤
            const baseQuestions = questionSets[categoryId] || questionSets[1];
            const category = this.assessmentCategories.find(c => c.id === categoryId);
            const totalQuestions = category ? category.totalQuestions : 10;

            const questions = [];
            for (let i = 0; i < totalQuestions; i++) {
                questions.push(baseQuestions[i % baseQuestions.length]);
            }

            return questions;
        },

        selectAnswer(value) {
            this.currentAssessment.selectedAnswer = value;
        },

        nextQuestion() {
            if (!this.currentAssessment.selectedAnswer) return;

            // 답변 저장
            this.currentAssessment.answers.push({
                question: this.currentAssessment.currentQuestion,
                answer: this.currentAssessment.selectedAnswer
            });

            if (this.currentAssessment.currentQuestion < this.currentAssessment.totalQuestions) {
                this.currentAssessment.currentQuestion++;
                this.loadNextQuestion();
            } else {
                // 진단 완료
                this.completeAssessment();
            }
        },

        async completeAssessment() {
            // TODO: 실제 API로 결과 전송
            // await this.$api.post('/api/assessment/complete', this.currentAssessment);

            // 평균 점수 계산
            const avgScore = Math.round(
                this.currentAssessment.answers.reduce((sum, a) => sum + a.answer, 0) /
                this.currentAssessment.answers.length * 20
            );

            // 시뮬레이션: 2초 후 결과 표시
            setTimeout(() => {
                this.closeAssessmentModal();

                // 결과 페이지로 이동하거나 알림 표시
                alert(`진단이 완료되었습니다!\n\n${this.currentAssessment.categoryName}: ${avgScore}점\n\n결과는 "최근 진단 결과"에서 확인하실 수 있습니다.`);

                // 데이터 새로고침
                this.loadAssessmentData();
            }, 2000);
        },

        closeAssessmentModal() {
            if (this.currentAssessment.currentQuestion > 1 &&
                this.currentAssessment.currentQuestion <= this.currentAssessment.totalQuestions) {
                if (!confirm('진단을 중단하시겠습니까? 진행 상황이 저장됩니다.')) {
                    return;
                }
            }

            this.showAssessmentModal = false;
        },

        viewResultDetail(resultId) {
            // TODO: 상세 결과 페이지로 이동
            console.log('View result detail:', resultId);
            alert('상세 결과 페이지로 이동합니다.');
        },

        viewAllResults() {
            // TODO: 전체 결과 히스토리 페이지로 이동
            console.log('View all results');
            alert('전체 진단 결과 페이지로 이동합니다.');
        }
    }
};
