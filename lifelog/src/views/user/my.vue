<template>
  <div class="my">
    <van-cell is-link>
      <template #title>
        <div class="userinfo">
          <div class="ph">
            <van-image
              round
              width="1.6rem"
              height="1.6rem"
              lazy-load
              :src="
                userInfo.img ? userInfo.img : DEFAULTHD
              "
            />
          </div>
          <div class="info">
            <div class="name">{{ userInfo.name }}</div>
            <div class="uid">{{ userInfo.uid }}</div>
          </div>
        </div>
      </template>
    </van-cell>
    <van-cell title="我的收藏" is-link icon="bookmark-o" to="#" />
    <van-cell title="我的图片" is-link icon="photo-o" to="#" />
    <van-cell title="我的视频" is-link icon="video-o" to="#" />
    <van-cell title="退出" to="/login" @click="LogoutAction" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { $getUser } from '@/utils/api'
import DEFAULTHD from '@/assets/default.png'
export default {
  name: 'my',
  data() {
    return {
      DEFAULTHD: DEFAULTHD,
      userInfo: [],
    }
  },
  methods: {
    ...mapActions(['LogoutAction']),
  },
  activated() {
    $getUser({ uid: this.$store.getters.uid }).then((res) => {
      if (res.data.results) {
        this.userInfo = res.data.results
      }
      console.log(this.userInfo)
    })
  },
}
</script>

<style lang="scss" scoped>
.my {
  background-color: #f5f5f5;
  .userinfo {
    height: 2.1333rem;
    display: flex;
    .ph {
      height: 1.6rem;
      margin-top: 0.32rem;
      img {
        border-radius: 0.2667rem;
        width: 1.6rem;
        height: 1.6rem;
      }
    }
    .info {
      margin-left: 0.5333rem;
      width: calc(100% - 2rem);
      height: 2.1333rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 0.3733rem;
      color: #939393;
      .name {
        font-size: 0.5333rem;
        font-weight: bold;
        color: black;
      }
    }
  }
}
</style>
