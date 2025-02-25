<template>
  <div class="local-answer-view">
    <div class="upload-wp">
      <el-upload
        class=""
        action="http://file_upload_app/upload_save"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :on-progress="handleProgress"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <div class="container">
      <div class="main">
        <ul class="infinite-list" style="overflow: auto" ref="talkMain">
          <li class="infinite-list-item">
            <div
              class="hisItem"
              v-for="(item, index) in historyList"
              :key="index"
            >
              <div class="cus">
                <div>
                  <div class="cus-time">{{ item.sub_time }}</div>
                  <div class="que" v-html="item.input"></div>
                </div>
                <div class="customerNames">
                  <i class="el-icon-s-custom"></i>
                </div>
              </div>
              <div class="ans">
                <div class="serverNames">AI</div>
                <div class="servWp">
                  <div v-for="(subItem, subIndex) in item.data" :key="subIndex">
                    <div class="answer-wp" v-if="subItem.type === 'qs'">
                      <!-- {{ subItem.data }} -->
                      <!-- <div v-html="subItem.data"></div> -->
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div
                        class="answer"
                        @mouseenter="showCopy(subItem.f_id)"
                        @mouseleave="showCopy('')"
                      >
                        <!-- <vue-markdown :source="subItem.data"></vue-markdown> -->
                        <div class="markdown-body" v-html="subItem.data"></div>
                        <div class="answer-tips">由Q模型生成，仅供参考</div>
                        <div
                          class="copy-wp"
                          :class="{ isShow: subItem.f_id === currentItemIndex }"
                        >
                          <i
                            class="el-icon-document-copy custom-icon"
                            v-if="!copySuccess"
                            @click="copyTextToEditor(subItem)"
                          ></i>
                          <i class="el-icon-check custom-icon" v-else></i>
                          <i
                            class="iconfont icon-good-fill custom-icon"
                            v-if="subItem.up"
                            @click="isGoodIdea(subItem, 0, 0)"
                          ></i>
                          <i
                            class="iconfont icon-good custom-icon"
                            v-else
                            @click="isGoodIdea(subItem, 1, 0)"
                          ></i>
                          <i
                            class="iconfont icon-bad-fill custom-icon"
                            v-if="subItem.down"
                            @click="isGoodIdea(subItem, 0, 0)"
                          ></i>
                          <i
                            class="iconfont icon-bad custom-icon"
                            v-else
                            @click="isGoodIdea(subItem, 0, 1)"
                          ></i>
                        </div>
                      </div>
                    </div>
                    <div class="answer-wp" v-if="subItem.type === 'dk'">
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div class="answer">
                        <!-- <vue-markdown :source="subItem.data"></vue-markdown> -->
                        <div class="markdown-body" v-html="subItem.data"></div>
                        <div class="answer-tips">由S模型生成，仅供参考</div>
                      </div>
                    </div>
                    <div class="answer-wp" v-if="subItem.type === 'gpt'">
                      <div class="ans-time">{{ subItem.ctime }}</div>
                      <div
                        class="answer"
                        @mouseenter="showCopy(subItem.f_id)"
                        @mouseleave="showCopy('')"
                      >
                        <!-- <vue-markdown :source="subItem.data"></vue-markdown> -->
                        <div class="markdown-body" v-html="subItem.data"></div>
                        <div class="answer-tips">由G模型生成，仅供参考</div>
                        <div
                          class="copy-wp"
                          :class="{ isShow: subItem.f_id === currentItemIndex }"
                        >
                          <i
                            class="el-icon-document-copy custom-icon"
                            v-if="!copySuccess"
                            @click="copyTextToEditor(subItem)"
                          ></i>
                          <i class="el-icon-check custom-icon" v-else></i>
                          <i
                            class="iconfont icon-good-fill custom-icon"
                            v-if="subItem.up"
                            @click="isGoodIdea(subItem, 0, 0)"
                          ></i>
                          <i
                            class="iconfont icon-good custom-icon"
                            v-else
                            @click="isGoodIdea(subItem, 1, 0)"
                          ></i>
                          <i
                            class="iconfont icon-bad-fill custom-icon"
                            v-if="subItem.down"
                            @click="isGoodIdea(subItem, 0, 0)"
                          ></i>
                          <i
                            class="iconfont icon-bad custom-icon"
                            v-else
                            @click="isGoodIdea(subItem, 0, 1)"
                          ></i>
                        </div>
                      </div>
                    </div>
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
        <!-- <div class="quick-zone">
                    <div class="send-item" v-for="(item,index) in quickZoneDate" :key="index">
                    <div style="width: 80%; border: 1px solid #e6e6e6; border-radius: 3px;">
                        <quill-editor
                        v-model="item.value"
                        :options="editorOption"
                        >
                        </quill-editor>
                    </div>
                    <el-button type="primary" @click="sendQuickValue(item)" class="send-btn" size="mini">发送</el-button>
                    </div>
                    <div><el-button type="primary" icon="el-icon-circle-plus-outline" @click="addQuickZoneDate" size="mini"></el-button></div>
                </div> -->
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
              >OK <i class="el-icon-top"></i
            ></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handlePreview(file) {
      console.log("preview", file);
    },
    handleRemove() {
      console.log("remove");
    },
    handleProgress(event, file, fileList) {
      console.log("progress", event, file, fileList);
    },
    beforeUpload(file) {
      console.log("beforeUpload", file);
    },
  },
};
</script>

<style lang="less" scoped>
.local-answer-view {
  display: flex;
  .upload-wp {
    margin: 20px;
  }
  .container {
    border: 1px solid #ccc;
    padding: 5px;
    margin-top: 20px;
    margin-right: 20px;
    border-radius: 8px;
    flex: 1;
  }
  .main {
    min-height: 400px;
    overflow: auto;
    display: flex;
  }
  .footer {
    width: 100%;
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
    margin: 10px;
    .send-btn {
      margin-left: 10px;
    }
  }
  .innertest {
    font-size: 14px;
    margin-left: 5px;
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
      padding-top: 6px;
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
    color: #007aff;
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
    .el-upload-dragger {
        width: 200px;
    }
  }
}
</style>