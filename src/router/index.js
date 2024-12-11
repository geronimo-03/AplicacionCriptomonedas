import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import PantallaPrincipal from '@/components/PantallaPrincipal.vue'; // Pantalla principal con navbar
import CompraVenta from '@/views/CompraVenta.vue';
import movimientosCripto from '@/views/movimientosCripto.vue';
import EditarMovimientos from '@/views/EditarMovimientos.vue';
import AnalisisEstados from '@/views/AnalisisEstados.vue';
import AnalisisInversion from '@/views/AnalisisInversion.vue';
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path:'/app',
    name:'PantallaPrincipal',
    component: PantallaPrincipal
  },
  {
    path: '/compraventa',
    name: 'CompraVenta',
    component: CompraVenta, // Cargar directamente la vista de CompraVenta
    meta: { navbar: true }, // Meta para saber si mostrar la navbar
  },
  {
    path: '/movimientos',
    name: 'MovimientosCripto',
    component: movimientosCripto, // Cargar directamente la vista de Movimientos Cripto
    meta: { navbar: true }, // Meta para saber si mostrar la navbar
  },
  {
    path: '/EditarMovViews/:id',
    name: 'EditarMovimientos', // Cambié el nombre a EditTransaction
    component: EditarMovimientos// Añadir esta meta si se necesita autenticación
  },
  {
    path:'/analisis',
    name:'analisis',
    component: AnalisisEstados
  },
  {
    path:'/inversion',
    name:'inversion',
    component: AnalisisInversion
  }
];


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
