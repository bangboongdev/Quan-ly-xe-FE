import BaseModule from '@/store/base-module';
import CategoryService from "@/services/CategoryService";

var base = new BaseModule(CategoryService);


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