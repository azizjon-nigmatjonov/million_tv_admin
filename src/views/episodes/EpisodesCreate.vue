<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/movie/">{{ $t('movies') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link :to="'/movie/update/' + movieSlug">{{ movieTitle }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link :to="'/movie/'+movieId+'/seasons/update/'+seasonId">{{ $t('season') + ' ' + seasonId }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('episodes') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ episodeTitle }}</a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ $t('update') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-else>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <div v-if="edit">
      <a-card class="card-back" :title="$t('updateEpisode')">
        <template slot="extra">
            <a-button v-action:update @click="$router.push({ path: '/movie/' + movieId + '/seasons/update/' + seasonId, hash: $route.hash })" type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </template>
        <a-row>
          <a-tabs type="card" v-model="activeTabKey" @change="changeTab">
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
      <a-card class="card-back" :title="$t('add') + ' эпизод'">
        <template slot="extra">
          <router-link :to="'/movie/' + movieId + '/seasons/update/' + seasonId">
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
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit">
            {{ $t('save') }}
          </a-button>
        </a-form-model-item>
        <a-form-model-item v-if="$route.query?.episode_number">
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit('dublicate')">
            Дублировать
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
      isSubmitting: false,
      activeTabKey: '#1',
      movieTitle: '',
      movieSlug: '',
      episodeTitle: '',
      episodeNumber: this.$route.params.id,
      movieId: this.$route.params.movieId,
      seasonId: this.$route.params.seasonId,
      edit: !!this.$route.params.id
    }
  },
  mounted() {
    console.log('this.$refs', this.$refs)
    this.getSeasonAttrs()
    this.activeTabKey = this.$route.hash || '#1'
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
      if (this.edit) url = '/movies/' + this.movieId + '/seasons/' + this.seasonId + '/episodes/' + this.episodeNumber
      else url = '/movies/' + this.movieId + '/seasons/' + this.seasonId
      request({
        url: url,
        params: { lang: 'ru' },
        method: 'get'
      }).then(response => {
        this.movieTitle = response.movie.title
        this.movieSlug = response.movie.slug
        if (this.edit) this.episodeTitle = response.episode.title
      })
    },
    submit(dublicate) {
      // this.isSubmitting = true
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
        this.$refs.createForm.onSubmit(dublicate).then(() => {
          this.isSubmitting = false
        }).catch(err => {
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
