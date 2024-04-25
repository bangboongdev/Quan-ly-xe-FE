<template>
  <div>123456</div>
</template>
<script>
import constant from "@/constant";

export default {
  mounted() {
    this.$router.push({ name: "admin.dashboard" });
  },
  data() {
    return {
      customerType: constant.customerType,
    };
  },
  methods: {
    login() {},
  },
};
</script>
<style>
</style>