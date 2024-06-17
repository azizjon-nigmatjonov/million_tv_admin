<template>
  <div>
    <template>
      <div>
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="featuredList"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
            <a-tab-pane key="1" :tab="$t('basicDetails')">
              <a-row>
                <a-row>
                  <a-col :xs="24" style="padding: 0 15px">
                    <a-form-model-item :label="$t('status')" prop="is_on_menu">
                      <a-switch
                        v-model="featuredList.active"
                        :checked-children="$t('active')"
                        :un-checked-children="$t('inactive')"
                        default-checked
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <!-- Image Uploading -->
                <a-row v-if="this.$route.query.is_selection">
                  <a-col :xs="24" :md="12" style="padding: 0 15px">
                    <a-form-model-item :label="$t('image')" prop="image">
                      <a-upload
                        name="file"
                        list-type="picture-card"
                        class="avatar-uploader"
                        accept="image/*"
                        :show-upload-list="false"
                        :action="`${VUE_APP_API_BASE_URL}image-upload`"
                        :before-upload="beforeUploadLogo"
                        @change="handleChangeLogoImage"
                      >
                        <img v-if="featuredList.imageUrlLogo" :src="featuredList.imageUrlLogo" alt="avatar" />
                        <div v-else>
                          <a-icon :type="loadingLogo ? 'loading' : 'plus'" />
                          <div class="ant-upload-text">
                            {{ $t('upload') }}
                          </div>
                        </div>
                      </a-upload>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-col :xs="24" :md="10" style="padding: 0 15px">
                  <a-form-model-item :label="$t('title')" prop="title">
                    <a-input v-model="featuredList.title" :disabled="disabledType" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="10" style="padding: 0 15px">
                  <a-form-model-item :label="$t('URL')" prop="url">
                    <a-input v-model="featuredList.slug" disabled />
                  </a-form-model-item>
                </a-col>

                <a-col v-if="!this.$route.query.is_selection" :xs="24" :md="4" style="padding: 0 15px">
                  <a-form-model-item :label="$t('order')" prop="order">
                    <a-input :disabled="disabledType" v-model="featuredList.order" type="number" />
                  </a-form-model-item>
                </a-col>
                <a-col v-if="!this.$route.query.is_selection" :span="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('description')" prop="description">
                    <a-textarea
                      :disabled="disabledType"
                      :auto-size="{ minRows: 8, maxRows: 10 }"
                      v-model="featuredList.description"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-tab-pane>

            <a-tab-pane key="2" :tab="$t('movies')">
              <a-row>
                <a-button type="primary" style="margin: 10px; float: right" @click="onAddRelatedMovie">
                  {{ $t('add') }}
                </a-button>
                <a-modal v-model="addRelatedMovieModal" width="800px" :title="$t('addMovie')">
                  <a-select
                    v-model="newRelatedMovies"
                    mode="multiple"
                    style="width: 100%"
                    show-search
                    :placeholder="$t('movies')"
                    :auto-clear-search-value="false"
                    :show-arrow="true"
                    :filter-option="false"
                    @deselect="onDeselectMovie"
                    @select="onSelectMovie"
                    :not-found-content="fetchingMovies ? undefined : $t('movieNotFound')"
                    @search="fetchMovies"
                  >
                    <a-spin v-if="fetchingMovies" slot="notFoundContent" size="small" />
                    <a-select-option v-for="addingMovie in allMovies" :key="addingMovie.id">
                      {{ addingMovie.title }}
                    </a-select-option>
                  </a-select>
                  <template slot="footer">
                    <a-button key="submit" type="primary" @click="handleOk">
                      {{ $t('save') }}
                    </a-button>
                  </template>
                </a-modal>
              </a-row>
              <div class="wrapper">
                <div class="header">
                  <div class="item">
                    <div class="column" style="width: 122px">No</div>
                    <div class="column" style="width: 100%">Название</div>
                    <div class="column" style="width: 100%">Слоган</div>
                    <div class="column" style="width: 140px">Действя</div>
                  </div>
                </div>

                <div class="body">
                  <draggable
                    :list="featuredList.movies"
                    :disabled="!enabled"
                    class="list-group"
                    handle=".handle"
                    ghost-class="ghost"
                    @start="dragging = true"
                    @end="
                      () => {
                        dragging = false
                        updateElements(featuredList.movies)
                      }
                    "
                  >
                    <div class="item" v-for="(element, index) in featuredList.movies" :key="element.name">
                      <div class="column" style="width: 90px">
                        <div class="handle">
                            <img src="../../assets/icons/draggable.png" alt="image" />
                        </div>
                      
                        <div style="margin-left:auto">{{ element.order_number > 1 ? element.order_number : index + 1 }}</div>
                      </div>
                      <span class="column" style="width: 100%">{{ element.title }}</span>
                      <span class="column" style="width: 100%">{{ element.slogon }}</span>
                      <span class="column" style="width: 175px">
                        <a-popconfirm
                          v-action:delete
                          placement="left"
                          slot="extra"
                          :title="$t('deleteMsg')"
                          @confirm="deleteElement($event, element.slug)"
                          :okText="$t('yes')"
                          :cancelText="$t('no')"
                          ><a-tooltip placement="topRight"
                            ><template slot="title">{{ $t('delete') }}</template>
                            <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                          </a-tooltip>
                        </a-popconfirm>
                      </span>
                    </div>
                  </draggable>
                </div>
              </div>
              <!-- <a-table bordered :columns="columns" :pagination="true" :data-source="featuredList.movies">
                <template slot="action" slot-scope="text, index">
                  <a-popconfirm
                    placement="left"
                    slot="extra"
                    :title="$t('deleteMsg')"
                    @confirm="deleteRelatedMovie($event, index)"
                    :okText="$t('yes')"
                    :cancelText="$t('no')"
                  >
                    <a-tooltip placement="topRight"
                      ><template slot="title">{{ $t('delete') }}</template>
                      <a-button type="danger" icon="delete"></a-button>
                    </a-tooltip>
                  </a-popconfirm>
                </template>
              </a-table> -->
            </a-tab-pane>

            <a-tab-pane v-if="this.featuredListId === 'banner'" key="5" :tab="'Новости'">
              <div class="news-block">
                <div v-for="(el, index) in news" :key="index">
                  <a-col :xs="24" :md="10" style="padding: 0 15px">
                    <a-form-model-item :label="$t('tv')" prop="is_on_menu">
                      <a-switch
                        v-model="el.is_tvchannel"
                        :checked-children="$t('active')"
                        :un-checked-children="$t('inactive')"
                        default-checked
                      />
                    </a-form-model-item>
                    <!-- @change="
                          tvData.tv_channel_id = ''
                          tvData.is_tvchannel = !tvData.is_tvchannel
                        " -->

                    <a-form-model-item :label="$t('title')">
                      <a-input v-model="el.title" />
                    </a-form-model-item>

                    <a-form-model-item :label="$t('description')">
                      <a-input v-model="el.text" />
                    </a-form-model-item>

                    <a-form-model-item v-if="!el.is_tvchannel" :label="$t('URL')">
                      <a-input v-model="el.link" :disabled="false" />
                    </a-form-model-item>
                    <a-form-model-item v-else :label="$t('tv')">
                      <a-select
                        v-model="el.tv_channel_id"
                        style="width: 100%"
                        show-search
                        :placeholder="$t('movies')"
                        :auto-clear-search-value="false"
                        :show-arrow="true"
                        :filter-option="false"
                        @deselect="onDeselectBanner"
                        @select="onSelectBanner"
                        :not-found-content="tvData.loading ? undefined : $t('movieNotFound')"
                        @search="getTvChanelsList"
                      >
                        <a-spin v-if="fetchingMovies" slot="notFoundContent" size="small" />
                        <a-select-option v-for="element in tvData.list" :key="element.id">
                          {{ element.title_ru }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :md="10" style="padding: 0 15px">
                    <a-form-model-item :label="$t('image')" prop="">
                      <a-upload
                        name="file"
                        list-type="picture-card"
                        class="avatar-uploader"
                        accept="image/*"
                        :show-upload-list="false"
                        :action="`${VUE_APP_API_BASE_URL}image-upload`"
                        :before-upload="beforeUploadNewsLogo"
                        @change="(info) => handleChangeLogoImageNews(info, index)"
                      >
                        <img v-if="el.imageUrl" :src="el.imageUrl" alt="avatar" />
                        <div v-else>
                          <a-icon :type="el.imageLoading ? 'loading' : 'plus'" />
                          <div class="ant-upload-text">
                            {{ $t('upload') }}
                          </div>
                        </div>
                      </a-upload>
                    </a-form-model-item>
                  </a-col>
                  <a-col span="auto">
                    <a-button type="danger" @click="deleteRow(el, index)">Удалить новость</a-button>
                  </a-col>

                  <video-uploader
                    :value="el.video"
                    :deleteVideo="deleteVideo"
                    :index="index"
                    @change="(val) => newsVideoChangeHandler(val, index, el)"
                  />

                  <a-divider />
                </div>

                <a-button @click="addNews" size="large" type="primary">{{ $t('add') }}</a-button>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form-model>
      </div>
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import VideoUploader from '@/components/ViedoUploader.vue'
import draggable from 'vuedraggable'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  props: ['lang', 'currentLang'],
  components: {
    VideoUploader,
    draggable,
  },
  data() {
    return {
      enabled: true,
      dragging: false,
      selectTvActive: false,
      bannerActive: false,
      disabledType: false,
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      featuredListId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      activeTabKey: '1',
      moviesForTable: [],
      other: '',
      allSearchedMovies: [],
      fetchingMovies: false,
      newRelatedMovies: [],
      bannerSelectedList: [],
      addRelatedMovieModal: false,
      country: 'Uzbekistan',
      allMovies: [],
      loading: false,
      loadingLogo: false,
      loadingLogoNews: false,
      tvData: {
        loading: false,
        list: [],
      },
      news: [
        {
          title: '',
          text: '',
          image: '',
          video: '',
          link: 'https://example.com/',
          imageUrl: '',
          imageLoading: false,
          is_tvchannel: false,
          tv_channel_id: '',
        },
      ],
      newsImageLogo: '',
      featuredList: {
        title: null,
        slug: '',
        movies: [],
        order: null,
        description: '',
        active: false,
        lang: 'ru',
        imageUrlLogo: '',
        image: '',
      },
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '60px',
          align: 'center',
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
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        tariff_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        image: [{ required: true, message: this.$t('required'), trigger: 'change' }],
      },
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
        },
      },
      number: null,
    }
  },
  mounted() {
    this.disabledType = this.$route.params.id === 'banner'
    if (this.featuredListId) this.getFeaturedListAttrs()
    this.getAllMovies()
    this.getTvChanelsList()
  },
  computed: {
    ...mapGetters(['genres']),
  },
  methods: {
    ...mapActions(['getFeaturedMovies']),

    getTvChanelsList(search) {
      const params = {}
      params.search = search
      this.tvData.loading = true
      request({
        url: '/tv/channel',
        params,
      })
        .then((res) => {
          this.tvData.list = res?.tv_channels ?? []
        })
        .finally(() => {
          this.tvData.loading = false
        })
    },

    updateElements(list) {
      if (!list.length) return

      let data = {}
      list.forEach((element, index) => {
        data[element.slug] = index + 1
      })
      this.$emit('handleList', { ordered: data })
      this.currentLang = 'default'
    },

    deleteElement(e, id) {
      request({
        url: '/featured-list' + id,
        method: 'delete',
      })
        .then((res) => {
          this.$message.success(this.$t('successfullyDeleted'))
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
        .finally(() => this.getFeaturedListAttrs())
    },

    deleteVideo(index3) {
      this.news[index3].video = ''
      // this.news = this.news.map((el, idx) => idx === index3 ? { ...el, video: '' } : el)
    },
    deleteRow(element, idx) {
      this.news = this.news.filter((el, index) => index !== idx)
    },
    getFeaturedListAttrs() {
      request({
        url: '/featured-list/' + this.featuredListId,
        method: 'get',
        params: { lang: this.lang, limit: 1000, page: 1 },
      }).then((response) => {
        this.featuredList.description = response.featured_list.description
        this.featuredList.title = response.featured_list.title
        this.featuredList.order = response.featured_list.order
        this.featuredList.slug = response.featured_list.slug
        this.featuredList.active = response.featured_list.active
        this.featuredList.movies = response.featured_list.movies.map((el, ind) => ({
          ...el,
          index: ind + 1,
        }))
        this.params.pagination.total = response.count
        this.featuredList.image =
          response.featured_list.image.split('/')[response.featured_list.image.split('/').length - 1]
        this.featuredList.imageUrlLogo = response.featured_list.image
        this.news = response.featured_list.news?.map((el) => ({ ...el, imageUrl: el.image, imageLoading: false })) ?? []
      })
    },
    addNews() {
      this.news.push({
        title: '',
        text: '',
        image: '',
        video: '',
        link: '',
        imageUrl: '',
        imageLoading: false,
        is_tvchannel: false,
        tv_channel_id: '',
      })
    },
    newsVideoChangeHandler(val, index, item) {
      console.log(val, index, item)
      this.news[index].video = val
    },
    changePagination(e) {
      if (e.current > 1) {
        this.number = e.current * 10 + 1
      } else {
        this.number = null
      }
      this.params.pagination = e
      this.getFeaturedListAttrs()
    },
    handleChangeLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          // console.log('imageUrl11', imageUrl)
          // console.log('filename11', info.file.response.filename)
          this.featuredList.imageUrlLogo = imageUrl
          this.loadingLogo = false
          this.featuredList.image = info.file.response.filename
        })
      }
    },
    handleChangeLogoImageNews(info, index) {
      if (info.file.status === 'uploading') {
        this.news[index].imageLoading = true
        this.news[index].imageUrl = ''
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.news[index].imageLoading = false
          this.news[index].imageUrl = imageUrl
          this.news[index].image = info.file.response.filename
        })
      }
    },
    onAddRelatedMovie() {
      this.newRelatedMovies = this.featuredList.movies.map((movie) => {
        return movie.id
      })
      this.allMovies = [
        ...this.featuredList.movies,
        ...this.allMovies.filter((movie) => {
          return this.newRelatedMovies.indexOf(movie.id) < 0
        }),
      ]
      this.addRelatedMovieModal = true
      this.moviesForTable = this.featuredList.movies
    },
    handleOk() {
      this.featuredList.movies = this.moviesForTable
      this.addRelatedMovieModal = false
    },
    onSelectMovie(movie) {
      this.moviesForTable.push(
        this.allMovies.filter((movie1) => {
          return movie1.id === movie
        })[0]
      )
      // console.log(this.moviesForTable)
      // console.log(this.newRelatedMovies)
    },
    onSelectBanner(element) {
      console.log('element', element)
    },
    onDeselectBanner(element) {
      console.log('element 2', element)
    },
    onDeselectMovie(movie) {
      var pos
      this.moviesForTable.map((movie1, index) => {
        if (movie1.id === movie) pos = index
      })
      this.moviesForTable.splice(pos, 1)
    },
    deleteRelatedMovie(event, given) {
      var deleting
      this.featuredList.movies.map((movie, index) => {
        if (movie.id === given.id) {
          deleting = index
        }
      })
      this.featuredList.movies.splice(deleting, 1)
    },
    getAllMovies() {
      request({
        url: '/movies',
        method: 'get',
        params: { lang: this.lang },
      }).then((response) => {
        this.allMovies = response.movies
        this.allSearchedMovies = response.movies
      })
    },
    activeTabHandler(_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    fetchMovies(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.allMovies = []
      this.fetchingMovies = true

      request({
        url: '/movies',
        params: { lang: this.lang ? this.lang : 'ru', search: value },
      }).then((body) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return
        }
        const data = body.movies.map((movie) => ({
          ...movie,
        }))
        this.allMovies = data
        this.fetchingMovies = false
      })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var url = '/featured-list'
            var method = 'post'
            const data = {
              title: this.featuredList.title,
              movies: this.featuredList.movies
                .map((movie) => {
                  return movie.id
                })
                .join(','),
              order: this.$route.query.is_selection ? 0 : parseInt(this.featuredList.order),
              description: this.$route.query.is_selection ? '' : this.featuredList.description,
              active: this.featuredList.active,
              lang: this.lang ? this.lang : 'ru',
              image: this.featuredList.image,
              is_selection: JSON.parse(this.$route.query.is_selection),
              news: this.news?.map((el) => ({
                ...el,
                link: el.link ? el.link : 'https://example.com',
                image: el.image ? el.image.split('/')?.pop() : '',
                video: el.video?.split('/')[el.video.split('/').length - 1].split('+')[0],
                tv_channel_id: el.tv_channel_id,
                is_tvchannel: el.is_tvchannel,
              })),
            }
            if (this.featuredListId) {
              url = '/featured-list/' + this.featuredListId
              method = 'put'
              request({
                url: url,
                method: method,
                data: data,
              })
                .then((res) => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  if (e) {
                    this.$router.replace('/featured-movies/list')
                    this.getFeaturedMovies()
                  }
                  resolve()
                })
                .catch((err) => {
                  if (err) {
                    this.$message.error(this.$t('error'))
                  }
                  reject(err)
                })
            } else {
              request({
                url: url,
                method: method,
                data: data,
              })
                .then((res) => {
                  this.getFeaturedListAttrs()
                  this.$router.replace('/featured-movies/list')
                  resolve()
                })
                .catch((err) => {
                  if (err) {
                    this.$message.error(this.$t('error'))
                  }
                  reject(err)
                })
            }
          } else {
            reject(valid)
          }
        })
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    beforeUploadLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('Пожалуйста, загрузите jpg файл')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('Изображение должно быть меньше 5 мб!')
      }
      return isJpgOrPng && isLt2M
    },
    beforeUploadNewsLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('Пожалуйста, загрузите jpg файл')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('Изображение должно быть меньше 5 мб!')
      }
      return isJpgOrPng && isLt2M
    },
  },
}
</script>
<style>
.ant-form-item-control {
  line-height: normal !important;
}

.news-block {
  display: flex;
  flex-direction: column;
}
@media (max-width: 760px) {
  .ant-form-item {
    margin: 0;
  }
  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
}

.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.wrapper {
  border: 1px solid #e8e8e8;
}

.wrapper .header {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;

  .item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    &:last-child {
      border: none;
    }

    .column {
      border-right: 1px solid #e8e8e8;
      padding: 20px;
      display: flex;
      align-items: center;

      &:last-child {
        border: none;
      }
    }
  }
}

.wrapper .body {
  .item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    cursor: pointer;
    &:last-child {
      border: none;
    }
    .column {
      border-right: 1px solid #e8e8e8;
      padding: 20px;
      display: flex;
      align-items: center;

      &:last-child {
        border: none;
      }
    }
  }
}
</style>
