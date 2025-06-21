<template>
    <div class="three">
        <header class="three-header">
            三公
        </header>
        <section>
            <el-table border :data="betList" :default-sort = "{prop: 'date', order: 'descending'}" >
                <el-table-column prop="user_name" label="用户名" sortable align="center"></el-table-column>
                <el-table-column prop="user_id" label="用户ID" sortable align="center"></el-table-column>
                <el-table-column prop="pu_number" label="铺号" sortable align="center"></el-table-column>
                <el-table-column prop="xue_number" label="靴号" sortable align="center"></el-table-column>
                <el-table-column prop="table_name" label="台桌" sortable align="center"></el-table-column>
                <el-table-column label="超三公闲1(下注-押金)" align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_46}}</div>
                        <div>{{scope.row.sum_deposit_amt_46}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="超三公闲2" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_47}}</div>
                        <div>{{scope.row.sum_deposit_amt_47}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="超三公闲3" sortable align="center" >
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_48}}</div>
                        <div>{{scope.row.sum_deposit_amt_48}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="翻倍闲1" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_40}}</div>
                        <div>{{scope.row.sum_deposit_amt_40}}</div>
                    </template>
                </el-table-column>
                <el-table-column  label="翻倍闲2" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_42}}</div>
                        <div>{{scope.row.sum_deposit_amt_42}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="翻倍闲3" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_44}}</div>
                        <div>{{scope.row.sum_deposit_amt_44}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="平倍闲1" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_41}}</div>
                        <div>{{scope.row.sum_deposit_amt_41}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="平倍闲2" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_43}}</div>
                        <div>{{scope.row.sum_deposit_amt_43}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="平倍闲3" sortable align="center">
                    <template #default="scope">
                        <div>{{scope.row.sum_bet_amt_45}}</div>
                        <div>{{scope.row.sum_deposit_amt_45}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="总计" sortable align="center"></el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script src="./three.js" ></script>
<style scoped src="./three.less" lang='less'></style>
