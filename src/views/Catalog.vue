<template>
  <div>
    <div v-if="displayPosts.length" class="row mx-0">
      <div
        v-for="post of displayPosts"
        :key="post.id"
        class="col-lg-6 col-sm-12 col-md-12 col-12 post-info"
      >
        <router-link :to="'/post/' + post.pid">
          <div class="img-block">
            <img v-if="post.images" :src="post.images[0]" :alt="post.title" class="post-image" />
            <img
              v-else
              src="../assets/static/images/no-image.jpg"
              :alt="post.title"
              class="post-image"
            />
          </div>
          <div class="row mb-3">
            <div class="col-lg-7 col-md-7 col-sm-12 pr-0">
              <span class="post-title">{{ post.title }}</span>
            </div>
            <div
              v-if="post.price"
              class="col-lg-5 col-md-5 col-sm-12 text-lg-right text-md-right text-sm-left text-left pl-md-0 pl-lg-0"
            >
              <span class="post-price">{{ Number(post.price).toLocaleString() + ' тг' }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
              <i class="icon location"></i>
            </div>
            <div
              class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2"
              style="display: flex; align-items: center;"
            >
              <span v-if="post.location" class="post-location">
                {{ post.location }}
              </span>
              <span v-else class="post-location">Адрес не указан.</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
              <i class="icon space"></i>
            </div>
            <div
              class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2"
              style="display: flex; align-items: center;"
            >
              <span v-if="post.space" class="post-space">{{ post.space }} га</span>
              <span v-else class="post-space">Площадь не указана.</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-1 col-1 pb-2">
              <i class="icon category"></i>
            </div>
            <div
              class="col-lg-10 col-md-10 col-sm-10 col-10 pb-2"
              style="display: flex; align-items: center;"
            >
              <span v-if="post.categories.length" class="post-category">
                {{ toAbbr(post.categories.join(', ')) }}
              </span>
              <span v-else class="post-category">Целевое назначение - отсутсвует.</span>
            </div>
          </div>
          <div v-if="post.creation_date" class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
              <span class="post-date">{{ post.creation_date | date }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else class="notFound">
      <h3>
        Участков нету.
        <br />
        <router-link to="/create-post" class="link">
          Добавить участок
        </router-link>
      </h3>
    </div>
    <div class="pagination-container">
      <paginate
        v-if="posts.length > pageSize && !searchString"
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'<'"
        :next-text="'>'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-controller prev'"
        :next-class="'page-controller next'"
        :prev-link-class="'page-controller-link'"
        :next-link-class="'page-controller-link'"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import paginationMixin from '@/mixins/pagination.mixin';
import Paginate from 'vuejs-paginate';

export default {
  name: 'Catalog',
  components: {
    Paginate,
  },
  mixins: [paginationMixin],
  data: () => ({
    pageSize: 8,
  }),
  computed: {
    ...mapGetters({
      posts: 'posts',
      searchString: 'searchString',
    }),
    searchPosts() {
      if (this.searchString) {
        return this.posts.filter(post => {
          return Object.values(post)
            .join(' ')
            .toLowerCase()
            .includes(this.searchString.toLowerCase());
        });
      } else return this.posts;
    },
    displayPosts() {
      if (this.searchString) {
        return this.searchPosts;
      } else {
        return this.items;
      }
    },
  },
  mounted() {
    this.setupPagination(this.posts, this.pageSize);
  },
  methods: {
    toAbbr(string) {
      string = string.replace('Товарное сельское хозяйство', 'ТСХ');
      string = string.replace('Многоэтажное жилищное строительство', 'МЖС');
      string = string.replace('Индивидуальное жилищное строительство', 'ИЖС');
      return string;
    },
  },
};
</script>

<style lang="scss">
.pagination {
  align-items: center;
  border-radius: 50px;
  border: 1px solid #cccccc;
  justify-content: center;
  margin-top: 60px;
}

.pagination-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.page-link,
.page-controller-link {
  color: #000000;
  border-radius: 100% !important;
  border: 0;
  font-size: 16px;
  line-height: 16px;
  padding: 6px 10px;
}

.page-link:focus {
  box-shadow: none;
}

.page-item {
  border-radius: 100%;
  margin: 3px 3.5px;
}

.page-item.active {
  background-color: #cccccc !important;
  .page-link {
    background-color: #cccccc !important;
  }
}

// .page-controller {
//   .page-controller-link {
//     font-size: 16px;
//     line-height: 16px;
//   }
// }
</style>
