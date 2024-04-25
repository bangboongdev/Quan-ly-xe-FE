
<template>
  <base-page
    :entity="entity"
    :isShowBack="false"
    :isAdd="true"
    :isAction="true"
  ></base-page>
</template>
<script>
import BasePage from "@/views/BasePage/BasePage";
const entity = "audit";

export default {
  components: {
     BasePage,
  },
  data() {
    return {
      entity,
    };
  },
  methods: {},
};
</script>
