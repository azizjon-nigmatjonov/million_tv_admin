
<template>
   <a-col :xs="12" style="padding: 0 15px">
    <a-form-model-item v-if="videos && videos.length" prop="trailer">
      <template slot="label">
        <a-row>
          <a-col :span="8">
            {{ $t('video') }}
          </a-col>
          <a-col :span="16">
            <a-select v-model="quality">
              <a-select-option
                v-for="(qualityEl, index1) in videos"
                :key="qualityEl.quality"
                :value="index1"
              >
                {{ qualityEl.quality ? qualityEl.quality : $t('unknown') }}
                {{ qualityEl.status ? '( ' + $t(qualityEl.status) + ' )' : '' }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </template>
      <a-button
        v-if="
          videos[quality].file_name.split('/')[
            videos[quality].file_name.split('/').length - 1
          ].split('.')[1] === 'm3u8'
        "
        @click="onDeleteVideoClick"
        style="
          padding: 0;
          z-index: 8;
          position: absolute;
          height: 30px;
          width: 30px;
          right: -31px;
          top: 1px;
          font-size: 20px;
        "
      >
        <a-icon type="close" style="color: black" />
      </a-button>
      <a-button
        v-else
        @click="onDeleteVideoClick"
        style="
          padding: 0;
          z-index: 8;
          position: absolute;
          height: 30px;
          width: 30px;
          right: 0;
          font-size: 20px;
        "
      >
        <a-icon type="close" style="color: black" />
      </a-button>
      <video-player
        v-if="
          videos[quality].file_name.split('/')[
            videos[quality].file_name.split('/').length - 1
          ].split('.')[1] === 'm3u8'
        "
        class="vjs-custom-skin"
        :options="getSource(videos[quality].file_name)"
      />
      <video v-else width="100%" :src="videos[quality].file_name" controls>
        unreadable format by your browser
      </video>
      <p
        :style="{
          display: displayFilename,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          marginTop: '10px',
        }"
      >
        <strong>{{ $t('Uploaded file') }}</strong> : {{ uploadedFile }}
      </p>
    </a-form-model-item>
    <a-form-model-item
      v-else
      :label="$t('video') + ' (Формат: MP4, WMV, WebM ; Размер: 16:9)'"
      prop="trailer"
    >
      <a-button
        style="height: 104px; width: 100%"
        type="dashed"
        :loading="movieLoading"
        @click="onButtonClick(index)"
      >
        <a-icon v-if="movieLoading" type="plus" /> <br />
        {{ !movieLoading ? $t('upload') : '' }}
      </a-button>
      <input
        :id="'movie' + index"
        style="display: none"
        accept="video/*"
        type="file"
        @change="onMovieChange($event, index)"
        title="upload"
      />
      <a-progress
        :style="{ display: movieLoading ? 'block' : 'none' }"
        :stroke-color="{
          '0%': '#108ee9',
          '100%': '#87d068',
        }"
        :percent="Math.round(percentage * 100) / 100"
      />
    </a-form-model-item>
  </a-col>
</template>

<script>
import * as tus from 'tus-js-client'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: 0,
    },
    deleteVideo: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      videos: this.value ? [{ file_name: this.value, quality: 'original', status: 'PENDING' }] : [],
      quality: [0],
      displayFilename: 'none',
      uploadedFile: '', 
      movieLoading: false,
      loadingLogo: false,
      percentage: 0,
      movieUpdate: null
    }
  },
  methods: {
    onButtonClick(index) {
      document.getElementById('movie' + index).click()
    },
    onMovieChange(e, index) {
      this.movieLoading = true
      var file = e.target.files[0]

      this.movieUpdate = new tus.Upload(file, {
        chunkSize: 128000000, // 3000000, // 128000000,
        endpoint: `${process.env.VUE_APP_API_BASE_URL}upload-story/`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onError: function(error) {
          console.log('Failed because: ' + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          this.percentage = (bytesUploaded / bytesTotal) * 100
        },
        onSuccess: () => {
          this.movieLoading = false
          this.displayFilename = 'block'
          this.uploadedFile = this.movieUpdate.file.name
          
          this.videos = [
            { file_name: this.movieUpdate.url, quality: 'original', status: 'PENDING' }
          ]
          this.$emit('change', this.movieUpdate.url)
        }
      })
      this.movieUpdate.start()
    },
    onDeleteVideoClick () {
      this.videos = []
      this.uploadedFile = ''
      this.displayFilename = 'none'
      this.deleteVideo(this.index)
    }
  },
  watch: {
    value(newValue) {
      console.log(newValue)
      if (!newValue) {
        this.videos = []
        return
      }
      this.videos = [
        { file_name: newValue, quality: 'original', status: 'PENDING' }
      ]
    }
  }
}
</script>
