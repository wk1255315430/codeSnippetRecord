<template>
  <div id="article">
    <mavon-editor
      :ishljs="false"
      :toolbars="toolbars"
      v-model="value"
      ref="md"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    };
  },
  components: {
  },
  methods: {
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      const formdata = new FormData();
      formdata.append("file", $file);
      this.$axios({
        url: "/admin/upload/articleImg",
        method: "put",
        data: formdata,
        headers: { "Content-Type": "" }
      }).then(({ data: res }) => {
        if (res.status) {
          this.$refs.md.$img2Url(pos, "http://localhost:3000" + res.lgImg);
        }
      });
    },
    $imgDel(pos, $file) {
      let params = pos[0].split(":3000")[1];
      this.$axios
        .post("/admin/upload/delete", {
          src: params
        })
        .then(({ data: res }) => {
          console.log(res);
        });
    }
  }
};
</script>

<style lang="stylus" scoped></style>