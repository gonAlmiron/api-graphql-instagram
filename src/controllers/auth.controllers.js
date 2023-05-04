import axios from 'axios';
import FormData from 'form-data'
import dotenv from 'dotenv';
dotenv.config()


export const captureCode = async (req, res) => {
    try {
        // CAPTURANDO EL CODIGO DE AUTORIZACION que le dan al usuario al permitir ingresar con instagram
        const code = req.query.code
        console.log(code)
        await res.send(`El codigo de autorizacion del usuario es:      ${code} \n ------ Hay que cambiarlo por un ACCESS TOKEN para pedir datos. ` )
    } catch(err) {
        res.send(err)
    }
}

export const getToken = async (req, res) => {
    try {

    const code = 'AQBs3J2k7ocDs2adZBlkU31VK8aWDQpBPm6xrDCDBpnTmvXg1TJYEa0m8S8wUV7_e6kwPF8Ay-_XNG5-xDLHd5_BkgBz-cn-aJTI7L6mzW15Bsf4KiRnHzrSmo-zt6U7Dx_nSHPsXnsRLslPR9j_4qM_MbamklDAktuUYpWdBuuHZ_0TNvIH0Sqo-1iw9LDS-ImPtGgslhHzUt51lgaWnXFVj94zxVt7tpg_VM5aWdjWuw'
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

        const {code} = req.query
        console.log(`El codigo de autorizacion del usuario es:      ${code} \n ------ Hay que cambiarlo por un ACCESS TOKEN para pedir datos` )
    
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
        console.log(token)
    
        const userDataResponse = await axios.get(`https://api.instagram.com/v1/users/self/?access_token=${token}`);

    // Obtener los datos del usuario de la respuesta
    const { data: userData } = userDataResponse;

    // Retornar los datos del usuario en la respuesta
    res.send(userData);

    } catch(err) {
        res.send(err)
    }

}



