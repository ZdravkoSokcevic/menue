import Api from "../api";

class Order extends Api
{
    static async create(data)
    {
        // debugger;
        try {
            
            const res = await this.post("orders/create", data, {});
            if(res && res.data && res.data.success) {
                return {success: true, data: res.data.data};
            }else return {success: false};
        }catch(err) {
            console.error(err);
            return {success: false};
        }
    }


}

export default Order;