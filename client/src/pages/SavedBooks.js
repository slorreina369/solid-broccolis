import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_USERS } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';


console.log(QUERY_ME, QUERY_USERS);
const SavedBooks = () => {
  const {data, loading, error}= useQuery(QUERY_ME);
  const [deleteBook] = useMutation( REMOVE_BOOK);

  if(error) {
    console.log(error)
    alert(error.message);
  }

   // if data isn't here yet, say so
  if(loading){
    return <div>Loading....</div>
  }

  const userData = data.me;
  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = userData ? Object.keys(userData).length : undefined;

  console.log(userDataLength);
  const token = Auth.loggedIn() ? Auth.getToken() : null;
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {

    if (!token) {
      return false;
    }
    
    try {
      const response = await deleteBook(bookId, token);

      const updatedUser = response;
      userData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if(!userDataLength){
     return <div>LOADING</div>
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
