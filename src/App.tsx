import { useTodos } from './hooks/useTodos';
import { AddTodoForm } from './components/AddTodoForm';
import { FiltersBar } from './components/FiltersBar';
import { TodoList } from './components/TodoList';
import { StatsBar } from './components/StatsBar';
import './App.css';

function App() {
  const {
    todos, filter, setFilter, sort, setSort, search, setSearch,
    categoryFilter, setCategoryFilter, addTodo, toggleTodo, deleteTodo,
    editTodo, clearCompleted, stats,
  } = useTodos();

  return (
    <div className="app-root">
      {/* Ambient background orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <main className="app-main">
        <header className="app-header">
          <div className="header-icon" aria-hidden="true">✦</div>
          <h1 className="app-title">My Tasks</h1>
          <p className="app-subtitle">Stay focused. Get things done.</p>
        </header>

        <StatsBar {...stats} />

        <section className="form-section" aria-label="Add new task">
          <AddTodoForm onAdd={addTodo} />
        </section>

        <section className="list-section" aria-label="Task list">
          <FiltersBar
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            activeCount={stats.active}
            completedCount={stats.completed}
            onClearCompleted={clearCompleted}
          />
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            filter={filter}
            search={search}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
