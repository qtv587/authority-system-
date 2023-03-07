import http from '@/utils/request'

export  function getRoutes() {

}

export async function getRoles(params) {
  return await http.get('/api/role/list',params);
}

export async function addRole(params) {
  return await http.post('/api/role/add',params);
 
}

export async function updateRole(params) {
  return await http.put('/api/role/update',params);
}

export async function deleteRole(id) {
  return await http.delete("/api/role/delete",id)
}

export async function checkRoleById(params) {
  return await http.getRestApi("/api/role/check",params)
}

export async function getAssignPermissionTree(params) {
  return await http.getRestApi("/api/role/getAssignPermissionTree",params)
}

/**
* 分配权限
* @returns
*/
export async function assignSave(params){
  return await http.post("/api/role/saveRoleAssign",params);
  }
  

