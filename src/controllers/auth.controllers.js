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

export const getToken = async (req, res) => {
    try {

    const code = 'AQBMRxdDLfAVW9T7-coH-hQ5AQsl7rMAKFpOwsO_k95b7C89bboh-L2ftXjG2XutH27RZTlXqt71KXrl6k2d9huZdjvWKG564xBpAeF07mRu0NQ_IfBeyl4c6aiZAHdauCNdwDRld7g3UbShb00Ou0Oc3yjNTN3HLbLBncYTyamGpbhgYDC81vuNMM6yPl8j_ReuJHfidqkqjU91DilTjEvVuWiwYh_GpxZlhEEF_Ga2Tw'
         // PETICION A API GRAPH INSTAGRAM: ACCESS TOKEN 
    const form = new FormData();
    form.append('client_id', '180895391557997');
    form.append('client_secret', 'b45df1e98fe84fceb1924f7c451a584e');
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', 'https://localhost:443/api/auth/code');
    form.append('code', code);


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
    const token = response.data.access_token

    res.send(`El access Token es: ${token}`)
    
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
        const code = 'AQBv6xjIhX5bVonjU0O9na5FNDHHEN3IrCKO1tl8EzDZsdSNZs3lOQY3N6pOh6Hm4lETtjZv2G8XYsZ8N0dyq1MIvhqLyL0gFq_0uTirpzY8k0eNDEtqzidUJUOiSV0ae-NeFSlXyO-FoeH3FeshkG34H6B23VjiBb7cwGCzwFIkNsRhjtgJeUr2RJxjrpF5pH6uAD4BXSgX4c6rjmZs6DF3g2f8MTijijyXR_jK6HlIBA'
         // PETICION A API GRAPH INSTAGRAM: ACCESS TOKEN 
        const form = new FormData();
        form.append('client_id', '180895391557997');
        form.append('client_secret', 'b45df1e98fe84fceb1924f7c451a584e');
        form.append('grant_type', 'authorization_code');
        form.append('redirect_uri', 'https://localhost:443/api/auth/code');
        form.append('code', code);


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
        const token = response.data.access_token
            
        const userDataResponse = await axios.get(`https://api.instagram.com/v1/users/self/?access_token=${token}`);

    const { data: userData } = userDataResponse;
    res.send(userData);

    } catch(err) {
        res.send(err)
    }

}



