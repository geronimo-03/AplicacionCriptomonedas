<template>
    <div>
        <Navbar />
        <main>
            <router-view />
            <div class="background">
                <div class="container">
                    <div class="row">
                        <div class="col left">
                            <p class="texto">Te damos la bienvenida a Bit <span class="activ">Wallet</span></p>
                            <p class="texto1">En Bit Wallet creemos que todos deben tener la libertad de ganar,
                                mantener, gastar,
                                compartir y dar su propio dinero, sin importar quién sea ni de dónde venga.</p>
                            <p class="texto1">¡Para empezar a usar Bit Wallet, necesitas registrarte con tu dirección de
                                correo
                                electrónico. Después de
                                registrarte, recibirás un ID único que deberás mantener seguro. Este ID te permitirá
                                acceder a tu cuenta
                                y realizar transacciones de manera segura en cada página de nuestra plataforma.
                                Registrarte es rápido y
                                te proporciona acceso exclusivo para operar con confianza y comodidad!</p>
                        </div>
                        <div class="col right">
                            <img src="../assets/fondoderecha.png" alt="" srcset="">
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Navbar from '@/components/NavBarComponent.vue';

export default {
    components: {
        Navbar,
    },
    data() {
        return {
            estadoUsuario: false, // Variable para rastrear el estado del usuario
        };
    },
    mounted() {
        this.verificarEstadoUsuario();
    },
    methods: {
        verificarEstadoUsuario() {
            // Verificar si el ID del usuario existe en localStorage
            const userId = localStorage.getItem('userId');
            this.estadoUsuario = !!userId; // Actualizar el estado de registro
            if (!this.estadoUsuario) {
                // Redirigir a login si no está registrado
                this.$router.push({ path: '/' });
            }
        },
    },
};
</script>

<style scoped>
.activ {
    color: #f4d03f;
}

/* Estilos existentes */
.texto {
    font-weight: 600;
    font-size: 48px;
    line-height: 56px;
    color: #B7BDC6;
}

.background {
    background-image: url('../assets/fondo.png.png');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 90%;
    max-width: 1200px;
    text-align: left;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    animation: moveFromTop 1s ease;
}

.row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.texto1 {
    font-size: 16px;
    color: #B7BDC6;
}

.col {
    width: 48%;
}

.left {
    margin-top: 50px;
}

.right {
    margin-top: 100px;
}

@keyframes moveFromTop {
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .container {
        width: 90%;
        margin-top: 100px;
        margin-bottom: 50px;
    }
    .row {
        flex-direction: column;
    }
    .col {
        width: 100%;
    }
    .left {
        margin-top: 0;
    }
    .right {
        margin-top: 20px;
    }
}
</style>
