<template>
  <div id="app">
    <Navbar />
    <component :is="layout" />
    <Footer />
  </div>
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout';
import CatalogLayout from '@/layouts/CatalogLayout';
import Navbar from '@/components/app/Navbar';
import Footer from '@/components/app/Footer';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    Navbar,
    Footer,
    CatalogLayout,
    DefaultLayout,
  },
  data: () => ({}),
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout';
    },
    ...mapGetters({
      message: 'message',
    }),
  },
  watch: {
    message(res) {
      this.$toast.open({
        message: res.message || 'Неизвестное сообщение',
        type: res.type || 'default',
      });
    },
  },
  async created() {
    await this.$store.dispatch('initializeApp');
  },
  methods: {},
};
</script>

<style lang="scss">
@import '~bootstrap/dist/css/bootstrap.min.css';
@import './assets/static/css/icons.css';

body::-webkit-scrollbar {
  display: none;
}

body {
  background-color: #e5e5e5;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
}

#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.bg-white {
  background-color: #ffffff !important;
}

.bg-gold {
  background-color: #f4dc00 !important;
}

a,
a:hover {
  color: inherit !important;
  text-decoration: none !important;
  outline: none !important;
}

p {
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
}

i {
  display: inline-block;
}
.rounded-right {
  border-radius: 0 5px 5px 0 !important;
}

.rounded-top {
  border-radius: 5px 5px 0 0 !important;
}

.border-top {
  border-top: 1px solid #cccccc !important;
}

.border-bottom {
  border-bottom: 1px solid #cccccc !important;
}

.d-none {
  display: none !important;
}

.link {
  color: #56739d !important;
  text-decoration: underline !important;
}
.link:hover {
  color: #0e4dac !important;
  transition: 0s !important;
}

.ps--active-x > .ps__rail-x,
.ps--active-y > .ps__rail-y {
  background: transparent !important;
}

.ps {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
@media (max-width: 575.98px) {
  .company-hot-objects img {
    width: 100%;
    height: 180px;
  }
  .navbar-expand-lg > .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  #map {
    height: 280px;
  }
}

@media (max-width: 767.98px) {
  #leftside-content {
    display: none;
  }
  .navbar-expand-lg > .container {
    padding-left: 15px;
    padding-right: 15px;
  }
  #usefull-links,
  #hot-objects,
  #sidebar {
    display: none !important;
  }
  .content-header {
    border-top-left-radius: 5px !important;
    border-left: 0 !important;
  }
  .sidebar-content .dropdown-toggle::after {
    padding-top: auto !important;
    padding-bottom: auto !important;
    color: #ffffff;
    right: 50%;
    -webkit-transform: translateX(50%);
    -ms-transform: translateX(50%);
    -o-transform: translateX(50%);
    transform: translateX(50%);
  }
  .sidebar-content ul ul a {
    border: 0 !important;
    padding-left: 20px !important;
  }
  #content #sales .post-image {
    height: 270px !important;
  }
  #content.active #gallery img {
    height: 250px !important;
  }
  .sidebar-content {
    display: block;
  }
  .sidebar-content ul ul a {
    background-color: inherit;
  }
}

@media (max-width: 991.98px) {
  #content.active #gallery img {
    height: 400px;
  }
  #search-input {
    width: 15.5rem !important;
  }
  i.icon.search {
    right: 232px !important;
  }
}

[v-cloak] {
  display: block !important;
  padding: 50px 0;

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #333;
    animation: spinner 0.6s linear infinite;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  & > div {
    display: none;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}

.slick-prev:before,
.slick-next:before {
  color: #222222 !important;
  font-size: 25px !important;
}

.slick-next,
.slick-prev {
  z-index: 10 !important;
}

.slick-prev {
  left: -11px !important;
}

.slick-next {
  right: -7px !important;
}

.slick-dots {
  position: relative !important;
  bottom: 0 !important;
}
</style>
