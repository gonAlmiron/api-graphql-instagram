import axios from 'axios';
import FormData from 'form-data'
import dotenv from 'dotenv';
dotenv.config()


export const captureCode = async (req, res, next) => {
    try {
        // CAPTURANDO EL CODIGO DE AUTORIZACION que le dan al usuario al permitir ingresar con instagram
        const code = req.query.code
        req.code = code
        await res.send(`El codigo de autorizacion del usuario es:      ${code} \n ------ Hay que cambiarlo por un ACCESS TOKEN para pedir datos. ` )
        next()
    } catch(err) {
        res.send(err)
    }
}

export const getToken = async (req, res, next) => {
    try {

    // PRIMERO PEDIMOS EL CODIGO QUE NOS MANDA INSTAGRAM, CUANDO EL USUARIO DA PERMISO DE INSTAGRAM
    const code = req.query.code

    // PETICION A API GRAPH INSTAGRAM: ACCESS TOKEN 
    const form = new FormData();
    form.append('client_id', '180895391557997');
    form.append('client_secret', 'b45df1e98fe84fceb1924f7c451a584e');
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', 'https://localhost:443/api/auth/token');
    form.append('code', code);
    console.log("CODIGO RECIBIDO CORRECTAMENTE: ", code)

    
    // ACA CON LOS DATOS DE NUESTRA CUENTA Y EL CODE QUE LE DAN AL USUARIO AL INGRESAR CON INSTAGRAM, HACEMOS EL POST QUE NOS TRAE EL ACCESS_TOKEN
    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      form,
      {
        headers: {
          ...form.getHeaders()
        }
      }
    )
    let token = response.data.access_token
    console.log("Token: " + token)

    // Guardamos el token de acceso del login de facebook en una sesion para poder pedir datos con eso
    req.session.token = token;
    req.session.user_id = response.data.id

    // // SE CAMBIA EL TOKEN SHORT-LIVED POR EL LONG-LIVED TOKEN Y SE GUARDA EN LA BASE DE DATOS

    const responseToken = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=b45df1e98fe84fceb1924f7c451a584e&access_token=${token}`)
    const tokenLong = responseToken.data.access_token;
    console.log("Token Long: " + tokenLong)
    // Guardar en Mongo

    // PEDIMOS DATOS CON EL TOKEN LONG A INSTAGRAM: SOBRE MEDIA -> MEDIA_TYPE, PERMALINK, MEDIA_URL
    const datosIg = await axios.get(`https://graph.instagram.com/me/media?fields=media_type,permalink,media_url&access_token=${tokenLong}`);
    const datos = JSON.stringify(datosIg.data);
    const status = datosIg.status
    console.log("Datos instagram:" + datos)
    console.log("Status de la respuesta: " + status)
    // Y una cookie en el cliente
    res.cookie('token', token)

    res.send(`Datos: ${datos}`)

    // const userData = await axios.get('https://graph.facebook.com/v16.0/me', {
    //     params: {
    //         'fields': 'name',
    //         'access_token': token
    //     }
    //     });
    // res.send(userData)
} catch(err) {
    console.log(err)
}
}


        // PEDIMOS DATOS DEL USUARIO PASANDO PARAMS
    // const token = response.data.access_token
   
//     const userData = await axios.get('https://graph.facebook.com/v16.0/me', {
//   params: {
//     'fields': 'name,birthday,email',
//     'access_token': token
//   }
// });

        // // PEDIMOS DATOS DEL USUARIO CON LINK DIRECTO
        // const infoUser = await axios.post(`https://graph.facebook.com/v16.0/me?fields=id%2Cname%2Cemail%2Cbirthday&access_token=${token}`);
        // console.log(infoUser.data)
        // res.send(infoUser.data)

export const getDataIg = async (req, res) => {

    try {
        // const code = 'AQBv6xjIhX5bVonjU0O9na5FNDHHEN3IrCKO1tl8EzDZsdSNZs3lOQY3N6pOh6Hm4lETtjZv2G8XYsZ8N0dyq1MIvhqLyL0gFq_0uTirpzY8k0eNDEtqzidUJUOiSV0ae-NeFSlXyO-FoeH3FeshkG34H6B23VjiBb7cwGCzwFIkNsRhjtgJeUr2RJxjrpF5pH6uAD4BXSgX4c6rjmZs6DF3g2f8MTijijyXR_jK6HlIBA'
        //  // PETICION A API GRAPH INSTAGRAM: ACCESS TOKEN 
        // const form = new FormData();
        // form.append('client_id', '180895391557997');
        // form.append('client_secret', 'b45df1e98fe84fceb1924f7c451a584e');
        // form.append('grant_type', 'authorization_code');
        // form.append('redirect_uri', 'https://localhost:443/api/auth/code');
        // form.append('code', code);


        // // ACA CON LOS DATOS DE NUESTRA CUENTA Y EL CODE QUE LE DAN AL USUARIO AL INGRESAR CON INSTAGRAM, HACEMOS EL POST QUE NOS TRAE EL ACCESS_TOKEN
        // const response = await axios.post(
        // 'https://api.instagram.com/oauth/access_token',
        // form,
        // {
        //     headers: {
        //     ...form.getHeaders()
        //     }
        // }
        // )
        // const token = response.data.access_token
        const accessToken = req.session.token
        const userDataResponse = await axios.get('https://graph.facebook.com/v16.0/me', {
            params: {
                'fields': 'name',
                'access_token': accessToken
            }
            });

        const { data: userData } = userDataResponse;
        res.send(userData);

    } catch(err) {
        res.send(err)
    }

}



