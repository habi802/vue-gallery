<script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '@/services/accountService';

  const router = useRouter();

  const state = reactive({
    form: {
      loginId: '',
      loginPw: ''
    }
  });

  const submit = async () => {
    const res = await login(state.form);

    switch (res.status) {
      case 200:
        await router.push('/');
        break;
      case 404:
        alert('아이디/비밀번호를 확인해 주삼.')
        break;
    }
  };
</script>

<template>
  <div class="login">
    <div class="container">
      <form class="py-5 d-flex flex-column gap-3" @submit.prevent="submit">
        <h1 class="h5 mb-3">로그인</h1>
        <div class="form-floating">
          <input type="email" class="form-control" id="loginId" v-model="state.form.loginId" placeholder="이메일">
          <label for="loginId">이메일</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" id="loginPw" v-model="state.form.loginPw" placeholder="패스워드" autocomplete="off">
          <label for="loginPw">패스워드</label>
        </div>
        <button type="submit" class="w-100 h6 btn py-3 btn-primary">로그인</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .join > .container {
    max-width: 576px;
  }
</style>