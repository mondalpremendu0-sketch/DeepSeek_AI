import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api/v1/user",
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
