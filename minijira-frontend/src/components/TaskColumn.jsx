import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function TaskColumn({
    id,
    title,
    tasks,
    onTaskDeleted,
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`task-column ${isOver ? "is-over" : ""}`}
        >
            <div className="column-header">
                <h2>{title}</h2>
                <span className="task-count">{tasks.length}</span>
            </div>

            {tasks.length === 0 ? (
                <p className="task-column-empty">
                    No tasks here
                </p>
            ) : (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onDeleted={onTaskDeleted}
                    />
                ))
            )}
        </div>
    );
}