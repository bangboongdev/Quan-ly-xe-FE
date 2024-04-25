<template>
 
</template>
<script>
import formUtility from "@/formUtility";

export default {
  mixins: [formUtility],
  components: {
  },
  props: {
    formData: {},
    width: String,
    rules: {
      type: Object,
      default: {},
    },
    fields: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      form: this.formData,
    };
  },
  methods: {

  },
};
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>