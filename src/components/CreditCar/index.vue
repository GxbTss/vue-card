<template>
    <div class="card">
        <slider :bannerList="bannerList"></slider>
        <div class="links">
            <ul class="links-items">
                <li class="links-item" v-for="(item, index) in links" @click="getMore(item, index)" ref="linkItem">
                    <span class="links-item-name">{{item.name.value}}</span>
                    <span class="imgPic" :class="item.down ? 'dropdown' : 'dropup'"></span>
                </li>
            </ul>
        </div>
        <div class="item-detail" ref="itemDetail">
                <div class="item-detail-lists">
                    <ul class="detail-items">
                        <li ref="seleteItem"
                            v-for="(item, index) in seletedMore"
                            class="detail-item"
                            @click="seletedItem(item, index)">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
            <div class="item-detail-model" @click="handleDisplay"></div>
        </div>
        <div class="cards" v-if="carList.length > 0">
            <ul class="cards-items">
                <li class="cards-item" v-for="(item, index) in carList">
                    <div class="cards-item-left">
                        <img :src="item.coverUrl" alt="加载中..."/>
                    </div>
                    <div class="cards-item-right">
                        <p class="card-names">
                            <span class="card-name">{{item.cardName}}</span>
                            <a href="javascript:;"
                               class="card-application"
                               @click="sendGo(item.cardName, item.id, item.linkUrl)"
                               :style="{backgroundColor: color.bgColor, color: color.btnColor}"
                            >立即申请</a>
                        </p>
                        <ul class="card-links">
                            <li v-for="bewriteItem in item.bewrite">{{bewriteItem}}</li>
                        </ul>
                        <p class="card-btn">
                            <a href="javascript:;"
                               v-for="(labelItem, index) in item.label"
                               :style="{borderColor: color.labelBorderColor, color: color.labelColor}"
                            >{{labelItem}}</a>
                        </p>
                    </div>
                </li>
            </ul>
            <div class="add-more" v-if="totalPage > currentIndex">
                <loading v-if="loading" style="margin-top: 0"></loading>
                <p @click="addMore" v-else>
                    加载更多
                </p>
            </div>
        </div>
        <div v-else class="cards noData">
            暂无您需要的卡型，请选择其他类型。
        </div>
        <loading v-if="loading"></loading>
    </div>
</template>

<script>
  import Slider from '@/base/Slider'
  import Loading from '@/base/Loading'
  import { getBannerList, getAllBank, getAllUsed, getDetailList, getDataSta } from '@/api'

  export default {
    name: 'card',
    components: {
      Slider,
      Loading
    },
    data () {
      return {
        links: [
          {
            down: true,
            name: {id: 0, value: '全部银行'},
            lists: [{id: 0, name: '全部银行'}],
            seletedIndex: 0
          },
          {
            down: true,
            name: {id: 0, value: '全部用途'},
            lists: [{id: 0, name: '全部用途'}],
            seletedIndex: 0
          },
          {
            down: true,
            name: {id: 0, value: '全部等级'},
            lists: [
              {id: 0, name: '全部等级'},
              {id: 1, name: '普通卡'},
              {id: 2, name: '金卡'},
              {id: 3, name: '白金卡'}
            ],
            seletedIndex: 0
          }
        ],
        currentIndex: 0,
        loading: false,
        seletedMore: [],
        carList: [],
        bannerList: [],
        params: {
          bankId: 0,
          useId: 0,
          grade: -1,
          page: 1,
          size: 10,
          sortingParam: []
        },
        currentIndex: 1,
        totalPage: 1,
        showAdd: true,
        color: {
          bgColor: '#FF5722',
          btnColor: '#ffffff',
          labelColor: '#5C6BC0',
          labelBorderColor: '#5C6BC0'
        }
      }
    },
    watch: {
    },
    methods: {
      // 阴影区点击，进行取消状态
      handleDisplay () {
        for (var i = 0; i < this.links.length; i++) {
          this.links[i].down = true
        }
        this.$refs.itemDetail.style.display = 'none'
      },
      // 选择条件
      getMore (item, index) {
        let downDoen = item.down
        this.currentIndex = index
        // 判断 seletedMore 是否有值
        if (this.seletedMore.length > 0) {
          for (var j = 0; j < this.$refs.seleteItem.length; j++) {
            this.$refs.seleteItem[j].style.color = 'rgba(0,0,0,0.54)'
          }
          this.$refs.seleteItem[this.links[index].seletedIndex].style.color = this.color.bgColor
        }
        for (var i = 0; i < this.links.length; i++) {
          this.links[i].down = true
        }
        this.links[index].down = !downDoen
        if (downDoen) {
          this.seletedMore = this.links[index].lists
          this.$refs.itemDetail.style.display = 'block'
        } else {
          this.$refs.itemDetail.style.display = 'none'
        }
      },
      // 确定选择条件
      seletedItem (item, index) {
        this.links[this.currentIndex].name.id = item.id
        this.links[this.currentIndex].name.value = item.name
        this.links[this.currentIndex].down = !this.links[this.currentIndex].down
        this.links[this.currentIndex].seletedIndex = index
        this.$refs.linkItem[this.currentIndex].style.color = this.color.bgColor
        this.$refs.seleteItem[index].style.color = this.color.bgColor
        this.$refs.itemDetail.style.display = 'none'
        this.params.bankId = this.links[0].name.id
        this.params.useId = this.links[1].name.id
        this.params.grade = this.links[2].name.id - 1
        this.currentIndex = 1
        this.params.page = this.currentIndex
        this.carList = []
        this.searchData(this.params)
      },
      // 获取url的背景颜色参数
      getval (name) {
        var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i')
        if (reg.test(location.href)) {
          return unescape(RegExp.$2.replace(/\+/g, ' '))
        }
        return ''
      },
      // 获取数据
      addMore () {
        this.loading = true
        this.currentIndex += 1
        if (this.currentIndex > this.totalPage) {
          alert('已是最后一页数据！')
          this.loading = false
          return
        }
        this.params.page = this.currentIndex
        this.searchData(this.params)
      },
      // 立即申请跳转
      sendGo (name, id, linkUrl) {
        getDataSta(id).then(res => {
          console.log(res)
        })
        ga('send', {
          hitType: 'event',
          eventCategory: 'creditCar',
          eventAction: 'click',
          eventLabel: name
        })
        window.location.href = linkUrl
      },
      // 初始化数据
      initData () {
        this.loading = true
//        获取banner列表
        getBannerList().then(res => {
          this.bannerList = res.data
        })
//        获取所有银行
        getAllBank().then(res => {
          let bankData = res.data
          for (let i = 0; i < bankData.length; i++) {
            this.links[0].lists.push({id: bankData[i].id, name: bankData[i].bankName})
          }
        })
//        获取所有用途
        getAllUsed().then(res => {
          let usedData = res.data
          for (let i = 0; i < usedData.length; i++) {
            this.links[1].lists.push({id: usedData[i].id, name: usedData[i].useContent})
          }
        })
        this.searchData(this.params)
      },
      // 获取信用卡搜索数据
      searchData (param) {
        getDetailList(param).then(res => {
          this.loading = false
          this.carList = [...this.carList, ...res.data.records]
          this.totalPage = res.data.totalPage
          _.forEach(this.carList, (item, index) => {
            if (typeof item.bewrite === 'string') item.bewrite = JSON.parse(item.bewrite)
            if (typeof item.label === 'string')item.label = JSON.parse(item.label)
          })
        })
      }
    },
    created () {
      this.color.bgColor = this.getval('bgColor') ? `#${this.getval('bgColor')}` : this.color.bgColor
      this.color.btnColor = this.getval('btnColor') ? `#${this.getval('btnColor')}` : this.color.btnColor
      this.color.labelColor = this.getval('labelColor') ? `#${this.getval('labelColor')}` : this.color.labelColor
      this.color.labelBorderColor = this.getval('labelBorderColor') ? `#${this.getval('labelBorderColor')}` : this.color.labelBorderColor

//      console.log(this.color)
      this.$nextTick(() => {
        this.initData()
      })
    }
  }
</script>

<style lang="less" scoped>
    @import './../../common/styles/mixins.less';
    .card{
        width: 100%;
        min-height: 100%;
        .fade-enter-active, .fade-leave-active {
            transition: all 1s ease;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0
        }
        .banner {
            position: fixed;
            left: 0;
            top: 0;
            .px2rem(height, 120);
            width: 100%;
            overflow: hidden;
            background-color: #fff;
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
            top: 100px;
            width: 100%;
            margin: 0 auto;
            text-align: center;
            font-size: 0;
            span {
                display: inline-block;
                height: 6px;
                width: 30px;
                margin: 0 3px;
                background-color: #b2b2b2;
                cursor: pointer;
            }
            .active {
                background-color: #fff;
            }
        }
        .links{
            position: fixed;
            left: 0;
            .px2rem(top, 120);
            width: 100%;
            .px2rem(height, 48);
            background: #FFFFFF;
            border-bottom: 2px solid rgba(0,0,0,0.08);
            z-index: 1001;
            &-items{
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
            }
            &-item{
                width: 33.33%;
                font-size: 15px;
                color: rgba(0,0,0,0.87);
                .px2rem(height, 24);
                .px2rem(line-height, 24);
                text-align: center;
                border-right: 1px solid rgba(0,0,0,0.12);
                white-space: nowrap;
                &:last-child{
                    border: 0;
                }
                span{
                    display: inline-block;
                    .px2rem(height, 24);
                    vertical-align: middle;
                }
                &-name{
                    .px2rem(margin-left, 24);
                }
                .imgPic{
                    .px2rem(width, 24);
                    .px2rem(height, 24);
                }
                .dropdown{
                    background: url("./../../../static/images/arrow_dropdown@3x.png") center no-repeat;
                    background-size: cover;
                }
                .dropup{
                    background: url("./../../../static/images/arrow_dropup@3x.png") center no-repeat;
                    background-size: cover;
                }
            }
        }
        .item-detail{
            display: none;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            box-sizing: border-box;
            .px2rem(padding-top, 168);
            overflow: hidden;
            z-index: 1000;
            .fade-seleteitem-enter-active, .fade-seleteitem-leave-active{
                transition: opacity .3s ease;
            }
            .fade-seleteitem-enter, .fade-seleteitem-leave-to{
                opacity: 0
            }
            &-lists{
                background-color: #fff;
                width: 100%;
                .px2rem(height, 304);
                overflow-y: scroll;
                .detail-items{
                    .px2rem(margin-left, 24);
                }
                .detail-item{
                    .px2rem(height, 48);
                    .px2rem(line-height, 48);
                    font-size: 15px;
                    color: rgba(0,0,0,0.54);
                    border-bottom: 1px solid rgba(0,0,0,0.12);
                }
            }
            &-model{
                // position: fixed;
                // left: 0;
                // bottom: 0;
                width: 100%;
                .px2rem(height, 168);
                background: rgba(0,0,0,0.38);
            }
        }
        .cards{
            .px2rem(margin-top, 168);
            width: 100%;
            z-index: 10;
            .add-more{
                width: 100%;
                p{
                    .px2rem(height, 50);
                    .px2rem(line-height, 50);
                    text-align: center;
                    border-top: 1px solid rgba(0,0,0,0.12);
                    cursor: pointer;
                }
            }
            &-items{
            }
            &-item{
                display: flex;
                align-items: center;
                justify-content: center;
                .px2rem(height, 115);
                margin: 0 16px;
                border-bottom: 1px solid rgba(0,0,0,0.08);
                &:last-child{
                    border: 0;
                }
                &-left{
                    .px2rem(width, 109);
                    .px2rem(height, 69);
                    background: #D8D8D8;
                    border-radius: 4px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                &-right{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    overflow: hidden;
                    .px2rem(margin-left, 13);
                }
                .card-names{
                    .px2rem(margin-top, -5);
                    display: flex;
                    justify-content: space-between;
                    .card-name{
                        font-size: 15px;
                        color: rgba(0,0,0,0.87);
                        .px2rem(line-height, 23);
                    }
                    .card-application{
                        display: inline-block;
                        .px2rem(width, 64);
                        .px2rem(height, 24);
                        .px2rem(line-height, 28);
                        text-align: center;
                        border-radius: 2px;
                        font-size: 13px;
                    }
                }
                .card-links{
                    font-size: 13px;
                    color: rgba(0,0,0,0.54);
                    .px2rem(line-height, 20);
                }
                .card-btn{
                    .px2rem(margin-top, 3);
                    white-space: nowrap;
                    z-index: 10;
                    font-size: 0;
                    a{
                        display: inline-block;
                        .px2rem(max-width, 90);
                        .px2rem(height, 14);
                        .px2rem(line-height, 14);
                        padding: 1px 3px;
                        border-width: 1px;
                        border-style: solid;
                        border-radius: 2px;
                        .px2rem(font-size, 10);
                        transform: scale(0.9);
                        text-align: center;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
        .noData{
            .px2rem(margin-top, 200);
            text-align: center;
        }
    }
</style>