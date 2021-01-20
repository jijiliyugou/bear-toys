<template>
<!-- 选择群聊 | 新的好友 -->
<div class="newFriends">
  <div class="topLayout">
    <span></span>
    <span>{{ groupListOptions.text }}</span>
    <span>
    </span>
  </div>
  <div class="newFriendsContentWrap">
    <template v-if="newFriendOptions.text === '新的好友'">
      <div class="line"></div>
      <div class="contentTitle">新的好友</div>
      <div class="contentList">
        <!-- 好友item -->
        <div class="itemBox" @click="openAccept({code:1,item:item})" v-for="(item, i) in friendList" :key="i">
          <div class="left">
            <div class="icon">
              <el-image fit="contain" :src="require('@/assets/images/imgError.jpg')" lazy>
                  <div
                    slot="placeholder"
                    class="image-slot"
                    style="width:40px;height:40px;margin:0 auto;"
                  >
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                  <div
                    slot="error"
                    class="image-slot"
                    style="width:40px;height:40px;margin:0 auto"
                  >
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                </el-image>
            </div>
            <div class="nameBox">
              <div class="name">宋大宝</div>
              <div class="company">您好，我是小竹熊云科技科技科技科技科技科技科技</div>
            </div>
          </div>
          <div class="right">
            <el-button v-if="i % 2" size="small" type="primary" @click.stop="openAccept({code:2,item:item})" round>接受</el-button>
            <span v-else class="text">已添加</span>
          </div>
        </div>
      </div>
    </template>
    <!-- 选择群聊 -->
    <template v-else>
      <div class="searchBox">
        <div class="inputBox">
          <el-input
            class="searchInput"
            prefix-icon="iconfont icon-sousuo"
            v-model="search"
            clearable
            placeholder="请输入关键字搜索">
          </el-input>
          <el-button type="primary" round>搜索</el-button>
        </div>
      </div>
      <div class="contentListTwo">
        <li class="item" v-for="i in groupMessageList" :key="i">
          <el-image fit="contain" :src="require('@/assets/images/imgError.jpg')" lazy>
            <div
              slot="placeholder"
              class="image-slot"
              style="width:40px;height:40px;margin:0 auto;"
            >
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width:40px;height:40px;margin:0 auto"
            >
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
          </el-image>
          <span class="name">某某某舔狗群</span>
          <span class="count">(999)</span>
        </li>
      </div>
    </template>
  </div>
  <div class="footer"></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      groupMessageList: []
    }
  },
  methods: {
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang='less'>

</style>
