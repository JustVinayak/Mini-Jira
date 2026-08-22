import axiosInstance from "./axiosInstance";

export const getAllUsers = () =>
    axiosInstance.get("/users");

export const createUser = (data) =>
    axiosInstance.post("/users", data);