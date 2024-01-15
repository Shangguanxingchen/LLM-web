<template>
    <div class="translate-container">
        <div class="input-wp">
            <div>输入代码</div>
            <div class="quill-wp">
                <quill-editor
                    ref="myQuillEditor"
                    v-model="inputValue"
                    :options="editorOption"
                >
                </quill-editor>
            </div>
            <div>
                <div>翻译为</div>
                <div class="changelang-wp">
                    <el-select v-model="translateLang" placeholder="请选择">
                        <el-option
                            v-for="item in translateList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    <div class="ml10">
                        <el-button type="primary">翻译</el-button>
                    </div>
                </div>
            </div>

        </div>
        <div class="output-wp">
            <div>输出代码</div>
            <div class="quill-wp">
                <quill-editor
                    ref="myQuillEditorOutput"
                    v-model="outputValue"
                    :options="editorOption"
                >
                </quill-editor>
            </div>
        </div>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    export default {
        components: {
            quillEditor
        },
        data() {
            return {
                inputValue: '',
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
                translateList: [
                    { value: 'Python', label: 'Python' },
                    { value: 'C', label: 'C' },
                    { value: 'C++', label: 'C++' },
                    { value: 'Java', label: 'Java' },
                    { value: 'C#', label: 'C#' },
                    { value: 'JavaScript', label: 'JavaScript' },
                ],
                translateLang: '',
                outputValue: '',
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
        height: 60%;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff;
        margin-bottom: 20px;
    }
    .ml10 {
        margin-left: 10px;
    }
}
</style>