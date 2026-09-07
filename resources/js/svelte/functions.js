import { globalState } from "./store.svelte";

export function getDiscountPrice(item) {
    let regularPrice = item?.portion?.prices?.price || 0.0;
    let discountedValue = item.value;
    let discountType = item.type;
    console.log(regularPrice, discountedValue, discountType);
    if(discountType == 'fixed')
        return discountedValue;
    else if(discountType == 'percent') {
        let price = parseFloat(regularPrice) / 100 * (100 - parseFloat(discountedValue));
        return price;
        // return '0.0';
    }
}
