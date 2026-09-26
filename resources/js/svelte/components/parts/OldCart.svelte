<script>
    import { globalState } from "@/svelte/store.svelte";
    let { item, index } = $props()
</script>

            <div
                class="group flex flex-col w-full overflow-hidden md:max-w-[320px] rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
                <a 
                        class="mb-1 flex items-start justify-between"
                        href='/details/menu/{item.id}/{globalState.code}'   
                        wire:navigate 
                        aria-label={`View details for ${item.name}`}
                    >
                    
                    <div 
                        class="relative aspect-video w-full overflow-hidden bg-gray-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        // style="background-image: url('/storage/{item.picture}');"
                    >
                        <!-- Animated Skeleton Placeholder -->
                        <div 
                            class="absolute inset-0 animate-pulse bg-gray-300"
                            id="skeleton-{item.id}"
                        ></div>
                            <!-- Native Lazy Loaded Image replacement for background-image -->
                        <img 
                            src="/storage/{item.picture}" 
                            loading={index < 4 ? "eager" : "lazy"}
                            fetchpriority={index < 4 ? "high" : "auto"}
                            decoding="async"
                            alt={globalState.getNameTranslation(item)}
                            class="h-full w-full object-cover object-center opacity-0 transition-transform duration-500 group-hover:scale-110"
                            onload={(e) => {
                                e.currentTarget.classList.remove('opacity-0');
                                const skeleton = document.getElementById(`skeleton-${item.id}`);
                                if (skeleton) skeleton.style.display = 'none';
                            }}
                        />
                        <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>
                </a>

                <div class="flex flex-1 flex-col p-5">
                    <a 
                        class="mb-1 flex items-start justify-between"
                        href='/details/menu/{item.id}/{globalState.code}'   
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