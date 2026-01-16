export default {
    layout: 'employee',
    data() {
        return {
            employees: [],
            filteredEmployees: [],
            searchQuery: '',
            filterDepartment: '',
            filterRole: '',
            departments: [],
            currentPage: 1,
            pageSize: 10
        };
    },
    computed: {
        totalEmployees() {
            return this.employees.length;
        },
        activeEmployees() {
            return this.employees.filter(e => e.status === 'active').length;
        },
        thisMonthJoined() {
            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();
            return this.employees.filter(e => {
                const joinDate = new Date(e.joinDate);
                return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
            }).length;
        },
        avgTenure() {
            const now = new Date();
            const tenures = this.employees
                .filter(e => e.status === 'active')
                .map(e => {
                    const joinDate = new Date(e.joinDate);
                    return (now - joinDate) / (1000 * 60 * 60 * 24 * 365);
                });
            if (tenures.length === 0) return 0;
            return (tenures.reduce((sum, t) => sum + t, 0) / tenures.length).toFixed(1);
        },
        totalPages() {
            return Math.ceil(this.filteredEmployees.length / this.pageSize);
        },
        paginatedEmployees() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredEmployees.slice(start, end);
        }
    },
    async mounted() {
        await this.loadEmployees();
        this.extractDepartments();
        this.filterEmployees();
    },
    methods: {
        async loadEmployees() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/employees');

            // 데모 데이터
            this.employees = [
                { id: 1, name: '김철수', department: '경영지원', role: 'CEO', email: 'kim@malgn.com', joinDate: '2020-01-01', status: 'active' },
                { id: 2, name: '이영희', department: '개발', role: '부서장', email: 'lee@malgn.com', joinDate: '2020-03-15', status: 'active' },
                { id: 3, name: '박민수', department: '개발', role: '팀장', email: 'park@malgn.com', joinDate: '2021-05-20', status: 'active' },
                { id: 4, name: '정수진', department: '개발', role: '직원', email: 'jung@malgn.com', joinDate: '2022-07-01', status: 'active' },
                { id: 5, name: '최동욱', department: '개발', role: '직원', email: 'choi@malgn.com', joinDate: '2023-01-10', status: 'active' },
                { id: 6, name: '강민지', department: '영업', role: '부서장', email: 'kang@malgn.com', joinDate: '2020-06-01', status: 'active' },
                { id: 7, name: '윤서연', department: '영업', role: '팀장', email: 'yoon@malgn.com', joinDate: '2021-09-15', status: 'active' },
                { id: 8, name: '임재현', department: '영업', role: '직원', email: 'lim@malgn.com', joinDate: '2023-03-20', status: 'active' },
                { id: 9, name: '한지원', department: 'HR', role: '팀장', email: 'han@malgn.com', joinDate: '2021-04-01', status: 'active' },
                { id: 10, name: '오성민', department: 'HR', role: '직원', email: 'oh@malgn.com', joinDate: '2022-11-01', status: 'active' }
            ];
        },

        extractDepartments() {
            this.departments = [...new Set(this.employees.map(e => e.department))];
        },

        filterEmployees() {
            this.filteredEmployees = this.employees.filter(employee => {
                const matchSearch = !this.searchQuery ||
                    employee.name.includes(this.searchQuery) ||
                    employee.email.includes(this.searchQuery) ||
                    employee.department.includes(this.searchQuery);

                const matchDepartment = !this.filterDepartment || employee.department === this.filterDepartment;
                const matchRole = !this.filterRole || employee.role === this.filterRole;

                return matchSearch && matchDepartment && matchRole;
            });

            this.currentPage = 1;
        },

        getRoleBadgeClass(role) {
            const classes = {
                'CEO': 'bg-danger',
                '임원': 'bg-warning',
                '부서장': 'bg-primary',
                '팀장': 'bg-info',
                '직원': 'bg-secondary'
            };
            return classes[role] || 'bg-secondary';
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        },

        openAddEmployeeModal() {
            alert('직원 추가 기능은 추후 구현 예정입니다.');
        },

        viewEmployee(id) {
            alert(`직원 상세 보기: ${id}`);
        },

        editEmployee(id) {
            alert(`직원 수정: ${id}`);
        }
    }
};
