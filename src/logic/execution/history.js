export default {
    layout: 'employee',
    data() {
        return {
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            calendarWeeks: [],
            selectedDay: null,
            monthlyStats: {
                total: 0,
                completed: 0,
                avgDaily: 0,
                completionRate: 0
            }
        };
    },
    computed: {
        currentMonthText() {
            return `${this.currentYear}년 ${this.currentMonth + 1}월`;
        }
    },
    async mounted() {
        await this.loadMonthlyData();
    },
    methods: {
        async loadMonthlyData() {
            // TODO: 실제 API 호출로 대체
            // const data = await this.$api.get('/api/execution/monthly', {
            //     year: this.currentYear,
            //     month: this.currentMonth + 1
            // });

            this.generateCalendar();
            this.calculateMonthlyStats();
        },

        generateCalendar() {
            const firstDay = new Date(this.currentYear, this.currentMonth, 1);
            const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const startDayOfWeek = firstDay.getDay();
            const daysInMonth = lastDay.getDate();

            this.calendarWeeks = [];
            let week = [];

            // 첫 주의 빈 칸 채우기
            for (let i = 0; i < startDayOfWeek; i++) {
                week.push({ date: null });
            }

            // 날짜 채우기
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentYear, this.currentMonth, day);
                const dateStr = this.formatDateKey(date);
                const isToday = date.getTime() === today.getTime();

                // 데모 업무 데이터
                const tasks = this.getDemoTasksForDate(dateStr, day);
                const completedCount = tasks.filter(t => t.completed).length;
                const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

                week.push({
                    date: dateStr,
                    day: day,
                    dateText: `${this.currentMonth + 1}월 ${day}일`,
                    isToday: isToday,
                    tasks: tasks,
                    taskCount: tasks.length,
                    completedCount: completedCount,
                    completionRate: completionRate
                });

                // 주가 완성되면 추가
                if (week.length === 7) {
                    this.calendarWeeks.push(week);
                    week = [];
                }
            }

            // 마지막 주의 빈 칸 채우기
            while (week.length > 0 && week.length < 7) {
                week.push({ date: null });
            }
            if (week.length > 0) {
                this.calendarWeeks.push(week);
            }
        },

        getDemoTasksForDate(dateStr, day) {
            // 주말 제외
            const date = new Date(dateStr);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return [];
            }

            // 임시 데이터: 평일마다 3-5개의 업무
            const taskCount = 3 + (day % 3);
            const tasks = [];

            for (let i = 0; i < taskCount; i++) {
                const isCompleted = Math.random() > 0.3; // 70% 완료율
                tasks.push({
                    id: `${dateStr}-${i}`,
                    title: this.getDemoTaskTitle(i),
                    priority: this.getDemoPriority(i),
                    completed: isCompleted,
                    goalTitle: i < 2 ? 'Q1 신규 기능 개발 완료' : null,
                    estimatedTime: 2 + (i % 3),
                    actualTime: isCompleted ? 2 + (i % 4) : 0
                });
            }

            return tasks;
        },

        getDemoTaskTitle(index) {
            const titles = [
                'Q1 신규 기능 개발',
                '코드 리뷰 및 피드백',
                '일일 스탠드업 미팅',
                'API 문서 작성',
                '버그 수정 및 테스트',
                '성능 최적화 작업'
            ];
            return titles[index % titles.length];
        },

        getDemoPriority(index) {
            const priorities = ['high', 'medium', 'low'];
            return priorities[index % priorities.length];
        },

        calculateMonthlyStats() {
            let total = 0;
            let completed = 0;
            let daysWithTasks = 0;

            this.calendarWeeks.forEach(week => {
                week.forEach(day => {
                    if (day.date && day.taskCount > 0) {
                        total += day.taskCount;
                        completed += day.completedCount;
                        daysWithTasks++;
                    }
                });
            });

            this.monthlyStats.total = total;
            this.monthlyStats.completed = completed;
            this.monthlyStats.avgDaily = daysWithTasks > 0 ? Math.round(total / daysWithTasks * 10) / 10 : 0;
            this.monthlyStats.completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        },

        previousMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
            this.loadMonthlyData();
            this.selectedDay = null;
        },

        nextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
            this.loadMonthlyData();
            this.selectedDay = null;
        },

        selectDay(day) {
            if (day.date) {
                this.selectedDay = day;
            }
        },

        getDayClass(day) {
            const classes = [];

            if (day.isToday) {
                classes.push('border-primary', 'border-2');
            }

            if (day.taskCount > 0) {
                classes.push('bg-light');
            }

            return classes.join(' ');
        },

        formatDateKey(date) {
            return date.toISOString().split('T')[0];
        }
    }
};
