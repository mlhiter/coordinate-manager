<template>
  <div>
    <el-container style="height: 580px; border: 1px solid #eee">
      <!--侧边栏 -->
      <el-aside width="300px" style="background-color: rgb(255, 255, 255)">
        <!-- 消息列表导航 -->
        <el-menu default-active="2">
          <el-menu-item index="1" style="margin-top: 50px" @click="restoreNew">
            <i class="el-icon-s-promotion"></i>
            <el-badge :value="newData" class="item">消息列表</el-badge>
          </el-menu-item>
          <!-- 群发消息部分 -->
          <el-menu-item index="2" @click="dialogVisible = true">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">群发消息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 群发会话框 -->
      <el-dialog
        title="群发消息"
        :visible.sync="dialogVisible"
        width="50%"
        :modal="true"
      >
        <el-form>
          <el-form-item>
            <el-form-item label="消息内容">
              <el-input type="textarea" v-model="message"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 聊天模块 -->
      <el-container style="float: left">
        <private-message ref="messages"></private-message>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import PrivateMessage from "../components/PrivateMessage.vue";
export default {
  name: "MessagePart",
  components: { PrivateMessage },
  data() {
    return {
      //群发相关数据
      dialogVisible: false,
      message: "",
      newData: "",
    };
  },
  mounted: function () {
    this.isNew();
    setInterval(() => {
      this.isNew();
    }, 15000);
  },
  methods: {
    //提交群发消息的函数
    submit() {
      this.$axios({
        url: "/message/send/many",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authToken: localStorage.getItem("token"),
        },
        data: {
          message: this.message,
        },
        transformRequest: [
          function (dat) {
            let ret = "";
            for (let it in dat) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(dat[it]) +
                "&";
            }
            ret = ret.substring(0, ret.lastIndexOf("&"));
            return ret;
          },
        ],
      }).then(() => {
        setTimeout(() => {
          this.$refs.messages.UPDmessagelist();
        }, 300);
        this.dialogVisible = false;
        this.message = "";
      });
    },
    //判断是否有新消息
    isNew() {
      console.log("检查新消息");
      this.$axios({
        url: "/message/judge/if/new/all",
        method: "post",
        headers: {
          authToken: localStorage.getItem("token"),
        },
      })
        .then((resp) => {
          console.log(resp);
          if (resp.data.data == "有新消息") {
            this.newData = "new";
          } else {
            this.newData = "";
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //点击消息列表删掉new字符的函数
    restoreNew() {
      this.newData = "";
    },
  },
};
</script>

<style>
</style>