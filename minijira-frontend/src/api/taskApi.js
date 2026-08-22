import axiosInstance from "./axiosInstance";

export const getTasksByProject = (projectId) =>
    axiosInstance.get(`/tasks/project/${projectId}`);

export const updateTaskStatus = (taskId, status) =>
    axiosInstance.patch(
        `/tasks/${taskId}/status?status=${status}`
    );

export const assignTask = (taskId, assigneeId) =>
    axiosInstance.patch(
        `/tasks/${taskId}/assign?assigneeId=${assigneeId}`
    );

export const createTask = (data, projectId, assigneeId) =>
    axiosInstance.post(
        `/tasks?projectId=${projectId}${assigneeId ? `&assigneeId=${assigneeId}` : ""}`,
        data
    );

export const deleteTask = (id) =>
    axiosInstance.delete(`/tasks/${id}`);

export const getProjectSummary = (projectId) =>
    axiosInstance.get(
        `/tasks/project/${projectId}/summary`
    );