<template>
  <div class="container">
    <div class="wrapper">
      <Sidebar :loading="loading" />
      <div v-cloak id="content" :class="{ active: sidebarActive }">
        <Breadcrumb :loading="loading" />
        <div id="sales">
          <Loader v-if="loading" />
          <router-view v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Catalog/Sidebar';
import Breadcrumb from '@/components/Catalog/Breadcrumb';
import { mapGetters } from 'vuex';

export default {
  components: {
    Sidebar,
    Breadcrumb,
  },
  data: () => ({
    loading: true,
  }),
  computed: {
    ...mapGetters(['sidebarActive']),
  },
  async mounted() {
    await this.$store.dispatch('fetchPosts');
    this.loading = false;
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  align-items: stretch;
  width: auto;
  margin-bottom: 40px;
}

#content {
  width: 100%;
  position: relative;
  border: 1px solid #cccccc;
  border-top: 0 !important;
  border-radius: 5px !important;
  min-height: 400px;
  overflow: hidden;
  background-color: #ffffff !important;
}

#sales,
#results-container {
  padding: 20px 10px;
  width: 100%;
  position: relative;
}

#sales .post-info,
#results-container .post-info {
  padding-bottom: 20px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.btn-control {
  background-color: transparent;
  border: 1px solid transparent;
  user-select: none;
  padding: 0;
  vertical-align: middle;
  height: 18px;
}

.map-center {
  background-color: #ffffff;
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 0.25rem;
  text-align: center;
  border: 0;
  outline: none;
}

.map-center:hover {
  background-color: #f2f2f2;
  transition: 0s !important;
}

.post-page {
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #000;
}

.post-header {
  display: inline-flex;
  padding-bottom: 12.5px;
  width: 100%;
}

.post-link {
  color: #56739d !important;
  font-size: 16px;
  line-height: 18px;
}

.post-link:hover {
  color: #0e4dac !important;
}

.post-title,
.post-price {
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #222222 !important;
}

.post-page .post-title,
.post-page .post-price {
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
  color: #222222 !important;
}

.post-image {
  transition: all 0.3s;
  width: 100%;
  height: 200px;
}

.post-info {
  display: block;
  overflow: hidden;
}

.post-info:hover .post-image {
  transform: scale(1.1);
  transition: transform 0.4s;
}

.img-block {
  display: block;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 5px;
}

.post-date {
  line-height: 15px;
  font-size: 14px;
  color: #8a8a8a;
  padding-bottom: 20px;
}

.post-description p {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #222222;
  margin-bottom: 0;
}

#gallery {
  display: flex;
  img {
    border-radius: 5px;
    width: 100%;
    height: 400px;
  }
}

#content.active {
  #gallery img {
    height: 600px !important;
  }
  #sales .post-image {
    height: 270px !important;
  }
}

.gallery-image {
  cursor: pointer;
}

.chevron-next {
  right: -12px;
}

.chevron-prev {
  left: -12px;
}

.chevron-next,
.chevron-prev {
  border-radius: 50px;
  width: 26px;
  height: 26px;
  background-color: #222222;
  top: 50%;
  position: absolute;
  bottom: 0;
  z-index: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #fff;
  text-align: center;
}

#title-sort,
#price-sort,
#date-sort {
  display: inline-flex !important;
}
.notFound {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  color: #555555;
  text-align: center;
}

.post-location {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
