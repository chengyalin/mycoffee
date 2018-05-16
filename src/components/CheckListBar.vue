<template>
  <div class="check-list-bar" :class='{ show }'>
    <div class="icon-badge" @click='handleClickBadge'>
      <img class='icon' src="/static/img/icon_cart@3x.png" alt="">
      <span class='badge'>{{totalSelectCount}}</span>
    </div>
    <div class="total">
      <span class='total-price'>￥{{totalSelectPrice}}</span>
      <span class='total-origin-price'>原价: <span class='num'>￥{{totalSelectPriceOrigin}}</span></span>
    </div>
    <div class="btn" @click='handleCheckout'>
      {{btnText}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'library',
  components: {
  },
  props: {
    btnText: String,
    alwaysShow: Boolean,
    couponOff: {
      type: Number,
      default: 0
    },
    handleClickBadge: {
      type: Function,
      default: () => {}
    },
    handleCheckout: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  methods: {

  },
  computed: {
    totalSelectCount () {
      return this.$store.getters.totalSelectCount
    },
    totalSelectPrice () {
      return (this.$store.getters.totalPrice - this.couponOff).toFixed(2)
    },
    totalSelectPriceOrigin () {
      return this.$store.getters.totalPriceOrigin
    },
    show () {
      return this.alwaysShow || this.totalSelectCount > 0
    }
  }
}
</script>

<style lang='stylus' scope>
.check-list-bar
  position fixed
  height 0.5rem
  line-height 0.5rem
  bottom 0
  width 100%
  display none
  background-color #fff
  z-index 999
  font-size 0.16rem
  &.show
    display flex
  .btn
    flex 0 1 1rem
    color white
    font-size 0.15rem
    font-weight bold
    background-color #FFAF50
    text-align center
  .total
    flex 1
    padding-left 0.82rem
    .total-price
      font-size 0.2rem
      color #FF4128
      font-weight bold
    .total-origin-price
      font-size 0.11rem
      color #999
      margin-left 0.1rem
      .num
        text-decoration line-through
  .icon-badge
    position absolute
    left 0.15rem
    bottom 0.05rem
    .icon
      width 0.52rem
    .badge
      position absolute
      right -0.12rem
      top -0.04rem
      display block
      width 0.19rem
      height 0.19rem
      color white
      background-color #FFAF50
      border-radius 50%
      text-align center
      font-size 0.11rem
      line-height 0.19rem
      font-weight bold
</style>
