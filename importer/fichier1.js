var fs   = require("fs")
var vm   = require('vm')
let data = vm.runInThisContext(fs.readFileSync(__dirname + "/fichierdata.js"))


