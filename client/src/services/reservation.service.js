const endpointReservation = "http://localhost:3000/reservations";

export const getReservations = async (userid) =>{
  // Si la funcion recibe un userid, le agregamos el filtro a la URL.
    // Si no recibe nada (undefined), usamos el endpoint normal para traer todo.
    const url = userid ? `${endpointReservation}?userid=${userid}` : endpointReservation;
    
    const response = await fetch(url); 
    if (!response.ok) throw new Error('Fallo al obtener las reservas');
    const data = await response.json();
    return data;
  }

export const createReservation = async (data) => {
    const response = await fetch(endpointReservation, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Fallo al crear la reserva");

    return response;
}