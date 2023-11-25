import React, { useEffect, useState } from "react";
import { NavList } from "@primer/react";
import { Heading } from "@primer/react-brand";
import { Heading as HeadingType } from "nextra";

import styles from "./TableOfContents.module.css";

type TableOfContentsProps = {
  headings: HeadingType[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleEntry = entries[0];

        entries.forEach((entry) => {
          if (entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
            mostVisibleEntry = entry;
          }
        });

        const id = mostVisibleEntry.target.getAttribute("id");

        // Remove 'aria-current' from all elements
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          document
            .getElementById(`toc-heading-${id}`)
            .setAttribute("aria-current", "false");
        });

        if (mostVisibleEntry.intersectionRatio > 0) {
          document
            .getElementById(`toc-heading-${id}`)
            .setAttribute("aria-current", "location");
        }
      },
      {
        rootMargin: "0px 0px -50% 0px",
        threshold: [0, 0.5, 1],
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <aside className={styles.wrapper}>
      <Heading as="h3" size="subhead-medium" className={styles.heading}>
        On this page
      </Heading>
      <NavList>
        {headings.map((heading) => (
          <NavList.Item
            className={styles.item}
            key={heading.id}
            id={`toc-heading-${heading.id}`}
            href={`#${heading.id}`}
          >
            {heading.value}
          </NavList.Item>
        ))}
      </NavList>
    </aside>
  );
}
