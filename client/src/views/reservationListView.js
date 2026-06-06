import Sidebar from "@/components/Sidebar";
import { getSession } from "@/services/auth.service";
import { getReservations, updateReservation } from "@/services/reservations.service";
import { getFunciones, updateFuncion } from "@/services/funciones.service";
import Swal from 'sweetalert2';

export function reservationListView() {
  const user = getSession();
  const isAdmin = user?.role === 'admin';

  return `
    <div class="flex">
      ${Sidebar()}
      <main class="flex-1 p-8 bg-slate-100 min-h-screen">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">${isAdmin ? 'Todas las Reservas' : 'Mis Reservas'}</h1>
          <p class="text-gray-600">
            ${isAdmin ? 'Gestión de todas las reservas del sistema' : 'Historial y estado de tus reservas'}
          </p>
        </div>

        <div class="bg-white rounded-xl shadow overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b">
                <th class="p-4 font-semibold text-gray-600">ID</th>
                ${isAdmin ? '<th class="p-4 font-semibold text-gray-600">Usuario ID</th>' : ''}
                <th class="p-4 font-semibold text-gray-600">Película</th>
                <th class="p-4 font-semibold text-gray-600">Cantidad</th>
                <th class="p-4 font-semibold text-gray-600">Fecha</th>
                <th class="p-4 font-semibold text-gray-600">Estado</th>
                <th class="p-4 font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody id="reservationsTableBody">
              <tr><td colspan="${isAdmin ? 7 : 6}" class="p-4 text-center text-gray-500">Cargando reservas...</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `;
}

export const initReservationList = async () => {
  const tbody = document.getElementById("reservationsTableBody");
  const user = getSession();
  if (!tbody || !user) return;
  const isAdmin = user.role === 'admin';

  const loadTable = async () => {
    try {
      const reservations = await getReservations(isAdmin ? null : user.id);

      if (reservations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${isAdmin ? 7 : 6}" class="p-4 text-center text-gray-500">No tienes reservas.</td></tr>`;
        return;
      }

      let htmlContent = "";
      for (let i = 0; i < reservations.length; i++) {
        const r = reservations[i];
        htmlContent += `
        <tr class="border-b hover:bg-gray-50 transition">
          <td class="p-4 text-sm text-gray-500">#${r.id}</td>
          ${isAdmin ? `<td class="p-4 text-sm">${r.userId}</td>` : ''}
          <td class="p-4 font-medium">${r.pelicula}</td>
          <td class="p-4">${r.cantidad} entradas</td>
          <td class="p-4">${r.fechaReserva}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded-full text-xs font-semibold 
              ${r.status === 'Confirmada' ? 'bg-green-100 text-green-700' :
          r.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
              ${r.status}
            </span>
          </td>
          <td class="p-4 text-center">
            ${r.status !== 'Cancelada' ? `
              <button class="btn-cancel text-red-600 hover:text-red-800 text-sm font-semibold mx-1" data-id="${r.id}">
                Cancelar
              </button>
            ` : '<span class="text-gray-400 text-sm">Cancelada</span>'}
          </td>
        </tr>
        `;
      }
      tbody.innerHTML = htmlContent;

      // Add event listeners for canceling
      document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => handleCancel(e.target.getAttribute('data-id'), reservations));
      });

    } catch (error) {
      console.error(error);
      tbody.innerHTML = `<tr><td colspan="${isAdmin ? 7 : 6}" class="p-4 text-center text-red-500">Error al cargar las reservas.</td></tr>`;
    }
  };

  const handleCancel = async (id, reservations) => {
    const reservation = reservations.find(r => r.id === String(id) || r.id === Number(id));
    if (!reservation) return;

    const result = await Swal.fire({
      title: '¿Cancelar Reserva?',
      text: "Se cancelará esta reserva y se liberarán los cupos. Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar'
    });

    if (result.isConfirmed) {
      try {
        // 1. Update reservation status
        reservation.status = 'Cancelada';
        await updateReservation(reservation.id, reservation);

        // 2. Liberate slots
        const funciones = await getFunciones();
        const funcion = funciones.find(f => f.id === reservation.funcionId);
        if (funcion) {
          funcion.cuposDisponibles += reservation.cantidad;
          await updateFuncion(funcion.id, funcion);
        }

        Swal.fire('Cancelada', 'La reserva ha sido cancelada.', 'success');
        loadTable();
      } catch (error) {
        Swal.fire('Error', 'No se pudo cancelar la reserva.', 'error');
      }
    }
  };

  loadTable();
};
