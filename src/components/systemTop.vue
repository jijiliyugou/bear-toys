<template>
  <div class="searchBox">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键字查询">
        <el-input
          v-model="formInline.keyWord"
          placeholder="输入关键字"
          size="mini"
          style="width: 70%;"
        ></el-input>
      </el-form-item>

      <el-form-item label="新增时间">
        <el-date-picker
          type="date"
          placeholder="选择起始日期"
          v-model="formInline.startDate"
          size="mini"
          style="width: 70%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          type="date"
          placeholder
          v-model="formInline.endDate"
          size="mini"
          style="width: 70%;"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="活动区域">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
      <el-form-item class="btnList">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="addData">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formInline: {
        keyWord: '',
        startDate: '',
        endDate: ''
      }
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
