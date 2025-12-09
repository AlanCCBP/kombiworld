import { MenuItem } from "@/types";
import Link from "next/link";
import { JSX } from "react";

type Props = {
  menuItems: MenuItem[];
};

export default function SideBar(props: Props): JSX.Element {
  return (
    <nav className="flex flex-col space-y-2 text-white">
      {props.menuItems.map(({ label, path, icon: Icon }, i) => (
        <Link
          href={path}
          className="flex items-center gap-3 p-2 rounded-md transition-colors"
          key={i}
        >
          {Icon && <Icon size={22} />}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
