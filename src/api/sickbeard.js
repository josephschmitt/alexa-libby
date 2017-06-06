import SickBeardAPI from 'node-sickbeard';
import serverConfig from '~/api/config.js';

const sickbeard = new SickBeardAPI(serverConfig('shows'));
export default sickbeard;

export async function list() {
  const resp = await sickbeard.cmd('shows', {sort: 'name'});

  return Object.keys(resp.data).map((key) => {
    const show = resp.data[key];

    return {
      title: show.show_name,
      year: show.year,
      tvdbid: show.tvdbid,
      status: show.status.toLowerCase(),
      quality: show.quality
    };
  });
}
