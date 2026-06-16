import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api/v1/user",
    withCredentials:true,
    headers: {
        "Content-Type": "application/json"
    }
});

const register = async ({ firstname, lastname, email, password }) => {
    try {
        const response = await apiClient.post("/register", {
            firstname,
            lastname,
            email,
            password
        });
        return response.data;
    } catch (err) {
        console.error("register Error:", err);
    }
};

const login = async ({ email, password }) => {
    try {
        const response = await apiClient.post("/login", {
            email,
            password
        });
        return response.data;
    } catch (err) {
        console.error("login Error:", err);
    }
};

const getProfile = async () => {
    try {
        const response = await apiClient.get("/getProfile");
        return response.data;
    } catch (err) {
        console.error("getProfile Error:", err);
    }
};

const logout = async () => {
    try {
        const response = await apiClient.get("/logout");
        return response.data;
    } catch (err) {
        console.error("logout Error:", err);
    }
};

export { register, login, getProfile, logout };
