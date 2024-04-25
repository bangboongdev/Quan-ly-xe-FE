
<template>
  <base-page
    :entity="entity"
    :isAction="false"
    :widthModal='"100%"'
  ></base-page>
</template>
<script>
import BasePage from "@/views/BasePage/BasePage";
const entity = "activity-log";

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
