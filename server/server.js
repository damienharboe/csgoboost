require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path');
const port = 8080
app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const passport = require("passport")
const { Strategy } = require("passport-steam")
const jwt = require("jsonwebtoken")
const MongoClient = require('mongodb').MongoClient;
const { default: axios } = require('axios');

const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri)

async function start() {
    console.log("connecting")
    await client.connect()
}

var db
var users
var market
var items
var offers

start().
    then(() => {
        db = client.db("csgoboost")
        users = db.collection("users")
        inventories = db.collection("inventories")
        market = db.collection("market")
        items = db.collection("items")
        offers = db.collection("offers")
        orders = db.collection("orders")
        notifications = db.collection("notifications")
        console.log("forbundet til database")
    })

const options = {
    returnURL: "http://localhost:8080/auth/steam/return",
    realm: "http://localhost:8080",
    apiKey: "09F45531BEBE27822CB21C4451F1B726"
}

var wearmap = new Map()
wearmap.set(0, "Factory New")
wearmap.set(1, "Minimal Wear")
wearmap.set(2, "Field-Tested")
wearmap.set(3, "Well-Worn")
wearmap.set(4, "Battle-Scarred")

passport.use(
    new Strategy(options, async (identifier, profile, done) => {
        profile.identifier = identifier

        query = { steamId: profile.id }
        var user = await users.findOne(query)
        if(!user)
        {
            doc = { 
                steamId: profile._json.steamid, 
                name: profile._json.personaname, 
                avatar: profile._json.avatar, 
                money: 0,
                name: "",
                road: "",
                postnr: "",
                city: "",
                region: "",
                country: "",
                tradeurl: "",
                email: "",
                phonenr: "",
            }
            await users.insertOne(doc)
        }

        return done(null, user)
    })
)

app.use(passport.initialize())
app.set("view engine", "pug");

app.get("/auth/steam", passport.authenticate("steam", { session: false }))

app.get("/auth/steam/return", passport.authenticate("steam", { session: false }), function(req, res){
    const token = jwt.sign({ user: req.user.steamId }, "verysecretmmmm", {
        expiresIn: "2h"
    })
    var query = { steamId: req.user.steamId }
    var set = { $set: { token: token } }
    users.updateOne(query, set, function(err, ress){
        res.render("authenticated", {
            token: token,
            clientUrl: "http://localhost:3000"
        })
    })
})

app.get("/api/market/offers", function(req, res){
    users.findOne({ token: req.query.token }, function(err, ures){
        // Check offers
        offers.find({ seller: ures.steamId }).toArray(function(err, ores){
            var e = Array()
            if(ores.length === 0)
            {
                res.json({ quantity: 0 } )
            }
            else
            {
                for(var i = 0; i < ores.length; i++){
                    var elem = ores[i]
                    // Get buyer info + weapon info
                    users.findOne({ steamId: elem.buyer }, function(err, ures2){
                        var item = {}
                        item.buyer = {
                            url: ures2.avatar,
                            name: ures2.name,
                            steamId: ures2.steamId
                        }
                        
                        var query = {
                            items: {
                                $elemMatch: {
                                    classid: elem.classid
                                }
                            }
                        }
                        inventories.findOne(query, function(err, ires){
                            let obj = ires.items.find(o => o.classid === elem.classid)
                            // Add info to the obj
                            item.weapon = {
                                weaponname: obj.weaponname,
                                skinname: obj.skinname,
                                url: obj.url,
                                float: obj.float,
                                stattrak: obj.stattrak,
                                wear: obj.wear,
                                classid: obj.classid,
                            }
                            item.offer = {
                                time: elem.time,
                                offer: elem.offer
                            }
                            e.push(item)
                            if(i === ores.length)
                            {
                                res.json(e)
                            }
                        })
                    })
                }
            }
        })
    })
})

app.get("/api/market/orders", function(req, res){
    users.findOne({ token: req.query.token }, function(err, ures){
        // Check offers
        orders.find({ seller: ures.steamId }).toArray(function(err, ores){
            var e = Array()
            if(ores.length === 0)
            {
                res.json({ quantity: 0})
            }
            else
            {
                for(var i = 0; i < ores.length; i++){
                    var elem = ores[i]
                    // Get buyer info + weapon info
                    users.findOne({ steamId: elem.buyer }, function(err, ures2){
                        var item = {}
                        item.buyer = {
                            url: ures2.avatar,
                            name: ures2.name,
                            steamId: ures2.steamId
                        }
                        
                        var query = {
                            items: {
                                $elemMatch: {
                                    classid: elem.classid
                                }
                            }
                        }
                        inventories.findOne(query, function(err, ires){
                            let obj = ires.items.find(o => o.classid === elem.classid)
                            // Add info to the obj
                            item.weapon = {
                                weaponname: obj.weaponname,
                                skinname: obj.skinname,
                                url: obj.url,
                                float: obj.float,
                                stattrak: obj.stattrak,
                                wear: obj.wear,
                                classid: obj.classid,
                            }
                            item.offer = {
                                time: elem.time,
                                price: elem.price
                            }
                            e.push(item)
                            if(i === ores.length)
                            {
                                res.json(e)
                            }
                        })
                    })
                }
            }
        })
    })
})

// Done
app.get("/api/market/item", function(req, res){
    var query = {
        weaponname: req.query.weaponname,
        skinname: req.query.skinname,
        stattrak: (req.query.stattrak === 'true'),
        wear: parseInt(req.query.wear)
    }

    items.findOne(query, function(err, ires){
        if(err) throw err

        res.json(ires)
    })
})

// Done
app.get("/api/market/item/steamprice", function(req, res){
    var query = {
        weaponname: req.query.weaponname,
        skinname: req.query.skinname,
        stattrak: (req.query.stattrak === 'true'),
        wear: parseInt(req.query.wear)
    }
    items.findOne(query, function(err, ires){
        if(err) throw err
        // Only getting price from steam every 15 hours to avoid getting banned and shi
        var newsteamprice = ires.steamprice
        var json = {
            steamprice: parseFloat(ires.steamprice)
        }
        if(((Date.now() - ires.steampricefetch) / 43200000) > 15)
        {
            var hash = req.query.weaponname + " | " + req.query.skinname + " (" + wearmap.get(parseInt(req.query.wear)) + ")"
            
            axios.get("https://steamcommunity.com/market/priceoverview/", {
                params: {
                    appid: 730,
                    currency: 3,
                    market_hash_name: hash
                }
            }).then(function(response){
                json.steamprice = parseFloat(response.data.median_price.substring(0, response.data.median_price.length - 1).replace(",", ".")) * 7.45
                var update = {
                    $set: {
                        steamprice: json.steamprice,
                        steampricefetch: Date.now()
                    }
                }
                items.updateOne(query, update)
                res.json(json)
            })
        }
        else
        {
            res.json(json)
        }
    })
})

// Done
app.get("/api/market", function(req, res){
    // Building da query
    var query = { }
    if(req.query.searchquery != "")
    {
        query = {
            $text: {
                $search: req.query.searchquery
            }
        }
    }
    if(req.query.minprice != "")
    {
        let minprice = parseInt(req.query.minprice)
        query.price = {
            $gte: minprice
        }
    }
    if(req.query.maxprice != "")
    {
        let maxprice = parseInt(req.query.maxprice)
        if(query.price != undefined)
        {
            query.price["$lte"] = maxprice
        }
    }
    if(req.query.wear != -1)
    {
        query.wear = parseInt(req.query.wear)
    }
    if(req.query.rarity != -1)
    {
        query.rarity = parseInt(req.query.rarity)
    }
    if(req.query.quality != -1)
    {
        query.quality = parseInt(req.query.quality)
    }
    if(req.query.type != -1)
    {
        query.category = parseInt(req.query.type)
    }
    market.find(query).toArray(function(err, result){
        if (err) throw err
        res.json(result)
    })
})

app.post("/api/market/addorder", function(req, res){
    var query = {
        items: {
            $elemMatch: {
                classid: req.body.classid
            }
        }
    }
    inventories.findOne(query, function(err, ires){
        let obj1 = ires.items.find(o => o.classid === req.body.classid)
        if(obj1 === null)
        {
            res.json({ success: false, status: 12 })
        }
        else
        {
            users.findOne({ token: req.body.token }, function(err, ures){
                if((ures.money - obj1.price) > 20)
                {
                    var url = "https://steamcommunity.com/inventory/" + ires.steamId.toString() + "/730/2?l=english&count=5000"
                    axios.get(url).then(function(response){
                        var found = false
                        var a = response.data.descriptions
                        for(var i = 0; i < response.data.descriptions.length; i++)
                        {
                            if(a[i].classid === req.body.classid)
                            {
                                found = true
                                break
                            }
                        }
                        if(!found)
                        {
                            res.json({ success: false, status: 12 })
                        }
                        else
                        {
                            var query = {
                                items: {
                                    $elemMatch: {
                                        classid: req.body.classid
                                    }
                                }
                            }
                            items.findOne(query, function(err, itres){
                                let obj = itres.items.find(o => o.classid === req.body.classid)
                                if(obj === null)
                                {
                                    res.json({ success: false, status: 12 })
                                }
                                else
                                {
                                    var insert = {
                                        classid: obj.classid,
                                        price: obj.price,
                                        time: Date.now(),
                                        buyer: ures.steamId,
                                        seller: obj.steamId
                                    }
                                    orders.insertOne(insert)

                                    // Fjern penge fra købers konto
                                    var query = {
                                        steamId: ures.steamId
                                    }

                                    var money = ures.money - parseInt(obj.price)
                                    var update = {
                                        $set: {
                                            money: money
                                        }
                                    }
                                    users.updateOne(query, update)

                                    // Fjern item fra marked + items
                                    var update = {
                                        $pull: {
                                            items: {
                                                classid: req.body.classid,
                                                steamId: ures.steamId
                                            }
                                        }
                                    }
                                    items.updateOne({ }, update)

                                    var query = {
                                        weaponname: obj1.weaponname,
                                        skinname: obj1.skinname,
                                        wear: obj1.wear,
                                        stattrak: obj1.stattrak
                                    }
                                    market.findOne(query, function(err, mres){
                                        if(mres.amount === 1)
                                        {
                                            // Delete
                                            market.deleteOne(query)
                                            items.deleteOne(query)
                                        }
                                        else
                                        {
                                            // Get new lowest price from items collection
                                            items.findOne(query, function(err, newres2){
                                                var lowest_price = newres2[2].price
                                                for(var item in newres2.items)
                                                {
                                                    if(item.price < lowest_price)
                                                        lowest_price = item.price
                                                }
                        
                                                // Update
                                                var update = {
                                                    $set: {
                                                        amount: mres.amount - 1,
                                                        price: lowest_price
                                                    }
                                                }
                                                market.updateOne(query, update)                        
                                            })
                                        }
                                        res.json({ success: true, status: 1 })
                                    })
                                }
                            })
                        }
                    })
                }
                else
                {
                    res.json({ success: false, status: 420 })
                }
            })
        }
    })
})

app.post("/api/market/offer", function(req, res){
    users.findOne({ token: req.body.token }, function(err, ures){
        if((ures.money - req.body.offer) < 20)
        {
            res.json({ success: false, status: 420 })
        }
        else
        {
            var query = {
                items: {
                    $elemMatch: {
                        classid: req.body.classid
                    }
                }
            }
            inventories.findOne(query, function(err, ires){
                let obj = ires.items.find(o => o.classid === req.body.classid)
                if(obj === null)
                {
                    res.json({ success: false, status: 12 })
                }
                else
                {
                    var url = "https://steamcommunity.com/inventory/" + ires.steamId.toString() + "/730/2?l=english&count=5000"
                    axios.get(url).then(function(response){
                        var found = false
                        var a = response.data.descriptions
                        for(var i = 0; i < response.data.descriptions.length; i++)
                        {
                            if(a[i].classid === req.body.classid)
                            {
                                found = true
                                break
                            }
                        }
                        if(!found)
                        {
                            res.json({ success: false, status: 12 })
                        }
                        else
                        {
                            // Køber har penge nok + item er stadig i inventory
                            const doc = {
                                classid: req.body.classid,
                                seller: ires.steamId,
                                offer: parseInt(req.body.offer),
                                buyer: ures.steamId,
                                time: Date.now(),
                            }
                            offers.insertOne(doc)

                            // Fjern penge fra købers konto
                            var query = {
                                steamId: ures.steamId
                            }

                            var money = ures.money - parseInt(req.body.offer)
                            var update = {
                                $set: {
                                    money: money
                                }
                            }
                            users.updateOne(query, update)

                            // insert notification
                            notifications.findOne({ steamId: ires.steamId }, function(err, nres){
                                if(nres === null)
                                {
                                    // insert
                                    var notifdoc = {
                                        steamId: ires.steamId,
                                        notifications: [
                                            {
                                                type: "offer",
                                                time: Date.now(),
                                                targetuser: ures.steamId,
                                                classid: req.body.classid
                                            }
                                        ]
                                    }
                                    notifications.insertOne(notifdoc)
                                }
                                else
                                {
                                    // update
                                    var query = { steamId: ires.steamId }
                                    var update = {
                                        $push: {
                                            notifications: {
                                                type: "offer",
                                                time: Date.now(),
                                                targetuser: ures.steamId,
                                                classid: req.body.classid
                                            }
                                        }
                                    }
                                    notifications.update(query, update)
                                }

                                res.json({ success: true, status: 1 })
                            })
                        }
                    })
                }
            })
        }
    })
})

app.post("/api/market/offer/accept", function(req, res){
    users.findOne({ token: req.body.token }, function(err, ures){
        offers.findOne({ classid: req.body.classid, seller: ures.steamId }, function(err, ores){
            if(ores !== null)
            {
                offers.deleteOne({ classid: req.body.classid, seller: ures.steamId })

                // Tilføj til orders da det er et normalt køb nu
                var insert = {
                    classid: req.body.classid,
                    price: ores.price,
                    time: Date.now(),
                    buyer: ores.buyer,
                    seller: ores.seller
                }
                orders.insertOne(insert)

                res.json({ success: true })
            }
            else
            {
                res.json({ success: false })
            }
        })
    })
})

app.post("/api/market/offer/reject", function(req, res){
    users.findOne({ token: req.body.token }, function(err, ures){
        offers.findOne({ classid: req.body.classid, seller: ures.steamId }, function(err, ores){
            if(ores !== null)
            {
                offers.deleteOne({ classid: req.body.classid, seller: ures.steamId })

                var query = {
                    steamId: ores.buyer
                }
                var update = {
                    $inc: {
                        money: ores.offer
                    }
                }

                users.updateOne(query, update)
                res.json({ success: true })
            }
            else
            {
                res.json({ success: false })
            }
        })
    })
})

// Done (mangler også float men det er nemt at tilføje)
app.post("/api/market/new", function(req, res){
    var classid = req.body.classid
    var price = req.body.price

    // Først skal man finde brugeren
    users.findOne({ token: req.body.token }, function(err, ures){
        // Så skal man finde inventory
        inventories.findOne({ steamId: ures.steamId }, function(err, ires){
            var it = ires.items
            let obj = it.find(o => o.classid === classid)

            // Så skal man finde ud af om der allerede er et item
            var query = {
                weaponname: obj.weaponname,
                skinname: obj.skinname,
                wear: obj.wear,
                stattrak: obj.stattrak
            }
            market.findOne(query, function(err, mres){
                if (err) throw err
                if(mres)
                {
                    var update = {
                        $set: {
                            amount: 1
                        }
                    }
                    if(price < mres.price)
                    {
                        update = {
                            $set: {
                                price: price,
                                amount: mres.amount + 1
                            }
                        }
                    }
                    var query = {
                        weaponname: obj.weaponname,
                        skinname: obj.skinname,
                        wear: obj.wear,
                        stattrak: obj.stattrak
                    }

                    market.updateOne(query, update)

                    var updatedoc = {
                        $push: {
                            items: {
                                float: 0.1,
                                price: price,
                                classid: classid,
                                steamId: ures.steamId,
                                steampic: ures.avatar,
                                steamname: ures.name,
                                inspecturl: "not yet my boe"
                            }
                        }
                    }

                    items.updateOne(query, updatedoc)
                }
                else
                {
                    doc = { 
                        weaponname: obj.weaponname,
                        skinname: obj.skinname, 
                        wear: obj.wear,
                        stattrak: obj.stattrak, 
                        price: price,
                        url: obj.url,
                        classid: classid,
                        amount: 1,
                        quality: obj.quality,
                        rarity: obj.rarity,
                        category: obj.category
                    }
                    market.insertOne(doc)

                    itemdoc = {
                        weaponname: obj.weaponname,
                        skinname: obj.skinname,
                        stattrak: obj.stattrak,
                        wear: obj.wear,
                        url: obj.url,
                        steamprice: 0,
                        steampricefetch: 0,
                        quality: obj.quality,
                        rarity: obj.rarity,
                        category: obj.category,
                        items: [
                            {
                                float: 0.1,
                                price: price,
                                classid: classid,
                                steamId: ures.steamId,
                                steampic: ures.avatar,
                                steamname: ures.name,
                                inspecturl: "not yet my boe"
                            }
                        ]
                    }
                    items.insertOne(itemdoc)
                }
                var query = { steamId: ures.steamId, "items.classid": classid }
                var update = {
                    $set: {
                        "items.$.price": price,
                        "items.$.selling": true
                    }
                }
                inventories.updateOne(query, update)

                res.json({ success: true })
            })
        })
    })
})

// Done
app.post("/api/market/delete", async (req, res) => {
    users.findOne({ token: req.body.token }, function(err, ures){
        if(err) throw err
        // Delete market entry from inventories collection
        var query = { steamId: ures.steamId, "items.classid": req.body.classid }
        var update = {
            $set: {
                "items.$.price": 0,
                "items.$.selling": false
            }
        }
        inventories.updateOne(query, update)

        // Delete market entry from items collection
        var update = {
            $pull: {
                items: {
                    classid: req.body.classid,
                    steamId: ures.steamId
                }
            }
        }
        items.updateOne({ }, update)

        inventories.findOne({ steamId: ures.steamId }, function(err, ires){
            var it = ires.items
            let obj = it.find(o => o.classid === req.body.classid)

            var query = {
                weaponname: obj.weaponname,
                skinname: obj.skinname,
                wear: obj.wear,
                stattrak: obj.stattrak
            }
            market.findOne(query, function(err, mres){
                if(mres.amount === 1)
                {
                    // Delete
                    market.deleteOne(query)
                    items.deleteOne(query)
                    res.json({ deleted: true })
                }
                else
                {
                    // Get new lowest price from items collection
                    items.findOne(query, function(err, newres2){
                        var lowest_price = newres2[2].price
                        for(var item in newres2.items)
                        {
                            if(item.price < lowest_price)
                                lowest_price = item.price
                        }

                        // Update
                        var update = {
                            $set: {
                                amount: mres.amount - 1,
                                price: lowest_price
                            }
                        }
                        market.updateOne(query, update)

                        res.json({ deleted: true })
                    })
                }
            })
        })
    })
})

// Done
app.post("/api/market/edit", function(req, res){
    users.findOne({ token: req.body.token }, function(err, ures){
        if(err) throw err
        // Delete market entry from inventories collection
        var query = { steamId: ures.steamId, "items.classid": req.body.classid }
        var update = {
            $set: {
                "items.$.price": req.body.price
            }
        }
        inventories.updateOne(query, update)

        // Get weapon info
        inventories.findOne({ steamId: ures.steamId }, function(err, ires){
            var it = ires.items
            let obj = it.find(o => o.classid === req.body.classid)

            var query = {
                weaponname: obj.weaponname,
                skinname: obj.skinname,
                wear: obj.wear,
                stattrak: obj.stattrak,
                "items.classid": req.body.classid,
            }
            var update = {
                $set: {
                    "items.$.price": req.body.price,
                }
            }
            items.updateOne(query, update)
            
            var query2 = {
                weaponname: obj.weaponname,
                skinname: obj.skinname,
                wear: obj.wear,
                stattrak: obj.stattrak,
            }
            items.findOne(query2, function(err, itemres){
                var lowest_price = itemres.items[0].price
                if(itemres.items.length === 1)
                {
                    lowest_price = req.body.price
                }
                else
                {
                    for (var item in itemres.items)
                    {
                        if(item.price < lowest_price)
                        {
                            lowest_price = item.price
                        }
                    }
                    if(req.body.price < lowest_price)
                    {
                        lowest_price = req.body.price
                    }
                }
                var update = {
                    $set: {
                        price: lowest_price
                    }
                }
                market.updateOne(query2, update)
                res.json({ success: true })
            })
        })
    })
})

// Done
app.get("/api/user", function(req, res){
    var query = { token: req.query.token }
    users.findOne(query, function(err, result){
        res.json({
            name: result.realname,
            road: result.road,
            postnr: result.postnr,
            city: result.city,
            region: result.region,
            country: result.country,
            tradeurl: result.tradeurl,
            email: result.email,
            phonenr: result.phonenr,
            nick: result.name, 
            avatar: result.avatar, 
            money: result.money
        })
    })
})

// Done
app.post("/api/user", function(req, res){
    var filter = { token: req.body.token }
    var update = {
        $set: {
            realname: req.body.realname,
            road: req.body.road,
            postnr: req.body.postnr,
            city: req.body.city,
            region: req.body.region,
            country: req.body.country,
            tradeurl: req.body.tradeurl,
            email: req.body.email,
            phonenr: req.body.phonenr,
        }
    }
    users.updateOne(filter, update, function(err){
        if(err)
        {
            res.json({ status: "NOGOOD" })
        }
        else
        {
            res.json({ status: "OK" })
        }
    })
})

const categorymap = new Map()
categorymap.set("CSGO_Type_Knife", 0)
categorymap.set("CSGO_Type_Pistol", 1)
categorymap.set("CSGO_Type_SniperRifle", 2)
categorymap.set("CSGO_Type_Rifle", 2)
categorymap.set("CSGO_Type_SMG", 3)
categorymap.set("CSGO_Type_Shotgun", 4)
categorymap.set("CSGO_Type_Machinegun", 5)
categorymap.set("Type_Hands", 6)
categorymap.set("CSGO_Tool_Sticker", 7)
categorymap.set("CSGO_Type_WeaponCase", 8) // Andet kategorien
categorymap.set("CSGO_Tool_WeaponCase_KeyTag", 8) // Andet kategorien
categorymap.set("Type_CustomPlayer", 8) // Andet kategorien
categorymap.set("CSGO_Type_MusicKit", 8) // Andet kategorien
categorymap.set("CSGO_Type_Equipment", 8) // Andet kategorien
categorymap.set("CSGO_Type_Spray", 8) // Andet kategorien

const qualitymap = new Map()
qualitymap.set("Rarity_Common_Weapon", 0)
qualitymap.set("Rarity_Uncommon_Weapon", 1)
qualitymap.set("Rarity_Rare_Weapon", 2)
qualitymap.set("Rarity_Mythical_Weapon", 2)
qualitymap.set("Rarity_Legendary_Weapon", 3)
qualitymap.set("Rarity_Ancient_Weapon", 4)
qualitymap.set("Rarity_Immortal_Weapon", 5)

const raritiesmap = new Map()
raritiesmap.set("normal", 0)
raritiesmap.set("strange", 1)
raritiesmap.set("tournament", 2)
raritiesmap.set("unusual", 2)

// Mangler float
app.get("/api/user/inventory", function(req, ress){
    // Get steam id
    users.findOne({ token: req.query.token }, function(err, res){
        inventories.findOne({ steamId: res.steamId }, function(err, ires){
            // 30 sec timeout check lastfetch
            if(err) throw err
            var skipvalidation = false
            if(ires === null) skipvalidation = true

            if(skipvalidation === true || ((Date.now() - ires.lastfetch) / 1000) > 30)
            {
                var url = "https://steamcommunity.com/inventory/" + res.steamId.toString() + "/730/2?l=english&count=5000"
                axios.get(url).then(function(response){
                    var items = Array()
                    var descriptions = response.data.descriptions

                    descriptions.forEach((element, index) => {
                        if(element.marketable == 1 && (skipvalidation === true || ires.items.length > index))
                        {
                            var selling = false
                            var price = 0
                            var float = -1

                            var wear = -1
                            for (let [key, value] of wearmap)
                            {
                                if(element.market_name.includes(value))
                                {
                                    wear = key
                                }
                            }

                            var add = 2
                            if(wear == -1)
                                add = 1

                            if(!skipvalidation)
                            {
                                if(ires.items.length < index)
                                {
                                    var i = ires.items.findIndex((i) => i.classid === element.classid) !== -1
                                    if(i !== -1)
                                    {
                                        selling = ires.items[i].selling
                                        price = ires.items[i].price
                                        float = ires.items[i].float
                                    }
                                }
                            }
                            var url2 = "https://steamcommunity-a.akamaihd.net/economy/image/" + element.icon_url
                            obj = {
                                classid: element.classid,
                                url: url2,
                                price: price,
                                selling: selling,
                                weaponname: element.name.substring(0, element.name.indexOf("|") - 1),
                                skinname: element.name.substring(element.name.indexOf("|") + add, element.name.length),
                                wear: wear,
                                stattrak: false,
                                float: float,
                                category: categorymap.get(element.tags[0].internal_name)
                            }
                            if(element.tags[0].internal_name !== "CSGO_Type_WeaponCase" & element.tags[0].internal_name !== "CSGO_Type_Spray")
                            {
                                obj.quality = qualitymap.get(element.tags[4].internal_name)
                                obj.rarity = raritiesmap.get(element.tags[3].internal_name)
                            }
                            if(element.name.includes("StatTrak"))
                                obj.stattrak = true
                            if(wear == -1)
                                obj.float = -1
                            else
                            {
                                var assetid = response.data.assets[index].assetid
                                var inspecturl = element.actions[0].link
                                var newinspect = inspecturl.replace("%owner_steamid%", res.steamId).replace("%assetid%", assetid)
                                obj.inspecturl = newinspect
                                obj.assetid = assetid
                                var url = "https://api.csgofloat.com/?url=" + newinspect
                                // console.log(url)
                                // axios.get(url).then(function(r)
                                // {
                                //     items[index].float = r.floatvalue
                                //     items[index].paintid = r.paintid
                                //     items[index].paintindex = r.paintindex
                                // }).catch(function(error){
                                //     if(error.response)
                                //     {
                                //         console.log(error.response.data)
                                //     }
                                // })
                            }
                            items.push(obj)
                        }
                    })
                    ress.json(items)

                    if(!skipvalidation)
                    {
                        // Writing to db
                        var query = {
                            steamId: res.steamId
                        }
                        var data = {
                            $set: {
                                lastfetch: Date.now(), // så man kan stoppe spam af steam api
                                items: items
                            }
                        }
                        inventories.updateOne(query, data, function(err){
                            if(err) throw err
                        })
                    }
                    else
                    {
                        var data = {
                            steamId: res.steamId,
                            lastfetch: Date.now(),
                            items: items
                        }
                        inventories.insertOne(data)
                    }
                })
            }
            else
            {
                ress.json(ires.items)
            }
        })
    })
})

app.get("/api/user/notifications", function(req, res){
    users.findOne({ token: req.query.token }, function(err, ures){
        notifications.findOne({ steamId: ures.steamId }, function(err, nres){
            var notifs = Array()
            if(nres === null || nres.notifications.length === 0)
            {
                res.json(notifs)
            }
            else
            {
                for(var i = 0; i < nres.notifications.length; i++)
                {
                    var n = nres.notifications[i]
                    users.findOne({ steamId: n.targetuser }, function(err, tres){
                        var query = {
                            items: {
                                $elemMatch: {
                                    classid: n.classid
                                }
                            }
                        }
                        inventories.findOne(query, function(err, ires){
                            let wobj = ires.items.find(o => o.classid === n.classid)
                            var obj = {
                                type: n.type,
                                time: n.time,
                                name: tres.name,
                                steamId: n.targetuser,
                                weapon: {
                                    weaponname: wobj.weaponname,
                                    skinname: wobj.skinname,
                                    wear: wobj.wear,
                                    classid: n.classid,
                                    url: wobj.url
                                }
                            }
                            notifs.push(obj)
                            if(i === nres.notifications.length)
                            {
                                res.json(notifs)
                            }
                        })
                    })
                }
            }
        })
    })
})

app.post("/api/user/notifications/remove", function(req, res){
    users.findOne({ token: req.body.token }, function(err, ures){
        var query = {
            steamId: ures.steamId
        }
        var doc = {
            $pull: {
                notifications: {
                    classid: req.body.classid
                }
            }
        }
        notifications.updateOne(query, doc)

        res.json({ success: true })
    })
})

app.get("/api/user/isadmin", function(req, res){
    users.findOne({ token: req.query.token }, function(err, ures){
        if(ures.admin)
        {
            res.json({ admin: true })
        }
        else
        {
            res.json({ admin: false })
        }
    })
})

function isAdmin(token, callback)
{
    users.findOne({ token: token }, function(err, res){
        console.log(res)
        callback(res.admin)
    })
}

app.get("/api/admin/users", function(req, res){
    // Always check if user is admin
    isAdmin(req.query.token, function(isadmin){
        if(isadmin)
        {
            users.find({}).toArray(function(err, ures){
                res.json(ures)
            })
        }
        else
        {
            res.json({ fuckoff: true })
        }
    })
})

app.get("/api/admin/user", function(req, res){
    isAdmin(req.query.token, function(isadmin){
        if(isadmin)
        {
            users.findOne({ steamId: req.query.steamId }, function(err, ures){
                res.json(ures)
            })
        }
        else
        {
            res.json({ fuckoff: true })
        }
    })
})

app.listen(port, () => {
    console.log(`csgoboost kører på http://localhost:${port}`)
})
