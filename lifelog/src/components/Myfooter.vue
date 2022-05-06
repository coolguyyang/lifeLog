<template>
  <div class="nav">
    <router-link to="/home">
      <van-icon name="wap-home-o" class="icon" />
      <span class="text">首页</span></router-link
    >
    <router-link to="/show">
      <van-icon name="apps-o" class="icon" />
      <span class="text">浏览</span></router-link
    >
    <router-link to="/add">
      <van-icon name="add-o" class="icon add"
    /></router-link>
    <router-link to="/recommend">
      <van-icon name="gem-o" class="icon" />
      <span class="text">推荐</span></router-link
    >
    <router-link to="/my">
      <van-icon name="user-circle-o" class="icon" />
      <span class="text">我的</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Myfooter',
}
</script>

<style scoped>
.nav {
  width: 100%;
  height: 1.28rem;
  background: white;
  position: fixed;
  bottom: 0;
  border-top: 0.01rem solid #d8d8d8;
  display: flex;
  justify-content: space-around;
}
.nav a {
  width: 2rem;
  line-height: 1.28rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #696969;
}
.text {
  line-height: 0.32rem;
  margin-top: 0.088rem;
}
.icon {
  line-height: 0.666667rem;
  font-size: 0.586667rem;
  margin-top: 0.08rem;
}
.add {
  font-size: 1rem;
}
.nav a.router-link-active {
  color: #f03d37;
}
</style>
