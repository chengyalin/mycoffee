<template>
  <div class='page-all-coupon'>
    <div class='header'>
      <div class='label'>我的优惠券</div>
    </div>
    <!--我的优惠券列表-->
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
    <!--点查看详情出现优惠券的有效期弹出框-->
    <div v-transfer-dom>
      <x-dialog
        :hide-on-blur='true'
        v-model="showModal2"
        v-if="current2"
        class="info-modal ty-2">
        <!-- <div class="share-tips" v-show='showTip'>
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
      couponList: [],
      showModal2: false,
      current2: null,
      showTip: false
    }
  },
  mounted () {
    this.fetchMyCouponList()
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    handleCouponItemClick (item) {
      this.current2 = item
      this.showModal2 = true
      this.showTip = false
    },
    navToHome () {
      this.showModal2 = false
      this.$router.replace({ path: '/' })
    },
    share2 () {
      this.showTip = true
      const title = '众咖，让咖啡触手可及，醇香现磨咖啡了解一下？'
      this.$wechat.onMenuShareAppMessage({
        title,
        desc: '',
        type: 'link',
        imgUrl: (BASE_URL + 'static/favicon.ico'),
        link: BASE_URL,
        success: () => {
          this.showTip = false
        }
      })
    },
    couponValue (obj) {
      switch (obj.type) {
        case '1':
          return obj.discounts + ' 折'
        case '2':
          return obj.limit + ' 元'
        case '3':
          return obj.cash + ' 元'
      }
    },
    deadTime (time) {
      return moment(time).fromNow(true)
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
      .t1
        color #434343
        font-size 0.14rem
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
.page-all-coupon
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
  .coupon-list
    padding 15px
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
