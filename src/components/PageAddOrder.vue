<template>
  <div class='page-add-order'>
    <div class='header'>已选择商品</div>
    <div class='list'>
      <div
        v-for='item in productSelectedList'
        :key='item.product_id'
        class='item'>
        <div class='left'>
          <img v-if='item.market_small_image' :src="item.market_small_image" alt="">
          <span class='title'>{{item.title}}</span>
          <span class='select-count'>x {{item.selectCount}}</span>
        </div>
        <span class='price'>{{item.vip_price || item.price}}</span>
      </div>
      <div v-if="couponList.length" class='ticket' @click='handleSelectCoupon'>
        <div class="left">
          <div class='t1'>选择优惠券</div>
          <div class="t2">-默认选择最优惠方案</div>
        </div>
        <div class="right">
          <span class='discount'>-{{couponOff}}元</span>
          <i>></i>
        </div>
      </div>
    </div>
    <CheckListBar
      btnText='支付'
      :couponOff='couponOff'
      :handleCheckout='handleCheckout'
      :alwaysShow='true' />
    <div v-transfer-dom>
      <popup v-model="showOptions" height="100%" class="coupon-pop">
        <div class='header'>
          <div class='label'>我的优惠券</div>
          <span class="note"><i class="icon-notification" />优惠券不可叠加使用</span>
        </div>
        <div class='coupon-list'>
          <div class='coupon-item' v-for='item in couponList' :key='item.id' @click='() => selectCoupon(item)'>
            <div class='icon'>
              <img :src="'/static/img/icon_coupon' + item.coupon_info.type + '@3x.png'" alt="">
            </div>
            <div class='content'>
              <div class='title'>{{couponValue(item.coupon_info)}}</div>
              <div class='descp'>{{item.coupon_info.descp}}</div>
              <div class='footer'>
                <span class='dead-line'>有效期：剩余 {{deadTime(item.dead_line)}}</span>
              </div>
            </div>
          </div>
          <div class="not-use" @click='showOptions = false'>不使用优惠券</div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Popup, TransferDomDirective as TransferDom } from 'vux'
import CheckListBar from './CheckListBar'
import moment from 'moment'

export default {
  name: 'library',
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    Popup,
    CheckListBar
  },
  data () {
    return {
      couponId: null,
      couponOff: 0,
      showOptions: false,
      couponList: []
    }
  },
  mounted () {
    this.fetchMyCouponList()
  },
  computed: {
    productSelectedList () {
      return this.$store.getters.productSelectedList
    },
    prodListShow () {
      switch (this.activedNav) {
        case 0:
          return this.$store.getters.productListHot
        case 1:
          return this.$store.getters.productListSingle
        case 2:
          return this.$store.getters.productListSuit
      }
    },
    totalSelectCount () {
      return this.$store.getters.totalSelectCount
    },
    totalPrice () {
      return this.$store.getters.totalPrice
    },
    detailCheckListShow () {
      return this.totalSelectCount > 0 && this.showDetailSelected
    },
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    selectCoupon (item) {
      this.couponOff = Math.round(this.calcCouponOff(item.coupon_info) * 10) / 10
      this.couponId = item.id
      this.showOptions = false
    },
    handleSelectCoupon () {
      this.showOptions = true
    },
    calcCouponOff (obj) {
      const price = this.totalPrice
      switch (obj.type) {
        case '1':
          return price * ((10 - parseFloat(obj.discounts)) / 10)
        case '2':
          if (price >= parseFloat(obj.threshold)) {
            return parseFloat(obj.limit)
          }
          return 0
        case '3':
          return parseFloat(obj.cash)
      }
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
          const orderCoupon = this.couponList.sort((a, b) => {
            return this.calcCouponOff(a.coupon_info) < this.calcCouponOff(b.coupon_info)
          })
          this.couponId = orderCoupon[0].id
          this.couponOff = Math.round(this.calcCouponOff(orderCoupon[0].coupon_info) * 10) / 10
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
    handleCheckout () {
      if (!this.currentUser) {
        return
      }
      if (!this.productSelectedList.length) {
        return
      }
      const prodIds = this.productSelectedList.map(item => item.product_id).join(',')
      const params = {
        product_ids: prodIds,
        user_id: this.currentUser.id
      }
      if (this.couponId) {
        params.coupon_bank_id = this.couponId
      }
      params.total_fee = (this.totalPrice - this.couponOff).toFixed(2)
      this.$http.get('/payment/market/order/create/', { params }).then(({data}) => {
        if (data.ok) {
          const { timestamp, nonceStr, signType, paySign } = data.data
          this.$wechat.chooseWXPay({
            timestamp,
            nonceStr,
            package: data.data.package,
            signType,
            paySign,
            success: (res) => {
              this.$store.commit('CLEAR_PRODUCT_LIST')//清空购物车
              this.$router.replace({ path: 'ordercomplete' })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang='stylus' scope>
.coupon-pop
  z-index 599 !important
  font-size 0.16rem
  top 0
  .not-use
    text-align center
    background-color white
    padding 0.1rem
  .header
    display flex
    justify-content space-between
    padding 0.1rem 0.15rem
    background-color #F9F9F8
    align-items center
    .label
      color #434343
      font-size 0.14rem
    .note
      color #C6C6C6
      font-size 0.12rem
      i
        color #F2930B
        margin-right 0.05rem
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
        .title
          font-size 0.16rem
          color #434343
        .descp
          font-size 0.12rem
          color #999
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
.header
  font-size 0.14rem
  color #434343
  background-color #F9F9F8
  padding 0.1rem 0.2rem
.ticket
  padding 0.15rem 0
  display flex
  justify-content space-between
  font-size 0.16rem
  .t1
    font-size 0.14rem
    color #434343
  .t2
    font-size 0.12rem
    color #999999
  .discount
    color #FF4128
    font-size 0.16rem
  i
    color #434343
.list
  padding 0.1rem 0.2rem
  .item
    font-size 0.16rem
    display flex
    align-items center
    justify-content space-between
    padding 0.1rem 0
    border-bottom 1px solid #F0F0F0
    .left
      display flex
      align-items center
    img
      width 0.6rem
      height 0.6rem
    .title
      margin-left 0.1rem
      font-size 0.14rem
      color #343434
    .select-count
      font-size 0.11rem
      color #999999
    .price
      color #FFAF50
      font-size 0.16rem
</style>
