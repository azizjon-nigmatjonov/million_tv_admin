<template>
  <a-skeleton :loading="loading">
    <a-form-model
      @submit="onSubmit"
      ref="ruleForm"
      :model="movie"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
        <a-tab-pane key="1" :tab="$t('basicDetails')">
          <a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item :label="$t('logo_image') + ' (1x1.7) (102px, 146px)'" prop="logo_image">
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
                    <img v-if="imageUrlLogo" :src="imageUrlLogo" alt="avatar" />
                    <div v-else>
                      <a-icon :type="loadingLogo ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">
                        {{ $t('upload') }}
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>

              <a-col v-if="!this.$route.query.story" :span="12" class="banner-image" style="padding: 0 15px;">
                <div>
                  <a-form-model-item label="Баннер мобиле (1x1.4) (500px , 360px)" style="width: 250px">
                    <a-upload
                      name="file"
                      list-type="picture-card"
                      class="avatar-uploader"
                      accept="image/*"
                      :show-upload-list="false"
                      :action="`${VUE_APP_API_BASE_URL}image-upload`"
                      :before-upload="beforeUploadLogo"
                      @change="handleMobileBannerImg"
                    >
                      <img v-if="movie.imageMovieUrlMobile" :src="movie.imageMovieUrlMobile" alt="avatar" />
                      <div v-else>
                        <a-icon :type="movie.loadingLogo ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                          {{ $t('upload') }}
                        </div>
                      </div>
                    </a-upload>
                  </a-form-model-item>
                  <!-- <div @click="deleteMovieLogo" style="position: absolute; top: 0px; z-index: 9999; left: 160px; cursor: pointer">
                      <a-icon type="close" style="color: black" />
                  </div> -->
                </div>
                <div>
                  <a-form-model-item label="Баннер для планшета (1 x 1.2) (726px, 601px)">
                    <a-upload
                      name="file"
                      list-type="picture-card"
                      class="avatar-uploader"
                      accept="image/*"
                      :show-upload-list="false"
                      :action="`${VUE_APP_API_BASE_URL}image-upload`"
                      :before-upload="beforeUploadLogo"
                      @change="handleTabletBannerImg"
                    >
                      <img v-if="movie.imageMovieUrlTablet" :src="movie.imageMovieUrlTablet" alt="avatar" />
                      <div v-else>
                        <a-icon :type="movie.loadingTabletImg ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                          {{ $t('upload') }}
                        </div>
                      </div>
                    </a-upload>
                  </a-form-model-item>
                  <!-- <div @click="deleteMovieLogo" style="position: absolute; top: 0px; z-index: 9999; left: 160px; cursor: pointer">
                      <a-icon type="close" style="color: black" />
                    </div> -->
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding: 0 15px">
                <a-form-model-item :label="$t('status')" prop="status">
                  <a-switch
                    v-model="movie.active"
                    :checked-children="$t('active')"
                    :un-checked-children="$t('inactive')"
                    default-checked
                  />
                </a-form-model-item>
              </a-col>
              <!-- <a-col v-if="!this.$route.query.story" :span="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('isFree')" prop="is_free">
                    <a-switch v-model="movie.is_free" :checked-children="$t('free')" :un-checked-children="$t('notFree')" default-checked />
                  </a-form-model-item>
                </a-col> -->
              <a-col :span="12" v-if="!this.$route.query.story" :md="12" :xs="24" style="padding: 0 15px">
                <a-form-model-item :label="$t('payment_type')" prop="payment_type">
                  <a-select v-model="movie.payment_type" :placeholder="$t('payment_type')">
                    <a-select-option value="free">Бесплатно </a-select-option>
                    <a-select-option value="svod">Свод </a-select-option>
                    <a-select-option value="tvod">Твод </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :xs="24" :md="12" style="padding: 0 15px">
                <a-form-model-item ref="title" :label="$t('title')" prop="title">
                  <a-input v-model="movie.title" />
                </a-form-model-item>
              </a-col>
              <a-col v-if="!this.$route.query.story" :xs="24" :md="12" style="padding: 0 15px">
                <a-form-model-item :label="$t('slogan')" prop="slogan">
                  <a-input v-model="movie.slogan" />
                </a-form-model-item>
              </a-col>
            </a-row>

            <!-- Only in Story -->
            <a-col v-if="this.$route.query.story" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="story_link" :label="$t('relatedMovies')" prop="story_link">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  v-model="movie.story_link"
                  :placeholder="$t('relatedMovies')"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetchingCountries ? undefined : $t('story_linkNotFound')"
                  @search="fetchCountries"
                >
                  <a-spin v-if="fetchingCountries" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in allMovies" :key="d.slug" :value="d.slug">
                    {{ d.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
             <a-col v-if="!this.$route.query.story" :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item label="Правообладатель" prop="creator">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  v-model="movie.content_owner"
                  placeholder="Правообладатель"
                  style="width: 100%"
                  :filter-option="false"
                >
                  <a-spin v-if="fetchingCountries" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in creatorsList" :key="d" :value="d">
                    {{ d }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="!this.$route.query.story" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('country')" prop="country">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  v-model="movie.country"
                  :placeholder="$t('country')"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetchingCountries ? undefined : $t('countryNotFound')"
                  @search="fetchCountries"
                >
                  <a-spin v-if="fetchingCountries" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in countries" :key="d.name" :value="d.name">
                    {{ d.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
                    <a-col v-if="!this.$route.query.story" :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('description')" prop="description">
                <a-input v-model="movie.description" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col v-if="this.movieId && !this.$route.query.story" :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('duration')" prop="duration">
                <a-input :disabled="true" v-model="movie.duration" type="number" />
              </a-form-model-item>
            </a-col>
            <a-col v-if="this.movieId && !this.$route.query.story" :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('size')" prop="size">
                <a-input :disabled="true" v-model="movie.size" type="number" />
              </a-form-model-item>
            </a-col> -->
            <a-col v-if="!this.$route.query.story" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('release_year')" prop="release_year">
                <a-date-picker
                  v-model="movie.release_year"
                  style="width: 100%"
                  @panelChange="onDate"
                  @change="onDate"
                  mode="year"
                  :disabled-date="disabledDate"
                  format="YYYY"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              v-if="!this.$route.query.masterclass && !this.$route.query.story"
              :md="12"
              :xs="24"
              style="padding: 0 15px"
            >
              <a-form-model-item :label="$t('category')" prop="category">
                <a-select :placeholder="$t('category')" v-model="movie.category">
                  <a-select-option v-for="category in newCategories" :key="category.id" :value="category.id" @click="active_category = category">
                    {{ category.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="!this.$route.query.story && active_category.slug !== 'kliplar'" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('genres')" prop="genres">
                <a-select v-model="movie.genres" :placeholder="$t('genres')" mode="multiple">
                  <a-select-option v-for="genre in genres" :key="genre.id" :value="genre.id">
                    {{ genre.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col v-if="!this.$route.query.story" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('tags')" prop="tags">
                <a-select v-model="movie.tags" :placeholder="$t('tags')">
                  <a-select-option v-for="tag in listen" :key="tag.id" :value="tag.id">
                    {{ tag.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="!this.$route.query.story" :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('skip_entity')" prop="skip_entity">
                <a-input v-model="movie.skip_entity" type="number" />
              </a-form-model-item>
            </a-col>

            <a-col v-if="!this.$route.query.story" :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('age_restriction')" prop="age_restriction">
                <a-select v-model="movie.age_restriction" :placeholder="$t('age_restriction')">
                  <a-select-option value="0"> 0 </a-select-option>
                  <a-select-option value="4"> 4 </a-select-option>
                  <a-select-option value="6"> 6 </a-select-option>
                  <a-select-option value="12"> 12 </a-select-option>
                  <a-select-option value="16"> 16 </a-select-option>
                  <a-select-option value="18"> 18 </a-select-option>
                  <a-select-option value="25"> 25 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col v-if="!this.$route.query.story" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('plot')" prop="plot">
                <a-textarea v-model="movie.plot" :placeholder="$t('plot')" :auto-size="{ minRows: 10, maxRows: 13 }" />
              </a-form-model-item>
            </a-col>
            <a-col v-if="!this.$route.query.story" :xs="24" :md="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('actors')" prop="actors">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  mode="multiple"
                  v-model="movie.actors"
                  :placeholder="$t('actors')"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetchingActors ? undefined : $t('actorNotFound')"
                  @search="fetchActors"
                >
                  <a-spin v-if="fetchingActors" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in dataActors" :key="d.value" :value="d.value">
                    {{ d.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="!this.$route.query.story" :xs="24" :md="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('producers')" prop="producers">
                <a-select
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  mode="multiple"
                  v-model="movie.producers"
                  :placeholder="$t('producers')"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : $t('producerNotFound')"
                  @search="fetchProducer"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in dataProducers" :key="d.value" :value="d.value">
                    {{ d.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="!this.$route.query.story" :xs="24" :md="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('directors')" prop="directors">
                <a-select
                  id="numberInput"
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  mode="multiple"
                  v-model="movie.directors"
                  :placeholder="$t('directors')"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetchingDirectors ? undefined : $t('directorNotFound')"
                  @search="fetchDirectors"
                >
                  <a-spin v-if="fetchingDirectors" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in dataDirectors" :key="d.value" :value="d.value">
                    {{ d.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('multimedia')">
          <a-card
            v-if="!this.$route.query.masterclass"
            :title="$t('mainVideo')"
            :bordered="true"
            style="margin-bottom: 15px"
          >
            <a-row>
              <a-col style="padding-left: 10px; padding-bottom: 10px">
                <a-row style="height: 100%">
                  <a-row>
                    <a-col :xs="24" :md="12" style="padding: 0 15px" class="id_video">
                      <a-form-model-item label="Изображение в качестве фона для веб-сайта (1x1.8) (1440px, 700px)">
                        <a-upload
                          name="file"
                          list-type="picture-card"
                          class="avatar-uploader"
                          accept="image/*"
                          :show-upload-list="false"
                          :action="`${VUE_APP_API_BASE_URL}image-upload`"
                          :before-upload="beforeUploadLogo"
                          @change="handleChangeMain"
                        >
                          <img v-if="mainVideo.imageUrlMain" :src="mainVideo.imageUrlMain" alt="avatar" />
                          <div v-else>
                            <a-icon :type="mainVideo.loadingMain ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                              {{ $t('upload') }}
                            </div>
                          </div>
                        </a-upload>
                      </a-form-model-item>
                      <p v-if="imageError" class="red">Заполните поле</p>
                      <a-col :xs="24" :md="24" class="id_video">
                        <a-form-model-item label="Изображение в качестве фона для мобильных устройств (1x1.6) (360px, 224px)">
                          <a-upload
                            name="file"
                            list-type="picture-card"
                            class="avatar-uploader"
                            accept="image/*"
                            :show-upload-list="false"
                            :action="`${VUE_APP_API_BASE_URL}image-upload`"
                            :before-upload="beforeUploadLogo"
                            @change="handleChangeMainMobile"
                          >
                            <img v-if="mainVideo.imageUrlMobile" :src="mainVideo.imageUrlMobile" alt="avatar" />
                            <div v-else>
                              <a-icon :type="mainVideo.loadingMobile ? 'loading' : 'plus'" />
                              <div class="ant-upload-text">
                                {{ $t('upload') }}
                              </div>
                            </div>
                          </a-upload>
                        </a-form-model-item>
                        <p v-if="imageErrorMobile" class="red">Заполните поле</p>
                      </a-col>
                      <a-col :xs="24" :md="24">
                        <a-form-model-item label="Изображение в качестве фона для таблет устройств (1x1.9) (601px, 304px)">
                          <a-upload
                            name="file"
                            list-type="picture-card"
                            class="avatar-uploader"
                            accept="image/*"
                            :show-upload-list="false"
                            :action="`${VUE_APP_API_BASE_URL}image-upload`"
                            :before-upload="beforeUploadLogo"
                            @change="handleChangeMainTablet"
                          >
                            <img v-if="mainVideo.imageUrlTablet" :src="mainVideo.imageUrlTablet" alt="avatar" />
                            <div v-else>
                              <a-icon :type="mainVideo.loadingTablet ? 'loading' : 'plus'" />
                              <div class="ant-upload-text">
                                {{ $t('upload') }}
                              </div>
                            </div>
                          </a-upload>
                        </a-form-model-item>
                        <p v-if="imageErrorTablet" class="red">Заполните поле</p>
                      </a-col>
                    </a-col>
                    <a-col :xs="24" :md="12" style="padding: 0 15px">
                      <a-form-model-item v-if="mainVideo.videos && mainVideo.videos.length" prop="mainVideo">
                        <template slot="label">
                          <a-row>
                            <a-col :span="8">
                              {{ $t('video') }}
                            </a-col>
                            <a-col :span="16">
                              <a-select v-model="mainQuality">
                                <a-select-option
                                  v-for="(quality, index1) in mainVideo.videos"
                                  :key="quality.quality"
                                  :value="index1"
                                >
                                  {{ quality.quality ? quality.quality : $t('unknown') }}
                                  {{ quality.status ? '( ' + $t(quality.status) + ' )' : '' }}
                                </a-select-option>
                              </a-select>
                            </a-col>
                          </a-row>
                        </template>
                        <a-button
                          v-if="
                            mainVideo.videos[mainQuality].file_name.split('.')[
                              mainVideo.videos[mainQuality].file_name.split('.').length - 1
                            ] === 'm3u8'
                          "
                          @click="onDeleteMainVideoClick"
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
                          @click="onDeleteMainVideoClick"
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
                            mainVideo.videos[mainQuality].file_name.split('.')[
                              mainVideo.videos[mainQuality].file_name.split('.').length - 1
                            ] === 'm3u8'
                          "
                          class="vjs-custom-skin"
                          :options="getSource(mainVideo.videos[mainQuality].file_name)"
                        />
                        <video v-else width="100%" :src="mainVideo.videos[mainQuality].file_name" controls>
                          unreadable format by your browser
                        </video>
                        <p
                          :style="{
                            display: mainVideo.displayFilename,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            marginTop: '10px',
                          }"
                        >
                          <strong>{{ $t('Uploaded file') }}</strong> : {{ mainVideo.uploadedFile }}
                        </p>
                      </a-form-model-item>
                      <a-form-model-item v-else :label="$t('mainVideo') + ' (Формат: MP4, WMV, WebM)'" prop="mainVideo">
                        <a-button
                          style="height: 104px; width: 100%"
                          type="dashed"
                          :loading="mainVideo.movieLoading"
                          @click="onButtonMainClick"
                        >
                          <a-icon v-if="!mainVideo.movieLoading" type="plus" /> <br />
                          {{ !mainVideo.movieLoading ? $t('upload') : '' }}
                        </a-button>
                        <input
                          accept=".mp4, .mkv, webm, .avm"
                          :id="'mainVideo'"
                          style="display: none"
                          type="file"
                          @change="onMovieMainChange"
                          title="upload"
                        />
                        <a-progress
                          :style="{ display: mainVideo.movieLoading ? 'block' : 'none' }"
                          :stroke-color="{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }"
                          :percent="Math.round(mainVideo.percentage * 100) / 100"
                        />
                        <div @click="stopUploadingVideo"
                          style="
                            padding: 0;
                            z-index: 99;
                            position: absolute;
                            height: 30px;
                            width: 30px;
                            right: -5px;
                            top: -35px;
                            font-size: 20px;
                            cursor: pointer;
                            "
                            :style="{ display: mainVideo.movieLoading ? 'block' : 'none' }"
                          >
                          <a-icon type="close" style="color: black" />
                        </div>
                      </a-form-model-item>
                      <!-- <p>Видео загрузилось успешно. На данный момент в процессе транкода.</p> -->
                      <p v-if="videoError" class="red">Заполните поле</p>
                    </a-col>
                  </a-row>
                  <a-col v-if="!this.$route.query.story" :xs="24" style="padding: 0 15px; overflow: hidden">
                    <p>
                      {{ $t('duration') }} :
                      {{
                        mainVideo.videos &&
                        mainVideo.videos.length &&
                        mainVideo.videos[mainQuality] &&
                        mainVideo.videos[mainQuality].duration
                          ? `${Math.floor(mainVideo.videos[mainQuality].duration / 60)}:${
                              mainVideo.videos[mainQuality].duration % 60 > 9 ? '' : '0'
                            }${mainVideo.videos[mainQuality].duration % 60}`
                          : ''
                      }}
                    </p>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
          <!-- <a-card
            v-if="!this.$route.query.story && !this.$route.query.masterclass"
            :title="$t('scene_images')"
            :bordered="true"
            style="margin-bottom: 15px;"
          >
            <div class="clearfix">
              <a-upload
                :action="`${VUE_APP_API_BASE_URL}image-upload`"
                list-type="picture-card"
                accept="image/*"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
                :before-upload="beforeUploadLogo"
              >
                <div v-if="fileList.length < 8">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    {{ $t('upload') }}
                  </div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-card> -->
          <a-card v-if="!this.$route.query.story" :title="$t('trailers')" :bordered="true" style="margin-bottom: 15px">
            <a-row style="display: flex; align-items: stretch; overflow-x: scroll">
              <a-col
                style="padding-left: 10px; padding-bottom: 10px"
                v-for="(trailer, index) in trailers"
                :key="index"
                :xs="24"
                :md="8"
              >
                <a-row style="height: 100%">
                  <a-card :bordered="true" style="height: 100%">
                    <a-button
                      v-if="trailers && trailers.length > 1 && index > 0"
                      @click="onDeleteTrailerClick(index)"
                      style="
                        padding: 0;
                        z-index: 8;
                        position: absolute;
                        float: right;
                        height: 25px;
                        width: 25px;
                        right: 4px;
                        top: 4px;
                        font-size: 15px;
                      "
                    >
                      <a-icon type="close" style="color: black" />
                    </a-button>
                    <a-col :xs="24" style="padding: 0 15px" class="id_video">
                    <div @click="deleteTrailerImage(1, index)" v-if="trailer.imageUrlLogo" style="position: absolute; top: 0px; z-index: 9999; right: 0px; cursor: pointer">
                          <a-icon type="close" style="color: black" />
                        </div>
                      <a-form-model-item :label="$t('backgroundImage') + ' (1x1.3) (375px, 289px)'" prop="backgroundImage">
                        <a-upload
                          name="file"
                          list-type="picture-card"
                          class="avatar-uploader"
                          accept="image/*"
                          :show-upload-list="false"
                          :action="`${VUE_APP_API_BASE_URL}image-upload`"
                          :before-upload="beforeUploadLogo"
                          @change="handleChangeLogo($event, index)"
                        >
                          <img v-if="trailer.imageUrlLogo" :src="trailer.imageUrlLogo" alt="avatar" />
                          <div v-else>
                            <a-icon :type="trailer.loadingLogo ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                              {{ $t('upload') }}
                            </div>
                          </div>
                        </a-upload>
                        
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" style="padding: 0 15px">
                      <a-form-model-item v-if="trailer.videos && trailer.videos.length" prop="trailer">
                        <template slot="label">
                          <a-row>
                            <a-col :span="8">
                              {{ $t('video') }}
                            </a-col>
                            <a-col :span="16">
                              <a-select v-model="trailerQuality[index]">
                                <a-select-option
                                  v-for="(quality, index1) in trailer.videos"
                                  :key="quality.quality"
                                  :value="index1"
                                >
                                  {{ quality.quality ? quality.quality : $t('unknown') }}
                                  {{ quality.status ? '( ' + $t(quality.status) + ' )' : '' }}
                                </a-select-option>
                              </a-select>
                            </a-col>
                          </a-row>
                        </template>
                        <a-button
                          v-if="
                            trailer.videos[trailerQuality[index]].file_name.split('/')[
                              trailer.videos[trailerQuality[index]].file_name.split('/').length - 1
                            ].split('.')[1] === 'm3u8'
                          "
                          @click="onDeleteTrailerVideoClick(index)"
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
                          @click="onDeleteTrailerVideoClick(index)"
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
                            trailer.videos[trailerQuality[index]].file_name.split('/')[
                              trailer.videos[trailerQuality[index]].file_name.split('/').length - 1
                            ].split('.')[1] === 'm3u8'
                          "
                          class="vjs-custom-skin"
                          :options="getSource(trailer.videos[trailerQuality[index]].file_name)"
                        />
                        <video v-else width="100%" :src="trailer.videos[trailerQuality[index]].file_name" controls>
                          unreadable format by your browser
                        </video>
                        <p
                          :style="{
                            display: trailer.displayFilename,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            marginTop: '10px',
                          }"
                        >
                          <strong>{{ $t('Uploaded file') }}</strong> : {{ trailer.uploadedFile }}
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
                          :loading="trailer.movieLoading"
                          @click="onButtonClick(index)"
                        >
                          <a-icon v-if="!trailer.movieLoading" type="plus" /> <br />
                          {{ !trailer.movieLoading ? $t('upload') : '' }}
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
                          :style="{ display: trailer.movieLoading ? 'block' : 'none' }"
                          :stroke-color="{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }"
                          :percent="Math.round(trailer.percentage * 100) / 100"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" style="padding: 0 15px; overflow: hidden">
                      <p>
                        {{ $t('duration') }} :
                        {{
                          trailer.videos &&
                          trailer.videos.length &&
                          trailer.videos[trailerQuality[index]] &&
                          trailer.videos[trailerQuality[index]].duration
                            ? `${Math.floor(trailer.videos[trailerQuality[index]].duration / 60)}:${
                                trailer.videos[trailerQuality[index]].duration % 60 > 9 ? '' : '0'
                              }${trailer.videos[trailerQuality[index]].duration % 60}`
                            : ''
                        }}
                      </p>
                    </a-col>
                  </a-card>
                </a-row>
              </a-col>
              <a-col :xs="24" :md="8" style="padding-left: 10px; padding-bottom: 10px">
                <a-button
                  type="dashed"
                  icon="plus"
                  style="height: 100%; width: 100%; font-size: 20px"
                  @click="onAddTrailer"
                >
                  {{ $t('add') }}
                </a-button>
              </a-col>
            </a-row>
          </a-card>
          <!-- <a-card
            v-if="!this.$route.query.story && !this.$route.query.masterclass"
            :title="$t('backstage')"
            :bordered="true"
          >
            <a-row style="display: flex; align-items: stretch; overflow-x: scroll">
              <a-col
                style="padding-left: 10px; padding-bottom: 10px"
                v-for="(backstage, index) in backstages"
                :key="index"
                :xs="24"
                :md="8"
              >
                <a-row style="height: 100%">
                  <a-card :bordered="true" style="height: 100%">
                    <a-button
                      v-if="backstages && backstages.length > 1 && index > 0"
                      @click="onDeleteBackstageClick(index)"
                      style="
                        padding: 0;
                        z-index: 8;
                        position: absolute;
                        float: right;
                        height: 25px;
                        width: 25px;
                        right: 4px;
                        top: 4px;
                        font-size: 15px;
                      "
                    >
                      <a-icon type="close" style="color: black" />
                    </a-button>
                    <a-col :xs="24" style="padding: 0 15px" class="id_video">
                      <a-form-model-item :label="$t('backgroundImage')" prop="backgroundImage">
                        <a-upload
                          name="file"
                          list-type="picture-card"
                          class="avatar-uploader"
                          :show-upload-list="false"
                          accept="image/*"
                          :action="`${VUE_APP_API_BASE_URL}image-upload`"
                          :before-upload="beforeUploadLogo"
                          @change="handleChangeBackstage($event, index)"
                        >
                          <img v-if="backstage.imageUrlBackstage" :src="backstage.imageUrlBackstage" alt="avatar" />
                          <div v-else>
                            <a-icon :type="backstage.loadingBackstage ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">
                              {{ $t('upload') }}
                            </div>
                          </div>
                        </a-upload>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" style="padding: 0 15px">
                      <a-form-model-item v-if="backstage.videos && backstage.videos.length">
                        <template slot="label">
                          <a-row>
                            <a-col :span="8">
                              {{ $t('video') }}
                            </a-col>
                            <a-col :span="16">
                              <a-select v-model="backstageQuality[index]">
                                <a-select-option
                                  v-for="(quality, index1) in backstage.videos"
                                  :key="quality.quality"
                                  :value="index1"
                                >
                                  {{ quality.quality ? quality.quality : $t('unknown') }}
                                  {{ quality.status ? '( ' + $t(quality.status) + ' )' : '' }}
                                </a-select-option>
                              </a-select>
                            </a-col>
                          </a-row>
                        </template>
                        <a-button
                          v-if="
                            backstage.videos[backstageQuality[index]].file_name.split('/')[
                              backstage.videos[backstageQuality[index]].file_name.split('/').length - 1
                            ] === 'm3u8'
                          "
                          @click="onDeleteBackstageVideoClick(index)"
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
                          @click="onDeleteBackstageVideoClick(index)"
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
                            backstage.videos[backstageQuality[index]].file_name.split('/')[
                              backstage.videos[backstageQuality[index]].file_name.split('/').length - 1
                            ] === 'm3u8'
                          "
                          class="vjs-custom-skin"
                          :options="getSource(backstage.videos[backstageQuality[index]].file_name)"
                        />
                        <video v-else width="100%" :src="backstage.videos[backstageQuality[index]].file_name" controls>
                          unreadable format by your browser
                        </video>
                        <p
                          :style="{
                            display: backstage.displayFilename,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            marginTop: '10px',
                          }"
                        >
                          <strong>{{ $t('Uploaded file') }}</strong> : {{ backstage.uploadedFile }}
                        </p>
                      </a-form-model-item>
                      <a-form-model-item v-else :label="$t('backstage')" prop="backstage">
                        <a-button
                          style="height: 104px; width: 100%"
                          type="dashed"
                          :loading="backstage.movieLoading"
                          @click="onButtonBackstageClick(index)"
                        >
                          <a-icon v-if="!backstage.movieLoading" type="plus" /> <br />
                          {{ !backstage.movieLoading ? $t('upload') : '' }}
                        </a-button>
                        <input
                          :id="'backstage' + index"
                          style="display: none"
                          accept="video/*"
                          type="file"
                          @change="onMovieBackstageChange($event, index)"
                          title="upload"
                        />
                        <a-progress
                          :style="{ display: backstage.movieLoading ? 'block' : 'none' }"
                          :stroke-color="{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }"
                          :percent="Math.round(backstage.percentage * 100) / 100"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" style="padding: 0 15px; overflow: hidden">
                      <p>
                        {{ $t('duration') }} :
                        {{
                          backstage.videos &&
                          backstage.videos.length &&
                          backstage.videos[backstageQuality[index]] &&
                          backstage.videos[backstageQuality[index]].duration
                            ? `${Math.floor(backstage.videos[backstageQuality[index]].duration / 60)}:${
                                backstage.videos[backstageQuality[index]].duration % 60 > 9 ? '' : '0'
                              }${backstage.videos[backstageQuality[index]].duration % 60}`
                            : '0'
                        }}
                      </p>
                    </a-col>
                  </a-card>
                </a-row>
              </a-col>
              <a-col :xs="24" :md="8" style="padding-left: 10px; padding-bottom: 10px">
                <a-button
                  type="dashed"
                  icon="plus"
                  style="height: 100%; width: 100%; font-size: 20px"
                  @click="onAddBackstage"
                >
                  {{ $t('add') }}
                </a-button>
              </a-col>
            </a-row>
          </a-card> -->
        </a-tab-pane>

        <a-tab-pane v-if="movieId && !this.$route.query.story" key="3">
          <span slot="tab">
            {{ $t('seasons')
            }}<a-badge
              :number-style="{ backgroundColor: '#FF5722' }"
              v-if="movieId && movie.seasons && movie.seasons.length"
              style="margin-left: 4px"
              :count="movie.seasons.length"
            />
          </span>
          <a-row>
            <!-- <router-link :to="'../'+movie.id+'/seasons/create'"> -->
            <router-link
              :to="{ path: `/movie/${movie.id}/seasons/create`, query: { masterclass: this.$route.query.masterclass } }"
            >
              <a-button
                @click="
                  $router.push({ path: '../' + movie.id + '/seasons/create', hash: 3, query: { masterclass: true } })
                "
                style="float: right; margin-bottom: 10px"
                shape="round"
                type="primary link"
                icon="plus"
                >{{ $t('add') }}</a-button
              >
            </router-link>
            <!-- <a-button  style="float: right; margin-bottom: 10px" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button> -->
          </a-row>
          <a-table
            v-if="this.movieId && movie.seasons && movie.seasons.length"
            :columns="columnsSeasons"
            :rowKey="(record) => record.id"
            :dataSource="movie.seasons"
          >
            <template slot="action" slot-scope="text, row">
              <a-tooltip placement="topRight"
                ><template slot="title">{{ $t('update') }}</template>
                <a-button
                  @click="
                    handleRoute(movie, row)
                  "
                  style="margin-right: 5px"
                  type="default"
                  icon="edit"
                ></a-button>
              </a-tooltip>
              <a-popconfirm
                placement="left"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="deleteSeason($event, row.season_number)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                  ><template slot="title">{{ $t('delete') }}</template>
                  <a-button type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
          <p v-else>
            {{ $t('noSeasonsOrNotSerial') }}
          </p>
        </a-tab-pane>

        <a-tab-pane
          v-if="!this.$route.query.story && !this.$route.query.masterclass"
          key="4"
          :tab="$t('relatedMovies')"
        >
          <a-row>
            <a-button
              shape="round"
              icon="plus"
              type="primary"
              style="margin: 10px; float: right"
              @click="onAddRelatedMovie"
            >
              {{ $t('add') }}
            </a-button>
            <a-modal v-model="addRelatedMovieModal" width="800px" :title="$t('addRelatedMovie')">
              <a-select
                v-model="newRelatedMovies"
                mode="multiple"
                style="width: 100%"
                :placeholder="$t('movies')"
                show-search
                @deselect="onDeselectMovie"
                @select="onSelectMovie"
                :auto-clear-search-value="false"
                :show-arrow="false"
                :filter-option="false"
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
          <a-table
            :bordered="true"
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="movie.related_movies"
          >
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
          </a-table>
        </a-tab-pane>

        <!-- <a-tab-pane v-if="movieId && !this.$route.query.story" key="5" :tab="$t('feedbacks')">
          <a-table
            :columns="columnsFeedback"
            :rowKey="(record) => record.id"
            :dataSource="feedbacks"
            :pagination="paginationFeedbacks"
            @change="handleTableChange"
          >
            <template slot="status" slot-scope="text, row">
              <a-tag :color="row.active ? 'green' : 'red'">{{ row.active ? $t('active') : $t('inactive') }}</a-tag>
            </template>
            <template slot="action" slot-scope="text, row">
              <a-tooltip placement="topRight"
                ><template slot="title">{{ $t('update') }}</template>
                <a-button
                  style="margin-right: 5px"
                  @click="showUpdateModal(row.id)"
                  type="default"
                  icon="edit"
                ></a-button>
              </a-tooltip>
              <a-popconfirm
                placement="left"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="deleteFeedback($event, row.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                  ><template slot="title">{{ $t('delete') }}</template>
                  <a-button type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
          <a-modal v-model="previewFeedbackVisible" width="800px" :title="$t('updateFeedback')">
            <a-form-model
              @submit="onSubmitFeedback"
              ref="ruleForm"
              :model="feedback"
              :rules="rulesFeedback"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-row>
                <a-col :span="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('comment')" prop="comment">
                    <a-textarea
                      v-model="feedback.comment"
                      :placeholder="$t('comment')"
                      :auto-size="{ minRows: 5, maxRows: 8 }"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('customer_name')" prop="customer_name">
                    <a-input v-model="feedback.customer_name" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="6" style="padding: 0 15px">
                  <a-form-model-item :label="$t('rate')" prop="rate">
                    <a-input-number :min="0" :max="5" v-model="feedback.rate" type="number" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="4" style="padding: 0 15px">
                  <a-form-model-item :label="$t('status')" prop="status">
                    <a-switch
                      v-model="feedback.active"
                      :checked-children="$t('active')"
                      :un-checked-children="$t('inactive')"
                      default-checked
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
            <template slot="footer">
              <a-button type="primary" key="submit" @click.prevent="onSubmitFeedback">
                {{ $t('save') }}
              </a-button>
            </template>
          </a-modal>
        </a-tab-pane> -->

        <a-tab-pane v-if="!this.$route.query.story" key="6" :tab="$t('SEO')">
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('Meta description')" prop="meta_description">
                <a-input v-model="movie.meta_description" />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('Meta tags')" prop="meta_tags">
                <a-input v-model="movie.meta_tags" />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('Meta title')" prop="meta_title">
                <a-input v-model="movie.meta_title" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="7" v-if="movieId && !this.$route.query.story" :tab="$t('price')">
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('initial_price')" prop="initial_price">
                <a-input-number style="width: 100%" v-model="pricing.initial_price" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="8" v-if="movie.id && !this.$route.query.story" :tab="$t('comment')">
          <a-row>
            <a-col :xs="24" :md="24" style="padding: 0 15px">
              <!-- <Comments :movieId="movie.id" :lang="this.lang" /> -->
              <a-table
            v-action:get
            :columns="columnsComments"
            :rowKey="(record) => record.id"
            :dataSource="list"
            :pagination="false"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
        <template slot="action" slot-scope="text, row" style="z-index: 10">
          <!-- <router-link v-action:update :to="{ path: './update/' + row.id, query: { type: 'like' } }">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link> -->
          <a-popconfirm
            v-action:delete
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteElement(row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-form-model>
  </a-skeleton>
</template>

<script>
import * as tus from 'tus-js-client'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import debounce from 'lodash/debounce'
import VideoPlayer from '@/components/video/video'
import SearchMovie from './components/searchMovie.vue'
import Comments from './Comments'

window.onbeforeunload = function(e) {
  e = e || window.event

  // For IE and Firefox prior to version 4
  if (e) {
    e.returnValue = 'Sure?'
  }

  // For Safari
  return 'Sure?'
}

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function getBase64Preview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  data() {
    this.lastFetchIdGeo = 0
    this.lastFetchId = 0
    this.fetchProducer = debounce(this.fetchProducer, 800)
    return {
       list: [],
      columnsComments: [
          {
              title: this.$t('No'),
              dataIndex: 'index',
              width: '100px',
              align: 'center'
          },
          {
              title: this.$t('title'),
              dataIndex: 'comment'
          },
          {
              title: this.$t('action'),
              key: 'action',
              width: '106px',
              align: 'center',
              scopedSlots: { customRender: 'action' }
          }
      ],
      active_category: '',
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      loadingTagPopup: false,
      creatorsList: ['Maestro', 'Rizanova', 'Global', 'Million'],
      isStory: this.$route.query.story ? 'upload-story' : 'upload-movies',
      imageError: true,
      imageErrorMobile: true,
      imageErrorTablet: true,
      videoError: true,
      movieId: this.$route.params.id,
      loading: false,
      activeTabKey: '1',
      fetching: false,
      fetchingDirectors: false,
      mainUpload: null,
      trailerUpload: [],
      backstageUpload: [],
      fetchingActors: false,
      fetchingMovies: false,
      fetchingCountries: false,
      moviesForTable: [],
      addRelatedMovieModal: false,
      newRelatedMovies: [],
      previewVisible: false,
      isDeleteMovie: false,
      backstageQuality: [0],
      trailerQuality: [0],
      mainQuality: 0,
      allMovies: [],
      previewImage: '',
      country: '',
      fileList: [],
      data: [],
      dataDirectors: [],
      dataProducers: [],
      dataActors: [],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      trailerUpdate: [],
      backstageUpdate: [],
      mainUpdate: null,
      imageUrlLogo: '',
      loadingLogo: false,
      producers: [],
      directors: [],
      movieFileInfo: null,
      previewFeedbackVisible: false,
      pricing: {
        decline_period: 0,
        decline_price: 0,
        final_decline_day: '6024-06-30 13:00:00',
        initial_decline_day: '6023-06-30 13:00:00',
        initial_price: null,
        is_active: true,
        is_serial: false,
        lang: this.lang || 'ru',
        user_watched_period: 0,
        substracted_price: 0,
        season_number: 0,
        episode_number: 0
      },
      feedback: {
        id: null,
        comment: '',
        customer_id: '',
        customer_name: '',
        episode_key: '',
        movie_key: '',
        rate: null
      },
      actors: [],
      columnsSeasons: [
        {
          title: this.$t('season_number'),
          dataIndex: 'season_number'
        },
        {
          title: this.$t('release_year'),
          dataIndex: 'release_year'
        },
        {
          title: this.$t('plot'),
          dataIndex: 'plot'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns: [
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
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsFeedback: [
        {
          title: this.$t('user'),
          dataIndex: 'customer_name'
        },
        {
          title: this.$t('comment'),
          dataIndex: 'comment'
        },
        {
          title: this.$t('rate'),
          dataIndex: 'rate'
        },
        {
          title: this.$t('status'),
          key: 'active',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '15%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      trailers: [
        {
          videos: [],
          photo: '',
          format: '',
          imageUrlLogo: '',
          uploadedFile: '',
          displayFilename: 'none',
          movieLoading: false,
          loadingLogo: false,
          percentage: 0
        }
      ],
      mainVideo: {
        videos: [],
        photo: '',
        mobilePtoho: '',
        tabletPhoto: '',
        format: '',
        videoUrl: '',
        imageUrlMain: '',
        imageUrlMobile: '',
        imageUrlTablet: '',
        uploadedFile: '',
        displayFilename: 'none',
        movieLoading: false,
        loadingMain: false,
        percentage: 0,
        loadingMobile: false,
        loadingTablet: false
      },
      backstages: [
        {
          videos: [],
          photo: '',
          format: '',
          imageUrlBackstage: '',
          uploadedFile: '',
          displayFilename: 'none',
          movieLoading: false,
          loadingBackstage: false,
          percentage: 0
        }
      ],
      movie: {
        content_owner: 'Million',
        loadingLogo: false,
        loadingTabletImg: false,
        imageMovieUrlMobile: '',
        imageMovieUrlTablet: '',
        active: false,
        rating_imdb: {
          movie_imdb_id: '',
          rating_imdb: 0
        },
        is_free: true,
        id: '',
        title: '',
        slogan: '',
        size: '',
        duration: '',
        release_year: null,
        related_movies: [],
        plot: '',
        actors: [],
        producers: [],
        directors: [],
        logo_image: '',
        category: '',
        country: null,
        genres: [],
        tags: '',
        seasons: [],
        is_new: false,
        meta_description: '',
        meta_title: '',
        meta_tags: '',
        skip_entity: null,
        movie_banner_for_mobile: '',
        movie_banner_for_tablet: '',
        age_restriction: 0,
        story_link: '',
        payment_type: 'free'
      },
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        story_link: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        payment_type: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        category: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        genres: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        country: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        logo_image: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        news: [{ type: 'array',
          fields: {
            link: [{ required: true, message: this.$t('required'), trigger: 'change' }],
          }
        }]
      },
      rulesFeedback: {
        comment: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        rate: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        customer_name: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      },
      errorImdb: false
    }
  },
  mounted() {
    this.getList()
    this.loading = true
     if (this.movie.payment_type === 'tvod') {
        if (this.pricing.initial_price < 10) {
          this.pricing.initial_price = 10
       }
      }
    if (this.movieId) this.getMoviesAttrs()
    this.getFeedbacks({ current: 1, pageSize: 10, slug: this.movieId })
    this.getStaff({ lang: this.lang })
    this.getGenres({ lang: this.lang, active: true }).then(() => {
      this.getGenres({ current: 1, pageSize: this.paginationGenres.total, lang: this.lang, active: true }).then(() => {})
    })
    this.getTags({ lang: this.lang, active: true }).then(() => {
      this.getTags({ current: 1, pageSize: this.paginationTags.total, lang: this.lang, active: true }).then(() => {})
    })
    this.getCountries({ lang: this.lang }).then(() => {
       this.getCountries({ current: 1, pageSize: 20, lang: this.lang }).then(() => {})
    })
    this.getCategories({ lang: this.lang, active: true }).then(() => {
      this.getCategories({ current: 1, pageSize: this.paginationCategories.total, lang: this.lang, active: true }).then(() => {})
    })
    this.getGenres()
    this.getTags()
    this.getCategories()
    this.getCountries()
    this.getAllMovies()
    this.getStaff({ lang: this.lang }).then(() => {
      this.getStaff({ current: 1, pageSize: this.paginationStaff.total, lang: this.lang }).then(() => {
        this.staff.map(staff => {
          let actor = 'actor'
          let actor2 = 'актер'
          let actor3 = 'aktyor'
          let actress = 'actress'
          let actress2 = 'актриса'
          let producer = 'producer'
          let producer2 = 'продюсер'
          let producer3 = 'prodyuser'
          let director = 'director'
          let director2 = 'директор'
          let director3 = 'direktor'
          if (staff.position.indexOf(actor) >= 0 || staff.position.indexOf(actor2) >= 0 || staff.position.indexOf(actor3) >= 0 || staff.position.indexOf(actress) >= 0 || staff.position.indexOf(actress2) >= 0) {
            this.dataActors.push({
              text: `${staff.first_name} ${staff.last_name}`,
              value: staff.id
            })
          }
          if (staff.position.indexOf(producer) >= 0 || staff.position.indexOf(producer2) >= 0 || staff.position.indexOf(producer3) >= 0) {
            this.dataProducers.push({
              text: `${staff.first_name} ${staff.last_name}`,
              value: staff.id
            })
          }
          if (staff.position.indexOf(director) >= 0 || staff.position.indexOf(director2) >= 0 || staff.position.indexOf(director3) >= 0) {
            this.dataDirectors.push({
              text: `${staff.first_name} ${staff.last_name}`,
              value: staff.id
            })
          }
        })
      })
      this.loading = false
    })
  },
  props: {
    // eslint-disable-next-line
    lang: String,
    isSubmitting: Boolean
  },
  components: {
    VideoPlayer,
    SearchMovie,
    Comments
  },
  computed: {
    listen() {
      return this.movie.tags.length === this.movie.tags.length + 1 ? [] : this.tags
    },
    newCategories() {
      return this.categories.filter(category => category.slug !== 'masterklass' && category.slug !== 'story')
    },
    ...mapGetters([
      'genres',
      'tags',
      'categories',
      'staff',
      'feedbacks',
      'paginationStaff',
      'paginationFeedbacks',
      'paginationMovies',
      'countries',
      'paginationCategories',
      'paginationGenres',
      'paginationTags'
    ])
  },
  methods: {
    ...mapActions(['getMovies', 'getCategories', 'getGenres', 'getTags', 'getStaff', 'getFeedbacks', 'getCountries']),
    handleTableChange(pagination) {
      const paginationNew = {
        ...pagination,
        slug: this.movieId
      }
      this.getFeedbacks(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    handleRoute(movie, row) {
      if (!movie.id) return
      this.$router.push({
          path: '../' + movie?.id + '/seasons/update/' + row.season_number,
          hash: this.$route.hash,
          query: { masterclass: this.$route.query.masterclass },
        })
    },
    getList() {
        this.loading = true
        request({
            url: '/movie-comment',
            method: 'get',
            params: { movie_key: this.$route.params.id }
        }).then(response => {
            this.list = response.movie_comments?.map((item, index) => ({
                ...item,
                index: index + 1
            }))
        })
        .finally(() => {
            this.loading = false
        })
    },
    deleteElement (id) {
        this.loading = true
        request({
            url: `/movie-comment/${id}`,
            method: 'delete',
        }).then(response => {
            this.list = []
            this.getList()
        })
        .finally(() => {
            this.loading = false
        })
    },
    getPagination() {
      return this.paginationFeedbacks
    },
    getAllMovies() {
      request({
        url: '/movies',
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        this.allMovies = response.movies
      })
    },
    getMoviesAttrs() {
      request({
        url: '/movies/' + this.movieId,
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        this.imageUrlLogo = response.movie.logo_image
        this.movie.active = response.movie.active
        this.movie.is_free = response.movie.is_free
        this.movie.title = response.movie.title
        this.movie.id = response.movie.id
        this.movie.slogan = response.movie.slogan
        this.movie.content_owner = response.movie.content_owner
        // this.movie.rating_imdb = response.movie.rating_imdb
        // this.movie.size = response.movie.size
        // this.movie.duration = response.movie.duration
        this.movie.seasons = response.movie.seasons
        // this.movie.movie_logo_title = response.movie.movie_logo_title
        this.movie.skip_entity = response.movie.skip_entity
        this.movie.age_restriction = response.movie.age_restriction
        this.movie.story_link = response.movie.story_link
        this.movie.payment_type = response.movie.payment_type
        if (response.movie.release_year === '0') {
          this.movie.release_year = null
        } else {
          this.movie.release_year = moment(response.movie.release_year.toString())
        }
        this.movie.plot = response.movie.plot
        this.movie.is_serial = response.movie.is_serial
        if (response.movie.staffs.length) {
          response.movie.staffs.map(actor => {
            if (actor.staff) {
                if (actor.position === 'actor' || actor.position === 'актер' || actor.position === 'aktyor') {
                this.movie.actors.push(actor.staff.id)
              }
            }
          })
        }
        if (response.movie.staffs) {
          response.movie.staffs.map(director => {
            if (director.staff) {
                if (director.position === 'director' || director.position === 'директор' || director.position === 'direktor') {
                this.movie.directors.push(director.staff.id)
              }
            }
          })
        }
        if (response.movie.staffs) {
          response.movie.staffs.map(producer => {
            if (producer.staff) {
              if (producer.position === 'producer' || producer.position === 'продюсер' || producer.position === 'prodyuser') {
                this.movie.producers.push(producer.staff.id)
              }
            }
          })
        }
        this.movie.movie_banner_for_mobile = response.movie.movie_banner_for_mobile.split('/')[response.movie.movie_banner_for_mobile.split('/').length - 1]
        this.movie.movie_banner_for_tablet = response.movie.movie_banner_for_tablet.split('/')[response.movie.movie_banner_for_tablet.split('/').length - 1]
        this.movie.logo_image = response.movie.logo_image.split('/')[response.movie.logo_image.split('/').length - 1]
        if (response.movie.trailer && response.movie.trailer.length) {
          this.trailers = []
          response.movie.trailer.map((trailer, index) => {
            this.trailerQuality[index] = 0
            this.trailers.push({
              videos: trailer.videos,
              photo: trailer.image.split('/')[trailer.image.split('/').length - 1],
              duration: trailer.duration,
              imageUrlLogo: trailer.image,
              uploadedFile: '',
              displayFilename: 'none',
              movieLoading: false,
              loadingLogo: false,
              percentage: 0
            })
          })
        }
        if (response.movie.backstage && response.movie.backstage.length) {
          this.backstages = []
          response.movie.backstage.map((backstage, index) => {
            this.backstageQuality[index] = 0
            this.backstages.push({
              videos: backstage.videos,
              photo: backstage.image.split('/')[backstage.image.split('/').length - 1],
              duration: backstage.duration,
              imageUrlBackstage: backstage.image,
              uploadedFile: '',
              displayFilename: 'none',
              movieLoading: false,
              loadingBackstage: false,
              percentage: 0
            })
          })
        }
        if (response.movie.file_info) {
          // console.log(response.movie.file_info)
          this.movieFileInfo = response.movie.file_info
          this.mainVideo.videos = response.movie.file_info.videos
          this.mainVideo.photo = response.movie.file_info.image.split('/')[response.movie.file_info.image.split('/').length - 1]
          this.mainVideo.mobilePtoho = response.movie.file_info.image_for_mobile.split('/')[response.movie.file_info.image_for_mobile.split('/').length - 1]
          this.mainVideo.tabletPhoto = response.movie.file_info.image_for_tablet.split('/')[response.movie.file_info.image_for_tablet.split('/').length - 1]
          this.mainVideo.imageUrlMain = response.movie.file_info.image
          this.mainVideo.imageUrlMobile = response.movie.file_info.image_for_mobile
          this.mainVideo.imageUrlTablet = response.movie.file_info.image_for_tablet
          this.mainVideo.duration = response.movie.file_info.duration
        }
        this.movie.imageMovieUrlMobile = response.movie.movie_banner_for_mobile
        this.movie.imageMovieUrlTablet = response.movie.movie_banner_for_tablet
        if (response.movie.logo_image) {
          this.imageUrlLogo = response.movie.logo_image
        }
        this.movie.category = response.movie.category ? response.movie.category.id : null
        this.movie.genres = response.movie.genres.map(genre => {
          return genre.id
        })
        this.active_category = response.movie.category
        this.movie.tags = response.movie.tags.map(tag => {
          return tag.id
        })
        this.movie.meta_description = response.movie.meta.description
        this.movie.meta_title = response.movie.meta.title
        this.movie.meta_tags = response.movie.meta.tags
        this.movie.related_movies = response.movie.related_movies
        this.movie.country = response.movie.country
        this.movie.country = response.movie.country
        this.movie.description = response.movie.description
        this.fileList = response.movie.scene_image.map((image, index) => {
          return {
            uid: index,
            name: 'pic' + index,
            status: 'done',
            response: {
              filename: image.split('/')[image.split('/').length - 1].split('.')[0]
            },
            url: image
          }
        })
        if (response.movie.pricing) {
          this.pricing.is_active = this.movie.active
          this.pricing.decline_period = parseInt(response.movie.pricing.decline_period)
          this.pricing.decline_price = parseInt(response.movie.pricing.decline_price) / 100
          this.pricing.final_decline_day = moment(response.movie.pricing.final_decline_day)
            .subtract(5, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')
          this.pricing.initial_decline_day = moment(response.movie.pricing.initial_decline_day)
            .subtract(5, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')
          this.pricing.initial_price = parseInt(response.movie.pricing.initial_price) / 100
          if (response.movie.payment_type === 'tvod') {
            if (this.pricing.initial_price < 10) {
              this.pricing.initial_price = 10
            }
          } else {
            this.pricing.initial_price = parseInt(response.movie.pricing.initial_price) / 100
          }
          this.pricing.substracted_price = parseInt(response.movie.pricing.substracted_price) / 100
          this.pricing.user_watched_period = parseInt(response.movie.pricing.user_watched_period)
        }
      })
    },
    getColor(status) {
      switch (status) {
        case 'SUCCESS':
          return 'green'
        case 'FAILED':
          return 'red'
        case 'PENDING':
          return 'orange'
        case 'RESIZING':
          return 'blue'
        case 'INITIAL':
          return 'yellow'
        default:
          return 'black'
      }
    },
    onAddRelatedMovie() {
      this.newRelatedMovies = this.movie.related_movies.map(movie => {
        return movie.id
      })
      this.allMovies = [
        ...this.movie.related_movies,
        ...this.allMovies.filter(movie => {
          return this.newRelatedMovies.indexOf(movie.id) < 0
        })
      ]
      this.moviesForTable = this.movie.related_movies
      this.addRelatedMovieModal = true
    },
    deleteRelatedMovie(event, given) {
      var deleting
      this.movie.related_movies.map((movie, index) => {
        if (movie.id === given.id) {
          deleting = index
        }
      })
      this.movie.related_movies.splice(deleting, 1)
    },
    handleOk() {
      this.movie.related_movies = this.moviesForTable
      this.addRelatedMovieModal = false
    },
    onDate(value) {
      this.movie.release_year = value.format('YYYY')
    },
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    getSource(value) {
      return {
        autoplay: false,
        controls: true,
        hls: true,
        sources: [
          {
            src: value
          }
        ]
      }
    },
    onSelectMovie(movie) {
      this.moviesForTable.push(
        this.allMovies.filter(movie1 => {
          return movie1.id === movie
        })[0]
      )
    },
    onDeselectMovie(movie) {
      var pos
      this.moviesForTable.map((movie1, index) => {
        if (movie1.id === movie) pos = index
      })
      this.moviesForTable.splice(pos, 1)
    },
    onAddTrailer() {
      this.trailers.push({
        videos: [],
        photo: '',
        format: '',
        imageUrlLogo: '',
        uploadedFile: '',
        displayFilename: 'none',
        movieLoading: false,
        loadingLogo: false,
        percentage: 0
      })
      this.trailerQuality.push(0)
    },
    onAddBackstage() {
      this.backstages.push({
        video: '',
        photo: '',
        format: '',
        imageUrlBackstage: '',
        uploadedFile: '',
        displayFilename: 'none',
        movieLoading: false,
        loadingBackstage: false,
        percentage: 0
      })
      this.backstageQuality.push(0)
    },
    fetchProducer(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true

      request({
        url: '/staff',
        params: { lang: this.lang ? this.lang : 'ru', position: 'producer', search: value }
      }).then(body => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        this.clientData = body.staffs
        const data = body.staffs.map(staff => ({
          text: staff.first_name + ' ' + staff.last_name,
          value: staff.id
        }))
        this.dataProducers = data
        this.fetching = false
      })
    },
    fetchDirectors(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.dataDirectors = []
      this.fetchingDirectors = true

      request({
        url: '/staff',
        params: { lang: this.lang ? this.lang : 'ru', position: 'director', search: value }
      }).then(body => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        this.clientData = body.staffs
        const data = body.staffs.map(staff => ({
          text: staff.first_name + ' ' + staff.last_name,
          value: staff.id
        }))
        this.dataDirectors = data
        this.fetchingDirectors = false
      })
    },
    fetchActors(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.dataActors = []
      this.fetchingActors = true

      request({
        url: '/staff',
        params: { lang: this.lang ? this.lang : 'ru', position: 'actor,actress', search: value }
      }).then(body => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        this.clientData = body.staffs
        const data = body.staffs.map(staff => ({
          text: staff.first_name + ' ' + staff.last_name,
          value: staff.id
        }))
        this.dataActors = data
        this.fetchingActors = false
      })
    },
    fetchMovies(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.allMovies = []
      this.fetchingMovies = true

      request({
        url: '/movies',
        params: { lang: this.lang ? this.lang : 'ru', search: value }
      }).then(body => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        const data = body.movies.map(movie => ({
          ...movie
        }))
        this.allMovies = data
        this.fetchingMovies = false
      })
    },
    fetchCountries(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      this.fetchingCountries = true
      const fetchId = this.lastFetchId
      if (fetchId !== this.lastFetchId) {
        return
      }
      this.getCountries({ current: 1, pageSize: 20, search: value, lang: this.lang }).then(() => {
        this.fetchingCountries = false
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64Preview(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    activeTabHandler(_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    onButtonClick(index) {
      document.getElementById('movie' + index).click()
    },
    onButtonBackstageClick(index) {
      document.getElementById('backstage' + index).click()
    },
    onButtonMainClick() {
      document.getElementById('mainVideo').click()
    },
    onMovieChange(e, index) {
      this.trailers[index].movieLoading = true
      var file = e.target.files[0]

      this.trailerUpdate[index] = new tus.Upload(file, {
        chunkSize: 128000000, // 3000000, // 128000000,
        endpoint: `${process.env.VUE_APP_API_BASE_URL}${this.isStory}/`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onError: function(error) {
          console.log('Failed because: ' + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          this.trailers[index].percentage = (bytesUploaded / bytesTotal) * 100
        },
        onSuccess: () => {
          this.trailers[index].movieLoading = false
          this.trailers[index].displayFilename = 'block'
          this.trailers[index].uploadedFile = this.trailerUpdate[index].file.name
          
          this.trailers[index].videos = [
            { file_name: this.trailerUpdate[index].url, quality: 'original', status: 'PENDING' }
          ]
        }
      })
      this.trailerUpdate[index].start()
    },
    onMovieBackstageChange(e, index) {
      this.backstages[index].movieLoading = true
      var file = e.target.files[0]

      this.backstageUpdate[index] = new tus.Upload(file, {
        endpoint: `${process.env.VUE_APP_API_BASE_URL}${this.isStory}/`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        chunkSize: 128000000, // 3000000, // 128000000,
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onError: function(error) {
          console.log('Failed because: ' + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          this.backstages[index].percentage = (bytesUploaded / bytesTotal) * 100
        },
        onSuccess: () => {
          this.backstages[index].movieLoading = false
          this.backstages[index].displayFilename = 'block'
          this.backstages[index].uploadedFile = this.backstageUpdate[index].file.name
          this.backstages[index].videos = [
            { file_name: this.backstageUpdate[index].url, quality: 'original', status: 'PENDING' }
          ]
        }
      })
      this.backstageUpdate[index].start()
    },
    onMovieMainChange(e) {
      this.mainVideo.movieLoading = true
      var file = e.target.files[0]
      this.mainUpdate = new tus.Upload(file, {
        endpoint: `${process.env.VUE_APP_API_BASE_URL}${this.isStory}/`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        chunkSize: 128000000, // 3000000,
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onError: function(error) {
          console.log('Failed because: ' + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          this.mainVideo.percentage = (bytesUploaded / bytesTotal) * 100
          // console.log(this.mainVideo.percentage)
        },
        onSuccess: () => {
          this.mainVideo.movieLoading = false
          this.mainVideo.displayFilename = 'block'
          this.mainVideo.percentage = 100
          this.mainVideo.uploadedFile = this.mainUpdate.file.name
          this.mainVideo.videos = [{ file_name: this.mainUpdate.url, quality: 'original', status: null }]
        }
      })
      this.mainUpdate.start()
    },
    stopUploadingVideo() {
       this.mainVideo.videos = []
        this.mainVideo.uploadedFile = ''
        this.mainVideo.movieLoading = false
        this.mainVideo.displayFilename = 'block'
         this.mainVideo.duration = null
        if (this.movieFileInfo) {
          this.deleteRequestMovie()
        } 
    },
    onDeleteMainVideoClick() {
      // console.log('video', this.movieFileInfo)
      if (this.movieFileInfo) {
        this.deleteRequestMovie()
      } else {
        this.mainVideo.videos = []
        this.mainVideo.uploadedFile = ''
        this.mainVideo.displayFilename = 'none'
        this.mainVideo.duration = null
      }
    },
    onDeleteTrailerVideoClick(index) {
      this.trailers[index].videos = []
      this.trailers[index].uploadedFile = ''
      this.trailers[index].displayFilename = 'none'
      this.trailers[index].duration = null
      console.log(this.trailers[index].videos)
    },
    onDeleteBackstageVideoClick(index) {
      this.backstages[index].videos = []
      this.backstages[index].uploadedFile = ''
      this.backstages[index].displayFilename = 'none'
      this.backstages[index].duration = null
    },
    onDeleteTrailerClick(index) {
      this.trailers.splice(index, 1)
      this.trailerQuality.splice(index, 1)
    },
    onDeleteBackstageClick(index) {
      this.backstages.splice(index, 1)
      this.backstageQuality.splice(index, 1)
    },
    handleChangeLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrlLogo = imageUrl
          this.loadingLogo = false
          this.movie.logo_image = info.file.response.filename
        })
      }
    },
    handleMobileBannerImg(info, index) {
      if (info.file.status === 'uploading') {
        this.movie.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl => {
          this.movie.imageMovieUrlMobile = imageUrl
          this.movie.loadingLogo = false
          this.movie.movie_banner_for_mobile = info.file.response.filename
        })
      }
    },
     handleTabletBannerImg(info, index) {
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl => {
          this.movie.imageMovieUrlTablet = imageUrl

          this.movie.movie_banner_for_tablet = info.file.response.filename
        })
      }
    },
    deleteMovieLogo() {
      this.movie.imageMovieUrlMobile = ''
      this.movie.loadingLogo = false
      this.movie.movie_banner_for_mobile = ''
    },
    handleChangeLogo(info, index) {
      if (info.file.status === 'uploading') {
        this.trailers[index].loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.trailers[index].imageUrlLogo = imageUrl
          this.trailers[index].loadingLogo = false
          this.trailers[index].photo = info.file.response.filename
        })
      }
    },
    deleteTrailerImage(n, index) {
        this.trailers[index].imageUrlLogo = ''
        this.trailers[index].loadingLogo = false
        this.trailers[index].photo = ''
    },
    handleChangeBackstage(info, index) {
      if (info.file.status === 'uploading') {
        this.backstages[index].loadingBackstage = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.backstages[index].imageUrlBackstage = imageUrl
          this.backstages[index].loadingBackstage = false
          this.backstages[index].photo = info.file.response.filename
        })
      }
    },
    handleChangeMain(info) {
      if (info.file.status === 'uploading') {
        this.mainVideo.loadingMain = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.mainVideo.imageUrlMain = imageUrl
          this.mainVideo.loadingMain = false
          this.mainVideo.photo = info.file.response.filename
        })
      }
    },
    handleChangeMainMobile(info) {
      if (info.file.status === 'uploading') {
        this.mainVideo.loadingMobile = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.mainVideo.imageUrlMobile = imageUrl
          this.mainVideo.loadingMobile = false
          this.mainVideo.mobilePtoho = info.file.response.filename
        })
      }
    },
     handleChangeMainTablet(info) {
      if (info.file.status === 'uploading') {
        this.mainVideo.loadingTablet = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.mainVideo.imageUrlTablet = imageUrl
          this.mainVideo.loadingTablet = false
          this.mainVideo.tabletPhoto = info.file.response.filename
        })
      }
    },
    beforeUploadLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    showUpdateModal(id) {
      this.previewFeedbackVisible = true
      this.getSelectedFeedback(id)
    },
    getSelectedFeedback(id) {
      this.feedback = {
        id: null,
        comment: '',
        customer_id: '',
        customer_name: '',
        episode_key: null,
        movie_key: null,
        season_key: null,
        rate: null,
        active: false
      }
      request({
        url: '/feedback/' + id,
        method: 'get'
      }).then(response => {
        this.feedback.id = id
        this.feedback.customer_id = response.feedback.customer_id
        this.feedback.customer_name = response.feedback.customer_name
        this.feedback.rate = response.feedback.rate
        this.feedback.episode_key = response.feedback.episode_key
        this.feedback.movie_key = response.feedback.movie_key
        this.feedback.comment = response.feedback.comment
        this.feedback.active = response.feedback.active
      })
    },
    deleteFeedback(e, id) {
      request({
        url: '/feedback/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getFeedbacks({ ...this.getPagination, slug: this.movieId })
        })
        .then(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    deleteRequestMovie () {
        request({
        url: '/movie',
        data: {
          file_info: this.movieFileInfo,
          slug: this.movieId
        },
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getFeedbacks({ ...this.getPagination, slug: this.movieId })
          this.mainVideo.videos = []
          this.mainVideo.uploadedFile = ''
          this.mainVideo.displayFilename = 'none'
          this.mainVideo.duration = null
          // this.onSubmit()
          this.getMoviesAttrs()
        })
        .catch(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    deleteSeason(e, id) {
      request({
        url: '/movies/' + this.movie.id + '/seasons/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getMoviesAttrs({ ...this.getPagination, slug: this.movieId })
        })
        .then(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSubmitFeedback() {
      const data = {
        comment: this.feedback.comment,
        customer_id: this.feedback.customer_id,
        customer_name: this.feedback.customer_name,
        episode_key: this.feedback.episode_key,
        movie_key: this.feedback.movie_key,
        rate: parseInt(this.feedback.rate),
        active: this.feedback.active
      }
      request({
        url: '/feedback/' + this.feedback.id,
        method: 'put',
        data: data
      }).then(response => {
        this.$message.success(this.$t('successfullyUpdated'))
        this.getFeedbacks({ ...this.paginationFeedbacks, slug: this.movieId }).then(
          () => (this.previewFeedbackVisible = false)
        )
      })
    },
    onSubmit(exit, language = 'ru') {
      let currentLag = language

      if (this.lang) {
        currentLag = this.lang
      }

      if (this.imageError || this.imageErrorMobile || this.imageErrorTablet) {
        this.loading = false
        return
      }

      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (new Date(this.pricing.initial_decline_day) > new Date(this.pricing.final_decline_day)) {
              this.$message.error(this.$t('Invalid date'))
              throw new Error()
            }
            var staffs = []
            this.movie.actors.map(actor => {
              staffs.push({
                position: 'actor',
                staff: actor
              })
            })
            this.movie.directors.map(director => {
              staffs.push({
                position: 'director',
                staff: director
              })
            })
            this.movie.producers.map(producer => {
              staffs.push({
                position: 'producer',
                staff: producer
              })
            })
            const relatedMovies = this.movie.related_movies
              ? this.movie.related_movies.map(movie => {
                  return movie.id
                })
              : []
            const movie = {
              active: this.movie.active,
              content_owner: this.movie.content_owner,
              // rating_imdb: this.movie.rating_imdb,
              backstage:
                this.backstages[0].photo || this.backstages[0].videos
                  ? this.backstages.map(backstage => {
                      return {
                        duration: parseInt(backstage.duration),
                        image: backstage.photo,
                        videos: backstage.videos
                          ? backstage.videos.map(video => {
                              return {
                                file_name:
                                  video.file_name.split('/')[video.file_name.split('/').length - 1] === 'm3u8'
                                    ? video.file_name
                                        .split('/')[video.file_name.split('/').length - 2].split('.')[0]
                                        .split('+')[0]
                                    : video.file_name
                                        .split('/')[video.file_name.split('/').length - 1].split('.')[0]
                                        .split('+')[0],
                                quality: video.quality,
                                status: video.status
                              }
                            })
                          : null
                      }
                    })
                  : null,
              category: this.$route.query.story
                ? this.categories.filter(categoriy => categoriy.slug === 'story')[0].id
                : this.$route.query.masterclass
                ? this.categories.filter(categoriy => categoriy.slug === 'masterklass')[0].id
                : this.movie.category,
              country: this.movie.country,
              description: this.movie.description,
              // duration: parseInt(this.movie.duration),
              file_info:
                this.mainVideo.photo || this.mainVideo.videos
                  ? {
                      duration: parseInt(this.mainVideo.duration),
                      image: this.mainVideo.photo,
                      image_for_mobile: this.mainVideo.mobilePtoho,
                      image_for_tablet: this.mainVideo.tabletPhoto,
                      videos: this.mainVideo.videos
                        ? this.mainVideo.videos.map(video => {
                            return {
                              file_name: this.getFileName(video),
                              quality: video.quality,
                              status: video.status,
                              height: video.height,
                              width: video.width
                            }
                          })
                        : null
                    }
                  : null,
              genres: this.active_category?.slug === 'kliplar' ? 'aaa' : this.$route.query.story ? '138' : this.movie.genres.join(','),
              tags: Array.isArray(this.movie.tags) ? this.movie.tags?.join('') : this.movie.tags,
              is_serial: this.movie.is_serial,
              is_free: this.movie.is_free,
              lang: currentLag,
              logo_image: this.movie.logo_image,
              plot: this.movie.plot,
              related_movies: relatedMovies.join(','),
              release_year: parseInt(moment(this.movie.release_year).format('YYYY')),
              scene_image: this.fileList
                .map(image => {
                  return image.response.filename
                })
                .join(','),
              // size: parseInt(this.movie.size),
              slogan: this.movie.slogan,
              staffs: staffs,
              title: this.movie.title,
              movie_banner_for_mobile: this.movie.movie_banner_for_mobile,
              movie_banner_for_tablet: this.movie.movie_banner_for_tablet,
              age_restriction: parseInt(this.movie.age_restriction),
              skip_entity: parseInt(this.movie.skip_entity),
              story_link: this.movie.story_link,
              payment_type: this.$route.query.story ? 'free' : this.movie.payment_type,
              meta: {
                description: this.movie.meta_description,
                tags: this.movie.meta_tags,
                title: this.movie.meta_title
              },
              trailer:
                this.trailers[0].photo || this.trailers[0].videos
                  ? this.trailers.map(trailer => {
                      return {
                        duration: parseInt(trailer.duration),
                        image: trailer.photo,
                        videos: trailer.videos
                          ? trailer.videos.map(video => {
                              return {
                                file_name: this.getFileName(video),
                                quality: video.quality,
                                status: video.status
                              }
                            })
                          : null
                      }
                    })
                  : null
            }
            var url = '/movies'
            var method = 'post'
            if (this.movieId) {
              url = '/movies/' + this.movieId
              method = 'put'
            }
            const headers = {
              'Content-Type': 'application/json'
            }
            request({
              url: url,
              method: method,
              data: movie,
              headers: headers
            })
              .then(res => {
                if (this.movieId) {
                 if (this.pricing.initial_price < 10) {
                   request({
                    url: `/movie-pricing/${this.movieId}`,
                    method: 'put',
                    data: { decline_period: 0, decline_price: 0, episode_number: 0, final_decline_day: '6023-06-30 13:00:00', initial_decline_day: '6021-06-30 13:00:00', initial_price: 10, is_active: this.pricing.is_active, is_serial: this.pricing.is_serial, lang: this.pricing.lang, season_number: this.pricing.season_number, user_watched_period: this.pricing.user_watched_period },
                    headers: headers
                  }).catch(res => {
                    alert(res.data.message)
                  })
                 } else {
                   request({
                    url: `/movie-pricing/${this.movieId}`,
                    method: 'put',
                    data: { decline_period: 0, decline_price: 0, episode_number: 0, final_decline_day: '6023-06-30 13:00:00', initial_decline_day: '6021-06-30 13:00:00', initial_price: this.pricing.initial_price, is_active: this.pricing.is_active, is_serial: this.pricing.is_serial, lang: this.pricing.lang, season_number: this.pricing.season_number, user_watched_period: this.pricing.user_watched_period },
                    headers: headers
                  }).catch(res => {
                    alert(res.data.message)
                  })
                 }
                }
                this.getMovies(this.paginationMovies)
                if (exit) {
                  this.mainVideo = {
                    videos: [],
                    photo: '',
                    mobilePtoho: '',
                    tabletPhoto: '',
                    format: '',
                    videoUrl: '',
                    imageUrlMain: '',
                    imageUrlMobile: '',
                    imageUrlTablet: '',
                    uploadedFile: '',
                    displayFilename: 'none',
                    movieLoading: false,
                    loadingMain: false,
                    loadingMobile: false,
                    loadingTablet: false,
                    percentage: 0
                  }
                  this.$router.replace('/movie/list')
                }
                resolve(res)
              })
              .catch(err => {
                if (err) {
                  // this.$message.error(this.$t(err ? `${err.response.data.message}` : 'error'))
                  this.$message.error(this.$t('error'))
                  console.log(err.response.data)
                  reject(err)
                }
              })
          } else {
            reject(valid)
          }
        })
      }).catch(err => {
        if (err.response.data.code === 'TAGS_OVERLIMIT') {
          alert('превышение лимита тегов')
        }
        console.log(err)
      })
    },
    beforeUpload(file, fileList) {
      return false
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // utils
    getFileName(e) {
      if (e.file_name.split('/')[e.file_name.split('/').length - 1] !== 'm3u8') {
        if (e.file_name.split('/')[e.file_name.split('/').length - 1].split('.')[1] !== 'm3u8') {
          return e.file_name.split('/')[e.file_name.split('/').length - 1].split('.')[0].split('+')[0]
        } else {
          if (e.quality === 'auto') {
            return e.file_name.split('/')[e.file_name.split('/').length - 2]
          } else {
            return e.file_name.split('/')[e.file_name.split('/').length - 3]
          }
        }
      }
    },
  },
  beforeDestroy() {
    if (this.trailerUpdate && this.trailerUpdate.length) {
      this.trailerUpdate.forEach(update => {
        update.abort()
      })
    }
    if (this.backstageUpdate && this.backstageUpdate.length) {
      this.backstageUpdate.forEach(update => {
        update.abort()
      })
    }
    if (this.mainUpdate) this.mainUpdate.abort()
  },
  watch: {
    lang (val) {
      console.log('val', val);
    },
    'movie.payment_type'(val) {
      if (val === 'tvod') {
        if (this.pricing.initial_price < 10) {
          this.pricing.initial_price = 10
       }
      }
    },
    'movie.story_link'(val) {
      console.log('STORY LINK ==>', val)
    },
    'mainVideo.imageUrlMain'(val) {
      if (val) {
        this.imageError = false
      } else {
        this.imageError = true
      }
      console.log('imageUrl', val)
    },
    'mainVideo.imageUrlMobile'(val) {
      if (val) {
        this.imageErrorMobile = false
      } else {
        this.imageErrorMobile = true
      }
    },
    'mainVideo.imageUrlTablet'(val) {
      if (val) {
        this.imageErrorTablet = false
      } else {
        this.imageErrorTablet = true
      }
    },
    'mainVideo.videos'(val) {
      // console.log('VIDEo==>', val.map((item) => {
      //   const url = 'https://cdn.uzd.udevs.io/milliontv/videos/f447a10955b8172c1f87208eab7884ad/240p/index.m3u8'
      //   return url.split('/')[url.split('/').length - 1].split('.')[1]
      //   // if (item.quality === 'auto') {
      //   //   return item.file_name.split('/')[item.file_name.split('/').length - 2]
      //   // } else {
      //   //   return item.file_name.split('/')[item.file_name.split('/').length - 3]
      //   // }
      // }))
      // if (val.length) {
      //   this.videoError = false
      // } else {
      //   this.videoError = true
      // }
      console.log('imageUrl2', val)
    },
    'movie.seasons': {
      handler: (val, oldVal) => {
        // console.log('ssses', val, oldVal)
      },
      deep: true
    }
  }
}
</script>
<style>
.player {
  width: 100%;
}
.vjs-custom-skin {
  height: 100% !important;
}
.vjs-custom-skin .video-js {
  width: 100% !important;
  max-height: 200px;
}
.ant-card-body {
  padding: 10px !important;
}
.red {
  color: red;
}
.banner-image {
  display: flex;
  align-items: center;
}
</style>
