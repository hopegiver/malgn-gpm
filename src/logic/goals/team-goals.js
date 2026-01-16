export default {
    layout: 'default',
    data() {
        return {
            teamName: '',
            stats: {
                teamGoalAchievement: 78,
                trend: 8,
                activeGoals: 5,
                completedGoals: 3,
                avgProgress: 72
            },
            teamGoals: [],
            teamMembers: [],
            showGoalModal: false,
            goalForm: {
                id: null,
                title: '',
                description: '',
                owner: '',
                dueDate: '',
                parentGoalId: '',
                status: '진행중',
                achievement: 0
            }
        };
    },
    async mounted() {
        // 팀장 권한 체크
        const user = window.getCurrentUser();
        if (!user || !user.roles ||
            (!user.roles.includes(window.ROLES.DEPT_HEAD) &&
             !user.roles.includes(window.ROLES.TEAM_LEADER))) {
            alert('팀장만 접근할 수 있습니다.');
            window.location.hash = '#/dashboard/employee';
            return;
        }

        // 팀 정보 로드
        this.loadTeamInfo();

        // 데이터 로드
        await this.loadTeamGoalsData();
    },
    methods: {
        loadTeamInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.teamName = user.team || '프론트엔드';
            }
        },

        async loadTeamGoalsData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/goals/team');

            // 임시 데모 데이터
            this.teamGoals = [
                {
                    id: 1,
                    title: 'Q1 신규 기능 개발 완료',
                    description: '사용자 대시보드 및 관리자 기능 개발',
                    achievement: 75,
                    dueDate: '2024-03-31',
                    owner: '김민수',
                    status: '진행중',
                    parentGoalId: null
                },
                {
                    id: 2,
                    title: '코드 품질 개선 프로젝트',
                    description: '레거시 코드 리팩토링 및 테스트 커버리지 향상',
                    achievement: 62,
                    dueDate: '2024-04-15',
                    owner: '정동욱',
                    status: '진행중',
                    parentGoalId: null
                },
                {
                    id: 3,
                    title: '성능 최적화',
                    description: '페이지 로딩 속도 30% 개선',
                    achievement: 48,
                    dueDate: '2024-04-30',
                    owner: '이지은',
                    status: '지연',
                    parentGoalId: null
                },
                {
                    id: 4,
                    title: '팀 프로세스 개선',
                    description: '애자일 스프린트 도입 및 정착',
                    achievement: 85,
                    dueDate: '2024-03-15',
                    owner: '최서연',
                    status: '진행중',
                    parentGoalId: null
                },
                {
                    id: 5,
                    title: '기술 문서화',
                    description: '프로젝트 아키텍처 및 API 문서 작성',
                    achievement: 100,
                    dueDate: '2024-02-28',
                    owner: '임태양',
                    status: '완료',
                    parentGoalId: null
                }
            ];

            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    goalCount: 5,
                    avgAchievement: 85,
                    lastUpdate: '1일 전',
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    goalCount: 4,
                    avgAchievement: 72,
                    lastUpdate: '2일 전',
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    goalCount: 3,
                    avgAchievement: 65,
                    lastUpdate: '1일 전',
                    status: '보통',
                    statusClass: 'warning'
                },
                {
                    id: 4,
                    name: '최서연',
                    initial: '최',
                    position: '개발자',
                    goalCount: 4,
                    avgAchievement: 78,
                    lastUpdate: '1일 전',
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 5,
                    name: '정동욱',
                    initial: '정',
                    position: '선임 개발자',
                    goalCount: 5,
                    avgAchievement: 82,
                    lastUpdate: '1일 전',
                    status: '우수',
                    statusClass: 'success'
                },
                {
                    id: 6,
                    name: '강민지',
                    initial: '강',
                    position: '주니어 개발자',
                    goalCount: 3,
                    avgAchievement: 58,
                    lastUpdate: '3일 전',
                    status: '개선필요',
                    statusClass: 'danger'
                },
                {
                    id: 7,
                    name: '윤서진',
                    initial: '윤',
                    position: '개발자',
                    goalCount: 4,
                    avgAchievement: 76,
                    lastUpdate: '1일 전',
                    status: '양호',
                    statusClass: 'primary'
                },
                {
                    id: 8,
                    name: '임태양',
                    initial: '임',
                    position: '선임 개발자',
                    goalCount: 6,
                    avgAchievement: 88,
                    lastUpdate: '1일 전',
                    status: '우수',
                    statusClass: 'success'
                }
            ];
        },

        openAddGoalModal() {
            this.goalForm = {
                id: null,
                title: '',
                description: '',
                owner: '',
                dueDate: '',
                parentGoalId: '',
                status: '진행중',
                achievement: 0
            };
            this.showGoalModal = true;
        },

        editGoal(goalId) {
            const goal = this.teamGoals.find(g => g.id === goalId);
            if (goal) {
                this.goalForm = {
                    id: goal.id,
                    title: goal.title,
                    description: goal.description,
                    owner: goal.owner,
                    dueDate: goal.dueDate,
                    parentGoalId: goal.parentGoalId,
                    status: goal.status,
                    achievement: goal.achievement
                };
                this.showGoalModal = true;
            }
        },

        closeGoalModal() {
            this.showGoalModal = false;
        },

        async saveGoal() {
            // 유효성 검사
            if (!this.goalForm.title.trim()) {
                alert('목표 제목을 입력해주세요.');
                return;
            }
            if (!this.goalForm.owner) {
                alert('담당자를 선택해주세요.');
                return;
            }
            if (!this.goalForm.dueDate) {
                alert('마감일을 입력해주세요.');
                return;
            }

            // TODO: 실제 API 호출로 대체
            // if (this.goalForm.id) {
            //     await this.$api.put(`/api/goals/team/${this.goalForm.id}`, this.goalForm);
            // } else {
            //     await this.$api.post('/api/goals/team', this.goalForm);
            // }

            if (this.goalForm.id) {
                // 수정
                const index = this.teamGoals.findIndex(g => g.id === this.goalForm.id);
                if (index > -1) {
                    this.teamGoals[index] = { ...this.goalForm };
                }
            } else {
                // 추가
                const newGoal = {
                    ...this.goalForm,
                    id: Math.max(...this.teamGoals.map(g => g.id)) + 1
                };
                this.teamGoals.push(newGoal);
                this.stats.activeGoals++;
            }

            this.closeGoalModal();
        },

        async deleteGoal(goalId) {
            const goal = this.teamGoals.find(g => g.id === goalId);
            if (!goal) return;

            if (!confirm(`"${goal.title}" 목표를 삭제하시겠습니까?`)) {
                return;
            }

            // TODO: 실제 API 호출로 대체
            // await this.$api.delete(`/api/goals/team/${goalId}`);

            const index = this.teamGoals.findIndex(g => g.id === goalId);
            if (index > -1) {
                this.teamGoals.splice(index, 1);
                this.stats.activeGoals--;
            }
        },

        viewGoalDetail(goalId) {
            // TODO: 목표 상세 페이지로 이동
            window.location.hash = `#/goals/detail/${goalId}`;
        },

        viewMemberGoals(memberId) {
            // TODO: 팀원 목표 상세 페이지로 이동
            window.location.hash = `#/team/member/${memberId}/goals`;
        },

        alignGoals() {
            // TODO: 목표 정렬 기능 구현
            alert('목표 정렬 기능은 준비 중입니다.');
        },

        exportGoals() {
            // TODO: 목표 내보내기 기능 구현
            alert('목표 내보내기 기능은 준비 중입니다.');
        },

        getStatusClass(status) {
            switch (status) {
                case '완료':
                    return 'success';
                case '진행중':
                    return 'primary';
                case '지연':
                    return 'danger';
                case '보류':
                    return 'secondary';
                default:
                    return 'secondary';
            }
        },

        getProgressClass(value) {
            if (value >= 80) return 'success';
            if (value >= 60) return 'primary';
            if (value >= 40) return 'warning';
            return 'danger';
        }
    }
};
