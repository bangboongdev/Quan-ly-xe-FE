<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
     <a-form-item :label="fields.code.label" name="code">
      <a-input
        v-model:value="form.code"
        :placeholder="fields.code.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.name.label" name="name">
      <a-input
        v-model:value="form.name"
        :placeholder="fields.name.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.country_id.label" name="country_id">
      <a-input
        v-model:value="form.country_id"
        :placeholder="fields.country_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.province_id.label" name="province_id">
      <a-input
        v-model:value="form.province_id"
        :placeholder="fields.province_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.district_id.label" name="district_id">
      <a-input
        v-model:value="form.district_id"
        :placeholder="fields.district_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.ward_id.label" name="ward_id">
      <a-input
        v-model:value="form.ward_id"
        :placeholder="fields.ward_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.description.label" name="description">
      <a-input
        v-model:value="form.description"
        :placeholder="fields.description.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.one_way_amount.label" name="one_way_amount">
      <a-input
        v-model:value="form.one_way_amount"
        :placeholder="fields.one_way_amount.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.two_way_amount.label" name="two_way_amount">
      <a-input
        v-model:value="form.two_way_amount"
        :placeholder="fields.two_way_amount.placeholder"
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