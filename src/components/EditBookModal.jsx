import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BOOK, GET_BOOKS } from "../graphql/queries";
import { UPDATE_BOOK } from "../graphql/mutations";

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

export default function EditBookModal({ isOpen, onClose, bookId, refetch }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishedDate, setPublishedDate] = useState("");

    const { data } = useQuery(GET_BOOK, {
        variables: { id: bookId },
        skip: !bookId,
        onCompleted: (data) => {
            setTitle(data?.book?.title || "");
            setDescription(data?.book?.description || "");
            setPublishedDate(data?.book?.published_date || "");
        },
    });


    const [updateBook] = useMutation(UPDATE_BOOK, {
        onError: (error) => console.error("GraphQL Error:", error),
        onCompleted: () => {
            refetch();
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !publishedDate.trim()) {
            alert("Title and Published Date are required!");
            return;
        }

        try {
            await updateBook({
                variables: { id: bookId, title, description, published_date: publishedDate },
            });

            // Close modal after update
            onClose();
        } catch (error) {
            console.error("GraphQL Error:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} contentLabel="Edit Book Modal">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6">
                <h2 className="text-3xl font-bold text-center">✏ Edit Book</h2>

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
                        Save Changes
                    </button>
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white text-xl py-3 rounded-lg flex-1">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
