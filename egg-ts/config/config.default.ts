import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1589947433977_204";

  config.graphql = {
    router: "/graphql",
    app: true,
    agent: false,
    graphiql: true,
    apolloServerOptions: {
      tracing: true,
      debug: true,
    },
  };

  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };

  config.security = {
    csrf: {
      ignore: () => true,
    },
};

  // add your egg config in here
  config.middleware = ["graphql"];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};

exports.sequelize = {
  dialect: 'mysql',  // support: mysql, mariadb, postgres, mssql
  host: '127.0.0.1',
  port: 3306,
  database: 'egg-sequelize-doc-unittest', // /数据库名
};
