import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * LAYER 1: AXIOS API SERVICE LAYER
 * Pure data mapping layer. Standardizes response layouts.
 */
export const createSession = async (userId, title) => {
    try {
        const response = await apiClient.post("/session", { userId, title });
        return response.data;
    } catch (err) {
        console.error("createSession Error:", err);
    }
};

// GET: Pull all sidebar history lines for a specific user ID
export const getUserSessions = async userId => {
    try {
        const response = await apiClient.get(`/user/${userId}`);
        return response.data;
    } catch (err) {
        console.error("getUserSessions Error:", err);
    }
};

// GET: Pull historical message arrays for an active thread view
export const getSessionMessages = async sessionId => {
    try {
        const response = await apiClient.get(`/session/${sessionId}`);
        return response.data;
    } catch (err) {
        console.error("Error:", err);
    }
};

// DELETE: Trigger an administrative cascading sweep
export const deleteSession = async sessionId => {
    try {
        const response = await apiClient.delete(`/session/${sessionId}`);
        return response.data;
    } catch (err) {
        console.error("deleteSession Error:", err);
    }
};
