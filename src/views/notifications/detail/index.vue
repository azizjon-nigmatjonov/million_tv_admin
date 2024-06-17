<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/notifications/">{{ $t('notifications') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
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
        <a-tabs v-if="this.$route.name !== 'TarifsCreate'" type="card" @change="callback" style="padding: 1px 8px">
          <a-tab-pane key="1">
            <span slot="tab">
              <flag iso="ru" />
              Русский
            </span>
            <!-- <v-main ref="ruEditForm" lang="ru"></v-main> -->
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <flag iso="gb" />
              English
            </span>
            <!-- <v-main ref="enEditForm" lang="en"></v-main> -->
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab">
              <flag iso="uz" />
              O'zbekcha
            </span>
            <!-- <v-main ref="uzEditForm" lang="uz"></v-main> -->
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
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input :placeholder="$t('title')" v-model="notification.title_ru" />
              </a-form-model-item>
            </a-col>
            <!-- Title EN -->
            <a-col v-if="tabKey === '2'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input :placeholder="$t('title')" v-model="notification.title_en" />
              </a-form-model-item>
            </a-col>
            <!-- Title UZ -->
            <a-col v-if="tabKey === '3'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="title" :label="$t('title')" prop="title">
                <a-input :placeholder="$t('title')" v-model="notification.title_uz" />
              </a-form-model-item>
            </a-col>
            <!-- Type -->
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="type" :label="$t('Type')" prop="type">
                <a-select v-model="notification.type" :placeholder="$t('Type')">
                  <a-select-option v-for="item in notificationTypes" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- Text RU -->
            <a-col v-if="tabKey === '1'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('Text')" prop="text">
                <a-textarea :placeholder="$t('Text')" v-model="notification.text_ru" />
              </a-form-model-item>
            </a-col>
            <!-- Text EN -->
            <a-col v-if="tabKey === '2'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('Text')" prop="text">
                <a-textarea :placeholder="$t('Text')" v-model="notification.text_en" />
              </a-form-model-item>
            </a-col>
            <!-- Text UZ -->
            <a-col v-if="tabKey === '3'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('Text')" prop="text">
                <a-textarea :placeholder="$t('Text')" v-model="notification.text_uz" />
              </a-form-model-item>
            </a-col>
            <!-- Submit -->
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
import moment from 'moment'
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
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      tabKey: '1',
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
        type: undefined,
        send_time: '',
        image: '',
        is_custom: false
      },
      rules: {
        title_ru: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        text_ru: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        type: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getNotificationTypes()
    if (this.notificationId) this.getNotificationAttrs()
  },
  methods: {
    callback(key) {
      this.tabKey = key
    },
    getNotificationTypes() {
      this.$store.dispatch('getNotificationTypes', { limit: 100 }).then(response => {
        this.notificationTypes = response.notification_types.filter(item => item.name !== 'Custom')
      })
    },
    getNotificationAttrs() {
      this.$store.dispatch('getNotification', this.notificationId).then(response => {
        this.notification.title_ru = response.title_ru
        this.notification.title_en = response.title_en
        this.notification.title_uz = response.title_uz
        this.notification.text_ru = response.text_ru
        this.notification.text_en = response.text_en
        this.notification.text_uz = response.text_uz
        this.notification.type = response.type
        this.notification.send_time = response.send_time
        this.imageUrl = response.image
        this.notification.image = response.image.split('/')[response.image.split('/').length - 1]
      })
    },
    onSubmit(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const method = this.notificationId ? 'putNotification' : 'postNotification'
          if (typeof this.notification.type === 'string') {
            this.notification.type = this.notificationTypes.find(item => item.name === this.notification.type).id
          }
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
                type: this.notification.type,
                image: this.notification.image,
                is_custom: this.notification.is_custom,
                send_time: moment().format('YYYY-MM-DD HH:mm:ss')
              }
          this.$store
            .dispatch(method, data)
            .then(res => {
              this.$router.go(-1)
            })
            .catch(err => {
              if (err) {
                console.log(err)
                this.$message.error(err.response.data.error)
              }
            })
          console.log('valid')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
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
