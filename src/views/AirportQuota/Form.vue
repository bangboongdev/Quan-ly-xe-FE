<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
     <a-form-item :label="fields.from_airport_id.label" name="from_airport_id">
      <a-input
        v-model:value="form.from_airport_id"
        :placeholder="fields.from_airport_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.to_airport_id.label" name="to_airport_id">
      <a-input
        v-model:value="form.to_airport_id"
        :placeholder="fields.to_airport_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.one_way_amount.label" name="one_way_amount">
      <a-input
        v-model:value="form.one_way_amount"
        :placeholder="fields.one_way_amount.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.round_trip_amount.label" name="round_trip_amount">
      <a-input
        v-model:value="form.round_trip_amount"
        :placeholder="fields.round_trip_amount.placeholder"
      />
  </a-form-item>


  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
});
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 6 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);

const handleChangeActive = ($event?:any) => {
  if (!$event.value) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};
defineExpose({ruleForm,form})
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>