import apiService from '@/service/apiService'


export default {
    name: 'baccarat',
    components: {

    },
    data() {
        return {
            
            //投注列表
            betList: [],
            timer: null
        }
    },
    created() {
        this.getForeignList()
    },
    
    beforeDestroy() { // 修正生命周期钩子名称
        clearTimeout(this.timer)
    },
    methods:{
        handleAvatarSuccess(res) {
            console.log("res:",res)
        },
        beforeAvatarUpload(res){
            console.log("res222:",res)
        },
        cellStyle({ row, column, rowIndex, columnIndex }) {
            let fonSize = "26px"
            if(column.property == 'sum_bet_amt_6' || column.property == 'sum_bet_amt_2' || column.property == 'table_name') {
                return {
                    // backgroundColor: '#4d88cf',
                    fontSize: fonSize,
                    color: '#4d88cf'
                }
            }
            
            if(column.property == 'sum_bet_amt_8' || column.property == 'sum_bet_amt_4') {
                return {
                    // backgroundColor: 'red',
                    fontSize: fonSize,
                    color: 'red'
                }
            }
            return {
                fontSize: fonSize
            }
        },
        /**
         * 获取对外列表 
        */
        getForeignList() {
            apiService.getForeignList({game_type: '3'}).then(res => { // 百家乐的游戏类型是3
                this.betList = res
                if(this.betList.length > 0) {
                    this.betList.forEach(el => {
                        el.table_name = el.table_name.replace('百家乐VIP','0')
                        if(el.table_name.length > 2) {
                            el.table_name.slice(1)
                        }
                    })
                }
                console.log(this.betList)
                if(this.timer) {
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    this.getForeignList()
                } , 3000)
            }).catch(err => {
                console.log("err:",err)
            })
        },
    },
}