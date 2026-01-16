export default {
    layout: 'employee',
    data() {
        return {
            currentWeekStart: null,
            weekDays: [],
            selectedTaskIds: [],
            weeklyStats: {
                total: 0,
                completed: 0,
                completionRate: 0,
                totalHours: 0,
                estimatedHours: 0,
                actualHours: 0,
                highPriority: 0,
                mediumPriority: 0,
                lowPriority: 0,
                efficiency: 0
            },
            goalProgress: [],
            report: {
                id: null,
                weekStart: null,
                issues: '',
                nextWeekPlan: '',
                suggestions: '',
                status: 'draft' // draft, submitted
            },
            submissionHistory: []
        };
    },
    computed: {
        currentWeekText() {
            if (!this.currentWeekStart) return '';
            const start = new Date(this.currentWeekStart);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            return `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
        },
        allTasks() {
            const tasks = [];
            this.weekDays.forEach(day => {
                day.tasks.forEach(task => {
                    tasks.push({ ...task, date: day.date, dayName: day.dayName });
                });
            });
            return tasks;
        },
        consolidatedTasks() {
            // 업무를 제목으로 그룹화하여 통합
            const taskMap = {};

            this.allTasks.forEach(task => {
                const key = `${task.title}-${task.priority}-${task.goalId || 'none'}`;

                if (!taskMap[key]) {
                    taskMap[key] = {
                        id: task.id,
                        title: task.title,
                        priority: task.priority,
                        goalId: task.goalId,
                        goalName: task.goalName,
                        count: 0,
                        completedCount: 0,
                        totalEstimatedTime: 0,
                        totalActualTime: 0,
                        allCompleted: true,
                        partialCompleted: false,
                        tasks: []
                    };
                }

                taskMap[key].count++;
                taskMap[key].totalEstimatedTime += task.estimatedTime || 0;
                taskMap[key].totalActualTime += task.actualTime || 0;
                taskMap[key].tasks.push(task);

                if (task.completed) {
                    taskMap[key].completedCount++;
                } else {
                    taskMap[key].allCompleted = false;
                }

                if (task.completed && !taskMap[key].partialCompleted) {
                    taskMap[key].partialCompleted = true;
                }
            });

            // 배열로 변환 후 우선순위별 정렬
            const consolidated = Object.values(taskMap);

            // 우선순위 정렬 (High > Medium > Low)
            const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
            consolidated.sort((a, b) => {
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return a.title.localeCompare(b.title);
            });

            return consolidated;
        },
        completedTasks() {
            return this.allTasks.filter(t => t.completed);
        },
        incompleteTasks() {
            // 통합된 업무 중 완전히 완료되지 않은 것만
            return this.consolidatedTasks.filter(t => !t.allCompleted);
        },
        selectedTasks() {
            return this.consolidatedTasks.filter(t => this.selectedTaskIds.includes(t.id));
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
            this.loadWeeklyData();
        },

        previousWeek() {
            const newStart = new Date(this.currentWeekStart);
            newStart.setDate(newStart.getDate() - 7);
            this.currentWeekStart = newStart;
            this.loadWeeklyData();
        },

        nextWeek() {
            const newStart = new Date(this.currentWeekStart);
            newStart.setDate(newStart.getDate() + 7);
            this.currentWeekStart = newStart;
            this.loadWeeklyData();
        },

        async loadWeeklyData() {
            await this.loadWeeklyTasks();
            await this.loadReport();
            await this.loadSubmissionHistory();
            this.calculateGoalProgress();
        },

        async loadWeeklyTasks() {
            // TODO: 실제 API 호출로 대체
            this.weekDays = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 7; i++) {
                const date = new Date(this.currentWeekStart);
                date.setDate(date.getDate() + i);

                const dateStr = this.formatDateKey(date);
                const isToday = date.getTime() === today.getTime();

                const tasks = this.generateDemoTasksForDay(dateStr, i);

                this.weekDays.push({
                    date: dateStr,
                    dayName: this.getDayName(date),
                    dateText: this.formatDate(date),
                    isToday: isToday,
                    tasks: tasks
                });
            }

            this.calculateWeeklyStats();
        },

        generateDemoTasksForDay(dateStr, dayIndex) {
            if (dayIndex === 5 || dayIndex === 6) {
                return [];
            }

            const baseTasks = [
                {
                    id: `${dateStr}-1`,
                    title: '일일 스탠드업 미팅',
                    priority: 'Medium',
                    estimatedTime: 0.5,
                    actualTime: 0.5,
                    completed: dayIndex < 4,
                    goalName: '팀 협업 프로세스 개선',
                    goalId: 4
                },
                {
                    id: `${dateStr}-2`,
                    title: 'Q1 신규 기능 개발',
                    priority: 'High',
                    estimatedTime: 4,
                    actualTime: dayIndex < 3 ? 4.5 : null,
                    completed: dayIndex < 3,
                    goalName: 'Q1 신규 기능 개발 완료',
                    goalId: 1
                },
                {
                    id: `${dateStr}-3`,
                    title: '코드 리뷰',
                    priority: 'Medium',
                    estimatedTime: 2,
                    actualTime: dayIndex < 4 ? 2 : null,
                    completed: dayIndex < 4,
                    goalName: '코드 품질 개선',
                    goalId: 3
                }
            ];

            if (dayIndex === 0) {
                baseTasks.push({
                    id: `${dateStr}-4`,
                    title: '주간 계획 수립',
                    priority: 'High',
                    estimatedTime: 1,
                    actualTime: 1,
                    completed: true,
                    goalName: null,
                    goalId: null
                });
            }

            if (dayIndex === 2) {
                baseTasks.push({
                    id: `${dateStr}-4`,
                    title: '버그 수정 및 테스트',
                    priority: 'High',
                    estimatedTime: 3,
                    actualTime: 3.5,
                    completed: true,
                    goalName: '코드 품질 개선',
                    goalId: 3
                });
            }

            if (dayIndex === 4) {
                baseTasks.push({
                    id: `${dateStr}-4`,
                    title: '주간 회고 작성',
                    priority: 'Medium',
                    estimatedTime: 1,
                    actualTime: null,
                    completed: false,
                    goalName: null,
                    goalId: null
                });
            }

            return baseTasks;
        },

        calculateWeeklyStats() {
            const allTasks = this.allTasks;

            this.weeklyStats.total = allTasks.length;
            this.weeklyStats.completed = allTasks.filter(t => t.completed).length;
            this.weeklyStats.completionRate = this.weeklyStats.total > 0
                ? Math.round((this.weeklyStats.completed / this.weeklyStats.total) * 100)
                : 0;

            this.weeklyStats.estimatedHours = allTasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
            this.weeklyStats.actualHours = allTasks.reduce((sum, t) => sum + (t.actualTime || 0), 0);
            this.weeklyStats.totalHours = this.weeklyStats.actualHours;

            this.weeklyStats.highPriority = allTasks.filter(t => t.priority === 'High').length;
            this.weeklyStats.mediumPriority = allTasks.filter(t => t.priority === 'Medium').length;
            this.weeklyStats.lowPriority = allTasks.filter(t => t.priority === 'Low').length;

            this.weeklyStats.efficiency = this.weeklyStats.actualHours > 0
                ? Math.round((this.weeklyStats.estimatedHours / this.weeklyStats.actualHours) * 100)
                : 0;
        },

        calculateGoalProgress() {
            const goalMap = {};

            this.allTasks.forEach(task => {
                if (task.goalId && task.goalName) {
                    if (!goalMap[task.goalId]) {
                        goalMap[task.goalId] = {
                            goalId: task.goalId,
                            goalName: task.goalName,
                            total: 0,
                            completed: 0,
                            completionRate: 0
                        };
                    }
                    goalMap[task.goalId].total++;
                    if (task.completed) {
                        goalMap[task.goalId].completed++;
                    }
                }
            });

            this.goalProgress = Object.values(goalMap).map(goal => ({
                ...goal,
                completionRate: goal.total > 0
                    ? Math.round((goal.completed / goal.total) * 100)
                    : 0
            }));
        },

        toggleTaskSelection(taskId) {
            const index = this.selectedTaskIds.indexOf(taskId);
            if (index > -1) {
                this.selectedTaskIds.splice(index, 1);
            } else {
                this.selectedTaskIds.push(taskId);
            }
        },

        autoGenerateReport() {
            if (confirm('현재 작성된 내용을 자동 생성 내용으로 덮어씁니다. 계속하시겠습니까?')) {
                // 이슈 자동 생성 (미완료 업무만)
                const issues = [];
                if (this.incompleteTasks.length > 0) {
                    issues.push(`[미완료 업무 ${this.incompleteTasks.length}건]`);
                    this.incompleteTasks.forEach(task => {
                        const status = task.count > 1
                            ? `(${task.completedCount}/${task.count} 완료)`
                            : '';
                        issues.push(`- ${task.title} ${status}`.trim());
                    });
                } else {
                    issues.push('특별한 이슈 없이 계획대로 진행되었습니다.');
                }
                this.report.issues = issues.join('\n');

                // 다음 주 계획 자동 생성
                const nextWeekPlan = [];
                if (this.incompleteTasks.length > 0) {
                    nextWeekPlan.push('[이번 주 미완료 업무]');
                    this.incompleteTasks.forEach(task => {
                        nextWeekPlan.push(`- ${task.title}`);
                    });
                    nextWeekPlan.push('\n[신규 계획]');
                    nextWeekPlan.push('- (신규 계획을 추가하세요)');
                } else {
                    nextWeekPlan.push('[신규 계획]');
                    nextWeekPlan.push('- (다음 주 계획을 작성하세요)');
                }

                this.report.nextWeekPlan = nextWeekPlan.join('\n');

                alert('보고서가 자동 생성되었습니다. 내용을 검토하고 수정해주세요.');
            }
        },

        addTaskToNextWeek(task) {
            const line = `- ${task.title}${task.goalName ? ` (${task.goalName})` : ''}`;

            if (this.report.nextWeekPlan) {
                this.report.nextWeekPlan += '\n' + line;
            } else {
                this.report.nextWeekPlan = line;
            }
        },

        addAllIncompleteToNextWeek() {
            const lines = this.incompleteTasks.map(task =>
                `- ${task.title}${task.goalName ? ` (${task.goalName})` : ''}`
            );

            if (this.report.nextWeekPlan) {
                this.report.nextWeekPlan += '\n' + lines.join('\n');
            } else {
                this.report.nextWeekPlan = lines.join('\n');
            }
        },

        addSelectedToNextWeek() {
            if (this.selectedTasks.length === 0) {
                alert('업무를 선택해주세요.');
                return;
            }

            const lines = this.selectedTasks.map(task =>
                `- ${task.title}${task.goalName ? ` (${task.goalName})` : ''}`
            );

            if (this.report.nextWeekPlan) {
                this.report.nextWeekPlan += '\n' + lines.join('\n');
            } else {
                this.report.nextWeekPlan = lines.join('\n');
            }

            this.selectedTaskIds = [];
        },

        async loadReport() {
            // TODO: 실제 API 호출로 대체
            const isCurrentWeek = this.isCurrentWeek();

            if (!isCurrentWeek) {
                this.report = {
                    id: 1,
                    weekStart: this.currentWeekStart,
                    issues: '[미완료 업무 2건]\n- Q1 신규 기능 개발 (2/3 완료)\n- 주간 회고 작성',
                    nextWeekPlan: '[이번 주 미완료 업무]\n- Q1 신규 기능 개발 마무리\n- 주간 회고 작성\n\n[신규 계획]\n- 사용자 대시보드 UI 개발\n- API 문서화 작업\n- 통합 테스트 시나리오 작성',
                    suggestions: '- 코드 리뷰 시간 확보를 위한 업무 일정 조정 필요',
                    status: 'submitted'
                };
            } else {
                this.report = {
                    id: null,
                    weekStart: this.currentWeekStart,
                    issues: '',
                    nextWeekPlan: '',
                    suggestions: '',
                    status: 'draft'
                };
            }
        },

        async loadSubmissionHistory() {
            // TODO: 실제 API 호출로 대체
            this.submissionHistory = [
                {
                    id: 1,
                    weekText: '2025.01.06 ~ 2025.01.12',
                    submittedAt: '2025-01-12 17:30'
                },
                {
                    id: 2,
                    weekText: '2024.12.30 ~ 2025.01.05',
                    submittedAt: '2025-01-05 18:00'
                },
                {
                    id: 3,
                    weekText: '2024.12.23 ~ 2024.12.29',
                    submittedAt: '2024-12-27 16:45'
                }
            ];
        },

        isCurrentWeek() {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const currentMonday = new Date(today);
            currentMonday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            currentMonday.setHours(0, 0, 0, 0);

            return this.currentWeekStart.getTime() === currentMonday.getTime();
        },

        saveDraft() {
            if (!this.report.nextWeekPlan.trim()) {
                alert('다음 주 계획을 입력해주세요.');
                return;
            }

            // TODO: 실제 API 호출로 대체
            alert('임시 저장되었습니다.');
        },

        saveReport() {
            if (!this.report.nextWeekPlan.trim()) {
                alert('다음 주 계획을 입력해주세요.');
                return;
            }

            if (confirm('주간 보고서를 제출하시겠습니까?\n제출 후에도 수정할 수 있습니다.')) {
                // TODO: 실제 API 호출로 대체
                this.report.status = 'submitted';
                alert('주간 보고서가 제출되었습니다.');
                this.loadSubmissionHistory();
            }
        },

        editReport() {
            if (confirm('제출된 보고서를 수정하시겠습니까?')) {
                this.report.status = 'draft';
            }
        },

        viewHistory(history) {
            alert(`${history.weekText} 보고서 상세 보기\n(기능 구현 예정)`);
        },

        getDayName(date) {
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            return days[date.getDay()];
        },

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        },

        formatDateKey(date) {
            return date.toISOString().split('T')[0];
        }
    }
};
