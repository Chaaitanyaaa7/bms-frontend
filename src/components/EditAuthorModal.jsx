import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTHOR, GET_AUTHORS } from "../graphql/queries";
import { UPDATE_AUTHOR } from "../graphql/mutations";
import "styles/EditAuthorModal.css"; // Ensure correct CSS import

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

export default function EditAuthorModal({ isOpen, onClose, authorId, refetch }) {
    const [name, setName] = useState("");
    const [biography, setBiography] = useState("");
    const [bornDate, setBornDate] = useState("");

    const { data } = useQuery(GET_AUTHOR, {
        variables: { id: authorId },
        skip: !authorId,
        onCompleted: (data) => {
            setName(data?.author?.name || "");
            setBiography(data?.author?.biography || "");
            setBornDate(data?.author?.born_date || "");
        },
    });

    const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
        onCompleted: () => {
            refetch();
            onClose();
        },
        onError: (error) => console.error("GraphQL Error:", error),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !bornDate.trim()) {
            alert("Name and Birth Date are required!");
            return;
        }

        try {
            await updateAuthor({
                variables: { id: authorId, name, biography, born_date: bornDate },
            });
        } catch (error) {
            console.error("GraphQL Error:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} contentLabel="Edit Author Modal">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6">
                <h2 className="text-3xl font-bold text-center">✏ Edit Author</h2>

                <div className="input-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label>Biography</label>
                    <textarea value={biography} onChange={(e) => setBiography(e.target.value)} rows="4" />
                </div>

                <div className="input-group">
                    <label>Birth Date</label>
                    <input type="date" value={bornDate} onChange={(e) => setBornDate(e.target.value)} required />
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white text-xl py-3 rounded-lg flex-1">Save Changes</button>
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white text-xl py-3 rounded-lg flex-1">Cancel</button>
                </div>
            </form>
        </Modal>
    );
}
