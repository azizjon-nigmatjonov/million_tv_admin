<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/movie/">{{ $t('movies') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link :to="{ path: `/movie/update/${movieSlug}`, query: { masterclass: this.$route.query.masterclass } }">{{ movieTitle }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ $t('season') + ' ' + seasonId }}</a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ $t('update') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-if="!edit">{{ $t('seasons') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-if="!edit">{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <div v-if="edit">
      <a-card class="card-back" :title="$t('updateSeason')">
        <template slot="extra">
            <a-button @click="$router.push({ path: '/movie/update/' + movieSlug, hash: $route.hash, query: { masterclass: $route.query.masterclass }})" type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </template>
        <a-row>
          <a-tabs type="card" v-model="activeTabKey" @change="changeTab(activeTabKey)">
            <a-tab-pane key="#1">
              <span slot="tab">
                <flag iso="ru" />
                Русский
              </span>
              <v-main ref="ruEditForm" lang="ru"></v-main>
            </a-tab-pane>
            <a-tab-pane key="#2">
              <span slot="tab">
                <flag iso="uz" />
                O'zbekcha
              </span>
              <v-main ref="uzEditForm" lang="uz"></v-main>
            </a-tab-pane>
            <a-tab-pane key="#3">
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
          <router-link :to="{ path: `/movie/update/${movieSlug}`, query: { masterclass: this.$route.query.masterclass } }">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <v-main :movieSlug="movieSlug" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit">
            {{ $t('save') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import vMain from './v-main.vue'
import request from '@/utils/request'
export default {
  data() {
    return {
      activeTabKey: '#1',
      isSubmitting: false,
      movieTitle: '',
      movieSlug: '',
      movieId: this.$route.params.movieId,
      seasonId: this.$route.params.id,
      edit: !!this.$route.params.id
    }
  },
  mounted() {
    console.log('this.$refs', this.$refs)
    this.activeTabKey = this.$route.hash || '#1'
    this.getSeasonAttrs()
  },
  updated() {
    console.warn('this.$refs', this.$refs)
  },
  methods: {
    changeTab (e) {
      console.log(e)
      this.$router.replace({ hash: e })
    },
    getSeasonAttrs() {
      var url
      if (this.edit) url = '/movies/' + this.movieId + '/seasons/' + this.seasonId
      else url = url = '/movies/' + this.movieId
      request({
        url: url,
        params: { lang: 'ru' },
        method: 'get'
      }).then(response => {
        this.movieTitle = response.movie.title
        this.movieSlug = response.movie.slug
      })
    },
    submit() {
      this.isSubmitting = true
      if (this.edit) {
        switch (this.activeTabKey) {
          case '#1':
            this.$refs.ruEditForm.onSubmit().then({}).catch(err => {
                this.isSubmitting = false
              })
            break
          case '#2':
            this.$refs.uzEditForm.onSubmit().then({}).catch(err => {
                this.isSubmitting = false
              })
            break
          case '#3':
            this.$refs.enEditForm.onSubmit().then({}).catch(err => {
                this.isSubmitting = false
              })
            break
        }
      } else {
        this.$refs.createForm.onSubmit().then({}).catch(err => {
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
</style>
