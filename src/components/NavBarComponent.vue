<template>
    <div class="body">
        <nav class="navbar-custom">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <RouterLink to="/app" class="navbar-brand">
                        <img src="../assets/logoCripto4.png" alt="Logo" class="logo-img img-fluid" />
                    </RouterLink>

                </li>
                <li class="nav-item">
                    <router-link to="/app" class="nav-link-custom" active-class="active">Inicio</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="compraventa" class="nav-link-custom"
                        active-class="active">Compra/Venta</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="movimientos" class="nav-link-custom"
                        active-class="active">Movimientos</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="analisis" class="nav-link-custom"
                        active-class="active">Analisis</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="inversion" class="nav-link-custom"
                        active-class="active">Inversion</router-link>
                </li>
            </ul>
            <div class="usuario" v-if="name && surname">
                <span>{{ name + ' ' + surname }}</span>
                <button @click="CerrarSesion" class="botonLogout">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M3 5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm10.707-.293a1 1 0 010 1.414L11.414 9H17a1 1 0 110 2h-5.586l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                    Cerrar sesión
                </button>
            </div>

        </nav>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            surname: '',
        };
    },
    methods: {
        CerrarSesion() {
            localStorage.clear(); // Limpia los datos de usuario
            this.name = ''; // Limpia el estado del nombre
            this.surname = ''; // Limpia el estado del apellido
            this.$router.push({ path: '/' }); // Redirige al usuario a la página de inicio
        },
        existeUser() {
            const userId = localStorage.getItem('userId'); // Obtiene el ID de usuario del localStorage
            const nombre = localStorage.getItem('name');
            const apellido = localStorage.getItem('surname'); // Obtiene el apellido de usuario del localStorage
            if (userId) { // Si existe un ID de usuario
                this.name = nombre;
                this.surname = apellido; // Almacena el nombre y apellido en el estado
            }
        },
    },
    mounted() {
        this.existeUser(); // Verifica el estado del usuario al iniciar
    },
};
</script>


<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.navbar-custom {
    background-color: rgba(0, 0, 0, 0.9);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    display: flex;
    align-items: center;
}

.logo-img {
    width: 110px;
    height: auto;
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: rotate(360deg);
}


.navbar-nav {
    display: flex;
    flex-direction: row;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1rem;
    align-items: center;
}

.nav-link-custom {
    text-transform: uppercase;
    font-size: 14px;
    color: #ffffff !important;
    padding: 10px 20px;
    border-radius: 4px;
    position: relative;
    transition: color 0.3s ease;
    text-decoration: none;
}

.nav-link-custom:hover .active {
    color: #f4d03f !important;
}

.nav-link-custom::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: #F4D03F;
    transition: width 0.3s ease;
}

.nav-link-custom:hover::after {
    width: 100%;
}

.nav-link-custom.active {
    color: #F4D03F !important;
}

.nav-link-custom.active::after {
    width: 100%;
}

.usuario {
    display: flex;
    align-items: center;
    margin-left: auto;
    /* Mueve el contenido hacia el lado derecho */
    gap: 0.5rem;
}

.usuario span {
    font-weight: bold;
    color: #ffffff;
    font-size: 1.1rem;
}

.botonLogout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s;
    cursor: pointer;
}

.botonLogout:hover {
    background-color: #e03b3b;
}

.botonLogout svg {
    width: 20px;
    height: 20px;
}
</style>
