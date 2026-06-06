import { homeView, initHome } from "@/views/homeView";
import { loginView, initLogin } from "@/views/loginView";

const routes = {
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
    }
};

export default routes;
