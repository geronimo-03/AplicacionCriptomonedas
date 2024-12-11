<template>
  <div class="container">
    <h1>Análisis de Inversiones</h1>
    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado (ARS)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resultado in resultados" :key="resultado.codigo">
          <td>{{ resultado.codigo }}</td>
          <td :class="resultado.resultado >= 0 ? 'ganancia' : 'perdida'">
            {{ resultado.resultado }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "AnalisisInversiones",
  data() {
    return {
      resultados: [], // Lista de resultados por criptomoneda
      userId: localStorage.getItem("userId"), // ID del usuario
    };
  },
  methods: {
    // Obtener las transacciones del usuario
    async obtenerTransacciones() {
      try {
        const url = `https://laboratorio-ab82.restdb.io/rest/transactions?q={"user_id": "${this.userId}"}`;
        const headers = { "x-apikey": "650b525568885487530c00bb" };
        const { data } = await axios.get(url, { headers });
        return data;
      } catch (error) {
        console.error("Error al obtener transacciones:", error);
        return [];
      }
    },

    // Obtener precios actuales de las criptomonedas
    async obtenerPrecios() {
      try {
        const responses = await Promise.all([
          axios.get("https://criptoya.com/api/satoshitango/btc/ars"),
          axios.get("https://criptoya.com/api/satoshitango/usdc/ars"),
          axios.get("https://criptoya.com/api/satoshitango/eth/ars"),
        ]);

        return {
          bitcoin: responses[0].data.totalBid,
          usdc: responses[1].data.totalBid,
          ethereum: responses[2].data.totalBid,
        };
      } catch (error) {
        console.error("Error al obtener precios:", error);
        return { bitcoin: 0, usdc: 0, ethereum: 0 };
      }
    },


    // Calcular resultados por criptomoneda
    async calcularResultados() {
      const transacciones = await this.obtenerTransacciones();
      const precios = await this.obtenerPrecios();

      const resultados = {};

      // Procesar transacciones
      transacciones.forEach((tx) => {
        const { cripto_code, action, money, crypto_amount } = tx;

        if (!resultados[cripto_code]) {
          resultados[cripto_code] = { balance: 0, totalInvertido: 0 };
        }

        if (action === "purchase") {
          resultados[cripto_code].balance += parseFloat(crypto_amount);
          resultados[cripto_code].totalInvertido += parseFloat(money);
        } else if (action === "sale") {
          resultados[cripto_code].balance -= parseFloat(crypto_amount);
          resultados[cripto_code].totalInvertido -= parseFloat(money);
        }
      });

      // Calcular resultados finales para cada criptomoneda
      this.resultados = Object.entries(resultados).map(([code, { balance, totalInvertido }]) => {
        const precioActual = precios[code.toLowerCase()] || 0;
        const valorActual = balance * precioActual;
        const resultado = valorActual - totalInvertido;

        return {
          codigo: code.toUpperCase(),
          resultado: resultado.toFixed(2), // Formato a 2 decimales
        };
      });
    },
  },
  async created() {
    await this.calcularResultados();
  },
};
</script>

<style scoped>
.container {
  padding: 250px;
}

.ganancia {
  color: green;
}

.perdida {
  color: red;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}
</style>
