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
              :label="t('order.attribute.customer_type')"
              name="customer_type"
            >
              <a-radio-group
                :defaultValue="1"
                v-model:value="form.orderCustomer.type"
              >
                <a-radio :value="1">{{
                  t("customer.attribute.personal")
                }}</a-radio>
                <a-radio :value="2">{{
                  t("customer.attribute.institute")
                }}</a-radio>
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
                object: t("order.attribute.buyer").toLowerCase(),
              })
            }}</span>
            <a-card>
              <a-row type="flex" :gutter="[16, 0]">
                <a-col :span="8">
                  <a-form-item
                    :label="t('order.attribute.partner')"
                    name="partner"
                  >
                    <o-select
                      ref="partner"
                      :value="form.partner"
                      @input="onChangePartner"
                      :placeholder="
                        t('order.attribute.please_select', {
                          field: t('order.attribute.partner').toLowerCase(),
                        })
                      "
                      entity="partner"
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
                    :label="fields.buyer_id.label"
                    name="customer_buyer"
                  >
                    <o-select
                      ref="customer_buyer"
                      :value="form.buyer"
                      @input="onChangeBuyer"
                      :placeholder="
                        t('order.attribute.please_select', {
                          field: fields.buyer_id.label.toLowerCase(),
                        })
                      "
                      entity="user"
                      :disabled="buyerDisabled"
                      :title="'Người mua'"
                      :icon="'environment'"
                      :isDisplay="'none'"
                      :isDisplayAdd="'none'"
                      textField="username"
                      valueField="id"
                      :filters="[
                        {
                          field: 'entity_id',
                          operator: 'equal',
                          value: form?.partner?.value,
                        },
                      ]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
          <a-spin :spinning="isFetchingCustomer">
            <a-col :span="24">
              <span class="card-title">{{
                t("order.attribute.object_info", {
                  object: t("order.attribute.customer").toLowerCase(),
                })
              }}</span>
              <a-card>
                <a-row type="flex" :gutter="[16, 4]">
                  <a-col :span="8">
                    <a-form-item
                      :label="
                        form.type == 1
                          ? t('order.attribute.customer_name')
                          : t('order.attribute.institute_name')
                      "
                      name="customer_name"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.name"
                        :placeholder="
                          form.type == 1
                            ? t('order.attribute.customer_name')
                            : t('order.attribute.institute_name')
                        "
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8" v-if="form.orderCustomer.type == 2">
                    <a-form-item
                      :label="t('order.attribute.tax_code')"
                      name="customer_tax_code"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.tax_code"
                        :placeholder="t('order.attribute.tax_code')"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8" v-if="form.orderCustomer.type == 2">
                    <a-form-item
                      :label="t('order.attribute.delegate')"
                      name="customer_delegate"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.delegate"
                        :placeholder="t('order.attribute.delegate')"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8" v-if="form.orderCustomer.type == 1">
                    <a-form-item
                      :label="t('order.attribute.identify_no')"
                      name="customer_identify_no"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.identify_no"
                        :placeholder="t('order.attribute.identify_no')"
                        @blur="enableGetCustomer"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8" v-if="form.orderCustomer.type == 1">
                    <a-form-item
                      :label="t('order.attribute.identify_type')"
                      name="customer_identify_type"
                    >
                      <a-select
                        v-model:value="form.orderCustomer.identify_type"
                        :defaultValue="1"
                        :options="identifyType"
                        :placeholder="
                          $t('customer.attribute.select_identity_papers')
                        "
                        @change="enableGetCustomer"
                      >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8" v-if="form.orderCustomer.type == 1">
                    <a-form-item
                      :label="t('order.attribute.birth_date')"
                      name="customer_birth_date"
                    >
                      <a-date-picker
                        format="DD/MM/YYYY"
                        v-model:value="form.orderCustomer.birth_date"
                        :placeholder="t('order.attribute.birth_date')"
                        :locale="locale"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8" v-if="form.orderCustomer.type == 1">
                    <a-form-item
                      :label="t('order.attribute.sex')"
                      name="customer_sex"
                    >
                      <a-select
                        v-model:value="form.orderCustomer.sex"
                        :options="customerSex"
                        :placeholder="$t('order.attribute.customer_sex')"
                      >
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      :label="t('order.attribute.mobile_no')"
                      name="customer_mobile_no"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.mobile_no"
                        :placeholder="t('order.attribute.mobile_no')"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      :label="t('order.attribute.email')"
                      name="customer_email"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.email"
                        :placeholder="t('order.attribute.email')"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      :label="t('order.attribute.province')"
                      name="customer_province"
                    >
                      <o-select
                        ref="customer_province"
                        :value="form.orderCustomer.province"
                        @input="onChangeProvince"
                        :placeholder="
                          t('order.attribute.please_select', {
                            field: t('order.attribute.province').toLowerCase(),
                          })
                        "
                        entity="province"
                        :title="'Tỉnh/Thành phố'"
                        :icon="'environment'"
                        :isDisplay="'none'"
                        :isDisplayAdd="'none'"
                        textField="title"
                        valueField="province_id"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      :label="t('order.attribute.district')"
                      name="customer_district"
                    >
                      <o-select
                        ref="customer_district"
                        :value="form.orderCustomer.district"
                        @input="onChangeDistrict"
                        :placeholder="
                          t('order.attribute.please_select', {
                            field: t('order.attribute.district').toLowerCase(),
                          })
                        "
                        entity="district"
                        :disabled="districtDisabled"
                        :title="'Quận/Huyện'"
                        :icon="'environment'"
                        :isDisplay="'none'"
                        textField="title"
                        valueField="district_id"
                        :filters="[
                          {
                            field: 'province_id',
                            operator: 'equal',
                            value: form?.orderCustomer?.province?.value,
                          },
                        ]"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      :label="t('order.attribute.address')"
                      name="address"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.address"
                        :placeholder="t('order.attribute.address')"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
            <a-col :span="24">
              <span class="card-title">{{
                t("order.attribute.object_info", {
                  object: t("order.attribute.bank").toLowerCase(),
                })
              }}</span>
              <a-card>
                <a-row type="flex" :gutter="[16, 4]">
                  <a-col :span="8">
                    <a-form-item
                      :label="t('order.attribute.bank')"
                      name="customer_bank"
                    >
                      <o-select
                        ref="customer_bank"
                        :value="form?.orderCustomer.bank"
                        @input="onChangeBank"
                        :placeholder="
                          t('order.attribute.please_select', {
                            field: t('order.attribute.bank').toLowerCase(),
                          })
                        "
                        entity="bank"
                        :title="'Ngân hàng'"
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
                      :label="t('order.attribute.account_number')"
                      name="customer_account_number"
                    >
                      <a-input
                        v-model:value="form.orderCustomer.account_number"
                        :placeholder="t('order.attribute.account_number')"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
          </a-spin>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import i18n from "@/lang";
const { t } = i18n.global;
import { useGetItemByIdentify } from "@/hooks/customer";
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
interface selectOption {
  value: number;
  label: string;
}
interface Props {
  // formData: any;
  // width: string;
  rules: any;
  layout: string;
  labelCol: any;
  wrapperCol: any;
  objectiveType: number;
  fields: any;
  formData: any;
  identifyType: any;
  customerSex: any;
  relationModel: any;
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
  identifyType: [],
  customerSex: [],
  relationModel: {},
});
let formRules = ref<any>({ ...props.rules });
const customer_province = ref();
const customer_district = ref();
const customer_buyer = ref();
const customer_bank = ref();
const buyerDisabled = ref<boolean>(true);
const districtDisabled = ref<boolean>(true);
const ruleForm = ref<any>();
const emit = defineEmits<{
  //   (e: "changeObjectType", type): void;
}>();
const form = ref<any>(props.formData);
const enabledIdentify = ref<boolean>(false);
const identify = computed(() => {
  let item = {
    identify_no: form.value.orderCustomer.identify_no,
    type: form.value.orderCustomer.identify_type,
  };
  return item;
});
const { data: customerDataByIdentify, isFetching: isFetchingCustomer } =
  useGetItemByIdentify(identify, {
    enabled: computed(() => enabledIdentify.value),
    staleTime: 10000,
    onSuccess: (data) => {
      getCustomerByIdentify(data);
    },
  });
let validateProvince = (rule?: any, value?: any) => {
  debugger;
  if (typeof form.value.orderCustomer.province == "undefined") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("customer.attribute.name_of_province_id"),
      })
    );
  } else {
    return Promise.resolve();
  }
};
let validateDistrict = (rule?: any, value?: any) => {
  debugger;
  if (typeof form.value.orderCustomer.district == "undefined") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("customer.attribute.name_of_district_id"),
      })
    );
  } else {
    return Promise.resolve();
  }
};
let validateBank = (rule?: any, value?: any) => {
  debugger;
  if (typeof form.value.orderCustomer.bank == "undefined") {
    return Promise.reject(
      t("validator.select_require", {
        field: t("order.attribute.customer_bank_id"),
      })
    );
  } else {
    return Promise.resolve();
  }
};
formRules.value.customer_province = [
  {
    required: true,
    validator: validateProvince,
    trigger: "change",
  },
];
formRules.value.customer_district = [
  {
    required: true,
    validator: validateDistrict,
    trigger: "change",
  },
];
formRules.value.customer_bank = [
  {
    required: true,
    validator: validateBank,
    trigger: "change",
  },
];
const onChangePartner = ($event) => {
  form.value.partner = $event.value;
  buyerDisabled.value = typeof $event == "undefined";
  form.value.buyer = void 0;
};
const onChangeProvince = ($event) => {
  form.value.orderCustomer.province = $event?.value;
  form.value.orderCustomer.province_id = $event?.value?.key;
  let item = customer_district.value;
  districtDisabled.value = typeof $event == "undefined";
  form.value.orderCustomer.district = void 0;
  onChangeLocation($event, item, "province_id");
};
const onChangeLocation = ($event, item, field) => {
  let value = $event.value ? $event.value.key : void 0;
  item.onLoad({ field, value });
};
const onChangeDistrict = ($event) => {
  form.value.orderCustomer.district = $event.value;
  form.value.orderCustomer.district_id = $event.value.key;
};
const onChangeBank = ($event) => {
  form.value.orderCustomer.bank = $event.value;
  form.value.orderCustomer.bank_id = $event.value.key;
};
const onChangeBuyer = ($event) => {
  form.value.buyer = $event.value;
};
const enableGetCustomer = () => {
  if (typeof form.value.orderCustomer.identify_no !== "undefined") {
    if (form.value.orderCustomer.identify_no !== "") {
      enabledIdentify.value = true;
    } else {
      ruleForm.value.resetFields();
    }
  }
};
const getCustomerByIdentify = (data) => {
  let customerDefault = {
    type: 1,
    identify_type: form.value.orderCustomer.identify_type,
    identify_no: form.value.orderCustomer.identify_no,
  };
  console.log(data);
  if (data.data.errorCode == 0 && data.data.data) {
    let item = data.data.data;
    Object.values(props.relationModel.orderCustomer.objectRelation).map(
      (key: any) => {
        item[key] = {
          value: item[key + "_id"] || "",
          label: item["name_of_" + key + "_id"] || "",
        };
      }
    );
    form.value.orderCustomer = item;
  } else {
    form.value.orderCustomer = customerDefault;
  }
  enabledIdentify.value = false;
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
