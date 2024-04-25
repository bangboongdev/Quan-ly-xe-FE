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
    <a-col :span="24" class="container">
      <a-row :gutter="[48, 48]" class="content-container">
        <a-col :span="24" class="step">
          <a-steps :current="current">
            <a-step :title="t('order.attribute.insurance_info')">
              <template #icon>
                <FileProtectOutlined />
              </template>
            </a-step>
            <a-step :title="t('order.attribute.buyer_info')">
              <template #icon>
                <UserOutlined />
              </template>
            </a-step>
            <a-step
              :title="
                t('order.attribute.insured_info', {
                  insured: insuredName?.toLowerCase(),
                })
              "
            >
              <template #icon>
                <FileTextOutlined />
              </template>
            </a-step>
            <a-step :title="t('order.attribute.payment_info')">
              <template #icon>
                <DollarOutlined />
              </template>
            </a-step>
          </a-steps>
        </a-col>

        <a-col :span="24" v-if="current == 0" class="content">
          <keep-alive>
            <InsuranceInfo
              ref="insuranceForm"
              @changeObjectType="changeObjectType"
              :objectiveType="orderObjective[0].type"
              :formData="form"
              :fields="fields"
              :orderObjective="orderObjective"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :layout="layout"
              :rules="rules"
            />
          </keep-alive>
        </a-col>
        <a-col :span="24" v-if="current == 1" class="content">
          <keep-alive>
            <CustomerInfo
              ref="customerForm"
              :formData="form"
              :fields="fields"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :layout="layout"
              :identifyType="identifyType"
              :customerSex="customerSex"
              :rules="rules"
              :relationModel="relationModel"
            />
          </keep-alive>
        </a-col>
        <a-col :span="24" v-if="current == 2" class="content insured-info">
          <keep-alive>
            <ObjectiveInfo
              ref="objectForm"
              @addItem="addItemTable"
              @deleteItem="deleteItemTable"
              :formData="form.orderObjective"
              :fields="fields"
              :orderObjective="orderObjective"
              :orderBeneficiary="orderBeneficiary"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :layout="layout"
              :identifyType="identifyType"
              :customerSex="customerSex"
              :rules="rules"
            />
          </keep-alive>
        </a-col>
        <a-col :span="24" v-if="current == 3" class="content">
          <keep-alive>
            <PaymentInfo
              ref="paymentForm"
              :formData="form"
              :fields="fields"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :layout="layout"
              :rules="rules"
            />
          </keep-alive>
        </a-col>
      </a-row>
    </a-col>
  </a-form>
  <a-row type="flex" justify="end" class="total-amount">
    <a-col>
      <span>Tổng tiền :</span>
      <span>{{ ` ${formatNumber(form.amount, 0)} đ` }}</span>
    </a-col>
  </a-row>
  <a-row type="flex" justify="end" class="footer">
    <a-button type="text" @click="cancelForm">{{
      t("order.attribute.close")
    }}</a-button>
    <a-button v-if="current > 0" class="prev" @click="prev"
      ><DoubleLeftOutlined />{{ t("order.attribute.prev") }}</a-button
    >
    <a-button v-if="current < 3" type="primary" @click="next"
      >{{ t("order.attribute.next") }} <DoubleRightOutlined
    /></a-button>
    <a-button v-if="current == 3" type="primary" @click="saveForm"
      ><SaveOutlined />{{ t("order.attribute.save") }}</a-button
    >
  </a-row>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { formatDate, formatNumber } from "@/utility";
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import * as _ from "lodash";
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
import InsuranceInfo from "@/views/OrderFormTab/InsuranceInfo.vue";
import CustomerInfo from "@/views/OrderFormTab/CustomerInfo.vue";
import ObjectiveInfo from "@/views/OrderFormTab/ObjectiveInfo.vue";
import PaymentInfo from "@/views/OrderFormTab/PaymentInfo.vue";
import { getImage, getBase64, validateImageFile } from "@/formUtility";
import { message } from "ant-design-vue";
import FileService from "@/services/FileService";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import moment from "moment/moment";
import i18n from "@/lang";
const { t } = i18n.global;
const insuranceForm = ref<any>();
const customerForm = ref<any>();
const objectForm = ref<any>();
const paymentForm = ref<any>();
const objectType = ref<number>(1);
interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
  relationModel: any;
}
interface indentifyType {
  value: number;
  label: string;
}
const current = ref<number>(0);
const identifyType = ref<Array<indentifyType>>([
  {
    value: 1,
    label: t("customer.attribute.cccd"),
  },
  {
    value: 2,
    label: t("customer.attribute.cmt"),
  },
]);
const customerSex = ref<Array<indentifyType>>([
  {
    value: 1,
    label: t("order.attribute.male"),
  },
  {
    value: 2,
    label: t("order.attribute.female"),
  },
  {
    value: 3,
    label: t("order.attribute.sex_other"),
  },
]);
const loading = ref<boolean>(false);
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
  relationModel: {},
});
const imageUrl = ref<any>(getImage(props.formData.avatar_id));
const fileList = ref<any>([]);
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 8 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const product = ref();
let formRules = ref<any>({ ...props.rules });
const orderObjective = ref<any>([
  {
    key: 0,
    type: 1,
    name: "",
    address: "",
    identify_no: "",
    identify_type: 1,
    brand: "",
    mobile_no: "",
    sex: 1,
    birth_date: "",
    reg_no: "",
    seat_quantity: "",
  },
]);
const orderBeneficiary = ref<any>([
  {
    key: 0,
    name: "",
    identify_no: "",
    identify_type: 1,
    sex: 1,
    birth_date: "",
    mobile_no: "",
    address: "",
  },
]);
onMounted(() => {
  if (form.value?.mode == "edit") {
    let objectArray = JSON.parse(JSON.stringify(form.value.orderObjective));
    objectArray.forEach((item, index) => {
      item.key = index;
    });
    orderObjective.value = objectArray;
    let beneficiaryArray = JSON.parse(
      JSON.stringify(form.value.orderBeneficiary)
    );
    beneficiaryArray.forEach((item, index) => {
      item.key = index;
    });
    orderBeneficiary.value = beneficiaryArray;
  }
});
const insuredName = computed(() => {
  switch (orderObjective.value[0].type) {
    case 1:
      return t("order.attribute.assets");
    case 2:
      return t("order.attribute.car");
    case 3:
      return t("order.attribute.persons");
    case 4:
      return t("order.attribute.goods");
  }
});
const emit = defineEmits<{
  (e: "cancelForm"): void;
  (e: "saveForm"): void;
}>();
const customRequest = (options) => {
  const { onSuccess, onError, file } = options;
  FileService.upload(file)
    .then((response) => {
      onSuccess(response.data.data.file_id);
    })
    .catch((err) => {
      onError(err);
    });
};
const beforeUpload = (file) => {
  return validateImageFile(file, message);
};
const handleChange = (info) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    getBase64(info.file.originFileObj, (base64Url) => {
      imageUrl.value = base64Url;
      loading.value = false;
      form.value.avatar_id = info.file.response;
    });
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};
const changeObjectType = ($event) => {
  objectType.value = $event;
};
watch(
  () => objectType.value,
  (val) => {
    if (val) {
      orderObjective.value.forEach((item) => (item.type = val));
      form.value.product = void 0;
    }
  }
);
const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};
const cancelForm = () => {
  emit("cancelForm");
};
const saveForm = () => {
  emit("saveForm");
};
const deleteItemTable = (params: any) => {
  if (params.type == "beneficiary") {
    orderBeneficiary.value = orderBeneficiary.value.filter(
      (item: any) => item.key !== params.key
    );
    orderBeneficiary.value.forEach((item) => {
      if (item.key > params.key) {
        item.key--;
      }
    });
  } else if (params.type == "object-insured") {
    orderObjective.value = orderObjective.value.filter(
      (item: any) => item.key !== params.key
    );
    orderObjective.value.forEach((item) => {
      if (item.key > params.key) {
        item.key--;
      }
    });
  }
};
const addItemTable = (type) => {
  if (type == "beneficiary") {
    let newBeneficiary = {
      key: orderBeneficiary.value.length,
      name: "",
      identify_no: "",
      identify_type: 1,
      sex: 1,
      birth_date: "",
      mobile_no: "",
      address: "",
    };

    orderBeneficiary.value.push(newBeneficiary);
  } else if (type == "object-insured") {
    let newInsured = {
      key: orderObjective.value.length,
      name: "",
      address: "",
      identify_no: "",
      identify_type: 1,
      brand: "",
      mobile_no: "",
      sex: 1,
      birth_date: "",
      reg_no: "",
      seat_quantity: "",

      type: objectType.value,
    };
    orderObjective.value.push(newInsured);
  }
};
const prev = () => {
  current.value--;
};
const next = () => {
  switch (current.value) {
    case 0:
      insuranceForm.value?.ruleForm.validate().then(() => {
        current.value++;
      });
      break;
    case 1:
      customerForm.value?.ruleForm.validate().then(() => {
        current.value++;
      });
      break;
    case 2:
      form.value.orderObjective = orderObjective.value;
      form.value.orderBeneficiary = orderBeneficiary.value;
      current.value++;
      break;
  }
};
defineExpose({ ruleForm, form });
</script>
<style lang="scss" scoped>
.container {
  padding: 24px;
  height: 100%;
  .content-container {
    .content {
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
    }
  }
}
.footer {
  padding: 10px 16px;
  width: 100%;
  text-align: right;
  background: white;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 2px 2px;
  position: absolute;
  bottom: 0px;
  z-index: 1;
  .ant-btn {
    width: 120px;
    margin-left: 8px;
  }
  .ant-btn-text {
    border: none;
    width: fit-content;
  }
  .ant-btn-text:hover,
  .ant-btn-text:active,
  .ant-btn-text:focus {
    color: var(--mainColor);
  }
  .prev:hover,
  .prev:active,
  .prev:focus {
    border: 1px solid var(--mainColor);
    color: var(--mainColor);
  }
  .ant-btn-primary:hover,
  .ant-btn-primary:active,
  .ant-btn-primary:focus {
    border-color: var(--mainColor);
    // color: var(--mainColor);
    background: var(--mainColor);
  }
}
.total-amount {
  position: absolute;
  bottom: 56px;
  padding: 12px 24px;
  width: 100%;
}
</style>