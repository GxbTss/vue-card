import Axios from './fetch'

//  获取banner数据
export const getBannerList = (params = {}) => {
  return Axios.post('banner/obtainByShelves', params)
}

// 获取全部银行列表
export const getAllBank = (params = []) => {
  return Axios.post('bank/obtainByShelves', params)
}

// 获取全部用途列表
export const getAllUsed = (params = []) => {
  return Axios.post('use/obtainByShelves', params)
}

// 获取信用卡数据
export const getDetailList = (params) => {
  return Axios.post('card/obtainByShelves', params)
}

// 数据统计
export const getDataSta = (id) => {
  // return Axios.post('card/modifyCount', {id: 39})
  return Axios({
    method: 'post',
    url: 'card/modifyCount',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      id
    }
  })
}
