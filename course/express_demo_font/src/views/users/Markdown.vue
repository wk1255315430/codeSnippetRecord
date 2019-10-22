<template>
  <el-container>
    <Header />
    <el-main>
      <div class="markdown">
        <markdown-it-vue class="md-body" :content="content" />
        <div class="des">
          <p>
            版权声明：本文为博主原创文章，遵循
            <el-link
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
            >CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。</el-link>
          </p>
          <p>
            本文链接：
            <el-link
              href="https://blog.csdn.net/weixin_43728574/article/details/102574258"
            >https://blog.csdn.net/weixin_43728574/article/details/102574258"</el-link>
          </p>
        </div>
      </div>
        <p @click="getInitDataId">发送==》</p>
          <p @click="linkSocket">连接</p>
          <input type="text" v-model="socketId">
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import MarkdownItVue from "markdown-it-vue";
import Header from "@/components/Header.vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
export default {
  components: {
    MarkdownItVue,
    Header
  },
  data() {
    return {
      content: "",
      id: "",
      socketId: ""
    };
  },
  methods: {
    getInitData(id) {
      this.$axios
        .post("user/articleById", {
          id: id
        })
        .then(({ data: res }) => {
          if (res.status) {
            this.content = res.data.content;
          }
        });
    },
    linkSocket() {
      this.$socket.emit("login", {
        username: "username",
        password: "password"
      });
    },
    getInitDataId() {
      this.$socket.emit("sayTo", {
        toId: this.socketId
      });
    }
  },
  created() {
    let that = this;
    let id = this.$route.query.id;
    this.id = id;
    this.getInitData(id);
    //接收服务端的信息
    this.sockets.subscribe("relogin", data => {
      console.log(data, "relogin");
    });
    //从服务端获取当前socket连接的用户id
    this.sockets.subscribe("reId", data => {
      that.socketId = data.msg;
    });
    // this.sockets.unsubscribe('reId');
    // this.sockets.unsubscribe('relogin');
  }
};
</script>
<style lang="stylus" scoped>
.markdown
  padding: 6% 12%
</style>
