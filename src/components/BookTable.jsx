import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BOOKS, GET_BOOKS_COUNT } from "../graphql/queries";
import { DELETE_BOOK } from "../graphql/mutations";
import EditBookModal from "./EditBookModal";

const BOOKS_PER_PAGE = 10;

export default function BookTable() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingBookId, setEditingBookId] = useState(null);

    const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
        variables: { limit: BOOKS_PER_PAGE, offset: (page - 1) * BOOKS_PER_PAGE },
    });

    const { data: countData } = useQuery(GET_BOOKS_COUNT);

    const [deleteBook] = useMutation(DELETE_BOOK, {
        onCompleted: () => refetch(),
    });

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching books: {error.message}</p>;

    const totalBooks = countData?.booksCount || 0;
    const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border p-2 rounded-md flex-1 mr-2"
                    />
                    <button
                        onClick={() => {
                            setSearchTerm(searchQuery);
                            refetch({ limit: BOOKS_PER_PAGE, offset: 0, filter: searchQuery ? { title: searchQuery } : null });
                        }}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Search
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-md overflow-hidden shadow-md">
                        <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Author</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Published Date</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.books.map((book) => (
                            <tr key={book.id} className="border-b text-center hover:bg-gray-100">
                                <td className="p-3">{book.title}</td>
                                <td className="p-3">{book.author.name}</td>
                                <td className="p-3 truncate max-w-xs">{book.description}</td>
                                <td className="p-3">{book.published_date}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => deleteBook({ variables: { id: book.id } })}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                    >
                                        🗑 Delete
                                    </button>
                                    <button
                                        onClick={() => setEditingBookId(book.id)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                                    >
                                        ✏ Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Logic - Keeping it here */}
                <div className="flex justify-center items-center mt-4 gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Edit Book Modal */}
            {editingBookId && (
                <EditBookModal
                    isOpen={!!editingBookId}
                    onClose={() => setEditingBookId(null)}
                    bookId={editingBookId}
                    refetch={refetch}
                />
            )}
        </div>
    );
}
