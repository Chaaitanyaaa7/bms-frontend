import Link from "next/link";

export default function Home() {
    return (
        <div className="container">
            <h1>Book Management System</h1>
            <nav>
                <Link href="/books">📚 Manage Books</Link>
                <Link href="/authors">✍️ Manage Authors</Link>
            </nav>
        </div>
    );
}
