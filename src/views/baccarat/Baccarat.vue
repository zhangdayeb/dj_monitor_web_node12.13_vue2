<template>
    <div class="baccarat">
        <header class="baccarat-header">
            百家乐
        </header>
        <section class="baccarat-content">
            <el-table border :data="betList" :default-sort = "{prop: 'date', order: 'descending'}" :header-cell-style="{fontSize:'20px'}"  :cell-style="cellStyle">
                <el-table-column prop="user_name" label="用户名" sortable align="center" ></el-table-column>
                <el-table-column prop="user_id" label="用户ID" sortable align="center"></el-table-column>
                <el-table-column prop="pu_number" label="铺号" sortable align="center"></el-table-column>
                <el-table-column prop="xue_number" label="靴号" sortable align="center"></el-table-column>
                <el-table-column prop="table_name" label="台桌" sortable align="center" label-class-name="baccarat-xian"></el-table-column>
                <el-table-column prop="sum_bet_amt_6" label="闲" sortable align="center" label-class-name="baccarat-xian"></el-table-column>
                <el-table-column prop="sum_bet_amt_8" label="庄" sortable align="center" label-class-name="baccarat-zhuang"></el-table-column>
                <el-table-column prop="sum_bet_amt_4" label="庄对" sortable align="center" label-class-name="baccarat-zhuang"></el-table-column>
                <el-table-column prop="sum_bet_amt_2" label="闲对" sortable align="center" label-class-name="baccarat-xian"></el-table-column>
                <el-table-column prop="sum_bet_amt_7" label="和" sortable align="center"></el-table-column>
                <el-table-column prop="sum_bet_amt_3" label="幸运6" sortable align="center"></el-table-column>
                <el-table-column prop="sum_bet_amt_9" label="龙7" sortable align="center"></el-table-column>
                <el-table-column prop="sum_bet_amt_10" label="熊8" sortable align="center"></el-table-column>
                <el-table-column prop="count" label="总计" sortable align="center"></el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script src="./baccarat.js" ></script>
<style scoped src="./baccarat.less" lang='less'></style>
