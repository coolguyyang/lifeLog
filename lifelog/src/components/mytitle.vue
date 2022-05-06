<template>
  <div class="first">
    <van-icon name="arrow-left" v-if="isleft" class="back" @click="goback()" />
    <div v-if="searchBar" class="search">
      <input
        v-model="searchKey"
        placeholder="请输入..."
        @input="search(searchKey)"
      />
      <div class="icon" @click="search(searchKey)">
        <van-icon name="search" />
      </div>
    </div>
    <div v-else class="title">
      lifelog<span v-if="range">({{ range }})</span>
    </div>
    <img v-if="isright === true" src="../assets/img/index-lead.png" alt="=" />
    <div v-if="isright === false" class="save" @click="save()">保存</div>
  </div>
</template>

<script>
export default {
  name: 'mytitle',
  data() {
    return {
      searchKey: '',
    }
  },
  props: ['isleft', 'isright', 'save', 'searchBar', 'search', 'range'],
  methods: {
    goback() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.first {
  width: 100%;
  background-color: rgb(79, 228, 228);
  height: 1.333333rem;
  position: fixed;
  top: 0;
  z-index: 99;
  .back {
    position: absolute;
    top: 0.2rem;
    left: 0.4rem;
    color: white;
    font-size: 0.48rem;
    line-height: 2;
  }
}

.first .title {
  font-size: 0.48rem;
  line-height: 2;
  color: white;
  width: 4.266667rem;
  position: absolute;
  top: 0.186667rem;
  left: 4rem;
  span {
    font-size: 0.4rem;
  }
}
.search {
  position: absolute;
  top: 0;
  height: 0.8rem;
  width: calc(90% - 0.8533rem);
  left: 5%;
  background: rgb(79, 228, 228);
  padding: 0.2667rem 0.4267rem;
  display: flex;
  justify-content: flex-start;
  input {
    width: 100%;
    border: none;
    padding-left: 0.2667rem;
    border-radius: 0.4rem 0 0 0.4rem;
  }
  .icon {
    margin-left: -0.0267rem;
    font-size: 0.64rem;
    width: 0.8rem;
    line-height: 0.8rem;
    background: #fff;
    border-radius: 0 0.4rem 0.4rem 0;
  }
}
.first img {
  width: 0.453333rem;
  position: absolute;
  top: 0.4rem;
  right: 0.266667rem;
}
.first .save {
  color: #fff;
  font-size: 0.4267rem;
  width: 0.9067rem;
  position: absolute;
  top: 0.4rem;
  right: 0.266667rem;
}
</style>
