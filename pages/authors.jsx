import { useState } from "react";
import { useQuery } from "@apollo/client";
import AuthorTable from "../src/components/AuthorTable";
import AddAuthorModal from "../src/components/AddAuthorModal";
import { GET_AUTHORS } from "../src/graphql/queries";

export default function AuthorsPage() {
    const [showModal, setShowModal] = useState(false);
    const { data, loading, error, refetch } = useQuery(GET_AUTHORS, {
        fetchPolicy: "network-only",
        variables: { limit: 10, offset: 0},
    });

    const handleAddAuthor = async () => {
        await refetch();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading authors: {error.message}</p>;

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">✍️ Authors</h1>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Add an Author
            </button>
            <div className="w-full max-w-4xl mt-4">
                <AuthorTable authors={data.authors} />
            </div>
            <AddAuthorModal isOpen={showModal} onClose={() => setShowModal(false)} refetch={handleAddAuthor} />
        </div>
    );
}
