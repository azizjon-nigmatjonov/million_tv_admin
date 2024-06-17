<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/channel/list">{{ $t('channel') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ $t('update') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-else>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <!-- Update Category -->
    <div v-if="edit">
      <a-card class="card-back" :title="$t('updateCategory')">
        <template slot="extra">
          <router-link to="/channel/list">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <a-tabs type="card" v-model="activeTabKey">
            <a-tab-pane key="1">
              <span slot="tab">
                <flag iso="ru" />
                Русский
              </span>
              <v-main :form="form" lang="ru"></v-main>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">
                <flag iso="uz" />
                O'zbekcha
              </span>
              <v-main :form="form" lang="uz"></v-main>
            </a-tab-pane>
            <a-tab-pane key="3">
              <span slot="tab">
                <flag iso="gb" />
                English
              </span>
              <v-main :form="form" lang="en"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card>
    </div>
    <!-- Create Category -->
    <div v-else>
      <a-card class="card-back" :title="$t('fillIn')">
        <template slot="extra">
          <router-link to="/channel/list">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <v-main :form="form" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit(false)">
            {{ $t('save') }}
          </a-button>
          <a-button
            v-if="edit"
            :loading="isSubmitting"
            type="primary"
            style="margin-left: 10px"
            @click.prevent="submit(true)"
          >
            {{ $t('saveExit') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import vMain from './v-main'
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      Id: this.$route.params.id,
      isSubmitting: false,
      activeTabKey: '1',
      edit: !!this.$route.params.id,
      form: {
        status: false,
        title_ru: '',
        title_uz: '',
        title_en: '',
        description_ru: '',
        description_uz: '',
        description_en: '',
        region_type: '',
        image: '',
        imgUrl: '',
        background_image: '',
        background_imgUrl: '',
        url: '',
        category_id: '',
        flusonic_id: '',
        payment_type: '',
        xml_title: '',
        programs_info: []
      }
    }
  },
  mounted() {},
  computed: {
    // ...mapGetters(['paginationSubscription'])
  },
  methods: {
    ...mapActions(['getTvChannel']),
    submit(exit) {
      this.isSubmitting = true
      if (this.edit) {
        const header = {
          'Content-Type': 'application/json'
        }
        return new Promise((resolve, reject) => {
          request({
            url: '/tv/channel/' + this.Id,
            method: 'put',
            data: {
              category_id: this.form.category_id,
              status: this.form.status,
              title_ru: this.form.title_ru,
              title_uz: this.form.title_uz,
              title_en: this.form.title_en,
              description_ru: this.form.description_ru,
              description_uz: this.form.description_uz,
              description_en: this.form.description_en,
              xml_title: this.form.xml_title,
              flusonic_id: this.form.flusonic_id,
              secret_key: this.form.secret_key,
              payment_type: this.form.payment_type,
              image: this.form.image,
              background_image: this.form.background_image,
              url: this.form.url,
              region_type: this.form.region_type
            },
            headers: header
          })
            .then(res => {
              this.$message.success(this.$t('successfullyUpdated'))
              if (exit) {
                this.getTvChannel()
                this.$router.replace('/channel/list')
              }
              resolve()
            })
            .catch(err => {
              if (err) {
                console.log(err)
                this.isSubmitting = false
                this.$message.error(this.$t('error'))
              }
              reject(err)
            })
          this.isSubmitting = false
        })
      } else {
        this.$refs.createForm
          .onSubmit('exit')
          .then(res => {
            this.$message.success(this.$t('successfullyCreated'))
            this.isSubmitting = false
          })
          .catch(err => {
            this.$message.error(this.$t('error'))
            this.isSubmitting = false
          })
      }
    }
  },
  components: { 'v-main': vMain }
}
</script>
<style>
.card-back .ant-card-head-wrapper {
  flex-direction: row-reverse;
  justify-content: flex-end;
  justify-items: flex-end;
}
.ant-select-selection__choice {
  width: 100%;
}
.ant-upload img {
  width: 100%;
}
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
