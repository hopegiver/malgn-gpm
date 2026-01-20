export default {
    layout: 'default',
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
            // const data = await this.$api.get('/api/goals/company');

            // mock-api에서 데이터 로드 (회사 목표 = 회사 KPI)
            try {
                const response = await fetch('/mock-api/company-goals.json');
                this.companyKPIs = await response.json();
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                this.companyKPIs = [];
            }
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
