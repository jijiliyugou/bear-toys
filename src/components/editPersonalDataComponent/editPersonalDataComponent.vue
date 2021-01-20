<template>
<div class="wrapBox">
    <!-- 修改个人资料 -->
        <div class="datas">
          <li>
            <div class="title">头像</div>
            <div class="text">
              <el-image
                :src="datas.userImage"
                class="myAvatar"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                >
                  {{ datas.linkman }}
                </div>
              </el-image>
              <input type="file" :accept="uploadAccept" class="upLoad" @change="fileChange" />
            </div>
          </li>
          <li>
            <div class="title">姓名</div>
            <div class="text">
              <input type="text" v-model="datas.linkman" />
            </div>
          </li>
          <li>
            <div class="title">性别</div>
            <div class="text">
              <select
                v-model="datas.sex"
                style="border:none;outline: none;cursor: pointer;"
              >
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>
          </li>
          <li>
            <div class="title">生日</div>
            <div class="text">
              <el-date-picker
                v-model="datas.birthday"
                type="date"
                placeholder="选择日期"
                size="mini"
                style="width:130px"
              ></el-date-picker>
            </div>
          </li>
          <li>
            <div class="title">电话</div>
            <div class="text">
              <input type="text" v-model="datas.phoneNumber" />
            </div>
          </li>
          <li>
            <div class="title">备注</div>
            <textarea
              rows="2"
              cols="15"
              v-model="datas.remark"
              style="border-color:#ccc;border-radius:5px;outline:none;overflow:auto;resize:none;"
              maxlength="500"
            ></textarea>
          </li>
        </div>
        <center class="send">
          <el-button class="sendInfo" round @click="editPersonal"
            >确认</el-button
          >
        </center>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    options: Object,
    default: {}
  },
  data () {
    return {
      file: null,
      datas: { ...this.options }
    }
  },
  methods: {
    // 确认修改个人信息
    async editPersonal () {
      const formData = JSON.parse(JSON.stringify(this.datas))
      if (this.file) {
        const fd = new FormData()
        fd.append('file', this.file)
        fd.append('BusinessType', 'Head')
        const res = await this.$http.post('/api/File/InsertPic', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.data.result.code === 200) {
          formData.userImage = res.data.result.object[0].filePath
        }
      }
      formData.birthday = new Date(this.datas.birthday)
        // formData.password = this.$md5(formData.phoneNumber+)
        .toLocaleString()
        .replace(/\//g, '-')
        .replace(/ [\s\S]+/g, '')
      const result = await this.$http.post('/api/UpdateOrgPersonnel', formData)
      if (result.data.result.code === 200) {
        this.$root.eventHub.$emit('UpdateOrgPersonnel')
        this.$message.success('修改成功')
      }
    },
    // 选择图片修改头像
    async fileChange (e) {
      this.file = e.target.files[0]
      const url = URL.createObjectURL(this.file)
      this.datas.userImage = url
    }
  },
  created () {

  },
  mounted () {
  },
  computed: {
    uploadAccept () {
      return this.globalJson.NoticeRestrictions[0].itemCode
    },
    ...mapState({
      globalJson: state => state.globalJson.Json
    })
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
    height: 827px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    position: relative;
    flex-direction: column;
    .datas {
        width: 100%;
        background-color: #fff;
        padding: 50px 10px;
        box-sizing: border-box;
        li {
          height: 50px;
          width: 100%;
          border: none;
          border-bottom: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .text {
            position: relative;
            .myAvatar {
              width: 42px;
              height: 42px;
              border-radius: 50%;
              background-color: #165af7;
              color: #fff;
            }
            input {
              border: none;
              width: 100px;
              text-align: right;
              outline: none;
            }
            .upLoad {
              border: 1px solid #000;
              cursor: pointer;
              width: 42px;
              height: 42px;
              opacity: 0;
              position: absolute;
              right: 0;
              top: 0;
              border-radius: 50%;
              cursor: pointer;
            }
          }
        }
    }
    .send {
      margin-top: 50px;
      .sendInfo {
        background-color: #165af7;
        color: #fff;
        width: 250px;
        .sendIcon {
          font-size: 16px;
          vertical-align: middle;
        }
      }
     }
}
</style>
