import {http} from '@/common/js/request'

export default {
    /**
     * 获取对外下注列表
     * @param data 后台需要的数据
     * **/
    getForeignList(data) {
        return http.post(`/foreign/list`, data)
    },
    
    // ==================== 骰宝相关接口 ====================
    
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
    },
    
    // ==================== 百家乐相关接口 ====================
    
    /**
     * 获取百家乐台桌列表
     **/
    getBaccaratTables() {
        return http.get(`/foreign/baccarat/tables`)
    },
    
    /**
     * 获取百家乐投注记录列表
     * @param params 查询参数 (必须包含table_id)
     **/
    getBaccaratRecords(params = {}) {
        return http.get(`/foreign/baccarat/records`, {
            page: 1,
            pageSize: 50,
            ...params
        })
    },
    
    /**
     * 获取百家乐总览统计数据
     * @param table_id 台桌ID
     **/
    getBaccaratOverview(table_id) {
        return http.get(`/foreign/baccarat/overview`, { table_id })
    },
    
    /**
     * 获取10个投注项统计数据
     * @param table_id 台桌ID
     **/
    getBaccaratBetStats(table_id) {
        return http.get(`/foreign/baccarat/bet-stats`, { table_id })
    }

    // 在 apiService.js 中添加
// ==================== 龙虎相关接口 ====================

/**
 * 获取龙虎台桌列表
 **/
getDragonTables() {
    return http.get(`/foreign/lh/tables`)
},

/**
 * 获取龙虎投注记录列表
 * @param params 查询参数 (必须包含table_id)
 **/
getDragonRecords(params = {}) {
    return http.get(`/foreign/lh/records`, {
        page: 1,
        pageSize: 50,
        ...params
    })
},

/**
 * 获取龙虎总览统计数据
 * @param table_id 台桌ID
 **/
getDragonOverview(table_id) {
    return http.get(`/foreign/lh/overview`, { table_id })
},

/**
 * 获取3个投注项统计数据
 * @param table_id 台桌ID
 **/
getDragonBetStats(table_id) {
    return http.get(`/foreign/lh/bet-stats`, { table_id })
}



}