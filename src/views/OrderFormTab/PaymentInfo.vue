<template>
  <a-form
    ref="ruleForm"
    :rules="formRules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
    labelAlign="left"
  >
    <a-row type="flex" :gutter="[16, 4]">
      <a-col :span="8">
        <a-form-item :label="fields.payment_type_id.label" name="payment_type">
          <o-select
            ref="payment_type"
            :value="form.payment_type"
            @input="onChangePaymentType"
            :placeholder="
              t('order.attribute.please_select', {
                field: fields.payment_type_id.label.toLowerCase(),
              })
            "
            entity="payment_type"
            :icon="'environment'"
            :isDisplay="'none'"
            :isDisplayAdd="'none'"
            textField="name"
            valueField="id"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import i18n from "@/lang";
import {
  UserOutlined,
  FileProtectOutlined,
  DollarOutlined,
  FileTextOutlined,
  SaveOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
const { t } = i18n.global;
interface Props {
  // formData: any;
  // width: string;
  // rules: any;
  layout: string;
  labelCol: any;
  wrapperCol: any;
  objectiveType: number;
  fields: any;
  orderObjective: any;
  formData: any;
  // relationModel:any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  objectiveType: 1,
  // width: "",
  // rules: {},
  layout: "horizontal",
  labelCol: {},
  wrapperCol: {},
  fields: {},
  orderObjective: [],
  // relationModel:{},
});
const onChangePaymentType = ($event) => {
  form.value.payment_type = $event.value;
};
const form = ref<any>(props.formData);
</script>
