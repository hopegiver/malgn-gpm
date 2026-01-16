export default {
    layout: 'employee',
    data() {
        return {
            currentWeekStart: null,
            weekDays: [],
            weeklyStats: {
                total: 0,
                completed: 0,
                inProgress: 0,
                completionRate: 0
            },
            priorityStats: {
                high: 0,
                medium: 0,
                low: 0
            },
            timeStats: {
                estimated: 0,
                actual: 0,
                efficiency: 0
            }
        };
    },
    computed: {
        currentWeekText() {
            if (!this.currentWeekStart) return '';
            const start = new Date(this.currentWeekStart);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            return `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
        }
    },
    async mounted() {
        this.goToCurrentWeek();
    },
    methods: {
        goToCurrentWeek() {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const monday = new Date(today);
            monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            monday.setHours(0, 0, 0, 0);
            this.currentWeekStart = monday;
            this.loadWeeklyTasks();
        },

        previousWeek() {
            const newStart = new Date(this.currentWeekStart);
            newStart.setDate(newStart.getDate() - 7);
            this.currentWeekStart = newStart;
            this.loadWeeklyTasks();
        },

        nextWeek() {
            const newStart = new Date(this.currentWeekStart);
            newStart.setDate(newStart.getDate() + 7);
            this.currentWeekStart = newStart;
            this.loadWeeklyTasks();
        },

        async loadWeeklyTasks() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/execution/weekly', { weekStart: this.currentWeekStart });

            // 임시 데모 데이터
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            this.weekDays = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(this.currentWeekStart);
                date.setDate(date.getDate() + i);

                const dateStr = this.formatDateKey(date);
                const isToday = date.getTime() === today.getTime();

                // 데모 업무 데이터
                const tasks = this.getDemoTasksForDate(dateStr, i);
                const completedCount = tasks.filter(t => t.completed).length;
                const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

                this.weekDays.push({
                    date: dateStr,
                    dayName: this.getDayName(date),
                    dateText: this.formatDate(date),
                    isToday: isToday,
                    tasks: tasks,
                    totalCount: tasks.length,
                    completedCount: completedCount,
                    completionRate: completionRate
                });
            }

            this.calculateStats();
        },

        getDemoTasksForDate(dateStr, dayIndex) {
            // 월요일부터 금요일까지는 업무가 있고, 주말은 적게
            if (dayIndex === 5 || dayIndex === 6) {
                return []; // 주말은 비우기
            }

            const baseTasks = [
                {
                    id: `${dateStr}-1`,
                    title: '일일 스탠드업 미팅',
                    priority: 'medium',
                    completed: dayIndex < 2,
                    goalTitle: null
                },
                {
                    id: `${dateStr}-2`,
                    title: 'Q1 신규 기능 개발',
                    priority: 'high',
                    completed: dayIndex < 1,
                    goalTitle: 'Q1 신규 기능 개발 완료'
                },
                {
                    id: `${dateStr}-3`,
                    title: '코드 리뷰',
                    priority: 'medium',
                    completed: dayIndex < 2,
                    goalTitle: null
                }
            ];

            // 월요일에는 추가 업무
            if (dayIndex === 0) {
                baseTasks.push({
                    id: `${dateStr}-4`,
                    title: '주간 계획 수립',
                    priority: 'high',
                    completed: true,
                    goalTitle: null
                });
            }

            // 금요일에는 회고 업무
            if (dayIndex === 4) {
                baseTasks.push({
                    id: `${dateStr}-4`,
                    title: '주간 회고 작성',
                    priority: 'medium',
                    completed: false,
                    goalTitle: null
                });
            }

            return baseTasks;
        },

        calculateStats() {
            let total = 0;
            let completed = 0;
            let high = 0;
            let medium = 0;
            let low = 0;

            this.weekDays.forEach(day => {
                day.tasks.forEach(task => {
                    total++;
                    if (task.completed) completed++;
                    if (task.priority === 'high') high++;
                    else if (task.priority === 'medium') medium++;
                    else low++;
                });
            });

            this.weeklyStats.total = total;
            this.weeklyStats.completed = completed;
            this.weeklyStats.inProgress = total - completed;
            this.weeklyStats.completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

            this.priorityStats.high = high;
            this.priorityStats.medium = medium;
            this.priorityStats.low = low;

            // 시간 통계 (임시 데이터)
            this.timeStats.estimated = 40;
            this.timeStats.actual = 35;
            this.timeStats.efficiency = Math.round((this.timeStats.estimated / this.timeStats.actual) * 100);
        },

        toggleTask(date, taskId) {
            const day = this.weekDays.find(d => d.date === date);
            if (day) {
                const task = day.tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = !task.completed;

                    // 날짜별 통계 재계산
                    day.completedCount = day.tasks.filter(t => t.completed).length;
                    day.completionRate = day.tasks.length > 0
                        ? Math.round((day.completedCount / day.tasks.length) * 100)
                        : 0;

                    // 전체 통계 재계산
                    this.calculateStats();

                    // TODO: API 호출로 업데이트
                    // await this.$api.patch(`/api/execution/tasks/${taskId}`, { completed: task.completed });
                }
            }
        },

        getDayName(date) {
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            return days[date.getDay()];
        },

        formatDate(date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${month}/${day}`;
        },

        formatDateKey(date) {
            return date.toISOString().split('T')[0];
        },

        getProgressBarClass(rate) {
            if (rate >= 80) return 'bg-success';
            if (rate >= 50) return 'bg-primary';
            if (rate >= 30) return 'bg-warning';
            return 'bg-danger';
        }
    }
};
