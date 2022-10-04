<template>
  <el-container>
    <!-- 用户列表区域 -->
    <el-aside class="aside">
      <el-menu @select="handleSelect">
        <el-menu-item
          v-for="item in userlist"
          :key="item.userId"
          :index="String(item.userId)"
        >
          <el-avatar class="avatarclass">{{ item.userId }}</el-avatar>
          {{ item.userWxName }}
        </el-menu-item>
      </el-menu>
      <el-pagination
        class="pagination_userlist"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalPage"
      ></el-pagination>
    </el-aside>
    <el-container>
      <el-main id="messagecontain">
        <div v-for="item in messagelist" :key="item.id">
          <div v-if="item.senderId == selectid" class="messagereceive">
            <div class="receivebubble">
              {{ item.mess }}
            </div>
            <div class="receivetime">
              {{ item.time }}
            </div>
          </div>
          <div v-if="item.receiverId == selectid" class="messagesend">
            <div class="sendbubble">
              {{ item.mess }}
            </div>
            <div class="sendtime">
              {{ item.time }}
            </div>
          </div>
        </div>
        <div v-if="messagelist.length == 0">
          <el-empty description="暂无内容"></el-empty>
        </div>
      </el-main>
      <el-footer class="inputarea">
        <el-input
          class="message"
          v-model="content"
          clearable
          autosize
          type="textarea"
          v-on:keyup.enter="confirmsend"
        ></el-input>
        <el-button
          class="sendmessage"
          type="primary"
          plain
          @click="confirmsend"
        >
          发送
        </el-button>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'PrivateMessage',
  data() {
    return {
      userlist: [],
      messagelist: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      content: '',
      selectid: -1,
    }
  },
  mounted() {
    this.UPDuserlist()
    setInterval(() => {
      this.UPDmessagelist()
    }, 1000)
  },
  methods: {
    UPDuserlist() {
      this.$axios({
        url: '/user/get/all/user',
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authToken': localStorage.getItem('token'),
        },
        params: {
          num: this.currentPage,
          size: this.pageSize,
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
          console.log('服务器获取用户列表', res)
          this.userlist = res.data.data
          this.totalPage = parseInt(res.data.msg)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    handleCurrentChange(event) {
      this.currentPage = event
      this.UPDuserlist()
    },
    handleSelect(event) {
      this.selectid = event
      this.UPDmessagelist()
    },
    UPDmessagelist() {
      if (this.selectid < 0) return
      this.$axios({
        url: '/message/get',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authToken': localStorage.getItem('token'),
        },
        params: {
          oid: this.selectid,
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
          console.log('服务器获取消息列表', res)
          this.messagelist = res.data.data
          this.messagelist.reverse()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    confirmsend() {
      this.$axios({
        url: '/message/send',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authToken': localStorage.getItem('token'),
        },
        params: {
          rid: this.selectid,
          message: this.content,
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
        .then(() => {
          this.content = ''
          setTimeout(() => {
            var pt = this.$el.querySelector('#messagecontain')
            pt.scrollTop = pt.scrollHeight
            this.UPDmessagelist()
          }, 300)
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>
<style scoped>
.aside {
  margin-right: 0px;
}
.avatarclass {
  float: left;
  margin-top: 8px;
  background-color: rgb(123, 175, 214);
}
.pagination_userlist {
  position: absolute;
  left: 310px;
  top: 660px;
}
.message {
  display: inline-block;
  margin-right: 20px;
  width: 500px;
}
.sendmessage {
  display: inline-block;
}
.inputarea {
  padding: 10px;
  border-top: 2px solid #ddd;
}
.messagereceive {
  float: left;
  display: block;
  clear: both;
  margin-bottom: 20px;
  font-family: Tahoma, '仿宋';
}
.messagesend {
  float: right;
  display: block;
  clear: both;
  margin-bottom: 20px;
  font-family: Tahoma, '仿宋';
}
.receivebubble {
  background-color: #eee;
  min-height: 40px;
  max-width: 500px;
  padding: 15px;
  font-size: 25px;
  text-align: left;
  border-radius: 5px;
  word-break: break-all;
  word-wrap: break-word;
}
.sendbubble {
  background-color: #6d6;
  min-height: 40px;
  max-width: 500px;
  padding: 15px;
  font-size: 25px;
  text-align: left;
  border-radius: 5px;
  word-break: break-all;
  word-wrap: break-word;
}
.receivetime {
  float: left;
}
.sendtime {
  float: right;
}
</style>