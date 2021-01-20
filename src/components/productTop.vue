<template>
  <div class="searchBox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="货物编号">
        <el-input
          v-model="formInline.code"
          placeholder="输入货物编号"
          size="mini"
          style="width: 70%;"
        ></el-input>
      </el-form-item>

      <el-form-item label="关键字查询">
        <el-input
          v-model="formInline.keyWord"
          placeholder="输入关键字"
          size="mini"
          style="width: 70%;"
        ></el-input>
      </el-form-item>

      <el-form-item label="来源查询">
        <el-select
          v-model="formInline.source"
          placeholder="请选择"
          size="mini"
          style="width: 70%;"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btnList">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" v-if="Export" @click="addData"
          >批量导出</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    Export: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formInline: {
        keyWord: '',
        code: '',
        source: ''
      },
      options: [
        {
          value: '选项1',
          label: '展厅'
        },
        {
          value: '选项2',
          label: '公司'
        },
        {
          value: '选项3',
          label: '供应商'
        }
      ]
    }
  },
  methods: {
    search () {},
    addData () {}
  }
}
</script>

<style lang="less" scoped>
.searchBox {
  margin-top: 50px;
  .btnList {
    float: right;
  }
}
</style>
