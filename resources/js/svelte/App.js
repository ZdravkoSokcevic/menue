import { mount, unmount } from 'svelte';
import MenuItems from './MenuItems.svelte';


let app;

function initSvelteApp() {
  if(app) {
    unmount(app);
  }

  const target = document.getElementById('menuitems-component');
  if (target) {
    // 2. Read and parse the JSON data from the data-items attribute
    const dataElement = document.getElementById('menu-data');
    const menuItems = JSON.parse(dataElement.textContent);

    // 3. Mount the Svelte 5 component with the data as props
    mount(MenuItems, {
      target: target,
      props: { menuItems }
    });
  }
}

document.addEventListener('livewire:navigated', initSvelteApp);
// 1. Find the element


