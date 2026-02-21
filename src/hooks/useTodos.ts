import { useState, useEffect, useCallback } from 'react';
import type { Todo, FilterType, SortType, Priority, Category } from '../types/todo';

const STORAGE_KEY = 'antigravity-todos';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(): Todo[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(loadFromStorage);
    const [filter, setFilter] = useState<FilterType>('all');
    const [sort, setSort] = useState<SortType>('newest');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const addTodo = useCallback(
        (
            text: string,
            priority: Priority = 'medium',
            category: Category = 'personal',
            dueDate?: string
        ) => {
            const newTodo: Todo = {
                id: generateId(),
                text: text.trim(),
                completed: false,
                priority,
                category,
                createdAt: Date.now(),
                dueDate,
            };
            setTodos((prev) => [newTodo, ...prev]);
        },
        []
    );

    const toggleTodo = useCallback((id: string) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    }, []);

    const deleteTodo = useCallback((id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const editTodo = useCallback(
        (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
            );
        },
        []
    );

    const clearCompleted = useCallback(() => {
        setTodos((prev) => prev.filter((t) => !t.completed));
    }, []);

    const reorderTodos = useCallback((from: number, to: number) => {
        setTodos((prev) => {
            const arr = [...prev];
            const [moved] = arr.splice(from, 1);
            arr.splice(to, 0, moved);
            return arr;
        });
    }, []);

    const filteredAndSorted = (() => {
        let result = todos;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((t) => t.text.toLowerCase().includes(q));
        }

        if (filter === 'active') result = result.filter((t) => !t.completed);
        if (filter === 'completed') result = result.filter((t) => t.completed);

        if (categoryFilter !== 'all')
            result = result.filter((t) => t.category === categoryFilter);

        result = [...result].sort((a, b) => {
            if (sort === 'newest') return b.createdAt - a.createdAt;
            if (sort === 'oldest') return a.createdAt - b.createdAt;
            if (sort === 'priority')
                return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            if (sort === 'dueDate') {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.localeCompare(b.dueDate);
            }
            return 0;
        });

        return result;
    })();

    const stats = {
        total: todos.length,
        completed: todos.filter((t) => t.completed).length,
        active: todos.filter((t) => !t.completed).length,
    };

    return {
        todos: filteredAndSorted,
        allTodos: todos,
        filter,
        setFilter,
        sort,
        setSort,
        search,
        setSearch,
        categoryFilter,
        setCategoryFilter,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        clearCompleted,
        reorderTodos,
        stats,
    };
}
