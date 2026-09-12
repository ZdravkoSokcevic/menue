<script>
    import { cart } from '../store.svelte'
    import { globalState } from '../store.svelte.js';
    import { getDiscountPrice } from '../functions'
    import AddDiscountToCartModal from './AddDiscountToCartModal.svelte';

    const { discountItems } = $props();
    let activeIndex = $state(0);
    
    function handleScroll(e) {
        const scrollLeft = e.target.scrollLeft;
        const cardWidth = e.target.clientWidth * 0.82; // matching card width ratio
        activeIndex = Math.round(scrollLeft / cardWidth);
    }


    console.log(discountItems)
</script>
<div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-900">Popular discounts</h3>
    </div>

    <!-- MAIN SLIDER CONTAINER -->
    <div 
        onscroll={handleScroll}
        class="flex space-x-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 no-scrollbar"
    >
        {#each discountItems as item}
            <div class="w-[82vw] sm:w-[350px] flex-none snap-start bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between">
                <a href="/details/discount/{item.id}/{globalState.code}">
                    <div>
                        <div class="relative h-48 w-full overflow-hidden">
                            <img 
                                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                                alt={item.menu?.name || "Discount item"} 
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="p-4">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="text-lg font-bold text-gray-900">{item.menu?.name + '(' + item.portion.name +')' || 'Discounted Item'}</h3>
                                <span class="text-lg font-bold text-blue-600">${getDiscountPrice(item)}</span>
                            </div>
                            <p class="text-sm text-gray-500">{item.description || 'Special discount offer'}</p>
                        </div>
                    </div>
                </a>
                <div class="p-4 pt-0">
                    <button 
                        class="mt-auto w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                        onclick={() => {
                            globalState.setCartDiscountSelectedItem(item)
                        }} 
                    >
                        Add to Order +
                    </button>
                </div>
            </div>
        {/each}
    </div>

    <!-- PAGINATION DOTS -->
    {#if discountItems.length > 1}
        <div class="flex justify-center space-x-2 mt-2">
            {#each discountItems as _, index}
                <div 
                    class="h-2 rounded-full transition-all duration-300 {activeIndex === index ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}"
                ></div>
            {/each}
        </div>
    {/if}
</div>

{#if globalState.cartDiscountModalSelectedItem}
<h1>Test</h1>
    <AddDiscountToCartModal
        discountItem={globalState.cartDiscountModalSelectedItem}
        type="discount-item"
        close={() => globalState.setCartDiscountSelectedItem(null)} 
    />
{/if}