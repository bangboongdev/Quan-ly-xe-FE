
<template>
  <base-page
    ref="page"
    :entity="entity"
    :isShowBack="false"
    :isAdd="false"
    :isAction="false"
  >
  </base-page>
</template>
<script>
import BasePage from "@/views/BasePage/BasePage";
const entity = "import-history";

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
