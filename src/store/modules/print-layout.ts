import BaseModule from '@/store/base-module';
import PrintLayoutService from "@/services/PrintLayoutService";

var base = new BaseModule(PrintLayoutService);


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
