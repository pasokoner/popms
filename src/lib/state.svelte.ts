import type { Infer, SuperValidated } from "sveltekit-superforms";
import type { CreateProductSchema, EditProductSchema } from "./zod-schemas";
import { getContext, setContext } from "svelte";

type SetProductState = {
	createProductForm: SuperValidated<Infer<CreateProductSchema>>;
	editProductForm: SuperValidated<Infer<EditProductSchema>>;
};

export class ProductState {
	createProductForm = $state() as SuperValidated<Infer<CreateProductSchema>>;
	editProductForm = $state() as SuperValidated<Infer<EditProductSchema>>;

	constructor(init: SetProductState) {
		this.createProductForm = init.createProductForm;
		this.editProductForm = init.editProductForm;
	}
}

const PRODUCT_CTX = Symbol("product_ctx");

export function SetProductState(init: SetProductState) {
	const productState = new ProductState(init);
	setContext<ProductState>(PRODUCT_CTX, productState);
	return productState;
}

export function getProductState() {
	return getContext<ProductState>(PRODUCT_CTX);
}
