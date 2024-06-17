<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('seasons') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link v-action:add to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
      <a-table
        v-action:get
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="seasons"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <a-tooltip style="margin-right: 6px"><template slot="title">{{ $t('read') }}</template>
            <a-button id="buttonPreview" type="default" @click="showPreviewModal(row.season_number)" icon="eye"></a-button>
          </a-tooltip>
          <router-link v-action:update :to="'./update/'+row.season_number" >
            <a-tooltip placement="topRight" style="margin-right: 6px"><template slot="title">{{ $t('update') }}</template>
              <a-button id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <router-link :to="'./' +row.season_number+'/episodes/list'" >
            <a-tooltip><template slot="title">{{ $t('episodes') }}</template>
              <a-button style="margin-right: 5px" id="buttonUpdate" type="primary" icon="database"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteSeason($event, row.season_number)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip placement="topRight" style="margin-right: 6px"><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">

    </a-modal>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('season_number')">
          {{ selectedSeason.season_number ? selectedSeason.season_number : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('last_name')">
          {{ selectedSeason.release_year ? selectedSeason.release_year : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('last_name')">
          {{ selectedSeason.plot ? selectedSeason.plot : '' }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SeasonsCreate from './SeasonsCreate'
import request from '@/utils/request'
export default {
  data () {
    return {
      movieId: this.$route.params.movieId,
      value: '',
      data: [],
      loading: true,
      searchForm: {
        searchKey: ''
      },
       columns: [
        {
          title: this.$t('season_number'),
          dataIndex: 'season_number'
        },
        {
          title: this.$t('release_year'),
          dataIndex: 'release_year'
        },
        {
          title: this.$t('plot'),
          dataIndex: 'plot'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedSeason: {},
      parentCategory: '',
      filterParams: {}
    }
  },
  components: {
    SeasonsCreate
  },
  computed: {
    ...mapGetters(['seasons']),
    getPagination () {
      return this.paginationSeasons
    }
  },
  mounted () {
    console.log(this.movieId)
    this.getSeasons({ current: 1, pageSize: 10, movie: this.movieId }).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
      console.log(this.seasons)
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getSeasons']),
    handleTableChange (pagination) {
      var paginationNew = { ...pagination }
      paginationNew.movie = this.movieId
      this.getSeasons(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    showPreviewModal (easonId) {
      this.getSelectedSeason(easonId)
      this.previewVisible = true
    },
    getSelectedSeason (selectedSeason) {
      request({
        url: '/movie-serials/' + this.movieId + '/seasons/' + selectedSeason,
        method: 'get'
      }).then((response) => {
        this.selectedSeason = response.season
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteSeason (e, id) {
      request({
              url: '/movie-serials/' + this.movieId + '/seasons/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getSeasons({ current: 1, pageSize: 10, movie: this.movieId })
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    onSearchChange () {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getMovies({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
      }, 750)
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.filterParams = values
          this.pagination.current = 1
        }
      })
    }
  }
}
</script>
