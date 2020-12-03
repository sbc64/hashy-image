<script lang="typescript">
  import Uploader from "./Uploader.svelte";
  export let name: string;
  export let pk: string;
  export let image: string;
  function imageCallback(event: CustomEvent) {
    image = event.detail;
	}
</script>

<main>
	<h1>Hello {name}</h1>
  <Uploader on:upload="{imageCallback}"/>
  <p>{pk}</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
