<script lang="ts">
	import { url } from '@roxi/routify'

	let x = 27
</script>

<p>Index page {x}</p>

<a href={$url('./about')}>About me</a>
