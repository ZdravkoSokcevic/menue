<script>
    import { globalState } from '../store.svelte.js';
    import Cart from './Cart.svelte'; // Simply import it here
    
    let isCartOpen = $state(false);
</script>

<nav class="navbar">
    <div class="logo tracking-tighter"><a href="/shorts/{globalState.code}" {...{'wire:navigate': true }}>MyStore</a></div>
    
    <div class="nav-links">
        <a href="/shorts/{globalState.code}" wire:navigate>Home</a>
        <a href="/details?code={globalState.code}" wire:navigate>Details</a>
    </div>

    <button onclick={() => isCartOpen = !isCartOpen}>🛒</button>
    
    {#if isCartOpen}
        <Cart closeCart={() => isCartOpen = false}/>
    {/if}
</nav>
<div>
        <button
            onclick={() => goto.back()}
            // {...{'wire:navigate': true }}
            class="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-x-1 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-95"
        >
    <p>Current page: {globalState.currentPage}</p>
    </button>

</div>
{#if globalState.currentPage != 'home' }

    <div>
        <button
            onclick={() => history.back()}
            {...{'wire:navigate': true }}
            class="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-x-1 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-95"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            
            Back
        </button>
        
    </div>

{/if}
