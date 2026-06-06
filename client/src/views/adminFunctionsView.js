import Sidebar from "@/components/Sidebar";
import { getFunciones, createFuncion, updateFuncion, deleteFuncion } from "@/services/funciones.service";
import Swal from 'sweetalert2';

export function adminFunctionsView() {
  return `
    <div class="flex">
      ${Sidebar()}
      <main class="flex-1 p-8 bg-slate-100 min-h-screen">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold">Gestión de Funciones</h1>
            <p class="text-gray-600">Administra la cartelera del cine</p>
          </div>
          <button id="btnCreateFunction" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Nueva Función
          </button>
        </div>

        <div class="bg-white rounded-xl shadow overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b">
                <th class="p-4 font-semibold text-gray-600">Película</th>
                <th class="p-4 font-semibold text-gray-600">Sala</th>
                <th class="p-4 font-semibold text-gray-600">Fecha y Hora</th>
                <th class="p-4 font-semibold text-gray-600">Cupos</th>
                <th class="p-4 font-semibold text-gray-600">Estado</th>
                <th class="p-4 font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody id="functionsTableBody">
              <tr><td colspan="6" class="p-4 text-center text-gray-500">Cargando funciones...</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `;
}

export const initAdminFunctions = async () => {
  const tbody = document.getElementById("functionsTableBody");
  if (!tbody) return;

  const loadTable = async () => {
    try {
      const funciones = await getFunciones();
      
      if (funciones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">No hay funciones registradas.</td></tr>`;
        return;
      }

      tbody.innerHTML = funciones.map(f => `
        <tr class="border-b hover:bg-gray-50 transition">
          <td class="p-4 font-medium">${f.pelicula}</td>
          <td class="p-4">${f.sala}</td>
          <td class="p-4">${f.fecha} - ${f.hora}</td>
          <td class="p-4">${f.cuposDisponibles}/${f.capacidadTotal}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded-full text-xs font-semibold ${f.estado === 'Activa' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}">
              ${f.estado}
            </span>
          </td>
          <td class="p-4 text-center">
            <button class="btn-edit text-blue-600 hover:text-blue-800 mx-2" data-id="${f.id}">Editar</button>
            <button class="btn-delete text-red-600 hover:text-red-800 mx-2" data-id="${f.id}">Eliminar</button>
          </td>
        </tr>
      `).join('');

      // Add event listeners
      document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => handleEdit(e.target.getAttribute('data-id'), funciones));
      });
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => handleDelete(e.target.getAttribute('data-id')));
      });

    } catch (error) {
      console.error(error);
      tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500">Error al cargar las funciones.</td></tr>`;
    }
  };

  const showFunctionModal = async (funcion = null) => {
    const isEdit = !!funcion;
    const { value: formValues } = await Swal.fire({
      title: isEdit ? 'Editar Función' : 'Nueva Función',
      html: `
        <input id="swal-pelicula" class="swal2-input" placeholder="Película" value="${funcion?.pelicula || ''}">
        <input id="swal-sala" class="swal2-input" placeholder="Sala" value="${funcion?.sala || ''}">
        <input id="swal-fecha" type="date" class="swal2-input" value="${funcion?.fecha || ''}">
        <input id="swal-hora" type="time" class="swal2-input" value="${funcion?.hora || ''}">
        <input id="swal-capacidad" type="number" class="swal2-input" placeholder="Capacidad Total" value="${funcion?.capacidadTotal || ''}">
        <select id="swal-estado" class="swal2-input">
          <option value="Activa" ${funcion?.estado === 'Activa' ? 'selected' : ''}>Activa</option>
          <option value="Cancelada" ${funcion?.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          pelicula: document.getElementById('swal-pelicula').value,
          sala: document.getElementById('swal-sala').value,
          fecha: document.getElementById('swal-fecha').value,
          hora: document.getElementById('swal-hora').value,
          capacidadTotal: parseInt(document.getElementById('swal-capacidad').value),
          estado: document.getElementById('swal-estado').value
        }
      }
    });

    if (formValues) {
      if (!formValues.pelicula || !formValues.sala || !formValues.fecha || !formValues.hora || isNaN(formValues.capacidadTotal)) {
        return Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      }

      try {
        if (isEdit) {
          // If capacity changes, we might need to adjust available slots, simplified here
          const capacityDiff = formValues.capacidadTotal - funcion.capacidadTotal;
          formValues.cuposDisponibles = funcion.cuposDisponibles + capacityDiff;
          await updateFuncion(funcion.id, formValues);
          Swal.fire('Actualizada', 'Función actualizada', 'success');
        } else {
          formValues.id = String(Date.now()); // simple id generation
          formValues.cuposDisponibles = formValues.capacidadTotal;
          await createFuncion(formValues);
          Swal.fire('Creada', 'Función creada exitosamente', 'success');
        }
        loadTable();
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar la función', 'error');
      }
    }
  };

  const handleEdit = (id, funciones) => {
    const funcion = funciones.find(f => f.id === id);
    if (funcion) showFunctionModal(funcion);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará la función y podría afectar reservas existentes.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await deleteFuncion(id);
        Swal.fire('Eliminada', 'La función ha sido eliminada.', 'success');
        loadTable();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la función', 'error');
      }
    }
  };

  document.getElementById('btnCreateFunction')?.addEventListener('click', () => showFunctionModal());

  loadTable();
};
