<script>
    import { globalState } from "../store.svelte";

    let { menuItem } = $props();
</script>
<div class="mx-auto max-w-5xl px-4 pb-24 pt-6">

    <!-- IMAGE -->
     <div class="relative mb-6 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
        
        <div
            class="aspect-[4/3] w-full bg-cover bg-center"
            style={`background-image: url('/storage/${menuItem.picture}')`}
        ></div>

        <!-- GRADIENT -->
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <!-- TEXT OVER IMAGE -->
        <div class="absolute bottom-4 left-4 right-4 text-white">
            <span class="text-xs font-semibold uppercase tracking-wider text-white/80">
                {menuItem.category.name}
            </span>

            <h1 class="text-2xl font-bold sm:text-3xl">
                {menuItem.name}
            </h1>

            <p class="mt-1 text-lg font-semibold">
                ${ (menuItem && menuItem.portions && menuItem.portions[0] && menuItem.portions[0].prices) ? menuItem.portions[0].prices.price : 0}
            </p>
        </div>

    </div>

    <!-- CONTENT -->
    <div class="max-w-3xl">

        <!-- CATEGORY -->
        <span class="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {menuItem.category.name}
        </span>

        <!-- NAME -->
        <h1 class="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
            {menuItem.name}
        </h1>

        <!-- PRICE -->
        <p class="mt-3 text-2xl font-extrabold text-gray-900">
            ${ (menuItem && menuItem.portions && menuItem.portions[0] && menuItem.portions[0].prices) ? menuItem.portions[0].prices.price : 0}
        </p>

        <!-- DESCRIPTION -->
        <p class="mt-4 text-gray-600 leading-relaxed">
            {menuItem.description}
        </p>

        <!-- ALLERGENS -->
        {#if menuItem.ingridients && menuItem.ingridients.length}
            <div class="mt-6">
                <h4 class="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Allergens
                </h4>

                <div class="flex flex-wrap gap-2">
                    {#each menuItem.ingridients as ingridient}
                    {#if ingridient.allergens && ingridient.allergens.length}
                        {#each ingridient.allergens as allergen}
                        <span class="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                            {allergen.name}
                        </span>
                        {/each}
                    {/if}
                    {/each}
                </div>
            </div>
        {/if}

        <!-- INGRIDIENTS -->
        {#if menuItem.ingridients && menuItem.ingridients.length}
            <div class="mt-6">
                <h4 class="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Ingridients
                </h4>

                <div class="flex flex-wrap gap-2">
                    {#each menuItem.ingridients as ingridient}
                        <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            {ingridient.name}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

    </div>

</div>