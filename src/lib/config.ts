import type { ComponentType } from "svelte";
import { HandshakeIcon, LayoutDashboardIcon } from "lucide-svelte";

export type BaseLink = {
	href: `/${string}`;
	icon: ComponentType;
	label: string;
};

export type SubLink = Omit<BaseLink, "icon">;

export const links: Record<
	"admin",
	(BaseLink & {
		sublinks?: SubLink[];
	})[]
> = {
	admin: [
		{ href: "/app/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
		{
			href: "/app/admin/partners",
			label: "Partners",
			icon: HandshakeIcon,
			sublinks: [{ href: "/app/admin/partners/traders", label: "Traders" }]
		}
	]
};
