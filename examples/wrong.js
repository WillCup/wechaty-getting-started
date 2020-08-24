/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
const {
  FileBox,
  UrlLink ,
  Wechaty,
  ScanStatus,
  log,
}               = require('wechaty')

const axios = require('axios')
const fs = require('fs')
const randomInt = require('random-int')

const request = require('request')

const CGT = fs.readFileSync('./examples/菜根谭.txt', 'utf-8').split('\r\n')

const ZGXW = fs.readFileSync('./examples/增广贤文.txt', 'utf-8').split('\r\n')
const DJT_CONTENT = fs.readFileSync('./examples/毒鸡汤.txt', 'utf-8').split('\n')

/**
 * You can ignore the next line becasue it is using for CodeSandbox
 */
require('./.util/helper')

const ddict = [
  "坤为地000000=0",
  "山地剥000001=1",
  "水地比000010=2",
  "风地观000011=3",
  "雷地豫000100=4",
  "火地晋000101=5",
  "泽地萃000110=6",
  "天地否000111=7",
  "地山谦001000=8",
  "艮为山001001=9",
  "水山蹇001010=10",
  "风山渐001011=11",
  "雷山小过001100=12",
  "火山旅001101=13",
  "泽山咸001110=14",
  "天山遯001111=15",
  "地水师010000=16",
  "山水蒙010001=17",
  "坎为水010010=18",
  "风水涣010011=19",
  "雷水解010100=20",
  "火水未济010101=21",
  "泽水困010110=22",
  "天水讼010111=23",
  "地风升011000=24",
  "山风蛊011001=25",
  "水风井011010=26",
  "巽为风011011=27",
  "雷风恒011100=28",
  "火风鼎011101=29",
  "泽风大过011110=30",
  "天风姤011111=31",
  "地雷复100000=32",
  "山雷颐100001=33",
  "水雷屯100010=34",
  "风雷益100011=35",
  "震为雷100101=36",
  "火雷噬嗑100101=37",
  "泽雷随100110=38",
  "天雷无妄100111=39",
  "地火明夷101000=40",
  "山火贲101001=41",
  "水火既济101010=42",
  "风火家人101011=43",
  "雷火豊101100=44",
  "离为火101101=45",
  "泽火革101110=46",
  "天火同人101111=47",
  "地泽临110000=48",
  "山泽损110001=49",
  "水泽节110010=50",
  "风泽中孚110011=51",
  "雷泽归妹110100=52",
  "火泽睽110101=53",
  "兑为泽110110=54",
  "天泽履110111=55",
  "地天泰111000=56",
  "山天大畜111001=57",
  "水天需111010=58",
  "风天小畜111011=59",
  "雷天大壮111100=60",
  "火天大有111101=61",
  "泽天夬111110=62",
  "乾为天111111=6"
]

const GUA_HELP = "=== 算卦说明 === \n\n 1. 抛硬币6次，正面记1，反面记0。 \n 2. 以【求卦-111000】的方式发送过来即可 \n 3. 心诚则灵 \n 4. 提倡用易来明事理，而不是求命运"

const temp = "https://qwd.jd.com/cps/zl?content={content}&shareSource=1_2_2";

var subscribes = new Map()

/**
 * 获取转链结果
 * 
 * @param {*} link 
 */
function inner_zl(link) {
    var result = "";
    var turl = temp.replace(new RegExp("{content}", "gm"), link);
    console.log("目标url是==", turl)
    var options = {
        url: turl,
        headers: {
            'Cookie': 'client_type=android;app_id=161;login_mode=2;jxjpin=jd_4aa000438e833;tgt=AAJfHT4eAEBnvigelHt_9mT8SvguScBAXBnbZIFG-vpl16MSDvsFwbTqMdreBYXMdpdPbYIKXYi0D1ARgJ5JMYVHw4mb8_ao;qwd_chn=99;qwd_schn=1',
            'User-Agent': 'jxj/3.5.22',
            'Host': 'qwd.jd.com',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip'
        }
    };
    request(options, function (err, resp, body) {
        if (err) {
            console.log("=============inner=============>报错了," , err, turl);
            result = "报错了"
            return result
        }
        console.log(resp)
        if (resp.statusCode === 200) {
            var bd = JSON.parse(body);
            if (bd.content) {
                console.log("=============inner=============>成功获取到转链结果：" + bd.content);
                result = bd.content;
            }
            else {
                console.log(bd.msg);
                result = bd.msg;
            }
        }
    });
    return result;
}

function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
  log.info('StarterBot', '%s logout', user)
}

const DJT =  "https://data.zhai78.com/openOneBad.php"

const JQR = "http://api.qingyunke.com/api.php?key=free&appid=0&msg="

const XGFY = "https://cdn.mdeer.com/data/yqstaticdata.js"




async function onMessage (msg) {
  let text = msg.text()
  let fromn = msg.from().name()

  if (text.indexOf('@订阅') > -1) {
    const pps = text.split('-')
    if (pps.length === 2) {
      var x = subscribes.get(fromn) || new Set()
      x.add(pps[1])
      subscribes.set(fromn , x)
      console.log(fromn + '您订阅了：' + Array.from(subscribes.get(fromn)).join(','))
      await msg.say(fromn + '您订阅了：' + Array.from(subscribes.get(fromn)).join(','))
      return
    }
  }
  
  // log.info('StarterBot', msg.toString())
  if (msg.self()) {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx  自己说的 " + msg)
    
    return
  }
  room = msg.room()

  if (text.indexOf("退出登录") > -1) {
    await this.logout()
    return
  }

  if (text.indexOf("新冠") > -1) {
    var XGFY_CONTENT=""
    axios.get("https://cdn.mdeer.com/data/yqstaticdata.js").then(function(result) {
      XGFY_CONTENT = result.data.replace("callbackstaticdata(", "")
      XGFY_CONTENT = XGFY_CONTENT.slice(0, XGFY_CONTENT.length - 1)
      let data = JSON.parse(XGFY_CONTENT)
      let country = data.country
      let source = data.dataSourceUpdateTime
      let provinceArray = data.provinceArray
      let pps = text.split("-")
      if (pps.length == 1) {
        msg.say(
          "截至" + country.time + "\n ==============\n\n" +
          "全国\n" + 
          "-> 共确诊" + country.totalConfirmed +"例\n"+ 
          "-> 境外输入" + country.abroadInputConfirmed +"例\n" +
          "-> 共治愈" + country.totalCured +"例\n" + 
          "-> 当前确诊" + country.currentConfirm +"例\n"  +
          "-> 新增" + country.totalIncrease +"例\n" + 
          "-> 疑似" + country.totalDoubtful +"例\n" + 
          "-> 新增疑似" + country.incDoubtful +"例\n" + 
          "\n\n-------------\n 【数据来源】" + source.dataSource
        )
      }else if (pps.length == 2) {
        try {
          provinceArray.forEach((item, index) => {
            if (item.childStatistic.indexOf(pps[1]) > -1) {
              let obj = item
              throw Error(
                "截至" + country.time + "\n ==============\n\n" + 
                obj.childStatistic + "\n"+ 
                "-> 共确诊" + obj.totalConfirmed +"例\n"+ 
                "-> 共治愈" + obj.totalCured +"例\n" + 
                "-> 当前确诊" + obj.currentConfirm +"例\n"  +
                "-> 新增" + obj.totalIncrease +"例\n" + 
                "-> 疑似" + obj.totalDoubtful +"例\n" + 
                "\n\n-------------\n 【数据来源】" + source.dataSource
              )
            }
          })
        } catch (error) {
          msg.say(error.message)
          return
        }
      } else if (pps.length == 3) {
        try {
          provinceArray.forEach((item, index) => {
            if (item.childStatistic.indexOf(pps[1]) > -1) {
              item.cityArray.forEach((item2, index2) => {
                if (item2.childStatistic.indexOf(pps[2]) > -1) {
                  let obj = item2
                  throw Error(
                    "截至" + country.time + "\n ==============\n\n" + 
                    obj.childStatistic + "\n"+ 
                    "-> 共确诊" + obj.totalConfirmed +"例\n"+ 
                    "-> 共治愈" + obj.totalCured +"例\n" + 
                    "-> 当前确诊" + obj.currentConfirm +"例\n"  +
                    "-> 新增" + obj.totalIncrease +"例\n" + 
                    "-> 疑似" + obj.totalDoubtful +"例\n" + 
                    "\n\n-------------\n 【数据来源】" + source.dataSource
                  )
                }
              })
              
            }
          })
        } catch (error) {
          msg.say(error.message)
          return
        }
      }
    }).catch(error => {
      console.log(error)
    })
    return
  }

  if (text === "菜根谭") {
    msg.say(CGT[randomInt(CGT.length)])
    return
  }

  if (text === "增广贤文") {
    msg.say(ZGXW[randomInt(ZGXW.length)])
    return
  }

  if (text.indexOf("钉钉群") > -1) {
    const img = FileBox.fromFile("g:/mmexport1594806715589.jpg")
    await msg.say(img)
    return
  }

  if (text.indexOf("毒") > -1) {
    axios.get(DJT).then(function(result){
      if (result.data.txt == null) {
        msg.say("压箱底儿的：" + DJT_CONTENT[randomInt(DJT_CONTENT.length)])
        return
      } else {
        msg.say(result.data.txt)
        return
      }
    }).catch(error => {
      console.log(error)
    })
    return
  }
  if(text == "求卦") {
    await msg.say(GUA_HELP)
    return
  }
  if(text.indexOf("求卦-") > -1) {
      let code = text.split("求卦-")[1]
      try {
        ddict.forEach((item,index,array)=>{
          if (item.indexOf(code) > -1 ) {
            let o_name = item.split(code)[0]
            let names = o_name.split("为")
            if (names.length > 1) {
              o_name = names[0]
            }
            if (o_name.length > 2) {
              o_name = o_name.slice(2)
            }
            throw new Error(o_name + "卦")
          }
        }) 
      } catch (error) {
        log.info("找到了" + error.message)
        let resp = "https://baike.baidu.com/item/" + error.message
        const linkPayload = new UrlLink({ description : (" === 友情提示" + msg.from().name() + " === \n看易理，命运自己掌握，我们只需要看清时局！"), 
              thumbnailUrl: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3740483648,506813176&fm=26&gp=0.jpg', 
              title : error.message, 
              url : resp})
        
        log.info(resp)
        await msg.say(linkPayload)
        return
      }
  }

  if (room) {
    if (await msg.mentionSelf()) {
      axios.get(JQR+encodeURIComponent(text)).then(function(result){
        msg.say(result.data.content)
      })
  
      return
    } else {
      const topic = await room.topic()
      if (topic.indexOf("羊毛") > 0) {
        log.info(msg.from().id)
        log.info(msg.room().id)
        log.info(msg.room().owner().id)
        
        if (msg.type() == 7 && text.indexOf('jd') > -1) {
          const a = inner_zl(msg.payload.text)
          log.info('转换后： ' + a)
          this.Contact.find({ name:'Goodbye'}).then(
            y => y.say(a)
          )
          // 遍历订阅列表，如果已经订阅，则发送消息
          subscribes.forEach((value, key) => {
            value.forEach(good => {
              if (a.indexOf(good) > -1) {
                this.Contact.find({name: key}).then(
                  y => y.say(a)
                )
              }
            })
          })
        } else {
          this.Contact.find({ name:'Goodbye'}).then(
            y => y.say(msg)
          )
        }        
        // this.say()
      }else{
        log.info('其他群：', msg.toString())
      }
    }
  } else {
    console.log(msg)
    // axios.get(JQR+encodeURIComponent(text)).then(function(result){
    //   msg.say(result.data.content)
    // })
    
    return
  }
  
  // if (msg.type() == this.Message.Type.Text) {
  //   log.info("获取到一条文本记录")
  // }
  
  
  // const x = this.Contact.find('啊哈，抽抽！')
  // x.then(y => log.info(y.name()))
  
  // log.info('StarterBot', msg.toString())
  // if (msg.from().id == 'wxid_rw505h9zaowi22') {
  //   const room = await this.Room.find({topic: '家'})
  //   room.then(r => room.say('娇羞亲，你说啥 =》', msg.text()))
  // }
}

const WECHATY_PUPPET_PADCHAT_TOKEN = 'xxx'

const puppet = 'wechaty-puppet-padplus'

const puppetOptions = {
  token: WECHATY_PUPPET_PADCHAT_TOKEN,
}

const bot = new Wechaty({
  name: 'ding-dong-bot',
  /**
   * Specify a puppet for a specific protocol (Web/Pad/Mac/Windows, etc).
   *
   * You can use the following providers:
   *  - wechaty-puppet-hostie
   *  - wechaty-puppet-puppeteer
   *  - wechaty-puppet-padplus
   *  - wechaty-puppet-macpro
   *  - etc.
   *
   * Learn more about Wechaty Puppet Providers at:
   *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
   */
  puppet,
  puppetOptions,
  // Set as above, or set using environment variable WECHATY_PUPPET
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))

  // bot.Contact.findAll({name: "啊哈，抽抽！"})
// const contact = bot.Contact.find({name: "啊哈，抽抽！"}) 
// log.info('找到了', contact.name)
