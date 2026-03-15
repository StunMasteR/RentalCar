"use client";

import Link from "next/link";
import css from "./Header.module.css";
import { usePathname } from "next/navigation";
import Container from "../Container/Container";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <Container className={css.container}>
    <header className={css.header}>
      
      <Link href="/" className={css.logoLink}>
        <svg className={isHomePage ? css.logoBlue : css.logoCyan}  width={150} height={40} aria-label="Rental Car Logo">
          <use href="/icons/sprite.svg#icon-logo" />
        </svg>
      </Link>
      <nav className={css.nav}>
        <Link
          href="/"
          className={pathname === "/" ? `${css.link} ${css.active}` : css.link}
        >
          Home
        </Link>
        <Link
          href="/catalog"
          className={
            pathname === "/catalog" ? `${css.link} ${css.active}` : css.link
          }
        >
          Catalog
        </Link>
      </nav>
      </header>
     </Container>
  );
}
