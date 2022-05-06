

class File {
  constructor() {

  }
  async addFile (ctx) {
    console.log('new data', ctx.req.file.filename)
    ctx.body = {
      code: 200,
      result: '上传成功',
      type: ctx.req.file.mimetype,
      filename: ctx.req.file.filename,
      url: ctx.req.file.destination.slice(6)+ '/' + ctx.req.file.filename
    }
  }
}

module.exports = new File()