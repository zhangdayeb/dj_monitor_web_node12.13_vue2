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
     * 获取骰宝台桌列表
     **/
    getSicboTables() {
        return http.get(`/foreign/sicbo/tables`)
    },
    
    /**
     * 获取骰宝投注记录列表
     * @param params 查询参数 (必须包含table_id)
     **/
    getSicboRecords(params = {}) {
        return http.get(`/foreign/sicbo/records`, {
            page: 1,
            pageSize: 50,
            ...params
        })
    },
    
    /**
     * 获取骰宝总览统计数据
     * @param table_id 台桌ID
     **/
    getSicboOverview(table_id) {
        return http.get(`/foreign/sicbo/overview`, { table_id })
    },
    
    /**
     * 获取52个投注项统计数据
     * @param table_id 台桌ID
     **/
    getSicboBetStats(table_id) {
        return http.get(`/foreign/sicbo/bet-stats`, { table_id })
    }
}