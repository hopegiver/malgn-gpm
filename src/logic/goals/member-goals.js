export default {
    layout: 'default',
    data() {
        return {
            memberId: null,
            memberName: '',
            memberInitial: '',
            memberPosition: '',
            memberTeam: '',
            avgAchievement: 0,
            stats: {
                totalGoals: 0,
                activeGoals: 0,
                completedGoals: 0,
                delayedGoals: 0
            },
            memberGoals: [],
            teamGoals: [],
            recentUpdates: []
        };
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

        // URL에서 팀원 ID 추출
        this.memberId = this.getParam('id');
        if (!this.memberId) {
            alert('팀원 ID가 유효하지 않습니다.');
            this.navigateTo('/goals/team-goals');
            return;
        }

        // 데이터 로드
        await this.loadMemberGoalsData();
    },
    methods: {

        async loadMemberGoalsData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get(`/api/goals/member/${this.memberId}`);

            // 팀원 정보 (임시 데이터)
            const memberData = {
                1: { name: '김민수', initial: '김', position: '선임 개발자', team: '프론트엔드팀', avgAchievement: 85 },
                2: { name: '이지은', initial: '이', position: '개발자', team: '프론트엔드팀', avgAchievement: 72 },
                3: { name: '박준호', initial: '박', position: '주니어 개발자', team: '프론트엔드팀', avgAchievement: 65 },
                4: { name: '최서연', initial: '최', position: '개발자', team: '프론트엔드팀', avgAchievement: 78 },
                5: { name: '정동욱', initial: '정', position: '선임 개발자', team: '프론트엔드팀', avgAchievement: 82 },
                6: { name: '강민지', initial: '강', position: '주니어 개발자', team: '프론트엔드팀', avgAchievement: 58 },
                7: { name: '윤서진', initial: '윤', position: '개발자', team: '프론트엔드팀', avgAchievement: 76 },
                8: { name: '임태양', initial: '임', position: '선임 개발자', team: '프론트엔드팀', avgAchievement: 88 }
            };

            const member = memberData[this.memberId];
            if (!member) {
                alert('팀원 정보를 찾을 수 없습니다.');
                this.navigateTo('/goals/team-goals');
                return;
            }

            this.memberName = member.name;
            this.memberInitial = member.initial;
            this.memberPosition = member.position;
            this.memberTeam = member.team;
            this.avgAchievement = member.avgAchievement;

            // 팀 목표 데이터
            this.teamGoals = [
                { id: 1, title: 'Q1 신규 기능 개발 완료' },
                { id: 2, title: '코드 품질 개선 프로젝트' },
                { id: 3, title: '성능 최적화' },
                { id: 4, title: '팀 프로세스 개선' },
                { id: 5, title: '기술 문서화' }
            ];

            // 팀원 목표 데이터 (임시 데모 데이터)
            this.memberGoals = [
                {
                    id: 1,
                    title: '사용자 인증 시스템 고도화',
                    description: 'OAuth 2.0 및 2FA 인증 구현',
                    teamGoalId: 1,
                    startDate: '2024-01-01',
                    dueDate: '2024-03-31',
                    achievement: 75,
                    status: '진행중',
                    keyResults: [
                        { id: 1, title: 'OAuth 2.0 인증 구현', completed: true },
                        { id: 2, title: '2FA 인증 시스템 개발', completed: true },
                        { id: 3, title: '보안 테스트 완료', completed: false }
                    ]
                },
                {
                    id: 2,
                    title: '대시보드 UI/UX 개선',
                    description: '사용자 경험 향상을 위한 인터페이스 개선',
                    teamGoalId: 1,
                    startDate: '2024-02-01',
                    dueDate: '2024-04-30',
                    achievement: 60,
                    status: '진행중',
                    keyResults: [
                        { id: 1, title: '사용자 리서치 완료', completed: true },
                        { id: 2, title: '프로토타입 디자인', completed: true },
                        { id: 3, title: 'UI 컴포넌트 구현', completed: false },
                        { id: 4, title: '사용자 테스트', completed: false }
                    ]
                },
                {
                    id: 3,
                    title: '코드 리뷰 프로세스 개선',
                    description: '코드 품질 향상을 위한 리뷰 가이드라인 작성',
                    teamGoalId: 2,
                    startDate: '2024-01-15',
                    dueDate: '2024-03-15',
                    achievement: 90,
                    status: '진행중',
                    keyResults: [
                        { id: 1, title: '리뷰 가이드라인 작성', completed: true },
                        { id: 2, title: '팀 교육 실시', completed: true },
                        { id: 3, title: '리뷰 프로세스 적용', completed: true }
                    ]
                },
                {
                    id: 4,
                    title: 'TypeScript 마이그레이션',
                    description: '레거시 JavaScript 코드를 TypeScript로 전환',
                    teamGoalId: 2,
                    startDate: '2024-01-01',
                    dueDate: '2024-06-30',
                    achievement: 35,
                    status: '진행중',
                    keyResults: [
                        { id: 1, title: '타입 정의 파일 작성', completed: true },
                        { id: 2, title: '핵심 모듈 마이그레이션', completed: false },
                        { id: 3, title: '전체 코드베이스 변환', completed: false }
                    ]
                },
                {
                    id: 5,
                    title: 'Vue 3 학습 및 적용',
                    description: 'Vue 3 Composition API 학습 및 프로젝트 적용',
                    teamGoalId: null,
                    startDate: '2023-12-01',
                    dueDate: '2024-02-28',
                    achievement: 100,
                    status: '완료',
                    keyResults: [
                        { id: 1, title: 'Vue 3 공식 문서 학습', completed: true },
                        { id: 2, title: '샘플 프로젝트 구현', completed: true },
                        { id: 3, title: '팀 공유 세션', completed: true }
                    ]
                }
            ];

            // 통계 계산
            this.stats.totalGoals = this.memberGoals.length;
            this.stats.activeGoals = this.memberGoals.filter(g => g.status === '진행중').length;
            this.stats.completedGoals = this.memberGoals.filter(g => g.status === '완료').length;
            this.stats.delayedGoals = this.memberGoals.filter(g => g.status === '지연').length;

            // 최근 업데이트
            this.recentUpdates = [
                {
                    id: 1,
                    goalTitle: '사용자 인증 시스템 고도화',
                    content: '2FA 인증 시스템 개발 완료',
                    time: '2시간 전',
                    typeClass: 'success'
                },
                {
                    id: 2,
                    goalTitle: '대시보드 UI/UX 개선',
                    content: '프로토타입 디자인 검토 완료',
                    time: '1일 전',
                    typeClass: 'primary'
                },
                {
                    id: 3,
                    goalTitle: 'TypeScript 마이그레이션',
                    content: '타입 정의 파일 작성 시작',
                    time: '3일 전',
                    typeClass: 'info'
                }
            ];
        },

        goBack() {
            this.navigateTo('/goals/team-goals');
        },

        getTeamGoalTitle(teamGoalId) {
            const teamGoal = this.teamGoals.find(tg => tg.id === teamGoalId);
            return teamGoal ? teamGoal.title : '';
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
