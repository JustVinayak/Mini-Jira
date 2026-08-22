import axiosInstance from "./axiosInstance";

export const getAllProjects = () =>
    axiosInstance.get("/projects");

export const getProjectById = (id) =>
    axiosInstance.get(`/projects/${id}`);

export const createProject = (data, ownerId) =>
    axiosInstance.post(`/projects?ownerId=${ownerId}`, data);

export const addMember = (projectId, userId) =>
    axiosInstance.post(
        `/projects/${projectId}/members?userId=${userId}`
    );

export const deleteProject = (id) =>
    axiosInstance.delete(`/projects/${id}`);

export const removeMember = (projectId, userId) =>
    axiosInstance.delete(
        `/projects/${projectId}/members/${userId}`
    );