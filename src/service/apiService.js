import {http} from '@/common/js/request'


export default {
    /**
     * 获取对外下注列表
     * @param data 后台需要的数据
     * **/
     getForeignList(data) {
        return http.post(`/foreign/list`, data)
    },
    
    
}