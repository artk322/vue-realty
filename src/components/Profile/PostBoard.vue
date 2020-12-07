<template>
  <Loader v-if="loading" />
  <div v-else-if="items.length" class="table-responsive">
    <table class="table table-responsive w-100 d-block d-md-table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название</th>
          <th scope="col">Адрес</th>
          <th scope="col">Площадь</th>
          <th scope="col">Дата</th>
          <th scope="col">Ссылка</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, idx) in items" :key="idx">
          <th scope="row">{{ post.pid }}</th>
          <td class="text">
            <span>{{ post.title }}</span>
          </td>
          <td class="text">
            <span>{{ post.location }}</span>
          </td>
          <td class="text">
            <span>{{ post.space }}</span>
          </td>
          <td class="text">
            <span>{{ post.creation_date | date }}</span>
          </td>
          <td class="text">
            <router-link tag="button" class="btn btn-warning" :to="'post/' + post.pid">
              Открыть
            </router-link>
          </td>
        </tr>
        <tr>
          <td colspan="6">Total: {{ userPosts.length }}</td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <paginate
        v-if="userPosts.length > pageSize"
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination justify-content-center'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :next-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
      />
    </nav>
  </div>
  <h5 v-else>
    У вас пока нету постов.
    <router-link class="link" to="/create-post">Добавить?</router-link>
  </h5>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin';
import Paginate from 'vuejs-paginate';

export default {
  name: 'Postboard',
  components: {
    Paginate,
  },
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    pageSize: 10,
  }),
  computed: {
    userData() {
      return this.$store.getters.userData;
    },
    userPosts() {
      if (this.userData.is_admin == true) {
        return this.$store.getters.posts || [];
      } else {
        return this.$store.getters.userPosts(this.userData.uid) || [];
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchPosts');
    if (this.userPosts.length) {
      this.setupPagination(this.userPosts, this.pageSize);
    }
    this.loading = false;
  },
  methods: {},
};
</script>

<style scoped>
.text {
  position: relative;
}
.text > span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  width: 100%;
}
.text:before {
  content: '';
  display: inline-block;
}
</style>
