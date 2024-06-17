<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('movies') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link v-action:add to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
        <div style="width: 600px" slot="extra">
          <a-form-model layout="horizontal" :form="searchForm" @submit="search">
            <a-row>
              <a-col :span="24" style="padding: 5px">
                <a-form-model-item style="margin: 0">
                  <a-input id="inputSearch" :placeholder="$t('search') + '...'" @pressEnter="onPressEnter" @change="onSearchChange" v-model="searchForm.searchKey"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      <a-table
        v-action:get
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllMovies"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="image" slot-scope="text, row">
          <img width="100" height="140" :src="row.logo_image" />
        </template>
        <template slot="action" slot-scope="text, row">
          <!-- <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button style="margin-right: 5px" id="buttonPreview" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip> -->
          <router-link v-action:update :to="'./update/'+row.slug" >
            <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 5px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteMovie($event, row.slug)"
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
      searchForm: {
        searchKey: ''
      },
      loading: true,
       columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          align: 'center'
        },
        {
          title: this.$t('image'),
          key: 'image',
          scopedSlots: { customRender: 'image' },
          align: 'center'
        },
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
          dataIndex: 'category.title'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      timeOut: null,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedMovie: { tariff_details: { name: '' } },
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['movies', 'paginationMovies']),
    getPagination () {
      console.log(this.paginationMovies)
      return this.paginationMovies
    },
    getAllMovies () {
      return this.movies.map((movie, index) => {
        return {
          ...movie,
          index: index + 1
        }
      })
    }
  },
  mounted () {
    this.getMovies(this.getPagination).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
      console.log(this.movies)
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getMovies']),
    handleTableChange (pagination) {
      const paginationNew = {
        ...pagination,
        lang: 'ru',
        search: null
      }
      this.getMovies(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    onPressEnter (e) {
      e.preventDefault()
      this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal (userId) {
      this.getselectedMovie(userId)
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
    getselectedMovie (selectedMovie) {
      request({
        url: '/movies/' + selectedMovie,
        method: 'get'
      }).then((response) => {
        this.selectedMovie = response.category
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteMovie (e, id) {
      request({
              url: '/movies/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getMovies()
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
          this.getMovies({ current: 1, pageSize: 10, search: values['search'] })
        }
      })
    }
  }
}
</script>
