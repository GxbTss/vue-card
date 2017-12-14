<template>
    <div class="slider">
        <div class="banner">
            <ul class='slide-ul'>
                <li v-for="(list,index) in bannerList" :key="index" v-show="index===currentIndex" @mouseenter="stop" @mouseleave="go">
                    <a :href="list.linkUrl" >
                        <img :src="list.pictureUrl" :alt="list.desc">
                    </a>
                </li>
            </ul>
            <div class="carousel-items">
                <span v-for="(item,index) in bannerList.length" :class="{'active':index===currentIndex}" @mouseover="change(index)"></span>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'slider',
    data () {
      return {
        currentIndex: 0,
        timer: ''
      }
    },
    props: {
      bannerList: {
        type: Array
      }
    },
    methods: {
      go () {
        this.timer = setInterval(() => {
          this.autoPlay()
        }, 4000)
      },
      stop () {
        clearInterval(this.timer)
        this.timer = null
      },
      change (index) {
        this.currentIndex = index
      },
      autoPlay () {
        this.currentIndex++
        if (this.currentIndex > this.bannerList.length - 1) {
          this.currentIndex = 0
        }
      }
    },
    created () {
      this.$nextTick(() => {
        this.timer = setInterval(() => {
          this.autoPlay()
        }, 4000)
      })
    }
  }
</script>

<style lang="less" scoped>
    @import './../../common/styles/mixins.less';
    .slider{
        width: 100%;
        min-height: 100%;
        .banner {
            position: fixed;
            left: 0;
            top: 0;
            .px2rem(height, 120);
            width: 100%;
            overflow: hidden;
            background-color: #fff;
            z-index: 100;
        }
        .slide-ul {
            width: 100%;
            height: 100%;
            li {
                position: absolute;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .carousel-items {
            position: absolute;
            bottom: 5px;
            width: 100%;
            margin: 0 auto;
            text-align: center;
            font-size: 0;
            span {
                display: inline-block;
                .px2rem(height, 2);
                .px2rem(width, 32);
                .px3rem(margin, 0, 8);
                background: rgba(255,255,255,0.50);
                cursor: pointer;
            }
            .active {
                background-color: #fff;
            }
        }
    }
</style>