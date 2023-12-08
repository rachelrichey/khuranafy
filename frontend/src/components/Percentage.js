import React, {useEffect, useState} from 'react';
import useAuth from '../hooks/useAuth';

const Percentage = () => {
  const [similarityPercentage, setSimilarityPercentage] = useState(0);
  const [checkData, setCheckData] = useState(true);
  
  const { accessToken, refreshAccessToken} = useAuth();

  const serverURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_SERVER : process.env.REACT_APP_PROD_SERVER;

  const fetchData = async () => {
  try {
    const response = await fetch(`${serverURL}/percentage?access_token=${accessToken}`);
    
    if (!response.ok) {
      console.error('Error:', response.status);
      return;
    }

    const data = await response.json();

    if(data.similarityPercentage < 100) {
      setCheckData(false)
     }

    setSimilarityPercentage(data.similarityPercentage);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(() => {
  fetchData();
}, [checkData]);

  return (
    <h2>{ similarityPercentage }%</h2>
  );
};

export default Percentage;