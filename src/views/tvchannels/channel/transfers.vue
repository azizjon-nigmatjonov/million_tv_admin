<template>
  <div>
    <a-row>
      <a-col :span="12" style="min-height: 400px">
        <a-col style="padding: 0 15px">
          <a-form-model-item :span="24" :label="$t('Зарубежный телеканалы')">
            <a-upload-dragger
              style="min-height: 500px"
              name="file"
              :multiple="false"
              :action="`${VUE_APP_API_BASE_URL}international-file-upload`"
              @change="handleChange"
            >
              <div class="special">
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="download">Загрузить XML файл для зарубежных телеканалы</p>
              </div>
            </a-upload-dragger>
          </a-form-model-item>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-col style="padding: 0 15px">
          <a-form-model-item :span="24" class="formHeight" :label="$t('Местных телеканалов')">
            <a-upload-dragger
              name="file"
              :multiple="false"
              :action="`${VUE_APP_API_BASE_URL}local-file-upload`"
              @change="handleChange"
            >
              <div class="special">
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="download">Загрузить XML файл местных телеканалов</p>
              </div>
            </a-upload-dragger>
          </a-form-model-item>
        </a-col>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL
    }
  },
  methods: {
    handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
}
</script>

<style scoped>
.special {
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.download {
  color: #666666;
  font-size: 14px;
  line-height: 22px;
}
</style>
