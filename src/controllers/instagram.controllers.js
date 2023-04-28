import {GraphQLClient} from 'graphql-request';
import config from '../config';
import axios from 'axios'


const client = new GraphQLClient('https://graph.facebook.com/v12.0/', {
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}|${process.env.APP_SECRET}}`,
  },
});


export const getFollowers = async () => {
    try {

        const query = `
      {
        user(id: "me") {
          friends {
            nodes {
              name
              email
            }
          }
        }
      }
    `;
    
    const data = await client.request(query);
    console.log(data);
    } catch (err) {
        console.log(err.message)
        console.log(err.stack)
    }
}

export const getDataREST = async (req, res) => {
  const { userId } = req.params;
  const { INSTAGRAM_ACCESS_TOKEN } = process.env;

  try {
    const response = await axios.get(`https://graph.instagram.com/${userId}/media?access_token=${INSTAGRAM_ACCESS_TOKEN}`);
    const media = response.data.data;
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
