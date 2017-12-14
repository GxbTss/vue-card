<template>
    <div class='loading'>
        <img src="./../../../static/images/loading.gif" alt=""/>
        <span>加载中...</span>
    </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {}
    },
    computed: {},
    methods: {},
    created () {
    }
  }
</script>

<style lang="less" scoped>
    @import "./../../common/styles/mixins.less";
    .loading{
        margin-top: 50%;
        text-align: center;
        z-index: 10000;
        img{
            display: inline-block;
            .px2rem(width, 24);
            .px2rem(height, 24);
        }
        span{
            .px2rem(margin-top, 20);
            display: block;
        }
    }
</style>
