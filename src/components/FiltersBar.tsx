import React from 'react';
import type { FilterType, SortType, Category } from '../types/todo';

interface FiltersBarProps {
    filter: FilterType;
    setFilter: (f: FilterType) => void;
    sort: SortType;
    setSort: (s: SortType) => void;
    search: string;
    setSearch: (s: string) => void;
    categoryFilter: Category | 'all';
    setCategoryFilter: (c: Category | 'all') => void;
    activeCount: number;
    completedCount: number;
    onClearCompleted: () => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
];

const SORTS: { label: string; value: SortType }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Priority', value: 'priority' },
    { label: 'Due Date', value: 'dueDate' },
];

const CATEGORIES: { label: string; value: Category | 'all' }[] = [
    { label: '🌐 All', value: 'all' },
    { label: '👤 Personal', value: 'personal' },
    { label: '💼 Work', value: 'work' },
    { label: '🛒 Shopping', value: 'shopping' },
    { label: '❤️ Health', value: 'health' },
    { label: '📌 Other', value: 'other' },
];

export const FiltersBar: React.FC<FiltersBarProps> = ({
    filter, setFilter, sort, setSort, search, setSearch,
    categoryFilter, setCategoryFilter, activeCount, completedCount, onClearCompleted,
}) => {
    return (
        <div className="filters-bar">
            <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search tasks…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">
                        ✕
                    </button>
                )}
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <span className="filter-label">Show</span>
                    {FILTERS.map(({ label, value }) => (
                        <button
                            key={value}
                            className={`filter-btn ${filter === value ? 'active' : ''}`}
                            onClick={() => setFilter(value)}
                        >
                            {label}
                            {value === 'active' && activeCount > 0 && (
                                <span className="filter-count">{activeCount}</span>
                            )}
                            {value === 'completed' && completedCount > 0 && (
                                <span className="filter-count">{completedCount}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="filter-group">
                    <span className="filter-label">Sort</span>
                    <select
                        className="sort-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortType)}
                    >
                        {SORTS.map(({ label, value }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="category-scroll">
                {CATEGORIES.map(({ label, value }) => (
                    <button
                        key={value}
                        className={`cat-chip ${categoryFilter === value ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {completedCount > 0 && (
                <button className="clear-completed-btn" onClick={onClearCompleted}>
                    Clear {completedCount} completed
                </button>
            )}
        </div>
    );
};
