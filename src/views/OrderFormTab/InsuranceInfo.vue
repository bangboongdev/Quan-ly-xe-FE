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
    <a-row :gutter="[0, 32]">
      <a-col :span="24">
        <a-row :gutter="[0, 16]">
          <a-col :span="8">
            <a-form-item
              :label="t('order.attribute.objective_type')"
              name="objective_type"
            >
              <a-radio-group
                @change="changeObjectType"
                :value="objectiveType"
                :defaultValue="1"
              >
                <a-row type="flex" :gutter="[8, 8]">
                  <a-col :span="12">
                    <a-radio :value="1">{{
                      t("order.attribute.assets")
                    }}</a-radio>
                  </a-col>
                  <a-col :span="12">
                    <a-radio :value="2">{{ t("order.attribute.car") }}</a-radio>
                  </a-col>
                  <a-col :span="12">
                    <a-radio :value="3">{{
                      t("order.attribute.person")
                    }}</a-radio>
                  </a-col>
                  <a-col :span="12">
                    <a-radio :value="4">{{
                      t("order.attribute.goods")
                    }}</a-radio>
                  </a-col>
                </a-row>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-row type="flex" :gutter="[0, 24]">
          <a-col :span="24">
            <span class="card-title">{{
              t("order.attribute.object_info", {
                object: t("order.attribute.insurance").toLowerCase(),
              })
            }}</span>
            <a-card>
              <a-row type="flex" :gutter="[16, 4]">
                <a-col :span="8">
                  <a-form-item
                    :label="t('order.attribute.company')"
                    name="company"
                  >
                    <o-select
                      ref="company"
                      :value="form.company"
                      @input="onChangeCompany"
                      :placeholder="
                        t('order.attribute.please_select', {
                          field: t(
                            'order.attribute.insurance_company'
                          ).toLowerCase(),
                        })
                      "
                      entity="company"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      textField="name"
                      valueField="id"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="t('order.attribute.insurance')"
                    name="product"
                  >
                    <o-select
                      ref="product"
                      :value="form.product"
                      @input="onChangeProduct"
                      :placeholder="
                        t('order.attribute.please_select', {
                          field: t('order.attribute.insurance').toLowerCase(),
                        })
                      "
                      entity="product"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      textField="name"
                      valueField="id"
                      :disabled="form.company == undefined"
                      :filters="[
                        {
                          field: 'category_id',
                          operator: 'equal',
                          value: objectiveType,
                        },
                        {
                          field: 'company_id',
                          operator: 'equal',
                          value: form?.company?.value,
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8" v-if="productData?.is_package == 1">
                  <a-form-item :label="fields.package_id.label" name="package">
                    <o-select
                      ref="package"
                      :value="form.package"
                      @input="onChangePackage"
                      :placeholder="
                        t('order.attribute.please_select', {
                          field: fields.package_id.label.toLowerCase(),
                        })
                      "
                      entity="package"
                      :title="'Chọn gói bảo hiểm'"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      textField="name"
                      valueField="id"
                      :filters="[
                        {
                          field: 'product_id',
                          operator: 'equal',
                          value: form?.product?.value,
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
          <a-col :span="24">
            <span class="card-title">{{ t("order.attribute.time") }}</span>
            <a-card>
              <a-row type="flex" :gutter="[16, 4]">
                <a-col :span="8">
                  <a-form-item
                    :label="fields.start_time.label"
                    name="start_time"
                  >
                    <a-date-picker
                      format="DD/MM/YYYY"
                      v-model:value="form.start_time"
                      :placeholder="fields.start_time.placeholder"
                      :locale="locale"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="fields.end_time.label" name="end_time">
                    <a-date-picker
                      format="DD/MM/YYYY"
                      v-model:value="form.end_time"
                      :placeholder="fields.end_time.placeholder"
                      :locale="locale"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import i18n from "@/lang";
import { useDetail as useProductDetail } from "@/hooks/product";
import { useDetail as usePackageDetail } from "@/hooks/package";
const { t } = i18n.global;
interface Props {
  // formData: any;
  // width: string;
  layout: string;
  labelCol: any;
  wrapperCol: any;
  objectiveType: number;
  fields: any;
  orderObjective: any;
  formData: any;
  rules: any;
  // relationModel:any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  objectiveType: 1,
  // width: "",
  rules: {},
  layout: "horizontal",
  labelCol: {},
  wrapperCol: {},
  fields: {},
  orderObjective: [],
  // relationModel:{},
});
const ruleForm = ref();
console.log(ruleForm);
let formRules = ref<any>({ ...props.rules });
const emit = defineEmits<{
  (e: "changeObjectType", type): void;
}>();
const form = ref<any>(props.formData);
console.log("form", form.value.company);
// const productDisabled = ref<boolean>(true);
const productId = computed(() => form?.value?.product?.value);
const packageId = computed(() => form?.value?.package?.value);
const { data: productDetail } = useProductDetail(productId, {
  staleTime: 10000,
  enabled: computed(() => typeof productId.value !== "undefined"),
});
const { data: packageDetail } = usePackageDetail(packageId, {
  staleTime: 10000,
  enabled: computed(() => typeof packageId.value !== "undefined"),
});
const productData = computed(() => productDetail?.value?.data?.data);
const packageData = computed(() => packageDetail?.value?.data?.data);
watchEffect(() => {
  if (packageData.value?.amount) {
    form.value.amount = packageData.value?.amount;
  } else {
    form.value.amount = productData.value?.amount;
  }
});
let validateCompany = (rule?: any, value?: any) => {
  if (typeof form.value.company == "undefined") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("order.attribute.company").toLowerCase(),
      })
    );
  } else {
    return Promise.resolve();
  }
};
formRules.value.company = [
  {
    required: true,
    validator: validateCompany,
    trigger: "change",
  },
];
let validateProduct = (rule?: any, value?: any) => {
  if (typeof form.value.product == "undefined") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("order.attribute.insurance").toLowerCase(),
      })
    );
  } else {
    return Promise.resolve();
  }
};
formRules.value.product = [
  {
    required: true,
    validator: validateProduct,
    trigger: "change",
  },
];
let validateStartTime = (rule?: any, value?: any) => {
  if (value == null || value == "") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("order.attribute.start_time").toLowerCase(),
      })
    );
  } else {
    return Promise.resolve();
  }
};
formRules.value.start_time = [
  {
    required: true,
    validator: validateStartTime,
    trigger: "change",
  },
];
let validateEndTime = (rule?: any, value?: any) => {
  if (value == null || value == "") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("order.attribute.end_time").toLowerCase(),
      })
    );
  } else {
    return Promise.resolve();
  }
};
formRules.value.end_time = [
  {
    required: true,
    validator: validateEndTime,
    trigger: "change",
  },
];
const onChangeProduct = ($event) => {
  form.value.product = $event.value;
  form.value.package = void 0;
};
const onChangePackage = ($event) => {
  form.value.package = $event.value;
};
const changeObjectType = ($event) => {
  emit("changeObjectType", $event.target.value);
   ruleForm.value.resetFields();
};
const onChangeCompany = ($event) => {
  form.value.company = $event.value;
  // console.log('change',form.value.company)
  // productDisabled.value = typeof $event == "undefined";
  form.value.product = void 0;
};
defineExpose({ ruleForm, form });
</script>
<style scoped lang="scss">
.ant-form {
  .card-title {
    position: absolute;
    top: -4px;
    left: 24px;
    font-size: 16px;
    font-weight: 600;
    background: white;
    z-index: 1;
  }
  .ant-form-item {
    margin: 0;
    // margin-bottom: 12px;

    .ant-calendar-picker {
      width: 100%;
    }
    .select {
      display: initial;
    }
  }
}
</style>
