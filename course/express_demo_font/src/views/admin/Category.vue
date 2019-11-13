<template>
  <div class="custom-tree-container">
    <el-tree :default-expanded-keys="[1]" :props="defaultProps" :load="loadNode" lazy>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click.stop="showAddDialog(node,data)" v-if="node.level < 2">添加</el-button>
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
        name: "",
        pId: ""
      },
      formUpdate: {},
      id: "",
      currentNodeData: "",
      currentNode: ""
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
        .post("/api/admin/category", { pId: pId })
        .then(({ data: res }) => {
          if (res.status) {
            resolve(res.data);
          }
        });
    },
    // 添加
    showAddDialog(node, data) {
      this.toggle.isAddDialog = true;
      this.formAdd.id = data.id;
      this.formAdd.pId = data.pId;
      // 转存data
      this.currentNodeData = data;
    },
    addConfigHandle() {
      let regArr = [{ type: "", value: this.formAdd.name, des: "类名" }];
      for (let i = 0; i < regArr.length; i++) {
        let flag = regular.regexCheck(regArr[i]);
        if (flag !== true) {
          this.$message.error(flag);
          return;
        }
      }
      this.$axios
        .post("/api/admin/categoryAdd", {
          pId: this.formAdd.id,
          name: this.formAdd.name
        })
        .then(({ data: res }) => {
          if(!res.status) return this.$message.error('添加失败')
          this.toggle.isAddDialog = false;
          // 添加子节点
          let data = this.currentNodeData;
          let newChild = { ...this.formAdd, id: res.data };
          if (!data.children) {
            this.$set(data, "children", []);
          }
          console.log(newChild, "newChild");
          data.children.push(newChild);
        });
    },
    // 编辑
    showUpdateDialog(node, data) {
      this.toggle.isUpdateDialog = true;
      this.formUpdate = { ...data };
      // 转存node节点
      this.currentNode = node;
    },
    updateConfigHandle() {
      this.$axios
        .post("/api/admin/categoryUpdate", {
          id: this.formUpdate.id,
          name: this.formUpdate.name
        })
        .then(({ data: res }) => {
          if(!res.status) return this.$message.error('更新失败');
          // 更新节点
          this.currentNode.data = { ...this.formUpdate };
          this.toggle.isUpdateDialog = false;
        });
    },
    // 删除
    showDeleteDialog(node, data) {
      this.$msgbox({
        type: "warning",
        title: "",
        message: `"此操作将永久删除 ${data.name} , 是否继续?"`
      }).then(() => {
        this.$axios.post('/api/admin/categoryDel',{
          id:data.id
        })
        .then(({data:res})=>{
          if(res.status){
            node.remove();
          }else{
            this.$message.success('删除失败');
          }
          
        })
        console.log(data.id)
      });
    },
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