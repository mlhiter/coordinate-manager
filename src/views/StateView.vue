<template>
  <div>
    <!-- 数据表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        prop="userId"
        label="用户id"
        width="600"
      ></el-table-column>
      <el-table-column
        prop="userWxName"
        label="用户名"
        width="600"
      ></el-table-column>
      <el-table-column
        prop="userState"
        label="核酸状态"
        width=""
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="input">
            <el-button
              @click="handleEdit(scope.$index, scope.row)"
              type="primary"
              native-type="submit"
            >
              修改
            </el-button>
          </div>
        </template>
      </el-table-column>
      <!-- 空数据处理方式 -->
      <div slot="empty" style="text-align: left">
        <el-empty>
          <el-button type="primary" @click="upUserData">刷新数据</el-button>
        </el-empty>
      </div>
    </el-table>
    <el-dialog title="修改核酸状态" :visible.sync="dialogVisible">
      <h2>正在修改id为【{{ changeid }}】的用户危险等级</h2>
      <el-select v-model="changeState" placeholder="危险等级">
        <el-option label="0(安全)" :value="0"></el-option>
        <el-option label="1" :value="1"></el-option>
        <el-option label="2" :value="2"></el-option>
        <el-option label="3(确诊)" :value="3"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dangerconfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 底部页码部分 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalnum"
      style="float: right; margin-top: 15px"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'StateView',
  data() {
    return {
      pageSize: 10, //每页多少条
      currentPage: 1, // 当前页
      //列表数据
      tableData: [],
      //参数
      params: {},
      //当前更改的数据的id和危险等级
      changeid: -1,
      changeState: -1,
      //弹窗是否可见
      dialogVisible: false,
      //总数量
      totalnum: 0,
    }
  },
  mounted: function () {
    this.upUserData()
  },
  methods: {
    //刷新用户数据的函数
    upUserData() {
      // console.log('正在刷新数据......')
      // console.log(localStorage.getItem('token'))
      this.$axios({
        url: '/user/get/all/user',
        method: 'get',
        headers: {
          authToken: localStorage.getItem('token'),
        },
        params: {
          num: this.currentPage,
          size: this.pageSize,
        },
      })
        .then((resp) => {
          // console.log(resp.data)
          this.tableData = resp.data.data
          this.totalnum = parseInt(resp.data.msg)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val
      this.upUserData()
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.upUserData()
    },
    //操作核酸状态
    handleEdit(index, row) {
      console.log(index, row)
      this.changeid = row.userId
      this.changeState = row.userState
      this.dialogVisible = true
    },
    dangerconfirm() {
      //发送请求更新后端数据库
      this.$axios({
        url: '/judge/setacidstate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authToken': localStorage.getItem('token'),
        },
        data: {
          state: this.changeState,
          userid: this.changeid,
        },
        transformRequest: [
          function (dat) {
            let ret = ''
            for (let it in dat) {
              ret +=
                encodeURIComponent(it) + '=' + encodeURIComponent(dat[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'))
            return ret
          },
        ],
      })
        .then((res) => {
          console.log(res)
          this.$message.success('修改成功')
          this.upUserData()
          // setTimeout(() => {
          //   this.upUserData()
          // }, 500)
          this.dialogVisible = false
        })
        .catch((error) => {
          this.$message.error(error)
          this.dialogVisible = false
        })
    },
  },
}
</script>

<style>
.input {
  display: flex;
  flex-direction: row;
}
.reBtn {
  left: 20vh;
}
.pagination {
  margin: 0 auto;
  display: block;
}
</style>