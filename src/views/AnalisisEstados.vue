<template>
  <div class="analisis-estado">
    <h1>Análisis del Estado Actual</h1>
    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Dinero (ARS)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crypto in cryptoBalances" :key="crypto.code">
          <td>{{ crypto.code }}</td>
          <td>{{ crypto.amount.toFixed(5) }}</td>
          <td>${{ crypto.money.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    <h2>Total en ARS: ${{ totalMoney.toLocaleString() }}</h2>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AnalisisEstado",
  data() {
    return {
      cryptoBalances: [],
      totalMoney: 0,
      userId: localStorage.getItem("userId"), 
    };
  },
  methods: {
    async obtenerTransaccion() {
      try {
        const url = `https://laboratorio-ab82.restdb.io/rest/transactions?q={"user_id": "${this.userId}"}`;
        const headers = { "x-apikey": "650b525568885487530c00bb" };
        const { data } = await axios.get(url, { headers });
        return data;
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        return [];
      }
    },
    async obtenerPrecioCripto() {
      try {
        const responses = await Promise.all([
          axios.get("https://criptoya.com/api/satoshitango/btc/ars"),
          axios.get("https://criptoya.com/api/satoshitango/usdc/ars"),
          axios.get("https://criptoya.com/api/satoshitango/eth/ars"),
        ]);
        return {
          btc: responses[0].data.totalBid, // Precio en ARS para BTC
          usdc: responses[1].data.totalBid, // Precio en ARS para USDC
          eth: responses[2].data.totalBid, // Precio en ARS para ETH
        };
      } catch (error) {
        console.error("Error al obtener los precios de las criptomonedas:", error);
        return { btc: 0, usdc: 0, eth: 0 };
      }
    },
    async calcularBalances() {
      const transactions = await this.obtenerTransaccion();
      const prices = await this.obtenerPrecioCripto();

      const balances = {};

      transactions.forEach((tx) => {
        if (!balances[tx.cripto_code]) {
          balances[tx.cripto_code] = 0;
        }
        const amount = parseFloat(tx.crypto_amount); 

        if (tx.action === "purchase") {
          balances[tx.cripto_code] += amount; 
        } else if (tx.action === "sale") {
          balances[tx.cripto_code] -= amount; 
        }
      });

      this.cryptoBalances = Object.entries(balances)
        .filter(([_, amount]) => amount > 0)
        .map(([code, amount]) => ({
          code,
          amount,
          money: amount * (prices[code.toLowerCase()] || 0), 
        }));

      this.totalMoney = this.cryptoBalances.reduce(
        (total, crypto) => total + crypto.money,
        0
      );
    },
  },
  async created() {
    await this.calcularBalances();
  },
};
</script>

<style>
.analisis-estado {
  padding: 250px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

h2 {
  margin-top: 20px;
}
</style>
