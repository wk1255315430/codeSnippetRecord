<template>
  <div class="custom-tree-container">
    <el-tree :default-expanded-keys="[1]" :props="defaultProps" :load="loadNode" lazy>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click.stop="showAddDialog(node,data)">添加</el-button>
          <el-button type="text" size="mini" @click.stop="showUpdateDialog(node,data)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="showDeleteDialog(node,data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <!-- 添加dialog -->
    <el-dialog title="新增" :visible.sync="toggle.isAddDialog" width="30%">
      <el-form :model="formAdd">
        <el-form-item label="分类名称" label-width="20%">
          <el-input v-model="formAdd.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggle.isAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addConfigHandle">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 编辑dialog -->
    <el-dialog title="编辑" :visible.sync="toggle.isUpdateDialog" width="30%">
      <el-form :model="formUpdate">
        <el-form-item label="分类名称" label-width="20%">
          <el-input v-model="formUpdate.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggle.isUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateConfigHandle">更 新</el-button>
      </span>
    </el-dialog>
    <!-- 删除dialog -->
    <el-dialog title="删除" :visible.sync="toggle.isDeleteDialog" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggle.isDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfigHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import regular from "@/utils/regular";
export default {
  data() {
    return {
      defaultProps: {
        label: "name"
      },
      toggle: {
        isAddDialog: false,
        isUpdateDialog: false,
        isDeleteDialog: false
      },
      formAdd: {
        name: ""
      },
      formUpdate: {
        name: ""
      },
      pId: "",
      id: ""
    };
  },
  methods: {
    loadNode(node, resolve) {
      let pId;
      if (node.id === 0) {
        pId = 0;
      } else {
        pId = node.data.id;
      }
      this.$axios
        .post("/admin/category", { pId: pId })
        .then(({ data: res }) => {
          if (res.status) {
            resolve(res.data);
          }
        });
    },
    // 添加
    showAddDialog(node, data) {
      this.toggle.isAddDialog = true;
      this.pId = data.id;
    },
    addConfigHandle() {
      this.toggle.isAddDialog = false;
      let regArr = [{ type: "", value: this.formAdd.name, des: "类名" }];
      for (let i = 0; i < regArr.length; i++) {
        let flag = regular.regexCheck(regArr[i]);
        if (flag !== true) {
          this.$message.error(flag);
          return;
        }
      }
      this.$axios
        .post("/admin/categoryAdd", {
          name: this.formAdd.name,
          pId: this.pId
        })
        .then(({ data: res }) => {
          console.log(res);
        });
    },
    // 编辑
    showUpdateDialog(node, data) {
      this.toggle.isUpdateDialog = true;
    },
    updateConfigHandle() {
      this.toggle.isUpdateDialog = false;
    },
    // 删除
    showDeleteDialog(node, data) {
      this.toggle.isDeleteDialog = true;
    },
    deleteConfigHandle() {
      this.toggle.isDeleteDialog = false;
    }
  },
  created() {
    this.loadNode();
  }
};
</script>

<style lang="stylus" scoped>
.custom-tree-node
  flex: 1
  display: flex
  align-items: center
  justify-content: space-between
  font-size: 14px
  padding-right: 8px
</style>