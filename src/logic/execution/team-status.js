export default {
    layout: 'default',
    data() {
        return {
            teamName: '',
            currentWeekStart: null, // 현재 선택된 주의 시작일 (월요일)
            stats: {
                weeklyCompletion: 73,
                weeklyTrend: 5,
                ongoingTasks: 28,
                completedTasks: 42,
                delayedTasks: 5
            },
            teamMembers: [],
            recentActivities: [],
            delayedTasks: [],
            weeklyProgressChart: null,
            taskDistributionChart: null
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
            window.location.hash = '#/dashboard/employee';
            return;
        }

        // 현재 주로 초기화
        this.currentWeekStart = this.getWeekStart(new Date());

        // 팀 정보 로드
        this.loadTeamInfo();

        // 데이터 로드
        await this.loadTeamStatusData();

        // 차트 초기화
        this.$nextTick(() => {
            this.initWeeklyProgressChart();
            this.initTaskDistributionChart();
        });
    },
    beforeUnmount() {
        // 차트 정리
        if (this.weeklyProgressChart) {
            this.weeklyProgressChart.destroy();
        }
        if (this.taskDistributionChart) {
            this.taskDistributionChart.destroy();
        }
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
            this.loadTeamStatusData();
        },

        // 다음 주로 이동
        nextWeek() {
            if (this.isCurrentWeek) return;
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(newDate.getDate() + 7);
            this.currentWeekStart = newDate;
            this.loadTeamStatusData();
        },

        // 오늘이 속한 주로 이동
        goToToday() {
            this.currentWeekStart = this.getWeekStart(new Date());
            this.loadTeamStatusData();
        },

        loadTeamInfo() {
            const user = window.getCurrentUser();
            if (user) {
                this.teamName = user.team || '프론트엔드';
            }
        },

        async loadTeamStatusData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/execution/team-status');

            // 임시 데모 데이터
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    todayCompleted: 4,
                    todayTotal: 5,
                    weeklyCompleted: 15,
                    weeklyTotal: 18,
                    completionRate: 83,
                    currentTask: '사용자 인증 API 개발',
                    status: '순조',
                    statusClass: 'success'
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    todayCompleted: 3,
                    todayTotal: 4,
                    weeklyCompleted: 12,
                    weeklyTotal: 15,
                    completionRate: 80,
                    currentTask: '대시보드 UI 개선',
                    status: '순조',
                    statusClass: 'success'
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    todayCompleted: 2,
                    todayTotal: 4,
                    weeklyCompleted: 8,
                    weeklyTotal: 14,
                    completionRate: 57,
                    currentTask: '데이터 마이그레이션',
                    status: '보통',
                    statusClass: 'warning'
                },
                {
                    id: 4,
                    name: '최서연',
                    initial: '최',
                    position: '개발자',
                    todayCompleted: 3,
                    todayTotal: 4,
                    weeklyCompleted: 13,
                    weeklyTotal: 16,
                    completionRate: 81,
                    currentTask: '코드 리뷰',
                    status: '순조',
                    statusClass: 'success'
                },
                {
                    id: 5,
                    name: '정동욱',
                    initial: '정',
                    position: '선임 개발자',
                    todayCompleted: 5,
                    todayTotal: 5,
                    weeklyCompleted: 17,
                    weeklyTotal: 19,
                    completionRate: 89,
                    currentTask: '성능 테스트 분석',
                    status: '우수',
                    statusClass: 'primary'
                },
                {
                    id: 6,
                    name: '강민지',
                    initial: '강',
                    position: '주니어 개발자',
                    todayCompleted: 1,
                    todayTotal: 3,
                    weeklyCompleted: 6,
                    weeklyTotal: 12,
                    completionRate: 50,
                    currentTask: '버그 수정',
                    status: '주의',
                    statusClass: 'danger'
                },
                {
                    id: 7,
                    name: '윤서진',
                    initial: '윤',
                    position: '개발자',
                    todayCompleted: 3,
                    todayTotal: 4,
                    weeklyCompleted: 11,
                    weeklyTotal: 15,
                    completionRate: 73,
                    currentTask: '문서 작성',
                    status: '순조',
                    statusClass: 'success'
                },
                {
                    id: 8,
                    name: '임태양',
                    initial: '임',
                    position: '선임 개발자',
                    todayCompleted: 4,
                    todayTotal: 5,
                    weeklyCompleted: 16,
                    weeklyTotal: 18,
                    completionRate: 89,
                    currentTask: '아키텍처 설계',
                    status: '우수',
                    statusClass: 'primary'
                }
            ];

            this.recentActivities = [
                {
                    id: 1,
                    memberName: '김민수',
                    action: '완료',
                    taskTitle: '사용자 로그인 기능 구현',
                    time: '10분 전',
                    typeClass: 'success'
                },
                {
                    id: 2,
                    memberName: '정동욱',
                    action: '시작',
                    taskTitle: '성능 테스트 시나리오 작성',
                    time: '25분 전',
                    typeClass: 'primary'
                },
                {
                    id: 3,
                    memberName: '이지은',
                    action: '완료',
                    taskTitle: '대시보드 레이아웃 조정',
                    time: '1시간 전',
                    typeClass: 'success'
                },
                {
                    id: 4,
                    memberName: '최서연',
                    action: '코멘트',
                    taskTitle: 'PR #234 코드 리뷰',
                    time: '1시간 전',
                    typeClass: 'info'
                },
                {
                    id: 5,
                    memberName: '임태양',
                    action: '완료',
                    taskTitle: '마이크로서비스 아키텍처 문서',
                    time: '2시간 전',
                    typeClass: 'success'
                },
                {
                    id: 6,
                    memberName: '박준호',
                    action: '시작',
                    taskTitle: '레거시 DB 마이그레이션',
                    time: '3시간 전',
                    typeClass: 'primary'
                }
            ];

            this.delayedTasks = [
                {
                    id: 1,
                    title: '결제 시스템 통합',
                    owner: '박준호',
                    dueDate: '2024-01-14',
                    daysDelayed: 2
                },
                {
                    id: 2,
                    title: '모바일 반응형 수정',
                    owner: '강민지',
                    dueDate: '2024-01-13',
                    daysDelayed: 3
                },
                {
                    id: 3,
                    title: '이메일 알림 기능',
                    owner: '윤서진',
                    dueDate: '2024-01-15',
                    daysDelayed: 1
                }
            ];
        },

        initWeeklyProgressChart() {
            const ctx = this.$refs.weeklyProgressChart;
            if (!ctx) return;

            this.weeklyProgressChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['월', '화', '수', '목', '금'],
                    datasets: [
                        {
                            label: '계획',
                            data: [15, 30, 45, 60, 75],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.4,
                            borderWidth: 2
                        },
                        {
                            label: '실제',
                            data: [12, 28, 42, 58, 73],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12,
                                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", Roboto'
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        },

        initTaskDistributionChart() {
            const ctx = this.$refs.taskDistributionChart;
            if (!ctx) return;

            this.taskDistributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['완료', '진행중', '지연', '대기'],
                    datasets: [{
                        data: [42, 28, 5, 12],
                        backgroundColor: [
                            '#10b981',
                            '#6366f1',
                            '#ef4444',
                            '#94a3b8'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 10,
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        },

        viewMemberDetail(memberId) {
            // TODO: 팀원 상세 페이지로 이동
            window.location.hash = `#/team/member/${memberId}`;
        },

        getProgressClass(value) {
            if (value >= 80) return 'success';
            if (value >= 60) return 'primary';
            if (value >= 40) return 'warning';
            return 'danger';
        }
    }
};
