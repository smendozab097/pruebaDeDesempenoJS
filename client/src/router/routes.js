import { homeView, initHome } from "@/views/homeView";
import { loginView, initLogin } from "@/views/loginView";
import { carteleraAdminView, initCarteleraAdmin } from "@/views/carteleraAdminView";
import { reservationListView, initReservationList } from "@/views/reservationListView";

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
        render: carteleraAdminView,
        init: initCarteleraAdmin,
        requiresAuth: true,
        allowedRoles: ["admin"]
    },
    "/reservas": {
        render: reservationListView,
        init: initReservationList,
        requiresAuth: true,
        allowedRoles: ["admin"]
    },
    "/mis-reservas": {
        render: reservationListView,
        init: initReservationList,
        requiresAuth: true,
        allowedRoles: ["user"]
    }
};

export default routes;
