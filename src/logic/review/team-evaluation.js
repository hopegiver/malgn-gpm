export default {
    layout: 'default',
    data() {
        return {
            stats: {
                completed: 5,
                pending: 3,
                total: 8,
                avgScore: 82
            },
            teamMembers: [],
            showEvaluationModal: false,
            currentMember: null,
            evaluationForm: {
                goalScore: 0,
                competencyScore: 0,
                collaborationScore: 0,
                comments: ''
            }
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

        await this.loadEvaluationData();
    },
    methods: {
        async loadEvaluationData() {
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    lastEvaluationDate: '2023-12-15',
                    score: 88,
                    goalAchievement: 85,
                    grade: 'A',
                    gradeClass: 'success',
                    evaluated: true
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    lastEvaluationDate: '2023-12-15',
                    score: 75,
                    goalAchievement: 72,
                    grade: 'B',
                    gradeClass: 'primary',
                    evaluated: true
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    lastEvaluationDate: '-',
                    score: 0,
                    goalAchievement: 58,
                    grade: '-',
                    gradeClass: 'secondary',
                    evaluated: false
                }
            ];
        },

        startEvaluation(memberId) {
            this.currentMember = this.teamMembers.find(m => m.id === memberId);
            this.evaluationForm = {
                goalScore: 0,
                competencyScore: 0,
                collaborationScore: 0,
                comments: ''
            };
            this.showEvaluationModal = true;
        },

        closeEvaluationModal() {
            this.showEvaluationModal = false;
            this.currentMember = null;
        },

        async submitEvaluation() {
            if (!this.evaluationForm.goalScore || !this.evaluationForm.competencyScore || !this.evaluationForm.collaborationScore) {
                alert('모든 평가 항목을 입력해주세요.');
                return;
            }

            // TODO: API 호출
            alert('평가가 완료되었습니다.');
            this.closeEvaluationModal();
        },

        viewEvaluation(memberId) {
            this.navigateTo('/review/evaluation', { id: memberId });
        }
    }
};
