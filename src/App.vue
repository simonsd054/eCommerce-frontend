<template>
    <component :is="layout">
      <router-view/>
    </component>
</template>

<script>
 const defaultLayout = 'default'
 export default {
   name: 'App',
   computed: {
     layout () {
       return (this.$route.meta.layout || defaultLayout) + '-layout'
     }
   }
 }
</script>

<style scoped>
  a:link, a:visited, a:hover, a:active {
    text-decoration: none;
    color: inherit;
  }
</style>
