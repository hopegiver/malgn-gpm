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
        },

        // 부서 추가
        openAddDeptModal() {
            const name = prompt('부서 이름을 입력하세요:');
            if (!name || !name.trim()) return;

            const headName = prompt('부서장 이름을 입력하세요:');
            if (!headName || !headName.trim()) return;

            const headEmail = prompt('부서장 이메일을 입력하세요:');
            if (!headEmail || !headEmail.trim()) return;

            const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const newDept = {
                id: Date.now(),
                name: name.trim(),
                color: color,
                totalMembers: 1,
                head: {
                    name: headName.trim(),
                    email: headEmail.trim()
                },
                teams: []
            };

            this.departments.push(newDept);

            // TODO: API 호출로 저장
            // await this.$api.post('/api/departments', newDept);
            alert('부서가 추가되었습니다.');
        },

        // 부서 수정
        editDepartment(deptId) {
            const dept = this.departments.find(d => d.id === deptId);
            if (!dept) return;

            const name = prompt('부서 이름:', dept.name);
            if (!name || !name.trim()) return;

            const headName = prompt('부서장 이름:', dept.head.name);
            if (!headName || !headName.trim()) return;

            const headEmail = prompt('부서장 이메일:', dept.head.email);
            if (!headEmail || !headEmail.trim()) return;

            dept.name = name.trim();
            dept.head.name = headName.trim();
            dept.head.email = headEmail.trim();

            // TODO: API 호출로 업데이트
            // await this.$api.put(`/api/departments/${deptId}`, dept);
            alert('부서 정보가 수정되었습니다.');
        },

        // 부서 삭제
        deleteDepartment(deptId) {
            const dept = this.departments.find(d => d.id === deptId);
            if (!dept) return;

            if (!confirm(`"${dept.name}" 부서를 정말 삭제하시겠습니까?\n하위 팀도 모두 삭제됩니다.`)) return;

            const index = this.departments.findIndex(d => d.id === deptId);
            if (index > -1) {
                this.departments.splice(index, 1);

                // TODO: API 호출로 삭제
                // await this.$api.delete(`/api/departments/${deptId}`);
                alert('부서가 삭제되었습니다.');
            }
        },

        // 팀 추가
        openAddTeamModal(deptId) {
            const dept = this.departments.find(d => d.id === deptId);
            if (!dept) return;

            const name = prompt('팀 이름을 입력하세요:');
            if (!name || !name.trim()) return;

            const leaderName = prompt('팀장 이름을 입력하세요:');
            if (!leaderName || !leaderName.trim()) return;

            const leaderEmail = prompt('팀장 이메일을 입력하세요:');
            if (!leaderEmail || !leaderEmail.trim()) return;

            const newTeam = {
                id: Date.now(),
                name: name.trim(),
                leader: {
                    name: leaderName.trim(),
                    email: leaderEmail.trim()
                },
                members: []
            };

            dept.teams.push(newTeam);
            dept.totalMembers += 1;

            // TODO: API 호출로 저장
            // await this.$api.post(`/api/departments/${deptId}/teams`, newTeam);
            alert('팀이 추가되었습니다.');
        },

        // 팀 수정
        editTeam(deptId, teamId) {
            const dept = this.departments.find(d => d.id === deptId);
            if (!dept) return;

            const team = dept.teams.find(t => t.id === teamId);
            if (!team) return;

            const name = prompt('팀 이름:', team.name);
            if (!name || !name.trim()) return;

            const leaderName = prompt('팀장 이름:', team.leader.name);
            if (!leaderName || !leaderName.trim()) return;

            const leaderEmail = prompt('팀장 이메일:', team.leader.email);
            if (!leaderEmail || !leaderEmail.trim()) return;

            team.name = name.trim();
            team.leader.name = leaderName.trim();
            team.leader.email = leaderEmail.trim();

            // TODO: API 호출로 업데이트
            // await this.$api.put(`/api/departments/${deptId}/teams/${teamId}`, team);
            alert('팀 정보가 수정되었습니다.');
        },

        // 팀 삭제
        deleteTeam(deptId, teamId) {
            const dept = this.departments.find(d => d.id === deptId);
            if (!dept) return;

            const team = dept.teams.find(t => t.id === teamId);
            if (!team) return;

            if (!confirm(`"${team.name}" 팀을 정말 삭제하시겠습니까?`)) return;

            const index = dept.teams.findIndex(t => t.id === teamId);
            if (index > -1) {
                const memberCount = team.members.length + 1; // 팀장 포함
                dept.teams.splice(index, 1);
                dept.totalMembers -= memberCount;

                // TODO: API 호출로 삭제
                // await this.$api.delete(`/api/departments/${deptId}/teams/${teamId}`);
                alert('팀이 삭제되었습니다.');
            }
        }
    }
};
