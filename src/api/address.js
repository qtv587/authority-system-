import http from "@/utils/request";

/**
 * 查询部门列表
 */
export default {
    async getAddressTree(){
        return await http.get("/api/address/addressTree");
    }
  
    
};
