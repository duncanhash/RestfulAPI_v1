const  http=require('http')
const crypto=require('crypto')

const realUsers=[
    {username:'dante',password:'16814e8cd706b29de1ba77f011fd96f1b245ca6641b3af63b0f787af54284f90'},//hashed "dante"
    {username:'kongooo',password:'d84267b7f42c790b309fa0345c5caed09d03a1c9bd467d2c1086beae1f9dff36'}
]

function hashPassword(plainTextpasssword){
    return crypto.createHash('sha256').update(plainTextpasssword).digest('hex')
}

const server=http.createServer((req,res)=>{
    console.log(`${req.url} tried connecting and got a ${req.method}`)
    if(req.url !== '/api/login' || req.method !== 'POST'){
        res.writeHead(404,{'content-Type' : 'text/plain'})
        return res.end('404 not found')
    }

        let bodytext=""
        req.on('data',chunk=>{
            bodytext+=chunk
        })

        req.on('end',()=>{
            try{
            
            const credetials=JSON.parse(bodytext)
            const founduser=realUsers.find(user=>user.username === credetials.username)

            if (!founduser){
                res.writeHead(404,{'content-Type':'application/json'})
                return res.end(JSON.stringify({error: "username does not exist."}))
            }
                const submittedhash=hashPassword(credetials.password)

                if (submittedhash === founduser.password){
                    res.writeHead(200,{'content-Type':'application/json'})
                    res.end(JSON.stringify({message:'authentication successful!'}))
                }else{

                }                    res.writeHead(401,{'content-type':'application/json'})
                    res.end(JSON.stringify({error:"incorrect password"}))
            }catch(error){
                res.end("bad request: invalid json layout payload")
            }
            
        })
    })
    


server.listen(3000,()=>{
    console.log('fundametals lab running live on http://localhost:3000')
})
  
