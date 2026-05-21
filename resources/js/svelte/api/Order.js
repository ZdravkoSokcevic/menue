import Api from "../api";

class Order extends Api
{
    static async create(data)
    {
        debugger;
        // try {
            
            const res = await this.post("order/create", data, {});
            if(res && res.success) {
                return {success: true, data: res.data};
            }else return {success: false};
        // }catch(err) {
        //     return {success: false};
        // }
    }


}

export default Order;