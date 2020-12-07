<template>
  <div class="container">
    <div class="row mx-0 mb-5 justify-content-center">
      <form
        class="post_form col-lg-8 col-md-12 col-sm-12 col-12 pt-4"
        @submit.prevent="submitHandler"
      >
        <div class="post_form-title">
          <span>Новый участок</span>
        </div>
        <div class="form-group">
          <label for="postTitle" class="required">Название</label>
          <div class="formWithSupText">
            <input
              id="postTitle"
              v-model.trim="title"
              type="text"
              class="post_form-control"
              autocomplete="off"
            />
            <span v-if="$v.title.$dirty && !$v.title.required" class="invalid">
              Заполните это поле
            </span>
          </div>
        </div>
        <div class="form-group">
          <label for="postLocation" class="required">Расположение</label>
          <div class="formWithSupText">
            <input
              id="postLocation"
              v-model.trim="location"
              type="text"
              class="post_form-control"
              placeholder="Адрес"
              autocomplete="off"
            />
            <span v-if="$v.location.$dirty && !$v.location.required" class="invalid">
              Заполните это поле
            </span>
          </div>
        </div>
        <div class="form-group">
          <label for="image-upload" class="required">Изображения</label>
          <div class="formWithSupText">
            <input
              id="image-upload"
              v-model.trim="inputImage"
              type="text"
              class="post_form-control"
              placeholder="Вставьте ссылку и нажмите Enter"
              autocomplete="off"
              @keydown.enter.prevent="addToImages(inputImage)"
            />
            <button class="btn btn-addImage" @click.prevent="addToImages(inputImage)">
              Добавить
            </button>
            <span v-if="$v.inputImage.$dirty && !$v.inputImage.url" class="invalid"
              >Вставьте ссылку</span
            >
            <span v-else-if="$v.images.$dirty && !$v.images.required" class="invalid">
              Минимальное кол-во изображений 1
            </span>
            <span v-else-if="$v.images.$dirty && !$v.images.maxLength" class="invalid">
              Максимальное кол-во изображений 10
            </span>
          </div>
          <div v-if="images.length" class="imagesPreviewWrapper">
            <div v-for="(image, idx) of images" :key="idx" class="imagePreviewContainer">
              <img :src="image" class="image-preview" />
              <button type="button" class="close" aria-label="Close" @click="removeFromImages(idx)">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="postSpace" class="required">Площадь</label>
          <div class="formWithSupText">
            <input
              id="postSpace"
              v-model.trim="space"
              type="number"
              min="0"
              step="any"
              class="post_form-control w-25"
              autocomplete="off"
            />
            <span class="post_form-suptext">га</span>
            <span v-if="$v.space.$dirty && !$v.space.required" class="invalid">
              Заполните это поле
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="required" for="postPrice">Стоимость</label>
          <div class="formWithSupText">
            <input
              id="postPrice"
              v-model.number.trim="price"
              type="number"
              class="post_form-control w-25"
              autocomplete="off"
            />
            <span class="post_form-suptext">тенге</span>
            <span v-if="$v.price.$dirty && !$v.price.required" class="invalid">
              Заполните это поле
            </span>
            <span v-else-if="$v.price.$dirty && !$v.price.decimal" class="invalid">
              Только положительные числа
            </span>
          </div>
        </div>
        <div class="form-group">
          <label>Целевое назначение</label>
          <div class="form-check">
            <input
              v-model="categories"
              class="form-check-input"
              type="checkbox"
              value="Товарное сельское хозяйство"
            />
            <span>Товарное сельское хозяйство</span>
          </div>
          <div class="form-check">
            <input
              v-model="categories"
              class="form-check-input"
              type="checkbox"
              value="Коммерческое"
            />
            <span>Коммерческое</span>
          </div>
          <div class="form-check">
            <input
              v-model="categories"
              class="form-check-input"
              type="checkbox"
              value="Многоэтажное жилищное строительство"
            />
            <span>Многоэтажное жилищное строительство</span>
          </div>
          <div class="form-check">
            <input
              v-model="categories"
              class="form-check-input"
              type="checkbox"
              value="Индивидуальное жилищное строительство"
            />
            <span>Индивидуальное жилищное строительство</span>
          </div>
        </div>
        <div class="form-group">
          <label
            class="required"
            for="map"
            title="Нарисуйте полигон нажав на кнопку в правом верхнем углу"
          >
            Карта
          </label>
          <span v-if="$v.mapGeometry.$dirty && !$v.mapGeometry.required" class="invalid">
            Нарисуйте полигон и сохраните
          </span>
          <Map @saveMapData="onSaveMapData" />
        </div>
        <div class="form-group">
          <label for="postDescription">Описание</label>
          <textarea
            id="postDescription"
            v-model.trim="description"
            class="post_form-control"
            rows="5"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-submit">Добавить</button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, url, maxLength, decimal } from 'vuelidate/lib/validators';
import Map from '@/components/app/Map.vue';

export default {
  name: 'CreatePost',
  components: {
    Map,
  },
  data: () => ({
    title: '',
    description: '',
    location: '',
    space: '',
    categories: [],
    price: '',
    inputImage: '',
    images: [],
    mapGeometry: null,
    mapZoom: null,
    mapCenter: [],
    // author: '',
    // email: '',
    // phone_number: '',
  }),
  validations: {
    title: {
      required,
    },
    space: {
      required,
    },
    location: {
      required,
    },
    images: {
      required,
      maxLength: maxLength(10),
    },
    inputImage: {
      url,
    },
    price: {
      required,
      decimal,
    },
    mapGeometry: {
      required,
    },
    // email: {
    //   required,
    //   email,
    // },
    // author: {
    //   required,
    // },
  },
  computed: {
    message() {
      return this.$store.getters.message;
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const postData = {
        title: this.title || '',
        description: this.description || '',
        price: this.price || '',
        location: this.location || '',
        space: this.space || '',
        categories: this.categories || [],
        images: this.images || [],
        geometry: this.mapGeometry || null,
        zoom: this.mapZoom || null,
        center: this.mapCenter || [],
        owner_uid: JSON.parse(localStorage.getItem('user')).uid || 'NoID',
      };
      await this.$store.dispatch('createPost', postData);
      if (this.message.type !== 'error') {
        this.$router.push(`/catalog`);
      }
    },
    addToImages(image) {
      if (this.$v.inputImage.$invalid) {
        this.$v.inputImage.$touch();
        return;
      }
      if (image) {
        this.images.push(image);
        this.inputImage = '';
      }
    },
    removeFromImages(index) {
      this.images.splice(index, 1);
    },
    onSaveMapData(data) {
      if (data.geometry.features.length) {
        this.mapGeometry = data.geometry;
      } else {
        this.mapGeometry = null;
      }
      this.mapZoom = data.zoom;
      this.mapCenter = data.center;
    },
  },
};
</script>

<style lang="scss" scoped>
#image-upload {
  width: calc(60% - 95.72px);
}
</style>
