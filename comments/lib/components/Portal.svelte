<!-- ? When we click on the «+ Invoice» button it should trigger a side panel that will allow us to add new invoice or if we click on «...» button and then on one of the options: «Edit», «Delete» or «Send» there shall be triggered also some panels or modal windows. And for all those we need to load the component outside of the page and this should be on top of all of the content. For this we need portal component, which allow us to inject any of these elements. We’ll use slots here to show any content inside we want. -->
<script lang="ts">
	// Our function will take as param "node", which is an HTML element, as it’s a custom directive. And we’ll need an update and a destroy functions inside.
	function portal(node: HTMLElement) {
		// Then we gonna grab a body tag, so that we can pin a content to it.
		let target: HTMLBodyElement | null;

		// And if target exists we’re going to add a node to it with "appendChild" method.
		// And then we also need to remove that "hidden" attribute from the div in order to display it.
		function update() {
			target = document.querySelector('body');
			target?.appendChild(node);
			node.hidden = false;
		}
		// And when it gets destroyed we must remove that node we appended. We’ll grab a parent node, where "node" is a slot and "parentNode" is the body tag.
		function destroy() {
			if (node.parentNode) node.parentNode.removeChild(node);
		}

		update();

		return { update, destroy };
	}
</script>

<!-- Here we will use standard HTML attribute "hidden", so it’s hidden by default. And we also add a custom directive 'portal'. -->
<div hidden use:portal><slot></slot></div>
