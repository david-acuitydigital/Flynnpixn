var Config = {},
    fs = require("fs"),
    configString;
const configFileParam = "configFile";

//Apply environment variables first
apply(process.env);

//Apply parameters second
process.argv.forEach((val, index, array) => {
    var param = val.split("="),
        obj = {};
    if(param.length === 1){
        obj[param[0]] = true;
    } else if (param.length === 2 ){
        obj[param[0]] = param[1];
    } else if (param.length > 2 ){
        var value = "";
        for(var i=1;i < param.length;i++){
            value += param[i];
            if(i < (param.length - 1)) {
                value += "=";
            }
            obj[param[0]] = value;
        }
    }
    apply(obj);
});

//Apply config value last
try{
    if(!Config.hasOwnProperty(configFileParam) || typeof Config[configFileParam] !== "string" ){
        Config[configFileParam]="app-config.json"
    }

    configString = fs.readFileSync(Config[configFileParam]);
    apply(JSON.parse(configString));
} catch (err){
    console.log("Error loading configuration file from " + Config[configFileParam]);
    console.log(err);
}
function apply(obj){
    for(key in obj){
        Config[key] = obj[key];
    }
}


console.log("Effective configuration:");
console.log(Config);

module.exports = Config;