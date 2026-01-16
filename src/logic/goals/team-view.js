export default {
    layout: 'employee',
    data() {
        return {
            teamKPIs: [],
            selectedCategory: 'all',
            teamStats: {
                total: 0,
                achieved: 0,
                warning: 0,
                avgAchievement: 0
            }
        };
    },
    computed: {
        filteredKPIs() {
            if (this.selectedCategory === 'all') {
                return this.teamKPIs;
            }
            return this.teamKPIs.filter(kpi => kpi.category === this.selectedCategory);
        }
    },
    async mounted() {
        await this.loadTeamKPIs();
        this.calculateStats();
    },
    methods: {
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

        calculateStats() {
            this.teamStats.total = this.teamKPIs.length;
            this.teamStats.achieved = this.teamKPIs.filter(kpi => kpi.achievement >= 70).length;
            this.teamStats.warning = this.teamKPIs.filter(kpi => kpi.achievement >= 40 && kpi.achievement < 70).length;

            const totalAchievement = this.teamKPIs.reduce((sum, kpi) => sum + kpi.achievement, 0);
            this.teamStats.avgAchievement = this.teamKPIs.length > 0
                ? Math.round(totalAchievement / this.teamKPIs.length)
                : 0;
        },

        getCategoryCount(category) {
            return this.teamKPIs.filter(kpi => kpi.category === category).length;
        },

        getSignalClass(value) {
            if (value >= 70) return 'green';
            if (value >= 40) return 'yellow';
            return 'red';
        },

        getCategoryBadgeClass(category) {
            switch (category) {
                case '재무':
                    return 'bg-success';
                case '고객':
                    return 'bg-primary';
                case '프로세스':
                    return 'bg-info';
                case '학습과성장':
                    return 'bg-warning';
                default:
                    return 'bg-secondary';
            }
        }
    }
};
