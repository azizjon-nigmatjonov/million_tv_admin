<template>
  <div>
    <a-card>
      <a-row>
        <a-col :span="12">
          <a-breadcrumb style="margin: 10px 5px">
            <a-breadcrumb-item
              ><b>{{ $t('featured-movies') }}</b></a-breadcrumb-item
            >
          </a-breadcrumb>
        </a-col>
      </a-row>

      <a-tabs type="card" style="padding: 1px 8px">
        <a-tab-pane key="1" :tab="$t('mainPage')">
          <a-row a-row style="padding-bottom: 18px">
              <a-col>
                <router-link v-action:add :to="{ path: '/featured-movies/create', query: { is_selection: false } }">
                  <a-button style="height: 40px; float: right" type="primary link" icon="plus">{{ $t('add') }}</a-button>
                </router-link>
              </a-col>
          </a-row>
          <FeaturedDnD/>
          <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
            <a-descriptions layout="vertical" bordered>
              <a-descriptions-item :label="$t('title_uz')">
                {{ selectedMovie.title_uz ? selectedMovie.title_uz : '' }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('title_ru')">
                {{ selectedMovie.title_ru ? selectedMovie.title_ru : '' }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('tariff')">
                {{ selectedMovie.title_en ? selectedMovie.title_en : '' }}
              </a-descriptions-item>
            </a-descriptions>
            <template slot="footer">
              <a-button id="buttonCancel" key="back" @click="handleCancel">
                {{ $t('cancel') }}
              </a-button>
            </template>
          </a-modal>
        </a-tab-pane>

        <a-tab-pane key="2" :tab="$t('compilation')">
          <a-row style="padding-bottom: 18px">
              <a-col>
                <router-link v-action:add :to="{ path: '/featured-movies/create', query: { is_selection: true } }">
                  <a-button style="height: 40px; float: right" type="primary link" icon="plus">{{ $t('add') }}</a-button>
                </router-link>
              </a-col>
          </a-row>
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="record => record.id"
            :dataSource="getAllFeaturedMoviesT"
            :pagination="getPaginationT"
            :loading="loading"
            @change="handleTableChangeT"
            bordered
          >
            <template slot="action" slot-scope="text, row">
              <router-link v-action:update :to="{ path: `/featured-movies/update/${row.slug}`, query: { is_selection: true } }">
                <a-tooltip placement="topRight"
                  ><template slot="title">{{ $t('update') }}</template>
                  <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
                </a-tooltip>
              </router-link>
              <a-popconfirm
                placement="left"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="deleteMovie($event, row.slug)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
                ><a-tooltip placement="topRight"
                  ><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
          <!-- </a-card> -->
          <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
            <a-descriptions layout="vertical" bordered>
              <a-descriptions-item :label="$t('title_uz')">
                {{ selectedMovie.title_uz ? selectedMovie.title_uz : '' }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('title_ru')">
                {{ selectedMovie.title_ru ? selectedMovie.title_ru : '' }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('tariff')">
                {{ selectedMovie.title_en ? selectedMovie.title_en : '' }}
              </a-descriptions-item>
            </a-descriptions>
            <template slot="footer">
              <a-button id="buttonCancel" key="back" @click="handleCancel">
                {{ $t('cancel') }}
              </a-button>
            </template>
          </a-modal>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import FeaturedDnD from './FeaturedDnD'
export default {
  components: { FeaturedDnD },
  data() {
    return {
      value: '',
      data: [],
      loading: true,
      searchForm: {
        searchKey: ''
      },
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center'
        },
        {
          title: this.$t('title'),
          dataIndex: 'title'
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
      selectedMovie: { tariff_details: { name: '' } },
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['featuredMovies', 'paginationFeaturedMovies', 'featuredMoviesT', 'paginationFeaturedMoviesT']),
    getPagination() {
      return this.paginationFeaturedMovies
    },
    getPaginationT() {
      return this.paginationFeaturedMoviesT
    },
    getAllFeaturedMovies() {
      return this.featuredMovies.map((featuredMovie, index) => {
        return {
          ...featuredMovie,
          index: this.paginationFeaturedMovies?.current ? index + ((this.paginationFeaturedMovies.current - 1) * 10) + 1 : index + 1
        }
      })
    },
    getAllFeaturedMoviesT() {
      return this.featuredMoviesT.map((featuredMovieT, index) => {
        return {
          ...featuredMovieT,
          index: this.paginationFeaturedMoviesT?.current ? index + ((this.paginationFeaturedMoviesT.current - 1) * 10) + 1 : index + 1
        }
      })
    }
  },
  mounted() {
    this.getFeaturedMovies(this.paginationFeaturedMovies).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
      console.log('false', this.categories)
    })
    this.getFeaturedMoviesT(this.paginationFeaturedMoviesT).then(() => {
      this.searchForm.searchKey = this.getPaginationT.search
      this.loading = false
      console.log('true', this.categories)
    })
  },
  beforeDestroy() {},
  methods: {
    ...mapActions(['getFeaturedMovies', 'getFeaturedMoviesT']),
    handleTableChange(pagination) {
      const paginationNew = {
        ...pagination,
        search: null
      }
      this.getFeaturedMovies(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    handleTableChangeT(pagination) {
      const paginationNew = {
        ...pagination,
        search: null
      }
      this.getFeaturedMovies(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    onPressEnter(e) {
      e.preventDefault()
      this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal(userId) {
      this.getSelectedMovie(userId)
      this.previewVisible = true
    },
    getSelectedMovie(selectedMovie) {
      request({
        url: '/featured-list/' + selectedMovie,
        method: 'get'
      }).then(response => {
        this.selectedMovie = response.featured_list
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    deleteMovie(e, id) {
      request({
        url: '/featured-list/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getFeaturedMovies()
          this.getFeaturedMoviesT()
        })
        .then(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSearchChange() {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getFeaturedMovies({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
      }, 750)
    },
    search(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getFeaturedMovies({ current: 1, pageSize: 10, search: values['search'] })
        }
      })
    }
  }
}
</script>
