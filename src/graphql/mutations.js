import { gql } from "@apollo/client";

// Add a new book
export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $description: String!, $published_date: String!, $author_id: ID!) {
    addBook(title: $title, description: $description, published_date: $published_date, author_id: $author_id) {
      id
      title
    }
  }
`;



// Update an existing book
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $description: String!, $published_date: String!) {
    updateBook(id: $id, title: $title, description: $description, published_date: $published_date) {
      id
      title
    }
  }
`;

// Delete a book
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

// Add a new author
export const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!, $biography: String!, $born_date: String!) {
    addAuthor(name: $name, biography: $biography, born_date: $born_date) {
      id
      name
    }
  }
`;

// Update an existing author
export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String!, $biography: String!, $born_date: String!) {
    updateAuthor(id: $id, name: $name, biography: $biography, born_date: $born_date) {
      id
      name
    }
  }
`;

// Delete an author
export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

// Add a book review (MongoDB)
export const ADD_BOOK_REVIEW = gql`
  mutation AddBookReview($book_id: String!, $user: String!, $rating: Int!, $review: String!) {
    addBookReview(book_id: $book_id, user: $user, rating: $rating, review: $review) {
      user
      rating
      review
      review_date
    }
  }
`;
