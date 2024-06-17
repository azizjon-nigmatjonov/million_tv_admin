<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('staff') }}</a-breadcrumb-item>
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
        :dataSource="getStaffData"
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
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteStaff($event, row.slug)"
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
        <a-descriptions-item :label="$t('first_name')">
          {{ selectedActor.first_name ? selectedActor.first_name : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('last_name')">
          {{ selectedActor.last_name ? selectedActor.last_name : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('photo')">
          <img :src="selectedActor.photo"/>
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
          title: this.$t('first_name'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('last_name'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('position'),
          dataIndex: 'positionJoined'
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
      selectedActor: {},
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['staff', 'paginationStaff']),
    getPagination () {
      return this.paginationStaff
    },
    getStaffData () {
      return this.staff ? this.staff.map((staff, index) => {
        return {
          ...staff,
          index: this.paginationStaff?.current ? index + ((this.paginationStaff.current - 1) * 10) + 1 : index + 1,
          positionJoined: staff.position ? staff.position.map(pos => {
            return this.$t(pos)
          }).join(', ') : ''
        }
      }) : []
    }
  },
  mounted () {
    this.getStaff(this.paginationStaff).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
      console.log(this.staff)
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getStaff']),
    handleTableChange (pagination) {
      const paginationNew = {
        ...pagination,
        lang: 'ru',
        search: null
      }
      this.getStaff(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    onPressEnter (e) {
      e.preventDefault()
      this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal (userId) {
      this.getSelectedActor(userId)
      this.previewVisible = true
    },
    getSelectedActor (selectedActor) {
      request({
        url: '/staff/' + selectedActor,
        method: 'get'
      }).then((response) => {
        this.selectedActor = response.actor
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteStaff (e, id) {
      request({
              url: '/staff/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getStaff()
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    onSearchChange () {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getStaff({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
      }, 750)
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getStaff({ current: 1, pageSize: 10, search: values['search'] })
        }
      })
    }
  }
}
</script>
