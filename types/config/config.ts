import config_dev from './config_dev'
import config_publish from './config_publish'
import config_aws from './config_aws'
import config_common from './config_common'
const config = {...config_aws, ...config_common}
export default config