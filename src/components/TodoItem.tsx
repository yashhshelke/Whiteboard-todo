import React, { useState, useRef, useEffect } from 'react';
import type { Todo, Priority, Category } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
    low: '#4ade80',
    medium: '#facc15',
    high: '#f87171',
};

const PRIORITY_BG: Record<Priority, string> = {
    low: 'rgba(74, 222, 128, 0.15)',
    medium: 'rgba(250, 204, 21, 0.15)',
    high: 'rgba(248, 113, 113, 0.15)',
};

const CATEGORY_ICONS: Record<Category, string> = {
    personal: '👤',
    work: '💼',
    shopping: '🛒',
    health: '❤️',
    other: '📌',
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `Due in ${diff}d`;
}

function isOverdue(dueDate: string): boolean {
    const date = new Date(dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [removing, setRemoving] = useState(false);
    const editRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) editRef.current?.focus();
    }, [editing]);

    const handleDelete = () => {
        setRemoving(true);
        setTimeout(() => onDelete(todo.id), 350);
    };

    const handleEditSubmit = () => {
        const trimmed = editText.trim();
        if (trimmed && trimmed !== todo.text) {
            onEdit(todo.id, { text: trimmed });
        } else {
            setEditText(todo.text);
        }
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleEditSubmit();
        if (e.key === 'Escape') {
            setEditText(todo.text);
            setEditing(false);
        }
    };

    const overdueFlag = todo.dueDate && !todo.completed && isOverdue(todo.dueDate);

    return (
        <li
            className={`todo-item ${todo.completed ? 'completed' : ''} ${removing ? 'removing' : ''} ${overdueFlag ? 'overdue' : ''}`}
            style={{ '--priority-color': PRIORITY_COLORS[todo.priority], '--priority-bg': PRIORITY_BG[todo.priority] } as React.CSSProperties}
        >
            <div className="todo-left">
                <button
                    className={`check-btn ${todo.completed ? 'checked' : ''}`}
                    onClick={() => onToggle(todo.id)}
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                    {todo.completed && (
                        <svg viewBox="0 0 12 10" fill="none" className="check-icon">
                            <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="todo-content">
                {editing ? (
                    <input
                        ref={editRef}
                        className="edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <span
                        className="todo-text"
                        onDoubleClick={() => !todo.completed && setEditing(true)}
                        title="Double-click to edit"
                    >
                        {todo.text}
                    </span>
                )}

                <div className="todo-meta">
                    <span
                        className="priority-badge"
                        style={{ color: PRIORITY_COLORS[todo.priority], background: PRIORITY_BG[todo.priority] }}
                    >
                        {todo.priority}
                    </span>
                    <span className="category-badge">
                        {CATEGORY_ICONS[todo.category]} {todo.category}
                    </span>
                    {todo.dueDate && (
                        <span className={`due-badge ${overdueFlag ? 'overdue-badge' : ''}`}>
                            📅 {formatDate(todo.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            <div className="todo-actions">
                {!todo.completed && (
                    <button
                        className="action-btn edit-btn"
                        onClick={() => setEditing((v) => !v)}
                        aria-label="Edit task"
                    >
                        ✏️
                    </button>
                )}
                <button
                    className="action-btn delete-btn"
                    onClick={handleDelete}
                    aria-label="Delete task"
                >
                    🗑️
                </button>
            </div>
        </li>
    );
};
