import bjlService from '@/service/bjlService'


export default {
    name: 'bull',
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
            bjlService.getForeignList({game_type: '6'}).then(res => {
                this.betList = res
            }).catch(err => {
                console.log("err:",err)
            })
        },

        /**
         * 设置下注数据 
        */
        handleBetListData() {
            if(this.betList.length < 1) {
                return
            }
            this.betList.forEach(el => {
            });
        },
    },
}