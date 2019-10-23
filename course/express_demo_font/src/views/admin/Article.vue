<template>
  <div id="article">
    <el-form ref="form" :model="form" :rules="rules" label-width="10%">
      <el-form-item label="斗十千" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="金樽清酒">
        <el-select
          v-model="form.cate_1st"
          placeholder="请选择"
          @change="cateChangeHandle_1st"
          prop="cate_1st"
        >
          <el-option
            v-for="item in dataCategory_lst"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="form.cate_2nd" placeholder="请选择" prop="cate_2nd">
          <el-option
            v-for="item in dataCategory_2st"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="欲渡" prop="link">
        <el-input v-model="form.link"></el-input>
      </el-form-item>
      <el-form-item label="黄河" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="行路难">
        <mavon-editor
          :ishljs="false"
          :toolbars="toolbars"
          v-model="form.content"
          ref="md"
          @imgAdd="$imgAdd"
          @imgDel="$imgDel"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">直挂</el-button>
        <el-button @click="resetForm('form')">归去</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      },
      rules: {
        title: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 0,
            max: 1000,
            message: "长度在 1 到 1000 个字符",
            trigger: "blur"
          }
        ]
      },
      dataCategory_lst: [{ id: 1, name: "停杯" }, { id: 2, name: "投箸" }],
      dataCategory_2st: [{ id: 1, name: "拔剑" }, { id: 2, name: "四顾" }],
      form: {
        cate_1st: "",
        cate_2nd: "",
        title: "",
        description: "",
        content: "",
        link: ""
      }
    };
  },
  components: {},
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
    },
    cateChangeHandle_1st() {
      if (this.form.cate_2nd) {
        this.form.cate_2nd = "";
      }
      // TODO:请求数据
      // this.Category_2st();
    },
    // TODO:提交重置
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  }
};
</script>

<style lang="stylus" scoped>
</style>