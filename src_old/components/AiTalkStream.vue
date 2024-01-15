<template>
  <div class="talk-container" ref="talkContainer" v-loading="loading">
    <div class="header">
        <h2>amcoder-web <span class="innertest">(内部测试)</span></h2>
        <div>
            <el-checkbox v-model="context" style="margin-right: 20px;">参考上下文</el-checkbox>

            <!-- <el-checkbox v-model="qwen" disabled>Q模型</el-checkbox>
            <el-checkbox v-model="seek" >S</el-checkbox>
            <el-checkbox v-model="gpt4" >G模型</el-checkbox> -->

            <el-radio-group v-model="modelType">
              <el-radio label="qwen">Q模型</el-radio>
              <el-radio label="qwen2">Q2模型</el-radio>
              <el-radio label="gpt4">G模型</el-radio>
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
    <div class="main">
      <ul class="infinite-list" style="overflow: auto; width:100%" ref="talkMain">
        <li class="infinite-list-item">
          <div class="hisItem" v-for="(item,index) in historyList" :key="index">
            <div class="cus">
              <div>
                <div class="cus-time">{{ item.sub_time }}</div>
                <div class="que" v-html="item.input"></div>
              </div>
              <div class="customerNames"><i class="el-icon-s-custom"></i></div>
            </div>
            <div class="ans">
              <div class="serverNames">AI</div>
              <div class="servWp" >
                <div v-for="(subItem,subIndex) in item.data" :key="subIndex">
                  <div class="answer-wp">
                      <!-- {{ subItem.data }} -->
                      <!-- <div v-html="subItem.data"></div> -->
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer" @mouseenter="showCopy(subItem.f_id)" @mouseleave="showCopy('')">
                        <!-- <vue-markdown :source="subItem.data"></vue-markdown> -->
                        <div class="markdown-body" v-html="subItem.data"></div>
                        <div class="answer-tips">由{{answerSupport(subItem.type)}}模型生成，仅供参考</div>
                        <div class="copy-wp" :class="{'isShow':subItem.f_id===currentItemIndex}">
                          <i class="el-icon-document-copy custom-icon" v-if="!copySuccess" @click="copyTextToEditor(subItem)"></i>
                          <i class="el-icon-check custom-icon " v-else></i>
                          <i class="iconfont icon-good-fill custom-icon" v-if="subItem.up" @click="isGoodIdea(subItem,0, 0)"></i>
                          <i class="iconfont icon-good custom-icon" v-else @click="isGoodIdea(subItem,1, 0)"></i>
                          <i class="iconfont icon-bad-fill custom-icon" v-if="subItem.down" @click="isGoodIdea(subItem,0,0)"></i>
                          <i class="iconfont icon-bad custom-icon" v-else @click="isGoodIdea(subItem,0,1)"></i>
                        </div>
                      </div>
                  </div>
                  <!-- <div class="answer-wp" v-if="subItem.type === 'dk'">
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer">
                        <div class="markdown-body" v-html="subItem.data"></div>
                        <div class="answer-tips">由S模型生成，仅供参考</div>
                      </div>
                  </div> -->
                  <!-- <div class="answer-wp" v-if="subItem.type === 'gpt'">
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer" @mouseenter="showCopy(subItem.f_id)" @mouseleave="showCopy('')">
                        <div class="markdown-body" v-html="subItem.data"></div>
                        <div class="answer-tips">由G模型生成，仅供参考</div>
                        <div class="copy-wp" :class="{'isShow':subItem.f_id===currentItemIndex}">
                          <i class="el-icon-document-copy custom-icon" v-if="!copySuccess" @click="copyTextToEditor(subItem)"></i>
                          <i class="el-icon-check custom-icon " v-else></i>
                          <i class="iconfont icon-good-fill custom-icon" v-if="subItem.up" @click="isGoodIdea(subItem,0, 0)"></i>
                          <i class="iconfont icon-good custom-icon" v-else @click="isGoodIdea(subItem,1, 0)"></i>
                          <i class="iconfont icon-bad-fill custom-icon" v-if="subItem.down" @click="isGoodIdea(subItem,0,0)"></i>
                          <i class="iconfont icon-bad custom-icon" v-else @click="isGoodIdea(subItem,0,1)"></i>
                        </div>
                      </div>
                  </div> -->
                  <!-- <div class="copy-wp" :class="{'isShow':index===currentItemIndex}" @click="copyTextToEditor(item)">
                    <i class="el-icon-document-copy" style="color:#007aff;font-size: 30px;" v-if="!copySuccess"></i>
                    <i class="el-icon-check" style="color:#007aff;font-size: 30px;" v-else></i>
                  </div> -->
                </div>  
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="quick-zone">
        <div class="send-item" v-for="(item,index) in quickZoneDate" :key="index">
          <div style="width: 100%; border: 1px solid #e6e6e6; border-radius: 3px;">
            <quill-editor
              v-model="item.value"
              :options="editorOption"
            >
            </quill-editor>
          </div>
          <el-button type="primary" @click="sendQuickValue(item)" class="send-btn" size="mini">插入</el-button>
        </div>
        <div><el-button type="primary" icon="el-icon-circle-plus-outline" @click="addQuickZoneDate" size="mini"></el-button></div>
      </div>
    </div>
    <div class="footer">
      <div class="ask-wp">
        <div class="ask-input">
          <!-- <el-input
            clearable
            placeholder="..."
            v-model="inputSearchValue"
            @keyup.enter.native="searchBtnClick"
          >
          </el-input> -->
          <quill-editor
            ref="myQuillEditor"
            v-model="inputSearchValue"
            :options="editorOption"
          >
          </quill-editor>
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
  
import { marked } from 'marked'
import hljs from 'highlight.js' // 代码块高亮
import 'highlight.js/styles/github.css' // 代码块高亮样式
// import "highlight.js/styles/monokai-sublime.css";
// import 'github-markdown-css' // 
import { htmlToText } from 'html-to-text'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import "@/assets/font/iconfont.css"
// import VueMarkdown from 'vue-markdown'
import { getAnswer, getHistoryList, isLike, addHistoryList } from "@/api";
import {getTime} from '@/utils/util'
import { mapState } from "vuex";
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default {
  components: {
    // VueMarkdown
    quillEditor,
  },
  data() {
    return {
      inputSearchValue: ``,
      loading: false,
      historyList: [],
      qwen: true,
      seek: false,
      gpt4: false,
      //参考上下文
      context:false,
      currentItemIndex: "",
      createTime: "",
      copySuccess: false,
      // modelTypeDate: [
      //   {
      //     value: 'qwen',
      //     label: 'Q模型'
      //   },
      //   {
      //     value: 'qwen2',
      //     label: 'Q2模型'
      //   },
      //   {
      //     value: 'gpt4',
      //     label: 'G模型'
      //   },
      // ],
      modelType: 'qwen',
      // 快捷区
      quickZoneDate: [
        {
          // value: "js写一个防抖函数markdown格式",
          value: "",
        }
      ],
      editorOption: {
        //  富文本编辑器配置
        modules: {
          //工具栏定义的
          // toolbar: toolbarOptions
          keyboard: {
            bindings: {
              shift_enter: {
                  key: 13,
                  shiftKey: true,
                  handler: (range, ctx) => {
                    this.searchBtnClick()
                    // this.$refs.myQuillEditor.quill.insertText(range.index, '\n');
                  }
              },
              // enter: {
              //     key: 13,
              //     handler: () => { // submit form }
              //       this.$emit('searchBtnClick')
              //     }
              // }
            }
          }
        },
        //主题
        theme: "",
        placeholder: "..."
      }
    };
  },
  watch: {
    quickZoneDate: {
      handler() {
        localStorage.setItem("quickZoneDate", JSON.stringify(this.quickZoneDate))
      },
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.initMarkdown()
    })
  },
  mounted() {
    this.getHistoryList();
    setTimeout(() => {
      this.addCopyBtnToCode()
      this.scroll()
    }, 300)
  },
  computed: {
    ...mapState({
      userName: state => state.userName
    })
  },
  methods: {
    initMarkdown() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
          return hljs.highlightAuto(code).value;
        }
      });
    },
    getHistoryList() {
      let params={
        user: this.userName
      }
      this.loading = true
      getHistoryList(params).then((res) => {
        this.loading = false
        if(res.code === 200) {
          for (let i = 0; i < res.data.length; i++) {
          //  for (let j = 0; j < res.data[i].data.length; j++) {
            if(res.data[i].data[0].data) {
              res.data[i].data[0].data = marked.parse(res.data[i].data[0].data)
            }
          //  }
          }
          this.historyList = res.data
        }
      }).catch(() => {
        this.loading = false
      })
    },
    showCopy(id) {
      if(id) {
        this.currentItemIndex = id
      } else {
        this.currentItemIndex = ''
      }
    },
    // 快捷区域的发送
    sendQuickValue(item) {
      this.inputSearchValue = item.value + '\n' + this.inputSearchValue
      this.searchBtnClick()
    },
    addQuickZoneDate() {
      this.quickZoneDate.push({
        value: "",
      })
    },
    searchBtnClick() {
      if (!this.inputSearchValue) {
        this.$message.info(`请输入搜索内容`);
        return;
      }
      if(this.modelType === 'gpt4') {
        this.getAnswer()
        return
      } else {
        this.getAnswerStream()
      }
    },
    getAnswerStream() {
      let value = ''
      let newValue = ''
      this.historyList.push({
        input: this.inputSearchValue,
        sub_time: this.createTime,
        data: [{
              data: '',
              type: this.modelType,
              ctime: '',
              f_id: 0,
              up: 0,
              down: 0
        }]
      })
      let that = this
      let qw = that.historyList[that.historyList.length - 1]

      this.createTime = getTime()
      const formData = new FormData()
      formData.append('user', this.userName)
      formData.append('input', this.inputSearchValue)
      formData.append('sub_time', this.createTime)
      formData.append('pre_type', this.context ? "1" : "0") //参考上下文
      if(this.modelType === 'qwen') {
        formData.append('type', "qs")

        const controller = new AbortController()
        const signal = controller.signal
        fetchEventSource('https://www.500jf.com/amcoder/qa', {
            method: 'POST',
            openWhenHidden: true,
            headers: {
                'ck': localStorage.getItem('token'),
                // 'Content-Type': 'text/event-stream',
                // 'Connection': 'keep-alive',
                // 'Cache-Control': 'no-cache',
                // 'stream': true
            },
            signal,
            body: formData,
            onmessage(msg) {
              // console.log(msg);
              if(msg.data === '|down|') {
                controller.abort();
                that.inputSearchValue = ''
                qw.data[0].data =  marked.parse(newValue.split('<i class="el-icon-loading"></i>')[0])
                return
              }
              
              value += JSON.parse(msg.data).data
              const count = (value.match(/```/g) || []).length;

              if(count % 2 === 1){
                newValue = value + '\n\n```' + '\n <i class="el-icon-loading"></i>'
              } else {
                newValue = value + '<i class="el-icon-loading"></i>'
              }
              
              // console.log(newValue);
              qw.data[0].data =  marked.parse(newValue)
              qw.data[0].ctime = JSON.parse(msg.data).ctime
              qw.data[0].f_id = JSON.parse(msg.data).f_id

              that.scroll()
            },
            onclose() {
              controller.abort()
              that.inputSearchValue = ''
              qw.data[0].data =  marked.parse(newValue.split('<i class="el-icon-loading"></i>')[0])
              let params = {
                data: qw.data[0].data,
                id: qw.data[0].f_id
              } 
              if(qw.data[0].data !== null || qw.data[0].data !== "null") {
                addHistoryList(params).then((res) => {
                  console.log(res);
                })
              }
              that.$nextTick( () => {
                that.addCopyBtnToCode()
              })
            },
            onerror(err){
              that.loading = false
              that.historyList.pop()
              that.inputSearchValue = ''
              that.$message.error(err)
              throw err
            }
        })
      }
      ///////////////////////////////////////////

      // 方案二get
      // const controller = new AbortController()
      // const signal = controller.signal
      // this.loading = true
      // fetchEventSource('https://www.500jf.com/amcoder/ts?input=' + this.inputSearchValue, {
      //     method: 'get',
      //     headers: {
      //         'Content-Type': 'application/json; charset=utf-8',
      //         // 'Connection': 'keep-alive',
      //         // 'stream': true
      //     },
      //     signal,
      //     onmessage(msg) {
      //       that.loading = false
      //         if(msg.data === '|down|') {
      //           controller.abort();
      //           that.inputSearchValue = ''
      //           return
      //         }
      //         value += JSON.parse(msg.data).data.toString()
      //         if(value.includes('```') && !value.includes('\n```')){
      //           newValue = value + '\n```'
      //         } else {
      //           newValue = value
      //         }
      //         qw.data[0].data =  marked.parse(newValue)
              
      //         that.scroll()
      //         that.$nextTick( () => {
      //           that.addCopyBtnToCode()
      //         })
      //     },
      //     onclose() {
      //       controller.abort() //关闭连接
      //     },
      //     onerror(err){
      //       that.loading = false
      //       that.historyList.pop()
      //       that.inputSearchValue = ''
      //       that.$message.error(err)
      //       throw err
      //     }
      // });
      /////////////////////////////////////////////////////

    },
    getAnswer() {
      // console.log(this.$refs.myQuillEditor.quill.getText());
      this.createTime = getTime()
      let params = {
        user: this.userName,
        input: this.inputSearchValue,
        sub_time: this.createTime,
        pre_type: this.context ? "1" : "0",
        type: "gpt"
      }
      this.loading = true
      getAnswer(params).then((res) => {
        this.loading = false
        if (res.code === 200) {
          console.log(res);
          // this.pushToHistory(this.inputSearchValue, res)
        }
      }).catch(() => {
        this.loading = false
        // window.location.reload()
      })
    },
    pushToHistory(que, answer) {
      let queNew = marked.parse(que)
      this.historyList.push({
        input: queNew,
        sub_time: this.createTime,
        data: [{
          data: marked.parse(answer.data),
          type: this.modelType,
          ctime: answer.ctime,
          f_id: answer.f_id,
          up: answer.up,
          down: answer.down
        }]
      })
      this.inputSearchValue = ""
      this.scroll()
      this.$nextTick( () => {
        this.addCopyBtnToCode()
      })
    },
    scroll() {
      let scrollHeight = this.$refs.talkMain.scrollHeight;
      let offsetHeight = this.$refs.talkMain.offsetHeight;
      this.$nextTick(() => {
        this.$refs.talkMain.scrollTo(0, scrollHeight + offsetHeight);
      });
    },
    copyTextToEditor(item) {
      let value = ""
      if( typeof item.type === "string") {
        value = htmlToText(item.data)
      } else {
        let arr = item.data
        for(let i = 0; i < arr.length; i++) {
          value += htmlToText(arr[i].data) + "\n\n"
        }
      }
      navigator.clipboard.writeText(value);
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 1000);
    },
    isGoodIdea(item,goodIdea,badIdea) {
      let params = {
        f_id: item.f_id,
        up: goodIdea,
        down: badIdea,
      }
      isLike(params).then(res => {
        if(res.code === 200) {
          if (goodIdea) {
            this.renderIdea(item,goodIdea,badIdea)
          } else {
            this.renderIdea(item,0,badIdea)
          }
          if (badIdea) {
            this.renderIdea(item,goodIdea,badIdea)
          } else {
            this.renderIdea(item,goodIdea,0)
          }
          
        }
      })
    },
    renderIdea(item,goodIdea,badIdea) {
      let list = this.historyList
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].data.length; j++) {
          if(list[i].data[j].f_id === item.f_id) {
            list[i].data[j].up = goodIdea
            list[i].data[j].down = badIdea
          }
        }
      }
    },
    addCopyBtnToCode() {
      const codeElements = document.querySelectorAll('pre code');
      for (let i = 0; i < codeElements.length; i++) {
        const codeElement = codeElements[i];
        const lang = codeElements[i].getAttribute('class').split("-")[1];
        // 创建复制按钮元素
        const copyWp = document.createElement('div');
        copyWp.classList.add('copy-code-wp');
        const langSpan = document.createElement('span');
        langSpan.textContent = lang;
        const copyButton = document.createElement('span');
        copyButton.textContent = '复制';
        copyWp.appendChild(langSpan);
        copyWp.appendChild(copyButton);
        copyButton.classList.add('copy-code-button');
        copyButton.addEventListener('click', function() {
          // 复制代码行到剪贴板
          navigator.clipboard.writeText(codeElement.innerText).then(function() {
            copyButton.textContent = '复制成功';
            setTimeout(() => {
              copyButton.textContent = '复制';
            }, 500);
          }, function(err) {
            console.error('Failed to copy to clipboard: ', err);
          });
        });
        // 将复制按钮添加到code元素的右侧
        if(!codeElement.getAttribute('addCopyBtn')) {
          codeElement.parentNode.insertBefore(copyWp, codeElement);
          codeElement.setAttribute('addCopyBtn', true)
        }
      }
    },
    answerSupport(val) {
      let result 
      if(val === 'qs') {
        result = 'Q'
      } else if(val === 'qs2') {
        result = 'Q2'
      } else {
        result = 'G'
      }
      return result
    }
  },
};
</script>
  
  <style lang="less" scoped>
  
.talk-container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  // width: 600px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0 auto;
  padding: 0 0 0 30px;
  .header {
    height: 50px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    h2 {
      display: flex;
      align-items: center;
    }
  }
  .quick-zone {
      width: 20%;
      flex: none;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 5px;
      margin: 3px;
      overflow: auto;
    }
  .send-item {
    display: flex;
    margin: 10px 0;
    .send-btn {
      margin-left: 5px;
    }
    ::v-deep .ql-editor {
      padding: 7px 5px;
    }
    .el-button--mini {
      padding: 7px 5px;
    }
  }
  .innertest {
    font-size: 14px;
    margin-left: 5px;
  }
  .footer {
    width: 100%;
    // position: absolute;
    // left: 0px;
    // bottom: 16px;
    // flex: none;
  }
  .ask-wp {
    width: 85%;
    margin: 0 auto;
    border-radius: 20px;
    border: 2px solid rgb(0, 122, 255);
    display: flex;
    background: #fff;
    .ask-input {
      width: 90%;
      max-height: 120px;
      overflow-y: auto;
      // .el-input {
      //   margin-left: 10px;
      // }
      // ::v-deep .el-input__inner {
      //   border: 1px solid transparent;
      // }
    }
    .ask-btn {
      width: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .main {
    flex: 1;
    overflow: auto;
    display: flex;
  }
}
.hisItem {
  width: 85%;
  height: auto;
  font-size: 16px;
  margin: 0 auto 10px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #000;
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
  margin-bottom: 26px;
  .ans-time {
    font-size: 12px;
    color: #ccc;
    text-align: left;
  }
  .answer-tips {
    font-size: 12px;
    color: #ccc;
    text-align: left;
    padding-top:6px;
    border-top: 1px dashed #ccc;
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
    position: relative;
    ::v-deep p {
      line-height: 28px;
    }
  }

  .servWp {
    position: relative;
    width: 100%;
  }

  .copy-wp {
    display: none;
    position: absolute;
    bottom: 2px;
    right: 2px;
    cursor: pointer;
    background: #fff;
    border-radius: 15px;
    padding: 8px;
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
.custom-icon {
  color:#007aff;
  font-size: 30px;
  cursor: pointer;
  margin: 0 5px;
  &:hover {
    color: darken(#007aff, 20);
  }
}

::v-deep {
  pre {
    background-color: #f8f7f1;
    // color:#fff;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 12px;
    position: relative;
  }
  .copy-code-wp {
    display: flex;
    justify-content: space-between;
    opacity: 0.5;
  }
  .copy-code-button {
    //position: absolute;
    //right: 10px;
    //top: 10px;
    // color: #ccc;
    border-radius: 10px;
    padding: 3px 5px;
    cursor: pointer;
    &:hover {
      color: #fff;
      background: #ccc;
    }
  }
}
</style>
  