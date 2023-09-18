<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125" />

    <div class="wrapper">
      <h1>@passerelle/insider-nuxt</h1>
      <p>
        <slot />
      </p>
      <nav>
        <nuxt-link to="/about">About</nuxt-link>
        <nuxt-link to="/works">Works</nuxt-link>
        <nuxt-link to="/contact">Contact</nuxt-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}

p {
  width: 100%;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;

  margin-left: -1rem;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

header {
  display: flex;
  place-items: center;
  padding-right: calc(var(--section-gap) / 2);
}

.logo {
  margin: 0 2rem 0 0;
}

header .wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}
</style>
