import api from '../../api/api'

const state = {
  category: null,
  allSubCategories: [],
  allBrands: [],
  message: null
}

const getters = {

}

const actions = {
  addCategoryAdmin ({state, commit}, categorySubcategory) {
    api().post('admin/addCategory', categorySubcategory)
      .then(() => commit('setSuccessMessage'))
      .catch(() => commit('setFailureMessage'))
  },
  getAllSubCategories ({state, commit}) {
    api().get('subcategory')
      .then(r => {
        commit('setAllSubCategories', r.data)
      })
      .catch(() => commit('setFailureMessage'))
  },
  getAllBrands ({state, commit}) {
    api().get('brands')
      .then(r => {
        commit('setAllBrands', r.data._embedded.brands.map(brand => {
          return {id: brand.id, name: brand.name}
        }))
      })
      .catch(() => commit('setFailureMessage'))
  }
}

const mutations = {
  setSuccessMessage (state) {
    state.message = 'Operation completed successfully'
  },
  setFailureMessage (state) {
    state.message = 'Operation failed due to one or more errors'
  },
  setAllSubCategories (state, subCategories) {
    state.allSubCategories = subCategories
  },
  setAllBrands (state, brands) {
    state.allBrands = brands
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}