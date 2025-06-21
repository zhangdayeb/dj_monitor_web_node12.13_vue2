<template>
    <div class="dragon">
        <header class="dragon-header">
            龙虎
        </header>
        <section>
            <!-- <div class="dragon-condtion">
                <el-row :gutter="10">
                    <el-col :span="3">
                        <el-select clearable placeholder="投注类型">
                            <el-option label="01" value="11"></el-option>
                            <el-option label="02" value="12"></el-option>
                            <el-option label="02" value="13"></el-option>
                            <el-option label="03" value="14"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-input placeholder="铺号"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input placeholder="靴号"></el-input>
                    </el-col>
                </el-row>
            </div> -->
            <el-table border :data="betList" :default-sort = "{prop: 'date', order: 'descending'}" >
                <el-table-column prop="user_name" label="用户名" sortable align="center"></el-table-column>
                <el-table-column prop="user_id" label="用户ID" sortable align="center"></el-table-column>
                <el-table-column prop="pu_number" label="铺号" sortable align="center"></el-table-column>
                <el-table-column prop="xue_number" label="靴号" sortable align="center"></el-table-column>
                <el-table-column prop="table_name" label="台桌" sortable align="center"></el-table-column>
                <el-table-column prop="sum_bet_amt_20" label="龙" sortable align="center"></el-table-column>
                <el-table-column prop="sum_bet_amt_21" label="虎" sortable align="center"></el-table-column>
                <el-table-column prop="sum_bet_amt_22" label="和" sortable align="center" ></el-table-column>
                <el-table-column prop="count" label="总计" sortable align="center"></el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script src="./dragon.js" ></script>
<style scoped src="./dragon.less" lang='less'></style>
