<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('categories') }}</a-breadcrumb-item>
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
      <DnDTable />
      <!-- <a-table
        v-action:get
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllCategories"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row">
          <router-link v-action:update :to="'./update/'+row.slug" >
            <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            v-action:delete
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCategory($event, row.slug)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          ><a-tooltip placement="topRight"><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table> -->
    </a-card>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('title_uz')">
          {{ selectedCategory.title_uz ? selectedCategory.title_uz : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('title_ru')">
          {{ selectedCategory.title_ru ? selectedCategory.title_ru : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('tariff')">
          {{ selectedCategory.title_en ? selectedCategory.title_en : '' }}
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
import DnDTable from './CategoriesDnD'
export default {
  components: { DnDTable },
  data () {
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
      selectedCategory: { tariff_details: { name: '' } },
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['categories', 'paginationCategories']),
    getPagination () {
      console.log('cat', this.paginationCategories)
      return this.paginationCategories
    },
  },
  mounted () {
    this.getCategories(this.getPagination).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
      console.log(this.categories)
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getCategories']),
    handleTableChange (pagination) {
      const paginationNew = {
        ...pagination,
        search: null
      }
      this.getCategories(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    onPressEnter (e) {
      e.preventDefault()
      this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal (userId) {
      this.getselectedCategory(userId)
      this.previewVisible = true
    },
    getselectedCategory (selectedCategory) {
      request({
        url: '/categories/' + selectedCategory,
        method: 'get'
      }).then((response) => {
        this.selectedCategory = response.category
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteCategory (e, id) {
      request({
              url: '/categories/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getCategories({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
          }).catch(err => {
        if (err) {
          this.$message.error(err.response.data.message.substr(34))
        }
      })
    },
    onSearchChange () {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getCategories({ current: 1, pageSize: 10, search: this.searchForm.searchKey, active: false })
      }, 750)
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getCategories({ current: 1, pageSize: 10, search: values['search'] })
        }
      })
    }
  }
}
</script>
