<template>
  <div class='page-library'>
    <div class='header'>
      <div class='label'>我的咖啡库</div>
      <router-link class='link' to='allbank'>查看全部</router-link>
    </div>
    <div class='bank-list'>
      <div
        class='bank-item'
        v-for="(item, i) in bankList"
        @click='() => handleBankItemClick(item)'
        :key='i'>
        <div class='img'>
          <img :src="'http://www.zhongkakeji.com/' + item.item_info.image" alt="">
        </div>
        <div class='title'>{{item.item_info.title}}</div>
        <div class='desc'>单品详情</div>
      </div>
    </div>
    <div class='header'>
      <div class='label'>我的优惠券</div>
      <router-link class='link' to='allcoupon'>查看全部</router-link>
    </div>
    <div class='coupon-list'>
      <div class='coupon-item' v-for='item in couponList' :key='item.id'>
        <div class='icon'>
          <img :src="'/static/img/icon_coupon' + item.coupon_info.type + '@3x.png'" alt="">
        </div>
        <div class='content'>
          <div class='title'>{{couponValue(item.coupon_info)}}</div>
          <div class='descp'>{{item.coupon_info.descp}}</div>
          <div class='footer'>
            <span class='dead-line'>有效期：剩余 {{deadTime(item.dead_line)}}</span>
            <span class='check-more' @click='() => handleCouponItemClick(item)'>查看详情 ></span>
          </div>
        </div>
      </div>
    </div>
    <!--赠送给亲友的弹出框两层-->
    <div v-transfer-dom>
      <x-dialog
        :hide-on-blur='true'
        v-model="showModal1"
        v-if="current1"
        class="info-modal ty-1">
        <div class='bg'>
          <img :src="'http://www.zhongkakeji.com/' + current1.item_info.image" alt="">
        </div>
        <!--点击赠送给亲友后出现提示的遮罩层弹窗-->
        <div class="share-tips" v-show='showTip1'>
          <p>点击右上角，“发送给朋友”， 把温暖送到朋友手边吧！</p>
          <p>关注“众咖”公众号，在咖啡商城中 即可查询您的库存及优惠唷！</p>
        </div>
        <div class="content">
          <div class="title">{{current1.item_info.title}}</div>
          <div class="t1">提货码: <span class="code">{{current1.code}}</span></div>
          <div class="tip">请到附近众咖现磨咖啡机提取饮品哦~</div>
        </div>
        <div class='btn' v-if='current1.is_send'>
          <x-button type="primary" @click.native="share1">赠送亲友</x-button>
        </div>
      </x-dialog>
    </div>
    <!--我的优惠券的详情弹出框，点击跳转到首页挑选-->
    <div v-transfer-dom>
      <x-dialog
        :hide-on-blur='true'
        v-model="showModal2"
        v-if="current2"
        class="info-modal ty-2">
        <!-- <div class="share-tips" v-show='showTip2'>
          <p>点击右上角，“分享到朋友圈” 或“发送给好友”，大家一起领优惠吧！</p>
          <p>关注“众咖”公众号，在咖啡商城中 即可查询您的库存及优惠唷！</p>
        </div> -->
        <div class="inner">
          <div class="title">{{current2.coupon_info.descp}}</div>
          <div class='bg'>
            <img
              class="b1"
              :src="'/static/img/icon_coupon' + current2.coupon_info.type + '@3x.png'"
              alt="">
            <img class="b2" src="/static/img/icon_coupon's_coffee@3x.png" alt="">
          </div>
          <div><span class='dead-line'>有效期：剩余 {{deadTime(current2.dead_line)}}</span></div>
          <div class='btn'>
            <x-button type="primary" @click.native="navToHome">前往挑选</x-button>
            <!-- <x-button type="primary" @click.native="share2">赠送亲友</x-button> -->
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {
  XDialog,
  XButton,
  TransferDomDirective as TransferDom
} from 'vux'
import moment from 'moment'
moment.locale('zh-CN')
const BASE_URL = 'http://www.zhongkakeji.com/'

export default {
  name: 'library',
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    XButton
  },
  data () {
    return {
      bankList: [],
      couponList: [],
      showModal1: false,
      current1: null,
      showModal2: false,
      current2: null,
      showTip1: false,
      showTip2: false
    }
  },
  mounted () {
    this.fetchBankList()
    this.fetchMyCouponList()
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    handleBankItemClick (item) {
      this.current1 = item
      this.showModal1 = true
      this.showTip1 = false
    },
    handleCouponItemClick (item) {
      this.current2 = item
      this.showModal2 = true
      this.showTip2 = false
    },
    navToHome () {
      this.showModal2 = false
      this.$router.replace({ path: '/' })
    },
    share1 () {
      const title = this.currentUser.nickname +
      '给您赠送了一杯' + this.current1.item_info.title
      const url = BASE_URL + '#/?user_id=' + this.currentUser.id + '&code_id=' +
      this.current1.code
      console.log(url)
      this.showTip1 = true
      this.$wechat.onMenuShareAppMessage({
        title,
        desc: '众咖-让现磨咖啡触手可及',
        type: 'link',
        imgUrl: (BASE_URL + 'static/favicon.ico'),
        link: url,
        success: () => {
          this.showTip1 = false
        }
      })
    },

    share2 () {
      const title = '众咖，让咖啡触手可及，醇香现磨咖啡了解一下？'
      console.log(title)
      this.showTip2 = true
      this.$wechat.onMenuShareAppMessage({
        title,
        desc: '',
        type: 'link',
        imgUrl: (BASE_URL + 'static/favicon.ico'),
        link: 'http://www.zhongkakeji.com',
        success: () => {
          this.showTip2 = false
        },
        fail: (res) => {
          console.log(res)
        }
      })
    },
    couponValue (obj) {
      switch (obj.type) {
        case '1':
          return obj.discounts + ' 折'
        case '2':
          return '￥' + obj.limit
        case '3':
          return '￥' + obj.cash
      }
    },
    deadTime (time) {
      return moment(time).fromNow(true)
    },
    fetchBankList () {
      if (!this.currentUser) {
        return
      }
      this.$http.get('/accounts/bank/list/', {
        params: {
          user_id: this.currentUser.id
        }
      }).then(({data}) => {
        if (data.ok) {
          this.bankList = data.data
        }
      })
    },
    fetchMyCouponList () {
      if (!this.currentUser) {
        return
      }
      this.$http.get('/accounts/mycoupon/list/', {
        params: {
          user_id: this.currentUser.id
        }
      }).then(({data}) => {
        if (data.ok) {
          this.couponList = data.data
        }
      })
    }
  }
}
</script>

<style lang='stylus' scope>
.info-modal
  position relative
  .weui-dialog
    font-size 0.16rem
    .bg
      height 2rem
      overflow hidden
      img
        max-width 100%
    .share-tips
      padding 0.1rem
      box-sizing border-box
      color white
      font-size 0.14rem
      background-color rgba(0,0,0,0.65)
      border-radius 0.05rem
      margin-top 0.9rem
      position absolute
      width 100%
      top 0
      left 0
      z-index 200
      p + p
        margin-top 0.2rem
    .content
      text-align center
      .tip
        color #999999
        font-size 0.14rem
        margin-bottom 0.22rem
      .title
        color #434343
        font-size 0.17rem
      .t1
        color #434343
        font-size 0.14rem
        text-align left
        margin-top 0.2rem
        padding-left 0.35rem
        .code
          margin-left 0.2rem
          color #F5B44C
          font-size 0.2rem
  &.ty-1
    .weui-dialog
      background-color white
    .weui-btn_primary
      background-color #F5B44C
      font-size 0.16rem
      padding 2px 0
      &:active
        background-color #F5B44C
  &.ty-2
    .share-tips
      margin-top 1.2rem
    .inner
      border 2px dotted #F5B44C
      border-radius 5px
      .title
        font-size 0.16rem
        color #434343
        padding-top 0.2rem
      .dead-line
        color #999999
        font-size 0.12rem
    .weui-dialog
      background-color white
      padding 0.1rem
      .bg
        margin-top 0.1rem
        height auto
        position relative
        .b1
          width 0.8rem
          position absolute
          bottom 5px
          z-index 50
        .b2
          margin-left 0.5rem
          width 1.2rem
    .weui-btn_primary
      background-color #F5B44C
      font-size 0.16rem
      padding 2px 0
      &:active
        background-color #F5B44C
  .btn
    margin 0.2rem auto
    width 2rem
.page-library
  .header
    display flex
    justify-content space-between
    padding 0.1rem 0.15rem
    background-color #F9F9F8
    align-items center
    .label
      color #434343
      font-size 0.14rem
    .link
      color #C6C6C6
      font-size 0.12rem
  .bank-list
    display flex
    flex-wrap wrap
    padding 0.15rem 0.2rem 0 0.2rem
    justify-content space-between
    height 1.8rem
    overflow hidden
    .bank-item
      flex 0 1 45%
      text-align center
      border 1px solid #F0F0F0
      margin-bottom 0.24rem
      .img
        margin 0 auto
        width 70%
        height 1rem
        overflow hidden
        img
          display block
          width 100%
      .title
        margin-top 0.05rem
        color #343434
        font-size 0.14rem
      .desc
        font-size 0.11rem
        color #999999
        margin-top 0.05rem
  .coupon-list
    padding 15px
    height calc(100vh - 3.66rem)
    overflow auto
    .coupon-item + .coupon-item
      padding-top 0.15rem
    .coupon-item
      border-bottom 1px solid #F0F0F0
      padding-bottom 0.15rem
      display flex
      .icon
        font-size 0.16rem
        flex 0 1 1rem
        img
          width 0.8rem
      .content
        flex 1
        position relative
        font-size 0.16rem
        .descp
          font-size 0.12rem
          color #999
        .title
          font-size 0.16rem
          color #434343
        .footer
          position absolute
          bottom 0.1rem
          left 0
          width 100%
          display flex
          justify-content space-between
          .dead-line
            color #999999
            font-size 0.12rem
          .check-more
            color #F5B44C
            font-size 0.13rem
</style>
