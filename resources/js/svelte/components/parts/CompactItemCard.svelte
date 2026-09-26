<script>
    import { globalState } from "@/svelte/store.svelte";

    const { item, index } = $props();
    let isImageLoading = $state(true);

    const firstPortion = $derived(item?.portions?.[0]);
    const price = $derived(
        firstPortion?.prices?.price ? `$${firstPortion.prices.price}` : '$0'
    );
    const portionName = $derived(firstPortion?.name || '');
    const name = $derived(globalState.getNameTranslation(item));
</script>

<div class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
    <!-- Full-bleed image -->
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <a 
                class=""
                href='/details/menu/{item.id}/{globalState.code}'   
                wire:navigate 
                aria-label={`View details for ${item.name}`}
            >
                {#if isImageLoading}
                    <div class="absolute inset-0 animate-pulse bg-gray-200"></div>
                {/if}

                <img
                    src="/storage/{item.picture}"
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchpriority={index < 4 ? "high" : "auto"}
                    decoding="async"
                    alt={name}
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 {isImageLoading ? 'opacity-0' : 'opacity-100'}"
                    onload={() => (isImageLoading = false)}
                    onerror={() => (isImageLoading = false)}
                />
            </a>

            <!-- Add button -->
            <button
                type="button"
                onclick={() => globalState.setCartModalSelectedItem(item)}
                aria-label="Add {name} to cart"
                class="absolute bottom-2.5 right-2.5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-2 ring-white transition hover:bg-blue-700 active:scale-90"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
    </div>

    <!-- Details (padding lives here now) -->
    <div class="flex flex-1 flex-col p-3">
        <a 
            class=""
            href='/details/menu/{item.id}/{globalState.code}'   
            wire:navigate 
            aria-label={`View details for ${item.name}`}
        >
            <h3 class="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900">
                {name}
            </h3>
        </a>

        <div class="mt-auto flex items-end justify-between gap-2 pt-2">
            <div class="flex flex-col">
                <span class="text-base font-bold leading-none text-gray-900">{price}</span>
                {#if portionName}
                    <span class="mt-1 text-xs text-gray-500">{portionName}</span>
                {/if}
            </div>

            {#if item?.portions?.length > 1}
                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                    {item.portions.length} sizes
                </span>
            {/if}
        </div>
    </div>
</div>