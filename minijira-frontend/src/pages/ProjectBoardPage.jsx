import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    getTasksByProject,
    updateTaskStatus,
    getProjectSummary,
} from "../api/taskApi";

import { getProjectById } from "../api/projectApi";
import { useAuth } from "../context/AuthContext";
import TaskColumn from "../components/TaskColumn";
import TaskCard from "../components/TaskCard";
import TeamPanel from "../components/TeamPanel";
import CreateTaskModal from "../components/CreateTaskModal";
import ProgressBar from "../components/ProgressBar";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

const STATUS_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

export default function ProjectBoardPage() {
    const { id: projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [summary, setSummary] = useState(null);
    const { role } = useAuth();

    const loadProject = async () => {
        try {
            const res = await getProjectById(projectId);
            setProject(res.data);
        } catch (err) {
            console.error("Failed to fetch project:", err);
        }
    };

const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

    const loadTasks = async () => {
        try {
            const res = await getTasksByProject(projectId);
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    };

const loadSummary = async () => {
    try {
        const res = await getProjectSummary(projectId);
        setSummary(res.data);
    } catch (err) {
        console.error(
            "Failed to fetch project summary:",
            err
        );
    }
};

    useEffect(() => {
        loadProject();
        loadTasks();
        loadSummary();
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

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;
        const currentTask = tasks.find(
            (task) => task.id === taskId
        );

        if (
            !currentTask ||
            currentTask.status === newStatus
        ) {
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
            await updateTaskStatus(
                taskId,
                newStatus
            );

            await loadSummary();
        } catch (err) {
            console.error(
                "Failed to update task status:",
                err
            );

            setTasks(previousTasks);
        }
    };

const handleTaskDeleted = async (taskId) => {
    setTasks((prev) =>
        prev.filter(
            (task) => task.id !== taskId
        )
    );

    await loadSummary();
};

    return (
        <div className="board-page">
            <div className="board-header">
                <div className="board-header-row">
                    <div>
                        <h1>
                            {project?.name || "Project Board"}
                        </h1>

                        <p>
                            Drag and drop tasks to update
                            their status.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="login-button"
                        onClick={() =>
                            setShowTaskModal(true)
                        }
                    >
                        + New Task
                    </button>
                </div>
            </div>

            {summary && (
                <ProgressBar
                    percent={summary.percentComplete}
                    totalTasks={summary.totalTasks}
                />
            )}

            {project && role === "ADMIN" && (
                <TeamPanel
                    project={project}
                    onMemberAdded={loadProject}
                />
            )}

            {showTaskModal && project && (
                <CreateTaskModal
                    projectId={projectId}
                    members={project.members}
                    onClose={() =>
                        setShowTaskModal(false)
                    }
                    onCreated={async (newTask) => {
                        setTasks((prev) => [
                            ...prev,
                            newTask,
                        ]);

                        await loadSummary();
                    }}
                />
            )}

            <DndContext
                sensors={sensors}
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
                                (task) => task.status === status
                            )}
                            onTaskDeleted={handleTaskDeleted}
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