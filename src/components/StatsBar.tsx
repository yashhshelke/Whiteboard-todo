import React from 'react';

interface StatsProps {
    total: number;
    completed: number;
    active: number;
}

export const StatsBar: React.FC<StatsProps> = ({ total, completed, active }) => {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="stats-bar">
            <div className="stat-chips">
                <div className="stat-chip total">
                    <span className="stat-icon">📋</span>
                    <div>
                        <span className="stat-value">{total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                </div>
                <div className="stat-chip active-stat">
                    <span className="stat-icon">⚡</span>
                    <div>
                        <span className="stat-value">{active}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
                <div className="stat-chip done">
                    <span className="stat-icon">✅</span>
                    <div>
                        <span className="stat-value">{completed}</span>
                        <span className="stat-label">Done</span>
                    </div>
                </div>
            </div>

            {total > 0 && (
                <div className="progress-wrap">
                    <div className="progress-header">
                        <span className="progress-label">Overall Progress</span>
                        <span className="progress-pct">{pct}%</span>
                    </div>
                    <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                        <div
                            className="progress-fill"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
