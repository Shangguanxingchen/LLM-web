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
          <div class="hisItem" v-for="(item,index) in historyList" :key="index">
            <div class="cus">
              <div>
                <div class="cus-time">{{ item.sub_time }}</div>
                <div class="que">{{ item.input }}</div>
              </div>
              <div class="customerNames"><i class="el-icon-s-custom"></i></div>
            </div>
            <div class="ans">
              <div class="serverNames">AI</div>
              <div class="servWp" @mouseenter="showCopy(index)" @mouseleave="showCopy">
                <div v-for="(subItem,subIndex) in item.data" :key="subIndex">
                
                  <div class="answer-wp" v-if="subItem.type === 'qs'">
                      <!-- {{ subItem.data }} -->
                      <!-- <div v-html="subItem.data"></div> -->
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer">
                        <vue-markdown :source="subItem.data" :style="{ pre: { 'backgroun-color': '#000' } }"></vue-markdown>
                      </div>
                  </div>
                  <div class="answer-wp" v-if="subItem.type === 'dk'">
                      <!-- {{ subItem.data }} -->
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer">
                        <vue-markdown :source="subItem.data"></vue-markdown>
                      </div>
                  </div>
                  <div class="answer-wp" v-if="subItem.type === 'gpt'">
                      <!-- {{ subItem.data }} -->
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer">
                        <vue-markdown :source="subItem.data"></vue-markdown>
                      </div>
                  </div>
                  <div class="copy-wp" :class="{'isShow':index===currentItemIndex}" @click="copyTextToEditor(item)">
                    <!-- <span class="copy">copy</span> -->
                    <i class="el-icon-document-copy" style="color:#007aff" v-if="!copySuccess"></i>
                    <i class="el-icon-check" style="color:#007aff" v-else></i>
                  </div>
                </div>  
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
            clearable
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
  // import marked from 'marked';
  // import { quillEditor } from 'vue-quill-editor'
  // import "quill/dist/quill.core.css"; 
  // import "quill/dist/quill.snow.css"; 
  // import "quill/dist/quill.bubble.css"; 
import VueMarkdown from 'vue-markdown'
// import { getAnswer,getQwenAnswer,getSeekAnswer,getGpt4Answer, getHistoryList } from "@/api";
import { getAnswer, getHistoryList } from "@/api";
import {getTime} from '@/utils/util'
import { mapState } from "vuex";
export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      inputSearchValue: ``,
      loading: false,
      historyList: [
      // {
      //       "input": "hi",
      //       "data": [
      //           {
      //               "data": "\n你的问题似乎有些模糊，但是我会假设你想要一个基本的SQL SELECT查询。这是一个简单的例子：\n\n```sql\nSELECT column1, column2, ...\nFROM table_name;\n```\n\n在这个例子中，你需要将`column1, column2, ...`替换为你想要从表中选择的列的名称，将`table_name`替换为你想要从中选择的表的名称。\n\n如果你想要从多个表中选择数据，你可以使用JOIN语句。例如：\n\n```sql\nSELECT Orders.OrderID, Customers.CustomerName\nFROM Orders\nINNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;\n```\n\n在这个例子中，我们从`Orders`表和`Customers`表中选择`OrderID`和`CustomerName`列，其中`Orders`表的`CustomerID`列与`Customers`表的`CustomerID`列匹配。\n",
      //               "type": "qs",
      //               "ctime": "2023-11-30 09:47:02"
      //           }
      //       ],
      //       "sub_time": "2023-11-30 09:47:00"
      //   },
      ],
      qwen: true,
      seek: false,
      gpt4: false,
      currentItemIndex: "",
      createTime: "",
      copySuccess: false
    };
  },
  mounted() {
    this.getHistoryList();
    setTimeout(() => {
      this.scroll()
    }, 300)
  },
  computed: {
    ...mapState({
      userName: state => state.userName
    })
  },
  methods: {
    getHistoryList() {
      let params={
        user: this.userName
      }
      this.loading = true
      getHistoryList(params).then((res) => {
        this.loading = false
        if(res.code === 200) {
          // console.log(res.data);
          // for (let i = 0; i < res.data.length; i++) {
          //  for (let j = 0; j < res.data[i].data.length; j++) {
          //   res.data[i].data[j].data = marked(res.data[i].data[j].data)
          //  }
          // }
          this.historyList = res.data
          // console.log(this.historyList);
        }
      }).catch(() => {
        this.loading = false
      })
    },
    showCopy(index) {
      if(index || index === 0) {
        this.currentItemIndex = index
      } else {
        this.currentItemIndex = ''
      }
    },
    searchBtnClick() {
      if (!this.inputSearchValue) {
        this.$message.info(`请输入搜索内容`);
        return;
      }
      this.getAnswer()
    },
    getAnswer() {
      this.createTime = getTime()
      let params = {
        user: this.userName,
        input: this.inputSearchValue,
        sub_time: this.createTime
      }
      if(this.qwen && !this.seek && !this.gpt4) {
        params.type = "qs"
        this.loading = true
        getAnswer(params).then((res) => {
          if (res.code === 200) {
            this.loading = false
            this.pushToHistory(this.inputSearchValue, res)
          }
        }).catch(() => {
          this.loading = false
          window.location.reload()
        })
      } else if(!this.qwen && this.seek && !this.gpt4) {
        params.type = "dk"
        this.loading = true
        getAnswer(params).then((res) => {
          if (res.code === 200) {
            this.loading = false
            this.pushToHistory(this.inputSearchValue, undefined, res)
          }
        }).catch(() => {
          this.loading = false
          window.location.reload()
        })
      } else if(!this.qwen && !this.seek && this.gpt4) {
        params.type = "gpt"
        this.loading = true
        getAnswer(params).then((res) => {
          if (res.code === 200) {
            this.loading = false
            this.pushToHistory(this.inputSearchValue, undefined, undefined, res)
          }
        }).catch(() => {
          this.loading = false
          window.location.reload()
        })
      } else if(this.qwen && this.seek &&!this.gpt4) { 
        const qwen = new Promise((resolve, reject) => {
          params.type = "qs"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        const seek = new Promise((resolve, reject) => {
          params.type = "dk"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        }); 
        this.loading = true
        Promise.all([qwen, seek])
        .then(result => {
          this.loading = false
          this.pushToHistory(this.inputSearchValue, result[0], result[1])
        })
        .catch(() => {
          this.loading = false
          window.location.reload()
        });
      } else if(this.qwen && !this.seek && this.gpt4) {
        const qwen = new Promise((resolve, reject) => {
          params.type = "qs"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        const gpt = new Promise((resolve, reject) => {
          params.type = "gpt"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        this.loading = true
        Promise.all([qwen, gpt])
       .then(result => {
          this.loading = false
          this.pushToHistory(this.inputSearchValue, result[0], undefined, result[1])
        })
       .catch(() => {
        this.loading = false
        window.location.reload()
       });
      } else if(!this.qwen && this.seek && this.gpt4) {
        const seek = new Promise((resolve, reject) => {
          params.type = "dk"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        const gpt = new Promise((resolve, reject) => {
          params.type = "gpt"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        this.loading = true
        Promise.all([seek, gpt])
        .then(result => {
          this.loading = false
          this.pushToHistory(this.inputSearchValue, undefined, result[0], result[1])
        })
       .catch(() => {
        this.loading = false
        window.location.reload()
       });
      } else if(this.qwen && this.seek && this.gpt4) {
        const qwen = new Promise((resolve, reject) => {
          params.type = "qs"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        const seek = new Promise((resolve, reject) => {
          params.type = "dk"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        const gpt = new Promise((resolve, reject) => {
          params.type = "gpt"
          getAnswer(params).then((res) => {
            if (res.code === 200) {
              resolve(res);
            }
          }).catch((err) => {
            reject(err)
          })
        });
        this.loading = true
        Promise.all([qwen, seek, gpt])
       .then(result => {
          this.loading = false
          this.pushToHistory(this.inputSearchValue,result[0], result[1], result[2])
        })
        .catch(() => {
          this.loading = false
          window.location.reload()
        });
      }
    },
    pushToHistory(que, qw, seek, gpt) {
      if(qw && !seek && !gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: qw.data,
            type: "qs",
            ctime: qw.ctime
          }]
        })
      } else if (qw && seek &&!gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: qw.data,
            type: "qs",
            ctime: qw.ctime
          },
          {
            data: seek.data,
            type: "dk",
            ctime: seek.ctime
          }]
        })
      } else if (qw && seek && gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: qw.data,
            type: "qs",
            ctime: qw.ctime
          },
          {
            data: seek.data,
            type: "dk",
            ctime: seek.ctime
          },
          {
            data: gpt.data,
            type: "gpt",
            ctime: gpt.ctime
          }]
        })
      } else if (!qw && seek && !gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: seek.data,
            type: "dk",
            ctime: seek.ctime
          }]
        })
      } else if (!qw && seek && gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: seek.data,
            type: "dk",
            ctime: seek.ctime
          },
          {
            data: gpt.data,
            type: "gpt",
            ctime: gpt.ctime
          }]
        })
      } else if (!qw &&!seek && gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: gpt.data,
            type: "gpt",
            ctime: gpt.ctime
          }]
        })
      } else if (qw &&!seek && gpt) {
        this.historyList.push({
          input: que,
          sub_time: this.createTime,
          data: [{
            data: qw.data,
            type: "qs",
            ctime: qw.ctime
          },
          {
            data: gpt.data,
            type: "gpt",
            ctime: gpt.ctime
          }]
        })
      } 
      this.inputSearchValue = ""
      this.scroll()
    },
    scroll() {
      let scrollHeight = this.$refs.talkMain.scrollHeight;
      let offsetHeight = this.$refs.talkMain.offsetHeight;
      this.$nextTick(() => {
        this.$refs.talkMain.scrollTo(0, scrollHeight + offsetHeight);
      });
    },
    copyTextToEditor(item) {
      let arr = item.data
      let value = ""
      for(let i = 0; i < arr.length; i++) {
        value += arr[i].data + "\n\n"
      }
      navigator.clipboard.writeText(value);
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 1000);
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
  width: 1000px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0 auto;
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
    margin-bottom: 60px;
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
  .cus-time {
    font-size: 12px;
    color: #ccc;
    text-align: right;
  }
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
    // max-width: 80%;
    padding: 12px 16px;
    // margin-left: 20%;
  }
}
.answer-wp {
  margin-bottom: 10px;
  .ans-time {
    font-size: 12px;
    color: #ccc;
    text-align: left;
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
    border-radius: 15px;
  }

  .servWp {
    position: relative;
  }

  .copy-wp {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
  }
  .isShow {
    display: block;
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
::v-deep pre {
  background-color: #101012;
  padding: 10px;
  border-radius: 12px;
  color:#fff;
}
</style>
  