import { gql } from "@apollo/client";

// Get paginated books (without filter)
export const GET_BOOKS = gql`
  query GetBooks($limit: Int, $offset: Int, $filter: BookFilter) {
    books(limit: $limit, offset: $offset, filter: $filter) {
      id
      title
      description
      published_date
      author {
        id
        name
      }
      reviews {
        id
        book_id
        rating
        user
      }
    }
  }
`;


// Get total book count (for pagination)
export const GET_BOOKS_COUNT = gql`
  query BooksCount {
    booksCount
  }
`;

// Get a single book by ID
export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      published_date
      author {
        id
        name
      }
      reviews {
        id
        book_id
        rating
        user
      }
    }
  }
`;

// Get paginated authors (without filter)
export const GET_AUTHORS = gql`
  query GetAuthors($limit: Int, $offset: Int, $filter: AuthorFilter) {
    authors(limit: $limit, offset: $offset, filter: $filter) {
      id
      name
      biography
      born_date
      books {
        id
        title
      }
    }
  }
`;


// Get total author count (for pagination)
export const GET_AUTHORS_COUNT = gql`
  query AuthorsCount {
    authorsCount
  }
`;

// Get a single author by ID with their books
export const GET_AUTHOR = gql`
  query GetAuthor($id: ID!) {
    author(id: $id) {
      id
      name
      biography
      born_date
      books {
        id
        title
        published_date
      }
    }
  }
`;

export const GET_ALL_AUTHORS = gql`
  query GetAllAuthors {
    getallauthors {
      id
      name
      biography
      born_date
    }
  }
`;

// Get book reviews from MongoDB
export const GET_BOOK_REVIEWS = gql`
  query GetBookReviews($book_id: String!) {
    bookReviews(book_id: $book_id) {
      user
      rating
      review
      review_date
    }
  }
`;
