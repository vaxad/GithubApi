const express = require ('express')
const axios = require ('axios')
const cheerio = require ('cheerio')
const pretty = require ('pretty')
const Projects = require('../models/Projects')
const router = express.Router()

const dbId = process.env.ID
const username = process.env.USERNAME

router.get('/repo/:name',async(req,res)=>{
    const name = req.params.name
    console.log(name,username)
    const url = `https://github.com/${username}/${name}`
    try {
        const {data} = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        const $ = cheerio.load(data)
        const content = $("div.repository-content div.Layout-sidebar div div div")
        console.log(content)
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

// router.get('/all',async(req,res)=>{
//     try {
//         let projects;
//         projects = await Projects.find()[0]
//         if(!projects){
//             projects = new Projects()
//             await projects.save()
//         }
//         console.log(projects)
//         const lastUpdated = projects.updated
//         const newDate = new Date(lastUpdated.getTime() + (24 * 60 * 60 * 1000))
//         const givenDate = Date.now()
//         if(givenDate>newDate){
//             projects.updated=Date.now()
//             await projects.save()   
//             store()
//         }
//         res.json({web:projects.web,server:projects.server,app:projects.app})
//     } catch (error) {
//         console.log(error)
//     }
// })

router.get('/store',async(req,res)=>{
    try {
        store()
        res.json({message:"ok"})
    } catch (error) {
        res.json({error:error})
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
        const desc = $(content).children("p.f4.my-3").first().text().trim()
        console.log(desc)
        if(!desc){
            console.log("no desc", url)
        }
        const href =$(content).children("div.my-3.d-flex.flex-items-center").children("span").children("a").attr("href")
        const readme = $("div.repository-content div.Layout-main script[data-target=react-partial.embeddedData]").html()
        // console.log(readme)
        const temp= JSON.parse(readme)
        // console.log(Object.keys(temp.props.initialPayload.overview.overviewFiles))
        // console.log(temp.props.initialPayload.overview.overviewFiles[0].richText)
        let tempHtml =temp.props.initialPayload.overview.overviewFiles[0].richText
        tempHtml = tempHtml.replace(/\n/g, "")
        const $2 = cheerio.load(tempHtml)
        const readme2 = $2("article")
        const id = $(readme2).children("p").text().trim()
        const li = $(readme2).children("p").children("a") 
        const img =[]
        // console.log(li.length)
        li.each((idx,el)=>{
            // console.log($(el).html())
            const i = $(el).children("img").attr("data-canonical-src")
            img.push(i)
        })
        // const id = $(readme).find("p").text().trim()
        const d= {img:img,web:href,desc:desc,id:id}
        return d
        
    } catch (error) {
        console.log(error)
    }
}

//db

const store=async()=>{
    try {
        console.log("store")   
        const projectsArr=await Projects.find()
        const projects = projectsArr[0]
        const web = await getweb()
        const server = await getserver()
        const app = await getapp()
        projects.web=web
        projects.server=server
        projects.app=app
        const resp=await Projects.findByIdAndUpdate(projects._id,projects)
        console.log(resp)
    } catch (error) {
        console.log(error)
    }
}

function indexOfFirstAlphabet(str) {
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (/[a-zA-Z]/.test(char)) {
        return i; // Return the index of the first alphabet found
      }
    }
    return -1; // Return -1 if no alphabet is found
  }

const getweb = async() =>{
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
            const d={title:"",desc:"",url:"",img:[],web:"",id:""}
            const title = $(el).children("div").children("h3").children("a").text().trim()
            const arr2 = title.split(' / ')
            d.title = arr2[1]
            d.url = 'https://github.com'+$(el).children("div").children("h3").children("a").attr("href")
            if(d.url!=="https://github.comundefined"){
            const resp = await getRepo(d.url)
            d.desc = resp.desc
            d.web = resp.web
            d.id = /[a-zA-Z]/.test(resp.id)?resp.id.slice(0,indexOfFirstAlphabet(resp.id)):resp.id
            d.img = resp.img
            web.push(d)
        }
        }
        return web
    } catch (error) {
        console.log(error)
    }
}

const getserver =async()=>{
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
            d.id = /[a-zA-Z]/.test(resp.id)?resp.id.slice(0,indexOfFirstAlphabet(resp.id)):resp.id
            server.push(d)
        }
        }
        return server
    } catch (error) {
        console.log(error)
    }
}

const getapp = async()=>{
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
            d.id = /[a-zA-Z]/.test(resp.id)?resp.id.slice(0,indexOfFirstAlphabet(resp.id)):resp.id
            app.push(d)
        }
        }
        return app
    } catch (error) {
        console.log(error)
    }
}


// const getRepo = async(url) =>{
//     try {
//         const {data} = await axios.get(url,{
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
//             }
//         })
//         const $ = cheerio.load(data)
//         const content = $("div.repository-content div.Layout-sidebar div div div")
//         const desc = $(content).children("p.f4").text().trim()
//         const href =$(content).children("div.my-3.d-flex.flex-items-center").children("span").children("a").attr("href")
//         const readme = $("div.repository-content div div div.Layout div.Layout-main div.js-code-block-container div.Box-body")
//         const li = $(readme).children("article").children("p").children("a") 
//         const img =[]
//         li.each((idx,el)=>{
//             const i = $(el).children("img").attr("src")
//             img.push(i)
//         })
//         const id = $(readme).find("p").text().trim()
//         const d= {img:img,web:href,desc:desc,id:id}
//         return d
        
//     } catch (error) {
        
//     }
// }

// //db

// const store=async()=>{
//     try {
//         const projects=await Projects.findById(dbId)
//         const web = await getweb()
//         const server = await getserver()
//         console.log("start")
//         const app = await getapp()
//         projects.web=web
//         projects.server=server
//         projects.app=app
//         const resp=await projects.save()
//     } catch (error) {
        
//     }
// }

// const getweb = async() =>{
//     const url = `https://github.com/stars/${username}/lists/web`
//     try {
//         const {data} = await axios.get(url,{
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
//             }
//         })
//         const $ = cheerio.load(data)
//         const list = $("div#user-list-repositories div")
//         const web = []
//         for (const el of list) {
//             const d={title:"",desc:"",url:"",img:[],web:"",id:""}
//             const title = $(el).children("div").children("h3").children("a").text().trim()
//             const arr2 = title.split(' / ')
//             d.title = arr2[1]
//             d.url = `https://github.com${$(el).children("div").children("h3").children("a").attr("href")}`
//             if(d.url!=="https://github.comundefined"){
//             const resp = await getRepo(d.url)
//             d.desc = resp.desc
//             d.web = resp.web
//             d.id = resp.id
//             d.img = resp.img
//             web.push(d)
//         }
//         }
//         return web
//     } catch (error) {
//         console.log(error)
//     }
// }

// const getserver =async()=>{
//     const url = `https://github.com/stars/${username}/lists/server`
//     try {
//         const {data} = await axios.get(url,{
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
//             }
//         })
//         const $ = cheerio.load(data)
//         const list = $("div#user-list-repositories div")
//         const server = []
//         for (const el of list) {
//             const d={title:"",desc:"",url:"",web:"",id:""}
//             const title = $(el).children("div").children("h3").children("a").text().trim()
//             const arr2 = title.split(' / ')
//             d.title = arr2[1]
//             d.url = `https://github.com${$(el).children("div").children("h3").children("a").attr("href")}`
//             if(d.url!=="https://github.comundefined"){
//             const resp = await getRepo(d.url)
//             d.desc = resp.desc
//             d.web = resp.web
//             d.id = resp.id
//             server.push(d)
//         }
//         }
//         return server
//     } catch (error) {
//         console.log(error)
//     }
// }

// const getapp = async()=>{
//     const url = `https://github.com/stars/${username}/lists/app`
//     try {
//         const {data} = await axios.get(url,{
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
//             }
//         })
//         const $ = cheerio.load(data)
//         const list = $("div#user-list-repositories div")
//         const app = []
//         for (const el of list) {
//             const d={title:"",desc:"",url:"",web:"",id:"",img:[]}
//             const title = $(el).children("div").children("h3").children("a").text().trim()
//             const arr2 = title.split(' / ')
//             d.title = arr2[1]
//             d.url = `https://github.com${$(el).children("div").children("h3").children("a").attr("href")}`
//             if(d.url!=="https://github.comundefined"){
//             const resp = await getRepo(d.url)
//             d.desc = resp.desc
//             d.web = resp.web
//             d.img = resp.img
//             d.id = resp.id
//             app.push(d)
//         }
//         }
//         return app
//     } catch (error) {
//         console.log(error)
//     }
// }

module.exports = router