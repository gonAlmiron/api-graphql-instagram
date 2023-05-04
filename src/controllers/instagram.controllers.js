import {GraphQLClient} from 'graphql-request';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config()


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
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
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
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
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


// PETICION DE ACCESS CODE DE FACEBOOK

export const getCodeFacebook = async (req, res) => {

  try {
    const form = new FormData();
    form.append('client_id', '180895391557997');
    form.append('client_secret', 'b45df1e98fe84fceb1924f7c451a584e');
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', 'https://localhost:443/api/auth/instagram');
    form.append('code', 'AQD5lNF-Gdf4dEB33vlFRahWHILPChQRQNjH3gKhmQWkcZ_a8UrwAWN6PBIyEjNuQcWynogcLdwROzFUE-h2Fne2MlTUqHLPAwCoovMuUlG-nUToEhbGDxYKnRUvuMt9RP85GLBZm8Fd5ZXqUGEXqirb7jf-vMVlmKWlt-jc50kufmwmwn_z6_1J8OAmmmyamEdeG_onaZuW2JCRhTXt1C7wtldRCu7KRY4nU5a3KCXJSA');
    
    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      form,
      {
        headers: {
          ...form.getHeaders()
        }
      }
    );

    res.send(response.data)

  } catch(err) {
    console.log(err.message)
    res.send(err)
  }
}

// RECIBIR INFO: USER, EMAIL Y CUMPLEAÑOS DE FB. CON UN TOKEN DE ACCESO YA GENERADO. FUNCIONANDO

export const getInfoFacebook = async (req, res) => {

  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const response = await axios.get(`https://graph.facebook.com/v16.0/me?fields=id%2Cname%2Cemail%2Cbirthday&access_token=${accessToken}`);
    res.send(response.data)

  } catch(err) {
    res.send(err)
  }
}

export const getTokenFacebook = async (req, res) => {

  try {
    
    // PETICION A API GRAPH INSTAGRAM: ACCESS TOKEN 
    const form = new FormData();
    form.append('client_id', '180895391557997');
    form.append('client_secret', 'b45df1e98fe84fceb1924f7c451a584e');
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', 'https://localhost:443/api/auth/instagram');
    form.append('code', 'AQC0sAVS6thiRS3UaoCBbYdxyx-6Lr4EwOvd1YEE1HXlyZy3FaQqeg6t-Lv-c0iXK1Hqi9rdXzS2w4x7RFCH9BhiqdrR6bjWPN6oD8jnyGWMUiDb1ltyM8VIrqrngZT0cxrEhnDx4ma75ssVQcEvwSx-TRblsMkdFHQMqyWr7VVrKsq1biK2fBitALKsWKY9ODx84k-7_QwFDZZprv_Aeky2ovCexuIgwZZdk_GPmmRRsg');


    // ACA CON LOS DATOS DE NUESTRA CUENTA Y EL CODE QUE LE DAN AL USUARIO AL INGRESAR CON INSTAGRAM, HACEMOS EL POST QUE NOS TRAE EL ACCESS_TOKEN
    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      form,
      {
        headers: {
          ...form.getHeaders()
        }
      }
    );
    
    const token = response.data.access_token
    
    


    await res.send(`El access token es: ${token}`)

    // // RECIBIMOS EL TOKEN EN ESTA VARIABLE
    // const token = response.data.access_token


    // // PEDIMOS DATOS DEL USUARIO
    // const infoUser = await axios.get(`https://graph.facebook.com/v16.0/me?fields=id%2Cname%2Cemail%2Cbirthday&access_token=${token}`);
    // res.send(response.data)

    

    

  } catch(err) {
    res.send(err)
  }
}

// https://api.instagram.com/oauth/access_token?client_id=180895391557997&client_secret=b45df1e98fe84fceb1924f7c451a584e&grant_type=authorization_code&redirect_uri=https://localhost:443/api/auth/instagram&code=AQAq16GmxBa9T7_yaunDOqaHX-3bTA97gNZQs0WBeAC6rDPUngfHN8pAIlRyMI06L1hp4MCbkLRqFLuQ-di8XHl5anP_O2lUm8o3YuWMoX-ee4Pm3QveRSmYLkrFRYG-UhVsehPZ2O8TtkwJfSOIP9FCMby3I74Vq3m-JuT0jkOWi855btIvyyUURj1y22qDvX2TYrOVxkZdpEb_ceWSViIq3SeyBpSWnnchl-ryh6Lbeg