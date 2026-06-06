import Swal from 'sweetalert2';

// Utilidad global para mostrar una alerta visual de denegación de permisos/acceso
export function showAccessDenied() {
    return Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para acceder a esta sección.',
        confirmButtonColor: '#3b82f6'
    });
}
