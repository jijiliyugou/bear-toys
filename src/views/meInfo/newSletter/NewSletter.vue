<template>
  <div class="box">
    <div class="topTitle">
      <span>通讯录</span>
      <span
        class="el-icon-circle-plus-outline addFriend"
        @click="showAddFriendDialog = !showAddFriendDialog"
      >
        <div class="addFriendDialog" v-show="showAddFriendDialog">
          <div class="boxAdd">
            <div
              class="item"
              @click="
                openOneView({
                  componentName: 'addFriendComponent',
                })
              "
            >
              <i class="itemIcon addIcon"></i>
              添加好友
            </div>
            <div
              class="item"
              @click="
                openOneView({
                  componentName: 'launchGroupChatComponent'
                })
              "
            >
              <i class="itemIcon zuIcon"></i>
              发起群聊
            </div>
          </div>
        </div>
      </span>
    </div>
    <div class="search">
      <el-input
        class="searchInput"
        prefix-icon="iconfont icon-sousuo"
        v-model="search"
        clearable
        placeholder="请输入关键词"
      ></el-input>
    </div>
    <div class="organizationContent">
      <div class="organizationItem">
        <div class="organizaItem">
          <div
            class="parent"
            @click="
              openOneView({
                componentName: 'newFriendComponent',
              })
            "
          >
            <div class="left">
              <el-image
                :src="require('@/assets/images/newFriendIcon.png')"
                class="myAvatar"
                fit="cover"
              >
              </el-image>
              <p>新的好友</p>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div class="organizationItem">
        <div class="organizaItem">
          <div
            class="parent"
            @click="openOneView({ componentName: 'chooseGroupChatComponent' })"
          >
            <div class="left">
              <el-image
                :src="require('@/assets/images/groupChat.png')"
                class="myAvatar"
                fit="cover"
              >
              </el-image>
              <p>群聊</p>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <hr />
      <div
        class="contactPerson"
        v-if="this.userInfo && this.userInfo.commparnyList"
      >
        <div
          class="parent"
          @click="openOneView({ componentName: 'hallContactComponent', companyType:'Exhibition', id: userInfo.commparnyList[0].commparnyId })"
          v-show="
            this.userInfo.commparnyList &&
            this.userInfo.commparnyList.length &&
            this.userInfo.commparnyList[0].companyType !== 'Exhibition'
          "
        >
          <el-avatar
            class="myAvatar"
            :src="require('@/assets/images/zhanting.png')"
          ></el-avatar>
          <p>展厅联系人</p>
        </div>
        <div
          class="parent"
          @click="openOneView({ componentName: 'hallContactComponent', companyType:'Supplier', id: userInfo.commparnyList[0].commparnyId })"
          v-show="
            this.userInfo.commparnyList &&
            this.userInfo.commparnyList.length &&
            this.userInfo.commparnyList[0].companyType !== 'Supplier'
          "
        >
          <el-avatar
            class="myAvatar"
            :src="require('@/assets/images/lianxiren.png')"
          ></el-avatar>
          <p>供应商联系人</p>
        </div>
        <div
          class="parent"
          @click="openOneView({ componentName: 'hallContactComponent', companyType:'Sales', id: userInfo.commparnyList[0].commparnyId })"
          v-show="
            this.userInfo.commparnyList &&
            this.userInfo.commparnyList.length &&
            this.userInfo.commparnyList[0].companyType !== 'Sales'
          "
        >
          <el-avatar
            class="myAvatar"
            :src="require('@/assets/images/gongsilianxi.png')"
          ></el-avatar>
          <p>公司联系人</p>
        </div>
      </div>
      <div class="organizationItem" v-if="Organization">
        <div class="organizaItem">
          <div class="parent" @click="openCollapse">
            <div class="left">
              <el-image
                style="background-color:#fff;"
                :src="require('@/assets/images/colleaguesBook.png')"
                class="myAvatar"
                fit="cover"
              >
              </el-image>
              <p class="pColleagues">
                同事通讯录<i
                  :class="{
                    'el-icon-arrow-down': true,
                    Colleagues: true,
                    rotateColleagues: showCollapse,
                  }"
                ></i>
              </p>
            </div>
          </div>
          <el-collapse-transition>
            <ol class="items" v-show="showCollapse">
              <li
                class="item"
                v-for="(item, i) in orgList"
                :key="i"
                @click="openColleague(item)"
              >
                <el-image
                  :src="item.userImage"
                  class="myAvatar"
                  :key="item.userImage"
                  fit="cover"
                >
                  <div
                    slot="error"
                    class="image-slot"
                    style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: left;
                      white-space: nowrap;
                    "
                  >
                    {{ item.linkman }}
                  </div>
                </el-image>
                <p>{{ item.linkman }}</p>
              </li>
            </ol>
          </el-collapse-transition>
        </div>
      </div>
      <hr />
      <h3>我的好友</h3>
      <div
        class="oftenContact"
        v-for="(item, i) in regularContact"
        :key="i"
        @click="sendInfo(item)"
      >
        <div class="left">
          <el-image
          :src="item.userImage"
          class="myAvatar"
          :key="item.userImage"
          fit="cover"
        >
          <div
            slot="error"
            class="image-slot"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
            "
          >
            {{ item.remarkName?item.remarkName:item.userName }}
          </div>
          <div
            slot="placeholder"
            class="image-slot"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
            "
          >
            {{ item.remarkName?item.remarkName:item.userName }}
          </div>
        </el-image>
        <em>{{ item.remarkName?item.remarkName:item.userName }}</em>
        </div>
        <div class="right">
          {{item.companyName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      regularTotalCount: 0,
      showAddFriendDialog: false,
      showCollapse: false,
      currentPage: 1,
      pageSize: 10,
      search: '',
      Organization: {},
      orgList: [],
      regularContact: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    // 打开对应联系公司列表
    showCompanyList (val) {
      this.$emit('showCompanyList', {
        listType: val,
        type: 'showCompanyList',
        active: 1,
        id: this.userInfo.commparnyList[0].commparnyId
      })
    },
    // 打开同事详情
    openColleague (item) {
      const fd = { userId: item.id, companyId: this.Organization.id, componentName: 'personalDataComponent' }
      this.$emit('openOneView', fd)
    },
    // 点击添加好友|发起群聊事件
    openOneView (item) {
      this.$emit('openOneView', item)
    },
    // 打开同事通讯录折叠
    openCollapse () {
      this.showCollapse = !this.showCollapse
    },
    // showorganizationItem (val) {
    //   this.show3 = !this.show3
    //   this.sendCompany(val)
    // },
    // 点击公司查看公司详情
    // sendCompany (val) {
    //   this.$emit('showCompany', {
    //     id: val,
    //     type: 'showCompany',
    //     active: 1
    //   })
    // },
    handleNodeClick (data) {},
    // 获取组织架构
    async getOrgList () {
      const res = await this.$http.post('/api/OrgList', {})
      if (res.data.result.code === 200) {
        this.Organization = res.data.result.item.orgCompany
        this.orgList = res.data.result.item.personnes
      }
    },
    // 获取对应联系公司
    // async getContactList() {
    //   let res = await this.$http.post("/api/ContactsCompanyListByID", {
    //     companyID: this.userInfo.commparnyList[0].commparnyId,
    //     OppositeRole: this.userInfo.commparnyList[0].companyType
    //   });
    // },
    // 获取我的好友
    async getFriendAddressBooksPage () {
      const res = await this.$http.post('/api/GetFriendAddressBooksPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.regularContact = res.data.result.item.items
        this.regularTotalCount = res.data.result.item.totalCount
      }
    },
    // 点击我的好友
    sendInfo (item) {
      const fd = { userId: item.friendPersonnelId, companyId: item.friendCompanyId, componentName: 'personalDataComponent' }
      this.$emit('openOneView', fd)
    }
  },
  mounted () {
    this.getOrgList()
    this.getFriendAddressBooksPage()
    this.$root.eventHub.$on('UpdateOrgPersonnel', () => {
      this.currentPage = 1
      this.getOrgList()
      this.getFriendAddressBooksPage()
    })
    this.$root.eventHub.$on('resetMyFriends', () => {
      this.currentPage = 1
      this.getFriendAddressBooksPage()
    })
  },
  beforeDestroy () {
    this.$root.eventHub.$off('UpdateOrgPersonnel')
    this.$root.eventHub.$off('resetMyFriends')
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.box {
  height: 769px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .topTitle {
    height: 50px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 18px;
      color: #333333;
      &.addFriend {
        position: relative;
        font-weight: 600;
        cursor: pointer;
        .addFriendDialog {
          font-size: 14px;
          position: absolute;
          width: 100px;
          height: 90px;
          background-color: #fff;
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
          border-radius: 5px;
          top: 30px;
          right: 0;
          z-index: 2;
          .boxAdd {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            text-align: center;
            color: #333;
            font-weight: normal;
            padding: 0 10px;
            box-sizing: border-box;
            &::after {
              position: absolute;
              display: block;
              content: "";
              width: 0;
              height: 0;
              border: 10px solid transparent;
              border-bottom-color: #fff;
              right: 5px;
              top: -20px;
            }
            .item {
              flex: 1;
              display: flex;
              align-items: center;
              &:last-of-type {
                border-top: 1px dashed #aaa;
              }
              .itemIcon {
                display: block;
                width: 14px;
                height: 14px;
                margin-right: 5px;
                &.addIcon {
                  background: url("~@/assets/images/jiahaoyouicon.png")
                    no-repeat center;
                  background-size: 100%;
                }
                &.zuIcon {
                  background: url("~@/assets/images/zuIcon.png") no-repeat
                    center;
                  background-size: 100%;
                }
              }
            }
          }
        }
      }
    }
    border-bottom: 1px solid #f2f5f6;
  }
}
.search {
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 10px;
  height: 60px;
  display: flex;
  align-items: center;
  @{deep} .searchInput input.el-input__inner {
    border-radius: 20px;
    border: none;
    background-color: #f5f5f5;
  }
}

.organizationContent {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 0 20px 0;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
  .organization {
    .myTree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
      > .el-checkbox {
      display: none;
    }
    .myAvatar,
    .myTree {
      float: left;
    }
    .myAvatar {
      color: white;
      background-color: #165af7;
    }

    .myTree {
      margin-top: 10px;
    }

    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  .organizationItem {
    width: 100%;
    cursor: pointer;
    .organizaItem {
      .parent {
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        .left {
          flex: 1;
          display: flex;
          align-items: center;
          @{deep} .myAvatar {
            margin-right: 10px;
            color: white;
            background-color: #165af7;
            transition: all 1s;
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .pColleagues {
            margin-right: 5px;
            vertical-align: top;
            .Colleagues {
              margin-left: 10px;
              transition: all 0.2s;
              &.rotateColleagues {
                /* Rotate div */
                transform: rotate(180deg);
                -ms-transform: rotate(180deg);
                /* Internet Explorer */
                -moz-transform: rotate(180deg);
                /* Firefox */
                -webkit-transform: rotate(180deg);
                /* Safari 和 Chrome */
                -o-transform: rotate(180deg);
                /* Opera */
              }
            }
          }
        }
        &:hover {
          .left {
            .myAvatar {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
        }
      }
    }
    .items {
      margin-left: 40px;
      font-size: 14px;
      li.item {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        height: 30px;
        padding: 10px 0;
        .myAvatar {
          margin-right: 10px;
          color: white;
          background-color: #165af7;
          transition: all 1s;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        &:hover {
          .myAvatar {
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
          }
        }
      }
    }
  }
  hr {
    height: 20px;
    background-color: #f2f5f6;
    border: none;
  }
  .el-tree-node__expand-icon {
    border: 0;
    /*自定义，必要时用!important*/
  }
  .contactPerson {
    width: 100%;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
    cursor: pointer;
    .parent {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 10px 0;
      .myAvatar {
        margin-right: 10px;
        color: white;
        background-color: #165af7;
        transition: all 1s;
      }
      &:hover {
        .myAvatar {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
  }
  h3 {
    padding: 10px;
    font-size: 16px;
    font-weight: 700;
  }
  .oftenContact {
    padding: 0 10px;
    height: 60px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    cursor: pointer;
    .left{
      display: flex;
      align-items: center;
        .myAvatar {
        color: white;
        background-color: #165af7;
        transition: all 1s;
        color: white;
        background-color: #165af7;
        transition: all 1s;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      &:hover {
        .myAvatar {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
      em {
        margin: 0 10px;
      }
    }
    .right{
      font-size: 12px;
      color: #666666;
    }
  }
  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg) !important;
    transform: rotate(0deg) !important;
  }
  .el-icon-caret-right:before {
    // 加号图片
    content: "" !important;
    font-size: 16px;
  }
  .expanded:before {
    // 减号图片
    content: "" !important;
    font-size: 16px;
  }
  // 叶子类目不要图标
  .is-leaf.el-tree-node__expand-icon.el-icon-caret-right:before {
    content: "" !important;
    font-size: 16px;
  }
}
</style>
