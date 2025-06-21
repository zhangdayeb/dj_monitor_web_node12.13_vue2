import {http} from '@/common/js/request'

export default {
    /**
     * 获取对外下注列表
     * @param data 后台需要的数据
     * **/
    getForeignList(data) {
        return http.post(`/foreign/list`, data)
    },
    
    /**
     * 获取骰宝投注记录列表
     * @param data 查询参数
     **/
    getSicboRecords(data) {
        return http.get(`/foreign/sicbo/records`, data)
    },
    
    /**
     * 获取骰宝总览统计数据
     **/
    getSicboOverview() {
        return http.get(`/foreign/sicbo/overview`)
    },
    
    /**
     * 获取52个投注项统计数据
     **/
    getSicboBetStats() {
        return http.get(`/foreign/sicbo/bet-stats`)
    }
}