<script>
    import { cart } from '../store.svelte'
    import AddToCartModal from './AddToCartModal.svelte';
    import { globalState } from '../store.svelte.js';
    import OldCart from './parts/OldCart.svelte';
    import CleanItemCart from './parts/CleanItemCard.svelte';
    import CompactItemCard from './parts/CompactItemCard.svelte';

    let companySettings = globalState.company.settings;

    const menuItemsAppearance = companySettings.menuItemsAppearance || 'compact';
    const menuItemsAppearanceGridType = companySettings.menuItemsAppearanceGridType || 'single';
    // console.log({menuItemsAppearance}, {menuItemsAppearanceGridType})


    let { menuItems = [] } = $props();

    let activeCategory = $state({name: 'All'});
    console.log(menuItems);

    let filteredItems = $derived(
        activeCategory.name === 'All'
            ? menuItems
            : menuItems.filter(menuItem => menuItem.category.name == activeCategory.name)
    )

    const cat = [{name: 'All', id: '0'}];
    menuItems.forEach(menuItem => {
        if(menuItem.category && menuItem.category.id) {
            let exists = false;
            cat.forEach((existsCat) => {
                if(existsCat.id == menuItem.category.id)
                    exists = true;
            })
            if(!exists)
                cat.push(menuItem.category)
        }
    })

    // const categories = ['All', ...new Set(menuItems.map(i => i.category).filter(Boolean))];
    let categories = cat;
    

    function onItemClicked(menuItem) {
        // debugger;
        // cart.add(menuItem);
        selectedItem = menuItem;
    }

    function getItemClickLink(item) {
        return "/details/" + item.id;
    }

</script>

<div class="mx-auto max-w-7xl">
    
    <div class="mb-8 flex flex-wrap justify-center gap-3">
        {#each categories as cat}
            <button 
                onclick={() => activeCategory.name = cat.name}
                class="rounded-full border px-6 py-2 text-sm font-bold transition-all duration-300
                {activeCategory.name === cat.name 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}"
            >
                {cat == 'All' ? 'All' : cat.name}
            </button>
        {/each}
    </div>
</div>
<div class="mx-auto max-w-7xl">
    <!-- SINGLE ITEM COLUMN -->
    {#if menuItemsAppearanceGridType == 'single'}
        <div class={menuItemsAppearanceGridType == 'single' ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-2"}>
            {#each filteredItems as item,index (item.id || item.name)}
                    <CleanItemCart item={item} index={index} />
                    <!-- <OldCart item={item} index={index} /> -->
            {:else}
                <div class="col-span-full py-20 text-center text-gray-400 italic">
                    No items found in {activeCategory}.
                </div>
            {/each}
        </div>
    {/if}

    <!-- DOUBLE ITEM COLUMN -->
    {#if menuItemsAppearanceGridType == 'double'}
        <!-- <div class="mx-auto max-w-2xl"> -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-2">
            {#each filteredItems as item,index (item.id || item.name)}
                    <CompactItemCard item={item} index={index}/>
            {:else}
                <div class="col-span-full py-20 text-center text-gray-400 italic">
                    No items found in {activeCategory}.
                </div>
            {/each}
        </div>
        <!-- </div> -->
    {/if}
</div>  
{#if globalState.cartModalSelectedItem}
<h1>Test</h1>
    <AddToCartModal
        item={globalState.cartModalSelectedItem}
        type="menu-item"
        close={() => globalState.setCartModalSelectedItem(null)} 
    />
{/if}