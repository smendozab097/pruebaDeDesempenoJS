import routes from "@/router/routes";
import { getSession } from "@/services/auth.service";
import { showAccessDenied } from "@/utils/alerts";
import notFoundView from "@/views/notFound";

export const renderRouter = async () => {
  const app = document.getElementById('app');

  if (!app) {
    return alert("No se encontró el contenedor principal");
  }

  const currentPath = window.location.pathname;

  const route = routes[currentPath] ?? { render: notFoundView };

  // --- Seguridad y Guards ---
  const user = getSession();

  // 1. Guard: Autenticación requerida
  if (route.requiresAuth && !user) {
    history.pushState(null, null, '/login');
    return renderRouter();
  }

  // 2. Guard: Redirección si ya está autenticado (evita ver Login/Register de nuevo)
  if (user && route.redirectIfAuthenticated) {
    history.pushState(null, null, '/home');
    return renderRouter();
  }

  // 3. Guard: Autorización de roles (allowedRoles)
  if (route.allowedRoles && user) {
    const hasPermission = route.allowedRoles.some(role => user.role && user.role.includes(role));
    if (!hasPermission) {
      console.warn(`Usuario no autorizado para entrar a: ${currentPath}`);
      await showAccessDenied();
      history.pushState(null, null, '/home');
      return renderRouter();
    }
  }

  // 4. Renderizamos la vista
  app.innerHTML = route.render();

  // 5. Ejecutamos la inicialización de la vista
  if (route.init) {
    await route.init();
  }
};

export const initRouter = () => {
  // Soporte para las flechas Atrás/Adelante del navegador
  window.addEventListener('popstate', renderRouter);

  // Interceptamos los clics en enlaces SPA
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      history.pushState(null, null, href);
      renderRouter();
    }
  });

  // Primera carga al abrir la página
  renderRouter();
};
