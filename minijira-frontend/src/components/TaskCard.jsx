import { useDraggable } from "@dnd-kit/core";
import { deleteTask } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";

export default function TaskCard({
    task,
    overlay = false,
    onDeleted,
}) {
    const { role } = useAuth();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.id,
    });

    const style =
        !overlay && transform
            ? {
                  transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              }
            : undefined;

    const handleDelete = async (event) => {
        event.stopPropagation();

        const confirmed = window.confirm(
            "Delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteTask(task.id);
            onDeleted?.(task.id);
        } catch (err) {
            console.error("Failed to delete task:", err);

            alert(
                err.response?.data?.error ||
                "Failed to delete task"
            );
        }
    };

    return (
        <div
            ref={overlay ? undefined : setNodeRef}
            style={style}
            {...(overlay ? {} : listeners)}
            {...(overlay ? {} : attributes)}
            className={`
                task-card
                priority-${task.priority?.toLowerCase()}
                ${overlay ? "task-card-overlay" : ""}
                ${
                    isDragging && !overlay
                        ? "task-card-ghost"
                        : ""
                }
            `}
        >
            {!overlay && role === "ADMIN" && (
                <button
                    type="button"
                    className="task-delete-btn"
                    onClick={handleDelete}
                    title="Delete task"
                    aria-label={`Delete ${task.title}`}
                >
                    ×
                </button>
            )}

            <h4>{task.title}</h4>

            {task.description && (
                <p>{task.description}</p>
            )}

            <div className="task-card-footer">
                {task.assignee ? (
                    <span className="assignee">
                        {task.assignee.name}
                    </span>
                ) : (
                    <span className="assignee">
                        Unassigned
                    </span>
                )}

                {task.priority && (
                    <span className="priority-badge">
                        {task.priority}
                    </span>
                )}
            </div>
        </div>
    );
}