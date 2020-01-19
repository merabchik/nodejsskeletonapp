module.exports = {
    mysqlParams(pEnvironment){
        if(pEnvironment == "dev"){
            return {
                host: "127.0.0.1",
                user: "",
                password: "",
                database: ""
            };
        }else if(pEnvironment == "prod"){
            return {
                host: "127.0.0.1",
                user: "",
                password: "",
                database: ""
            };
        }
    },
    appsettings(pEnvironment){
        if(pEnvironment == "dev"){
            return {
                host: "127.0.0.1",
                port: 3001
            };
        }else if(pEnvironment == "prod"){
            return {
                host: "127.0.0.1",
                port: 3001
            };
        }
    }
}