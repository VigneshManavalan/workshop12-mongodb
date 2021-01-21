const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('./Models/Users')
require('dotenv/config')
async function  filterUsers(skip, limit,stringSearches) {
    return new Promise(async(resolve,reject)=>{
        let returnAnswer = []
        let searches = {}
        stringSearches.forEach((stringSearch)=>{
            searches[stringSearch.key] = { $regex: new RegExp(String.raw`^${stringSearch.value}`), $options: "si" }
        })
    
       await Users.find(searches)
                   .sort( { age: 1 } )
                   .skip( skip > 0 ? ( ( skip - 1 ) * limit ) : 0 )
                   .limit( limit )
                   .then( user => {
                    returnAnswer.push(user)
                  } );
      
      resolve(returnAnswer)         
    }) }

  

app.use(bodyParser.json());


app.get('/users',async (req,res) => {
    let stringSearches = []
    let numberSearches = []
    
    const skip = Number.parseInt(req.query.skip)
    const limit = Number.parseInt(req.query.limit)
    const searchKeys = req.query.searchKeys.split(",")
    const searchValues = req.query.searchValues.split(",")
    searchKeys.forEach((key,index)=>{
        if(key=="name" || key=="email"){
            stringSearches.push({key:key,value:searchValues[index]})
        }
    })
   const returnAnswer =  await filterUsers(skip,limit,stringSearches)
   res.json(returnAnswer)
});

mongoose.connect('mongodb://127.0.0.1:27017/usersdb')
app.listen(3000);