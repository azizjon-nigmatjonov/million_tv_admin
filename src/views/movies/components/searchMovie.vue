<template>
  <div style="margin-bottom: 20px">
    <a-form-model-item label="Поиск рейтинга IMDB по фильму или сериалу" prop="IMDB">
     <a-input-group compact>
      <a-select v-model="searchType">
        <a-select-option value="movies">По фильму</a-select-option>
        <a-select-option value="series">По сериалу</a-select-option>
      </a-select>
      <a-input
        placeholder="Поиск"
        style="width: 86%"
        v-model="inputValue.real"
      >
      </a-input>
     <!-- <a-select
        v-model="searchValue"
        show-search
        placeholder="Search movie type"
        style="width: 265px"
        :options="filmList"
        :filter-option="false"
        @search="handleSearch"
        @change="handleChange"
  ></a-select> -->
    </a-input-group>
    <p style="color: red; margin-top: 5px" v-if="errorImdb">Требуется заполнить рейтинг IMDB</p>
    </a-form-model-item>
    <a-row type="flex" :gutter="[8,8]">
      <a-col v-for="item in filmList" span="auto" :key="item.id">
          <div @click="getIMDBRating(item.id)" class="imageSearched_HEAD">
            <img class="imageSearched" width="100" height="150" :src="item.image" :alt="item.image">
            <div>{{ item.title.substring(0, 12) }}</div>
          </div>
      </a-col>
    </a-row>
    <a-row v-if="imdb.title || movie.rating_imdb.rating_imdb" type="flex">
        <a-col span="24">
        <label for="ids">{{ imdb.title ? imdb.title : '' }}</label>
        <a-input id="ids" disabled v-model="movie.rating_imdb.rating_imdb"></a-input>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { debounce } from './debaunce'
export default {
props: ['movie', 'errorImdb'],
data () {
    return {
        searchType: 'movies',
        filmList: [],
        inputValue: { real: '', bounce: '' },
        imdb: {},
        // validateR: 'error',
        // helpR: 'Заполните поле'

    }
},
watch: {
    'inputValue.real': debounce(function (newVal) {
      console.log('newval', newVal)
      this.inputValue.bounce = newVal;
    }, 700),

    'inputValue.bounce' (filmText) {
      console.log(filmText)
      this.searchFilm(filmText)
    }

},


methods: {
   getIMDBRating (id) {
    this.$store.dispatch('getImbdRating', id).then(res => {
      this.filmList = []
      this.imdb = res
      this.movie.rating_imdb.rating_imdb = parseFloat(res.imDb)
      this.movie.rating_imdb.movie_imdb_id = res.imDbId

    })
   },

    searchFilm (e) {
        this.errorImdb = false
        this.$store.dispatch(
          this.searchType === 'movies' 
          ? 'getImbdSearchMovies' 
          : 'getImbdSearchSeries', 
          { expression: e, lang: this.$route.query.lang }).then(res => {
            this.filmList = res.results
            console.log(res)
        })
    }
},
}
</script>

<style scoped>
.imageSearched_HEAD {
  padding: 4px;
  background: rgb(233, 233, 233);
  border-radius: 4px;
}
.imageSearched {
  transition: transform .3s; 
}
.imageSearched:hover {
  opacity: 0.8;
  transform: scale(1.1);
  cursor: pointer
}
</style>
