<template>
  <nav>
    <Navbar />
  </nav>
  <router-view/>
</template>

<script>

import Navbar from './components/NavBarComponent.vue';



export default {
    name: 'App',
  components: {
    Navbar,
  
    
  },

}

</script>

<style>

  #app {
  margin: 0;
  padding: 0;

}


</style>
