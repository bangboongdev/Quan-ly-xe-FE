<template>
  <a-page-header title="Khoảng cách nội tỉnh">
    <template #extra>
      <o-select
        :value="province"
        @input="onChangeProvince"
        placeholder="Vui lòng chọn tỉnh/thành phố"
        entity="province"
        :title="'Tỉnh/Thành phố'"
        :icon="'environment'"
        :isDisplay="'none'"
        :isDisplayAdd="'none'"
        textField="title"
        valueField="province_id"
      />
    </template>
  </a-page-header>

  <a-row type="flex" justify="center" align="middle" style="min-height: 400px">
    <a-spin :spinning="distanceListData?.isFetching">
      <table v-show="!distanceListData?.isFetching">
        <thead>
          <tr>
            <th></th>
            <th v-for="item in columns" :key="item.id">
              <span>{{ item.title }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rows" :key="item.id">
            <th class="title_column">{{ item.title }}</th>
            <template v-for="(data, index) in item.items"
              :key="index">
            <td
              :style="`background:${data.is_edit ? 'white' : '#d9d9d9'}`"
              @click="showModal(index, item.title, data, data.is_edit)"
            >
              {{ formatNumber(data.value) }}
            </td>
            </template>
          </tr>
        </tbody>
      </table>
    </a-spin>
  </a-row>

  <a-modal
    v-model:visible="visible"
    :title="`${from_district_index} - ${to_district_index}`"
    @ok="handleOk"
    okText="Lưu"
    cancelText="Hủy"
  >
    <a-input v-model:value="change_distance" placeholder="Nhập khoảng cách" />
  </a-modal>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useGetList as useGetProvince } from "@/hooks/province";
import { formatNumber } from "@/utility";
import { useGetList, useUploadDistance } from "@/hooks/district_distance_quota";
import i18n from "@/lang";
import { message } from "ant-design-vue";
const { t } = i18n.global;
import * as _ from "lodash";
const province = ref<any>();
const items = ref([]);
const columns = ref<any>([]);
const rows = ref([]);
const visible = ref<boolean>(false);
const useUploadDistanceData = useUploadDistance();
const from_district_index = ref<any>();
const to_district_index = ref<any>();
const index_district = ref<any>();
const id_distance_index = ref<number>();
const change_distance = ref<string>();
const { refetch: refetchProvince } = useGetProvince(
  { value: { pageSize: 1, pageIndex: 1 } },
  {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: true,
    onSuccess: (data) => {
      setProvinceDefault(data.data.data.items[0]);
    },
  }
);
const params = ref<any>();
const onChangeProvince = ($event) => {
  province.value = $event.value;
  params.value = {
    filters: [{ field: "province_id", value: $event.value.key }],
    pageSize: 500,
  };
};
const enabledGetDistance = computed(() => typeof params.value !== "undefined");
const distanceListData = ref<any>(
  useGetList(params, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    enabled: enabledGetDistance,
    onSuccess: async (response) => {
      const items = response.data.data.items;
      const tmp = _.map(items, (item) => {
        return {
          title: item.name_of_to_district_id,
          id: item.to_district_id,
        };
      });

      const districts = _.uniqBy(tmp, "id").sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();

        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      columns.value = districts;
      console.log("column", columns.value);
      let data: any = [];
      districts.map((i) => {
        let item: any = {
          title: i.title,
          items: [],
        };
        districts.map((j) => {
          const value =
            items.find(
              (k) => k.to_district_id == i.id && j.id == k.from_district_id
            )?.distance || 0;

          const code =
            items.find(
              (k) => k.to_district_id == i.id && k.from_district_id == j.id
            )?.id || null;

          item.items.push({
            is_edit: i.id !== j.id ? true : false,
            key: [j.id],
            value: value,
            code: code,
          });
        });
        data.push(item);
      });

      await data.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();

        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      rows.value = data;
      console.log("row", rows);

      // checkError(response);
    },
  })
);
const showModal = (index, title, data, is_edit) => {
  if (is_edit) {
    index_district.value = index;

    from_district_index.value = title;
    to_district_index.value = columns.value[index].title;

    change_distance.value = data.value;
    id_distance_index.value = data.code;

    visible.value = true;
  }
};
const setProvinceDefault = (data) => {
  province.value = {
    value: data.province_id,
    label: data.title,
    key: data.province_id,
  };
  params.value = {
    filters: [{ field: "province_id", value: data.province_id }],
    pageSize: 500,
  };
};
const handleOk = (e: MouseEvent) => {
  const body = ref<any>({
    id: id_distance_index.value,
    distance: change_distance.value,
  });

  useUploadDistanceData
    .mutateAsync(body.value)
    .then((response) => {
      if (response.data.errorCode === 0) {
        visible.value = false;
        message.success("Cập nhật thành công");
      } else {
        console.log("err", response);
        message.error(response.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
      message.error(t("common.system_error"));
    });
};
</script>
<style scoped lang="scss">
.ant-page-header {
  :deep(.ant-page-header-heading-extra) {
    .select {
      width: 240px;
    }
  }
}
</style>
<style scoped lang="scss">
table {
  font-size: 125%;
  white-space: nowrap;
  margin: 0px 24px;
  border: none;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  border: 1px solid black;
}
table td,
table th {
  border: 1px solid black;
  padding: 0.5rem 1rem;
}
table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 25vw;
  background: #217242;
  color: white;
  text-align: center;
}
table td {
  background: #fff;
  padding: 4px 5px;
  text-align: center;
  color: #000;
}

table thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
}
table tbody th {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
}
</style>