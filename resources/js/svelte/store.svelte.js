// resources/js/data.svelte.js

import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store'

export const appPreferences = persisted('preferences', {
    cart: [],
    code: ''
})
export const addWholeItemsToPersistedStore  = cartItems => {
    
    appPreferences.update(state => ({
        ...state,
        cart: cartItems 
    }));
}

export const removeAllItemsFromPersistedStore = () => {
    appPreferences.update(state => ({
        cart: []
    }));
}

export const addCodeToPersistedStore = code => {
    appPreferences.update(state => ({
        ...state,
        code: code
    }));
}
// import { writable } from 'svelte/store';
// import { browser } from '$app/environment';
// const cartItems = browser ? localStorage.getItem('cart') || [] : [];
// const myStore = writable(cartItems);
// if(browser) {
//     myStore.subscribe(value => {
//         localStorage.setItem('cart', value);
//     })
// }

export const globalState = $state({
    code: get(appPreferences).code || '',
    items: [],
    cartModalSelectedItem: null,
    currentOrder: '',
    currentOrderStatus: -1,
    setCartModalSelectedItem(item) {
        this.cartModalSelectedItem = item;
    },
    // This allows you to set the code from anywhere (Blade or Svelte)
    setCode(newCode) {
        this.code = newCode;
        addCodeToPersistedStore(newCode);
    },
    setCurrentOrder(id) {
        this.setCurrentOrder = id;
    },
    setCurrentOrderStatus(status) {
        this.currentOrderStatus = status;
    }
    // add data to cart:
});

export const cart = $state({
    items: get(appPreferences).cart || [],
    add(newCartItem) {
        const newItem = newCartItem.item;
        console.log('#### ADD CART ITEM ####');
        console.log(newItem);
        console.log('#### /ADD CART ITEM #####')
        console.log('### NEW CART ITEM ###')
        console.log(newCartItem);
        console.log('### /NEW CART ITEM ###');
        // Check if item already exists in cart
        const existingItem = this.items.find(i =>
            i.id === newItem.id &&
            i.portionSize === newCartItem.portionSize &&
            i.specialOccasion === newCartItem.specialOccasion
        );
        
        if (existingItem) {
            existingItem.quantity += parseInt(newCartItem.quantity);
        } else {
            // Add new item with quantity 1
            this.items.push({ 
                ...newItem, 
                quantity: newCartItem.quantity, 
                selectedPortion: newCartItem.selectedPortion,
                extras: newCartItem.extras,
                preferences: newCartItem.preferences
            });
            addWholeItemsToPersistedStore(this.items);
        }
    },

    removeAll() {
        this.items = [];
        removeAllItemsFromPersistedStore([]);
    },

    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
        addWholeItemsToPersistedStore(this.items);
    },

    get total() {
        // Here needs to observe extras, and prices
        let total = 0;
        this.items.map((item) => {
            console.log({ ...item });
            let totalBase = 0;
            let totalExtra = 0;
            totalBase = (
                item && 
                item.selectedPortion && 
                item.selectedPortion.prices &&
                item.selectedPortion.prices.price
            ) ? item.selectedPortion.prices.price : 0;
            total += (totalBase * item.quantity);
            console.log({
                totalBase: totalBase,
                quantity: item.quantity,
                sum: totalBase * item.quantity})
            item.extras && item.extras.map((extra) => {
                if(extra && extra.prices && extra.prices[0] && extra.prices[0].price)
                    totalExtra += extra.prices[0].price;
            })
            total += (totalExtra * item.quantity);
        })
        console.log(total);
        return total;
    },

    totalSingle(searchedItem) {
        let total = 0;
        this.items.map((item) => {
                if(searchedItem.id == item.id) {
                let totalBase = 0;
                let totalExtra = 0;
                totalBase = (
                    item && 
                    item.selectedPortion && 
                    item.selectedPortion.prices && 
                    item.selectedPortion.prices.price
                ) ? item.selectedPortion.prices.price : 0;
                total += (totalBase * item.quantity);
                console.log({
                    totalBase: totalBase,
                    quantity: item.quantity,
                    sum: totalBase * item.quantity})
                item.extras && item.extras.map((extra) => {
                    if(extra && extra.prices && extra.prices[0] && extra.prices[0].price)
                        totalExtra += extra.prices[0].price;
                })
                total += (totalExtra * item.quantity);   
            }
        })

        return total;
    },

    increase(id) {
        this.items.map((item, index) => {
            if(item.id == id) {
                cart.items[index] = {
                    ...cart.items[index],
                    quantity: cart.items[index].quantity + 1
                }
                cart.items = cart.items;
            }
        })
    },

    decrease(id) {
        this.items.map((item, index) => {
            if(item.id == id && cart.items[index].quantity > 0) {
                cart.items[index] = {
                    ...cart.items[index],
                    quantity: cart.items[index].quantity - 1
                }
                cart.items = cart.items;
            }
        })
    },

    get itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    get getItems() {
        return get(appPreferences).cart;
    }
})