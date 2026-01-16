export default {
    layout: 'employee',
    data() {
        return {
            departments: []
        };
    },
    async mounted() {
        await this.loadOrganization();
    },
    methods: {
        async loadOrganization() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/organization');

            // 데모 데이터
            this.departments = [
                {
                    id: 1,
                    name: '개발',
                    color: '#6366f1',
                    totalMembers: 15,
                    head: {
                        name: '이영희',
                        email: 'lee@malgn.com'
                    },
                    teams: [
                        {
                            id: 11,
                            name: '프론트엔드',
                            leader: { name: '박민수', email: 'park@malgn.com' },
                            members: ['정수진', '최동욱', '김민준', '이서현', '박준호']
                        },
                        {
                            id: 12,
                            name: '백엔드',
                            leader: { name: '강태양', email: 'kang.ty@malgn.com' },
                            members: ['윤지호', '서민재', '한수아', '오지민']
                        },
                        {
                            id: 13,
                            name: 'DevOps',
                            leader: { name: '임채은', email: 'lim@malgn.com' },
                            members: ['조은서', '배현우', '송유진']
                        }
                    ]
                },
                {
                    id: 2,
                    name: '영업',
                    color: '#10b981',
                    totalMembers: 12,
                    head: {
                        name: '강민지',
                        email: 'kang@malgn.com'
                    },
                    teams: [
                        {
                            id: 21,
                            name: '신규영업',
                            leader: { name: '윤서연', email: 'yoon@malgn.com' },
                            members: ['임재현', '권도윤', '최서준', '신예은', '정하린']
                        },
                        {
                            id: 22,
                            name: '기존고객',
                            leader: { name: '홍준영', email: 'hong@malgn.com' },
                            members: ['남지우', '양시우', '전은채', '구민서']
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'HR',
                    color: '#f59e0b',
                    totalMembers: 5,
                    head: {
                        name: '한지원',
                        email: 'han@malgn.com'
                    },
                    teams: [
                        {
                            id: 31,
                            name: '인사관리',
                            leader: { name: '오성민', email: 'oh@malgn.com' },
                            members: ['장예린', '김도현', '이수빈']
                        }
                    ]
                },
                {
                    id: 4,
                    name: '재무',
                    color: '#8b5cf6',
                    totalMembers: 4,
                    head: {
                        name: '문채원',
                        email: 'moon@malgn.com'
                    },
                    teams: []
                }
            ];
        }
    }
};
