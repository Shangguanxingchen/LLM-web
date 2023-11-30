<template>
  <div class="login-wp">
    <div class="loginBox">
      <div class="login-title">
        <h2>登录</h2>
      </div>
      <div class="formBox">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="90px"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="ruleForm.userName"
              clearable
              style="width: 80%"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passWd">
            <el-input
              v-model="ruleForm.passWd"
              type="password"
              clearable
              style="width: 80%"
              @keyup.enter.native="submitForm"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btnWp">
              <el-button type="primary" @click="submitForm" :loading="loading"
                >点击登录</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { getToken } from "@/api";
import { mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      loading: false,
      ruleForm: {
        userName: ``,
        passWd: ``,
      },
      rules: {
        userName: [
          { required: true, message: `请输入用户名`, trigger: `blur` },
        ],
        passWd: [{ required: true, message: `请输入密码`, trigger: `blur` }],
      },
    };
  },
  created() {},
  mountd() {},
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loginFun();
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    loginFun() {
      let params = {
        name: this.ruleForm.userName,
        pwd: this.ruleForm.passWd,
      };
      this.loading = true;
      getToken(params)
        .then((res) => {
          this.loading = false;
          if (res.code === 200) {
            this.setToken(res.ck);
            this.setUserName(this.ruleForm.userName);
            this.$router.push(`/`);
          } else if (res.code === 201) {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    ...mapMutations([`setToken`, `setUserName`]),
  },
};
</script>
  
  <style lang="less" scoped>
.login-wp {
  // background-color: antiquewhite;
  width: 100%;
  height: 100%;
}
.login-title {
  text-align: center;
  margin-bottom: 45px;
}
.loginBox {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 50px 10px 30px 10px;
}
</style>