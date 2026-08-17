import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    closestCorners,
} from "@dnd-kit/core";

import {
    getTasksByProject,
    updateTaskStatus,
} from "../api/taskApi";

import TaskColumn from "../components/TaskColumn";
import TaskCard from "../components/TaskCard";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

const STATUS_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

export default function ProjectBoardPage() {
    const { id: projectId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);

    useEffect(() => {
        getTasksByProject(projectId)
            .then((res) => {
                setTasks(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch tasks:", err);
            });
    }, [projectId]);

    const handleDragStart = (event) => {
        const task = tasks.find(
            (task) => task.id === event.active.id
        );

        setActiveTask(task);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) {
            return;
        }

        const taskId = active.id;
        const newStatus = over.id;

        const currentTask = tasks.find(
            (task) => task.id === taskId
        );

        if (!currentTask || currentTask.status === newStatus) {
            return;
        }

        const previousTasks = tasks;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          status: newStatus,
                      }
                    : task
            )
        );

        try {
            await updateTaskStatus(taskId, newStatus);
        } catch (err) {
            console.error(
                "Failed to update task status:",
                err
            );

            setTasks(previousTasks);
        }
    };

    return (
        <div className="board-page">
            <div className="board-header">
                <h1>Project Board</h1>
                <p>
                    Drag and drop tasks to update their status.
                </p>
            </div>

            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="board-columns">
                    {STATUSES.map((status) => (
                        <TaskColumn
                            key={status}
                            id={status}
                            title={STATUS_LABELS[status]}
                            tasks={tasks.filter(
                                (task) =>
                                    task.status === status
                            )}
                        />
                    ))}
                </div>

                <DragOverlay
                    dropAnimation={{
                        duration: 200,
                        easing: "ease-out",
                    }}
                >
                    {activeTask ? (
                        <TaskCard
                            task={activeTask}
                            overlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}