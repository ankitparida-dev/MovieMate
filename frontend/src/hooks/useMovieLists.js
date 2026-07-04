import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_lists';

export const useMovieLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
}, []);

const fetchLists = async () => {
    try {
        const response =
            await fetch(
                'http://localhost:5000/api/lists'
            );

        const data =
            await response.json();

        setLists(data);
    }
    catch (error) {
        console.error(error);
    }

    setLoading(false);
};

  const saveLists = (newLists) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
    setLists(newLists);
  };

  const createList = async (
    title,
    description,
    isPublic = true
) => {

    const token =
        localStorage.getItem('token');

    const response = await fetch(
        'http://localhost:5000/api/lists',
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json',

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                title,
                description,
                isPublic
            })
        }
    );

    const data =
        await response.json();

    setLists(
        [data, ...lists]
    );

    return data;
};

 const addToList = async (
    listId,
    movie
) => {

    const token =
        localStorage.getItem('token');

    await fetch(
        `http://localhost:5000/api/lists/${listId}/movies`,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json',

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify(movie)
        }
    );

    fetchLists();
};
  const removeFromList = async (listId, mediaId) => {
  const token = localStorage.getItem('token');

  await fetch(
    `http://localhost:5000/api/lists/${listId}/movies/${mediaId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  fetchLists();
};

  const deleteList = async (listId) => {
  const token = localStorage.getItem('token');

  await fetch(
    `http://localhost:5000/api/lists/${listId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  fetchLists();
};

  const likeList = async (listId) => {
  const token = localStorage.getItem('token');

  await fetch(
    `http://localhost:5000/api/lists/${listId}/like`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  fetchLists();
};

  const getPublicLists = () => {
    return lists.filter(l => l.isPublic);
  };

  const getUserLists = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(
    'http://localhost:5000/api/lists/user',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return await response.json();
};

  return {
    lists,
    loading,
    createList,
    addToList,
    removeFromList,
    deleteList,
    likeList,
    getPublicLists,
    getUserLists
  };
};