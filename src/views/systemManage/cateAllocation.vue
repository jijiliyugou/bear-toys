<template>
<el-container>
  <el-header style="padding:0;">
    <bsTop></bsTop>
  </el-header>
  <el-main style="padding:20px 0;overflow:visible;">
    <div class="custom-tree-container">
      <div class="submitTree">
        <div class="left">小竹熊 云科技分类：</div>
        <div class="right">
          <div class="selectExc">
            展厅分类：<el-select style="width:200px;" @change="changeSelect" v-model="value" clearable placeholder="请选择展厅分类">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.companyName"
              :value="item.companyNumber">
            </el-option>
          </el-select>
          </div>
          <div>
            <el-button type="primary" :disabled="isSelectCate()" @click="subEditCate" style="marginRight:10px;">保存</el-button>
            <el-popconfirm title="确定要重置该展厅下的全部分类吗？" @onConfirm="clearCateAll()">
              <el-button type="danger" slot="reference" :disabled="!value" :loading="isClearCate">
                全部重置
              </el-button>
            </el-popconfirm>
          </div>
        </div>
      </div>
        <div class="blockBox">
        <div class="block">
        <div style="display:flex;justify-content:space-between;">
          <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" clearable v-model="filterTextOne"></el-input>
          <!-- <el-button type="danger" @click="resetCheckedOne">重置</el-button> -->
        </div>
        <el-tree
          :data="myCategoryList"
          accordion
          show-checkbox
          ref="treeOne"
          :filter-node-method="filterNodeOne"
          expand-on-click-node
          check-on-click-node
          :check-strictly="true"
          node-key="id"
          :props="props"
          @check="handleCheckChangeOne"
          :render-content="renderContent"
          draggable>
        </el-tree>
          <!-- default-expand-all -->
      </div>
      <div class="block">
        <div style="display:flex;justify-content:space-between;">
          <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" clearable v-model="filterTextTwo"></el-input>
          <!-- <el-button type="danger" @click="resetCheckedTwo">重置</el-button> -->
        </div>
        <el-tree
        draggable
        accordion
          :data="companyCategoryList"
          ref="treeTwo"
           :filter-node-method="filterNodeTwo"
          show-checkbox
          :props="props"
          node-key="id"
          @check="handleCheckChangeTwo"
          @node-click="treeNodeClick"
          check-on-click-node
          :check-strictly="true"
          expand-on-click-node>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="display:flex;align-items:center;">{{ node.label}}<em style="margin-left:5px;" v-if="data.categoryID">===> <el-tag size="small">{{ data.categoryName }}</el-tag></em></span>
            <span>
              <el-popconfirm title="确定要重置已分配好的分类吗？" :ref="'myPopconfirm' + data.id" @onConfirm="subEditCate(null,data.id)">
                <el-button
                @click.stop="removes('myPopconfirm' + data.id)"
                :disabled="!data.categoryName && !data.categoryID"
                type="danger"
                plain
                size="mini"
                slot="reference">
                重置
              </el-button>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
      </div>
      </div>
    </div>
  </el-main>
  <el-footer style="padding:0;" height="162px">
    <bsFooter></bsFooter>
  </el-footer>
</el-container>
</template>

<script>
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/oldFooter'
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      resetCount: 0,
      startCount: 0,
      isClearCate: false,
      removeName: null,
      myCategoryList: null, // 小竹熊 云科技类目
      companyCategoryList: null, // 其他展厅类目
      companyList: null,
      filterTextOne: null,
      filterTextTwo: null,
      options: [{
        value: '选项1',
        label: '新悦翔展厅'
      }, {
        value: '选项2',
        label: '耀升展厅'
      }, {
        value: '选项3',
        label: '黄金糕'
      }, {
        value: '选项4',
        label: '双皮奶'
      }, {
        value: '选项6',
        label: '北京烤鸭'
      }],
      value: null,
      props: {
        label: 'name',
        value: 'id'
      },
      id: 1000
    }
  },
  methods: {
    // 全部清空
    async clearCateAll () {
      if (!this.companyCategoryList || this.companyCategoryList.length === 0) {
        this.$message.error('该展厅没有分类')
        return false
      }
      this.isClearCate = true
      this.resetCount = 0
      this.startCount = 0
      await this.recursionClear(this.companyCategoryList)
      this.$refs.treeOne.setCheckedKeys([])
      this.$refs.treeTwo.setCheckedKeys([])
      this.getSynchrCategoryList()
      this.$message.closeAll()
      const isCount = (this.startCount - this.resetCount)
      if (isCount) this.$message.error('重置成功' + this.resetCount + '条，失败' + isCount + '条')
      else this.$message.success('全部重置成功')
      this.isClearCate = false
    },
    // 递归发送清空请求
    async recursionClear (list) {
      if (list instanceof Array && list.length) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].categoryID || list[i].categoryName) {
            this.startCount++
            await this.recursionClear(list[i].children)
            const res = await this.sendHttp({ categoryName: null, categoryID: null, id: list[i].id })
            if (res.data.result.code === 200) this.resetCount++
          }
        }
      }
    },
    // 发送请求
    async sendHttp (fd) {
      return await this.$http.post('/api/UpdateSynchrCategory', fd)
    },
    // 提交
    async subEditCate (flag, id) {
      const fd = {
        categoryName: (flag ? this.$refs.treeOne.getCheckedNodes()[0].name : flag),
        categoryID: (flag ? this.$refs.treeOne.getCheckedNodes()[0].id : flag),
        id: id || this.$refs.treeTwo.getCheckedKeys()[0]
      }
      const res = await this.sendHttp(fd)
      if (res.data.result.code === 200) {
        this.$refs.treeOne.setCheckedKeys([])
        this.$refs.treeTwo.setCheckedKeys([])
        this.getSynchrCategoryList()
      } else {
        this.$message.closeAll()
        this.$message.error(res.data.result.msg)
      }
    },
    // 验证是否选中
    isSelectCate () {
      if ((this.$refs.treeOne && this.$refs.treeOne.getCheckedKeys().length > 0) && (this.$refs.treeTwo && this.$refs.treeTwo.getCheckedKeys().length > 0)) {
        return false
      } else {
        return true
      }
    },
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.companyList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取小竹熊 云科技产品类目列表
    async getProductCategoryList () {
      this.$store.commit('updateAppLoading', true)
      const res = await this.$http.post('/api/ProductCategoryList', {})
      if (res.data.result.code === 200) {
        this.myCategoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
      this.$store.commit('updateAppLoading', false)
    },
    // 选择展厅分类
    changeSelect () {
      this.getSynchrCategoryList()
      this.$refs.treeTwo.setCheckedKeys([])
    },
    // 获取小竹熊 云科技产品类目列表
    async getSynchrCategoryList () {
      const res = await this.$http.post('/api/synchrCategoryList', { hallNumer: this.value })
      if (res.data.result.code === 200) {
        this.companyCategoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 单选
    handleCheckChangeOne (data, nodes) {
      if (nodes.checkedKeys.length > 0) {
        this.$refs.treeOne.setCheckedKeys([data.id])
      }
    },
    handleCheckChangeTwo (data, nodes) {
      if (nodes.checkedKeys.length > 0) {
        this.$refs.treeTwo.setCheckedKeys([data.id])
        this.removeName && this.$refs[this.removeName].cancel()
      }
    },
    // 清空已选
    // resetCheckedOne () {
    //   this.$refs.treeOne.setCheckedKeys([])
    // },
    // 清空已选
    // resetCheckedTwo () {
    //   this.$refs.treeTwo.setCheckedKeys([])
    // },
    treeNodeClick () {
      this.removeName && this.$refs[this.removeName] && this.$refs[this.removeName].cancel()
    },
    removes (name) {
      this.removeName && this.$refs[this.removeName] && this.$refs[this.removeName].cancel()
      this.removeName = name
    },
    // 删除按钮
    async remove (data) {
      data.categoryID = null
      data.categoryName = null
      const res = await this.$http.post('/api/UpdateSynchrCategory', data)
      console.log(res)
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
    },
    filterNodeOne (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterNodeTwo (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>)
    }
  },
  created () {
    this.getProductCategoryList()
    this.getOrgCompanyList()
  },
  mounted () {
  },
  watch: {
    filterTextOne (val) {
      this.$refs.treeOne.filter(val)
    },
    filterTextTwo (val) {
      this.$refs.treeTwo.filter(val)
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.custom-tree-container {
    max-width:1200px;
    min-width: 1024px;
    box-sizing: border-box;
    margin:0 auto;
    font-size: 14px;
    .submitTree{
      height: 50px;
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-weight: 600;
      .left,.right {
        flex: 1;
      }
      .right {
        display: flex;
        justify-content: space-between;
      }
    }
    .blockBox{
      display: flex;
      justify-content: space-between;
      .block{
        flex: 1;
        border: 1px solid #eff2f6;
        padding-bottom: 10px;
        .el-tree{
          max-height: 550px;
          overflow: auto;
        }
      }
    }
  }
  @{deep} .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  @{deep} .el-tree-node{
      margin-top: 10px;
      padding-bottom:1px;
    }
</style>
