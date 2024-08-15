import React, { useCallback } from 'react';
import { useFetchDataQuery } from '../services/apiSlice';

const DataComponent = React.memo(() => {
  const { data, error, isLoading } = useFetchDataQuery();

  const renderItem = useCallback((item) => {
    return <li key={item.id}>{item.name}</li>;
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(renderItem)}
    </ul>
  );
});

export default DataComponent;