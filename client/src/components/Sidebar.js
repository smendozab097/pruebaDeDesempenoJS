import { deleteSession, getSession } from "@/services/auth.service";

export default function Sidebar() {
  const user = getSession();
  const isAdmin = user && user.role === "admin";

  setTimeout(() => {
    document
      .querySelector("#logoutBtn")
      ?.addEventListener("click", () => {
        deleteSession();
        history.pushState(null, null, '/login');
        window.dispatchEvent(new Event('popstate'));
      });
  });

  return `
    <aside class="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col">
      <h2 class="text-2xl font-bold mb-8 text-center text-blue-400">
        CinemaApp
      </h2>

      <nav class="flex flex-col gap-4 flex-1">
        <a href="/home" class="px-3 py-2 hover:bg-gray-700 rounded-xl transition" data-link>
          Cartelera
        </a>

        ${isAdmin ? `
          <a href="/funciones" class="px-3 py-2 hover:bg-gray-700 rounded-xl transition" data-link>
            Gestión Funciones
          </a>
          <a href="/reservas" class="px-3 py-2 hover:bg-gray-700 rounded-xl transition" data-link>
            Todas las Reservas
          </a>
        ` : `
          <a href="/mis-reservas" class="px-3 py-2 hover:bg-gray-700 rounded-xl transition" data-link>
            Mis Reservas
          </a>
        `}

        <button
          id="logoutBtn"
          class="text-left cursor-pointer text-red-400 hover:text-white hover:bg-red-500 px-3 py-2 rounded-xl mt-auto transition"
        >
          Cerrar sesión
        </button>
      </nav>
    </aside>
  `;
}