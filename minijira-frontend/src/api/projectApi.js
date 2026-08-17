import axiosInstance from "./axiosInstance";

export const getAllProjects = () =>
    axiosInstance.get("/projects");

export const getProjectById = (id) =>
    axiosInstance.get(`/projects/${id}`);

export const createProject = (data, ownerId) =>
    axiosInstance.post(`/projects?ownerId=${ownerId}`, data);