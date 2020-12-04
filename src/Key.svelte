<script lang="typescript">
  import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let  image, fileinput;
	
	const onFileSelected =(e: any)=>{
    let upload = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(upload);
    reader.onload = (e: any) => { 
      image = e.target.result
      dispatch('upload', image)
    };
  }
	
</script>

<div id="uploader">
	<h1>Upload Image</h1>
    {#if image}
      <img class="image" src="{image}" alt="d" />
    {:else}
      <img class="image" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
    {/if}

    <img
      class="upload"
      src="https://static.thenounproject.com/png/625182-200.png"
      alt=""
      on:click={()=>{fileinput.click();}}
    />

    <div class="chan" on:click={()=>{fileinput.click();}}>Choose Image</div>

    <input
      style="display:none"
      type="file"
      accept=".jpg, .jpeg, .png"
      on:change={ (e)=> {
        onFileSelected(e)
      }}
      bind:this={fileinput}
    >
</div>

<style>
	#uploader{
	  display:flex;
		align-items:center;
		justify-content:center;
		flex-flow:column;
}
 
	.upload{
		display:flex;
	height:50px;
		width:50px;
		cursor:pointer;
	}
	.image{
		display:flex;
		height:200px;
		width:200px;
	}
</style>
