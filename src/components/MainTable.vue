<template>
  <div>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      header-cell-class-name="headcell"
      cell-class-name="cellclass"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" width="100"> </el-table-column>
      <el-table-column prop="longitude" label="经度" width="200"> </el-table-column>
      <el-table-column prop="latitude" label="纬度" width="200"> </el-table-column>
      <el-table-column prop="radius" label="半径" width="200"> </el-table-column>
      <el-table-column prop="action" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="ModifyLine(scope.row.id)">
            <i class="el-icon-edit">&nbsp;修改</i>
          </el-button>
          &nbsp;
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.row.id)"
          >
            <i class="el-icon-delete">&nbsp;删除</i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="删除坐标"
      :visible.sync="dialogDelsigVisible"
      width="400px"
      :destroy-on-close="true"
    >
      是否要删除这个坐标？此操作无法撤销！
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteconfirm(index)"
          >删 除</el-button
        >
        <el-button @click="dialogDelsigVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MainTable",
  props: ["tableData", "currentPage", "pageSize", "fc"],
  //该组件被PlacePart使用，目的是显示所有的坐标
  data() {
    return {
      //多选框选中的内容id
      multipleSelection: [],
      dialogDelsigVisible: false,
      //正在执行操作的行的行标
      index: 0,
    };
  },
  methods: {
    //点击删除按钮后弹出对话框
    deleteRow(idx) {
      this.dialogDelsigVisible = true;
      console.log("正在删除",idx);
      this.index = idx;
    },
    //确认删除，向父组件提示删除
    deleteconfirm(idx) {
      console.log("确认删除",idx);
      this.$emit("eraseSingle",idx);
      this.dialogDelsigVisible = false;
    },
    //处理多选状态改变的函数
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++)
        this.multipleSelection[i] = val[i].id;
      this.$emit("Trans", this.multipleSelection, 1, -1);
    },
    //点击修改，向父组件提示
    ModifyLine(idx) {
      console.log("正在修改",idx);
      this.$message.warning("功能暂未开放");
    },
  },
};
</script>

<style lang="scss">
.headcell {
  text-align: center !important;
  color: #000;
}
.cellclass {
  text-align: center !important;
}
</style>