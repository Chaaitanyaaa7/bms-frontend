import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_AUTHORS, GET_AUTHORS_COUNT } from "../graphql/queries";
import { DELETE_AUTHOR } from "../graphql/mutations";
import EditAuthorModal from "./EditAuthorModal";

const AUTHORS_PER_PAGE = 10;

export default function AuthorTable() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingAuthorId, setEditingAuthorId] = useState(null);

    const { data, loading, error, refetch } = useQuery(GET_AUTHORS, {
        variables: {
            limit: AUTHORS_PER_PAGE,
            offset: (page - 1) * AUTHORS_PER_PAGE,
            filter: searchTerm ? { name: searchTerm } : null,
        },
    });

    const { data: countData } = useQuery(GET_AUTHORS_COUNT);

    const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
        onCompleted: () => refetch(),
        onError: (error) => alert("Error deleting author: " + error.message),
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching authors: {error.message}</p>;

    const totalAuthors = countData?.authorsCount || 0;
    const totalPages = totalAuthors > 0 ? Math.ceil(totalAuthors / AUTHORS_PER_PAGE) : 1;

    return (
        <div className="p-6">
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Search by author name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded w-full max-w-md"
                />
                <button
                    onClick={() => {
                        setSearchTerm(searchQuery);
                        refetch({
                            limit: AUTHORS_PER_PAGE,
                            offset: 0,
                            filter: searchQuery ? { name: searchQuery } : null,
                        });
                    }}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Search
                </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Biography</th>
                    <th className="border p-2">Birthday</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.authors.map((author) => (
                    <tr key={author.id} className="border">
                        <td className="border p-2">{author.name}</td>
                        <td className="border p-2">{author.biography}</td>
                        <td className="border p-2">{author.born_date}</td>
                        <td className="border p-2 flex gap-2">
                            <button
                                onClick={() => deleteAuthor({ variables: { id: author.id } })}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                🗑 Delete
                            </button>
                            <button
                                onClick={() => setEditingAuthorId(author.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                                ✏ Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 bg-gray-300 rounded">
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-2 bg-gray-300 rounded">
                    Next
                </button>
            </div>

            {/* Edit Author Modal */}
            {editingAuthorId && (
                <EditAuthorModal
                    isOpen={!!editingAuthorId}
                    onClose={() => setEditingAuthorId(null)}
                    authorId={editingAuthorId}
                    refetch={refetch}
                />
            )}
        </div>
    );
}
