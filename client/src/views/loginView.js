import { getUsers } from '@/services/users.service.js';
import { createSession } from '@/services/auth.service.js';
import Swal from 'sweetalert2';


export function loginView() {

  return `
    <div class="min-h-screen flex justify-center items-center bg-slate-100">
      <div class="bg-white p-8 rounded-lg shadow w-96">
        <h1 class="text-3xl font-bold mb-5">
          Login
        </h1>
        <form id="loginForm">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Correo"
            required
            class="border w-full p-2 rounded mb-3"
          >
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            class="border w-full p-2 rounded mb-4"
          >
          <button type="submit" class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  `
}

export const initLogin = () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(loginForm);
      const email = data.get("email").trim().toLowerCase();
      const password = data.get("password");

      try {
        const users = await getUsers();
        const userMatch = users.find(u => u.email === email && u.password === password);

        if (userMatch) {
          createSession(userMatch);

          loginForm.reset();

          history.pushState(null, null, '/home');
          window.dispatchEvent(new Event('popstate'));

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo o contraseña incorrectos. Inténtalo de nuevo.'
          });
        }
      } catch (error) {
        console.error('Error durante el login:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }

}
