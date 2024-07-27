<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { adminSchema, type AdminSchema } from "./schema";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	export let data: SuperValidated<Infer<AdminSchema>>;

	const form = superForm(data, {
		validators: zodClient(adminSchema),
	});

	console.log(`admin-form.svelte data:`, data);
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control  let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
