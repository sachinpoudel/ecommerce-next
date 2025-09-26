import { Navbar } from "@/components/others/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <h1>Welcome to Our E-commerce Store</h1>
      <p>Shop the latest products at unbeatable prices!</p>
      <Image src="/hero.jpg" alt="Hero Image" width={500} height={300} />
    </main>
  );
}
