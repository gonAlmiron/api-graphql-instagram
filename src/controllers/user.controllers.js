

export const userFB = async (req, res) => {
    try {
        const data = req.user;
        await res.send(data)

    } catch(err) {  
        res.send(err.message)
        res.send(err.stack)
    }
}