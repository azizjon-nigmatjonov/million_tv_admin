<template>
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
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item :label="$t('logo_image') + ' (1x1.4)'">
                  <a-upload
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
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
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item :label="$t('status')" prop="status">
                  <a-switch v-model="movie.active" :checked-children="$t('active')" :un-checked-children="$t('inactive')" default-checked />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :md="10" style="padding: 0 15px">
                <a-form-model-item :label="$t('title')" prop="title">
                  <a-input
                    v-model="movie.title"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :md="10" style="padding: 0 15px">
                <a-form-model-item :label="$t('episode_number')" prop="episode_number">
                  <!-- <a-input
                    v-if="$route.query?.episode_number"
                    disabled
                    :value="$route.query.episode_number"
                    type="number"
                  /> -->
                  <a-input
                    disabled
                    :value="movie.episode_number"
                    type="number"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="4" style="padding: 0 15px">
                <a-form-model-item :label="$t('isNew')" prop="is_popular">
                  <a-switch v-model="movie.is_new" :checked-children="$t('new')" :un-checked-children="$t('notNew')" default-checked />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('description')" prop="description">
                  <a-textarea
                  v-model="movie.description"
                  :placeholder="$t('description')"
                  :auto-size="{ minRows: 4, maxRows: 7 }"
                  />
              </a-form-model-item>
              </a-col>
              <a-col :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('plot')" prop="plot">
                  <a-textarea
                  v-model="movie.plot"
                  :placeholder="$t('plot')"
                  :auto-size="{ minRows: 10, maxRows: 13 }"
                  />
              </a-form-model-item>
              </a-col>
            </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('multimedia')">
          <a-card :title="$t('mainVideo')" :bordered="true" style="margin-bottom: 15px">
            <a-row>
              <a-col style="padding-left: 10px; padding-bottom: 10px" :xs="24" :md="8">
                  <a-row style="height: 100%">
                    <a-col :xs="24" style="padding: 0 15px" class="id_video">
                      <a-form-model-item :label="$t('backgroundImage') + ' (1x1.3)'">
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
                    </a-col>
                    <a-col :xs="24" style="padding: 0 15px">
                      <a-form-model-item v-if="mainVideo.videos && mainVideo.videos.length" prop="mainVideo">
                          <template slot="label">
                            <a-row>
                              <a-col :span="8">
                                {{ $t('video') }}
                              </a-col>
                              <a-col :span="16">
                                <a-select
                                  v-model="mainQuality">
                                  <a-select-option v-for="(quality, index1) in mainVideo.videos" :key="quality.quality" :value="index1">
                                    {{ quality.quality ? quality.quality : $t('unknown') }} {{ quality.status ? '( ' + $t(quality.status) + ' )' : '' }}
                                  </a-select-option>
                                </a-select>
                              </a-col>
                            </a-row>
                          </template>
                          <a-button v-if="mainVideo.videos[mainQuality].file_name.split('/')[mainVideo.videos[mainQuality].file_name.split('/').length - 1].split('.')[1] === 'm3u8'" @click="onDeleteMainVideoClick" style="padding: 0; z-index: 8; position: absolute; height: 30px; width: 30px; right: -31px; top: 1px; font-size: 20px">
                            <a-icon type="close" style="color: black;"/>
                          </a-button>
                          <a-button v-else @click="onDeleteMainVideoClick" style="padding: 0; z-index: 8; position: absolute; height: 30px; width: 30px; right: 0; font-size: 20px">
                            <a-icon type="close" style="color: black;"/>
                          </a-button>
                          <video-player v-if="mainVideo.videos[mainQuality].file_name.split('/')[mainVideo.videos[mainQuality].file_name.split('/').length - 1].split('.')[1] === 'm3u8'" class="vjs-custom-skin" :options="getSource(mainVideo.videos[mainQuality].file_name)"/>
                          <video v-else width="100%" :src="mainVideo.videos[mainQuality].file_name" controls>
                            unreadable format by your browser
                          </video>
                        <p :style="{ display: mainVideo.displayFilename, whiteSpace: 'nowrap', overflow: 'hidden', marginTop: '10px' }"><strong>{{ $t('Uploaded file') }}</strong> : {{ mainVideo.uploadedFile }}</p>
                      </a-form-model-item>
                      <a-form-model-item v-else :label="$t('mainVideo')" prop="mainVideo">
                          <a-button style="height: 104px; width: 100%" type="dashed" :loading="mainVideo.movieLoading" @click="onButtonMainClick"> <a-icon v-if="!mainVideo.movieLoading" type="plus"/> <br/> {{ !mainVideo.movieLoading ? $t('upload') : '' }} </a-button>
                          <input accept=".mp4, .mkv, webm, .avm" :id="'mainVideo'" style="display: none" type="file" @change="onMovieMainChange" title="upload" />
                          <a-progress
                            :style="{ display: mainVideo.movieLoading ? 'block' : 'none' }"
                            :stroke-color="{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }"
                            :percent="Math.round(mainVideo.percentage*100)/100"
                          />
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" style="padding: 0 15px; overflow: hidden">
                      <p>{{ $t('duration') }} : {{ mainVideo.videos && mainVideo.videos.length && mainVideo.videos[mainQuality] && mainVideo.videos[mainQuality].duration ? `${Math.floor((mainVideo.videos[mainQuality].duration) / 60)}:${((mainVideo.videos[mainQuality].duration) % 60 > 9 ? '' : '0')}${(mainVideo.videos[mainQuality].duration) % 60}` : '' }}</p>
                    </a-col>
                  </a-row>
              </a-col>
            </a-row>
          </a-card>
          <!-- <a-card :title="$t('scene_images')" :bordered="true" style="margin-bottom: 15px;">
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
          </a-card>
          <a-card :title="$t('trailers')" :bordered="true" style="margin-bottom: 15px">
            <a-row style="display: flex; align-items: stretch; overflow-x: scroll">
              <a-col style="padding-left: 10px; padding-bottom: 10px" v-for="(trailer, index) in trailers" :key="index" :xs="24" :md="8">
                  <a-row style="height: 100%">
                    <a-card :bordered="true" style="height: 100%">
                      <a-button v-if="trailers && trailers.length > 1 && index > 0" @click="onDeleteTrailerClick(index)" style="padding: 0; z-index: 8; position: absolute; float: right; height: 25px; width: 25px; right: 4px; top: 4px; font-size: 15px">
                        <a-icon type="close" style="color: black;"/>
                      </a-button>
                      <a-col :xs="24" style="padding: 0 15px" class="id_video">
                        <a-form-model-item :label="$t('backgroundImage')" prop="backgroundImage">
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
                                <a-select
                                v-model="trailerQuality[index]">
                                  <a-select-option v-for="(quality, index1) in trailer.videos" :key="quality.quality" :value="index1">
                                    {{ quality.quality ? quality.quality : $t('unknown') }} {{ quality.status ? '( ' + $t(quality.status) + ' )' : '' }}
                                  </a-select-option>
                                </a-select>
                              </a-col>
                            </a-row>
                          </template>
                          <a-button v-if="trailer.videos[trailerQuality[index]].file_name.split('/')[trailer.videos[trailerQuality[index]].file_name.split('/').length - 1] === 'm3u8'" @click="onDeleteTrailerVideoClick(index)" style="padding: 0; z-index: 8; position: absolute; height: 30px; width: 30px; right: -31px; top: 1px; font-size: 20px">
                            <a-icon type="close" style="color: black;"/>
                          </a-button>
                          <a-button v-else @click="onDeleteTrailerVideoClick(index)" style="padding: 0; z-index: 8; position: absolute; height: 30px; width: 30px; right: 0; font-size: 20px">
                            <a-icon type="close" style="color: black;"/>
                          </a-button>
                          <video-player v-if="trailer.videos[trailerQuality[index]].file_name.split('/')[trailer.videos[trailerQuality[index]].file_name.split('/').length - 1] === 'm3u8'" class="vjs-custom-skin" :options="getSource(trailer.videos[trailerQuality[index]].file_name)"/>
                          <video v-else width="100%" :src="trailer.videos[trailerQuality[index]].file_name" controls>
                            unreadable format by your browser
                          </video>
                          <p :style="{ display: trailer.displayFilename, whiteSpace: 'nowrap', overflow: 'hidden', marginTop: '10px' }"><strong>{{ $t('Uploaded file') }}</strong> : {{ trailer.uploadedFile }}</p>
                        </a-form-model-item>
                        <a-form-model-item v-else :label="$t('video')" prop="trailer">
                            <a-button style="height: 104px; width: 100%" type="dashed" :loading="trailer.movieLoading" @click="onButtonClick(index)">  <a-icon v-if="!trailer.movieLoading" type="plus"/> <br/> {{ !trailer.movieLoading ? $t('upload') : '' }} </a-button>
                            <input :id="'movie' + index" style="display: none" accept="video/*" type="file" @change="onMovieChange($event, index)" title="upload" />
                            <a-progress
                              :style="{ display: trailer.movieLoading ? 'block' : 'none' }"
                              :stroke-color="{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }"
                              :percent="Math.round(trailer.percentage*100)/100"
                            />
                        </a-form-model-item>
                      </a-col>
                      <a-col :xs="24" style="padding: 0 15px; overflow: hidden">
                        <p>{{ $t('duration') }} : {{ trailer.videos && trailer.videos.length && trailer.videos[trailerQuality[index]] && trailer.videos[trailerQuality[index]].duration ? `${Math.floor((trailer.videos[trailerQuality[index]].duration) / 60)}:${((trailer.videos[trailerQuality[index]].duration) % 60 > 9 ? '' : '0')}${(trailer.videos[trailerQuality[index]].duration) % 60}` : '' }}</p>
                      </a-col>
                    </a-card>
                  </a-row>
              </a-col>
              <a-col :xs="24" :md="8" style="padding-left: 10px; padding-bottom: 10px">
                <a-button type="dashed" icon="plus" style="height: 100%; width: 100%; font-size: 20px" @click="onAddTrailer">
                  {{ $t('add') }}
                </a-button>
              </a-col>
            </a-row>
          </a-card>
          <a-card :title="$t('backstage')" :bordered="true">
            <a-row style="display: flex; align-items: stretch; overflow-x: scroll">
              <a-col style="padding-left: 10px; padding-bottom: 10px" v-for="(backstage, index) in backstages" :key="index" :xs="24" :md="8">
                  <a-row style="height: 100%">
                    <a-card :bordered="true" style="height: 100%">
                      <a-button v-if="backstages && backstages.length > 1 && index > 0" @click="onDeleteBackstageClick(index)" style="padding: 0; z-index: 8; position: absolute; float: right; height: 25px; width: 25px; right: 4px; top: 4px; font-size: 15px">
                        <a-icon type="close" style="color: black;"/>
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
                                <a-select
                                v-model="backstageQuality[index]">
                                  <a-select-option v-for="(quality, index1) in backstage.videos" :key="quality.quality" :value="index1">
                                    {{ quality.quality ? quality.quality : $t('unknown') }} {{ quality.status ? '( ' + $t(quality.status) + ' )' : '' }}
                                  </a-select-option>
                                </a-select>
                              </a-col>
                            </a-row>
                          </template>
                          <a-button v-if="backstage.videos[backstageQuality[index]].file_name.split('/')[backstage.videos[backstageQuality[index]].file_name.split('/').length - 1] === 'm3u8'" @click="onDeleteBackstageVideoClick(index)" style="padding: 0; z-index: 8; position: absolute; height: 30px; width: 30px; right: -31px; top: 1px; font-size: 20px">
                            <a-icon type="close" style="color: black;"/>
                          </a-button>
                          <a-button v-else @click="onDeleteBackstageVideoClick(index)" style="padding: 0; z-index: 8; position: absolute; height: 30px; width: 30px; right: 0; font-size: 20px">
                            <a-icon type="close" style="color: black;"/>
                          </a-button>
                          <video-player v-if="backstage.videos[backstageQuality[index]].file_name.split('/')[backstage.videos[backstageQuality[index]].file_name.split('/').length - 1] === 'm3u8'" class="vjs-custom-skin" :options="getSource(backstage.videos[backstageQuality[index]].file_name)"/>
                          <video v-else width="100%" :src="backstage.videos[backstageQuality[index]].file_name" controls>
                            unreadable format by your browser
                          </video>
                          <p :style="{ display: backstage.displayFilename, whiteSpace: 'nowrap', overflow: 'hidden', marginTop: '10px' }"><strong>{{ $t('Uploaded file') }}</strong> : {{ backstage.uploadedFile }}</p>
                        </a-form-model-item>
                        <a-form-model-item v-else :label="$t('backstage')" prop="backstage">
                            <a-button style="height: 104px; width: 100%" type="dashed" :loading="backstage.movieLoading" @click="onButtonBackstageClick(index)">  <a-icon v-if="!backstage.movieLoading" type="plus"/> <br/> {{ !backstage.movieLoading ? $t('upload') : '' }} </a-button>
                            <input :id="'backstage' + index" style="display: none" accept="video/*" type="file" @change="onMovieBackstageChange($event, index)" title="upload" />
                            <a-progress
                              :style="{ display: backstage.movieLoading ? 'block' : 'none' }"
                              :stroke-color="{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }"
                              :percent="Math.round(backstage.percentage*100)/100"
                            />
                        </a-form-model-item>
                      </a-col>
                      <a-col :xs="24" style="padding: 0 15px; overflow: hidden">
                        <p>{{ $t('duration') }} : {{ backstage.videos && backstage.videos.length && backstage.videos[backstageQuality[index]] && backstage.videos[backstageQuality[index]].duration ? `${Math.floor((backstage.videos[backstageQuality[index]].duration) / 60)}:${((backstage.videos[backstageQuality[index]].duration) % 60 > 9 ? '' : '0')}${(backstage.videos[backstageQuality[index]].duration) % 60}` : '0' }}</p>
                      </a-col>
                    </a-card>
                  </a-row>
              </a-col>
              <a-col :xs="24" :md="8" style="padding-left: 10px; padding-bottom: 10px">
                <a-button type="dashed" icon="plus" style="height: 100%; width: 100%; font-size: 20px" @click="onAddBackstage">
                  {{ $t('add') }}
                </a-button>
              </a-col>
            </a-row>
          </a-card>
          -->
        </a-tab-pane>
        <a-tab-pane v-if="movieId" key="4" :tab="$t('feedbacks')">
          <a-table
            :columns="columnsFeedback"
            :rowKey="record => record.id"
            :dataSource="feedbacks"
            :pagination="paginationFeedbacks"
            @change="handleTableChange">
            <template slot="status" slot-scope="text, row">
              <a-tag :color="row.active ? 'green' : 'red'" >{{ row.active ? $t('active') : $t('inactive') }}</a-tag>
            </template>
            <template slot="action" slot-scope="text, row">
              <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
                <a-button style="margin-right: 5px" id="buttonUpdate" @click="showUpdateModal(row.id)" type="default" icon="edit"></a-button>
              </a-tooltip>
              <a-popconfirm
                placement="left"
                slot="extra"
                :title="$t('deleteMsg')"
                @confirm="deleteFeedback($event, row.slug)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
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
              :wrapper-col="wrapperCol">
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
                    <a-input
                      v-model="feedback.customer_name"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="6" style="padding: 0 15px">
                  <a-form-model-item :label="$t('rate')" prop="rate">
                    <a-input
                      v-model="feedback.rate"
                      type="number"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="4" style="padding: 0 15px">
                  <a-form-model-item :label="$t('status')" prop="status">
                    <a-switch v-model="feedback.active" :checked-children="$t('active')" :un-checked-children="$t('inactive')" default-checked />
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
        </a-tab-pane>
        <a-tab-pane key="6" :tab="$t('SEO')">
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('Meta description')" prop="meta_description">
                <a-input
                  v-model="movie.meta_description"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('Meta tags')" prop="meta_tags">
                <a-input
                  v-model="movie.meta_tags"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('Meta title')" prop="meta_title">
                <a-input
                  v-model="movie.meta_title"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="7" v-if="movieId && false" :tab="$t('price')">
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('decline_period')" prop="decline_period">
                <a-input-number
                  style="width: 100%"
                  v-model="pricing.decline_period"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('decline_price')" prop="decline_price">
                <a-input-number
                  style="width: 100%"
                  v-model="pricing.decline_price"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('final_decline_day')" prop="final_decline_day">
                <a-date-picker
                  style="width: 100%"
                  v-model="pricing.final_decline_day"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('initial_decline_day')" prop="initial_decline_day">
                <a-date-picker
                  style="width: 100%"
                  v-model="pricing.initial_decline_day"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('initial_price')" prop="initial_price">
                <a-input-number
                  style="width: 100%"
                  v-model="pricing.initial_price"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('substracted_price')" prop="substracted_price">
                <a-input-number
                  disabled
                  style="width: 100%"
                  v-model="pricing.substracted_price"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('user_watched_period')" prop="user_watched_period">
                <a-input-number
                  style="width: 100%"
                  v-model="pricing.user_watched_period"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        </a-tabs>
    </a-form-model>
</template>

<script>
import * as tus from 'tus-js-client'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import VideoPlayer from '@/components/video/video';
import moment from 'moment'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function getBase64Preview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  data () {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      movieSlug: '',
      movieId: this.$route.params.movieId,
      seasonId: this.$route.params.seasonId,
      episodeId: this.$route.params.id,
      activeTabKey: '1',
      fetching: false,
      fetchingDirectors: false,
      fetchingActors: false,
      fetchingMovies: false,
      addRelatedMovieModal: false,
      newRelatedMovies: [],
      trailerQuality: [0],
      mainQuality: 0,
      backstageQuality: [0],
      previewVisible: false,
      allMovies: [],
      previewImage: '',
      fileList: [],
      data: [],
      dataDirectors: [],
      dataProducers: [],
      dataActors: [],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      imageUrlLogo: '',
      loadingLogo: false,
      producers: [],
      directors: [],
      backstageUpdate: [],
      trailerUpdate: [],
      mainUpdate: null,
      previewFeedbackVisible: false,
      feedback: {
        id: null,
        comment: '',
        customer_id: '',
        customer_name: '',
        episode_key: '',
        movie_key: '',
        rate: null,
        active: false
      },
      actors: [],
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
          quality: '',
          duration: null,
          imageUrlLogo: '',
          uploadedFile: '',
          displayFilename: 'none',
          movieLoading: false,
          loadingLogo: false,
          percentage: 0
        }
      ],
      mainVideo: {
        videos: '',
        photo: '',
        quality: '',
        duration: null,
        videoUrl: '',
        imageUrlMain: '',
        uploadedFile: '',
        displayFilename: 'none',
        movieLoading: false,
        loadingMain: false,
        percentage: 0
      },
      pricing: {
        decline_period: null,
        decline_price: null,
        final_decline_day: undefined,
        initial_decline_day: undefined,
        initial_price: null,
        substracted_price: null,
        is_active: true,
        is_serial: true,
        lang: this.lang || 'ru',
        user_watched_period: null,
        season_number: parseInt(this.$route.params.seasonId),
        episode_number: parseInt(this.$route.params.id)
      },
      backstages: [
        {
          videos: '',
          photo: '',
          quality: '',
          duration: null,
          imageUrlBackstage: '',
          uploadedFile: '',
          displayFilename: 'none',
          movieLoading: false,
          loadingBackstage: false,
          percentage: 0
        }
      ],
      movie: {
        active: false,
        episode_number: '',
        title: '',
        logo_image: '',
        description: '',
        plot: '',
        is_new: false,
        directors: [],
        meta_description: '',
        meta_title: '',
        meta_tags: '',
      },
      rules: {
        title: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        // episode_number: [
        //   { required: true, message: this.$t('required'), trigger: 'change' }
        // ]
      },
      rulesFeedback: {
        comment: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        rate: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        customer_name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      oldData: {
        active: false
      }
    }
  },
  mounted () {
    if (this.$route.query?.data) {
      const data = JSON.parse(this.$route.query?.data)
      this.oldData = data
    }
    if (this.$route?.path?.includes('create')) {
      if (this.$route.query?.episode_number) this.getSeasons();
      else this.movie.episode_number = 1
    }
    if (this.episodeId) this.getMoviesAttrs()
    this.getFeedbacks({ current: 1, pageSize: 10, slug: this.movieId, episode: this.episodeId })
    this.getAllMovies()
  },
  props: {
  // eslint-disable-next-line
    lang: String
  },
	components: {
		VideoPlayer
	},
  computed: {
    ...mapGetters(['feedbacks', 'paginationFeedbacks', ' '])
  },
  methods: {
    ...mapActions(['getMovies', 'getFeedbacks']),
    handleTableChange (pagination) {
      const paginationNew = {
        ...pagination,
        slug: this.movieId
      }
      this.getFeedbacks(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    getPagination () {
      return this.paginationFeedbacks
    },
    getSeasons () {
      request({
        url: '/movies/' + this.movieId + '/seasons/' + this.seasonId,
        params: { lang: 'ru' },
        method: 'get'
      }).then((response) => {
        const len = response?.season?.episodes?.length
        const episode = response?.season?.episodes?.find((item) => item.episode_number === (len - 1)) ?? response?.season?.episodes[0]

        this.movie.episode_number = this.oldData?.episode_number + 1 || len + 1
        this.movie.title = this.oldData?.title ?? episode?.title
        this.movie.plot = this.oldData?.plot ?? episode?.plot
        this.movie.description = this.oldData?.description ?? episode.description
        this.movie.is_new = this.oldData?.is_new ?? episode?.is_new
        this.movie.active = this.oldData?.active ?? false
        this.movieSlug = response.movie.slug
        this.movie.meta_description = this.oldData?.meta?.description ?? episode?.meta?.description
        this.movie.meta_title = this.oldData?.meta?.title ?? episode?.meta?.title
        this.movie.meta_tags = this.oldData?.meta?.tags ?? episode?.meta?.tags
        this.imageUrlLogo = episode?.logo_image ?? ''
        this.movie.logo_image = episode?.logo_image.split('/')[episode.logo_image.split('/').length - 1] ?? ''

        if (episode?.file_info) {
          // this.mainVideo.videos = episode.file_info.videos
          this.mainVideo.imageUrlMain = episode.file_info.image ?? ''
          this.mainVideo.photo = episode.file_info.image && episode.file_info.image.split('/')[episode.file_info.image.split('/').length - 1]
          this.mainVideo.duration = episode.file_info.duration
        }
      })
    },
    getAllMovies () {
      request({
        url: '/movies',
        method: 'get',
        params: { lang: this.lang }
      }).then((response) => {
        this.allMovies = response.movies
      })
    },
    getMoviesAttrs () {
      request({
        url: '/movies/' + this.movieId + '/seasons/' + this.seasonId + '/episodes/' + this.episodeId,
        method: 'get',
        params: { lang: this.lang }
      }).then((response) => {
        this.movie.active = response.episode.active
        this.movieSlug = response.movie.slug
        this.movie.title = response.episode.title
        this.movie.id = response.episode.id
        this.movie.description = response.episode.description
        this.movie.plot = response.episode.plot
        this.movie.episode_number = response.episode.episode_number
        this.movie.slogan = response.episode.slogan
        this.movie.logo_image = response.episode.logo_image.split('/')[response.episode.logo_image.split('/').length - 1]
        if (response.episode.trailer && response.episode.trailer.length) {
          this.trailers = []
          response.episode.trailer.map((trailer, index) => {
            this.trailerQuality[index] = 0
            this.trailers.push(
              {
                videos: trailer.videos,
                photo: trailer.image.split('/')[trailer.image.split('/').length - 1],
                duration: trailer.duration,
                imageUrlLogo: trailer.image,
                uploadedFile: '',
                displayFilename: 'none',
                movieLoading: false,
                loadingLogo: false,
                percentage: 0
              }
            )
          })
        }
        if (response.episode.backstage && response.episode.backstage.length) {
          this.backstages = []
          response.episode.backstage.map((backstage, index) => {
            this.backstageQuality[index] = 0
            this.backstages.push(
              {
                videos: backstage.videos,
                photo: backstage.image.split('/')[backstage.image.split('/').length - 1],
                duration: backstage.duration,
                imageUrlBackstage: backstage.image,
                uploadedFile: '',
                displayFilename: 'none',
                movieLoading: false,
                loadingBackstage: false,
                percentage: 0
              }
            )
          })
        }
        if (response.episode.file_info) {
          this.mainVideo.videos = response.episode.file_info.videos
          this.mainVideo.photo = response.episode.file_info.image.split('/')[response.episode.file_info.image.split('/').length - 1]
          this.mainVideo.imageUrlMain = response.episode.file_info.image
          this.mainVideo.duration = response.episode.file_info.duration
        }
        this.imageUrlLogo = response.episode.logo_image
        this.movie.related_movies = response.episode.related_movies
        this.movie.is_new = response.episode.is_new
        this.movie.meta_description = response.episode.meta.description
        this.movie.meta_title = response.episode.meta.title
        this.movie.meta_tags = response.episode.meta.tags
        this.fileList = response.episode.scene_image.map((image, index) => {
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
        if (response.episode.pricing) {
          this.pricing.decline_period = parseInt(response.episode.pricing.decline_period)
          this.pricing.decline_price = parseInt(response.episode.pricing.decline_price) / 100
          this.pricing.final_decline_day = moment(response.episode.pricing.final_decline_day).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss')
          this.pricing.initial_decline_day = moment(response.episode.pricing.initial_decline_day).subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss')
          this.pricing.initial_price = parseInt(response.episode.pricing.initial_price) / 100
          this.pricing.user_watched_period = parseInt(response.episode.pricing.user_watched_period)
          this.pricing.substracted_price = parseInt(response.episode.pricing.substracted_price) / 100
          this.pricing.is_active = this.movie.active
        }
      })
    },
    onAddRelatedMovie () {
      this.addRelatedMovieModal = true
      console.log(this.addRelatedMovieModal)
    },
    handleOk () {
      this.allMovies.map(movie => {
        if (this.newRelatedMovies.indexOf(movie.id) >= 0) {
          this.movie.related_movies.push(movie)
        }
      })
      this.addRelatedMovieModal = false
    },
    getSource (value) {
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
    onAddTrailer () {
      this.trailers.push(
        {
          video: '',
          photo: '',
          quality: '',
          imageUrlLogo: '',
          uploadedFile: '',
          displayFilename: 'none',
          movieLoading: false,
          loadingLogo: false,
          percentage: 0
        }
      )
      this.trailerQuality.push(0)
    },
    onAddBackstage () {
      this.backstages.push(
        {
          video: '',
          photo: '',
          quality: '',
          imageUrlBackstage: '',
          uploadedFile: '',
          displayFilename: 'none',
          movieLoading: false,
          loadingBackstage: false,
          percentage: 0
        }
      )
      this.backstageQuality.push(0)
    },
    fetchMovies (value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.allMovies = []
      this.fetchingMovies = true

      request({
        url: '/movies',
        params: { lang: this.lang ? this.lang : 'ru', search: value }
        })
        .then(body => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const data = body.movies.map(movie => ({
            ...movie
          }))
          this.allMovies = data
          this.fetchingMovies = false
        })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64Preview(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList
      console.log(this.fileList)
    },
    activeTabHandler (_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    onButtonClick (index) {
      document.getElementById('movie' + index).click()
    },
    onButtonBackstageClick (index) {
      document.getElementById('backstage' + index).click()
    },
    onButtonMainClick () {
      document.getElementById('mainVideo').click()
    },
    onMovieChange (e, index) {
      this.trailers[index].movieLoading = true
      var file = e.target.files[0]

      this.trailerUpdate[index] = new tus.Upload(file, {
        endpoint: `${process.env.VUE_APP_API_BASE_URL}upload-movies/`,
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
            this.trailers[index].percentage = bytesUploaded / bytesTotal * 100

        },
        onSuccess: () => {
        this.trailers[index].movieLoading = false
        this.trailers[index].displayFilename = 'block'
        this.trailers[index].uploadedFile = this.trailerUpdate[index].file.name
        this.trailers[index].videos = [{ file_name: this.trailerUpdate[index].url, quality: 'original', status: 'PENDING' }]
        }
      })
    this.trailerUpdate[index].start()
    },
    onMovieBackstageChange (e, index) {
      this.backstages[index].movieLoading = true
      var file = e.target.files[0]

      this.backstageUpdate[index] = new tus.Upload(file, {
        endpoint: `${process.env.VUE_APP_API_BASE_URL}upload-movies/`,
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
            this.backstages[index].percentage = bytesUploaded / bytesTotal * 100

        },
        onSuccess: () => {
        this.backstages[index].movieLoading = false
        this.backstages[index].displayFilename = 'block'
        this.backstages[index].uploadedFile = this.backstageUpdate[index].file.name
        this.backstages[index].videos = [{ file_name: this.backstageUpdate[index].url, quality: 'original', status: 'PENDING' }]
        }
      })
      this.backstageUpdate[index].start()
    },
    onMovieMainChange (e) {
      this.mainVideo.movieLoading = true
      var file = e.target.files[0]
      this.mainUpdate = new tus.Upload(file, {
        endpoint: `${process.env.VUE_APP_API_BASE_URL}upload-movies/`,
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
            this.mainVideo.percentage = bytesUploaded / bytesTotal * 100
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
    onDeleteMainVideoClick () {
      this.mainVideo.videos = []
      this.mainVideo.uploadedFile = ''
      this.mainVideo.displayFilename = 'none'
      this.mainVideo.duration = null
    },
    onDeleteTrailerVideoClick (index) {
      this.trailers[index].videos = []
      this.trailers[index].uploadedFile = ''
      this.trailers[index].displayFilename = 'none'
      this.trailers[index].duration = null
    },
    onDeleteBackstageVideoClick (index) {
      this.backstages[index].videos = []
      this.backstages[index].uploadedFile = ''
      this.backstages[index].displayFilename = 'none'
      this.backstages[index].duration = null
    },
    onDeleteTrailerClick (index) {
      this.trailers.splice(index, 1)
      this.trailerQuality.splice(index, 1)
    },
    onDeleteBackstageClick (index) {
      this.backstages.splice(index, 1)
      this.backstageQuality.splice(index, 1)
    },
    handleChangeLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrlLogo = imageUrl;
          this.loadingLogo = false;
          this.movie.logo_image = info.file.response.filename
        });
      }
    },
    handleChangeLogo(info, index) {
      if (info.file.status === 'uploading') {
        this.trailers[index].loadingLogo = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.trailers[index].imageUrlLogo = imageUrl;
          this.trailers[index].loadingLogo = false;
          this.trailers[index].photo = info.file.response.filename
        });
      }
    },
    handleChangeBackstage (info, index) {
      if (info.file.status === 'uploading') {
        this.backstages[index].loadingBackstage = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.backstages[index].imageUrlBackstage = imageUrl;
          this.backstages[index].loadingBackstage = false;
          this.backstages[index].photo = info.file.response.filename
        });
      }
    },
    handleChangeMain (info) {
      if (info.file.status === 'uploading') {
        this.mainVideo.loadingMain = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.mainVideo.imageUrlMain = imageUrl;
          this.mainVideo.loadingMain = false;
          this.mainVideo.photo = info.file.response.filename
        });
      }
    },
    beforeUploadLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 5MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    showUpdateModal (id) {
      this.previewFeedbackVisible = true
      this.getSelectedFeedback(id)
    },
    getSelectedFeedback (id) {
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
        method: 'get',
      }).then((response) => {
        this.feedback.id = id
        this.feedback.customer_id = response.feedback.customer_id
        this.feedback.customer_name = response.feedback.customer_name
        this.feedback.rate = parseInt(response.feedback.rate)
        this.feedback.episode_key = response.feedback.episode_key
        this.feedback.movie_key = response.feedback.movie_key
        this.feedback.comment = response.feedback.comment
        this.feedback.active = response.feedback.active
      })
    },
    deleteFeedback (e, id) {
      request({
              url: '/feedback/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getFeedbacks({ ...this.getPagination, slug: this.movieId })
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    onSubmitFeedback () {
      const data = {
        comment: this.feedback.comment,
        customer_id: this.feedback.customer_id,
        customer_name: this.feedback.customer_name,
        episode_key: this.feedback.episode_key.toString(),
        movie_key: this.feedback.movie_key,
        active: this.feedback.active,
        rate: parseInt(this.feedback.rate)
      }
      request({
        url: '/feedback/' + this.feedback.id,
        method: 'put',
        data: data
      }).then(response => {
        this.$message.success(this.$t('successfullyUpdated'))
        this.getFeedbacks({ ...this.paginationFeedbacks, slug: this.movieId }).then(() => (this.previewFeedbackVisible = false))
      })
    },
    onSubmit (status) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
             if (status === 'dublicate') {
                const stringifiedData = JSON.stringify(this.movie)
                window.open('/movie/' + this.movieId + '/seasons/' + this.seasonId + `/episodes/create?episode_number=${Number(this.movie.episode_number) + 1}&active=${this.movie.active}&data=${stringifiedData}`, '_blank')
                return
            } 
            const movie = {
              active: this.movie.active,
              backstage: this.backstages[0].photo || this.backstages[0].duration || this.backstages[0].videos ? this.backstages.map(backstage => {
                  return {
                    duration: parseInt(backstage.duration),
                    image: backstage.photo,
                    videos: backstage.videos.map(video => {
                      return {
                        file_name: video.file_name.split('/')[video.file_name.split('/').length - 1] === 'm3u8' ? video.file_name.split('/')[video.file_name.split('/').length - 2].split('.')[0].split('+')[0] : video.file_name.split('/')[video.file_name.split('/').length - 1].split('.')[0].split('+')[0],
                        quality: video.quality,
                        status: video.status
                      }
                    })
                  }
                }) : null,
              file_info: this.mainVideo.photo || this.mainVideo.duration || this.mainVideo.videos ? {
                duration: parseInt(this.mainVideo.duration),
                image: this.mainVideo.photo,
                videos: this.mainVideo.videos ? this.mainVideo.videos.map(video => {
                  return {
                    file_name: this.getFileName(video),
                    quality: video.quality,
                    status: video.status
                  }
                }) : null
              } : null,
              is_new: this.movie.is_new,
              description: this.movie.description,
              plot: this.movie.plot,
              logo_image: this.movie.logo_image,
              lang: this.lang ? this.lang : 'ru',
              scene_image: this.fileList.map(image => {
                return image.response.filename
              }).join(','),
              title: this.movie.title,
              meta: {
                description: this.movie.meta_description,
                tags: this.movie.meta_tags,
                title: this.movie.meta_title
              },
              episode_number: parseInt(this.movie.episode_number),
              trailer: this.trailers[0].photo || this.trailers[0].duration || this.trailers[0].videos ? this.trailers.map(trailer => {
                  return {
                    duration: parseInt(trailer.duration),
                    image: trailer.photo,
                    videos: trailer.videos.map(video => {
                      return {
                        file_name: video.file_name.split('/')[video.file_name.split('/').length - 1] === 'm3u8' ? video.file_name.split('/')[video.file_name.split('/').length - 2].split('.')[0].split('+')[0] : video.file_name.split('/')[video.file_name.split('/').length - 1].split('.')[0].split('+')[0],
                        quality: video.quality,
                        status: video.status
                      }
                    })
                  }
                }) : null,
            }

            var url = '/movies/' + this.movieId + '/seasons/' + this.seasonId + '/episodes'
            var method = 'post'
            if (this.episodeId) {
              url = '/movies/' + this.movieId + '/seasons/' + this.seasonId + '/episodes/' + this.episodeId
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
            }).then(res => {

            this.$router.replace('/movie/' + this.movieId + '/seasons/update/' + this.seasonId)

              if (this.movieId) {
                request({
                    url: `/movie-pricing/${this.movieSlug}`,
                    method: 'put',
                    data: this.pricing,
                    headers: headers
                })
                .catch(res => {
                  alert(res.data.message)
                })
              }
              resolve(res)
            }).catch(err => {
              if (err) {
                if (err.response.data.message === 'rpc error: code = Internal desc = Movie validation failed: seasons: episode number should be unique') {
                  this.$message.error(this.$t('Вы не можете сохранять эпизоды с одинаковым номером'))
                } else {
                  this.$message.error(this.$t('error'))
                }
                console.log('epizode error', err.response.data.message)
                
                reject(err)
              }
              // if (!this.episodeId) this.getSeasons()
            })
          } else {
            reject(valid)
          }
        })
      })
    },
    resetForm () {
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
      this.trailerUpdate.forEach((update) => {
        update.abort()
      })
    }
    if (this.backstageUpdate && this.backstageUpdate.length) {
      this.backstageUpdate.forEach((update) => {
        update.abort()
      })
    }
    if (this.mainUpdate) this.mainUpdate.abort()
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
    height: 240px;
  }
  .ant-card-body {
    padding: 10px !important
  }
</style>
