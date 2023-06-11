<template>
  <div>
    Helpful API: https://helpful-plugin.info/docs/api/

    <button type="button" @click="addPro">PRO</button>
  </div>
</template>

<script setup lang="ts">
const { PUBLIC_WP_REST_API, PUBLIC_ACC_PW } = import.meta.env;

const addPro = () => {
  const auth: string = "user:" + PUBLIC_ACC_PW;

  const buff = Buffer.from(auth).toString("base64");
  console.log(buff);

  // const response = fetch(`${PUBLIC_WP_REST_API}/helpful/pro`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': buff,
  //     'cache-control': 'no-cache',
  //   },
  //   body: {

  //   }
  // })
};
</script>

<style scoped></style>
