<template>
    <div class="edit-transaction">
        <h1>Editar Transacción</h1>
        <form @submit.prevent="enviarEdicion">
            <div class="form-group">
                <label>Criptomoneda</label>
                <select v-model="transaction.cripto_code" @change="obtenerPrecioCripto" class="form-control">
                    <option value="btc">Bitcoin (BTC)</option>
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="usdc">USD Coin (USDC)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cantidad</label>
                <input v-model.number="transaction.crypto_amount" @input="convertirEnARS" type="number"
                    class="form-control" min="0.01" step="0.01" />
            </div>
            <div class="form-group">
                <label>Dinero (ARS)</label>
                <input v-model="transaction.money" type="text" class="form-control" readonly />
            </div>
            <div class="form-group">
                <label>Acción</label>
                <select v-model="transaction.action" class="form-control">
                    <option value="purchase">Compra</option>
                    <option value="sale">Venta</option>
                </select>
            </div>
            <button type="submit" class="btn btn-secondary save">Guardar Cambios</button>
            ||
            <button type="button" class="btn btn-secondary cancel" @click="volver">Cancelar</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://laboratorio-ab82.restdb.io/rest',
    headers: { 'x-apikey': '650b525568885487530c00bb' }
});

export default {
    name: 'EditarMovViews',
    data() {
        return {
            transaction: {
                user_id: '',
                action: 'purchase',
                cripto_code: 'btc',
                crypto_amount: 1,
                money: 0,
                datetime: ''
            },
            cryptoPrice: 0,
            userBalances: {},
            transaccionOriginal: null 
        };
    },
    mounted() {
        this.cargarTransaccion();
    },
    methods: {
        async cargarTransaccion() {
            const { id } = this.$route.params;
            try {
                const respuesta = await apiClient.get(`/transactions/${id}`);
                this.transaction = respuesta.data;

                // Guarda una copia de la transacción original
                this.transaccionOriginal = { ...respuesta.data };

                if (this.transaction.cripto_code) {
                    this.obtenerPrecioCripto();
                }

                await this.obtenerBalancesUsuario(this.transaction.user_id);
            } catch (error) {
                console.error('Error al cargar la transacción:', error);
                alert('Error al cargar la transacción.');
            }
        },
        async obtenerBalancesUsuario(userId) {
            try {
                const respuesta = await apiClient.get(`/transactions?q={"user_id":"${userId}"}`);
                const transacciones = respuesta.data;

                const balances = transacciones.reduce((acc, transaccion) => {
                    if (!acc[transaccion.cripto_code]) {
                        acc[transaccion.cripto_code] = 0;
                    }
                    if (transaccion.action === 'purchase') {
                        acc[transaccion.cripto_code] += transaccion.crypto_amount;
                    } else if (transaccion.action === 'sale') {
                        acc[transaccion.cripto_code] -= transaccion.crypto_amount;
                    }
                    return acc;
                }, {});

                this.userBalances = balances;
            } catch (error) {
                console.error('Error al obtener los balances del usuario:', error);
                alert('Error al obtener los balances del usuario.');
            }
        },
        async obtenerPrecioCripto() {
            try {
                const respuesta = await axios.get(`https://criptoya.com/api/${this.transaction.cripto_code}/ars`);
                const precioData = respuesta.data;

                const exchange = 'buenbit';
                if (precioData[exchange] && precioData[exchange].totalBid) {
                    this.cryptoPrice = precioData[exchange].totalBid;
                    this.convertirEnARS();
                } else {
                    console.error('Precio no encontrado en la respuesta:', precioData);
                    alert('No se pudo obtener el precio de la criptomoneda.');
                }
            } catch (error) {
                console.error('Error al obtener el precio de la criptomoneda:', error);
                alert('Error al obtener el precio de la criptomoneda.');
            }
        },
        convertirEnARS() {
            const montoEnARS = (this.transaction.crypto_amount * this.cryptoPrice).toFixed(2);
            this.transaction.money = parseFloat(montoEnARS);
        },
        volver() {
            this.$router.push({ path: '/movimientos' });
        },
        async enviarEdicion() {
            const { id } = this.$route.params;

            if (!this.transaction.user_id || !this.transaction.cripto_code || !this.transaction.datetime) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }

            if (isNaN(this.transaction.money) || this.transaction.money <= 0) {
                alert('El monto en ARS no es válido.');
                return;
            }

            // Ajustar el balance considerando la transacción original
            if (this.transaccionOriginal) {
                const { cripto_code, action, crypto_amount } = this.transaccionOriginal;
                if (action === 'purchase') {
                    this.userBalances[cripto_code] -= crypto_amount;
                } else if (action === 'sale') {
                    this.userBalances[cripto_code] += crypto_amount;
                }
            }

            // Validar el balance antes de aplicar la nueva transacción
            if (this.transaction.action === 'sale' && this.userBalances[this.transaction.cripto_code] < this.transaction.crypto_amount) {
                alert('No tienes suficiente balance para realizar esta venta.');
                return;
            }

            try {
                await apiClient.patch(`/transactions/${id}`, this.transaction);
                alert('Transacción actualizada exitosamente.');
                this.$router.push({ path: '/movimientos' });
            } catch (error) {
                console.error('Error al actualizar la transacción:', error);
                if (error.response) {
                    alert('Error al actualizar la transacción: ' + JSON.stringify(error.response.data));
                } else {
                    alert('Error al actualizar la transacción.');
                }
            }
        }
    }
};
</script>

<style scoped>
.edit-transaction {
    max-width: 600px;
    margin-top: 200px;
    padding: 10px;
}

.form-group {
    margin-bottom: 15px;
}
.save{
    background-color: rgb(0, 199, 0);
    border: none;
}
.cancel{
    background-color: rgb(255, 32, 32);
    border: none;

}
</style>
