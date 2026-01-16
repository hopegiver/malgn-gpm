export default {
    layout: 'default',
    data() {
        return {
            stats: {
                ongoingLearning: 12,
                completedLearning: 28,
                avgLearningHours: 8.5
            },
            teamMembers: [],
            recommendedCourses: [],
            recentActivities: []
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

        await this.loadGrowthData();
    },
    methods: {
        async loadGrowthData() {
            this.teamMembers = [
                {
                    id: 1,
                    name: '김민수',
                    initial: '김',
                    position: '선임 개발자',
                    ongoingCourses: 2,
                    completedCourses: 8,
                    competencyScore: 85,
                    focusArea: 'React Advanced'
                },
                {
                    id: 2,
                    name: '이지은',
                    initial: '이',
                    position: '개발자',
                    ongoingCourses: 1,
                    completedCourses: 5,
                    competencyScore: 72,
                    focusArea: 'TypeScript'
                },
                {
                    id: 3,
                    name: '박준호',
                    initial: '박',
                    position: '주니어 개발자',
                    ongoingCourses: 3,
                    completedCourses: 2,
                    competencyScore: 58,
                    focusArea: 'JavaScript 기초'
                }
            ];

            this.recommendedCourses = [
                {
                    id: 1,
                    title: 'React 18 마스터하기',
                    description: 'React 18의 새로운 기능과 패턴을 학습합니다',
                    category: '프론트엔드',
                    categoryClass: 'primary',
                    duration: '8주',
                    recommendedFor: '중급 이상'
                },
                {
                    id: 2,
                    title: 'TypeScript 실전 가이드',
                    description: 'TypeScript를 실무에서 효과적으로 활용하는 방법',
                    category: '프로그래밍',
                    categoryClass: 'success',
                    duration: '6주',
                    recommendedFor: '초급~중급'
                },
                {
                    id: 3,
                    title: '클린 코드 작성법',
                    description: '읽기 쉽고 유지보수하기 좋은 코드 작성',
                    category: '코드품질',
                    categoryClass: 'warning',
                    duration: '4주',
                    recommendedFor: '모든 레벨'
                }
            ];

            this.recentActivities = [
                {
                    id: 1,
                    title: 'React 스터디 그룹 생성',
                    description: '팀원 4명이 참여하여 주간 스터디 진행 중',
                    date: '2일 전'
                },
                {
                    id: 2,
                    title: '김민수님 TypeScript 자격증 취득',
                    description: 'Microsoft TypeScript Certification',
                    date: '1주 전'
                }
            ];
        },

        viewMemberGrowth(memberId) {
            window.location.hash = `#/team/member/${memberId}/growth`;
        },

        recommendCourse(courseId) {
            alert('팀원에게 추천 기능은 준비 중입니다.');
        }
    }
};
