<template>
    <div class="login-container">
      <div class="sidenav">
        <div class="container">
          <h2 class="login-main-text">Bienvenido</h2>
          <p class="login-main-text">
            Ingresa tus datos para continuar. <br />
            Tu <span>ID único</span> será generado automáticamente.
          </p>
        </div>
      </div>
      <div class="main">
        <div class="col-md-6 col-sm-12">
          <form class="login-form" @submit.prevent="registrarse">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input
                type="text"
                id="name"
                v-model="name"
                placeholder="Ingresa tu nombre"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="surname">Apellido</label>
              <input
                type="text"
                id="surname"
                v-model="surname"
                placeholder="Ingresa tu apellido"
                required
                class="form-control"
              />
            </div>
            
            <button type="submit" class="btn btn-secondary">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        surname: '',
        userId: '', 
      };
    },
    methods: {
      registrarse() {
        // Genera un ID único automáticamente
        const userId = this.generarId();
        this.userId = userId;
  
        // Almacena los datos en localStorage
        localStorage.setItem('name', this.name);
        localStorage.setItem('surname', this.surname);
        localStorage.setItem('userId', userId);
  
        // Redirige a la pantalla principal
        this.$router.push({ path: '/app' });
      },
      generarId() {
        return 'user-' + Math.random().toString(36).substring(2, 10);
      },
    },
  };
  </script>
  
  <style scoped>
  body {
    font-family: "Lato", sans-serif;
  }
  .login-container {
    display: flex;
    height: 100vh;
  }
  .sidenav {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-image: url('../assets/fondo1.png'); /* Cambia por tu imagen */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: #fff;
  }
  .sidenav::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  .container {
    position: relative;
    z-index: 2;
    text-align: center;
  }
  .login-main-text h2 {
    font-size: 30px;
  }
  .login-main-text {
    font-size: 20px;
    font-weight: bold;
  }
  .login-main-text p span {
    color: #F4D03F;
  }
  .main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #566573;
  }
  .col-md-6,
  .col-sm-12 {
    width: 100%;
    padding: 20px;
  }
  .login-form {
    width: 100%;
    max-width: 400px;
    background: #000;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    color: #fff;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .form-control {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #F4D03F;
    border-radius: 5px;
    background-color: #000;
    color: #fff;
  }
  .form-control:focus,
  .form-control:active {
    background-color: #000;
    color: #fff;
    border: 1px solid #F4D03F;
    outline: none;
  }
  .btn {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
  }
  .btn-secondary {
    background-color: #F4D03F;
    color: #000000;
  }
  .btn-secondary:hover {
    background-color: #566573;
    color: #F4D03F;
  }
  .idusuario {
    margin-top: 15px;
  }
  .idusuario span {
    color: #F4D03F;
  }
  </style>
  