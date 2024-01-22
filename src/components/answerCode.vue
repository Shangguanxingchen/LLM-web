<template>
    <div class="answer-container">
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
</template>

<script>
    import { marked } from 'marked'
    import hljs from 'highlight.js' // 代码块高亮
    import 'highlight.js/styles/github.css' // 代码块高亮样式
    import { mapState } from "vuex";
    import { getTime } from '@/utils/util'
    import { fetchEventSource } from '@microsoft/fetch-event-source';
    export default {
        data() {
            return {
                outputValue: '',
                loading: false,
                copyText: '复制',
            }
        },
        props: {
            permit: {
                type: String,
                default: '',
                required: true,
            },
            inputValue: {
                type: String,
                default: '',
                required: true,
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
            getAnswerStream(){
                let that = this;
                let value = ''
                let newValue = ''
                this.loading = true
                const formData = new FormData()
                formData.append('user', this.userName)
                formData.append('pre_type', this.context ? "1" : "0") //参考上下文
                formData.append('type', this.modelType)
                formData.append('input', this.permit + this.inputValue)
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
.answer-container {
    width: 100%;
    height: 100%;
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
}
</style>