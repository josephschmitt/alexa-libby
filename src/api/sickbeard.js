import SickBeardAPI from 'node-sickbeard';
import serverConfig from '~/api/config.js';

const sickbeard = new SickBeardAPI(serverConfig('shows'));
export default sickbeard;
