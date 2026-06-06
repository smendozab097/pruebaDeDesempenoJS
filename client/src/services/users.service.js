const endpointUser = "http://localhost:3000/users";

export async function getUsers() {
    const response = await fetch(endpointUser);
    const data = await response.json();
    return data;
}



