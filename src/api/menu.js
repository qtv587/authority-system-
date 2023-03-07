import http from "@/utils/request";

export default {
  async getMenuList(params) {
    return await http.get("/api/permission/list", params);
  },
  /**
   * 获取上级菜单
   * @returns
   */
  async getParentMenuList(params) {
    return await http.get("/api/permission/parent/list", params);
  },
  async addMenu(params) {
    return await http.post("/api/permission/add", params);
  },
  /**
   * 修改菜单
   * @returns
   */
  async updateMenu(params) {
    return await http.put("/api/permission/update", params);
  }
  /**
   * 检查菜单下是否存在子菜单
   */,
  async checkPermission(param) {
    return await http.getRestApi("/api/permission/check", param);
  },
  /**
   * 删除菜单
   * @returns
   */
  async deleteById(params) {
    return await http.delete("/api/permission/delete", params);
  },
};
