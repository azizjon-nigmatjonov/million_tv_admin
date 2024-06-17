<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/movie/">{{ $t('movies') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <div v-if="edit">
      <a-card
        class="card-back"
        style="flex-direction: row-reverse; justify-content: flex-end; justify-items: flex-end"
        :title="this.$route.query.masterclass ? $t('updateMasterclass') : $t('updateMovie')"
      >
        <template slot="extra">
          <router-link to="/movie">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <a-tabs type="card" v-model="activeTabKey" @change="changeTab(activeTabKey)">
            <a-tab-pane key="ru">
              <span slot="tab">
                <flag iso="ru" />
                Русский
              </span>
              <v-main ref="ruEditForm" lang="ru"></v-main>
            </a-tab-pane>
            <a-tab-pane key="uz">
              <span slot="tab">
                <flag iso="uz" />
                O'zbekcha
              </span>
              <v-main ref="uzEditForm" lang="uz"></v-main>
            </a-tab-pane>
            <a-tab-pane key="en">
              <span slot="tab">
                <flag iso="gb" />
                English
              </span>
              <v-main ref="enEditForm" lang="en"></v-main>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-card>
    </div>
    <div v-else>
      <a-card class="card-back" :title="$t('fillIn')">
        <template slot="extra">
          <router-link to="/movie">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <v-main ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0; display: flex; gap: 15px">
        <a-form-model-item>
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit(false)">
            {{ $t('save') }}
          </a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit(true)">
            {{ $t('saveExit') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main.vue'
export default {
  data() {
    return {
      isSubmitting: false,
      activeTabKey: 'ru',
      edit: !!this.$route.params.id
    }
  },
  mounted() {
    console.log('routeQ', this.$route.query.masterclass)
    this.activeTabKey = this.$route.hash || 'ru'
    if (this.$route.query.lang) {
      this.activeTabKey = this.$route.query.lang
    } else this.$router.replace({ query: { lang: this.activeTabKey } })
    // console.log('this.$refs', this.$refs)
  },
  updated() {
    // console.warn('this.$refs', this.$refs)
  },
  methods: {
    changeTab (e) {
      console.log(e)
      this.$router.replace({ query: { lang: e } })
    },
    submit(exit) {
      // this.isSubmitting = true
      if (this.edit) {
        switch (this.activeTabKey) {
          case 'ru':
            this.$refs.ruEditForm.onSubmit(exit).then({}).catch(err => {
                this.isSubmitting = false
              }).finally(() => { this.isSubmitting = false })
            break
          case 'uz':
            this.$refs.uzEditForm.onSubmit(exit).then({}).catch(err => {
                this.isSubmitting = false
              }).finally(() => { this.isSubmitting = false })
            break
          case 'en':
            this.$refs.enEditForm.onSubmit(exit).then({}).catch(err => {
                this.isSubmitting = false
              }).finally(() => { this.isSubmitting = false })
            break
        }
      } else {
        this.$refs.createForm.onSubmit(exit).then({}).catch(err => {
          this.isSubmitting = false
        }).finally(() => { this.isSubmitting = false })
      }
    },
    resetForm() {
      if (this.edit) {
        if (!this.$refs.uzEditForm) {
          this.$refs.ruEditForm.resetForm()
          return
        }
        this.$refs.ruEditForm.resetForm()
        this.$refs.uzEditForm.resetForm()
      } else {
        this.$refs.createForm.resetForm()
      }
    }
  },
  components: { 'v-main': vMain }
}
</script>
<style>
.ant-select-selection__choice {
  width: 100%;
}
.id_video .ant-upload.ant-upload-select.ant-upload-select-picture-card {
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
.card-back .ant-card-head-wrapper {
  flex-direction: row-reverse;
  justify-content: flex-end;
  justify-items: flex-end;
}
</style>
