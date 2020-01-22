const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode')
const foreCast = require('./utils/forecast')


console.log(__dirname);
console.log(path.join(__dirname,'../public/'))

const app = express();

//defines path for express config
const publicDirectoryPath = path.join(__dirname,'../public/')
const viewsPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')

//setup handlebars engine and view location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialPath);

//setup static directory serve
app.use(express.static(publicDirectoryPath))
 
app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather',
        name: 'Drashti Patel'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Drashti Patel'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        message:'Contact Drashti Patel for any query/issue !',
        title:'Help',
        name:'Drashti Patel'
    })
})

app.get('/weather',(req,res)=>{

    if(!req.query.address){
        return res.send({
            error:'No Address'
        })
    }

    console.log(req.query.address);

    geoCode(req.query.address,(error,{latitude,longitude,location}={})=>{

        if(error){
            return res.send({
                error
            })
        }

        foreCast(latitude,longitude,(error,forecastData)=>{

            console.log(forecastData);
            console.log(location);

            if(error){
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })

        })

    })
   
})

app.get('/products',(req,res)=>{
    console.log(req.query);
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term'
        })
    }
    res.send({
        products :[]
    })
})

app.get('/help/*',(req,res)=>{ 
    res.render('404',{
        title:'404',
        message:'Help article not found!'
    }) 
})

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        message:'Page not found!'
    }) 
})



//app.com
//app.com/help
//app.com/about

app.listen(3000,()=>{
    console.log('Server is up and running on port 3000')
});

