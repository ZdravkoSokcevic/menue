<script>
    let { menuItems = [] } = $props();

    let activeCategory = $state('All');

    let filteredItems = $derived(
        activeCategory === 'All'
            ? menuItems
            : menuItems.filter(menuItem => menuItem.category == activeCategory)
    )

    const categories = ['All', ...new Set(menuItems.map(i => i.category).filter(Boolean))];
  console.log(filteredItems);
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
    
    <!-- FILTER BUTTONS (The Missing Piece) -->
    <div class="mb-12 flex flex-wrap justify-center gap-4">
        {#each categories as cat}
            <button 
                onclick={() => activeCategory = cat}
                class="rounded-full border px-8 py-2.5 text-sm font-bold transition-all duration-300
                {activeCategory === cat 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}"
            >
                {cat}
            </button>
        {/each}
    </div>

    <!-- THE GRID -->
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
        {#each filteredItems as item (item.id || item.name)}
            <!-- The Card (max-w-sm keeps it from getting too wide) -->
            <div class="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all hover:scale-105 hover:shadow-xl flex flex-col">
                
                <!-- Image -->
                <div class="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img 
                        src={"/storage/" + item.picture} 
                        alt={item.name} 
                        class="h-full w-full object-cover"
                    />
                </div>

                <!-- Card Body -->
                <div class="flex flex-1 flex-col p-6">
                    <div class="mb-2 flex items-start justify-between">
                        <h3 class="text-xl font-bold text-blue-600">{item.name}</h3>
                        <span class="font-bold text-gray-900">${item.price}</span>
                    </div>
                    
                    <p class="mb-6 text-sm text-gray-500 line-clamp-2">
                        {item.description}
                    </p>

                    <button class="mt-auto w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
                        Add to Order +
                    </button>
                </div>
            </div>
        {:else}
            <!-- Empty State -->
            <div class="col-span-full py-20 text-center text-gray-400 italic">
                No {activeCategory} items found on the menu.
            </div>
        {/each}
    </div>
</div>