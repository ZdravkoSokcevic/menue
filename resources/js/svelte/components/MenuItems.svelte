<script>
    import { cart } from '../store.svelte'
    import AddToCartModal from './AddToCartModal.svelte';
    import { globalState } from '../store.svelte.js';


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

<div class="mx-auto max-w-7xl px-4 py-8">
    
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
    <div class="mx-auto max-w-2xl">
    <div class="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {#each filteredItems as item (item.id || item.name)}
            <div
                class="group flex flex-col w-full overflow-hidden md:max-w-[320px] rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
                <a 
                        class="mb-1 flex items-start justify-between"
                        href='/details/{item.id}/{globalState.code}'   
                        wire:navigate 
                        aria-label={`View details for ${item.name}`}
                    >
                    
                    <div 
                        class="relative aspect-video w-full overflow-hidden bg-gray-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style="background-image: url('/storage/{item.picture}');"
                    >
                        <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>
                </a>

                <div class="flex flex-1 flex-col p-5">
                    <a 
                        class="mb-1 flex items-start justify-between"
                        href='/details/{item.id}/{globalState.code}'   
                        wire:navigate 
                    >
                        <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {globalState.getNameTranslation(item)}
                        </h3>
                        <span class="text-lg font-black text-blue-600">${ (item && item.portions && item.portions[0] && item.portions[0].prices) ? item.portions[0].prices.price : 0}</span>
                    </a>
                    
                    <p class="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-2">
                        {globalState.getDescriptionTranslation(item)}
                    </p>

                    <button 
                        class="mt-auto w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                        onclick={() => {
                            globalState.setCartModalSelectedItem(item)
                        }}    
                    >
                        Add to Order +
                    </button>
                </div>
            </div>
        {:else}
            <div class="col-span-full py-20 text-center text-gray-400 italic">
                No items found in {activeCategory}.
            </div>
        {/each}
    </div>
    </div>
</div>  
{#if globalState.cartModalSelectedItem}
<h1>Test</h1>
    <AddToCartModal
        item={globalState.cartModalSelectedItem}
        close={() => globalState.setCartModalSelectedItem(null)} 
    />
{/if}