import http from "@/utils/request";

/**
 * 用户登录方法
 * @param {*} data
 * @returns
 */
export async function login(data) {
  return await http.login("/api/user/login", data);
}

export async function register(data) {
  return await http.login("/api/user/register", data);
}
/**
 * 获取用户信息
 * @param {*} token
 * @returns
 */
export async function getInfo(token) {
  return await http.get("/api/sysUser/getInfo");
}
/**
 * 退出登录
 * @returns
 */
export async function logout() {
  return await http.post("/api/sysUser/logout");
}

/**
 * 获取用户菜单信息
 */
export async function getMenuList() {
  return await http.get("/api/sysUser/getMenuList");
}

export default {
  /**
   * 查询用户列表
   * @param params
   * @returns
   */
  async getUserList(params) {
    return await http.get("/api/user/list", params);
  },
  async addUser(params) {
    return await http.post("/api/user/add", params);
  },

  /**
   * 编辑用户
   * @param params
   * @returns
   */
  async updateUser(params) {
    return await http.put("/api/user/update", params);
  },
  async deleteUser(params) {
    return await http.delete("/api/user/delete", params);
  },
  async getAssignRoleList(params) {
    return await http.get("/api/user/getRoleListForAssign", params);
  },
  async getRoleIdByUserId(params) {
    return await http.getRestApi("/api/user/getRoleByUserId", params);
  },
  /**
   * 分配角色
   */
  async assignRoleSave(params) {
    return await http.post("/api/user/saveUserRole", params);
  },


  
};
