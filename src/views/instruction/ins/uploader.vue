<template>
  <editor
    inline
    v-bind="$attrs"
    v-on="$listeners"
    api-key="jg689zvglvbyez34lpf1khagrsbeyn97g8ohxvyuv9q6pknp"
    initialValue=""
    :init="{
      selector: 'textarea#image-tools',
      height: 500,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste imagetools wordcount'
      ],
      toolbar:
        'insertfile undo redo | styleselect | fontsizeselect bold italic | image media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      image_title: true,
      automatic_uploads: true,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }"
  >
  </editor>
</template>
<script>
import Editor from '@tinymce/tinymce-vue'
export default {
  name: 'TinyEditor',
  components: {
    editor: Editor
  },
  mounted() {
    console.log('sasasdasda')
  },
  data () {
    return {
      useDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      document: document
    }
  },
  methods: {

  }
}
</script>
