const API_URL = "http://localhost:3000/funciones";

export const getFunciones = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error fetching funciones");
        return await response.json();
    } catch (error) {
        console.error("getFunciones error:", error);
        throw error;
    }
};

export const getFuncionById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error fetching funcion");
        return await response.json();
    } catch (error) {
        console.error("getFuncionById error:", error);
        throw error;
    }
};

export const createFuncion = async (funcion) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(funcion),
        });
        if (!response.ok) throw new Error("Error creating funcion");
        return await response.json();
    } catch (error) {
        console.error("createFuncion error:", error);
        throw error;
    }
};

export const updateFuncion = async (id, funcion) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(funcion),
        });
        if (!response.ok) throw new Error("Error updating funcion");
        return await response.json();
    } catch (error) {
        console.error("updateFuncion error:", error);
        throw error;
    }
};

export const deleteFuncion = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error deleting funcion");
        return await response.json();
    } catch (error) {
        console.error("deleteFuncion error:", error);
        throw error;
    }
};
