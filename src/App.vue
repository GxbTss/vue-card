<template>
  <div id="app">
      <transition name="fade-in">
          <router-view></router-view>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
    @import "./common/styles/index.less";
    #app{
        width: 100%;
        min-height: 100%;
        .fade-in-enter-active, .fade-in-leave-active {
            transition: opacity .5s
        }
        .fade-in-enter, .fade-in-leave-to {
            opacity: 0
        }
    }
</style>
