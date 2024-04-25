import BaseModule from '@/store/base-module';
import ProvinceDistanceQuotaService from "@/services/ProvinceDistanceQuotaService";

var base = new BaseModule(ProvinceDistanceQuotaService);


const state = {
  ...base.state,
};
const getters = {
  ...base.getters,
};
const actions = {
  ...base.actions,
};
const mutations = {
  ...base.mutations,
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};