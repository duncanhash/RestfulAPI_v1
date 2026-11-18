const crypto=require('crypto')
const http=require('http')

const realuser=[
    {username:'dante',password:'1c26c5668e69e892e29576c7d33da04e36d8a234dd4401ca769660d3f62111b3'},//randomness
    {username:'caicedo',password:'400137a269da2172810f510994c24c1362b572cbcb82dddf46d4e58e3ff19263'}//ochuodho254
]

function hashedpass(plaintextpass){
    return crypto.createHash('sha256').update(plaintextpass).digest('hex')
    
}

const server=http.createServer((req,res)=>{
    console.log(`${req.url} tried connecting`)
    if(req.url !== '/api/login' || req.method !== "POST"){
        res.writeHead(404,{'content-Type':'text/plain'})
        return res.end('404 not found')
    }

    let bodytext=''
    req.on('data',chunk=>{
        bodytext += chunk
    })

    req.on('end', ()=>{
        try{
            const credetials=JSON.parse(bodytext)

            setTimeout(()=>{
            const founduser=realuser.find(user=>user.username === credetials.username)

            if(!founduser){
                res.writeHead(401,{'content-type':'application/json'})
                return res.end(JSON.stringify({'error':'invalid username or password'}))
                

            }

            
            const submittedpass=hashedpass(credetials.password)

            if (submittedpass=== founduser.password){
                res.writeHead(200,{'content-Type':'application/json'})
                res.end(JSON.stringify({message:'authentication successful'}))
                
            }else{
                res.writeHead(401,{'content-type':'application/json'})
                res.end(JSON.stringify({error:"invalid username or password"}))             
            }
            },250)

        }catch(e){res.end('bad request, invalid json format')}
    })
})

server.listen(3000,()=>{
    console.log('patched server running....')
})