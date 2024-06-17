import Vue from 'vue'
import './Converters'
const DateFormat = {
  install (Vue, options) {
    Vue.prototype.$date = data => new Date(data)

    Vue.prototype.$getBase64 = file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }

    Vue.prototype.$alertMessage = (type = 'success', title = '', desc = '', t) => {
        t.$notification[type]({
          message: title,
          description: desc,
          duration: 2
        })
    }
    Vue.prototype.$filterOption = (input, option) => {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    Vue.prototype.$deleteFromList = (arr, id) => {
      arr.splice(arr.findIndex(el => el.id === id), 1)
  }
    Vue.prototype.$orderNumber = (pagination, idx) => {
      return pagination.current * 10 - 10 + idx + 1
  }

  Vue.prototype.$formValidationError = (type = 'success', title = '', desc = '', t) => {
    t.$notification[type]({
      message: title,
      class: 'notify_style',
      // style: { backgroundColor: '#ca5454', color: 'white !important' },
      description: desc,
      duration: 2
    })
}
    Vue.prototype.$isValid = (t) => {
      let flag = null
      t.$refs.ruleForm.validate(valid => {
        if (valid) {
          flag = true
          return true
        } else {
          flag = false
          console.log('error submit!!')
          return false
        }
      })
      return flag
  }
    Vue.prototype.$isEmptyObj = (params) => {
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        return true
      } else return false
    }

    Vue.prototype.$moneyFormat = (str) => {
      if (!str) return '0.00'
      return str.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')
    }
    Vue.prototype.$cardNumberFormat = (str) => {
      return str.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/, '')
    }

    Vue.prototype.$setupQuery = (t) => {
      if (t.$isEmptyObj(t.$route.query)) { t.$router.push({ path: t.$route.fullPath, query: { offset: (t.pagination.current - 1) * 10, limit: 10 } }) }
      t.pagination.current = (t.$route.query.offset / t.$route.query.limit) + 1
    }

    Vue.prototype.$uploadImage = async (file, fileList, t) => {
      const formData = new FormData()
      formData.append('file', file)
      const url = await t.$getBase64(file)
      t.$store.dispatch('uploadImage', formData).then(res => {
        console.log(res)
        fileList.push({
          uid: res.filename,
          name: res.filename,
          status: 'done',
          url: url
        })
        console.log(fileList)
      }).catch(err => console.log(err))
    }

    Vue.prototype.$uploadFile = async (file, fileList, t) => {
      const formData = new FormData()
      formData.append('file', file)
      const url = await t.$getBase64(file)
      t.$store.dispatch('uploadFile', formData).then(res => {
        console.log(res)
        fileList.push({
          uid: res.filename,
          name: res.filename,
          status: 'done',
          url: url
        })
        console.log(fileList)
      }).catch(err => console.log(err))
    }
  }
}

Vue.use(DateFormat)
