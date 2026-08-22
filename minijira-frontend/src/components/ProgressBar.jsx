export default function ProgressBar({
    percent,
    totalTasks,
}) {
    return (
        <div className="progress-widget">
            <div className="progress-header">
                <span>
                    {percent}% complete
                </span>

                <span className="muted">
                    {totalTasks}{" "}
                    {totalTasks === 1
                        ? "task"
                        : "tasks"}
                </span>
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{
                        width: `${percent}%`,
                    }}
                />
            </div>
        </div>
    );
}