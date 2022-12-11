<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="请选择短信服务支持" prop="configName">
        <el-select v-model="selValue" placeholder="请选择" @change="selChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>



    <div class="title">
      阿里云短信配置
    </div>

    <el-form :inline="true" label-width="68px">
      <el-table :data="tableData" border>
        <el-table-column label="参数说明">
          <template slot-scope="scope">
            <span>{{ scope.row.host }}</span>
          </template>
        </el-table-column>


        <el-table-column label="参数值">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.key" placeholder="请输入内容"></el-input>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="变量名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>


        <el-table-column label="参数说明">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>


    <div class="title">
      MOB配置
    </div>

    <el-form :inline="true" label-width="68px">
      <el-table :data="tableData2" border>
        <el-table-column label="参数说明">
          <template slot-scope="scope">
            <span>{{ scope.row.host }}</span>
          </template>
        </el-table-column>


        <el-table-column label="参数值">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.key" placeholder="请输入内容"></el-input>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="变量名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>


        <el-table-column label="参数说明">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>



    <div class=" k_mtp">
      <el-button type="primary">确定提交</el-button>
    </div>



  </div>



</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '1',
          label: '阿里云短信'
        }, {
          value: '2',
          label: 'mob'
        }],
        selValue: '',


        tableData: [{
            host: 'accessKeyId',
            key: '',
            name: 'accessKeyId',
            type: 'string'
          },
          {
            host: 'accessKeySecret',
            key: '',
            name: 'accessKeySecret',
            type: 'string'
          }, {
            host: '国际短信短信签名',
            key: '',
            name: 'mdEnSignName',
            type: 'string'
          }, {
            host: '国内短信短信签名',
            key: '',
            name: 'mdSignName',
            type: 'string'
          }, {
            host: '中文模板code：',
            key: '',
            name: 'aliSMSChTemCode',
            type: 'string'
          }
        ],
        tableData2: [{
            host: 'accessKeyId',
            key: '',
            name: 'accessKeyId',
            type: 'string'
          },
          {
            host: 'accessKeySecret',
            key: '',
            name: 'accessKeySecret',
            type: 'string'
          }, {
            host: '国际短信短信签名',
            key: '',
            name: 'mdEnSignName',
            type: 'string'
          }, {
            host: '国内短信短信签名',
            key: '',
            name: 'mdSignName',
            type: 'string'
          }, {
            host: '中文模板code：',
            key: '',
            name: 'aliSMSChTemCode',
            type: 'string'
          }
        ],
        value: 1
      }
    },
    methods: {
      selChange() {
        console.log(this.selValue)
      },

      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      ji() {
        console.log(this.value)
      }
    }
  }
</script>

<style scoped="scoped">
  .title {
    text-align: center;
    font-size: 18px;
    padding: 14px 0;
    width: 100%;
    color: #1890FF;

  }
</style>
