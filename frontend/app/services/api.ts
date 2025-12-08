import axios from 'axios';

// Define the shape of our data for TypeScript
export interface Setup {
  symbol: string;
  status: string;
  price: number;
  is_hot: boolean;
  time: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const fetchSetups = async (): Promise<Setup[]> => {
  try {
    const res = await axios.get(`${API_URL}/scan`);

    // Sort the results: 'is_hot' (ICT Setups) go to the top
    const sortedData = res.data.active_setups.sort((a: Setup, b: Setup) => {
      // If a is hot and b is not, a comes first (-1)
      // If b is hot and a is not, b comes first (1)
      return (a.is_hot === b.is_hot) ? 0 : a.is_hot ? -1 : 1;
    });

    return sortedData;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

export const joinWaitlist = async (email: string) => {
    try {
        const res = await axios.post(`${API_URL}/waitlist`, { email: email });
        return res.data;
    } catch (error) {
        console.error("Error joining waitlist", error);
        throw error;
    }
}
