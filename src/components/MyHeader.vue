<template>
  <div class="header">
    <h2>amcoder-web <span class="innertest">(内部测试)</span></h2>
    <div>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :default-active="activeMenu"
        router
        @select="handleSelect"
      >
        <el-menu-item index="index">代码问答</el-menu-item>
        <el-menu-item index="translate">代码翻译</el-menu-item>
        <el-menu-item index="annotation">代码注释</el-menu-item>
        <el-menu-item index="optimize">代码优化</el-menu-item>
        <el-menu-item index="generate">代码生成</el-menu-item>
        <el-menu-item index="localanswer">代码库问答</el-menu-item>
        <!-- <el-menu-item index="sql">nl2sql</el-menu-item> -->
      </el-menu>
    </div>
    <div class="btns">
      <div class="permit-btns" v-show="modelName === 'index'">
        <!-- <el-row>
          <el-button :class="{active:permit==='代码注释'}" plain size="mini" @click="permitClick('代码注释')">代码注释</el-button>
          <el-button :class="{active:permit==='代码优化'}" plain size="mini" @click="permitClick('代码优化')">代码优化</el-button>
          <el-button :class="{active:permit==='代码生成'}" plain size="mini" @click="permitClick('代码生成')">代码生成</el-button>
          <el-button type="primary" plain size="mini">nl2sql</el-button>
        </el-row> -->
        <!-- <div class="permit-btn" :class="{active:permit==='代码注释'}" @click="permitClick('代码注释')">代码注释</div>
        <div class="permit-btn" :class="{active:permit==='代码优化'}" @click="permitClick('代码优化')">代码优化</div>
        <div class="permit-btn" :class="{active:permit==='代码生成'}" @click="permitClick('代码生成')">代码生成</div> -->
      </div>
      <el-checkbox v-model="context" style="margin-left: 20px; margin-right: 20px" @change="contextChange"
        >参考上下文</el-checkbox
      >
      <!-- <el-checkbox v-model="qwen" disabled>Q模型</el-checkbox> -->
      <!-- <el-checkbox v-model="seek" >S</el-checkbox> -->
      <!-- <el-checkbox v-model="gpt4" >G模型</el-checkbox> -->
      <el-radio-group v-model="modelType" @input="modelTypeChange">
        <el-radio label="qs">Q模型</el-radio>
        <el-radio label="qs2">Q2模型</el-radio>
        <el-radio label="gpt">G模型</el-radio>
      </el-radio-group>
      <!-- <el-select v-model="modelType" placeholder="请选择">
            <el-option
                v-for="item in modelTypeDate"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data: () => {
    return {
      context: false,
      modelType: "qs",
    };
  },
  computed: {
    ...mapState(["activeMenu","permit"]),
    modelName() {
      return this.$route.name
    }
  },
  methods: {
    ...mapMutations(["setContext", "setModelType", "setActiveMenu", "setPermit"]),
    modelTypeChange (val) {
      this.setModelType(val);
    },
    contextChange (val) {
      this.setContext(val);
    },
    handleSelect(val) {
      this.setActiveMenu(val);
    },
    permitClick (val) {
      if(this.permit === val) {
        this.setPermit('');
        return
      } 
      this.setPermit(val);
    },
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  h2 {
    display: flex;
    align-items: center;
  }
  .btns {
    display: flex;
    align-items: center;
    .permit-btns {
      display: flex;
    }
    .permit-btn {
      font-size: 12px;
      border-radius: 3px;
      border: 1px solid #DCDFE6;
      padding: 7px 15px;
      cursor: pointer;
      color: #606266;
      margin: 0 5px;
      &:hover {
        color: rgb(0, 122, 255);
        border: 1px solid rgb(0, 122, 255);
      }
      &.active {
        color: #fff;
        border: 1px solid rgb(0, 122, 255);
        background: rgb(0, 122, 255);
      }
    }
  }
  
}
</style>