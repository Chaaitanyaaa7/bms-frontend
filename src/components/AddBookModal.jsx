import { useState } from "react";
import Modal from "react-modal";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_BOOK } from "../graphql/mutations";
import { GET_ALL_AUTHORS, GET_BOOKS } from "../graphql/queries";
import "styles/AddBookModal.css";

const modalStyles = {
    content: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "none",
        width: "700px",
        maxWidth: "95vw",
        margin: "auto",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 2000,
    },
};


export default function AddBookModal({ isOpen, onClose, refetch }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [publishedDate, setPublishedDate] = useState("");

    const { data: authorsData, loading: authorsLoading } = useQuery(GET_ALL_AUTHORS);

    const [addBook] = useMutation(ADD_BOOK, {
        onCompleted: () => {
            refetch();
            onClose();
        },
        onError: (error) => console.error("GraphQL Error:", error),
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !authorId.trim() || !publishedDate.trim()) {
            alert("Title, Author, and Published Date are required!");
            return;
        }

        try {
            await addBook({
                variables: {
                    title,
                    description: description.trim() || null,
                    published_date: publishedDate,
                    author_id: authorId,
                },
            });

            // Reset form fields after submission
            setTitle("");
            setDescription("");
            setPublishedDate("");
            setAuthorId("");

            onClose();
        } catch (error) {
            console.error("GraphQL Error:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} contentLabel="Add Book Modal">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6">
                <h2 className="text-3xl font-bold text-center">📖 Add a New Book</h2>

                <div className="input-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter book title"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter book description"
                        rows="4"
                    />
                </div>

                <div className="input-group">
                    <label>Author</label>
                    <select
                        value={authorId}
                        onChange={(e) => setAuthorId(e.target.value)}
                        required
                        className="w-full text-lg p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 author-select"
                    >
                        <option value="">Select an Author</option>
                        {authorsLoading ? (
                            <option>Loading authors...</option>
                        ) : (
                            authorsData?.getallauthors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="input-group">
                    <label>Published Date</label>
                    <input
                        type="date"
                        value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                        required
                    />
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white text-xl py-3 rounded-lg flex-1">
                        Add Book
                    </button>
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white text-xl py-3 rounded-lg flex-1">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
