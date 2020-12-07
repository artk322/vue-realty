<template>
  <div class="row justify-content-center mt-5 mx-0">
    <div class="col-lg-5 col-md-8 col-sm-10 col-12">
      <div class="jumbotron bg-white py-4">
        <form @submit.prevent="submitHandler">
          <h3 class="text-center">Регистрация</h3>
          <div class="form-group">
            <label for="email" class="required">Email</label>
            <input id="email" v-model="email" type="email" class="form-control" />
            <div v-if="$v.email.$dirty && !$v.email.required" class="invalid-feedback">
              Неккоректный email
            </div>
          </div>
          <div class="form-group">
            <label class="required" for="password">Пароль</label>
            <input id="password" v-model="password" type="password" class="form-control" />
          </div>
          <div class="form-group">
            <label class="required" for="repeatPassword">Повторите пароль</label>
            <input
              id="repeatPassword"
              v-model="repeatPassword"
              type="password"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label class="required" for="name">Имя</label>
            <input id="name" v-model="name" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="required" for="phone_number">Телефон</label>
            <input id="phone_number" v-model="phone_number" type="tel" class="form-control" />
          </div>
          <div class="mt-4">
            <div class="row">
              <div class="col-lg-12">
                <SubmitButton :loading="loading" button-label="Отправить" />
              </div>
              <div class="col-lg-12 text-center mt-4">
                <span>
                  Уже есть аккаунт?
                  <router-link to="/login" class="link">
                    Войти
                  </router-link>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { email, required, maxLength, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  data: () => ({
    loading: false,
    email: '',
    name: '',
    phone_number: '',
    password: '',
    repeatPassword: '',
  }),
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
    name: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(50),
    },
    phone_number: {
      required,
    },
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
      const payload = {
        email: this.email,
        password: this.password,
        name: this.name,
        phone_number: this.phone_number,
      };
      this.loading = true;
      await this.$store.dispatch('registerUser', payload);
      if (this.message.type !== 'error') {
        this.$router.push('/login');
      }
      this.loading = false;
    },
  },
};
</script>
