<script>
    let { menuItems = [] } = $props();

    let activeCategory = $state({name: 'All'});

    let filteredItems = $derived(
        activeCategory.name === 'All'
            ? menuItems
            : menuItems.filter(menuItem => menuItem.category.name == activeCategory)
    )

    const cat = [{name: 'All', id: '0'}];
    menuItems.forEach(menuItem => {
        if(menuItem.category && menuItem.category.id) {
            cat.push(menuItem.category)
        }
    })

    // const categories = ['All', ...new Set(menuItems.map(i => i.category).filter(Boolean))];
    let categories = cat;
  console.log(filteredItems);
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

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
        {#each filteredItems as item (item.id || item.name)}
            <div class="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                
                <div 
                    class="relative aspect-video w-full overflow-hidden bg-gray-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style="background-image: url('/storage/{item.picture}');"
                >
                    <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </div>

                <div class="flex flex-1 flex-col p-5">
                    <div class="mb-1 flex items-start justify-between">
                        <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                        </h3>
                        <span class="text-lg font-black text-blue-600">${item.price}</span>
                    </div>
                    
                    <p class="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-2">
                        {item.description}
                    </p>

                    <button class="mt-auto w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95">
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