import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
    query users{
        users{
            _id
            username
            email
            savedBooks{
                authors
                description
                bookId
                image
                link
                title
            }
        }
    }
`;

export const QUERY_ME = gql`
{
    me{
        _id
        username
        email
        savedBooks{
            authors
            description
            bookId
            image
            link
            title
        }
    }
}
`;
