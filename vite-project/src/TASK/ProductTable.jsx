import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import axios from "axios";
import Preview from "./Preview";

const limitOptions = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
];

export default function Task() {
    const [products, setProducts] = useState([]);  // All products data
    const [pagination, setPagination] = useState({ limit: 20, page: 1 });  // Pagination state
    const [count, setCount] = useState(0);  // Total number of products
    const [modal, setModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all products (don't limit them on the API side)
                const response = await axios.get("https://fakestoreapi.com/products");
                const allProducts = response.data;

                // Sort products by id to ensure they are ordered correctly
                const sortedProducts = allProducts.sort((a, b) => a.id - b.id);
                setProducts(sortedProducts);
                setCount(sortedProducts.length);  // Total number of products
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to fetch products");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle pagination change
    const pageChange = ({ selected }) => {
        setPagination((prev) => ({ ...prev, page: selected + 1 }));
    };

    // Handle changing products per page
    const handleLimitChange = (selectedOption) => {
        setPagination({ page: 1, limit: selectedOption.value });  // Reset to page 1 when limit changes
    };

    const toggleModal = () => setModal(!modal);

    const previewHandler = (product) => {
        setSelectedProduct(product);
        toggleModal();
    };

    // Get the products to display based on the current pagination
    const displayedProducts = products.slice(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit
    );

    const totalPages = Math.ceil(count / pagination.limit); // Calculate total pages

    return (
        <div className="p-4">
            {/* Loader */}
            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            )}

            {/* Main Content */}
            {!isLoading && (
                <>
                    <div className="flex justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Products</h1>

                        <ReactSelect
                            className="w-32"
                            onChange={handleLimitChange}  // Update pagination limit on selection
                            options={limitOptions}
                            defaultValue={limitOptions[2]}  // Default to 20 products per page
                            placeholder="Rows"
                        />
                    </div>
                    <hr className="mb-4" />

                    {/* Table Container */}
                    <div className="flex justify-center w-full">

                        <div className="w-full max-w-screen-lg">
                            <table className="table-auto border-collapse border border-gray-200 w-fit table-layout-fixed">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {[
                                            "Sr. No",
                                            "Image",
                                            "Title",
                                            "Price",
                                            "Category",
                                            "Action",
                                        ].map((heading, index) => (
                                            <th
                                                key={index}
                                                className="border border-gray-300 px-4 py-2 text-center text-gray-700 text-sm font-semibold"
                                                style={{
                                                    width: index === 1 ? "100px" : "auto",  // Set fixed width for the image column
                                                }}
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedProducts.length > 0 ? (
                                        displayedProducts.map((product, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                {/* Displaying Sr. No based on pagination */}
                                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                    {(pagination.page - 1) * pagination.limit + index + 1}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <img
                                                        src={product.image}
                                                        className="w-16 h-16 object-contain"
                                                        alt="Product"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 w-50 text-sm text-gray-700 truncate" title={product.title} style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {product.title}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                    ₹{product.price}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 w-40 text-sm text-gray-700">
                                                    {product.category}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button
                                                        className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                                                        onClick={() => previewHandler(product)}
                                                    >
                                                        Preview
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-gray-500 text-sm">
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="mt-4">
                        <ReactPaginate
                            className="flex justify-center items-center gap-2 text-sm"
                            pageClassName="border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                            activeClassName="bg-blue-500 text-white"
                            breakLabel="..."
                            nextLabel="Next >"
                            previousLabel="< Previous"
                            onPageChange={pageChange}
                            pageCount={totalPages}
                            pageRangeDisplayed={3}
                            forcePage={pagination.page - 1}  // Keep pagination in sync with the current page
                            disabled={pagination.page === 1 || pagination.page === totalPages}  // Disable buttons when needed
                        />
                    </div>

                    {/* Preview Modal */}
                    <Preview isOpen={modal} toggle={toggleModal} product={selectedProduct} />
                </>
            )}
        </div>
    );
}
