<template>
    <div class="translate-container">
        <div class="input-wp">
            <div>请输入需要生成的代码描述</div>
            <div class="quill-wp">
                <quill-editor
                    ref="myQuillEditor"
                    v-model="inputValue"
                    :options="editorOption"
                    @change="onEditorChange"
                >
                </quill-editor>
            </div>
            <div>
                <el-button type="primary" @click="annotationBtnClick">生成</el-button>
                <el-button type="primary" @click="clearBtnClick">清空</el-button>
            </div>

        </div>
        <div class="output-wp">
            <answerCode ref="answerCode" :permit="permit" :inputValue="quillTextValue"></answerCode>
        </div>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import answerCode from '@/components/answerCode.vue';
    export default {
        components: {
            quillEditor,
            answerCode
        },
        data() {
            return {
                inputValue: '',
                permit: '请给如下文字进行代码生成,markdown格式输出:\n',
                editorOption: {
                    //  富文本编辑器配置
                    modules: {
                    //工具栏定义的
                    // toolbar: toolbarOptions
                    },
                    //主题
                    theme: "",
                    placeholder: "..."
                },
                quillTextValue: ''
            }
        },
        methods: {
            annotationBtnClick() {
                if (!this.inputValue) {
                    this.$message.info(`请输入内容`);
                    return;
                }
                this.$refs.answerCode.getAnswerStream()
            },
            clearBtnClick() {
                this.inputValue = '';
            },
            onEditorChange({ quill, html, text }) {
                this.quillTextValue = text
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
}
</style>