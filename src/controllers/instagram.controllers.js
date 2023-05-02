import {GraphQLClient} from 'graphql-request';
import config from '../config';
import axios from 'axios'
import request from 'request'


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

export const getFollowersREST = async (req, res) => {

  const userId = req.params.userId;
  const accessToken = ''; // Reemplaza con tu propio token de acceso
  const url = `https://graph.instagram.com/${userId}/followers?access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    const followers = response.data.data.map(user => user.username);
    res.json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los seguidores del usuario');
  }
};

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


export const getDataUsuario = async (req, res) => {
    const accessToken = 'EAAQgnwlIu5kBAGZAYXR9xh0uoZCArg02A6FumbS2IDcLPtxVwvw2kWSj5Uy8VogbeicEd8KPbbdeiMkYJC4TZC5hvh1e5dd0eNZCwwLS8IydZCLQ8LySYOLpHkCPZCiucTRm7MeKq30YcTOZCqq3izBMrNhkZBKZCMapW8kH8m6j6nFvIngpPCyWNeIpfuHPgyu3TZCdPkobfPONcUaYUmSw1ZAcOcdUgbVTXmOWDQ53HV7sazFuC4yAurP'
    const url = 'https://developers.facebook.com/apps/me/';
    
    const params = {
    fields: 'id,username',
    access_token: `${accessToken}`
  };
  
  await axios.get(url, { params })
      .then(response => {   
        res.send(response.data);
      })
      .catch(error => {
        res.send(error.message)
        res.send(error.stack)
      });

}

export const getIDUsuario = async (req, res) => {

  const accessToken = 'EAAQgnwlIu5kBAGZAYXR9xh0uoZCArg02A6FumbS2IDcLPtxVwvw2kWSj5Uy8VogbeicEd8KPbbdeiMkYJC4TZC5hvh1e5dd0eNZCwwLS8IydZCLQ8LySYOLpHkCPZCiucTRm7MeKq30YcTOZCqq3izBMrNhkZBKZCMapW8kH8m6j6nFvIngpPCyWNeIpfuHPgyu3TZCdPkobfPONcUaYUmSw1ZAcOcdUgbVTXmOWDQ53HV7sazFuC4yAurP'; // Reemplaza con tu propio token de acceso
  const username = 'quedeporte'; // Reemplaza con el nombre de usuario del usuario de Instagram del que deseas obtener el ID
  const url = `https://graph.instagram.com/${username}?fields=id&access_token=${accessToken}`;
  try {
    axios.get(url)
  .then(response => {
    const userId = response.data.id;
    console.log(`El ID del usuario ${username} es ${userId}`);
  })
  .catch(error => {
    console.error(error.message);
  });
  } catch (err) {
    res.send(err.message)
  }
}


export const getGraph = async (req, res) => {
  try {
    const options = {
      method: 'GET',

      url: 'https://developers.facebook.com/apps/560448932859727/dashboard/',
      qs: {
        fields: 'business_discovery.username(quedeporte)',
        access_token: 'EAAQgnwlIu5kBAGZAYXR9xh0uoZCArg02A6FumbS2IDcLPtxVwvw2kWSj5Uy8VogbeicEd8KPbbdeiMkYJC4TZC5hvh1e5dd0eNZCwwLS8IydZCLQ8LySYOLpHkCPZCiucTRm7MeKq30YcTOZCqq3izBMrNhkZBKZCMapW8kH8m6j6nFvIngpPCyWNeIpfuHPgyu3TZCdPkobfPONcUaYUmSw1ZAcOcdUgbVTXmOWDQ53HV7sazFuC4yAurP'
      },
      headers: {
        'User-Agent': 'request'
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
          const data = JSON.stringify(body);
          res.send(data);

    });

    } catch(err) {
      res.send(err.message)
      res.send(err.stack)
    }
}

