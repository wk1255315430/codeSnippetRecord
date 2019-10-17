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
      content:''
    };
  }
};
</script>
<style lang="stylus" scoped>
.markdown
  padding: 6% 12%
</style>
