"use client";

import type { User } from "lucia";
import { Github, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { logout } from "~/lib/auth/actions";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Navbar({ user }: { user: User | null }) {
	const { setTheme, theme } = useTheme();

	return (
		<div className="sticky left-0 top-0 bg-background/75 px-2 pt-2">
			<div className="container mx-auto flex items-center justify-between border-b-2 border-secondary/10 pb-2">
				<Link className="text-xl font-bold" href="/">
					Back<span className="text-primary">Talk</span>
				</Link>

				<div>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/talks" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Talks
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/Conferences" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Conferences
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex items-center">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">{user.username}</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => logout()}
								>
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant={"outline"} asChild>
							<Link href="/login/github">
								<Github className="mr-2 h-4 w-4" />
								Login
							</Link>
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						<SunMedium className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
