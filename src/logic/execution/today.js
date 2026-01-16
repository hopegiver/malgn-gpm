export default {
    layout: 'employee',
    data() {
        return {
            today: '',
            selectedDate: null,  // 현재 선택된 날짜
            todayDate: null,     // 오늘 날짜 (비교용)
            selectedTaskIds: [], // 복사할 업무 선택
            tasks: [],
            goals: [],
            taskFilter: 'all',
            newTask: {
                title: '',
                goalId: '',
                krId: null,  // KR 선택 (선택적)
                priority: 'Medium',
                estimatedTime: 1,
                description: ''  // 상세 내역 (선택적)
            },
            availableKRs: [],  // 선택한 목표의 KR 목록
            expandedTasks: [],  // 확장된 업무 ID 목록
            editingDescription: {},  // 편집 중인 상세 내역 {taskId: description}
            stats: {
                plannedHours: 0,
                executedHours: 0,
                completedTasks: 0,
                totalTasks: 0
            },
            goalChart: null
        };
    },
    computed: {
        isToday() {
            if (!this.selectedDate || !this.todayDate) return true;
            return this.formatDateKey(this.selectedDate) === this.formatDateKey(this.todayDate);
        },
        selectedDateText() {
            if (!this.selectedDate) return '';
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            const year = this.selectedDate.getFullYear();
            const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.selectedDate.getDate()).padStart(2, '0');
            const dayOfWeek = days[this.selectedDate.getDay()];
            return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
        },
        filteredTasks() {
            if (this.taskFilter === 'all') {
                return this.tasks;
            } else if (this.taskFilter === 'pending') {
                return this.tasks.filter(t => !t.completed);
            } else {
                return this.tasks.filter(t => t.completed);
            }
        },
        pendingTasks() {
            return this.tasks.filter(t => !t.completed);
        },
        completedTasks() {
            return this.tasks.filter(t => t.completed);
        },
        completionRate() {
            if (this.tasks.length === 0) return 0;
            return Math.round((this.completedTasks.length / this.tasks.length) * 100);
        },
        timeUtilization() {
            if (this.stats.plannedHours === 0) return 0;
            return Math.round((this.stats.executedHours / this.stats.plannedHours) * 100);
        },
        highPriorityCount() {
            return this.tasks.filter(t => t.priority === 'High' && !t.completed).length;
        },
        mediumPriorityCount() {
            return this.tasks.filter(t => t.priority === 'Medium' && !t.completed).length;
        },
        lowPriorityCount() {
            return this.tasks.filter(t => t.priority === 'Low' && !t.completed).length;
        }
    },
    async mounted() {
        this.setToday();
        this.goToToday(); // selectedDate를 오늘로 초기화
        await this.loadGoals();
        await this.loadTasks();

        this.$nextTick(() => {
            this.initGoalChart();
        });
    },
    beforeUnmount() {
        if (this.goalChart) {
            this.goalChart.destroy();
        }
    },
    methods: {
        setToday() {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            this.todayDate = date;

            const days = ['일', '월', '화', '수', '목', '금', '토'];
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dayOfWeek = days[date.getDay()];

            this.today = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
        },

        async loadGoals() {
            // TODO: 실제 API 호출로 대체
            this.goals = [
                {
                    id: 1,
                    title: 'Q1 신규 기능 개발 완료',
                    keyResults: [
                        { id: 1, title: '대시보드 UI 컴포넌트 개발', metric: '100%' },
                        { id: 2, title: '데이터 시각화 차트 구현', metric: '80%' },
                        { id: 3, title: '리포트 생성 기능 개발', metric: '60%' },
                        { id: 4, title: '성능 최적화 및 테스트', metric: '50%' }
                    ]
                },
                {
                    id: 2,
                    title: 'React 전문성 향상',
                    keyResults: [
                        { id: 1, title: 'React 고급 패턴 학습', metric: '완료' },
                        { id: 2, title: 'TypeScript 프로젝트 적용', metric: '진행 중' },
                        { id: 3, title: '성능 최적화 기법 적용', metric: '50%' }
                    ]
                },
                {
                    id: 3,
                    title: '코드 품질 개선',
                    keyResults: [
                        { id: 1, title: '코드 리뷰 품질 향상', metric: '완료' },
                        { id: 2, title: '리팩토링 진행', metric: '80%' },
                        { id: 3, title: '테스트 커버리지 향상', metric: '70%' }
                    ]
                },
                {
                    id: 4,
                    title: '팀 협업 프로세스 개선',
                    keyResults: [
                        { id: 1, title: '주간 회고 진행', metric: '완료' },
                        { id: 2, title: '문서화 개선', metric: '60%' }
                    ]
                }
            ];
        },

        async loadTasks() {
            // TODO: 실제 API 호출로 대체
            // const dateKey = this.formatDateKey(this.selectedDate);
            // const data = await this.$api.get('/api/tasks', { date: dateKey });

            // selectedTaskIds 초기화 (날짜 변경 시)
            this.selectedTaskIds = [];

            // 임시 데모 데이터 - 날짜별로 다른 데이터 생성
            this.tasks = this.generateDemoTasks();

            this.calculateStats();
        },

        generateDemoTasks() {
            if (!this.selectedDate) return [];

            const dateKey = this.formatDateKey(this.selectedDate);
            const daysDiff = Math.floor((this.todayDate - this.selectedDate) / (1000 * 60 * 60 * 24));

            // 오늘 날짜
            if (daysDiff === 0) {
                return [
                    {
                        id: 1,
                        title: '신규 기능 개발 완료',
                        goalId: 1,
                        goalName: 'Q1 신규 기능 개발 완료',
                        krId: 3,
                        krName: '리포트 생성 기능 개발',
                        priority: 'High',
                        estimatedTime: 4,
                        actualTime: null,
                        completed: false,
                        description: '월간 리포트 생성 API 및 UI 개발\n- REST API 엔드포인트 구현\n- 데이터 집계 로직 작성\n- PDF 생성 기능 추가'
                    },
                    {
                        id: 2,
                        title: '코드 리뷰 완료',
                        goalId: 4,
                        goalName: '팀 협업 프로세스 개선',
                        krId: 1,
                        krName: '주간 회고 진행',
                        priority: 'Medium',
                        estimatedTime: 2,
                        actualTime: 1.5,
                        completed: true,
                        completedAt: '14:30',
                        description: '신규 입사자의 PR 3건 리뷰 완료\n- 코드 스타일 가이드 준수 확인\n- 로직 개선 제안 (성능 최적화)'
                    },
                    {
                        id: 3,
                        title: '주간 보고서 작성',
                        goalId: null,
                        goalName: null,
                        krId: null,
                        krName: null,
                        priority: 'High',
                        estimatedTime: 1,
                        actualTime: null,
                        completed: false,
                        description: ''
                    },
                    {
                        id: 4,
                        title: '기술 문서 작성',
                        goalId: 1,
                        goalName: 'Q1 신규 기능 개발 완료',
                        priority: 'Low',
                        estimatedTime: 3,
                        actualTime: null,
                        completed: false,
                        description: ''
                    },
                    {
                        id: 5,
                        title: 'React 학습 (1시간)',
                        goalId: 2,
                        goalName: 'React 전문성 향상',
                        priority: 'Medium',
                        estimatedTime: 1,
                        actualTime: 1,
                        completed: true,
                        completedAt: '11:00',
                        description: ''
                    }
                ];
            }
            // 어제 날짜
            else if (daysDiff === 1) {
                return [
                    {
                        id: 101,
                        title: '신규 기능 개발 (진행 중)',
                        goalId: 1,
                        goalName: 'Q1 신규 기능 개발 완료',
                        priority: 'High',
                        estimatedTime: 4,
                        actualTime: 3.5,
                        completed: false,
                        description: ''
                    },
                    {
                        id: 102,
                        title: '일일 스탠드업 미팅',
                        goalId: 4,
                        goalName: '팀 협업 프로세스 개선',
                        priority: 'Medium',
                        estimatedTime: 0.5,
                        actualTime: 0.5,
                        completed: true,
                        completedAt: '09:30',
                        description: ''
                    },
                    {
                        id: 103,
                        title: '버그 수정',
                        goalId: 3,
                        goalName: '코드 품질 개선',
                        priority: 'High',
                        estimatedTime: 2,
                        actualTime: 2.5,
                        completed: true,
                        completedAt: '16:00',
                        description: ''
                    }
                ];
            }
            // 그제 날짜
            else if (daysDiff === 2) {
                return [
                    {
                        id: 201,
                        title: 'API 개발',
                        goalId: 1,
                        goalName: 'Q1 신규 기능 개발 완료',
                        priority: 'High',
                        estimatedTime: 3,
                        actualTime: 3,
                        completed: true,
                        completedAt: '15:00',
                        description: ''
                    },
                    {
                        id: 202,
                        title: '코드 리팩토링',
                        goalId: 3,
                        goalName: '코드 품질 개선',
                        priority: 'Medium',
                        estimatedTime: 2,
                        actualTime: 2,
                        completed: true,
                        completedAt: '17:00',
                        description: ''
                    },
                    {
                        id: 203,
                        title: '문서 작성',
                        goalId: null,
                        goalName: null,
                        priority: 'Low',
                        estimatedTime: 1.5,
                        actualTime: 1,
                        completed: true,
                        completedAt: '11:00',
                        description: ''
                    }
                ];
            }
            // 기타 과거 날짜
            else {
                const taskCount = 2 + (daysDiff % 3);
                const tasks = [];

                for (let i = 0; i < taskCount; i++) {
                    const isCompleted = Math.random() > 0.3;
                    tasks.push({
                        id: Date.now() + i,
                        title: this.getRandomTaskTitle(i),
                        goalId: i < 2 ? 1 : null,
                        goalName: i < 2 ? 'Q1 신규 기능 개발 완료' : null,
                        priority: this.getRandomPriority(i),
                        estimatedTime: 1 + (i % 4),
                        actualTime: isCompleted ? 1 + (i % 4) : null,
                        completed: isCompleted,
                        completedAt: isCompleted ? '15:00' : null,
                        description: ''
                    });
                }

                return tasks;
            }
        },

        getRandomTaskTitle(index) {
            const titles = [
                '기능 개발',
                '코드 리뷰',
                '회의 참석',
                '버그 수정',
                '테스트 작성',
                '문서 작성'
            ];
            return titles[index % titles.length];
        },

        getRandomPriority(index) {
            const priorities = ['High', 'Medium', 'Low'];
            return priorities[index % priorities.length];
        },

        calculateStats() {
            this.stats.totalTasks = this.tasks.length;
            this.stats.completedTasks = this.completedTasks.length;
            this.stats.plannedHours = this.tasks.reduce((sum, t) => sum + t.estimatedTime, 0);
            this.stats.executedHours = this.tasks
                .filter(t => t.actualTime !== null)
                .reduce((sum, t) => sum + t.actualTime, 0);
        },

        onGoalChange() {
            // 선택한 목표의 KR 목록 업데이트
            if (this.newTask.goalId) {
                const goal = this.goals.find(g => g.id === this.newTask.goalId);
                this.availableKRs = goal ? goal.keyResults : [];
            } else {
                this.availableKRs = [];
            }
            // KR 선택 초기화
            this.newTask.krId = null;
        },

        addTask() {
            if (!this.newTask.title.trim()) return;

            const goal = this.goals.find(g => g.id === this.newTask.goalId);
            let krName = null;
            if (this.newTask.krId && goal) {
                const kr = goal.keyResults.find(k => k.id === this.newTask.krId);
                krName = kr ? kr.title : null;
            }

            const task = {
                id: Date.now(),
                title: this.newTask.title,
                goalId: this.newTask.goalId || null,
                goalName: goal ? goal.title : null,
                krId: this.newTask.krId || null,
                krName: krName,
                priority: this.newTask.priority,
                estimatedTime: this.newTask.estimatedTime,
                actualTime: null,
                completed: false,
                description: this.newTask.description || ''
            };

            this.tasks.unshift(task);
            this.calculateStats();

            // TODO: API 호출로 저장
            // await this.$api.post('/api/tasks', task);

            // 폼 초기화
            this.newTask = {
                title: '',
                goalId: '',
                krId: null,
                priority: 'Medium',
                estimatedTime: 1,
                description: ''
            };
            this.availableKRs = [];

            // 차트 업데이트
            this.updateGoalChart();
        },

        toggleTask(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;

                if (task.completed) {
                    task.completedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
                    task.actualTime = task.estimatedTime; // 기본값으로 예상 시간 설정
                } else {
                    task.completedAt = null;
                    task.actualTime = null;
                }

                this.calculateStats();

                // TODO: API 호출로 업데이트
                // await this.$api.patch(`/api/tasks/${taskId}`, { completed: task.completed });
            }
        },

        completeTask(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                const actualTime = prompt('실제 소요 시간을 입력하세요 (시간):', task.estimatedTime);
                if (actualTime !== null) {
                    task.completed = true;
                    task.actualTime = parseFloat(actualTime) || task.estimatedTime;
                    task.completedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

                    this.calculateStats();

                    // TODO: API 호출로 업데이트
                    // await this.$api.patch(`/api/tasks/${taskId}`, { completed: true, actualTime: task.actualTime });
                }
            }
        },

        startTimer(taskId) {
            alert(`타이머 시작 (업무 ID: ${taskId})\n(기능 구현 예정)`);
            // TODO: 타이머 기능 구현
        },

        editTask(taskId) {
            alert(`업무 수정 (ID: ${taskId})\n(기능 구현 예정)`);
            // TODO: 수정 기능 구현
        },

        deleteTask(taskId) {
            if (confirm('정말로 이 업무를 삭제하시겠습니까?')) {
                const index = this.tasks.findIndex(t => t.id === taskId);
                if (index > -1) {
                    this.tasks.splice(index, 1);
                    this.calculateStats();
                    this.updateGoalChart();

                    // TODO: API 호출로 삭제
                    // await this.$api.delete(`/api/tasks/${taskId}`);
                }
            }
        },

        initGoalChart() {
            const ctx = this.$refs.goalChart;
            if (!ctx) return;

            const goalDistribution = this.calculateGoalDistribution();

            this.goalChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: goalDistribution.labels,
                    datasets: [{
                        data: goalDistribution.data,
                        backgroundColor: [
                            '#6366f1',
                            '#8b5cf6',
                            '#ec4899',
                            '#f59e0b',
                            '#10b981'
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 10,
                                font: {
                                    size: 11,
                                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", Roboto'
                                }
                            }
                        }
                    }
                }
            });
        },

        calculateGoalDistribution() {
            const distribution = {};

            this.tasks.forEach(task => {
                const goalName = task.goalName || '기타';
                distribution[goalName] = (distribution[goalName] || 0) + 1;
            });

            return {
                labels: Object.keys(distribution),
                data: Object.values(distribution)
            };
        },

        updateGoalChart() {
            if (this.goalChart) {
                const goalDistribution = this.calculateGoalDistribution();
                this.goalChart.data.labels = goalDistribution.labels;
                this.goalChart.data.datasets[0].data = goalDistribution.data;
                this.goalChart.update();
            }
        },

        getSignalClass(value) {
            if (value >= 70) return 'green';
            if (value >= 40) return 'yellow';
            return 'red';
        },

        getPriorityClass(priority) {
            switch (priority) {
                case 'High':
                    return 'danger';
                case 'Medium':
                    return 'warning';
                case 'Low':
                    return 'primary';
                default:
                    return 'primary';
            }
        },

        getPriorityText(priority) {
            switch (priority) {
                case 'High':
                    return '높음';
                case 'Medium':
                    return '보통';
                case 'Low':
                    return '낮음';
                default:
                    return priority;
            }
        },

        // 날짜 네비게이션
        previousDay() {
            const newDate = new Date(this.selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            this.selectedDate = newDate;
            this.loadTasks();
        },

        nextDay() {
            if (this.isToday) return; // 오늘보다 미래로는 이동 불가
            const newDate = new Date(this.selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            this.selectedDate = newDate;
            this.loadTasks();
        },

        goToToday() {
            this.selectedDate = new Date(this.todayDate);
            this.loadTasks();
        },

        // 업무 복사 기능
        toggleTaskSelection(taskId) {
            const index = this.selectedTaskIds.indexOf(taskId);
            if (index > -1) {
                this.selectedTaskIds.splice(index, 1);
            } else {
                this.selectedTaskIds.push(taskId);
            }
        },

        async copyTasksToToday() {
            if (this.selectedTaskIds.length === 0) {
                alert('복사할 업무를 선택해주세요.');
                return;
            }

            if (confirm(`${this.selectedTaskIds.length}개의 업무를 오늘로 복사하시겠습니까?`)) {
                const tasksToAdd = this.tasks
                    .filter(t => this.selectedTaskIds.includes(t.id))
                    .map(task => ({
                        ...task,
                        id: Date.now() + Math.random(), // 새로운 ID 생성
                        completed: false,
                        actualTime: null,
                        completedAt: null
                    }));

                // TODO: 실제 API 호출로 대체
                // await this.$api.post('/api/tasks/copy', { tasks: tasksToAdd, targetDate: this.formatDateKey(this.todayDate) });

                alert(`${tasksToAdd.length}개의 업무가 오늘로 복사되었습니다.`);

                // 오늘 날짜로 이동
                this.goToToday();
            }
        },

        formatDateKey(date) {
            return date.toISOString().split('T')[0];
        },

        // 업무 상세 확장/축소
        toggleTaskExpansion(taskId) {
            const index = this.expandedTasks.indexOf(taskId);
            if (index > -1) {
                this.expandedTasks.splice(index, 1);
                // 축소할 때 편집 상태도 취소
                delete this.editingDescription[taskId];
            } else {
                this.expandedTasks.push(taskId);
            }
        },

        isTaskExpanded(taskId) {
            return this.expandedTasks.includes(taskId);
        },

        // 상세 내역 편집
        startEditDescription(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                this.editingDescription = {
                    ...this.editingDescription,
                    [taskId]: task.description || ''
                };
            }
        },

        saveDescription(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task && this.editingDescription.hasOwnProperty(taskId)) {
                task.description = this.editingDescription[taskId];
                delete this.editingDescription[taskId];

                // TODO: API 호출로 업데이트
                // await this.$api.patch(`/api/tasks/${taskId}`, { description: task.description });
            }
        },

        cancelEditDescription(taskId) {
            delete this.editingDescription[taskId];
        },

        isEditingDescription(taskId) {
            return this.editingDescription.hasOwnProperty(taskId);
        }
    }
};
