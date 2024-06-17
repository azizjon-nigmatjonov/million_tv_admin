<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/staff/">{{ $t('staff') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ edit ? $t('update') : $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <div v-if="edit">
      <a-card class="card-back" :title="$t('updateStaff')">
        <template slot="extra">
          <router-link to="/staff">
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
              <v-main ref="ruEditForm" lang="ru"></v-main>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">
                <flag iso="uz" />
                O'zbekcha
              </span>
              <v-main ref="uzEditForm" lang="uz"></v-main>
            </a-tab-pane>
            <a-tab-pane key="3">
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
          <router-link to="/staff">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <v-main ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit(false)">
            {{ $t('save') }}
          </a-button>
          <a-button v-if="edit" :loading="isSubmitting" type="primary" style="margin-left: 10px;" @click.prevent="submit(true)">
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
      activeTabKey: '1',
      edit: !!this.$route.params.id
    }
  },
  mounted() {
    console.log('this.$refs', this.$refs)
  },
  updated() {
    console.warn('this.$refs', this.$refs)
  },
  methods: {
    submit(exit) {
      this.isSubmitting = true
      if (this.edit) {
        if (!exit) {
          switch (this.activeTabKey) {
            case '1':
              this.$refs.ruEditForm.onSubmit().then(() => {
                this.isSubmitting = false
              }).catch(err => {
                this.isSubmitting = false
              })
              break
            case '2':
              this.$refs.uzEditForm.onSubmit().then(() => {
                this.isSubmitting = false
              }).catch(err => {
                this.isSubmitting = false
              })
              break
            case '3':
              this.$refs.enEditForm.onSubmit().then(() => {
                this.isSubmitting = false
              }).catch(err => {
                this.isSubmitting = false
              })
          }
        } else {
          switch (this.activeTabKey) {
            case '1':
              this.$refs.ruEditForm.onSubmit('exit').then({}).catch(err => {
                this.isSubmitting = false
              })
              break
            case '2':
              this.$refs.uzEditForm.onSubmit('exit').then({}).catch(err => {
                this.isSubmitting = false
              })
              break
            case '3':
              this.$refs.enEditForm.onSubmit('exit').then().catch(err => {
                console.log('submit error')
                this.isSubmitting = false
              })
              break
          }
        }
      } else {
        this.$refs.createForm.onSubmit('exit').then(err => { console.log(err) }).catch(err => {
          this.isSubmitting = false
        })
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
