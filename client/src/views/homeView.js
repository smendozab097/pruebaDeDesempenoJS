import Sidebar from "@/components/Sidebar";
import { getSession } from "@/services/auth.service";
import { getFunciones } from "@/services/funciones.service";
import { createReservation } from "@/services/reservations.service";
import { updateFuncion } from "@/services/funciones.service";
import Swal from 'sweetalert2';

export function homeView() {
  const user = getSession();

  return `
    <div class="flex">
      ${Sidebar()}
      <main class="flex-1 p-8 bg-slate-100 min-h-screen">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Cartelera</h1>
          <p class="text-gray-600">Bienvenido, ${user?.name} (${user?.role})</p>
        </div>

        <div id="funcionesContainer" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="w-full text-center py-8 col-span-full">
            <p class="text-gray-500">Cargando cartelera...</p>
          </div>
        </div>
      </main>
    </div>
  `;
}

export const initHome = async () => {
  const container = document.getElementById("funcionesContainer");
  const user = getSession();
  if (!container) return;

  const loadFunciones = async () => {
    try {
      const funciones = await getFunciones();
      
      if (funciones.length === 0) {
        container.innerHTML = "<p class='col-span-full text-center text-gray-500 py-8'>No hay funciones disponibles en este momento.</p>";
        return;
      }

      container.innerHTML = funciones.map(f => `
        <div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div class="p-5 flex-1">
            <h3 class="font-bold text-xl mb-2">${f.pelicula}</h3>
            <div class="space-y-1 text-sm text-gray-600">
              <p><span class="font-semibold">Sala:</span> ${f.sala}</p>
              <p><span class="font-semibold">Fecha:</span> ${f.fecha}</p>
              <p><span class="font-semibold">Hora:</span> ${f.hora}</p>
              <p><span class="font-semibold">Disponibles:</span> <span class="${f.cuposDisponibles === 0 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}">${f.cuposDisponibles}</span> / ${f.capacidadTotal}</p>
              <p><span class="font-semibold">Estado:</span> <span class="${f.estado === 'Activa' ? 'text-blue-600' : 'text-red-600'}">${f.estado}</span></p>
            </div>
          </div>
          ${user.role === 'user' ? `
            <div class="p-4 bg-gray-50 border-t">
              <button class="btn-reservar w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50" 
                data-id="${f.id}" 
                data-cupos="${f.cuposDisponibles}"
                data-estado="${f.estado}"
                ${f.cuposDisponibles === 0 || f.estado !== 'Activa' ? 'disabled' : ''}>
                Reservar Entradas
              </button>
            </div>
          ` : ''}
        </div>
      `).join('');

      // Add event listeners for reservations
      if (user.role === 'user') {
        document.querySelectorAll('.btn-reservar').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const disponibles = parseInt(e.target.getAttribute('data-cupos'));
            
            const { value: cantidad } = await Swal.fire({
              title: 'Reservar Entradas',
              input: 'number',
              inputLabel: 'Cantidad de entradas a reservar',
              inputAttributes: {
                min: 1,
                max: disponibles,
                step: 1
              },
              showCancelButton: true,
              inputValidator: (value) => {
                if (!value || value <= 0) return 'Debes ingresar una cantidad válida';
                if (value > disponibles) return `Solo hay ${disponibles} cupos disponibles`;
              }
            });

            if (cantidad) {
              const qty = parseInt(cantidad);
              try {
                // Fetch latest to ensure availability (simulation)
                const funcion = await getFunciones().then(res => res.find(f => f.id === id));
                if (funcion.cuposDisponibles < qty) {
                  return Swal.fire('Error', 'No hay suficientes cupos.', 'error');
                }
                
                // Update cupos
                funcion.cuposDisponibles -= qty;
                await updateFuncion(id, funcion);

                // Create reservation
                const newRes = {
                  userId: user.id,
                  funcionId: id,
                  pelicula: funcion.pelicula,
                  cantidad: qty,
                  fechaReserva: new Date().toISOString().split('T')[0],
                  status: 'Confirmada'
                };
                await createReservation(newRes);

                Swal.fire('Éxito', 'Reserva creada correctamente', 'success');
                loadFunciones(); // reload
              } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Ocurrió un error al procesar tu reserva', 'error');
              }
            }
          });
        });
      }

    } catch (error) {
      console.error(error);
      container.innerHTML = "<p class='col-span-full text-center text-red-500 py-8'>Error al cargar la cartelera.</p>";
    }
  };

  loadFunciones();
};