<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/custom-notifications/">{{ $t('customNotifications') }}</router-link>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card class="card-back" :title="$t('fillIn')">
      <template slot="extra">
        <router-link to="/notifications/list">
          <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </router-link>
      </template>
      <template>
        <a-tabs
          v-if="this.$route.name !== 'CustomNotificationListCreate'"
          type="card"
          @change="callback"
          style="padding: 1px 8px"
        >
          <a-tab-pane key="1">
            <span slot="tab">
              <flag iso="ru" />
              Русский
            </span>
            <!-- <v-main ref="ruEditForm" lang="ru"></v-main> -->
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <flag iso="uz" />
              O'zbekcha
            </span>
            <!-- <v-main ref="uzEditForm" lang="uz"></v-main> -->
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab">
              <flag iso="gb" />
              English
            </span>
            <!-- <v-main ref="enEditForm" lang="en"></v-main> -->
          </a-tab-pane>
        </a-tabs>
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="notification"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <!-- Image -->
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item prop="image" :label="$t('logo_image')">
                  <a-upload
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
                    accept="image/*"
                    isClearable
                    :show-upload-list="false"
                    :action="`${VUE_APP_API_BASE_URL}image-upload`"
                    :before-upload="beforeUploadLogo"
                    @change="handleChangeLogoImage"
                  >
                    <img style="width: 200px" v-if="imageUrl && !loadingLogo" :src="imageUrl" alt="avatar" />
                    <div v-else>
                      <a-icon :type="loadingLogo ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">
                        {{ $t('upload') }}
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- Title RU -->
            <a-col v-if="tabKey === '1'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title_ru">
                <a-input :placeholder="$t('title')" v-model="notification.title_ru" />
              </a-form-model-item>
            </a-col>
            <!-- Title EN -->
            <a-col v-if="tabKey === '3'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input :placeholder="$t('title')" v-model="notification.title_en" />
              </a-form-model-item>
            </a-col>
            <!-- Title UZ -->
            <a-col v-if="tabKey === '2'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input :placeholder="$t('title')" v-model="notification.title_uz" />
              </a-form-model-item>
            </a-col>
            <!-- Send Time -->
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="date" :label="$t('data')" prop="send_time">
                <a-date-picker
                  v-model="notification.send_time"
                  :disabled-date="disabledStartDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="выбрать дату"
                  @openChange="handleStartOpenChange"
                />
              </a-form-model-item>
            </a-col>
            <!-- Text RU -->
            <a-col v-if="tabKey === '1'" :md="24" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('Text')" prop="text_ru">
                <a-textarea :placeholder="$t('Text')" v-model="notification.text_ru" />
              </a-form-model-item>
            </a-col>
            <!-- Text EN -->
            <a-col v-if="tabKey === '3'" :md="24" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('Text')" prop="text">
                <a-textarea :placeholder="$t('Text')" v-model="notification.text_en" />
              </a-form-model-item>
            </a-col>
            <!-- Text UZ -->
            <a-col v-if="tabKey === '2'" :md="24" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('Text')" prop="text">
                <a-textarea :placeholder="$t('Text')" v-model="notification.text_uz" />
              </a-form-model-item>
            </a-col>
            <!-- ACTIONS -->
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item>
                <a-button type="primary" html-type="submit" @click="onSubmit">
                  {{ $t('save') }}
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm">
                  {{ $t('reset') }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </template>
    </a-card>
  </div>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data() {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      notificationId: this.$route.params.id,
      tabKey: '1',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingLogo: false,
      notificationTypes: [],
      imageUrl: '',
      notification: {
        title_ru: '',
        title_en: '',
        title_uz: '',
        text_ru: '',
        text_en: '',
        text_uz: '',
        type: 2,
        image: '',
        send_time: '',
        status: '',
        is_custom: true
      },
      rules: {
        title_ru: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        text_ru: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        image: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        send_time: [{ required: true, message: this.$t('required'), trigger: 'submit' }]
      }
    }
  },
  mounted() {
    if (this.notificationId) this.getNotificationAttrs()
    console.log('name', this.$route.name)
  },
  methods: {
    callback(key) {
      console.log('key', key)
      this.tabKey = key
    },
    // Get notification attributes
    getNotificationAttrs() {
      this.$store.dispatch('getNotification', this.notificationId).then(response => {
        this.notification.title_ru = response.title_ru
        this.notification.title_en = response.title_en
        this.notification.title_uz = response.title_uz
        this.notification.text_ru = response.text_ru
        this.notification.text_en = response.text_en
        this.notification.text_uz = response.text_uz
        this.notification.send_time = response.send_time.substr(0, 23)
        this.imageUrl = response.image
        this.notification.image = response.image.split('/')[response.image.split('/').length - 1]
      })
    },
    // Submit form
    onSubmit(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const method = this.notificationId ? 'putNotification' : 'postNotification'
          const data = this.notificationId
            ? {
                ...this.notification,
                id: this.notificationId
              }
            : {
                title_ru: this.notification.title_ru,
                title_en: this.notification.title_ru,
                title_uz: this.notification.title_ru,
                text_ru: this.notification.text_ru,
                text_en: this.notification.text_ru,
                text_uz: this.notification.text_ru,
                send_time: this.notification.send_time,
                image: this.notification.image,
                type: this.notification.type,
                status: this.notification.status,
                is_custom: this.notification.is_custom,
              }
          this.$store
            .dispatch(method, data)
            .then(res => {
              this.$message.success('Уведомление отправлено')
              this.resetForm()
            })
            .catch(err => {
              if (err) {
                console.log(err)
                this.$message.error(err.response.data.error)
              }
            })
            .finally(() => {
              this.$router.push({ path: '/custom-notifications/list' })
            })
          console.log('valid')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // Reset form
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    beforeUploadLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('Image must smaller than 5MB!')
      }
      return isJpgOrPng && isLt2M
    },
    handleChangeLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loadingLogo = false
          this.notification.image = info.file.response.filename
        })
      }
    }
  }
}
</script>
<style>
.card-back .ant-card-head-wrapper {
  flex-direction: row-reverse;
  justify-content: flex-end;
  justify-items: flex-end;
}
@media (max-width: 760px) {
  .ant-form-item {
    margin: 0;
  }
  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
}
</style>
