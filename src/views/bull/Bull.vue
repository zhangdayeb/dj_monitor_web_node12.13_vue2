<template>
    <div class="bull">
        <header class="bull-header">
            牛牛
        </header>
        <section>
            <el-table border :data="betList" :default-sort = "{prop: 'date', order: 'descending'}" >
                <el-table-column prop="user_name" label="用户名" sortable align="center"></el-table-column>
                <el-table-column prop="user_id" label="用户ID" sortable align="center"></el-table-column>
                <el-table-column prop="pu_number" label="铺号" sortable align="center"></el-table-column>
                <el-table-column prop="xue_number" label="靴号" sortable align="center"></el-table-column>
                <el-table-column prop="table_name" label="台桌" sortable align="center"></el-table-column>
                <el-table-column label="超牛闲1(下注-押金)" align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_36}}</div>
                        <div>{{scope.row.sum_deposit_amt_36}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="超牛闲2" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_37}}</div>
                        <div>{{scope.row.sum_deposit_amt_37}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="超牛闲3" sortable align="center" >
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_38}}</div>
                        <div>{{scope.row.sum_deposit_amt_38}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="翻倍闲1" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_30}}</div>
                        <div>{{scope.row.sum_deposit_amt_30}}</div>
                    </template>
                </el-table-column>
                <el-table-column  label="翻倍闲2" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_32}}</div>
                        <div>{{scope.row.sum_deposit_amt_32}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="翻倍闲3" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_34}}</div>
                        <div>{{scope.row.sum_deposit_amt_34}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="平倍闲1" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_31}}</div>
                        <div>{{scope.row.sum_deposit_amt_31}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="平倍闲2" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_33}}</div>
                        <div>{{scope.row.sum_deposit_amt_33}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="平倍闲3" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_35}}</div>
                        <div>{{scope.row.sum_deposit_amt_35}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="总计" sortable align="center"></el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script src="./bull.js" ></script>
<style scoped src="./bull.less" lang='less'></style>
