export default {
    layout: 'default',
    data() {
        return {
            stats: {
                monthlyFeedback: 24,
                pendingFeedback: 3,
                responseRate: 92
            },
            teamMembers: [],
            recentFeedback: [],
            showFeedbackModal: false,
            feedbackForm: {
                memberId: '',
                type: 'positive',
                content: ''
            }
        };
    },
    async mounted() {
        const user = window.getCurrentUser();
        if (!user || !user.roles ||
            (!user.roles.includes(window.ROLES.DEPT_HEAD) &&
             !user.roles.includes(window.ROLES.TEAM_LEADER))) {
            alert('팀장만 접근할 수 있습니다.');
            window.location.hash = '#/dashboard/employee';
            return;
        }

        await this.loadFeedbackData();
    },
    methods: {
        async loadFeedbackData() {
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    monthlyFeedback: 3,
                    totalFeedback: 18,
                    lastFeedbackDate: '2024-01-10'
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    monthlyFeedback: 2,
                    totalFeedback: 14,
                    lastFeedbackDate: '2024-01-08'
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    monthlyFeedback: 4,
                    totalFeedback: 12,
                    lastFeedbackDate: '2024-01-15'
                }
            ];

            this.recentFeedback = [
                {
                    id: 1,
                    memberName: '김민수',
                    date: '2024-01-10',
                    type: '긍정적',
                    typeClass: 'success',
                    content: '이번 주 코드 리뷰에서 좋은 개선 제안을 해주셨습니다. 계속 이런 적극적인 태도 부탁드립니다!'
                },
                {
                    id: 2,
                    memberName: '박준호',
                    date: '2024-01-15',
                    type: '코칭',
                    typeClass: 'primary',
                    content: '기술 문서 작성 시 더 구체적인 예시를 포함하면 좋을 것 같습니다.'
                }
            ];
        },

        openFeedbackModal() {
            this.feedbackForm = {
                memberId: '',
                type: 'positive',
                content: ''
            };
            this.showFeedbackModal = true;
        },

        closeFeedbackModal() {
            this.showFeedbackModal = false;
        },

        giveFeedback(memberId) {
            this.feedbackForm.memberId = memberId;
            this.showFeedbackModal = true;
        },

        async submitFeedback() {
            if (!this.feedbackForm.memberId) {
                alert('대상 팀원을 선택해주세요.');
                return;
            }
            if (!this.feedbackForm.content.trim()) {
                alert('피드백 내용을 입력해주세요.');
                return;
            }

            // TODO: API 호출
            alert('피드백이 전달되었습니다.');
            this.closeFeedbackModal();
        }
    }
};
