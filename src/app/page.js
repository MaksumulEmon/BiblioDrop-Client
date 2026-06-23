import Banner from "@/Components/Banner";
import FeaturedBook from "@/Components/FeaturedBook";
import TopLibrarians from "@/Components/TopLibrarians";

import Image from "next/image";

export default function Home() {
  return (
    <div>
        <Banner/>
        <FeaturedBook/>
        <TopLibrarians/>
    </div>
  );
}
