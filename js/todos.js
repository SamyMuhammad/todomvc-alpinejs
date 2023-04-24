window.todoStore = {
    todos: JSON.parse(localStorage.getItem('stored-todos') || '[]'),

    save() {
        localStorage.setItem('stored-todos', JSON.stringify(this.todos));
    }
};

window.todos = function () {
    return {
        ...todoStore,

        newTodo: '',

        editedTodo: null,

        filter: 'all',

        get active() {
            return this.todos.filter(todo => todo.completed === false);
        },

        get completed() {
            return this.todos.filter(todo => todo.completed);
        },

        get filteredTodos() {
            switch (this.filter) {
                case 'active':
                    return this.active;
                case 'completed':
                    return this.completed;
                default:
                    return this.todos;
            }
        },

        get areAllCompleted() {
            return this.completed.length === this.todos.length;
        },

        addTodo() {
            if (this.newTodo.trim() !== '') {
                this.todos.push({
                    id: Date.now(),
                    body: this.newTodo.trim(),
                    completed: false
                });
                this.filter = 'all';
                this.newTodo = '';

                this.save();
            }
        },

        editTodo(todo) {
            todo.cachedBody = todo.body;
            this.editedTodo = todo;
        },

        completeEdit(todo) {
            if (todo.body.trim() === '') {
                this.removeTodo(todo);
            }
            this.editedTodo = null;
            this.save();
        },

        cancelEdit(todo) {
            todo.body = todo.cachedBody;
            delete todo.cachedBody;
            this.completeEdit(todo);
        },

        removeTodo(todo) {
            let position = this.todos.indexOf(todo);
            this.todos.splice(position, 1);

            this.save();
        },

        toggleComplete(todo) {
            todo.completed = ! todo.completed;
            
            this.save();
        },

        toggleAllCompleted() {
            let allCompletedStatus = this.areAllCompleted;
            this.todos.forEach(todo => {
                todo.completed = ! allCompletedStatus;
            });

            this.save();
        },

        clearCompletedTodos(){
            this.todos = this.active;
            this.save();
        }
    }
};