<template>
  <a-form-model
    @submit="onSubmit"
    ref="ruleForm"
    :model="season"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
      <a-tab-pane key="1" :tab="$t('basicDetails')">
        <a-row>
          <a-col :span="24" style="padding: 0 15px">
            <a-form-model-item :label="$t('status')" prop="status">
              <a-switch v-model="season.active" :checked-children="$t('active')" :un-checked-children="$t('inactive')" default-checked />
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :md="12" style="padding: 0 15px">
            <a-form-model-item :label="$t('season_number')" prop="season_number">
              <a-input
                v-model="season.season_number"
                type="number"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="12" :xs="24" style="padding: 0 15px">
            <a-form-model-item :label="$t('release_year')" prop="release_year">
              <a-input
                v-model="season.release_year"
                type="number"
              />
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :md="24" style="padding: 0 15px">
            <a-form-model-item :label="$t('plot')" prop="plot">
              <a-textarea
                v-model="season.plot"
                :placeholder="$t('plot')"
                :auto-size="{ minRows: 8, maxRows: 10 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane v-if="seasonId" id="seasons" key="2">
        <span slot="tab">
          {{ $t('episodes') }}<a-badge :number-style="{ backgroundColor: '#FF5722' }" v-if="seasonId && season.episodes && season.episodes.length" style="margin-left: 4px" :count="season.episodes.length"/>
        </span>
        <a-row>
          <router-link :to="'../'+seasonId+'/episodes/create'+`${season.episodes?.length ? `?episode_number=${season.episodes?.length + 1}` : '' }`">
            <a-button style="float: right; margin-bottom: 10px" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
          </router-link>
        </a-row>
        <a-table
          :columns="columnsEpisodes"
          :rowKey="record => record.id"
          :dataSource="season.episodes"
        >
          <template slot="action" slot-scope="text, row">
              <a-tooltip v-action:update placement="topRight"><template slot="title">{{ $t('update') }}</template>
                <a-button @click="$router.replace({
                  path: '../'+seasonId+'/episodes/update/'+row.episode_number,
                  hash: $route.hash
                })" style="margin-right: 5px" id="buttonUpdate" type="default" icon="edit"></a-button>
              </a-tooltip>
            <a-popconfirm
              placement="left"
              slot="extra"
              :title="$t('deleteMsg')"
              @confirm="deleteEpisode($event, row.episode_number)"
              :okText="$t('yes')"
              :cancelText="$t('no')"
            >
              <a-tooltip placement="topRight"><template slot="title">{{ $t('delete') }}</template>
                <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-form-model>
</template>
<script>
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      movieId: this.$route.params.movieId,
      seasonId: this.$route.params.id,
      labelCol: { span: 24 },
      activeTabKey: '1',
      wrapperCol: { span: 24 },
      other: '',
      country: 'Uzbekistan',
      loading: false,
      imageUrl: '',
      loadingScene: false,
      season: {
        active: false,
        episodes: [],
        season_number: null,
        release_year: null,
        plot: '',
        lang: 'ru'
      },
      columnsEpisodes: [
        {
          title: this.$t('episode_number'),
          dataIndex: 'episode_number'
        },
        {
          title: this.$t('title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      rules: {
        season_number: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        release_year: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.seasonId) this.getSeasonAttrs()
  },
  props: {
  // eslint-disable-next-line
    lang: String,
    movieSlug: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions(['getSeasons']),
    getSeasonAttrs () {
      request({
        url: '/movies/' + this.movieId + '/seasons/' + this.seasonId,
        params: { lang: this.lang },
        method: 'get'
      }).then((response) => {
        this.season.episodes = response.season.episodes
        this.season.active = response.season.active
        this.season.season_number = response.season.season_number
        this.season.plot = response.season.plot
        this.season.release_year = response.season.release_year
        this.movieSlug = response.movie.slug
      })
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    deleteEpisode(e, id) {
      request({
        url: '/movies/' + this.movieId + '/seasons/' + this.seasonId + '/episodes/' + id,
        method: 'delete'
      })
        .then(res => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getSeasonAttrs()
        })
        .catch(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSubmit (e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/movies/' + this.movieId + '/seasons'
            var method = 'post'
            if (this.seasonId) {
              url = '/movies/' + this.movieId + '/seasons/' + this.seasonId
              method = 'put'
            }
            const data = {
              season_number: parseInt(this.season.season_number),
              release_year: parseInt(this.season.release_year),
              plot: this.season.plot,
              active: this.season.active,
              lang: this.lang
            }
            this.season.lang = this.lang
            const headers = {
              'Content-Type': 'application/json'
            }
            request({
                url: url,
                method: method,
                data: data,
                headers: headers
            }).then(res => {
              this.$router.replace('/movie/update/' + this.movieSlug)
              resolve(res)
            }).catch(err => {
              if (err) {
                this.$message.error(this.$t('error'))
                reject(err)
              }
            })
          } else {
            reject(valid)
          }
        })
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
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
