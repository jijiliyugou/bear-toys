<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="选择展厅">
          <el-select size="mini" style="width: 90%" v-model="formInline.hallNumber" clearable placeholder="请选择展厅">
            <el-option
              v-for="(item, index) in [{companyName: '全部', companyNumber: ''},...hallList]"
              :key="index"
              :label="item.companyName"
              :value="item.companyNumber">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字查询">
          <el-input
          clearable
            size="mini"
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态查询">
          <el-select
              clearable
              size="mini"
              v-model="formInline.isExistCompany"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, index) in [
                  { value: '', label: '全部' },
                  { value: 0, label: '未审核' },
                  { value: 1, label: '已审核' },
                  { value: 2, label: '已拒绝' },
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="下架时间">
          <el-date-picker
          size="mini"
          :clearable='false'
          :unlink-panels='true'
            v-model="formInline.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="productList" style="width: 100%">
        <el-table-column prop="hallName" label="展厅名称"></el-table-column>
        <el-table-column prop="ma_na" label="厂商名称"></el-table-column>
          <el-table-column prop="ma_ph_1" label="厂商电话" sortable>
            <template slot-scope="scope">
              {{ scope.row.handset ? scope.row.handset : scope.row.handset1 ? scope.row.handset1 : scope.row.handset2 }}
            </template>
          </el-table-column>
        <el-table-column prop="linkman" label="联系人">
          <template slot-scope="scope">
              {{ scope.row.linkman ? scope.row.linkman : scope.row.linkman1 ? scope.row.linkman1 : scope.row.linkman2 }}
            </template>
        </el-table-column>
        <el-table-column prop="isExistCompany" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isExistCompany === 1" type="success">已审核</el-tag>
            <el-tag v-else-if="scope.row.isExistCompany === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdOn" label="下架时间" sortable>
          <template slot-scope="scope">
            {{ scope.row.off_da && scope.row.off_da.split("T")[0] }}</template>
        </el-table-column>
        <el-table-column prop="verifyRemark" label="审核意见">
          <template slot-scope="scope">
            <template v-for="(item, i) in offAuditTypeList">
              <span :key="i" v-if="item.itemCode === scope.row.verifyRemark">{{ item.itemText }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              >审核</el-button>
            <el-button
              :disabled="scope.row.isExistCompany !== 1"
              size="mini"
              style="margin-right: 10px"
              type="success"
              @click="handleProduct(scope.row)"
              >上架产品</el-button>
            <el-popconfirm
              title="确定要删除这条信息吗？"
              @onConfirm="handleDelete(scope.row)"
            >
            <el-button size="mini" slot="reference" type="danger"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- 审核dialog -->
    <el-dialog
      :title="productDialogOptions.productDialogTitle"
      :visible.sync="productDialogOptions.openProductDialog"
      v-if="productDialogOptions.openProductDialog"
      width="70%"
      top="0"
      destroy-on-close
      class="productDialog examine"
    >
    <div class="conBox" v-loading="childrenLoading" element-loading-spinner element-loading-background="rgba(200, 200, 200, 0.5)">
      <div class="left">
        <div class="box-card">
          <div class="clearfix">
            <span>厂商明细</span>
            <div>
            <template>
            <el-button type="primary" @click="subAddProduct(1)">审核通过</el-button>
            <el-popover
            style="marginLeft:20px;"
              placement="bottom"
              width="150"
              trigger="click">
                <el-select
                clearable
                @change="changeSelect"
                v-model="hallFormData.verifyRemark"
                placeholder="请选择拒绝原因"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in offAuditTypeList"
                  :key="index"
                  :label="item.itemText"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
              <el-button slot="reference" style="width:98px;" type="danger" :loading="offAuditTypeLoading">拒绝</el-button>
            </el-popover>
            </template>
            </div>
          </div>
        <el-form
        ref="addVersionForm"
        label-width="100px"
        size="mini"
        :model="hallFormData"
      >
      <div style="display:flex;justify-content: space-between;">
        <el-form-item label="展厅名称" size="mini" prop="hallName">
          <el-input size="mini" v-model="hallFormData.hallName" disabled></el-input>
        </el-form-item>
        <el-form-item label="下架时间" prop="createdOn">
          <el-input size="mini" v-model="hallFormData.createdOn.split('T')[0]" disabled></el-input>
        </el-form-item>
        <el-form-item label="厂商名称" prop="ma_na">
           <el-input size="mini" v-model="hallFormData.ma_na" disabled></el-input>
        </el-form-item>
      </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="厂商座机" prop="handset">
              <el-input size="mini" v-model="hallFormData.ma_ph_1" disabled></el-input>
             </el-form-item>
             <el-form-item label="移动电话1" prop="handset">
              <el-input size="mini" v-model="hallFormData.handset" disabled></el-input>
            </el-form-item>
            <el-form-item label="移动电话2" prop="handset">
              <el-input size="mini" v-model="hallFormData.handset2" disabled></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="联系人1" prop="linkman">
              <el-input size="mini" v-model="hallFormData.linkman" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系人2" prop="linkman1">
              <el-input size="mini" v-model="hallFormData.linkman1" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系人3" prop="linkman2">
              <el-input size="mini" v-model="hallFormData.linkman2" disabled></el-input>
            </el-form-item>
          </div>
        </el-form>
        </div>
        <!-- 下架产品列表 -->
        <div class="box-card" style="padding:5px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);box-sizing:border-box;">
          <div class="clearfix" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #aaa;">
            <span>下架产品列表</span>
            <el-button @click="similarTheShelf(true)" type="primary">上架</el-button>
          </div>
        <el-table height="500" border size="small" :data="offProductList" ref="multipleTable" style="width: 100%" row-key="id" :empty-text="hallFormData.ma_na + '暂无下架产品'">
          <el-table-column type="selection" align="center" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="hallName" label="展厅名称"></el-table-column>
          <el-table-column prop="pr_na" label="产品名称"></el-table-column>
          <el-table-column prop="fa_no" label="出厂货号"></el-table-column>
          <el-table-column prop="ma_nu" label="厂商编号"></el-table-column>
          <el-table-column prop="isEntry" label="上架状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isEntry">已上架</el-tag>
              <el-tag type="danger" v-else>未上架</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="remark" label="产品备注"></el-table-column> -->
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                style="margin-right: 10px"
                type="primary"
                @click="handleShelfEdit(scope.row)"
                >明细</el-button
              >
              <el-popconfirm
                title="确定要删除这条菜单吗？"
                @onConfirm="handleShelfDelete(scope.row)"
              >
                <el-button size="mini" slot="reference" type="danger"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <center style="margin: 20px 0;overflow:auto;">
          <el-pagination
            small
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            background
            :page-sizes="[10, 20, 30, 50]"
            :total="totalCountOffProduct"
            :page-size="pageSizeOffProduct"
            :current-page.sync="currentPageOffProduct"
            @current-change="currentChangeOffProduct"
            @size-change="handleSizeChangeOffProduct"
          ></el-pagination>
        </center>
        </div>
      </div>
      <div class="right">
        <!-- 相似度 -->
        <div class="header">
          <el-table height="300" border empty-text="没有相似厂商" :data="similarSupplier" style="width: 100%" @row-click="rowClick">
            <el-table-column prop="client_na" label="厂商名称" align="center"></el-table-column>
            <el-table-column prop="handset" label="移动电话" align="center">
              <template slot-scope="scope">
                 {{ scope.row.handset ? scope.row.handset : scope.row.handset1 ? scope.row.handset1 : scope.row.handset2 }}
              </template>
            </el-table-column>
            <el-table-column prop="ma_ph_1" label="座机" align="center">
              <template slot-scope="scope">
                 {{ scope.row.ma_ph_1 ? scope.row.ma_ph_1 : scope.row.ma_ph_2 ? scope.row.ma_ph_2 : scope.row.ma_ph_3 }}
              </template>
            </el-table-column>
            <el-table-column prop="handset_c" label="见客电话" align="center"></el-table-column>
          </el-table>
          <center style="padding: 17px 0;overflow:auto;">
          <el-pagination
            small
            layout="total, prev, pager, next, jumper"
            background
            :page-sizes="[5, 10, 20, 30, 50]"
            :total="similarTotalCount"
            :page-size="similarPageSize"
            :current-page.sync="similarCurrentPage"
            @current-change="changeSimilarCurrentPage"
            @size-change="handleSizeChangeSimilar"
          ></el-pagination>
        </center>
        </div>
        <!-- 相似厂商的产品列表 -->
        <div class="footer">
          <el-table height="400" border :empty-text="emptyText" :data="similarSupplierProducts" style="width: 100%">
            <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="number" label="产品编号" align="center"></el-table-column>
            <el-table-column prop="fa_no" label="出厂货号" align="center"></el-table-column>
          </el-table>
          <center style="padding: 17px 0;overflow:auto;">
          <el-pagination
            small
            layout="total, prev, pager, next, jumper"
            background
            :page-sizes="[5, 10, 20, 30, 50]"
            :total="similarProductsTotalCount"
            :page-size="similarProductsPageSize"
            :current-page.sync="similarProductsCurrentPage"
            @current-change="currentProductsChangeProduct"
            @size-change="handleSizeChangeProducts"
          ></el-pagination>
        </center>
        </div>
      </div>
      <!-- 上架产品dialog -->
    <el-dialog
      title="产品明细"
      :visible.sync="productDialogOptions.openShelfProductDialog"
      destroy-on-close
      append-to-body
      class="productDialog"
    >
      <el-form
        :inline="true"
        class="addProductDialog"
        :model="addProductForm"
        ref="addProductRulesForm"
        label-width="100px"
      >
          <el-form-item class="productName" label="产品名称：" prop="pr_na">
          <el-input v-model="addProductForm.pr_na" disabled></el-input>
        </el-form-item>
        <div class="formItems">
          <el-form-item label="出厂货号：" prop="fa_no">
          <el-input v-model="addProductForm.fa_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司编号：" prop="number">
          <el-input v-model="addProductForm.number" disabled></el-input>
        </el-form-item>
        </div>
       <div class="formItems">
        <el-form-item  label="产品分类：" prop="cl_nu">
          <el-input v-model="addProductForm.cl_na" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价：">
          <el-input v-model="addProductForm.fa_pr" disabled></el-input>
        </el-form-item>
       </div>
        <div class="formItems">
          <div class="formItemSan">
            <el-form-item label="装箱量：">
              <el-input v-model="addProductForm.in_en" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_lo" disabled></el-input
            ></el-form-item>
          </div>
           <div class="formItems">
             <el-form-item label="包装：">
            <el-input v-model="addProductForm.ch_pa" disabled></el-input>
          </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="外箱规格：">
              <el-input v-model="addProductForm.ou_le" disabled></el-input
              ><span class="itemX">X</span></el-form-item
            >
            <el-form-item
              ><el-input v-model="addProductForm.ou_wi" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_hi" disabled></el-input
            ></el-form-item>
          </div>
          <div>
            <el-form-item label="体积/材积：">
              <el-input v-model="addProductForm.bulk_stere" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.bulk_feet" disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="样品规格：">
              <el-input v-model="addProductForm.pr_le" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_wi" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_hi" disabled></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="毛重/净重：">
              <el-input v-model="addProductForm.ne_we" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.gr_we" disabled></el-input
            ></el-form-item>
          </div>
        </div>
         <el-form-item class="productName" label="产品说明：">
           <el-input
           disabled
            type="textarea"
            v-model="addProductForm.remark"
          ></el-input>
         </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" :disabled="addProductForm.isEntry" @click="similarTheShelf(false)">上 架</el-button>
        <el-button @click="productDialogOptions.openShelfProductDialog = false"
          >取 消</el-button
        >
      </center>
    </el-dialog>
    </div>
      </el-dialog>
    <!-- 上架产品dialog -->
    <el-dialog
      :title="productDialogOptions.shelfTitle"
      :visible.sync="productDialogOptions.openShelfDialog"
      destroy-on-close
      width="70%"
      top="60px"
      class="productDialog">
      <div v-loading="childrenLoading" element-loading-spinner element-loading-background="rgba(200, 200, 200, 0.5)">
        <el-table :data="currentHall" style="width: 100%">
        <el-table-column prop="hallName" label="展厅名称"></el-table-column>
        <el-table-column prop="ma_na" label="厂商名称"></el-table-column>
          <el-table-column prop="ma_ph_1" label="厂商电话" sortable>
            <template slot-scope="scope">
              {{ scope.row.ma_ph_1 ? scope.row.ma_ph_1 : scope.row.ma_ph_2 ? scope.row.ma_ph_2 : scope.row.ma_ph_3 }}
            </template>
          </el-table-column>
        <el-table-column prop="linkman" label="联系人">
          <template slot-scope="scope">
              {{ scope.row.linkman ? scope.row.linkman : scope.row.linkman1 ? scope.row.linkman1 : scope.row.linkman2 }}
            </template>
        </el-table-column>
        <el-table-column prop="isExistCompany" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isExistCompany === 1" type="success">已审核</el-tag>
            <el-tag v-else-if="scope.row.isExistCompany === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="off_da" label="下架时间" sortable>
          <template slot-scope="scope">
            {{ scope.row.off_da.split("T")[0] }}</template>
        </el-table-column>
        <el-table-column prop="verifyRemark" label="审核意见">
          <template slot-scope="scope">
            <template v-for="(item, i) in offAuditTypeList">
              <span :key="i" v-if="item.itemCode === scope.row.verifyRemark">{{ item.itemText }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-card class="box-card">
        <div slot="header" style="display:flex;alignItems:center;justifyContent: space-between;" class="clearfix">
          <span>产品列表</span>
          <el-button style="float: right;" @click="theShelf(true)" type="primary">上架</el-button>
        </div>
        <!-- 下架产品 -->
        <el-table :data="childrenProductList" ref="multipleTable" style="width: 100%" row-key="id">
          <el-table-column type="selection" align="center" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="hallName" label="展厅名称"></el-table-column>
          <el-table-column prop="pr_na" label="产品名称"></el-table-column>
          <el-table-column prop="fa_no" label="出厂货号"></el-table-column>
          <el-table-column prop="ma_nu" label="厂商编号"></el-table-column>
          <el-table-column prop="isEntry" label="上架状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isEntry">已上架</el-tag>
              <el-tag type="danger" v-else>未上架</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="off_da" label="下架时间" sortable>
            <template slot-scope="scope">{{
              scope.row.off_da && scope.row.off_da.split("T")[0]
            }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="产品备注"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                style="margin-right: 10px"
                type="primary"
                @click="handleShelfEdit(scope.row)"
                >明细</el-button
              >
              <el-popconfirm
                title="确定要删除这条菜单吗？"
                @onConfirm="handleShelfDelete(scope.row)"
              >
                <el-button size="mini" slot="reference" type="danger"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <center style="margin: 20px 0">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            background
            :page-sizes="[5, 10, 20, 30, 50]"
            :total="totalCountProduct"
            :page-size="pageSizeProduct"
            :current-page.sync="currentPageProduct"
            @current-change="currentChangeProduct"
            @size-change="handleSizeChangeProduct"
          ></el-pagination>
        </center>
      </el-card>
      <!-- 上架产品dialog -->
    <el-dialog
      title="产品明细"
      :visible.sync="productDialogOptions.openShelfProductDialog"
      destroy-on-close
      append-to-body
      class="productDialog"
    >
      <el-form
        :inline="true"
        class="addProductDialog"
        :model="addProductForm"
        ref="addProductRulesForm"
        label-width="100px"
      >
          <el-form-item class="productName" label="产品名称：" prop="pr_na">
          <el-input v-model="addProductForm.pr_na" disabled></el-input>
        </el-form-item>
        <div class="formItems">
          <el-form-item label="出厂货号：" prop="fa_no">
          <el-input v-model="addProductForm.fa_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司编号：" prop="number">
          <el-input v-model="addProductForm.number" disabled></el-input>
        </el-form-item>
        </div>
       <div class="formItems">
        <el-form-item  label="产品分类：" prop="cl_nu">
          <el-input v-model="addProductForm.cl_na" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价：">
          <el-input v-model="addProductForm.fa_pr" disabled></el-input>
        </el-form-item>
       </div>
        <div class="formItems">
          <div class="formItemSan">
            <el-form-item label="装箱量：">
              <el-input v-model="addProductForm.in_en" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_lo" disabled></el-input
            ></el-form-item>
          </div>
           <div class="formItems">
             <el-form-item label="包装：">
            <el-input v-model="addProductForm.ch_pa" disabled></el-input>
          </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="外箱规格：">
              <el-input v-model="addProductForm.ou_le" disabled></el-input
              ><span class="itemX">X</span></el-form-item
            >
            <el-form-item
              ><el-input v-model="addProductForm.ou_wi" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_hi" disabled></el-input
            ></el-form-item>
          </div>
          <div>
            <el-form-item label="体积/材积：">
              <el-input v-model="addProductForm.bulk_stere" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.bulk_feet" disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="样品规格：">
              <el-input v-model="addProductForm.pr_le" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_wi" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_hi" disabled></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="毛重/净重：">
              <el-input v-model="addProductForm.ne_we" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.gr_we" disabled></el-input
            ></el-form-item>
          </div>
        </div>
         <el-form-item class="productName" label="产品说明：">
           <el-input
           disabled
            type="textarea"
            v-model="addProductForm.remark"
          ></el-input>
         </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" :disabled="addProductForm.isEntry" @click="theShelf(false)">上 架</el-button>
        <el-button @click="productDialogOptions.openShelfProductDialog = false"
          >取 消</el-button
        >
      </center>
    </el-dialog>
      </div>
    </el-dialog>
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
      emptyText: '请选择相似厂商',
      similarProductsPageSize: 5,
      similarProductsCurrentPage: 1,
      similarProductsTotalCount: 0,
      similarSupplierProducts: [],
      similarCurrentPage: 1,
      similarPageSize: 5,
      similarTotalCount: 5,
      similarSupplier: [],
      currentPageOffProduct: 1,
      pageSizeOffProduct: 10,
      totalCountOffProduct: 0,
      offProductList: [],
      offAuditTypeList: [],
      offAuditTypeLoading: false,
      addProductForm: {
        pr_na: null,
        fa_no: null,
        number: null,
        cl_na: null,
        fa_pr: null,
        in_en: null,
        ou_lo: null,
        ch_pa: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        bulk_stere: null,
        bulk_feet: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        ne_we: null,
        gr_we: null,
        remark: null
      },
      childrenLoading: false,
      childrenProductList: [],
      totalCountProduct: 0,
      currentPageProduct: 1,
      pageSizeProduct: 5,
      hallFormData: {
        hallName: null,
        ma_na: null,
        ma_ph_1: null,
        ma_ph_2: null,
        ma_ph_3: null,
        linkman: null,
        linkman1: null,
        linkman2: null,
        createdOn: null,
        verifyRemark: null
      },
      hallList: [],
      currentHall: null,
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      productList: [],
      formInline: {
        hallNumber: '',
        // 查询角色表单
        keyword: '',
        state: null,
        dateTile: null
      },
      productDialogOptions: {
        productDialogTitle: '审核',
        openProductDialog: false,
        shelfTitle: '上架产品',
        openShelfDialog: false,
        openShelfProductDialog: false
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    // 获取厂商下的产品列表
    async getSupplierProducts (number) {
      this.childrenLoading = true
      const fd = {
        supplierNumber: number,
        skipCount: this.similarProductsCurrentPage,
        maxResultCount: this.similarProductsPageSize
      }
      const res = await this.$http.post('/api/SearchBearProductPage', fd)
      console.log(res)
      this.childrenLoading = false
      if (res.data.result.code === 200) {
        this.similarSupplierProducts = res.data.result.item.items
        this.similarProductsTotalCount = res.data.result.item.totalCount
        if (this.similarProductsTotalCount === 0) this.emptyText = '暂无产品'
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 相似度产品下一页
    currentProductsChangeProduct (page) {
      this.similarProductsCurrentPage = page
      // this.getSimilarSupplierPage()
    },
    // 修改相似度产品页容量
    handleSizeChangeProducts (size) {
      this.similarProductsPageSize = size
      if (this.similarProductsCurrentPage * size > this.similarProductsTotalCount) return false
      // this.getSimilarSupplierPage()
    },
    // 相似度修改页容量
    handleSizeChangeSimilar (size) {
      this.similarPageSize = size
      if (this.similarCurrentPage * size > this.similarTotalCount) return false
      this.getSimilarSupplierPage()
    },
    // 相似度下一页
    changeSimilarCurrentPage (page) {
      this.similarCurrentPage = page
      this.getSimilarSupplierPage()
    },
    // 点击了某行
    rowClick (row) {
      this.getSupplierProducts(row.companyNumber)
    },
    // 获取相似厂商
    async getSimilarSupplierPage () {
      this.childrenLoading = true
      const fd = {
        hallNumber: this.hallFormData.hallNumber,
        client_nu: this.hallFormData.ma_nu,
        skipCount: this.similarCurrentPage,
        maxResultCount: this.similarPageSize
      }
      const res = await this.$http.post('/api/GetSimilarSupplierPage', fd)
      console.log(res)
      this.childrenLoading = false
      if (res.data.result.code === 200) {
        this.similarSupplier = res.data.result.item.items
        this.similarTotalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改当前 页容量
    handleSizeChangeOffProduct (pageSize) {
      this.pageSizeOffProduct = pageSize
      if (this.currentPageOffProduct * pageSize > this.totalCountOffProduct) return false
      this.getOffProductList()
    },
    // 切换分页
    currentChangeOffProduct (page) {
      this.currentPageOffProduct = page
      this.getOffProductList()
    },
    // 获取产品列表
    async getOffProductList () {
      this.childrenLoading = true
      const fd = {
        skipCount: this.currentPageOffProduct,
        maxResultCount: this.pageSizeOffProduct,
        hallNumber: this.hallFormData.hallNumber,
        ma_nu: this.hallFormData.ma_nu
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/ProductBasic_OffPage', fd)
      if (res.data.result.code === 200) {
        this.offProductList = res.data.result.item.items || []
        this.totalCountOffProduct = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.item.msg)
      }
      this.childrenLoading = false
    },
    // 选择拒绝原因
    async changeSelect (val) {
      if (val) {
        this.offAuditTypeLoading = true
        await this.subAddProduct(2)
        this.offAuditTypeLoading = false
      }
    },
    // 获取拒绝原因
    async getClientTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: 'offAuditType'
      })
      if (res.data.result.code === 200) {
        this.offAuditTypeList = res.data.result.item
      } else this.$message.error(res.data.result.msg)
    },
    // 删除产品
    async handleShelfDelete (row) {
      const res = await this.$http.post('/api/DeleteProductBasic_Off', { id: row.id })
      if (res.data.result.code === 200) {
        this.$message.success('删除产品成功')
        this.getChildrenProductList()
      } else {
        this.$message.success(res.data.result.msg)
      }
    },
    // 相似度确认上架
    async similarTheShelf (flag) {
      let productIds = [this.addProductForm.id]
      if (flag) productIds = this.$refs.multipleTable.selection.map(val => val.id)
      if (productIds.length === 0) {
        this.$message.error('请选择产品')
        return false
      }
      const res = await this.$http.post('/api/UpdateProductBasic_Off', { productIds: productIds })
      if (res.data.result.code === 200) {
        this.$message.success('上架成功')
        this.getOffProductList()
        this.productDialogOptions.openShelfProductDialog = false
      } else this.$message.error(res.data.result.msg)
    },
    // 确认上架
    async theShelf (flag) {
      let productIds = [this.addProductForm.id]
      if (flag) productIds = this.$refs.multipleTable.selection.map(val => val.id)
      if (productIds.length === 0) {
        this.$message.error('请选择产品')
        return false
      }
      const res = await this.$http.post('/api/UpdateProductBasic_Off', { productIds: productIds })
      if (res.data.result.code === 200) {
        this.$message.success('上架成功')
        this.getChildrenProductList()
        this.productDialogOptions.openShelfProductDialog = false
      } else this.$message.error(res.data.result.msg)
    },
    // 打开产品明细
    handleShelfEdit (row) {
      this.addProductForm = row
      this.productDialogOptions.openShelfProductDialog = true
    },
    // 下架产品分页
    currentChangeProduct (page) {
      this.currentPageProduct = page
      this.getChildrenProductList()
    },
    // 禁选
    checkSelectable (row) {
      return row.maKeyGuid && !row.isEntry
    },
    // 修改当前 页容量
    handleSizeChangeProduct (pageSize) {
      this.pageSizeProduct = pageSize
      if (this.currentPageProduct * pageSize > this.totalCountProduct) return false
      this.getChildrenProductList()
    },
    // 获取产品列表
    async getChildrenProductList () {
      this.childrenLoading = true
      const fd = {
        skipCount: this.currentPageProduct,
        maxResultCount: this.pageSizeProduct,
        hallNumber: this.currentHall[0].hallNumber,
        ma_nu: this.currentHall[0].ma_nu
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/ProductBasic_OffPage', fd)
      if (res.data.result.code === 200) {
        this.childrenProductList = res.data.result.item.items || []
        this.totalCountProduct = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.item.msg)
      }
      this.childrenLoading = false
      this.productDialogOptions.openShelfDialog = true
    },
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改当前页
    currentChange (page) {
      this.currentPage = page
      this.getManufacturerOffPage()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getManufacturerOffPage()
    },
    // 搜索
    search () {
      this.currentPage = 1
      this.getManufacturerOffPage()
    },
    // 获取下架厂商列表
    async getManufacturerOffPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.formInline.keyword,
        isExistCompany: this.formInline.isExistCompany,
        hallNumber: this.formInline.hallNumber,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/Manufacturer_OffPage', fd)
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items || []
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.item.msg)
      }
    },
    // 删除下架厂商
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteManufacturer_Off', { id: row.id })
      if (res.data.result.code === 200) {
        this.$message.success('删除厂商成功')
        this.getManufacturerOffPage()
      } else {
        this.$message.success(res.data.result.msg)
      }
    },
    // 打开审核厂商
    async handleEdit (row) {
      this.hallFormData = row
      this.currentPageOffProduct = 1
      this.similarCurrentPage = 1
      this.emptyText = '请选择厂商'
      await this.getSimilarSupplierPage()
      await this.getOffProductList()
      this.productDialogOptions.openProductDialog = true
    },
    // 打开上架产品
    handleProduct (row) {
      this.currentHall = [row]
      this.getChildrenProductList()
    },
    // 提交审核厂商
    async subAddProduct (flag) {
      this.hallFormData.isExistCompany = flag
      if (flag === 1) {
        this.hallFormData.verifyRemark = '审核通过'
      }
      const res = await this.$http.post('/api/UpdateManufacturer_Off', this.hallFormData)
      if (res.data.result.code === 200) {
        this.getManufacturerOffPage()
        this.$message.success('审核成功')
        this.productDialogOptions.openProductDialog = false
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取一年的时间
    /* 获取过去时间，并传值给现在时间 */
    getPassYearFormatDate () {
      var nowDate = new Date()
      var date = new Date(nowDate)
      date.setDate(date.getDate() - 365)
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var formatDate = year + seperator1 + month + seperator1 + strDate + 'T00:00:00'
      this.getNowFormatDate(formatDate)
    },
    /* 获取现在时间，并接受过去时间的值 */
    getNowFormatDate (formatDate) {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var nowData = year + seperator1 + month + seperator1 + strDate + 'T23:59:59'
      this.formInline.dateTile = [formatDate, nowData] // 默认赋值一年时间
    }
  },
  created () {
    this.getPassYearFormatDate()
    this.getOrgCompanyList()
    this.getClientTypeList()
  },
  mounted () {
    this.getManufacturerOffPage()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
  .el-form-item{
    @{deep} .el-form-item__content{
      width: 130px;
    }
    &:last-of-type{
      @{deep} .el-form-item__content{
      width: 70px;
    }
    }
  }
}
.addProductDialog {
  .el-image{
    width: 100px;
    height: 100px;
  }
  .formItems {
    display: flex;
    justify-content: space-between;
  }
  .productName {
    display: flex;
    @{deep} .el-form-item__content {
      flex: 1;
    }
  }
  .formItemSan {
    .el-input {
      width: 60px;
    }
    .laiyuan {
      width: 100%;
    }
    .itemX {
      margin-left: 10px;
    }
  }
}
.tableContent {
  margin-bottom: 20px;
  @{deep} .img {
    width: 50px;
    height: 50px;
  }
  img{
    width: 50px;
    height: 50px;
  }
}
.textareaLength {
  font-size: 12px;
  height: 30px;
  span {
    color: #ff6600;
  }
}
.productCu_de{
  @{deep} .el-input__inner {
    width: 70px;
  }
   @{deep} .el-select {
    width: 120px;
    .el-input__inner{
      width: 120px;
        text-align: center;
      }
    }
}
.productDialog {
    @{deep} .el-dialog {
      width: 40%;
    }
    @{deep} &.examine {
      .el-dialog{
        .el-dialog__body{
          padding-top: 0;
        }
      }
    }
  }
@media screen and (max-width: 1700px) {
  .productDialog {
    @{deep} .el-dialog {
      width: 50%;
    }
  }
}
@media screen and (max-width: 1400px) {
  .productDialog {
    @{deep} .el-dialog {
      width: 60%;
    }
  }
}
.conBox{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .left,.right{
      .el-form-item{
        margin: 5px 0;
      }
    }
    .left {
      width: 60%;
      .box-card{
        padding:5px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-sizing:border-box;
        .clearfix{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:10px 0;
          border-bottom:1px solid #aaa;
        }
      }
    }
    .right{
      width: 40%;
      // display: flex;
      // flex-direction: column;
      margin-left: 5px;
      .header{
        flex: 1;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }
      .footer{
        flex: 1;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }
    }
  }
</style>
