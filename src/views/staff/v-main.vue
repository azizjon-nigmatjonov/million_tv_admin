<template>
  <a-form-model
    @submit="onSubmit"
    ref="ruleForm"
    :model="actor"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-row>
      <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item :label="$t('first_name')" prop="first_name">
          <a-input v-model="actor.first_name" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item :label="$t('last_name')" prop="last_name">
          <a-input v-model="actor.last_name" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item :label="$t('position')" prop="position">
          <a-select
            :placeholder="$t('position')"
            mode="multiple"
            @change="onSelectChange"
            :filter-option="filterOption"
            v-model="actor.position"
          >
            <a-select-option v-for="actorPos in actorPositions" :key="actorPos.key" :value="actorPos.value">
              {{ $t(actorPos.key) }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item :label="$t('birthday')" prop="birthday">
            <a-date-picker
              v-model="actor.birth_date"
              :disabled-date="false"
              format="YYYY-MM-DD"
              placeholder="выбрать дату"
              @openChange="handleStartOpenChange"
              style="width: 100%"
            />
        </a-form-model-item>
      </a-col>
       <!-- <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item :label="$t('age')" prop="age">
          <a-input v-model="actor.age" />
        </a-form-model-item>
      </a-col> -->
      <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item label="Рост" prop="height">
          <a-input v-model="actor.height" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="8" style="padding: 0 15px">
        <a-form-model-item label="Вес" prop="width">
          <a-input v-model="actor.weight" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="24" style="padding: 0 15px">
        <a-form-model-item :label="$t('biography')" prop="biography">
          <a-textarea
            v-model="actor.biography"
            :placeholder="$t('biography')"
            :auto-size="{ minRows: 10, maxRows: 15 }"
          />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="4" style="padding: 0 15px">
        <a-form-model-item :label="$t('staff_image')" prop="photo">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="`${VUE_APP_API_BASE_URL}image-upload`"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                {{ $t('upload') }}
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import moment from 'moment'
import request from '@/utils/request'
import { mapActions } from 'vuex'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data() {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      actorId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      country: 'Uzbekistan',
      loading: false,
      imageUrl: '',
      actorPositions: [
        { key: 'Актер', value: 'actor' },
        { key: 'Актрисы', value: 'actress' },
        { key: 'Продюсер', value: 'producer' },
        { key: 'Мастер дубляжа', value: 'cast' },
        { key: 'Режиссер', value: 'director' },
        { key: 'Юморист', value: 'humorist' },
      ],
      actor: {
        photo: '',
        last_name: '',
        age: '',
        weight: '',
        height: '',
        birth_date: '',
        first_name: '',
        position: [],
      },
      rules: {
        first_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        position: [{ required: true, message: this.$t('required'), trigger: 'change' }],
      },
    }
  },
  mounted() {
    if (this.actorId) this.getActorAttrs()
  },
  props: {
    // eslint-disable-next-line
    lang: String,
  },
  methods: {
    ...mapActions(['getStaff']),
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getActorAttrs() {
      request({
        url: '/staff/' + this.actorId,
        method: 'get',
        params: { lang: this.lang },
      }).then((response) => {
        this.imageUrl = response.photo
        this.actor.photo = response.photo.split('/')[response.photo.split('/').length - 1]
        this.actor.first_name = response.first_name
        this.actor.last_name = response.last_name
        this.actor.biography = response.biography
        this.actor.birth_date = response.birth_date
        this.actor.age = response.age || ''
        this.actor.weight = response.weight || ''
        this.actor.height = response.height || ''
        var pos = response.position
        this.actor.position = pos
        console.log(this.actor.position)
      })
    },
    onSelectChange(e) {
      console.log(e)
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
          this.actor.photo = info.file.response.filename
          console.log('photo', this.actor.photo)
        })
      }
    },
    beforeUpload(file) {
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
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.actor.position.join(',')
            var url = '/staff'
            var method = 'post'
            const actor = {
              position: this.actor.position.join(','),
              first_name: this.actor.first_name,
              last_name: this.actor.last_name,
              biography: this.actor.biography,
              photo: this.actor.photo,
              lang: this.lang ? this.lang : 'ru',
              birth_date: this.actor.birth_date ? moment(this.actor.birth_date).format('YYYY-MM-DD') : '',
              age: parseInt(this.actor.age),
              weight: parseInt(this.actor.weight),
              height: parseInt(this.actor.height)
            }
            if (this.actorId) {
              url = '/staff/' + this.actorId
              method = 'put'
            }
            const headers = {
              'Content-Type': 'application/json',
            }
            if (this.actorId) {
              request({
                url: url,
                method: method,
                data: actor,
                headers: headers,
              })
                .then((res) => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  if (e) {
                    this.getStaff()
                    this.$router.replace('/staff/list')
                  }
                  resolve(res)
                })
                .catch((err) => {
                  if (err) {
                    reject(err)
                    this.$message.error(this.$t('error'))
                  }
                })
            } else {
              request({
                url: url,
                method: method,
                data: actor,
                headers: headers,
              })
                .then((res) => {
                  if (e) {
                    this.getStaff()
                    this.$router.replace('/staff/list')
                  }
                  resolve(res)
                })
                .catch((err) => {
                  if (err) {
                    reject(err)
                    this.$message.error(this.$t('error'))
                  }
                })
            }
            console.log('valid')
          } else {
            reject(valid)
          }
        })
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
  },
}
</script>
<style>
.ant-form-item-control {
  line-height: normal !important;
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
