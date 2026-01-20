export default {
    layout: 'default',
    data() {
        return {
            teamName: '',
            currentWeekStart: null, // 현재 선택된 주의 시작일 (월요일)
            stats: {
                submittedCount: 7,
                totalMembers: 8,
                feedbackCount: 5,
                pendingFeedback: 2,
                avgAchievement: 78
            },
            weeklyReports: [],
            editingFeedback: null,
            feedbackText: ''
        };
    },
    computed: {
        // 현재 주 표시 (예: "2024년 1월 3주차")
        currentWeekDisplay() {
            if (!this.currentWeekStart) return '';
            const date = new Date(this.currentWeekStart);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const weekOfMonth = Math.ceil(date.getDate() / 7);
            return `${year}년 ${month}월 ${weekOfMonth}주차`;
        },
        // 주간 날짜 범위 (예: "1/15 ~ 1/21")
        weekRangeDisplay() {
            if (!this.currentWeekStart) return '';
            const start = new Date(this.currentWeekStart);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);

            const formatDate = (date) => {
                return `${date.getMonth() + 1}/${date.getDate()}`;
            };

            return `${formatDate(start)} ~ ${formatDate(end)}`;
        },
        // 현재 주인지 확인
        isCurrentWeek() {
            if (!this.currentWeekStart) return true;
            const today = new Date();
            const currentWeekStart = this.getWeekStart(today);
            return this.currentWeekStart.getTime() === currentWeekStart.getTime();
        }
    },
    async mounted() {
        // 팀장 권한 체크
        const user = window.getCurrentUser();
        if (!user || !user.roles ||
            (!user.roles.includes(window.ROLES.DEPT_HEAD) &&
             !user.roles.includes(window.ROLES.TEAM_LEADER))) {
            alert('팀장만 접근할 수 있습니다.');
            this.navigateTo('/dashboard/employee');
            return;
        }

        // 현재 주로 초기화
        this.currentWeekStart = this.getWeekStart(new Date());

        // 팀 정보 로드
        this.loadTeamInfo();

        // 데이터 로드
        await this.loadWeeklyReports();
    },
    methods: {
        // 주의 시작일(월요일) 계산
        getWeekStart(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
            return new Date(d.setDate(diff));
        },

        // 이전 주로 이동
        previousWeek() {
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(newDate.getDate() - 7);
            this.currentWeekStart = newDate;
            this.loadWeeklyReports();
        },

        // 다음 주로 이동
        nextWeek() {
            if (this.isCurrentWeek) return;
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(newDate.getDate() + 7);
            this.currentWeekStart = newDate;
            this.loadWeeklyReports();
        },

        // 오늘이 속한 주로 이동
        goToToday() {
            this.currentWeekStart = this.getWeekStart(new Date());
            this.loadWeeklyReports();
        },

        loadTeamInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.teamName = user.team || '프론트엔드';
            }
        },

        async loadWeeklyReports() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/team/weekly-reports', { week: this.currentWeekStart });

            // 임시 데모 데이터
            this.weeklyReports = [
                {
                    id: 1,
                    memberId: 1,
                    memberName: '김민수',
                    memberInitial: '김',
                    position: '선임 개발자',
                    achievement: 85,
                    completedTasks: 17,
                    totalTasks: 20,
                    issueCount: 0,
                    achievements: '사용자 인증 시스템 구현 완료, API 문서 작성 완료, 단위 테스트 커버리지 90% 달성',
                    issues: '',
                    status: '제출완료',
                    submittedAt: '2024-01-19 17:30',
                    feedback: '이번 주 목표를 잘 달성했습니다. 특히 테스트 커버리지 개선이 인상적이네요. 다음 주에는 성능 최적화에도 시간을 할애해 주세요.',
                    feedbackAt: '2024-01-19 18:00'
                },
                {
                    id: 2,
                    memberId: 2,
                    memberName: '이지은',
                    memberInitial: '이',
                    position: '개발자',
                    achievement: 80,
                    completedTasks: 12,
                    totalTasks: 15,
                    issueCount: 1,
                    achievements: '대시보드 UI 개선 완료, 차트 컴포넌트 리팩토링',
                    issues: '다크모드 적용 시 일부 컴포넌트 스타일 이슈 발생',
                    status: '제출완료',
                    submittedAt: '2024-01-19 16:45',
                    feedback: '대시보드 개선 작업 잘 마무리했습니다. 다크모드 이슈는 다음 주 초에 함께 리뷰하도록 하겠습니다.',
                    feedbackAt: '2024-01-19 17:30'
                },
                {
                    id: 3,
                    memberId: 3,
                    memberName: '박준호',
                    memberInitial: '박',
                    position: '주니어 개발자',
                    achievement: 60,
                    completedTasks: 9,
                    totalTasks: 15,
                    issueCount: 2,
                    achievements: '마이그레이션 스크립트 작성, 테스트 환경 데이터 이관',
                    issues: '데이터 검증 과정에서 예상치 못한 이슈 발생으로 일정 지연',
                    status: '제출완료',
                    submittedAt: '2024-01-19 18:00',
                    feedback: '',
                    feedbackAt: ''
                },
                {
                    id: 4,
                    memberId: 4,
                    memberName: '최서연',
                    memberInitial: '최',
                    position: '개발자',
                    achievement: 82,
                    completedTasks: 14,
                    totalTasks: 17,
                    issueCount: 0,
                    achievements: '코드 리뷰 20건 완료, 리팩토링 제안서 작성, 코딩 컨벤션 문서 업데이트',
                    issues: '',
                    status: '제출완료',
                    submittedAt: '2024-01-19 15:20',
                    feedback: '코드 리뷰 참여도가 높아 팀 전체 코드 품질 향상에 기여했습니다. 계속해서 좋은 활동 부탁드립니다.',
                    feedbackAt: '2024-01-19 16:00'
                },
                {
                    id: 5,
                    memberId: 5,
                    memberName: '정동욱',
                    memberInitial: '정',
                    position: '선임 개발자',
                    achievement: 90,
                    completedTasks: 18,
                    totalTasks: 20,
                    issueCount: 0,
                    achievements: '성능 테스트 완료 및 최적화 방안 도출, 병목 구간 개선으로 응답속도 30% 향상',
                    issues: '',
                    status: '제출완료',
                    submittedAt: '2024-01-19 17:00',
                    feedback: '성능 개선 작업이 매우 훌륭했습니다. 팀 공유 세션에서 노하우를 공유해 주시면 좋겠습니다.',
                    feedbackAt: '2024-01-19 17:45'
                },
                {
                    id: 6,
                    memberId: 6,
                    memberName: '강민지',
                    memberInitial: '강',
                    position: '주니어 개발자',
                    achievement: 55,
                    completedTasks: 7,
                    totalTasks: 13,
                    issueCount: 3,
                    achievements: '회원가입 폼 버그 수정',
                    issues: '이미지 업로드 에러 처리 어려움, 모바일 UI 깨짐 해결 중',
                    status: '제출완료',
                    submittedAt: '2024-01-19 18:30',
                    feedback: '',
                    feedbackAt: ''
                },
                {
                    id: 7,
                    memberId: 7,
                    memberName: '윤서진',
                    memberInitial: '윤',
                    position: '개발자',
                    achievement: 75,
                    completedTasks: 11,
                    totalTasks: 15,
                    issueCount: 0,
                    achievements: 'API 명세서 작성, 배포 가이드 업데이트, 트러블슈팅 가이드 작성',
                    issues: '',
                    status: '제출완료',
                    submittedAt: '2024-01-19 16:00',
                    feedback: '문서화 작업을 꼼꼼하게 진행해주셨네요. 신규 멤버 온보딩에 큰 도움이 될 것 같습니다.',
                    feedbackAt: '2024-01-19 17:00'
                }
            ];

            // 통계 계산
            this.calculateStats();
        },

        calculateStats() {
            this.stats.submittedCount = this.weeklyReports.length;
            this.stats.feedbackCount = this.weeklyReports.filter(r => r.feedback).length;
            this.stats.pendingFeedback = this.stats.submittedCount - this.stats.feedbackCount;

            const totalAchievement = this.weeklyReports.reduce((sum, r) => sum + r.achievement, 0);
            this.stats.avgAchievement = this.weeklyReports.length > 0
                ? Math.round(totalAchievement / this.weeklyReports.length)
                : 0;
        },

        openFeedbackForm(reportId, existingFeedback) {
            this.editingFeedback = reportId;
            this.feedbackText = existingFeedback || '';
        },

        cancelFeedback() {
            this.editingFeedback = null;
            this.feedbackText = '';
        },

        async saveFeedback(reportId) {
            if (!this.feedbackText.trim()) {
                alert('피드백 내용을 입력해주세요.');
                return;
            }

            // TODO: 실제 API 호출로 대체
            // await this.$api.post(`/api/team/weekly-reports/${reportId}/feedback`, {
            //     feedback: this.feedbackText
            // });

            // 임시로 로컬 데이터 업데이트
            const report = this.weeklyReports.find(r => r.id === reportId);
            if (report) {
                report.feedback = this.feedbackText;
                report.feedbackAt = new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            this.calculateStats();
            this.cancelFeedback();
        },

        viewReportDetail(reportId) {
            // TODO: 보고서 상세 페이지로 이동
            this.navigateTo('/team/weekly-report', { id: reportId });
        },

        getStatusBadgeClass(status) {
            switch (status) {
                case '제출완료':
                    return 'success';
                case '작성중':
                    return 'warning';
                case '미제출':
                    return 'danger';
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
