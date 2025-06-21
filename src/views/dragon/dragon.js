import apiService from '@/service/apiService'


export default {
    name: 'dragon',
    components: {

    },
    data() {
        return {
            
            //投注列表
            betList: []
        }
    },
    created() {
        this.getForeignList()
    },

    methods:{
        /**
         * 获取对外列表 
        */
        getForeignList() {
            apiService.getForeignList({game_type: '2'}).then(res => {
                this.betList = res
            }).catch(err => {
                console.log("err:",err)
            })
        },
    },
}