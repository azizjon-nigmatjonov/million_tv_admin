<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('episodes') }}</a-breadcrumb-item>
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
        :dataSource="episodes"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button style="margin-right: 5px" id="buttonPreview" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip>
          <router-link v-action:update :to="row.is_serial ? './update-serial/'+row.id : './update/'+row.id" >
            <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 5px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            v-action:delete
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteEpisode($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          ><a-tooltip placement="topRight"><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('title_uz')">
          {{ selectedEpisode.title_uz ? selectedEpisode.title_uz : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('title_ru')">
          {{ selectedEpisode.title_ru ? selectedEpisode.title_ru : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('tariff')">
          {{ selectedEpisode.title_en ? selectedEpisode.title_en : '' }}
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
import request from '@/utils/request'
export default {
  data () {
    return {
      value: '',
      data: [],
      movieId: this.$route.params.movieId,
      seasonId: this.$route.params.seasonId,
      loading: true,
      searchForm: {
        searchKey: ''
      },
       columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('slogan'),
          dataIndex: 'slogan'
        },
        {
          title: this.$t('category'),
          dataIndex: 'category.title_ru'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedEpisode: { tariff_details: { name: '' } },
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['episodes', 'paginationEpisodes']),
    getPagination () {
      return this.paginationEpisodes
    }
  },
  mounted () {
    this.getEpisodes({ current: 1, pageSize: 10, movie: this.movieId, season: this.seasonId }).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
      console.log(this.episodes)
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getEpisodes']),
    handleTableChange (pagination) {
      var paginationNew = { ...pagination, movie: this.movieId, season: this.seasonId }
      this.getEpisodes(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    onPressEnter (e) {
      e.preventDefault()
      this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal (userId) {
      this.getSelectedEpisode(userId)
      this.previewVisible = true
    },
    showSeasons (id) {
      this.$router.push({
        name: 'SeasonsList',
        params: {
          movieId: id
        }
      })
    },
    getSelectedEpisode (selectedEpisode) {
      request({
        url: '/movie-serials/' + this.movieId + '/season-episodes/' + this.seasonId + '/' + selectedEpisode,
        method: 'get'
      }).then((response) => {
        this.selectedEpisode = response.category
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteEpisode (e, id) {
      request({
              url: '/movie-serials/' + this.movieId + '/season-episodes/' + this.seasonId + '/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getEpisodes({ current: 1, pageSize: 10, movie: this.movieId, season: this.seasonId })
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
