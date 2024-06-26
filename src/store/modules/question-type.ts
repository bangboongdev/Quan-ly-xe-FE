import BaseModule from '@/store/base-module';
import QuestionTypeService from "@/services/QuestionTypeService";

var base = new BaseModule(QuestionTypeService);


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