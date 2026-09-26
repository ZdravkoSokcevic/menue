<script>
    import { cart } from '../store.svelte'
    import { globalState } from '../store.svelte.js';
    import { getComboName, getComboPrice } from '../functions'
    import AddDiscountToCartModal from './AddDiscountToCartModal.svelte';
    import AddComboToCartModal from './AddComboToCartModal.svelte';

    const { comboItems } = $props();
    let activeIndex = $state(0);
    
    function handleScroll(e) {
        const scrollLeft = e.target.scrollLeft;
        const cardWidth = e.target.clientWidth * 0.82; // matching card width ratio
        activeIndex = Math.round(scrollLeft / cardWidth);
    }
</script>
<div class="mx-auto max-w-7xl px-4 py-2">
    <div class="mx-auto max-w-2xl">
        <div class="mb-4">
            <h3 class="text-xl font-bold text-gray-900">Popular combos</h3>
        </div>
    </div>

<!-- MAIN SLIDER CONTAINER -->
<div class="mx-auto max-w-2xl">
    <div
        onscroll={handleScroll}
        class="mb-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4"
    >
        {#each comboItems as item}
            <div class="flex w-[45vw] flex-none snap-start flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:w-[220px]">
                <a href="/details/combo/{item.id}/{globalState.code}" class="flex flex-1 flex-col">
                    <!-- Dynamic Image Grid -->
                    <div class="relative aspect-[4/3] w-full bg-gray-200">
                        <div
                            class="grid h-full w-full gap-0.5"
                            style="grid-template-columns: repeat({item.items?.length || 1}, minmax(0, 1fr));"
                        >
                            {#each item.items || [] as comboItem, imgIndex}
                                <div class="relative h-full w-full overflow-hidden bg-gray-100">
                                    <img
                                        src={comboItem.menu?.picture ? `/storage/${comboItem.menu.picture}` : ""}
                                        alt={comboItem.menu?.name || "Combo item"}
                                        loading={imgIndex < 2 ? "eager" : "lazy"}
                                        decoding="async"
                                        class="h-full w-full object-cover"
                                    />
                                </div>
                            {/each}
                        </div>

                        <!-- Add button, overlaid like menu item card -->
                        <button
                            type="button"
                            aria-label="Add {globalState.getComboNameTranslated(item)} to order"
                            class="absolute bottom-2 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-2 ring-white transition hover:bg-blue-700 active:scale-90"
                            onclick={(e) => {
                                e.preventDefault();
                                globalState.setCartComboSelectedItem(item);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>

                    <!-- Details -->
                    <div class="flex flex-1 flex-col p-2.5">
                        <h3 class="line-clamp-1 text-sm font-bold text-gray-900">
                            {globalState.getComboNameTranslated(item)}
                        </h3>
                        <p class="line-clamp-1 text-xs text-gray-400">
                            {@html globalState.getComboDescriptionTranslated(item) || 'Special discount offer'}
                        </p>
                        <span class="mt-1 text-base font-extrabold leading-none text-blue-600">
                            ${getComboPrice(item)}
                        </span>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>

    <!-- PAGINATION DOTS -->
    {#if comboItems.length > 1}
        <div class="flex justify-center space-x-2 mt-2">
            {#each comboItems as _, index}
                <div 
                    class="h-2 rounded-full transition-all duration-300 {activeIndex === index ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}"
                ></div>
            {/each}
        </div>
    {/if}
</div>

{#if globalState.cartComboModalSelectedItem}
<h1>Test</h1>
    <AddComboToCartModal
        comboItem={globalState.cartComboModalSelectedItem}
        type="combo-item"
        close={() => globalState.setCartComboSelectedItem(null)} 
    />
{/if}