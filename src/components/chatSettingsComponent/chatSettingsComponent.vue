<template>
<div class="wrapBox">
    <div class="topLayout">聊天设置</div>
    <div class="personDetails">
      <div class="block" @click="topPersonDataCom">
        <el-avatar :size="50" :src="options.toUserImage"><div class="userImgError">{{ this.options.toLinkName }}</div></el-avatar>
        <div class="userName">{{ this.options.toLinkName }}</div>
      </div>
    </div>
    <div class="chatContent">
      <div class="title">聊天内容</div>
      <div class="items">
        <div class="item" @click="openRecord('Text')">
          <i class="searchIcon"></i>
          搜索
        </div>
        <div class="item"  @click="openRecord('imgorvideo')">
          <i class="imgIcon"></i>
          图片
        </div>
        <div class="item"  @click="openRecord('Product')">
          <i class="linkIcon"></i>
          链接
        </div>
      </div>
    </div>
    <!-- 查看聊天记录 -->
  <el-dialog
  title="查看聊天记录"
  :visible.sync="checkChatDialog"
  class="seeCheckChat"
  top="60px"
  width="40%">
  <!-- 动态组件 -->
  <component :is="dynamicComponent" :options="options"></component>
</el-dialog>
</div>
</template>

<script>
import textGroupChatRecordingComponent from '@/components/textGroupChatRecordingComponent/textGroupChatRecordingComponent'
import mediaGroupChatRecordingComponent from '@/components/mediaGroupChatRecordingComponent/mediaGroupChatRecordingComponent'
import linkGroupChatRecordingComponent from '@/components/linkGroupChatRecordingComponent/linkGroupChatRecordingComponent'
export default {
  props: ['options'],
  components: {
    textGroupChatRecordingComponent,
    linkGroupChatRecordingComponent,
    mediaGroupChatRecordingComponent
  },
  data () {
    return {
      checkChatDialog: false,
      dynamicComponent: 'textGroupChatRecordingComponent',
      msgType: 'Text'
    }
  },
  methods: {
    // 查看个人信息详情
    topPersonDataCom () {
      console.log(this.options)
      const data = {
        userId: this.options.toUserID,
        companyId: this.options.toCompanyID,
        componentName: 'personalDataComponent'
      }
      this.$emit('openTwoView', data)
    },
    // 切换搜索聊天记录类型
    openRecord (msgType) {
      this.checkChatDialog = true
      this.dynamicComponent = null
      switch (msgType) {
        case 'Text':
          this.dynamicComponent = 'textGroupChatRecordingComponent'
          break
        case 'imgorvideo':
          this.dynamicComponent = 'mediaGroupChatRecordingComponent'
          break
        case 'Product':
          this.dynamicComponent = 'linkGroupChatRecordingComponent'
          break
      }
    }
  },
  created () {

  },
  mounted () {
    console.log(this.options)
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox {
  height: 825px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: #F5F5F5;
  .topLayout {
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #f5f5f5;
  }
  .personDetails{
    background-color: #fff;
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .block{
      @{deep} .el-avatar{
        img{
          width: 50px;
          height: 50px;
        }
      }
      cursor: pointer;
      .userImgError{
        background-color: #165AF8;
        color: #fff;
      }
      .userName{
        font-size: 14px;
        width: 50px;
        color: #999999;
        text-align: center;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
      }
    }
  }
  .chatContent{
    margin-top: 20px;
    background-color: #fff;
    .title{
      border-bottom: 1px solid #f5f5f5;
      height: 50px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      color: #1B1B1B;
    }
    .items{
      height: 80px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .item{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
        color: #999999;
        .searchIcon,.imgIcon,.linkIcon{
          display: block;
          width: 25px;
          height: 25px;
        }
        .searchIcon{
          background: url('~@/assets/images/sousuoIcon.png') no-repeat center;
          background-size: contain;
        }
        .imgIcon{
          background: url('~@/assets/images/tupianIcon.png') no-repeat center;
          background-size: contain;
        }
        .linkIcon{
          background: url('~@/assets/images/linkIcon.png') no-repeat center;
          background-size: contain;
        }
      }
    }
  }
}
</style>
