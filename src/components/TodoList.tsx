import React from 'react';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
    filter: string;
    search: string;
}

export const TodoList: React.FC<TodoListProps> = ({
    todos, onToggle, onDelete, onEdit, filter, search,
}) => {
    if (todos.length === 0) {
        const isFiltered = filter !== 'all' || search;
        return (
            <div className="empty-state">
                <div className="empty-illustration">
                    {isFiltered ? '🔍' : '✨'}
                </div>
                <h3 className="empty-title">
                    {isFiltered ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="empty-sub">
                    {isFiltered
                        ? 'Try adjusting your filters or search query'
                        : 'Add your first task above to get started!'}
                </p>
            </div>
        );
    }

    return (
        <ul className="todo-list" role="list">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </ul>
    );
};
