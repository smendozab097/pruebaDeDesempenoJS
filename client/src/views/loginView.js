import { getUsers } from '@/services/users.service.js';
import { createSession } from '@/services/auth.service.js';
// import Swal from 'sweetalert2';


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
          <button type="submit" class="bg-blue-600 text-white w-full py-2 rounded">
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
        // Primero obtenemos todos los usuarios y buscamos coincidencia
        const users = await getUsers();
        const userMatch = users.find(u => u.email === email && u.password === password);

        if (userMatch) {
          console.log('Login exitoso:', userMatch);

          // Si el login es exitoso, se guarda la sesión activa en el Storage
          createSession(userMatch);

          // Se limpia el formulario
          loginForm.reset();

          // Navegamos al dashboard mediante History API
          // Cambia la URL sin recargar la página y dispara manualmente el evento 'popstate'
          // para que el enrutador de la SPA detecte el cambio y renderice la nueva vista.
          history.pushState(null, null, '/home');
          window.dispatchEvent(new Event('popstate'));

        } else {
          // ----------------------------------------
          // ERROR DE CREDENCIALES
          // ----------------------------------------
          console.error('Credenciales incorrectas');
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Error',
          //   text: 'Correo o contraseña incorrectos. Intentalo de nuevo.'
          // });
        }
      } catch (error) {
        console.error('Error durante el login:', error);
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Error de conexión',
        //   text: 'No se pudo conectar con el servidor. Intentalo de nuevo más tarde.'
        // });
      }
    });
  }

}
