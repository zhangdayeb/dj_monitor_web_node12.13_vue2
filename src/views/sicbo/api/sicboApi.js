/**
 * 骰宝监控API接口 - 简化版
 */

import axios from 'axios'
import config from '@/common/js/config.js'

// 创建axios实例
const request = axios.create({
  baseURL: config.SOURCE_URL,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const { data } = response
    if (data.code === 200 || data.status === 'success') {
      return data.data || data
    } else {
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(new Error('网络连接错误'))
  }
)

/**
 * 获取骰宝投注记录列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 投注记录数据
 */
export function getSicboRecords(params = {}) {
  return request({
    url: '/api/sicbo/records',
    method: 'get',
    params: {
      page: 1,
      pageSize: 50,
      ...params
    }
  })
}

/**
 * 获取骰宝总览统计数据
 * @returns {Promise} 总览统计数据
 */
export function getSicboOverview() {
  return request({
    url: '/api/sicbo/overview',
    method: 'get'
  })
}

/**
 * 获取52个投注项统计数据
 * @returns {Promise} 投注项统计数据
 */
export function getSicboBetStats() {
  return request({
    url: '/api/sicbo/bet-stats',
    method: 'get'
  })
}