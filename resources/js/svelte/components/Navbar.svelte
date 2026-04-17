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