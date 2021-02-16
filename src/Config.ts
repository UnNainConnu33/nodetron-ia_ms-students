import { get } from 'env-var'

const Config = {
  name: get('NAME_SERVICE').default('MSB').asString(),
  logLevel: get('LOGLEVEL').default('info').asEnum([
    'info',
    'fatal',
    'error',
    'warn',
    'debug',
    'trace',
  ]),
  team: {
    name: get('TEAM_NAME').default('NAMeC').asString(),
  },
  manager: {
    name: get('MANAGER_NAME').asString(),
  },
  yellow: get('YELLOW').default('true').asBool(),

}

export default Config
