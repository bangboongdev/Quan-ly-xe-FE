import BaseModule from '@/store/base-module';
import AnswerService from "@/services/AnswerService";

var base = new BaseModule(AnswerService);


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