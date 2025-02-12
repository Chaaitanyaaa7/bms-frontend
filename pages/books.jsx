import { useState } from "react";
import { useQuery } from "@apollo/client";
import BookTable from "../src/components/BookTable";
import AddBookModal from "../src/components/AddBookModal";
import { GET_BOOKS } from "../src/graphql/queries";

export default function BooksPage() {
    const [showModal, setShowModal] = useState(false);
    const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
        fetchPolicy: "network-only",
        variables: { limit: 10, offset: 20},
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading books: {error.message}</p>;

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">📚 Books</h1>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
                ➕ Add a Book
            </button>
            <div className="w-full max-w-4xl">
                <BookTable books={data.books} />
            </div>
            <AddBookModal isOpen={showModal} onClose={() => setShowModal(false)} refetch={refetch} />
        </div>
    );
}
