<template>
  <nav class="breadcrumb-nav" aria-label="breadcrumb">
    <ol class="breadcrumb border-bottom">
      <router-link to="/catalog" tag="li" back class="breadcrumb-item" exact-active-class="active">
        <a href>
          <i
            v-if="this.$route.name === 'post'"
            class="icon chevron-right-white"
            style="transform: rotate(180deg); margin-left: 0;"
          />
          Земельные участки
        </a>
      </router-link>
      <li v-if="this.$route.name === 'catalog'" class="right-button">
        <a
          title="Сортировать"
          data-toggle="collapse"
          data-target="#sort"
          aria-expanded="true"
          aria-controls="sort"
        >
          <i class="icon control"></i>
        </a>
      </li>
      <li v-else-if="this.$route.name === 'post' && canEdit" class="right-button">
        <router-link :to="'/edit-post/' + this.$route.params.id" title="Редактировать">
          <i class="icon edit"></i>
        </router-link>
      </li>
    </ol>
    <ol
      v-if="this.$route.name === 'catalog'"
      id="sort"
      class="breadcrumb collapse"
      style="border-radius: 0px !important;"
    >
      <li class="title-sort">
        <a href="#">Название</a>
        <div id="title-sort">
          <a href="#">
            <i class="current icon arrow-up mx-1"></i>
          </a>
          <a href="#">
            <i class="icon arrow-down"></i>
          </a>
        </div>
      </li>
      <li class="price-sort mx-5">
        <a href="#">Цена</a>
      </li>
      <li class="date-sort">
        <a href="#">Дата торгов</a>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
    },
  },
  computed: {
    canEdit() {
      if (!this.loading) {
        const currentUser = this.$store.getters.userData || null;
        const post = this.$store.getters.postById(+this.$route.params.id) || null;
        if (currentUser && ((post && currentUser.uid === post.owner_uid) || currentUser.is_admin)) {
          return true;
        } else return false;
      } else return false;
    },
  },
  mounted() {},
};
</script>

<style>
.breadcrumb {
  display: flex;
  flex-direction: row;
  background-color: #222222 !important;
  margin-bottom: 0 !important;
  border-radius: 5px 5px 0 0 !important;
  color: #ffffff !important;
  min-height: 50px;
  padding: 10px 20px !important;
  align-items: center;
}

.breadcrumb i.chevron-right-white {
  margin-left: 10px;
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
}

.breadcrumb a {
  white-space: nowrap;
}

.breadcrumb a:hover {
  color: #f4dc00 !important;
}

.breadcrumb li.active,
.breadcrumb li.active a:hover {
  color: #ffffff !important;
  pointer-events: none;
}

.breadcrumb-item + .breadcrumb-item::before {
  display: inline-block;
  padding-right: 0;
  color: #ffffff;
  content: '';
}

.breadcrumb-item + .breadcrumb-item {
  padding-left: 0;
}

.right-button {
  margin-left: auto;
}

.right-button > a {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
