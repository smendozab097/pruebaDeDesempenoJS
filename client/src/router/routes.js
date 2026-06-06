import { homeView, initHome } from "@/views/homeView";
import { loginView, initLogin } from "@/views/loginView";
import { adminFunctionsView, initAdminFunctions } from "@/views/adminFunctionsView";
import { reservationsView, initReservations } from "@/views/reservationsView";

const routes = {
    "/": {
        render: loginView,
        init: initLogin,
        requiresAuth: false,
        redirectIfAuthenticated: true
    },
    "/login": {
        render: loginView,
        init: initLogin,
        requiresAuth: false,
        redirectIfAuthenticated: true
    },
    "/home": {
        render: homeView,
        init: initHome,
        requiresAuth: true,
        allowedRoles: ["admin", "user"]
    },
    "/funciones": {
        render: adminFunctionsView,
        init: initAdminFunctions,
        requiresAuth: true,
        allowedRoles: ["admin"]
    },
    "/reservas": {
        render: reservationsView,
        init: initReservations,
        requiresAuth: true,
        allowedRoles: ["admin"]
    },
    "/mis-reservas": {
        render: reservationsView,
        init: initReservations,
        requiresAuth: true,
        allowedRoles: ["user"]
    }
};

export default routes;
