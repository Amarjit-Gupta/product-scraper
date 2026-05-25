import { useState } from "react";
import axios from "axios";

function App() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    if (!websiteUrl) return;

    try {
      setLoading(true);
      setError("");
      setProducts([]);

      const res = await axios.post(
        "http://localhost:5000/scrape-products",
        {
          websiteUrl,
        }
      );

      if (res.status === 200) {
        setProducts(
          Array.isArray(res?.data?.products)
            ? res?.data?.products
            : []
        );
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">

        {/* Search */}
        <div className="p-2">

          <div className="flex flex-col sm:flex-row gap-4">

            <input
              type="text"
              placeholder="Enter website URL..."
              value={websiteUrl}
              onChange={(e) =>
                setWebsiteUrl(e.target.value)
              }
              className="flex-1 border px-2 py-2"
            />

            <button
              onClick={handleScrape}
              disabled={loading}
              className="border px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Scraping..." : "Scrape"}
            </button>

          </div>

          {error && (
            <p className="text-red-500 mt-3">
              {error}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">

          <div className="p-4 border-b">
            Total Products:
            <span className="font-bold ml-2">
              {products.length}
            </span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px]">

            <table className="w-full min-w-[800px]">

              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-4 text-left">
                    Product Name
                  </th>

                  <th className="p-4 text-left">
                    Description
                  </th>

                  <th className="p-4 text-left">
                    Image
                  </th>

                  <th className="p-4 text-left">
                    Website URL
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : products?.length ? (

                  products.map((product, index) => (

                    <tr
                      key={index}
                      className="border-b"
                    >
                      <td className="p-4 font-medium">
                        {product?.name}
                      </td>

                      <td className="p-4 max-w-xs break-words">
                        {product?.description}
                      </td>

                      <td className="p-4">
                        <img
                          src={product?.image}
                          alt="product"
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>

                      <td className="p-4">
                        <a
                          href={product?.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Web Link
                        </a>
                      </td>
                    </tr>

                  ))

                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center font-bold"
                    >
                      Data not found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;