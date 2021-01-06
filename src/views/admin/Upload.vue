<template>
  <div class="Upload">
    <div class="clearfix content">
      <a-upload
        :file-list="fileList"
        @change="handleChange"
        @preview="handlePreview"
        accept="image/*"
        action="https://xiaotuwo.getharbours.com/api/files/upload"
        list-type="picture-card"
        name="file"
      >
        <a-icon type="plus"/>
        <div class="ant-upload-text">
          上传
        </div>
      </a-upload>
      <a-modal :footer="null" :visible="previewVisible" @cancel="handleCancel">
        <img :src="previewImage" alt="预览" style="width: 100%"/>
      </a-modal>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  },
  methods: {
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = file.response.url
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
      this.$message.success('复制图片链接成功')
      document.addEventListener('copy', function copyCall(e) {
        e.preventDefault()
        e.clipboardData.setData('text/html', file.preview)
        e.clipboardData.setData('text/plain', file.preview)
        document.removeEventListener('copy', copyCall)
      })
      document.execCommand('copy')
    },
    handleChange({fileList}) {
      this.fileList = fileList
    },
  },
}
</script>

<style lang="less" scoped>
.Upload{
  .content{
    margin: 30px 100px;
  }

  .ant-upload-select-picture-card i{
    font-size: 32px;
    color: #999999;
  }

  .ant-upload-select-picture-card .ant-upload-text{
    margin-top: 8px;
    color: #666666;
  }
}
</style>
