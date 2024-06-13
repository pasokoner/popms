import type { ComponentType } from "svelte";
import {
	UsersRoundIcon,
	LayoutDashboardIcon,
	HandshakeIcon,
	BoxIcon,
	DiamondPercent,
	GitPullRequestIcon
} from "lucide-svelte";
import type { UserRole } from "./server/db/schema";

export type BaseLink = {
	href: `/${string}`;
	icon: ComponentType;
	label: string;
};

export type SubLink = Omit<BaseLink, "icon">;

export const links: Record<
	UserRole,
	(BaseLink & {
		sublinks?: SubLink[];
	})[]
> = {
	admin: [{ href: "/admin/departments", label: "Departments", icon: UsersRoundIcon }],
	department: [
		{ href: "/department/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
		{ href: "/department/pending-request", label: "Pending Request", icon: GitPullRequestIcon },
		{ href: "/department/products", label: "Products", icon: BoxIcon },
		{ href: "/department/partners", label: "Partners", icon: HandshakeIcon }
	],
	partner: [
		{ href: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
		{ href: "/partner/request", label: "Price Request", icon: DiamondPercent }
	]
};

export const MUNICIPALITIES = [
	"Abucay",
	"Bagac",
	"City of Balanga",
	"Hermosa",
	"Limay",
	"Mariveles",
	"Morong",
	"Pilar",
	"Orani",
	"Orion",
	"Samal"
];
