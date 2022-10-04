<template>
  <div class="main" id="maincon">
    <div class="contain_main">
      <div class="navigation_container">
        <!-- 标题 -->
        <el-card class="box-card">
          <i class="el-icon-cloudy" id="topico">&nbsp;&nbsp;管理后台</i>
        </el-card>
        <el-container height="66px" direction="horizontal" id="headmain">
          <!-- 导航栏 -->
          <el-menu
            :default-active="activeIndex"
            class="el-menu"
            mode="horizontal"
          >
            <el-menu-item class="blank"></el-menu-item>
            <el-menu-item index="1" @click="goto(1)" class="navigator">
              地点
            </el-menu-item>
            <el-menu-item index="2" @click="goto(2)" class="navigator">
              用户
            </el-menu-item>
            <el-menu-item index="3" @click="goto(3)" class="navigator">
              消息
            </el-menu-item>
            <el-menu-item index="4" @click="goto(4)" class="navigator">
              关于我们
            </el-menu-item>
            <el-menu-item index="5" @click="logout()" class="navigator">
              退出登录
            </el-menu-item>
          </el-menu>
        </el-container>
      </div>
      <!-- 内容栏：嵌套路由 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  data() {
    return {
      activeIndex: '1',
    }
  },
  methods: {
    // 退出登录的函数
    logout() {
      this.$confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.commit('updateToken', '')
          this.$message.info('成功退出登录')
          this.$router.push('/')
        })
        .catch(() => {})
    },
    // 导航栏导航函数
    goto(index) {
      if (index != this.activeIndex) {
        switch (index) {
          case 1:
            this.activeIndex = '1'
            this.$router.push('/manage/place')
            break
          case 2:
            this.activeIndex = '2'
            this.$router.push('/manage/state')
            break
          case 3:
            this.activeIndex = '3'
            this.$router.push('/manage/chat')
            break
          case 4:
            this.activeIndex = '4'
            this.$router.push('/manage/about')
            break
        }
      }
    },
  },
}
</script>
<style lang="scss">
#headmain {
  padding: 0px !important;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
}
.navigation_container {
  display: flex;
  flex-direction: row;
}
#topico {
  font-size: 23px;
  color: #fff;
}
.blank {
  width: 1px;
}
.navigator {
  width: 200px;
}
.box-card {
  background-color: rgb(48, 65, 86) !important;
  width: 295px;
  margin-right: 4px;
}
.usr {
  display: block;
  position: relative;
  margin-top: 13px;
  // left: 1400px;
  width: 75px;
  height: 53px;
  cursor: pointer;
}
</style>