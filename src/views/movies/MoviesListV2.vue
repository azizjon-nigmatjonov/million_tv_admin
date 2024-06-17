<template>
  <div>
    <a-card :bordered="false">
      <div slot="title" style="padding: 8px 0">
        {{ $t('movies') }}
      </div>
      <div slot="extra">
                       <a-col style="margin-right: 10px">
                    <div style="display: flex; column-gap: 10px; justify-content: flex-end; align-items: center">
                      <p style="margin: 0" v-if="filterActive">Активный</p>
                      <p style="margin: 0" v-else>Неактивный</p>
                      <a-switch
                        v-model="filterActive"
                        @change="handleActiveStatus"
                        :disabled="!editActive"
                        default-checked
                      />
                      <a-button v-if="!editActive" @click="handleEditActive(true)" type="default" icon="edit"></a-button>
                      <a-button v-else @click="handleEditActive(false)" type="default" icon="close"></a-button>
                    </div>
                  </a-col>
                  </div>
        <div>
          <a-row style="display: flex; align-items: center; margin-left: auto; padding: 0 10px 20px 0;">
                   <a-col :span="4" style="padding: 5px">
                    <p style="margin-bottom: 5px">Правообладатель</p>
                     <a-select
                     style="width: 100%"
                      v-model="activeOwner"
                      @change="handleOwnerStatus"
                      :placeholder="$t('genre')"
                    >
                      <a-select-option v-for="el in creatorsList" :key="el" :value="el">
                        {{ el }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                   <a-col :span="4" style="padding: 5px">
                   <p style="margin-bottom: 5px">Категория</p>
                     <a-select
                     style="width: 100%"
                      v-model="activeCategory"
                      @change="handleCategoryStatus"
                      :placeholder="$t('genre')"
                    >
                      <a-select-option v-for="item in categories" :key="item.id" :value="item.id">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="4" style="padding: 5px">
                   <p style="margin-bottom: 5px">Жанры</p>
                     <a-select
                     style="width: 100%"
                      v-model="activeGenre"
                      @change="handleGenreStatus"
                      :placeholder="$t('genre')"
                    >
                      <a-select-option v-for="item in genres" :key="item.id" :value="item.id">
                        {{ item.title }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="4" style="padding: 5px">
                    <p style="margin-bottom: 5px">Страна</p>
                     <a-select
                      style="width: 100%"
                      v-model="activeCountry"
                      @change="handleCountriesStatus"
                      :placeholder="$t('countries')"
                    >
                      <a-select-option v-for="item in countries" :key="item.name" :value="item.name">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-col>
          
            <a-col :span="4" style="padding: 5px">
                <p style="margin-bottom: 5px">{{ $t('search') }}</p>
                <a-input
                  :placeholder="$t('search') + '...'"
                  @change="onSearchChange"
                  v-model="paginations.search"
                />
            </a-col>
            <a-col :span="1" style="padding: 5px; margin: 25px 0 0 auto" @click="clearFilters">
              <a-button> <a-icon type="close" /></a-button>
            </a-col>
                          
          </a-row>
        </div>

            <div class="flex" style="margin-bottom: 15px">
            <a-col>
                <div>
                  <div style="display: flex; column-gap: 10px; align-items: center">
                      <!-- <p v-if="movieStatus">активировать</p>
                      <p v-else>деактивировать</p> -->
                      <a-switch
                        :disabled="!editStatus || !checkedList?.length"
                        v-model="movieStatus"
                        @change="handleStatusMovies"
                        default-checked
                      />
                      <a-button v-if="!editStatus" @click="handleEditStatus(true)" type="default" icon="edit"></a-button>
                      <a-button v-else @click="handleEditStatus(false)" type="default" icon="close"></a-button>
                    </div>
                  </div>
               </a-col>
            <a-col>
              <router-link v-action:add :to="{ path: '/movie/create' }">
                <a-button style="height: 40px; float: right" type="primary link" icon="plus">{{ $t('add') }}</a-button>
              </router-link>
            </a-col></div>
          <div style="position: relative;">
            <div class="countAll"><span v-if="paginations.total < totalCount">{{ paginations.total }} из</span> <span>{{ totalCount }}</span></div>

            <a-table
              v-action:get
              :columns="columns"
              :rowKey="(record) => record.id"
              :dataSource="moviesList"
              :pagination="paginations"
              :loading="loading"
              @change="handleTableChange"
              bordered
            >
               <template slot="editStatus" slot-scope="text, row">
                <div :class="`checkbox ${checkedList?.includes(text.slug) ? 'active' : ''}`" @click="() => handleCheckStatus(text, row)">
                     <a-icon v-if="checkedList?.includes(text.slug)" type="check" style="color: #0166f3" />
                </div>
              </template>
              <template slot="image" slot-scope="text, row">
                <img class="image" :src="row.logo_image" />
              </template>
              <template slot="action" slot-scope="text, row">
                <router-link v-action:update :to="'./update/' + row.slug">
                  <a-tooltip placement="topRight"
                    ><template slot="title">{{ $t('update') }}</template>
                    <a-button style="margin-right: 5px" id="buttonUpdate" type="default" icon="edit"></a-button>
                  </a-tooltip>
                </router-link>
                <a-popconfirm
                  placement="left"
                  slot="extra"
                  :title="$t('deleteMsg')"
                  @confirm="deleteMovie($event, row)"
                  :okText="$t('yes')"
                  :cancelText="$t('no')"
                  ><a-tooltip placement="topRight"
                    ><template slot="title">{{ $t('delete') }}</template>
                    <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
              </template>
            </a-table>
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
    </a-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data() {
    return {
      creatorsList: ['Maestro', 'Rizanova', 'Global', 'Million'],
      activeTabKey: 1,
      value: '',
      data: [],
      searchForm: {
        searchKey: '',
      },
      editActive: false,
      activeOwner: '',
      activeCategory: '',
      activeCountry: '',
      activeGenre: '',
      moviesList: [],
      paginations: {
          current: 1,
          pageSize: 10,
          total: 10,
          search: ''
      },
      checkedList: [],
      totalCount: 0,
      genres: [],
      categories: [],
      countries: [],
      filterActive: false,
      movieStatus: false,
      editStatus: false,
      loading: true,
      numberPage: null,
      columnsH: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          align: 'center',
          width: '100px',
        },
        {
          title: this.$t('title'),
          dataIndex: 'title',
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          scopedSlots: { customRender: 'action' },
          align: 'center',
        },
      ],
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center',
        },
        {
          title: this.$t('image'),
          key: 'image',
          scopedSlots: { customRender: 'image' },
        },
        {
          title: this.$t('title'),
          dataIndex: 'title',
        },
        {
          title: this.$t('slogan'),
          dataIndex: 'slogan',
        },
        {
          title: this.$t('category'),
          dataIndex: 'category.title',
        },
        {
          title: this.$t('action'),
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: '106px',
        },
      ],
      timeOut: null,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedMovie: { tariff_details: { name: '' } },
      parentCategory: '',
      filterParams: {},
    }
  },
  computed: {
    ...mapGetters(['movies', 'paginationMovies', 'masterclass', 'paginationMasterclass', 'story', 'paginationStory']),
    getPagination() {
      return this.paginationMovies
    },
    getPaginationM() {
      return this.paginationMasterclass
    },
    getPaginationS() {
      return this.paginationStory
    },
    getAllMovies() {
      return this.movies.map((movie, index) => {
        return {
          ...movie,
          index: this.paginationMovies?.current ? index + (this.paginationMovies.current - 1) * 10 + 1 : index + 1,
        }
      })
    },
    getAllMasterclass() {
      return this.masterclass.map((movie, index) => {
        return {
          ...movie,
          index: this.paginationMasterclass?.current
            ? index + (this.paginationMasterclass.current - 1) * 10 + 1
            : index + 1,
        }
      })
    },
    getAllStory() {
      return this.story.map((movie, index) => {
        return {
          ...movie,
          index: this.paginationStory?.current ? index + (this.paginationStory.current - 1) * 10 + 1 : index + 1,
        }
      })
    },
  },
  mounted() {
    this.getMovies()
    this.getMasterclass(this.getPaginationM).then(() => {
      this.searchForm.searchKey = this.getPaginationM.search
      this.loading = false
    })
    // this.getMasterclass()
    this.getStory(this.getPaginationS).then(() => {
      this.searchForm.searchKey = this.getPaginationS.search
      this.loading = false
    })
    this.getGenres()
    this.getCountries()
    this.getCategories()
  },
  beforeDestroy() {},
  methods: {
    ...mapActions(['getMasterclass', 'getStory']),
    callback(key) {
      this.activeTabKey = parseInt(key)
      this.$router.push({ name: this.$route.name, query: { keys: key } })
    },
    handleTableChange(pagination) {
      this.paginations = pagination

      if (pagination.current > 1) {
        this.numberPage = pagination.current * 10 + 1
      } else {
        this.numberPage = null
      }

      this.getMovies()
    },
    handleTableChangeM(pagination) {
      const paginationNew = {
        ...pagination,
        lang: 'ru',
        search: null,
      }
      this.getMasterclass(paginationNew)
        .then((res) => console.log(res))
        .catch((err) => this.requestFailed(err))
    },
    handleTableChangeS(pagination) {
      const paginationNew = {
        ...pagination,
        lang: 'ru',
        search: null,
      }
      this.getStory(paginationNew)
        .then((res) => console.log(res))
        .catch((err) => this.requestFailed(err))
    },
    onPressEnter(e) {
      e.preventDefault()
      // this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal(userId) {
      this.getselectedMovie(userId)
      this.previewVisible = true
    },
    showSeasons(id) {
      this.$router.push({
        name: 'SeasonsList',
        params: {
          movieId: id,
        },
      })
    },
    getselectedMovie(selectedMovie) {
      request({
        url: '/movies/' + selectedMovie,
        method: 'get',
      }).then((response) => {
        this.selectedMovie = response.category
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    deleteMovie(e, movie) {
      const data = {
          // file_info: movie?.file_info,
          key: movie?.slug,
      }
      request({
        url: '/movies/' + movie?.slug,
        method: 'delete',
        data
      })
        .then((res) => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getMovies()
          // this.getMasterclass()
          this.getStory()
        })
        .then((err) => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    deleteMasterclass(e, id) {
      request({
        url: '/movies/' + id,
        method: 'delete',
      })
        .then((res) => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getMasterclass()
        })
        .then((err) => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSearchChange() {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
              this.getMovies()
        // this.getMovies({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
        // this.getStory({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
        // this.getMasterclass({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
      }, 750)

    },
    // search(e) {
    //   e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       this.getMovies({ current: 1, pageSize: 10, search: values['search'] })
    //       this.getStory({ current: 1, pageSize: 10, search: values['search'] })
    //       this.getMasterclass({ current: 1, pageSize: 10, search: values['search'] })
    //     }
    //   })
    // },
    getGenres(e, id) {
      request({
        url: '/genres',
        method: 'get',
      })
        .then((res) => {
          console.log('res', res)
          this.genres = res?.genres ?? []
        })
    },
    getCategories () {
      request({
          url: '/categories',
          method: 'get',
          params: { page: 1, limit: 1000, lang: 'ru', active: true }
        })
        .then(result => {
          this.categories = result.categories ?? []
        })
    },
     getCountries(e, id) {
      request({
        url: '/country',
        method: 'get',
      })
        .then((res) => {
          const newList = []
           if (res?.countries?.length) {
            res.countries.forEach(element => {
              if (element.slug !== 'uzbekistan') {
                newList.push(element)
              } else {
                newList.unshift(element)
              }
            });
          }
          this.countries = newList
        })
    },
    getMovies (params) {
      const newParams = {
        genre: this.activeGenre,
        category: this.activeCategory,
        content_owner: this.activeOwner,
        countries: this.activeCountry,
        limit: this.paginations.pageSize,
        page: this.paginations.current,
        search: this.paginations.search
      }
      if (this.editActive) {
        newParams.active = this.filterActive
        newParams.inactive = !this.filterActive
      }
      request({
          url: '/movies',
          method: 'get',
          params: { lang: this.lang, ...newParams }
        })
          .then(response => {
            console.log('response?.count_all', response?.count_all);
            this.paginations.total = response.count
            this.moviesList = response?.movies?.map((el, i) => ({ ...el, index: i + (this.numberPage ? this.numberPage - 10 : 1) }))
            this.totalCount = this.activeOwner ? response.count_by_content_owner : response.count_all
          }).finally(() => {
            this.loading = false
          })
    },
     handleOwnerStatus (el) {
      this.paginations.current = 1
      this.getMovies({ content_owner: el })
    },
    handleCategoryStatus (el) {
      this.paginations.current = 1
      this.getMovies({ category: el })
    },
    handleGenreStatus (el) {
      this.paginations.current = 1
      this.getMovies({ genre: el })
    },
    handleCountriesStatus (el) {
      this.paginations.current = 1
      this.getMovies({ countries: el })
    },
    handleActiveStatus (el) {
      this.paginations.current = 1
      this.numberPage = null
      this.editStatus = false
      this.handleEditStatus()
      this.getMovies({ active: el })
    },
    handleEditActive (val) {
      this.editActive = val
      this.getMovies()
    },
    handleStatusMovies (val) {
      const data = this.checkedList.map((item) => ({
        movie_slug: item,
        movie_status: val
      }))
      request({
        url: '/movie-status-update',
        method: 'put',
        data: {
          movie_info: data
        }
      }).then((response) => {
        this.handleEditStatus()
        this.getMovies()
      })
    },
    handleEditStatus (status) {
      this.editStatus = status
      this.checkedList = []
      this.movieStatus = this.filterActive
      
      if (status) {
         this.columns.unshift({
          title: '',
          width: 40,
          scopedSlots: { customRender: 'editStatus' }
        })
      } else {
        this.columns = this.columns.filter((i) => i.title !== '')
      }
    },  
    handleCheckStatus (el) {
      if (!this.checkedList.includes(el.slug)) {
        this.checkedList.push(el.slug)
      } else this.checkedList = this.checkedList.filter((i) => i !== el.slug)
    },
    clearFilters () {
      this.activeOwner = ''
      this.activeCategory = ''
      this.activeGenre = ''
      this.activeCountry = ''
      this.getMovies()
    }
  },
  watch: {
    'paginationMovies.current'(val) {
      console.log('pagination val', val)
    },
  },
}
</script>

<style scoped>
.image {
  width: 100px;
  height: 130px;
  object-fit: fill;
}
.countAll {
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  position: absolute;
  left: 0;
  bottom: 15px;
  font-weight: 700;
}
.countAll span:last-child {
  font-size: 18px;
}
.flex {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.checkbox {
  width: 25px;
  height: 25px;
  border: 1px solid #ececec;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox.active {
  border-color: #0166f3;
}
.checkbox:hover {
  border-color: #0166f3;
}

</style>
