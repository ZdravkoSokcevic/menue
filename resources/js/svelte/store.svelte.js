// resources/js/data.svelte.js

import { persisted } from 'svelte-persisted-store';
import { get } from 'svelte/store'

export const appPreferences = persisted('preferences', {
    cart: [],
    code: '',
    page: '',
    company: {}
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

export const addPageToPersisted = page => {
    appPreferences.update(state => ({
        ...state,
        page: page
    }));
}

export const addLanguagesToPersisted = languages => {
    appPreferences.update(state => ({
        ...state,
        languages
    }))
}

export const addCompanyToPersisted = company => {
    appPreferences.update(state => ({
        ...state,
        company
    }));
}

export const addSelectedLanguageToPersisted = language => {
    appPreferences.update(state => ({
        ...state,
        selectedLanguage: language
    }))
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
    cartDiscountModalSelectedItem: null,
    cartComboModalSelectedItem: null,
    currentOrder: '',
    currentOrderStatus: -1,
    currentPage: '',
    languages: get(appPreferences).languages || [],
    selectedLanguage: get(appPreferences).selectedLanguage || {},
    isLanguageModalOpened: false,
    // for details page type
    type: '',
    company: {},
    setCartModalSelectedItem(item) {
        this.cartModalSelectedItem = item;
    },
    setCartDiscountSelectedItem(item) {
        this.cartDiscountModalSelectedItem = item;
    },
    setCartComboSelectedItem(item) {
        this.cartComboModalSelectedItem = item;
    },
    // This allows you to set the code from anywhere (Blade or Svelte)
    setCode(newCode) {
        this.code = newCode;
        addCodeToPersistedStore(newCode);
    },
    setCompany(company) {
        this.company = company;
        addCompanyToPersisted(company)
    },
    setCurrentOrder(id) {
        this.setCurrentOrder = id;
    },
    setCurrentOrderStatus(status) {
        this.currentOrderStatus = status;
    },
    setCurrentPage(page) {
        // debugger;
        this.currentPage = page;
        addPageToPersisted(page);
    },
    setType(type) {
        this.type = type;
    },
    get currentPage() {
        // this.currentPage = get('persisted').page;
        return get(appPreferences).page
    },
    setLanguages(data) {
        addLanguagesToPersisted(data);
        this.languages = data;
    },
    setSelectedLanguage(language) {
        addSelectedLanguageToPersisted(language);
        this.selectedLanguage = language;
    },
    setIsLanguageModalOpened(value) {
        this.isLanguageModalOpened = value;
    },
    getNameTranslation(item) {
        console.log(item);
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(!code)
            return item.name;
        // console.log(code);
        // console.log(item.translations);
        // console.log(item.translations[code]);
        if(item.translations && item.translations[code] && item.translations[code].name)
            return item.translations[code].name;
        else return item.name;
    },
    getDescriptionTranslation(item) {
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(!code)
            return item.name;
        if(item.translations && item.translations[code] && item.translations[code].description)
            return item.translations[code].description;
        else return item.description;
    },
    getDiscountNameTranslation(item) {
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(!code)
            return item?.menu?.name;

        let menu = item.menu;
        let translations = menu?.translations

        if(menu && translations && translations[code] && translations[code].name)
            return translations[code].name;

        else return item.menu.name;
    },
    getDiscountDescriptionTranslation(item) {
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(!code)
            return item?.menu?.description;

        let menu = item.menu;
        let translations = menu?.translations

        if(menu && translations && translations[code] && translations[code].description)
            return translations[code].description;

        else return item.menu.description;
    },
    getComboNameTranslated(item) {
        let str = '';
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(item.items)
        {
            item.items.map((comboItem, index) => {
                // fetchTranslation if exists
                let itemName = comboItem.menu?.name;
                let itemMenu = comboItem.menu;
                let translations = itemMenu?.translations;
                let itemNameTranslation = (itemMenu && translations && translations[code] && translations[code].name) ? translations[code].name : itemName;

                str += ' ' + itemNameTranslation;
                if(index < item.items.length -1)
                    str += ' +';
            })
        }
        return str;
    },
    getComboItemNameTranslation(item) {
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(!code)
            return item?.menu?.name;

        let menu = item.menu;
        let translations = menu?.translations

        if(menu && translations && translations[code] && translations[code].name)
            return translations[code].name;

        else return item.menu.name;
    },
    getComboDescriptionTranslated(item) {
        let str = '<ul class="list-disc">';
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(item.items)
        {
            item.items.map((comboItem, index) => {
                // fetchTranslation if exists
                let itemName = comboItem.menu?.description;
                let itemMenu = comboItem.menu;
                let translations = itemMenu?.translations;
                let itemNameTranslation = (itemMenu && translations && translations[code] && translations[code].description) ? translations[code].description : itemName;

                str += '<li>' + itemNameTranslation + '</li>';
                if(index < item.items.length -1)
                    str += '';
            })
        }
        str += '</ul>'
        console.log(str);
        return str;
    },
    getComboItemDescriptionTranslation(item) {
        let code = (globalState.selectedLanguage && globalState.selectedLanguage.language) ? globalState.selectedLanguage.language.code : null;
        if(!code)
            return item?.menu?.description;

        let menu = item.menu;
        let translations = menu?.translations

        if(menu && translations && translations[code] && translations[code].description)
            return translations[code].description;

        else return item.menu.description;
    },

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
            i.specialOccasion === newCartItem.specialOccasion &&
            type == 'menu-item'
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
                preferences: newCartItem.preferences,
                type: 'menu-item'
            });
            addWholeItemsToPersistedStore(this.items);
        }
    },
    addDiscount(newDiscountItem) {
        const newItem = newDiscountItem.discountItem;
        const existingItem = this.items.find(i =>
            i.id === newItem.id &&
            i.portionSize === newDiscountItem.portionSize &&
            i.specialOccasion === newDiscountItem.specialOccasion &&
            type == 'discount-item'
        );

        if (existingItem) {
            existingItem.quantity += parseInt(newDiscountItem.quantity);
        } else {
            // Add new item with quantity 1
            this.items.push({ 
                ...newItem, 
                quantity: newDiscountItem.quantity, 
                selectedPortion: newDiscountItem.selectedPortion,
                extras: newDiscountItem.extras,
                preferences: newDiscountItem.preferences,
                type: 'discount-item'
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
    },

    getItemNameAndTranslation(item) {
        let type = item.type;
        if(type == 'menu-item')
            return globalState.getNameTranslation(item);
        else if(type == 'discount-item') {
            return globalState.getDiscountNameTranslation(item)
        }
        else if(type == 'combo-item') {
            return ''
        }
    },

    // Only menu-item and discount-item 
    // are passed here
    getCorrectPicture(item) {
        let type = item.type;
        let pictureStr = (type == 'menu-item') ? item.picture : item.menu.picture;
        if(!pictureStr)
            return '';
        return `/storage/${pictureStr}`;
    },

    getCorrectPrice(item) {

    }
})