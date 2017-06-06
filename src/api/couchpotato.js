import CouchPotatoAPI from 'couchpotato-api';
import serverConfig from '~/api/config.js';

const couchpotato = new CouchPotatoAPI(serverConfig('movies'));
export default couchpotato;
