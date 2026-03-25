// resources/js/data.svelte.js

import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store'

export const appPreferences = persisted('preferences', {
    cart: []
})
export const addWholeItemsToPersistedStore  = cartItems => {
    
    appPreferences.set({cart: cartItems });
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
    code: '',
    items: [],
    // This allows you to set the code from anywhere (Blade or Svelte)
    setCode(newCode) {
        this.code = newCode;
    },
    // add data to cart:
});

export const cart = $state({
    items: get(appPreferences).cart,
    add(newItem) {
        console.log('#### ADD CART ITEM ####');
        console.log(newItem);
        console.log('#### /ADD CART ITEM #####')
        // Check if item already exists in cart
        const existingItem = this.items.find(i =>
            i.id === newItem.id &&
            i.portionSize === newItem.portionSize &&
            i.specialOccasion === newItem.specialOccasion
        );
        
        if (existingItem) {
            existingItem.quantity += cart.quantity;
        } else {
            // Add new item with quantity 1
            this.items.push({ ...newItem, quantity: cart.quantity });
            addWholeItemsToPersistedStore(this.items);
        }
    },

    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
        addWholeItemsToPersistedStore(this.items);
    },

    get total() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    get itemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    get getItems() {
        return get(appPreferences).cart;
    }
})