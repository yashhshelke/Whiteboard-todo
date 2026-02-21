import React, { useState, useRef, useEffect } from 'react';
import type { Priority, Category } from '../types/todo';

interface AddTodoFormProps {
    onAdd: (text: string, priority: Priority, category: Category, dueDate?: string) => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'health', 'other'];

const PRIORITY_COLORS: Record<Priority, string> = {
    low: '#4ade80',
    medium: '#facc15',
    high: '#f87171',
};

const CATEGORY_ICONS: Record<Category, string> = {
    personal: '👤',
    work: '💼',
    shopping: '🛒',
    health: '❤️',
    other: '📌',
};

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category>('personal');
    const [dueDate, setDueDate] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [shake, setShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (expanded) inputRef.current?.focus();
    }, [expanded]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            inputRef.current?.focus();
            return;
        }
        onAdd(text.trim(), priority, category, dueDate || undefined);
        setText('');
        setDueDate('');
        setPriority('medium');
        setCategory('personal');
        setExpanded(false);
    };

    return (
        <form className={`add-form ${expanded ? 'expanded' : ''}`} onSubmit={handleSubmit}>
            <div className={`input-row ${shake ? 'shake' : ''}`}>
                <button
                    type="button"
                    className="add-icon-btn"
                    onClick={() => {
                        setExpanded((v) => !v);
                        if (!expanded) setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    aria-label="Toggle add options"
                >
                    <span className={`plus-icon ${expanded ? 'rotated' : ''}`}>+</span>
                </button>
                <input
                    ref={inputRef}
                    className="todo-input"
                    type="text"
                    placeholder="Add a new task..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setExpanded(true)}
                />
                <button type="submit" className="submit-btn" disabled={!text.trim()}>
                    <span>Add</span>
                </button>
            </div>

            {expanded && (
                <div className="extra-options" role="group" aria-label="Task options">
                    <div className="options-row">
                        <div className="option-group">
                            <label className="option-label">Priority</label>
                            <div className="priority-buttons">
                                {PRIORITIES.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        className={`priority-btn ${priority === p ? 'active' : ''}`}
                                        style={{ '--dot-color': PRIORITY_COLORS[p] } as React.CSSProperties}
                                        onClick={() => setPriority(p)}
                                    >
                                        <span className="priority-dot" />
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="option-group">
                            <label className="option-label">Category</label>
                            <div className="category-buttons">
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`category-btn ${category === c ? 'active' : ''}`}
                                        onClick={() => setCategory(c)}
                                    >
                                        {CATEGORY_ICONS[c]} {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="option-group">
                            <label className="option-label" htmlFor="due-date">
                                Due Date
                            </label>
                            <input
                                id="due-date"
                                type="date"
                                className="date-input"
                                value={dueDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};
