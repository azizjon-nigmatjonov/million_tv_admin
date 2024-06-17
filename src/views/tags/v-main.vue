<template>
  <div>
    <template>
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="tag"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <!-- Title -->
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="tag.title" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Color -->
          <div style="margin: 0 15px">Цвет</div>
          <a-row :xs="24" :md="12" style="margin: 0 15px 15px" :class="active ? 'flex active' : 'flex'">
            <div v-for="color in colorsArr" :key="color.id">
              <div class="color" :style="color.style" @click="toggle(color.id)"></div>
            </div>
            <div>
              <div class="color plus">
                <a-button type="default" icon="plus"></a-button>
                <input class="hidden" type="color" @change="addColor" />
              </div>
            </div>
          </a-row>
          <!-- Status -->
          <a-col :xs="4" style="padding: 0 15px">
            <a-form-model-item :label="$t('status')" prop="active">
              <a-switch
                v-model="tag.active"
                :checked-children="$t('active')"
                :un-checked-children="$t('inactive')"
                default-checked
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      active: !this.$route.params.id,
      colorsArr: [
        {
          id: 1,
          active: false,
          style: {
            backgroundColor: '#1AC19D'
          }
        },
        {
          id: 2,
          active: false,
          style: {
            backgroundColor: '#A23FEE'
          }
        },
        {
          id: 3,
          active: false,
          style: {
            backgroundColor: '#F8C51B'
          }
        },
        {
          id: 4,
          active: false,
          style: {
            backgroundColor: '#0E73F6'
          }
        },
        {
          id: 5,
          active: false,
          style: {
            backgroundColor: '#FF9100'
          }
        },
        {
          id: 6,
          active: false,
          style: {
            backgroundColor: '#FC4F4F'
          }
        }
      ],
      tagId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      country: 'Uzbekistan',
      loading: false,
      tag: {
        title: '',
        active: true,
        color: null
      },
      rules: {
        alias: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        tariff_id: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String
  },
  computed: {
    ...mapGetters(['paginationTags']),
    computedColor() {
      return this.colorsArr.find(color => color.active === true)
    }
  },
  mounted() {
    if (this.tagId) this.getTagAttrs()
  },
  methods: {
    ...mapActions(['getTags']),
    toggle(id) {
      this.active = !this.active
      this.colorsArr.forEach(color => {
        if (color.id === id) {
          color.active = true
        } else {
          color.active = false
        }
      })
    },
    addColor(e) {
      if (this.colorsArr.length <= 6) {
        console.log('Color is added')
        this.colorsArr.forEach(color => {
          color.active = false
        })
        this.colorsArr.push({
          id: this.colorsArr.length + 1,
          active: true,
          style: {
            backgroundColor: e.target.value
          }
        })
      } else {
        console.log('Color is modified')
        this.colorsArr.forEach(color => {
          color.active = false
        })
        let color7 = this.colorsArr.find(color => color.id === 7)
        color7.style.backgroundColor = e.target.value
        color7.active = true
        this.active = false
      }
    },
    getTagAttrs() {
      request({
        url: '/tags/' + this.tagId,
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        console.log('response', response)
        if (response.tag.color) {
          this.colorsArr.push({
            id: this.colorsArr.length + 1,
            active: true,
            style: {
              backgroundColor: response.tag.color
            }
          })
        }
        this.tag.title = response.tag.title
        this.tag.active = response.tag.active
        this.tag.color = response.tag.color
      })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/tags'
            var method = 'post'
            if (this.tagId) {
              url = '/tags/' + this.tagId
              method = 'put'
              const headers = {
                'Content-Type': 'application/json'
              }
              request({
                url: url,
                method: method,
                data: {
                  title: this.tag.title,
                  active: this.tag.active,
                  color: this.computedColor.style.backgroundColor,
                  lang: this.lang
                },
                headers: headers
              })
                .then(res => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  if (e === 'exit') {
                    this.$router.replace('/tag/list')
                    this.getTags({ pageSize: 10, current: 1, search: this.paginationTags.search })
                  }
                  resolve()
                })
                .catch(err => {
                  if (err) {
                    console.log(err)
                    this.$message.success(this.$t('error'))
                  }
                  reject(err)
                })
            } else {
              request({
                url: url,
                method: method,
                data: {
                  title: this.tag.title,
                  active: this.tag.active,
                  color: this.computedColor.style.backgroundColor,
                  lang: this.lang
                }
              })
                .then(res => {
                  this.getTags({ pageSize: 10, current: 1, search: this.paginationTags.search })
                  this.$router.replace('/tag/list')
                  resolve()
                })
                .catch(err => {
                  if (err) {
                    console.log(err)
                    this.$message.success(this.$t('error'))
                  }
                  reject(err)
                })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  },
  watch: {
    computedColor(activeColor) {
      let activeColorIndex = this.colorsArr.indexOf(activeColor)
      if (activeColorIndex !== 0) {
        this.colorsArr.splice(activeColorIndex, 1)
        this.colorsArr.unshift(activeColor)
        this.active = false
      }
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
.flex {
  height: 50px;
  width: 50px;
  display: flex;
  gap: 5px;
  align-items: center;
  overflow: hidden;
  transition: width 0.5s ease-in-out;
}

.active {
  width: 800px;
}

.color {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}

.color:hover {
  width: 42px;
  height: 42px;
}

.plus {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.hidden {
  position: absolute;
  width: 40px;
  height: 40px;
  opacity: 0;
  cursor: pointer;
}
</style>
