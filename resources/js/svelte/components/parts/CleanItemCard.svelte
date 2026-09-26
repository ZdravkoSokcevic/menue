<script>
    import { globalState } from "@/svelte/store.svelte";
    const { item, index } = $props();
    let isImageLoading = $state(true);

    let price = $derived(
        item?.portions?.[0]?.prices?.price
            ? `$${item.portions[0].prices.price}`
            : '$0'
    );
  let description = $derived(
      globalState.getDescriptionTranslation?.(item) || item?.description || ""
    );

  // Price extraction helper
    const itemPrice = $derived(
      item?.portions?.[0]?.prices?.price ?? '0.00'
    );

    // Fallback image handling
    const imageSrc = $derived(
      item?.picture
        ? `/storage/${item.picture}`
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    );
</script>

<div class="p-2 group flex items-stretch overflow-hidden bg-white py-3 border-b border-amber-100/60 last:border-b-0 hover:bg-gray-50/50 transition-colors">
  
  <!-- Left: Square Thumbnail -->
  <a 
    href="/details/menu/{item.id}/{globalState.code}" 
    wire:navigate
    class="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-100"
    aria-label="View details for {globalState.getNameTranslation(item)}"
  >
    <img
      src={imageSrc}
      alt={globalState.getNameTranslation(item)}
      loading={index < 5 ? "eager" : "lazy"}
      fetchpriority={index < 5 ? "high" : "auto"}
      decoding="async"
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </a>

  <!-- Middle & Right: Content Container -->
  <div class="flex flex-1 flex-col justify-between pl-3 pr-2 py-0.5">
    
    <div class="flex items-start justify-between gap-2">
      <!-- Item Info -->
      <a 
        href="/details/{item.id}/{globalState.code}" 
        wire:navigate
        class="flex-1 min-w-0"
      >
        <h3 class="text-base font-bold text-gray-800 line-clamp-1 leading-snug group-hover:text-amber-600 transition-colors">
          {globalState.getNameTranslation(item)}
        </h3>
        <p class="mt-0.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {globalState.getDescriptionTranslation(item)}
        </p>
      </a>

      <!-- Amber Square Plus Button -->
      <button
        type="button"
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-light text-2xl shadow-sm transition-all hover:bg-amber-500 active:scale-95"
        onclick={() => globalState.setCartModalSelectedItem(item)}
        aria-label="Add {globalState.getNameTranslation(item)} to order"
      >
        +
      </button>
    </div>

    <!-- Bottom Right Price -->
    <div class="flex justify-end pt-1">
      <span class="text-sm font-bold text-gray-800">
        ${itemPrice}
      </span>
    </div>

  </div>
</div>