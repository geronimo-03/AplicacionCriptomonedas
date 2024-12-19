<template>
    <div class="body">
      <div class="containerCompra">
        <h1>Compra/Venta</h1>
    
       
        <div>
          
          <div class="form-group select">
            <label>Su número de ID es:</label>
            <label>{{ transaction.user_id }}</label>
          </div>
          <form @submit.prevent="realizarTransaccion">
            <div class="form-group">
              <label>Tipo de Transacción</label>
              <select v-model="transaction.action" class="form-control">
                <option value="purchase">Compra</option>
                <option value="sale">Venta</option>
              </select>
            </div>
            <div class="form-group">
              <label>Criptomoneda</label>
              <select v-model="transaction.cripto_code" class="form-control" @change="obtenerPrecioCripto">
                <option value="btc">Bitcoin</option>
                <option value="eth">Ethereum</option>
                <option value="usdc">USD Coin</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cantidad de Criptomoneda</label>
              <input v-model="transaction.crypto_amount" type="number" step="0.00001" class="form-control"
                @blur="obtenerPrecioCripto" />
            </div>
            <div class="form-group">
              <label>Dinero (ARS)</label>
              <input v-model="transaction.money" type="text" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label>Fecha y Hora</label>
              <input v-model="transaction.datetime" type="datetime-local" class="form-control" />
            </div>
            <button type="submit" class="btn btn-secondary btnR">Realizar Transacción</button>
          </form>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios'; 

export default {
  name: 'CompraVenta',
  data() {
    return {
   
      transaction: {
        user_id: '',
        action: 'purchase',
        cripto_code: 'btc',
        crypto_amount: 0,
        money: 0,
        datetime: ''
      },
      estadoUsuario: false 
    };
  },
  mounted() {
    // Verificar el estado del usuario cuando se monta el componente
    this.verificarEstadoUsuario();
  },
  methods: {
    verificarEstadoUsuario() {
      // Verificar si el ID del usuario existe en localStorage
      const userId = localStorage.getItem('userId');
      this.estadoUsuario = !!userId; //!! permite el que el user id sea un valor booleano
      if (this.estadoUsuario) {
        this.transaction.user_id = userId; 
      } else {
        // Redirigir a registro si no está registrado
        this.$router.push({ path: '/' });
      }
    },
    async obtenerPrecioCripto() {
      // Obtener el precio de la criptomoneda cuando cambia la criptomoneda seleccionada o la cantidad
      if (this.transaction.cripto_code && this.transaction.crypto_amount) {
        try {
    
          const response = await axios.get(`https://criptoya.com/api/satoshitango/${this.transaction.cripto_code}/ars`);
          const price = response.data.totalBid; 
          
          this.transaction.money = (this.transaction.crypto_amount * price).toFixed(2);
        } catch (error) {
          console.error('Error al obtener el precio de la criptomoneda:', error); 
        }
      }
    },
    async realizarTransaccion() {
      // Validamos que la cantidad y las monedas en pesos argentinos sea >0 
      if (this.transaction.crypto_amount <= 0 || this.transaction.money <= 0) {
        alert('La cantidad y el monto deben ser mayores a 0.');
        return;
      }

      //Evitamos que el usuario venda mas de lo que compro.
      if (this.transaction.action === 'sale') {
        const cantCriptomonedas = await this.verificarBalanceCripto();
        if (!cantCriptomonedas) {
          alert('No tienes suficiente cantidad de la criptomoneda para realizar la venta.');
          return;
        }
      }

      const date = new Date(this.transaction.datetime);
      this.transaction.datetime = date.toISOString();

      try {
        const apiClient = axios.create({
          baseURL: 'https://laboratorio-ab82.restdb.io/rest',
          headers: { 'x-apikey': '650b525568885487530c00bb' }
        });

        await apiClient.post('/transactions', this.transaction);
        alert('Transacción guardada exitosamente');

        this.limpiarFormulario();

      } catch (error) {
        console.error('Error al guardar la transacción:', error);
        if (error.response && error.response.data) {
          console.log('Errores de validación:', error.response.data);
          alert('Errores de validación: ' + JSON.stringify(error.response.data.list));
        }
      }
    },

    async verificarBalanceCripto() {
      try {
        // Obtener todas las transacciones del usuario
        const response = await axios.get(
          `https://laboratorio-ab82.restdb.io/rest/transactions?q={"user_id": "${this.transaction.user_id}"}`,
          { headers: { 'x-apikey': '650b525568885487530c00bb' } }
        );
        const transactions = response.data;

        // Calcular el balance actual de la criptomoneda seleccionada
        let balance = 0;
        transactions.forEach(tx => {
          if (tx.cripto_code === this.transaction.cripto_code) {
            if (tx.action === 'purchase') {
              balance += parseFloat(tx.crypto_amount);
            } else if (tx.action === 'sale') {
              balance -= parseFloat(tx.crypto_amount);
            }
          }
        });

        // Verificar si el balance es suficiente para la venta
        return balance >= parseFloat(this.transaction.crypto_amount);
      } catch (error) {
        console.error('Error al verificar el balance de criptomonedas:', error);
        return false;
      }
    },

    limpiarFormulario() {

      this.transaction.crypto_amount = '';
      this.transaction.money = '';
      this.transaction.datetime = '';
    }
  }
};
</script>








<style scoped>
.body {
  background-image: url('../assets/fondo.png.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.containerCompra {
  max-width: 600px;
  margin-top: 100px;
  padding: 20px;
  background-color: #181e25;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
  color: #F4D03F;
  text-transform: uppercase;
}

.form-group {
  margin-bottom: 15px;
  color: #fff;
  text-transform: uppercase;
}

.form-group input,
.form-group select,
.form-control[readonly] {
  background-color: #333b47 !important;
  border: 1px solid #F4D03F !important;
  color: #fff;
}

.form-group input:focus,
.form-group input:active,
.form-group select:focus,
.form-group select:active {
  background-color: #333b47;
  border-color: #F4D03F;
  color: #fff;
}

.form-group option,
.form-control input {
  background-color: #333b47;
  color: #fff;

}

.btnR {
  width: 100%;
  background-color: #F4D03F !important;
  color: #181e25 !important;
  text-transform: uppercase;
  border: none;
}

.btnR:hover {

  transition: ease-out 0.5ms;
  font-weight: bold;
}
</style>
