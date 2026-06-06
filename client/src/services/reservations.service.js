const API_URL = "http://localhost:3000/reservations";

export const getReservations = async (userId = null) => {
    try {
        const url = userId ? `${API_URL}?userId=${userId}` : API_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching reservations");
        return await response.json();
    } catch (error) {
        console.error("getReservations error:", error);
        throw error;
    }
};

export const createReservation = async (reservation) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservation),
        });
        if (!response.ok) throw new Error("Error creating reservation");
        return await response.json();
    } catch (error) {
        console.error("createReservation error:", error);
        throw error;
    }
};

export const updateReservation = async (id, reservation) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservation),
        });
        if (!response.ok) throw new Error("Error updating reservation");
        return await response.json();
    } catch (error) {
        console.error("updateReservation error:", error);
        throw error;
    }
};

export const deleteReservation = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error deleting reservation");
        return await response.json();
    } catch (error) {
        console.error("deleteReservation error:", error);
        throw error;
    }
};
