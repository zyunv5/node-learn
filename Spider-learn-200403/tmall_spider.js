const urllib = require('url');
const pathlib = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const assert = require('assert');

function requestUrl(url, headers) {
  let urlObj = urllib.parse(url);
  let httpMod = null;
  if (urlObj.protocol == "http:") {
    httpMod = http;
  } else if (urlObj.protocol == "https:") {
    httpMod = https;
  } else {
    throw new Error(`协议无法识别:${urlObj.protocol}`);
  }
  return new Promise((resolve, reject) => {
    let req = httpMod.request({
      host: urlObj.host,
      path: urlObj.path,
      headers
    }, res => {
      if (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode == 304) {
        let arr = [];
        res.on('data', data => {
          arr.push(data);
        })
        res.on('end', () => {
          let buffer = Buffer.concat(arr);

          resolve({
            status: 200,
            body: buffer,
            headers: res.headers
          })
          // fs.writeFile(pathlib.resolve('tmp', 'taobao.html'), buffer, err => {
          //   if (err) {
          //     console.log('写入文件失败');
          //   } else {
          //     console.log('写入文件完成');
          //   }
          // })
        })
      } else if (res.statusCode == 301 || res.statusCode == 302) {
        resolve({
          status: res.statusCode,
          body: null,
          headers: res.headers
        })
      } else {
        reject({
          status: res.statusCode,
          body: null,
          headers: res.headers
        })
      }
    })

    req.on('error', err => {
      console.log(err);
    })

    req.write('');
    req.end();
  })
}

async function request(url, reqHeaders) {
  try {
    while (1) {
      let {
        status,
        body,
        headers
      } = await requestUrl(url);
      console.log(status, url);
      if (status == 200) {
        return {
          body,
          headers
        }
      } else {
        assert(status == 301 || status == 302);
        assert(headers.location);
        url = headers.location
      }
    }
  } catch (e) {
    console.log(e);
  }
}

(async () => {
  let {
    body,
    headers
  } = await request('http://tmall.com/');
  fs.writeFile('tmp/tmall.html', body, err => {
    if (err) {
      console.log(err)
    } else {
      console.log('成功');
    }
  })
})()