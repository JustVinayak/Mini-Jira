import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
    task,
    overlay = false,
}) {
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