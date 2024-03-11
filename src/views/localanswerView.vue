<template>
    <div class="local-answer-view">
        <div style="width:50%;margin:20px auto;">
            <el-upload
                class=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :on-progress="handleProgress"
                drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            handlePreview(file) {
                console.log('preview',file);
            },
            handleRemove() {
                console.log('remove');
            },
            handleProgress(event, file, fileList) {
                console.log('progress', event, file, fileList);
            },
            beforeUpload(file) {
                console.log('beforeUpload', file);
            },
        }
    }
</script>

<style lang="less" scoped>
.local-answer-view {
}
</style>