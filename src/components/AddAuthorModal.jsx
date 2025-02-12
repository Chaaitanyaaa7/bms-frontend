import { useState } from "react";
import Modal from "react-modal";
import { useMutation } from "@apollo/client";
import {ADD_AUTHOR, ADD_BOOK} from "../graphql/mutations";
import "styles/AddAuthorModal.css";

export default function AddAuthorModal({ isOpen, onClose, refetch }) {
    const [name, setName] = useState("");
    const [biography, setBiography] = useState("");
    const [bornDate, setBornDate] = useState("");

    const [addAuthor] = useMutation(ADD_AUTHOR, {
        onCompleted: () => {
            refetch();
            onClose();
        },
        onError: (error) => console.error("GraphQL Error:", error),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !bornDate.trim()) {
            alert("Name and Born Date are required!");
            return;
        }

        try {
            await addAuthor({ variables: { name, biography, born_date: bornDate } });
            setName("");
            setBiography("");
            setBornDate("");
            onClose();
        } catch (error) {
            console.error("Error adding author:", error);
        }
    };

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
            width: "450px",
            maxWidth: "90vw",
            margin: "auto",
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
        },
    };


    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} contentLabel="Add Author Modal">
            <div className="flex flex-col gap-6 px-6">
                <h2 className="text-3xl font-bold text-center"> Add a New Author</h2>


                <div className="input-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter author name"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Biography</label>
                    <textarea
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        placeholder="Enter author biography"
                        rows="4"
                    />
                </div>

                <div className="input-group">
                    <label>Birth Date</label>
                    <input
                        type="date"
                        value={bornDate}
                        onChange={(e) => setBornDate(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <button type="submit" onClick={handleSubmit} className="bg-blue-600 text-white text-xl py-3 rounded-lg w-full">
                        Add Author
                    </button>
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white text-xl py-3 rounded-lg w-full">
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}