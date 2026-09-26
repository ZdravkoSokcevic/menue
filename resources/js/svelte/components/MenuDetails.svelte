<script>
    import { globalState } from "../store.svelte";
    import { getDiscountPrice } from "../functions"

    let type = globalState.type;
    // ITEM TYPE: menu|discount|combo
    let { item } = $props();
    let comboItem = item;
    console.log(type);
</script>
<div class="mx-auto max-w-5xl px-4 pb-24 pt-6">
    {#if type == 'menu' }
    <!-- IMAGE -->
     <div class="relative mb-6 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
        
        <div
            class="aspect-[4/3] w-full bg-cover bg-center"
            style={`background-image: url('/storage/${item.picture}')`}
        ></div>

        <!-- GRADIENT -->
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <!-- TEXT OVER IMAGE -->
        <div class="absolute bottom-4 left-4 right-4 text-white">
            <span class="text-xs font-semibold uppercase tracking-wider text-white/80">
                {item.category.name}
            </span>

            <h1 class="text-2xl font-bold sm:text-3xl">
                {item.name}
            </h1>

            <p class="mt-1 text-lg font-semibold">
                ${ (item && item.portions && item.portions[0] && item.portions[0].prices) ? item.portions[0].prices.price : 0}
            </p>
        </div>

    </div>

    <!-- CONTENT -->
    <div class="max-w-3xl">

        <!-- CATEGORY -->
        <span class="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {item.category.name}
        </span>

        <!-- NAME -->
        <h1 class="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
            {item.name}
        </h1>

        <!-- PRICE -->
        <p class="mt-3 text-2xl font-extrabold text-gray-900">
            ${ (item && item.portions && item.portions[0] && item.portions[0].prices) ? item.portions[0].prices.price : 0}
        </p>

        <!-- DESCRIPTION -->
        <p class="mt-4 text-gray-600 leading-relaxed">
            {item.description}
        </p>

        <!-- ALLERGENS -->
        {#if item.ingridients && item.ingridients.length}
            <div class="mt-6">
                <h4 class="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Allergens
                </h4>

                <div class="flex flex-wrap gap-2">
                    {#each item.ingridients as ingridient}
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
        {#if item.ingridients && item.ingridients.length}
            <div class="mt-6">
                <h4 class="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Ingridients
                </h4>

                <div class="flex flex-wrap gap-2">
                    {#each item.ingridients as ingridient}
                        <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                            {ingridient.name}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

    </div>
    {/if}

    <!-- FOR DISCOUNTS -->
    {#if type == 'discount'}
        <!-- IMAGE -->
        <div class="relative mb-6 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            
            <div
                class="aspect-[4/3] w-full bg-cover bg-center"
                style={`background-image: url('/storage/${item.menu.picture}')`}
            ></div>

            <!-- GRADIENT -->
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            <!-- TEXT OVER IMAGE -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {item.menu.category.name}
                </span>

                <h1 class="text-2xl font-bold sm:text-3xl">
                    {globalState.getDiscountNameTranslation(item)}
                </h1>

                <p class="mt-1 text-lg font-semibold">
                    ${getDiscountPrice(item)}
                </p>
            </div>

        </div>

        <!-- CONTENT -->
        <div class="max-w-3xl">

            <!-- CATEGORY -->
            <span class="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {item.menu.category.name}
            </span>

            <!-- NAME -->
            <h1 class="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
                {globalState.getDiscountNameTranslation(item)}
            </h1>

            <!-- PRICE -->
            <p class="mt-3 text-2xl font-extrabold text-gray-900">
                ${ getDiscountPrice(item)}
            </p>

            <!-- DESCRIPTION -->
            <p class="mt-4 text-gray-600 leading-relaxed">
                {globalState.getDiscountDescriptionTranslation(item)}
            </p>

            <!-- ALLERGENS -->
            {#if item.menu.ingridients && item.menu.ingridients.length}
                <div class="mt-6">
                    <h4 class="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                        Allergens
                    </h4>

                    <div class="flex flex-wrap gap-2">
                        {#each item.menu?.ingridients as ingridient}
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
            {#if item.menu.ingridients && item.menu.ingridients.length}
                <div class="mt-6">
                    <h4 class="mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                        Ingridients
                    </h4>

                    <div class="flex flex-wrap gap-2">
                        {#each item.ingridients as ingridient}
                            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                {ingridient.name}
                            </span>
                        {/each}
                    </div>
                </div>
            {/if}

        </div>
    {/if}

    {#if type == 'combo'}

        {#each item.items as item, index}
            <!-- IMAGE -->
            <div class="relative mb-6 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                
                <div
                    class="aspect-[4/3] w-full bg-cover bg-center"
                    style={`background-image: url('/storage/${item.menu.picture}')`}
                ></div>

                <!-- GRADIENT -->
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <!-- TEXT OVER IMAGE -->
                <div class="absolute bottom-4 left-4 right-4 text-white">
                    <span class="text-xs font-semibold uppercase tracking-wider text-white/80">
                        {item.menu.category.name}
                    </span>

                    <h1 class="text-2xl font-bold sm:text-3xl">
                        {globalState.getComboItemNameTranslation(item)}
                    </h1>

                    <p class="mt-1 text-lg font-semibold">
                        ${getDiscountPrice(item)}
                    </p>
                </div>

            </div>

            <!-- CONTENT -->
            <div class="max-w-3xl">

                <!-- CATEGORY -->
                <span class="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    {item.menu.category.name}
                </span>

                <!-- NAME -->
                <h1 class="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
                    {globalState.getComboItemNameTranslation(item)}
                </h1>

                <!-- PRICE -->
                <p class="mt-3 text-2xl font-extrabold text-gray-900">
                    ${ getDiscountPrice(item)}
                </p>

                <!-- DESCRIPTION -->
                <p class="mt-4 text-gray-600 leading-relaxed">
                    {globalState.getComboItemDescriptionTranslation(item)}
                </p>

            </div>

            {#if index < comboItem.items.length - 1}
            <div class="relative mb-6 flex items-center justify-center overflow-hidden 3xl min-h-[200px]">
            <span class="text-[12rem] font-black leading-none text-gray-300 select-none pointer-events-none">
                +
            </span>
            </div>
            {/if}
        {/each}

    {/if}

</div>