<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CheckMark from '$lib/components/Icon/CheckMark.svelte';
	import Trash from '$lib/components/Icon/Trash.svelte';
	import LineItemRows from './LineItemRows.svelte';

	const blankLineItem = {
		id: '1',
		description: '',
		quantity: 0,
		amount: 0
	};

	let lineItems: LineItem[] = [blankLineItem];

	// Creating unique IDs with UUID to be able sort out the selected line to delete in "RemoveLineItem()" func.
	const AddLineItem = () => {
		lineItems = [...lineItems, { ...blankLineItem, id: `${lineItems.length + 1}` }];
	};
	const RemoveLineItem = (evt) => {
		lineItems = lineItems.filter((item) => item.id !== evt.detail);
	};
</script>

<h2 class="font-sans-serif text-daisy-bush mt-7 text-3xl font-bold">Add an Invoice</h2>

<form class="grid grid-cols-6 gap-x-5">
	<!-- client -->
	<div class="field col-span-2 items-end">
		<label for="client">Client</label>
		<select name="client" id="client">
			<option value="al-zaplin">Al Zaplin</option>
			<option value="zeal">ZEAL</option>
		</select>
	</div>
	<div class="field col-span-2 flex -translate-y-px items-end gap-x-5">
		<span class="text-monsoon text-base leading-14 font-bold">or</span>
		<Button onClick={() => {}} isAnimated={false} style="outline" label="+ Client" />
	</div>
	<!-- invoice id -->
	<div class="field col-span-2">
		<label for="id">Invoice ID</label>
		<input type="number" name="id" />
	</div>
	<!-- due date -->
	<div class="field col-span-2">
		<label for="dueDate">Due Date</label>
		<input type="date" name="dueDate" />
	</div>
	<!-- issue date -->
	<div class="field col-span-2 col-start-5">
		<label for="issueDate">Issue Date</label>
		<input type="date" name="issueDate" />
	</div>
	<!-- subject -->
	<div class="field col-span-6">
		<label for="subject">Subject</label>
		<input type="text" name="subject" />
	</div>
	<!-- line items -->
	<div class="field col-span-6">
		<LineItemRows {lineItems} on:addLineItem={AddLineItem} on:removeLineItem={RemoveLineItem} />
	</div>
	<!-- notes -->
	<div class="field col-span-6">
		<label for="notes"
			>Notes <span class="font-normal">(optional, displayed on invoice)</span></label
		>
		<textarea name="notes" id="notes"></textarea>
	</div>
	<!-- terms -->
	<div class="field col-span-6">
		<label for="terms">
			Terms <span class="font-normal">(optional, enter your terms and conditions)</span>
		</label>
		<textarea name="terms" id="terms"></textarea>
		<div class="text-sm text-gray-400">
			Formatting tips: <strong>*bold*</strong>, <em>_italic_</em>.
		</div>
	</div>
	<!-- buttons -->
	<div class="field col-span-2">
		<!-- only be visible if editing -->
		<Button
			onClick={() => {}}
			isAnimated={false}
			iconLeft={Trash}
			style="textOnlyDestructive"
			label="Delete"
		/>
	</div>
	<div class="field col-span-4 mr-2 flex justify-end gap-x-5">
		<Button onClick={() => {}} isAnimated={false} style="secondary" label="Cancel" />
		<Button
			onClick={() => {}}
			isAnimated={false}
			iconLeft={CheckMark}
			style="primary"
			label="Save"
		/>
	</div>
</form>
