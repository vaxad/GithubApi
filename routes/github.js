const express = require ('express')
const axios = require ('axios')
const cheerio = require ('cheerio')
const pretty = require ('pretty')
const router = express.Router()


router.get('/',async(req,res)=>{
    const url = 'https://github.com/vaxad?tab=repositories'
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const list = $("div#user-repositories-list ul li")
        const web = []
        const app = []
        const server = []
        list.each((idx,el)=>{
            const d={title:"",desc:"",url:""}
            d.title = $(el).children("div").children("div").children("h3").children("a").text().trim()
            d.url = 'https://github.com'+$(el).children("div").children("div").children("h3").children("a").attr("href")
            const desc = $(el).children("div").children("div").children("p").text().trim()
            const arr = desc.split(']')
            d.desc = arr[1]
            if(arr[0]==="[server"){
                server.push(d)
            }else if(arr[0]==="[app"){
                app.push(d)
            }else if(arr[0]==="[web"){
                web.push(d)
            }
            
        })
        
        res.json({web:web,server:server,app:app,total:(web.length+app.length+server.length)})
    } catch (error) {
        
    }
})

router.get('/repo/:name',async(req,res)=>{
    const name = req.params.name
    const url = `https://github.com/vaxad/${name}`
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const content = $("div.repository-content div.Layout-sidebar div div div")
        const desc = $(content).children("p.f4").text().trim()
        const href =$(content).children("div.my-3.d-flex.flex-items-center").children("span").children("a").attr("href")
        const readme = $("div.repository-content div div div.Layout div.Layout-main div.js-code-block-container div.Box-body")
        const li = $(readme).children("article").children("p").children("a") 
        const img =[]
        li.each((idx,el)=>{
            const i = $(el).children("img").attr("src")
            img.push(i)
        })
        const id = $(readme).find("p").text().trim()
        res.json({img:img,website:href,desc:desc,id:id})
        
    } catch (error) {
        
    }
})

router.get('/web',async(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const url = 'https://github.com/stars/vaxad/lists/web'
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const list = $("div#user-list-repositories div")
        const web = []
        for (const el of list) {
            const d={title:"",desc:"",url:"",img:"",web:"",id:""}
            const title = $(el).children("div").children("h3").children("a").text().trim()
            const arr2 = title.split(' / ')
            d.title = arr2[1]
            d.url = 'https://github.com'+$(el).children("div").children("h3").children("a").attr("href")
            if(d.url!=="https://github.comundefined"){
            const resp = await getRepo(d.url)
            d.desc = resp.desc
            d.web = resp.web
            d.id = resp.id
            d.img = resp.img
            web.push(d)
        }
        }
        res.json({web:web})
    } catch (error) {
        console.log(error)
    }
})

router.get('/server',async(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const url = 'https://github.com/stars/vaxad/lists/server'
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const list = $("div#user-list-repositories div")
        const server = []
        for (const el of list) {
            const d={title:"",desc:"",url:"",web:"",id:""}
            const title = $(el).children("div").children("h3").children("a").text().trim()
            const arr2 = title.split(' / ')
            d.title = arr2[1]
            d.url = 'https://github.com'+$(el).children("div").children("h3").children("a").attr("href")
            if(d.url!=="https://github.comundefined"){
            const resp = await getRepo(d.url)
            d.desc = resp.desc
            d.web = resp.web
            d.id = resp.id
            server.push(d)
        }
        }
        res.json({server:server})
    } catch (error) {
        console.log(error)
    }
})

router.get('/app',async(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const url = 'https://github.com/stars/vaxad/lists/app'
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const list = $("div#user-list-repositories div")
        const app = []
        for (const el of list) {
            const d={title:"",desc:"",url:"",web:"",id:"",img:[]}
            const title = $(el).children("div").children("h3").children("a").text().trim()
            const arr2 = title.split(' / ')
            d.title = arr2[1]
            d.url = 'https://github.com'+$(el).children("div").children("h3").children("a").attr("href")
            if(d.url!=="https://github.comundefined"){
            const resp = await getRepo(d.url)
            d.desc = resp.desc
            d.web = resp.web
            d.img = resp.img
            d.id = resp.id
            app.push(d)
        }
        }
        res.json({app:app})
    } catch (error) {
        console.log(error)
    }
})

const getRepo = async(url) =>{
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const content = $("div.repository-content div.Layout-sidebar div div div")
        const desc = $(content).children("p.f4").text().trim()
        const href =$(content).children("div.my-3.d-flex.flex-items-center").children("span").children("a").attr("href")
        const readme = $("div.repository-content div div div.Layout div.Layout-main div.js-code-block-container div.Box-body")
        const li = $(readme).children("article").children("p").children("a") 
        const img =[]
        li.each((idx,el)=>{
            const i = $(el).children("img").attr("src")
            img.push(i)
        })
        const id = $(readme).find("p").text().trim()
        const d= {img:img,web:href,desc:desc,id:id}
        return d
        
    } catch (error) {
        
    }
}

module.exports = router