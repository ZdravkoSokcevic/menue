import { mount, unmount } from 'svelte';
import Navbar from './components/Navbar.svelte'
import MenuItems from './components/MenuItems.svelte';
import DiscountItems from './components/DiscountItems.svelte';
import ComboItems from './components/ComboItems.svelte'
import MenuDetails from './components/MenuDetails.svelte'
import CartPage from './components/CartPage.svelte'
import Order from './components/Order.svelte'
import LanguageChooser from './components/LanguageChooser.svelte'
import CartButton from './components/parts/CartButton.svelte';
import { cart, globalState } from './store.svelte.js'
import Api from './api.js';


let app;

const loadLanguages = async() => {
  let languages = await Api.getWeb('languages');
  if(languages && languages.data) {
    globalState.setLanguages(languages.data);
  }
}

function initSvelteApp() {
  if(app) {
    unmount(app);
  }

  if(window.LaravelData) {
    globalState.setCode(window.LaravelData.code);
    globalState.setCurrentPage(window.LaravelData.page);
    globalState.setCompany(window.LaravelData.company);
    if(window.LaravelData.type)
      globalState.setType(window.LaravelData.type);
  }

  // LOAD LANGUAGES
  loadLanguages();

  const navEl = document.getElementById('app-navbar');
  if (navEl && !navEl.dataset.mounted) {
    navEl.dataset.mounted = "true";
    mount(Navbar, { target: navEl });
  }

  const menuTarget = document.getElementById('menuitems-component');
  if (menuTarget && !menuTarget.dataset.mounted) {
    // 2. Read and parse the JSON data from the data-items attribute
    const dataElement = document.getElementById('menu-data');
    const menuItems = JSON.parse(dataElement.textContent);
    
    if(dataElement) {
      menuTarget.dataset.mounted = "true";
      // 3. Mount the Svelte 5 component with the data as props
      mount(MenuItems, {
        target: menuTarget,
        props: { menuItems }
      });
    }
  }

  // DISCOUNTS
  const menuDiscountsTarget = document.getElementById('menudiscounts-component');
  const discountDataElement = document.getElementById('menu-discounts');
  if(menuDiscountsTarget && discountDataElement && !menuDiscountsTarget.dataset.mounted) {
    
    const discountItems = JSON.parse(discountDataElement.textContent || '[]');

    menuDiscountsTarget.dataset.mounted = "true";
    mount(DiscountItems, {
      target: menuDiscountsTarget,
      props: { discountItems }
    });
  }

  // COMBOS
  const menuCombosTarget = document.getElementById('menucombos-component');
  const combosDataElement = document.getElementById('menu-combos');
  if(menuCombosTarget && combosDataElement && !menuCombosTarget.dataset.mounted) {
    const comboItems = JSON.parse(combosDataElement.textContent || '[]');
    menuCombosTarget.dataset.mounted = "true";
    mount(ComboItems, {
      target: menuCombosTarget,
      props: { comboItems }
    });
  }

  const menuDetailsTarget = document.getElementById('menu-details');
  if(menuDetailsTarget && !menuDetailsTarget.dataset.mounted) {
    const dataElement = document.getElementById('menuitem-data');
    const item = JSON.parse(dataElement.textContent);

    if(dataElement) {
      menuDetailsTarget.dataset.mounted = "true";
      mount(MenuDetails, {
        target: menuDetailsTarget,
        props: { item }
      });
    }
  }

  const cartDetailsTarget = document.getElementById('cart-details');
  if(cartDetailsTarget && !cartDetailsTarget.dataset.mounted) {
    mount(CartPage, {
      target: cartDetailsTarget,
      // TODO: add company info
      props: []
    });
  }

  const orderTarget = document.getElementById('order');
  if(orderTarget && !orderTarget.dataset.mounted) {
    mount(Order,  {
      target: orderTarget,
      props: []
    });
  }

  const languageChooserTarget = document.getElementById('lang-chooser');
  if(languageChooserTarget && !languageChooserTarget.dataset.mounted) {
    mount(LanguageChooser,  {
      target: languageChooserTarget,
      props: {close: ()=> globalState.setIsLanguageModalOpened(false)}
    });
  }

  // CART BUTTON COMPONENT
  const cartButtonTarget = document.getElementById('cart-button');
  if(cartButtonTarget && !cartButtonTarget.dataset.mounted) {
    mount(CartButton,  {
      target: cartButtonTarget,
      props: {}
    });
  }

}

if (!window.svelteInitialized) {
    document.addEventListener('livewire:navigated', () => {
      // Necessary bcs we won't to double components
      // using livewire:navigation
      // Prevent double svelte instances
      // destroyNavbar();
      // destroyMenu();
        globalState.setCartModalSelectedItem(null);
          console.log('User is not navigated using the back or forward button');
          // Your logic here
          initSvelteApp();
        // debugger;
    });
    window.svelteInitialized = true;

    // window.addEventListener('popstate', () => {

    //     setTimeout(() => {
    //         mountComponents();
    //     }, 0);

    // });
}
// 1. Find the element


