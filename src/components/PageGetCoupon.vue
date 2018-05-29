<template>
  <div class='page-get-coupon' v-show='load' :class="{list: !canGet}">
    <div class="list" v-if='!canGet'>
      <div class="header">
        <div class="tip" v-if='over'>
          {{shareUser.nickname}}的最后一个福袋被{{lastUser.nickname}}抢掉了！
        </div>
        <div class="tip" v-else>
          恭喜超幸运的你领到了{{shareUser.nickname}}的福袋！
        </div>
      </div>
      <div class="coupon-info flex" v-if='couponInfo'>
        <div class="icon">
          <img :src="'/static/img/icon_coupon' + couponInfo.type + '@3x.png'" alt="">
        </div>
        <div class='c-content'>
          <div class="c-title">{{couponValue(couponInfo)}}</div>
          <div class="c-desc">已存入你的咖啡库，可在有效期内随时享用，下单即省噢~</div>
        </div>
      </div>
      <div class="coupon-info flex" v-if='over'>
        <div class="info">
          <p>不好意思亲来晚了，</p>
          <p>{{shareUser.nickname}}的福袋已被抢完QAQ</p>
        </div>
      </div>
      <div class="other-list">
        <div class="label" @click="CheckAllUserList">看看大家的手气如何</div>
        <div class="item" v-for="item in list" :key="item.user_info.id" v-show="CheckAllUserListDiv">
          <div class="item-user">
            <img :src="item.user_info.headimgurl" alt="">
            <div class='item-user-right'>
              <div class="item-user-nick">{{item.user_info.nickname}}</div>
              <div class="item-ts">{{item.ts}}</div>
            </div>
          </div>
          <div class="item-descp">{{couponDescp(item.coupon_info)}}</div>
        </div>
        <div class="holder"></div>
      </div>
      <div class="bot-nav">
        <router-link class="btn" :class="{primary: over}" to='/lib'>查看我的咖啡库</router-link>
        <router-link v-if='!over' class="btn primary" to="/">立即使用</router-link>
      </div>
    </div>
    <div class='qiang' v-if='canGet'>
      <img class="bg" src="/static/img/png_redpacket@3x.png" alt="">
      <div class="body" v-if='shareUser'>
        <div class="share-user">
          <img :src="shareUser.headimgurl" alt="">
          <div class="nick">{{shareUser.nickname}}</div>
        </div>
        <div class="content">
          众咖发福利啦，快来抢啊
        </div>
        <div class="btn" @click='() => qiangCoupon(shareUser.id)'>抢</div>
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="showLoading" :text="loadText"></loading>
    </div>
  </div>
</template>

<script>
import {
  XDialog,
  XButton,
  Loading,
  TransferDomDirective as TransferDom
} from 'vux'
import moment from 'moment'
// const BASE_URL = 'http://www.zhongkakeji.com/'

export default {
  name: 'getCoupon',
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    XButton,
    Loading
  },
  data () {
    return {
      list: [],
      shareUser: true,//默认null
      couponInfo: null,
      load: true, //默认false
      over: false,
      showLoading: false,
      loadText: '加载中...',
      CheckAllUserListDiv: false
    }
  },
  mounted () {
    document.title = '抢福袋'
    const userId = this.$route.query.share_user_id//分享者user_id
    const shareUid = this.$route.query.user_id//抢券者user_id
    this.timestamp = this.$route.query.timestamp

    console.log('get coupon page', userId, this.timestamp)
    if (userId) {
      this.getShareUser(userId)
      this.qiangCoupon(shareUid)
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    },
    canGet () {
      return !this.couponInfo
    },
    lastUser () {
      return this.list[this.list.length - 1].user_info
    }
  },
  methods: {
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
    couponDescp (obj) {
      switch (obj.type) {
        case '1':
          return obj.discounts + ' 折折扣券'
        case '2':
          return '满 ' + obj.threshold + ' 减 ' + obj.limit
        case '3':
          return obj.cash + ' 元现金券'
      }
    },
    getShareUser (shareUid) {
      const url = '/accounts/userinfo/query/?user_id=' + shareUid
      this.$http.get(url).then(({data}) => {
        if (data.ok) {
          this.shareUser = data.data
          this.checkList(shareUid)
        }
      })
    },
    checkList (shareUid) {
      const url = '/coupon/couponbank/list/?share_user_id=' + shareUid + '&timestamp=' +
      this.timestamp
      this.$http.get(url).then(({data}) => {
        if (data.ok) {
          data.data.forEach(element => {
            element.ts = moment(element.coupon_info.update_time).format('lll')
          })
          this.list = data.data
          const result = this.list.find(item => {
            return item.user_info.id === this.currentUser.id
          })
          if (result) {
            this.couponInfo = result.coupon_info
          }
          this.load = true
        }
      })
    },
    qiangCoupon (shareUid) {
      /*const url = '/coupon/couponbank/create/?share_user_id=' + shareUid +
        '&user_id=' + this.currentUser.id + '&timestamp=' +
        this.timestamp*/
      const url = '/coupon/couponbank/create/?share_user_id=29' +
        '&user_id=28' + '&timestamp=1221135'
      // const url = http://www.zhongkakeji.com/api/coupon/couponbank/create/?share_user_id=9&user_id=27&timestamp=1221134
      this.$http.get(url).then(({data}) => {
        /* data.ok 为true标识红包为未被拆开状态 */
        console.log(data)
        console.log("--------------------")
        if (data.ok) {
          //  将红包信息赋值进vue的data里
          //  将判断展示红包是否被拆开的ui的变量置为true
          /*   view层应当有两段代码，一段是红包未拆开的样子，一段是拆开的样子 通过一个变量的true false 控制   */
          this.couponInfo = data.data.coupon_info
          console.log('coupon_info')
          this.list.push(data.data)
        } else {
          //  将判断展示红包是否被拆开的ui的变量置为false
          this.over = true
          // this.shareUser = false
          // this.load = false
        }
      })
    },
    CheckAllUserList () {
      this.CheckAllUserListDiv = true
    }
  }
}
</script>

<style lang='stylus' scope>
.page-get-coupon
  background rgba(0,0,0,0.7);
  height 100%
  font-size 0.16rem
  &.list
    background white
    padding 0 !important
  p
    display block
    text-align center
  .list
    position relative
    padding 0 !important
    .bot-nav
      border-top 1px solid #F0F0F0
      display flex
      position fixed
      bottom 0
      width 100%
      left 0
      .btn
        flex 1
        background-color white
        color #F5B44C
        text-align center
        line-height 0.6rem
        &.primary
          background-color #F5B44C
          color white
    .other-list
      padding 0.9rem 0.2rem 0 0.2rem
      // height calc(100vh - 3rem)
      // overflow auto
      .label
        font-size 0.15rem
        color #434343
        font-weight bold
        margin-bottom 0.1rem
      .item
        display flex
        border-top 1px solid #F0F0F0
        padding 0.1rem 0
        justify-content space-between
        .item-descp
          font-size 0.15rem
      .item-user
        position relative
        padding-left 0.5rem
        .item-ts
          font-size 0.11rem
          color #999999
        img
          left 0
          position absolute
          width 0.4rem
          height auto
          border-radius 50%
    .header
      height 2rem
      background-color #FFE2B3
      color #F5B44C
      text-align center
      position relative
      z-index 1
      .tip
        padding-top 1rem
    .coupon-info
      top 1.5rem
      height 1.2rem
      background-color white
      width 90vw
      left 5vw
      position absolute
      z-index 10
      border-radius 10px
      box-shadow 2px 0px 32px rgba(0,0,0,0.12)
      &.flex
        display flex
        align-items center
      .info
        flex 100%
        color #999999
        font-size 0.15rem
      .icon
        flex 0 1 1rem
        text-align center
        img
          width 0.7rem
      .c-content
        flex 1
        padding-right 0.1rem
        .c-title
          color #010101
          font-size 0.19rem
          font-weight bold
        .c-desc
          margin-top 0.1rem
          color #757575
          font-size 0.12rem
.qiang
  width 3.15rem
  margin 0 auto
  position relative
  top 0.5rem
  .body
    position relative
    z-index 1
    .btn
      width 0.9rem
      height 0.9rem
      margin 0 auto
      text-align center
      font-size 0.4rem
      color #484342
      background-color #F5B44C
      border-radius 50%
      line-height 0.9rem
      margin-top 0.4rem
    .share-user
      text-align center
      line-height 1
      padding-top 0.4rem
      .nick
        font-size 0.14rem
        color white
      img
        border-radius 50%
        width 0.6rem
        height 0.6rem
        background-color #EFA775
        border 2px solid white
  .content
    margin-top 0.4rem
    color white
    font-size 0.2rem
    text-align center
  .bg
    position absolute
    z-index 0
    width 100%
    left 0
    top 0
</style>
