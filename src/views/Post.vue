<template>
  <div v-if="post" class="post-page">
    <div class="container" style="padding-right: 10px; padding-left:10px;">
      <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-6 col-xs-12 pr-0">
          <span class="post-title">
            {{ post.title }}
            <i v-if="post.hot" class="icon hot-black ml-2" title="Популярные объявления"></i>
          </span>
        </div>
        <div
          v-if="post.price || post.date"
          class="col-lg-5 col-md-5 col-sm-12 text-lg-right text-md-right text-sm-left text-left pl-md-0 pl-lg-0 pt-lg-0 pt-md-0"
          style="padding-top: 10px;"
        >
          <span v-if="post.price" class="post-price">
            {{ Number(post.price).toLocaleString() + ' тг' }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-7 col-md-7 col-sm-6 col-xs-12 pr-0 mr-auto" style="padding-top: 10px;">
          <a class="post-link" href @click.prevent>
            Ссылка
            <i class="icon chevron-right-auction"></i>
          </a>
        </div>
        <div
          v-if="(post.date && post.price) || (post.date && post.auctionLink)"
          class="col-lg-5 col-md-5 col-sm-6 col-xs-12 text-lg-right text-md-right text-sm-right text-left pl-md-0 pl-lg-0 ml-auto"
          style="padding-top: 10px;"
        >
          <span class="post-date">Дата торгов: {{ post.date }}</span>
        </div>
      </div>
      <div class="row">
        <div
          class="col-md-12 col-lg-12 col-sm-12 col-12"
          style="margin-top: 20px; margin-bottom: 20px;"
        >
          <VueSlickCarousel v-if="post.images" :dots="true">
            <div v-for="(slide, idx) of post.images" :key="idx">
              <img
                v-if="post.images[idx]"
                class="carousel-image"
                :src="post.images[idx]"
                :alt="post.title"
              />
              <img
                v-else
                src="@/assets/static/images/lorem.png"
                :alt="post.title"
                class="slider-image"
              />
            </div>
          </VueSlickCarousel>
          <img
            v-else
            src="@/assets/static/images/lorem.png"
            :alt="post.title"
            class="slider-image w-100"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2">
          <i class="icon location"></i>
        </div>
        <div
          class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2"
          style="display: flex; align-items: center;"
        >
          <span>{{ post.location }}</span>
        </div>
      </div>
      <div v-if="post.space" class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2">
          <i class="icon space"></i>
        </div>
        <div
          class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2"
          style="display: flex; align-items: center;"
        >
          <span class="post-space">{{ post.space }} га</span>
        </div>
      </div>
      <div v-if="post.description" class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2"></div>
        <div class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2">
          <div class="post-description">
            <span>{{ post.description }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-2 pb-2">
          <i class="icon category"></i>
        </div>
        <div
          class="col-lg-11 col-md-11 col-sm-11 col-10 pl-0 pb-2"
          style="display: flex; align-items: center;"
        >
          <span v-if="post.categories.length" class="post-category">
            {{ post.categories.join(', ') }}
          </span>
          <span v-else class="post-category">Целевое назначение - отсутсвует.</span>
        </div>
      </div>
      <div v-if="post.postOwner">
        <hr />
        <div class="row mt-3">
          <div class="col-12">
            <h5>Автор объявления:</h5>
            <div class="authorData">
              <span v-if="post.postOwner.author">
                Имя:
                <span class="authorDataContent">{{ post.postOwner.author }}</span>
              </span>
              <span v-if="post.postOwner.email">
                Email:
                <span class="authorDataContent">{{ post.postOwner.email }}</span>
              </span>
              <span v-if="post.postOwner.phone_number">
                Телефон:
                <span class="authorDataContent">{{ post.postOwner.phone_number }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 20px;">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <Map></Map>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="notFound">
    <h1>Пост не найден</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

import VueSlickCarousel from 'vue-slick-carousel';
import Map from '@/components/app/Map.vue';

export default {
  name: 'Post',
  components: {
    VueSlickCarousel,
    Map,
  },
  data: () => ({}),
  computed: {
    post() {
      return this.$store.getters.postById(+this.$route.params.id);
    },
    ...mapGetters(['sidebarActive', 'userData']),
  },
  beforeDestroy() {
    this.$store.commit('clearCurrentMapData');
  },
  methods: {},
};
</script>

<style lang="scss">
.carousel-image {
  transition: 0.3s !important;
  width: 100%;
  height: auto;
  border-radius: 5px;
}
.authorData {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  color: #555555;
}
.authorDataContent {
  color: #56739d !important;
}
</style>
