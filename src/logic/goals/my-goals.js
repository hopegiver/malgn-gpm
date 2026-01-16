export default {
    layout: 'default',
    data() {
        return {
            goals: [],
            filter: 'all',
            goalStats: {
                total: 0,
                inProgress: 0,
                completed: 0,
                avgAchievement: 0
            },
            timeline: [],
            // 회사 KPI 목록
            companyKPIs: [],
            // 팀 KPI 목록
            teamKPIs: [],
            newGoal: {
                title: '',
                description: '',
                category: '',
                startDate: '',
                dueDate: '',
                linkedTeamKPI: '',
                keyResults: []
            },
            editingGoal: {},
            viewingGoal: null,
            updatingGoal: null,
            modalInstance: null,
            editModalInstance: null,
            detailModalInstance: null,
            progressModalInstance: null
        };
    },
    computed: {
        filteredGoals() {
            if (this.filter === 'all') {
                return this.goals;
            }
            return this.goals.filter(g => g.status === this.filter);
        },
        isFormValid() {
            return this.newGoal.title.trim() !== '' &&
                   this.newGoal.description.trim() !== '' &&
                   this.newGoal.category !== '' &&
                   this.newGoal.startDate !== '' &&
                   this.newGoal.dueDate !== '' &&
                   this.newGoal.keyResults.length >= 2 &&
                   this.newGoal.keyResults.every(kr => kr.title.trim() !== '' && kr.metric.trim() !== '');
        }
    },
    async mounted() {
        await this.loadCompanyKPIs();
        await this.loadTeamKPIs();
        await this.loadGoals();
        this.loadTimeline();

        // Bootstrap 모달 초기화
        this.$nextTick(() => {
            // 새 목표 추가 모달
            const modalElement = document.getElementById('addGoalModal');
            if (modalElement) {
                this.modalInstance = new bootstrap.Modal(modalElement);
                modalElement.addEventListener('hidden.bs.modal', () => {
                    this.resetNewGoalForm();
                });
            }

            // 목표 수정 모달
            const editModalElement = document.getElementById('editGoalModal');
            if (editModalElement) {
                this.editModalInstance = new bootstrap.Modal(editModalElement);
            }

            // 목표 상세 모달
            const detailModalElement = document.getElementById('goalDetailModal');
            if (detailModalElement) {
                this.detailModalInstance = new bootstrap.Modal(detailModalElement);
            }

            // 진행 업데이트 모달
            const progressModalElement = document.getElementById('progressUpdateModal');
            if (progressModalElement) {
                this.progressModalInstance = new bootstrap.Modal(progressModalElement);
            }
        });

        // 오늘 날짜를 기본 시작일로 설정
        const today = new Date().toISOString().split('T')[0];
        this.newGoal.startDate = today;
    },
    methods: {
        async loadCompanyKPIs() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/kpis/company');

            // 2026년도 맑은소프트 KPI (BSC 기반)
            this.companyKPIs = [
                // 재무 관점
                { id: 1, title: '[재무] 총매출액 90억 원 달성', category: '재무', achievement: 68 },
                { id: 2, title: '[재무] 신규 고객 200개사 확보', category: '재무', achievement: 55 },
                { id: 3, title: '[재무] 영업 이익률 20% 이상', category: '재무', achievement: 72 },
                // 고객 관점
                { id: 4, title: '[고객] 고객 유지율 90% 이상', category: '고객', achievement: 85 },
                { id: 5, title: '[고객] 고객 만족도 85점 이상', category: '고객', achievement: 82 },
                { id: 6, title: '[고객] 신규 서비스 생성 달별 2~3건', category: '고객', achievement: 78 },
                // 프로세스 관점
                { id: 7, title: '[프로세스] AI 프로세스 전환율 30% 이상', category: '프로세스', achievement: 45 },
                { id: 8, title: '[프로세스] 시스템 가용성 99.9% 이상', category: '프로세스', achievement: 95 },
                { id: 9, title: '[프로세스] 핵심 매뉴얼 정산율 100%', category: '프로세스', achievement: 88 },
                // 학습과성장 관점
                { id: 10, title: '[학습] 직원 1인당 교육시간 연 50시간', category: '학습과성장', achievement: 60 },
                { id: 11, title: '[학습] 리더십 교육 참여율 100%', category: '학습과성장', achievement: 92 },
                { id: 12, title: '[학습] AI 활용 역량 향상율 20% 이상', category: '학습과성장', achievement: 52 }
            ];
        },

        async loadTeamKPIs() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/kpis/team');

            // 개발팀 KPI (회사 KPI 연결, BSC 기반)
            this.teamKPIs = [
                // 재무 관점
                {
                    id: 1,
                    title: '신규 프로덕트 출시 3개 이상',
                    category: '재무',
                    linkedCompanyKPI: 1,
                    companyKPITitle: '[재무] 총매출액 90억 원 달성',
                    achievement: 70
                },
                {
                    id: 2,
                    title: '프로젝트 일정 준수율 95% 이상',
                    category: '재무',
                    linkedCompanyKPI: 2,
                    companyKPITitle: '[재무] 신규 고객 200개사 확보',
                    achievement: 88
                },
                // 고객 관점
                {
                    id: 3,
                    title: '서비스 품질 목표 달성률 90%',
                    category: '고객',
                    linkedCompanyKPI: 4,
                    companyKPITitle: '[고객] 고객 유지율 90% 이상',
                    achievement: 82
                },
                {
                    id: 4,
                    title: '사용자 만족도 4.2점 이상 (5점 만점)',
                    category: '고객',
                    linkedCompanyKPI: 5,
                    companyKPITitle: '[고객] 고객 만족도 85점 이상',
                    achievement: 78
                },
                {
                    id: 5,
                    title: '혁신 서비스 제안 월 1건 이상',
                    category: '고객',
                    linkedCompanyKPI: 6,
                    companyKPITitle: '[고객] 신규 서비스 생성 달별 2~3건',
                    achievement: 65
                },
                // 프로세스 관점
                {
                    id: 6,
                    title: 'AI 기반 자동화 프로세스 5개 이상 구축',
                    category: '프로세스',
                    linkedCompanyKPI: 7,
                    companyKPITitle: '[프로세스] AI 프로세스 전환율 30% 이상',
                    achievement: 42
                },
                {
                    id: 7,
                    title: '시스템 장애율 0.5% 이하',
                    category: '프로세스',
                    linkedCompanyKPI: 8,
                    companyKPITitle: '[프로세스] 시스템 가용성 99.9% 이상',
                    achievement: 92
                },
                {
                    id: 8,
                    title: '개발 문서화율 100% (핵심 기능)',
                    category: '프로세스',
                    linkedCompanyKPI: 9,
                    companyKPITitle: '[프로세스] 핵심 매뉴얼 정산율 100%',
                    achievement: 85
                },
                // 학습과성장 관점
                {
                    id: 9,
                    title: '팀원 1인당 기술 교육 40시간 이상',
                    category: '학습과성장',
                    linkedCompanyKPI: 10,
                    companyKPITitle: '[학습] 직원 1인당 교육시간 연 50시간',
                    achievement: 58
                },
                {
                    id: 10,
                    title: '코드 리뷰 참여율 100%',
                    category: '학습과성장',
                    linkedCompanyKPI: 11,
                    companyKPITitle: '[학습] 리더십 교육 참여율 100%',
                    achievement: 95
                },
                {
                    id: 11,
                    title: 'AI 도구 활용 개발 프로젝트 50% 이상',
                    category: '학습과성장',
                    linkedCompanyKPI: 12,
                    companyKPITitle: '[학습] AI 활용 역량 향상율 20% 이상',
                    achievement: 48
                }
            ];
        },

        async loadGoals() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/goals/my-goals');

            // 임시 데모 데이터
            this.goals = [
                {
                    id: 1,
                    title: 'Q1 신규 기능 개발 완료',
                    description: '사용자 대시보드 및 리포트 기능을 개발하여 사용자 경험을 개선합니다.',
                    category: '개발',
                    linkedTeamKPI: 1,
                    teamKPITitle: '신규 프로덕트 출시 3개 이상',
                    startDate: '2024-01-01',
                    dueDate: '2024-03-31',
                    status: 'inProgress',
                    achievement: 75,
                    keyResults: [
                        { id: 1, title: '대시보드 UI 컴포넌트 개발', metric: '100%', completed: true },
                        { id: 2, title: '데이터 시각화 차트 구현', metric: '80%', completed: true },
                        { id: 3, title: '리포트 생성 기능 개발', metric: '60%', completed: false },
                        { id: 4, title: '성능 최적화 및 테스트', metric: '50%', completed: false }
                    ]
                },
                {
                    id: 2,
                    title: 'AI 자동화 프로세스 구축',
                    description: 'AI 기반 코드 리뷰 자동화 및 테스트 자동화 시스템을 구축합니다.',
                    category: '개발',
                    linkedTeamKPI: 6,
                    teamKPITitle: 'AI 기반 자동화 프로세스 5개 이상 구축',
                    startDate: '2024-02-01',
                    dueDate: '2024-06-30',
                    status: 'inProgress',
                    achievement: 40,
                    keyResults: [
                        { id: 1, title: 'AI 코드 리뷰 도구 도입', metric: '완료', completed: true },
                        { id: 2, title: 'AI 기반 테스트 케이스 생성', metric: '진행 중', completed: false },
                        { id: 3, title: 'AI 문서 자동 생성 시스템', metric: '30%', completed: false },
                        { id: 4, title: '팀 교육 및 적용', metric: '예정', completed: false }
                    ]
                },
                {
                    id: 3,
                    title: '시스템 안정성 향상',
                    description: '모니터링 강화 및 장애 대응 프로세스를 개선하여 시스템 안정성을 확보합니다.',
                    category: '품질',
                    linkedTeamKPI: 7,
                    teamKPITitle: '시스템 장애율 0.5% 이하',
                    startDate: '2024-01-15',
                    dueDate: '2024-04-30',
                    status: 'inProgress',
                    achievement: 85,
                    keyResults: [
                        { id: 1, title: '실시간 모니터링 대시보드 구축', metric: '완료', completed: true },
                        { id: 2, title: '알림 시스템 개선', metric: '완료', completed: true },
                        { id: 3, title: '장애 대응 매뉴얼 작성', metric: '90%', completed: false },
                        { id: 4, title: '자동 복구 시스템 구축', metric: '70%', completed: false }
                    ]
                },
                {
                    id: 4,
                    title: 'AI 기술 역량 강화',
                    description: 'ChatGPT, GitHub Copilot 등 AI 도구를 활용한 개발 생산성 향상',
                    category: '성장',
                    linkedTeamKPI: 11,
                    teamKPITitle: 'AI 도구 활용 개발 프로젝트 50% 이상',
                    startDate: '2024-01-01',
                    dueDate: '2024-12-31',
                    status: 'inProgress',
                    achievement: 50,
                    keyResults: [
                        { id: 1, title: 'AI 프롬프트 엔지니어링 학습', metric: '완료', completed: true },
                        { id: 2, title: 'GitHub Copilot 프로젝트 적용', metric: '50%', completed: false },
                        { id: 3, title: 'AI 활용 개발 가이드 작성', metric: '진행 중', completed: false },
                        { id: 4, title: '팀 내 AI 활용 세미나', metric: '2회/4회', completed: false }
                    ]
                }
            ];

            this.calculateStats();
        },

        loadTimeline() {
            this.timeline = [
                {
                    id: 1,
                    title: 'Q1 신규 기능 개발 완료',
                    date: '2024-03-31',
                    type: 'inProgress'
                },
                {
                    id: 2,
                    title: '코드 품질 개선',
                    date: '2024-04-30',
                    type: 'inProgress'
                },
                {
                    id: 3,
                    title: 'React 전문성 향상',
                    date: '2024-06-30',
                    type: 'upcoming'
                },
                {
                    id: 4,
                    title: '팀 협업 프로세스 개선',
                    date: '2024-03-15 (완료)',
                    type: 'completed'
                }
            ];
        },

        calculateStats() {
            this.goalStats.total = this.goals.length;
            this.goalStats.inProgress = this.goals.filter(g => g.status === 'inProgress').length;
            this.goalStats.completed = this.goals.filter(g => g.status === 'completed').length;

            const totalAchievement = this.goals.reduce((sum, g) => sum + g.achievement, 0);
            this.goalStats.avgAchievement = this.goals.length > 0
                ? Math.round(totalAchievement / this.goals.length)
                : 0;
        },

        getSignalClass(value) {
            if (value >= 70) return 'green';
            if (value >= 40) return 'yellow';
            return 'red';
        },

        getStatusBadgeClass(status) {
            switch (status) {
                case 'completed':
                    return 'success';
                case 'inProgress':
                    return 'primary';
                case 'pending':
                    return 'warning';
                default:
                    return 'secondary';
            }
        },

        getStatusText(status) {
            switch (status) {
                case 'completed':
                    return '완료';
                case 'inProgress':
                    return '진행 중';
                case 'pending':
                    return '대기';
                default:
                    return '알 수 없음';
            }
        },

        toggleKeyResult(goalId, krId) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                const kr = goal.keyResults.find(k => k.id === krId);
                if (kr) {
                    kr.completed = !kr.completed;

                    // 달성률 재계산
                    const completedKRs = goal.keyResults.filter(k => k.completed).length;
                    goal.achievement = Math.round((completedKRs / goal.keyResults.length) * 100);

                    // 통계 재계산
                    this.calculateStats();

                    // TODO: API 호출로 업데이트
                    // await this.$api.patch(`/api/goals/${goalId}/key-results/${krId}`, { completed: kr.completed });
                }
            }
        },

        openAddGoalModal() {
            // 모달 열기 전에 폼 초기화
            this.resetNewGoalForm();

            // Bootstrap 모달 표시
            if (this.modalInstance) {
                this.modalInstance.show();
            }
        },

        addKeyResult() {
            // 새 핵심 결과 추가
            this.newGoal.keyResults.push({
                title: '',
                metric: '',
                completed: false
            });
        },

        removeKeyResult(index) {
            // 핵심 결과 삭제
            this.newGoal.keyResults.splice(index, 1);
        },

        resetNewGoalForm() {
            // 폼 초기화
            const today = new Date().toISOString().split('T')[0];

            this.newGoal = {
                title: '',
                description: '',
                category: '',
                linkedTeamKPI: '',
                startDate: today,
                dueDate: '',
                keyResults: []
            };

            // SMART 체크박스 초기화
            ['smart1', 'smart2', 'smart3', 'smart4', 'smart5'].forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = false;
            });
        },

        async saveNewGoal() {
            // 폼 유효성 검사
            if (!this.isFormValid) {
                alert('모든 필수 항목을 입력해주세요.\n핵심 결과는 최소 2개 이상 입력해야 합니다.');
                return;
            }

            // 날짜 유효성 검사
            if (new Date(this.newGoal.startDate) > new Date(this.newGoal.dueDate)) {
                alert('목표일은 시작일보다 이후여야 합니다.');
                return;
            }

            // 연결된 팀 KPI 정보 가져오기
            const linkedTeamKPI = this.teamKPIs.find(kpi => kpi.id === parseInt(this.newGoal.linkedTeamKPI));

            // 새 목표 객체 생성
            const newGoal = {
                id: Date.now(), // 임시 ID (실제로는 서버에서 생성)
                title: this.newGoal.title,
                description: this.newGoal.description,
                category: this.newGoal.category,
                linkedTeamKPI: this.newGoal.linkedTeamKPI ? parseInt(this.newGoal.linkedTeamKPI) : null,
                teamKPITitle: linkedTeamKPI ? linkedTeamKPI.title : null,
                startDate: this.newGoal.startDate,
                dueDate: this.newGoal.dueDate,
                status: 'inProgress',
                achievement: 0,
                keyResults: this.newGoal.keyResults.map((kr, index) => ({
                    id: index + 1,
                    title: kr.title,
                    metric: kr.metric,
                    completed: false
                }))
            };

            // TODO: 실제 API 호출로 대체
            // const response = await this.$api.post('/api/goals', newGoal);
            // const savedGoal = response.data;

            // 목표 목록에 추가
            this.goals.unshift(newGoal);

            // 통계 재계산
            this.calculateStats();

            // 타임라인 업데이트
            this.updateTimeline(newGoal);

            // 모달 닫기
            if (this.modalInstance) {
                this.modalInstance.hide();
            }

            // 성공 메시지 (Toast로 대체 가능)
            alert('목표가 성공적으로 등록되었습니다!');

            // 폼 초기화
            this.resetNewGoalForm();
        },

        updateTimeline(newGoal) {
            // 타임라인에 새 목표 추가
            const timelineItem = {
                id: newGoal.id,
                title: newGoal.title,
                date: newGoal.dueDate,
                type: 'inProgress'
            };

            // 날짜순으로 정렬하여 삽입
            this.timeline.push(timelineItem);
            this.timeline.sort((a, b) => {
                const dateA = new Date(a.date.replace(' (완료)', ''));
                const dateB = new Date(b.date.replace(' (완료)', ''));
                return dateA - dateB;
            });
        },

        editGoal(goalId) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                // 목표 데이터 복사 (깊은 복사)
                this.editingGoal = {
                    id: goal.id,
                    title: goal.title,
                    description: goal.description,
                    category: goal.category,
                    linkedTeamKPI: goal.linkedTeamKPI || '',
                    startDate: goal.startDate,
                    dueDate: goal.dueDate,
                    status: goal.status,
                    achievement: goal.achievement,
                    keyResults: JSON.parse(JSON.stringify(goal.keyResults))
                };

                // 모달 표시
                if (this.editModalInstance) {
                    this.editModalInstance.show();
                }
            }
        },

        addEditKR() {
            // 수정 중인 목표에 새 KR 추가
            if (!this.editingGoal.keyResults) {
                this.editingGoal.keyResults = [];
            }

            this.editingGoal.keyResults.push({
                id: Date.now(), // 임시 ID
                title: '',
                metric: '',
                completed: false
            });
        },

        removeEditKR(index) {
            // 수정 중인 목표에서 KR 삭제
            if (this.editingGoal.keyResults) {
                this.editingGoal.keyResults.splice(index, 1);
            }
        },

        saveEditGoal() {
            // KR 유효성 검사
            if (!this.editingGoal.keyResults || this.editingGoal.keyResults.length === 0) {
                alert('최소 1개 이상의 핵심 결과(KR)를 추가해주세요.');
                return;
            }

            // KR 내용 검사
            const hasEmptyKR = this.editingGoal.keyResults.some(kr => !kr.title.trim() || !kr.metric.trim());
            if (hasEmptyKR) {
                alert('모든 핵심 결과(KR)의 내용과 측정 지표를 입력해주세요.');
                return;
            }

            // 날짜 유효성 검사
            if (new Date(this.editingGoal.startDate) > new Date(this.editingGoal.dueDate)) {
                alert('목표일은 시작일보다 이후여야 합니다.');
                return;
            }

            // 연결된 팀 KPI 정보 가져오기
            const linkedTeamKPI = this.teamKPIs.find(kpi => kpi.id === parseInt(this.editingGoal.linkedTeamKPI));

            // 원본 목표 찾기 및 업데이트
            const goalIndex = this.goals.findIndex(g => g.id === this.editingGoal.id);
            if (goalIndex !== -1) {
                // KR 변경사항 반영 및 달성률 재계산
                const completedKRs = this.editingGoal.keyResults.filter(kr => kr.completed).length;
                const newAchievement = Math.round((completedKRs / this.editingGoal.keyResults.length) * 100);

                this.goals[goalIndex] = {
                    ...this.goals[goalIndex],
                    title: this.editingGoal.title,
                    description: this.editingGoal.description,
                    category: this.editingGoal.category,
                    linkedTeamKPI: this.editingGoal.linkedTeamKPI ? parseInt(this.editingGoal.linkedTeamKPI) : null,
                    teamKPITitle: linkedTeamKPI ? linkedTeamKPI.title : null,
                    startDate: this.editingGoal.startDate,
                    dueDate: this.editingGoal.dueDate,
                    keyResults: JSON.parse(JSON.stringify(this.editingGoal.keyResults)), // Deep copy
                    achievement: newAchievement
                };

                // 통계 재계산
                this.calculateStats();

                // TODO: 실제 API 호출로 대체
                // await this.$api.put(`/api/goals/${this.editingGoal.id}`, this.goals[goalIndex]);

                // 모달 닫기
                if (this.editModalInstance) {
                    this.editModalInstance.hide();
                }

                alert('목표가 성공적으로 수정되었습니다!');
            }
        },

        viewGoalDetail(goalId) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                this.viewingGoal = goal;

                // 모달 표시
                if (this.detailModalInstance) {
                    this.detailModalInstance.show();
                }
            }
        },

        openEditFromDetail() {
            // 상세 모달 닫기
            if (this.detailModalInstance) {
                this.detailModalInstance.hide();
            }

            // 수정 모달 열기
            if (this.viewingGoal) {
                // 약간의 지연을 두고 수정 모달 열기 (상세 모달이 완전히 닫힌 후)
                setTimeout(() => {
                    this.editGoal(this.viewingGoal.id);
                }, 300);
            }
        },

        updateProgress(goalId) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                // 목표 데이터 복사 (깊은 복사로 KR 체크 상태 변경 가능하게)
                this.updatingGoal = JSON.parse(JSON.stringify(goal));

                // 모달 표시
                if (this.progressModalInstance) {
                    this.progressModalInstance.show();
                }
            }
        },

        recalculateProgress() {
            if (this.updatingGoal && this.updatingGoal.keyResults) {
                const completedKRs = this.updatingGoal.keyResults.filter(kr => kr.completed).length;
                this.updatingGoal.achievement = Math.round((completedKRs / this.updatingGoal.keyResults.length) * 100);
            }
        },

        saveProgressUpdate() {
            if (!this.updatingGoal) return;

            // 원본 목표 찾기 및 업데이트
            const goalIndex = this.goals.findIndex(g => g.id === this.updatingGoal.id);
            if (goalIndex !== -1) {
                this.goals[goalIndex].keyResults = JSON.parse(JSON.stringify(this.updatingGoal.keyResults));
                this.goals[goalIndex].achievement = this.updatingGoal.achievement;

                // 모든 KR이 완료되면 상태를 'completed'로 변경
                const allCompleted = this.goals[goalIndex].keyResults.every(kr => kr.completed);
                if (allCompleted) {
                    this.goals[goalIndex].status = 'completed';
                }

                // TODO: 실제 API 호출로 대체
                // await this.$api.patch(`/api/goals/${this.updatingGoal.id}/progress`, {
                //     keyResults: this.updatingGoal.keyResults,
                //     achievement: this.updatingGoal.achievement
                // });

                // 통계 재계산
                this.calculateStats();

                // 모달 닫기
                if (this.progressModalInstance) {
                    this.progressModalInstance.hide();
                }

                alert('진행 상황이 성공적으로 업데이트되었습니다!');
            }
        }
    }
};
