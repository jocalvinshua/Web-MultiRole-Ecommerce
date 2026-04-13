import BestSellers from "../../features/products/BestSellers.jsx";
import Categories from "../../features/products/Categories.jsx";
import MainBanner from "../../components/MainBanner.jsx";
import ButtomBanner from "../../components/ButtomBanner";
import NewsPaperSection from "../../components/NewsPaperSection";

export default function Home() {
  return(
    <div className="mt-10">
      <MainBanner/>
      <Categories/>
      <BestSellers/>
      <ButtomBanner/>
      <NewsPaperSection/>
    </div>
  )
}