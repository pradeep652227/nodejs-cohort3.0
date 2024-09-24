const express=require('express');
const app=express();
const port=3000 || process.env.PORT;


function sum(n){
    let ans=0;
    for(let i=1;i<=n;i++)
            ans+=i;
    return ans;
}
app.get('/',(req,res)=>{
    console.log(req);
    const n=req.query.n;
    const ans=sum(n);
    res.send(ans.toString());
})


app.listen(port,()=>{
    console.log(`Listening on Port ${port}`);
});