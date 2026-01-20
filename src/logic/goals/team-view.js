export default {
    layout: 'default',
    data() {
        return {
            teamKPIs: [],
            teamStats: {
                total: 0,
                achieved: 0,
                warning: 0,
                avgAchievement: 0
            }
        };
    },
    computed: {
        financialKPIs() {
            return this.teamKPIs.filter(kpi => kpi.category === '재무');
        },
        customerKPIs() {
            return this.teamKPIs.filter(kpi => kpi.category === '고객');
        },
        processKPIs() {
            return this.teamKPIs.filter(kpi => kpi.category === '프로세스');
        },
        learningKPIs() {
            return this.teamKPIs.filter(kpi => kpi.category === '학습과성장');
        }
    },
    async mounted() {
        await this.loadTeamKPIs();
        this.calculateStats();
    },
    methods: {
        async loadTeamKPIs() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/goals/team');

            // mock-api에서 데이터 로드 (팀 목표 = 팀 KPI)
            try {
                const response = await fetch('/mock-api/team-goals.json');
                this.teamKPIs = await response.json();
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                this.teamKPIs = [];
            }
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
