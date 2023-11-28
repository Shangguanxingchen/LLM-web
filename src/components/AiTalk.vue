<template>
  <div class="talk-container" ref="talkContainer" v-loading="loading">
    <div class="header">
        <h3>会话区</h3>
        <div>
            <el-checkbox v-model="qwen">Q</el-checkbox>
            <el-checkbox v-model="seek" >S</el-checkbox>
            <el-checkbox v-model="gpt4" >GPT4</el-checkbox>
        </div>
    </div>
    <div class="main" ref="talkMain">
      <ul class="infinite-list" style="overflow: auto">
        <li class="infinite-list-item">
          <div class="hisItem" v-if="inputSearchValue">
            <div class="cus">
              <div class="que">{{ inputSearchValue }}</div>
              <div class="customerNames"><i class="el-icon-s-custom"></i></div>
            </div>
            <div class="ans">
              <div class="serverNames">AI</div>
              <div class="servWp">
                <div class="answer" v-if="qwen && qwenAnswer">
                    {{ qwenAnswer }}
                </div>
                <div class="answer" v-if="seek && seekAnswer">
                    {{ seekAnswer }}
                </div>
                <div class="answer" v-if="gpt4 && gpt4Answer">
                    {{ gpt4Answer }}
                </div>
                <!-- <div class="copy-wp" @click="copyTextToEditor">
                  <span class="copy">copy</span>
                </div> -->
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="ask-wp">
        <div class="ask-input">
          <el-input
            placeholder="..."
            v-model="inputSearchValue"
            @keyup.enter.native="searchBtnClick"
          >
          </el-input>
        </div>
        <div class="ask-btn">
          <el-button
            round
            type="primary"
            :loading="loading"
            size="mini"
            :disabled="!inputSearchValue"
            @click="searchBtnClick"
            >OK <i class="el-icon-top"></i></el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { getChatgptAnswer,getQwenAnswer,getSeekAnswer,getGpt4Answer } from "@/api";
export default {
  data() {
    return {
      inputSearchValue: ``,
      loading: false,
    //   his: JSON.parse(localStorage.getItem(`his`)) || [],
      qwen: false,
      seek: false,
      gpt4: true,
      qwenAnswer: "",
      seekAnswer: "",
      gpt4Answer: "",
    };
  },
  mounted() {},
  computed: {},
  methods: {
    searchBtnClick() {
      if (!this.inputSearchValue) {
        this.$message.info(`请输入搜索内容`);
        return;
      }
    //   this.getChatgptAnswer();
    this.getAnswer()
    },
    getAnswer() {
        let searchValue = this.inputSearchValue
        if(this.qwen) {
            this.loading = true;
            const params = {
                text: searchValue,
            };
            getQwenAnswer(params).then((res) => {
                this.loading = false;
                if (res.code === 200) {
                    this.qwenAnswer = res.msg;
                }
            }).catch(() => {
                this.loading = false;
            })
        }
        if(this.seek) {
            this.loading = true;
            const params = {
                text: searchValue,
            };
            getSeekAnswer(params).then((res) => {
                this.loading = false;
                if (res.code === 200) {
                    this.seekAnswer = res.msg;
                }
            }).catch(() => {
                this.loading = false;
            })
        }
        if(this.gpt4) {
            this.loading = true;
            const params = {
                prompt: "",
                param_code: "13oHvdLbrT",
                uname: "admin",
                pwd: "admin123",
                text: searchValue,
            };
            getGpt4Answer(params).then((res) => {
                this.loading = false;
                if (res.code === 200) {
                    this.gpt4Answer = res.data;
                }
            }).catch(() => {
                this.loading = false;
            })
        }
    },
    getChatgptAnswer() {
      this.loading = true;
      const params = {
        text: this.inputSearchValue,
      };
      getChatgptAnswer(params)
        .then((res) => {
          this.loading = false;
          if (res.code === 200) {
            let obj = {
              question: this.inputSearchValue,
              answer: res.msg,
            };
            this.his.push(obj);
            this.inputSearchValue = ``;
            localStorage.setItem(`his`, JSON.stringify(this.his));
            let scrollHeight = this.$refs.talkMain.scrollHeight;
            let offsetHeight = this.$refs.talkMain.offsetHeight;
            this.$nextTick(() => {
              this.$refs.talkMain.scrollTo(0, scrollHeight + offsetHeight);
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    copyTextToEditor(answer) {
      navigator.clipboard.writeText(answer);
    },
  },
};
</script>
  
  <style lang="less" scoped>
.talk-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  width: 600px;
  border: 1px solid #ccc;
  border-radius: 5px;
  .header {
    height: 50px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }

  .footer {
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: 16px;
    flex: none;
  }
  .ask-wp {
    width: 95%;
    margin: 0 auto;
    border-radius: 20px;
    border: 2px solid rgb(0, 122, 255);
    display: flex;
    .ask-input {
      width: 80%;
      .el-input {
        margin-left: 10px;
      }
      ::v-deep .el-input__inner {
        border: 1px solid transparent;
      }
    }
    .ask-btn {
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .main {
    overflow: auto;
    margin-bottom: 43px;
    // height: calc(100% - 90px);
  }
}
.hisItem {
  width: 85%;
  height: auto;
  font-size: 16px;
  margin: 0 auto 10px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #ccc;
  .create-time {
    margin-bottom: 5px;
  }
}
.customerNames,
.serverNames {
  width: 32px;
  height: 32px;
  border-radius: 5px;
  background: rgb(162, 177, 249);
  color: #fff;
  // font-size: 12px;
  font-weight: bold;
  line-height: 32px;
  text-align: center;
  flex: none;
  margin: 0 5px;
  font-size: x-large;
}
.cus {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
  .que {
    background: rgb(0, 122, 255);
    color: #fff;
    //   background: #d4e0ff;
    text-align: left;
    height: auto;
    word-break: break-all;
    //   color: #333;
    font-size: 16px;
    border-radius: 15px;
    line-height: 18px;
    max-width: 80%;
    //   padding-left: 4%;
    //   padding: 5px;
    padding: 12px 16px;
    margin-left: 20%;
  }
}
.ans {
  display: flex;
  .answer {
    text-align: left;
    min-height: 50px;
    background: rgb(247, 247, 247);
    font-size: 16px;
    padding: 12px 16px;
    overflow: auto;
    word-wrap: break-word;
    margin-top: 10px;
    border-radius: 15px;
  }

  .copy-wp {
    margin-top: 2px;
  }
  .copy {
    cursor: pointer;
    color: #ccc;
    font-size: 12px;
    padding: 0px 5px;
    border-radius: 11px;
    border: 1px solid #ccc;
    &:hover {
      color: #fff;
      background: #ccc;
    }
  }
}

</style>
  