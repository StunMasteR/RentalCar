import Hero from "@/components/Hero/Hero";
import Container from "@/components/Container/Container";
import css from "@/components/Container/Container.module.css";

export default function Home() {
  return (
    <Container className={css.container}>
    <main>
      <Hero />
    </main>
    </Container>
  );
}
