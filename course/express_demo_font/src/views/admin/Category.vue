<template>
  <div class="custom-tree-container">
    <div class="block">
      <el-tree
        :data="data"
        :expand-on-click-node="false"
        :props="defaultProps"
        :load="loadNode"
        lazy
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="openEditeModel(node,data)">编辑</el-button>
            <el-button type="text" size="mini" @click="openAddModel(node,data)">添加</el-button>
            <el-button type="text" size="mini" @click="openRemoveModel(node,data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog title="编辑节点" :visible.sync="editeModelVisible">
      <el-form :model="editForm" :label-position="'left'" label-width="80px">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            action="/api/upload/common/"
            :show-file-list="false"
            :on-success="editUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="editForm.img" :src="editForm.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editeModelVisible = false">取 消</el-button>
        <el-button type="primary" @click="confimEditHandle">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加节点" :visible.sync="addModelVisible">
      <el-form :model="addForm" :label-position="'left'" label-width="80px">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            action="/api/upload/common/"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="addForm.img" :src="addForm.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addModelVisible = false">取 消</el-button>
        <el-button type="primary" @click="confimAddHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          name: ""
        }
      ],
      defaultProps: {
        label: "name"
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.token}`
      },
      editeModelVisible: false,
      addModelVisible: false,
      formLabelWidth: "120px",
      addForm: {
        name: "",
        pId: "",
        img: ""
      },
      editForm: {
        name: "",
        id: "",
        pId: "",
        img: ""
      },
      currentNodeData: ""
    };
  },
  methods: {
    loadNode(node, resolve) {
    //   let id = node.data.id || 0;
    //   this.$http
    //     .get("/api/category/sub/", {
    //       params: {
    //         pId: id
    //       }
    //     })
    //     .then(res => {
    //       resolve(res.data);
    //     });
    }
  },
  created(){
      this.loadNode()
  }
};
</script>

<style lang="stylus" scoped></style>