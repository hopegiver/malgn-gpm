export default {
    layout: 'default',
    data() {
        return {
            stats: {
                monthlyMeetings: 8,
                upcomingMeetings: 3,
                avgFrequency: 2
            },
            teamMembers: [],
            upcomingMeetings: [],
            meetingHistory: [],
            showScheduleModal: false,
            scheduleForm: {
                memberId: '',
                date: '',
                time: '',
                agenda: ''
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

        await this.loadMeetingData();
    },
    methods: {
        async loadMeetingData() {
            this.teamMembers = [
                { id: 1, name: '김민수' },
                { id: 2, name: '이지은' },
                { id: 3, name: '박준호' }
            ];

            this.upcomingMeetings = [
                {
                    id: 1,
                    memberName: '김민수',
                    date: '2024-01-18',
                    time: '14:00',
                    agenda: 'Q1 목표 진행 상황 점검 및 애로사항 논의'
                },
                {
                    id: 2,
                    memberName: '이지은',
                    date: '2024-01-19',
                    time: '10:00',
                    agenda: '커리어 개발 계획 수립'
                },
                {
                    id: 3,
                    memberName: '박준호',
                    date: '2024-01-20',
                    time: '15:00',
                    agenda: '온보딩 진행 상황 점검'
                }
            ];

            this.meetingHistory = [
                {
                    id: 4,
                    memberName: '김민수',
                    date: '2024-01-10',
                    agenda: '12월 성과 리뷰'
                },
                {
                    id: 5,
                    memberName: '정동욱',
                    date: '2024-01-09',
                    agenda: '프로젝트 리더십 코칭'
                }
            ];
        },

        openScheduleModal() {
            this.scheduleForm = {
                memberId: '',
                date: '',
                time: '',
                agenda: ''
            };
            this.showScheduleModal = true;
        },

        closeScheduleModal() {
            this.showScheduleModal = false;
        },

        async scheduleMeeting() {
            if (!this.scheduleForm.memberId || !this.scheduleForm.date || !this.scheduleForm.time) {
                alert('모든 필수 항목을 입력해주세요.');
                return;
            }

            // TODO: API 호출
            alert('미팅이 예약되었습니다.');
            this.closeScheduleModal();
        },

        editMeeting(meetingId) {
            alert('미팅 수정 기능은 준비 중입니다.');
        },

        cancelMeeting(meetingId) {
            if (confirm('미팅을 취소하시겠습니까?')) {
                // TODO: API 호출
                const index = this.upcomingMeetings.findIndex(m => m.id === meetingId);
                if (index > -1) {
                    this.upcomingMeetings.splice(index, 1);
                }
            }
        },

        viewMeetingNotes(meetingId) {
            window.location.hash = `#/team/meeting/${meetingId}`;
        }
    }
};
