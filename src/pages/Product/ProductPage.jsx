import { useState, useEffect, useRef, useTransition } from "react";
import getAllProducts from "../../services/getAllProducts";
import CardList from "../../components/CardList/CardList";
import Navbar from "../../components/Navbar/Navbar";
import RadioButton from "../../components/RadioButton/RadioButton";
import getAllProductCategories from "../../services/getAllProductCategories";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const originalProducts = useRef([]);
  const radioButtonOpts = useRef([
    { label: "All", value: "all" }, // Menampilkan kategori 'All'
  ]);

  // Menambahkan kategori dinamis ke radio button options
  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getAllProductCategories();
      const newCategories = allCategories
        .map((cat) => ({
          label: cat.name,
          value: cat.slug,
        }))
        .filter((newCat) => !radioButtonOpts.current.some((existingCat) => existingCat.value === newCat.value));
      radioButtonOpts.current = [...radioButtonOpts.current, ...newCategories];
    }

    fetchCategories();
  }, []);

  // Mengambil semua produk
  useEffect(() => {
    async function fetchAllProducts() {
      const allProducts = await getAllProducts();
      originalProducts.current = allProducts || [];
      setProducts(allProducts || []);
    }

    fetchAllProducts();
  }, []);

  // Penyaringan produk berdasarkan kategori dan pencarian
  useEffect(() => {
    startTransition(() => {
      const filtered = originalProducts.current.filter((product) => {
        const matchesCategory = selectedCategory === "all" || product.categorySlug === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      setProducts(filtered);
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Navbar onSearchChange={handleSearchChange} />
      <div className="px-24 py-4 gap-4 mt-4 flex-wrap">
        <h3 className="font-medium">Filter</h3>
        <div className="flex gap-2 flex-wrap">
          <RadioButton options={radioButtonOpts.current} defaultValue={"all"} onChange={handleCategoryChange} />
        </div>
      </div>
      <section className="container px-24 py-4">
        <main className="grid grid-cols-4 gap-4">
          <CardList products={products} isPending={isPending} />
        </main>
      </section>
    </>
  );
}
