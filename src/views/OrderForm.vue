<script setup>
  import { computed, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { getItems } from '@/services/cartService';
  import { addOrder } from '@/services/orderService';

  const router = useRouter();

  const state = reactive({
    items: [],
    form: {
      name: '',
      address: '',
      payment: 'card',
      cardNumber: '',
      itemIds: []
    }
  });

  onMounted(async () => {
    const res = await getItems();

    if (res === undefined || res.status !== 200) {
      return;
    }

    state.items = res.data;
  });

  const submit = async () => {
    if (state.form.payment !== 'card') {
      // 결제 수단이 카드가 아니라면 카드 번호를 지운다.
      state.form.cardNumber = '';
    }
    
    state.form.itemIds = state.items.map(item => item.itemId);
    const res = await addOrder(state.form);
    if (res === undefined || res.status !== 200) {
      alert('에러 발생');
      return;
    }

    const message = [ '주문이 완료되었습니다.' ];
    if (state.form.payment === 'bank') {
      const price = computedTotalPrice.value.toLocaleString();
      message.push(`한국은행 123-456-77777 계좌로 ${price}원을 입금해주시길 바랍니다.`);
    }

    alert(message.join('\n'));
    await router.push('/');
  };

  const computedTotalPrice = computed(() => {
    let totalPrice = 0;

    state.items.forEach(item => {
      totalPrice += item.price - item.price * item.discountPer / 100;
    });

    return totalPrice;
  });
</script>

<template>
  <form class="order-form" @submit.prevent="submit">
    <div class="container">
      <div class="py-5 text-center">
        <div class="h4">
          <b>주문하기</b>
        </div>
        <p class="h6 font-lg mt-3">주문 내역을 확인하시고 주문하기 버튼을 클릭해주세요.</p>
      </div>
      <div class="row g-5">
        <div class="col-md-5 col-lg-4 order-md-last">
          <div class="mb-3">
            <span class="h5 mb-3 align-middle me-2">
              <b>구입 목록</b>
            </span>
            <span class="badge bg-primary rounded-pill align-middle">
              {{ state.items.length }}
            </span>
          </div>
          <ul class="items list-group mb-3">
            <li class="p-3 list-group-item d-flex justify-content-between" v-for="i in state.items">
              <div>
                <h6 class="my-0">{{ i.name }}</h6>
              </div>
              <span class="text-muted">
                {{ (i.price - i.price * i.discountPer / 100).toLocaleString() }}원
              </span>
            </li>
          </ul>
          <div class="border p-4 bg-light h5 rounded text-center total-price">
            <span>합계 </span>
            <b>{{ computedTotalPrice.toLocaleString() }}원</b>
          </div>
          <button type="submit" class="w-100 btn btn-primary py-4 mt-4">결제하기</button>
        </div>
        <div class="col-md-7 col-lg-8">
          <div class="h5 mb-3">
            <b>주문자 정보</b>
          </div>
          <div class="row g-3">
            <div class="col-12">
              <label for="name" class="form-label">이름</label>
              <input type="text" class="form-control p-3" id="name" v-model="state.form.name">
            </div>
            <div class="col-12 pt-1">
              <label for="address" class="form-label">주소</label>
              <input type="text" class="form-control p-3" id="address" v-model="state.form.address">
            </div>
          </div>
          <div class="h5 mt-5 mb-3">
            <b>결제 수단</b>
          </div>
          <div class="my-3">
            <div class="form-check">
              <input id="card" name="paymentMethod" type="radio" class="form-check-input" value="card" v-model="state.form.payment">
              <label class="form-check-label" for="card">신용 카드</label>
            </div>
            <div class="form-check">
              <input id="bank" name="paymentMethod" type="radio" class="form-check-input" value="bank" v-model="state.form.payment">
              <label class="form-check-label" for="bank">무통장 입금</label>
            </div>
          </div>
          <div class="pt-1" v-if="state.form.payment === 'card'">
            <label for="cardNum" class="form-label">카드 번호</label>
            <input type="text" class="form-control p-3" id="cardNum" v-model="state.form.cardNumber">
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>

</style>