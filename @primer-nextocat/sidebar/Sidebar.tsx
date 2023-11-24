import React from "react";
import { NavList } from "@primer/react";
import { MdxFile, PageMapItem } from "nextra";
import { useRouter } from "next/router";

type SidebarProps = {
  routes: PageMapItem[];
};

export function Sidebar({ routes }: SidebarProps) {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <nav>
      <NavList>
        {routes.map((item) => {
          if (item.kind === "MdxPage" && item.route === "/") return null;

          if (item.kind === "MdxPage") {
            return (
              <NavList.Item
                key={item.name}
                href={item.route}
                sx={{ textTransform: "capitalize" }}
                aria-current={currentRoute === item.route ? "page" : undefined}
              >
                {item.frontMatter.title || item.name}
              </NavList.Item>
            );
          }
          if (item.kind === "Folder") {
            return (
              <NavList.Item
                key={item.name}
                href={item.route}
                sx={{ textTransform: "capitalize", fontSize: 1 }}
                defaultOpen
              >
                {item.name}
                <NavList.SubNav key={item.name}>
                  {item.children
                    .filter((child) => child.kind === "MdxPage")
                    .map((child: MdxFile) => {
                      return (
                        <NavList.Item
                          key={child.name}
                          href={child.route}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {child.frontMatter.title}
                        </NavList.Item>
                      );
                    })}
                </NavList.SubNav>
              </NavList.Item>
            );
          }
          return null;
        })}
      </NavList>
    </nav>
  );
}
