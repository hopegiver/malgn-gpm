export default {
    layout: 'employee',
    data() {
        return {
            companyKPIs: [],
            companyStats: {
                total: 0,
                achieved: 0,
                warning: 0,
                avgAchievement: 0
            }
        };
    },
    computed: {
        financialKPIs() {
            return this.companyKPIs.filter(kpi => kpi.category === '재무');
        },
        customerKPIs() {
            return this.companyKPIs.filter(kpi => kpi.category === '고객');
        },
        processKPIs() {
            return this.companyKPIs.filter(kpi => kpi.category === '프로세스');
        },
        learningKPIs() {
            return this.companyKPIs.filter(kpi => kpi.category === '학습과성장');
        }
    },
    async mounted() {
        await this.loadCompanyKPIs();
        this.calculateStats();
    },
    methods: {
        async loadCompanyKPIs() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/kpis/company');

            // 2026년도 맑은소프트 KPI (BSC 기반)
            this.companyKPIs = [
                // 재무 관점
                { id: 1, title: '[재무] 총매출액 90억 원 달성', category: '재무', achievement: 68 },
                { id: 2, title: '[재무] 신규 고객 200개사 확보', category: '재무', achievement: 55 },
                { id: 3, title: '[재무] 영업 이익률 20% 이상', category: '재무', achievement: 72 },
                // 고객 관점
                { id: 4, title: '[고객] 고객 유지율 90% 이상', category: '고객', achievement: 85 },
                { id: 5, title: '[고객] 고객 만족도 85점 이상', category: '고객', achievement: 82 },
                { id: 6, title: '[고객] 신규 서비스 생성 달별 2~3건', category: '고객', achievement: 78 },
                // 프로세스 관점
                { id: 7, title: '[프로세스] AI 프로세스 전환율 30% 이상', category: '프로세스', achievement: 45 },
                { id: 8, title: '[프로세스] 시스템 가용성 99.9% 이상', category: '프로세스', achievement: 95 },
                { id: 9, title: '[프로세스] 핵심 매뉴얼 정산율 100%', category: '프로세스', achievement: 88 },
                // 학습과성장 관점
                { id: 10, title: '[학습] 직원 1인당 교육시간 연 50시간', category: '학습과성장', achievement: 60 },
                { id: 11, title: '[학습] 리더십 교육 참여율 100%', category: '학습과성장', achievement: 92 },
                { id: 12, title: '[학습] AI 활용 역량 향상율 20% 이상', category: '학습과성장', achievement: 52 }
            ];
        },

        calculateStats() {
            this.companyStats.total = this.companyKPIs.length;
            this.companyStats.achieved = this.companyKPIs.filter(kpi => kpi.achievement >= 70).length;
            this.companyStats.warning = this.companyKPIs.filter(kpi => kpi.achievement >= 40 && kpi.achievement < 70).length;

            const totalAchievement = this.companyKPIs.reduce((sum, kpi) => sum + kpi.achievement, 0);
            this.companyStats.avgAchievement = this.companyKPIs.length > 0
                ? Math.round(totalAchievement / this.companyKPIs.length)
                : 0;
        },

        getCategoryCount(category) {
            return this.companyKPIs.filter(kpi => kpi.category === category).length;
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
