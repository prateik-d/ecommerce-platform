
import { useEffect, useState } from "react";
import './App.css'

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  createdAt: string;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  
return (
  <main className="container">
    <header className="header">
      <h1>ShopEzy</h1>
      <p>Discover products for everyday life.</p>
    </header>

    <section>
      <div className="catalogue-header">
        <h2>All Products</h2>

        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="search-input"
        />
      </div>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-placeholder">
                  {product.name.charAt(0).toUpperCase()}
                </div>

                <div className="product-details">
                  <h3>{product.name}</h3>

                  <p className="description">
                    {product.description || "No description available."}
                  </p>

                  <p className="price">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <p
                    className={
                      product.stockQuantity > 0
                        ? "stock available"
                        : "stock unavailable"
                    }
                  >
                    {product.stockQuantity > 0
                      ? `In stock: ${product.stockQuantity}`
                      : "Out of stock"}
                  </p>
                </div>
              </article>
            ))}
        </div>
      )}
    </section>
  </main>
);

}

export default App;
