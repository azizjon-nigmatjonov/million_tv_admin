<template>
    <a-card class="card-back" :title="insId ? $t('instructionUpdate') : $t('instructionCreate')">
      <template slot="extra">
        <router-link to="/instruction/">
          <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </router-link>
      </template>
      <a-skeleton :loading="loadingPage">
        <a-row style="margin-bottom: 20px">
          <a-col style="padding-right: 10px" :span="8"><a-input v-model="form.title" :placeholder="$t('title')"></a-input></a-col>
        </a-row>
        <editor
          ref="uz"
          v-model="content"
          api-key="43hzrms710evup3megfjv61a1a2mutt7dtqur4smu4bvp5jf"
          :init="{
              height: 500,
              menubar: 'insert',
              selector: 'textarea',
              a11y_advanced_options: true,
              image_title: true,
              images_upload_url: '/v1/image-upload',
              images_upload_base_path: '/v1/image-upload',
              automatic_uploads: true,
              images_upload_handler: this.uploader,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste imagetools wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | image media | \
                bullist numlist outdent indent | removeformat | help',
          }"
        />
        <a-button style="margin: 15px 0" @click="save" type="primary" :loading="loading">{{ insId ? 'Update' : 'Save' }}</a-button>
      </a-skeleton>
    </a-card>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { mapActions } from 'vuex'
export default {
  components: {
    'editor': Editor
  },
  data () {
    return {
      loadingPage: false,
      loading: false,
      insId: this.$route.params.insid,
      content: '',
      form: {
        title: ''
      }
    }
  },
  watch: {
    content (val) {
    }
  },
  methods: {
    ...mapActions(['postInstruction', 'updateInstruction', 'getInstructionById']),
    uploader: function (blobInfo, success, failure, progress) {
      let xhr, formData

      xhr = new XMLHttpRequest()
      xhr.withCredentials = false
      xhr.open('POST', `${process.env.VUE_APP_API_BASE_URL}image-upload`)

      xhr.upload.onprogress = function (e) {
        progress((e.loaded / e.total) * 100)
      }

      xhr.onload = function () {
        var json

        if (xhr.status === 403) {
          failure('HTTP Error: ' + xhr.status, { remove: true })
          return
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          failure('HTTP Error: ' + xhr.status)
          return
        }

        json = JSON.parse(xhr.responseText)
        console.log('json', json)
        console.log('xhr.responseText', xhr.responseText)

        if (!json || typeof json.filename !== 'string') {
          failure('Invalid JSON: ' + xhr.responseText)
          return undefined
        }
        success(`https://voxecdn.s3.us-east-2.amazonaws.com/images/${json.filename}`)
      }

      xhr.onerror = function () {
        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
      }

      formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())

      console.log('formData', formData)
      xhr.setRequestHeader('Authorization', storage.get(ACCESS_TOKEN))
      xhr.send(formData)
    },
    save () {
      let _data = {
        body: this.content,
        title: this.form.title,
      }
      this.loading = true
      if (this.insId) {
        this.updateInstruction({
          data: _data,
          guide_id: this.$route.params.guid,
          insid: this.insId
        }).then(res => {
          this.$router.push({
            name: 'InstructionList',
            params: {
              guid: this.$route.params.guid,
              name: this.$route.params.name
            }
          })
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.postInstruction({
          data: {
                  guide_id: this.$route.params.guid,
                  instruction: _data
                },
          insid: this.insId
        }).then(res => {
          this.$router.push({
            name: 'InstructionList',
            params: {
              guid: this.$route.params.guid,
              name: this.$route.params.name
            }
          })
        }).finally(() => {
          this.loading = false
        })
      }
    }
  },
  mounted() {
    this.loadingPage = true
    if (this.insId) {
      this.getInstructionById({
        guid: this.$route.params.guid,
        insid: this.insId
      }).then(res => {
        this.content = res.instruction.body
        this.form.title = res.instruction.title
        this.loadingPage = false
      }).catch(err => {
        this.loadingPage = false
      })
    } else {
      this.loadingPage = false
    }
  }
}
</script>

<style>
  .card-back .ant-card-head-wrapper {
    flex-direction: row-reverse !important;
    justify-content: flex-end !important;
    justify-items: flex-end !important;
  }
</style>
