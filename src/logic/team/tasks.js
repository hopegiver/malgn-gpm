export default {
    layout: 'default',
    data() {
        return {
            teamName: '',
            stats: {
                totalTasks: 33,
                completedTasks: 23,
                inProgressTasks: 10,
                avgCompletion: 73
            },
            teamMembers: []
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

        // 팀 정보 로드
        this.loadTeamInfo();

        // 데이터 로드
        await this.loadTeamTasksData();
    },
    methods: {
        loadTeamInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.teamName = user.team || '프론트엔드';
            }
        },

        async loadTeamTasksData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/team/tasks');

            // 임시 데모 데이터
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    todayCompleted: 4,
                    todayTotal: 5,
                    completionRate: 80,
                    status: '순조',
                    statusClass: 'success',
                    todayTasks: [
                        { id: 1, title: '사용자 로그인 API 구현', completed: true },
                        { id: 2, title: '토큰 갱신 로직 개발', completed: true },
                        { id: 3, title: '권한 검증 미들웨어 작성', completed: true },
                        { id: 4, title: 'API 문서 작성', completed: true },
                        { id: 5, title: '단위 테스트 작성', completed: false }
                    ]
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    todayCompleted: 3,
                    todayTotal: 4,
                    completionRate: 75,
                    status: '순조',
                    statusClass: 'success',
                    todayTasks: [
                        { id: 1, title: '대시보드 레이아웃 조정', completed: true },
                        { id: 2, title: '차트 컴포넌트 개선', completed: true },
                        { id: 3, title: '반응형 디자인 적용', completed: true },
                        { id: 4, title: '다크모드 테스트', completed: false }
                    ]
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    todayCompleted: 2,
                    todayTotal: 4,
                    completionRate: 50,
                    status: '보통',
                    statusClass: 'warning',
                    todayTasks: [
                        { id: 1, title: '마이그레이션 스크립트 작성', completed: true },
                        { id: 2, title: '테스트 환경 데이터 이관', completed: true },
                        { id: 3, title: '데이터 검증', completed: false },
                        { id: 4, title: '롤백 시나리오 준비', completed: false }
                    ]
                },
                {
                    id: 4,
                    name: '최서연',
                    initial: '최',
                    position: '개발자',
                    todayCompleted: 3,
                    todayTotal: 4,
                    completionRate: 75,
                    status: '순조',
                    statusClass: 'success',
                    todayTasks: [
                        { id: 1, title: 'PR #234 코드 리뷰', completed: true },
                        { id: 2, title: 'PR #235 코드 리뷰', completed: true },
                        { id: 3, title: '리팩토링 제안 작성', completed: true },
                        { id: 4, title: '코딩 컨벤션 문서 업데이트', completed: false }
                    ]
                },
                {
                    id: 5,
                    name: '정동욱',
                    initial: '정',
                    position: '선임 개발자',
                    todayCompleted: 5,
                    todayTotal: 5,
                    completionRate: 100,
                    status: '우수',
                    statusClass: 'primary',
                    todayTasks: [
                        { id: 1, title: '성능 테스트 시나리오 작성', completed: true },
                        { id: 2, title: '부하 테스트 실행', completed: true },
                        { id: 3, title: '병목 구간 분석', completed: true },
                        { id: 4, title: '최적화 방안 문서화', completed: true },
                        { id: 5, title: '팀 공유 세션 준비', completed: true }
                    ]
                },
                {
                    id: 6,
                    name: '강민지',
                    initial: '강',
                    position: '주니어 개발자',
                    todayCompleted: 1,
                    todayTotal: 3,
                    completionRate: 33,
                    status: '주의',
                    statusClass: 'danger',
                    todayTasks: [
                        { id: 1, title: '회원가입 폼 유효성 검사 버그 수정', completed: true },
                        { id: 2, title: '이미지 업로드 에러 처리', completed: false },
                        { id: 3, title: '모바일 UI 깨짐 수정', completed: false }
                    ]
                },
                {
                    id: 7,
                    name: '윤서진',
                    initial: '윤',
                    position: '개발자',
                    todayCompleted: 3,
                    todayTotal: 4,
                    completionRate: 75,
                    status: '순조',
                    statusClass: 'success',
                    todayTasks: [
                        { id: 1, title: 'API 명세서 작성', completed: true },
                        { id: 2, title: '배포 가이드 업데이트', completed: true },
                        { id: 3, title: '트러블슈팅 가이드 작성', completed: true },
                        { id: 4, title: '릴리스 노트 작성', completed: false }
                    ]
                },
                {
                    id: 8,
                    name: '임태양',
                    initial: '임',
                    position: '선임 개발자',
                    todayCompleted: 4,
                    todayTotal: 5,
                    completionRate: 80,
                    status: '우수',
                    statusClass: 'primary',
                    todayTasks: [
                        { id: 1, title: '마이크로서비스 아키텍처 설계', completed: true },
                        { id: 2, title: 'API 게이트웨이 구조 설계', completed: true },
                        { id: 3, title: '데이터베이스 스키마 설계', completed: true },
                        { id: 4, title: '기술 스택 검토', completed: true },
                        { id: 5, title: '아키텍처 문서 작성', completed: false }
                    ]
                }
            ];

            // 통계 계산
            this.calculateStats();
        },

        calculateStats() {
            let totalTasks = 0;
            let completedTasks = 0;

            this.teamMembers.forEach(member => {
                totalTasks += member.todayTotal;
                completedTasks += member.todayCompleted;
            });

            this.stats.totalTasks = totalTasks;
            this.stats.completedTasks = completedTasks;
            this.stats.inProgressTasks = totalTasks - completedTasks;
            this.stats.avgCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        },

        viewMemberDetail(memberId) {
            // TODO: 팀원 상세 페이지로 이동
            this.navigateTo('/team/member', { id: memberId });
        },

        getProgressClass(value) {
            if (value >= 80) return 'success';
            if (value >= 60) return 'primary';
            if (value >= 40) return 'warning';
            return 'danger';
        }
    }
};
