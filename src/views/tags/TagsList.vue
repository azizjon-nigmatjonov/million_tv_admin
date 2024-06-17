<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('tags') }}</a-breadcrumb-item>
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
                <a-input
                  id="inputSearch"
                  :placeholder="$t('search') + '...'"
                  @change="onSearchChange"
                  v-model="searchForm.searchKey"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <a-table
        v-action:get
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllTags"
        :pagination="paginationTags"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row">
          <!-- <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button style="margin-right: 6px" id="buttonPreview" type="default" @click="showPreviewModal(row.slug)" icon="eye"></a-button>
          </a-tooltip> -->
          <router-link v-action:update :to="'./update/' + row.slug">
            <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCategory($event, row.slug)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip placement="topRight" ><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('title_uz')">
          {{ selectedTag.title_uz ? selectedTag.title_uz : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('title_ru')">
          {{ selectedTag.title_ru ? selectedTag.title_ru : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('title_en')">
          {{ selectedTag.title_en ? selectedTag.title_en : '' }}
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
  name: 'TagsList',
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
      selectedTag: {},
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['tags', 'paginationTags']),
    getAllTags() {
      return this.tags.map((tag, index) => {
        return {
          ...tag,
          index: this.paginationTags?.current ? index + ((this.paginationTags.current - 1) * 10) + 1 : index + 1
        }
      })
    }
  },
  mounted() {
    this.getTags({ current: this.paginationTags.current, pageSize: 10, search: this.paginationTags.search, active: false }).then(() => {
      this.searchForm.searchKey = this.paginationTags.search
      this.loading = false
      console.log(this.tags)
    })
  },
  beforeDestroy() {},
  methods: {
    ...mapActions(['getTags']),
    handleTableChange(pagination) {
      const paginationNew = {
        ...pagination,
        search: null
      }
      this.getTags(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    showPreviewModal(userId) {
      this.getSelectedTag(userId)
      this.previewVisible = true
    },
    getSelectedTag(selectedTag) {
      request({
        url: '/tags/' + selectedTag,
        method: 'get'
      }).then(response => {
        this.selectedTag = response.tag
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    deleteCategory(e, id) {
      request({
        url: '/tags/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getTags({ current: 1, pageSize: 10, search: this.paginationTags.search })
        })
        .catch(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSearchChange() {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getTags({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
      }, 750)
    },
    search(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getTags({ current: 1, pageSize: 10, search: values['search'] })
        }
      })
    }
  }
}
</script>
