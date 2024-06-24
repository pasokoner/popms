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
	admin: [{ href: "/app/admin/departments", label: "Departments", icon: UsersRoundIcon }],
	department: [
		{ href: "/app/department/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
		{ href: "/app/department/pending-request", label: "Pending Request", icon: GitPullRequestIcon },
		{ href: "/app/department/products", label: "Products", icon: BoxIcon },
		{ href: "/app/department/partners", label: "Partners", icon: HandshakeIcon }
	],
	partner: [
		{ href: "/app/partner/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
		{ href: "/app/partner/request", label: "Price Request", icon: DiamondPercent }
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
