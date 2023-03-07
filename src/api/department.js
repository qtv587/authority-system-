import http from "@/utils/request";

/**
 * 查询部门列表
 */
export default {
    async getDepartmentList(param){
        return await http.get("/api/department/list",param);
    },
    async getParentDepartment(){
        return await http.get("/api/department/parent/list");
    },
    async addDepartment(param){
        return await http.post("/api/department/add",param);
    },
    async delete(param){
        return await http.delete("/api/department/delete",param);
    },
    async update(param){
        return await http.put("/api/department/update",param);
    },
    async checkDepartment(param){
        return await http.getRestApi("/api/department/check",param);
    }
    
};


