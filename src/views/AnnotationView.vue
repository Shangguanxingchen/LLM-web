<template>
    <div class="translate-container">
        <div class="input-wp">
            <div>输入需要注释的代码</div>
            <div class="quill-wp">
                <quill-editor
                    ref="myQuillEditor"
                    v-model="inputValue"
                    :options="editorOption"
                >
                </quill-editor>
            </div>
            <div>
                <el-button type="primary" @click="annotationBtnClick">开始注释</el-button>
                <el-button type="primary" @click="clearBtnClick">清空</el-button>
            </div>

        </div>
        <div class="output-wp">
            <div>
                <span>输出代码</span>
                <i class="el-icon-loading" v-show="loading"></i>
            </div>
            <div class="output-block">
                <!-- <quill-editor
                    ref="myQuillEditorOutput"
                    v-model="outputValue"
                    :options="editorOption"
                >
                </quill-editor> -->
                <div v-html="outputValue" ref="outputValue"></div>
            </div>
            <div>
                <el-button type="primary" @click="copyBtnClick">{{copyText}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { marked } from 'marked'
    import hljs from 'highlight.js' // 代码块高亮
    import 'highlight.js/styles/github.css' // 代码块高亮样式
    import { quillEditor } from 'vue-quill-editor'
    import { mapState,mapMutations } from "vuex";
    import { getTime } from '@/utils/util'
    import { fetchEventSource } from '@microsoft/fetch-event-source';
    export default {
        components: {
            quillEditor
        },
        data() {
            return {
                inputValue: '',
                outputValue: '',
                permit: '请给如下代码添加单行注释,markdown格式输出:\n',
                loading: false,
                copyText: '复制',
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
                        }
                    }
                    },
                    //主题
                    theme: "",
                    placeholder: "..."
                },
                
            }
        },
        computed: {
            ...mapState({
                userName: state => state.userName,
                modelType: state => state.modelType,
                context: state => state.context,
            }),
        },
        created() {
            this.$nextTick(() => {
                this.initMarkdown()
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
            annotationBtnClick() {
                if (!this.inputValue) {
                    this.$message.info(`请输入注释内容`);
                    return;
                }
                this.getAnswerStream()
            },
            getAnswerStream(){
                let that = this;
                let value = ''
                let newValue = ''
                this.loading = true
                const formData = new FormData()
                formData.append('user', this.userName)
                formData.append('pre_type', this.context ? "1" : "0") //参考上下文
                formData.append('type', this.modelType)
                formData.append('input', this.permit + this.$refs.myQuillEditor.quill.getText())
                formData.append('sub_time', getTime())
                const controller = new AbortController()
                const signal = controller.signal
                fetchEventSource(process.env.VUE_APP_API_URL + 'amcoder/qa', {
                    method: 'POST',
                    openWhenHidden: true,
                    headers: {
                        'ck': localStorage.getItem('token'),
                    },
                    signal,
                    body: formData,
                    onmessage(msg) {
                        // console.log(msg);
                        value += JSON.parse(msg.data).data
                        const count = (value.match(/```/g) || []).length;
                        if(count % 2 === 1){
                            newValue = value + '\n```'
                        } else {
                            newValue = value
                        }
                        that.outputValue = marked.parse(newValue)
                    },
                    onclose() {
                        that.loading = false
                        controller.abort()
                        that.outputValue =  marked.parse(newValue)
                    },
                    onerror(err){
                        that.loading = false
                        that.$message.error(err)
                        throw err
                    }
                })
            },
            clearBtnClick() {
                this.inputValue = '';
            },
            copyBtnClick() {
                if (this.outputValue) {
                    navigator.clipboard.writeText(this.$refs.outputValue.innerText);
                    this.copyText = '复制成功';
                    setTimeout(() => {
                        this.copyText = '复制';
                    }, 1000);
                } else {
                    this.$message.info('请先获取输出结果');
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.translate-container {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    justify-content: space-between;
    align-items: top;
    background-color: #f5f5f5;
    padding: 30px;
    .input-wp {
        width: 48%;
        height: 100%;
        text-align: left;
        .changelang-wp {
            display: flex;
        }
    }
    .output-wp {
        width: 48%;
        height: 100%;
        text-align: left;
    }
    .quill-wp {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff;
        margin-bottom: 20px;
        overflow: auto;
        overflow: auto;
        min-height: 80%;
        max-height: 88%;
    }
    .output-block {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        background-color: #f8f7f1;
        margin-bottom: 20px;
        overflow: auto;
        min-height: 80%;
        max-height: 88%;
    }
    .ml10 {
        margin-left: 10px;
    }
    ::v-deep {
        pre {
            // background-color: #f8f7f1;
            // padding: 10px;
            // border: 1px solid #ccc;
            // border-radius: 12px;
            // position: relative;
        }
    }
}
</style>