import Banner from "@/Components/Banner";
import CallToAction from "@/Components/CallToAction";
import FeaturedBook from "@/Components/FeaturedBook";
import FeaturedBooksMarquee from "@/Components/FeaturedBooksMarquee";
import TopLibrarians from "@/Components/TopLibrarians";

import Image from "next/image";

export default function Home() {
  return (
    <div>
        <Banner/>
        <FeaturedBooksMarquee />
        <FeaturedBook/>
        <TopLibrarians/>
        <CallToAction/>
    </div>
  );
}
