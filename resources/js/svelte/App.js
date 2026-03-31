import { mount, unmount } from 'svelte';
import Navbar from './components/Navbar.svelte'
import MenuItems from './components/MenuItems.svelte';
import MenuDetails from './components/MenuDetails.svelte'
import { globalState } from './store.svelte.js'


let app;

function initSvelteApp() {
  if(app) {
    unmount(app);
  }

  if(window.LaravelData) {
    globalState.setCode(window.LaravelData.code);
  }

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

  const menuDetailsTarget = document.getElementById('menu-details');
  if(menuDetailsTarget && !menuDetailsTarget.dataset.mounted) {
    const dataElement = document.getElementById('menuitem-data');
    const menuItem = JSON.parse(dataElement.textContent);

    if(dataElement) {
      menuDetailsTarget.dataset.mounted = "true";
      mount(MenuDetails, {
        target: menuDetailsTarget,
        props: { menuItem }
      });
    }
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
        initSvelteApp();
    });
    window.svelteInitialized = true;
}
// 1. Find the element


