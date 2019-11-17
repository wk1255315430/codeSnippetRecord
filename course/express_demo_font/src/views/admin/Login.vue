<template>
  <div class="bg">
    <div class="form-box">
      <form action>
        <div class="title">欢迎登陆</div>
        <div class="body">
          <div class="form-control" :class="{error:!valid[0]}">
            <div class="add-on">
              <i class="el-icon-user"></i>
            </div>
            <input
              type="text"
              class="input-control"
              @blur="checkUnamePwd(0)"
              v-model="formData.uname"
              placeholder="请输入账户名"
            />
          </div>
          <div class="form-control" :class="{error:!valid[1]}">
            <div class="add-on">
              <i class="el-icon-key"></i>
            </div>
            <input
              type="password"
              @blur="checkUnamePwd(1)"
              class="input-control"
              v-model="formData.pwd"
              placeholder="请输入密码"
            />
          </div>
          <div class="form-control">
            <button class="btn" @click.enter="regHandle" type="button">登 录</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import regular from "@/utils/regular";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: ["redirect"],
  data() {
    return {
      formData: {
        uname: "",
        pwd: ""
      },
      valid: [true, true],
      regArrFlag: ["", ""]
    };
  },
  methods: {
    ...mapActions(["getToken"]),
    regHandle() {
      let regArrFlag = this.regArrFlag;
      for (let i = 0; i < regArrFlag.length; i++) {
        if (!regArrFlag[i]) return this.$set(this.valid, i, false);
      }
      this.getToken(this.formData).then(res => {
        if (res.status) {
          this.$message({
            message: res.data,
            type: "success",
            duration: 1000,
            onClose: () => {
              if (this.redirect) {
                this.$router.push(this.redirect);
                return;
              }
              this.$router.push("/admin");
            }
          });
        }
      });
      // .then(res => {
      //   // 储存token,uid,role (1-超级管理员，2-管理员，3-运营管理)
      //   sessionStorage.token = res.data.token;
      //   sessionStorage.role = res.data.role;
      //   // 跳转页面
      //   this.$message({
      //     message: res.msg,
      //     type: "success",
      //     duration: 1000,
      //     onClose: () => {
      //       if (this.redirect) {
      //         this.$router.push(this.redirect);
      //         return;
      //       }
      //       this.$router.push("/admin");
      //     }
      //   });
      // })
      // .catch(res => {
      //   this.$message.error(res.msg);
      // });
    },
    checkUnamePwd(index) {
      let regArr = [
        { type: "email", value: this.formData.uname, des: "用户名" },
        { type: "", value: this.formData.pwd, des: "密码" }
      ];
      let flag = regular.regexCheck(regArr[index]);
      if (flag !== true) {
        this.$set(this.valid, index, false);
        this.$set(this.regArrFlag, index, false);
        this.$message.error(flag);
        return;
      } else {
        this.$set(this.valid, index, true);
        this.$set(this.regArrFlag, index, true);
      }
    }
  }
};
</script>

<style scoped="scoped" lang="stylus">
.bg
  width: 100%
  height: 100vh
  background-color: #3A3A3E
  position: relative
  .form-box
    position: absolute
    right: 10rem
    top: 50%
    transform: translateY(-50%)
    background-color: white
    border-radius: 0.4rem
    font-size: 1.4rem
    width: 28%
    .title
      font-size: 1.6rem
      font-weight: bold
      color: #666
      padding: 1.5rem 2rem
      border-bottom: 1px solid #eee
    .body
      padding: 3rem 2rem
    .form-control
      padding-top: 2rem
      display: flex
      align-items: center
      &:first-child
        padding-top: 0
      .add-on
        height: 3.2rem
        width: 3.2rem
        border: 1px solid #eee
        border-right: 0
        text-align: center
        background-color: #f8f8f9
        color: #515a6e
        border-top-left-radius: 3px
        border-bottom-left-radius: 3px
        display: flex
        justify-content: center
        align-items: center
        i.fa
          line-height: 3.2rem
        .fa-mobile
          font-size: 2rem
      .input-control, .sex-box
        flex: 1
        padding: 0.4rem 0.7rem
        height: 2.4rem
        border: 1px solid #eee
        border-top-right-radius: 3px
        border-bottom-right-radius: 3px
      .sex-box
        display: flex
        align-items: center
        label
          display: flex
          align-items: center
          margin-right: 3rem
          i
            margin: 0 8px
      .btn
        flex: 1
        color: #fff
        background-color: #2d8cf0
        border: 1px solid #2d8cf0
        padding: 0.8rem 1.5rem
        font-size: 1.2rem
        border-radius: 4px
        outline: 0
    .error
      .input-control, .sex-box
        border-color: red
    .link-box
      padding-top: 2rem
      display: flex
      align-items: center
      justify-content: space-between
      font-size: 1.2rem
</style>
